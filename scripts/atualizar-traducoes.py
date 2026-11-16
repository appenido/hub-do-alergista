"""Gera traduções locais de conteúdo público. Uso diário: python scripts/atualizar-traducoes.py."""
import argparse
import json
import os
import re
from pathlib import Path
from urllib.request import urlretrieve

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
LOCALES = ("en", "es")
MODEL = "https://huggingface.co/jncraton/m2m100_418M-ct2-int8/resolve/7c1b2620a4e58dacecbd8bf89cfd6da7eb9eb7b0"
MODEL_FILES = ("config.json", "model.bin", "shared_vocabulary.json", "sentencepiece.bpe.model")
FEEDS = (
    DATA / "hub-novidades.json", DATA / "uptodate.json",
    ROOT / "jornal" / "radar.json", ROOT / "jornal" / "edicao.json",
)
EDITORIAL = {
    "title", "titulo", "description", "descricao", "summary", "resumo", "category",
    "categoria", "area", "etiqueta", "badge", "especialidade", "manchete", "editorial",
    "afirmacao", "o_que_diz", "o_que_a_ciencia_mostra", "checkMessage",
}
# Preserve literal quantities, units, inequalities, links and publication identifiers.
NUMBER = r"\d+(?:[.,:/–−-]\d+)*"
UNITS = r"(?:mL|L|mg|mcg|[µμ]g|g|kg|kU|IU|UI|U|[µμ]L|cm|mm|min|h)"
PROTECTED = re.compile(
    rf"https?://[^\s<>\"”]+|\b10\.\d{{4,9}}/[^\s<>\"”]+"
    rf"|(?:[<>≤≥≈=±+−-]\s*)?{NUMBER}"
    rf"(?:\s*(?:%|{UNITS}(?:/(?:{UNITS}|dose)){{0,3}}\b|/[µμ]L\b))?"
    r"|(?<!\w)(?:IM|IV|SC|VO|IgE|IgG|FeNO|GINA|WAO|EAACI|AAAAI|ASBAI|ANVISA|Anvisa|ANS|SBIm|SUS|PNI|CONITEC|Conitec|CRIE|PMID|DOI|UpToDate)(?!\w)"
    r"|Hub do Alergista|Alergo News|Mabs, i-JAK, iBTK"
    r"|[⁰¹²³⁴⁵⁶⁷⁸⁹½¼¾·|˜~≈±≤≥µμ×°®™]"
)
SENTENCES = re.compile(r"(;\s+|(?<=[.!?])\s+(?=[A-ZÀ-Ý¿¡]))")
RESTRICTED = re.compile(r"<\/?(?:script|style|iframe|svg|div|span)\b", re.I)
DIMENSIONS = re.compile(r"\b(?:medicação|mg|dose|mcg|infusão|vacina|corticoide|terapia|asma|anas?filaxia)\b", re.I)
FORBIDDEN = {
    "en": re.compile(r"\b(?:não|nunca|evite)\b", re.I),
    "es": re.compile(r"\b(?:não|evite utilizará)\b", re.I),
}
NEGATION = re.compile(r"\b(?:não|nunca|jamais|contraindica\w*|evitar?|evite|suspender?)\b", re.I)
NEGATION_TARGET = {
    "en": re.compile(r"\b(?:no|not|never|avoid\w*|contraindica\w*|stop\w*|withhold\w*|discontinu\w*|prevent\w*|cannot|without)\b|n’t|n't", re.I),
    "es": re.compile(r"\b(?:no|nunca|jamás|evit\w*|contraindic\w*|suspende?\w*|interrump\w*|sin)\b", re.I),
}


def norm(value):
    return " ".join(value.split())


def editorial_text(node):
    if isinstance(node, list):
        for item in node:
            yield from editorial_text(item)
    elif isinstance(node, dict):
        for key, content in node.items():
            if key in EDITORIAL and isinstance(content, str):
                yield norm(content)
            elif isinstance(content, (list, dict)):
                yield from editorial_text(content)


def read_json(path):
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def write_json(path, value):
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    temporary.replace(path)


def separate(value):
    parts = SENTENCES.split(value)
    for i in range(1, len(parts) - 1, 2):
        if parts[i - 1] and parts[i - 1].endswith(("Dr.", "Dra.", "Prof.", "vs.", "ex.", "aprox.", "art.", "vol.")):
            parts[i + 1] = parts[i - 1] + parts[i] + parts[i + 1]
            parts[i - 1] = parts[i] = ""
    return [part for part in parts if part]


def protect(text):
    parts = []

    def hold(match):
        parts.append(match.group())
        return str(172801 + len(parts))

    return PROTECTED.sub(hold, text), parts


def restore(text, parts):
    if re.findall(r"(?<!\d)172\d{3}(?!\d)", text) != [str(172802 + i) for i in range(len(parts))]:
        return None
    return re.sub(r"(?<!\d)172\d{3}(?!\d)", lambda match: parts[int(match.group()) - 172802], text)


def validated(source, translation, language):
    if not translation or any(marker in translation for marker in ("⁇", "�", "<unk>")):
        return False
    if RESTRICTED.search(translation) or FORBIDDEN[language].search(translation):
        return False
    if not 0.52 <= len(translation) / len(source) <= 2.6:
        return False
    if PROTECTED.findall(source) != PROTECTED.findall(translation):
        return False
    if DIMENSIONS.search(source) and NEGATION.search(source) and not NEGATION_TARGET[language].search(translation):
        return False
    return True


class Translator:
    def __init__(self, model_path):
        import ctranslate2
        import sentencepiece

        model_path.mkdir(parents=True, exist_ok=True)
        for name in MODEL_FILES:
            path = model_path / name
            if not path.is_file():
                print(f"Preparando modelo local: {name}", flush=True)
                temporary = path.with_suffix(".download")
                urlretrieve(f"{MODEL}/{name}?download=true", temporary)
                temporary.replace(path)
        self.tokenizer = sentencepiece.SentencePieceProcessor(model_file=str(model_path / MODEL_FILES[-1]))
        workers = max(1, min(3, (os.cpu_count() or 2) // 2))
        threads = max(1, min(3, (os.cpu_count() or 2) // workers))
        self.model = ctranslate2.Translator(str(model_path), device="cpu", compute_type="int8",
                                           inter_threads=workers, intra_threads=threads)

    def batch(self, texts, language, beam_size=1):
        encoded = [["__pt__", *self.tokenizer.encode(text, out_type=str), "</s>"] for text in texts]
        results = self.model.translate_batch(
            encoded, target_prefix=[[f"__{language}__"]] * len(texts),
            max_batch_size=36, beam_size=beam_size, repetition_penalty=1.1,
            max_decoding_length=220,
        )
        return [self.tokenizer.decode(result.hypotheses[0][1:]) for result in results]


def add_translations(catalog, sources, translator, language):
    groups = {text: separate(text) for text in sources}
    parts = sorted({part for group in groups.values() for part in group
                    if re.search(r"[A-Za-zÀ-ÿ]{2}", part) and not part.startswith(";")},
                   key=lambda part: (len(part), part))
    eligible = set(parts)
    translated_parts = {}
    for start in range(0, len(parts), 432):
        items = parts[start:start + 432]
        pairs = [protect(part) for part in items]
        encoded = [text for text, _ in pairs]
        results = translator.batch(encoded, language)
        for source, (_, protected), result in zip(items, pairs, results):
            restored = restore(result.strip(), protected)
            if validated(source, restored, language):
                translated_parts[source] = restored
        print(f"{language}: {min(start + len(items), len(parts))}/{len(parts)}", flush=True)
    missing = []
    for source, group in groups.items():
        missing_parts = [part for part in group if part in eligible and part not in translated_parts]
        result = "".join(translated_parts.get(part, part) for part in group)
        if missing_parts or not validated(source, result, language):
            missing.append(source)
        else:
            catalog[source] = result
    return missing


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument("--inventory", type=Path, help="Lista JSON adicional de textos públicos em português")
    args.add_argument("--model-path", type=Path, default=Path.home() / ".cache" / "hub-i18n-m2m")
    args.add_argument("--locale", choices=LOCALES, action="append")
    args.add_argument("--report", type=Path, help="Lista de traduções rejeitadas pelos controles")
    settings = args.parse_args()
    sources = {text for path in FEEDS for text in editorial_text(read_json(path)) if text}
    if settings.inventory:
        sources.update(norm(text) for text in read_json(settings.inventory))
    translator = None
    rejected = {}
    for language in settings.locale or LOCALES:
        path = DATA / f"hub-i18n-{language}.json"
        catalog = read_json(path) if path.is_file() else {}
        pending = sorted(sources.difference(catalog))
        if not pending:
            continue
        if translator is None:
            translator = Translator(settings.model_path)
        rejected[language] = add_translations(catalog, pending, translator, language)
        write_json(path, catalog)
        print(f"{language}: {len(pending) - len(rejected[language])} novas, {len(rejected[language])} para verificar", flush=True)
    if settings.report:
        write_json(settings.report, rejected)


if __name__ == "__main__":
    main()
