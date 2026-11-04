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