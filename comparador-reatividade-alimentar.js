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
  pair("banana","abacaxi","Reatividade cruzada molecular documentada; risco clínico variável","Banana e abacaxi compartilham profilinas homólogas: Mus a 1 e Ana c 1. Estudo experimental demonstrou ligação e inibição cruzada de IgE; um estudo observacional relatou reações clínicas ao abacaxi em 9/110 pacientes com alergia à banana que haviam ingerido a fruta (8,2%). Esse resultado não é estimativa de risco individual nem prova, em todos os casos, mecanismo por profilina.","Mus a 1 ↔ Ana c 1 (profilinas). Considerar IgE aos extratos e/ou prick-to-prick segundo a história; marcadores de profilina como Bet v 2/Phl p 12 quando disponíveis e clinicamente úteis. Ana c 2 (bromelina) pode refletir CCD e não confirma reação cruzada clínica.");
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
  function insert() {
    var page=document.getElementById("page-laboratorio");
    if(!page||document.getElementById("foodCrossCard"))return;
    var s=document.createElement("style");
    s.textContent=[
      ".fx-card{margin:6px 16px 17px;border:1px solid #d4e6ec;border-radius:14px;background:white;overflow:hidden;box-shadow:0 2px 10px rgba(13,31,45,.04)}",
      ".fx-card summary{list-style:none;cursor:pointer;padding:13px 15px;display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--navy)}",
      ".fx-card summary::-webkit-details-marker{display:none}.fx-title{font-size:14px;font-weight:800}.fx-summary-sub{display:block;color:#64748b;font-size:11px;font-weight:500;margin-top:3px}",
      ".fx-chevron{font-size:20px;color:var(--teal-mid)}.fx-card[open] .fx-chevron{transform:rotate(180deg)}",
      ".fx-body{border-top:1px solid #e5edf2;padding:14px}.fx-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      ".fx-field label{display:block;margin:0 0 6px;font-size:11px;font-weight:800;color:#35556a}.fx-field select{width:100%;min-width:0;border:1px solid #cfdde4;border-radius:9px;padding:11px 9px;background:#f8fbfc;color:#0d1f2d;font:600 12px Manrope,sans-serif}",
      ".fx-controls{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin:12px 0}.fx-controls button,.fx-add{background:var(--teal-mid);color:white;border:0;border-radius:9px;font:700 12px Manrope,sans-serif;padding:10px 13px;cursor:pointer}",
      ".fx-controls label{display:flex;align-items:flex-start;gap:6px;color:#475569;font-size:11px;line-height:1.5}.fx-note{font-size:11px;line-height:1.65;color:#475569;background:#f3f8fa;border-radius:9px;padding:10px 12px}",
      ".fx-results{margin-top:13px}.fx-results h4{font-size:13px;margin:13px 0 7px;color:var(--navy)}.fx-results p{font-size:12px;line-height:1.7;margin:7px 0;color:#334155}",
      ".fx-status{border-left:3px solid #1f6980;background:#edf6f8;padding:11px 12px;border-radius:0 8px 8px 0}.fx-status strong{font-size:12px;color:#123447}",
      ".fx-match{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0 11px}.fx-tag{border:1px solid #cbdde5;border-radius:99px;background:#f5fafc;padding:5px 8px;font-size:10px;color:#315366}",
      ".fx-group{margin:10px 0;padding:10px;border:1px solid #e0e9ed;border-radius:10px}.fx-group h5{font-size:12px;color:#1a4a5c;margin:0 0 6px}",
      ".fx-molecule{padding:10px 0;border-top:1px solid #edf2f4}.fx-molecule:first-of-type{border-top:0}.fx-molecule-head{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}",
      ".fx-molecule-name{font-size:12px;font-weight:800;color:#14364a}.fx-molecule-meta{font-size:10px;color:#64748b}.fx-molecule p{font-size:11px;margin:4px 0;line-height:1.55}.fx-add{padding:7px 9px;font-size:10px}.fx-rare{font-size:10px;color:#64748b}",
      ".fx-sources{margin-top:12px;padding-top:10px;border-top:1px solid #e1eaf0;font-size:10px;line-height:1.8;color:#64748b}.fx-sources a{color:#186d85;text-decoration:underline}",
      "@media(max-width:520px){.fx-grid{grid-template-columns:1fr}.fx-card{margin-left:12px;margin-right:12px}.fx-field select{font-size:13px}}"
    ].join("\n");
    document.head.appendChild(s);
    var wrap=document.createElement("details");
    wrap.id="foodCrossCard";wrap.className="fx-card";
    wrap.innerHTML='<summary><span><span class="fx-title">Reatividade cruzada entre alimentos</span><span class="fx-summary-sub">Compare dois alimentos e veja os componentes e a aplicação clínica</span></span><span class="fx-chevron" aria-hidden="true">⌄</span></summary>'+
      '<div class="fx-body"><div class="fx-grid"><div class="fx-field"><label for="fxFoodA">1º alimento</label><select id="fxFoodA"><option value="">Selecione um alimento</option>'+optionHTML()+'</select></div>'+
      '<div class="fx-field"><label for="fxFoodB">2º alimento</label><select id="fxFoodB"><option value="">Selecione outro alimento</option>'+optionHTML()+'</select></div></div>'+
      '<div class="fx-controls"><button id="fxCompare" type="button">Analisar comparação</button><label><input id="fxTolerated" type="checkbox"> O paciente já consome o segundo alimento sem sintomas</label></div>'+
      '<div class="fx-note">Comparação baseada em proteínas, parentesco e dados publicados. Não estima percentual de risco individual nem diagnostica alergia. A história, a tolerância habitual, os cofatores e os testes dirigidos determinam a investigação.</div>'+
      '<div id="fxResult" class="fx-results" aria-live="polite" aria-atomic="false"></div></div>';
    var first=page.querySelector(".lab-pane");
    if(first)page.insertBefore(wrap,first);else page.appendChild(wrap);
    document.getElementById("fxCompare").addEventListener("click",render);
    document.getElementById("fxFoodA").addEventListener("change",render);
    document.getElementById("fxFoodB").addEventListener("change",render);
    document.getElementById("fxTolerated").addEventListener("change",render);
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
  function componentHTML(f) {
    var body='';
    if(!f.components.length) return '<p>Nenhum componente molecular com indicação clínica rotineira selecionado neste catálogo para este alimento. Considerar história, IgE ao extrato e/ou teste cutâneo dirigidos. Não interpretar ausência de marcador como ausência de alergia.</p>';
    f.components.forEach(function(m){
      var fam=FAMILY[m.family]||[m.family,"Mecanismo molecular descrito na literatura.","Utilidade clínica depende da fonte e da validação do ensaio."];
      var p=catEntry(m.name);
      var priority=m.tier==="prioritário"?"Maior utilidade em cenário específico":m.tier==="contextual"?"Selecionar conforme fenótipo":m.tier==="referência"?"Literatura / disponibilidade limitada":"Complementar";
      body+='<div class="fx-molecule"><div class="fx-molecule-head"><div><span class="fx-molecule-name">'+esc(m.name)+'</span><span class="fx-molecule-meta"> · '+esc(fam[0])+' · '+esc(priority)+'</span></div>'+
        (p?'<button class="fx-add" type="button" data-fx-add="'+esc(p.c)+'">Adicionar à nota ('+esc(p.c)+')</button>':'<span class="fx-rare">Confirmar disponibilidade do ensaio</span>')+'</div>'+
        '<p>Por que considerar: '+esc(fam[1])+'</p><p>Aplicação clínica: '+esc(special[m.name]||fam[2])+'</p></div>';
    });
    return body;
  }
  // Consulta bibliográfica aberta, apenas com nomes de alimentos; nenhum dado de paciente é transmitido.
  // Resultados automáticos são referências para leitura e NÃO são convertidos em conclusão clínica.
  var literatureRequest=0;
  function loadLiterature(a,b) {
    var requestId=++literatureRequest;
    var target=document.getElementById("fxLiveLiteratureBody");
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
      var node=document.getElementById("fxLiveLiteratureBody");
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
      var node=document.getElementById("fxLiveLiteratureBody");
      if(node)node.textContent="Consulta automática indisponível no momento. Use o link de busca específica no PubMed listado nas referências.";
    });
  }
  function render() {
    var out=document.getElementById("fxResult");if(!out)return;
    var a=byId[document.getElementById("fxFoodA").value],b=byId[document.getElementById("fxFoodB").value],tol=document.getElementById("fxTolerated").checked;
    if(!a||!b){out.innerHTML='';return;}
    if(a.id===b.id){out.innerHTML='<div class="fx-status"><strong>Escolha dois alimentos diferentes.</strong><p>Um mesmo alimento não representa comparação de reatividade cruzada.</p></div>';return;}
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
    var html='<div class="fx-status"><strong>'+esc(explicit.level)+'</strong><p>'+esc(explicit.reason)+'</p>'+(explicit.focus?'<p>Foco da avaliação: '+esc(explicit.focus)+'</p>':'')+'</div>';
    if(tol)html+='<div class="fx-note" style="margin-top:10px">Tolerância informada: o segundo alimento já é ingerido na apresentação usual sem sintomas. A tolerância habitual é evidência clínica importante contra alergia atual nessa forma de consumo; não solicitar IgEs nem restringi-lo apenas por homologia molecular.</div>';
    html+='<h4>Famílias moleculares relacionadas</h4>';
    html+=common.length?'<div class="fx-match">'+common.map(function(f){return '<span class="fx-tag">'+esc((FAMILY[f]||[f])[0])+'</span>';}).join("")+'</div>':
      '<p>Nenhuma família compartilhada cadastrada. Alguns pares têm associação clínica por outras vias ou componentes ainda não representados.</p>';
    html+='<p>As famílias abaixo incluem opções publicadas para cada alimento, não uma solicitação de painel completo. “Prioritário” só indica relevância em um cenário apropriado, não pedido obrigatório. O botão de pedido aparece exclusivamente quando o componente consta no catálogo local.</p>';
    html+='<div class="fx-group"><h5>'+esc(a.label)+' · opções moleculares</h5>'+componentHTML(a)+'</div>';
    html+='<div class="fx-group"><h5>'+esc(b.label)+' · opções moleculares</h5>'+componentHTML(b)+'</div>';
    html+='<h4>Como aplicar ao paciente</h4><p>1. Descrever alimento implicado, tempo após ingestão, preparo, quantidade, reprodutibilidade, cofatores e alimentos já tolerados. 2. Quando houver suspeita IgE-mediada, iniciar com teste cutâneo e/ou IgE ao extrato, escolhidos pela história. 3. Usar componentes que possam esclarecer sensibilização primária, reatividade cruzada ou fenótipo clínico. 4. Se persistir incerteza, avaliar BAT (quando indicado/disponível) e teste de provocação oral supervisionado.</p>';
    html+='<p>Não prescrever exclusão alimentar generalizada, não interpretar IgE como probabilidade de anafilaxia e não inferir segurança com base apenas em proteína termolábil. Não se aplica para diagnosticar alergias não IgE-mediadas.</p>';
    html+='<div class="fx-group"><h5>Pesquisa bibliográfica complementar (Europe PMC)</h5><p id="fxLiveLiteratureBody">Consultando publicações indexadas para este par. Apenas os nomes dos alimentos são enviados.</p></div>';
    html+='<div class="fx-sources"><span>Referências para esta comparação (estudos específicos revisados quando disponíveis, além das diretrizes metodológicas):</span> '+links(a,b,common)+'. Revisão da base: 09/11/2026. A pesquisa no PubMed não substitui revisão crítica dos artigos.</div>';
    out.innerHTML=html;
    loadLiterature(a,b);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",insert);
  else insert();
})();