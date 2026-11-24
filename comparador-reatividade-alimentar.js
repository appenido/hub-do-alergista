/* Hub do Alergista · Comparador molecular de reatividade cruzada alimentar
 * Base clínica: ASBAI/SBP 2025; EAACI MAUG 2.0 (2023); EAACI Food Allergy Diagnosis 2023.
 * Apoio ao raciocínio, não calculadora de probabilidade individual de reação.
 * Não armazena informação de paciente ou resultados.
 */
(function () {
  "use strict";
  if (window.hubFoodCrossLoaded) return;
  window.hubFoodCrossLoaded = true;

  var FOODS = [], byId = {};
  function add(id, label, synonyms, components, type) {
    var c = (components || "").split(";").filter(Boolean).map(function(t) {
      var p = t.split("~");
      return { name:p[0].trim(), family:p[1] || "", tier:p[2] || "complementar" };
    });
    var f={id:id,label:label,synonyms:synonyms||"",components:c,type:type||"vegetal"};
    FOODS.push(f);byId[id]=f;
  }

  // Componentes da literatura: a presença aqui NÃO equivale à disponibilidade de exame de rotina.
  // Onde não há marcador molecular validado, indicamos extrato/puntura dirigidos pela história.
  add("amendoim","Amendoim","peanut","Ara h 2~2S~prioritário;Ara h 6~2S~complementar;Ara h 1~7S~complementar;Ara h 3~11S~complementar;Ara h 8~PR10~contextual;Ara h 9~LTP~contextual;Ara h 5~profilina~referência");
  add("caju","Castanha-de-caju","cashew,castanha de caju","Ana o 3~2S~prioritário;Ana o 1~7S~complementar;Ana o 2~11S~complementar");
  add("pistache","Pistache","pistachio","Pis v 1~2S~contextual;Pis v 2~11S~referência;Pis v 3~7S~referência;Pis v 5~11S~referência");
  add("noz","Noz","walnut,nozes","Jug r 1~2S~prioritário;Jug r 4~11S~complementar;Jug r 2~7S~complementar;Jug r 3~LTP~contextual;Jug r 5~profilina~referência");
  add("peca","Noz-pecã","pecan,noz peca","Car i 1~2S~contextual;Car i 2~7S~referência;Car i 4~11S~referência");
  add("avela","Avelã","hazelnut","Cor a 14~2S~prioritário;Cor a 9~11S~prioritário;Cor a 11~7S~complementar;Cor a 8~LTP~contextual;Cor a 1~PR10~contextual;Cor a 2~profilina~referência");
  add("amendoa","Amêndoa","almond","Pru du 6~11S~contextual;Pru du 3~LTP~contextual;Pru du 4~profilina~referência");
  add("para","Castanha-do-pará","castanha do para,castanha do brasil,brazil nut","Ber e 1~2S~contextual;Ber e 2~11S~referência");
  add("macadamia","Macadâmia","macadamia","Mac i 1~7S~referência;Mac i 2~11S~referência");
  add("pinoli","Pinoli (pinhão europeu)","pine nut,pinus pinea","Pin p 1~2S~referência");
  add("gergelim","Gergelim","sesame","Ses i 1~2S~prioritário;Ses i 2~2S~referência;Ses i 3~7S~referência;Ses i 6~11S~referência;Ses i 7~11S~referência");
  add("girassol","Semente de girassol","girassol,sunflower","Hel a 3~LTP~contextual");
  add("mostarda","Mostarda","mustard","Sin a 1~2S~contextual;Sin a 2~11S~referência;Sin a 3~LTP~referência;Sin a 4~profilina~referência");
  add("soja","Soja","soy,soybean","Gly m 4~PR10~contextual;Gly m 5~7S~contextual;Gly m 6~11S~contextual;Gly m 8~2S~contextual;Gly m 3~profilina~referência");
  add("tremoco","Tremoço","lupin,lupino","Lup an 1~7S~contextual");
  add("lentilha","Lentilha","lentils","Len c 1~7S~contextual;Len c 3~LTP~referência");
  add("ervilha","Ervilha","pea,ervilhas","Pis s 1~7S~contextual;Pis s 2~7S~referência");
  add("grao","Grão-de-bico","grao de bico,chickpea","Cic a 1~7S~referência");
  add("feijao","Feijão","feijao carioca,feijao preto,bean","", "vegetal");
  add("trigo","Trigo","wheat,gluten","Tri a 19~omega5~prioritário;Tri a 14~LTP~contextual;Tri a 26~glutenina~referência");
  add("cevada","Cevada","barley","", "vegetal");
  add("centeio","Centeio","rye","", "vegetal");
  add("aveia","Aveia","oats","", "vegetal");
  add("milho","Milho","corn,maize","Zea m 14~LTP~contextual");
  add("arroz","Arroz","rice","Ory s 14~LTP~referência");
  add("trigo_sarraceno","Trigo-sarraceno","sarraceno,buckwheat","Fag e 2~2S~contextual");
  add("pessego","Pêssego","peach","Pru p 3~LTP~prioritário;Pru p 1~PR10~contextual;Pru p 4~profilina~contextual;Pru p 7~GRP~contextual");
  add("maca","Maçã","apple","Mal d 1~PR10~contextual;Mal d 3~LTP~contextual;Mal d 4~profilina~referência");
  add("pera","Pera","pear","Pyr c 1~PR10~contextual;Pyr c 3~LTP~referência;Pyr c 4~profilina~referência");
  add("cereja","Cereja","cherry","Pru av 1~PR10~contextual;Pru av 3~LTP~contextual;Pru av 4~profilina~referência");
  add("ameixa","Ameixa","plum","Pru d 3~LTP~contextual;Pru d 1~PR10~referência");
  add("morango","Morango","strawberry","Fra a 1~PR10~contextual");
  add("kiwi","Kiwi","kiwifruit","Act d 1~actinidina~contextual;Act d 8~PR10~contextual;Act d 9~profilina~referência;Act d 10~LTP~referência");
  add("banana","Banana","bananas","Mus a 1~profilina~contextual;Mus a 2~quitinase~contextual;Mus a 3~LTP~referência;Mus a 4~taumatina~referência;Mus a 5~glucanase~referência;Mus a 6~peroxidase~referência");
  add("abacate","Abacate","avocado","Pers a 1~quitinase~contextual");
  add("manga","Manga","mango","", "vegetal");
  add("melao","Melão","melon","Cuc m 2~profilina~contextual");
  add("melancia","Melancia","watermelon","Cit la 2~profilina~contextual");
  add("tomate","Tomate","tomato","Sola l 1~profilina~contextual;Sola l 3~LTP~contextual;Sola l 4~PR10~referência");
  add("cenoura","Cenoura","carrot","Dau c 1~PR10~contextual;Dau c 4~profilina~referência");
  add("aipo","Aipo","salsao,celery","Api g 1~PR10~contextual;Api g 2~LTP~referência;Api g 4~profilina~referência");
  add("uva","Uva","grape","Vit v 1~LTP~contextual");
  add("laranja","Laranja","orange","Cit s 3~LTP~contextual;Cit s 2~profilina~referência");
  add("abacaxi","Abacaxi","pineapple","Ana c 1~profilina~contextual;Ana c 2~bromelina~referência");
  add("coco","Coco","coconut","", "vegetal");
  add("camarao","Camarão","shrimp,prawn","Pen a 1~tropomiosina~prioritário;Pen m 1~tropomiosina~contextual;Pen m 2~argininaquinase~referência;Pen m 4~sarcoplasmica~referência","crustaceo");
  add("caranguejo","Caranguejo","crab,siri","Cha f 1~tropomiosina~contextual","crustaceo");
  add("lagosta","Lagosta","lobster","Hom a 1~tropomiosina~contextual","crustaceo");
  add("lula","Lula","squid","Tod p 1~tropomiosina~referência","molusco");
  add("ostra","Ostra","oyster","Ost e 1~tropomiosina~referência","molusco");
  add("mexilhao","Mexilhão","mussel","", "molusco");
  add("bacalhau","Bacalhau","cod","Gad c 1~parvalbumina~prioritário","peixe");
  add("salmao","Salmão","salmon","Sal s 1~parvalbumina~contextual","peixe");
  add("atum","Atum","tuna","Thu a 1~parvalbumina~contextual","peixe");
  add("tilapia","Tilápia","tilapia","Ore m 1~parvalbumina~contextual","peixe");
  add("sardinha","Sardinha","sardine","", "peixe");
  add("leitevaca","Leite de vaca","leite bovino,cow milk,leite integral","Bos d 8~caseina~prioritário;Bos d 4~alfalactoalbumina~contextual;Bos d 5~betalactoglobulina~contextual;Bos d 6~albuminaserica~contextual","leite");
  add("leitecabra","Leite de cabra","goat milk","", "leite");
  add("leiteovelha","Leite de ovelha","sheep milk","", "leite");
  add("carnebovina","Carne bovina","boi,vaca,beef","Bos d 6~albuminaserica~contextual;alfa-gal~alfagal~contextual","mamifero");
  add("carnesuina","Carne suína","porco,pork","Sus s 1~albuminaserica~contextual;alfa-gal~alfagal~contextual","mamifero");
  add("carnecordeiro","Carne de cordeiro","carne de carneiro,lamb","alfa-gal~alfagal~contextual","mamifero");
  add("gelatina","Gelatina de mamíferos","gelatina bovina,gelatina suina","alfa-gal~alfagal~contextual","mamifero");
  add("ovo","Ovo de galinha","clara,ovo inteiro,egg","Gal d 1~ovomucoide~prioritário;Gal d 2~ovalbumina~contextual;Gal d 3~ovotransferrina~contextual;Gal d 4~lisozima~contextual;Gal d 5~albuminaave~contextual","ave");
  add("frango","Carne de frango","chicken,ave","Gal d 5~albuminaave~contextual","ave");
  add("ovo_codorna","Ovo de codorna","quail egg","", "ave");

  var FAMILY = {
    "2S":["Albuminas 2S (reserva)","Proteínas de reserva frequentemente termoestáveis; alguns marcadores são úteis para alergia primária, mas positividade não prediz gravidade individual.","Distinguir sensibilização primária de padrões por panalérgenos; considerar IgE ao extrato e história clínica."],
    "7S":["Vicilinas / globulinas 7S (reserva)","Proteínas de reserva presentes em várias sementes e leguminosas; sem equivalência automática de alergia entre espécies.","Ajudam a caracterizar sensibilização genuína a leguminosas e oleaginosas quando há dúvida clínica."],
    "11S":["Leguminas / globulinas 11S (reserva)","Proteínas de reserva relativamente estáveis; homologia estrutural não significa coalergia obrigatória.","Complementam perfil de alergia alimentar primária e ajudam a interpretar extratos positivos."],
    "PR10":["PR-10, homólogas de Bet v 1","Frequentemente termolábeis; associadas à síndrome pólen-alimento, sobretudo com vegetais crus.","Diferenciar sensibilização relacionada a pólen de alergia primária; atenção: Gly m 4 pode associar-se a reações sistêmicas."],
    "profilina":["Profilinas","Panalérgenos vegetais amplamente distribuídos e geralmente termolábeis.","Explicar múltiplas IgEs positivas e sintomas orais; não justificar restrições indiscriminadas."],
    "LTP":["nsLTP (proteína transportadora de lipídios)","Proteínas relativamente resistentes a calor e digestão; podem associar-se a reações sistêmicas e cofatores.","Investigar padrão LTP quando existe anafilaxia, reação a casca de fruta ou influência de exercício/AINE/álcool."],
    "GRP":["GRP (proteína regulada por giberelina)","Pru p 7 é marcador de sensibilização a GRP, com potencial de reações sistêmicas em contextos definidos.","Considerar em alergia a frutas não explicada por PR-10/LTP, dependendo da região e da disponibilidade."],
    "quitinase":["Quitinase classe I, domínio semelhante à heveína","Relação molecular potencial com látex e algumas frutas, mas a associação varia muito por alimento.","Investigar síndrome látex-fruta apenas se a história sugerir; testes de látex dirigidos."],
    "tropomiosina":["Tropomiosinas de invertebrados","Homologia entre crustáceos, alguns moluscos, ácaros e baratas; IgE positiva não confirma reação à ingestão.","Identificar sensibilização cruzada marinha ou ácaro–crustáceo; diferenciar de alergia clínica com história/BAT/TPO."],
    "argininaquinase":["Arginina quinase","Panalérgeno de invertebrados; pode contribuir para co-sensibilização sem elevada especificidade clínica.","Marcador complementar, não pedido de rotina isolado."],
    "sarcoplasmica":["Proteína sarcoplasmática ligadora de cálcio","Alérgeno adicional de camarão; não substitui investigação de tropomiosina e extrato.","Complementar casos selecionados com história sugestiva e outros testes inconclusivos."],
    "parvalbumina":["Parvalbumina de peixes","Proteína muscular frequentemente conservada entre peixes ósseos; a tolerância varia entre espécies.","Investigar sensibilização compartilhada sem presumir reação a todos os peixes."],
    "caseina":["Caseínas de leite de mamíferos","Proteínas termorresistentes e homólogas nos leites de vaca, cabra e ovelha.","Caracterizar sensibilização ao leite; não utilizar isoladamente para autorizar leite assado ou leite de outra espécie."],
    "alfalactoalbumina":["Alfa-lactoalbumina","Proteína do soro do leite com homólogos entre mamíferos; processamento altera imunorreatividade.","Completar perfil de proteínas do leite no contexto de sintomas e tolerância."],
    "betalactoglobulina":["Beta-lactoglobulina","Proteína do soro presente em muitos leites de mamíferos; geralmente mais termolábil que caseína.","Completar perfil de sensibilização ao leite; sem valor isolado para risco de anafilaxia."],
    "albuminaserica":["Albuminas séricas de mamíferos","Homologia entre albuminas no leite e carne de mamíferos; sensibilidade ao aquecimento.","Investigar associação leite–carne ou síndrome por albuminas, observando carne bem cozida versus pouco cozida."],
    "alfagal":["Galactose-α-1,3-galactose (α-Gal)","Epítopo glicídico de produtos de mamíferos; reação pode ser tardia, frequentemente 2–6 h, inclusive com cofatores.","Pedir IgE específica para alfa-gal quando houver história compatível após carne, vísceras ou gelatina."],
    "ovomucoide":["Ovomucoide (Gal d 1)","Proteína relativamente resistente a calor/digestão; pode informar alergia persistente ao ovo.","Usar com história e IgE a ovo/clara; não decide isoladamente tolerância a ovo assado."],
    "ovalbumina":["Ovalbumina (Gal d 2)","Proteína relativamente termolábil da clara.","Complementar investigação de fenótipo de sensibilização ao ovo."],
    "ovotransferrina":["Ovotransferrina / conalbumina","Componente da clara, mais sensível ao calor.","Marcador complementar; utilidade incremental menor que o contexto clínico."],
    "lisozima":["Lisozima","Componente da clara também empregado em alguns produtos alimentares/farmacêuticos.","Investigar quando há exposição específica ou suspeita relevante."],
    "albuminaave":["Albumina sérica aviária (Gal d 5)","Pode relacionar sensibilização à gema/aves e síndrome ave–ovo.","Considerar em sintomas com ovo e carne de ave associados à sensibilização a penas/aves."],
    "omega5":["Ômega-5-gliadina (Tri a 19)","Marcador importante de anafilaxia ao trigo dependente de exercício/cofatores.","Investigar WDEIA, sem inferir automaticamente alergia a outros cereais."],
    "glutenina":["Glutenina de alto peso molecular","Marcador adicional em fenótipos selecionados de alergia ao trigo dependente de cofatores.","Usar apenas se ampliar a investigação clínica; não confundir com doença celíaca."],
    "actinidina":["Actinidina (Act d 1)","Protease do kiwi relacionada à sensibilização primária em parte dos pacientes.","Apoiar diferenciação de alergia primária ao kiwi versus perfil pólen-alimento."],
    "bromelina":["Bromelina","Protease do abacaxi (Ana c 2); a ligação de IgE frequentemente pode refletir determinantes carboidratos de reação cruzada (CCDs). Não é o mecanismo principal documentado para banana–abacaxi.","Usar apenas no contexto de suspeita específica. IgE para bromelina pode atuar como marcador de CCD; positividade isolada não comprova alergia ao abacaxi."],
    "taumatina":["Proteínas semelhantes à taumatina (PR-5)","Mus a 4 foi descrito na banana; homologia molecular não estabelece, por si só, reatividade clínica cruzada com outra fruta.","Componente de literatura; não solicitar rotineiramente sem indicação e disponibilidade comprovadas."],
    "glucanase":["Beta-1,3-glucanase (PR-2)","Mus a 5 é componente descrito da banana, com potencial de homologia com proteínas vegetais.","Aplicação clínica limitada; não utilizar isoladamente para decidir restrição alimentar."],
    "peroxidase":["Ascorbato peroxidase","Mus a 6 é componente descrito da banana, ainda com utilidade diagnóstica rotineira pouco estabelecida.","Componente de referência; avaliar disponibilidade e interpretação clínica antes de solicitar."]
  };
  var special={
    "Ara h 2":"Principal componente adicional recomendado para apoiar diagnóstico de amendoim; correlacionar com história, extrato e eventual TPO.",
    "Ana o 3":"Componente 2S com valor diagnóstico para caju e informação sobre associação clínica com pistache.",
    "Cor a 14":"Componente 2S recomendado pela EAACI para apoiar diagnóstico de avelã; distinguir de Cor a 1.",
    "Cor a 9":"Reserva 11S; complementa Cor a 14 na investigação de avelã genuína.",
    "Ses i 1":"Albumina 2S útil na investigação selecionada de gergelim; BAT pode ser útil em casos equívocos.",
    "Gly m 4":"PR-10 da soja: ao contrário da maioria dos PR-10, pode participar de reações sistêmicas, especialmente com bebidas de soja.",
    "Pru p 3":"Marcador de sensibilização a nsLTP, mas não representa todas as LTPs de frutas.",
    "Pru p 7":"Considerar GRP em perfis de fruta não explicados, sem assumir disponibilidade universal.",
    "Tri a 19":"Prioridade se trigo + exercício/AINE/álcool coincidem com anafilaxia (WDEIA).",
    "Bos d 8":"Caseína: informa perfil molecular, mas não permite sozinho definir tolerância a leite extensamente aquecido.",
    "Gal d 1":"Ovomucoide: componente termoestável, não dispensa eventual TPO para definir tolerância ao ovo preparado.",
    "Pen a 1":"Tropomiosina pode refletir sensibilização cruzada com ácaros; história de ingestão e sintomas é indispensável.",
    "Gad c 1":"Parvalbumina é marcador de sensibilização a peixes; não prevê reação universal a todas as espécies.",
    "alfa-gal":"Solicitar IgE para α-Gal em suspeita de anafilaxia/urticária tardia após alimentos de mamíferos.",
    "Mus a 1":"Profilina da banana; considerar diante de síndrome pólen-alimento e múltiplas frutas com IgEs positivas. Interpretar com história clínica; nem sempre há ensaio comercial específico.",
    "Ana c 1":"Profilina do abacaxi. Homologia e inibição de IgE documentadas com profilinas vegetais, incluindo a da banana. Quando o ensaio específico não estiver disponível, avaliar marcadores de profilina (p.ex. Bet v 2 / Phl p 12, se disponíveis), sem substituir a investigação do alimento."
  };

  function pairKey(a,b) {return [a,b].sort().join(":");}
  var PAIRS={};
  function pair(a,b,level,reason,focus) { PAIRS[pairKey(a,b)]={level:level,reason:reason,focus:focus||""}; }
  pair("caju","pistache","Associação clínica bem documentada","Par botânico de Anacardiaceae, com homologia entre proteínas de reserva e alta frequência relativa de coalergia; não é certeza individual.","Ana o 3 ↔ Pis v 1 (2S); Ana o 1 ↔ Pis v 3 (7S); Ana o 2 ↔ Pis v 2 (11S).");
  pair("noz","peca","Associação clínica bem documentada","Par de Juglandaceae com associação clínica e molecular importante; confirmar reações e tolerância ao segundo alimento.","Jug r 1 ↔ Car i 1 (2S); Jug r 4 ↔ Car i 4 (11S).");
  pair("amendoim","tremoco","Reatividade cruzada possível","Leguminosas com reatividade cruzada relatada; um teste positivo ou alergia ao amendoim não implica obrigatoriamente alergia ao tremoço.","Ara h 1 / proteínas 7S ↔ Lup an 1; avaliar extratos e história.");
  pair("soja","amendoim","Possibilidade molecular, clínica variável","Proteínas de reserva compartilhadas por leguminosas podem produzir co-sensibilização, mas o paciente frequentemente tolera a outra leguminosa.","Ara h 1/3 e Gly m 5/6, considerando também Ara h 8 e Gly m 4 em sensibilização a PR-10.");
  pair("caju","manga","Par botânico; reatividade clínica incerta","Apesar de pertencerem à família Anacardiaceae, a alergia ao caju não comprova alergia à polpa de manga. Não há indicação de painel molecular automático apenas por parentesco.","Avaliar polpa versus casca, exposição e testes convencionais dirigidos, se indicados.");
  pair("ovo","frango","Síndrome ave–ovo em cenário selecionado","Albumina sérica aviária (Gal d 5) pode relacionar ovo, carne de frango e exposição a aves; não é regra para alergia primária à clara.","Gal d 5, se disponível; interpretação orientada por história.");
  pair("leitevaca","carnebovina","Possível associação por albumina","Bos d 6 está presente em leite e carne bovina. A maioria das crianças com alergia ao leite tolera carne bovina; não excluir carne automaticamente.","Bos d 6 / albumina sérica bovina.");
  pair("banana","abacaxi","Reatividade cruzada molecular documentada; risco clínico variável","Banana e abacaxi compartilham profilinas homólogas: Mus a 1 e Ana c 1. Estudo experimental demonstrou ligação de IgE e reatividade dessas profilinas com Bet v 2 (bétula) e Hev b 8 (látex), por ensaios de inibição; um estudo observacional relatou reações clínicas ao abacaxi em 9/110 pacientes com alergia à banana que haviam ingerido a fruta (8,2%). Esse resultado não é estimativa de risco individual nem prova, em todos os casos, mecanismo por profilina.","Mus a 1 ↔ Ana c 1 (profilinas). Considerar IgE aos extratos e/ou prick-to-prick segundo a história; marcadores de profilina como Bet v 2/Phl p 12 quando disponíveis e clinicamente úteis. Ana c 2 (bromelina) pode refletir CCD e não confirma reação cruzada clínica.");
  pair("banana","abacate","Possibilidade por quitinases (látex–frutas)","Quitinases de classe I podem compartilhar epítopos com látex; banana e abacate podem coexistir em síndrome látex–fruta, mas não há coalergia obrigatória.","Mus a 2 e Pers a 1; investigar látex apenas se a história justificar.");
  pair("kiwi","banana","Associação possível, mecanismos distintos","Alguns pacientes compartilham sensibilização a panalérgenos ou látex, mas reação a kiwi não implica reação clínica à banana.","Act d 8/9, Mus a 1 e contexto látex; Act d 1 avalia kiwi primário.");
  pair("pessego","maca","Homologia molecular relevante","Frutas rosáceas podem compartilhar PR-10, nsLTP e profilinas; o risco clínico depende do componente e da forma crua/cozida.","Pru p 1 ↔ Mal d 1; Pru p 3 ↔ Mal d 3; profilinas.");
  pair("pessego","cereja","Homologia molecular relevante","Frutas do gênero Prunus podem compartilhar PR-10 e nsLTP; resultado positivo não equivale a alergia às duas.","Pru p 1 ↔ Pru av 1; Pru p 3 ↔ Pru av 3.");
  pair("pessego","ameixa","Homologia molecular relevante","Frutas de caroço com possível reconhecimento cruzado de nsLTP; priorizar história de reação a cascas e cofatores.","Pru p 3 ↔ Pru d 3.");
  pair("maca","pera","Homologia molecular relevante","Rosáceas com componentes PR-10 e nsLTP homólogos, sobretudo em sensibilização relacionada a pólen.","Mal d 1 ↔ Pyr c 1; Mal d 3 ↔ Pyr c 3.");
  pair("lentilha","grao","Reatividade cruzada possível","Leguminosas com coalergia observada em algumas populações; testes e conduta devem ser personalizados.","Vicilinas/7S e extratos correspondentes.");
  pair("lentilha","ervilha","Reatividade cruzada possível","Proteínas de reserva de leguminosas podem gerar sensibilização cruzada e, em parte dos pacientes, sintomas aos dois alimentos.","Len c 1 ↔ Pis s 1 (vicilinas).");
  pair("leitevaca","leitecabra","Associação clínica bem documentada","Caseínas e proteínas de leites de ruminantes são homólogas; leite de cabra não é substituto seguro automático para alergia ao leite de vaca.","Bos d 8 (caseína) e IgE/extratos de ambos, conforme quadro.");
  pair("leitevaca","leiteovelha","Associação clínica bem documentada","Caseínas e outras proteínas compartilham epítopos; leite de ovelha não é substituto automático para alergia ao leite de vaca.","Bos d 8 (caseína), extratos e história de tolerância.");
  pair("leitecabra","leiteovelha","Associação clínica bem documentada","Leites de ruminantes podem apresentar reatividade cruzada, sobretudo por caseínas.","Avaliar IgE a extratos e caseínas quando disponível.");
  pair("ovo","ovo_codorna","Possível homologia","Proteínas de ovos de aves diferentes podem compartilhar epítopos; não inferir segurança de ovo de codorna em alergia ao ovo de galinha.","Gal d 1/2 e extrato de ovo de codorna, se disponível; TPO supervisionado quando apropriado.");

  // Referências gerais válidas para a metodologia; estudos específicos devem acompanhar cada par quando disponíveis.
  var SRC=[
    ["ASBAI/SBP 2025 — Atualização em Alergia Alimentar","https://doi.org/10.5935/2526-5393.20250003"],
    ["EAACI 2023 — Diagnóstico de alergia alimentar IgE-mediada","https://doi.org/10.1111/all.15902"],
    ["EAACI — Molecular Allergology User's Guide 2.0","https://doi.org/10.1111/pai.13854"],
    ["WHO/IUIS — Nomenclatura oficial de alérgenos","https://www.allergen.org/"]
  ];
  // Referências específicas: pares não listados não devem ser classificados como comprovadamente negativos.
  var PAIR_SRC={};
  PAIR_SRC[pairKey("banana","abacaxi")]=[
    ["Reindl et al., 2002 — profilinas de banana e abacaxi; ensaios de inibição de IgE (PMID 12065910)","https://doi.org/10.1159/000059400"],
    ["Estudo clínico em alérgicos à banana, 2023 — 9/110 com reação ao abacaxi após ingestão (PMID 37444194)","https://doi.org/10.3390/foods12132456"],
    ["WHO/IUIS — Ana c 1, profilina do abacaxi","https://www.allergen.org/viewallergen.php?aid=43"],
    ["WHO/IUIS — catálogo de componentes reconhecidos","https://www.allergen.org/"]
  ];

  PAIR_SRC[pairKey("caju","pistache")]=[
    ["Revisão 2025 — Tree Nut and Seed Allergies: Prevalence, Clinical Characteristics, Diagnosis, and Management","https://doi.org/10.4168/aair.2025.17.6.672"],
    ["Revisão clínica de reatividade cruzada alimentar, 2020","https://pmc.ncbi.nlm.nih.gov/articles/PMC11250430/"]
  ];
  PAIR_SRC[pairKey("noz","peca")]=[
    ["Revisão 2025 — Tree Nut and Seed Allergies","https://doi.org/10.4168/aair.2025.17.6.672"],
    ["Revisão clínica com estudos de provocação entre noz e pecã","https://pmc.ncbi.nlm.nih.gov/articles/PMC11250430/"]
  ];
  PAIR_SRC[pairKey("leitevaca","leitecabra")]=[
    ["Clinical Relevance of Cross-Reactivity in Food Allergy — revisão","https://pubmed.ncbi.nlm.nih.gov/33429724/"]
  ];
  PAIR_SRC[pairKey("leitevaca","leiteovelha")]=PAIR_SRC[pairKey("leitevaca","leitecabra")];
  PAIR_SRC[pairKey("pessego","maca")]=[
    ["BSACI — Diagnosis and Management of Lipid Transfer Protein Allergy","https://doi.org/10.1111/cea.70022"],
    ["EAACI — Molecular Allergology User’s Guide 2.0","https://doi.org/10.1111/pai.13854"]
  ];
  SRC.push(["WAO — Interpretação de IgE e reatividade cruzada (2020)","https://pmc.ncbi.nlm.nih.gov/articles/PMC7044795/"]);
  SRC.push(["Revisão 2025 — Alergia a castanhas e sementes","https://doi.org/10.4168/aair.2025.17.6.672"]);
  SRC.push(["Revisão 2020 — Relevância clínica da reatividade cruzada alimentar","https://pubmed.ncbi.nlm.nih.gov/33429724/"]);


  // Números exclusivamente observacionais / de sequência documentados em fontes nomeadas.
  // Nunca interpretar frequência de co-alergia em coortes como probabilidade individual.
  var PUBLISHED_PAIR_DATA={};
  PUBLISHED_PAIR_DATA[pairKey("caju","pistache")]=
    "Em séries com provocação oral resumidas na revisão de reatividade cruzada, aproximadamente 97% dos alérgicos a pistache também reagiram a caju, enquanto 83% dos alérgicos a caju reagiram a pistache. São frequências de coortes selecionadas, com direção distinta e sem validade como cálculo individual.";
  PUBLISHED_PAIR_DATA[pairKey("noz","peca")]=
    "Nos estudos de provocação compilados, 97–100% dos alérgicos a pecã também apresentaram alergia a noz; entre alérgicos a noz, 75–91% reagiram a pecã. Intervalos dependem das amostras e não substituem confirmação clínica individual.";
  PUBLISHED_PAIR_DATA[pairKey("pessego","maca")]=
    "A posição da WAO sobre IgE e diagnóstico molecular descreve identidade de sequência de aproximadamente 77% entre Pru p 3 (pêssego) e Mal d 3 (maçã), ambas nsLTPs. Este 77% mede semelhança de sequência, NÃO o risco de reação clínica.";
  PAIR_SRC[pairKey("pessego","maca")].push([
    "WAO, 2020 — exemplo de 77% de identidade Pru p 3 / Mal d 3",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC7044795/"
  ]);

  function esc(t) {return String(t==null?"":t).replace(/[&<>"']/g,function(ch){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch];});}
  function clean(v){return String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"");}
  function catEntry(name) {
    if(name==="alfa-gal") return null;
    return (window.IGE_CAT||[]).find(function(x){
      return !x.bloqueado && clean(x.c.replace(/^[rn](?=[A-Z])/, ""))===clean(name);
    });
  }
  function optionHTML(){return FOODS.slice().sort(function(a,b){return a.label.localeCompare(b.label,"pt-BR");})
    .map(function(f){return '<option value="'+esc(f.id)+'">'+esc(f.label)+'</option>';}).join("");}

  // Seleção progressiva: os dois campos iniciais permanecem estáveis para compatibilidade.
  var nextFoodField=3;
  function foodFieldHTML(id,number,removable){
    return '<div class="fx-field" data-fx-field="'+number+'">'+
      '<div class="fx-field-head"><label for="'+esc(id)+'">Alimento '+number+'</label>'+
      (removable?'<button type="button" class="fx-remove-food" aria-label="Remover alimento '+number+'">Remover</button>':'')+'</div>'+
      '<select class="fx-food-select" id="'+esc(id)+'" autocomplete="off" aria-label="Alimento '+number+'">'+
      '<option value="">Selecione um alimento</option>'+optionHTML()+'</select>'+
      (number>1?'<label class="fx-tolerance-check"><input type="checkbox" class="fx-tolerated-item" '+(number===2?'id="fxTolerated" ':'')+'/> Consome regularmente sem sintomas</label>':'<p class="fx-index-note">Alimento de referência para a comparação</p>')+
      '</div>';
  }
  function renumberFoodFields(){
    var fields=document.querySelectorAll("#fxFoods .fx-field");
    fields.forEach(function(field,index){
      var n=index+1, label=field.querySelector(".fx-field-head label"), sel=field.querySelector("select"), remove=field.querySelector(".fx-remove-food");
      field.setAttribute("data-fx-field",String(n));
      if(label)label.textContent="Alimento "+n;
      if(sel)sel.setAttribute("aria-label","Alimento "+n);
      if(remove)remove.setAttribute("aria-label","Remover alimento "+n);
    });
  }
  function addFoodField(){
    var grid=document.getElementById("fxFoods");
    if(!grid)return;
    if(grid.querySelectorAll(".fx-field").length>=12){
      var msg=document.getElementById("fxFieldMessage");
      if(msg)msg.textContent="Limite de 12 alimentos por análise para manter o relatório legível.";
      return;
    }
    var n=grid.querySelectorAll(".fx-field").length+1;
    var holder=document.createElement("div");
    holder.innerHTML=foodFieldHTML("fxFoodExtra"+nextFoodField++,n,true);
    grid.appendChild(holder.firstElementChild);
    var msg=document.getElementById("fxFieldMessage");if(msg)msg.textContent="";
    var added=grid.lastElementChild.querySelector("select");
    if(added&&typeof added.focus==="function")added.focus();
  }
  function selectedFoodRows(){
    var grid=document.getElementById("fxFoods");
    var selects=grid&&typeof grid.querySelectorAll==="function"
      ?Array.from(grid.querySelectorAll("select.fx-food-select"))
      :[document.getElementById("fxFoodA"),document.getElementById("fxFoodB")];
    return selects.filter(Boolean).map(function(select,index){
      var field=typeof select.closest==="function"?select.closest(".fx-field"):null;
      var ck=field&&field.querySelector(".fx-tolerated-item");
      if(!ck&&index===1)ck=document.getElementById("fxTolerated");
      return {food:byId[select.value]||null,tolerated:!!(ck&&ck.checked),number:index+1};
    }).filter(function(item){return !!item.food;});
  }
  function insert() {
    var page=document.getElementById("page-laboratorio");
    if(!page||document.getElementById("foodCrossCard"))return;
    var wrap=document.createElement("details");
    wrap.id="foodCrossCard";wrap.className="fx-card";
    wrap.innerHTML='<summary><span><span class="fx-title">Reatividade cruzada entre alimentos</span>'+
      '<span class="fx-summary-sub">Compare 2 ou mais alimentos • similaridade molecular • risco clínico • parecer técnico</span></span>'+
      '<span class="fx-chevron" aria-hidden="true">⌄</span></summary>'+
      '<div class="fx-body"><div class="fx-intro">Selecione os alimentos para avaliar todas as combinações entre eles. Os resultados distinguem homologia proteica, sensibilização cruzada e reação clínica comprovada.</div>'+
      '<div id="fxFoods" class="fx-grid">'+foodFieldHTML("fxFoodA",1,false)+foodFieldHTML("fxFoodB",2,false)+'</div>'+
      '<div class="fx-form-actions"><button class="fx-plus-food" id="fxAddFood" type="button" aria-label="Adicionar outro alimento"><span aria-hidden="true">+</span> Adicionar alimento</button>'+
      '<button id="fxCompare" class="fx-primary-compare" type="button">Gerar parecer técnico</button></div>'+
      '<div id="fxFieldMessage" class="fx-field-message" aria-live="polite"></div>'+
      '<div class="fx-note">A semelhança entre famílias proteicas não é um percentual de identidade de sequência, nem uma probabilidade individual de reação. O módulo não realiza alinhamento bioinformático. Considere histórico de ingestão, sintomas, processamento térmico, cofatores e testes dirigidos; não exclua alimentos tolerados apenas por IgE positiva.</div>'+
      '<div id="fxResult" class="fx-results" aria-live="polite" aria-atomic="false"></div></div>';
    var first=page.querySelector(".lab-pane");
    if(first)page.insertBefore(wrap,first);else page.appendChild(wrap);
    document.getElementById("fxAddFood").addEventListener("click",addFoodField);
    document.getElementById("fxCompare").addEventListener("click",render);
    document.getElementById("fxFoods").addEventListener("change",function(e){
      if(e.target.matches(".fx-food-select, .fx-tolerated-item"))render();
    });
    document.getElementById("fxFoods").addEventListener("click",function(e){
      var btn=e.target.closest(".fx-remove-food");if(!btn)return;
      var field=btn.closest(".fx-field");if(field)field.remove();
      renumberFoodFields();render();
    });
    document.getElementById("fxResult").addEventListener("click",function(e){
      var b=e.target.closest("button[data-fx-add]");
      if(!b)return;
      var cod=b.getAttribute("data-fx-add");
      if(typeof window.pedAdd==="function" && (window.IGE_CAT||[]).some(function(x){return x.c===cod && !x.bloqueado;})){
        window.pedAdd(cod);
        b.textContent="Adicionado à nota";
      }
    });
  }
  function links(a,b,common){
    var refs=(PAIR_SRC[pairKey(a.id,b.id)]||[]).concat(SRC);
    var seen={};
    var items=refs.filter(function(v){if(seen[v[1]])return false;seen[v[1]]=true;return true;});
    var enA=(a.synonyms||a.label).split(",")[0].trim(), enB=(b.synonyms||b.label).split(",")[0].trim();
    var search=[enA,enB,"(allergy OR cross-reactivity OR cross-reactive)"].join(" ");
    items.push(["Buscar estudos específicos deste par no PubMed (pesquisa externa, ainda não revisada)","https://pubmed.ncbi.nlm.nih.gov/?term="+encodeURIComponent(search)]);
    return items.map(function(v){return '<a href="'+esc(v[1])+'" target="_blank" rel="noopener noreferrer">'+esc(v[0])+'</a>';}).join(" · ");
  }

  // Apenas as proteínas pertencentes às famílias relevantes para o par.
  // Não repetir os catálogos moleculares completos dos dois alimentos.
  function markerHTML(food,family) {
    var items=food.components.filter(function(m){return m.family===family;});
    if(!items.length){
      return '<p class="fx-marker-unknown">Componente individual não cadastrado para este alimento. Considerar extrato conforme a história clínica.</p>';
    }
    return items.map(function(m){
      var entry=catEntry(m.name);
      return '<div class="fx-protein"><span class="fx-protein-name">'+esc(m.name)+'</span>'+
        (entry?'<button class="fx-add" type="button" data-fx-add="'+esc(entry.c)+'" aria-label="Adicionar '+esc(m.name)+' à nota">Adicionar à nota</button>':'')+
        '</div>';
    }).join("");
  }
  function sharedFamilyHTML(a,b,family) {
    var details=FAMILY[family]||[family,"A identificação da família não comprova reatividade clínica.",""];
    return '<article class="fx-cross-family">'+
      '<div class="fx-family-head"><span class="fx-family-eyebrow">Família molecular relacionada</span><h5>'+esc(details[0])+'</h5></div>'+
      '<div class="fx-cross-pair">'+
        '<div class="fx-food-side"><div class="fx-food-name">'+esc(a.label)+'</div>'+markerHTML(a,family)+'</div>'+
        '<div class="fx-pair-arrow" aria-hidden="true">↔</div>'+
        '<div class="fx-food-side"><div class="fx-food-name">'+esc(b.label)+'</div>'+markerHTML(b,family)+'</div>'+
      '</div>'+
      '<p class="fx-family-explain">'+esc(details[1])+'</p>'+
    '</article>';
  }
  function comparisonFamilies(a,b,common,fish,marine,mammals){
    if(common.length)return common;
    // Alguns pares possuem homologia descrita, porém um dos alimentos
    // não tem um marcador molecular individual listado nesta base.
    if(fish)return ["parvalbumina"];
    if(marine)return ["tropomiosina"];
    if(mammals)return ["alfagal"];
    if(a.type==="leite"&&b.type==="leite")return ["caseina"];
    if(pairKey(a.id,b.id)===pairKey("ovo","ovo_codorna"))return ["ovomucoide","ovalbumina"];
    return [];
  }
  // Consulta bibliográfica aberta, apenas com nomes de alimentos; nenhum dado de paciente é transmitido.
  // Resultados automáticos são referências para leitura e NÃO são convertidos em conclusão clínica.
  var literatureRequest=0;
  function loadLiterature(a,b,targetId,requestId) {
    var target=document.getElementById(targetId);
    if(!target)return;
    if(typeof fetch!=="function"){target.textContent="Busca automática indisponível neste ambiente. Consulte a pesquisa PubMed nas referências.";return;}
    var wordA=(a.synonyms||a.label).split(",")[0].trim();
    var wordB=(b.synonyms||b.label).split(",")[0].trim();
    var q='"'+wordA.replace(/"/g,"")+'" AND "'+wordB.replace(/"/g,"")+'" AND (allergy OR allergen OR profilin OR cross-reactivity)';
    var url="https://www.ebi.ac.uk/europepmc/webservices/rest/search?query="+encodeURIComponent(q)+"&format=json&resultType=lite&pageSize=6";
    fetch(url,{mode:"cors",cache:"no-store"}).then(function(response){
      if(!response.ok)throw new Error("Falha na consulta");
      return response.json();
    }).then(function(data){
      if(requestId!==literatureRequest)return;
      var node=document.getElementById(targetId);
      if(!node)return;
      var entries=(data&&data.resultList&&data.resultList.result)||[];
      if(!entries.length){node.textContent="Nenhum artigo localizado por esta estratégia automática. Isso não exclui publicações com outras palavras-chave; confira também a busca no PubMed.";return;}
      node.innerHTML='<span class="fx-rare">Resultados recuperados da Europe PMC, por relevância. As publicações abaixo não foram avaliadas criticamente nesta consulta e não fundamentam, isoladamente, o resultado clínico.</span><div class="fx-literature-list">'+entries.map(function(v){
        var href=v.doi?"https://doi.org/"+encodeURIComponent(v.doi):(v.pmid?"https://pubmed.ncbi.nlm.nih.gov/"+encodeURIComponent(v.pmid)+"/":"https://europepmc.org/article/"+encodeURIComponent(v.source||"MED")+"/"+encodeURIComponent(v.id||""));
        var meta=[v.authorString||"",v.journalTitle||"",v.pubYear||""].filter(Boolean).join(" · ");
        return '<p><a href="'+esc(href)+'" target="_blank" rel="noopener noreferrer">'+esc(v.title||"Artigo indexado")+'</a><span class="fx-rare"> · '+esc(meta)+'</span></p>';
      }).join("")+'</div>';
    }).catch(function(){
      if(requestId!==literatureRequest)return;
      var node=document.getElementById(targetId);
      if(node)node.textContent="Consulta automática indisponível no momento. Use o link de busca específica no PubMed listado nas referências.";
    });
  }

  function assessment(a,b) {
    var p=PAIRS[pairKey(a.id,b.id)]||null, overlap={};
    a.components.forEach(function(c){if(b.components.some(function(d){return c.family===d.family;}))overlap[c.family]=true;});
    var common=Object.keys(overlap);
    var bothFish=a.type==="peixe"&&b.type==="peixe",bothCrust=a.type==="crustaceo"&&b.type==="crustaceo";
    var marine=(a.type==="crustaceo"||a.type==="molusco")&&(b.type==="crustaceo"||b.type==="molusco");
    var twoMammals=a.type==="mamifero"&&b.type==="mamifero";
    var bothCereals=["trigo","cevada","centeio"].includes(a.id)&&["trigo","cevada","centeio"].includes(b.id);
    var explicit=p?{level:p.level,reason:p.reason,focus:p.focus}:null;
    if(!explicit&&bothFish)explicit={level:"Reatividade cruzada possível e frequente em peixes ósseos",reason:"Parvalbuminas podem ser homólogas, mas a tolerância é espécie-específica; nem todo paciente reage a todos os peixes.",focus:"Parvalbuminas (p.ex. Gad c 1) e extratos correspondentes."};
    if(!explicit&&bothCrust)explicit={level:"Reatividade cruzada frequente entre crustáceos",reason:"Tropomiosinas de camarão, caranguejo e lagosta são homólogas; não há certeza de alergia clínica ao segundo alimento.",focus:"Tropomiosina (Pen a 1 como marcador disponível em alguns painéis) e IgE aos extratos."};
    if(!explicit&&marine)explicit={level:"Sensibilização cruzada possível; clínica variável",reason:"Crustáceos e moluscos podem compartilhar tropomiosinas, mas a coalergia não é universal nem previsível somente pela sorologia.",focus:"Tropomiosina + testes dirigidos ao alimento realmente suspeito."};
    if(!explicit&&twoMammals)explicit={level:"Possível associação por α-Gal",reason:"Carne e produtos de mamíferos podem compartilhar α-Gal, ligado a reações tardias em indivíduos sensibilizados, geralmente após picadas de carrapatos.",focus:"IgE para α-Gal se a história temporal for compatível; não investigar indiscriminadamente."};
    if(!explicit&&bothCereals)explicit={level:"Homologia entre cereais; clínica variável",reason:"Trigo, centeio e cevada compartilham prolaminas e outras proteínas; reatividade clínica entre eles não é obrigatória. Alergia IgE-mediada não é doença celíaca.",focus:"Extratos dirigidos; Tri a 19 apenas para suspeita de anafilaxia ao trigo dependente de cofatores."};
    if(!explicit&&common.length)explicit={level:"Semelhança molecular identificada; impacto clínico incerto",reason:"As duas fontes contêm famílias proteicas relacionadas. Isso explica eventual co-sensibilização, mas não estabelece probabilidade individual de reação ao segundo alimento.",focus:"Escolha componentes conforme fenótipo e histórico de tolerância, não por rastreamento indiscriminado."};
    if(!explicit)explicit={level:"Evidência específica ainda não cadastrada — associação não excluída",reason:"Esta base é curada e incompleta: ausência de par ou família não comprova ausência de reatividade molecular ou clínica. Consulte as referências e a pesquisa bibliográfica específica disponíveis abaixo.",focus:"Investigar cada alimento conforme a história, considerar componentes não cadastrados e conferir estudos específicos antes de concluir."};
    var families=comparisonFamilies(a,b,common,bothFish,marine,twoMammals);
    var label=p&&p.level==="Associação clínica bem documentada"?"Associação clínica bem documentada":
      p?"Evidência específica do par":bothFish||bothCrust||marine?"Associação por grupo alimentar":
      common.length?"Homologia de família; clínica incerta":"Evidência insuficiente";
    var riskNote=families.some(function(f){return ["2S","7S","11S","LTP","GRP","parvalbumina","tropomiosina","caseina","ovomucoide","alfagal"].includes(f);})
      ?"Algumas famílias identificadas contêm proteínas estáveis ou associadas a reações sistêmicas em determinados fenótipos. Isso exige atenção à história e aos cofatores, mas não permite prever intensidade ou ocorrência de reação nesta pessoa."
      :families.some(function(f){return f==="PR10"||f==="profilina";})
        ?"PR-10 e profilinas são frequentemente lábeis e relacionadas à síndrome pólen-alimento, em especial com alimentos crus. Há exceções clinicamente importantes, como Gly m 4 na soja; não presumir ausência de risco sistêmico."
        :"Não existe base suficiente para inferir risco clínico pela estrutura de proteínas cadastradas. A análise permanece dependente da história e da tolerância.";
    return {explicit:explicit,families:families,label:label,riskNote:riskNote};
  }
  function pairReportHTML(a,b,toleratedA,toleratedB,idx,expanded){
    var info=assessment(a,b), explicit=info.explicit, families=info.families;
    var title=esc(a.label)+' <span aria-hidden="true">×</span> '+esc(b.label);
    var html='<details class="fx-pair-card" data-fx-pair="'+idx+'" '+(expanded?'open ':'')+'>'+
      '<summary class="fx-pair-summary"><span class="fx-pair-number">'+String(idx+1).padStart(2,"0")+'</span>'+
      '<span class="fx-pair-title"><strong>'+title+'</strong><small>'+esc(info.label)+'</small></span>'+
      '<span class="fx-pair-expand" aria-hidden="true">⌄</span></summary>'+
      '<div class="fx-pair-body"><section class="fx-report" role="region" aria-label="Parecer técnico sobre '+esc(a.label)+' e '+esc(b.label)+'">'+
      '<header class="fx-report-header"><div class="fx-report-kicker">PARECER TÉCNICO MOLECULAR</div>'+
      '<h3>'+title+'</h3><p>Reatividade cruzada: análise das proteínas, relevância clínica e conduta</p></header>'+
      '<div class="fx-assessment"><div class="fx-assessment-label">FORÇA DA EVIDÊNCIA</div>'+
      '<h4>'+esc(explicit.level)+'</h4><p>'+esc(explicit.reason)+'</p></div>';
    if(toleratedA||toleratedB){
      var names=[toleratedA?a.label:null,toleratedB?b.label:null].filter(Boolean).join(" e ");
      html+='<div class="fx-tolerance"><span>Tolerância informada: '+esc(names)+'</span><p>Há consumo habitual sem sintomas do(s) alimento(s) assinalado(s). Não restringir ou solicitar IgEs apenas pela homologia molecular. Reavaliar se a história de reações ou cofatores contradisser essa tolerância.</p></div>';
    }
    html+='<section class="fx-molecular-section" aria-labelledby="fxMolecularHeading-'+idx+'">'+
      '<div class="fx-molecular-intro"><h4 id="fxMolecularHeading-'+idx+'">Similaridade proteica e mecanismos plausíveis</h4>'+
      '<p>Componentes compartilhados por família, conforme a literatura. Pertencer à mesma família não demonstra identidade percentual de sequência, afinidade de IgE ou reação clínica obrigatória.</p></div>';
    if(families.length){
      html+='<div class="fx-shared-families">'+families.map(function(family){return sharedFamilyHTML(a,b,family);}).join("")+'</div>';
    }else{
      html+='<div class="fx-no-families"><p>Nenhuma proteína específica de reação cruzada cadastrada para este par. Isso não significa ausência de associação clínica ou molecular: a base de componentes é incompleta.</p></div>';
    }
    html+='</section>'+
      '<div class="fx-technical-section"><h4>Dados publicados sobre semelhança e coalergia</h4><p>'+esc(PUBLISHED_PAIR_DATA[pairKey(a.id,b.id)]||"Não há um percentual de identidade sequencial verificado para este par nesta base. Semelhança de família molecular não permite derivar porcentagem de reação clínica; os dados epidemiológicos dependem da população e dos métodos dos estudos.")+'</p>'+
      '<h4>Mecanismo e componentes relevantes</h4><p>'+esc(explicit.focus||"Avaliação dirigida ao fenótipo e aos alérgenos envolvidos.")+'</p>'+
      '<h4>Risco de reação clínica</h4><p>'+esc(info.riskNote)+'</p>'+
      '<h4>Fatores que modificam a interpretação</h4><p>Reação prévia, quantidade ingerida, preparo térmico, forma crua ou processada, tempo entre ingestão e sintomas, exercício, AINEs, álcool, infecções e comorbidades podem modificar a apresentação. Sensibilização em testes não é sinônimo de alergia alimentar.</p></div>'+
      '<div class="fx-clinical-next"><h4>Conduta orientada pelas evidências</h4><p>Documentar alimentos já tolerados e caracterizar o episódio índice. Investigar somente exposições clinicamente suspeitas, com prick test/IgE ao extrato e componentes selecionados quando acrescentarem informação. Ara h 2, Ana o 3 e Cor a 14 são exemplos validados para situações específicas. Considerar BAT, quando disponível, em casos selecionados. Se a dúvida persistir e for apropriado, o teste de provocação oral supervisionado permanece a referência diagnóstica. Não fazer desafio domiciliar após reação sistêmica.</p></div>'+
      '<details class="fx-evidence" data-fx-literature="'+idx+'"><summary>Artigos e diretrizes do par</summary>'+
      '<div class="fx-evidence-body"><p>Busca complementar na Europe PMC por nomes dos alimentos. Resultados novos são apenas referências para leitura; não modificam automaticamente a classificação clínica.</p>'+
      '<div id="fxLiveLiteratureBody-'+idx+'">Abra esta seção para consultar publicações indexadas.</div>'+
      '<div class="fx-sources">Fontes utilizadas e busca direcionada: '+links(a,b,families)+'. Revisão clínica da base: 24/11/2026.</div></div></details>'+
      '</section></div></details>';
    return html;
  }
  function render() {
    var out=document.getElementById("fxResult");if(!out)return;
    var rows=selectedFoodRows();++literatureRequest;
    if(rows.length<2){out.innerHTML='';return;}
    var ids=rows.map(function(v){return v.food.id;});
    if(new Set(ids).size!==ids.length){
      out.innerHTML='<div class="fx-status"><strong>Escolha dois alimentos diferentes.</strong><p>Remova alimentos repetidos: cada alimento deve aparecer em uma única caixa.</p></div>';
      return;
    }
    var pairs=[];
    for(var i=0;i<rows.length;i++)for(var j=i+1;j<rows.length;j++)pairs.push([rows[i],rows[j]]);
    var html='<div class="fx-overview"><div class="fx-overview-kicker">PARECER INTEGRADO</div><h3>'+rows.length+' alimentos selecionados · '+pairs.length+' comparações</h3>'+
      '<p>A avaliação a seguir é par a par, com classificação da evidência, proteínas implicadas, potencial de reatividade clínica e conduta. Abra cada cartão para consultar o parecer completo.</p></div>'+
      '<div class="fx-pair-list">'+pairs.map(function(items,idx){
        return pairReportHTML(items[0].food,items[1].food,items[0].tolerated,items[1].tolerated,idx,idx===0);
      }).join("")+'</div>'+
      '<p class="fx-integrated-note">Síntese: não transformar co-sensibilização ou homologia em diagnóstico de coalergia. A magnitude da reatividade é heterogênea por par, proteína e população; nenhum resultado deste comparador representa probabilidade individual de anafilaxia.</p>';
    out.innerHTML=html;
    if(typeof out.querySelectorAll==="function"){
      var activeEpoch=literatureRequest;
      out.querySelectorAll("details[data-fx-literature]").forEach(function(el){
        el.addEventListener("toggle",function(){
          if(!el.open||el.dataset.loaded==="true")return;
          el.dataset.loaded="true";
          var idx=Number(el.getAttribute("data-fx-literature")), item=pairs[idx];
          if(item)loadLiterature(item[0].food,item[1].food,"fxLiveLiteratureBody-"+idx,activeEpoch);
        });
      });
    }
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",insert);
  else insert();
})();