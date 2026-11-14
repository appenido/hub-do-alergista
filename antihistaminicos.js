
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
 {id:'hidroxizina',g:1,n:'Hidroxizina',b:'Hixizine, Prurizin; genéricos',f:'Xarope 2 mg/mL; comprimidos 25 mg (marca e registro específicos).',i:'Alívio do prurido de condições alérgicas da pele.',k:'Anti-H1 piperazínico com potente efeito sedativo. Preferir menor dose eficaz, por menor tempo.',w:'Risco de prolongamento QT/torsades, sedação e efeitos anticolinérgicos. Checar história cardíaca, eletrólitos e interações. Bula Hixizine: acima de 6 meses; a posologia requer limites por idade, peso e avaliação de segurança conforme bula.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Hixizine-Profissional-Consulta-Remedios.pdf',l:[{t:'Xarope Hixizine 2 mg/mL',c:2,r:'hix'}]},
 {id:'prometazina',g:1,n:'Prometazina',b:'Fenergan; genéricos. Fenergan Expectorante é associação, não prometazina isolada.',f:'Comprimidos 25 mg; solução injetável 25 mg/mL (Fenergan referência descontinuado em 2023; verificar similares); algumas associações em xarope.',i:'Anti-H1 sedativo; também possui ações antiemética e anticolinérgica.',k:'Não recomendada como tratamento rotineiro de rinite/urticária.',w:'Contraindicada em menores de 2 anos pelo risco de depressão respiratória. Injetável exige cuidados específicos; não converter xarope associado para dose de prometazina isolada.',u:BULAS},
 {id:'ciproheptadina',g:1,n:'Ciproheptadina',b:'Cobavital (associado a cobamamida); outras marcas dependem do mercado.',f:'Cobavital: microcomprimido 4 mg de ciproheptadina + 1 mg de cobamamida; outras formas devem ser verificadas por registro.',i:'Anti-H1 sedativo e antisserotoninérgico; uso em associação como estimulante do apetite tem outra indicação.',k:'Evitar utilizar uma associação como equivalente posológico de anti-H1 isolado.',w:'Sedação, aumento de apetite e efeitos anticolinérgicos. Não há cálculo automático para associação.',u:'https://consultaremedios.com.br/cobavital/bula'},
 {id:'cetotifeno',g:1,n:'Cetotifeno',b:'Zaditen; genéricos',f:'Oral: xarope 0,2 mg/mL, gotas 1 mg/mL e comprimidos 1 mg. Ocular: Zaditen colírio 0,25 mg/mL.',i:'Uso preventivo em doenças alérgicas; ação estabilizadora de mastócitos. Não trata crise aguda de asma.',k:'Anti-H1 sedativo com efeito estabilizador de mastócitos. Classificado aqui como primeira geração por sua ação central.',w:'Pode causar sonolência. Confirme se o frasco é xarope 0,2 mg/mL ou gotas 1 mg/mL; doses em gotas dependem do gotejador.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Zaditen-Paciente-Consulta-Remedios.pdf',l:[{t:'Xarope 0,2 mg/mL',c:0.2,r:'cetiF'},{t:'Gotas 1 mg/mL',c:1,r:'cetiF'}]},
 {id:'difenidramina',g:1,n:'Difenidramina',b:'Diversas associações e formulações tópicas; Benadryl em mercados externos',f:'Formulações tópicas e associações; apresentações orais isoladas dependem do país/registro.',i:'Anti-H1 sedativo, com ação anticolinérgica e antiemética.',k:'Preferir anti-H1 de segunda geração para doença alérgica. Não confundir difenidramina com dimenidrinato.',w:'Alto risco de sedação e intoxicação em crianças; não usar marcas estrangeiras como prova de registro no Brasil.',u:BULAS,h:1},
 {id:'dimenidrinato',g:1,n:'Dimenidrinato',b:'Dramin; Dramin B6 é associação',f:'Oral: cápsulas/comprimidos e gotas. Injetável: Dramin B6 IM e Dramin B6 DL EV, em associação com piridoxina.',i:'Predominantemente antiemético/antivertiginoso; não é escolha habitual para rinite ou urticária.',k:'Anti-H1 sedativo com ação antiemética.',w:'Não calcular como antialérgico a partir de Dramin B6, que possui outro princípio ativo.',u:'https://consultaremedios.com.br/dramin/bula'},
 {id:'meclozina',g:1,n:'Meclozina (meclizina)',b:'Meclin',f:'Comprimidos 25 e 50 mg; verificar apresentação vigente.',i:'Cinetose, vertigem e náuseas/vômitos; não é terapêutica habitual da rinite ou urticária.',k:'Anti-H1 de primeira geração com maior uso como antiemético.',w:'Sedação e efeitos anticolinérgicos; avaliar gravidez e interações de acordo com a indicação.',u:'https://consultaremedios.com.br/meclin/bula'},
 {id:'clemastina',g:1,n:'Clemastina',b:'Emistin (em associação com dexametasona); Tavegyl em outros mercados',f:'Associação de clemastina 1 mg + dexametasona 0,5 mg; monoterapia brasileira deve ser conferida.',i:'Anti-H1 sedativo; uso limitado como primeira opção em alergia.',k:'Não confundir medicamento associado a corticoide com anti-histamínico isolado.',w:'Associações mudam indicações e contraindicações; a posologia depende da formulação isolada e da bula específica.',u:BULAS,h:1},
 {id:'bronfeniramina',g:1,n:'Bronfeniramina',b:'Decongex Plus (em associação com fenilefrina)',f:'Comprimidos e soluções orais em associações; confirmar composição antes de prescrever.',i:'Sintomas de rinite em produtos combinados; não recomendada como anti-H1 isolado de rotina.',k:'Anti-H1 alquilamina de primeira geração.',w:'Não converter a dose da combinação como se fosse anti-H1 isolado; descongestionantes apresentam contraindicações adicionais.',u:BULAS},
 {id:'clorfeniramina',g:1,n:'Clorfeniramina',b:'Marcas e associações variáveis; verificar registro local.',f:'Comprimidos e líquidos em diferentes mercados; sem padronização de apresentação isolada confirmada neste catálogo.',i:'Anti-H1 clássico; uso limitado pelo perfil sedativo.',k:'Não confundir com dexclorfeniramina: são fármacos distintos.',w:'Sem cálculo automático sem bula da apresentação exata.',u:BULAS,h:1},
 {id:'doxilamina',g:1,n:'Doxilamina',b:'Marcas específicas em outros países',f:'Comprimidos, frequentemente em associações para náuseas gravídicas em outros mercados.',i:'Anti-H1 sedativo, não recomendado como primeira linha para doenças alérgicas.',k:'O emprego antiemético ou como indutor do sono não deve ser confundido com tratamento de rinite/urticária.',w:'Sem confirmação de formulação antialérgica isolada brasileira.',u:BULAS,h:1},
 {id:'triprolidina',g:1,n:'Triprolidina',b:'Associações para resfriados em outros mercados',f:'Formas orais variáveis conforme produto/país.',i:'Anti-H1 sedativo, não recomendado rotineiramente.',k:'Substância histórica em associações para sintomas respiratórios.',w:'Sem apresentação isolada validada no Brasil neste catálogo.',u:BULAS,h:1},
 {id:'alimemazina',g:1,n:'Alimemazina (trimeprazina)',b:'Theralene em outros mercados',f:'Soluções e comprimidos em outros países; não confirmados como disponíveis no Brasil.',i:'Anti-H1 sedativo, não é primeira escolha para alergias.',k:'Exemplo de fenotiazina sedativa, incluída para referência farmacológica.',w:'Não há apresentação brasileira validada.',u:BULAS,h:1},
 {id:'feniramina',g:1,n:'Feniramina',b:'Claril, Uniclarin, Clanistil (associações oculares com nafazolina)',f:'Colírios combinados em apresentações específicas; sem solução oral monocomponente validada.',i:'Alívio ocular em formulações combinadas; não extrapolar para uso sistêmico.',k:'Anti-H1 clássico; a associação muda a segurança da aplicação ocular.',w:'A administração ocular é expressa em gotas por olho, conforme apresentação.',u:BULAS,h:1},
 {id:'oxatomida',g:1,n:'Oxatomida',b:'Tinset (referência histórica)',f:'Comprimidos/suspensões históricos, sem disponibilidade brasileira atual verificada.',i:'Anti-H1 antigo com uso antialérgico histórico.',k:'Item de referência farmacológica; não sugerir como opção prescritiva atual sem registro ativo.',w:'Sem bula brasileira vigente validada.',u:BULAS,h:1},

 {id:'loratadina',g:2,n:'Loratadina',b:'Claritin, Loremix, Histamix, Loralerg; genéricos',f:'Xarope 1 mg/mL (5 mg/5 mL); comprimidos 10 mg.',i:'Rinite alérgica e urticária.',k:'Anti-H1 de segunda geração, com baixo potencial de sedação; útil como primeira linha.',w:'A dose pediátrica entre 2 e 11 anos depende do peso: menos de 30 kg vs. 30 kg ou mais. Considerar doença hepática grave.',u:SBP,l:[{t:'Xarope 1 mg/mL',c:1,r:'lora'}]},
 {id:'desloratadina',g:2,n:'Desloratadina',b:'Desalex, Destadin; genéricos',f:'Xarope 0,5 mg/mL; gotas 1,25 mg/mL (conforme marca); comprimidos 5 mg.',i:'Rinite alérgica e urticária.',k:'Metabólito ativo da loratadina, habitualmente uma administração por dia.',w:'Confirme indicação por faixa etária e bula específica: o xarope Desalex possui bula acima de 6 meses. Não usar o número de gotas de outra marca.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Desalex-Profissional-Consulta-Remedios.pdf',l:[{t:'Xarope Desalex 0,5 mg/mL',c:0.5,r:'des'},{t:'Gotas 1,25 mg/mL (validar marca)',c:1.25,r:'des'}]},
 {id:'cetirizina',g:2,n:'Cetirizina',b:'Zyrtec, Zetalerg; genéricos',f:'Solução oral 1 mg/mL; gotas 10 mg/mL (apresentações específicas); comprimidos 10 mg.',i:'Rinite alérgica e urticária.',k:'Anti-H1 de segunda geração; pode causar sonolência em uma proporção dos pacientes.',w:'Ajustar conforme função renal. Não converter mL em gotas sem conhecer o gotejador da marca.',u:'https://img.drogasil.com.br/raiadrogasil_bula/ZYRTEC.pdf',l:[{t:'Solução oral 1 mg/mL',c:1,r:'cet'},{t:'Gotas 10 mg/mL (validar marca)',c:10,r:'cet'}]},
 {id:'levocetirizina',g:2,n:'Levocetirizina',b:'Zyxem; genéricos',f:'Gotas 5 mg/mL (Zyxem: 20 gotas/mL); comprimidos 5 mg.',i:'Rinite alérgica e urticária.',k:'Enantiômero ativo da cetirizina; uso de manutenção em maiores de 6 anos.',w:'Exige avaliação/ajuste na insuficiência renal. A contagem de gotas depende do produto; o Hub exibe mL.',u:'https://consultaremedios.com.br/zyxem/bula',l:[{t:'Gotas Zyxem 5 mg/mL',c:5,r:'levo'}]},
 {id:'fexofenadina',g:2,n:'Fexofenadina',b:'Allegra, Praalergia, Rafex; genéricos',f:'Suspensão oral pediátrica 6 mg/mL; comprimidos 60, 120 e 180 mg.',i:'Rinite alérgica e urticária; indicação da suspensão em lactentes depende do diagnóstico.',k:'Baixo potencial sedativo. A dose e a idade mínima da suspensão diferem conforme rinite e urticária.',w:'Suspensão pediátrica: rinite sazonal a partir de 2 anos; urticária idiopática crônica a partir de 6 meses. Antiácidos com alumínio/magnésio e sucos podem reduzir absorção.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Allegra-Paciente-Consulta-Remedios.pdf',l:[{t:'Suspensão Allegra 6 mg/mL',c:6,r:'fexo'}]},
 {id:'bilastina',g:2,n:'Bilastina',b:'Alektos; Alektos Ped; genéricos',f:'Alektos Ped: solução oral 2,5 mg/mL; comprimidos 20 mg. Outras concentrações não são intercambiáveis sem verificar bula.',i:'Rinoconjuntivite alérgica e urticária.',k:'Anti-H1 de segunda geração; administração separada de alimentos e sucos de frutas conforme bula.',w:'Alektos Ped aprovado para 6 a 11 anos e peso mínimo de 20 kg: 4 mL (10 mg) uma vez ao dia. Não inferir 4 mg/mL a partir de tabelas secundárias.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Alektos-Ped-Profissional-Consulta-Remedios.pdf',l:[{t:'Alektos Ped 2,5 mg/mL',c:2.5,r:'bila'}]},
 {id:'ebastina',g:2,n:'Ebastina',b:'Ebastel; genéricos',f:'Xarope ou solução oral 1 mg/mL; comprimidos 10 mg (e 20 mg conforme produto).',i:'Rinite alérgica e urticária.',k:'Anti-H1 de segunda geração, metabolismo em carebastina.',w:'Cautela em insuficiência hepática e com interações metabólicas/QT. Posologia pediátrica de xarope conforme apresentação.',u:'https://eurofarma.com.br/produtos/bulas/view/patient/pt/bula-ebastel.html',l:[{t:'Ebastel xarope 1 mg/mL',c:1,r:'eba'}]},
 {id:'rupatadina',g:2,n:'Rupatadina',b:'Rupafin',f:'Comprimidos 10 mg; solução oral de outros mercados não foi validada para o catálogo brasileiro.',i:'Rinite alérgica e urticária crônica.',k:'Anti-H1 de segunda geração com atividade adicional no receptor de PAF.',w:'Comprimido brasileiro: uso a partir de 12 anos. Confirmar disponibilidade e registro vigente antes da prescrição.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/Bula-Rupafin-Paciente-Consulta-Remedios.pdf'},
 {id:'epinastina',g:2,n:'Epinastina',b:'Talerc (oral); Relestat (colírio)',f:'Comprimidos orais 10 e 20 mg; solução oftálmica 0,5 mg/mL.',i:'Rinite alérgica (oral) e conjuntivite alérgica (tópica ocular).',k:'Anti-H1 de segunda geração; vias oral e oftálmica têm indicações distintas.',w:'Talerc oral: uso acima de 12 anos. Relestat ocular: uso acima de 3 anos.',u:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Talerc-Profissional-Consulta-Remedios.pdf'},
 {id:'azelastina',g:2,n:'Azelastina',b:'Rino-Lastin; Aznite; genéricos',f:'Spray nasal 1 mg/mL (Rino-Lastin e Aznite). As associações com corticoides possuem fichas separadas.',i:'Rinite alérgica; monoterapia anti-H1 por via intranasal.',k:'Anti-H1 intranasal com início rápido de ação. Diferenciar a formulação isolada das associações.',w:'Rino-Lastin e Aznite: formulações nasais 1 mg/mL; uso pediátrico acima de 5 anos conforme bula. Consultar posologia por faixa etária.',u:'https://www.viatris.com.br/-/media/project/common/viatriscombr/pdf/leaflets_legacy_myl_brazil/rino_lastin_bula_profissional_de_saude.pdf'},
  {id:'azelastina_fluticasona',g:2,combo:true,n:'Azelastina + fluticasona',b:'Dymista',f:'Spray nasal: 137 mcg de cloridrato de azelastina + 50 mcg de propionato de fluticasona por acionamento.',i:'Rinite alérgica moderada a grave quando a monoterapia anti-H1 ou com corticosteroide nasal não é suficiente.',k:'Associação fixa de anti-H1 intranasal + corticosteroide intranasal. Não confundir com azelastina isolada.',w:'Bula brasileira: uso adulto e pediátrico acima de 6 anos. Posologia e técnica dependem da apresentação; evitar pulverizar em direção ao septo.',u:'https://www.viatris.com.br/-/media/project/common/viatriscombr/pdf/leaflets_legacy_myl_brazil/1-dymista-bula-profissional.pdf'},
 {id:'olopatadina',g:2,n:'Olopatadina',b:'Patanol; Patanol S; genéricos oftálmicos',f:'Colírios oftálmicos. A associação nasal olopatadina + mometasona (Ryaltris) consta em ficha própria.',i:'Conjuntivite alérgica (apresentações oftálmicas).',k:'Anti-H1 tópico ocular com propriedades estabilizadoras de mastócitos. A via nasal está representada pela associação Ryaltris.',w:'Não confundir colírios de olopatadina com spray nasal. Posologia por apresentação e faixa etária.',u:'https://consultaremedios.com.br/patanol/bula'},
  {id:'olopatadina_mometasona',g:2,combo:true,n:'Olopatadina + mometasona',b:'Ryaltris',f:'Spray nasal: 665 mcg de cloridrato de olopatadina (equivalentes a 600 mcg de olopatadina) + 25 mcg de furoato de mometasona por acionamento.',i:'Tratamento dos sintomas moderados a graves de rinite alérgica a partir de 12 anos.',k:'Associação fixa de anti-H1 intranasal + corticosteroide intranasal. Não é olopatadina nasal isolada.',w:'Uso a partir de 12 anos segundo a bula brasileira. Agitar bem e não direcionar o jato ao septo ou aos olhos.',u:'https://glenmarkpharma.com.br/wp-content/uploads/2026/10/Ryaltris_Bula_Paciente_VP00.pdf'},
 {id:'bepotastina',g:2,n:'Bepotastina',b:'Bepreve (referência internacional)',f:'Solução oftálmica 1,5% em mercados específicos.',i:'Prurido ocular por conjuntivite alérgica.',k:'Anti-H1 tópico ocular.',w:'Referência internacional Bepreve; a disponibilidade comercial brasileira deve ser avaliada separadamente.',u:BULAS,h:1},
 {id:'emedastina',g:2,n:'Emedastina',b:'Emadine (referência histórica/internacional)',f:'Solução oftálmica 0,5 mg/mL em mercados específicos.',i:'Conjuntivite alérgica.',k:'Anti-H1 ocular.',w:'Sem confirmação de disponibilidade brasileira atual; não converter colírio em dose sistêmica.',u:BULAS,h:1},
 {id:'mizolastina',g:2,n:'Mizolastina',b:'Mizollen (histórico/internacional)',f:'Comprimidos 10 mg em mercados externos.',i:'Rinite e urticária em mercados onde aprovado.',k:'Anti-H1 de segunda geração estudado em urticária.',w:'Não considerar disponível ou aprovado no Brasil sem pesquisa atual no bulário da Anvisa.',u:GA2LEN,h:1},
 {id:'acrivastina',g:2,n:'Acrivastina',b:'Semprex (internacional)',f:'Cápsulas 8 mg em mercados específicos.',i:'Rinite e urticária em mercados onde aprovado.',k:'Anti-H1 periférico de segunda geração; disponibilidade local incerta.',w:'Verificar registro no Brasil; não inferir posologia a partir de produtos estrangeiros.',u:BULAS,h:1},
 {id:'terfenadina',g:2,n:'Terfenadina',b:'Marcas históricas — não usar',f:'Produto histórico retirado/descontinuado em numerosos mercados.',i:'Referência histórica da farmacologia, não opção terapêutica.',k:'Atenção: fármaco associado a cardiotoxicidade e interações medicamentosas.',w:'NÃO RECOMENDADO. Foi substituído por alternativas mais seguras, como fexofenadina.',u:GA2LEN,h:1},
 {id:'astemizol',g:2,n:'Astemizol',b:'Marcas históricas — não usar',f:'Produto histórico retirado/descontinuado em numerosos mercados.',i:'Referência histórica, não opção terapêutica.',k:'Risco importante de QT prolongado e arritmia.',w:'NÃO RECOMENDADO. Não selecionar para tratamento da rinite ou urticária.',u:GA2LEN,h:1},
 {id:'levocabastina',g:2,n:'Levocabastina',b:'Livostin (referência histórica; confirmar registro atual no Brasil)',f:'Ocular: suspensão 0,5 mg/mL. Nasal: spray 0,5 mg/mL em mercados específicos.',i:'Conjuntivite e rinite alérgica nas apresentações autorizadas.',k:'Anti-H1 de aplicação tópica em mucosa ocular e nasal.',w:'Disponibilidade comercial e registro brasileiro atuais não confirmados; não extrapolar concentração, gotas ou idade entre produtos.',u:'https://www.e-lactancia.org/media/papers/Levocabastine-DS-JJ2010.pdf',h:1}
];

window.AH_ROUTES={
 acrivastina:['oral'],alimemazina:['oral'],astemizol:['oral'],azelastina:['nasal'],azelastina_fluticasona:['nasal'],
 bepotastina:['ocular'],bilastina:['oral'],bronfeniramina:['oral'],
 cetirizina:['oral'],cetotifeno:['oral','ocular'],ciproheptadina:['oral'],
 clemastina:['oral'],clorfeniramina:['oral'],desloratadina:['oral'],
 dexclorfeniramina:['oral'],difenidramina:['oral'],
 dimenidrinato:['oral','injetavel'],doxilamina:['oral'],ebastina:['oral'],
 emedastina:['ocular'],epinastina:['oral','ocular'],feniramina:['ocular'],
 fexofenadina:['oral'],hidroxizina:['oral'],levocabastina:['ocular','nasal'],levocetirizina:['oral'],
 loratadina:['oral'],meclozina:['oral'],mizolastina:['oral'],
 olopatadina:['ocular'],olopatadina_mometasona:['nasal'],oxatomida:['oral'],prometazina:['oral','injetavel'],
 rupatadina:['oral'],terfenadina:['oral'],triprolidina:['oral']
};
window.AH_ROUTE_LABELS={oral:'Oral',ocular:'Ocular',nasal:'Nasal',injetavel:'Injetável'};
var state={route:'todas',query:'',selected:null,init:false};
function escapeHtml(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function fmt(v){return Number(v.toFixed(2)).toLocaleString('pt-BR',{maximumFractionDigits:2});}
function get(id){return ITEMS.find(function(x){return x.id===id;});}
function init(){
 var root=document.getElementById('ahApp');if(!root)return;
 if(state.init)return;state.init=true;
 root.innerHTML='<header class="ah-head"><div class="ah-kicker">Farmacologia clínica · Anti-H1</div><h1>Anti-histamínicos</h1><p class="ah-sub">Catálogo alfabético de anti-histamínicos H1 com vias de administração identificadas. Selecione cada fármaco para consultar apresentações, marcas, orientações e calculadoras de soluções orais.</p></header>'+
 '<div class="ah-alert">Diretrizes atuais priorizam anti-H1 de segunda geração para rinite e urticária. Os de primeira geração apresentam maior risco de sedação, prejuízo cognitivo e efeitos anticolinérgicos. Anti-histamínicos não substituem adrenalina intramuscular na anafilaxia.</div>'+
 '<div class="ah-toolbar"><div class="ah-tabs ah-route-tabs" role="group" aria-label="Filtrar por via de administração"><button type="button" class="ah-tab" data-ah-route="todas" aria-pressed="true">Todas</button><button type="button" class="ah-tab" data-ah-route="oral" aria-pressed="false">Oral</button><button type="button" class="ah-tab" data-ah-route="ocular" aria-pressed="false">Ocular</button><button type="button" class="ah-tab" data-ah-route="nasal" aria-pressed="false">Nasal</button><button type="button" class="ah-tab" data-ah-route="injetavel" aria-pressed="false">Injetável</button></div><input type="search" class="ah-search" id="ahSearch" aria-label="Pesquisar anti-histamínico ou nome comercial" placeholder="Pesquisar princípio ativo ou marca..." autocomplete="off"></div>'+
 '<p class="ah-counter" id="ahCounter"></p><div class="ah-grid" id="ahGrid" aria-label="Catálogo de anti-histamínicos"></div>'+
 '<p class="ah-footnote">Fontes de referência: <a href="'+SBP+'" target="_blank" rel="noopener noreferrer">SBP — Rinite alérgica na infância e adolescência (Tabela 2)</a> · <a href="'+GA2LEN+'" target="_blank" rel="noopener noreferrer">Diretriz internacional de urticária 2026</a> · <a href="'+BULAS+'" target="_blank" rel="noopener noreferrer">Bulário eletrônico Anvisa</a>. Marcas são exemplos, não comprovação de disponibilidade ou registro ativo. Última revisão da seção: 14/11/2026. Não salva dados do paciente.</p>';
 root.addEventListener('click',function(e){
  var tab=e.target.closest('[data-ah-route]');
  if(tab){state.route=tab.dataset.ahRoute;state.selected=null;render();return;}
  var card=e.target.closest('[data-ah-id]');
  if(card){var id=card.dataset.ahId;state.selected=state.selected===id?null:id;renderCards();renderDetail();if(state.selected){var opened=root.querySelector('.ah-card-wrap-active');if(opened)opened.scrollIntoView({block:'nearest',behavior:'smooth'});}return;}
  if(e.target.closest('[data-ah-close]')){var selectedId=state.selected;state.selected=null;renderCards();renderDetail();var target=Array.from(root.querySelectorAll('[data-ah-id]')).find(function(el){return el.dataset.ahId===selectedId;});if(target)target.focus({preventScroll:true});return;}
  if(e.target.closest('[data-ah-calc]')){calculate();return;}
 });
 root.addEventListener('input',function(e){if(e.target.id==='ahSearch'){state.query=e.target.value;state.selected=null;render();}else if(e.target.closest('#ahCalc')){var out=document.getElementById('ahResult');if(out){out.hidden=true;out.textContent='';}}});
 root.addEventListener('change',function(e){if(e.target.closest('#ahCalc')){var out=document.getElementById('ahResult');if(out)out.hidden=true;}});
 render();
}
function render(){
 var root=document.getElementById('ahApp');if(!root)return;
 root.querySelectorAll('[data-ah-route]').forEach(function(t){t.setAttribute('aria-pressed',String(t.dataset.ahRoute===state.route));});
 renderCards();renderDetail();
}
function filtered(){var q=norm(state.query);return ITEMS.filter(function(x){return (state.route==='todas'||(window.AH_ROUTES[x.id]||[]).indexOf(state.route)>=0)&&(!q||norm(x.n+' '+x.b+' '+x.f+' '+x.i).indexOf(q)>=0);}).sort(function(a,b){return a.n.localeCompare(b.n,'pt-BR');});}
function renderCards(){
 var area=document.getElementById('ahGrid');if(!area)return;
 var a=filtered(),counter=document.getElementById('ahCounter');
 if(counter)counter.textContent=a.length+' fármacos em ordem alfabética'+(state.route==='todas'?'':' · via '+window.AH_ROUTE_LABELS[state.route].toLowerCase());
 area.innerHTML=a.length?a.map(function(x){
  var selected=state.selected===x.id;
  var routes=window.AH_ROUTES[x.id]||['oral'];
  var predominant=routes[0]||'oral';
  var pills=routes.map(function(v){return '<span class="ah-chip ah-chip-'+escapeHtml(v)+'">'+escapeHtml(window.AH_ROUTE_LABELS[v]||v)+'</span>';}).join('')+(x.combo?'<span class="ah-chip">Associação com corticoide</span>':'');
  return '<article class="ah-card-wrap ah-route-'+escapeHtml(predominant)+(routes.length>1?' ah-route-multi':'')+(selected?' ah-card-wrap-active':'')+'" data-ah-wrap="'+escapeHtml(x.id)+'">'+
   '<button type="button" class="ah-card" data-ah-id="'+escapeHtml(x.id)+'" aria-expanded="'+String(selected)+'" aria-controls="'+(selected?'ahDetail':'')+'"><span><span class="ah-card-name">'+escapeHtml(x.n)+'</span><span class="ah-card-brand" style="display:block;margin-top:5px">'+escapeHtml(x.b)+'</span></span><span class="ah-card-foot"><span class="ah-chip-group">'+pills+'</span><span class="ah-card-chevron" aria-hidden="true">'+(selected?'⌃':'›')+'</span></span></button>'+
   (selected?'<section class="ah-detail" id="ahDetail" aria-label="Detalhes de '+escapeHtml(x.n)+'" aria-live="polite"></section>':'')+
   '</article>';
 }).join(''):'<div class="ah-empty">Nenhum fármaco encontrado com esse termo. Experimente o princípio ativo ou a marca.</div>';
}
/* Limites padronizados apenas quando sustentados pelas apresentações citadas.
   Para associações e vias tópicas, o limite depende da bula do produto específico. */
/* Posologia definida por produto e via; evita apresentar valores genéricos como limites.
   Os produtos externos são identificados explicitamente. Sem dado de segurança,
   a ficha não mostra uma dose máxima fictícia. */
var AH_DAILY_MAX={
 bepotastina:{dose:'Bepreve 1,5%: 1 gota em cada olho afetado, 2 vezes ao dia (2 gotas/olho/dia).',source:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=68bbf6a0-c4b5-47c1-8a1c-08220fbdbce6',external:true},
 emedastina:{dose:'Emadine 0,5 mg/mL: 1 gota em cada olho afetado, 2 vezes ao dia (2 gotas/olho/dia); a partir de 3 anos.',source:'https://www.ema.europa.eu/en/documents/product-information/emadine-epar-product-information_en.pdf',external:true},
 levocabastina:{dose:'Livostin 0,5 mg/mL: colírio até 1 gota por olho, 4 vezes ao dia; spray nasal até 2 jatos por narina, 4 vezes ao dia (bula australiana).',source:'https://www.safetyandquality.gov.au/medicine-finder/livostin-eye-drops-and-nasal-spray',external:true},
 acrivastina:{dose:'Cápsulas 8 mg: máximo 24 mg/dia (1 cápsula até 3 vezes ao dia), a partir de 12 anos; referência britânica.',source:'https://www.nhs.uk/medicines/acrivastine/how-and-when-to-take-acrivastine/',external:true},
 rupatadina:{dose:'Rupafin comprimidos 10 mg: 10 mg por via oral, 1 vez ao dia; a partir de 12 anos.',source:'https://img.drogasil.com.br/raiadrogasil_bula/Rupafin.pdf'},
 epinastina:{dose:'Talerc oral: até 20 mg/dia em adultos e maiores de 12 anos. Relestat 0,05% ocular: 1 gota em cada olho afetado, 2 vezes ao dia (2 gotas/olho/dia), a partir de 3 anos.',source:'https://www.abbvie.com.br/content/dam/abbvie-dotcom/br/documents/Relestat.pdf'},
 azelastina:{dose:'Rino-Lastin nasal (azelastina isolada): de 5 a 11 anos, 1 jato por narina 2 vezes/dia; a partir de 12 anos, até 2 jatos por narina 2 vezes/dia, conforme necessidade e bula.',source:'https://www.viatris.com.br/-/media/project/common/viatriscombr/pdf/leaflets_legacy_myl_brazil/rino_lastin_bula_profissional_de_saude.pdf'},
  azelastina_fluticasona:{dose:'Dymista: 1 jato por narina a cada 12 horas; 137 mcg de azelastina + 50 mcg de fluticasona por acionamento; uso adulto e pediátrico acima de 6 anos, conforme bula.',source:'https://www.viatris.com.br/-/media/project/common/viatriscombr/pdf/leaflets_legacy_myl_brazil/1-dymista-bula-profissional.pdf'},
  olopatadina_mometasona:{dose:'Ryaltris: a partir de 12 anos, 2 jatos por narina a cada 12 horas; 665 mcg de cloridrato de olopatadina + 25 mcg de mometasona por acionamento.',source:'https://glenmarkpharma.com.br/wp-content/uploads/2026/10/Ryaltris_Bula_Paciente_VP00.pdf'},
 olopatadina:{dose:'Patanol 0,1%: 1 gota por olho afetado 2 vezes ao dia. Patanol S 0,2%: 1 gota por olho afetado 1 vez ao dia (até 2 gotas/dia se ambos os olhos).',source:'https://portal.novartis.com.br/medicamentos/wp-content/uploads/2021/10/Bula-PATANOL-S-Solucao-Oftalmica-Esteril-Medico.pdf'},
 ciproheptadina:{dose:'Cobavital (4 mg de ciproeptadina por microcomprimido): 2–6 anos, até 2 microcomprimidos/dia (8 mg); maiores de 6 anos, 2 microcomprimidos/dia (8 mg); adultos, até 3 microcomprimidos/dia (12 mg). Valores exclusivos dessa associação.',source:'https://www.abbottbrasil.com.br/nossas-bulas/cobavital-cobamamida-ciproeptadina.html'},
 dimenidrinato:{dose:'Dramin comprimidos 100 mg: máximo 400 mg em 24 horas para adultos e maiores de 12 anos. Formulações pediátricas e injetáveis têm limites próprios.',source:'https://guiafarmaceutico.hsl.org.br/Paginas/DIMENIDRINATO.aspx'},
 meclozina:{dose:'Meclin comprimidos: cinetose 25–50 mg em 24 horas; vertigem e náuseas/vômitos gestacionais até 100 mg/dia em doses divididas, conforme indicação.',source:'https://produtos.apsen.com.br/meclin'}
};
function maxDailyBlock(x){
 var d=AH_DAILY_MAX[x.id];
 if(!d)return '';
 return '<div class="ah-block" style="margin-top:17px"><h3>Posologia diária de referência</h3><p>'+escapeHtml(d.dose)+'</p>'+
 (d.external?'<p class="ah-calc-note">Referência internacional; não implica registro ou comercialização no Brasil.</p>':'')+
 '<p><a href="'+escapeHtml(d.source)+'" target="_blank" rel="noopener noreferrer">Fonte da posologia</a></p></div>';
}
function renderDetail(){
 var el=document.getElementById('ahDetail');if(!el)return;
 var x=get(state.selected);if(!x){el.hidden=true;el.innerHTML='';return;}
 el.hidden=false;
 var form=x.l?'<div class="ah-calc" id="ahCalc"><div class="ah-calc-title">Calculadora da solução oral</div><p>Insira idade e peso. O cálculo usa somente a concentração selecionada, sem extrapolar para produtos combinados.</p>'+
  '<div class="ah-field-grid"><div class="ah-field"><label for="ahLiquid">Apresentação líquida</label><select id="ahLiquid">'+x.l.map(function(z,j){return '<option value="'+j+'">'+escapeHtml(z.t)+'</option>';}).join('')+'</select></div><div class="ah-field"><label for="ahAge">Idade (anos; aceita decimal)</label><input id="ahAge" type="number" min="0" max="120" step="0.1" inputmode="decimal" placeholder="Ex.: 3,5"></div><div class="ah-field"><label for="ahWeight">Peso (kg)</label><input id="ahWeight" type="number" min="2" max="250" step="0.1" inputmode="decimal" placeholder="Ex.: 15"></div></div>'+
 (x.id==='fexofenadina'?'<div class="ah-field" style="max-width:310px;margin-bottom:12px"><label for="ahIndication">Indicação</label><select id="ahIndication"><option value="rinite">Rinite alérgica</option><option value="urticaria">Urticária crônica idiopática</option></select></div>':'')+
 '<button type="button" class="ah-calc-action" data-ah-calc>Calcular volume por administração</button><div id="ahResult" class="ah-result" role="status" aria-live="polite" hidden></div><p class="ah-calc-note">Resultado orientativo, não prescrição. Confirme indicação, concentração (mg/mL), bula de sua marca, dose máxima, contraindicações, função renal/hepática e interações antes da administração. Nas gotas, converta mL para gotas somente com o gotejador da marca.</p></div>':
 maxDailyBlock(x);
 el.innerHTML='<div class="ah-detail-top"><div><div class="ah-kicker">'+(x.combo?'Associação · anti-H1 + corticoide intranasal':(x.g===1?'Primeira':'Segunda')+' geração · anti-H1')+'</div><h2>'+escapeHtml(x.n)+'</h2><p>Via: '+(window.AH_ROUTES[x.id]||[]).map(function(v){return window.AH_ROUTE_LABELS[v];}).join(' · ')+'</p><p>'+escapeHtml(x.k)+'</p></div><button type="button" class="ah-close" data-ah-close aria-label="Fechar ficha">×</button></div>'+
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
  if(age>=65)return {error:'Hidroxizina não é recomendada em idosos. A posologia exige avaliação e prescrição individual, considerando o risco de eventos adversos.'};
  if(age<12||wt<=40){d.mg=Math.min(wt*0.7,wt*2/3);d.times=3;d.max='Limite pediátrico adotado: 2 mg/kg/dia; a bula descreve 0,7 mg/kg/dose, mas exige respeitar o teto diário.';}
  else {d.mg=25;d.times=3;d.max='Referência adulta: 25 mg três vezes ao dia; máximo da bula 100 mg/dia.';}
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
  '<span class="ah-dose-unica">'+escapeHtml(fmt(d.mg)+' mg por administração')+'</span>'+
  '<p style="margin-top:8px">Apresentação selecionada: '+escapeHtml(form.t)+'.</p>'+
  (d.caution?'<p style="margin-top:7px;color:#86572e">'+escapeHtml(d.caution)+'</p>':'');
}
window.ahInit=init;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){if(document.querySelector('#page-antihistaminicos.active'))init();});
else if(document.querySelector('#page-antihistaminicos.active'))init();
})();
