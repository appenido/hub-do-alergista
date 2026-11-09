
/* Hub do Alergista — catálogo clínico anti-H1 (09/11/2026).
   Não persiste idade, peso ou dados clínicos. Números de gotas não são inferidos.
   A apresentação e sua bula prevalecem sobre o cálculo orientativo. */
(function(){
'use strict';
var BULAS='https://consultas.anvisa.gov.br/#/bulario/';
var SBP='https://www.sbp.com.br/fileadmin/user_upload/24064h-GPA_ISBN_-_Rinite_Alergica_na_Infancia_e_adl.pdf';
var GA2LEN='https://pmc.ncbi.nlm.nih.gov/articles/PMC13466004/';
var ITEMS=[
 {id:'dexclorfeniramina',g:1,n:'Dexclorfeniramina',b:'Polaramine, Histamin; similares e genéricos',f:'Xarope 0,4 mg/mL; comprimidos 2 mg; gotas 2,8 mg/mL (conforme marca); creme dermatológico.',i:'Prurido, rinite e urticária; hoje, reservar a situações selecionadas.',k:'Anti-H1 alquilamina sedativo. Não é primeira escolha para uso contínuo em rinite ou urticária.',w:'Sedação, boca seca, efeitos anticolinérgicos; evitar em menores de 2 anos. Produtos associados a descongestionantes não devem ser calculados como monofármacos.',u:'https://consultaremedios.com.br/histamin/bula',l:[{t:'Xarope 0,4 mg/mL',c:0.4,r:'dex'},{t:'Gotas 2,8 mg/mL',c:2.8,r:'dex'}]},
 {id:'hidroxizina',g:1,n:'Hidroxizina',b:'Hixizine, Prurizin; genéricos',f:'Xarope 2 mg/mL; comprimidos 25 mg (marca e registro específicos).',i:'Alívio do prurido de condições alérgicas da pele.',k:'Anti-H1 piperazínico com potente efeito sedativo. Preferir menor dose eficaz, por menor tempo.',w:'Risco de prolongamento QT/torsades, sedação e efeitos anticolinérgicos. Checar história cardíaca, eletrólitos e interações. Bula Hixizine: acima de 6 meses; limite pediátrico 2 mg/kg/dia até 40 kg e 100 mg/dia acima de 40 kg.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Hixizine-Profissional-Consulta-Remedios.pdf',l:[{t:'Xarope Hixizine 2 mg/mL',c:2,r:'hix'}]},
 {id:'prometazina',g:1,n:'Prometazina',b:'Fenergan; genéricos. Fenergan Expectorante é associação, não prometazina isolada.',f:'Comprimidos 25 mg; solução injetável 25 mg/mL; algumas apresentações associadas em xarope.',i:'Anti-H1 sedativo; também possui ações antiemética e anticolinérgica.',k:'Não recomendada como tratamento rotineiro de rinite/urticária.',w:'Contraindicada em menores de 2 anos pelo risco de depressão respiratória. Injetável exige cuidados específicos; não converter xarope associado para dose de prometazina isolada.',u:BULAS},
 {id:'ciproheptadina',g:1,n:'Ciproheptadina',b:'Cobavital (associado a cobamamida); outras marcas dependem do mercado.',f:'Cobavital: microcomprimido 4 mg de ciproheptadina + 1 mg de cobamamida; outras formas devem ser verificadas por registro.',i:'Anti-H1 sedativo e antisserotoninérgico; uso em associação como estimulante do apetite tem outra indicação.',k:'Evitar utilizar uma associação como equivalente posológico de anti-H1 isolado.',w:'Sedação, aumento de apetite e efeitos anticolinérgicos. Não há cálculo automático para associação.',u:'https://consultaremedios.com.br/cobavital/bula'},
 {id:'cetotifeno',g:1,n:'Cetotifeno',b:'Zaditen; genéricos',f:'Xarope 0,2 mg/mL; solução em gotas 1 mg/mL (conforme marca); comprimidos 1 mg; colírio 0,25 mg/mL.',i:'Uso preventivo em doenças alérgicas; ação estabilizadora de mastócitos. Não trata crise aguda de asma.',k:'Anti-H1 sedativo com efeito estabilizador de mastócitos. Classificado aqui como primeira geração por sua ação central.',w:'Pode causar sonolência. Confirme se o frasco é xarope 0,2 mg/mL ou gotas 1 mg/mL; doses em gotas dependem do gotejador.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Zaditen-Paciente-Consulta-Remedios.pdf',l:[{t:'Xarope 0,2 mg/mL',c:0.2,r:'cetiF'},{t:'Gotas 1 mg/mL',c:1,r:'cetiF'}]},
 {id:'difenidramina',g:1,n:'Difenidramina',b:'Diversas associações e formulações tópicas; Benadryl em mercados externos',f:'Formulações tópicas e associações; apresentações orais isoladas dependem do país/registro.',i:'Anti-H1 sedativo, com ação anticolinérgica e antiemética.',k:'Preferir anti-H1 de segunda geração para doença alérgica. Não confundir difenidramina com dimenidrinato.',w:'Alto risco de sedação e intoxicação em crianças; não usar marcas estrangeiras como prova de registro no Brasil.',u:BULAS,h:1},
 {id:'dimenidrinato',g:1,n:'Dimenidrinato',b:'Dramin; Dramin B6 é associação',f:'Cápsulas/comprimidos; gotas e solução em apresentações específicas, inclusive associadas a piridoxina.',i:'Predominantemente antiemético/antivertiginoso; não é escolha habitual para rinite ou urticária.',k:'Anti-H1 sedativo com ação antiemética.',w:'Não calcular como antialérgico a partir de Dramin B6, que possui outro princípio ativo.',u:'https://consultaremedios.com.br/dramin/bula'},
 {id:'meclozina',g:1,n:'Meclozina (meclizina)',b:'Meclin',f:'Comprimidos 25 e 50 mg; verificar apresentação vigente.',i:'Cinetose, vertigem e náuseas/vômitos; não é terapêutica habitual da rinite ou urticária.',k:'Anti-H1 de primeira geração com maior uso como antiemético.',w:'Sedação e efeitos anticolinérgicos; avaliar gravidez e interações de acordo com a indicação.',u:'https://consultaremedios.com.br/meclin/bula'},
 {id:'clemastina',g:1,n:'Clemastina',b:'Emistin (em associação com dexametasona); Tavegyl em outros mercados',f:'Associação de clemastina 1 mg + dexametasona 0,5 mg; monoterapia brasileira deve ser conferida.',i:'Anti-H1 sedativo; uso limitado como primeira opção em alergia.',k:'Não confundir medicamento associado a corticoide com anti-histamínico isolado.',w:'Associações mudam indicações e contraindicações; calculadora oral não disponível sem formulação isolada validada.',u:BULAS,h:1},
 {id:'bronfeniramina',g:1,n:'Bronfeniramina',b:'Decongex Plus (em associação com fenilefrina)',f:'Comprimidos e soluções orais em associações; confirmar composição antes de prescrever.',i:'Sintomas de rinite em produtos combinados; não recomendada como anti-H1 isolado de rotina.',k:'Anti-H1 alquilamina de primeira geração.',w:'Não converter a dose da combinação como se fosse anti-H1 isolado; descongestionantes apresentam contraindicações adicionais.',u:BULAS},
 {id:'clorfeniramina',g:1,n:'Clorfeniramina',b:'Marcas e associações variáveis; verificar registro local.',f:'Comprimidos e líquidos em diferentes mercados; sem padronização de apresentação isolada confirmada neste catálogo.',i:'Anti-H1 clássico; uso limitado pelo perfil sedativo.',k:'Não confundir com dexclorfeniramina: são fármacos distintos.',w:'Sem cálculo automático sem bula da apresentação exata.',u:BULAS,h:1},
 {id:'doxilamina',g:1,n:'Doxilamina',b:'Marcas específicas em outros países',f:'Comprimidos, frequentemente em associações para náuseas gravídicas em outros mercados.',i:'Anti-H1 sedativo, não recomendado como primeira linha para doenças alérgicas.',k:'O emprego antiemético ou como indutor do sono não deve ser confundido com tratamento de rinite/urticária.',w:'Sem confirmação de formulação antialérgica isolada brasileira.',u:BULAS,h:1},
 {id:'triprolidina',g:1,n:'Triprolidina',b:'Associações para resfriados em outros mercados',f:'Formas orais variáveis conforme produto/país.',i:'Anti-H1 sedativo, não recomendado rotineiramente.',k:'Substância histórica em associações para sintomas respiratórios.',w:'Sem apresentação isolada validada no Brasil neste catálogo.',u:BULAS,h:1},
 {id:'alimemazina',g:1,n:'Alimemazina (trimeprazina)',b:'Theralene em outros mercados',f:'Soluções e comprimidos em outros países; não confirmados como disponíveis no Brasil.',i:'Anti-H1 sedativo, não é primeira escolha para alergias.',k:'Exemplo de fenotiazina sedativa, incluída para referência farmacológica.',w:'Sem calculadora: não há apresentação brasileira validada.',u:BULAS,h:1},
 {id:'feniramina',g:1,n:'Feniramina',b:'Uniclarin/Clanistil (associações oculares com nafazolina)',f:'Colírios combinados em apresentações específicas; sem solução oral monocomponente validada.',i:'Alívio ocular em formulações combinadas; não extrapolar para uso sistêmico.',k:'Anti-H1 clássico; a associação muda a segurança da aplicação ocular.',w:'Formulação ocular não requer cálculo por peso; conferir faixa etária e contraindicações.',u:BULAS,h:1},
 {id:'oxatomida',g:1,n:'Oxatomida',b:'Tinset (referência histórica)',f:'Comprimidos/suspensões históricos, sem disponibilidade brasileira atual verificada.',i:'Anti-H1 antigo com uso antialérgico histórico.',k:'Item de referência farmacológica; não sugerir como opção prescritiva atual sem registro ativo.',w:'Sem calculadora devido à indisponibilidade de bula brasileira vigente validada.',u:BULAS,h:1},

 {id:'loratadina',g:2,n:'Loratadina',b:'Claritin, Loremix, Histamix, Loralerg; genéricos',f:'Xarope 1 mg/mL (5 mg/5 mL); comprimidos 10 mg.',i:'Rinite alérgica e urticária.',k:'Anti-H1 de segunda geração, com baixo potencial de sedação; útil como primeira linha.',w:'A dose pediátrica entre 2 e 11 anos depende do peso: menos de 30 kg vs. 30 kg ou mais. Considerar doença hepática grave.',u:SBP,l:[{t:'Xarope 1 mg/mL',c:1,r:'lora'}]},
 {id:'desloratadina',g:2,n:'Desloratadina',b:'Desalex, Destadin; genéricos',f:'Xarope 0,5 mg/mL; gotas 1,25 mg/mL (conforme marca); comprimidos 5 mg.',i:'Rinite alérgica e urticária.',k:'Metabólito ativo da loratadina, habitualmente uma administração por dia.',w:'Confirme indicação por faixa etária e bula específica: o xarope Desalex possui bula acima de 6 meses. Não usar o número de gotas de outra marca.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Desalex-Profissional-Consulta-Remedios.pdf',l:[{t:'Xarope Desalex 0,5 mg/mL',c:0.5,r:'des'},{t:'Gotas 1,25 mg/mL (validar marca)',c:1.25,r:'des'}]},
 {id:'cetirizina',g:2,n:'Cetirizina',b:'Zyrtec, Zetalerg; genéricos',f:'Solução oral 1 mg/mL; gotas 10 mg/mL (apresentações específicas); comprimidos 10 mg.',i:'Rinite alérgica e urticária.',k:'Anti-H1 de segunda geração; pode causar sonolência em uma proporção dos pacientes.',w:'Ajustar conforme função renal. Não converter mL em gotas sem conhecer o gotejador da marca.',u:'https://img.drogasil.com.br/raiadrogasil_bula/ZYRTEC.pdf',l:[{t:'Solução oral 1 mg/mL',c:1,r:'cet'},{t:'Gotas 10 mg/mL (validar marca)',c:10,r:'cet'}]},
 {id:'levocetirizina',g:2,n:'Levocetirizina',b:'Zyxem; genéricos',f:'Gotas 5 mg/mL (Zyxem: 20 gotas/mL); comprimidos 5 mg.',i:'Rinite alérgica e urticária.',k:'Enantiômero ativo da cetirizina; dose de manutenção diária em maiores de 6 anos.',w:'Exige avaliação/ajuste na insuficiência renal. A contagem de gotas depende do produto; o Hub exibe mL.',u:'https://consultaremedios.com.br/zyxem/bula',l:[{t:'Gotas Zyxem 5 mg/mL',c:5,r:'levo'}]},
 {id:'fexofenadina',g:2,n:'Fexofenadina',b:'Allegra, Praalergia, Rafex; genéricos',f:'Suspensão oral pediátrica 6 mg/mL; comprimidos 60, 120 e 180 mg.',i:'Rinite alérgica e urticária; indicação da suspensão em lactentes depende do diagnóstico.',k:'Baixo potencial sedativo. A dose e a idade mínima da suspensão diferem conforme rinite e urticária.',w:'Suspensão pediátrica: rinite sazonal a partir de 2 anos; urticária idiopática crônica a partir de 6 meses. Antiácidos com alumínio/magnésio e sucos podem reduzir absorção.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Allegra-Paciente-Consulta-Remedios.pdf',l:[{t:'Suspensão Allegra 6 mg/mL',c:6,r:'fexo'}]},
 {id:'bilastina',g:2,n:'Bilastina',b:'Alektos; Alektos Ped; genéricos',f:'Alektos Ped: solução oral 2,5 mg/mL; comprimidos 20 mg. Outras concentrações não são intercambiáveis sem verificar bula.',i:'Rinoconjuntivite alérgica e urticária.',k:'Anti-H1 de segunda geração; administração separada de alimentos e sucos de frutas conforme bula.',w:'Alektos Ped aprovado para 6 a 11 anos e peso mínimo de 20 kg: 4 mL (10 mg) uma vez ao dia. Não inferir 4 mg/mL a partir de tabelas secundárias.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Alektos-Ped-Profissional-Consulta-Remedios.pdf',l:[{t:'Alektos Ped 2,5 mg/mL',c:2.5,r:'bila'}]},
 {id:'ebastina',g:2,n:'Ebastina',b:'Ebastel; genéricos',f:'Xarope ou solução oral 1 mg/mL; comprimidos 10 mg (e 20 mg conforme produto).',i:'Rinite alérgica e urticária.',k:'Anti-H1 de segunda geração, metabolismo em carebastina.',w:'Cautela em insuficiência hepática e com interações metabólicas/QT. Posologia pediátrica de xarope conforme apresentação.',u:'https://eurofarma.com.br/produtos/bulas/view/patient/pt/bula-ebastel.html',l:[{t:'Ebastel xarope 1 mg/mL',c:1,r:'eba'}]},
 {id:'rupatadina',g:2,n:'Rupatadina',b:'Rupafin',f:'Comprimidos 10 mg; solução oral de outros mercados não foi validada para o catálogo brasileiro.',i:'Rinite alérgica e urticária crônica.',k:'Anti-H1 de segunda geração com atividade adicional no receptor de PAF.',w:'Comprimido brasileiro: uso a partir de 12 anos. Confirmar disponibilidade e registro vigente antes da prescrição.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Rupafin-Paciente-Consulta-Remedios.pdf'},
 {id:'epinastina',g:2,n:'Epinastina',b:'Talerc (oral); Relestat (colírio)',f:'Comprimidos orais 10 e 20 mg; solução oftálmica 0,5 mg/mL.',i:'Rinite alérgica (oral) e conjuntivite alérgica (tópica ocular).',k:'Anti-H1 de segunda geração; vias oral e oftálmica têm indicações distintas.',w:'Talerc oral: bula para acima de 12 anos. Colírio não é calculado por idade/peso como solução oral.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Talerc-Profissional-Consulta-Remedios.pdf'},
 {id:'azelastina',g:2,n:'Azelastina',b:'Rino-Lastin; genéricos e associações intranasais',f:'Spray nasal em concentrações conforme marca; colírio em mercados específicos.',i:'Rinite alérgica e sintomas nasais; uso tópico.',k:'Anti-H1 intranasal com início rápido e efeito local.',w:'Não calcular dose por peso a partir de concentração mg/mL do spray; a dose é por atuação nasal e depende da bula.',u:BULAS},
 {id:'olopatadina',g:2,n:'Olopatadina',b:'Patanol, Patanol S; genéricos',f:'Colírio (por exemplo, 1 mg/mL ou 2 mg/mL de olopatadina base, conforme apresentação).',i:'Conjuntivite alérgica.',k:'Anti-H1 ocular com propriedades estabilizadoras de mastócitos.',w:'Solução oftálmica: dosagem por gota/olho e faixa etária, não por kg. Respeitar a concentração e a bula.',u:'https://consultaremedios.com.br/patanol/bula'},
 {id:'bepotastina',g:2,n:'Bepotastina',b:'Bepreve (referência internacional)',f:'Solução oftálmica 1,5% em mercados específicos.',i:'Prurido ocular por conjuntivite alérgica.',k:'Anti-H1 tópico ocular.',w:'Registro e disponibilidade comercial no Brasil devem ser confirmados; sem calculadora por peso.',u:BULAS,h:1},
 {id:'emedastina',g:2,n:'Emedastina',b:'Emadine (referência histórica/internacional)',f:'Solução oftálmica 0,5 mg/mL em mercados específicos.',i:'Conjuntivite alérgica.',k:'Anti-H1 ocular.',w:'Sem confirmação de disponibilidade brasileira atual; não converter colírio em dose sistêmica.',u:BULAS,h:1},
 {id:'mizolastina',g:2,n:'Mizolastina',b:'Mizollen (histórico/internacional)',f:'Comprimidos 10 mg em mercados externos.',i:'Rinite e urticária em mercados onde aprovado.',k:'Anti-H1 de segunda geração estudado em urticária.',w:'Não considerar disponível ou aprovado no Brasil sem pesquisa atual no bulário da Anvisa.',u:GA2LEN,h:1},
 {id:'acrivastina',g:2,n:'Acrivastina',b:'Semprex (internacional)',f:'Cápsulas 8 mg em mercados específicos.',i:'Rinite e urticária em mercados onde aprovado.',k:'Anti-H1 periférico de segunda geração; disponibilidade local incerta.',w:'Verificar registro no Brasil; não inferir posologia a partir de produtos estrangeiros.',u:BULAS,h:1},
 {id:'terfenadina',g:2,n:'Terfenadina',b:'Marcas históricas — não usar',f:'Produto histórico retirado/descontinuado em numerosos mercados.',i:'Referência histórica da farmacologia, não opção terapêutica.',k:'Atenção: fármaco associado a cardiotoxicidade e interações medicamentosas.',w:'NÃO RECOMENDADO. Foi substituído por alternativas mais seguras, como fexofenadina.',u:GA2LEN,h:1},
 {id:'astemizol',g:2,n:'Astemizol',b:'Marcas históricas — não usar',f:'Produto histórico retirado/descontinuado em numerosos mercados.',i:'Referência histórica, não opção terapêutica.',k:'Risco importante de QT prolongado e arritmia.',w:'NÃO RECOMENDADO. Não selecionar para tratamento da rinite ou urticária.',u:GA2LEN,h:1}
];
var state={gen:2,query:'',selected:null,init:false};
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function fmt(v){return Number(v.toFixed(2)).toLocaleString('pt-BR',{maximumFractionDigits:2});}
function get(id){return ITEMS.find(function(x){return x.id===id;});}
function init(){
 var root=document.getElementById('ahApp');if(!root)return;
 if(state.init)return;state.init=true;
 root.innerHTML='<header class="ah-head"><div class="ah-kicker">Farmacologia clínica · Anti-H1</div><h1>Anti-histamínicos</h1><p class="ah-sub">Catálogo de anti-histamínicos H1, classificados por geração. Selecione cada fármaco para consultar apresentações, nomes comerciais, orientações e, nas soluções orais com posologia documentada, a calculadora por idade e peso.</p></header>'+
 '<div class="ah-alert">Diretrizes atuais priorizam anti-H1 de segunda geração para rinite e urticária. Os de primeira geração apresentam maior risco de sedação, prejuízo cognitivo e efeitos anticolinérgicos. Anti-histamínicos não substituem adrenalina intramuscular na anafilaxia.</div>'+
 '<div class="ah-toolbar"><div class="ah-tabs" role="tablist" aria-label="Geração do anti-histamínico"><button type="button" class="ah-tab" data-ah-tab="2" role="tab" aria-selected="true">2ª geração</button><button type="button" class="ah-tab" data-ah-tab="1" role="tab" aria-selected="false">1ª geração</button></div><input type="search" class="ah-search" id="ahSearch" aria-label="Pesquisar anti-histamínico ou nome comercial" placeholder="Pesquisar princípio ativo ou marca..." autocomplete="off"></div>'+
 '<p class="ah-counter" id="ahCounter"></p><div class="ah-grid" id="ahGrid" aria-label="Catálogo de anti-histamínicos"></div><section class="ah-detail" id="ahDetail" aria-live="polite" hidden></section>'+
 '<p class="ah-footnote">Fontes de referência: <a href="'+SBP+'" target="_blank" rel="noopener noreferrer">SBP — Rinite alérgica na infância e adolescência (Tabela 2)</a> · <a href="'+GA2LEN+'" target="_blank" rel="noopener noreferrer">Diretriz internacional de urticária 2026</a> · <a href="'+BULAS+'" target="_blank" rel="noopener noreferrer">Bulário eletrônico Anvisa</a>. Marcas são exemplos, não comprovação de disponibilidade ou registro ativo. Última revisão da seção: 09/11/2026. Não salva dados do paciente.</p>';
 root.addEventListener('click',function(e){
  var tab=e.target.closest('[data-ah-tab]');
  if(tab){state.gen=+tab.dataset.ahTab;state.selected=null;render();return;}
  var card=e.target.closest('[data-ah-id]');
  if(card){var id=card.dataset.ahId;if(state.selected===id){state.selected=null;renderDetail();renderCards();}else{state.selected=id;renderDetail();renderCards();var detail=document.getElementById('ahDetail');if(detail){detail.scrollIntoView({block:'start',behavior:'smooth'});}}return;}
  if(e.target.closest('[data-ah-close]')){state.selected=null;renderDetail();renderCards();return;}
  if(e.target.closest('[data-ah-calc]')){calculate();return;}
 });
 root.addEventListener('input',function(e){if(e.target.id==='ahSearch'){state.query=e.target.value;state.selected=null;render();}else if(e.target.closest('#ahCalc')){var out=document.getElementById('ahResult');if(out){out.hidden=true;out.textContent='';}}});
 root.addEventListener('change',function(e){if(e.target.closest('#ahCalc')){var out=document.getElementById('ahResult');if(out)out.hidden=true;}});
 render();
}
function render(){
 var root=document.getElementById('ahApp');if(!root)return;
 root.querySelectorAll('[data-ah-tab]').forEach(function(t){t.setAttribute('aria-selected',String(+t.dataset.ahTab===state.gen));});
 renderCards();renderDetail();
}
function filtered(){var q=norm(state.query);return ITEMS.filter(function(x){return x.g===state.gen&&(!q||norm(x.n+' '+x.b+' '+x.f+' '+x.i).indexOf(q)>=0);}).sort(function(a,b){return a.n.localeCompare(b.n,'pt-BR');});}
function renderCards(){
 var area=document.getElementById('ahGrid');if(!area)return;
 var a=filtered(),c=document.getElementById('ahCounter');if(c)c.textContent=a.length+' fármacos · '+(state.gen===1?'primeira geração':'segunda geração');
 area.innerHTML=a.length?a.map(function(x){return '<button type="button" class="ah-card" data-ah-id="'+escapeHtml(x.id)+'" aria-pressed="'+String(state.selected===x.id)+'"><span><span class="ah-card-name">'+escapeHtml(x.n)+'</span><span class="ah-card-brand" style="display:block;margin-top:5px">'+escapeHtml(x.b)+'</span></span><span class="ah-card-foot"><span class="ah-chip '+(x.h?'hist':'')+'">'+(x.h?'Referência histórica':x.l?'Solução oral':'Ficha clínica')+'</span><span style="color:#1f6980;font-size:21px" aria-hidden="true">›</span></span></button>';}).join(''):'<div class="ah-empty">Nenhum fármaco encontrado com esse termo. Experimente o princípio ativo ou a marca.</div>';
}
function renderDetail(){
 var el=document.getElementById('ahDetail');if(!el)return;
 var x=get(state.selected);if(!x){el.hidden=true;el.innerHTML='';return;}
 el.hidden=false;
 var form=x.l?'<div class="ah-calc" id="ahCalc"><div class="ah-calc-title">Calculadora da solução oral</div><p>Insira idade e peso. O cálculo usa somente a concentração selecionada, sem extrapolar para produtos combinados.</p>'+
  '<div class="ah-field-grid"><div class="ah-field"><label for="ahLiquid">Apresentação líquida</label><select id="ahLiquid">'+x.l.map(function(z,j){return '<option value="'+j+'">'+escapeHtml(z.t)+'</option>';}).join('')+'</select></div><div class="ah-field"><label for="ahAge">Idade (anos; aceita decimal)</label><input id="ahAge" type="number" min="0" max="120" step="0.1" inputmode="decimal" placeholder="Ex.: 3,5"></div><div class="ah-field"><label for="ahWeight">Peso (kg)</label><input id="ahWeight" type="number" min="2" max="250" step="0.1" inputmode="decimal" placeholder="Ex.: 15"></div></div>'+
 (x.id==='fexofenadina'?'<div class="ah-field" style="max-width:310px;margin-bottom:12px"><label for="ahIndication">Indicação</label><select id="ahIndication"><option value="rinite">Rinite alérgica</option><option value="urticaria">Urticária crônica idiopática</option></select></div>':'')+
 '<button type="button" class="ah-calc-action" data-ah-calc>Calcular volume por administração</button><div id="ahResult" class="ah-result" role="status" aria-live="polite" hidden></div><p class="ah-calc-note">Resultado orientativo, não prescrição. Confirme indicação, concentração (mg/mL), bula de sua marca, dose máxima, contraindicações, função renal/hepática e interações antes da administração. Nas gotas, converta mL para gotas somente com o gotejador da marca.</p></div>':
 '<div class="ah-block" style="margin-top:17px"><h3>Calculadora</h3><p>Não aplicável: não há solução oral de uso antialérgico monocomponente com concentração e posologia brasileira suficientemente verificadas para este fármaco nesta versão. Colírios e sprays utilizam doses por aplicação, não por kg.</p></div>';
 el.innerHTML='<div class="ah-detail-top"><div><div class="ah-kicker">'+(x.g===1?'Primeira':'Segunda')+' geração · anti-H1</div><h2>'+escapeHtml(x.n)+'</h2><p>'+escapeHtml(x.k)+'</p></div><button type="button" class="ah-close" data-ah-close aria-label="Fechar ficha">×</button></div>'+
  '<div class="ah-pair-grid"><div class="ah-block"><h3>Nomes comerciais</h3><p>'+escapeHtml(x.b)+'</p></div><div class="ah-block"><h3>Apresentações</h3><p>'+escapeHtml(x.f)+'</p></div><div class="ah-block"><h3>Indicações e uso clínico</h3><p>'+escapeHtml(x.i)+'</p></div><div class="ah-block"><h3>Posicionamento terapêutico</h3><p>'+escapeHtml(x.k)+'</p></div></div>'+
  '<div class="ah-warning">'+escapeHtml(x.w)+'</div>'+form+
  '<h3>Referências verificáveis</h3><div class="ah-links"><a href="'+escapeHtml(x.u||BULAS)+'" target="_blank" rel="noopener noreferrer">Bula ou fonte do fármaco</a><a href="'+SBP+'" target="_blank" rel="noopener noreferrer">Guia SBP</a><a href="'+GA2LEN+'" target="_blank" rel="noopener noreferrer">Diretriz internacional 2026</a><a href="'+BULAS+'" target="_blank" rel="noopener noreferrer">Conferir registro na Anvisa</a></div>';
}
function dose(rule,age,wt,ind){
 var d={mg:0,times:1,msg:'',max:'',caution:''};
 switch(rule){
 case 'dex':
  if(age<2)return {error:'Uso oral contraindicado para menores de 2 anos na bula Histamin.'};
  d.mg=age<6?0.5:age<12?1:2;d.times=3;d.max=age<6?'Máximo da faixa etária: 3 mg/dia.':age<12?'Máximo da faixa etária: 6 mg/dia.':'Máximo adulto: 12 mg/dia.';
  d.caution='Anti-H1 sedativo; existem alternativas de segunda geração preferenciais.';break;
 case 'hix':
  if(age<0.5)return {error:'Hixizine xarope contraindicado abaixo de 6 meses.'};
  if(wt<=40){d.mg=Math.min(wt*0.7,wt*2/3);d.times=3;d.max='Limite adotado: 2 mg/kg/dia; a bula descreve 0,7 mg/kg/dose, mas exige respeitar o teto diário.';}
  else {d.mg=25;d.times=3;d.max='Limite acima de 40 kg: 100 mg/dia; em idosos, evitar ou máximo 50 mg/dia.';}
  d.caution='Alerta: risco de QT prolongado e sedação. Apenas referência de dose, não indicação automática.';break;
 case 'cetiF':
  if(age<0.5)return {error:'Xarope Zaditen: uso a partir de 6 meses.'};
  d.mg=age<3?Math.min(0.05*wt,1):1;d.times=2;d.max='Crianças menores de 3 anos: 0,05 mg/kg/dose a cada 12h. Demais: 1 mg a cada 12h.';
  d.caution='Tratamento preventivo, não de crises de asma. Confirmar concentração do sal expressa como cetotifeno base.';break;
 case 'lora':
  if(age<2)return {error:'Loratadina xarope: uso habitual a partir de 2 anos.'};
  d.mg=age>=12||wt>=30?10:5;d.times=1;d.max='5 mg/dia (2–11 anos e <30 kg) ou 10 mg/dia (≥30 kg ou ≥12 anos).';break;
 case 'des':
  if(age<0.5)return {error:'Desalex xarope não é indicado para menores de 6 meses.'};
  d.mg=age<1?1:age<6?1.25:age<12?2.5:5;d.times=1;
  d.max='Bula Desalex: 6–11 meses 1 mg; 1–5 anos 1,25 mg; 6–11 anos 2,5 mg; ≥12 anos 5 mg, uma vez ao dia.';
  d.caution='A apresentação em gotas é apenas equivalente em mg/mL. Não reutilize número de gotas sem validar o produto.';break;
 case 'cet':
  if(age<2)return {error:'Solução Zyrtec 1 mg/mL: uso a partir de 2 anos.'};
  d.mg=age<6?2.5:age<12?5:10;d.times=age<12?2:1;d.max='2–5 anos: 5 mg/dia; 6–11 anos: 10 mg/dia; ≥12 anos: 10 mg/dia.';
  d.caution='Considerar função renal; risco de sonolência em alguns pacientes.';break;
 case 'levo':
  if(age<2)return {error:'Zyxem gotas: uso a partir de 2 anos.'};
  d.mg=age<6?1.25:5;d.times=age<6?2:1;d.max='2–5 anos: 2,5 mg/dia; ≥6 anos: 5 mg/dia.';
  d.caution='Avaliar função renal; conferir que gotas Zyxem contêm 5 mg/mL.';break;
 case 'fexo':
  if(age<0.5)return {error:'Suspensão Allegra: não indicada abaixo de 6 meses.'};
  if(age<2&&ind!=='urticaria')return {error:'Rinite alérgica: a suspensão Allegra não é aprovada para menores de 2 anos. A indicação de 6 meses a <2 anos é para urticária idiopática crônica.'};
  if(age>=12)return {error:'A bula consultada é de suspensão pediátrica. Para ≥12 anos, verificar posologia e apresentação de comprimidos conforme a indicação, sem converter automaticamente.'};
  d.mg=age<2?15:30;d.times=2;d.max=age<2?'15 mg a cada 12h para urticária (6 meses a <2 anos).':'30 mg a cada 12h (2–11 anos).';
  d.caution='Evitar administrar junto com sucos de frutas e antiácidos com alumínio/magnésio.';break;
 case 'bila':
  if(age<6||age>=12||wt<20)return {error:'Alektos Ped solução oral: somente de 6 a 11 anos com peso corporal de pelo menos 20 kg.'};
  d.mg=10;d.times=1;d.max='10 mg/dia, correspondentes a 4 mL da solução 2,5 mg/mL.';
  d.caution='Administrar respeitando o jejum/intervalo com alimentos e sucos indicado na bula.';break;
 case 'eba':
  if(age<2)return {error:'Ebastel xarope: uso a partir de 2 anos.'};
  d.mg=age<6?2.5:age<12?5:10;d.times=1;d.max='2–5 anos: 2,5 mg/dia; 6–11 anos: 5 mg/dia; ≥12 anos: 10 mg/dia.';
  d.caution='Reavaliar em insuficiência hepática/interações com fármacos que afetam QT.';break;
 default:return {error:'Não há esquema posológico automático validado para esta apresentação.'};
 }
 return d;
}
function calculate(){
 var x=get(state.selected),el=document.getElementById('ahResult');if(!x||!x.l||!el)return;
 function fail(m){el.hidden=false;el.classList.add('err');el.textContent=m;}
 var ageVal=document.getElementById('ahAge').value.replace(',','.'),weightVal=document.getElementById('ahWeight').value.replace(',','.');
 if(!ageVal||!weightVal){fail('Preencha idade e peso antes de calcular.');return;}
 var age=Number(ageVal),wt=Number(weightVal);
 if(!Number.isFinite(age)||age<0||age>120||!Number.isFinite(wt)||wt<2||wt>250){fail('Idade ou peso fora do intervalo permitido. Confirme os dados.');return;}
 var i=Number(document.getElementById('ahLiquid').value),form=x.l[i],ind=(document.getElementById('ahIndication')||{}).value||'rinite';
 if(!form||!(form.c>0)){fail('Apresentação inválida.');return;}
 var d=dose(form.r,age,wt,ind);
 if(d.error){fail(d.error);return;}
 var ml=d.mg/form.c;
 if(!(ml>0)||!Number.isFinite(ml)){fail('Não foi possível calcular com segurança.');return;}
 el.classList.remove('err');el.hidden=false;
 el.innerHTML='<span class="ah-number">'+fmt(ml)+' mL por administração</span>'+
  escapeHtml(fmt(d.mg)+' mg por dose · '+d.times+' vez(es) ao dia · '+fmt(d.mg*d.times)+' mg/dia')+
  '<p style="margin-top:8px">Concentração: '+escapeHtml(form.t)+'. '+escapeHtml(d.max)+'</p>'+
  (d.caution?'<p style="margin-top:7px;color:#86572e">'+escapeHtml(d.caution)+'</p>':'');
}
window.ahInit=init;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){if(document.querySelector('#page-antihistaminicos.active'))init();});
else if(document.querySelector('#page-antihistaminicos.active'))init();
})();
