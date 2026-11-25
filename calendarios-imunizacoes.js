/* ═════════════════════════════════════════════════════════════
   CENTRAL NATIVA DE CALENDÁRIOS — 09/11/2026
   SBIm e PNI em fluxos separados. Nenhum PDF é carregado em iframe.
   Os documentos originais permanecem disponíveis apenas como
   referência, no rodapé do conteúdo incorporado.
═════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var get=function(id){return document.getElementById(id);};
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
  var DOC_SBIM=[
    ['prematuro','Prematuros','Vacinação pela idade cronológica; cuidados neonatais','Faixas etárias','👶','https://sbim.org.br/images/livreto-Calend-SBIm-2026-27-260619a.pdf_2026-06-19.pdf#page=4'],
    ['crianca','Crianças','Nascimento até antes dos 10 anos','Faixas etárias','🧸','https://sbim.org.br/images/crianca-Calend-SBIm-2026-27-260619.pdf_2026-06-19.pdf'],
    ['adolescente','Adolescentes','10 a 19 anos','Faixas etárias','🎒','https://sbim.org.br/images/adolescente-Calend-SBIm-2026-27-260619.pdf_2026-06-19.pdf'],
    ['adulto','Adultos','20 a 59 anos','Faixas etárias','🧑','https://sbim.org.br/images/livreto-Calend-SBIm-2026-27-260619a.pdf_2026-06-19.pdf#page=7'],
    ['idoso','Idosos','A partir de 60 anos','Faixas etárias','🧓','https://sbim.org.br/images/livreto-Calend-SBIm-2026-27-260619a.pdf_2026-06-19.pdf#page=9'],
    ['gestante','Gestantes','Gestação e puerpério','Grupos e situações','🤰','https://sbim.org.br/images/gestante-Calend-SBIm-2026-27-260619.pdf_2026-06-19.pdf'],
    ['ocupacional','Ocupacional','Exposição profissional e vacinação do trabalhador','Grupos e situações','🩺','https://sbim.org.br/images/ocupacional-Calend-SBIm-2026-27-260202.pdf_2026-02-02.pdf'],
    ['especiais','Pacientes especiais','Imunodeficiências, imunossupressão e comorbidades','Grupos e situações','🛡️','https://sbim.org.br/images/calend-vacinacao-pacientes-especiais-2026-27-260617a.pdf_2026-06-24.pdf'],
    ['atraso','Recuperação de doses em atraso','Idades mínimas, intervalos e comentários completos','Grupos e situações','⏱️','https://sbim.org.br/images/guia-rapido-sbim-idadesminimas-intervalosminimos-recuperacao.pdf.pdf_2026-03-11.pdf'],
    ['resumo-infantil','Nascimento aos 19 anos','Visão integrada da infância e adolescência','Visões integradas','📋','https://sbim.org.br/images/calend-sbim-0-100-2026-27-260422.pdf_2026-04-22.pdf'],
    ['resumo-adulto','20 anos a 60+','Adultos, idosos e gestantes','Visões integradas','📋','https://sbim.org.br/images/calend-20-60mais-2026-27-260422-web.pdf_2026-04-22.pdf'],
    ['unico','Calendário único — todas as idades','Resumo longitudinal de 0 a 100+','Visões integradas','🗂️','https://sbim.org.br/images/calend-sbim-0-100-2026-27-260422.pdf_2026-04-22.pdf'],
    ['livreto','Livreto SBIm 2026/2027','Índice clínico por população e faixa etária','Visões integradas','📚','https://sbim.org.br/images/livreto-Calend-SBIm-2026-27-260619a.pdf_2026-06-19.pdf']
  ];
  var GOV='https://www.gov.br/saude/pt-br/vacinacao/';
  var DOC_PNI=[
    ['crianca','Crianças','0 a 9 anos, 11 meses e 29 dias','Por faixa etária','🧸',GOV+'arquivos/calendario-nacional-de-vacinacao-crianca/view'],
    ['adolescente-jovem','Adolescentes e jovens','10 a 24 anos','Por faixa etária','🎒',GOV+'arquivos/calendario-nacional-de-vacinacao-adolescentes-jovens/view'],
    ['adulto','Adultos','25 a 59 anos','Por faixa etária','🧑',GOV+'arquivos/calendario-nacional-de-vacinacao-adulto/view'],
    ['idoso','Idosos','A partir de 60 anos','Por faixa etária','🧓',GOV+'arquivos/calendario-nacional-de-vacinacao-idoso/view'],
    ['gestante','Gestantes','Oferta do SUS durante a gestação','Por faixa etária','🤰',GOV+'arquivos/calendario-nacional-de-vacinacao-gestante/view'],
    ['normativa','Instrução Normativa 2026','Critérios operacionais, elegibilidade e registro','Documentos técnicos','📑',GOV+'publicacoes/instrucao-normativa-que-instrui-o-calendario-nacional-de-vacinacao-2026.pdf/view'],
    ['rie','CRIE e Rede de Imunobiológicos Especiais','Indicações especiais e acesso','Documentos técnicos','🏥',GOV+'calendario']
  ];
  /* Cada linha: vacina, recomendação resumida, observação de segurança ou aplicação.
     O texto é resumo clínico e não substitui as notas integrais da fonte. */
  var INFANTIL=[
    ['BCG','Dose única ao nascer','Avaliar imunodeficiência e contraindicações de vacinas vivas.'],
    ['Hepatite B','Primeira dose nas primeiras 12 horas de vida','Completar a série segundo as apresentações combinadas e histórico vacinal.'],
    ['Rotavírus','A partir de 6 semanas: VRH1 2 doses, VRH5 3 doses; primeira até 11m29d, última até 23m29d','Há limites etários de início e término e regras específicas de resgate.'],
    ['DTPa + Hib + VIP ± hepatite B','Iniciar aos 2 meses; esquema primário e reforços na infância','Preferir apresentações combinadas; conferir idade, fabricante e intercambialidade.'],
    ['Pneumocócicas conjugadas (VPC20/VPC15)','SBIm: 2, 4 e 6 meses + reforço aos 12–15 meses; esquema de resgate conforme idade','Para crianças com doença de risco, a RIE usa VPC20: 2–6 meses, 3+1; 7–11 meses, 2+1; 12–59 meses, 2 doses. Não confundir com rotina infantil do PNI (2+1).'],
    ['Meningocócica ACWY','Iniciar na primeira infância; reforços conforme idade e produto','Preferir ACWY ao uso isolado da meningocócica C quando possível.'],
    ['Meningocócica B','Iniciar na primeira infância; doses e reforços conforme idade','Intervalos variam conforme início do esquema e fabricante.'],
    ['Influenza','Anual a partir dos 6 meses','Na primovacinação antes de 9 anos, considerar duas doses com intervalo mínimo de 4 semanas.'],
    ['Febre amarela','Rotina infantil: 9 meses e 4 anos','Vacina viva; atenção à imunossupressão e condições especiais.'],
    ['Tríplice viral','A partir de 12 meses na rotina; duas doses válidas','Dose aplicada antes de 12 meses não integra o esquema de rotina.'],
    ['Varicela / tetraviral','Na infância; duas doses','Intervalos dependem da faixa etária e apresentação.'],
    ['Hepatite A','A partir de 12 meses; duas doses no calendário SBIm','Esquema e disponibilidade pública podem ser diferentes.'],
    ['HPV9','A partir dos 9 anos; esquema conforme idade e imunossupressão','Verificar esquema de 2 ou 3 doses e indicação do produto.'],
    ['Dengue','Qdenga: a partir dos 4 anos, dentro da faixa licenciada','Vacina viva: gestação e imunodepressão são contraindicações relevantes.']
  ];
  var ADOLESCENTE=[
    ['HPV9','Atualizar vacinação de acordo com idade e situação imunológica','Esquema de 2 ou 3 doses conforme faixa etária e condição.'],
    ['Meningocócica ACWY','Verificar primovacinação e reforços na adolescência','Esquema depende do histórico anterior.'],
    ['Meningocócica B','Avaliar esquema básico e doses complementares','A vacina MenB não substitui a MenACWY.'],
    ['dTpa / dTpa-VIP','Atualização e reforços','Checar intervalo e doses contendo toxoide tetânico.'],
    ['Hepatite A e B','Completar esquemas não realizados','Checar histórico e risco epidemiológico.'],
    ['Tríplice viral e varicela','Confirmar documentação de duas doses quando indicadas','Vacinas vivas: avaliar contraindicações.'],
    ['Influenza','Uma dose anualmente','Proteger também os contactantes de pessoas vulneráveis.'],
    ['Dengue','Avaliar idade, bula e contraindicações','Esquema e elegibilidade diferem entre imunizantes.']
  ];
  var ADULTO=[
    ['dTpa','Dose de atualização e reforço a cada 10 anos se esquema básico completo','Histórico desconhecido exige completar a série de vacina contendo tétano.'],
    ['Influenza','Dose anual','Considerar situações especiais e sazonalidade.'],
    ['Hepatite B','Três doses em não vacinados, habitualmente 0–1–6 meses','Documentar esquema e avaliar anti-HBs nos grupos indicados.'],
    ['Tríplice viral','Atualizar esquema de duas doses quando indicado','Vacina viva; contraindicações na gestação e imunossupressão.'],
    ['Varicela','Duas doses se suscetível','Avaliar imunidade e possibilidade de vacina viva.'],
    ['Febre amarela','Avaliar esquema prévio, idade e exposição','A SBIm recomenda considerar duas doses com intervalo de 10 anos.'],
    ['Pneumocócica VPC20 — antecipação por risco','SBIm: rotina aos 50 anos; antes dos 50 anos, indicar se houver asma moderada/grave, pneumopatia/cardiopatia/nefropatia/hepatopatia crônicas, diabetes, imunodeficiência, asplenia, imunossupressão ou outros grupos especiais listados abaixo','Adultos ainda não vacinados: 1 dose. O SUS não a oferece universalmente a partir de 50 anos; aplica critérios do PNI/RIE e histórico vacinal.'],
    ['Herpes-zóster recombinante','A partir de 50 anos; duas doses','Também pode ser indicada antes dos 50 anos em imunossupressão.'],
    ['HPV9','Avaliar indicação segundo idade e condição clínica','Esquema em adultos varia conforme situação imunológica.'],
    ['Dengue','Considerar indicação conforme produto licenciado','Não usar imunizante vivo durante gestação ou imunossupressão.']
  ];
  var IDOSO=[
    ['Influenza','Anual; preferir apresentações mais imunogênicas quando indicadas','A oferta na rede pública pode variar.'],
    ['Pneumocócica conjugada VPC20','SBIm: dose única de rotina em idosos não previamente vacinados; no SUS, considerar idade ≥85 anos, 60–84 anos acamados/institucionalizados ou condição especial da RIE','Após VPC10/13 sem VPP23, MS/RIE: aguardar ≥8 semanas; após uma VPP23: ≥1 ano; após duas VPP23: sem nova VPC20 no SUS/RIE. Recomendação SBIm pode diferir.'],
    ['Herpes-zóster recombinante','Duas doses, habitualmente 0–2 meses','Recomendada mesmo após episódio prévio de zóster.'],
    ['Vírus sincicial respiratório (VSR)','Uma dose; rotina ≥70 anos; condições cardiopulmonares relevantes e imunodeficiência moderada/grave ≥18 anos; outras doenças conforme idade (ver ficha de VSR adulto)','Não há recomendação estabelecida de revacinação periódica no calendário de referência.'],
    ['dTpa','Atualização e reforço de 10 em 10 anos','Checar esquema básico e necessidade de reforço antecipado em contatos de lactentes.'],
    ['Hepatite B','Esquema 0–1–6 meses quando não vacinado','Considerar comorbidades e imunogenicidade.'],
    ['Covid-19','Reforços conforme recomendações vigentes para a faixa etária','Acompanhar disponibilidade e produto atualizado.'],
    ['Febre amarela','Avaliação individual de risco-benefício após 60 anos','Vacina viva; risco de eventos graves aumenta em determinadas situações.']
  ];
  var GESTANTE=[
    ['Influenza','Uma dose em qualquer fase da gestação, a cada temporada','Vacina inativada.'],
    ['dTpa','Uma dose a cada gestação, conforme idade gestacional recomendada','Proteção do recém-nascido contra coqueluche.'],
    ['Hepatite B','Completar esquema quando suscetível','Verificar registro e risco de exposição.'],
    ['Covid-19','Vacinação e reforços conforme calendário vigente','Utilizar produto recomendado para gestantes.'],
    ['VSR materno','PNI: uma dose a partir de 28 semanas, em cada gestação, independentemente da idade materna','O objetivo é proteger o lactente por anticorpos maternos. Na rede privada, respeitar bula e orientação aplicável à apresentação utilizada.'],
    ['Febre amarela','Geralmente adiar; avaliar apenas se risco epidemiológico elevado','Vacina viva; decisão individual após análise de risco-benefício.'],
    ['Tríplice viral, varicela e dengue','Não aplicar durante a gestação','Vacinas vivas atenuadas, com contraindicação na gestação.']
  ];
  var OCUPACIONAL=[
    ['Profissionais de saúde','Hepatite B, dTpa, influenza, tríplice viral, varicela, Covid-19','Documentar imunidade e risco ocupacional específico.'],
    ['Trabalhadores com contato com crianças','dTpa, influenza, tríplice viral e varicela','Redução do risco de transmissão a lactentes vulneráveis.'],
    ['Laboratórios de microbiologia','Avaliar meningocócicas, raiva e outras conforme agente','Indicação varia com o material manipulado.'],
    ['Veterinários e manejo animal','Raiva pré-exposição e reforços baseados na avaliação de risco','Avaliar necessidade de controle sorológico.'],
    ['Exposição a material biológico','Hepatite B e manejo pós-exposição','Protocolos específicos de acidente ocupacional prevalecem.']
  ];
  var ESPECIAIS=[
    ['Imunodeficiências primárias','Calendário definido pelo defeito imunológico e pela imunidade celular','Vacinas vivas podem ser contraindicadas; consultar capítulos específicos.'],
    ['Uso de imunossupressores e biológicos','Atualizar vacinas antes do início quando possível','O momento de aplicação e a resposta variam por medicamento.'],
    ['Asplenia e disfunção esplênica','Ampliar proteção antipneumocócica, meningocócica e Hib','Esquemas e reforços variam conforme história vacinal.'],
    ['Deficiências do complemento','Priorizar meningocócicas ACWY e B','Reforços e antibióticos profiláticos podem ser necessários.'],
    ['Transplante de órgão sólido','Planejamento pré e pós-transplante','Interrupção e reinício dependem de órgão, tempo e imunossupressão.'],
    ['Transplante de células-tronco hematopoéticas','Revacinação conforme protocolo específico','Pode exigir reconstrução integral da imunização.'],
    ['Imunoglobulina humana','Avaliar interferência com vacinas vivas e resposta humoral','Intervalos variam segundo dose, indicação e produto; não usar regra única.'],
    ['HIV','Individualizar segundo CD4, controle virológico e idade','Vacinas vivas dependem de critérios imunológicos.'],
    ['Pneumocócica VPC20 — lista de comorbidades','Asma moderada/grave; outras pneumopatias crônicas; cardiopatia; diabetes; nefropatia; hepatopatia; asplenia; imunodeficiência; imunossupressão; transplante; câncer; HIV e demais condições da NT MS 52/2026','Abrir esta ficha para consultar as 21 indicações completas, esquemas por idade e diferenças de acesso SUS/RIE × SBIm.']
  ];
  var PNI_CHILD=[
    ['Ao nascer','BCG e hepatite B','Dose inicial preferencialmente na maternidade.'],
    ['2 meses','Pentavalente, VIP, VPC20 e rotavírus','VPC20: dose 1 aos 2 meses; dose 2 aos 4 meses; reforço aos 12 meses (PNI, esquema 2+1). Durante transição, considerar doses prévias de VPC10.'],
    ['3 meses','Meningocócica C','Primeira dose.'],
    ['4 meses','Pentavalente, VIP, pneumocócica conjugada e rotavírus','Segundas doses conforme calendário e produto.'],
    ['5 meses','Meningocócica C','Segunda dose.'],
    ['6 meses','Pentavalente, VIP, influenza e Covid-19 conforme produto','Completar séries iniciais e iniciar vacinas indicadas a partir dessa idade.'],
    ['9 meses','Febre amarela','Primeira dose de rotina.'],
    ['12 meses','Tríplice viral, reforço com VPC20 e meningocócica ACWY','VPC20: reforço após as doses infantis aos 2 e 4 meses. MenACWY: substitui o reforço de meningocócica C na rotina do PNI.'],
    ['15 meses','DTP, VIP, hepatite A e varicela/tetraviral conforme apresentação','Reforços e atualização do segundo ano.'],
    ['4 anos','DTP, VIP, varicela e febre amarela','Segundo reforço VIP incluído no PNI desde 03/08/2026; conferir histórico.'],
    ['9 a 14 anos','HPV','Regra de dose e faixa etária conforme normativa vigente.']
  ];
  var PNI_YOUNG=[
    ['HPV','Rotina e resgate segundo a faixa etária contemplada pelo SUS','Critérios de idade e condições especiais são normativos.'],
    ['Meningocócica ACWY','Dose na adolescência conforme faixa etária e histórico','A oferta gratuita segue o calendário do PNI.'],
    ['Hepatite B','Completar três doses se não imunizado','Conferir registro vacinal.'],
    ['dT','Esquema básico e reforços decenais','dTpa para grupos específicos segundo normativa.'],
    ['Tríplice viral','Atualização conforme idade e histórico','Exigir doses válidas após a idade mínima.'],
    ['Febre amarela','Verificar doses anteriores e indicação','Considerar requisitos epidemiológicos.']
  ];
  var PNI_ADULT=[
    ['Hepatite B','Completar esquema de três doses se não vacinado','Verificar série documentada.'],
    ['dT','Esquema básico e reforço a cada 10 anos','Adaptar em situações de ferimentos e risco ocupacional.'],
    ['Tríplice viral','Atualização conforme idade e histórico','Checar situações especiais e contraindicações.'],
    ['Febre amarela','Vacinação conforme histórico e indicação','Avaliar contraindicações de vacina viva.'],
    ['Influenza / Covid-19','Oferta dirigida aos grupos previstos no PNI','Elegibilidade varia por condição e campanhas.']
  ];
  var PNI_SENIOR=[
    ['Influenza','Vacinação anual','Grupo contemplado no PNI.'],
    ['Covid-19','Doses de rotina conforme normativa vigente','Verificar periodicidade e produto da temporada.'],
    ['Hepatite B','Atualizar quando não vacinado','Considerar histórico.'],
    ['dT','Esquema básico e reforço decenal','Registro vacinal define necessidade.'],
    ['Febre amarela','Decisão individual em pessoas com 60 anos ou mais','Considerar risco de doença e eventos adversos.'],
    ['Pneumocócica VPC20 — critérios SUS','Rotina SUS: idosos ≥85 anos; de 60–84 anos, acamados e/ou institucionalizados; indígenas conforme histórico; e pessoas de risco enquadradas na RIE','Em pessoas ≥85 anos previamente vacinadas, seguir regras específicas do Ministério da Saúde: por exemplo, duas doses de VPP23 ou VPC13/15 + VPP23 podem dispensar VPC20 na estratégia SUS.']
  ];
  var PNI_PREG=[
    ['dTpa','Uma dose a cada gestação segundo janela do PNI','Fundamental para proteção contra coqueluche no lactente.'],
    ['Influenza','Uma dose durante a gestação, a cada temporada','Vacina inativada.'],
    ['Hepatite B','Completar esquema se necessário','Registro e sorologia podem orientar investigação.'],
    ['Covid-19','Esquema e periodicidade da normativa vigente','Utilizar apresentação indicada para gestantes.'],
    ['VSR materno','Uma dose em cada gestação a partir da 28ª semana gestacional, segundo o PNI','Não limitar a 32–36 semanas no PNI. Pode ser coadministrada com dTpa, influenza e outras vacinas indicadas, em sítios distintos.']
  ];
  var profiles={
    sbim:{
      prematuro:[['Prematuro — primeiro ano',[
        ['Idade cronológica','Vacinar pela idade cronológica, sem corrigir a prematuridade','A hospitalização não impede, por si só, a imunização.'],
        ['BCG','Aplicar ao atingir pelo menos 2.000 g','Avaliar suspeita de imunodeficiência e uso materno de biológicos.'],
        ['Hepatite B','Primeira dose nas primeiras 12 horas; se peso < 2.000 g ou IG < 33 semanas, esquema de quatro doses','Conferir profilaxia quando mãe HBsAg positiva.'],
        ['Calendário infantil', 'Aplicar as vacinas da infância no momento cronológico correspondente','Consultar doses e limites do rotavírus.']
      ]],['Vacinas do primeiro ano',INFANTIL.slice(2,9)],['Situações especiais',[
        ['Anticorpo contra VSR','Verificar elegibilidade para profilaxia passiva','O anticorpo monoclonal não substitui o calendário vacinal.'],
        ['Imunoglobulinas específicas','Avaliar pós-exposição conforme indicação','HB e varicela têm critérios próprios no recém-nascido.']
      ]]],
      crianca:[['Rotina da infância',INFANTIL]],
      adolescente:[['Rotina do adolescente',ADOLESCENTE]],
      adulto:[['Rotina do adulto',ADULTO]],
      idoso:[['Rotina dos idosos',IDOSO]],
      gestante:[['Proteção materna e do bebê',GESTANTE]],
      ocupacional:[['Exposição e riscos profissionais',OCUPACIONAL]],
      especiais:[['Situações que exigem individualização',ESPECIAIS]],
      'resumo-infantil':[['Nascimento até 10 anos',INFANTIL],['Adolescência',ADOLESCENTE]],
      'resumo-adulto':[['Adultos',ADULTO],['Idosos',IDOSO],['Gestantes',GESTANTE]],
      unico:[['Infância',INFANTIL],['Adolescência',ADOLESCENTE],['Adultos',ADULTO],['Idosos',IDOSO],['Gestantes',GESTANTE]],
      livreto:[['Prematuridade',[
        ['Esquema por idade cronológica','Vacinar sem corrigir idade, com observação de peso para BCG','Avaliar imunoprofilaxia e condições maternas.']
      ]],['Crianças',INFANTIL],['Adolescentes',ADOLESCENTE],['Adultos',ADULTO],['Idosos',IDOSO],['Gestantes',GESTANTE],['Ocupacional',OCUPACIONAL]]
    },
    pni:{
      crianca:[['Agenda por idade — SUS',PNI_CHILD]],
      'adolescente-jovem':[['Vacinas da rede pública',PNI_YOUNG]],
      adulto:[['Vacinas da rede pública',PNI_ADULT]],
      idoso:[['Vacinas da rede pública',PNI_SENIOR]],
      gestante:[['Vacinas da rede pública',PNI_PREG]],
      normativa:[['Normas gerais do Calendário Nacional 2026',[
        ['Histórico vacinal','Validar doses registradas e intervalos mínimos','Normativa 2026 é referência operacional para o SUS.'],
        ['Faixas etárias','A elegibilidade depende da idade e do grupo de risco','Não substituir faixa de oferta do PNI pelas recomendações científicas da SBIm.'],
        ['Rede de Imunobiológicos Especiais','Avaliar encaminhamento e documentação quando indicado','A vacinação especial tem critérios próprios.'],
        ['Segurança','Aplicar regras de contraindicações, precauções e farmacovigilância','Consultar a seção correspondente do documento original.'],
        ['Registro','Documentar dose, lote, produto e via no sistema oficial','Não armazenar dados pessoais no Hub.']
      ]]],
      rie:[['Situações especiais — SUS',[
        ['Imunodeficiência / imunossupressão','Identificar indicação específica e avaliar vacina viva','O manual e as notas do Ministério da Saúde definem os critérios.'],
        ['Asplenia e complementopatias','Avaliar pneumocócicas, meningocócicas e Hib','Encaminhar ao serviço de referência com documentação clínica.'],
        ['Transplantados','Planejar vacinação segundo fase de tratamento','Seguir critérios do CRIE/RIE e normas vigentes.'],
        ['Pneumocócica VPC20 — 21 grupos de indicação especial','Inclui asma persistente moderada/grave, outras pneumopatias crônicas, diabetes, cardiopatia, hepatopatia, nefropatia, imunodeficiência, imunossupressão, asplenia e demais grupos da NT MS 52/2026','Abrir esta ficha para ver a lista integral, faixas etárias, doses, intervalos e as diferenças entre as recomendações da SBIm e o acesso no SUS.']
      ]]]
    }
  };
  var fonte='sbim', selecionado=null;
  var currentDoc=null;

  var COVID_MS='https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/covid-19';
  var COVID_GUIA='https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/guias-e-manuais/2025/guia-rapido-de-vacinacao-contra-a-covid-19/view';
  var COVID_PNI=GOV+'publicacoes/instrucao-normativa-que-instrui-o-calendario-nacional-de-vacinacao-2026.pdf/view';

  function prepararCalendarioCovid(menu){
    if(!menu||get('vac-cal-covid'))return;
    var pni=menu.querySelector('button[onclick="vacAbrirCalendarios(\'pni\')"]');
    if(!pni)return;

    var card=document.createElement('details');
    card.id='vac-cal-covid';
    card.className='vac-nat-shell';
    card.innerHTML=
      '<summary class="vac-covid-summary">'+
        '<span class="vac-covid-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18m-12 5 2 2 4-4"/></svg></span>'+
        '<span><span class="vac-covid-title">Calendário de vacinação contra COVID-19</span>'+
        ' <span class="vac-covid-subtitle">Ministério da Saúde / PNI · Doses e intervalos no SUS</span></span>'+
        '<span class="vac-covid-chevron" aria-hidden="true">›</span>'+
      '</summary>'+
      '<div class="vac-nat-body vac-covid-body">'+
        viewGroup('Vacinação de rotina',[
          ['Crianças de 6 meses a menores de 5 anos','Comirnaty (Pfizer): 3 doses aos 6, 7 e 9 meses. Spikevax (Moderna): esquema de 2 doses aos 6 e 7 meses, conforme disponibilidade e histórico.',
           'Comirnaty: 4 semanas entre a 1ª e a 2ª dose e 8 semanas entre a 2ª e a 3ª. Spikevax: 4 semanas entre as doses. Em atraso, conferir a caderneta e completar até 4 anos, 11 meses e 29 dias, conforme o produto. Crianças saudáveis com esquema completo dispensam doses periódicas de rotina. Crianças com comorbidades, indígenas, quilombolas ou ribeirinhas recebem 1 dose anual após o esquema básico, com intervalo mínimo de 6 meses desde a última dose. Em caso de imunocomprometimento, consultar o esquema especial abaixo.'],
          ['Gestantes','1 dose por gestação, em qualquer idade gestacional.',
           'Se houver dose prévia contra COVID-19, aguardar pelo menos 6 meses desde a última dose.'],
          ['Pessoas a partir de 60 anos','1 dose a cada 6 meses.',
           'Contar 6 meses desde a última dose, independentemente do total de doses anteriores.']
        ])+
        viewGroup('Vacinação especial e atualização da caderneta',[
          ['Pessoas imunocomprometidas a partir de 6 meses','Esquema inicial com Comirnaty: 3 doses. Após completar, 1 dose a cada 6 meses.',
           'Respeitar 4 semanas entre a 1ª e a 2ª dose e 8 semanas entre a 2ª e a 3ª. Usar a apresentação indicada para a idade. Contar pelo menos 6 meses desde a última dose para a vacinação periódica.'],
          ['Demais grupos especiais a partir de 5 anos','1 dose anual enquanto persistir a indicação.',
           'Inclui pessoas com comorbidades (intervalo mínimo de 6 meses desde a última dose), deficiência permanente, indígenas dentro ou fora de terras indígenas, ribeirinhos, quilombolas, profissionais de saúde, residentes e trabalhadores de instituições de longa permanência, pessoas em situação de rua, pessoas privadas de liberdade e funcionários do sistema prisional, adolescentes e jovens em medidas socioeducativas e trabalhadores dos Correios. Puérperas são elegíveis se não vacinadas na gestação.'],
          ['População geral de 5 a 59 anos','1 dose para quem nunca recebeu vacina contra COVID-19.',
           'Usar o imunizante disponível e indicado para a idade. A revacinação periódica segue os critérios dos grupos elegíveis.']
        ])+
        '<div class="vac-nat-footer">Fontes oficiais consultadas em 16/11/2026.'+
        '<a class="vac-nat-source" href="'+COVID_MS+'" target="_blank" rel="noopener noreferrer">COVID-19 no Ministério da Saúde</a>'+
        '<a class="vac-nat-source" href="'+COVID_PNI+'" target="_blank" rel="noopener noreferrer">Instrução Normativa do PNI 2026 · seção 12</a>'+
        '<a class="vac-nat-source" href="'+COVID_GUIA+'" target="_blank" rel="noopener noreferrer">Guia Rápido de Vacinação contra a COVID-19</a></div>'+
      '</div>';
    pni.after(card);
  }

  function preparar(){
    if(!get('vac-sub-calendarios'))return;
    if(!get('vac-nativo-css')){
      var style=document.createElement('style');style.id='vac-nativo-css';
      style.textContent=
       '.vac-nat-shell{min-width:0;min-height:148px;box-sizing:border-box;display:flex;flex-direction:column;align-self:stretch;background:#fff;border:1.5px solid #dfe8ed;border-radius:12px;overflow:hidden;overflow-anchor:none}' +
       '.vac-nat-card{width:100%;min-height:145px;box-sizing:border-box;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;gap:8px;text-align:left;background:transparent;border:0;border-radius:11px;padding:13px 12px;cursor:pointer;font:inherit;color:#0d1f2d;overflow-wrap:anywhere;line-height:1.4;transition:background .15s;flex-shrink:0}' +
       '.vac-nat-shell.open{grid-column:1 / -1;border-color:#2d8fa8;background:#fff;box-shadow:0 0 0 1px rgba(45,143,168,.18)}' +
       '.vac-nat-shell.open>.vac-nat-card{min-height:76px;flex-direction:row;align-items:center;text-align:left;background:#effafb}' +
       '.vac-nat-shell.open>.vac-nat-card>span:last-child{flex:1;min-width:0}' +
       '.vac-nat-shell>.vac-nat-body{display:block;width:100%;box-sizing:border-box;min-width:0;border-top:1px solid #dfe8ed;background:#fff;overflow-wrap:anywhere}' +
       '.vac-nat-shell>.vac-cal-visualizador{margin:0!important;padding:12px!important;border:0!important;border-radius:0!important}' +
       '.vac-nat-shell>#vac-sub-atraso{margin:0!important;padding:4px 0 16px!important}' +
       '.vac-nat-card>span:first-child{flex:0 0 28px;width:28px;line-height:1.2;text-align:center}' +
       '.vac-nat-card>span:last-child{flex:1 1 auto;min-width:0}' +
       '.vac-nat-card>span:last-child>span:first-child{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}' +
       '.vac-nat-card>span:last-child>span:last-child{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}' +
       '.vac-nat-card:focus-visible{outline:3px solid #2d8fa8;outline-offset:2px}' +
       '.vac-nat-card[aria-pressed="true"]{background:#effafb}' +
       '.vac-nat-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:stretch;grid-auto-flow:row}' +
       '.vac-nat-inline{grid-column:1/-1!important;min-width:0;width:100%;box-sizing:border-box;margin:0!important;align-self:stretch}' +
       '.vac-cal-inline-root{padding:2px 0 10px!important;min-width:0;width:100%;background:#f8fbfd;border-radius:12px}' +
       '.vac-nat-sec{margin:18px 0 8px;font-size:13px;color:#153a4c}' +
       '.vac-nat-batch{border:1px solid #e2e8f0;border-radius:12px;background:#fff;margin-bottom:10px;overflow:hidden}' +
       '.vac-nat-batch-title{padding:12px 13px;background:#f0f7f9;color:#16485a;font-size:12px;font-weight:700}' +
       '.vac-nat-item{border-top:1px solid #e7edf1}' +
       '.vac-nat-item summary{cursor:pointer;padding:13px;font-size:12.5px;font-weight:650;line-height:1.5;list-style:revert}' +
       '.vac-nat-detail{padding:0 13px 13px;color:#344d5a;font-size:12px;line-height:1.65}' +
       '.vac-nat-hint{padding:10px 12px;background:#fff9e9;color:#71571c;border:1px solid #f1dba7;border-radius:10px;font-size:11.5px;line-height:1.6;margin:10px 0}' +
       '.vac-nat-footer{padding:12px;border-top:1px solid #e2e8f0;margin-top:15px;font-size:11.5px;line-height:1.55;color:#64748b}' +
       '.vac-nat-source{display:block;width:fit-content;max-width:100%;margin-top:10px;color:#1f6980;text-decoration:underline;font-weight:700;overflow-wrap:anywhere}' +
       '.vac-nat-back{border:1px solid #c8e2e9;background:#eef8fb;color:#155c70;border-radius:8px;padding:7px 10px;font:700 11px Manrope,sans-serif;cursor:pointer}' +
       '#vac-cal-covid{min-height:0;border:1.5px solid var(--gray-100);border-radius:14px}' +
       '#vac-cal-covid[open]{border-color:#2d8fa8}' +
       '.vac-covid-summary{min-height:88px;box-sizing:border-box;display:flex;align-items:center;gap:14px;padding:14px 16px;cursor:pointer;list-style:none}' +
       '.vac-covid-summary::-webkit-details-marker{display:none}' +
       '.vac-covid-summary:focus-visible{outline:3px solid #2d8fa8;outline-offset:-3px}' +
       '.vac-covid-icon{display:grid;place-items:center;flex:0 0 28px;width:28px;height:32px;border-radius:8px;background:linear-gradient(145deg,#eefbfa,#dceef6);color:#1f6980}' +
       '.vac-covid-title,.vac-covid-subtitle{display:block;line-height:1.45}' +
       '.vac-covid-title{color:var(--navy);font-size:13.5px;font-weight:800}' +
       '.vac-covid-subtitle{color:var(--gray-500);font-size:11.5px;margin-top:2px}' +
       '.vac-covid-chevron{margin-left:auto;color:var(--gray-500);font-size:18px}' +
       '#vac-cal-covid[open]>.vac-covid-summary{background:#effafb}' +
       '#vac-cal-covid[open] .vac-covid-chevron{transform:rotate(90deg)}' +
       '#vac-cal-covid>.vac-covid-body{padding:12px}' +
       '#vac-cal-covid:not([open])>.vac-covid-body{display:none}' +
       '@media(max-width:390px){.vac-covid-summary{min-height:96px}}' +
       '@media(min-width:750px){.vac-nat-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.vac-nat-shell{min-height:138px}.vac-nat-shell:not(.open)>.vac-nat-card{min-height:135px}}';
      document.head.appendChild(style);
    }
    var tabs=get('vacCalTabSBIm');
    if(tabs && tabs.parentNode)tabs.parentNode.style.display='none'; // PNI nunca aparece como aba dentro da SBIm
    var frame=get('vacCalPreviewFrame');if(frame){frame.removeAttribute('src');frame.style.display='none';frame.remove();}
    var link=get('vacCalPreviewLink');if(link)link.remove(); // original fica exclusivamente no rodapé da página
    var aviso=get('vacCalPreviewAviso');if(aviso)aviso.style.display='none';
    var sec=get('vacCalPreview');
    if(sec && !get('vacNativeContent')){
      var pane=document.createElement('div');pane.id='vacNativeContent';sec.appendChild(pane);
    }
    var menu=get('vac-menu-hub');
    prepararCalendarioCovid(menu);
    if(menu)Array.prototype.forEach.call(menu.querySelectorAll('button'),function(b){if(b.getAttribute('onclick')==="vacShowSub('atraso')")b.remove();});
    var at=get('vac-sub-atraso');
    if(at && !at.dataset.nativeIntegrated){
      at.dataset.nativeIntegrated='true';
      var back=at.querySelector('button[onclick*="vacShowHub"]');
      if(back){back.setAttribute('onclick','vacFecharCalendario()');back.setAttribute('aria-label','Recolher recuperação de doses');}
      var foot=at.lastElementChild;
      if(foot){
        var ref=document.createElement('a');
        ref.href='https://sbim.org.br/images/guia-rapido-sbim-idadesminimas-intervalosminimos-recuperacao.pdf.pdf_2026-03-11.pdf';
        ref.target='_blank';ref.rel='noopener noreferrer';ref.textContent='Arquivo original — guia rápido SBIm (PDF)';
        ref.style.cssText='display:block;margin-top:9px;color:#1f6980;font-weight:700;text-decoration:underline;overflow-wrap:anywhere';
        foot.appendChild(ref);
      }
    }
  }
  function premiumCalendarIcon(id){
    var paths={
      prematuro:'<path d="M7 14c0-4 2-7 5-7s5 3 5 7-2 7-5 7-5-3-5-7Z"/><circle cx="12" cy="4.5" r="2"/><path d="m8 13 8 4m-8 0 8-4"/>',
      crianca:'<circle cx="12" cy="7" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3M9 16l3 3 3-3"/>',
      adolescente:'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c3 3 9 3 12 0v-6m4-2v6"/>',
      adulto:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
      idoso:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2M8 8h2m4 0h2m-6 0h4"/>',
      gestante:'<circle cx="12" cy="4" r="2.5"/><path d="M10 8c-3 3-4 7-2 11h8c2-4 1-8-2-11M12 19v3m-2-10c5-1 7 2 6 5"/>',
      ocupacional:'<path d="M8 4H5v6a5 5 0 0 0 10 0V4h-3M10 15v1a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
      especiais:'<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="M12 8v8m-4-4h8"/>',
      atraso:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      rie:'<rect x="3" y="4" width="18" height="17" rx="3"/><path d="M12 8v8m-4-4h8"/>'
    };
    var body=paths[id]||'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>';
    return '<svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+body+'</svg>';
  }
  function drawList(){
    preparar();
    var list=get('vacCalendariosLista');if(!list)return;
    var docs=fonte==='sbim'?DOC_SBIM:DOC_PNI;
    var busca=get('vacCalBusca');var q=(busca&&busca.value||'').toLocaleLowerCase('pt-BR').trim();
    var grupos=[];
    docs.forEach(function(d){if(grupos.indexOf(d[3])<0)grupos.push(d[3]);});
    var out='';
    grupos.forEach(function(g){
      var itens=docs.filter(function(d){
        return d[3]===g && (!q||(d[1]+' '+d[2]).toLocaleLowerCase('pt-BR').indexOf(q)>=0);
      });
      if(!itens.length)return;
      out+='<h3 class="vac-nat-sec">'+esc(g)+'</h3><div class="vac-nat-grid">';
      itens.forEach(function(d){
        out+='<div class="vac-nat-shell" data-vac-shell="'+esc(d[0])+'">' +
          '<button type="button" class="vac-nat-card" data-native-id="'+esc(d[0])+'" data-vac-title="'+esc(d[1])+'" aria-pressed="false" aria-expanded="false" aria-controls="'+(d[0]==='atraso'?'vac-sub-atraso':'vacCalPreview')+'">' +
          '<span class="vac-nat-icon" aria-hidden="true">'+premiumCalendarIcon(d[0])+'</span>' +
          '<span class="vac-nat-card-copy"><span class="vac-nat-title">'+esc(d[1])+'</span> ' +
          '<span class="vac-nat-subtitle">'+esc(d[2])+'</span></span></button></div>';
      });
      out+='</div>';
    });
    // O visualizador e a recuperação pertencem ao cartão expandido.
    // Preservar esses elementos antes de reconstruir a grade na busca.
    var livePreview=get('vacCalPreview');
    if(livePreview && list.contains(livePreview)){
      livePreview.style.display='none';
      livePreview.classList.remove('vac-nat-body','vac-nat-inline');
      list.after(livePreview);
    }
    var atraso=get('vac-sub-atraso');
    if(atraso && list.contains(atraso)){
      atraso.style.display='none';
      atraso.classList.remove('vac-nat-body','vac-nat-inline');
      var page=get('page-imunizacoes');
      if(page)page.appendChild(atraso);
    }
    list.innerHTML=out||'<p style="font-size:12px">Nenhum calendário encontrado.</p>';
    list.querySelectorAll('[data-native-id]').forEach(function(b){b.addEventListener('click',function(){openNative(b.dataset.nativeId);});});
    var legenda=get('vacCalLegenda');
    if(legenda)legenda.textContent=fonte==='sbim'
      ?'SBIm 2026/2027: recomendações científicas, inclusive para imunização fora da oferta de rotina do SUS. O PNI é consultado separadamente, na Central de Imunizações.'
      :'PNI / Ministério da Saúde 2026: vacinas e elegibilidade na rede pública. Recomendações SBIm estão em sua própria seção.';
  }
  function showFooter(url,origem){
    return '<div class="vac-nat-footer">Fonte: '+esc(origem)+'. Conteúdo clínico reorganizado em linguagem de consulta rápida. Pode haver condições adicionais, notas e mudanças normativas. Confira a publicação integral para prescrição e decisão em situações complexas.'+
      '<a class="vac-nat-source" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Consultar arquivo original da instituição responsável ↗</a></div>';
  }

  var PNEUMO20_GUIA_HTML =
    '<div style="border:1px solid #b8d9e0;border-radius:11px;background:#f4fafb;padding:12px;margin-top:12px;line-height:1.7;font-size:11.5px;color:#244856">'
    +'<div style="font-weight:800;color:#17445a;font-size:12.5px;margin-bottom:6px">Pneumo 20 (VPC20): indicação especial e antecipação</div>'
    +'<p style="margin:0 0 9px">SBIm: rotina a partir dos 50 anos; antes dos 50 anos em pessoas com comorbidades de risco. PNI/RIE: as condições clínicas abaixo permitem indicação especial, com critérios e esquemas próprios. A oferta gratuita não equivale à recomendação universal da SBIm.</p>'
    +'<details style="margin:7px 0"><summary style="cursor:pointer;font-weight:700">Quais condições? 21 indicações da Nota Técnica MS nº 52/2026, seção 6</summary>'
    +'<ol style="padding:4px 0 0 20px;margin:0"><li>HIV/aids</li><li>Neoplasia em atividade ou até alta médica</li><li>Transplante de órgão sólido</li><li>Transplante de células-tronco hematopoéticas (TCTH)</li><li>Terapia CAR-T</li><li>Asplenia anatômica ou funcional</li><li>Imunodeficiências primárias/erros inatos da imunidade</li><li>Fibrose cística</li><li>Fístula liquórica ou derivação ventriculoperitoneal</li><li>Imunossupressão terapêutica</li><li>Implante coclear</li><li>Nefropatia crônica, hemodiálise ou síndrome nefrótica</li><li>Pneumopatia crônica, exceto asma intermitente ou persistente leve</li><li>Asma persistente moderada ou grave</li><li>Cardiopatia crônica</li><li>Hepatopatia crônica</li><li>Doença neurológica crônica incapacitante</li><li>Trissomias</li><li>Diabetes</li><li>Doença de depósito</li><li>Prematuridade (≤36 semanas e 6 dias) até 23 meses</li></ol>'
    +'<p style="margin:6px 0">Rinite alérgica isolada e asma leve não são indicações especiais nessa lista.</p></details>'
    +'<details style="margin:7px 0"><summary style="cursor:pointer;font-weight:700">Esquemas da RIE em não vacinados</summary>'
    +'<p>Início aos 2–6 meses: três doses aos 0, 2 e 4 meses + reforço aos 12–15 meses. Início aos 7–11 meses: duas doses (0 e 2 meses) + reforço aos 12–15 meses. Início aos 12–59 meses: duas doses com intervalo de dois meses. A partir de 5 anos: dose única, exceto situações como TCTH e CAR-T.</p></details>'
    +'<details style="margin:7px 0"><summary style="cursor:pointer;font-weight:700">Já recebeu VPC ou VPP23?</summary>'
    +'<p>MS/RIE 52/2026: VPC10/VPC13 completas sem VPP23 → VPC20 com intervalo mínimo de oito semanas; uma dose de VPP23 → VPC20 após pelo menos um ano (e ao menos oito semanas da última conjugada); duas doses de VPP23 → não indica VPC20 adicional nesta estratégia. Não aplicar VPP23 após VPC20.</p>'
    +'<p>SBIm 2026/2027: pode indicar VPC20 mesmo após uma ou duas VPP23 (respeitar um ano), e em situações com esquema sequencial completo a critério médico. Não extrapolar recomendação SBIm para elegibilidade no SUS.</p></details>'
    +'<details style="margin:7px 0"><summary style="cursor:pointer;font-weight:700">Quem recebe na rotina do SUS?</summary>'
    +'<p>Crianças, em esquema de rotina 2, 4 e reforço aos 12 meses (atenção à transição com VPC10); povos indígenas segundo histórico; idosos a partir de 85 anos; e pessoas de 60–84 anos acamadas/institucionalizadas. Na RIE, as 21 situações especiais acima. Avaliar doses prévias para não revacinar indevidamente.</p></details>'
    +'<div style="border-top:1px solid #d0e6ec;margin-top:9px;padding-top:7px">Fontes: <a href="https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-no-52-2026-cgici-dpni-svsa-ms.pdf" target="_blank" rel="noopener noreferrer">MS, NT 52/2026, itens 4–6</a> · <a href="https://www.gov.br/saude/pt-br/centrais-de-conteudo/publicacoes/notas-tecnicas/2026/nota-tecnica-no-64-2026-dpni-svsa-ms.pdf/view" target="_blank" rel="noopener noreferrer">NT 64/2026 — atualização</a> · <a href="https://sbim.org.br/images/calend-vacinacao-pacientes-especiais-2026-27-260617a.pdf_2026-06-24.pdf" target="_blank" rel="noopener noreferrer">SBIm, pacientes especiais 2026/2027</a> · <a href="https://www.gov.br/saude/pt-br/vacinacao/calendario" target="_blank" rel="noopener noreferrer">PNI, calendário 2026</a></div></div>';

  function viewGroup(group,rows){
    var h='<div class="vac-nat-batch"><div class="vac-nat-batch-title">'+esc(group)+'</div>';
    rows.forEach(function(r){
      h+='<details class="vac-nat-item"><summary><span class="vac-nat-item-title">'+esc(r[0])+'</span> <span class="vac-nat-item-subtitle">'+esc(r[1])+'</span></summary>'+
        '<div class="vac-nat-detail"><div class="vac-nat-clinical-label">Orientação clínica</div><p class="vac-nat-clinical-text">'+esc(r[2]||'Confira observações e exceções no arquivo original.')+'</p>'+(/pneumoc|pneumo|VPC20/i.test(r[0])?PNEUMO20_GUIA_HTML:'')+'</div></details>';
    });
    return h+'</div>';
  }
  function listButton(id){
    var list=get('vacCalendariosLista');
    return list?Array.prototype.find.call(list.querySelectorAll('[data-native-id]'),function(b){return b.dataset.nativeId===id;}):null;
  }
  function closeNative(){
    selecionado=null;
    currentDoc=null;
    var list=get('vacCalendariosLista');
    if(list){
      list.querySelectorAll('.vac-nat-shell.open').forEach(function(shell){shell.classList.remove('open');});
      list.querySelectorAll('[data-native-id]').forEach(function(b){
        b.setAttribute('aria-pressed','false');
        b.setAttribute('aria-expanded','false');
      });
    }
    var sec=get('vacCalPreview');
    if(sec){
      sec.style.display='none';
      sec.classList.remove('vac-nat-body','vac-nat-inline');
      if(list&&list.contains(sec))list.after(sec);
    }
    var atraso=get('vac-sub-atraso');
    if(atraso){
      atraso.style.display='none';
      atraso.classList.remove('vac-nat-body','vac-nat-inline');
      if(list&&list.contains(atraso)){
        var page=get('page-imunizacoes');
        if(page)page.appendChild(atraso);
      }
    }
    var output=get('vacNativeContent');
    if(output)output.innerHTML='';
  }
  function openNative(id){
    // Primeiro toque abre dentro do cartão. Segundo toque no mesmo fecha.
    if(selecionado===id){closeNative();return;}
    var docs=fonte==='sbim'?DOC_SBIM:DOC_PNI;
    var doc=docs.find(function(d){return d[0]===id;});
    if(!doc)return;
    closeNative();
    var botao=listButton(id);
    var shell=botao&&botao.closest('.vac-nat-shell');
    if(!botao||!shell)return;
    selecionado=id;
    currentDoc=doc;
    shell.classList.add('open');
    botao.setAttribute('aria-pressed','true');
    botao.setAttribute('aria-expanded','true');
    if(id==='atraso'&&fonte==='sbim'){
      var atraso=get('vac-sub-atraso');
      if(!atraso){closeNative();return;}
      atraso.classList.add('vac-nat-body');
      atraso.style.display='block';
      shell.appendChild(atraso);
      if(typeof window.atrRender==='function')window.atrRender();
      return;
    }
    var sec=get('vacCalPreview'),output=get('vacNativeContent');
    if(!sec||!output){closeNative();return;}
    var titulo=get('vacCalPreviewTitulo');
    if(titulo)titulo.textContent=doc[1];
    var origem=get('vacCalPreviewOrigem');
    if(origem)origem.textContent=fonte==='sbim'
      ?'Sociedade Brasileira de Imunizações • SBIm 2026/2027'
      :'Ministério da Saúde • PNI 2026';
    var groups=profiles[fonte][id]||[];
    var h='<div class="vac-nat-hint">Consulte cada ficha para saber quem deve vacinar, idade de início, número de doses, intervalos, contraindicações relevantes e eventuais critérios do SUS. SBIm é uma recomendação clínica; PNI/RIE define elegibilidade pública. Verifique histórico e medicações antes da prescrição.</div>';
    groups.forEach(function(g){h+=viewGroup(g[0],g[1]);});
    h+=fonte==='pni'
      ?'<div class="vac-nat-hint">O PNI determina a oferta e os critérios na rede pública. Esquemas especiais e mudanças da Instrução Normativa 2026 devem ser conferidos antes da prescrição.</div>'
      :'<div class="vac-nat-hint">SBIm: recomendações clínicas para vacinação, inclusive quando não disponíveis na rotina do SUS. Para recuperação de esquemas, utilize o módulo específico da SBIm.</div>';
    h+=showFooter(doc[5],fonte==='sbim'
      ?'Calendários de vacinação SBIm 2026/2027'
      :'Calendário Nacional de Vacinação e Instrução Normativa do PNI 2026');
    output.innerHTML=h;
    sec.classList.add('vac-nat-body');
    sec.style.display='block';
    shell.appendChild(sec);
    // Sem scrollIntoView: o conteúdo é filho do próprio cartão selecionado.
  }
  function menuCalendarios(){
    var menu=get('vac-menu-hub');
    if(!menu)return [];
    return Array.prototype.filter.call(menu.querySelectorAll('button'),function(b){
      var onclick=b.getAttribute('onclick')||'';
      return onclick==="vacAbrirCalendarios('sbim')"||onclick==="vacAbrirCalendarios('pni')";
    });
  }
  function resetMenuExpanded(){
    menuCalendarios().forEach(function(b){b.setAttribute('aria-expanded','false');});
  }
  // NÍVEL 1: abrir seção em tela própria, ocultando os cartões principais.
  // NÍVEL 2: dentro da seção, cada calendário abre/recolhe no próprio local.
  window.vacAbrirCalendarios=function(f){
    var next=(f==='pni'?'pni':'sbim');
    var sec=get('vac-sub-calendarios');
    var menu=get('vac-menu-hub');
    if(!sec||!menu)return;
    preparar();
    // Versões anteriores encaixavam a seção dentro da lista de botões.
    // Devolver ao nível da página antes de ocultar o menu.
    if(menu.contains(sec))menu.after(sec);
    closeNative();
    fonte=next;
    sec.dataset.fonte=next;
    var busca=get('vacCalBusca');
    if(busca)busca.value='';
    var title=sec.querySelector('div[style*="font-size:14px"]');
    if(title)title.textContent=next==='sbim'?'Calendários SBIm 2026/2027':'Calendário Nacional PNI 2026';
    sec.classList.remove('vac-cal-inline-root');
    sec.style.display='none';
    resetMenuExpanded();
    // Mesmo padrão de navegação dos outros cartões principais da Central.
    if(typeof window.vacShowSub==='function')window.vacShowSub('calendarios');
    else {menu.style.display='none';sec.style.display='block';}
    sec.style.display='block';
    drawList();
    // A transição de seção começa no topo; a expansão do item final
    // permanece inline e não realiza qualquer rolagem automática.
    window.scrollTo(0,0);
    var area=document.querySelector('.scroll-area');
    if(area)area.scrollTop=0;
  };
  window.vacSelecionarFonteCalendarios=function(f){window.vacAbrirCalendarios(f);};
  window.vacFiltrarCalendarios=function(){closeNative();drawList();};
  window.vacFecharCalendario=function(){closeNative();};
  window.vacFecharCalendariosNivel=function(){
    closeNative();
    resetMenuExpanded();
    if(typeof window.vacShowHub==='function')window.vacShowHub();
    else {
      var menu=get('vac-menu-hub'),sec=get('vac-sub-calendarios');
      if(menu)menu.style.display='block';
      if(sec)sec.style.display='none';
    }
    window.scrollTo(0,0);
    var area=document.querySelector('.scroll-area');
    if(area)area.scrollTop=0;
  };
  var velhaMostrarHub=window.vacShowHub;
  if(typeof velhaMostrarHub==='function'){
    window.vacShowHub=function(){
      velhaMostrarHub.apply(this,arguments);
      var covid=get('vac-cal-covid');
      if(covid)covid.open=false;
      resetMenuExpanded();
      closeNative();
    };
  }
  // Não interferir na navegação de outras áreas do app.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',preparar);
  else preparar();
})();
