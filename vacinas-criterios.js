/* Critérios objetivos de indicação - vacinas e imunização passiva. Referências oficiais, revisão 13/11/2026. */
(function(){

  'use strict';
  var catalog=window.VAC_CATALOGO;
  if(!Array.isArray(catalog)||typeof window.vacRenderVacinas!=='function')return;
  var rules={"bcg":{"w":["Rotina: recém-nascidos e não vacinados até 4 anos, 11 meses e 29 dias.","Situação especial: contato domiciliar de pessoa com hanseníase, sem sinais clínicos da doença, após avaliação do número de cicatrizes/doses prévias."],"c":["Prematuro ou recém-nascido com peso inferior a 2.000 g: adiar até atingir 2.000 g.","Imunodeficiência, imunossupressão materna transplacentária e uso de imunossupressores exigem avaliação; BCG é vacina viva.","A partir dos 5 anos: não vacinar, exceto contatos de hanseníase elegíveis; nos contatos com HIV nessa faixa etária, contraindicar."],"s":"PNI"},"hepb":{"w":["Rotina universal desde o nascimento; se não vacinado ou esquema incompleto, realizar ou completar as doses.","Gestante suscetível ou sem comprovação de esquema completo: atualizar vacinação."],"c":["Mãe HBsAg positiva ou estado desconhecido no parto: verificar indicação de imunoglobulina anti-hepatite B e vacinação imediata conforme protocolo.","Prematuro com baixo peso/idade gestacional específica pode precisar de quatro doses; verificar nascimento e calendário.","Anti-HBs pós-vacinal é indicado em grupos específicos, como profissionais de saúde, diálise, imunocomprometidos e recém-nascidos expostos."],"s":"PNI"},"penta":{"w":["PNI: série primária infantil aos 2, 4 e 6 meses; resgate se houver doses em atraso."],"c":["Confirmar idade, doses válidas e intervalos; reforços com DTP não são substituídos automaticamente pela pentavalente.","História de encefalopatia temporariamente associada a componente pertussis ou contraindicação específica requer avaliação especializada."],"s":"PNI"},"vip":{"w":["Rotina infantil do PNI aos 2, 4 e 6 meses, com reforço aos 15 meses.","Indicação adicional em viajantes e pessoas com risco específico de exposição ao poliovírus, conforme recomendação de viagem/ocupação."],"c":["Definir necessidade de doses por histórico de VIP/VOP e viagem; a apresentação isolada não deve ser presumida como disponível no privado."],"s":"PNI"},"rota":{"w":["PNI: rotina aos 2 e 4 meses; também pode ser realizada em atraso dentro da janela etária ampliada."],"c":["1ª dose: de 1 mês e 15 dias até 11 meses e 29 dias; 2ª dose: de 3 meses e 15 dias até 23 meses e 29 dias; intervalo usual de 60 dias (mínimo excepcional de 30 dias).","História de invaginação intestinal, imunodeficiência combinada grave ou contraindicação específica impede a aplicação."],"s":"PNI"},"pnc10":{"w":["Rotina infantil do SUS durante transição de produtos; esquema de rotina 2+1 conforme idade e vacinação já recebida."],"c":["Se a criança tem comorbidade elegível, considerar esquema da VPC20 pela RIE, distinto do calendário infantil de rotina.","Não presumir que uma dose anterior de VPC10 equivale a uma de VPC20 em todos os esquemas de transição."],"s":"RIE"},"pnc20_sus":{"w":["PNI: rotina infantil (2, 4 e 12 meses), elegibilidade especial pela RIE, indígenas e grupos etários com oferta específica.","SBIm: recomendação de rotina a partir de 50 anos; antecipar antes dessa idade quando houver condições de risco."],"c":["RIE — indicações clínicas: HIV; câncer em atividade; transplante de órgão ou de células-tronco; CAR-T; asplenia; erro inato da imunidade; fibrose cística; fístula liquórica/derivação ventricular; imunossupressão terapêutica; implante coclear; nefropatia/hemodiálise/síndrome nefrótica; pneumopatia crônica (exceto asma leve/intermitente); asma persistente moderada/grave; cardiopatia; hepatopatia; doença neurológica incapacitante; trissomias; diabetes; doença de depósito; prematuridade até 23 meses.","Histórico modifica conduta: VPC10/13 prévias, VPP23 (uma ou duas doses), TCTH/CAR-T e intervalos exigem o fluxograma específico; após VPC20 não administrar VPP23.","SUS e SBIm têm regras distintas para quem recebeu duas VPP23; não equiparar recomendação clínica a acesso público."],"s":"RIE"},"menc":{"w":["PNI: duas doses na infância aos 3 e 5 meses; aos 12 meses, o reforço é MenACWY."],"c":["Asplenia, deficiência de complemento, uso de inibidores do complemento, surtos e outras condições de risco exigem avaliação do esquema meningocócico ampliado.","MenC não substitui MenACWY e MenB nos grupos de alto risco."],"s":"PNI"},"menacwy":{"w":["PNI: reforço aos 12 meses e dose dos 11 aos 14 anos, conforme histórico.","SBIm: calendário e reforços por faixa etária; pode ser ampliado em condições especiais."],"c":["Alto risco: asplenia funcional/anatômica, deficiência de complemento, tratamento com inibidores do complemento, exposição laboratorial, surto e algumas condições imunológicas.","Confirmar idade de início, doses já recebidas e intervalo/reforços; MenACWY não cobre sorogrupo B."],"s":"PNI"},"influenza":{"w":["SBIm: anualmente a partir de 6 meses.","PNI: oferta de rotina e estratégias especiais aos grupos estabelecidos pelo Ministério da Saúde (crianças pequenas, gestantes, idosos e outros prioritários)."],"c":["Comorbidades prioritárias incluem, por exemplo, pneumopatias crônicas (incluindo asma), cardiopatias, diabetes, doenças renais/hepáticas/neurológicas e imunossupressão; também há grupos ocupacionais e sociais.","Na primeira vacinação de criança menor de 9 anos, verificar necessidade de duas doses com intervalo mínimo de quatro semanas.","A composição trivalente do PNI em 2026 não deve ser confundida com apresentações privadas."],"s":"PNI"},"covid":{"w":["Seguir a faixa etária, grupo prioritário, produto disponível e esquema vigente do PNI."],"c":["A indicação de doses periódicas é distinta para idosos, gestantes, imunocomprometidos, crianças pequenas e demais grupos de risco.","Imunossupressão, idade, doses anteriores, infecção recente e intervalo desde a última dose definem esquema; consultar normativa atualizada antes de prescrever.","Não generalizar um número fixo de reforços para todas as idades e vacinas."],"s":"PNI"},"fa":{"w":["Rotina pediátrica conforme PNI; para outros grupos, avaliar histórico vacinal e situação epidemiológica.","Viajantes para área de risco: verificar necessidade de vacinação e prazo mínimo antes da viagem."],"c":["Aos 6–8 meses, somente em situação excepcional de circulação viral confirmada após avaliação de risco-benefício.","Gestação, lactação em situações definidas, ≥60 anos e imunossupressão exigem avaliação ou contraindicam vacina viva, segundo a condição.","Histórico de doses antes dos 5 anos e exposição atual modificam recomendações de reforço; verificar PNI e SBIm separadamente."],"s":"PNI"},"triplice":{"w":["Rotina infantil aos 12 e 15 meses; adolescentes e adultos devem ter doses documentadas conforme faixa etária e risco."],"c":["Trabalhadores de saúde e pessoas em situação de surto/viagem podem ter exigência de duas doses válidas.","Gestantes e pessoas com imunossupressão relevante não devem receber vacina viva; dose antes dos 12 meses, quando indicada em surto, não conta para a rotina."],"s":"PNI"},"varicela":{"w":["Crianças, adolescentes e adultos suscetíveis, considerando história comprovada de vacinação/doença e calendário aplicável.","Pessoas com risco ocupacional ou convivência com vulneráveis podem exigir priorização quando suscetíveis."],"c":["Gestação e imunossupressão significativa contraindicam vacina viva; revisar uso recente de imunoglobulina e tempo de espera.","Intervalos entre as duas doses dependem da idade e do produto; diferenciar oferta PNI e recomendação SBIm."],"s":"PNI"},"dtp":{"w":["Reforço da infância, normalmente aos 15 meses e 4 anos, após esquema com pentavalente."],"c":["A partir dos 7 anos, usar apresentações indicadas para adolescentes/adultos (dT/dTpa).","Histórico de reações graves ao componente pertussis e esquema anterior orienta substituições."],"s":"PNI"},"hepa":{"w":["PNI: uma dose na rotina infantil aos 15 meses; SBIm recomenda duas doses na infância.","Esquemas especiais: hepatopatia crônica, coinfecções, imunodeficiência, transplantados e outras condições conforme CRIE/RIE."],"c":["Susceptibilidade, idade, exposições epidemiológicas e histórico vacinal definem necessidade; grupos especiais geralmente recebem esquema de duas doses.","Na profilaxia pós-exposição, considerar intervalo desde contato, idade e indicação eventual de imunoglobulina."],"s":"PNI"},"vpp23":{"w":["Uso em esquemas especiais ou de transição conforme indicações da RIE e histórico pneumocócico; não é rotina universal do idoso."],"c":["Após VPC20 não aplicar VPP23.","Se já recebeu uma ou duas VPP23, verificar intervalos e orientação específica da NT MS 52/2026 e da SBIm; as recomendações divergem em alguns cenários.","Não iniciar esquema novo com VPP23 isolada quando houver indicação preferencial de vacina conjugada."],"s":"RIE"},"dt":{"w":["A partir de 7 anos para completar ou atualizar proteção contra difteria/tétano, conforme registro."],"c":["Sem comprovação de esquema completo: completar três doses; esquema completo: reforço a cada dez anos.","Ferimentos com risco de tétano exigem avaliação da data da última dose, número de doses anteriores e possível imunoglobulina antitetânica.","Gestação e exposição ocupacional podem justificar dTpa em lugar de dT."],"s":"PNI"},"dtpa":{"w":["PNI: uma dose a cada gestação a partir de 20 semanas; outras indicações ocupacionais previstas na normativa.","SBIm: reforço/atualização na adolescência e idade adulta, especialmente para contactantes de recém-nascidos."],"c":["Gestante: aplicar em cada gravidez mesmo com dose anterior.","Trabalhadores da saúde que atendem recém-nascidos/lactentes e outros grupos expostos seguem regras específicas.","Se esquema básico contra tétano estiver incompleto, dTpa isolada não substitui toda a série primária."],"s":"PNI"},"hpv4":{"w":["PNI: dose única de rotina para meninas e meninos de 9 a 14 anos.","Indicação especial no SUS para imunodeprimidos, vítimas de violência sexual, usuários de PrEP, pessoas com papilomatose respiratória recorrente e grupos previstos em norma."],"c":["Imunocomprometidos elegíveis (HIV, transplante, câncer): esquema de três doses; conferir faixa etária da indicação.","Violência sexual: de 9 a 14 anos, duas doses; 15 a 45 anos, três doses. PrEP de 15 a 45 anos e papilomatose respiratória recorrente têm esquemas específicos.","Aplicação fora da faixa etária rotineira não significa elegibilidade universal no SUS."],"s":"HPV"},"dengue_sus":{"w":["PNI: Qdenga de 10 a 14 anos dentro da estratégia e da disponibilidade local; na rede privada, usar faixa etária licenciada para o produto.","O histórico de dengue prévia não exige sorologia positiva para Qdenga."],"c":["Qdenga é vacina viva: contraindicar em gestação e imunossupressão relevante.","Aplicar duas doses com intervalo de três meses; após dengue recente, avaliar intervalo recomendado.","Não confundir Qdenga com Dengvaxia, que exige infecção prévia comprovada."],"s":"PNI"},"vvsr":{"w":["PNI: uma dose da vacina materna contra VSR em cada gestação a partir de 28 semanas, independentemente da idade materna."],"c":["A janela da rede privada pode variar com bula e recomendação SBIm; não importar automaticamente a janela privada para o SUS.","Se a gestante já recebeu em gestação anterior, verificar a recomendação vigente: no PNI de 2026 a orientação é uma dose por gestação."],"s":"PNI"},"raiva":{"w":["Pré-exposição: pessoas com risco ocupacional ou frequente exposição a animais potencialmente infectados (veterinários, laboratório, manejo de fauna e afins).","Pós-exposição: avaliar qualquer mordedura, arranhadura, lambedura em mucosa ou pele lesionada por animal de risco."],"c":["Decisão pós-exposição depende da espécie animal, possibilidade de observação por dez dias, condição do animal, gravidade/local da lesão e imunização prévia.","Conforme categoria de exposição, avaliar imunoglobulina/soro antirrábico além da vacina.","Imunocomprometidos podem necessitar de conduta e controle de resposta específicos."],"s":"PNI"},"hib_crie":{"w":["Rotina infantil pelo componente Hib da pentavalente/combinações.","Doses adicionais ou resgate para grupos elegíveis na RIE/CRIE, conforme idade e vacinação anterior."],"c":["Exemplos de grupos de risco: asplenia, implante coclear, fístula liquórica, transplante e imunodeficiências selecionadas.","Verificar se o paciente já recebeu Hib em vacina combinada; a indicação especial não significa reforço indiscriminado para todo adulto."],"s":"PNI"},"hexa":{"w":["Lactentes dentro da faixa etária aprovada para a apresentação; alternativa à combinação de componentes da rotina."],"c":["Escolha segundo idade mínima, fabricante, disponibilidade e doses anteriores; evitar duplicar antígenos em esquemas mistos.","Prematuridade e condições clínicas podem exigir ajustes/monitorização, sem correção da idade cronológica."],"s":"SBIm"},"pnc15":{"w":["SBIm: opção conjugada para crianças desde lactência e adultos em situações selecionadas."],"c":["Em adultos com risco, se VPC15 for usada em vez de VPC20, avaliar esquema sequencial com VPP23, com intervalos por condição.","Histórico de VPC10/13/15/VPP23 altera necessidade de doses; não copiar automaticamente esquema de VPC20.","Diferenciar recomendação clínica do acesso específico via SUS/RIE."],"s":"SBIm"},"menb":{"w":["SBIm: vacinação na infância/adolescência segundo faixa etária e produto; pode ser recomendada também em adultos com risco aumentado."],"c":["Risco elevado: asplenia, deficiência de complemento, uso de inibidores de complemento, exposição laboratorial e surtos; HIV e outras condições exigem avaliação individual.","Idade de início, número de doses e reforços dependem de Bexsero ou Trumenba; não são intercambiáveis.","MenB não substitui MenACWY."],"s":"SBIm"},"tetraviral_p":{"w":["Crianças na faixa etária licenciada que precisam de proteção contra sarampo, caxumba, rubéola e varicela."],"c":["Histórico prévio das vacinas componentes determina número de doses; evitar duplicação indevida.","Por ser vacina viva, contraindicar em gestantes e imunossupressão significativa; na primeira dose da infância avaliar a alternativa de componentes separados e risco de convulsão febril."],"s":"SBIm"},"hepa_p":{"w":["Pessoa de faixa etária autorizada que necessita simultaneamente completar proteção para hepatites A e B."],"c":["Viajantes, pessoas com exposição ocupacional/sexual ou hepatopatia crônica podem ter indicação das duas vacinas; conferir quais doses já foram recebidas.","Esquema acelerado só nas situações e faixas etárias aprovadas para a apresentação, com dose adicional posterior."],"s":"SBIm"},"hpv9":{"w":["SBIm: indicação na faixa etária licenciada, geralmente 9 a 45 anos, conforme risco e decisão clínica.","Pode ser recomendada em circunstâncias especiais de imunossupressão, seguindo bula e orientações de sociedade."],"c":["Início antes dos 15 anos, sem imunossupressão: geralmente duas doses; a partir de 15 anos ou com imunossupressão: três doses.","PNI de rotina usa HPV4 e tem critérios de acesso distintos; HPV9 privada não é oferta universal no SUS."],"s":"SBIm"},"influenza4":{"w":["Vacinação anual conforme indicação clínica e faixa etária aprovada para a formulação; SBIm recomenda desde os seis meses."],"c":["Em criança menor de nove anos na primeira vacinação, checar necessidade de duas doses.","Idosos, gestantes, pessoas com comorbidades e imunossuprimidos têm maior prioridade clínica.","Conferir a composição e o registro da vacina da temporada; não presumir que formulação quadrivalente esteja disponível em qualquer ano."],"s":"SBIm"},"herpes":{"w":["Rotina: adultos a partir de 50 anos.","Antecipação: a partir de 18 anos em imunocomprometidos ou pessoas com risco aumentado. SBIm 2026/27: considerar individualmente em cardiopatia/pneumopatia crônica e diabetes; não é indicação automática por asma leve ou ocupação."],"c":["Avaliar imunodeficiência primária/secundária, neoplasia hematológica, transplante, HIV e terapias imunossupressoras.","Duas doses (0 e 2 meses; janela de 2–6 meses); intervalo de 1–2 meses se imunossuprimido e houver necessidade de antecipar. Episódio anterior de zóster não exclui vacinação."],"s":"SBIm"},"nirse":{"w":["Imunização passiva, não vacina. Na estratégia especial do SUS: prematuros com idade gestacional até 36 semanas e 6 dias e menos de seis meses; ou menores de 24 meses com condições de risco definidas."],"c":["Condições de risco: cardiopatia congênita com repercussão, broncodisplasia, imunocomprometimento grave, fibrose cística, síndrome de Down, doença neuromuscular ou anomalia congênita das vias aéreas.","Peso ao nascer não exclui prematuro elegível; no SUS, esquema e acesso dependem da temporada e do protocolo vigente.","Não confundir com vacina materna VSR: são estratégias diferentes, a elegibilidade deve ser conferida."],"s":"NIRSE"},"febretif":{"w":["Viajantes para áreas de transmissão de febre tifoide, conforme destino, duração e padrão de exposição a água/alimentos.","Profissionais de laboratório com risco de contato com Salmonella Typhi."],"c":["Apresentação oral viva versus injetável inativada têm idade mínima, esquemas e contraindicações diferentes.","Vacina oral viva não é opção adequada em imunossupressão relevante; verificar produto efetivamente disponível e bula."],"s":"SBIm"},"dengue_p":{"w":["Dengvaxia: somente pessoas na faixa etária aprovada (em geral 9 a 45 anos) com infecção prévia por dengue confirmada por teste apropriado."],"c":["Não administrar a soronegativos ou sem confirmação laboratorial válida de infecção anterior, devido ao risco aumentado de dengue grave.","Vacina viva: gestação e imunossupressão relevante contraindicam; não intercambiar com Qdenga."],"s":"SBIm"}};
  var refs={"PNI":["Ministério da Saúde · IN 2026","https://www.gov.br/saude/pt-br/vacinacao/publicacoes/instrucao-normativa-que-instrui-o-calendario-nacional-de-vacinacao-2026.pdf/view"],"RIE":["Ministério da Saúde · NT 52/2026","https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-no-52-2026-cgici-dpni-svsa-ms.pdf/view"],"SBIm":["SBIm · Calendários 2026/2027","https://www.sbim.org.br/calendario-de-vacinacao"],"HPV":["Ministério da Saúde · HPV","https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/h/hpv"],"NIRSE":["Ministério da Saúde · Guia nirsevimabe 2026","https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2026/guia-de-estrategia-contra-virus-sincicial-para-criancas-prematuras.pdf"]};
  var PNI=refs.PNI[1],SBIM=refs.SBIm[1];
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[x];});}
  function syncCatalog(){
    catalog.forEach(function(v){
      if(v.id==='rota'){
        v.pop='Crianças até 23 meses e 29 dias; a primeira dose só pode ser iniciada até 11 meses e 29 dias (PNI 2026).';
        v.esq='Rotarix/VRH no PNI: 2 doses aos 2 e 4 meses; resgate: 1ª de 1m15d até 11m29d, 2ª de 3m15d até 23m29d; intervalo usual 60 dias (mínimo excepcional 30 dias).';
        v.obs='Não iniciar após 11m29d nem administrar a segunda dose após 23m29d; verificar histórico de invaginação intestinal e imunodeficiência combinada grave.';
      }
      if(v.id==='nirse'){
        v.sus=1;
        v.pop='SUS/RIE: prematuros ≤36 semanas e 6 dias com menos de 6 meses; menores de 24 meses com condições clínicas de risco definidas. Na rede particular, avaliar bula e recomendação clínica.';
        v.obs='Anticorpo monoclonal de imunização passiva (não é vacina). No SUS desde 2026 para grupos elegíveis conforme protocolo específico.';
      }
      if(v.id==='dtpa'){
        v.pop='PNI: gestantes a partir de 20 semanas em cada gestação e grupos ocupacionais específicos; SBIm: adolescentes e adultos segundo recomendações de reforço.';
      }
    });
  }
  function infoBox(id,compact){
    var v=rules[id]; if(!v)return '';
    var h='<section class="vac-criterios-box" aria-label="Critérios de indicação">';
    h+='<div class="vac-criterios-title">Critérios objetivos de indicação</div>';
    h+='<div class="vac-criterios-sub">Quem é elegível ou quando indicar</div>';
    h+='<ul>'+v.w.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>';
    if(!compact){
      h+='<div class="vac-criterios-sub">Condições que mudam a indicação ou o esquema</div>';
      h+='<ul>'+v.c.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul>';
      var ref=refs[v.s]||refs.SBIm;
      h+='<div class="vac-criterios-source">Referência: <a target="_blank" rel="noopener noreferrer" href="'+esc(ref[1])+'">'+esc(ref[0])+'</a>';
      if(v.s!=='PNI'&&v.s!=='SBIm') h+=' · <a target="_blank" rel="noopener noreferrer" href="'+esc(PNI)+'">PNI 2026</a>';
      if(v.s!=='SBIm') h+=' · <a target="_blank" rel="noopener noreferrer" href="'+esc(SBIM)+'">SBIm</a>';
      h+='</div>';
    }else{
      h+='<div class="vac-criterios-sub">Condição importante</div><p>'+esc(v.c[0])+'</p>';
    }
    return h+'</section>';
  }
  syncCatalog();
  /* Pesquisa por nome, sigla e marca usa as indicações clínicas já mantidas no catálogo. */
  var vaccineAliases={
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
    w:['SBIm 2026/27: rotina a partir de 70 anos; a partir de 18 anos em condições de risco clinicamente relevantes, especialmente cardiopatia e pneumopatia crônicas, incluindo asma moderada/grave. Outras comorbidades exigem avaliação individual por idade e risco.'],
    c:['Avaliar doença pulmonar e cardíaca crônica, diabetes com complicações, imunossupressão, fragilidade e institucionalização. Não confundir com vacina VSR materna ou nirsevimabe.'],
    s:'SBIm'
  };
  rules.vrsAdulto=rsvAdulto;
  function enhanceCalendars(){
    var root=document.getElementById('vacNativeContent');if(!root)return;
    root.querySelectorAll('.vac-nat-item').forEach(function(item){
      if(item.dataset.vacCriteriaEnhanced==='1')return;
      item.dataset.vacCriteriaEnhanced='1';
      var summary=item.querySelector(':scope > summary');
      var content=item.querySelector(':scope > .vac-nat-detail');
      if(!summary||!content)return;
      var main=summary.firstChild&&summary.firstChild.nodeType===3?summary.firstChild.nodeValue:'';
      var subtitle=summary.querySelector('span');
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
