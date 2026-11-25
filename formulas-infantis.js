/* Catálogo profissional de fórmulas para APLV — revisão 23/11/2026.
   Fontes: fabricantes (Brasil), Nestlé Nutre e alertas ANVISA. */
(function(){
  'use strict';
  if (window.HubFormulasInfantisInicializado) return;
  window.HubFormulasInfantisInicializado = true;
  var PRODUTOS = [
    {
      id:'neocate-lcp', nome:'Neocate LCP', fabricante:'Danone / Nutricia',
      classe:'amino', classeNome:'À base de aminoácidos livres', grupo:'infantil', idade:'0 a 36 meses',
      energia:'aprox. 0,67 kcal/mL', medida:'4,6 g por colher-medida',
      preparo:'Adicionar 1 medida rasa (4,6 g) para cada 30 mL de água potável previamente fervida. Exemplo: 90 mL de água + 3 medidas = aproximadamente 100 mL prontos.',
      indicacao:'Fórmula nutricionalmente completa, isenta de proteína láctea. Opção nas formas graves de APLV, reações importantes e falha da fórmula extensamente hidrolisada, conforme avaliação individual.',
      posologia:'Em alimentação exclusivamente por fórmula no primeiro semestre, uma referência clínica inicial é cerca de 150 mL/kg/dia da fórmula pronta, divididos em mamadas. Ajustar à idade, curva de crescimento, apetite e necessidades energéticas; não é dose fixa universal.',
      oferta:'Oferecer por via oral, em mamadeira ou copo adequado à idade, na frequência individualizada. Pode substituir a fórmula anterior em estratégia de exclusão da proteína do leite, preservando o aleitamento materno sempre que possível.',
      imagem:'https://images.tcdn.com.br/img/img_prod/1374480/neocate_lcp_400g_1_20250727222258_1eb58b6f2cb9.jpg',
      fonte:'https://www.danonehealthacademy.com.br/conteudos/details/neocate-lcp'
    },
    {
      id:'aptamil-pepti-hmo',nome:'Aptamil Pepti HMO',fabricante:'Danone / Nutricia',
      classe:'extensa',classeNome:'Proteína extensamente hidrolisada',grupo:'infantil',idade:'0 a 36 meses',
      energia:'aprox. 0,69 kcal/mL',medida:'4,7 g por colher-medida',
      preparo:'Adicionar 1 medida rasa (4,7 g) para cada 30 mL de água potável previamente fervida. Exemplo: 90 mL de água + 3 medidas = aproximadamente 100 mL de fórmula pronta.',
      indicacao:'Fórmula extensamente hidrolisada do soro do leite, com lactose. Opção para APLV leve a moderada sem comprometimento gastrointestinal importante, conforme avaliação clínica.',
      posologia:'No lactente menor de 6 meses em uso exclusivo de fórmula, considerar aproximadamente 150 mL/kg/dia como ponto de partida para o plano alimentar, distribuídos em mamadas; ajustar ao ganho ponderal e à ingestão efetiva. Após 6 meses, considerar alimentação complementar.',
      oferta:'Ofertar em mamadas fracionadas conforme a idade; não usar leite comum nem misturar com outras fórmulas durante dieta de exclusão sem orientação específica.',
      imagem:'https://images1.farmaciasapp.com.br/img-cache/file-68d13be050ef29.51600980_30a4fa077cbdac70b66a6d1d50711769.jpg?hash=04dd63ac3f870b0953fb560d0f844ace',
      fonte:'https://www.danonehealthacademy.com.br/conteudos/details/produto-aptamil-pepti-hmo'
    },
    {
      id:'pregomin-pepti',nome:'Pregomin Pepti',fabricante:'Danone / Nutricia',
      classe:'extensa',classeNome:'Proteína extensamente hidrolisada',grupo:'infantil',idade:'0 a 36 meses',
      energia:'aprox. 0,66 kcal/mL',medida:'4,3 g por colher-medida',
      preparo:'Adicionar 1 medida rasa (4,3 g) para cada 30 mL de água previamente fervida. Exemplo: 90 mL de água + 3 medidas = aproximadamente 100 mL da preparação.',
      indicacao:'Fórmula de soro do leite extensamente hidrolisado, com restrição de lactose. Opção para APLV leve a moderada com má absorção ou sintomas gastrointestinais, segundo avaliação clínica.',
      posologia:'No lactente exclusivamente alimentado com fórmula até 6 meses, utilizar ~150 mL/kg/dia somente como referência inicial de planejamento, fracionando conforme tolerância; individualizar por peso, crescimento, necessidades nutricionais e ingestão complementar.',
      oferta:'Fracionar por mamadas, com mamadeira ou copo conforme desenvolvimento. Monitorar aceitação, fezes e evolução clínica após introdução, sem adicionar leite ou modificar concentração.',
      imagem:'https://down-br.img.susercontent.com/file/br-11134207-7r98o-lsmsutw7xfzv93',
      fonte:'https://www.danonehealthacademy.com.br/conteudos/details/pregomin-pepti'
    },
    {
      id:'pregomin-plus',nome:'Pregomin Plus',fabricante:'Danone / Nutricia',
      classe:'extensa',classeNome:'Proteína extensamente hidrolisada',grupo:'infantil',idade:'0 a 36 meses',
      energia:'1 kcal/mL (hipercalórica)',medida:'5,1 g por colher-medida',
      preparo:'Adicionar 1 medida rasa (5,1 g) para cada 22,5 mL de água previamente fervida. Exemplos: 45 mL de água + 2 medidas = cerca de 50 mL prontos; 90 mL + 4 medidas = cerca de 100 mL prontos.',
      indicacao:'Fórmula extensamente hidrolisada hipercalórica (1 kcal/mL), com restrição de lactose, considerada na APLV associada a falha de crescimento, maiores demandas energéticas ou necessidade de menor volume.',
      posologia:'Planejar o volume pela cota energética atribuída à fórmula: 1 mL oferece aproximadamente 1 kcal. Ex.: necessidade de 600 kcal/dia provenientes da fórmula corresponde a cerca de 600 mL/dia prontos, distribuídos em ofertas. A necessidade calórica real deve ser individualizada.',
      oferta:'Oferecer em volumes menores e fracionados se houver intolerância a grandes mamadas. Não aplicar a mesma quantidade em mL usada numa fórmula padrão de aproximadamente 0,67 kcal/mL.',
      imagem:'https://drogariavenancio.vtexassets.com/arquivos/ids/1088900/89949_z.jpg?v=638375785551530000',
      fonte:'https://www.danonehealthacademy.com.br/conteudos/details/pregomin-plus'
    },
    {
      id:'nan-althera',nome:'NAN Althéra',fabricante:'Nestlé Health Science',
      classe:'extensa',classeNome:'Proteína extensamente hidrolisada',grupo:'infantil',idade:'0 a 36 meses',
      energia:'aprox. 0,67 kcal/mL',medida:'4,54 g por colher-medida',
      preparo:'Reconstituir 13,6 g de pó (3 medidas rasas de 4,54 g) em 90 mL de água previamente fervida para obter aproximadamente 100 mL prontos. Relação: 1 medida para 30 mL de água.',
      indicacao:'Fórmula extensamente hidrolisada, com lactose e derivados do leite na forma hidrolisada. Opção no tratamento nutricional da APLV conforme fenótipo e tolerabilidade.',
      posologia:'Em lactente até 6 meses que receba exclusivamente fórmula, ~150 mL/kg/dia pode ser referência inicial, com ajustes pela avaliação nutricional; em lactentes maiores, integrar ao plano com alimentação complementar.',
      oferta:'Oferecer em mamadeiras ou copo nas quantidades prescritas. Preparar com água previamente fervida de acordo com instruções de higiene, resfriar antes de oferecer e descartar sobras da mamada.',
      imagem:'https://drogariaspacheco.vteximg.com.br/arquivos/ids/894801-1000-1000/729493---formula-infantil-nan-althera-400g.jpg?v=638690928203300000',
      fonte:'https://www.nestlenutre.com.br/marcas/formula-infantil-nan-althera-400g'
    },
    {
      id:'alfare',nome:'Alfaré',fabricante:'Nestlé Health Science',
      classe:'extensa',classeNome:'Proteína extensamente hidrolisada',grupo:'infantil',idade:'0 a 36 meses',
      energia:'aprox. 0,67 kcal/mL',medida:'aprox. 4,5 g por medida na diluição usual',
      preparo:'Reconstituição usual: 3 medidas rasas (cerca de 13,5 g) em 90 mL de água previamente fervida, resultando em aproximadamente 100 mL. A colher fornecida pode variar conforme a apresentação; use apenas a colher original.',
      indicacao:'Fórmula extensamente hidrolisada do soro do leite, sem lactose, com triglicerídeos de cadeia média. Opção em APLV com sintomas gastrointestinais ou má absorção, segundo avaliação nutricional.',
      posologia:'Para lactente abaixo de 6 meses em alimentação exclusivamente por fórmula, ~150 mL/kg/dia é referência inicial, não prescrição automática. Adaptar ao quadro de má absorção, crescimento e tolerância digestiva.',
      oferta:'Ofertar por via oral em mamadas fracionadas; se houver comprometimento digestivo, monitorar hidratação, tolerância, evacuações e crescimento. Não diluir mais para facilitar a aceitação.',
      imagem:'https://images.tcdn.com.br/img/img_prod/1098117/alfare_nestle_400g_625899_1_a83e53d405d8ad2f3e21b0c692fbb0b3.jpg',
      fonte:'https://www.nestlenutre.com.br/marcas/alfare-lata-400g-new'
    },
    {
      id:'alfamino',nome:'Alfamino (HMO)',fabricante:'Nestlé Health Science',
      classe:'amino',classeNome:'À base de aminoácidos livres',grupo:'infantil',idade:'0 a 36 meses',
      energia:'aprox. 0,66 kcal/mL',medida:'4,4 g por colher-medida na fórmula HMO',
      preparo:'Reconstituição atual HMO: 13,3 g de pó (aproximadamente 3 medidas rasas de 4,4 g) em 90 mL de água previamente fervida para obter aproximadamente 100 mL prontos. Usar a medida fornecida na lata.',
      indicacao:'Fórmula de aminoácidos livres sem proteína láctea íntegra, para APLV grave, reações importantes ou falha de fórmula extensamente hidrolisada, após decisão clínica.',
      posologia:'No primeiro semestre, em uso exclusivo de fórmula, ~150 mL/kg/dia constitui apenas referência de planejamento; ajustar pelo estado nutricional, peso, evolução clínica e consumo real.',
      oferta:'Ofertar em mamadeira ou copo conforme a idade, após preparo higiênico; não modificar a concentração. Conferir rigorosamente o número do lote antes do uso.',
      imagem:'https://drogariaspacheco.vteximg.com.br/arquivos/ids/1343806-1000-1000/494984---Formula-Infantil-Alfamino-HMO-400g_0005_0.png?v=638629562481000000',
      fonte:'https://www.nestlenutre.com.br/alfamino-lata-400g-new',
      alerta:'VIGILÂNCIA SANITÁRIA (2026): dez lotes de Alfamino 400 g tiveram recolhimento e suspensão determinados em fevereiro por excesso de selênio e iodo, mas ESSAS MEDIDAS FORAM REVOGADAS pela Resolução-RE Anvisa nº 2.904, de 23/07/2026 (DOU 24/07/2026). Houve também uma ação sanitária distinta em janeiro/2026 por risco de contaminação de lotes específicos. Verificar a situação regulatória atualizada do lote antes de orientar o uso.',
      alertaFonte:'https://www.sijur.com.br/dou/2026/07/24/resolucao-re-2-904-agencia-nacional-de-vigilancia-sanitaria-parte-2.html',
      alertaFonte2:'https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/proibida-venda-de-formula-infantil-com-risco-de-contaminacao-por-toxina/'
    },
    {
      id:'alfajunior',nome:'AlfaJunior',fabricante:'Nestlé Health Science',
      classe:'amino',classeNome:'À base de aminoácidos livres',grupo:'pediatrica',idade:'1 a 10 anos',
      energia:'1 kcal/mL (fórmula pediátrica)',medida:'medir o pó por peso: 21,8 g por 100 mL prontos',
      preparo:'Diluição padrão declarada pelo fabricante: 21,8 g de pó + 84 mL de água = 100 mL da fórmula pronta. Para cerca de 200 mL, usar 43,6 g de pó + 168 mL de água.',
      indicacao:'Fórmula pediátrica nutricional para administração oral ou enteral de crianças de 1 a 10 anos com necessidades dietéticas especiais, incluindo alergia à proteína do leite; não é fórmula de partida de lactentes.',
      posologia:'A 1 kcal/mL, definir volume pela contribuição energética desejada: 300 kcal da fórmula = 300 mL prontos, divididos conforme a rotina alimentar. Ajustar aporte hídrico e energético total individualmente.',
      oferta:'Para 1 a 10 anos, oferecer em copo ou por via enteral se indicada. Não substituir indiscriminadamente as refeições; incorporar ao planejamento alimentar com acompanhamento do crescimento.',
      imagem:'https://paguemenos.vtexassets.com/arquivos/ids/1118579/8445290363855-F_rmula_Pedi_trica_Alfa_Junior_para_Nutri_o_Enteral_e_Oral_de_1_a_10_anos_Sem_Sabor_400g-F_rmula_Infantil-Alfa_Junior--2-.jpg?v=639029758298570000',
      fonte:'https://www.nestlenutre.com.br/nutricao-infantil/formula-infantil/formula-pediatrica-alfajunior-400g'
    }
  ];
  if (Array.isArray(window.HubFormulasCatalogoAdicional)) {
    PRODUTOS.push.apply(PRODUTOS,window.HubFormulasCatalogoAdicional);
  }
  PRODUTOS.forEach(function(p){
    if (!p.categoria) p.categoria=(p.id==='alfajunior')?'aplv-pediatria':'aplv';
    if(p.id==='alfamino'){
      p.alerta='ATENÇÃO — recall de janeiro/2026: não utilizar os lotes 51060017Y1, 51540017Y1 e 52720017Y2 de Alfamino 400 g, citados no recolhimento preventivo relacionado à cereulida. Outra ação regulatória por selênio/iodo, de fevereiro/2026, foi revogada em julho/2026. Verificar sempre a situação do lote.';
      p.alertaFonte='https://www.nestlefamilynes.com.br/recolhimento-de-produto';
      p.alertaFonteRotulo='Nestlé — lista oficial por lote';
      p.alertaFonte2='https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/proibida-venda-de-formula-infantil-com-risco-de-contaminacao-por-toxina/';
      p.alertaFonte2Rotulo='Anvisa — recolhimento de janeiro';
    }
  });
  function safe(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
  var svgIcon='<svg viewBox="0 0 64 64" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+
    '<defs><linearGradient id="fi-can-g" x1="14" y1="10" x2="47" y2="55" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#cfeaf1"/></linearGradient><linearGradient id="fi-drop-g" x1="18" y1="20" x2="43" y2="47" gradientUnits="userSpaceOnUse"><stop stop-color="#e6c06d"/><stop offset="1" stop-color="#ad7b31"/></linearGradient></defs>'+
    '<ellipse cx="32" cy="11" rx="17" ry="5" fill="#b6d4dc"/><path d="M15 11v39c0 5 34 5 34 0V11" fill="url(#fi-can-g)" stroke="#326980" stroke-width="2"/>'+
    '<path d="M15 12c0-5 34-5 34 0" stroke="#326980" stroke-width="2"/><rect x="19" y="21" width="26" height="25" rx="5" fill="#1a546b"/>'+
    '<path d="M32 25c-3.5 5.2-8 11.2-8 14a8 8 0 0 0 16 0c0-2.8-4.5-8.8-8-14Z" fill="url(#fi-drop-g)"/>'+
    '<path d="M29 39c0-1.5 1-4 3-6" stroke="#fff4d7" stroke-width="2" stroke-linecap="round"/>'+
    '<path d="M22 16h20" stroke="#81b0be" stroke-width="2" stroke-linecap="round"/></svg>';
  function mockup(p) {
    var brand=p.fabricante.indexOf('Danone')>=0?'Danone':'Nestlé';
    return '<span class="fi-no-photo fi-pack" data-brand="'+safe(brand)+'" role="img" aria-label="Identificação ilustrativa de '+safe(p.nome)+'">'+
      '<span class="fi-pack-brand">'+safe(brand)+'</span><span class="fi-pack-name">'+safe(p.nome)+'</span>'+
      '<span class="fi-pack-foot">Catálogo clínico</span></span>';
  }
  function card(p){
    var body='<div class="fi-product-body">'+
      '<section class="fi-block"><h3>Indicação clínica</h3><p>'+safe(p.indicacao)+'</p></section>'+
      '<section class="fi-block"><h3>Posologia e volume diário</h3><p>'+safe(p.posologia)+'</p></section>'+
      '<section class="fi-block"><h3>Preparo e diluição</h3><p>'+safe(p.preparo)+'</p></section>'+
      '<section class="fi-block"><h3>Como ofertar</h3><p>'+safe(p.oferta)+'</p></section>'+
      '<section class="fi-block fi-full fi-important"><h3>Segurança no preparo</h3><p>Higienizar mãos, utensílios e superfície; usar água potável previamente fervida na temperatura apropriada ao produto; medir primeiro a água e depois adicionar somente as medidas rasas indicadas. Misturar, resfriar à temperatura de oferta e verificar antes de oferecer. Preparar preferencialmente próximo ao consumo e descartar as sobras da mamada. Não concentrar nem diluir fora do esquema acima.</p></section>';
    if(p.alerta)body+='<section class="fi-block fi-full fi-alert"><h3>Atenção — alertas sanitários por lote</h3><p>'+safe(p.alerta)+' '+
      '<a class="fi-link" target="_blank" rel="noopener noreferrer" href="'+safe(p.alertaFonte)+'">'+safe(p.alertaFonteRotulo||'Aviso oficial')+'</a>'+
      (p.alertaFonte2?' · <a class="fi-link" target="_blank" rel="noopener noreferrer" href="'+safe(p.alertaFonte2)+'">'+safe(p.alertaFonte2Rotulo||'Aviso complementar')+'</a>':'')+'.</p></section>';
    body+='<section class="fi-block fi-full"><h3>Referência do produto</h3><p><a class="fi-link" href="'+safe(p.fonte)+'" target="_blank" rel="noopener noreferrer">Ficha do fabricante — '+safe(p.fabricante)+'</a>. Revisão do catálogo: 25/11/2026. Conferir gramatura e técnica de preparo da versão comercial.</p></section></div>';
    return '<details class="fi-product" data-classe="'+safe(p.classe)+'" data-fabricante="'+(p.fabricante.indexOf('Danone')>=0?'danone':'nestle')+'" data-search="'+safe(norm(p.nome+' '+p.fabricante+' '+p.classeNome+' '+p.idade))+'">'+
      '<summary aria-label="Expandir ficha de '+safe(p.nome)+'">'+
      (p.imagem?'<img class="fi-photo" loading="lazy" decoding="async" referrerpolicy="no-referrer" src="'+safe(p.imagem)+'" alt="Embalagem da fórmula '+safe(p.nome)+'">':mockup(p))+
      '<span class="fi-summary-copy"><span class="fi-product-name">'+safe(p.nome)+'</span><span class="fi-company">'+safe(p.fabricante)+'</span><span class="fi-type" data-tipo="'+safe(p.classe)+'">'+safe(p.classeNome)+'</span><span class="fi-age">'+safe(p.idade)+' · '+safe(p.energia)+'</span></span></summary>'+body+'</details>';
  }
  function init(){
    var dashboard=document.getElementById('page-dashboard');
    var grid=dashboard&&dashboard.querySelector('.quick-grid');
    var scroll=document.querySelector('.scroll-area');
    if(!grid||!scroll)return;
    if(typeof PAGE_TITLES!=='undefined')PAGE_TITLES.formulasInfantis='Fórmulas Infantis';
    if(!grid.querySelector('[data-nav="formulasInfantis"]')){
      var quick=document.createElement('div');
      quick.className='qcard';quick.dataset.nav='formulasInfantis';
      quick.setAttribute('role','button');quick.setAttribute('tabindex','0');
      quick.setAttribute('aria-label','Abrir Fórmulas Infantis para APLV');
      quick.innerHTML='<div class="qi qi-teal" aria-hidden="true">'+svgIcon+'</div><div class="ql">Fórmulas Infantis</div>';
      quick.addEventListener('keydown',function(ev){if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();navTo('formulasInfantis');}});
      var fav=grid.querySelector('[data-nav="favoritos"]');
      if(fav)grid.insertBefore(quick,fav);else grid.appendChild(quick);
    }
    if(document.getElementById('page-formulasInfantis'))return;
    var page=document.createElement('div');
    page.className='page';page.id='page-formulasInfantis';
    var GRUPOS=[
      ['aplv','APLV · fórmulas extensamente hidrolisadas e de aminoácidos'],
      ['aplv-pediatria','APLV · fórmulas pediátricas de aminoácidos'],
      ['aplv-suporte','APLV · suplementos e preparações complementares'],
      ['aplv-alternativa','APLV · alternativas de soja (uso seletivo)'],
      ['rotina0','Rotina · 0 a 6 meses'],
      ['rotina1','Seguimento · 6 a 12 meses'],
      ['primeira','Primeira infância · 1 a 3 anos'],
      ['especial','Fórmulas especiais · refluxo, digestão e lactose'],
      ['prematuros','Prematuridade e transição'],
      ['metabolicas','Dietas específicas · erros inatos do metabolismo']
    ];
    function sectionCatalog(){
      return GRUPOS.map(function(g){
        var items=PRODUTOS.filter(function(p){return p.categoria===g[0];});
        return '<section class="fi-section" data-grupo="'+g[0]+'"><div class="fi-subhead"><h2>'+g[1]+'</h2><span class="fi-section-count"></span></div><div class="fi-grid">'+items.map(card).join('')+'</div></section>';
      }).join('');
    }
    page.innerHTML=
      '<header class="fi-heading"><span class="fi-mark">'+svgIcon+'</span><div><h1>Fórmulas Infantis</h1><p>Catálogo brasileiro · Danone e Nestlé · 25/11/2026</p></div></header>'+
      '<p class="fi-intro">Catálogo clínico por tipo de proteína, indicação e faixa etária. As opções para APLV são exibidas sempre no topo. Ao selecionar, a ficha se expande no próprio card.</p>'+
      '<p class="fi-safety">Fórmulas parcialmente hidrolisadas e fórmulas comuns, inclusive as sem lactose, não tratam APLV. Fórmulas à base de soja são alternativas apenas em casos selecionados, em geral após 6 meses. Aleitamento materno permanece prioritário quando possível.</p>'+
      '<div class="fi-controls"><input class="fi-search" type="search" name="hub_filtro_formulas" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" data-lpignore="true" placeholder="Buscar fórmula, fabricante ou tipo…" aria-label="Buscar fórmulas infantis"><div class="fi-filters" role="group" aria-label="Filtros das fórmulas">'+
      '<button type="button" class="fi-filter is-active" data-filter="todos" aria-pressed="true">Todas</button>'+
      '<button type="button" class="fi-filter" data-filter="aplv" aria-pressed="false">APLV</button>'+ 
      '<button type="button" class="fi-filter" data-filter="extensa" aria-pressed="false">Extensamente hidrolisadas</button>'+
      '<button type="button" class="fi-filter" data-filter="parcial" aria-pressed="false">Parcialmente hidrolisadas</button>'+ 
      '<button type="button" class="fi-filter" data-filter="soja" aria-pressed="false">Soja</button>'+
      '<button type="button" class="fi-filter" data-filter="amino" aria-pressed="false">Aminoácidos</button>'+
      '<button type="button" class="fi-filter" data-filter="danone" aria-pressed="false">Danone</button>'+
      '<button type="button" class="fi-filter" data-filter="nestle" aria-pressed="false">Nestlé</button></div></div>'+
      sectionCatalog()+
      '<p class="fi-empty" hidden>Nenhuma fórmula encontrada com estes filtros.</p>'+
      '<p class="fi-reference">Volume final preparado difere do volume inicial da água. Diluição e colheres variam por fórmula e versão comercial. O catálogo lista linhas de produtos, sem repetir embalagens de gramaturas diferentes. Informações para profissionais de saúde; disponibilidade em estoque não é monitorada em tempo real.</p>';
    var jornal=document.getElementById('page-jornal');
    if(jornal&&jornal.parentNode===scroll)scroll.insertBefore(page,jornal);else scroll.appendChild(page);
    page.querySelectorAll('.fi-photo').forEach(function(img){
      img.addEventListener('error',function(){
        if(!img.parentElement)return;
        var p=document.createElement('span');
        p.className='fi-no-photo';p.setAttribute('aria-label','Imagem da fórmula indisponível');
        var prod=PRODUTOS.find(function(x){return img.alt==='Embalagem da fórmula '+x.nome;});if(prod){img.insertAdjacentHTML('afterend',mockup(prod));img.remove();}else{p.textContent='Imagem indisponível';img.replaceWith(p);}
      },{once:true});
    });
    var filtro='todos';
    var busca=page.querySelector('.fi-search');
    function aplicar(){
      var termo=norm(busca.value).trim();
      var visibles=0;
      page.querySelectorAll('.fi-section').forEach(function(section){
        var count=0;
        section.querySelectorAll('.fi-product').forEach(function(p){
          var tipo=p.getAttribute('data-classe'), fab=p.getAttribute('data-fabricante');
          var ok=(!termo||(p.getAttribute('data-search')||'').indexOf(termo)>=0)&&
            (filtro==='todos'||filtro===tipo||filtro===fab||(filtro==='aplv'&&String(p.closest('[data-grupo]').dataset.grupo).indexOf('aplv')===0));
          p.hidden=!ok;
          p.style.display=ok?'':'none';
          if(!ok)p.open=false;
          if(ok)count++;
        });
        section.hidden=count===0;
        var label=section.querySelector('.fi-section-count');
        if(label)label.textContent=count+' '+(count===1?'produto':'produtos');
        visibles+=count;
      });
      page.querySelector('.fi-empty').hidden=visibles!==0;
    }
    busca.addEventListener('input',aplicar);
    page.querySelectorAll('.fi-filter').forEach(function(b){
      b.addEventListener('click',function(){
        filtro=b.dataset.filter;
        page.querySelectorAll('.fi-filter').forEach(function(x){
          var active=x===b;x.classList.toggle('is-active',active);
          x.setAttribute('aria-pressed',active?'true':'false');
        });
        aplicar();
      });
    });
    page.querySelectorAll('.fi-product').forEach(function(d){
      d.addEventListener('toggle',function(){
        if(!d.open)return;
        page.querySelectorAll('.fi-product[open]').forEach(function(other){
          if(other!==d)other.open=false;
        });
      });
    });
    aplicar();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();