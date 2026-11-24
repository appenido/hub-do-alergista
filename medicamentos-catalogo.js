/* Hub do Alergista — Medicamentos. Catálogo editorial; não equivale a consulta de registro ou estoque ANVISA. */
(function(){
'use strict';
const ANVISA='https://consultas.anvisa.gov.br/#/bulario/';
const FONTES={
  pele:'https://bvsms.saude.gov.br/bvs/publicacoes/dermatologia_atencao_basica_p2.pdf',
  asma:'https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf',
  dpoc:'https://storage.googleapis.com/bkpsbpt/arquivos/pdf/SBPT_MANUAL_DPOC_FINAL_25_OUT_2024.pdf'
};
const CATS=[
 {id:'dose',name:'Cálculo de dose',sub:'Pediatria · líquidos orais em mg/mL',icon:'calculator'},
 {id:'anti',name:'Anti-histamínicos',sub:'Catálogo original · oral, nasal, ocular e injetável',icon:'pill'},
 {id:'topicos',name:'Corticoides tópicos',sub:'Idade mínima, creme ou pomada e potência de cada veículo',icon:'skin'},
 {id:'olhos',name:'Colírios',sub:'Anti-histamínicos e lubrificantes',icon:'eye'},
 {id:'nasais',name:'Corticoides nasais',sub:'Monoterapias e associações',icon:'nose'},
 {id:'inalatoria',name:'Terapia inalatória',sub:'Asma: desenhos de inaladores, doses, máximos e MART',icon:'lungs'},
 {id:'ibps',name:'IBPs',sub:'Horário · doses · EoE · segurança · monitorização',icon:'stomach'},
 {id:'hidratantes',name:'Cremes hidratantes',sub:'Seleção por orçamento, textura e área corporal',icon:'drop'}
];

/* Identidade visual compartilhada dos medicamentos: nome comercial registrado,
   fabricante e cores corporativas. Mantém fallback neutro quando a marca/fabricante
   não pode ser determinada com segurança a partir do catálogo. */
const MED_MANUFACTURERS={
 gsk:{name:'GSK',logo:'GSK',color:'#f36f21',soft:'#fff4ec',ink:'#a94100'},
 boehringer:{name:'Boehringer Ingelheim',logo:'Boehringer Ingelheim',color:'#003b5c',soft:'#eef6fa',ink:'#002c45'},
 chiesi:{name:'Chiesi Farmacêutica',logo:'Chiesi',color:'#007b8a',soft:'#edf9f9',ink:'#005b65'},
 astrazeneca:{name:'AstraZeneca',logo:'AstraZeneca',color:'#6f2c91',soft:'#f7f0fa',ink:'#54206d'},
 ache:{name:'Aché Laboratórios',logo:'Aché',color:'#c6006f',soft:'#fff0f8',ink:'#920052'},
 novartis:{name:'Novartis',logo:'Novartis',color:'#e05b22',soft:'#fff4ef',ink:'#9b3710'},
 takeda:{name:'Takeda',logo:'Takeda',color:'#d71920',soft:'#fff1f2',ink:'#a51016'},
 viatris:{name:'Viatris',logo:'Viatris',color:'#6f2c91',soft:'#f7f1fa',ink:'#51206a'},
 glenmark:{name:'Glenmark',logo:'Glenmark',color:'#0057a5',soft:'#eff6fc',ink:'#003d74'},
 eurofarma:{name:'Eurofarma',logo:'Eurofarma',color:'#007a3d',soft:'#eef9f3',ink:'#00552a'},
 ems:{name:'EMS',logo:'EMS',color:'#005baa',soft:'#eef6fd',ink:'#00417a'},
 biolab:{name:'Biolab',logo:'Biolab',color:'#005aa9',soft:'#eef6fc',ink:'#003f78'},
 bayer:{name:'Bayer',logo:'Bayer',color:'#0b7d3e',soft:'#eef8f2',ink:'#07582c'},
 organon:{name:'Organon',logo:'Organon',color:'#6f2a8e',soft:'#f7f0fa',ink:'#502067'},
 sanofi:{name:'Sanofi',logo:'Sanofi',color:'#7a00e6',soft:'#f6effd',ink:'#5200a0'},
 abbott:{name:'Abbott',logo:'Abbott',color:'#00857c',soft:'#eef9f7',ink:'#005e57'},
 apsen:{name:'Apsen',logo:'Apsen',color:'#005baa',soft:'#eef6fd',ink:'#00417a'},
 opella:{name:'Opella',logo:'Opella',color:'#6b2fa1',soft:'#f7f1fa',ink:'#4c2171'},
 alcon:{name:'Alcon',logo:'Alcon',color:'#0067b1',soft:'#eef6fc',ink:'#00477c'},
 abbvie:{name:'AbbVie',logo:'AbbVie',color:'#071d49',soft:'#f1f4f9',ink:'#071d49'},
 thea:{name:'Théa',logo:'Théa',color:'#005aa8',soft:'#eef6fc',ink:'#003f76'},
 ursapharm:{name:'URSAPHARM',logo:'URSAPHARM',color:'#006d75',soft:'#eef9f9',ink:'#004b51'},
 bausch:{name:'Bausch + Lomb',logo:'Bausch + Lomb',color:'#005eb8',soft:'#eef6fd',ink:'#00417f'},
 janssen:{name:'Janssen',logo:'Janssen',color:'#d2232a',soft:'#fff1f2',ink:'#97181e'},
 bioderma:{name:'Bioderma · NAOS',logo:'Bioderma',color:'#e31b54',soft:'#fff1f5',ink:'#a1133b'},
 cerave:{name:'CeraVe · L’Oréal',logo:'CeraVe',color:'#006f8b',soft:'#eef8fa',ink:'#004d61'},
 cetaphil:{name:'Cetaphil · Galderma',logo:'Cetaphil',color:'#0b78bd',soft:'#eef7fc',ink:'#075486'},
 dermage:{name:'Dermage',logo:'Dermage',color:'#8a5b4a',soft:'#faf5f2',ink:'#644136'},
 eucerin:{name:'Eucerin · Beiersdorf',logo:'Eucerin',color:'#b11942',soft:'#fff1f4',ink:'#7f1230'},
 fisiogel:{name:'Fisiogel',logo:'Fisiogel',color:'#8267a8',soft:'#f6f2fa',ink:'#5d487a'},
 granado:{name:'Granado',logo:'Granado',color:'#7c1e2c',soft:'#faf1f2',ink:'#57151f'},
 isdin:{name:'ISDIN',logo:'ISDIN',color:'#e5484d',soft:'#fff2f2',ink:'#a52e32'},
 laroche:{name:'La Roche-Posay · L’Oréal',logo:'La Roche-Posay',color:'#009ee2',soft:'#eff9fe',ink:'#00709f'},
 mantecorp:{name:'Mantecorp Skincare',logo:'Mantecorp',color:'#174f7c',soft:'#f0f6fa',ink:'#103854'},
 mustela:{name:'Mustela · Expanscience',logo:'Mustela',color:'#00a6c8',soft:'#eefbfc',ink:'#00758d'},
 neutrogena:{name:'Neutrogena',logo:'Neutrogena',color:'#111111',soft:'#f5f5f5',ink:'#111111'},
 nivea:{name:'NIVEA · Beiersdorf',logo:'NIVEA',color:'#003b7a',soft:'#eef4fa',ink:'#002955'},
 profuse:{name:'Profuse',logo:'Profuse',color:'#6e4a8e',soft:'#f6f1fa',ink:'#4f3566'},
 uriage:{name:'Uriage',logo:'Uriage',color:'#225f8a',soft:'#f0f6fa',ink:'#184361'},
 vasenol:{name:'Vasenol',logo:'Vasenol',color:'#1d4f91',soft:'#eff5fb',ink:'#143766'},
 neutral:{name:'Fabricante não identificado',logo:'',color:'#72828a',soft:'#f5f7f8',ink:'#41535c'}
};
const MED_REGISTERED_MARKS=[
 'Bepantol','Bioderma','CeraVe','Cetaphil','Dermage','Eucerin','Fisiogel','Granado','ISDIN','La Roche-Posay','Mantecorp','Mustela','Neutrogena','NIVEA','Profuse','Uriage','Vasenol',
 'Berlison','Adinos','Eumovate','Elocom','Advantan','Betnovate','Diprosone','Drenison','Psorex',
 'Patanol','Pataday','Zaditen','Relestat','Emadine','Cromolerg','Hyabak','Hylo-Comod','Refresh Tears','Optive','Systane Ultra','Systane','Vidisic',
 'Busonid','Noex','Nasonex','Avamys','Flixonase','Clenil Nasal','Nasacort','Omnaris','Dymista','Ryaltris',
 'Aerolin','Berotec','Atrovent','Foradil','Serevent','Onbrize','Striverdi','Pulmicort','Clenil','Flixotide','Alvesco','Alenia','Symbicort','Vannair','Foraseq','Fostair','Seretide','Relvar','Flutiform','Spiriva','Seebri','Vanisto','Eklira','Ultibro','Anoro','Spiolto','Breztri','Trimbow','Trelegy',
 'Losec','Pantozol','Nexium','Lanz','Pariet','Dexilant',
 'Polaramine','Histamin','Hixizine','Prurizin','Fenergan','Cobavital','Dramin','Meclin','Claritin','Loremix','Histamix','Loralerg','Desalex','Destadin','Zyrtec','Zetalerg','Zyxem','Allegra','Praalergia','Rafex','Alektos Ped','Alektos','Ebastel','Rupafin','Talerc','Rino-Lastin','Aznite'
].sort((a,b)=>b.length-a.length);
function medRegisterMarks(value){
 let out=String(value||'');
 MED_REGISTERED_MARKS.forEach(token=>{
  const safe=token.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  out=out.replace(new RegExp(safe+'(?!®)','g'),token+'®');
 });
 return out;
}
function medMakerKey(value){
 const s=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const rules=[
  ['gsk',/aerolin|serevent|flixotide|seretide|relvar|trelegy|avamys|betnovate/],
  ['boehringer',/berotec|atrovent|spiriva|striverdi|spiolto/],
  ['chiesi',/clenil|fostair|trimbow/],
  ['astrazeneca',/pulmicort|symbicort|vannair|breztri|losec|nexium/],
  ['ache',/busonid|alenia|adinos|talerc/],
  ['novartis',/foradil|foraseq|onbrize|seebri|ultibro|zaditen|patanol|pataday/],
  ['takeda',/alvesco|dexilant|pantozol/],
  ['viatris',/dymista|rino-lastin/],
  ['glenmark',/ryaltris/],
  ['eurofarma',/noex|ebastel/],
  ['ems',/lanz/],
  ['biolab',/drenison/],
  ['bayer',/advantan|bepantol/],
  ['organon',/nasonex/],
  ['sanofi',/nasacort|allegra/],
  ['abbott',/cobavital/],
  ['apsen',/meclin/],
  ['opella',/fenergan/],
  ['alcon',/systane/],
  ['abbvie',/relestat|refresh|optive/],
  ['thea',/hyabak/],
  ['ursapharm',/hylo-comod/],
  ['bausch',/vidisic/],
  ['janssen',/pariet/],
  ['bioderma',/bioderma/],
  ['cerave',/cerave/],
  ['cetaphil',/cetaphil/],
  ['dermage',/dermage/],
  ['eucerin',/eucerin/],
  ['fisiogel',/fisiogel/],
  ['granado',/granado/],
  ['isdin',/isdin/],
  ['laroche',/la roche-posay|lipikar/],
  ['mantecorp',/mantecorp/],
  ['mustela',/mustela/],
  ['neutrogena',/neutrogena/],
  ['nivea',/nivea/],
  ['profuse',/profuse/],
  ['uriage',/uriage/],
  ['vasenol',/vasenol/]
 ];
 const makers=[...new Set(rules.filter(([,rx])=>rx.test(s)).map(([key])=>key))];
 return makers.length===1?makers[0]:'neutral';
}
function medMakerVars(key){
 const m=MED_MANUFACTURERS[key]||MED_MANUFACTURERS.neutral;
 return '--med-mf:'+m.color+';--med-mf-soft:'+m.soft+';--med-mf-ink:'+m.ink+';';
}
function medMakerLogo(key){
 const m=MED_MANUFACTURERS[key]||MED_MANUFACTURERS.neutral;
 if(key==='neutral'||!m.logo)return '';
 return '<span class="med-maker-logo" aria-label="'+esc(m.name)+'" title="'+esc(m.name)+'"><span>'+esc(m.logo)+'</span></span>';
}
window.HubMedBranding={
 registeredBrand:medRegisterMarks,
 manufacturerKey:medMakerKey,
 manufacturerVars:medMakerVars,
 manufacturerLogo:medMakerLogo,
 manufacturers:MED_MANUFACTURERS
};

/* Cada ficha: princípio ativo/produto, marcas exemplificativas, apresentação, classificação e observação. */
const DB={
 topicos:[
 ['Hidrocortisona 1%','Berlison; genéricos','Creme, pomada','Baixa','Potência depende da concentração e do veículo. Áreas delicadas exigem uso restrito.'],
 ['Dexametasona 0,1%','Genéricos; marcas variáveis','Creme','Baixa','Verificar associação com antimicrobianos e a composição da apresentação.'],
 ['Desonida 0,05%','Desonol (descontinuado); Adinos; genéricos','Creme, loção, gel-creme','Baixa–média','Classificações variam entre referências e veículos; consultar a bula da formulação.'],
 ['Clobetasona 0,05%','Eumovate (referência internacional)','Creme','Média','Não confundir clobetasona com clobetasol.'],
 ['Furoato de mometasona 0,1%','Elocom; genéricos','Creme, pomada, loção','Média','Pomada pode apresentar maior efeito clínico que creme; evitar uso indiscriminado em face/dobras.'],
 ['Acetonido de triancinolona 0,1%','Disponibilidade de formulação isolada não confirmada','Creme, pomada','Média','Em associações com antibiótico/antifúngico, o risco e a indicação são diferentes.'],
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
 ['Omeprazol','Losec; genéricos','Cápsula/comprimido gastrorresistente','IBP','30–60 min antes da refeição; ficha com adulto, pediatria, EoE, máximo e monitorização.'],
 ['Pantoprazol','Pantozol; genéricos','Comprimido gastrorresistente; apresentações 20 e 40 mg','IBP','Pode ser administrado com ou sem alimento; ficha diferencia uso habitual, refratário e EoE.'],
 ['Esomeprazol','Nexium; genéricos','Cápsula/comprimido e granulado gastrorresistente','IBP','Administrar pelo menos 1 hora antes da refeição; ficha com doses por idade e EoE.'],
 ['Lansoprazol','Lanz; genéricos','Cápsula/ODT de liberação retardada conforme apresentação','IBP','Preferir antes da refeição; ficha com doses pediátricas por peso.'],
 ['Rabeprazol','Pariet; genéricos','Comprimido gastrorresistente; sprinkle em alguns mercados','IBP','Comprimido pode ser usado com ou sem alimento na maioria das indicações; ficha detalha exceções.'],
 ['Dexlansoprazol','Dexilant','Cápsula de dupla liberação retardada','IBP','Pode ser administrado independentemente de alimento; ficha explica a dupla liberação.']
 ]
};
/* IBPs — ficha clínica estruturada. Doses regulatórias por apresentação + EoE por diretrizes.
   EoE pediátrica é expressa como omeprazol-equivalente quando a molécula/apresentação não tem
   indicação específica. Revisão clínica: 24/11/2026. */
const IBP_GUIDES={
 brasil:'https://www.aaai-asbai.org.br/article/doi/10.4322/2526-5393.17041027',
 acg:'https://gi.org/wp-content/uploads/2024/12/EOE-highlights.pdf',
 espghan:'https://www.espghan.org/dam/jcr%3A9cf73630-43a3-4791-ac79-2c88f74aa1c7/J%20pediatr%20gastroenterol%20-%202024%20-%20Amil%E2%80%90Dias%20-%20Diagnosis%20and%20management%20of%20eosinophilic%20esophagitis%20in%20children%20An.pdf',
 agaSafety:'https://pubmed.ncbi.nlm.nih.gov/28257716/'
};
const IBP_CLASS_SAFETY={
 common:['Cefaleia','Dor abdominal','Diarreia','Náusea','Flatulência','Constipação'],
 important:[
  ['Diarreia persistente / febre','Considerar C. difficile e outras causas infecciosas; hidratação e investigação dirigida.'],
  ['Creatinina em elevação, mal-estar, rash, piúria ou hematúria','Suspeitar nefrite tubulointersticial aguda; suspender o IBP e investigar função renal/urina.'],
  ['Cãibras, tremor, tetania, convulsão ou arritmia','Dosar magnésio; acrescentar cálcio e potássio conforme o quadro. Repor e reavaliar manutenção do IBP.'],
  ['Anemia, neuropatia, glossite ou fatores de risco em uso prolongado','Dosar B12; considerar hemograma, ferritina e ferro conforme contexto clínico.'],
  ['Rash intenso, bolhas, lesão mucosa ou fotossensibilidade com artralgia','Suspender e avaliar reação cutânea grave ou lúpus cutâneo subagudo.'],
  ['Fratura ou risco osteoporótico elevado','Tratar risco ósseo pelos critérios habituais; IBP isoladamente não exige densitometria de rotina em baixo risco.']
 ],
 monitor:'Em paciente de baixo risco, não pedir rotineiramente creatinina, magnésio, B12 ou densitometria apenas por usar IBP. Monitorar de forma dirigida por dose/duração, doença renal, diuréticos/digoxina, má absorção, anemia, risco ósseo ou sintomas.'
};
const IBP_CLINICAL={
 'Omeprazol':{
  shortTiming:'30–60 min antes',
  presentation:'Cápsula/comprimido de liberação retardada com revestimento entérico. Omeprazol é mistura racêmica dos enantiômeros R e S.',
  timing:'Preferir 30–60 minutos antes do café da manhã. Se 2x/dia: antes do café e antes do jantar/refeição da noite. Não triturar os grânulos gastrorresistentes.',
  adult:'DRGE sintomática/esofagite erosiva: usualmente 20 mg 1x/dia. EoE: ACG 2025 usa omeprazol 20 mg 2x/dia ou 40 mg 1x/dia, ou equivalente.',
  pediatric:'Dose regulatória para DRGE/EE: 1–16 anos: 5–<10 kg = 5 mg/dia; 10–<20 kg = 10 mg/dia; ≥20 kg = 20 mg/dia. EE de 1 mês a <1 ano: 3–<5 kg = 2,5 mg/dia; 5–<10 kg = 5 mg/dia; ≥10 kg = 10 mg/dia.',
  eoe:'EoE pediátrica: 1 mg/kg/dose 2x/dia (2 mg/kg/dia), em omeprazol-equivalente. ESPGHAN: 4–10 anos máximo 60 mg/dia; 11–18 anos máximo 80 mg/dia. Reavaliar em 8–12 semanas com endoscopia e biópsias; sintomas isolados não bastam.',
  max:'Não misturar teto de EoE com hipersecreção. Em EoE, seguir o teto da diretriz. Em condições hipersecretoras, a rotulagem descreve início em 60 mg/dia e doses de até 120 mg 3x/dia; isso não é dose rotineira para DRGE/EoE.',
  difference:'Referência histórica da classe. Maior dependência de CYP2C19 que rabeprazol; pode reduzir a ativação do clopidogrel.',
  solid:'Omeprazol oral usual é descrito como molécula-base, sem hidrato fixo obrigatório. O ponto clínico crítico é o revestimento entérico, porque a molécula é ácido-lábil.',
  interaction:'Clopidogrel: evitar omeprazol quando houver alternativa apropriada; pantoprazol/rabeprazol tendem a ter menor interferência CYP2C19.',
  source:'https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fbd71fd8-3f36-46a1-bc76-53f6820d42a2'
 },
 'Pantoprazol':{
  shortTiming:'Preferir antes do café',
  presentation:'Comprimido gastrorresistente 20/40 mg; forma IV em contexto hospitalar. O comprimido deve ser engolido inteiro.',
  timing:'O comprimido pode ser tomado com ou sem alimento. Para padronizar supressão ácida, preferir 30–60 minutos antes do café da manhã; se 2x/dia, antes do café e da refeição da noite.',
  adult:'DRGE/esofagite erosiva: 40 mg 1x/dia. Pantozol® admite 40 mg 2x/dia em casos refratários. Em EoE, usar estratégia de IBP em dose alta/equivalente, sem assumir equivalência mg-a-mg com omeprazol.',
  pediatric:'≥5 anos: 15–<40 kg = 20 mg 1x/dia; ≥40 kg = 40 mg 1x/dia por até 8 semanas para EE associada à DRGE. Abaixo disso, EoE é recomendação de classe, não validação específica desta apresentação.',
  eoe:'Se escolhido em EoE pediátrica, ancorar a prescrição no regime de classe em omeprazol-equivalente (1 mg/kg/dose 2x/dia) e na apresentação disponível. ESPGHAN: máximo 60 mg/dia entre 4–10 anos e 80 mg/dia entre 11–18 anos.',
  max:'DRGE/EE: usual 40 mg/dia; Pantozol® admite 80 mg/dia em casos refratários. Condições hipersecretoras podem usar doses maiores; foram administrados até 240 mg/dia. Não usar esse teto como alvo para EoE.',
  difference:'Menor inibição de CYP2C19 que omeprazol/esomeprazol; frequentemente é opção quando há necessidade de IBP concomitante ao clopidogrel.',
  solid:'Pantoprazol é frequentemente pantoprazol sódico sesqui-hidratado: 1,5 molécula de água de cristalização por unidade estequiométrica. Cerca de 45,1 mg do sal sesqui-hidratado equivalem a 40 mg de pantoprazol.',
  interaction:'Clopidogrel: interferência tende a ser menor que com omeprazol/esomeprazol. Anticoagulantes cumarínicos: considerar INR/TP após início, suspensão ou mudança relevante.',
  source:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f3ded82a-cf0d-4844-944a-75f9f9215ff0'
 },
 'Esomeprazol':{
  shortTiming:'≥1 h antes da refeição',
  presentation:'Cápsula/comprimido ou granulado gastrorresistente. Esomeprazol é o enantiômero S do omeprazol.',
  timing:'Administrar pelo menos 1 hora antes da refeição, preferencialmente antes do café da manhã. Se 2x/dia, antes do café e da refeição da noite. Não triturar pellets gastrorresistentes.',
  adult:'DRGE/EE: 20–40 mg 1x/dia. Em EoE, utilizar dose alta equivalente à estratégia de omeprazol do ACG, individualizando pela resposta e apresentação.',
  pediatric:'1–11 anos: DRGE sintomática 10 mg/dia; EE: <20 kg = 10 mg/dia; ≥20 kg = 10 ou 20 mg/dia. 12–17 anos com EE: 20 ou 40 mg/dia. 1 mês–<1 ano com EE: 3–5 kg 2,5 mg/dia; >5–7,5 kg 5 mg/dia; >7,5–12 kg 10 mg/dia.',
  eoe:'EoE pediátrica: diretriz usa dose de classe como omeprazol-equivalente 1 mg/kg/dose 2x/dia. Não interpretar isso como “esomeprazol 1 mg/kg/dose” automaticamente; escolher formulação/equivalência apropriada e reavaliar em 8–12 semanas.',
  max:'EE/DRGE: 40 mg/dia nas indicações usuais. Hipersecreção: início 40 mg 2x/dia; estudos utilizaram total diário de até 240 mg. Esse teto não se aplica à EoE rotineira.',
  difference:'É o S-enantiômero isolado do omeprazol, com menor variabilidade farmacocinética ligada ao CYP2C19 e exposição em média mais previsível; isso não significa superioridade clínica universal.',
  solid:'Forma clássica: esomeprazol magnésico tri-hidratado, com 3 moléculas de água na rede cristalina. Uma dose de 20 mg de esomeprazol corresponde a cerca de 22,3 mg do sal tri-hidratado.',
  interaction:'Também inibe CYP2C19; com clopidogrel, preferir outro IBP quando clinicamente apropriado.',
  source:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=fed0e554-7d61-4957-9b91-356f3abc0777'
 },
 'Lansoprazol':{
  shortTiming:'Antes da refeição',
  presentation:'Cápsula ou comprimido orodispersível de liberação retardada, conforme apresentação. É mistura racêmica de enantiômeros R e S.',
  timing:'Preferir antes da refeição, em geral 30 minutos antes do café da manhã; se 2x/dia, antes das duas principais refeições.',
  adult:'DRGE sintomática: 15 mg 1x/dia; esofagite erosiva: 30 mg 1x/dia. Em EoE, usar estratégia de IBP em dose alta/equivalente, sem converter mg-a-mg automaticamente.',
  pediatric:'1–11 anos: ≤30 kg = 15 mg 1x/dia; >30 kg = 30 mg 1x/dia para DRGE/EE. 12–17 anos: DRGE não erosiva 15 mg/dia; EE 30 mg/dia.',
  eoe:'Em EoE pediátrica, a referência é 1 mg/kg/dose 2x/dia em omeprazol-equivalente. Preferir molécula/apresentação com dados pediátricos adequados e identificar que a posologia de EoE é de diretriz.',
  max:'DRGE/EE: 30 mg/dia nas indicações usuais. Em hipersecreção, 60 mg/dia é dose inicial e estudos utilizaram até 180 mg/dia. Não extrapolar esse teto para EoE.',
  difference:'Há apresentações orodispersíveis úteis quando deglutição é problema. Dexlansoprazol é o R-enantiômero isolado desta molécula.',
  solid:'Lansoprazol padrão é descrito como molécula-base, sem água de cristalização fixa na denominação. A proteção entérica é mais relevante clinicamente do que um estado de hidratação.',
  interaction:'Metabolismo por CYP2C19/CYP3A4; revisar interações relevantes e função hepática em doença grave.',
  source:'https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=afcc0f14-8b00-41ac-8e62-4094a15b959c'
 },
 'Rabeprazol':{
  shortTiming:'Flexível; sprinkle antes',
  presentation:'Comprimido gastrorresistente 20 mg; cápsula sprinkle pediátrica existe em alguns mercados. Não triturar o comprimido.',
  timing:'Para a maioria das indicações, o comprimido pode ser tomado com ou sem alimento. Úlcera duodenal: após refeição matinal; H. pylori: com alimento. Formulação sprinkle pediátrica: 30 minutos antes da refeição.',
  adult:'DRGE/EE: 20 mg 1x/dia. Em EoE, utilizar estratégia de dose alta equivalente à classe, sem equivalência simples de miligramas.',
  pediatric:'≥12 anos: 20 mg 1x/dia para DRGE sintomática. Formulação sprinkle de 1–11 anos: <15 kg = 5 mg/dia, podendo aumentar a 10 mg/dia; ≥15 kg = 10 mg/dia. A disponibilidade local dessa formulação varia.',
  eoe:'Em EoE pediátrica, a evidência de dose é de classe em omeprazol-equivalente (1 mg/kg/dose 2x/dia). Dose pediátrica de DRGE não é automaticamente dose específica de EoE.',
  max:'DRGE/EE: 20 mg/dia nas indicações usuais. Hipersecreção: início 60 mg/dia; já foram administrados 100 mg 1x/dia ou 60 mg 2x/dia (120 mg/dia). Não usar esse teto para EoE.',
  difference:'Menor dependência relativa do CYP2C19 do que omeprazol/esomeprazol; pode ser útil quando se busca menor variabilidade metabólica/interação CYP2C19.',
  solid:'Rabeprazol é comercializado como sal sódico; a descrição regulatória padrão não exige hidrato fixo no nome. É higroscópico e ácido-lábil, justificando revestimento entérico.',
  interaction:'Menor interferência CYP2C19 que omeprazol/esomeprazol; ainda assim revisar interações e tratamentos concomitantes.',
  source:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=63e0b7ca-6b2d-42a9-b9d4-4523b8a20425'
 },
 'Dexlansoprazol':{
  shortTiming:'Qualquer horário',
  presentation:'Cápsula de dupla liberação retardada com dois grupos de grânulos que dissolvem em faixas diferentes de pH. É o R-enantiômero do lansoprazol.',
  timing:'Pode ser administrado independentemente do alimento e do horário. Essa flexibilidade é uma diferença real em relação à maioria dos IBPs de liberação retardada convencional.',
  adult:'≥12 anos: cicatrização de EE 60 mg 1x/dia por até 8 semanas; manutenção de EE cicatrizada/NERD 30 mg 1x/dia.',
  pediatric:'A indicação regulatória começa aos 12 anos. Abaixo de 12 anos não extrapolar dose de adulto. Em EoE pediátrica, preferir agente com experiência/formulação pediátrica e usar a recomendação de classe em omeprazol-equivalente.',
  eoe:'Não converter diretamente “1 mg/kg de omeprazol” em 1 mg/kg de dexlansoprazol. EoE pediátrica deve seguir dose de classe/equivalência com molécula apropriada e monitorização histológica.',
  max:'Dose aprovada para cicatrização de EE: 60 mg/dia. 60 mg 2x/dia não é esquema rotineiro e houve relato de hipertensão nessa exposição; não usar como “máximo terapêutico” de EoE.',
  difference:'R-enantiômero do lansoprazol + dupla liberação retardada. Prolonga o perfil de exposição e reduz dependência do horário da refeição; não significa simplesmente “mais forte”.',
  solid:'Dexlansoprazol pode existir como molécula anidra ou sesqui-hidratada conforme fabricante. O produto de referência usa dupla liberação; hidratação isoladamente não determina equivalência clínica.',
  interaction:'Em insuficiência hepática moderada, reduzir a dose de cicatrização de EE; uso não é recomendado na insuficiência hepática grave. Revisar demais interações de classe.',
  source:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=55c550b4-eb8b-4e69-9c09-fa5125a52e65'
 }
};
const IBP_HYDRATE_EXPLAINER={
 title:'Sal, mono/di/tri-hidratado: o que realmente muda?',
 points:[
  ['Anidro','Sem água de hidratação fixa na rede cristalina.'],
  ['Monoidratado','1 molécula de água por unidade estequiométrica.'],
  ['Di-hidratado','2 moléculas de água na rede cristalina.'],
  ['Tri-hidratado','3 moléculas de água; exemplo: esomeprazol magnésico tri-hidratado.'],
  ['Sesqui-hidratado','1,5 molécula de água; exemplo: pantoprazol sódico sesqui-hidratado.']
 ],
 note:'Isso altera massa molecular, estabilidade, solubilidade e fabricação do cristal, mas não significa que “tri-hidratado seja mais forte”. A dose clínica é expressa como equivalente do fármaco ativo. Sal (sódico/magnésico), hidratação, enantiômero e tecnologia de liberação são conceitos diferentes.'
};

const MOIST=[
 [
 "Bepantol Derma Balm Regenerador",
 "Bepantol",
 "Bálsamo",
 "Corpo, Áreas ressecadas",
 "Textura mais consistente para xerose intensa.",
 "https://www.bepantol.com.br/nossos-produtos/"
 ],
 [
 "Bepantol Derma Creme Multirrestaurador",
 "Bepantol",
 "Creme",
 "Mãos, Áreas ressecadas",
 "Dexpantenol e agentes emolientes para áreas localizadas.",
 "https://www.bepantol.com.br/nossos-produtos/bepantol-derma-creme-multirrestaurador-40g"
 ],
 [
 "Bepantol Derma Restaurador Diário",
 "Bepantol",
 "Loção",
 "Corpo",
 "Hidratante corporal com dexpantenol, de aplicação diária.",
 "https://www.bepantol.com.br/nossos-produtos/bepantol-derma-hidratante-restaurador-diario-400ml"
 ],
 [
 "Bepantol Derma Toque Seco",
 "Bepantol",
 "Creme",
 "Mãos, Corpo",
 "Creme oil-free de rápida absorção.",
 "https://www.bepantol.com.br/nossos-produtos/"
 ],
 [
 "Bepantol Sensicalm Hidratante",
 "Bepantol",
 "Creme",
 "Corpo, Áreas ressecadas",
 "Hidratante para pele seca e sensível; consultar idade indicada na embalagem.",
 "https://www.bepantol.com.br/nossos-produtos/"
 ],
 [
 "Bioderma Atoderm Crème Ultra",
 "Bioderma",
 "Creme",
 "Corpo, Face, Bebê",
 "Creme nutritivo sem perfume para pele normal a seca.",
 "https://www.biodermabrasil.com/p/atoderm-creme-ultra"
 ],
 [
 "Bioderma Atoderm Intensive Baume",
 "Bioderma",
 "Bálsamo",
 "Corpo, Face, Bebê",
 "Bálsamo relipidante para pele muito seca com tendência atópica.",
 "https://www.biodermabrasil.com/p/atoderm-intensive-baume"
 ],
 [
 "Bioderma Atoderm Intensive Gel-Creme",
 "Bioderma",
 "Gel-creme",
 "Corpo, Face, Bebê",
 "Textura gel-creme leve para pele muito seca com tendência atópica.",
 "https://www.biodermabrasil.com/p/atoderm-intensive-gelcreme"
 ],
 [
 "CeraVe Creme Hidratante",
 "CeraVe",
 "Creme",
 "Corpo, Face, Mãos",
 "Ceramidas, ácido hialurônico e veículo mais espesso.",
 "https://www.cerave.com.br/todos-os-produtos/creme-hidratante"
 ],
 [
 "CeraVe Creme Reparador para Mãos",
 "CeraVe",
 "Creme",
 "Mãos, Áreas ressecadas",
 "Cuidado específico para ressecamento das mãos.",
 "https://www.cerave.com.br/todos-os-produtos/hidratacao"
 ],
 [
 "CeraVe Hidratante Facial Water Gel",
 "CeraVe",
 "Gel-creme",
 "Face",
 "Textura em gel para quem prefere aplicação facial leve.",
 "https://www.cerave.com.br/todos-os-produtos/pele-seca"
 ],
 [
 "CeraVe Loção Facial Hidratante",
 "CeraVe",
 "Loção",
 "Face",
 "Versão facial com ceramidas; verificar a apresentação com ou sem FPS.",
 "https://www.cerave.com.br/todos-os-produtos/locao-facial-hidratante"
 ],
 [
 "CeraVe Loção Hidratante",
 "CeraVe",
 "Loção",
 "Corpo, Face",
 "Ceramidas; loção de espalhabilidade elevada.",
 "https://www.cerave.com.br/todos-os-produtos/locao-hidratante"
 ],
 [
 "CeraVe Loção Hidratante Intensiva Hydro-Urea",
 "CeraVe",
 "Loção",
 "Corpo",
 "Loção para pele seca a muito seca; confirmar composição antes de usar em pele fissurada.",
 "https://www.cerave.com.br/todos-os-produtos/locao-hidratante-intensiva-com-hydroureia-cerave"
 ],
 [
 "Cetaphil Advanced Moisturizer Loção",
 "Cetaphil",
 "Loção",
 "Corpo",
 "Loção hidratante para pele ressecada.",
 "https://www.cetaphil.com.br/produtos"
 ],
 [
 "Cetaphil Creme Hidratante",
 "Cetaphil",
 "Creme",
 "Corpo, Face, Mãos",
 "Creme espesso para pele seca e sensível; avaliar tolerância individual.",
 "https://www.cetaphil.com.br/produtos"
 ],
 [
 "Cetaphil Gel Creme Rápida Absorção",
 "Cetaphil",
 "Gel-creme",
 "Corpo",
 "Veículo mais leve para hidratação corporal.",
 "https://www.cetaphil.com.br/produtos/hidratacao-corporal"
 ],
 [
 "Cetaphil Loção Hidratante",
 "Cetaphil",
 "Loção",
 "Corpo, Face",
 "Loção de uso diário para grandes áreas.",
 "https://www.cetaphil.com.br/produtos"
 ],
 [
 "Cetaphil Optimal Hydration Water Gel",
 "Cetaphil",
 "Gel-creme",
 "Face",
 "Opção facial em textura gel.",
 "https://www.cetaphil.com.br/produtos"
 ],
 [
 "Cetaphil PRO AD Restoraderm Creme",
 "Cetaphil",
 "Creme",
 "Corpo, Face, Bebê",
 "Linha para pele seca com tendência atópica; confirmar idade indicada no rótulo.",
 "https://www.cetaphil.com.br/linhas/pro-ad-restoraderm/creme-hidratante-pro-ad-227/3499320015462.html"
 ],
 [
 "Cetaphil PRO AD Restoraderm Loção",
 "Cetaphil",
 "Loção",
 "Corpo, Face, Bebê",
 "Loção sem fragrância informada pelo fabricante; indicação a partir de três meses conforme produto.",
 "https://www.cetaphil.com.br/linhas/pro-ad-restoraderm/lo%C3%A7%C3%A3o-hidratante-pro-ad-restoraderm-236ml/7897930775794.html"
 ],
 [
 "Cetaphil PRO Ureia 10% Loção",
 "Cetaphil",
 "Loção",
 "Corpo, Áreas ressecadas",
 "Contém ureia a 10%; pode causar ardência em pele fissurada.",
 "https://www.cetaphil.com.br/produtos/hidratacao-corporal"
 ],
 [
 "Dermage Hidracare Creme Corporal",
 "Dermage",
 "Creme",
 "Corpo",
 "Creme para pele seca a extrasseca com ceramidas e ácido hialurônico.",
 "https://www.dermage.com.br/hidracare-creme-hidratante-corporal/p"
 ],
 [
 "Dermage Hidracare Loção Corporal",
 "Dermage",
 "Loção",
 "Corpo",
 "Loção para pele normal a seca.",
 "https://www.dermage.com.br/hidracare-locao-hidratante-corporal/p"
 ],
 [
 "Dermage Hyaluage Body",
 "Dermage",
 "Loção",
 "Corpo",
 "Textura hidratante corporal com ácido hialurônico.",
 "https://www.dermage.com.br/corpo/hidratacao-corporal"
 ],
 [
 "Dermage Regenerage Body",
 "Dermage",
 "Loção",
 "Corpo",
 "Linha de hidratação e reparação de pele sensível.",
 "https://www.dermage.com.br/corpo/hidratacao-corporal"
 ],
 [
 "Dermage Ureiactive",
 "Dermage",
 "Loção",
 "Corpo, Áreas ressecadas",
 "Com ureia; atenção à ardência em fissuras.",
 "https://www.dermage.com.br/corpo/hidratacao-corporal"
 ],
 [
 "Eucerin Anti-Pigment Loção Corporal",
 "Eucerin",
 "Loção",
 "Corpo",
 "Hidratação com ativos para uniformização do tom; não é emoliente simples.",
 "https://www.eucerin.com.br/produtos/anti-pigment/eucerin-anti-pigment-lo%C3%A7%C3%A3o-corporal-hidratante-400ml-"
 ],
 [
 "Eucerin AtopiControl Loção",
 "Eucerin",
 "Loção",
 "Corpo",
 "Linha para pele com tendência atópica; confirmar oferta local e formulação.",
 "https://www.eucerin.com.br/"
 ],
 [
 "Eucerin pH5 Loção Hidratante Corporal",
 "Eucerin",
 "Loção",
 "Corpo",
 "Loção para pele sensível com dexpantenol.",
 "https://www.eucerin.com.br/produtos/pele-sensivel/ph5-lotion-400ml"
 ],
 [
 "Eucerin UreaRepair Plus 10% Loção",
 "Eucerin",
 "Loção",
 "Corpo, Áreas ressecadas",
 "Ureia 10% e ceramidas para xerose; pode arder em lesões fissuradas.",
 "https://www.eucerin.com.br/produtos/urea-repair/urea-repair-plus-locao-hidratante-corporal"
 ],
 [
 "Fisiogel AI Creme Facial Diário",
 "Fisiogel",
 "Creme",
 "Face",
 "Versão facial para pele seca e sensível.",
 "https://www.farmaconde.com.br/Fisiogel"
 ],
 [
 "Fisiogel AI Loção Cremosa",
 "Fisiogel",
 "Loção",
 "Corpo",
 "Linha para pele seca e sensível; verificar composição da variante.",
 "https://www.farmaconde.com.br/Fisiogel"
 ],
 [
 "Fisiogel Creme Hidratante Corporal",
 "Fisiogel",
 "Creme",
 "Corpo, Mãos",
 "Creme corporal hipoalergênico conforme apresentação.",
 "https://www.farmaconde.com.br/Fisiogel"
 ],
 [
 "Fisiogel Terapia de Hidratação Diária",
 "Fisiogel",
 "Loção",
 "Corpo",
 "Loção para hidratação diária da pele seca.",
 "https://www.farmaconde.com.br/Fisiogel"
 ],
 [
 "Vaselina sólida 100% (petrolato)",
 "Genéricos / farmácias",
 "Pomada",
 "Mãos, Áreas ressecadas",
 "Emoliente oclusivo; verificar pureza, rotulagem e tamanho da embalagem.",
 "https://www.vasenol.com.br/p/geleia-vaselina-original.html/07891150029323"
 ],
 [
 "Granado Bebê Dermocalmante 120 mL",
 "Granado",
 "Loção",
 "Bebê, Corpo",
 "Com ceramidas e sem perfume informado na página oficial.",
 "https://www.granado.com.br/granado/loc-o-hidratante-dermocalmante-120ml"
 ],
 [
 "Granado Bebê Dermocalmante 300 mL",
 "Granado",
 "Loção",
 "Bebê, Corpo",
 "Embalagem maior da linha dermocalmante.",
 "https://www.granado.com.br/granado/bebe/hidratacao"
 ],
 [
 "Granado Bebê Suave Calêndula",
 "Granado",
 "Loção",
 "Bebê, Corpo",
 "Linha infantil perfumada; verificar composição e tolerância.",
 "https://www.granado.com.br/granado/bebe/hidratacao"
 ],
 [
 "Granado Bebê Suave Tradicional",
 "Granado",
 "Loção",
 "Bebê, Corpo",
 "Linha infantil de uso diário; confirmar fragrância.",
 "https://www.granado.com.br/granado/bebe/hidratacao"
 ],
 [
 "ISDIN Ureadin Lotion 10",
 "ISDIN",
 "Loção",
 "Corpo, Áreas ressecadas",
 "Ureia 10% para xerose; evitar aplicação indiscriminada em pele fissurada.",
 "https://www.isdin.com/pt-BR/produto/ureadin/locao-rx"
 ],
 [
 "ISDIN Ureadin Rx 10",
 "ISDIN",
 "Loção",
 "Corpo, Áreas ressecadas",
 "Loção com ureia e dexpantenol; conferir versão comercial.",
 "https://www.isdin.com/pt-BR/produto/ureadin/locao-rx"
 ],
 [
 "Lipikar Baume AP+M",
 "La Roche-Posay",
 "Bálsamo",
 "Corpo, Face, Bebê",
 "Bálsamo para pele muito seca e com tendência atópica; consultar ingredientes.",
 "https://www.laroche-posay.com.br/lipikar/baume-ap-m"
 ],
 [
 "Epidrat Calm B5",
 "Mantecorp Skincare",
 "Creme",
 "Face, Áreas ressecadas",
 "Produto reparador concentrado de uso localizado.",
 "https://www.panvel.com/panvel/espaco-da-marca/mantecorp-skincare/m-11015?descricao_da_categoria_2=creme-hidratante&descricao_da_categoria_3=hidratante-corporal"
 ],
 [
 "Epidrat Corpo Intensivo Creme",
 "Mantecorp Skincare",
 "Creme",
 "Corpo",
 "Creme hidratante corporal da Mantecorp; conferir embalagem e ingredientes.",
 "https://www.panvel.com/panvel/espaco-da-marca/mantecorp-skincare/m-11015?descricao_da_categoria_2=creme-hidratante&descricao_da_categoria_3=hidratante-corporal"
 ],
 [
 "Epidrat Corpo Intensivo Loção",
 "Mantecorp Skincare",
 "Loção",
 "Corpo",
 "Apresentação corporal de textura mais fluida.",
 "https://www.panvel.com/panvel/espaco-da-marca/mantecorp-skincare/m-11015?descricao_da_categoria_2=creme-hidratante&descricao_da_categoria_3=hidratante-corporal"
 ],
 [
 "Hydraporin AI Loção",
 "Mantecorp Skincare",
 "Loção",
 "Corpo",
 "Linha de emolientes para pele seca e sensível.",
 "https://www.panvel.com/panvel/espaco-da-marca/mantecorp-skincare/m-11015?descricao_da_categoria_2=creme-hidratante&descricao_da_categoria_3=hidratante-corporal"
 ],
 [
 "Mustela Creme Hidratante BIO",
 "Mustela",
 "Creme",
 "Bebê, Corpo, Face",
 "Versão orgânica; verificar ingredientes e idade recomendada.",
 "https://www.mustela.com.br/collections/cremes-hidratantes-e-balsamos"
 ],
 [
 "Mustela Hidratante Calmante Schisandra BIO",
 "Mustela",
 "Loção",
 "Bebê, Corpo, Face",
 "Linha para pele sensível; confirmar veículo e composição.",
 "https://www.mustela.com.br/collections/hidratacao"
 ],
 [
 "Mustela Hydra Bebê Hidratante Corporal",
 "Mustela",
 "Loção",
 "Bebê, Corpo",
 "Hidratação infantil de uso diário; conferir fragrância no rótulo.",
 "https://www.mustela.com.br/collections/hidratacao"
 ],
 [
 "Mustela Stelatopia+ Hidratante Relipidante",
 "Mustela",
 "Bálsamo",
 "Bebê, Corpo, Face",
 "Produto da linha Stelatopia+ para pele muito seca; conferir faixa etária.",
 "https://www.mustela.com.br/collections/hidratante"
 ],
 [
 "Neutrogena Body Care Intensive Hidrata & Repara",
 "Neutrogena",
 "Loção",
 "Corpo",
 "Hidratante corporal; verificar composição da variante.",
 "https://www.neutrogena.com.br/cuidado-corporal/hidratacao-corporal"
 ],
 [
 "Neutrogena Body Care Intensive Hidrata & Suaviza",
 "Neutrogena",
 "Loção",
 "Corpo",
 "Loção para uso corporal diário.",
 "https://www.neutrogena.com.br/cuidado-corporal/hidratacao-corporal"
 ],
 [
 "Neutrogena Hydro Boost Water Gel Corporal",
 "Neutrogena",
 "Gel-creme",
 "Corpo",
 "Textura leve para uso corporal.",
 "https://www.neutrogena.com.br/cuidado-corporal/hidratacao-corporal"
 ],
 [
 "Neutrogena Norwegian Com Fragrância",
 "Neutrogena",
 "Loção",
 "Corpo",
 "Versão perfumada; preferir cautela em peles reativas.",
 "https://www.neutrogena.com.br/cuidado-corporal/linhas-de-productos/norwegian-formula"
 ],
 [
 "Neutrogena Norwegian Sem Fragrância",
 "Neutrogena",
 "Loção",
 "Corpo",
 "Versão sem fragrância, para pele seca.",
 "https://www.neutrogena.com.br/cuidado-corporal/linhas-de-productos/norwegian-formula"
 ],
 [
 "Nivea Creme Lata Azul",
 "Nivea",
 "Creme",
 "Corpo, Mãos, Áreas ressecadas",
 "Creme oclusivo clássico e perfumado; não escolher automaticamente para pele atópica.",
 "https://www.nivea.com.br/produtos/nivea-creme-40059004088910033.html"
 ],
 [
 "Nivea Cuida & Repara",
 "Nivea",
 "Loção",
 "Corpo",
 "Opção corporal para ressecamento; conferir perfume.",
 "https://careshop.nivea.com.br/beleza-e-perfumaria/corpo/hidratante/NIVEA%20Creme/Unissex/higiene-e-saude/sabonete/intimo"
 ],
 [
 "Nivea Lotion Express",
 "Nivea",
 "Loção",
 "Corpo",
 "Loção leve de rápida absorção; contém fragrância conforme variante.",
 "https://www.nivea.com.br/destaques/hidratante-corporal-milk"
 ],
 [
 "Nivea Milk",
 "Nivea",
 "Loção",
 "Corpo",
 "Loção corporal de textura nutritiva, com fragrância; não indicada pelo fabricante para rosto.",
 "https://www.nivea.com.br/produtos/nivea-locao-hidratante-milk-pele-seca-a-extrasseca-40058083156970033.html"
 ],
 [
 "Nivea Soft Milk",
 "Nivea",
 "Loção",
 "Corpo",
 "Loção de uso corporal com absorção mais rápida.",
 "https://www.nivea.com.br/destaques/hidratante-corporal-milk"
 ],
 [
 "Profuse Nutrel B5",
 "Profuse",
 "Creme",
 "Corpo, Face, Mãos, Áreas ressecadas",
 "Creme multirreparador com pantenol e emolientes.",
 "https://www.profuse.com.br/produtos/nutrel-b5/"
 ],
 [
 "Profuse Nutrel Suavizante Balm",
 "Profuse",
 "Bálsamo",
 "Face",
 "Produto facial para pele sensível; conferir composição.",
 "https://www.profuse.com.br/linhas/nutrel/"
 ],
 [
 "Uriage Xémose Cérat",
 "Uriage",
 "Bálsamo",
 "Corpo, Face",
 "Cerato nutritivo para xerose intensa; confirmar comercialização brasileira.",
 "https://www.uriage.com/pt/pt/produtos/xemose-cerat"
 ],
 [
 "Uriage Xémose Creme Emoliente",
 "Uriage",
 "Creme",
 "Corpo, Face",
 "Creme relipidante para pele muito seca; confirmar comercialização brasileira.",
 "https://www.uriage.com/pt/pt/gamas/xemose"
 ],
 [
 "Vasenol Calming",
 "Vasenol",
 "Loção",
 "Corpo",
 "Loção corporal com extrato de aveia, verificar fragrância.",
 "https://www.vasenol.com.br/products.html"
 ],
 [
 "Vasenol Clinical",
 "Vasenol",
 "Loção",
 "Corpo",
 "Loção corporal para pele extrasseca; verificar fragrância.",
 "https://www.vasenol.com.br/products.html"
 ],
 [
 "Vasenol Geleia de Vaselina Original",
 "Vasenol",
 "Pomada",
 "Mãos, Áreas ressecadas",
 "Petrolato oclusivo 100%, para áreas muito ressecadas.",
 "https://www.vasenol.com.br/p/geleia-vaselina-original.html/07891150029323"
 ],
 [
 "Vasenol Nutrição do Cacau",
 "Vasenol",
 "Loção",
 "Corpo",
 "Hidratante perfumado; pode não ser primeira escolha para pele atópica.",
 "https://www.vasenol.com.br/products.html"
 ],
 [
 "Vasenol Repairing",
 "Vasenol",
 "Loção",
 "Corpo",
 "Loção para xerose; formulação conforme variante.",
 "https://www.vasenol.com.br/products.html"
 ]
];

const icons={
 calculator:'<defs><linearGradient id="med-dose-icon-ink" x2="1" y2="1"><stop stop-color="#377b90"/><stop offset="1" stop-color="#15394f"/></linearGradient><linearGradient id="med-dose-icon-gold" x2="1" y2="1"><stop stop-color="#ffe8a2"/><stop offset="1" stop-color="#bf9039"/></linearGradient></defs><rect x="15" y="8" width="34" height="48" rx="9" fill="#143c4d" opacity=".13" transform="translate(1 2)"/><rect x="15" y="7" width="34" height="48" rx="9" fill="url(#med-dose-icon-ink)" stroke="#17465a" stroke-width="1.4"/><rect x="21" y="14" width="22" height="11" rx="3" fill="#d9f3f3"/><path d="M25 20h14" stroke="#76b7c0" stroke-width="1.5" stroke-linecap="round"/><rect x="21" y="31" width="9" height="7" rx="2" fill="#a3dce0"/><rect x="21" y="42" width="9" height="7" rx="2" fill="#a3dce0"/><rect x="34" y="31" width="9" height="18" rx="2" fill="url(#med-dose-icon-gold)"/><path d="M36.5 38h4m-4 3h4" stroke="#654c24" stroke-linecap="round"/>',
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
function doseCatalog(){
 const catalog=Object.entries(DB).flatMap(([group,items])=>
  items.map(([name,brand])=>({group,name,brand})));
 return catalog.concat(
  window.hubAntihistamineCatalog||[],
  (window.hubAsmaDataset?.products||[]).map(({name,brand})=>({group:'inalatoria',name,brand}))
 );
}
function sourceHref(id){return id==='topicos'?FONTES.pele:id==='inalatoria'?FONTES.asma:id==='hidratantes'?'https://www.gov.br/anvisa/pt-br/sistemas/sistema-de-consultas/':ANVISA;}
function sourceLabel(id){return id==='topicos'?'Ministério da Saúde — potência':id==='inalatoria'?'GINA 2026':id==='hidratantes'?'Sistema de Consultas Anvisa':'Bulário eletrônico Anvisa';}
/* Potência relativa (I–VII) por formulação; idade conforme produto e bula da apresentação. */
const CORTICOIDE_TOPICO={
 'Hidrocortisona 1%':['Pediátrico','Uso pediátrico; a bula de Berlison não define uma idade mínima numérica.','Muito baixa (VII)','Muito baixa (VII)','Creme e pomada 1%. Em lactentes, evitar duração prolongada e oclusão por fraldas.','https://bula.com.br/original/berlison'],
 'Dexametasona 0,1%':['Pediátrico','Uso pediátrico; a bula consultada do acetato de dexametasona creme não define uma idade mínima numérica.','Muito baixa (VII)',null,'Apresentação cutânea isolada confirmada: creme 1 mg/g; não extrapolar para associações.','https://www.bula.gratis/laboratorio_teuto_brasileiro_s_a/1/acetato_de_dexametasona/profissional'],
 'Desonida 0,05%':['Pediátrico','Creme e pomada: uso pediátrico sem limite numérico especificado na bula consultada. Gel-creme: a partir de 3 meses.','Baixa (VI)','Média-baixa (V)','A idade de 3 meses refere-se ao gel-creme. Desonol creme e pomada foram descontinuados; não presumir disponibilidade.','https://consultaremedios.com.br/desonida/bula'],
 'Clobetasona 0,05%':['Lactentes (ref. UK)','A referência britânica inclui lactentes, sem idade numérica mínima; registro brasileiro de Eumovate não confirmado.','Média (moderada)','Média (moderada)','Creme e pomada descritos em documentos do Reino Unido; não presumir comercialização no Brasil.','https://www.medicines.org.uk/emc/product/3807/smpc'],
 'Furoato de mometasona 0,1%':['≥ 2 anos','A partir de 2 anos (Elocom creme e pomada).','Média (IV)','Alta (II)','Pomada é mais potente que creme nessa classificação; limitar área e duração.','https://erclinic.com.br/v2/bula/elocom-hypermarcas-5378/detalhes'],
 'Acetonido de triancinolona 0,1%':['Não definido no BR','Idade mínima não estabelecida para creme/pomada cutâneos isolados com registro brasileiro comprovado nesta revisão.','Média (IV; variável)','Média–alta (III–IV; variável)','Potências farmacológicas da preparação cutânea; apresentação isolada brasileira não confirmada. Não confundir com pomada bucal (orabase) ou associações.','https://www.msdmanuals.com/pt/profissional/multimedia/table/pot%C3%AAncia-relativa-dos-corticoides-t%C3%B3picos-selecionados'],
 'Aceponato de metilprednisolona 0,1%':['≥ 4 meses','A partir de 4 meses (Advantan, creme e pomada).','Média-baixa (V)','Média (IV)','Creme, pomada e unguento não são automaticamente intercambiáveis; a base modifica o efeito.','https://para-que-serve-remedio.com/advantan-leo-pharma-ltda-160895/bula-do-profissional-da-saude'],
 'Valerato de betametasona 0,1%':['≥ 1 ano','A partir de 1 ano (Betnovate creme e pomada).','Média (V)','Alta (III)','Pomada apresenta maior potência relativa que creme na tabela I–VII.','https://bula.com.br/original/betnovate-pomada'],
 'Dipropionato de betametasona 0,05%':['≥ 2 anos','A partir de 2 anos (Diprosone creme e pomada).','Alta (II–III)','Alta a muito alta (I–II)','A classe depende da fórmula: não classificar todo Diprosone pomada automaticamente como I.','https://bula.com.br/original/diprosone-creme'],
 'Fludroxicortida 0,0125%':['Pediátrico','Uso pediátrico (Drenison creme/pomada), sem idade mínima numérica na bula consultada.','Baixa (VI; MS)','Baixa (VI; MS)','Concentração 0,125 mg/g. Classificações de potência diferem entre compêndios; aqui é indicada a escala do MS.','https://bula.com.br/original/drenison'],
 'Propionato de clobetasol 0,05%':['≥ 1 ano','A partir de 1 ano (Psorex creme e pomada; bula brasileira).','Muito alta (I)','Muito alta (I)','Superpotente nas duas apresentações; em crianças, tratamento curto e monitorado.','https://bula.com.br/original/psorex-pomada']
};

/* Idade e teto regulatório sempre vinculados à apresentação, indicação e via.
   A ausência de um número verificado não deve gerar um "máximo" fictício. */
const MED_REGULATORY={
 olhos:{
  'Olopatadina':{age:'A partir de 3 anos (Patanol® 0,1% e Patanol® S 0,2%).',max:'Patanol® 0,1%: até 1 gota por olho a cada 12 horas. Patanol® S 0,2%: até 1 gota por olho ao dia.',source:'https://consultaremedios.com.br/patanol/bula'},
  'Cetotifeno':{age:'A indicação pediátrica depende da bula e da concentração do colírio.',max:'Não consolidada para todas as apresentações oftálmicas de cetotifeno.',verified:false},
  'Epinastina':{age:'A partir de 3 anos (Relestat® 0,05%).',max:'Relestat® 0,05%: 1 gota por olho afetado a cada 12 horas.',source:'https://www.abbvie.com.br/content/dam/abbvie-dotcom/br/documents/Relestat.pdf'},
  'Emedastina':{age:'A partir de 3 anos na rotulagem europeia de Emadine®; registro brasileiro não confirmado.',max:'Emadine® 0,05% (referência europeia): 1 gota por olho afetado 2 vezes/dia.',source:'https://www.ema.europa.eu/en/documents/product-information/emadine-epar-product-information_en.pdf'},
  'Azelastina':{age:'Não estabelecida para produto oftálmico brasileiro específico neste catálogo.',max:'Sem limite numérico de bula brasileira validado para esta apresentação ocular.',verified:false},
  'Cromoglicato dissódico':{age:'Depende da concentração e do produto oftálmico registrado.',max:'Sem teto único de bula validado para as diferentes apresentações.',verified:false},
  'Hialuronato de sódio':{age:'Depende do produto e de suas indicações de uso.',max:'Lubrificante ocular: não existe teto de dose universal aplicável a todas as marcas.',verified:false},
  'Carboximetilcelulose':{age:'Depende do produto e de suas indicações de uso.',max:'Lubrificante ocular: não existe teto de dose universal aplicável a todas as marcas.',verified:false},
  'Hipromelose':{age:'Depende da apresentação registrada.',max:'Lubrificante ocular: sem teto numérico único entre produtos.',verified:false},
  'Carmelose / glicerina':{age:'Depende da associação e da apresentação registrada.',max:'Lubrificante ocular: sem teto numérico único entre produtos.',verified:false},
  'Polietilenoglicol + propilenoglicol':{age:'Depende da versão de Systane® e de sua rotulagem.',max:'Lubrificante ocular: sem teto numérico único entre produtos.',verified:false},
  'Carbômero':{age:'Depende do gel oftálmico registrado.',max:'Gel oftálmico: sem teto numérico único validado para todas as marcas.',verified:false}
 },
 nasais:{
  'Budesonida':{age:'Varia conforme Busonid®, Noex® e concentração.',max:'Não há dose máxima única para todos os sprays e concentrações; ficha agrupada não autoriza extrapolação.',verified:false},
  'Furoato de mometasona':{age:'A partir de 2 anos para rinite alérgica (Nasonex® 50 µg/jato).',max:'Rinite: crianças 2–11 anos, 1 jato por narina/dia (100 µg/dia); adultos e ≥12 anos até 4 jatos por narina/dia (400 µg/dia) em resposta insuficiente.',source:'https://consultaremedios.com.br/nasonex/bula'},
  'Furoato de fluticasona':{age:'A partir de 2 anos (Avamys® 27,5 µg/jato).',max:'Rinite: até 2 jatos por narina uma vez ao dia (110 µg/dia); em crianças 2–11 anos iniciar com 1 jato por narina/dia.',source:'https://consultaremedios.com.br/avamys/bula'},
  'Propionato de fluticasona':{age:'A partir de 4 anos para Flixonase® 50 µg/jato.',max:'Rinite: crianças 4–11 anos até 1 jato por narina 2 vezes/dia (200 µg/dia); ≥12 anos até 2 jatos por narina 2 vezes/dia (400 µg/dia).',source:'https://br.gsk.com/media/6275/flixonase-spray-nasal-aquoso.pdf'},
  'Dipropionato de beclometasona':{age:'Depende da concentração e da apresentação de Clenil Nasal®.',max:'Dose máxima não consolidada entre as formulações de beclometasona nasal.',verified:false},
  'Triancinolona acetonida':{age:'Registro e idade brasileira não validados para Nasacort® neste catálogo.',max:'Não validada em bula brasileira da apresentação.',verified:false},
  'Ciclesonida':{age:'Registro e idade brasileira não validados para Omnaris® neste catálogo.',max:'Não validada em bula brasileira da apresentação.',verified:false},
  'Azelastina + propionato de fluticasona':{age:'A partir de 6 anos (Dymista®).',max:'Dymista®: 1 jato por narina a cada 12 horas (2 jatos por narina/dia).',source:'https://www.viatris.com.br/-/media/project/common/viatriscombr/pdf/leaflets_legacy_myl_brazil/1-dymista-bula-profissional.pdf'},
  'Olopatadina + furoato de mometasona':{age:'A partir de 12 anos (Ryaltris®).',max:'Ryaltris®: 2 jatos por narina a cada 12 horas (4 jatos por narina/dia).',source:'https://glenmarkpharma.com.br/wp-content/uploads/2026/10/Ryaltris_Bula_Paciente_VP00.pdf'}
 }
};
const MED_IBP_AGES={
 'Omeprazol':'Rotulagem da fonte citada (EUA): esofagite erosiva desde 1 mês em formulações pediátricas específicas; DRGE/EE 1–16 anos; adultos.',
 'Pantoprazol':'Rotulagem da fonte citada (EUA): a partir de 5 anos em apresentação oral específica para esofagite erosiva; adultos.',
 'Esomeprazol':'Rotulagem da fonte citada (EUA): desde 1 mês em indicações e apresentações pediátricas específicas; adultos.',
 'Lansoprazol':'Rotulagem da fonte citada (EUA): a partir de 1 ano para DRGE/EE nas apresentações previstas; adultos.',
 'Rabeprazol':'Rotulagem da fonte citada (EUA): comprimido a partir de 12 anos; sprinkle pediátrico 1–11 anos, conforme mercado.',
 'Dexlansoprazol':'Rotulagem da fonte citada (EUA): a partir de 12 anos; adultos.'
};
function medRegulatoryDetails(id,item){
 const name=item[0];
 let d=(MED_REGULATORY[id]||{})[name];
 if(id==='topicos'){
  const t=CORTICOIDE_TOPICO[name];
  d=t?{
   age:t[1],
   max:name==='Propionato de clobetasol 0,05%'
    ?'Psorex® creme/pomada: não exceder 50 g por semana; usar pelo menor período apropriado.'
    :'Não foi consolidado um teto quantitativo de bula para esta apresentação. Frequência, área e duração dependem do veículo e da indicação.',
   source:t[5],
   verified:name==='Propionato de clobetasol 0,05%'
  }:null;
 }
 if(id==='ibps'){
  const b=IBP_CLINICAL[name];
  d=b?{age:MED_IBP_AGES[name],max:b.max,source:b.source,sourceLabel:'Rotulagem da fonte (EUA)'}:null;
 }
 if(id==='hidratantes'){
  d={age:'Conforme a rotulagem da versão do hidratante; não presumir liberação neonatal.',max:'Não se aplica como dose máxima sistêmica. Frequência de aplicação e cuidados seguem o produto.',verified:false};
 }
 if(!d)d={age:'Faixa etária da apresentação ainda não validada no catálogo.',max:'Dose máxima de bula não validada para a apresentação específica.',verified:false};
 const source=d.source?'<a href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">'+esc(d.sourceLabel||'Fonte da apresentação')+'</a>':'';
 return '<section class="med-regulatory" aria-label="Faixa etária e dose máxima de bula">'+
  '<div class="med-regulatory-item"><span class="med-mini-label">Faixa etária de utilização</span><p>'+esc(d.age)+'</p></div>'+
  '<div class="med-regulatory-item"><span class="med-mini-label">Dose máxima em bula / por indicação</span><p>'+esc(d.max)+'</p></div>'+
  (source?'<div class="med-regulatory-source">'+source+'</div>':'')+
  (d.verified===false?'<p class="med-regulatory-pending">Não há limite único verificado para as apresentações agrupadas; nenhum valor foi presumido.</p>':'')+
  '</section>';
}

function corticoidesTopicosCards(data){
 const potencia='https://www.msdmanuals.com/pt/profissional/multimedia/table/pot%C3%AAncia-relativa-dos-corticoides-t%C3%B3picos-selecionados';
 const makeForm=(name,pot)=>'<section class="med-topical-form"><span class="med-topical-form-name">'+name+'</span><span class="med-topical-strength">'+(pot?esc(pot):'Não identificada como apresentação isolada')+'</span></section>';
 return '<div class="med-results med-results-topicos" aria-live="polite">'+data.map(item=>{
   const t=CORTICOIDE_TOPICO[item[0]]; if(!t)return '';
   const rawBrand=item[1]||'', maker=medMakerKey(rawBrand+' '+item[0]), style=medMakerVars(maker);
   return '<details class="med-prod med-prod-topical med-mf-'+maker+'" style="'+style+'" data-hub-medicamento><summary>'
    +medMakerLogo(maker)
    +'<span class="med-prod-head"><span class="hub-med-nome">'+esc(medRegisterMarks(item[0]))+'</span><span class="med-prod-brand">'+esc(medRegisterMarks(rawBrand))+'</span></span>'
    +'<span class="med-prod-tag">Idade: '+esc(t[0])+'</span><span class="med-prod-chevron">⌄</span></summary>'
    +'<div class="med-prod-detail">'+medRegulatoryDetails('topicos',item)+'<section class="med-topical-age"><span class="med-mini-label">A partir de qual idade?</span><p>'+esc(t[1])+'</p></section>'
    +'<section class="med-topical-presentations"><span class="med-mini-label">Creme ou pomada: potência específica</span><div class="med-topical-form-grid">'
    +makeForm('Creme',t[2])+makeForm('Pomada',t[3])+'</div></section>'
    +'<section class="med-topical-notes"><span class="med-mini-label">Observação clínica</span><p>'+esc(t[4])+'</p></section>'
    +'<section class="med-topical-sources"><a target="_blank" rel="noopener noreferrer" href="'+esc(t[5])+'">Idade e apresentações</a><a target="_blank" rel="noopener noreferrer" href="'+potencia+'">Tabela de potência</a></section>'
    +'</div></details>';
  }).join('')+'</div><p class="med-source">Classificação relativa I–VII por formulação, não equivalente à concentração isoladamente. A idade indicada depende da apresentação específica e da evidência disponível.</p>';
}

function ibpSafetyHtml(){
 const common=IBP_CLASS_SAFETY.common.map(x=>'<span class="med-ibp-chip">'+esc(x)+'</span>').join('');
 const important=IBP_CLASS_SAFETY.important.map(x=>'<div class="med-ibp-alert"><span>'+esc(x[0])+'</span><p>'+esc(x[1])+'</p></div>').join('');
 return '<section class="med-ibp-safety"><span class="med-mini-label">Eventos adversos e conduta</span><div class="med-ibp-chips">'+common+'</div><div class="med-ibp-alerts">'+important+'</div><div class="med-ibp-monitor"><span>Monitorização prática</span><p>'+esc(IBP_CLASS_SAFETY.monitor)+'</p></div></section>';
}
function ibpGuideBox(){
 return '<section class="med-ibp-eoe-guide"><div class="med-ibp-guide-kicker">EoE — dose de diretriz, sem “consultar bula”</div><div class="med-ibp-guide-grid">'+
  '<div><span>Adulto</span><p>ACG 2025: omeprazol 20 mg 2x/dia ou 40 mg/dia, ou IBP equivalente.</p></div>'+
  '<div><span>Pediatria</span><p>1 mg/kg/dose 2x/dia (2 mg/kg/dia), em omeprazol-equivalente. ESPGHAN: máximo 60 mg/dia entre 4–10 anos e 80 mg/dia entre 11–18 anos.</p></div>'+
  '<div><span>Reavaliação</span><p>8–12 semanas com sintomas + endoscopia + biópsias. Sintomas isolados não definem resposta histológica.</p></div>'+
  '</div><p class="med-ibp-guide-note">A ficha diferencia dose regulatória da apresentação e dose aceita por diretriz para EoE.</p></section>';
}
function ibpHydrateHtml(){
 return '<section class="med-ibp-hydrate"><div class="med-ibp-hydrate-title">'+esc(IBP_HYDRATE_EXPLAINER.title)+'</div><div class="med-ibp-hydrate-grid">'+
  IBP_HYDRATE_EXPLAINER.points.map(x=>'<div><span>'+esc(x[0])+'</span><p>'+esc(x[1])+'</p></div>').join('')+
  '</div><p>'+esc(IBP_HYDRATE_EXPLAINER.note)+'</p></section>';
}
function ibpCards(data){
 const cardsHtml=data.map(item=>{
  const name=item[0],rawBrand=item[1]||'',d=IBP_CLINICAL[name];
  if(!d)return '';
  const maker=medMakerKey(rawBrand+' '+name),style=medMakerVars(maker);
  const sources='<div class="med-ibp-sources"><span>Fontes</span>'+
   '<a href="'+esc(IBP_GUIDES.brasil)+'" target="_blank" rel="noopener noreferrer">ASBAI/SBP 2026</a>'+
   '<a href="'+esc(IBP_GUIDES.acg)+'" target="_blank" rel="noopener noreferrer">ACG 2025</a>'+
   '<a href="'+esc(IBP_GUIDES.espghan)+'" target="_blank" rel="noopener noreferrer">ESPGHAN 2024</a>'+
   '<a href="'+esc(d.source)+'" target="_blank" rel="noopener noreferrer">Fonte regulatória</a></div>';
  return '<details class="med-prod med-prod-ibp med-mf-'+maker+'" style="'+style+'" data-hub-medicamento>'+
   '<summary>'+medMakerLogo(maker)+'<span class="med-prod-head"><span class="hub-med-nome">'+esc(name)+'</span><span class="med-prod-brand">'+esc(medRegisterMarks(rawBrand))+'</span></span>'+
   '<span class="med-prod-tag">'+esc(d.shortTiming)+'</span><span class="med-prod-chevron">⌄</span></summary>'+
   '<div class="med-prod-detail med-ibp-detail">'+medRegulatoryDetails('ibps',item)+
    '<div class="med-ibp-dose-grid">'+
     '<section><span class="med-mini-label">Melhor horário</span><p>'+esc(d.timing)+'</p></section>'+
     '<section><span class="med-mini-label">Dose no adulto</span><p>'+esc(d.adult)+'</p></section>'+
     '<section><span class="med-mini-label">Dose na pediatria</span><p>'+esc(d.pediatric)+'</p></section>'+
     '<section><span class="med-mini-label">EoE quando não consta na indicação do produto</span><p>'+esc(d.eoe)+'</p></section>'+
     '<section><span class="med-mini-label">Dose máxima / teto</span><p>'+esc(d.max)+'</p></section>'+
     '<section><span class="med-mini-label">Apresentação</span><p>'+esc(d.presentation)+'</p></section>'+
    '</div>'+
    '<section class="med-ibp-difference"><span class="med-mini-label">O que diferencia este IBP</span><p>'+esc(d.difference)+'</p></section>'+
    '<section class="med-ibp-solid"><span class="med-mini-label">Sal / hidrato / forma sólida</span><p>'+esc(d.solid)+'</p></section>'+
    '<section class="med-ibp-interaction"><span class="med-mini-label">Interações / atenção prática</span><p>'+esc(d.interaction)+'</p></section>'+
    ibpSafetyHtml()+sources+
   '</div></details>';
 }).join('');
 return ibpGuideBox()+'<div class="med-results med-results-ibp" aria-live="polite">'+cardsHtml+'</div>'+ibpHydrateHtml()+
 '<p class="med-source">Revisão clínica: 24/11/2026. Dose de EoE pediátrica é apresentada como recomendação de diretriz/omeprazol-equivalente quando não há indicação específica da apresentação. Teto de síndrome hipersecretora não é teto de rotina para DRGE ou EoE.</p>';
}
function cards(data,id){
 const anvisaLink=(id==='hidratantes')?'https://www.gov.br/anvisa/pt-br/sistemas/sistema-de-consultas/':ANVISA;
 const anvisaLabel=id==='hidratantes'?'Regularização / fonte do produto':'Registro sanitário';
 return '<div class="med-results" aria-live="polite">'+data.map((item,i)=>{
  const rawName=item[0]||'', rawBrand=item[1]||'', form=esc(item[2]),tag=esc(item[3]),note=esc(item[4]);
  const maker=medMakerKey(rawBrand+' '+rawName), style=medMakerVars(maker);
  const name=esc(medRegisterMarks(rawName)),brand=esc(medRegisterMarks(rawBrand));
  return '<details class="med-prod med-mf-'+maker+'" style="'+style+'" data-hub-medicamento data-item="'+i+'"><summary>'+medMakerLogo(maker)+'<span class="med-prod-head"><span class="hub-med-nome">'+name+'</span><span class="med-prod-brand">'+brand+'</span></span><span class="med-prod-tag">'+tag+'</span><span class="med-prod-chevron">⌄</span></summary>'+
  '<div class="med-prod-detail">'+medRegulatoryDetails(id,item)+'<div><span class="med-mini-label">Apresentações / veículo</span><p>'+form+'</p></div><div><span class="med-mini-label">Indicação e orientações clínicas</span><p>'+note+'</p></div>'+
  '<a href="'+anvisaLink+'" target="_blank" rel="noopener noreferrer">'+anvisaLabel+'</a>'+ (id==='hidratantes' && /^https:\/\//.test(item[5]||'')?'<a class="med-brand-source" href="'+esc(item[5])+'" target="_blank" rel="noopener noreferrer">Fonte do fabricante / apresentação</a>':'')+'</div></details>';
 }).join('')+'</div><p class="med-source">Os nomes comerciais são exibidos com marca registrada quando identificados no catálogo. A identidade de cor segue o fabricante ou a marca; itens sem fabricante inequívoco permanecem neutros. <a href="'+sourceHref(id)+'" target="_blank" rel="noopener noreferrer">'+sourceLabel(id)+'</a>.</p>';
}
let initDone=false,moistPrices=new Map(),moistChecked=false,moistBusy=false,moistMessage='';
function init(){
 const root=document.getElementById('medApp');if(!root || initDone)return;
 initDone=true;
 root.innerHTML='<div class="med-intro"><div class="med-eyebrow">CATÁLOGO FARMACOLÓGICO</div><h1>Medicamentos</h1><p>Selecione uma classe. Os medicamentos aparecem em cards horizontais; a ficha se expande no próprio card, com princípio ativo, nome comercial, fabricante, indicação, apresentação e cuidados.</p></div>'+
 '<div class="med-categories">'+CATS.map(c=>'<section class="med-category" data-med-category="'+c.id+'"><button type="button" class="med-category-toggle" aria-expanded="false" aria-controls="med-category-'+c.id+'"><span class="med-category-icon">'+catIcon(c.icon)+'</span><span class="med-category-copy"><span class="med-category-name">'+esc(c.name)+'</span><span class="med-category-sub">'+esc(c.sub)+'</span></span><span class="med-category-arrow" aria-hidden="true">⌄</span></button><div id="med-category-'+c.id+'" class="med-category-body" hidden></div></section>').join('')+'</div>'+
 '<p class="med-endnote">Dados editoriais revisados em 24/11/2026. Doses, horários, limites e condutas ficam descritos nas próprias fichas; fontes regulatórias e diretrizes aparecem apenas como documentação de apoio.</p>';
 root.addEventListener('click',e=>{
  const toggle=e.target.closest('.med-category-toggle');
  if(toggle){openCategory(toggle.closest('[data-med-category]').dataset.medCategory);return;}
  if(e.target.matches('[data-med-price-check]')){e.preventDefault();loadMoistPrices(true);}
 });
 root.addEventListener('input',e=>{
  if(e.target.matches('[data-med-search], [data-med-moist-search], [data-med-budget]'))renderCurrent();
 });
 root.addEventListener('change',e=>{
  if(e.target.matches('[data-med-texture], [data-med-area], [data-med-brand]'))renderCurrent();
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
  if(id==='dose'){
   if(typeof window.hubDoseMount==='function')window.hubDoseMount(body,doseCatalog());
   else{
    body.innerHTML='<p class="med-empty">A calculadora não carregou. Atualize a página para tentar novamente.</p>';
    delete body.dataset.ready;
   }
  }else if(id==='anti'){
   const original=document.querySelector('#page-antihistaminicos #ahApp');
   if(original){body.appendChild(original);if(typeof window.ahInit==='function')window.ahInit();}
   else body.innerHTML='<p>Catálogo de anti-histamínicos não encontrado.</p>';
  }else{
   const controls=id==='hidratantes'
    ? '<div class="med-moist-stats">'+MOIST.length+' hidratantes • '+new Set(MOIST.map(x=>x[1])).size+' marcas • selecione uma combinação</div><div class="med-filters med-moist-filters"><label>Marca<select data-med-brand><option value="">Todas as marcas</option>'+Array.from(new Set(MOIST.map(x=>x[1]))).sort((a,b)=>a.localeCompare(b,'pt-BR')).map(brand=>'<option value="'+esc(brand)+'">'+esc(brand)+'</option>').join('')+'</select></label><label>Textura<select data-med-texture><option value="">Todas</option><option>Creme</option><option>Loção</option><option>Gel-creme</option><option>Bálsamo</option><option>Pomada</option></select></label><label>Área corporal<select data-med-area><option value="">Todas</option><option>Corpo</option><option>Face</option><option>Mãos</option><option>Áreas ressecadas</option><option>Bebê</option></select></label><label>Preço máximo (R$)<input type="number" min="0" step="0.01" inputmode="decimal" data-med-budget placeholder="Ex.: 80"></label><label class="med-moist-search-label">Pesquisar produto<input type="search" data-med-moist-search autocomplete="off" placeholder="Hidratante, linha, ativo..."></label></div><div class="med-price-status" data-med-price-status></div><button type="button" class="med-check-prices" data-med-price-check>Consultar ofertas verificadas</button>'
    : '<div class="med-filters med-filters-basic"><label>Pesquisar nesta categoria<input type="search" data-med-search autocomplete="off" placeholder="Genérico, marca, classe..."></label></div>';
   body.innerHTML=controls+'<div class="med-list-slot"></div>';
  }
 }
 if(id!=='anti' && id!=='dose')renderCategory(id);
 if(window.HubPages)window.HubPages.open(body,CATS.find(c=>c.id===id)?.name,{kind:'categoria',key:id});
}
function renderCurrent(){const active=document.querySelector('#medApp .med-category.is-open');if(active)renderCategory(active.dataset.medCategory);}
function renderCategory(id){
 const sec=document.querySelector('#medApp [data-med-category="'+id+'"]'),slot=sec&&sec.querySelector('.med-list-slot');if(!slot)return;
 if(id==='hidratantes')return renderMoist(sec,slot);
 const q=norm(sec.querySelector('[data-med-search]')?.value);
 if(id==='inalatoria' && typeof window.hubAsmaRender==='function') return window.hubAsmaRender(slot,q);
 const filtered=(DB[id]||[]).filter(x=>!q||norm(x.join(' ')).includes(q));
 slot.innerHTML=filtered.length?(id==='topicos'?corticoidesTopicosCards(filtered):id==='ibps'?ibpCards(filtered):cards(filtered,id)):'<p class="med-empty">Nenhum medicamento encontrado para esta pesquisa.</p>';
}
function renderMoist(sec,slot){
 const texture=sec.querySelector('[data-med-texture]').value;
 const area=sec.querySelector('[data-med-area]').value;
 const raw=sec.querySelector('[data-med-budget]').value;
 const budget=raw===''?null:Number(raw);
 const brand=sec.querySelector('[data-med-brand]')?.value||'';
 const query=norm(sec.querySelector('[data-med-moist-search]')?.value||'');
 const matched=MOIST.filter(x=>(!brand||x[1]===brand)&&(!texture||x[2]===texture)&&(!area||x[3].includes(area))&&(!query||norm([x[0],x[1],x[4]].join(' ')).includes(query)));
 const status=sec.querySelector('[data-med-price-status]');
 if(raw!=='' && (!Number.isFinite(budget)||budget<0)){
  status.textContent='Informe um valor válido em reais.';slot.innerHTML='';return;
 }
 if(budget===null){
  status.textContent=matched.length+' produtos encontrados. Filtre por marca, textura, área ou nome. '+(moistMessage||'O preço só aparece quando existe oferta verificável.');
  slot.innerHTML=cards(matched,'hidratantes');return;
 }
 const prices=matched.map(x=>({item:x,offers:(moistPrices.get(x[0])||[]).filter(o=>o.price<=budget)}));
 const affordable=prices.filter(x=>x.offers.length).sort((a,b)=>Math.min(...a.offers.map(o=>o.price))-Math.min(...b.offers.map(o=>o.price)));
 const unknown=matched.filter(x=>!moistPrices.has(x[0])||!moistPrices.get(x[0]).length);
 // A consulta é iniciada somente por clique para evitar dezenas de solicitações desnecessárias.
 const verified=affordable.map(({item,offers})=>{
  const min=Math.min(...offers.map(o=>o.price));
  const best=offers.reduce((a,b)=>Number(a.price)<=Number(b.price)?a:b);
  return '<div class="med-price-result">'+cards([item],'hidratantes')+'<div class="med-price-proof">Menor oferta verificada: '+fmt(min)+' · '+esc(best.pharmacy)+' · '+offers.length+' oferta(s) dentro do orçamento. <a href="'+esc(best.url)+'" target="_blank" rel="noopener noreferrer">Conferir oferta e embalagem</a></div></div>';
 }).join('');
 status.textContent=moistBusy?'Consultando ofertas dos produtos filtrados…':moistMessage||
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
 const sec=document.querySelector('#medApp [data-med-category="hidratantes"]');
 const brand=sec?.querySelector('[data-med-brand]')?.value||'';
 const texture=sec?.querySelector('[data-med-texture]')?.value||'';
 const area=sec?.querySelector('[data-med-area]')?.value||'';
 const q=norm(sec?.querySelector('[data-med-moist-search]')?.value||'');
 const eligible=MOIST.filter(x=>(!brand||x[1]===brand)&&(!texture||x[2]===texture)&&(!area||x[3].includes(area))&&(!q||norm([x[0],x[1],x[4]].join(' ')).includes(q)));
 const requests=eligible.map(x=>x[0]);let counter=0,configured=false,disabled=false;
 async function worker(){
  while(counter<requests.length&&!disabled){
   const name=requests[counter++];
   try{
    const res=await fetch('/api/farmacias-precos',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({medication:name,city,uf})});
    if(!res.ok){moistPrices.set(name,[]);continue;}
    const data=await res.json();if(data.configured)configured=true;
    const offers=(Array.isArray(data.offers)?data.offers:[]).filter(o=>o.verified===true&&Number(o.price)>0&&Number.isFinite(Number(o.price))&&/^https:\/\//.test(o.url||''));
    moistPrices.set(name,offers);
    if(data.configured===false){disabled=true;break;}
   }catch(_){moistPrices.set(name,[]);}
  }
 }
 await Promise.all([worker(),worker(),worker()]);
 moistBusy=false;moistChecked=true;
 moistMessage=configured?'Consulta concluída para '+eligible.length+' produtos filtrados. Os valores dependem das ofertas reais disponíveis no fornecedor.':'Integração de preços não configurada. Os hidratantes permanecem no catálogo, mas ainda não é possível filtrá-los por preço de venda.';
 renderCurrent();
}
window.medsInit=init;window.medsOpenCategory=id=>openCategory(id,true);
})();
