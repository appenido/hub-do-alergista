/* Hub do Alergista — IG: produto + peso -> informações na própria home.
 * Apenas informação orientativa para reposição de IgG. Sem identificação, contas ou storage.
 * Fontes por produto são explícitas; protocolos sem equivalência validada não geram bomba.
 */
(function () {
'use strict';
var current=null;
var REF={
  aaaai:{url:'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/2025-Inborn-errors-of-immunity-pp.pdf#page=3',title:'AAAAI/ACAAI/CIS — Inborn errors of immunity practice parameter (Ann Allergy Asthma Immunol, 2026), recomendações 8.1–8.4'},
  eaaci:{url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC13465973/',title:'EAACI / Allergy 2026 — Medical Algorithm: Personalized Immunoglobulin Replacement Therapy for Inborn Errors of Immunity'},
  ukpin:{url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC9585546/',title:'BSI/UKPIN — consenso de terapia de reposição de imunoglobulinas (2022), recomendação 10'},
  brasil:{url:'https://www.scielo.br/j/eins/a/YkdwTg3JVVTjzHB49mNVWdC/?lang=pt',title:'II Consenso Brasileiro sobre o uso de imunoglobulina humana em imunodeficiências primárias (Einstein / especialistas brasileiros)'},
  anvisa:{url:'https://consultas.anvisa.gov.br/#/bulario/',title:'Anvisa — Bulário eletrônico, confirmar bula vigente da apresentação brasileira'}
};
var P={
  privigen_10:{
    source:'Bula do fabricante CSL Behring, seção Modo de usar / velocidades, Brasil',
    url:'https://labeling.cslbehring.com/pi/br/sandoglobulina-privigen/pt/sandoglobulina-privigen-bula-prof-saude.pdf#page=17',
    kind:'IV',rates:[0.3,0.6,1.2,2.4,4.8],interval:30,initial:'0,3 mL/kg/h durante aproximadamente 30 minutos; aumento gradual se tolerado.',
    limit:'Limite habitual de 4,8 mL/kg/h. O limite excepcional de 7,2 mL/kg/h somente pode ser considerado nas condições previstas em bula (IDP com boa tolerância prévia à taxa de 4,8 mL/kg/h).',
    schedule:'Degraus intermediários de 30 minutos são um exemplo operacional conservador; a bula exige progressão gradual, mas não fixa esses degraus.',
    status:'br'
  },
  octagam_10:{
    source:'Octapharma — Octagam 10% (SmPC 2024; referência internacional, com confirmação brasileira obrigatória)',
    url:'https://www.octagam.com/dosing-and-infusion',
    kind:'IV',rates:[0.6,1.2,2.4,4.8,7.2],interval:30,
    initial:'Início de 0,01 mL/kg/min = 0,6 mL/kg/h; a orientação brasileira histórica admite faixa inicial de 0,01–0,02 mL/kg/min.',
    limit:'Máximo de 0,12 mL/kg/min (7,2 mL/kg/h), sujeito a tolerância, indicação e bula vigente. Dermatomiosite: limites próprios, não utilizar esta tabela.',
    schedule:'Escalonamento intermediário ilustrativo; confirmar dose e teto pela bula atual e indicação. Em pacientes de risco renal ou trombótico podem ser necessários limites muito inferiores.',
    status:'intl'
  },
  kiovig_10:{
    source:'KIOVIG — informação oficial europeia (EMA) e protocolo do Hospital Sírio-Libanês, com conferência da bula brasileira',
    url:'https://www.ema.europa.eu/pt/documents/product-information/kiovig-epar-product-information_pt.pdf',
    complement:'https://guiafarmaceutico.hsl.org.br/imunoglobulina-humana',
    kind:'IV',rates:[0.5,1,2,3,4,5,6],interval:30,
    initial:'0,5 mL/kg/h durante 30 min; se tolerado, 1 mL/kg/h; incrementos de 1 mL/kg/h a cada 30 minutos no protocolo HSL.',
    limit:'Máximo de referência de 6 mL/kg/h. Taxas excepcionais em pacientes IDP muito tolerantes não são habilitadas automaticamente.',
    schedule:'Progressão do protocolo hospitalar HSL; usar somente após conferir a bula brasileira e condições clínicas.',
    status:'intl'
  },
  flebogamma_10:{
    source:'Bula brasileira Flebogamma 10% DIF, seção 6 (Grifols)',
    url:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Flebogamma-Paciente-Consulta-Remedios.pdf',
    kind:'IV',rates:[0.6,1.2,2.4,3.6,4.8],interval:30,
    initial:'0,01 mL/kg/min nos primeiros 30 min, depois 0,02; 0,04; 0,06; e no máximo 0,08 mL/kg/min.',
    limit:'Máximo de 4,8 mL/kg/h. Em reações prévias, a bula prevê limites menores, frequentemente até 0,04 mL/kg/min (2,4 mL/kg/h).',
    schedule:'Escalonamento de 30 minutos descrito na bula brasileira; não avançar se houver reação.',
    status:'br'
  },
  tegeline_5:{
    source:'Tégéline 5% — bula profissional brasileira histórica (LFB); validar edição atual',
    url:'https://bula.gratis/lfb_hemoderivados_e_biotecnologia_ltda/1/tegeline/profissional',
    kind:'IV',rates:[1,4],interval:30,
    initial:'Primeiros 30 minutos: não ultrapassar 1 mL/kg/h.',
    limit:'Após 30 minutos, aumentar gradualmente conforme tolerância até 4 mL/kg/h. A fonte não fixa os incrementos intermediários.',
    schedule:'Somente taxa inicial e teto são apresentados; não presumir passagem imediata para o teto.',
    status:'historical'
  },
  endobulin_5:{
    source:'Registro e apresentação necessitam conciliação: fontes disponíveis identificam Endobulin KIOVIG 10%, não confirmam Endobulin S/D 5%',
    url:'https://consultas.anvisa.gov.br/#/bulario/',
    kind:'IV',rates:[],interval:30,
    initial:'Não é seguro programar bomba para Endobulin S/D 5% a partir de dados de Endobulin KIOVIG 10%.',
    limit:'Verifique o nome exato e a concentração no frasco e na bula atual; a diferença entre 5% e 10% altera volumes e velocidades.',
    schedule:'Velocidade automática indisponível até validação da formulação. Não extrapolar outro medicamento.',
    status:'unverified'
  },
  gammaked_10:{
    source:'GAMMAKED 10% — bula profissional FDA/DailyMed, indicação de imunodeficiência primária; confirmar registro e bula brasileira',
    url:'https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?audience=professional&setid=8c004331-7a91-8046-7510-9b9b7d33ced7',
    kind:'IV',rates:[0.6,1.2,2.4,4.8],interval:30,
    initial:'1 mg/kg/min = 0,01 mL/kg/min = 0,6 mL/kg/h no início, para reposição em imunodeficiência primária.',
    limit:'Até 8 mg/kg/min = 0,08 mL/kg/min = 4,8 mL/kg/h, se bem tolerado.',
    schedule:'Somente taxa inicial e teto são explicitamente definidos nesta referência; os degraus intermediários e intervalos de 30 minutos são ilustrativos, não uma prescrição de bula.',
    status:'intl'
  },
  gamunex_10:{
    source:'GAMUNEX-C 10% — bula fabricante Grifols e DailyMed, reposição de IgG; confirmar bula brasileira',
    url:'https://www.gamunex-c.com/en/hcp/pidd/dosing-administration',
    complement:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ade6b84a-e95b-0a49-3296-f56208fdf35b',
    kind:'IV',rates:[0.6,1.2,2.4,4.8],interval:30,
    initial:'1 mg/kg/min (0,01 mL/kg/min) = 0,6 mL/kg/h no início, para reposição em imunodeficiência primária.',
    limit:'Até 8 mg/kg/min (0,08 mL/kg/min) = 4,8 mL/kg/h se bem tolerado.',
    schedule:'Degraus intermediários de 30 minutos são ilustrativos; a fonte não impõe esses incrementos.',
    status:'intl'
  },
  hizentra_20:{
    source:'Bula profissional brasileira Hizentra 20% (CSL Behring), administração por bomba subcutânea, reposição de IgG',
    url:'https://labeling.cslbehring.com/pi/br/hizentra/pt/hizentra-bula-prof-saude.pdf#page=14',
    kind:'SC',ratesFirst:[15],ratesNext:[25],volFirst:15,volNext:25,
    initial:'Primeira infusão: até 15 mL/h por local e até 15 mL por local.',
    limit:'Infusões subsequentes bem toleradas: até 25 mL/h por local e até 25 mL por local; até 8 locais simultâneos, conforme bula para reposição.',
    status:'br'
  },
  cuvitru_20:{
    source:'Bula brasileira Cuvitru 20% (Takeda), seção Velocidade de infusão',
    url:'https://assets-dam.takeda.com/raw/upload/v1662721748/legacy-dotcom/siteassets/pt-br/home/what-we-do/produtos/CUV_0421_0721_VP.pdf',
    kind:'SC',ratesFirst:[10,20],ratesNext:[10,20],
    initial:'Iniciar com 10 mL/h por local e aumentar, se tolerado e após intervalo mínimo de 10 minutos, até 20 mL/h por local nas duas primeiras infusões.',
    limit:'Nas infusões posteriores, a taxa pode ser elevada conforme tolerância e bula; esta calculadora não define teto numérico adicional sem validação.',
    status:'br'
  },
  hyqvia_10:{
    source:'Bula profissional HyQvia (Takeda), tabela de velocidade por local e titulação de dose',
    url:'https://www.fastmedicamentos.com.br/wp-content/uploads/2025/07/Bula-Hyqvia-Profissional.pdf',
    kind:'fSC',ratesFirstLow:[5,10,20,40,80],ratesNextLow:[10,20,40,80,160],ratesFirstHigh:[10,30,60,120,240],ratesNextHigh:[10,30,120,240,300],
    initial:'Administrar a hialuronidase recombinante primeiro e iniciar a IgG 10% pela mesma agulha/local no intervalo previsto em bula (até 10 minutos). A velocidade depende do peso e da tolerância, diferenciando as duas primeiras das infusões subsequentes.',
    limit:'Não misturar os dois componentes. Seguir titulação gradual da dose e intervalo entre aplicações; a velocidade máxima não autoriza iniciar na dose mensal completa sem titulação.',
    status:'br'
  },
  gammanorm_165:{
    source:'Gammanorm 165 mg/mL — Resumo das Características do Medicamento (Octapharma, Portugal), referência internacional',
    url:'https://www.octapharma.pt/api/download/x/78db219a10/rcm-gammanorm.pdf',
    kind:'SC',ratesFirst:[15],ratesNext:[25],volFirst:25,volNext:35,
    initial:'Bomba subcutânea: 15 mL/h por local inicialmente, conforme RCM português.',
    limit:'Se tolerado, aumentar 1–2 mL/h por local em aplicações subsequentes até 25 mL/h por local; 100 mL/h para todos os locais combinados. Volume por local até 25 mL antes da décima aplicação, até 35 mL após titulação.',
    status:'intl'
  }
};

// Datas de PRIMEIRA concessão: só preencher mediante ato/publicação original verificável.
// A data de renovação, de bula, de TUSS ou de atualização do Rol não equivale ao primeiro registro.
var IG_REGULATORIO={
  privigen_10: {data:null,nota:'Data da concessão original não confirmada em publicação primária. Há referência a processo regulatório em 2010, que não comprova a aprovação inicial.'},
  octagam_10: {data:null,nota:'Data de concessão original não confirmada em publicação primária.'},
  kiovig_10: {data:null,nota:'Data de concessão original da apresentação brasileira não confirmada em publicação primária.'},
  flebogamma_10: {data:null,nota:'Data original não confirmada. A data de aprovação ou atualização de bula não deve ser tratada como data de registro.'},
  tegeline_5: {data:null,nota:'Data original não confirmada. Verificar a situação atual do produto e apresentação na Anvisa.'},
  endobulin_5: {data:null,nota:'Identidade e situação cadastral de Endobulin S/D 5% pendentes de confirmação; não confundir com Endobulin KIOVIG 10%.'},
  gammaked_10: {data:null,nota:'Registro brasileiro da apresentação GAMMAKED 10% não validado; bula internacional não comprova registro na Anvisa.'},
  gamunex_10: {data:null,nota:'Há documentos brasileiros para GAMUNEX, mas a data inicial e a equivalência com a apresentação GAMUNEX-C exibida ainda requerem confirmação.'},
  hizentra_20: {data:'21/09/2015',nota:'Registro inicial documentado no Diário Oficial da União de 21/09/2015; conferir situação atual na Anvisa.',url:'https://transparencia.mpf.mp.br/conteudo/diarios-e-boletins/diario-oficial-da-uniao-1/2015/dou1_2015_09_21_suplementar.pdf'},
  cuvitru_20: {data:null,nota:'Há registro documental no DOU de 26/11/2018, sem confirmação de que essa tenha sido a primeira concessão.',url:'https://pesquisa.in.gov.br/imprensa/servlet/INPDFViewer?captchafield=firstAccess&data=26%2F11%2F2018&jornal=531&pagina=40'},
  hyqvia_10: {data:'25/09/2017',nota:'Primeiro registro de HyQvia anunciado pela Anvisa com publicação no DOU de 25/09/2017; data da notícia original: 26/09/2017.',url:'https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2017/aprovada-nova-imunoglobulina-para-terapia-de-reposicao'},
  gammanorm_165: {data:null,nota:'Data inicial e situação regulatória atual da apresentação brasileira não confirmadas; fonte de velocidade utilizada neste Hub é internacional.'}
};
var IG_FONTES_REG={
  anvisa:'https://www.gov.br/anvisa/pt-br/sistemas/consulta-a-registro-de-medicamentos',
  ans:'https://www.gov.br/ans/pt-br/acesso-a-informacao/participacao-da-sociedade/atualizacao-do-rol-de-procedimentos/cobertura-assistencial',
  ansIg:'https://www.gov.br/ans/pt-br/arquivos/acesso-a-informacao/participacao-da-sociedade/consultas-publicas/cp81/medicamentos/re_215_imunoglobulinas_imunodeficiencias.pdf',
  seguro:'https://www.frontiersin.org/journals/immunology/articles/10.3389/fimmu.2026.1901301/full',
  aaaai:'https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/2025-Inborn-errors-of-immunity-pp.pdf'
};
var IG_RISCO_FORMULACAO={
  privigen_10:'Sem sacarose; isso não elimina o risco de lesão renal, trombose, hemólise ou reação infusional associado à via IV.',
  octagam_10:'A formulação contém maltose: conferir métodos de glicemia compatíveis. Reações sistêmicas seguem relacionadas a dose, taxa e fatores do paciente.',
  kiovig_10:'Avaliar função renal, estado volêmico e risco trombótico; a ausência de sacarose não elimina reações graves.',
  flebogamma_10:'Contém sorbitol; revisar a bula quanto a contraindicações relacionadas ao excipiente e riscos específicos.',
  tegeline_5:'A bula utilizada é histórica; não atribuir perfil de risco comparativo ou indicação preferencial sem confirmação da formulação atual.',
  endobulin_5:'Apresentação 5% não conciliada com fonte regulatória atual; não afirmar superioridade de segurança.',
  gammaked_10:'As evidências internacionais não permitem compará-lo diretamente com outras marcas brasileiras quanto a eventos raros.',
  gamunex_10:'O produto GAMUNEX-C da referência internacional não deve ser automaticamente igualado a outra apresentação nacional.',
  hizentra_20:'Predominam eritema, edema, desconforto e prurido locais; eventos sistêmicos são menos frequentes do que na administração IV.',
  cuvitru_20:'Predominam eventos locais, geralmente leves e autolimitados; avaliar hipersensibilidade e técnica de aplicação.',
  hyqvia_10:'A hialuronidase permite volumes maiores por local; edema e desconforto local podem ser mais expressivos, embora o perfil sistêmico tenda a ser mais favorável do que na via IV.',
  gammanorm_165:'Predominam eventos locais; confirmar formulação e registro brasileiro antes de extrapolar informações de RCM internacional.'
};

var ctx={
  pre:[
    'Confirmar indicação de reposição, dose individual, IgG, infecções, exames pertinentes, peso de cálculo e necessidade de ajuste. O peso isolado não estabelece elegibilidade.',
    'Checar fabricante, concentração, via, validade, aspecto, lote, alergia ou reação anterior, intervalo desde a última infusão e disponibilidade de equipamento de emergência.',
    'Avaliar risco renal, trombose, hiperviscosidade, desidratação e sobrecarga volêmica; garantir hidratação e monitorização adequadas, sem prescrever hidratação automática a todos.',
    'Pré-medicação não é rotineira. Anti-H1 e antitérmico podem ser considerados conforme histórico de reação, mas não previnem anafilaxia.'
  ],
  during:[
    'Verificar sinais vitais e sintomas antes e durante a administração, especialmente no início e em cada aumento de velocidade.',
    'A tabela corresponde à apresentação selecionada; protocolos acadêmicos e institucionais podem estabelecer velocidades mais conservadoras. Nunca ultrapassar a bula brasileira vigente nem antecipar aumentos sem tolerabilidade.',
    'Avançar somente se o paciente estiver tolerando; reduzir ou interromper diante de reação e reavaliar antes de reiniciar.',
    'Na suspeita de anafilaxia, interromper a imunoglobulina e seguir protocolo de emergência com adrenalina intramuscular quando indicada; não apenas desacelerar a bomba.'
  ],
  post:[
    'Observar segundo via, marca, risco e histórico (a primeira infusão, troca de marca e intervalo prolongado exigem maior vigilância).',
    'Orientar sinais de alerta tardios: cefaleia intensa e rigidez nucal, oligúria, dispneia, dor torácica, edema assimétrico, icterícia ou urina escura.',
    'Registrar dose efetiva, lote, fabricante, duração, taxas, locais e eventos no prontuário do serviço. O Hub não cadastra nem armazena dados do paciente.',
    'Reavaliar carga de infecções, função renal quando pertinente e IgG; ajustar dose e intervalo à resposta clínica. Em estabilidade, revisões laboratoriais podem ser feitas a cada 6–12 meses.'
  ]
};
function get(id){return document.getElementById(id);}
function el(tag,text,cls){var n=document.createElement(tag);if(cls)n.className=cls;if(text!==null&&text!==undefined)n.textContent=String(text);return n;}
function ptxt(parent,text,cls){parent.appendChild(el('p',text,cls));}
function lnk(url,text){var a=el('a',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a;}
function num(v,d){return Number(v).toLocaleString('pt-BR',{minimumFractionDigits:d===undefined?1:d,maximumFractionDigits:d===undefined?1:d});}
function showWeight(){var input=get('igcalcWeight');if(!input)return null;var raw=(input.value||'').replace(',','.').trim();if(!raw)return null;var value=Number(raw);return Number.isFinite(value)&&value>=2&&value<=250?value:NaN;}
function table(parent,cols,rows){var wrap=el('div');wrap.style.cssText='overflow-x:auto;max-width:100%';var t=el('table',null,'igcalc-table'),thead=el('thead'),head=el('tr');cols.forEach(function(c){head.appendChild(el('th',c));});thead.appendChild(head);t.appendChild(thead);var body=el('tbody');rows.forEach(function(row){var tr=el('tr');row.forEach(function(v){tr.appendChild(el('td',v));});body.appendChild(tr);});t.appendChild(body);wrap.appendChild(t);parent.appendChild(wrap);}
function sec(parent,title,texts){var section=el('section',null,'igcalc-section');section.appendChild(el('h4',title));var list=el('ul');texts.forEach(function(x){list.appendChild(el('li',x));});section.appendChild(list);parent.appendChild(section);}
function info(parent,text){parent.appendChild(el('div',text,'igcalc-alert'));}
function rates(parent,product,weight){
  var box=el('section',null,'igcalc-summary');box.appendChild(el('h4','Velocidade de infusão · '+(product.kind==='IV'?'bomba intravenosa':'bomba subcutânea')));
  if(product.status==='unverified'){info(box,'Programação automática indisponível. A apresentação cadastrada exige confirmação da concentração e bula atual. Nenhum valor de outra marca deve ser usado.');ptxt(box,product.initial);ptxt(box,product.limit);parent.appendChild(box);return;}
  if(product.kind==='IV'){
    if(!product.rates||!product.rates.length){info(box,'A bula específica não foi validada para programação numérica.');parent.appendChild(box);return;}
    var rows=product.rates.map(function(rate,i){
      var time=(product.rates.length===2)?(i===0?'0–30 min':'Após 30 min, se tolerado'):(i===product.rates.length-1?'A partir de '+i*product.interval+' min':(i*product.interval)+'–'+((i+1)*product.interval)+' min');
      return [time,num(weight*rate,1)+' mL/h',num(rate,1)+' mL/kg/h'];
    });
    if(product.rates.length===2)rows[1][0]='Aumentar gradualmente após 30 min';
    table(box,['Intervalo orientativo','Velocidade da bomba','Taxa de referência'],rows);
    ptxt(box,product.initial);
    info(box,product.schedule);
    info(box,product.limit);
  }else if(product.kind==='fSC'){
    var low=weight<40,first=low?product.ratesFirstLow:product.ratesFirstHigh,next=low?product.ratesNextLow:product.ratesNextHigh;
    box.appendChild(el('p','Tabela por local para pacientes '+(low?'com menos de 40 kg':'com 40 kg ou mais')+'. A velocidade não é multiplicada pelo peso: o peso define qual tabela utilizar.'));
    table(box,['Período','1ª e 2ª infusões','Infusões posteriores se toleradas'],first.map(function(x,i){return [i<4?(i*10)+'–'+((i+1)*10)+' min':'Restante',num(x,0)+' mL/h/local',num(next[i],0)+' mL/h/local'];}));
    info(box,product.initial+' '+product.limit);
  }else{
    box.appendChild(el('p','A taxa é expressa por local de infusão e não deve ser multiplicada pelo peso corporal.'));
    if(product.kind==='SC' && product===P.cuvitru_20){
      table(box,['Etapa','Velocidade por local'],[['Início','10 mL/h/local'],['Após pelo menos 10 min, se tolerado','Até 20 mL/h/local']]);
    }else if(product.ratesFirst&&product.ratesNext){
      table(box,['Situação','Taxa máxima por local'],[['Primeira infusão',num(product.ratesFirst[0],0)+' mL/h/local'],['Subsequentes, se toleradas',num(product.ratesNext[0],0)+' mL/h/local']]);
    }
    info(box,product.initial+' '+product.limit);
  }
  parent.appendChild(box);
}
function dose(parent,pr,key,weight){
  var conc=Number(String(pr.conc||'').replace('%','').replace(',','.'))*10;
  var sc=pr.via==='SC'&&key!=='hyqvia_10';
  var mg=weight*(sc?100:400)/1000, max=weight*(sc?150:600)/1000;
  var box=el('section',null,'igcalc-summary');
  box.appendChild(el('h4','Referência de dose para reposição de IgG'));
  ptxt(box,'Peso informado: '+num(weight,1)+' kg. Referência teórica: '+num(mg,1)+'–'+num(max,1)+' g '+(sc?'por semana (aproximação de 100–150 mg/kg/semana)':'por ciclo mensal (400–600 mg/kg/mês)')+'.');
  if(Number.isFinite(conc)&&conc>0)ptxt(box,'Na concentração de '+pr.conc+': volume teórico de '+num(mg*1000/conc,1)+'–'+num(max*1000/conc,1)+' mL por '+(sc?'semana':'ciclo')+'.');
  ptxt(box,'A faixa não é prescrição automática. Doses e intervalos são individualizados conforme indicação, IgG, infecções, peso ideal/ajustado quando aplicável e farmacocinética da apresentação.');
  if(sc)ptxt(box,'Em conversões entre IVIG e SCIG, seguir a bula e o protocolo de conversão do produto; a divisão simples por quatro pode não reproduzir a exposição sistêmica.');
  if(key==='hyqvia_10')ptxt(box,'HyQvia requer titulação inicial da dose e do intervalo; não administrar automaticamente a dose mensal integral na primeira aplicação.');
  parent.appendChild(box);
}
function refs(parent,prod){
  var wrap=el('div',null,'igcalc-refs');wrap.appendChild(el('h4','Referências e conferência de bula'));
  var ul=el('ul');ul.style.cssText='padding-left:17px;margin:6px 0';
  [
    [prod.url,prod.source],
    [prod.complement,'Referência complementar do fabricante ou protocolo hospitalar'],
    [REF.aaaai.url,REF.aaaai.title],
    [REF.eaaci.url,REF.eaaci.title],
    [REF.ukpin.url,REF.ukpin.title],
    [REF.brasil.url,REF.brasil.title],
    [REF.anvisa.url,REF.anvisa.title]
  ].forEach(function(pair){if(!pair[0])return;var li=el('li');li.appendChild(lnk(pair[0],pair[1]));ul.appendChild(li);});
  wrap.appendChild(ul);
  ptxt(wrap,'Nota: fontes internacionais ou históricas são indicadas como tais. Antes de colocar um valor na bomba, é indispensável conferir a bula brasileira vigente e a indicação específica.');
  parent.appendChild(wrap);
}

function regulatory(parent,key,product){
  var reg=IG_REGULATORIO[key]||{};
  var section=el('section',null,'igcalc-section');
  section.appendChild(el('h4','Anvisa · registro e data'));
  ptxt(section,reg.data?'Primeiro registro documentado: '+reg.data+'.':'Data do primeiro registro: ainda não confirmada em fonte primária.');
  ptxt(section,reg.nota||'Acompanhar o cadastro oficial da Anvisa.');
  var line=el('p');line.appendChild(lnk(IG_FONTES_REG.anvisa,'Consultar registro e situação atual na Anvisa'));
  if(reg.url){line.appendChild(document.createTextNode(' · '));line.appendChild(lnk(reg.url,'Documento de referência da data'));}
  section.appendChild(line);
  section.appendChild(el('h4','ANS · cobertura e marco regulatório'));
  ptxt(section,'Não existe data de entrada no Rol para cada marca de imunoglobulina. Na análise técnica do ciclo 2019/2020, a ANS já reconhecia cobertura da terapia com imunoglobulina humana por hemoterapia, tanto IV como SC, nas indicações previstas em bula, conforme a segmentação assistencial. A RN 465/2021 é marco da regulamentação atual, não uma incorporação individual destas marcas.');
  ptxt(section,'Cobertura obrigatória deve ser verificada conforme procedimento, indicação prevista em bula, contexto de administração, tipo de plano e regras vigentes. Registro sanitário não significa cobertura irrestrita, e código TUSS não é data de incorporação.');
  var ansLine=el('p');
  ansLine.appendChild(lnk(IG_FONTES_REG.ansIg,'Nota técnica ANS 2019/2020 — imunoglobulinas'));
  ansLine.appendChild(document.createTextNode(' · '));
  ansLine.appendChild(lnk(IG_FONTES_REG.ans,'Rol ANS vigente'));
  section.appendChild(ansLine);
  section.appendChild(el('h4','Risco de eventos adversos · comparação clínica'));
  var route=product.kind==='IV'?'IV':(product.kind==='fSC'?'fSC':'SC');
  if(route==='IV'){
    ptxt(section,'Perfil relativo por via: maior frequência de reações sistêmicas do que na via subcutânea. Cefaleia, febre, calafrios e náuseas são possíveis; eventos graves raros incluem trombose, lesão renal aguda, hemólise, meningite asséptica e anafilaxia.');
  }else if(route==='fSC'){
    ptxt(section,'Perfil relativo por via: imunoglobulina subcutânea facilitada geralmente apresenta menos reações sistêmicas que IGIV; reações no local (edema, dor, eritema) são frequentes, particularmente com grandes volumes.');
  }else{
    ptxt(section,'Perfil relativo por via: menor frequência de reações sistêmicas que IGIV, porém mais reações locais, como dor, edema, eritema e prurido; eventos graves são incomuns, mas possíveis.');
  }
  if(IG_RISCO_FORMULACAO[key])ptxt(section,'Ponto específico desta formulação: '+IG_RISCO_FORMULACAO[key]);
  info(section,'Não existe comparação direta robusta capaz de classificar todas as marcas como maior ou menor risco global. Dose, concentração, velocidade, via, comorbidades, histórico de reações e excipientes modificam o risco. A classificação acima se refere à VIA e ao padrão de eventos, não a um ranking entre fabricantes.');
  var riskLine=el('p');riskLine.appendChild(lnk(IG_FONTES_REG.seguro,'Consenso de farmacovigilância de imunoglobulinas — 2026'));
  riskLine.appendChild(document.createTextNode(' · '));riskLine.appendChild(lnk(IG_FONTES_REG.aaaai,'AAAAI/ACAAI/CIS — parâmetro de prática'));
  section.appendChild(riskLine);
  ptxt(section,'Revisão documental: 09/11/2026. Para datas não confirmadas, nenhum ano foi inferido a partir de renovação, bula ou mercado.');
  parent.appendChild(section);
}

function render(){
  var output=get('igcalcDetail');if(!output)return;
  output.textContent='';
  // A ficha só existe visualmente dentro do cartão da marca selecionada.
  if(!current){output.hidden=true;return;}
  output.hidden=false;
  var pr=typeof IG_PRODUTOS!=='undefined'?IG_PRODUTOS[current]:null;
  var product=P[current];if(!pr||!product){ptxt(output,'Não foi encontrada ficha validada desta apresentação.');return;}
  var header=el('div',null,'ig-main-head'),left=el('div');
  left.appendChild(el('h3',pr.nome));
  left.appendChild(el('span',(typeof IG_FABRICANTE!=='undefined'&&IG_FABRICANTE[current]||'')+' · '+pr.conc+' · '+(pr.via==='IV'?'Intravenosa':'Subcutânea')));
  header.appendChild(left);output.appendChild(header);
  var weight=showWeight();
  if(weight===null){info(output,'Informe o peso na parte superior da página para calcular diretamente a velocidade em mL/h. As orientações e referências já estão disponíveis abaixo.');}
  else if(Number.isNaN(weight)){output.appendChild(el('div','Informe um peso entre 2 e 250 kg.','igcalc-error'));}
  else{
    dose(output,pr,current,weight);
    rates(output,product,weight);
  }
  regulatory(output,current,product);
  if(product.status==='intl')info(output,'Fonte de velocidade internacional. Não equiparar automaticamente às condições de registro, bula ou indicação no Brasil.');
  if(product.status==='historical')info(output,'Bula histórica: confirmar versão e limites atuais na Anvisa antes da prescrição.');
  if(product.status==='unverified'&&weight!==null)info(output,'Não utilizar taxas de infusão de Endobulin KIOVIG 10% para Endobulin S/D 5%.');
  var steps=el('div',null,'igcalc-sections');
  sec(steps,'1. Antes da infusão',ctx.pre);
  sec(steps,'2. Durante a infusão',ctx.during.concat(product.kind!=='IV'?['Na SC, escolher locais adequados, garantir técnica asséptica e distinguir mL/h por local de velocidade total da bomba.']:['Na IV, preparar acesso venoso adequado e programar o equipamento em mL/h, não confundir com mL/kg/h ou mL/kg/min.']));
  sec(steps,'3. Após a infusão',ctx.post);
  output.appendChild(steps);
  refs(output,product);
}
function build(){
  var box=get('igCatalogProducts');if(!box||typeof IG_PRODUTOS==='undefined')return;
  // Preservar a ficha compartilhada ao reconstruir o catálogo.
  var detail=get('igcalcDetail');
  if(detail&&box.contains(detail)){
    var root=get('page-imunoglobulinas');
    if(root)root.querySelector('.igcalc-shell').appendChild(detail);
  }
  box.textContent='';
  var overview=el('details',null,'igcalc-section');
  overview.style.cssText='background:#f7fafb;border:1px solid #d9e6eb;border-radius:12px;padding:11px 13px;margin-bottom:12px';
  var overviewTitle=el('summary','Anvisa, Rol ANS e segurança — como comparar os produtos');
  overviewTitle.style.cssText='cursor:pointer;font-size:12px;font-weight:700;color:#173a4a';
  overview.appendChild(overviewTitle);
  ptxt(overview,'As datas do primeiro registro da Anvisa aparecem nas fichas quando comprovadas por fonte documental. Para os demais produtos, é exibido “não confirmada”, sem inventar ano.');
  ptxt(overview,'A ANS não incorpora individualmente cada marca ao Rol; a análise de 2019/2020 reconheceu a cobertura da hemoterapia com imunoglobulinas IV e SC conforme bula e segmentação. O Rol vigente é regulamentado pela RN 465/2021.');
  ptxt(overview,'Menos reações sistêmicas: em geral IgSC convencional e facilitada. Mais reações sistêmicas: em geral IgIV. Mais reações locais: IgSC. Não há ranking confiável de segurança global entre marcas.');
  var overviewLinks=el('p');
  [[IG_FONTES_REG.anvisa,'Anvisa'],[IG_FONTES_REG.ans,'ANS'],[IG_FONTES_REG.seguro,'Segurança clínica (2026)']].forEach(function(pair,i){
    if(i)overviewLinks.appendChild(document.createTextNode(' · '));
    overviewLinks.appendChild(lnk(pair[0],pair[1]));
  });
  overview.appendChild(overviewLinks);
  box.appendChild(overview);
  ['IV','SC'].forEach(function(via){
    var group=el('section',null,'igcat-group');
    group.appendChild(el('h4',via==='IV'?'Intravenosas (IGIV)':'Subcutâneas (IGSC)'));
    var grid=el('div',null,'igcat-grid');
    Object.keys(IG_PRODUTOS).forEach(function(key){
      var p=IG_PRODUTOS[key];if(!p||p.via!==via)return;
      var item=el('div',null,'igcat-item');
      item.dataset.igItem=key;
      var btn=el('button',null,'igcat-card');
      btn.type='button';
      btn.dataset.igKey=key;
      btn.setAttribute('aria-pressed','false');
      btn.setAttribute('aria-expanded','false');
      btn.setAttribute('aria-controls','igcalcDetail');
      btn.setAttribute('aria-label','Abrir ou fechar ficha de '+p.nome);
      var icon=el('span',null,'igcat-icon'),source=(typeof IG_LOGO!=='undefined'&&IG_LOGO[key]||''),src=(typeof IG_LOGO_IMG!=='undefined'&&IG_LOGO_IMG[source]||''),maker=(typeof IG_FABRICANTE!=='undefined'&&IG_FABRICANTE[key]||'');
      if(src){
        var im=el('img');im.src=src;im.alt='Logomarca '+maker;im.loading='lazy';im.decoding='async';
        im.addEventListener('error',function(){icon.textContent='';icon.appendChild(el('span',maker,'igcat-fallback'));},{once:true});
        icon.appendChild(im);
      }else icon.appendChild(el('span',maker,'igcat-fallback'));
      btn.appendChild(icon);
      var txt=el('span',null,'igcat-copy');txt.appendChild(el('span',p.nome,'igcat-name'));txt.appendChild(el('span',maker,'igcat-maker'));txt.appendChild(el('span',(via==='IV'?'Intravenosa':'Subcutânea')+' · '+p.conc,'igcat-route'));btn.appendChild(txt);
      btn.addEventListener('click',function(){
        var mesmo=current===key;
        // O mesmo cartão funciona como liga/desliga. Uma nova marca fecha a anterior.
        current=mesmo?null:key;
        box.querySelectorAll('.igcat-item').forEach(function(card){
          var ativo=!mesmo&&card===item;
          card.classList.toggle('open',ativo);
          var botao=card.querySelector(':scope > .igcat-card');
          if(botao){
            botao.setAttribute('aria-pressed',ativo?'true':'false');
            botao.setAttribute('aria-expanded',ativo?'true':'false');
          }
        });
        var panel=get('igcalcDetail');
        if(!mesmo&&panel){
          // A ficha é filha do próprio quadrado da marca, sem painel no rodapé.
          item.appendChild(panel);
        }
        render();
      });
      item.appendChild(btn);
      grid.appendChild(item);
    });
    group.appendChild(grid);box.appendChild(group);
  });
}
function init(){
  var input=get('igcalcWeight');
  if(!input)return;
  build();
  var detail=get('igcalcDetail');
  if(detail)detail.hidden=true;
  input.addEventListener('input',render);
  input.addEventListener('change',render);
  render();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
