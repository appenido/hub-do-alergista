/* Hub do Alergista — seletor de idioma e localizacao da interface (PT/EN/ES).
   Termos medicos, doses, nomes comerciais e conteudo cientifico sem traducao
   revisada permanecem inalterados, para nao alterar orientacoes clinicas. */
(function(){
  'use strict';
  var KEY='hub_locale';
  var SUPPORTED=['pt-BR','en','es'];
  var codes={'pt-BR':'PT','en':'EN','es':'ES'};
  var language='pt-BR';
  try { var saved=localStorage.getItem(KEY);if(SUPPORTED.indexOf(saved)>=0)language=saved; } catch(e){}
  var entries=[
    ['Página inicial','Home','Inicio'],
    ['Voltar à página inicial','Return to home','Volver al inicio'],
    ['Voltar','Back','Volver'],
    ['Preferências','Preferences','Preferencias'],
    ['Idioma','Language','Idioma'],
    ['Idioma da interface','Interface language','Idioma de la interfaz'],
    ['Escolha o idioma','Select language','Elegir idioma'],
    ['Português','Portuguese','Portugués'],
    ['Inglês','English','Inglés'],
    ['Espanhol','Spanish','Español'],
    ['Buscar...','Search...','Buscar...'],
    ['Buscar no Hub','Search the Hub','Buscar en el Hub'],
    ['Pesquisar','Search','Buscar'],
    ['Pesquisar artigos','Search articles','Buscar artículos'],
    ['Buscar artigos','Search articles','Buscar artículos'],
    ['Pesquisar IgEs','Search IgEs','Buscar IgE'],
    ['Filtros','Filters','Filtros'],
    ['Filtrar','Filter','Filtrar'],
    ['Limpar filtros','Clear filters','Borrar filtros'],
    ['Limpar','Clear','Limpiar'],
    ['Aplicar','Apply','Aplicar'],
    ['Confirmar','Confirm','Confirmar'],
    ['Cancelar','Cancel','Cancelar'],
    ['Fechar','Close','Cerrar'],
    ['Abrir','Open','Abrir'],
    ['Ver mais','See more','Ver más'],
    ['Saiba mais','Learn more','Más información'],
    ['Ver detalhes','View details','Ver detalles'],
    ['Detalhes','Details','Detalles'],
    ['Selecionar','Select','Seleccionar'],
    ['Selecionar todos','Select all','Seleccionar todos'],
    ['Copiar','Copy','Copiar'],
    ['Copiar modelo','Copy template','Copiar plantilla'],
    ['Copiar link','Copy link','Copiar enlace'],
    ['Compartilhar','Share','Compartir'],
    ['Salvar','Save','Guardar'],
    ['Salvar preferências neste dispositivo','Save preferences on this device','Guardar preferencias en este dispositivo'],
    ['Favoritar','Add to favorites','Añadir a favoritos'],
    ['Desfavoritar','Remove from favorites','Quitar de favoritos'],
    ['Favoritos','Favorites','Favoritos'],
    ['Nenhum favorito ainda','No favorites yet','Aún no hay favoritos'],
    ['Artigos','Articles','Artículos'],
    ['Artigos recentes','Recent articles','Artículos recientes'],
    ['Últimos artigos','Latest articles','Últimos artículos'],
    ['Guidelines','Guidelines','Guías clínicas'],
    ['Protocolos de bolso','Pocket protocols','Protocolos de bolsillo'],
    ['Protocolos','Protocols','Protocolos'],
    ['Cursos','Courses','Cursos'],
    ['Cursos e eventos','Courses and events','Cursos y eventos'],
    ['Terapias Alvo','Targeted Therapies','Terapias dirigidas'],
    ['Terapias alvo','Targeted therapies','Terapias dirigidas'],
    ['Biológicos','Biologics','Biológicos'],
    ['Imunobiológicos','Immunobiologics','Inmunobiológicos'],
    ['Interações medicamentosas','Drug interactions','Interacciones farmacológicas'],
    ['Interação medicamentosa','Drug interaction','Interacción farmacológica'],
    ['Imunoglobulinas','Immunoglobulins','Inmunoglobulinas'],
    ['Anti-histamínicos','Antihistamines','Antihistamínicos'],
    ['Imunizações','Immunizations','Inmunizaciones'],
    ['Vacinas','Vaccines','Vacunas'],
    ['Consultar CRM','Verify medical registration','Consultar registro médico'],
    ['Laboratório','Laboratory','Laboratorio'],
    ['Instalar aplicativo','Install app','Instalar aplicación'],
    ['Instalar','Install','Instalar'],
    ['Atualizações','Updates','Actualizaciones'],
    ['Novidades','What’s new','Novedades'],
    ['Novidades em Alergia e Imunologia','What’s new in Allergy and Immunology','Novedades en Alergia e Inmunología'],
    ['Alergia · Imunologia · Atualidades','Allergy · Immunology · Updates','Alergia · Inmunología · Actualidad'],
    ['Manchete','Headline','Titular'],
    ['Ler notícias →','Read news →','Leer noticias →'],
    ['Ler notícias','Read news','Leer noticias'],
    ['Notícias','News','Noticias'],
    ['As principais notícias de alergia e imunologia, atualizadas para você.','The latest allergy and immunology news, updated for you.','Las principales noticias de alergia e inmunología, actualizadas para ti.'],
    ['Assistente do Congresso','Congress assistant','Asistente del congreso'],
    ['Congresso','Congress','Congreso'],
    ['Participantes','Participants','Participantes'],
    ['Palestrantes','Speakers','Ponentes'],
    ['Programação','Program','Programa'],
    ['Áreas de interesse','Areas of interest','Áreas de interés'],
    ['Área de interesse','Area of interest','Área de interés'],
    ['Escolha até 10 áreas de interesse para personalizar os artigos recentes. Não é necessário criar uma conta.','Choose up to 10 areas of interest to personalize recent articles. No account required.','Elige hasta 10 áreas de interés para personalizar los artículos recientes. No es necesario crear una cuenta.'],
    ['Selecionar áreas de interesse','Select areas of interest','Seleccionar áreas de interés'],
    ['Meus interesses','My interests','Mis intereses'],
    ['Todas','All','Todas'],
    ['Todos','All','Todos'],
    ['Mostrar todos','Show all','Mostrar todos'],
    ['Destaques','Highlights','Destacados'],
    ['Recomendações','Recommendations','Recomendaciones'],
    ['Referências','References','Referencias'],
    ['Referências científicas','Scientific references','Referencias científicas'],
    ['Fonte','Source','Fuente'],
    ['Fontes','Sources','Fuentes'],
    ['Indicações','Indications','Indicaciones'],
    ['Contraindicações','Contraindications','Contraindicaciones'],
    ['Posologia','Dosage','Posología'],
    ['Dose','Dose','Dosis'],
    ['Doses','Doses','Dosis'],
    ['Mecanismo de ação','Mechanism of action','Mecanismo de acción'],
    ['Efeitos adversos','Adverse effects','Efectos adversos'],
    ['Eventos adversos','Adverse events','Eventos adversos'],
    ['Cuidados','Precautions','Precauciones'],
    ['Observações','Notes','Observaciones'],
    ['Esquema','Schedule','Esquema'],
    ['Esquemas','Schedules','Esquemas'],
    ['Vacinação','Vaccination','Vacunación'],
    ['Idade','Age','Edad'],
    ['Peso','Weight','Peso'],
    ['Resultado','Result','Resultado'],
    ['Resultados','Results','Resultados'],
    ['Calcular','Calculate','Calcular'],
    ['Calculadora','Calculator','Calculadora'],
    ['Calcular dose','Calculate dose','Calcular dosis'],
    ['Abrir calculadora','Open calculator','Abrir calculadora'],
    ['Nova pesquisa','New search','Nueva búsqueda'],
    ['Carregando...','Loading...','Cargando...'],
    ['Aguarde...','Please wait...','Espera...'],
    ['Atualizado diariamente','Updated daily','Actualizado diariamente'],
    ['Última atualização','Last update','Última actualización'],
    ['Nenhum resultado encontrado','No results found','No se encontraron resultados'],
    ['Sem resultados','No results','Sin resultados'],
    ['Não foram encontrados resultados','No results found','No se encontraron resultados'],
    ['Escolha a imunoglobulina','Choose an immunoglobulin','Elige una inmunoglobulina'],
    ['+ Nova discussão','+ New discussion','+ Nueva discusión'],
    ['+ Iniciar discussão','+ Start discussion','+ Iniciar discusión'],
    ['Anafilaxia','Anaphylaxis','Anafilaxia'],
    ['Anafilaxia perioperatória','Perioperative anaphylaxis','Anafilaxia perioperatoria'],
    ['Urticária crônica','Chronic urticaria','Urticaria crónica'],
    ['Angioedema hereditário','Hereditary angioedema','Angioedema hereditario'],
    ['Imunoterapia rinite','Allergen immunotherapy for rhinitis','Inmunoterapia para rinitis'],
    ['Veneno himenópteros','Hymenoptera venom','Veneno de himenópteros'],
    ['Alergia alimentar diagnóstico','Food allergy diagnosis','Diagnóstico de alergia alimentaria'],
    ['Alergia alimentar manejo/OIT','Food allergy management/OIT','Manejo de alergia alimentaria/OIT'],
    ['Prevenção alergia alimentar','Food allergy prevention','Prevención de alergia alimentaria'],
    ['Dermatite atópica','Atopic dermatitis','Dermatitis atópica'],
    ['Biológicos para asma','Biologics for asthma','Biológicos para el asma'],
    ['Betalactâmicos delabeling','Beta-lactam allergy delabeling','Retirada de etiqueta de alergia a betalactámicos'],
    ['Dessensibilização','Desensitization','Desensibilización'],
    ['Teste cutâneo SPT','Skin prick test (SPT)','Prueba cutánea (SPT)'],
    ['Alergia molecular','Molecular allergology','Alergología molecular'],
    ['Esofagite eosinofílica','Eosinophilic esophagitis','Esofagitis eosinofílica'],
    ['Asma','Asthma','Asma'],
    ['Rinite alérgica','Allergic rhinitis','Rinitis alérgica'],
    ['Alergia alimentar','Food allergy','Alergia alimentaria'],
    ['Sinusite','Sinusitis','Sinusitis'],
    ['Rinossinusite crônica','Chronic rhinosinusitis','Rinosinusitis crónica'],
    ['Imunodeficiências','Immunodeficiencies','Inmunodeficiencias'],
    ['Urticária','Urticaria','Urticaria'],
    ['Alergia a medicamentos','Drug allergy','Alergia a medicamentos'],
    ['Alergia a venenos','Venom allergy','Alergia a venenos'],
    ['Pediatria','Pediatrics','Pediatría'],
    ['Adultos','Adults','Adultos'],
    ['Crianças','Children','Niños'],
    ['Gestantes','Pregnant patients','Embarazadas'],
    ['Paciente','Patient','Paciente'],
    ['Paciente pediátrico','Pediatric patient','Paciente pediátrico'],
    ['Sim','Yes','Sí'],
    ['Não','No','No'],
    ['Indefinido','Undefined','Indefinido'],
    ['Ver protocolo','View protocol','Ver protocolo'],
    ['Ver medicamentos','View medications','Ver medicamentos'],
    ['Quais medicamentos?','Which medications?','¿Qué medicamentos?']
  ];
  var translations=Object.create(null);
  entries.forEach(function(e){translations[e[0]]={'en':e[1],'es':e[2]};});
  var nodes=new WeakMap();
  var attrs=new WeakMap();
  var selected=[];
  var observer;
  var scheduled=false;
  var pending=new Set();
  function sourceOrNew(record,current){
    if(!record || record.rendered!==current)return {original:current,rendered:current};
    return record;
  }
  function translateString(value){
    if(language==='pt-BR')return value;
    var m=/^(\s*)([\s\S]*?)(\s*)$/.exec(value);
    if(!m)return value;
    var t=translations[m[2]];
    return t && t[language] ? m[1]+t[language]+m[3] : value;
  }
  function allowed(node){
    var el=node.nodeType===1?node:node.parentElement;
    if(!el)return false;
    return !el.closest('script,style,noscript,textarea,pre,code,[data-hub-i18n-skip],[contenteditable="true"]');
  }
  function translateText(node){
    if(!allowed(node))return;
    var current=node.nodeValue;
    if(!current || !current.trim())return;
    var rec=sourceOrNew(nodes.get(node),current);
    var next=translateString(rec.original);
    rec.rendered=next; nodes.set(node,rec);
    if(current!==next)node.nodeValue=next;
  }
  function translateAttributes(el){
    if(!allowed(el))return;
    var values=attrs.get(el)||{};
    ['placeholder','aria-label','title'].forEach(function(key){
      if(!el.hasAttribute(key))return;
      var current=el.getAttribute(key);
      var rec=sourceOrNew(values[key],current);
      var next=translateString(rec.original);
      rec.rendered=next; values[key]=rec;
      if(current!==next)el.setAttribute(key,next);
    });
    attrs.set(el,values);
  }
  function translateSubtree(root){
    if(root.nodeType===3){translateText(root);return;}
    if(root.nodeType!==1 && root.nodeType!==9 && root.nodeType!==11)return;
    if(root.nodeType===1 && !allowed(root))return;
    if(root.nodeType===1)translateAttributes(root);
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
    var next;
    while((next=walker.nextNode())){
      if(next.nodeType===3)translateText(next);
      else if(next.nodeType===1)translateAttributes(next);
    }
  }
  function syncControls(){
    selected.forEach(function(s){if(s.isConnected)s.value=language;});
    var code=document.getElementById('hubLangCode');
    if(code)code.textContent=codes[language];
    document.documentElement.lang=language;
  }
  function applyLanguage(){
    syncControls();
    translateSubtree(document.body);
    window.dispatchEvent(new Event('resize'));
    document.dispatchEvent(new CustomEvent('hub:languagechange',{detail:{language:language}}));
  }
  function setLanguage(next){
    if(SUPPORTED.indexOf(next)<0)return;
    language=next;
    try{localStorage.setItem(KEY,next);}catch(e){}
    applyLanguage();
  }
  function makeSelect(cssClass){
    var s=document.createElement('select');
    s.className=cssClass;
    s.setAttribute('aria-label','Idioma da interface');
    s.setAttribute('data-hub-i18n-skip','');
    [['pt-BR','Português'],['en','English'],['es','Español']].forEach(function(pair){
      var o=document.createElement('option');o.value=pair[0];o.textContent=pair[1];s.appendChild(o);
    });
    s.value=language;
    s.addEventListener('change',function(){setLanguage(s.value);});
    selected.push(s);
    return s;
  }
  function install(){
    if(document.getElementById('hubLanguageControl'))return;
    var bar=document.querySelector('.topbar');
    if(!bar)return;
    var shell=document.createElement('div');
    shell.className='hub-language-control';
    shell.id='hubLanguageControl';
    shell.setAttribute('title','Idioma da interface');
    shell.setAttribute('data-hub-i18n-skip','');
    shell.innerHTML='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg><span id="hubLangCode">PT</span><span class="hub-lang-arrow" aria-hidden="true">⌄</span>';
    shell.appendChild(makeSelect('hub-language-native'));
    var profileBtn=document.getElementById('btnPerfil');
    bar.insertBefore(shell,profileBtn||null);
    var profile=document.getElementById('page-perfil');
    if(profile){
      var panel=document.createElement('section');
      panel.id='hubLanguagePreferences';
      panel.className='hub-language-preferences';
      panel.innerHTML='<label for="hubLanguageSelectSettings" class="hub-language-label">Idioma da interface</label><p class="hub-language-description">Português, English, Español</p>';
      var pselect=makeSelect('hub-language-settings-select');
      pselect.id='hubLanguageSelectSettings';
      panel.appendChild(pselect);
      var blocks=profile.children;
      profile.insertBefore(panel,blocks.length>1?blocks[1]:null);
    }
    observer=new MutationObserver(function(records){
      records.forEach(function(r){
        if(r.type==='childList')r.addedNodes.forEach(function(n){pending.add(n);});
        else if(r.type==='characterData')pending.add(r.target);
        else if(r.type==='attributes')pending.add(r.target);
      });
      if(scheduled)return;
      scheduled=true;
      requestAnimationFrame(function(){
        scheduled=false;
        var work=Array.from(pending);pending.clear();
        work.forEach(translateSubtree);
      });
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','aria-label','title']});
    applyLanguage();
    window.addEventListener('storage',function(e){if(e.key===KEY && SUPPORTED.indexOf(e.newValue)>=0 && e.newValue!==language){language=e.newValue;applyLanguage();}});
  }
  window.HubI18n={getLanguage:function(){return language;},setLanguage:setLanguage};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();