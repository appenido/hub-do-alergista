/* Central de Vacinas — síntese estruturada e consultável, sem PDFs ou cadastro.
 * Fontes primárias:
 * SBIm: https://sbim.org.br/calendario-de-vacinacao (edição 2026/2027);
 * MS/PNI: https://www.gov.br/saude/pt-br/vacinacao/calendario (2026).
 * Resumo de aplicação clínica: não reproduz integralmente notas dos editores.
 */
(function(){
  'use strict';
  var ORIGENS={
    sbim:{nome:'SBIm 2026/2027',url:'https://sbim.org.br/calendario-de-vacinacao',rotulo:'Recomendação SBIm (pode diferir do SUS e da bula)'},
    pni:{nome:'PNI 2026 · SUS',url:'https://www.gov.br/saude/pt-br/vacinacao/calendario',rotulo:'Oferta programática do SUS, conforme indicação e elegibilidade'}
  };
  function c(v,quando,esquema,nota){return {vacina:v,quando:quando,esquema:esquema,nota:nota||''};}
  var DATA = {
    pni:[
      {id:'crianca',nome:'Crianças',faixa:'0 a 9 anos e 11 meses',itens:[
        c('BCG e hepatite B','Ao nascer','BCG intradérmica única; hepatite B nas primeiras 12–24 horas','Adiar BCG conforme contraindicações. RN de mãe HBsAg positiva requer imunoglobulina específica.'),
        c('Pentavalente DTPw-HB-Hib','2, 4 e 6 meses','Série primária com três doses','Complementar com reforços de DTP aos 15 meses e aos 4 anos.'),
        c('Poliomielite inativada (VIP)','2, 4 e 6 meses','Três doses primárias','Conferir idade e reforços atualizados do PNI; calendário público cita 15 meses e 4 anos.'),
        c('Rotavírus humano','2 e 4 meses','Duas doses por via oral','Respeitar os limites ampliados da normativa de 2026: D1 até 11 meses e 29 dias; D2 até 23 meses e 29 dias. Contraindicada em SCID e história de invaginação.'),
        c('Pneumocócica conjugada VPC20/VPC10','2, 4 e 12 meses','Duas doses primárias + reforço aos 12 meses','A oferta está em transição de VPC10 para VPC20; considerar as notas da normativa e o produto fornecido.'),
        c('Meningocócica C e ACWY','3, 5 e 12 meses','MenC aos 3 e 5 meses; MenACWY aos 12 meses','MenACWY também entre 11 e 14 anos; MenB não integra a rotina universal do SUS.'),
        c('Influenza','A partir de 6 meses','Anual; na primovacinação de menores de 9 anos, duas doses com intervalo ≥ 4 semanas','Rotina SUS para crianças na faixa indicada pelo PNI.'),
        c('COVID-19','6, 7 e 9 meses, conforme produto','O esquema com Comirnaty descrito pelo MS tem três doses','Atualizações e reforços para grupos especiais exigem consulta à orientação vigente do MS.'),
        c('Febre amarela','9 meses e 4 anos','Primeira dose aos 9 meses e reforço aos 4 anos','Doses excepcionais entre 6 e 8 meses exigem avaliação individual de risco epidemiológico.'),
        c('Tríplice viral','12 e 15 meses','Duas doses, com segunda dose aos 15 meses','Conferir idade mínima de aplicação e intervalos em atrasos.'),
        c('Varicela','15 meses e 4 anos','Primeira dose aos 15 meses; segunda aos 4 anos','Pode integrar a tetraviral em condições previstas no calendário.'),
        c('Hepatite A','15 meses','Dose única na rotina do SUS','SBIm recomenda esquema de duas doses para hepatite A, com intervalo ≥ 6 meses.'),
        c('HPV','A partir de 9 anos','Dose única na rotina para meninas e meninos de 9 a 14 anos','Para não vacinados de 15–19 anos observar estratégias regionais temporárias e grupos especiais.')
      ]},
      {id:'adolescente',nome:'Adolescentes e jovens',faixa:'10 a 24 anos',itens:[
        c('HPV quadrivalente','9 a 14 anos','Uma dose de rotina','Não vacinados de 15 a 19 anos: seguir estratégia de resgate vigente em cada localidade. Imunocomprometidos possuem esquemas diferenciados.'),
        c('Dengue tetravalente','10 a 14 anos','Duas doses conforme esquema de produto e estratégia da rede pública','Acesso e faixa etária da campanha podem variar; verificar recomendações atualizadas.'),
        c('Meningocócica ACWY','11 a 14 anos','Uma dose no calendário nacional','Para grupos de alto risco, esquemas e reforços são distintos.'),
        c('Hepatite B','Conforme histórico','Completar três doses (0, 1 e 6 meses)','Não reiniciar séries comprovadamente iniciadas.'),
        c('Tríplice viral','Conforme histórico','Duas doses documentadas','Trabalhadores de saúde exigem duas doses, independentemente da idade.'),
        c('dT','Revisão e reforços','Esquema básico de três doses, se necessário; reforço a cada 10 anos','Em ferimentos de risco, antecipar reforço conforme histórico e indicação.'),
        c('Febre amarela','Conforme histórico e risco','Atualizar vacinação conforme idade e indicação epidemiológica','Avaliar riscos de vacina viva em imunodeprimidos.'),
        c('Varicela','Grupos previstos pelo SUS','Duas doses para trabalhadores de saúde e povos indígenas suscetíveis','Não constitui oferta universal para todo adolescente saudável.')
      ]},
      {id:'adulto',nome:'Adultos',faixa:'25 a 59 anos',itens:[
        c('Hepatite B','Conforme histórico','Três doses no esquema 0, 1 e 6 meses','Completar série sem reiniciar.'),
        c('dT e dTpa','Conforme histórico','dT: três doses se não vacinado; reforço a cada 10 anos','dTpa para gestantes e trabalhadores de saúde em situações específicas.'),
        c('Tríplice viral','Conforme idade e histórico','Até 29 anos: duas doses; 30 a 59 anos: uma dose','Trabalhadores de saúde: duas doses.'),
        c('Febre amarela','Conforme histórico e risco','Atualizar situação vacinal segundo indicação','Contraindicações devem ser consideradas caso a caso.'),
        c('Varicela','Grupos especiais','Duas doses para trabalhadores de saúde e povos indígenas suscetíveis','Não há oferta universal para adultos hígidos.'),
        c('Pneumocócica conjugada VPC20','Grupos previstos','Uma dose para indígenas elegíveis e grupos especiais conforme normas','Não é oferta universal de rotina do SUS para todos os adultos.'),
        c('Influenza, COVID-19 e outras especiais','Conforme grupo de risco','Esquemas e periodicidade definidos na normativa vigente','Gestantes, imunossuprimidos e pessoas com comorbidades seguem recomendações específicas.')
      ]},
      {id:'idoso',nome:'Idosos',faixa:'60 anos ou mais',itens:[
        c('Influenza','Todos os anos','Uma dose por temporada','Avaliar campanhas regionais e formulações disponíveis.'),
        c('COVID-19','Rotina de pessoas idosas','Uma dose semestral','Esquema ajustado conforme atualizações de produto e grupos de risco.'),
        c('Pneumocócica VPC20','Subgrupos previstos','Uma dose conforme elegibilidade','PNI 2026: indígenas; acamados ou institucionalizados de 60–84 anos; e todos a partir de 85 anos.'),
        c('Hepatite B','Conforme histórico','Completar três doses','A resposta imunológica pode ser reduzida em alguns pacientes.'),
        c('dT','Conforme histórico','Esquema básico quando necessário e reforço a cada 10 anos','Antecipar para 5 anos na presença de ferimentos de risco.'),
        c('Febre amarela','Situações excepcionais','Avaliação individual de risco e benefício em não vacinados','Maior cautela quanto aos eventos adversos graves nessa faixa etária.'),
        c('Tríplice viral e varicela','Trabalhadores de saúde / indígenas elegíveis','Conforme susceptibilidade e indicação específica','Evitar vacinas vivas em condições de imunossupressão relevante.')
      ]},
      {id:'gestante',nome:'Gestantes',faixa:'Pré-natal e puerpério',itens:[
        c('Hepatite B e dT','Qualquer fase, conforme histórico','Completar os esquemas básicos, preferencialmente durante a gestação','Avaliar necessidade de profilaxia pós-exposição.'),
        c('Influenza','Qualquer trimestre','Uma dose por temporada','Recomendada em todas as gestações.'),
        c('COVID-19','Durante a gestação','Uma dose em cada gestação, segundo norma atual','Considerar histórico e esquema específico de grupos especiais.'),
        c('dTpa','A partir de 20 semanas','Uma dose em cada gestação','Mesmo que previamente vacinada.'),
        c('VSR materna','A partir de 28 semanas','Uma dose em cada gestação na rotina do SUS','Verificar produto, intervalo e recomendações epidemiológicas vigentes.'),
        c('Febre amarela','Excepcional','Somente após avaliação individual de risco-benefício','Vacina viva em geral evitada; considerar exposição epidemiológica inevitável.')
      ]}
    ],
    sbim:[
      {id:'prematuro',nome:'Prematuros',faixa:'Primeiro ano de vida',itens:[
        c('BCG','Após atingir 2.000 g','Uma dose intradérmica','Revisar suspeita de imunodeficiência e exposição intrauterina a biológicos.'),
        c('Hepatite B','Nas primeiras 12 horas e continuidade','Quatro doses para peso < 2.000 g ou idade gestacional < 33 semanas: 0, 2, 4 e 6 meses','Exposição materna ao HBV: associar imunoglobulina específica.'),
        c('Rotavírus','2, 4 e eventualmente 6 meses','RV1: duas doses; RV5: três doses; calendário pela idade cronológica','Evitar administração durante internação hospitalar e avaliar contraindicacões.'),
        c('DTPa, Hib, VIP e pneumocócicas','A partir de 2 meses cronológicos','Preferir vacinas acelulares e conjugadas; esquema infantil correspondente','Prematuros extremos elegíveis podem ter indicação na Rede de Imunobiológicos Especiais.'),
        c('Meningocócica ACWY e B','A partir de 3 meses','Esquemas por marca/idade; reforços previstos','Preferir ACWY quando disponível; MenB não universal no SUS.'),
        c('Influenza e COVID-19','A partir de 6 meses','Segundo faixa etária cronológica e produto','Cuidadores e contactantes devem estar protegidos.'),
        c('Nirsevimabe (VSR)','No primeiro ano, conforme critérios','Anticorpo monoclonal: dose única IM ajustada ao peso','Critérios PNI e SBIm diferem em faixas e sazonalidade; é imunização passiva, não vacina.')
      ]},
      {id:'crianca',nome:'Crianças',faixa:'Nascimento a 9 anos',itens:[
        c('BCG e hepatite B','Ao nascer','BCG em dose única; hepatite B imediatamente após o nascimento','Ajustar em prematuros e filhos de mães HBsAg positivas.'),
        c('Rotavírus','2 e 4 meses ou 2, 4 e 6 meses','RV1 duas doses; RV5 três doses','A SBIm adota limites de resgate em atraso que exigem avaliação e podem configurar uso fora de bula.'),
        c('DTPa, Hib, poliomielite e hepatite B','2, 4 e 6 meses','Série básica em combinações acelulares; reforços conforme antígenos','DTPa preferida à DTPw na rede privada.'),
        c('Pneumocócicas conjugadas','Início aos 2 meses','VPC20/VPC15; primovacinação e reforço conforme marca e início','VPC20 amplia sorotipos em relação à VPC10.'),
        c('Meningocócica ACWY e meningocócica B','Início aos 3 meses','Doses e reforços de acordo com vacina e faixa etária','Ambas recomendadas pela SBIm; MenB não é rotina universal no SUS.'),
        c('Influenza','A partir de 6 meses','Anual; primeira vacinação de menores de 9 anos: duas doses','A partir de 6 meses conforme formulações e campanhas.'),
        c('Febre amarela','9 meses e 4 anos','Doses conforme calendário e histórico','Em condições especiais avaliar vacina viva e risco de exposição.'),
        c('Tríplice viral e varicela','A partir de 12 meses','Duas doses para cada antígeno','Disponibilidade de apresentações combinadas varia por rede.'),
        c('Hepatite A','A partir de 12 meses','Duas doses, separadas por pelo menos 6 meses','PNI de rotina adota uma dose aos 15 meses.'),
        c('HPV','A partir de 9 anos','Preferir vacina nonavalente e esquema de acordo com produto/idade','PNI disponibiliza HPV4 com rotina e grupos especiais próprios.'),
        c('Dengue','A partir da idade aprovada','Esquema conforme marca, histórico e risco','Diferenciar vacinas e restrições em soronegativos; contraindicações para vacinas vivas.')
      ]},
      {id:'adolescente',nome:'Adolescentes',faixa:'10 a 19 anos',itens:[
        c('HPV','A partir de 9 anos','Preferir HPV9; esquema segundo idade, histórico e imunocompetência','A SBIm não equivale ao esquema de uma dose do PNI.'),
        c('Meningocócicas ACWY e B','Adolescência','ACWY e MenB com reforços conforme idade e marca','Risco epidemiológico e uso off-label devem ser avaliados.'),
        c('dTpa','Conforme histórico','Reforço de coqueluche e tétano/difteria','A SBIm prefere componente pertussis no reforço.'),
        c('Tríplice viral, varicela, hepatites A e B','Conforme histórico','Completar esquemas de duas doses (SCR, varicela, hepatite A) ou três doses (HB)','Não reiniciar esquemas em atraso.'),
        c('Influenza','Anual','Uma dose por temporada','Em grupos de risco verificar particularidades.'),
        c('Febre amarela e dengue','Conforme exposição e idade','Atualização pela história vacinal; dengue conforme produto','Avaliar indicação epidemiológica e contraindicações.')
      ]},
      {id:'adulto',nome:'Adultos',faixa:'20 a 59 anos',itens:[
        c('dTpa, dT','Conforme histórico','Preferir dTpa, completar primovacinação e reforçar a cada 10 anos','Situações especiais e contatos de lactentes exigem análise específica.'),
        c('Influenza','Anual','Uma dose por temporada','Preferir formulação recomendada para a temporada.'),
        c('Pneumocócica conjugada VPC20','A partir de 50 anos','Uma dose em adultos hígidos com recomendação SBIm','PNI limita oferta universal: não confundir recomendação com cobertura SUS.'),
        c('Herpes-zóster recombinante','A partir de 50 anos','Duas doses, geralmente 0 e 2 meses','Imunocomprometidos podem ter indicação a partir de 18 anos.'),
        c('Tríplice viral, varicela e hepatites A/B','Conforme histórico','SCR e varicela: duas doses se suscetível; hepatite A duas; hepatite B três','Vacinas vivas podem ser contraindicadas na imunossupressão.'),
        c('HPV','Até os 45 anos; exceções específicas','Conforme idade e marca; acima de 45 mediante decisão compartilhada','Preferir HPV9 quando disponível.'),
        c('Meningocócicas ACWY e B','Conforme epidemiologia e risco','Esquemas dependem do contexto e marca','Não são rotina universal da rede pública para adultos hígidos.'),
        c('Dengue, febre amarela e COVID-19','Conforme indicação','Doses conforme produto, idade e situação vacinal','Revisar recomendações e contraindicações individuais.'),
        c('VSR','Não rotineira a todos os adultos 20–59','Avaliar condições especiais','SBIm 2026/27 não a recomenda universalmente nessa faixa.')
      ]},
      {id:'idoso',nome:'Idosos',faixa:'60 anos ou mais',itens:[
        c('Influenza','Todos os anos','Uma dose por temporada; preferir formulações de maior imunogenicidade quando indicadas','Considerar risco individual e disponibilidade.'),
        c('Pneumocócica conjugada VPC20','A partir de 60 anos, conforme histórico','Estratégia conjugada e eventuais sequências dependem do histórico vacinal','No SUS, elegibilidade específica por idade, condição ou vulnerabilidade.'),
        c('Herpes-zóster recombinante','A partir de 50 anos','Duas doses, com intervalo padrão de dois meses','Vacina não viva; considerar o histórico de vacinação e imunossupressão.'),
        c('Vírus sincicial respiratório','Segundo recomendação SBIm para idade e risco','Uma dose conforme produto e indicação','No SUS, vacina VSR da rotina é materna, não universal para idosos.'),
        c('Hepatite B, dTpa, hepatite A e SCR','Conforme suscetibilidade/histórico','Completar esquemas indicados','Vacinas vivas exigem individualização, principalmente em imunossuprimidos.'),
        c('COVID-19 e febre amarela','Conforme risco e histórico','Dose COVID-19 conforme PNI/temporada; febre amarela com avaliação individual','Febre amarela requer atenção adicional ao risco de eventos graves em idosos.')
      ]},
      {id:'gestante',nome:'Gestantes',faixa:'Durante a gestação',itens:[
        c('Influenza','Em qualquer trimestre','Uma dose a cada temporada','Vacina inativada.'),
        c('dTpa','A partir da 20ª semana','Uma dose a cada gestação','Proteção indireta do lactente contra coqueluche.'),
        c('VSR materna','A partir de 28 semanas','Uma dose em cada gestação segundo produto e indicação','Checar intervalo gestacional aprovado pela Anvisa para a apresentação utilizada.'),
        c('Hepatite B, dT e COVID-19','Conforme histórico e indicação','Atualizar esquemas durante o pré-natal','Febre amarela só em situações epidemiológicas especiais após avaliação.'),
        c('Vacinas vivas','Durante a gravidez','Em geral, contraindicadas','Tríplice viral, varicela e outras vivas requerem avaliação no puerpério.')
      ]},
      {id:'ocupacional',nome:'Saúde e ocupacional',faixa:'Conforme riscos profissionais',itens:[
        c('Hepatite B','Profissionais expostos','Três doses e avaliação de resposta sorológica quando indicada','Considerar medidas pós-exposição.'),
        c('dTpa e influenza','Profissionais da saúde','dTpa e vacinação anual contra influenza','Reforços de dTpa ajustados ao trabalho e ao risco de exposição.'),
        c('Tríplice viral, varicela e meningocócicas','Conforme exposição e suscetibilidade','Duas doses de SCR e varicela; meningocócicas segundo risco','Atenção a laboratórios de microbiologia e contactantes.'),
        c('Raiva, febre amarela e outras','Risco ocupacional específico','Pré e pós-exposição conforme protocolos','Risco de zoonoses e deslocamento define indicação.')
      ]},
      {id:'especiais',nome:'Grupos especiais',faixa:'Imunodeficiência e comorbidades',itens:[
        c('Imunodeficiências e imunossupressão','Antes e durante tratamento','Esquemas inativados ampliados; vivas conforme nível de imunossupressão','Ajustar intervalo em relação a biológicos, quimioterapia e transplante.'),
        c('Asplenia ou deficiência de complemento','Conduta individual','Pneumocócicas e meningocócicas ACWY/B com esquemas ampliados','Avaliar reforços e imunogenicidade.'),
        c('Doença renal/hepática, cardiopatia, pneumopatia, diabetes','Conduta individual','Priorizar influenza, pneumocócicas, hepatites e outras segundo condição','Acesso pelo CRIE/RIE conforme critérios.'),
        c('Imunossuprimidos e herpes-zóster','A partir de 18 anos em indicações específicas','Zóster recombinante em duas doses','Intervalos e momento antes da imunossupressão devem ser individualizados.'),
        c('Transplante, imunodeficiência primária, HIV','Condição específica','Necessária avaliação por diretriz de pacientes especiais','Este resumo não substitui os esquemas por doença, tratamento e idade.')
      ]}
    ]
  };
  var estado={fonte:'sbim',grupo:'crianca',busca:''};
  function el(id){return document.getElementById(id);}
  function esc(t){return String(t==null?'':t).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});}
  function ensureStyle(){
    if(el('vc26Style'))return;
    var s=document.createElement('style');s.id='vc26Style';s.textContent=
      '.vc26-fontes{display:flex;gap:8px;margin:0 16px 10px}.vc26-fontes button{flex:1;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;padding:9px;font:700 12px Manrope,sans-serif;color:#64748b;cursor:pointer}.vc26-fontes button[aria-pressed=true]{background:#e6f7f9;border-color:#2d8fa8;color:#165771}' +
      '.vc26-grupos{display:flex;gap:8px;overflow-x:auto;padding:3px 16px 12px;scrollbar-width:thin}.vc26-grupos button{white-space:nowrap;flex:0 0 auto;border:1.5px solid #e2e8f0;border-radius:20px;background:#fff;font:700 11px Manrope,sans-serif;padding:9px 12px;cursor:pointer}.vc26-grupos button[aria-pressed=true]{background:#0d1f2d;color:white;border-color:#0d1f2d}' +
      '.vc26-head{padding:0 16px 12px}.vc26-head h3{font-size:14px;color:#0d1f2d;margin-bottom:4px}.vc26-head p{color:#64748b;font-size:11px;line-height:1.5}' +
      '.vc26-grid{padding:0 16px 12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.vc26-grid details{background:white;border:1.5px solid #e2e8f0;border-radius:12px;min-width:0}.vc26-grid summary{padding:12px;cursor:pointer;list-style:none;font-size:12px;font-weight:800;color:#0d1f2d;line-height:1.4}.vc26-grid summary span{display:block;font-size:10px;color:#64748b;font-weight:500;margin-top:5px}.vc26-grid article{border-top:1px solid #e2e8f0;padding:10px 12px;font-size:11px;line-height:1.6;color:#1b3544}.vc26-grid article div+div{margin-top:7px}.vc26-grid details[open]{grid-column:span 2;border-color:#2d8fa8}' +
      '.vc26-src{padding:9px 12px;margin:0 16px 14px;border-radius:10px;background:#f4f8fa;font-size:10.5px;line-height:1.5;color:#64748b}.vc26-src a{color:#146781;text-decoration:underline}' +
      '@media(min-width:700px){.vc26-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.vc26-grid details[open]{grid-column:span 2}}';
    document.head.appendChild(s);
  }
  function render(){
    var root=el('vac26Integra');if(!root)return;
    ensureStyle();
    var fonte=DATA[estado.fonte], meta=ORIGENS[estado.fonte];
    var grupo=fonte.find(function(g){return g.id===estado.grupo;})||fonte[0]; estado.grupo=grupo.id;
    var grupos=fonte.map(function(g){return '<button type="button" data-vc-grupo="'+esc(g.id)+'" aria-pressed="'+(g.id===grupo.id?'true':'false')+'">'+esc(g.nome)+'</button>';}).join('');
    var pesquisa=estado.busca.toLowerCase().trim();
    var itens=grupo.itens.filter(function(it){return !pesquisa||(it.vacina+' '+it.quando+' '+it.esquema+' '+it.nota).toLowerCase().indexOf(pesquisa)>=0;});
    var corpo=itens.map(function(it,i){return '<details><summary>'+esc(it.vacina)+'<span>'+esc(it.quando)+'</span></summary><article><div>Esquema: '+esc(it.esquema)+'</div>'+(it.nota?'<div>Observações: '+esc(it.nota)+'</div>':'')+'</article></details>';}).join('');
    root.innerHTML=
      '<div class="vc26-fontes" role="group" aria-label="Fonte do calendário">'+
        '<button type="button" data-vc-fonte="sbim" aria-pressed="'+(estado.fonte==='sbim')+'">SBIm 2026/2027</button>'+
        '<button type="button" data-vc-fonte="pni" aria-pressed="'+(estado.fonte==='pni')+'">PNI 2026 · SUS</button></div>'+
      '<div class="vc26-grupos" aria-label="Selecionar faixa etária ou grupo">'+grupos+'</div>'+
      '<div class="vc26-head"><h3>'+esc(grupo.nome)+' · '+esc(meta.nome)+'</h3><p>'+esc(grupo.faixa)+' · '+esc(meta.rotulo)+' · Toque na vacina para ver doses e observações.</p></div>'+
      '<div class="vc26-grid">'+(corpo||'<p style="font-size:12px;color:#64748b">Nenhum resultado nessa faixa etária.</p>')+'</div>'+
      '<p class="vc26-src">Referência: '+esc(meta.nome)+'. Conteúdo clínico sintetizado em português, sem PDF incorporado, sem coleta de dados. '+
        '<a href="'+meta.url+'" target="_blank" rel="noopener noreferrer">Página institucional para atualizações</a>. Recomendações podem exigir decisão médica e confirmação de bula.</p>';
    root.querySelectorAll('[data-vc-fonte]').forEach(function(b){b.onclick=function(){estado.fonte=b.getAttribute('data-vc-fonte');estado.grupo='crianca';estado.busca='';render();};});
    root.querySelectorAll('[data-vc-grupo]').forEach(function(b){b.onclick=function(){estado.grupo=b.getAttribute('data-vc-grupo');estado.busca='';render();};});
  }
  window.vac26Abrir=function(fonte,grupo){estado.fonte=fonte==='pni'?'pni':'sbim';estado.grupo=grupo||'crianca';estado.busca='';if(typeof window.vacShowSub==='function')window.vacShowSub('vacinas');render();};
  window.vac26Render=render;
  window.vac26SetGrupo=function(grupo){estado.grupo=grupo;estado.busca='';render();};
  window.vac26Filtrar=function(q){estado.busca=q||'';render();};
  document.addEventListener('DOMContentLoaded',function(){if(el('vac26Integra'))render();});
}());