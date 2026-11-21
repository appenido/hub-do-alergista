// Uma publicação é identificada pelo PMID; título, DOI e data vêm do mesmo registro.
export const SCHEMA = 5;
export const JOURNALS = [
  'J Allergy Clin Immunol', 'J Allergy Clin Immunol Pract', 'Allergy',
  'Clin Exp Allergy', 'Pediatr Allergy Immunol', 'Ann Allergy Asthma Immunol',
  'World Allergy Organ J', 'Allergy Asthma Clin Immunol', 'J Clin Immunol', 'J Allergy Clin Immunol Glob',
  'Allergy Asthma Proc', 'Am J Respir Crit Care Med', 'Eur Respir J',
  'Am J Gastroenterol', 'Braz J Otorhinolaryngol', 'J Hum Immun', 'Am J Hematol'
];
const TOPICS = {
  asma: ['asthma', 'asthmatic', 'bronchopulmonary aspergillosis', 'airway diseases'],
  da: ['atopic dermatitis', 'atopic eczema', 'eczema', 'contact dermatitis'],
  urticaria: ['urticaria'],
  aeh: ['hereditary angioedema', 'hereditary angio-oedema', 'c1 inhibitor deficiency'],
  anafilaxia: ['anaphylaxis', 'anaphylactic', 'epinephrine autoinjector', 'adrenaline autoinjector'],
  himen: ['hymenoptera', 'venom allergy', 'venom immunotherapy', 'insect sting', 'bee sting', 'wasp sting'],
  rinite: ['rhinitis', 'rhinosinusitis', 'nasal polyps', 'nasal polyp', 'airway diseases'],
  aa: ['food allergy', 'food allergies', 'food hypersensitivity', 'food-allergic', 'peanut allergy', 'milk allergy', 'egg allergy', 'tree nut allergy', 'oral immunotherapy', 'pollen-food'],
  eii: ['immunodeficiency', 'immunodeficiencies', 'inborn errors of immunity', 'hypogammaglobulinemia', 'agammaglobulinemia', 'immunoglobulin replacement'],
  medicam: ['drug allergy', 'drug hypersensitivity', 'drug provocation', 'drug desensitization', 'drug skin', 'penicillin allergy', 'beta-lactam allergy', 'antibiotic allergy', 'nsaid hypersensitivity', 'aspirin hypersensitivity', 'perioperative hypersensitivity', 'delabeling', 'delabelling'],
  masto: ['mastocytosis', 'mast cell activation', 'mast-cell activation'],
  eoe: ['eosinophilic esophagitis', 'eosinophilic oesophagitis', 'eosinophilic gastrointestinal']
};
export const TOPIC_IDS = Object.keys(TOPICS);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function topicsFor(title) {
  const t = String(title || '').toLowerCase().replace(/[-–]/g, ' ');
  return TOPIC_IDS.filter(key => TOPICS[key].some(term =>
    new RegExp('\\b' + esc(term.replace(/[-–]/g, ' ')) + '\\b', 'i').test(t)));
}
export function documentKind(title, types = []) {
  const t = String(title).toLowerCase();
  // Revisar diretrizes não transforma uma revisão em diretriz.
  if (/systematic review|meta.analysis/.test(t) || types.includes('Meta-Analysis')) return 'Revisão sistemática / metanálise';
  if (/consensus/.test(t) || types.includes('Consensus Statement')) return 'Consenso';
  if (/statement|position paper/.test(t)) return 'Posicionamento';
  if (/practice parameters?/.test(t) && types.includes('Review') && !types.includes('Practice Guideline')) return 'Revisão do parâmetro de prática';
  if (/practice parameters?/.test(t)) return 'Parâmetro de prática';
  if (/guidelines?/.test(t) || types.some(x => /^(Practice )?Guideline$/i.test(x))) return 'Diretriz';
  if (/algorithm/.test(t)) return 'Algoritmo clínico';
  if (/task force|work group/.test(t)) return 'Relatório de grupo de trabalho';
  if (/recommendations?/.test(t)) return 'Recomendações';
  if (types.includes('Review')) return 'Revisão';
  if (types.includes('Editorial')) return 'Editorial';
  return 'Artigo de orientação clínica';
}

// Apenas diretrizes clínicas oficiais ou parâmetros de prática com função equivalente.
// A menção à palavra "guideline" em um artigo não o transforma em diretriz.
export function isOfficialClinicalGuideline(title, types = []) {
  const t = String(title || '').trim();
  if (!t) return false;
  const p = (Array.isArray(types) ? types : []).map(x => String(x).trim());
  if (/\b(?:systematic review|scoping review|umbrella review|meta.analysis|narrative review|literature review|executive summary|summary of (?:the )?guidelines?|expert opinion)\b/i.test(t)) return false;
  if (/\b(?:review of|analysis of|evaluation of|comparison of|comparing|adherence to|compliance with|implementation of|uptake of|knowledge of|attitudes toward|impact of|quality of|appraisal of|critique of)\b.{0,80}\b(?:guidelines?|practice parameters?)\b/i.test(t)) return false;
  if (/\b(?:guidelines?|practice parameters?)\b.{0,30}\b(?:adherence|compliance|implementation|impact|uptake|quality|evaluation|appraisal)\b/i.test(t)) return false;
  if (p.some(x => /^(?:Practice )?Guideline$/i.test(x))) return true;
  if (p.some(x => /^(?:Review|Systematic Review|Meta-Analysis|Clinical Trial|Randomized Controlled Trial|Case Reports|Editorial|Letter|Comment|Observational Study|Evaluation Study)$/i.test(x))) return false;
  const explicit = /\b(?:guidelines?|practice parameters?)\b/i.test(t);
  const official = /\b(?:EAACI|AAAAI|ACAAI|WAO|ARIA|GINA|ACG|ESCD|BSACI|ERS|ATS|ESPGHAN|IUIS|ASBAI|GA2LEN|EuroGuiDerm|World Allergy Organization|Joint Task Force|American Academy|American College|European Academy|international guideline|clinical practice guideline|practice parameter update)\b/i.test(t);
  return explicit && official;
}

export function searchQuery(topic = 'all') {
  const terms = topic === 'all' ? [...new Set(Object.values(TOPICS).flat())] : TOPICS[topic];
  if (!terms) throw new Error('Tema inválido');
  const disease = '(' + terms.map(t => '"' + t + '"[ti]').join(' OR ') + ')';
  const journals = '(' + JOURNALS.map(t => '"' + t + '"[jour]').join(' OR ') + ')';
  // Busca restrita a diretrizes; a elegibilidade ainda é validada em cada PMID.
  const orientation = '(guideline[pt] OR "practice guideline"[pt] OR guidelines[ti] OR guideline[ti] OR "practice parameter"[ti] OR "practice parameters"[ti])';
  return disease + ' AND ' + journals + ' AND ' + orientation + ' NOT (published erratum[pt] OR retracted publication[pt] OR retraction of publication[pt] OR editorial[pt] OR letter[pt])';
}
const MONTHS = {jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
export function parsePublicationDate(value) {
  const s = String(value || '').trim();
  let m = s.match(/^(\d{4})[/-](\d{2})(?:[/-](\d{2}))?/);
  if (m) return m[1] + '-' + m[2] + (m[3] ? '-' + m[3] : '');
  m = s.match(/^(\d{4})\s+([A-Za-z]{3})(?:\s+(\d{1,2})(?:\D|$))?/);
  if (m && MONTHS[m[2].toLowerCase()]) return m[1] + '-' + MONTHS[m[2].toLowerCase()] + (m[3] ? '-' + m[3].padStart(2,'0') : '');
  m = s.match(/^(\d{4})$/);
  return m ? m[1] : '';
}
export function publishedDate(record, today) {
  // Uma edição futura não elimina um artigo já publicado on-line.
  const dates = [record.epubdate, record.pubdate, record.sortpubdate].map(parsePublicationDate)
    .filter(d => d && d <= today).sort();
  return dates[0] || '';
}
export function normalizeRecord(record, expectedId, today) {
  const pmid = String(expectedId || '');
  if (!/^[1-9]\d{0,8}$/.test(pmid) || String(record?.uid) !== pmid) return null;
  const title = String(record.title || '').trim();
  const journal = String(record.source || '').trim();
  if (!title || !JOURNALS.some(j => j.toLowerCase() === journal.toLowerCase())) return null;
  const articleids = Array.isArray(record.articleids) ? record.articleids : [];
  const pubmed = articleids.find(i => i.idtype === 'pubmed');
  if (pubmed && String(pubmed.value) !== pmid) return null;
  const topics = topicsFor(title);
  const date = publishedDate(record, today);
  if (!topics.length || !date || (record.pubtype || []).some(t => /erratum|retract/i.test(t)) || !isOfficialClinicalGuideline(title, record.pubtype || [])) return null;
  const doi = String(articleids.find(i => i.idtype === 'doi')?.value || '').trim();
  const pmcid = String(articleids.find(i => i.idtype === 'pmc')?.value || '').trim();
  return {
    pmid, title, journal, date, year: parsePublicationDate(record.pubdate).slice(0,4) || date.slice(0,4),
    topics, kind: 'Diretriz clínica',
    doi: /^10\.\d{4,9}\/\S+$/i.test(doi) ? doi : '',
    pmcid: /^PMC\d+$/.test(pmcid) ? pmcid : '',
    url: 'https://pubmed.ncbi.nlm.nih.gov/' + pmid + '/'
  };
}
