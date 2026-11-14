#!/usr/bin/env python3
"""Atualiza somente metadados públicos do índice What's New do UpToDate.
Não armazena texto de capítulos protegidos nem dados de pacientes.
Falhas de rede/parsing preservam o JSON anteriormente publicado.
"""
from __future__ import annotations

import datetime as dt
import html
from html.parser import HTMLParser
import json
import os
from pathlib import Path
import re
import sys
import tempfile
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "uptodate.json"
SOURCES = (
    "https://ff.uptodate.com/contents/whats-new-in-allergy-and-immunology",
    "https://www.uptodate.com/contents/whats-new-in-allergy-and-immunology/print",
)
MONTHS = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5,
    "June": 6, "July": 7, "August": 8, "September": 9, "October": 10,
    "November": 11, "December": 12,
}
PATTERN = re.compile(
    r"^(.{12,180}?)\s*\((" + "|".join(MONTHS) +
    r")\s+(\d{4})(?:,\s*Modified\s+(" + "|".join(MONTHS) +
    r")\s+(\d{4}))?\)$"
)
SECTION_TOPICS = {
    "ASTHMA AND COPD": "Asma",
    "DRUG HYPERSENSITIVITY": "Alergia a medicamentos",
    "FOOD ALLERGY AND INTOLERANCE": "Alergia alimentar",
    "IMMUNODEFICIENCY": "Imunodeficiências",
    "URTICARIA AND ANGIOEDEMA": "Urticária e angioedema",
    "OTHER GENERAL ALLERGY AND IMMUNOLOGY": "Alergia e imunologia",
}


class VisibleText(HTMLParser):
    """Coleta texto visível, sem JavaScript, CSS ou comentários."""
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.fragments = []
        self.ignored = 0

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "noscript", "svg"):
            self.ignored += 1
        if not self.ignored and tag in ("p", "li", "br", "h1", "h2", "h3", "h4", "tr", "section", "div"):
            self.fragments.append("\n")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript", "svg"):
            self.ignored = max(0, self.ignored - 1)
        if not self.ignored and tag in ("p", "li", "h1", "h2", "h3", "h4", "tr", "section", "div"):
            self.fragments.append("\n")

    def handle_data(self, data):
        if not self.ignored:
            self.fragments.append(data)


def parse_page(markup):
    parser = VisibleText()
    parser.feed(markup)
    raw = html.unescape("".join(parser.fragments))
    lines = [re.sub(r"\s+", " ", x).strip() for x in raw.splitlines()]
    lines = [x for x in lines if x]
    if not any("allergy and immunology" in x.lower() for x in lines[:60]):
        raise ValueError("O documento não parece ser o índice oficial de Alergia e Imunologia")

    entries = []
    seen = set()
    section = "Alergia e imunologia"

    for i, line in enumerate(lines):
        if line.upper() in SECTION_TOPICS:
            section = SECTION_TOPICS[line.upper()]
            continue

        # Alguns templates separam o título e seu mês em nós distintos.
        variants = [line]
        if i + 1 < len(lines) and len(line) <= 165 and len(lines[i + 1]) <= 50:
            variants.append(line + " " + lines[i + 1])

        for candidate in variants:
            match = PATTERN.match(candidate)
            if not match:
                continue
            title, month, year, modified_month, modified_year = match.groups()
            title = title.strip("• \t-–")
            if title.lower().startswith(("literature review", "this topic")):
                continue
            effective_year = int(modified_year or year)
            effective_month = MONTHS[modified_month or month]
            if effective_year < dt.date.today().year - 2 or effective_year > dt.date.today().year + 1:
                continue
            key = re.sub(r"\W+", "", title.lower())
            if key in seen:
                continue
            seen.add(key)
            entries.append({
                "title": title,
                "month": f"{effective_year}-{effective_month:02d}",
                "topic": section,
            })
            break

    if len(entries) < 5:
        raise ValueError(f"Extração incompleta: apenas {len(entries)} títulos detectados")

    joined = " ".join(lines)
    match = re.search(
        r"This topic last updated:\s*([A-Za-z]{3,9}\s+\d{1,2},\s*\d{4})", joined, re.I
    )
    source_updated = None
    if match:
        try:
            source_updated = dt.datetime.strptime(match.group(1), "%b %d, %Y").date().isoformat()
        except ValueError:
            try:
                source_updated = dt.datetime.strptime(match.group(1), "%B %d, %Y").date().isoformat()
            except ValueError:
                pass
    entries.sort(key=lambda it: it["month"], reverse=True)
    return entries[:20], source_updated


def download():
    errors = []
    for url in SOURCES:
        req = urllib.request.Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; HubAlergista-WhatsNew/1.0; public-headlines-only)",
                "Accept": "text/html,application/xhtml+xml",
                "Accept-Language": "en-US,en;q=0.9",
            },
        )
        try:
            with urllib.request.urlopen(req, timeout=25) as response:
                data = response.read(3_000_000)
                encoding = response.headers.get_content_charset() or "utf-8"
                text = data.decode(encoding, errors="replace")
                titles, date = parse_page(text)
                return titles, date
        except (urllib.error.URLError, TimeoutError, UnicodeError, ValueError) as exc:
            errors.append(f"{url}: {exc}")
    raise RuntimeError("Nenhuma fonte pública disponível. " + " | ".join(errors))


def main():
    if "--self-test" in sys.argv:
        sample = "<h1>What's new in allergy and immunology</h1><h2>ASTHMA AND COPD</h2>"
        sample += "".join(f"<li>Item clínico de teste número {i} (October 2026)</li>" for i in range(1, 6))
        rows, _ = parse_page(sample)
        assert len(rows) == 5 and rows[0]["topic"] == "Asma"
        print("Teste do extrator: OK")
        return

    prior = json.loads(OUTPUT.read_text(encoding="utf-8"))
    previous_by_title = {
        re.sub(r"\W+", "", str(x.get("title", "")).lower()): x
        for x in prior.get("items", [])
    }
    extracted, source_date = download()
    checked_at = dt.datetime.now(dt.timezone.utc).date().isoformat()
    # Uma checagem nova não deve notificar títulos antigos como se fossem lançamentos.
    old_checked_at = prior.get("checkedAt") or prior.get("sourceUpdatedAt") or "1970-01-01"
    new_items = []
    for entry in extracted:
        key = re.sub(r"\W+", "", entry["title"].lower())
        old = previous_by_title.get(key, {})
        entry["topic"] = old.get("topic") or entry["topic"]
        entry["firstSeenAt"] = old.get("firstSeenAt") or (old_checked_at if old else checked_at)
        if old.get("titlePt"):
            entry["titlePt"] = old["titlePt"]
        if old.get("summary"):
            entry["summary"] = old["summary"]
        new_items.append(entry)

    result = {
        "source": SOURCES[0],
        "sourceUpdatedAt": source_date or prior.get("sourceUpdatedAt"),
        "checkedAt": checked_at,
        "items": new_items,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_path = tempfile.mkstemp(prefix=".uptodate-", suffix=".json", dir=OUTPUT.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as out:
            json.dump(result, out, ensure_ascii=False, indent=2)
            out.write("\n")
        os.replace(tmp_path, OUTPUT)
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
    print(f"Verificação concluída: {len(new_items)} atualizações públicas; "
          f"edição {result['sourceUpdatedAt']}; checagem {result['checkedAt']}")


if __name__ == "__main__":
    main()
