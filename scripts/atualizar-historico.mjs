/** Histórico público de atualizações de conteúdo clínico.
 * Usa somente títulos de alterações concluídas; não publica autores, corpos de
 * commits, dados de pacientes ou detalhes da Central administrativa.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const OUTPUT = 'data/hub-atualizacoes.json';
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function sectionFor(subject) {
  const text = normalize(subject);
  if (/uas7|scorad|score|escore|pen.?fast|snot.?22|\bdlqi\b|\buct\b|qr|ultimo paciente/.test(text)) return ['scores', 'Scores e QR Code'];
  if (/intera[cç]|interaction|medscape|drug label/.test(text)) return ['interacao', 'Interações medicamentosas'];
  if (/imunoglobulina|infusao|igiv|hizentra|privigen|hyqvia|sandoglobulina|ig vena/.test(text)) return ['imunoglobulinas', 'Imunoglobulinas'];
  if (/protocolo|fluxograma|conduta|hereditario|\beoe\b/.test(text)) return ['eaaci', 'Protocolos de bolso'];
  if (/imunizac|vacina|pneumo|vpc20|sbim|\bpni\b|covid/.test(text)) return ['imunizacoes', 'Imunizações'];
  if (/biologic|imuno\)|terapia.?s? alvo|dupixent|dupilumabe|omalizumabe|nemolizumabe|tezepelumabe|xolair|remibrutinibe/.test(text)) return ['imuno', 'Terapias Alvo'];
  if (/medicamento|anti.?h1|anti.?histamin|hidratante|moisturizer|inhaler|inalat|cortic|formula infantil|pediatr|mg\/ml/.test(text)) return ['medicamentos', 'Medicamentos'];
  if (/guideline|diretriz|diretrizes|consenso/.test(text)) return ['guidelines', 'Guidelines'];
  if (/artigo|pubmed|uptodate|publicac|cientific/.test(text)) return ['artigos', 'Artigos e UpToDate'];
  if (/laboratorio|reatividade|molecular|ige|spt|prick|alimento|alergeno/.test(text)) return ['laboratorio', 'Laboratório'];
  if (/jornal|alergo news|radar|noticia|manchete/.test(text)) return ['jornal', 'Alergo News'];
  if (/educac|material/.test(text)) return ['educacao', 'Educação'];
  return ['dashboard', 'Aplicativo'];
}

function isPublicChange(subject) {
  const text = normalize(subject);
  if (!text || /^(merge |revert |test\b|ci(?:\(|:)|build(?:\(|:)|docs(?:\(|:))/.test(text)) return false;
  if (/^(?:chore(?:\([^)]*\))?:|sw\s*v?\d|update sw\.|bust pwa|bump |trigger |deploy |upload |create (?:index|sw)\.|delete .+\.[a-z]{2,4})/.test(text)) return false;
  if (/central|analytics|telemetria|admin|supabase|relay|migration|migracao|sql|banco de dados|lgpd|ripd|titularidade|copyright|api.key|\btoken\b|segredo|credencial|r2|\bci\b|workflow|git(hub)?|repositor|\btests?\b|regressao|teste|self.test|auditoria estatica/.test(text)) return false;
  if (/cache|versionar|invalidar|forcar (?:recarga|atualizacao)|forca (?:recarga|atualizacao)|sincroniz.*versao|(?:atualiz|bump|refresh).*versao|\bsw\b|precache/.test(text)) return false;
  if (/atualiza noticias verificadas|auditoria diaria hub|publicar atualizacao do historico/.test(text)) return false;
  if (/https?:\/\/|[\w.+-]+@[\w.-]+|[\w-]+\.(?:js|mjs|json|html|css|yml|py)\b|gemini|cloudflare|commit|stdin|patch|pull request/.test(text)) return false;
  if (/\bcss\b|stylesheet|gradient|preload|backend|authscreen|auth checks|signup callbacks|campo v\b|sincronizar.*rotina|canonical|open graph|sitemap|\brpc\b|payload|endpoint|\buuid\b/.test(text)) return false;
  return true;
}


/** Publica somente alterações de conhecimento clínico; manutenção e interface
 * permanecem fora do histórico, mesmo quando citam medicamentos ou doses. */
export function isPublicUpdate(subject, title = subject) {
  if (!isPublicChange(subject)) return false;
  const raw = normalize(subject);
  const text = normalize(subject + ' ' + title);
  const change = raw.replace(/^(?:feat|fix|novidade|content|conteudo)(?:\([^)]*\))?:\s*/, '');
  if (/^(?:load|render|enable)\b|medscape|consulta.*(?:bula.*fda|intera)|identifica revisoes.*tipo de publicacao/.test(change)) return false;
  if (/medscape|consulta.*bula.*fda|drug label.*lookup|labeling lookup/.test(text)) return false;
  if (/^(?:style|ui|seo|perf|refactor)(?:\(|:)/.test(raw)) return false;
  if (/titulo|traduc|traduz|idioma|fonte responsiva|tamanho.*fonte|\bfont\b|layout|\blogo\b|logomarca|icone|ilustrac|pictogram|aparencia|visual|header|heading|padding|typograph|salto vertical|inline|voltar|\bcores?\b|dourad|fabricante.*cor|\bgrid\b|\bgrade\b|coluna|\bcards?\b|cartao|cartoes|quadro|home|dashboard|navega|scroll|rolagem|expan[ds]|clic|botoes|botao|menu|overlay|modal|alinha|espacamento|largura|altura|responsiv|tela|mobile|desktop|windows|\bmac\b|interface|desenho|render|styling|stylesheet|illustrat|responsive|whole words|full.width/.test(text)) return false;
  if (/qr|diario|cadastro|formulario|registrar.*paciente|deletar|portal|persist|salva|salvamento|armazen|\bapi\b|schema|token|cookie|login|autentic|paciente.*link|link.*paciente|gerador|relatorio|export|csv|progresso|semanas consecutivas|monitoramento semanal/.test(text)) return false;
  if (/busca|pesquisa|filtro|ordenar|query|queries|rastreamento|rastrear|testa|codigo|code|valida presenca|limites temporarios|adiciona calculo|adicion.*comparador|integrar comparador|reorden|alfabet|seletor|carregar|carregamento|sincroniz|sininho|sino|notifica|anunciar|aviso|verificador|varredura|automatica|conferencia|catalog count|brand count|price|preco|orcamento|oferta/.test(text)) return false;
  if (sectionFor(title)[0] === 'dashboard') return false;
  // Alterações objetivas de doses, indicações, esquemas e critérios clínicos.
  if (/dose|doses|posolog|indicac|contraindic|esquema|comorbidad|diagnostic|criterios? (?:clinicos?|de (?:decisao|indicacao|elegibilidade|profilaxia))|criterios.*vacina|eficacia|infusao|infusion|velocidade|taxa.*manutencao|risco.*profilaxia|tratamento|condutas? (?:clinicas?|detalhadas)|evidencia|referencia|bula|registro.*anvisa|cobertura.*ans/.test(text)) return true;
  // Novos temas, documentos e conteúdos clínicos explicitamente publicados.
  const publication = /adicion|inclu|publica|atualiz|revis|corrig|especific|esclarec|detalh|novo|nova|amplia|completa|substitu|integr|\bfeat\b|\bnovidade\b|\bconteudo\b|\bcontent\b|\bexpand\b/;
  const clinicalContent = /vacina|calendario|nemolizumabe|imunobiolog|anti.histamin|hidratante|moisturizer|diretriz|diretrizes|guideline|consenso|artigo|reatividade.*(?:aliment|molecular)|componentes? molecula|proteinas?|alergenos?|protocolo.*clinico|criterio|escore.*pen.fast/;
  return publication.test(text) && clinicalContent.test(text);
}

const TITLES = {
  ae85ae386bc6: 'Títulos de artigos e guidelines mantidos no idioma original',
  '6f51e29b8ab2': 'Cálculo pediátrico organizado por princípio ativo e concentração em mg/mL',
  '5af69e704915': 'Resultado do último paciente preservado ao sair da tela e recuperação de envios por QR Code',
  cb43a1ed6271: 'Referências clínicas de anti-histamínicos e emolientes atualizadas',
  '635100166d96': 'Recurso complementar para a tradução dos textos do aplicativo',
  '90dd5060d2b3': 'Guidelines restritos a diretrizes clínicas oficiais, com remoção de resultados sem relação',
  '0ddfe4db2cac': 'Busca no PubMed restrita a diretrizes clínicas e parâmetros de prática oficiais',
  '10e7b9ce7912': 'Contagem automática das marcas e dos hidratantes disponíveis no catálogo',
  'ff91ab9bb572': 'Filtros de hidratantes por marca, textura, área corporal, busca e orçamento',
  'afc0ee879479': 'Catálogo ampliado para 70 hidratantes de 18 marcas, com seleção por fabricante e fontes',
  'd0a6b25e8172': 'Catálogo ampliado para 75 opções de hidratantes de 19 marcas, com referências',
  'ad8064383465': 'Revisão da dose máxima de Berotec spray e ilustrações distintas dos dispositivos Jet e Genuair',
  '02b1d7fabf4c': 'Refinamento das doses por dispositivo de SABA, SAMA e corticoides inalatórios conforme bulas brasileiras',
  '4ebf64e80474': 'Dispositivos inalatórios e informações de dose disponíveis na seção Medicamentos',
  '9b2c53ff22b2': 'Ilustrações dos dispositivos para asma e posologias na categoria Terapia Inalatória',
  'b9fd73b1fb7b': 'Ilustrações de oito dispositivos inalatórios, com dose e dose máxima visíveis',
  '2ecff27079dc': 'Dispositivos para asma com doses por marca, limites máximos e elegibilidade para MART',
  '4947648df492': 'Correção dos links da Anvisa para fórmulas infantis e cosméticos e das ofertas de hidratantes',
  'ef575c15e713': 'Aparência dos anti-histamínicos preservada após sua transferência para Medicamentos',
  '4f2d3e7bce51': 'Aparência dos anti-histamínicos preservada após sua transferência para Medicamentos',
  '3ebbd5cfe8d9': 'Seção Medicamentos criada na Home, reunindo o acesso aos anti-histamínicos',
  '357f70c166cf': 'Seção Medicamentos adaptada às telas, com detalhes clínicos no próprio card',
  'd1a2917e2bf3': 'Catálogo de medicamentos por categoria e filtros de hidratantes por preço verificado',
  'dd6b5bd8c6ce': 'Simplificação da seção de interações medicamentosas e remoção de textos sem relação',
  'face3e1bb9f6': 'Resultados de interações entre medicamentos apresentados em português',
  'ff23ea48bb93': 'Resultados de interações em português organizados a partir de regras clínicas',
  '28f61c381f52': 'Reformulação da consulta de interações medicamentosas com referência externa ao Medscape',
  'a4ac7ed6b6c3': 'Consulta às informações de bula da FDA para interações medicamentosas',
  '9740e4b35994': 'Correção da consulta de interações e indicação de verificação no Medscape',
  'fd1b7cbd8242': 'Novos ícones ilustrativos para relatórios clínicos e painéis de apoio',
  '38b45a317f9b': 'Padronização visual dos ícones nos painéis do Hub',
  'd5090dbb2f32': 'Cards de vacinas mantidos na posição durante a abertura de detalhes',
  '85a8c08a3ef7': 'Revisão visual dos cards de vacinas e da ficha de detalhes',
  'f83ef07a030d': 'Fichas de biológicos com largura completa e leitura ajustada ao celular',
  '7b702459beb1': 'Nomes do Acesso Rápido sem palavras cortadas e cards mais largos',
  '6bcd7e824d3d': 'Ícones de apoio mantidos durante o carregamento das ilustrações',
  '9a10cb98d68d': 'Novas ilustrações e aparência do Acesso Rápido na Home',
  '78c9f32a78d0': 'Cards do Acesso Rápido adaptados a celular, tablet e computador',
  '413e6fe3abb6': 'Ajuste da apresentação do banner oficial do congresso',
  '1840a6af5c12': 'Ampliação do banner oficial do congresso no canto superior esquerdo da Home',
  '3d5eeac88d38': 'Melhoria da organização e da leitura nas calculadoras de scores no computador',
  '2669358ecfab': 'Revisão dos scores no computador e dos filtros de reatividade cruzada no app instalado',
  '88e44665d321': 'Cards dos scores proporcionais e legíveis no Windows e no Mac',
  'ca93a21d354f': 'Melhoria da hierarquia visual e do contraste no comparador de reatividade molecular',
  'c56333b4f557': 'Comparador exibe apenas famílias e proteínas com reatividade cruzada entre os alimentos selecionados',
  'd8b422bba942': 'Organização proporcional do Laboratório no computador e no tablet',
  'fb06567e0ce1': 'Painéis do Laboratório alinhados à largura da tela',
  'bb2ad305aaf7': 'Padronização do tamanho das fontes do Hub no computador',
  'c84fc310f58a': 'Organização de todas as páginas do Hub para Windows e Mac',
  '54e0e3deae65': 'Ajuste das fontes e dos espaçamentos em todas as seções no computador',
  '326e26373222': 'Ampliação do conteúdo e melhoria da leitura no Windows e no Mac',
  'e6e318599290': 'Aprimoramento da adaptação das páginas às dimensões da tela',
  'cd8927096f3c': 'Melhorias de apresentação no computador, tablet e celular',
  '1185587d6b4d': 'Imunoglobulinas: datas de registro confirmadas na Anvisa, cobertura na ANS e segurança por via',
  '0693eac409a1': 'IgIV: padronização das velocidades e cálculo de Privigen e HyQvia com frascos de 5 g',
  '769faa2b17e5': 'Privigen: taxa de manutenção após infusões documentadas sem reação e histórico das infusões',
  'e92255b0ab48': 'Remoção do login obrigatório e uso de preferências locais',
  '0db2343a51da': 'Melhoria da confirmação por código ou link e da recuperação de acesso',
  '26c012e1f16f': 'Revisão da tela de acesso e da exigência de identificação'
};

export function cleanTitle(commit) {
  let title = TITLES[commit.sha.slice(0, 12)] || commit.subject
    .replace(/^(?:feat|fix|style|perf|refactor|ui|seo|novidade)(?:\([^)]*\))?!?:\s*/i, '')
    .replace(/\s*\(#\d+\)$/, '').trim();
  title = title.replace(/^fix\s+/i, 'Correção: ').replace(/^add\s+/i, 'Inclusão de ').replace(/^remove\s+/i, 'Remoção de ');
  const scope = /^(?:feat|fix|style|perf|refactor|novidade)\(([^)]+)\):/.exec(commit.subject)?.[1];
  const labels = {uas7:'UAS7', dupixent:'Dupixent', uptodate:'UpToDate', scorad:'SCORAD', guidelines:'Guidelines', protocolos:'Protocolos de bolso', imunizacoes:'Imunizações', igiv:'IgIV'};
  const label = labels[normalize(scope)];
  if (label && !normalize(title).includes(normalize(label))) title = label + ': ' + title;
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function buildHistory(commits) {
  const seen = new Set();
  const items = [];
  for (const commit of commits) {
    if (!/^[a-f0-9]{40}$/.test(commit.sha || '')) continue;
    const title = cleanTitle(commit);
    if (!isPublicUpdate(commit.subject, title)) continue;
    const stamp = new Date(commit.date);
    if (Number.isNaN(stamp.getTime())) continue;
    const date = new Intl.DateTimeFormat('en-CA', {timeZone: 'America/Sao_Paulo', year:'numeric', month:'2-digit', day:'2-digit'}).format(stamp);
    const key = date + ':' + normalize(title).replace(/[^a-z0-9]/g, '');
    if (seen.has(key) || title.length < 8) continue;
    seen.add(key);
    const [section, category] = sectionFor(commit.subject);
    const text = normalize(commit.subject);
    const type = /remov|retir|exclu|elimin/.test(text) ? 'Remoção' :
      /^(fix|corrig)|correc|resolve|restaur|recuper|impedir|prevent/.test(text) ? 'Correção' :
      /^(feat|novidade)|adicion|inclu|\bcria|lancamento|\bnovo|\bnova/.test(text) ? 'Novidade' : 'Melhoria';
    items.push({kind: 'content', id: commit.sha.slice(0, 12), date, publishedAt: stamp.toISOString(), type, category, section, title});
  }
  items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id));
  return {version: 1, scope: 'clinical-content', updatedAt: items[0]?.date || null, items};
}

function main() {
  const inputAt = process.argv.indexOf('--input');
  const commits = inputAt >= 0 ? JSON.parse(readFileSync(process.argv[inputAt + 1], 'utf8')) :
    execFileSync('git', ['log', '--no-merges', '--format=%H%x1f%cI%x1f%s%x1e'], {encoding:'utf8', maxBuffer:30 * 1024 * 1024})
      .split('\x1e').filter(line => line.trim()).map(line => {
        const [sha, date, subject] = line.trim().split('\x1f');
        return {sha, date, subject};
      });
  const feed = buildHistory(commits);
  if (!feed.items.length) throw new Error('Histórico sem atualizações de conteúdo: a publicação foi interrompida.');
  writeFileSync(OUTPUT, JSON.stringify(feed, null, 2) + '\n');
  console.log(`${feed.items.length} atualizações do aplicativo registradas.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
