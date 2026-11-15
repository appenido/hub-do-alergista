import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import vm from 'node:vm';

const runFile = promisify(execFile);
const root = new URL('../', import.meta.url);

function doseFingerprint(body, key) {
  if (body.subarray(0, 5).toString() === '%PDF-') {
    return createHash('sha256').update(body).digest('hex');
  }
  if (key === 'ebastel') {
    // A Eurofarma fornece esta bula em HTML. Ignorar o cabeçalho e a paginação.
    const text = body.toString('utf8').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ').replace(/\s+/g, ' ');
    const section = text.match(/8\.\s*POSOLOGIA\s*E\s*MODO\s*DE\s*USAR.*?(?=9\.\s*REAÇÕES\s*ADVERSAS)/iu)?.[0];
    if (section) return createHash('sha256').update(section).digest('hex');
  }
  throw new Error('Documento de bula não reconhecido');
}

export async function auditarFontesDose() {
  const [script, baselineText] = await Promise.all([
    readFile(new URL('medicamentos-dose-regras.js', root), 'utf8'),
    readFile(new URL('data/medicamentos-dose-fontes.json', root), 'utf8')
  ]);
  const baseline = JSON.parse(baselineText);
  const scope = { window: {} };
  vm.runInNewContext(script, scope, { timeout: 1000 });
  const { sources, products } = scope.window.HubDoseRules;
  const entries = Object.entries(sources);
  const results = [];

  async function check([key, url]) {
    const names = [...new Set(Object.values(products)
      .filter(product => product.source === key || product.bands.some(row => row.guidance === key))
      .map(product => product.brand))];
    const entry = { key, url, name: names.join(' / ') };
    try {
      const { stdout } = await runFile('curl', [
        '--fail', '--silent', '--show-error', '--location', '--proto', '=https', '--proto-redir', '=https',
        '--max-time', '20', '--max-filesize', '8388608', url
      ], { encoding: 'buffer', maxBuffer: 8388608, timeout: 24000 });
      const digest = doseFingerprint(stdout, key);
      return { ...entry, digest, status: baseline[key] == null ? 'sem linha de base' : digest === baseline[key] ? 'inalterada' : 'documento alterado' };
    } catch {
      return { ...entry, status: 'fonte indisponível para conferência' };
    }
  }

  for (let i = 0; i < entries.length; i += 4) {
    results.push(...await Promise.all(entries.slice(i, i + 4).map(check)));
  }
  return results;
}
