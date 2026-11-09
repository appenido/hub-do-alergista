/* Hub do Alergista — Biblioteca de calendários vacinais.
   Fontes oficiais consultadas em 04/11/2026.
   Os PDFs são exibidos diretamente do domínio de seus editores;
   nenhuma recomendação clínica é inferida deste catálogo. */
(function () {
  'use strict';
  var BASE = 'https://sbim.org.br/images/';
  var LIVRETO = BASE + 'livreto-Calend-SBIm-2026-27-260619a.pdf_2026-06-19.pdf';
  var PNI = 'https://www.gov.br/saude/pt-br/vacinacao/arquivos/';
  var SBIM = [
    {id:'prematuro', emoji:'👶', titulo:'Prematuros', subtitulo:'Primeiro ano de vida', grupo:'Faixas etárias',
      url:LIVRETO+'#page=4', origem:'Seção específica no livreto integral SBIm 2026/2027', pdf:true},
    {id:'crianca', emoji:'🧸', titulo:'Crianças', subtitulo:'Do nascimento até antes dos 10 anos', grupo:'Faixas etárias',
      url:BASE+'crianca-Calend-SBIm-2026-27-260619.pdf_2026-06-19.pdf', origem:'Calendário individual SBIm 2026/2027', pdf:true},
    {id:'adolescente', emoji:'🎒', titulo:'Adolescentes', subtitulo:'10 a 19 anos', grupo:'Faixas etárias',
      url:BASE+'adolescente-Calend-SBIm-2026-27-260619.pdf_2026-06-19.pdf', origem:'Calendário individual SBIm 2026/2027', pdf:true},
    {id:'adulto', emoji:'🧑', titulo:'Adultos', subtitulo:'20 a 59 anos', grupo:'Faixas etárias',
      url:LIVRETO, origem:'Seção adulto no livreto integral SBIm 2026/2027', pdf:true},
    {id:'idoso', emoji:'🧓', titulo:'Idosos', subtitulo:'A partir de 60 anos', grupo:'Faixas etárias',
      url:LIVRETO+'#page=9', origem:'Seção idoso no livreto integral SBIm 2026/2027', pdf:true},
    {id:'gestante', emoji:'🤰', titulo:'Gestantes', subtitulo:'Gestação e puerpério', grupo:'Grupos e situações',
      url:BASE+'gestante-Calend-SBIm-2026-27-260619.pdf_2026-06-19.pdf', origem:'Calendário individual SBIm 2026/2027', pdf:true},
    {id:'ocupacional', emoji:'🩺', titulo:'Ocupacional', subtitulo:'Trabalhadores e risco profissional', grupo:'Grupos e situações',
      url:BASE+'ocupacional-Calend-SBIm-2026-27-260202.pdf_2026-02-02.pdf', origem:'Calendário ocupacional SBIm 2026/2027', pdf:true},
    {id:'especiais', emoji:'🛡️', titulo:'Pacientes especiais', subtitulo:'Comorbidades, imunodeficiências e imunossupressão', grupo:'Grupos e situações',
      url:BASE+'calend-vacinacao-pacientes-especiais-2026-27-260617a.pdf_2026-06-24.pdf', origem:'Manual de calendários SBIm pacientes especiais 2026/2027', pdf:true},
    {id:'atraso', emoji:'⏱️', titulo:'Esquemas em atraso', subtitulo:'Recuperação de doses e intervalos mínimos', grupo:'Grupos e situações',
      url:'https://sbim.org.br/calendario-de-vacinacao/esquemas-em-atraso', origem:'Página oficial SBIm; também disponível em Recuperação de doses no Hub', pdf:false},
    {id:'resumo-infantil', emoji:'📋', titulo:'Resumo: nascimento a 19 anos', subtitulo:'Visão longitudinal; consultar quadros etários', grupo:'Compilações',
      url:BASE+'calend-sbim-0-100-2026-27-260422.pdf_2026-04-22.pdf', origem:'Quadro SBIm 2026/2027 do nascimento à terceira idade', pdf:true},
    {id:'resumo-adulto', emoji:'📋', titulo:'Resumo: 20 anos a 60+', subtitulo:'Adultos, idosos e gestantes', grupo:'Compilações',
      url:BASE+'calend-20-60mais-2026-27-260422-web.pdf_2026-04-22.pdf', origem:'Resumo SBIm 2026/2027 dos 20 anos aos 60+', pdf:true},
    {id:'unico', emoji:'🗂️', titulo:'Calendário único: 0 a 100+', subtitulo:'Do nascimento à terceira idade', grupo:'Compilações',
      url:BASE+'calend-sbim-0-100-2026-27-260422.pdf_2026-04-22.pdf', origem:'Quadro único SBIm 2026/2027', pdf:true},
    {id:'livreto', emoji:'📚', titulo:'Livreto completo SBIm', subtitulo:'Todos os calendários, notas e referências', grupo:'Compilações',
      url:LIVRETO, origem:'Compilado oficial SBIm 2026/2027 (19/06/2026)', pdf:true}
  ];
  var CAL_PNI = [
    {id:'crianca',emoji:'🧸',titulo:'Crianças',subtitulo:'0 a 9 anos, 11 meses e 29 dias',grupo:'Calendários por idade',
      url:PNI+'calendario-nacional-de-vacinacao-crianca',origem:'Ministério da Saúde — Calendário Nacional 2026',pdf:true},
    {id:'adolescente-jovem',emoji:'🎒',titulo:'Adolescentes e jovens',subtitulo:'10 a 24 anos, 11 meses e 29 dias',grupo:'Calendários por idade',
      url:PNI+'calendario-nacional-de-vacinacao-adolescentes-jovens',origem:'Ministério da Saúde — Calendário Nacional 2026',pdf:true},
    {id:'adulto',emoji:'🧑',titulo:'Adultos',subtitulo:'25 a 59 anos, 11 meses e 29 dias',grupo:'Calendários por idade',
      url:PNI+'calendario-nacional-de-vacinacao-adulto',origem:'Ministério da Saúde — Calendário Nacional 2026',pdf:true},
    {id:'idoso',emoji:'🧓',titulo:'Idosos',subtitulo:'A partir de 60 anos',grupo:'Calendários por idade',
      url:PNI+'calendario-nacional-de-vacinacao-idoso',origem:'Ministério da Saúde — Calendário Nacional 2026',pdf:true},
    {id:'gestante',emoji:'🤰',titulo:'Gestantes',subtitulo:'Calendário nacional da gestação',grupo:'Grupos e documentos técnicos',
      url:PNI+'calendario-nacional-de-vacinacao-gestante',origem:'Ministério da Saúde — Calendário Nacional 2026',pdf:true},
    {id:'normativa',emoji:'📑',titulo:'Instrução Normativa 2026',subtitulo:'Esquemas, indicações e critérios operacionais',grupo:'Grupos e documentos técnicos',
      url:'https://www.gov.br/saude/pt-br/vacinacao/publicacoes/instrucao-normativa-que-instrui-o-calendario-nacional-de-vacinacao-2026.pdf/view',origem:'Ministério da Saúde — Instrução Normativa do PNI 2026',pdf:false},
    {id:'rie',emoji:'🏥',titulo:'Situações especiais — CRIE/RIE',subtitulo:'Acesso à rede e orientação para grupos específicos',grupo:'Grupos e documentos técnicos',
      url:'https://www.gov.br/saude/pt-br/vacinacao/calendario',origem:'Ministério da Saúde — encaminhamento a CRIE/RIE e calendário técnico',pdf:false}
  ];
  var modo = 'sbim', listaAtiva = [], selecionado = '';
  var painel = null;
  var get = function(id){ return document.getElementById(id); };
  function sanitizar(t) { return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function estrutura() {
    if(get('vac-cal-estilos')) return;
    var style=document.createElement('style'); style.id='vac-cal-estilos';
    style.textContent=
      '.vac-cal-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 16px 12px}' +
      '.vac-cal-tabs button{background:#fff;border:1.5px solid #e2e8f0;color:#64748b;border-radius:11px;padding:12px 8px;cursor:pointer;font:700 12px Manrope,sans-serif}' +
      '.vac-cal-tabs button.ativo{background:#e8f7f9;color:#15576b;border-color:#2d8fa8}' +
      '.vac-cal-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-bottom:16px}' +
      '.vac-cal-card{width:100%;text-align:left;padding:14px 12px;min-height:118px;background:#fff;border:1.5px solid #e2e8f0;border-radius:14px;cursor:pointer;color:#0d1f2d;display:flex;flex-direction:column;gap:7px;font-family:Manrope,sans-serif}' +
      '.vac-cal-card[aria-pressed=true]{border-color:#2d8fa8;background:#effafb}' +
      '.vac-cal-card:focus-visible{outline:3px solid #2d8fa8;outline-offset:2px}' +
      '.vac-cal-card .cal-ico{font-size:24px;line-height:1.2}' +
      '.vac-cal-card .cal-nome{font-size:12.5px;line-height:1.3;font-weight:800}' +
      '.vac-cal-card .cal-sub{font-size:10.5px;color:#64748b;line-height:1.45}' +
      '.vac-cal-grupo{font-size:12px;color:#0d1f2d;margin:16px 0 9px;font-weight:800}' +
      '.vac-cal-visualizador{margin:14px 0 10px;background:#fff;border:1.5px solid #cfdee5;border-radius:13px;padding:12px}' +
      '.vac-cal-frame{border:1px solid #e2e8f0;background:#fafafa;width:100%;height:72vh;min-height:410px;border-radius:8px}' +
      '.vac-cal-link{display:inline-flex;align-items:center;justify-content:center;padding:10px 12px;border-radius:9px;font-size:11px;font-weight:700;text-decoration:none;color:#fff;background:#1f6980}' +
      '.vac-cal-nota{font-size:11.5px;color:#64748b;line-height:1.6;margin:0 16px 12px}' +
      '@media(min-width:750px){.vac-cal-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.vac-cal-card{min-height:110px}}';
    document.head.appendChild(style);
  }
  function desenhar() {
    painel=get('vacCalendariosLista');
    if(!painel) return;
    listaAtiva=(modo==='pni'?CAL_PNI:SBIM);
    var t=get('vacCalBusca'), termo=t?t.value.trim().toLocaleLowerCase('pt-BR'):'';
    var leg=get('vacCalLegenda');
    if(leg) leg.textContent=modo==='pni'
      ? 'Fonte: Ministério da Saúde / Programa Nacional de Imunizações (PNI), edição 2026. A oferta gratuita depende das indicações da normativa vigente e da situação do paciente.'
      : 'Fonte: Sociedade Brasileira de Imunizações (SBIm), edição 2026/2027. As recomendações científicas não equivalem à oferta de todas as vacinas na rede pública.';
    var a=get('vacCalTabSBIm'),b=get('vacCalTabPNI');
    if(a){a.classList.toggle('ativo',modo==='sbim');a.setAttribute('aria-selected',modo==='sbim'?'true':'false');}
    if(b){b.classList.toggle('ativo',modo==='pni');b.setAttribute('aria-selected',modo==='pni'?'true':'false');}
    var grupos=[];
    listaAtiva.forEach(function(c){if(grupos.indexOf(c.grupo)<0)grupos.push(c.grupo);});
    var html='';
    grupos.forEach(function(g) {
      var itens=listaAtiva.filter(function(c){return c.grupo===g && (c.titulo+' '+c.subtitulo+' '+c.origem).toLocaleLowerCase('pt-BR').indexOf(termo)>=0;});
      if(!itens.length)return;
      html+='<h3 class="vac-cal-grupo">'+sanitizar(g)+'</h3><div class="vac-cal-grid">';
      itens.forEach(function(c){
        html+='<button type="button" class="vac-cal-card" data-cal-id="'+sanitizar(c.id)+'" aria-pressed="'+(selecionado===c.id?'true':'false')+'" aria-label="Visualizar '+sanitizar(c.titulo)+'">'+
          '<span class="cal-ico" aria-hidden="true">'+c.emoji+'</span><span class="cal-nome">'+sanitizar(c.titulo)+'</span>'+
          '<span class="cal-sub">'+sanitizar(c.subtitulo)+'</span></button>';
      });
      html+='</div>';
    });
    painel.innerHTML=html||'<p class="vac-cal-nota">Nenhum calendário encontrado.</p>';
    painel.querySelectorAll('[data-cal-id]').forEach(function(botao){
      botao.addEventListener('click',function(){ abrir(botao.getAttribute('data-cal-id')); });
    });
    if(selecionado && !listaAtiva.some(function(c){return c.id===selecionado;})) selecionado='';
    var sec=get('vacCalPreview');
    if(sec) sec.style.display=selecionado?'block':'none';
  }
  function abrir(id){
    var doc=listaAtiva.find(function(c){return c.id===id;}); if(!doc)return;
    selecionado=id; desenhar();
    var sec=get('vacCalPreview'); if(!sec)return;
    var titulo=get('vacCalPreviewTitulo'),origem=get('vacCalPreviewOrigem'),link=get('vacCalPreviewLink'),frame=get('vacCalPreviewFrame'),aviso=get('vacCalPreviewAviso');
    if(titulo)titulo.textContent=doc.titulo;
    if(origem)origem.textContent=doc.origem;
    if(link){link.href=doc.url;link.textContent=doc.pdf?'Abrir PDF oficial ↗':'Abrir documento oficial ↗';}
    if(frame){if(doc.pdf){frame.style.display='block';frame.src=doc.url;frame.title='Visualização do calendário '+doc.titulo;}else{frame.removeAttribute('src');frame.style.display='none';}}
    if(aviso)aviso.textContent=doc.pdf
      ?'O documento está hospedado na instituição responsável. Se a visualização não funcionar no celular, use “Abrir PDF oficial”.'
      :'Este documento é exibido no portal oficial. Use o botão para consultar a versão integral.';
    sec.style.display='block';
    sec.scrollIntoView({behavior:'smooth',block:'start'});
  }
  window.vacAbrirCalendarios=function(fonte){
    selecionado='';
    modo=(fonte==='pni')?'pni':'sbim';
    if(typeof window.vacShowSub==='function') window.vacShowSub('calendarios');
    var busca=get('vacCalBusca'); if(busca) busca.value='';
    var frame=get('vacCalPreviewFrame'); if(frame){frame.removeAttribute('src');frame.style.display='none';}
    var sec=get('vacCalPreview'); if(sec)sec.style.display='none';
    estrutura(); desenhar();
  };
  window.vacSelecionarFonteCalendarios=function(fonte){
    modo=(fonte==='pni')?'pni':'sbim'; selecionado='';
    var busca=get('vacCalBusca');if(busca)busca.value='';
    var frame=get('vacCalPreviewFrame');if(frame)frame.removeAttribute('src');
    var sec=get('vacCalPreview');if(sec)sec.style.display='none';
    desenhar();
  };
  window.vacFiltrarCalendarios=function(){ selecionado='';var f=get('vacCalPreviewFrame');if(f)f.removeAttribute('src');desenhar(); };
  window.vacFecharCalendario=function(){selecionado='';var f=get('vacCalPreviewFrame');if(f)f.removeAttribute('src');var sec=get('vacCalPreview');if(sec)sec.style.display='none';desenhar();};
}());


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
    ['Rotavírus','Início a partir de 6 semanas; esquema conforme RV1 ou RV5','Há limites etários de início e término e regras específicas de resgate.'],
    ['DTPa + Hib + VIP ± hepatite B','Iniciar aos 2 meses; esquema primário e reforços na infância','Preferir apresentações combinadas; conferir idade, fabricante e intercambialidade.'],
    ['Pneumocócicas conjugadas','A partir dos 2 meses; esquema conforme a idade de início','SBIm recomenda VPC15/VPC20; avaliar necessidades adicionais nas comorbidades.'],
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
    ['Pneumocócica VPC20','Rotina a partir de 50 anos; antecipar em comorbidades','Esquemas anteriores exigem avaliação dos intervalos e produtos.'],
    ['Herpes-zóster recombinante','A partir de 50 anos; duas doses','Também pode ser indicada antes dos 50 anos em imunossupressão.'],
    ['HPV9','Avaliar indicação segundo idade e condição clínica','Esquema em adultos varia conforme situação imunológica.'],
    ['Dengue','Considerar indicação conforme produto licenciado','Não usar imunizante vivo durante gestação ou imunossupressão.']
  ];
  var IDOSO=[
    ['Influenza','Anual; preferir apresentações mais imunogênicas quando indicadas','A oferta na rede pública pode variar.'],
    ['Pneumocócica conjugada VPC20','Dose única quando não vacinado com conjugada, conforme histórico','Se já recebeu VPP23 ou conjugadas, observar intervalos e esquemas.'],
    ['Herpes-zóster recombinante','Duas doses, habitualmente 0–2 meses','Recomendada mesmo após episódio prévio de zóster.'],
    ['Vírus sincicial respiratório (VSR)','Uma dose; priorizar risco a partir dos 60 e rotina a partir dos 70 anos','Não há recomendação estabelecida de revacinação periódica no calendário de referência.'],
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
    ['VSR materno','Uma dose na gestação, na janela gestacional aprovada e recomendada','Conferir bula e atualização do calendário antes de prescrever.'],
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
    ['Doenças crônicas','Avaliar proteção adicional para pneumo, influenza e hepatites','Risco e recomendação variam por condição.']
  ];
  var PNI_CHILD=[
    ['Ao nascer','BCG e hepatite B','Dose inicial preferencialmente na maternidade.'],
    ['2 meses','Pentavalente, VIP, pneumocócica conjugada e rotavírus','Primeiras doses do esquema básico da criança.'],
    ['3 meses','Meningocócica C','Primeira dose.'],
    ['4 meses','Pentavalente, VIP, pneumocócica conjugada e rotavírus','Segundas doses conforme calendário e produto.'],
    ['5 meses','Meningocócica C','Segunda dose.'],
    ['6 meses','Pentavalente, VIP, influenza e Covid-19 conforme produto','Completar séries iniciais e iniciar vacinas indicadas a partir dessa idade.'],
    ['9 meses','Febre amarela','Primeira dose de rotina.'],
    ['12 meses','Tríplice viral, pneumocócica conjugada e meningocócica ACWY','Reforços e primeira tríplice viral conforme registro.'],
    ['15 meses','DTP, VIP, hepatite A e varicela/tetraviral conforme apresentação','Reforços e atualização do segundo ano.'],
    ['4 anos','DTP, varicela e febre amarela','Reforços da infância; conferir histórico.'],
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
    ['Pneumocócica conjugada','Oferta especial segundo critérios vigentes da rede específica','Não confundir recomendação SBIm com acesso universal no SUS.']
  ];
  var PNI_PREG=[
    ['dTpa','Uma dose a cada gestação segundo janela do PNI','Fundamental para proteção contra coqueluche no lactente.'],
    ['Influenza','Uma dose durante a gestação, a cada temporada','Vacina inativada.'],
    ['Hepatite B','Completar esquema se necessário','Registro e sorologia podem orientar investigação.'],
    ['Covid-19','Esquema e periodicidade da normativa vigente','Utilizar apresentação indicada para gestantes.'],
    ['VSR materno','Uma dose conforme janela gestacional do PNI','Conferir idade gestacional e critérios vigentes.']
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
        ['Outras comorbidades','Avaliar risco infeccioso e elegibilidade','Não pressupor oferta para todos os grupos.']
      ]]]
    }
  };
  var fonte='sbim', selecionado=null;
  var currentDoc=null;

  function preparar(){
    if(!get('vac-sub-calendarios'))return;
    if(!get('vac-nativo-css')){
      var style=document.createElement('style');style.id='vac-nativo-css';
      style.textContent=
       '.vac-nat-card{width:100%;display:flex;align-items:flex-start;gap:10px;text-align:left;background:#fff;border:1.5px solid #dfe8ed;border-radius:12px;padding:13px 12px;cursor:pointer;font:inherit;color:#0d1f2d;min-height:82px}' +
       '.vac-nat-card[aria-pressed="true"]{border-color:#2d8fa8;background:#effafb}' +
       '.vac-nat-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}' +
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
       '@media(min-width:750px){.vac-nat-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}';
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
    if(menu)menu.querySelectorAll('button[onclick*="vacShowSub(\\'atraso\\')"]').forEach(function(b){b.remove();});
    var at=get('vac-sub-atraso');
    if(at && !at.dataset.nativeIntegrated){
      at.dataset.nativeIntegrated='true';
      var back=at.querySelector('button[onclick*="vacShowHub"]');
      if(back){back.setAttribute('onclick',"vacAbrirCalendarios('sbim')");back.setAttribute('aria-label','Voltar aos calendários SBIm');}
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
  function drawList(){
    preparar();
    var list=get('vacCalendariosLista');if(!list)return;
    var docs=fonte==='sbim'?DOC_SBIM:DOC_PNI;
    var busca=get('vacCalBusca');var q=(busca&&busca.value||'').toLocaleLowerCase('pt-BR').trim();
    var grupos=[];
    docs.forEach(function(d){if(grupos.indexOf(d[3])<0)grupos.push(d[3]);});
    var out='';
    grupos.forEach(function(g){
      var itens=docs.filter(function(d){return d[3]===g&&(!q||(d[1]+' '+d[2]).toLocaleLowerCase('pt-BR').indexOf(q)>=0);});
      if(!itens.length)return;
      out+='<h3 class="vac-nat-sec">'+esc(g)+'</h3><div class="vac-nat-grid">';
      itens.forEach(function(d){
        out+='<button type="button" class="vac-nat-card" data-native-id="'+esc(d[0])+'" aria-pressed="'+(selecionado===d[0]?'true':'false')+'"><span aria-hidden="true" style="font-size:24px">'+d[4]+'</span><span style="min-width:0"><span style="display:block;font-size:12px;font-weight:750">'+esc(d[1])+'</span><span style="display:block;color:#64748b;font-size:10.5px;line-height:1.4;margin-top:4px">'+esc(d[2])+'</span></span></button>';
      });
      out+='</div>';
    });
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
  function viewGroup(group,rows){
    var h='<div class="vac-nat-batch"><div class="vac-nat-batch-title">'+esc(group)+'</div>';
    rows.forEach(function(r){
      h+='<details class="vac-nat-item"><summary>'+esc(r[0])+'<span style="display:block;color:#476474;font-weight:400;margin-top:4px">'+esc(r[1])+'</span></summary>'+
        '<div class="vac-nat-detail"><span style="color:#1f6980">Orientação clínica: </span>'+esc(r[2]||'Confira observações e exceções no arquivo original.')+'</div></details>';
    });
    return h+'</div>';
  }
  function openNative(id){
    if(id==='atraso'&&fonte==='sbim'){
      if(typeof window.vacShowSub==='function')window.vacShowSub('atraso');
      if(typeof window.atrRender==='function')window.atrRender();
      return;
    }
    var docs=fonte==='sbim'?DOC_SBIM:DOC_PNI;
    var doc=docs.find(function(d){return d[0]===id;});if(!doc)return;
    selecionado=id;currentDoc=doc;drawList();
    var sec=get('vacCalPreview'),output=get('vacNativeContent');
    if(!sec||!output)return;
    var titulo=get('vacCalPreviewTitulo');if(titulo)titulo.textContent=doc[1];
    var origem=get('vacCalPreviewOrigem');if(origem)origem.textContent=fonte==='sbim'?'Sociedade Brasileira de Imunizações • SBIm 2026/2027':'Ministério da Saúde • PNI 2026';
    var groups=profiles[fonte][id]||[];
    var h='<button type="button" id="vacNativeBack" class="vac-nat-back">← Todos os calendários '+(fonte==='sbim'?'SBIm':'PNI')+'</button>';
    h+='<div class="vac-nat-hint">Consulta didática sem PDF e sem cadastro de pacientes. Abra cada vacina para ler as orientações. Recomendações e esquemas dependem da idade, do produto, do histórico e das condições clínicas.</div>';
    groups.forEach(function(g){h+=viewGroup(g[0],g[1]);});
    if(fonte==='pni'){
      h+='<div class="vac-nat-hint">O PNI determina a oferta e os critérios na rede pública. Esquemas especiais e mudanças da Instrução Normativa 2026 devem ser conferidos antes da prescrição.</div>';
    }else{
      h+='<div class="vac-nat-hint">SBIm: recomendações clínicas para vacinação, inclusive quando não disponíveis na rotina do SUS. Para recuperação de esquemas, utilize o módulo específico da SBIm.</div>';
    }
    h+=showFooter(doc[5],fonte==='sbim'?'Calendários de vacinação SBIm 2026/2027':'Calendário Nacional de Vacinação e Instrução Normativa do PNI 2026');
    output.innerHTML=h;
    var back=get('vacNativeBack');
    if(back)back.addEventListener('click',function(){window.vacFecharCalendario();});
    sec.style.display='block';
    // O painel se abre no local do toque, sem saltar para o rodapé da página.
    var botao=listButton(id);
    if(botao)botao.after(sec);
  }
  function listButton(id){var list=get('vacCalendariosLista');return list?Array.prototype.find.call(list.querySelectorAll('[data-native-id]'),function(b){return b.dataset.nativeId===id;}):null;}
  function closeNative(){
    selecionado=null;currentDoc=null;
    var sec=get('vacCalPreview');if(sec)sec.style.display='none';
    var output=get('vacNativeContent');if(output)output.innerHTML='';
    drawList();
  }
  window.vacAbrirCalendarios=function(f){
    fonte=(f==='pni'?'pni':'sbim');selecionado=null;currentDoc=null;
    if(typeof window.vacShowSub==='function')window.vacShowSub('calendarios');
    preparar();
    var title=get('vac-sub-calendarios')&&get('vac-sub-calendarios').querySelector('div[style*="font-size:14px"]');
    if(title)title.textContent=fonte==='sbim'?'Calendários SBIm 2026/2027':'Calendário Nacional PNI 2026';
    var busca=get('vacCalBusca');if(busca)busca.value='';
    var sec=get('vacCalPreview');if(sec)sec.style.display='none';
    drawList();
  };
  window.vacSelecionarFonteCalendarios=function(f){window.vacAbrirCalendarios(f);};
  window.vacFiltrarCalendarios=function(){closeNative();};
  window.vacFecharCalendario=function(){closeNative();};
  // Não interferir na navegação de outras áreas do app.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',preparar);
  else preparar();
})();
