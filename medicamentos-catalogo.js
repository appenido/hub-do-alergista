/* Hub do Alergista — Medicamentos. Catálogo editorial; não equivale a consulta de registro ou estoque ANVISA. */
(function(){
'use strict';
const ANVISA='https://consultas.anvisa.gov.br/#/bulario/';
const FONTES={
  pele:'https://bvsms.saude.gov.br/bvs/publicacoes/dermatologia_atencao_basica_p2.pdf',
  asma:'https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf',
  dpoc:'https://storage.googleapis.com/bkpsbpt/arquivos/pdf/SBPT_MANUAL_DPOC_FINAL_25_OUT_2024.pdf',
  formulas:'https://www.sbp.com.br/fileadmin/user_upload/Manual_de_atualidades_em_Nutrologia_2021_-_SBP_SITE.pdf'
};
const CATS=[
 {id:'anti',name:'Anti-histamínicos',sub:'Catálogo original · oral, nasal, ocular e injetável',icon:'pill'},
 {id:'topicos',name:'Corticoides tópicos',sub:'Potência por princípio ativo, concentração e veículo',icon:'skin'},
 {id:'olhos',name:'Colírios',sub:'Anti-histamínicos e lubrificantes',icon:'eye'},
 {id:'nasais',name:'Corticoides nasais',sub:'Monoterapias e associações',icon:'nose'},
 {id:'inalatoria',name:'Terapia inalatória',sub:'DCI, marcas, dispositivos e classes',icon:'lungs'},
 {id:'ibps',name:'IBPs',sub:'Inibidores da bomba de prótons',icon:'stomach'},
 {id:'hidratantes',name:'Cremes hidratantes',sub:'Seleção por orçamento, textura e área corporal',icon:'drop'},
 {id:'formulas',name:'Fórmulas infantis',sub:'Categorias nutricionais e APLV',icon:'baby'}
];
/* Cada ficha: princípio ativo/produto, marcas exemplificativas, apresentação, classificação e observação. */
const DB={
 topicos:[
 ['Hidrocortisona 1%','Berlison; genéricos','Creme, pomada','Baixa','Potência depende da concentração e do veículo. Áreas delicadas exigem uso restrito.'],
 ['Dexametasona 0,1%','Genéricos; marcas variáveis','Creme','Baixa','Verificar associação com antimicrobianos e a composição da apresentação.'],
 ['Desonida 0,05%','Desonol; Adinos','Creme, loção, gel-creme','Baixa–média','Classificações variam entre referências e veículos; consultar a bula da formulação.'],
 ['Clobetasona 0,05%','Eumovate','Creme','Média','Não confundir clobetasona com clobetasol.'],
 ['Furoato de mometasona 0,1%','Elocom; genéricos','Creme, pomada, loção','Média','Pomada pode apresentar maior efeito clínico que creme; evitar uso indiscriminado em face/dobras.'],
 ['Acetonido de triancinolona 0,1%','Genéricos; associações','Creme, pomada','Média','Em associações com antibiótico/antifúngico, o risco e a indicação são diferentes.'],
 ['Aceponato de metilprednisolona 0,1%','Advantan','Creme, pomada e outras formas conforme registro','Média–alta','Potência depende do veículo e da referência; individualizar área e duração.'],
 ['Valerato de betametasona 0,1%','Betnovate','Creme, pomada, loção','Alta','Mais potente; risco de atrofia e efeitos adversos com aplicação extensa ou prolongada.'],
 ['Dipropionato de betametasona 0,05%','Diprosone; genéricos','Creme, pomada','Alta','A potência varia com veículo e formulação; versões otimizadas podem ser muito potentes.'],
 ['Fludroxicortida 0,0125%','Drenison','Creme, pomada, loção conforme registro','Média–alta','Conferir veículo e concentração exata antes de comparar potência.'],
 ['Propionato de clobetasol 0,05%','Psorex; genéricos','Creme, pomada, solução capilar','Muito alta','Superpotente; evitar face e dobras e limitar duração/quantidade conforme indicação.']
 ],
 olhos:[
 ['Olopatadina','Patanol; Pataday; genéricos','Solução oftálmica; concentrações conforme marca','Anti-H1','Conjuntivite alérgica. Não generalizar frequência entre concentrações.'],
 ['Cetotifeno','Zaditen; genéricos','Solução oftálmica 0,25 mg/mL','Anti-H1','Ação anti-H1 e estabilizadora de mastócitos.'],
 ['Epinastina','Relestat','Solução oftálmica 0,5 mg/mL','Anti-H1','Indicação e idade mínima conforme bula.'],
 ['Azelastina','Marcas variáveis','Solução oftálmica conforme registro','Anti-H1','Confirmar apresentação ocular, distinta da nasal.'],
 ['Emedastina','Emadine (verificar registro)','Solução oftálmica','Anti-H1','Disponibilidade no Brasil deve ser confirmada antes de prescrever.'],
 ['Cromoglicato dissódico','Cromolerg; genéricos','Solução oftálmica','Estabilizador de mastócitos','Não é anti-histamínico; incluído como opção antialérgica.'],
 ['Hialuronato de sódio','Hyabak; Hylo-Comod; similares','Solução oftálmica, com ou sem conservantes','Lubrificante','Verificar concentração e sistema conservante; preferir sem conservantes em uso frequente.'],
 ['Carboximetilcelulose','Refresh Tears; Optive (associações)','Solução oftálmica','Lubrificante','Composição e viscosidade variam entre apresentações.'],
 ['Hipromelose','Marcas variáveis; genéricos','Solução oftálmica','Lubrificante','Lágrima artificial, composição variável.'],
 ['Carmelose / glicerina','Optive e apresentações similares','Solução oftálmica','Lubrificante','Conferir associação e presença de conservantes.'],
 ['Polietilenoglicol + propilenoglicol','Systane; Systane Ultra','Solução oftálmica','Lubrificante','Conferir versão, conservantes e indicação.'],
 ['Carbômero','Vidisic; similares','Gel oftálmico','Lubrificante','Maior viscosidade pode ocasionar turvação transitória.']
 ],
 nasais:[
 ['Budesonida','Busonid; Noex; genéricos','Spray nasal aquoso','Corticoide nasal','Concentrações e número de aplicações variam por marca e idade.'],
 ['Furoato de mometasona','Nasonex; genéricos','Spray nasal 50 µg/jato','Corticoide nasal','Baixa biodisponibilidade sistêmica; verificar indicação por faixa etária.'],
 ['Furoato de fluticasona','Avamys','Spray nasal 27,5 µg/jato','Corticoide nasal','Não confundir com propionato de fluticasona.'],
 ['Propionato de fluticasona','Flixonase; genéricos','Spray nasal 50 µg/jato','Corticoide nasal','Conferir bula e disponibilidade local.'],
 ['Dipropionato de beclometasona','Clenil Nasal; genéricos','Spray nasal','Corticoide nasal','Formulações e concentrações específicas não são intercambiáveis.'],
 ['Triancinolona acetonida','Nasacort (verificar registro)','Spray nasal','Corticoide nasal','Confirmar registro e apresentação vigente no Brasil.'],
 ['Ciclesonida','Omnaris (verificar registro)','Spray nasal','Corticoide nasal','Confirmar registro e disponibilidade atual.'],
 ['Azelastina + propionato de fluticasona','Dymista','Spray nasal combinado','Anti-H1 + corticoide','Associação, não corticoide isolado; idade/posologia conforme bula.'],
 ['Olopatadina + furoato de mometasona','Ryaltris','Spray nasal combinado','Anti-H1 + corticoide','Associação, não corticoide isolado; idade/posologia conforme bula.']
 ],
 inalatoria:[
 ['Salbutamol','Aerolin; genéricos','Aerossol dosimetrado (pMDI); solução para nebulização','SABA','Alívio broncodilatador; na asma, evitar estratégia isolada sem tratamento contendo corticoide inalatório.'],
 ['Fenoterol','Berotec (verificar apresentação)','Solução para nebulização; aerossol conforme registro','SABA','Confirmar disponibilidade comercial atual.'],
 ['Brometo de ipratrópio','Atrovent; genéricos','Solução para nebulização; aerossol conforme registro','SAMA','Broncodilatador antimuscarínico de curta ação.'],
 ['Formoterol','Foradil; genéricos e marcas','Cápsulas de pó inalatório (DPI)','LABA','Na asma não utilizar LABA isolado; associar a corticoide inalatório.'],
 ['Salmeterol','Serevent (confirmar registro)','DPI e outras apresentações conforme registro','LABA','Na asma, nunca monoterapia.'],
 ['Indacaterol','Onbrize','Cápsula de pó inalatório (DPI)','LABA','Uso em DPOC conforme bula, não como monoterapia para asma.'],
 ['Olodaterol','Striverdi Respimat','Inalador de névoa suave (SMI)','LABA','Indicação predominante em DPOC.'],
 ['Budesonida','Pulmicort; genéricos','Suspensão para nebulização; DPI conforme apresentação','CI','Doses em µg não são equipotentes entre diferentes CI.'],
 ['Dipropionato de beclometasona','Clenil; Clenil A','pMDI; suspensão para nebulização','CI','Verificar tamanho de partícula e formulação: extrafino versus convencional.'],
 ['Propionato de fluticasona','Flixotide; genéricos conforme registro','pMDI; Diskus (DPI) conforme marca','CI','Verificar apresentação e técnica do dispositivo.'],
 ['Ciclesonida','Alvesco (verificar registro)','pMDI','CI','Confirmar disponibilidade local e idade.'],
 ['Budesonida + formoterol','Alenia; Symbicort Turbuhaler; Vannair; Foraseq','DPI cápsula; Turbuhaler; pMDI, conforme marca','CI + LABA','Para MART/AIR, só considerar apresentações/posologias validadas em bula e GINA; nem toda marca ou dispositivo é apropriado.'],
 ['Beclometasona + formoterol','Fostair','pMDI; DPI conforme apresentação','CI + LABA','Formulação extrafina; doses não intercambiáveis com outras associações.'],
 ['Salmeterol + propionato de fluticasona','Seretide; genéricos conforme registro','Diskus (DPI); pMDI conforme apresentação','CI + LABA','Salmeterol não é medicação de alívio da estratégia MART.'],
 ['Furoato de fluticasona + vilanterol','Relvar Ellipta','Ellipta (DPI)','CI + LABA','Uso em manutenção; não é inalador de resgate.'],
 ['Propionato de fluticasona + formoterol','Flutiform (verificar registro)','pMDI','CI + LABA','Confirmar apresentação vigente e idade na bula nacional.'],
 ['Tiotrópio','Spiriva Respimat','Névoa suave (SMI)','LAMA','Na asma, uso adicional em situações selecionadas; em DPOC, manutenção.'],
 ['Glicopirrônio','Seebri','DPI cápsula','LAMA','Manutenção em DPOC conforme bula.'],
 ['Umeclidínio','Vanisto Ellipta','Ellipta (DPI)','LAMA','Manutenção em DPOC.'],
 ['Aclidínio','Eklira Genuair (verificar registro)','Genuair (DPI)','LAMA','Confirmar comercialização brasileira.'],
 ['Indacaterol + glicopirrônio','Ultibro Breezhaler','Breezhaler (DPI cápsula)','LABA + LAMA','Dupla broncodilatação em DPOC.'],
 ['Umeclidínio + vilanterol','Anoro Ellipta','Ellipta (DPI)','LABA + LAMA','Dupla broncodilatação em DPOC.'],
 ['Olodaterol + tiotrópio','Spiolto Respimat','Névoa suave (SMI)','LABA + LAMA','Dupla broncodilatação em DPOC.'],
 ['Budesonida + glicopirrônio + formoterol','Breztri Aerosphere (verificar registro)','pMDI','CI + LABA + LAMA','Tripla terapia para indicações em bula; disponibilidade deve ser verificada.'],
 ['Beclometasona + formoterol + glicopirrônio','Trimbow','pMDI','CI + LABA + LAMA','Tripla terapia; comparar dose e dispositivos antes de substituir.'],
 ['Furoato de fluticasona + umeclidínio + vilanterol','Trelegy Ellipta','Ellipta (DPI)','CI + LABA + LAMA','Tripla terapia de manutenção; critérios específicos por doença.']
 ],
 ibps:[
 ['Omeprazol','Losec; genéricos','Cápsula/comprimido gastrorresistente; formas hospitalares conforme registro','IBP','Preferir administração conforme bula e indicação; avaliar necessidade de uso prolongado.'],
 ['Pantoprazol','Pantozol; genéricos','Comprimido gastrorresistente; forma injetável conforme registro','IBP','Apresentações 20 e 40 mg são comuns; verificar indicação e equivalência.'],
 ['Esomeprazol','Nexium; genéricos','Comprimido e granulado gastrorresistente conforme registro','IBP','Não triturar pellets gastrorresistentes; seguir instruções da bula.'],
 ['Lansoprazol','Lanz; genéricos','Cápsula de liberação retardada','IBP','Conferir apresentação e orientação de administração.'],
 ['Rabeprazol','Pariet; genéricos conforme registro','Comprimido gastrorresistente','IBP','Registro e disponibilidade variam.'],
 ['Dexlansoprazol','Dexilant','Cápsula de liberação retardada dual','IBP','Sistema de liberação diferente; não inferir equivalência mg a mg.']
 ],
 formulas:[
 ['Fórmula infantil padrão — etapa 1','NAN Comfor 1; Aptamil Premium 1; Enfamil Premium 1','Leite modificado com proteína íntegra; etapa conforme faixa etária','Padrão','Não indicada como tratamento para APLV. Conferir composição e etapa por idade.'],
 ['Fórmula infantil padrão — etapa 2','NAN Comfor 2; Aptamil Premium 2; Enfamil Premium 2','Fórmulas de seguimento conforme idade','Padrão','Não substitui fórmula específica para APLV.'],
 ['Proteína parcialmente hidrolisada','Linhas HA/Comfort, conforme fabricante','Hidrolisado parcial','Parcialmente hidrolisada','Não é tratamento de APLV confirmada; confirmar indicação rotulada.'],
 ['Proteína extensamente hidrolisada de leite','Pregomin Pepti; Aptamil Pepti; Althéra; Alfaré; Nutramigen','Fórmulas com proteína extensamente hidrolisada','FEH','Primeira opção em muitos casos de APLV; escolher segundo apresentação clínica, tolerância e diretrizes.'],
 ['Fórmula à base de aminoácidos livres','Neocate LCP; Alfamino; Puramino','Fórmulas elementares','FAA','Considerar nas situações indicadas, por exemplo APLV grave ou falha de FEH; exige avaliação especializada.'],
 ['Fórmula à base de proteína de arroz hidrolisada','Marcas variam; verificar produtos registrados','Hidrolisado de arroz','Arroz hidrolisado','Alternativa onde houver fórmula nutricionalmente completa apropriada; não é bebida vegetal comum.'],
 ['Fórmula infantil de soja','NAN Soy; Aptamil Soja','Proteína isolada de soja','Soja','Na APLV, considerar apenas quando apropriado (em geral após 6 meses) e sem contraindicação.'],
 ['Fórmula antirregurgitação','Aptamil AR; NAN AR','Espessada','AR','Não é tratamento de APLV, salvo composição especificamente adequada.'],
 ['Fórmula sem lactose','NAN SL; Aptamil Sem Lactose','Proteína de leite pode permanecer íntegra','Sem lactose','Ausência de lactose NÃO significa ausência de proteína do leite. Não tratar APLV com fórmula comum sem lactose.'],
 ['Fórmula de maior densidade energética','Infatrini; apresentações conforme registro','Fórmula pediátrica hipercalórica','Especializada','Indicação nutricional específica; não assumir adequação para APLV.']
 ]
};
const MOIST=[
 ['CeraVe Creme Hidratante','CeraVe','Creme','Corpo, face, mãos','Ceramidas e agentes umectantes; verificar versão e tamanho da embalagem.'],
 ['CeraVe Loção Hidratante','CeraVe','Loção','Corpo, face','Textura mais fluida; checar formulação específica.'],
 ['Cetaphil Creme Hidratante','Cetaphil','Creme','Corpo, face, mãos','Textura rica, adequada para áreas ressecadas conforme tolerância.'],
 ['Cetaphil Loção Hidratante','Cetaphil','Loção','Corpo, face','Opção leve para grandes áreas.'],
 ['Fisiogel AI Creme','Fisiogel','Creme','Corpo, face','Emoliente; verificar linha e composição.'],
 ['Lipikar Baume AP+M','La Roche-Posay','Bálsamo','Corpo, face','Bálsamo emoliente para pele muito seca; confirmar versão disponível.'],
 ['Atoderm Intensive Baume','Bioderma','Bálsamo','Corpo, face','Bálsamo para pele muito seca; confirmar tamanho.'],
 ['AtopiControl Loção','Eucerin','Loção','Corpo','Linha de cuidado para pele atópica.'],
 ['Stelatopia Creme Emoliente','Mustela','Creme','Bebê, corpo, face','Verificar indicação etária e a formulação vigente.'],
 ['Aveeno Dermexa','Aveeno','Creme','Corpo','Linha de emolientes; conferir versão e ingredientes.'],
 ['Epidrat Corpo Intensivo','Epidrat','Loção','Corpo','Conferir textura e tamanho da apresentação.'],
 ['Bepantol Derma Hidratante','Bepantol','Creme','Mãos, corpo','Conferir variante, pois a linha contém veículos diferentes.'],
 ['Vaselina sólida 100%','Genéricos / farmácias','Pomada','Mãos, áreas ressecadas','Emoliente oclusivo; comparar pureza e tamanho.']
];
const icons={
 pill:'<rect x="13" y="24" width="38" height="17" rx="8.5" transform="rotate(-34 32 32.5)" fill="#cdeaf0" stroke="#28677e" stroke-width="2"/><path d="M32 22v20" transform="rotate(-34 32 32)" stroke="#1a7188" stroke-width="2"/><circle cx="49" cy="16" r="4" fill="#d4ac4d"/>',
 skin:'<path d="M12 45c9-19 15-27 24-27 7 0 13 6 16 19" fill="none" stroke="#2d8798" stroke-width="8" stroke-linecap="round"/><path d="M13 49h39" stroke="#d4ac4d" stroke-width="4" stroke-linecap="round"/>',
 eye:'<path d="M5 32c8-12 17-17 27-17s19 5 27 17c-8 12-17 17-27 17S13 44 5 32z" fill="#e2eff3" stroke="#246b80" stroke-width="2"/><circle cx="32" cy="32" r="11" fill="#61bac6"/><circle cx="32" cy="32" r="5" fill="#16465c"/><circle cx="35" cy="27" r="2.5" fill="#fff"/>',
 nose:'<path d="M31 7c1 12-6 20-8 29-3 14 15 14 22 5" fill="none" stroke="#27849a" stroke-width="6" stroke-linecap="round"/><path d="M36 49c5 5 12 5 17 1" fill="none" stroke="#d4ac4d" stroke-width="3" stroke-linecap="round"/>',
 lungs:'<path d="M31 7v25M33 20l-9-9M33 20l9-9" fill="none" stroke="#1c5970" stroke-width="4" stroke-linecap="round"/><path d="M27 25C15 11 9 21 8 38c-1 16 11 19 21 9zM37 25c12-14 18-4 19 13 1 16-11 19-21 9z" fill="#a7dce0" stroke="#25798c" stroke-width="2"/>',
 stomach:'<path d="M30 8v17c0 7 7 10 13 6 7-4 14 0 13 10-1 12-12 17-23 14-11-3-17-13-12-22 4-7 4-11 3-25" fill="#cce9ec" stroke="#2a7489" stroke-width="2.5"/><circle cx="41" cy="42" r="4" fill="#c9a44f"/>',
 drop:'<path d="M32 6C24 19 13 31 13 41a19 19 0 0038 0C51 31 40 19 32 6z" fill="#a8dbe2" stroke="#246f85" stroke-width="2.5"/><path d="M22 39c0 5 3 9 7 11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>',
 baby:'<path d="M26 9h12v9l-3 5h5c6 0 9 5 9 11v20H15V34c0-6 3-11 9-11h5l-3-5z" fill="#e2eff2" stroke="#286e83" stroke-width="2"/><path d="M24 38h16M24 45h16" stroke="#d2a34b" stroke-width="3"/><path d="M28 11h8" stroke="#288da2" stroke-width="3"/>'
};
function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function catIcon(id){return '<svg viewBox="0 0 64 64" width="38" height="38" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="#f0f8f9"/>'+icons[id]+'</svg>';}
function fmt(value){return Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function sourceHref(id){return id==='topicos'?FONTES.pele:id==='inalatoria'?FONTES.asma:id==='formulas'?FONTES.formulas:ANVISA;}
function sourceLabel(id){return id==='topicos'?'Ministério da Saúde — potência':id==='inalatoria'?'GINA 2026':id==='formulas'?'SBP — Nutrologia':'Bulário eletrônico Anvisa';}
function cards(data,id){
 return '<div class="med-results" aria-live="polite">'+data.map((item,i)=>{
  const name=esc(item[0]),brand=esc(item[1]),form=esc(item[2]),tag=esc(item[3]),note=esc(item[4]);
  return '<details class="med-prod" data-hub-medicamento data-item="'+i+'"><summary><span class="med-prod-index">'+String(i+1).padStart(2,'0')+'</span><span class="med-prod-head"><span class="hub-med-nome">'+name+'</span><span class="med-prod-brand">'+brand+'</span></span><span class="med-prod-tag">'+tag+'</span><span class="med-prod-chevron">⌄</span></summary>'+
  '<div class="med-prod-detail"><div><span class="med-mini-label">Apresentações / veículo</span><p>'+form+'</p></div><div><span class="med-mini-label">Orientações clínicas</span><p>'+note+'</p></div>'+
  '<a href="'+ANVISA+'" target="_blank" rel="noopener noreferrer">Conferir bula e registro na Anvisa</a></div></details>';
 }).join('')+'</div><p class="med-source">Marcas exemplificativas, sem confirmação automática de registro ou disponibilidade. <a href="'+sourceHref(id)+'" target="_blank" rel="noopener noreferrer">'+sourceLabel(id)+'</a>.</p>';
}
let initDone=false,moistPrices=new Map(),moistChecked=false,moistBusy=false,moistMessage='';
function init(){
 const root=document.getElementById('medApp');if(!root || initDone)return;
 initDone=true;
 root.innerHTML='<div class="med-intro"><div class="med-eyebrow">CATÁLOGO FARMACOLÓGICO</div><h1>Medicamentos</h1><p>Selecione uma classe. Cada ficha expande no próprio cartão, com nomes genéricos, marcas, apresentações, indicações e cuidados.</p></div>'+
 '<div class="med-categories">'+CATS.map(c=>'<section class="med-category" data-med-category="'+c.id+'"><button type="button" class="med-category-toggle" aria-expanded="false"><span class="med-category-icon">'+catIcon(c.icon)+'</span><span class="med-category-copy"><span class="med-category-name">'+esc(c.name)+'</span><span class="med-category-sub">'+esc(c.sub)+'</span></span><span class="med-category-arrow" aria-hidden="true">⌄</span></button><div class="med-category-body" hidden></div></section>').join('')+'</div>'+
 '<p class="med-endnote">Dados editoriais com revisão em 14/11/2026. Uma marca ou forma descrita não confirma registro ativo. Consulte a apresentação exata no <a href="'+ANVISA+'" target="_blank" rel="noopener noreferrer">Bulário da Anvisa</a>. Atualizações clínicas e comerciais dependem de nova verificação documentada.</p>';
 root.addEventListener('click',e=>{
  const toggle=e.target.closest('.med-category-toggle');
  if(toggle){openCategory(toggle.closest('[data-med-category]').dataset.medCategory);return;}
  if(e.target.matches('[data-med-price-check]')){e.preventDefault();loadMoistPrices(true);}
 });
 root.addEventListener('input',e=>{
  if(e.target.matches('[data-med-search], [data-med-budget]'))renderCurrent();
 });
 root.addEventListener('change',e=>{
  if(e.target.matches('[data-med-texture], [data-med-area]'))renderCurrent();
 });
}
function openCategory(id,force){
 init();
 const section=document.querySelector('#medApp [data-med-category="'+id+'"]');if(!section)return;
 const opening=force || section.querySelector('.med-category-body').hidden;
 document.querySelectorAll('#medApp .med-category').forEach(node=>{
  const open=opening && node===section;
  node.classList.toggle('is-open',open);
  node.querySelector('button').setAttribute('aria-expanded',String(open));
  node.querySelector('.med-category-body').hidden=!open;
 });
 if(!opening)return;
 const body=section.querySelector('.med-category-body');
 if(!body.dataset.ready){
  body.dataset.ready='1';
  if(id==='anti'){
   const original=document.querySelector('#page-antihistaminicos #ahApp');
   if(original){body.appendChild(original);if(typeof window.ahInit==='function')window.ahInit();}
   else body.innerHTML='<p>Catálogo de anti-histamínicos não encontrado.</p>';
  }else{
   const controls=id==='hidratantes'
    ? '<div class="med-filters"><label>Preço máximo (R$)<input type="number" min="0" step="0.01" inputmode="decimal" data-med-budget placeholder="Ex.: 80"></label><label>Textura<select data-med-texture><option value="">Todas</option><option>Creme</option><option>Loção</option><option>Bálsamo</option><option>Pomada</option></select></label><label>Área corporal<select data-med-area><option value="">Todas</option><option>Corpo</option><option>Face</option><option>Mãos</option><option>Áreas ressecadas</option><option>Bebê</option></select></label></div><div class="med-price-status" data-med-price-status></div><button type="button" class="med-check-prices" data-med-price-check>Verificar preços disponíveis</button>'
    : '<div class="med-filters med-filters-basic"><label>Pesquisar nesta categoria<input type="search" data-med-search autocomplete="off" placeholder="Genérico, marca, classe..."></label></div>';
   body.innerHTML=controls+'<div class="med-list-slot"></div>';
  }
 }
 if(id!=='anti')renderCategory(id);
}
function renderCurrent(){const active=document.querySelector('#medApp .med-category.is-open');if(active)renderCategory(active.dataset.medCategory);}
function renderCategory(id){
 const sec=document.querySelector('#medApp [data-med-category="'+id+'"]'),slot=sec&&sec.querySelector('.med-list-slot');if(!slot)return;
 if(id==='hidratantes')return renderMoist(sec,slot);
 const q=norm(sec.querySelector('[data-med-search]')?.value);
 const filtered=(DB[id]||[]).filter(x=>!q||norm(x.join(' ')).includes(q));
 slot.innerHTML=filtered.length?cards(filtered,id):'<p class="med-empty">Nenhum medicamento encontrado para esta pesquisa.</p>';
}
function renderMoist(sec,slot){
 const texture=sec.querySelector('[data-med-texture]').value;
 const area=sec.querySelector('[data-med-area]').value;
 const raw=sec.querySelector('[data-med-budget]').value;
 const budget=raw===''?null:Number(raw);
 const matched=MOIST.filter(x=>(!texture||x[2]===texture)&&(!area||x[3].includes(area)));
 const status=sec.querySelector('[data-med-price-status]');
 if(raw!=='' && (!Number.isFinite(budget)||budget<0)){
  status.textContent='Informe um valor válido em reais.';slot.innerHTML='';return;
 }
 if(budget===null){
  status.textContent='Digite um preço máximo para filtrar por ofertas verificadas. Sem preço informado, a seleção considera textura e área. Preços não são estimados.';
  slot.innerHTML=cards(matched,'hidratantes');return;
 }
 const prices=matched.map(x=>({item:x,offers:(moistPrices.get(x[0])||[]).filter(o=>o.price<=budget)}));
 const affordable=prices.filter(x=>x.offers.length).sort((a,b)=>Math.min(...a.offers.map(o=>o.price))-Math.min(...b.offers.map(o=>o.price)));
 const unknown=matched.filter(x=>!moistPrices.has(x[0])||!moistPrices.get(x[0]).length);
 if(!moistChecked&&!moistBusy)loadMoistPrices(false);
 const verified=affordable.map(({item,offers})=>{
  const min=Math.min(...offers.map(o=>o.price));
  return '<div class="med-price-result">'+cards([item],'hidratantes')+'<div class="med-price-proof">Menor oferta verificada: '+fmt(min)+' · '+offers.length+' oferta(s) dentro do orçamento. Confira o volume da embalagem e o frete.</div></div>';
 }).join('');
 status.textContent=moistBusy?'Consultando fontes integradas para as ofertas atuais…':moistMessage||
 (affordable.length?'Exibindo apenas ofertas verificadas dentro do valor informado.':'Nenhuma oferta verificada disponível dentro do limite informado.');
 slot.innerHTML=(verified||'<p class="med-empty">Nenhuma oferta de hidratante com preço confirmado até '+fmt(budget)+'. A ausência de oferta não significa que o produto custe mais.</p>')+
 (unknown.length?'<details class="med-uncoted"><summary>'+unknown.length+' opção(ões) sem preço integrado — consultar manualmente</summary>'+cards(unknown,'hidratantes')+'</details>':'');
}
async function loadMoistPrices(force){
 if(moistBusy)return;
 if(moistChecked&&!force){renderCurrent();return;}
 moistBusy=true;moistMessage='';renderCurrent();
 let city='',uf='';
 try{
  const lr=await fetch('/api/farmacias-localizacao',{cache:'no-store',credentials:'same-origin'});
  if(lr.ok){const p=await lr.json();city=String(p.city||'').slice(0,100);uf=String(p.uf||'').slice(0,2);}
 }catch(_){}
 const requests=MOIST.map(x=>x[0]);let counter=0,configured=false;
 async function worker(){
  while(counter<requests.length){
   const name=requests[counter++];
   try{
    const res=await fetch('/api/farmacias-precos',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({medication:name,city,uf})});
    if(!res.ok){moistPrices.set(name,[]);continue;}
    const data=await res.json();if(data.configured)configured=true;
    const offers=(Array.isArray(data.offers)?data.offers:[]).filter(o=>o.verified===true&&Number(o.price)>0&&Number.isFinite(Number(o.price))&&/^https:\/\//.test(o.url||''));
    moistPrices.set(name,offers);
    if(data.configured===false){break;}
   }catch(_){moistPrices.set(name,[]);}
  }
 }
 await Promise.all([worker(),worker(),worker()]);
 moistBusy=false;moistChecked=true;
 moistMessage=configured?'Consulta concluída. Resultados dependem de ofertas verificadas retornadas pelo fornecedor.':'Integração de preços ainda não configurada. As opções clínicas continuam disponíveis, mas o filtro por preço não pode confirmar produtos abaixo do valor.';
 renderCurrent();
}
window.medsInit=init;window.medsOpenCategory=id=>openCategory(id,true);
})();
