// Busca temática de artigos PubMed — regras puras reutilizadas na função e nos testes.
export const ARTICLE_SCHEMA = 1;
export const ARTICLE_TOPICS = {
  todos: { label: 'Todos', terms: [] },
  asma: { label: 'Asma', terms: ['asthma','asthmatic','bronchopulmonary aspergillosis'] },
  da: { label: 'Dermatite atópica', terms: ['atopic dermatitis','atopic eczema'] },
  dc: { label: 'Dermatite de contato', terms: ['contact dermatitis','contact allergy','patch testing','patch test'] },
  urticaria: { label: 'Urticária', terms: ['urticaria','urticarial'] },
  angioedema: { label: 'Angioedema', terms: ['angioedema','c1 inhibitor deficiency'] },
  anafilaxia: { label: 'Anafilaxia', terms: ['anaphylaxis','anaphylactic','epinephrine autoinjector','adrenaline autoinjector'] },
  himen: { label: 'Himenópteros', terms: ['hymenoptera','venom immunotherapy','venom allergy','insect sting','bee sting','wasp sting','fire ant allergy'] },
  rinite: { label: 'Rinite', terms: ['allergic rhinitis','rhinitis','rhinoconjunctivitis'] },
  rsc: { label: 'Rinossinusite', terms: ['rhinosinusitis','nasal polyps','nasal polyp'] },
  aa: { label: 'Alergia alimentar', terms: ['food allergy','food allergies','food allergic','food hypersensitivity','peanut allergy','milk allergy','egg allergy','tree nut allergy','oral food challenge','oral immunotherapy','food desensitization'] },
  eii: { label: 'Erros inatos da imunidade', terms: ['immunodeficiency','immunodeficiencies','inborn errors of immunity','hypogammaglobulinemia','agammaglobulinemia','common variable immunodeficiency','primary immune deficiency','immunoglobulin replacement'] },
  medicam: { label: 'Alergia a medicamentos', terms: ['drug allergy','drug hypersensitivity','drug provocation','drug desensitization','penicillin allergy','beta lactam allergy','beta lactam hypersensitivity','nsaid hypersensitivity','aspirin hypersensitivity','antibiotic allergy','delabeling','delabelling','drug reaction with eosinophilia','drug induced anaphylaxis'] },
  masto: { label: 'Mastocitose', terms: ['mastocytosis','mast cell activation','mast-cell activation','mast cell disease'] },
  eoe: { label: 'Esofagite eosinofílica', terms: ['eosinophilic esophagitis','eosinophilic oesophagitis','esophageal eosinophilia'] },
  vacinas: { label: 'Vacinação', terms: ['vaccination','vaccines','vaccine','immunization','immunisation','pneumococcal vaccine','influenza vaccine','vaccine allergy'] }
};
export const ARTICLE_TOPIC_IDS = Object.keys(ARTICLE_TOPICS);
const normalize = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function titleMatchesTopic(title, topic) {
  if (!ARTICLE_TOPICS[topic]) return false;
  const hay = ' ' + normalize(title) + ' ';
  const terms = topic === 'todos'
    ? Object.values(ARTICLE_TOPICS).flatMap(x => x.terms)
    : ARTICLE_TOPICS[topic].terms;
  return terms.some(term => hay.includes(' ' + normalize(term) + ' '));
}
export function topicsForArticle(title) {
  return ARTICLE_TOPIC_IDS.filter(topic => topic !== 'todos' && titleMatchesTopic(title,topic));
}
const replacements = [
  [/\bdermatite atopica\b/g,'atopic dermatitis'],
  [/\bdermatite de contato\b/g,'contact dermatitis'],
  [/\besofagite eosinofilica\b/g,'eosinophilic esophagitis'],
  [/\bangioedema hereditario\b/g,'hereditary angioedema'],
  [/\balergia alimentar\b/g,'food allergy'],
  [/\balergia medicamentosa\b/g,'drug allergy'],
  [/\balergia a medicamentos\b/g,'drug allergy'],
  [/\brinossinusite cronica\b/g,'chronic rhinosinusitis'],
  [/\brinite alergica\b/g,'allergic rhinitis'],
  [/\bimunodeficiencia\b/g,'immunodeficiency'],
  [/\burticaria\b/g,'urticaria'],
  [/\banafilaxia\b/g,'anaphylaxis'],
  [/\bimunoterapia\b/g,'immunotherapy'],
  [/\bvacinacao\b/g,'vaccination'],
  [/\bvacinas?\b/g,'vaccine'],
  [/\basma\b/g,'asthma'],
  [/\bgrave\b/g,'severe'],
  [/\bcriancas\b/g,'children'],
  [/\bcrianca\b/g,'child'],
  [/\bgestantes?\b/g,'pregnancy'],
  [/\btratamento\b/g,'treatment'],
  [/\bdiagnostico\b/g,'diagnosis'],
  [/\bbiologicos?\b/g,'biologic'],
  [/\bomalizumabe\b/g,'omalizumab'],
  [/\bdupilumabe\b/g,'dupilumab'],
  [/\btezepelumabe\b/g,'tezepelumab']
];
export function searchTokens(query) {
  let s=normalize(query).slice(0,120);
  for (const [re, value] of replacements) s=s.replace(re,value);
  const stop=new Set(['de','da','do','das','dos','e','em','com','para','por','sobre','a','o','as','os','no','na','um','uma','the','of','and','for','in','with']);
  return [...new Set(s.split(' ').filter(t => t.length > 1 && !stop.has(t)))].slice(0,8);
}
export function buildArticleQuery(topic='todos', query='') {
  if (!ARTICLE_TOPICS[topic]) throw new Error('Tema inválido');
  const terms = topic === 'todos'
    ? [...new Set(Object.values(ARTICLE_TOPICS).flatMap(t => t.terms))]
    : ARTICLE_TOPICS[topic].terms;
  const topicClause = '(' + terms.map(t => '"' + t + '"[ti]').join(' OR ') + ')';
  const tokens=searchTokens(query);
  const queryClause=tokens.length ? ' AND ' + tokens.map(t => '"' + t + '"[tiab]').join(' AND ') : '';
  return topicClause + queryClause +
    ' NOT (retracted publication[pt] OR retraction of publication[pt] OR published erratum[pt] OR comment[pt])';
}
const months={jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
export function articleDate(input) {
  let s=String(input||'').trim();
  let m=s.match(/^(\d{4})[\/-](\d\d)(?:[\/-](\d\d))?/);
  if(m) return m[1]+'-'+m[2]+'-'+(m[3]||'01');
  m=s.match(/^(\d{4})\s+([a-z]{3})(?:\s+(\d{1,2}))?/i);
  if(m && months[m[2].toLowerCase()]) return m[1]+'-'+months[m[2].toLowerCase()]+'-'+(m[3]||'01').padStart(2,'0');
  return /^\d{4}$/.test(s) ? s+'-01-01' : '';
}
export function normalizeArticle(record,id,today,topic) {
  const pmid=String(id);
  if(!/^[1-9]\d{0,8}$/.test(pmid) || !record || String(record.uid)!==pmid) return null;
  const title=String(record.title||'').replace(/<[^>]+>/g,' ').trim();
  if(!title || !titleMatchesTopic(title,topic)) return null;
  const date=[record.epubdate,record.pubdate,record.sortpubdate]
    .map(articleDate).filter(v => v && v <= today).sort()[0];
  if(!date || (record.pubtype||[]).some(t => /retract|erratum/i.test(t))) return null;
  const doi=(record.articleids||[]).find(x => x.idtype==='doi')?.value||'';
  const authors=Array.isArray(record.authors) ? record.authors.slice(0,3).map(x => x.name).filter(Boolean) : [];
  return {
    pmid,title,date,journal:String(record.fulljournalname||record.source||'').trim(),
    authors,doi:/^10\.\d{4,9}\/\S+$/i.test(doi) ? doi : '',
    topics:topicsForArticle(title),
    url:'https://pubmed.ncbi.nlm.nih.gov/'+pmid+'/'
  };
}
