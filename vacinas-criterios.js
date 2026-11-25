/* Critérios objetivos de indicação - vacinas e imunização passiva. Referências oficiais, revisão 13/11/2026. */
(function(){

  'use strict';
  var catalog=window.VAC_CATALOGO;
  if(!Array.isArray(catalog)||typeof window.vacRenderVacinas!=='function')return;
  var rules={"bcg":{"w":["Rotina: recém-nascidos e não vacinados até 4 anos, 11 meses e 29 dias.","Situação especial: contato domiciliar de pessoa com hanseníase, sem sinais clínicos da doença, após avaliação do número de cicatrizes/doses prévias."],"c":["Prematuro ou recém-nascido com peso inferior a 2.000 g: adiar até atingir 2.000 g.","Imunodeficiência, imunossupressão materna transplacentária e uso de imunossupressores exigem avaliação; BCG é vacina viva.","A partir dos 5 anos: não vacinar, exceto contatos de hanseníase elegíveis; nos contatos com HIV nessa faixa etária, contraindicar."],"s":"PNI"},"hepb":{"w":["Rotina universal desde o nascimento; se não vacinado ou esquema incompleto, realizar ou completar as doses.","Gestante suscetível ou sem comprovação de esquema completo: atualizar vacinação."],"c":["Mãe HBsAg positiva ou estado desconhecido no parto: verificar indicação de imunoglobulina anti-hepatite B e vacinação imediata conforme protocolo.","Prematuro com baixo peso/idade gestacional específica pode precisar de quatro doses; verificar nascimento e calendário.","Anti-HBs pós-vacinal é indicado em grupos específicos, como profissionais de saúde, diálise, imunocomprometidos e recém-nascidos expostos.","Grupos com necessidade de avaliação sorológica pós-vacinal: hemodiálise/DRC avançada, HIV, imunossupressão relevante, profissionais expostos a sangue e recém-nascidos de mães HBsAg positivas; contatos sexuais/domiciliares de pessoas HBsAg positivas exigem avaliação de suscetibilidade e exposição."],"s":"PNI"},"penta":{"w":["PNI: série primária infantil aos 2, 4 e 6 meses; resgate se houver doses em atraso."],"c":["Confirmar idade, doses válidas e intervalos; reforços com DTP não são substituídos automaticamente pela pentavalente.","História de encefalopatia temporariamente associada a componente pertussis ou contraindicação específica requer avaliação especializada."],"s":"PNI"},"vip":{"w":["Série aos 2, 4 e 6 meses; reforços aos 15 meses e aos 4 anos (desde 03/08/2026).","Indicação adicional em viajantes e pessoas com risco específico de exposição ao poliovírus, conforme recomendação de viagem/ocupação."],"c":["Definir necessidade de doses por histórico de VIP/VOP e viagem; a apresentação isolada não deve ser presumida como disponível no privado."],"s":"PNI"},"rota":{"w":["PNI: rotina aos 2 e 4 meses; também pode ser realizada em atraso dentro da janela etária ampliada."],"c":["1ª dose: de 1 mês e 15 dias até 11 meses e 29 dias; 2ª dose: de 3 meses e 15 dias até 23 meses e 29 dias; intervalo usual de 60 dias (mínimo excepcional de 30 dias).","História de invaginação intestinal, imunodeficiência combinada grave ou contraindicação específica impede a aplicação.","Contraindicações adicionais: malformação gastrointestinal não corrigida que predisponha à invaginação, imunodeficiência relevante, anafilaxia a componente/dose anterior."],"s":"PNI"},"pnc10":{"w":["Rotina infantil do SUS durante transição de produtos; esquema de rotina 2+1 conforme idade e vacinação já recebida."],"c":["Se a criança tem comorbidade elegível, considerar esquema da VPC20 pela RIE, distinto do calendário infantil de rotina.","Não presumir que uma dose anterior de VPC10 equivale a uma de VPC20 em todos os esquemas de transição."],"s":"RIE"},"pnc20_sus":{"w":["PNI: rotina infantil (2, 4 e 12 meses), elegibilidade especial pela RIE, indígenas e grupos etários com oferta específica.","SBIm: recomendação de rotina a partir de 50 anos; antecipar antes dessa idade quando houver condições de risco."],"c":["RIE — indicações clínicas: HIV; câncer em atividade; transplante de órgão ou de células-tronco; CAR-T; asplenia; erro inato da imunidade; fibrose cística; fístula liquórica/derivação ventricular; imunossupressão terapêutica; implante coclear; nefropatia/hemodiálise/síndrome nefrótica; pneumopatia crônica (exceto asma leve/intermitente); asma persistente moderada/grave; cardiopatia; hepatopatia; doença neurológica incapacitante; trissomias; diabetes; doença de depósito; prematuridade até 23 meses.","Histórico modifica conduta: VPC10/13 prévias, VPP23 (uma ou duas doses), TCTH/CAR-T e intervalos exigem o fluxograma específico; após VPC20 não administrar VPP23.","SUS e SBIm têm regras distintas para quem recebeu duas VPP23; não equiparar recomendação clínica a acesso público.","Exemplos clínicos de risco: DPOC, asma moderada/grave, fibrose cística, bronquiectasias clinicamente relevantes, insuficiência cardíaca, cirrose, doença renal crônica/diálise, síndrome nefrótica, anemia falciforme, asplenia, HIV, IDCV, neoplasia em atividade, TOS, TCTH/CAR-T, implante coclear e fístula de LCR. Confirmar elegibilidade específica na NT 64/2026 e guias posteriores; asma leve não gera acesso RIE automático."],"s":"RIE"},"menc":{"w":["PNI: duas doses na infância aos 3 e 5 meses; aos 12 meses, o reforço é MenACWY."],"c":["Asplenia, deficiência de complemento, uso de inibidores do complemento, surtos e outras condições de risco exigem avaliação do esquema meningocócico ampliado.","MenC não substitui MenACWY e MenB nos grupos de alto risco."],"s":"PNI"},"menacwy":{"w":["PNI: reforço aos 12 meses e dose dos 11 aos 14 anos, conforme histórico.","SBIm: calendário e reforços por faixa etária; pode ser ampliado em condições especiais."],"c":["Alto risco: asplenia funcional/anatômica, deficiência de complemento, tratamento com inibidores do complemento, exposição laboratorial, surto e algumas condições imunológicas.","Confirmar idade de início, doses já recebidas e intervalo/reforços; MenACWY não cobre sorogrupo B.","Exemplos de deficiência do complemento: C5–C9, properdina, fator D; uso de eculizumabe ou ravulizumabe. Asplenia anatômica ou funcional (incluindo doença falciforme). Avaliar HIV e risco de viagem conforme calendário específico. Vacinação não elimina risco com inibidores do complemento."],"s":"PNI"},"influenza":{"w":["SBIm: anualmente a partir de 6 meses.","PNI: oferta de rotina e estratégias especiais aos grupos estabelecidos pelo Ministério da Saúde (crianças pequenas, gestantes, idosos e outros prioritários)."],"c":["Comorbidades prioritárias incluem, por exemplo, pneumopatias crônicas (incluindo asma), cardiopatias, diabetes, doenças renais/hepáticas/neurológicas e imunossupressão; também há grupos ocupacionais e sociais.","Na primeira vacinação de criança menor de 9 anos, verificar necessidade de duas doses com intervalo mínimo de quatro semanas.","A composição trivalente do PNI em 2026 não deve ser confundida com apresentações privadas.","Grupos clínicos prioritários: asma, DPOC e outras pneumopatias crônicas, insuficiência cardíaca e outras cardiopatias relevantes, diabetes, DRC, hepatopatias, doenças neurológicas com comprometimento respiratório, imunossupressão e obesidade grave. Acesso SUS depende dos critérios da estratégia vigente; SBIm recomenda a todos ≥6 meses."],"s":"PNI"},"covid":{"w":["Seguir a faixa etária, grupo prioritário, produto disponível e esquema vigente do PNI."],"c":["A indicação de doses periódicas é distinta para idosos, gestantes, imunocomprometidos, crianças pequenas e demais grupos de risco.","Imunossupressão, idade, doses anteriores, infecção recente e intervalo desde a última dose definem esquema; consultar normativa atualizada antes de prescrever.","Não generalizar um número fixo de reforços para todas as idades e vacinas.","Grupos especiais: imunocomprometidos, puérperas, profissionais de saúde, pessoas com deficiência permanente, doenças crônicas (pneumopatias graves, cardiopatias, diabetes, nefropatias e outras previstas na norma), indígenas, quilombolas, ribeirinhos, institucionalizados, população em situação de rua ou privada de liberdade, trabalhadores dos Correios e sistema prisional e jovens em medidas socioeducativas."],"s":"PNI"},"fa":{"w":["Rotina pediátrica conforme PNI; para outros grupos, avaliar histórico vacinal e situação epidemiológica.","Viajantes para área de risco: verificar necessidade de vacinação e prazo mínimo antes da viagem."],"c":["Aos 6–8 meses, somente em situação excepcional de circulação viral confirmada após avaliação de risco-benefício.","Gestação, lactação em situações definidas, ≥60 anos e imunossupressão exigem avaliação ou contraindicam vacina viva, segundo a condição.","Histórico de doses antes dos 5 anos e exposição atual modificam recomendações de reforço; verificar PNI e SBIm separadamente."],"s":"PNI"},"triplice":{"w":["Rotina infantil aos 12 e 15 meses; adolescentes e adultos devem ter doses documentadas conforme faixa etária e risco."],"c":["Trabalhadores de saúde e pessoas em situação de surto/viagem podem ter exigência de duas doses válidas.","Gestantes e pessoas com imunossupressão relevante não devem receber vacina viva; dose antes dos 12 meses, quando indicada em surto, não conta para a rotina.","Trabalhadores de saúde: duas doses independentemente de idade, conforme histórico e contraindicações. Imunoglobulinas e hemoderivados podem exigir intervalo antes/depois da vacina; HIV exige avaliação de CD4 e condição clínica."],"s":"PNI"},"varicela":{"w":["Crianças, adolescentes e adultos suscetíveis, considerando história comprovada de vacinação/doença e calendário aplicável.","Pessoas com risco ocupacional ou convivência com vulneráveis podem exigir priorização quando suscetíveis."],"c":["Gestação e imunossupressão significativa contraindicam vacina viva; revisar uso recente de imunoglobulina e tempo de espera.","Intervalos entre as duas doses dependem da idade e do produto; diferenciar oferta PNI e recomendação SBIm.","Grupos de risco: profissionais de saúde suscetíveis, contatos domiciliares de imunocomprometidos e candidatos a transplante antes da imunossupressão; HIV e outras imunodeficiências requerem critérios específicos de segurança. Não aplicar automaticamente em gestante ou imunossupressão relevante."],"s":"PNI"},"dtp":{"w":["Reforço da infância, normalmente aos 15 meses e 4 anos, após esquema com pentavalente."],"c":["A partir dos 7 anos, usar apresentações indicadas para adolescentes/adultos (dT/dTpa).","Histórico de reações graves ao componente pertussis e esquema anterior orienta substituições."],"s":"PNI"},"hepa":{"w":["PNI: uma dose na rotina infantil aos 15 meses; SBIm recomenda duas doses na infância.","Esquemas especiais: hepatopatia crônica, coinfecções, imunodeficiência, transplantados e outras condições conforme CRIE/RIE."],"c":["Susceptibilidade, idade, exposições epidemiológicas e histórico vacinal definem necessidade; grupos especiais geralmente recebem esquema de duas doses.","Na profilaxia pós-exposição, considerar intervalo desde contato, idade e indicação eventual de imunoglobulina.","Exemplos clínicos: cirrose, hepatites B/C crônicas, candidatos a transplante e transplantados suscetíveis, HIV, homens que fazem sexo com homens, viajantes para área endêmica e contatos em surtos. Indicação clínica não implica acesso automático no SUS."],"s":"PNI"},"vpp23":{"w":["Uso em esquemas especiais ou de transição conforme indicações da RIE e histórico pneumocócico; não é rotina universal do idoso."],"c":["Após VPC20 não aplicar VPP23.","Se já recebeu uma ou duas VPP23, verificar intervalos e orientação específica da NT MS 52/2026 e da SBIm; as recomendações divergem em alguns cenários.","Não iniciar esquema novo com VPP23 isolada quando houver indicação preferencial de vacina conjugada."],"s":"RIE"},"dt":{"w":["A partir de 7 anos para completar ou atualizar proteção contra difteria/tétano, conforme registro."],"c":["Sem comprovação de esquema completo: completar três doses; esquema completo: reforço a cada dez anos.","Ferimentos com risco de tétano exigem avaliação da data da última dose, número de doses anteriores e possível imunoglobulina antitetânica.","Gestação e exposição ocupacional podem justificar dTpa em lugar de dT."],"s":"PNI"},"dtpa":{"w":["PNI: uma dose a cada gestação a partir de 20 semanas; outras indicações ocupacionais previstas na normativa.","SBIm: reforço/atualização na adolescência e idade adulta, especialmente para contactantes de recém-nascidos."],"c":["Gestante: aplicar em cada gravidez mesmo com dose anterior.","Trabalhadores da saúde que atendem recém-nascidos/lactentes e outros grupos expostos seguem regras específicas.","Se esquema básico contra tétano estiver incompleto, dTpa isolada não substitui toda a série primária.","Profissionais de saúde, especialmente assistência a gestantes e lactentes, familiares e cuidadores de recém-nascidos: avaliar reforço antecipado conforme intervalo e exposição; gestantes a cada gestação."],"s":"PNI"},"hpv4":{"w":["PNI: dose única de rotina para meninas e meninos de 9 a 14 anos.","Indicação especial no SUS para imunodeprimidos, vítimas de violência sexual, usuários de PrEP, pessoas com papilomatose respiratória recorrente e grupos previstos em norma."],"c":["Imunocomprometidos elegíveis (HIV, transplante, câncer): esquema de três doses; conferir faixa etária da indicação.","Violência sexual: de 9 a 14 anos, duas doses; 15 a 45 anos, três doses. PrEP de 15 a 45 anos e papilomatose respiratória recorrente têm esquemas específicos.","Aplicação fora da faixa etária rotineira não significa elegibilidade universal no SUS."],"s":"HPV"},"dengue_sus":{"w":["PNI: Qdenga de 10 a 14 anos dentro da estratégia e da disponibilidade local; na rede privada, usar faixa etária licenciada para o produto.","O histórico de dengue prévia não exige sorologia positiva para Qdenga."],"c":["Qdenga é vacina viva: contraindicar em gestação e imunossupressão relevante.","Aplicar duas doses com intervalo de três meses; após dengue recente, avaliar intervalo recomendado.","Não confundir Qdenga com Dengvaxia, que exige infecção prévia comprovada."],"s":"PNI"},"vvsr":{"w":["PNI: uma dose da vacina materna contra VSR em cada gestação a partir de 28 semanas, independentemente da idade materna."],"c":["A janela da rede privada pode variar com bula e recomendação SBIm; não importar automaticamente a janela privada para o SUS.","Se a gestante já recebeu em gestação anterior, verificar a recomendação vigente: no PNI de 2026 a orientação é uma dose por gestação."],"s":"PNI"},"raiva":{"w":["Pré-exposição: pessoas com risco ocupacional ou frequente exposição a animais potencialmente infectados (veterinários, laboratório, manejo de fauna e afins).","Pós-exposição: avaliar qualquer mordedura, arranhadura, lambedura em mucosa ou pele lesionada por animal de risco."],"c":["Decisão pós-exposição depende da espécie animal, possibilidade de observação por dez dias, condição do animal, gravidade/local da lesão e imunização prévia.","Conforme categoria de exposição, avaliar imunoglobulina/soro antirrábico além da vacina.","Imunocomprometidos podem necessitar de conduta e controle de resposta específicos."],"s":"PNI"},"hib_crie":{"w":["Rotina infantil pelo componente Hib da pentavalente/combinações.","Doses adicionais ou resgate para grupos elegíveis na RIE/CRIE, conforme idade e vacinação anterior."],"c":["Exemplos de grupos de risco: asplenia anatômica/funcional, transplante de células-tronco hematopoéticas e imunodeficiências selecionadas. Fístula liquórica e implante coclear isoladamente não devem ser apresentados como indicação automática de Hib.","Verificar se o paciente já recebeu Hib em vacina combinada; a indicação especial não significa reforço indiscriminado para todo adulto."],"s":"PNI"},"hexa":{"w":["Lactentes dentro da faixa etária aprovada para a apresentação; alternativa à combinação de componentes da rotina."],"c":["Escolha segundo idade mínima, fabricante, disponibilidade e doses anteriores; evitar duplicar antígenos em esquemas mistos.","Prematuridade e condições clínicas podem exigir ajustes/monitorização, sem correção da idade cronológica."],"s":"SBIm"},"pnc15":{"w":["SBIm: opção conjugada para crianças desde lactência e adultos em situações selecionadas."],"c":["Em adultos com risco, se VPC15 for usada em vez de VPC20, avaliar esquema sequencial com VPP23, com intervalos por condição.","Histórico de VPC10/13/15/VPP23 altera necessidade de doses; não copiar automaticamente esquema de VPC20.","Diferenciar recomendação clínica do acesso específico via SUS/RIE."],"s":"SBIm"},"menb":{"w":["SBIm: vacinação na infância/adolescência segundo faixa etária e produto; pode ser recomendada também em adultos com risco aumentado."],"c":["Risco elevado: asplenia, deficiência de complemento, uso de inibidores de complemento, exposição laboratorial e surtos; HIV e outras condições exigem avaliação individual.","Idade de início, número de doses e reforços dependem de Bexsero ou Trumenba; não são intercambiáveis.","MenB não substitui MenACWY.","Asplenia anatômica/funcional (incluindo doença falciforme), deficiência de complemento terminal, properdina e fator D, inibição de C5 (eculizumabe/ravulizumabe) e exposição laboratorial a meningococo. Reforços específicos enquanto persistir risco; não intercambiar produtos."],"s":"SBIm"},"tetraviral_p":{"w":["Crianças na faixa etária licenciada que precisam de proteção contra sarampo, caxumba, rubéola e varicela."],"c":["Histórico prévio das vacinas componentes determina número de doses; evitar duplicação indevida.","Por ser vacina viva, contraindicar em gestantes e imunossupressão significativa; na primeira dose da infância avaliar a alternativa de componentes separados e risco de convulsão febril."],"s":"SBIm"},"hepa_p":{"w":["Pessoa de faixa etária autorizada que necessita simultaneamente completar proteção para hepatites A e B."],"c":["Viajantes, pessoas com exposição ocupacional/sexual ou hepatopatia crônica podem ter indicação das duas vacinas; conferir quais doses já foram recebidas.","Esquema acelerado só nas situações e faixas etárias aprovadas para a apresentação, com dose adicional posterior."],"s":"SBIm"},"hpv9":{"w":["SBIm: indicação na faixa etária licenciada, geralmente 9 a 45 anos, conforme risco e decisão clínica.","Pode ser recomendada em circunstâncias especiais de imunossupressão, seguindo bula e orientações de sociedade."],"c":["Início antes dos 15 anos, sem imunossupressão: geralmente duas doses; a partir de 15 anos ou com imunossupressão: três doses.","PNI de rotina usa HPV4 e tem critérios de acesso distintos; HPV9 privada não é oferta universal no SUS.","A partir de 20 até 45 anos, individualizar conforme risco e histórico; imunocomprometidos requerem 3 doses. Avaliar HPV9 após HPV4 de acordo com calendário SBIm, sem reiniciar indiscriminadamente."],"s":"SBIm"},"influenza4":{"w":["Vacinação anual conforme indicação clínica e faixa etária aprovada para a formulação; SBIm recomenda desde os seis meses."],"c":["Em criança menor de nove anos na primeira vacinação, checar necessidade de duas doses.","Idosos, gestantes, pessoas com comorbidades e imunossuprimidos têm maior prioridade clínica.","Conferir a composição e o registro da vacina da temporada; não presumir que formulação quadrivalente esteja disponível em qualquer ano.","Em 2026, formulações trivalentes são relevantes, inclusive alta concentração (HD3V). B/Yamagata não circula desde 2020; não apresentar quadrivalência como superioridade automática. Conferir apresentação sazonal."],"s":"SBIm"},"herpes":{"w":["Rotina: adultos a partir de 50 anos.","Antecipação: a partir de 18 anos em imunocomprometidos ou pessoas com risco aumentado. SBIm 2026/27: considerar individualmente em cardiopatia/pneumopatia crônica e diabetes; não é indicação automática por asma leve ou ocupação."],"c":["Avaliar imunodeficiência primária/secundária, neoplasia hematológica, transplante, HIV e terapias imunossupressoras.","Duas doses (0 e 2 meses; janela de 2–6 meses); intervalo de 1–2 meses se imunossuprimido e houver necessidade de antecipar. Episódio anterior de zóster não exclui vacinação.","Imunossupressão: neoplasia hematológica, TCTH, transplante de órgão sólido, HIV e terapias imunossupressoras relevantes. Doença autoimune ou uso de biológico não imunossupressor isolados não equivalem automaticamente a imunossupressão; cardiopatia/pneumopatia crônica e diabetes antes de 50 anos exigem avaliação individual."],"s":"SBIm"},"nirse":{"w":["Imunização passiva, não vacina. Na estratégia especial do SUS: prematuros com idade gestacional até 36 semanas e 6 dias e menos de seis meses; ou menores de 24 meses com condições de risco definidas."],"c":["Condições de risco: cardiopatia congênita com repercussão, broncodisplasia, imunocomprometimento grave, fibrose cística, síndrome de Down, doença neuromuscular ou anomalia congênita das vias aéreas.","Peso ao nascer não exclui prematuro elegível; no SUS, esquema e acesso dependem da temporada e do protocolo vigente.","Não confundir com vacina materna VSR: são estratégias diferentes, a elegibilidade deve ser conferida.","Condições pediátricas: cardiopatia congênita com repercussão hemodinâmica, broncodisplasia, fibrose cística, imunocomprometimento grave, síndrome de Down, doença neuromuscular ou anomalia congênita de vias aéreas, respeitando idade e critérios do protocolo SUS."],"s":"NIRSE"},"febretif":{"w":["Viajantes para áreas de transmissão de febre tifoide, conforme destino, duração e padrão de exposição a água/alimentos.","Profissionais de laboratório com risco de contato com Salmonella Typhi."],"c":["Apresentação oral viva versus injetável inativada têm idade mínima, esquemas e contraindicações diferentes.","Vacina oral viva não é opção adequada em imunossupressão relevante; verificar produto efetivamente disponível e bula."],"s":"SBIm"},"dengue_p":{"w":["Não oferecer como opção de rotina: disponibilidade comercial atual não confirmada; consultar histórico de imunização."],"c":["Não administrar a soronegativos ou sem confirmação laboratorial válida de infecção anterior, devido ao risco aumentado de dengue grave.","Vacina viva: gestação e imunossupressão relevante contraindicam; não intercambiar com Qdenga."],"s":"SBIm"}};
  var refs={"PNI":["Ministério da Saúde · IN 2026","https://www.gov.br/saude/pt-br/vacinacao/publicacoes/instrucao-normativa-que-instrui-o-calendario-nacional-de-vacinacao-2026.pdf/view"],"RIE":["Ministério da Saúde · NT 52/2026","https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-no-52-2026-cgici-dpni-svsa-ms.pdf/view"],"SBIm":["SBIm · Calendários 2026/2027","https://www.sbim.org.br/calendario-de-vacinacao"],"HPV":["Ministério da Saúde · HPV","https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hpv"],"NIRSE":["Ministério da Saúde · Guia nirsevimabe 2026","https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2026/guia-de-estrategia-contra-virus-sincicial-para-criancas-prematuras.pdf"]};
  var PNI=refs.PNI[1],SBIM=refs.SBIm[1];
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[x];});}
  function syncCatalog(){
    /* Dengvaxia: registro histórico não é comprovação de comercialização atual. */
    for(var i=catalog.length-1;i>=0;i--)if(catalog[i].id==='dengue_p')catalog.splice(i,1);
    catalog.forEach(function(v){
      if(v.id==='vip'){v.esq='2, 4 e 6 meses; reforços aos 15 meses e 4 anos (PNI desde 03/08/2026).';}
      if(v.id==='hib_crie'){v.pop='Rotina infantil e grupos especiais conforme RIE (asplenia, TCTH, imunodeficiências selecionadas).';}
      if(v.id==='influenza'){v.pop='SBIm: todos ≥6 meses; PNI: grupos de rotina e prioritários discriminados na ficha.';}
      if(v.id==='influenza4'){v.pop='Todos ≥6 meses, conforme apresentação aprovada; verificar disponibilidade sazonal.';}
      if(v.id==='covid'){v.pop='Rotina PNI: 6 meses a menores de 5 anos, gestantes e ≥60 anos; demais grupos conforme risco e histórico.';}
      if(v.id==='rota'){
        v.pop='Crianças até 23 meses e 29 dias; a primeira dose só pode ser iniciada até 11 meses e 29 dias (PNI 2026).';
        v.esq='PNI VRH1: 2 e 4 meses; SBIm VRH1: 2 e 4 meses; VRH5: 2, 4 e 6 meses. Resgate: primeira até 11m29d e última até 23m29d.';
        v.obs='Não iniciar após 11m29d nem administrar a segunda dose após 23m29d; verificar histórico de invaginação intestinal e imunodeficiência combinada grave.';
      }
      if(v.id==='nirse'){
        v.sus=1;
        v.pop='SUS/RIE: prematuros ≤36 semanas e 6 dias com menos de 6 meses; menores de 24 meses com condições clínicas de risco definidas. Na rede particular, avaliar bula e recomendação clínica.';
        v.obs='Anticorpo monoclonal de imunização passiva (não é vacina). No SUS desde 2026 para grupos elegíveis conforme protocolo específico.';
      }
      if(v.id==='influenza4'){
        v.obs='Conferir a formulação da temporada. SBIm prefere alta dose a partir de 60 anos quando indicada e disponível.';
      }
      if(v.id==='dtpa'){
        v.pop='PNI: gestantes a partir de 20 semanas em cada gestação e grupos ocupacionais específicos; SBIm: adolescentes e adultos segundo recomendações de reforço.';
      }
    });
  }
  /* Recomendações clínicas e elegibilidade pública são independentes. Revisão 25/11/2026. */
  var sbimInd={"bcg":"Rotina ao nascimento; prematuros devem pesar pelo menos 2 kg. Resgate infantil conforme idade; avaliar contatos de hanseníase e contraindicações imunológicas.","hepb":"Universal para suscetíveis de qualquer idade. Ao nascer, preferencialmente nas primeiras 12–24 h; completar série conforme produto. Adultos: 0, 1 e 6 meses; grupos especiais podem exigir dose ampliada, sorologia ou esquema específico.","penta":"Série infantil aos 2, 4 e 6 meses. A SBIm prefere combinações acelulares (penta ou hexa) quando disponíveis; reforços de DTP e VIP conforme calendário.","vip":"Série aos 2, 4 e 6 meses; reforços aos 15 meses e 4–5 anos. Viajantes e trabalhadores expostos ao poliovírus: avaliar destino, histórico e exigências.","rota":"VRH1: 2 e 4 meses; VRH5: 2, 4 e 6 meses. Intervalo mínimo de 4 semanas. Primeira dose até 11m29d, última até 23m29d para ambas. Se qualquer dose foi VRH5 ou produto desconhecido, completar 3 doses. Não complementar esquema VRH1 completo.","pnc10":"A SBIm prefere VPC20 ou VPC15 na rotina infantil. Doses prévias de VPC10 são consideradas no resgate; avaliar complementação com conjugada de maior valência conforme idade e risco.","pnc20_sus":"Rotina na infância e a partir de 50 anos; antes dos 50 anos, avaliar condições especiais de risco (incluindo asma moderada/grave, outras pneumopatias, cardiopatias, diabetes, nefropatia, hepatopatia, imunodeficiência, asplenia, HIV, transplante, câncer e imunossupressão). Esquema infantil 3+1 aos 2, 4, 6 e 12–15 meses; adulto não vacinado geralmente uma dose. Histórico pneumocócico e transplante modificam a conduta.","menc":"Na infância, a SBIm prefere MenACWY quando disponível; MenC é alternativa para cobertura do sorogrupo C. Reforços por idade e risco; não protege contra A, W, Y ou B.","menacwy":"Rotina aos 3 e 5 meses, reforço entre 12 e 15 meses, aos 5–6 anos e aos 11 anos conforme histórico. Adolescentes não vacinados devem atualizar; adultos e idosos em risco epidemiológico, viagens ou condições especiais. Asplenia, deficiência de complemento e inibidores do complemento exigem esquema especial e reforços.","influenza":"Anual para todas as pessoas a partir de 6 meses, independentemente de comorbidade ou elegibilidade SUS. Primovacinação antes de 9 anos: duas doses com um mês de intervalo. Gestantes, idosos, imunocomprometidos, comorbidades e conviventes de vulneráveis são prioritários; a partir de 60 anos preferir alta dose quando indicada/disponível.","covid":"Vacinação conforme recomendações nacionais vigentes por idade, produto e risco; atenção a gestantes, idosos, crianças pequenas e imunocomprometidos. Esquemas e reforços devem acompanhar a atualização da temporada e do Ministério da Saúde.","fa":"Rotina infantil aos 9 meses e 4 anos; para pessoas vacinadas a partir de 5 anos, considerar segunda dose após 10 anos conforme SBIm. Avaliar viagem, circulação viral e contraindicações; a partir de 60 anos, decisão individual.","triplice":"Duas doses válidas após 12 meses, inclusive adolescentes e adultos suscetíveis, com intervalo mínimo de um mês. Profissionais de saúde e viajantes devem ter proteção documentada; contraindicação em gestantes e imunossupressão importante.","varicela":"Rotina infantil aos 12 e 15 meses, e duas doses para adolescentes e adultos suscetíveis; atenção a profissionais de saúde e conviventes de vulneráveis. Intervalo por idade e apresentação; contraindicação na gestação e imunossupressão relevante.","dtp":"Rotina aos 2, 4 e 6 meses (componentes combinados), reforços aos 15 meses e 4–6 anos; preferir DTPa quando disponível. A partir dos 7 anos, usar dT/dTpa conforme histórico e idade.","hepa":"Rotina a partir dos 12 meses, duas doses com intervalo de 6 meses; também para adolescentes e adultos suscetíveis. Priorizar hepatopatia, viagens, exposição ocupacional/sexual e contatos/surtos conforme risco. Imunodeprimidos podem exigir avaliação específica.","vpp23":"Alternativa em esquema sequencial quando a conjugada escolhida exigir complementação; VPC20 é preferida nos grupos de risco e dispensa VPP23 subsequente. Não indicar indiscriminadamente sem revisar doses anteriores.","dt":"Completar três doses de vacina com componente tetânico se esquema desconhecido/incompleto; reforço decenal, preferencialmente com dTpa quando possível. Ferimentos e gestação têm regras específicas.","dtpa":"Reforço na adolescência e a cada 10 anos na vida adulta; uma dose em cada gestação a partir de 20 semanas. Priorizar profissionais de saúde, cuidadores e contatos de lactentes; esquema básico incompleto exige complementação.","hpv4":"A SBIm prefere HPV9 quando disponível. HPV4 permanece opção do PNI segundo critérios próprios; histórico prévio de HPV4 não elimina necessariamente indicação de HPV9.","dengue_sus":"Qdenga: pessoas de 4 a 60 anos, com ou sem dengue prévia, duas doses (0 e 3 meses); avaliar risco epidemiológico. Não administrar a gestantes ou pessoas com imunossupressão relevante.","vvsr":"Rotina a partir de 28 semanas de gestação, sem depender da sazonalidade. Entre 24 e 27 semanas, decisão médica dentro da indicação de bula; gestantes com menos de 18 anos: uso off-label a critério médico. Não confundir com vacinação de adultos por risco.","raiva":"Pré-exposição para pessoas com risco ocupacional, viagens ou exposição frequente a animais; pós-exposição conforme tipo de contato, animal, possibilidade de observação e histórico. Avaliar imunoglobulina quando indicada.","hib_crie":"Rotina infantil aos 2, 4, 6 meses e reforço no segundo ano de vida, com vacina combinada. Doses especiais em asplenia, transplante e outras condições específicas conforme calendário de pacientes especiais.","hexa":"Preferência por combinações acelulares na rotina de lactentes, aos 2, 4 e 6 meses, conforme apresentação e esquema de hepatite B; reforço dos componentes DTPa, VIP e Hib conforme calendário. Prematuros vacinados pela idade cronológica.","pnc15":"Alternativa à VPC20 na rotina infantil; esquema aos 2, 4, 6 meses e reforço aos 12–15 meses. Em adultos, quando a VPC20 não for usada, avaliar esquema sequencial VPC15 + VPP23 conforme risco/histórico.","menb":"Rotina infantil aos 3 e 5 meses, reforço entre 12 e 15 meses. Adolescentes não vacinados: duas doses, conforme produto. Adultos com risco especial (asplenia, deficiência/inibição do complemento, exposição laboratorial e surtos) devem ser avaliados; Bexsero e Trumenba não são intercambiáveis.","tetraviral_p":"Alternativa para completar proteção contra sarampo, caxumba, rubéola e varicela em suscetíveis na idade licenciada; na primeira dose infantil, preferir componentes separados quando indicado pelo risco de febre/convulsão. Contraindicada na gestação e imunossupressão relevante.","hepa_p":"Para suscetíveis que precisam de proteção contra ambas as hepatites; revisar doses anteriores. Usualmente 0, 1 e 6 meses conforme apresentação/idade; esquemas alternativos apenas quando respaldados pela bula.","hpv9":"Preferencial na rotina a partir de 9 anos; completar esquema até 19 anos e avaliar adultos até 45 anos conforme idade, histórico e risco. Antes dos 15 anos, duas doses (0 e 6 meses) se imunocompetente; a partir de 15 anos ou imunocomprometidos, três doses (0, 2 e 6 meses).","influenza4":"Vacinação anual a partir de 6 meses, inclusive fora dos grupos PNI. Usar a formulação efetivamente disponível na temporada; preferir alta dose a partir de 60 anos quando indicada.","herpes":"Rotina a partir de 50 anos; a partir de 18 anos em imunocomprometidos ou risco aumentado. Considerar individualmente comorbidades associadas a risco, sem transformar asma leve ou profissão em indicação automática. Duas doses, usualmente 0 e 2 meses; episódio prévio não exclui vacinação.","nirse":"Imunização passiva: recomendada conforme critérios de risco e vacinação materna, incluindo prematuros com menos de 12 meses, recém-nascidos de mães imunossuprimidas, parto menos de 14 dias após vacina materna e crianças de 12 a 23 meses com risco de doença grave. Outros lactentes: decisão individual conforme vacinação materna e sazonalidade.","febretif":"Indicação por risco: viajantes para locais com transmissão relevante e profissionais expostos a Salmonella Typhi em laboratório. Confirmar apresentação comercializada, idade mínima e esquema.","dengue_p":"Apresentação histórica: Família SBIm informa Qdenga como vacina disponível. Não apresentar Dengvaxia como opção comercial ativa sem confirmação documental de comercialização.","vrsAdulto":"Rotina a partir de 70 anos. Dos 18 aos 69 anos, a indicação depende da doença e da faixa etária: cardiopatia/pneumopatia crônica clinicamente relevante e imunodeficiência moderada/grave a partir de 18 anos; diabetes, nefropatia e hepatopatia a partir de 50 anos, ou dos 18 aos 49 a critério médico. Ver quadro clínico detalhado abaixo. Uma dose IM, em qualquer época do ano; reforço periódico não estabelecido."};
  var pniInd={"bcg":"Rotina ao nascer e resgate até 4 anos, 11 meses e 29 dias; contatos de hanseníase conforme protocolo.","hepb":"Universal no nascimento e para não vacinados de qualquer idade; esquemas especiais conforme exposição e condição clínica.","penta":"Rotina aos 2, 4 e 6 meses e resgate infantil conforme idade.","vip":"Série aos 2, 4 e 6 meses; reforços aos 15 meses e aos 4 anos (desde 03/08/2026).","rota":"Rotina aos 2 e 4 meses e resgate nos limites etários da IN 2026.","pnc10":"Oferta durante transição do calendário pneumocócico; seguir produto e esquema definidos pelo PNI.","pnc20_sus":"Rotina infantil 2, 4 e 12 meses e grupos especiais RIE conforme nota técnica vigente; oferta adicional por faixa etária/grupo definido pelo PNI. Não equivale à indicação universal da SBIm a partir de 50 anos. A NT 64/2026 atualiza a NT 52/2026; NT 310/2026 amplia oferta para ≥85 anos.","menc":"Rotina aos 3 e 5 meses; reforço com ACWY aos 12 meses.","menacwy":"Reforço aos 12 meses e dose para adolescentes de 11 a 14 anos; grupos especiais conforme RIE.","influenza":"Rotina: 6 meses a menores de 6 anos, gestantes e ≥60 anos. Estratégias prioritárias: puérperas até 45 dias, profissionais de saúde, professores, indígenas, quilombolas, população de rua, pessoas com deficiência permanente, comorbidades, forças de segurança/armadas, transportes e grupos institucionais previstos na norma.","covid":"Rotina: crianças de 6 meses a menores de 5 anos, gestantes e ≥60 anos. Reforços para grupos especiais conforme idade, produto, histórico e periodicidade vigente; não é reforço universal para pessoas saudáveis de 5 a 59 anos.","fa":"Rotina aos 9 meses e 4 anos; atualização de não vacinados conforme idade e risco epidemiológico.","triplice":"Rotina aos 12 e 15 meses; duas doses até 29 anos, uma dose dos 30 aos 59 anos; profissionais de saúde e situações epidemiológicas conforme norma.","varicela":"Rotina infantil conforme calendário; grupos especiais elegíveis pela RIE e estratégias específicas.","dtp":"Reforço aos 15 meses e 4 anos; resgate infantil conforme idade.","hepa":"Uma dose de rotina aos 15 meses, resgate até antes dos 5 anos; duas doses em situações especiais previstas na RIE.","vpp23":"Acesso em grupos específicos e esquemas de transição conforme RIE/PNI e histórico.","dt":"A partir de 7 anos, completar esquema básico e reforçar a cada 10 anos; regras especiais para ferimentos.","dtpa":"Cada gestação a partir de 20 semanas e grupos ocupacionais/especiais definidos pelo PNI.","hpv4":"Rotina de 9 a 14 anos, dose única; grupos especiais (imunocomprometidos, violência sexual, PrEP, papilomatose respiratória recorrente) conforme idade e esquema da norma vigente.","dengue_sus":"Oferta de Qdenga conforme faixa etária, municípios e estratégias do PNI; não confundir com indicação da bula ou da SBIm. Butantan-DV: estratégia temporariamente interrompida em 08/06/2026; sem retomada confirmada nesta revisão. Não confundir os dois produtos.","vvsr":"Uma dose por gestação a partir de 28 semanas, conforme PNI.","raiva":"Pré e pós-exposição conforme protocolo do Ministério da Saúde e avaliação do risco.","hib_crie":"Rotina como componente da pentavalente; doses especiais conforme critérios RIE.","hexa":"Sem oferta universal da apresentação hexavalente acelular na rotina do PNI; componentes são ofertados em outras apresentações e situações especiais.","pnc15":"Sem oferta universal da apresentação VPC15 no calendário público; consultar alternativas PNI/RIE.","menb":"Sem oferta universal na rotina do PNI; consultar estratégias excepcionais se houver.","tetraviral_p":"O PNI utiliza tetraviral ou componentes separados conforme calendário e disponibilidade; não equivale a acesso universal para todas as idades.","hepa_p":"Sem oferta universal da apresentação combinada; hepatites A e B têm critérios próprios no PNI.","hpv9":"Sem oferta universal da apresentação HPV9; PNI utiliza HPV4 conforme critérios vigentes.","influenza4":"O PNI oferta formulação sazonal definida pelo Ministério da Saúde, não necessariamente quadrivalente.","herpes":"Sem oferta universal na rotina do PNI; verificar eventual atualização de incorporação e acesso.","nirse":"Oferta pública para grupos definidos no protocolo nacional de imunização passiva, com critérios próprios de idade, prematuridade e comorbidades.","febretif":"Não integra o calendário público de rotina.","dengue_p":"Não é a apresentação de rotina da estratégia pública de vacinação contra dengue.","vrsAdulto":"Não confundir vacinação de adultos com a oferta materna pelo SUS; sem oferta universal de rotina para adultos."};
  function infoBox(id,compact){
    var v=rules[id]; if(!v)return '';
    var h='<section class="vac-criterios-box" aria-label="Critérios de indicação">';
    h+='<div class="vac-criterios-title">Critérios objetivos de indicação</div>';
    h+='<div class="vac-criterios-sub" style="color:#075d79">SBIm 2026/2027 — indicação clínica</div><p>'+esc(sbimInd[id]||'Consultar calendário SBIm aplicável à idade e condição clínica.')+'</p>';
    h+='<div class="vac-criterios-sub" style="color:#236447">PNI / SUS — elegibilidade e acesso público</div><p>'+esc(pniInd[id]||'Consultar critérios públicos vigentes.')+'</p>';
    if(id==='vrsAdulto')h+=rsvDetails();
    h+='<div class="vac-criterios-sub">Detalhes complementares da indicação</div>';
    h+='<ul>'+v.w.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>';
    if(!compact){
      h+='<div class="vac-criterios-sub">Condições que mudam a indicação ou o esquema</div>';
      h+='<ul>'+v.c.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>';
      var ref=refs[v.s]||refs.SBIm;
      h+='<div class="vac-criterios-source">Referência: <a target="_blank" rel="noopener noreferrer" href="'+esc(ref[1])+'">'+esc(ref[0])+'</a>';

      h+=' · <a target="_blank" rel="noopener noreferrer" href="'+esc(PNI)+'">PNI 2026</a> · <a target="_blank" rel="noopener noreferrer" href="'+esc(SBIM)+'">SBIm 2026/2027</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/saude/pt-br/vacinacao/grupos-especiais">RIE/CRIE</a> · <a target="_blank" rel="noopener noreferrer" href="https://sbim.org.br/calendario-de-vacinacao/pacientes-especiais">SBIm pacientes especiais</a>';
      if(id==='pnc20_sus'||id==='vpp23'||id==='pnc15'||id==='pnc10')h+=' · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-no-64-2026-dpni-svsa-ms.pdf/view">NT 64/2026 — atualização RIE</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-conjunta-no-310-2026.pdf/view">NT 310/2026 — ≥85 anos</a>';
      if(id==='vip')h+=' · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/saude/pt-br/assuntos/noticias/2026/agosto/ministerio-da-saude-reforca-vacinacao-de-criancas-e-adolescentes-contra-sarampo-pneumonias-e-outras-doencas/">MS — reforço VIP agosto/2026</a>';
      if(id==='rota')h+=' · <a target="_blank" rel="noopener noreferrer" href="https://familia.sbim.org.br/vacinas/vacinas-disponiveis/vacina-rotavirus">SBIm — rotavírus</a>';
      if(id==='dengue_sus')h+=' · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/saude/pt-br/assuntos/noticias/2026/junho/ministerio-da-saude-descontinua-temporariamente-estrategia-atual-de-vacinacao-do-butantan-contra-dengue">MS — situação Butantan-DV</a>';
      h+='</div>';
    }else{
      h+='<div class="vac-criterios-sub">Condição importante</div><p>'+esc(v.c[0])+'</p>';
    }
    return h+'</section>';
  }
  syncCatalog();
  /* Pesquisa por nome, sigla e marca usa as indicações clínicas já mantidas no catálogo. */
  var vaccineAliases={
    vrsAdulto:['VSR adulto','Arexvy','Abrysvo','vírus sincicial respiratório'],
    pnc20_sus:['VPC20','VPC 20','PCV20','Pneumo 20','Prevenar 20'],
    pnc15:['VPC15','VPC 15','PCV15','Vaxneuvance'],
    pnc10:['VPC10','VPC 10','Synflorix'],
    vpp23:['VPP23','Pneumo 23','Pneumovax 23'],
    influenza:['vacina da gripe','gripe'],
    influenza4:['vacina da gripe','gripe'],
    herpes:['Shingrix','vacina zóster','zoster'],
    hpv9:['HPV 9','Gardasil 9','HPV nonavalente'],
    hpv4:['HPV 4','HPV quadrivalente'],
    menb:['Men B','Meningo B','Bexsero'],
    menc:['Men C','Meningo C'],
    menacwy:['Men ACWY','Meningo ACWY','Nimenrix','Menveo'],
    vvsr:['VSR gestante','VSR materna','Abrysvo'],
    nirse:['nirsevimabe','Beyfortus','anticorpo VSR','imunização passiva'],
    rota:['Rotarix','rotavírus'],
    dtpa:['dTpa','tríplice bacteriana acelular'],
    hexa:['hexavalente'],
    dengue_sus:['Qdenga','vacina dengue'],
    dengue_p:['Dengvaxia','vacina dengue'],
    covid:['covid-19','coronavírus']
  };
  function vaccineNorm(s){
    return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  }
  function vaccineMatch(v,term){
    var q=vaccineNorm(term);
    if(!q)return true;
    var words=vaccineNorm([v.nome,v.prot,v.comercial||'',v.fabricante||''].concat(vaccineAliases[v.id]||[]).join(' '));
    return words.includes(q)||words.replace(/\s/g,'').includes(q.replace(/\s/g,''));
  }
  function vaccineNameMatch(v,term){
    var q=vaccineNorm(term);
    if(!q)return true;
    var key=vaccineNorm([v.nome,v.comercial||''].concat(vaccineAliases[v.id]||[]).join(' '));
    return key.includes(q)||key.replace(/\s/g,'').includes(q.replace(/\s/g,''));
  }
  function vaccineOrder(){return catalog.slice().sort(function(a,b){return a.nome.localeCompare(b.nome,'pt-BR');});}
  function vaccineCandidates(term){
    var ordered=vaccineOrder(),nameMatches=ordered.filter(function(v){return vaccineNameMatch(v,term);});
    return nameMatches.length?nameMatches:ordered.filter(function(v){return vaccineMatch(v,term);});
  }
  function vaccineRank(v,q){
    q=vaccineNorm(q);
    var name=vaccineNorm(v.nome),names=(vaccineAliases[v.id]||[]).map(vaccineNorm);
    if(name===q||names.includes(q))return 0;
    if(name.startsWith(q)||names.some(function(x){return x.startsWith(q);}))return 1;
    if(name.includes(q))return 2;
    if(vaccineNorm(v.comercial).includes(q))return 3;
    return 4;
  }
  window.vacBuscarPorNome=function(term){
    return vaccineCandidates(term)
      .sort(function(a,b){return vaccineRank(a,term)-vaccineRank(b,term)||a.nome.localeCompare(b.nome,'pt-BR');});
  };
  var old=window.vacRenderVacinas;
  window.vacRenderVacinas=function(filtro){
    syncCatalog();
    var ordered=vaccineOrder();
    var candidates=new Set(vaccineCandidates(filtro).map(function(v){return v.id;}));
    /* O renderizador oficial permanece a fonte única de fichas. */
    var result=old.call(this,'');
    var box=document.getElementById('vacListaAll'),number=0;
    if(!box)return result;
    box.querySelectorAll(':scope > details.vac-card').forEach(function(card,i){
      var v=ordered[i];
      if(!v||!candidates.has(v.id)){card.remove();return;}
      number++;
      card.id='vac-catalogo-'+v.id;
      card.dataset.vacinaId=v.id;
      if(!rules[v.id])return;
      var body=card.querySelector(':scope > .vac-body');
      var table=body&&body.querySelector('table');
      if(table){
        var popLabel=table.querySelector('tr:first-child td:first-child');
        if(popLabel)popLabel.textContent=v.sus?'População SUS (acesso)':'População da apresentação';
        var schemeLabel=table.querySelector('tr:nth-child(2) td:first-child');
        if(schemeLabel)schemeLabel.textContent=v.sus?'Esquema de referência (ver diferenças acima)':'Esquema da apresentação';
        table.insertAdjacentHTML('beforebegin',infoBox(v.id,false));
        card.dataset.criteriosVacina=v.id;
      }
    });
    if(!number){
      var empty=document.createElement('p');
      empty.className='vac-name-empty';
      empty.textContent='Nenhuma vacina encontrada. Busque por nome, sigla ou marca.';
      box.appendChild(empty);
    }
    var status=document.getElementById('vacBuscaContagem');
    if(status)status.textContent=number+' '+(number===1?'resultado':'resultados');
    return result;
  };
  function vaccineOpen(id){
    var v=catalog.find(function(item){return item.id===id;});
    if(!v)return;
    if(typeof window.vacShowSub==='function')window.vacShowSub('vacinas');
    var catalogInput=document.getElementById('vacBuscaVac');
    if(catalogInput)catalogInput.value=v.nome;
    window.vacRenderVacinas(v.nome);
    var box=document.getElementById('vacListaAll');
    var card=box&&Array.from(box.querySelectorAll('details.vac-card')).find(function(n){return n.dataset.vacinaId===id;});
    if(!card)return;
    if(window.HubPages&&typeof window.HubPages.open==='function')
      window.HubPages.open(card,v.nome,{kind:'conteudo',key:card.id});
    else{card.open=true;card.scrollIntoView({block:'nearest'});}
  }
  function vaccineInstallSearch(){
    var menu=document.getElementById('vac-menu-hub');
    if(!menu||document.getElementById('vacBuscaNomeHome'))return;
    var list=Array.from(menu.children).find(function(el){return el.style&&el.style.flexDirection==='column';});
    if(!list)return;
    var section=document.createElement('section');
    section.className='vac-name-search';
    section.setAttribute('aria-label','Busca de vacinas por nome');
    section.innerHTML='<label for="vacBuscaNomeHome" class="vac-name-label">Buscar vacina pelo nome</label>'
      +'<div class="vac-name-input-wrap">'
      +'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7.5"></circle><path d="m16.6 16.6 4.2 4.2"></path></svg>'
      +'<input id="vacBuscaNomeHome" type="search" autocomplete="off" aria-controls="vacNomeResultados" placeholder="Ex.: VPC20, HPV, Shingrix, influenza">'
      +'</div><div class="vac-name-hint">Nome, sigla ou marca. Consulte indicação, idade, grupos de risco e esquema.</div>'
      +'<div id="vacNomeResultados" class="vac-name-results" role="region" aria-label="Resultados da busca" hidden></div>';
    menu.insertBefore(section,list);
    var styles=[
      '#page-imunizacoes .vac-name-search{border:1px solid #c5dfe7;border-radius:14px;background:linear-gradient(130deg,#f2fafa,#fff);padding:13px;margin:2px 0 15px;box-shadow:0 3px 14px rgba(9,49,74,.045)}',
      '#page-imunizacoes .vac-name-label{display:block;font:750 12.5px Manrope,sans-serif;color:#153f57;margin-bottom:8px}',
      '#page-imunizacoes .vac-name-input-wrap{display:flex;align-items:center;gap:9px;border:1px solid #a7ccd8;border-radius:10px;padding:0 11px;background:#fff;color:#2b7186}',
      '#page-imunizacoes .vac-name-input-wrap:focus-within{border-color:#18728d;outline:2px solid rgba(27,132,159,.17)}',
      '#page-imunizacoes #vacBuscaNomeHome{border:0;outline:0;background:transparent;width:100%;min-width:0;height:43px;font:12.5px Manrope,sans-serif;color:#133b52}',
      '#page-imunizacoes #vacBuscaNomeHome::placeholder{color:#688595}',
      '#page-imunizacoes .vac-name-hint{margin-top:7px;color:#537282;font-size:10.5px;line-height:1.45}',
      '#page-imunizacoes .vac-name-results{display:grid;gap:7px;margin-top:11px}',
      '#page-imunizacoes .vac-name-results[hidden]{display:none}',
      '#page-imunizacoes .vac-name-result{display:flex;gap:10px;align-items:center;justify-content:space-between;width:100%;padding:11px 12px;text-align:left;background:#fff;color:#173e53;border:1px solid #d9e8ed;border-radius:10px;cursor:pointer;font-family:Manrope,sans-serif}',
      '#page-imunizacoes .vac-name-result:hover,#page-imunizacoes .vac-name-result:focus-visible{border-color:#2187a4;background:#f5fbfd;outline:2px solid rgba(33,135,164,.12)}',
      '#page-imunizacoes .vac-name-result-main{display:block;min-width:0;flex:1}',
      '#page-imunizacoes .vac-name-result-title{display:block;font-size:12.5px;font-weight:800;line-height:1.35}',
      '#page-imunizacoes .vac-name-result-note{display:block;margin-top:3px;color:#547182;font-size:10.8px;line-height:1.4;overflow-wrap:anywhere}',
      '#page-imunizacoes .vac-name-result-network{display:block;margin-top:5px;font-size:9.8px;font-weight:700;color:#286a79}',
      '#page-imunizacoes .vac-name-result-arrow{flex:0 0 auto;color:#2d829b;font-size:19px}',
      '#page-imunizacoes .vac-name-empty{grid-column:1/-1;padding:12px;font-size:12px;color:#587384;line-height:1.5}',
      '#page-imunizacoes #vacBuscaContagem{font-size:11px;color:#587384;margin:5px 0 7px}',
      '@media(max-width:480px){#page-imunizacoes .vac-name-search{padding:11px}#page-imunizacoes .vac-name-result{padding:10px}}'
    ];
    var style=document.createElement('style');
    style.id='vac-name-search-style';style.textContent=styles.join('\n');document.head.appendChild(style);
    var input=section.querySelector('input'),results=section.querySelector('#vacNomeResultados');
    function draw(){
      var q=input.value.trim();
      results.replaceChildren();
      if(!q){results.hidden=true;return;}
      results.hidden=false;
      if(vaccineNorm(q).length<2){
        var message=document.createElement('div');message.className='vac-name-empty';
        message.textContent='Digite pelo menos dois caracteres.';results.appendChild(message);return;
      }
      var all=window.vacBuscarPorNome(q),found=all.slice(0,8);
      if(!found.length){
        var missing=document.createElement('div');missing.className='vac-name-empty';
        missing.textContent='Nenhuma correspondência. Tente outro nome ou sigla.';
        results.appendChild(missing);return;
      }
      found.forEach(function(v){
        var btn=document.createElement('button');btn.type='button';btn.className='vac-name-result';btn.dataset.vacSearchId=v.id;
        var main=document.createElement('span');main.className='vac-name-result-main';
        var heading=document.createElement('span');heading.className='vac-name-result-title';heading.textContent=v.nome;
        var note=document.createElement('span');note.className='vac-name-result-note';
        note.textContent=(rules[v.id]&&rules[v.id].w&&rules[v.id].w[0])||v.pop||v.prot||'Indicações detalhadas na ficha.';
        var network=document.createElement('span');network.className='vac-name-result-network';
        network.textContent=(v.id==='nirse'?'Imunização passiva · ':'')+(v.sus&&v.particular?'SUS e rede privada':v.sus?'SUS':v.particular?'Rede privada':'Indicação clínica');
        var arrow=document.createElement('span');arrow.className='vac-name-result-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
        main.append(heading,note,network);btn.append(main,arrow);results.appendChild(btn);
      });
      if(all.length>8){
        var more=document.createElement('div');more.className='vac-name-hint';
        more.textContent='Exibindo os oito primeiros resultados. Refine a pesquisa.';results.appendChild(more);
      }
    }
    input.addEventListener('input',draw);
    input.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'){
        var first=results.querySelector('button[data-vac-search-id]');
        if(first){ev.preventDefault();first.click();}
      }
    });
    results.addEventListener('click',function(ev){
      var button=ev.target.closest('button[data-vac-search-id]');
      if(button&&results.contains(button))vaccineOpen(button.dataset.vacSearchId);
    });
    var catalogInput=document.getElementById('vacBuscaVac');
    if(catalogInput){
      catalogInput.type='search';
      catalogInput.placeholder='Nome, sigla ou marca (ex.: VPC20, HPV, Shingrix)';
      catalogInput.setAttribute('aria-label','Buscar vacina por nome, sigla, marca ou proteção');
      var count=document.createElement('div');count.id='vacBuscaContagem';
      count.setAttribute('role','status');count.setAttribute('aria-live','polite');
      catalogInput.insertAdjacentElement('afterend',count);
    }
  }
  function catalogIdFor(textValue){
    var t=String(textValue||'').toLowerCase();
    var found=[], patterns=[
      [/nirsevimabe|anticorpo contra vsr/, 'nirse'],
      [/v[íi]rus sincicial respirat[óo]rio \(vsr\)/, 'vrsAdulto'],
      [/vsr materno|vvsr materna|vacina materna.*vsr/, 'vvsr'],
      [/pneumoc[óo]cica.*20|vpc20|pneumo 20/, 'pnc20_sus'],
      [/pneumoc[óo]cica.*15|vpc15/, 'pnc15'],
      [/pneumoc[óo]cica.*10|vpc10/, 'pnc10'],
      [/pneumoc[óo]cica.*23|vpp23/, 'vpp23'],
      [/meningoc[óo]cica.*acwy|menacwy/, 'menacwy'],
      [/meningoc[óo]cica.*b(?:\b|$)|menb/, 'menb'],
      [/meningoc[óo]cica.*c(?:\b|$)|menc/, 'menc'],
      [/rotav[íi]rus/, 'rota'],
      [/bcg/, 'bcg'],
      [/hpv9|hpv nonavalente/, 'hpv9'],
      [/hpv4|hpv quadrivalente/, 'hpv4'],
      [/\bhpv\b/, 'hpv4'],
      [/q[d]?enga|dengue/, 'dengue_sus'],
      [/hepatite a e b|hepatite a \+ b/, 'hepa_p'],
      [/hepatite a/, 'hepa'],
      [/hepatite b/, 'hepb'],
      [/hexa(valente)?/, 'hexa'],
      [/pentavalente|penta\b/, 'penta'],
      [/d[t]pa/, 'dtpa'],
      [/\bdt\b/, 'dt'],
      [/febre amarela/, 'fa'],
      [/tr[íi]plice viral/, 'triplice'],
      [/tetraviral/, 'tetraviral_p'],
      [/varicela/, 'varicela'],
      [/poliomielite|\bvip\b/, 'vip'],
      [/influenza/, 'influenza'],
      [/covid/i, 'covid'],
      [/herpes.z[óo]ster/, 'herpes'],
      [/raiva/, 'raiva'],
      [/febre tifoide/, 'febretif'],
      [/\bhib\b/, 'hib_crie'],
      [/\bdtp\b/, 'dtp']
    ];
    for(var j=0;j<patterns.length;j++){
      if(patterns[j][0].test(t)&&found.indexOf(patterns[j][1])<0)found.push(patterns[j][1]);
    }
    return found;
  }
  var rsvAdulto={
    w:['A partir de 70 anos: rotina independentemente de comorbidades.',
       'A partir de 18 anos: doenças respiratórias ou cardiovasculares crônicas clinicamente relevantes, especialmente asma moderada/grave, DPOC, insuficiência cardíaca e doença coronariana; imunodeficiência moderada/grave e TCTH.',
       'Diabetes mellitus, nefropatia e hepatopatia: recomendada a partir de 50 anos; entre 18 e 49 anos a critério médico.'],
    c:['Asma leve, hipertensão arterial isolada e profissão de saúde, isoladamente, não configuram indicação automática antecipada.',
       'Priorizar pacientes frágeis, acamados ou residentes em instituições de longa permanência. Avaliar gravidade e risco de descompensação.',
       'Arexvy®: Anvisa ampliou registro para adultos a partir de 18 anos em 13/04/2026. Abrysvo®: adultos ≥60 anos e 18–59 anos com alto risco de doença grave por VSR. Registro sanitário não equivale a recomendação universal SBIm.',
       'Uma dose de 0,5 mL IM, qualquer época do ano. Não há reforço periódico estabelecido. Não confundir com vacina materna ou nirsevimabe.'],
    s:'SBIm'
  };
  var rsvRows=[
    ['Asma moderada/grave; DPOC (incluindo enfisema)','≥18 anos — recomendada','SBIm: doenças respiratórias clinicamente relevantes.'],
    ['Insuficiência cardíaca; doença arterial coronariana','≥18 anos — recomendada','SBIm: doenças cardiovasculares clinicamente relevantes.'],
    ['Imunodeficiência moderada/grave; transplante de células-tronco hematopoéticas','≥18 anos — recomendada','SBIm: avaliar tipo de imunodeficiência e momento do transplante.'],
    ['Diabetes mellitus tipo 1 ou 2','≥50 anos — recomendada; 18–49 anos — critério médico','SBIm: não exige complicações a partir de 50 anos.'],
    ['Doença renal crônica / nefropatia','≥50 anos — recomendada; 18–49 anos — critério médico','SBIm: avaliar estágio, especialmente diálise e doença renal avançada.'],
    ['Hepatopatia crônica','≥50 anos — recomendada; 18–49 anos — critério médico','SBIm: avaliar gravidade, especialmente cirrose.'],
    ['Obesidade, fragilidade, acamados, residentes em ILPI','18–69 anos — avaliação por risco e idade','SBIm: condições de risco; obesidade grave (IMC ≥40) é exemplo objetivo do CDC, não corte obrigatório SBIm.'],
    ['Bronquiectasias clinicamente relevantes, fibrose cística, doença pulmonar intersticial; cardiopatia congênita relevante','≥18 anos — avaliar enquadramento na categoria cardiopulmonar SBIm','Exemplos clínicos complementares; não são lista nominal exaustiva da SBIm.'],
    ['Doença neuromuscular com fraqueza respiratória/disfagia, doença falciforme, talassemia','Avaliar individualmente conforme idade, risco e bula','Exemplos complementares CDC/Anvisa; não atribuir indicação automática desde 18 anos à SBIm.'],
    ['IDCV, imunodeficiências combinadas, neoplasias hematológicas, transplante de órgão sólido, HIV com imunossupressão relevante, tratamento imunossupressor significativo','≥18 anos se imunodeficiência moderada/grave','Exemplos clínicos; avaliar intensidade da imunossupressão. Biológico ou doença autoimune isoladamente não define imunossupressão moderada/grave.']
  ];
  function rsvDetails(){
    return '<div class="vac-criterios-sub">Doenças específicas e idade para indicação</div><div style="display:grid;gap:8px">'+rsvRows.map(function(row){
      return '<div style="padding:9px;border:1px solid #c9dce5;border-radius:8px;background:white;overflow-wrap:anywhere"><div style="font-weight:800;color:#173954">'+esc(row[0])+'</div><div style="font-weight:700;color:#14617d;margin:3px 0">'+esc(row[1])+'</div><div>'+esc(row[2])+'</div></div>';
    }).join('')+'</div><div class="vac-criterios-source">Referências específicas: <a target="_blank" rel="noopener noreferrer" href="https://sbim.org.br/images/calend-vacinacao-pacientes-especiais-2026-27-260617a.pdf_2026-06-24.pdf">SBIm Pacientes Especiais 2026/2027 (diabetes, cardiopatias/pneumopatias, hepatopatias, nefropatias e imunodeficiências)</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/novos-medicamentos-e-indicacoes/arexvy">Anvisa Arexvy</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/novos-medicamentos-e-indicacoes/abrysvo-r-vacina-do-virus-sincicial-respiratorio-a-e-b-recombinante-ampliacao-de-uso">Anvisa Abrysvo</a> · <a target="_blank" rel="noopener noreferrer" href="https://www.cdc.gov/rsv/hcp/vaccine-clinical-guidance/adults.html">CDC — exemplos complementares de risco (faixas etárias próprias dos EUA)</a>.</div>';
  }
  rules.vrsAdulto=rsvAdulto;
  if(!catalog.some(function(v){return v.id==='vrsAdulto';})) catalog.push({
    id:'vrsAdulto',sus:0,particular:1,nome:'VSR — vacinação de adultos',comercial:'Arexvy® / Abrysvo®',fabricante:'GSK / Pfizer',
    prot:'Doença respiratória pelo vírus sincicial respiratório',tipo:'Inativada (proteína recombinante)',
    pop:'≥70 anos: rotina. 18–69 anos: indicação por doença, idade, gravidade e bula (ver quadro acima).',
    esq:'Dose única intramuscular; revacinação periódica não estabelecida.',
    obs:'Não confundir com vacina materna. Conferir faixa etária licenciada de cada produto e indicação individual.',
    sbim:'https://familia.sbim.org.br/doencas/virus-sincicial-respiratorio-vsr'
  });
  function enhanceCalendars(){
    var root=document.getElementById('vacNativeContent');if(!root)return;
    root.querySelectorAll('.vac-nat-item').forEach(function(item){
      if(item.dataset.vacCriteriaEnhanced==='1')return;
      item.dataset.vacCriteriaEnhanced='1';
      var summary=item.querySelector(':scope > summary');
      var content=item.querySelector(':scope > .vac-nat-detail');
      if(!summary||!content)return;
      var title=summary.querySelector('.vac-nat-item-title');
      var main=title?title.textContent:(summary.firstChild&&summary.firstChild.nodeType===3?summary.firstChild.nodeValue:'');
      var subtitle=summary.querySelector('.vac-nat-item-subtitle')||summary.querySelector('span');
      var keyString=main+' '+(subtitle?subtitle.textContent:'');
      var ids=catalogIdFor(keyString);
      if(!ids.length)return;
      var html=ids.map(function(id){return infoBox(id,true);}).filter(Boolean).join('');
      if(html){
        var wrap=document.createElement('details');
        wrap.className='vac-criterios-calendar';
        wrap.innerHTML='<summary>Quais critérios determinam a indicação?</summary>'+html
          +'<div class="vac-criterios-source">Base técnica: <a target="_blank" rel="noopener noreferrer" href="'+PNI+'">PNI 2026</a> · <a target="_blank" rel="noopener noreferrer" href="'+SBIM+'">SBIm 2026/2027</a></div>';
        content.appendChild(wrap);
      }
    });
  }
  var style=document.createElement('style');
  style.id='vacinas-criterios-estilo';
  style.textContent='.vac-criterios-box{margin:9px 0 12px;padding:10px 11px;background:#f2f9fc;border:1px solid #bfdce9;border-radius:11px;color:#173954;line-height:1.48;font-size:11.5px;overflow-wrap:anywhere}.vac-criterios-title{font-size:12.3px;font-weight:800;color:#075d79;margin-bottom:7px}.vac-criterios-sub{font-weight:750;color:#154d62;margin:6px 0 4px}.vac-criterios-box ul{padding-left:17px;margin:3px 0 7px}.vac-criterios-box li{margin:4px 0}.vac-criterios-box p{margin:4px 0}.vac-criterios-source{border-top:1px solid #d8e5ec;padding-top:7px;margin-top:8px;font-size:10px;line-height:1.55;color:#456377}.vac-criterios-source a{color:#126388;text-decoration:underline}.vac-criterios-calendar{margin:10px 0 4px;background:#f7fbfd;border:1px solid #c6dde8;border-radius:10px;padding:8px}.vac-criterios-calendar>summary{font-size:12px;font-weight:750;color:#14617d;cursor:pointer;padding:2px 1px}.vac-criterios-calendar>.vac-criterios-box{margin-top:8px}';
  document.head.appendChild(style);
  function start(){
    enhanceCalendars();
    vaccineInstallSearch();
    var root=document.getElementById('vacNativeContent');
    if(root){
      var scheduled=false;
      new MutationObserver(function(){
        if(scheduled)return;
        scheduled=true;
        Promise.resolve().then(function(){scheduled=false;enhanceCalendars();});
      }).observe(root,{childList:true,subtree:false});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();

})();
