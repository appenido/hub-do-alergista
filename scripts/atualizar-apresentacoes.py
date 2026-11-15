"""Prepara a busca local de medicamentos a partir da lista pública da CMED."""

import csv
import io
import json
import re
import subprocess
from collections import defaultdict
from email.utils import parsedate_to_datetime
from pathlib import Path
from tempfile import TemporaryDirectory


SOURCE = 'https://dados.anvisa.gov.br/dados/TA_PRECO_MEDICAMENTO.csv'
TARGET = Path(__file__).resolve().parent.parent / 'data' / 'medicamentos-apresentacoes.json'
MAX_BYTES = 32 * 1024 * 1024


def catalog_from_csv(body):
    reader = csv.DictReader(io.StringIO(body.decode('utf-8-sig')), delimiter=';')
    columns = {'SUBSTÂNCIA', 'PRODUTO', 'APRESENTAÇÃO'}
    if not columns.issubset(reader.fieldnames or []):
        raise ValueError('Colunas de apresentações da CMED não encontradas')

    catalog = defaultdict(set)
    for row in reader:
        name = ' '.join((row['PRODUTO'] or '').split())
        active = ' + '.join(part.strip() for part in (row['SUBSTÂNCIA'] or '').split(';') if part.strip())
        package = ' '.join((row['APRESENTAÇÃO'] or '').split())
        presentation = re.split(r'\s(?:CT|CX|ENV)\s', package, maxsplit=1)[0]
        if 'SOL OR' in presentation and re.search(r'\bGOT\b', package):
            presentation += ' GOTAS'
        if active and name and presentation:
            catalog[active, name].add(presentation)

    if len(catalog) < 1000:
        raise ValueError('Lista de apresentações da CMED incompleta')
    return [[active, name, sorted(forms)] for (active, name), forms in sorted(catalog.items())]


def update():
    with TemporaryDirectory() as temp:
        headers = Path(temp) / 'headers'
        csv_file = Path(temp) / 'cmed.csv'
        subprocess.run([
            'curl', '--fail', '--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https',
            '--max-time', '40', '--retry', '2', '--retry-delay', '3', '--retry-max-time', '60',
            '--max-filesize', str(MAX_BYTES), '--dump-header', str(headers),
            '--output', str(csv_file), SOURCE,
        ], check=True)
        dates = [line.split(':', 1)[1].strip() for line in headers.read_text(encoding='latin-1').splitlines()
                 if line.lower().startswith('last-modified:')]
        if not dates:
            raise ValueError('Data da versão da CMED não encontrada')
        modified = parsedate_to_datetime(dates[-1]).date().isoformat()
        body = csv_file.read_bytes()
    publish(body, modified)


def publish(body, modified):
    if TARGET.exists() and modified < json.loads(TARGET.read_text(encoding='utf-8'))['date']:
        raise ValueError('A fonte retornou uma versão anterior à publicada')
    items = catalog_from_csv(body)
    data = json.dumps({'date': modified, 'items': items}, ensure_ascii=False, separators=(',', ':')) + '\n'
    temporary = TARGET.with_suffix('.tmp')
    temporary.write_text(data, encoding='utf-8')
    temporary.replace(TARGET)
    print(f'CMED {modified}: {len(items)} combinações de substância e produto.')


if __name__ == '__main__':
    update()
