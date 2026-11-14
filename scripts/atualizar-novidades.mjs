/**
 * Sincroniza novidades do Hub e títulos inéditos verificados no índice público UpToDate.
 * Roda no GitHub Actions; não usa notícias externas nem cria publicações artificiais.
 * Preferência editorial: commits "novidade(secao): Título | Descrição".
 * Suporte adicional: commits com criação/adição explícita de conteúdo clínico.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const FEED = 'data/hub-novidades.json';
const MAX_ITEMS = 40;
const DEFAULT_BASE = 'ef576679f3308ff666d5605d7c8c1688af3a1aaa';
const SECTIONS = {
  scores: { label: 'Scores', icon: '📋' },
  antihistaminicos: { label: 'Medicamentos', icon: '💊' },
  eaaci: { label: 'Protocolos de bolso', icon: '🩺' },
  laboratorio: { label: 'Laboratório', icon: '🧬' },
  imuno: { label: 'Imunobiológicos', icon: '💉' },
  imunoglobulinas: { label: 'Imunoglobulinas', icon: '🧪' },
  imunizacoes: { label: 'Imunizações', icon: '💉' },
  guidelines: { label: 'Guidelines', icon: '📚' },
  artigos: { label: 'Artigos', icon: '📄' },
  interacao: { label: 'Interações', icon: '🔬' },
  educacao: { label: 'Educação', icon: '🎓' },
  material: { label: 'Materiais', icon: '📂' }
};
const ALIASES = {
  protocolos: 'eaaci', vacinas: 'imunizacoes', biologicos: 'imuno',
  imuno: 'imuno', 'anti-h1': 'antihistaminicos', 'anti-histaminicos': 'antihistaminicos',
  scores: 'scores', laboratorio: 'laboratorio', imunoglobulinas: 'imunoglobulinas',
  imunizacoes: 'imunizacoes', guidelines: 'guidelines', artigos: 'artigos',
  interacoes: 'interacao', educacao: 'educacao', materiais: 'material'
};

function normalize(text) {
  return String(text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export function guessSection(subject) {
  const s = normalize(subject);
  if (/\b(scorad|uct|uas7|act\b|dlqi|snot.?22|pen.?fast|score|escore)\b/.test(s)) return 'scores';
  if (/anti.?histamin|receptor h1|antialergico/.test(s)) return 'antihistaminicos';
  if (/imunoglobulina|privigen|hyqvia|hizentra|sandoglobulina/.test(s)) return 'imunoglobulinas';
  if (/imunobiolog|biologic|dupilumabe|omalizumabe|mepolizumabe|tezepelumabe|xolair|dupixent/.test(s)) return 'imuno';
  if (/vacina|imunizac|calendario vacinal|pneumo.?20|pneumo.?21/.test(s)) return 'imunizacoes';
  if (/reatividade cruzada|componente molecular|laboratorio|ige especifica/.test(s)) return 'laboratorio';
  if (/guideline|diretriz|consenso|recomendac[aã]o/.test(s)) return 'guidelines';
  if (/protocolo de bolso|protocolo clinico|conduta clinica/.test(s)) return 'eaaci';
  if (/interacao medicamentosa/.test(s)) return 'interacao';
  if (/educac[aã]o|material educativo/.test(s)) return 'educacao';
  if (/material clinico|material de apoio/.test(s)) return 'material';
  if (/artigo cientifico|biblioteca de artigos/.test(s)) return 'artigos';
  return null;
}

export function isContentFile(path) {
  return path === 'index.html' ||
    (path.startsWith('data/') && !/^data\/(hub-novidades|radar|alergo-news)/i.test(path)) ||
    /^(antihistaminicos|imunoglobulinas-calculadora|calendarios-imunizacoes|scorad-premium|comparador-reatividade-alimentar|ige-clinica|artigos-premium|eaaci|biologicos|protocolos)[\w-]*\.(js|mjs|json)$/.test(path);
}

export function classifyCommit(subject, changedPaths = []) {
  if (!changedPaths.some(isContentFile)) return null;
  // Uma publicação com metadados explícitos é sempre preferível à inferência.
  const specified = /^novidade\(([\w-]+)\):\s*(.+?)(?:\s+\|\s+(.+))?$/i.exec(subject);
  if (specified) {
    const section = ALIASES[normalize(specified[1])] || normalize(specified[1]);
    if (!SECTIONS[section]) return null;
    const title = specified[2].trim().slice(0, 130);
    const description = (specified[3] || 'Novo conteúdo publicado no Hub do Alergista.').trim().slice(0, 300);
    return title.length >= 8 ? { section, title, description } : null;
  }
  const s = normalize(subject);
  // Excluir correções, identidade visual, notícias externas, infraestrutura e manutenção.
  if (/^(fix|chore|style|test|ci|build|docs|refactor|perf|ui|radar)(\(|:)/.test(s)) return null;
  if (/\b(corrig|ajust|cache|versao|layout|icone|logo|banner|home|grid|grade|responsiv|css|estilo|interface|api|proxy|busca|filtro|navegac|painel|central|login|noticia|jornal|manchete|animac|preload|pwa|refator|bug)\w*/.test(s)) return null;
  if (!/^(?:(?:feat(?:\([^)]+\))?):\s*)?(?:adiciona(?:r)?|inclu(?:ir|i)|cri(?:ar|a)|publica(?:r)?|disponibiliza(?:r)?|lanc(?:ar|a)|nov[oa])\b/.test(s)) return null;
  const section = guessSection(subject);
  if (!section) return null;
  const title = subject
    .replace(/^feat(?:\([^)]+\))?:\s*/i, '')
    .replace(/^(?:adicionar|adiciona|incluir|inclui|criar|cria|publicar|publica|disponibilizar|disponibiliza|lançar|lança)\s+/i, '')
    .replace(/^[a-zà-ÿ]/, c => c.toUpperCase())
    .trim().slice(0, 130);
  if (title.length < 8) return null;
  return {
    section,
    title,
    description: 'Novo conteúdo disponibilizado na seção ' + SECTIONS[section].label + '.'
  };
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }).trim();
}

function localDate(isoDate) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date(isoDate));
}

/**
 * UpToDate é a única fonte externa aceita no sino: somente títulos realmente
 * identificados pela primeira vez na verificação do próprio dia.
 * Uma consulta sem alterações jamais gera uma novidade.
 */
export function newUpToDateItems(radar, checkedAt) {
  if (!radar || radar.checkedAt !== checkedAt || !Array.isArray(radar.items) ||
      !/^https:\/\/(?:ff\.|www\.)?uptodate\.com\/contents\/whats-new-in-allergy-and-immunology/.test(radar.source || '')) return [];
  const visited = new Set();
  return radar.items.flatMap(entry => {
    if (!entry || entry.firstSeenAt !== checkedAt || typeof entry.title !== 'string') return [];
    const original = entry.title.trim();
    const title = String(entry.titlePt || original).trim().slice(0, 130);
    if (original.length < 12 || title.length < 8) return [];
    const key = original.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ');
    if (visited.has(key)) return [];
    visited.add(key);
    const hash = createHash('sha1').update(key).digest('hex').slice(0, 12);
    const topic = typeof entry.topic === 'string' && entry.topic.length < 80 ? entry.topic : 'Alergia e Imunologia';
    return [{
      id: checkedAt + '-uptodate-' + hash,
      date: checkedAt,
      category: 'UpToDate',
      icon: 'U',
      title,
      description: ('Novo título identificado no índice público do UpToDate (' + topic +
        '). Confira a fonte original antes de alterar condutas clínicas.').slice(0, 300),
      section: 'artigos',
      source: 'uptodate'
    }];
  });
}

export function updateFeed(feed, commits, head, checkedAt, radar = null) {
  const existing = new Set(feed.items.map(item => item.id));
  const added = [];
  for (const commit of commits) {
    const content = classifyCommit(commit.subject, commit.files);
    if (!content) continue;
    const date = localDate(commit.date);
    const id = date + '-' + content.section + '-' + commit.sha.slice(0, 12);
    if (existing.has(id)) continue;
    existing.add(id);
    added.push({
      id, date, category: SECTIONS[content.section].label,
      icon: SECTIONS[content.section].icon, title: content.title,
      description: content.description, section: content.section
    });
  }
  for (const item of newUpToDateItems(radar, checkedAt)) {
    if (existing.has(item.id)) continue;
    existing.add(item.id);
    added.push(item);
  }
  const items = [...added, ...feed.items]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, MAX_ITEMS);
  const publishedAt = added.length ? added.map(item => item.date).sort().at(-1) : feed.updatedAt;
  return {
    ...feed, version: 1, updatedAt: publishedAt,
    checkedAt, lastScannedCommit: head, items
  };
}

function main() {
  const feed = JSON.parse(readFileSync(FEED, 'utf8'));
  if (!Array.isArray(feed.items)) throw new Error('Feed de novidades inválido');
  const head = git('rev-parse', 'HEAD');
  let base = feed.lastScannedCommit || DEFAULT_BASE;
  try {
    git('merge-base', '--is-ancestor', base, head);
  } catch {
    // Não publicar novidades antigas se o histórico foi reescrito.
    base = head;
  }
  const hashes = base === head ? [] : git('rev-list', '--reverse', base + '..' + head).split('\n').filter(Boolean);
  const commits = hashes.map(sha => ({
    sha,
    subject: git('show', '-s', '--format=%s', sha),
    date: git('show', '-s', '--format=%cI', sha),
    files: git('diff-tree', '--no-commit-id', '--name-only', '-r', sha).split('\n').filter(Boolean)
  }));
  const checkedAt = localDate(new Date().toISOString());
  const radar = JSON.parse(readFileSync('data/uptodate.json', 'utf8'));
  const updated = updateFeed(feed, commits, head, checkedAt, radar);
  if (JSON.stringify(feed) !== JSON.stringify(updated)) {
    writeFileSync(FEED, JSON.stringify(updated, null, 2) + '\n');
  }
  console.log('Novidades: ' + (updated.items.length - feed.items.length) + ' acréscimos líquidos; ' + commits.length + ' commits verificados em ' + checkedAt + '.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
