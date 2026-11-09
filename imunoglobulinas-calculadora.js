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
  imunoglobulin_5:{
    source:'Imunoglobulin 50 mg/mL — bula profissional brasileira da Blau Farmacêutica, seção 8 (Posologia e modo de usar); registro 1.1637.0044',
    url:'https://www.blau.com/media/leaflet/9cba21cb-de15-4b34-8c61-4b720fba41da-85ae6ebf-9acb-492d-b6ee-9fb6a6fc849b/Imunog_Wxod21d.pdf',
    kind:'IV',rates:[],interval:30,
    specificRows:[
      {stage:'Início da infusão',minutes:'15–30 min',low:0.6,high:0.6},
      {stage:'Após 15–30 min, se tolerado',minutes:'Aumento gradual',low:1.2,high:1.2},
      {stage:'Faixa de progressão geralmente tolerada, não automática',minutes:'Conforme tolerância',low:1.8,high:3.6}
    ],
    initial:'A bula orienta iniciar a 0,01 mL/kg/min (0,6 mL/kg/h), passando a 0,02 mL/kg/min (1,2 mL/kg/h) após 15–30 minutos, somente se tolerado.',
    limit:'A bula descreve tolerância frequente a aumentos graduais de 0,03–0,06 mL/kg/min (1,8–3,6 mL/kg/h). Não estabelece que todo paciente deve atingir a última velocidade; reduzir/interromper em caso de reação.',
    schedule:'Taxas específicas da bula brasileira. As três linhas NÃO são degraus obrigatórios ou intervalos cronometrados além do início descrito. Contém maltose 100 mg/mL; conferir compatibilidade do método de glicemia. Frasco exibido: 5 g/100 mL (5%).',
    status:'br'
  },
  igvena_5:{
    source:'Ig Vena 50 mg/mL — bula profissional brasileira aprovada pela Anvisa em 15/09/2023, seção 8 (Modo de administração); registro 1.7577.0002',
    url:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Igvena-Profissional-Consulta-Remedios.pdf',
    kind:'IV',rates:[],interval:30,
    specificRows:[
      {stage:'Velocidade inicial recomendada',minutes:'Primeiros 20–30 min',low:0.46,high:0.92},
      {stage:'Teto habitual após aumento gradual, se tolerado',minutes:'Após avaliação clínica',low:1.85,high:1.85}
    ],
    initial:'Iniciar a 0,46–0,92 mL/kg/h durante 20–30 minutos, depois aumentar gradualmente conforme tolerância.',
    limit:'Teto geral de 1,85 mL/kg/h; em imunodeficiência primária (DIP), se bem tolerada a taxa de 0,92 mL/kg/h, a bula admite progressão de 2, 4 e até 6 mL/kg/h a cada 20–30 minutos. NÃO utilizar automaticamente essas taxas excepcionais em outras indicações, crianças ou idosos.',
    schedule:'As taxas de 2, 4 e 6 mL/kg/h são exclusivas da situação de DIP tolerada descrita na bula; não fazem parte desta tabela automática. A formulação contém maltose 100 mg/mL e sódio 3 mmol/L; glicosímetros GDH-PQQ ou glucose-dye oxidoreductase podem indicar glicemia falsamente alta por cerca de 15 h após a infusão. Frasco exibido: 5 g/100 mL (5%).',
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
    // Velocidades extraídas da bula da própria marca, sem inventar degraus temporais.
    if(Array.isArray(product.specificRows)&&product.specificRows.length){
      table(box,['Etapa na bula','Bomba calculada pelo peso','Taxa prevista na bula'],
        product.specificRows.map(function(step){
          var range=step.low===step.high?'':('–'+num(weight*step.high,1));
          var rateRange=step.low===step.high?'':('–'+num(step.high,2));
          return [step.stage+' · '+step.minutes,
            num(weight*step.low,1)+range+' mL/h',
            num(step.low,2)+rateRange+' mL/kg/h'];
        }));
      ptxt(box,product.initial);
      info(box,product.limit);
      info(box,product.schedule);
      parent.appendChild(box);return;
    }
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
