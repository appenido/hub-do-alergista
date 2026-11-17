/* Idiomas do Hub. Os catálogos acompanham os arquivos públicos do app. */
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
    ['Cálculo de dose','Dose calculator','Cálculo de dosis'],
    ['Medicamento, idade e peso','Medication, age and weight','Medicamento, edad y peso'],
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
    ['Quais medicamentos?','Which medications?','¿Qué medicamentos?'],
    ['Hub do Alergista','Hub do Alergista','Hub do Alergista'],
    ['Alergo News','Alergo News','Alergo News'],
    ['Mabs, i-JAK, iBTK','Mabs, i-JAK, iBTK','Mabs, i-JAK, iBTK'],
    ['Terapias AlvoMabs, i-JAK, iBTK','Targeted Therapies · Mabs, i-JAK, iBTK','Terapias dirigidas · Mabs, i-JAK, iBTK'],
    ['Acesso Rápido','Quick access','Acceso rápido'],
    ['Escolher temas','Choose topics','Elegir temas'],
    ['Selecione até 10 áreas de interesse em Preferências para visualizar os artigos mais recentes.','Select up to 10 areas of interest in Preferences to see the latest articles.','Seleccione hasta 10 áreas de interés en Preferencias para ver los artículos más recientes.'],
    ['Abrir Alergo News e ler as principais notícias de alergia e imunologia','Open Alergo News for the latest allergy and immunology news','Abrir Alergo News para consultar las novedades en alergia e inmunología'],
    ['© 2026 Hub do Alergista. Direitos autorais e demais direitos de propriedade intelectual protegidos nos termos da legislação aplicável. Reprodução, alteração e exploração comercial de elementos protegidos dependem de autorização ou de outra hipótese legal.','© 2026 Hub do Alergista. Copyright and other intellectual property rights are protected under applicable law. Reproducing, modifying or commercially exploiting protected elements requires authorization or another legal basis.','© 2026 Hub do Alergista. Los derechos de autor y los demás derechos de propiedad intelectual están protegidos conforme a la legislación aplicable. La reproducción, modificación y explotación comercial de elementos protegidos requieren autorización u otra base legal.'],
    ['Medicamentos','Medications','Medicamentos'],
    ['Catálogo de medicamentos','Medication catalog','Catálogo de medicamentos'],
    ['CATÁLOGO FARMACOLÓGICO','MEDICATION CATALOG','CATÁLOGO FARMACOLÓGICO'],
    ['Conduta','Clinical management','Conducta clínica'],
    ['Dose / esquema','Dose / regimen','Dosis / pauta'],
    ['Calendários vacinais','Vaccination schedules','Calendarios de vacunación'],
    ['Vacinas disponíveis no Brasil','Vaccines available in Brazil','Vacunas disponibles en Brasil'],
    ['Vacinas por população','Vaccines by population','Vacunas por población'],
    ['Recolher recuperação de doses','Collapse catch-up vaccination','Contraer vacunación de rescate'],
    ['Posologia e dose por doença','Dosing by condition','Posología por enfermedad'],
    ['Asma grave não controlada','Uncontrolled severe asthma','Asma grave no controlada'],
    ['Adrenalina IM','IM epinephrine','Adrenalina IM'],
    ['Primeira medicação: adrenalina IM','First-line medication: IM epinephrine','Primer medicamento: adrenalina IM'],
    ['Se não respondeu','If response is inadequate','Si la respuesta es insuficiente'],
    ['Se não responder / próximo passo','If response is inadequate / next step','Si la respuesta es insuficiente / siguiente paso'],
    ['Adjuvantes não salvam','Adjuncts do not replace epinephrine','Los adyuvantes no sustituyen a la adrenalina'],
    ['Alta segura','Safe discharge','Alta segura'],
    ['Atenção / orientação','Precautions / counseling','Precauciones / orientación'],
    ['Corticoide não trata choque, obstrução laríngea nem previne com eficácia estabelecida anafilaxia bifásica; não deve atrasar a primeira adrenalina.','Corticosteroids do not treat shock or laryngeal obstruction and have no established efficacy in preventing biphasic anaphylaxis; they must not delay the first epinephrine dose.','Los corticoides no tratan el choque ni la obstrucción laríngea y su eficacia para prevenir la anafilaxia bifásica no está establecida; no deben retrasar la primera dosis de adrenalina.'],
    ['Observar por tempo maior se hipotensão grave, hipoxemia, reação prolongada, doses repetidas de adrenalina, asma descontrolada, reação bifásica prévia ou difícil acesso ao socorro.','Continue observation for longer in case of severe hypotension, hypoxemia, a prolonged reaction, repeated epinephrine doses, uncontrolled asthma, a previous biphasic reaction or limited access to emergency care.','Prolongar la observación en caso de hipotensión grave, hipoxemia, reacción prolongada, dosis repetidas de adrenalina, asma no controlada, reacción bifásica previa o acceso difícil a la atención de urgencias.'],
    ['Termos de uso','Terms of use','Términos de uso'],
    ['Política de privacidade','Privacy policy','Política de privacidad'],
    ['Colírios','Eye drops','Colirios'],
    ['Terapia inalatória','Inhaled therapy','Terapia inhalada'],
    ['Corticoides tópicos','Topical corticosteroids','Corticoides tópicos'],
    ['Corticoides nasais','Intranasal corticosteroids','Corticoides nasales'],
    ['Inibidores da bomba de prótons','Proton pump inhibitors','Inhibidores de la bomba de protones'],
    ['Hidratantes','Moisturizers','Hidratantes'],
    ['Fórmulas infantis','Infant formulas','Fórmulas infantiles'],
    ['Pesquisar nesta categoria','Search this category','Buscar en esta categoría'],
    ['Genérico, marca, classe...','Generic name, brand, class...','Principio activo, marca, clase...'],
    ['Gratuito','Free','Gratuito'],
    ['Tipo','Type','Tipo'],
    ['Atenuada','Live attenuated','Atenuada'],
    ['Inativada','Inactivated','Inactivada'],
    ['ou','or','o'],
    ['via','route','vía'],
    ['Informações','Information','Información'],
    ['Resultados de busca','Search results','Resultados de búsqueda'],
    ['Lembrete','Reminder','Recordatorio'],
    ['Verificar interações no Medscape','Check interactions on Medscape','Verificar interacciones en Medscape'],
    ['Alergia Alimentar','Food Allergy','Alergia Alimentaria'],
    ['Dermatite Atópica','Atopic Dermatitis','Dermatitis Atópica'],
    ['SCORES E CALCULADORAS','SCORES AND CALCULATORS','ESCALAS Y CALCULADORAS'],
    ['Preenchimento pelo paciente via QR Code','Patient access via QR code','Acceso del paciente mediante código QR'],
    ['Gerar novo QR Code','Generate a new QR code','Generar un nuevo código QR'],
    ['Pesquisar produto','Search product','Buscar producto'],
    ['Genéricos e similares','Generics and similar medicines','Genéricos y medicamentos similares'],
    ['Áreas ressecadas','Dry areas','Zonas secas'],
    ['Não incorporado','Not incorporated','No incorporado'],
    ['Fora do Rol','Not listed for coverage','Fuera de la lista de cobertura'],
    ['Intravenosas (IGIV)','Intravenous (IVIG)','Intravenosas (IGIV)'],
    ['Subcutâneas (IGSC)','Subcutaneous (SCIG)','Subcutáneas (IGSC)'],
    ['Solução oral','Oral solution','Solución oral'],
    ['Ausente','Absent','Ausente'],
    ['Leve','Mild','Leve'],
    ['Moderado','Moderate','Moderado'],
    ['Intenso','Severe','Intenso'],
    ['Ministério da Saúde / SUS','Ministry of Health / SUS','Ministerio de Salud / SUS'],
    ['Pop. SUS','SUS population','Pobl. del SUS'],
    ['Intravenosa','Intravenous','Intravenosa'],
    ['Subcutânea','Subcutaneous','Subcutánea'],
    ['diretriz','guideline','guía'],
    ['metanálise','meta-analysis','metaanálisis'],
    ['revisão','review','revisión'],
    ['coorte','cohort','cohorte'],
    ['extensão','extension','extensión'],
    ['classificação','classification','clasificación'],
    ['consenso','consensus','consenso'],
    ['consenso nacional','national consensus','consenso nacional'],
    ['posição','position statement','posicionamiento'],
    ['fase 2','phase 2','fase 2'],
    ['fase II','phase II','fase II'],
    ['fase III','phase III','fase III'],
    ['fase IV','phase IV','fase IV'],
    ['RCT fase 3','phase 3 RCT','ECA de fase 3'],
    ['Monitorizar SpO₂, pressão e pulso','Monitor SpO₂, blood pressure and pulse','Monitorizar la SpO₂, la presión arterial y el pulso'],
    ['Adiar se asma não controlada, doença aguda ou risco clínico desproporcional.','Postpone if asthma is uncontrolled, if there is an acute illness or if the clinical risk is disproportionate.','Aplazar en caso de asma no controlada, enfermedad aguda o riesgo clínico desproporcionado.'],
    ['Asma não controlada exige atenção especial devido ao risco da AIT; seguir critérios e contraindicações específicos.','Uncontrolled asthma requires special attention because of the risk of AIT; follow the specific criteria and contraindications.','El asma no controlada requiere especial atención por el riesgo de la AIT; seguir los criterios y las contraindicaciones específicos.'],
    ['Asma eosinofílica não alérgica em mulher','Nonallergic eosinophilic asthma in a woman','Asma eosinofílica no alérgica en una mujer'],
    ['Associação, não corticoide isolado; idade/posologia conforme bula.','Combination therapy, not a corticosteroid alone; use the age and dosage specified in the prescribing information.','Tratamiento combinado, no corticoide aislado; edad y posología conforme a la ficha técnica.'],
    ['Avaliar possibilidade de anafilaxia, asma não controlada ou dermatografismo.','Assess for possible anaphylaxis, uncontrolled asthma or dermatographism.','Valorar la posibilidad de anafilaxia, asma no controlada o dermografismo.'],
    ['Equipe treinada e adrenalina à mão; risco maior se anafilaxia prévia importante, asma não controlada ou extrato relacionado a alimento de alto risco.','Have trained staff and epinephrine available; risk is higher with a history of significant anaphylaxis, uncontrolled asthma or an extract related to a high-risk food.','Contar con personal capacitado y adrenalina disponible; el riesgo es mayor con antecedentes de anafilaxia importante, asma no controlada o un extracto de un alimento de alto riesgo.'],
    ['Febre, infecção aguda, exercício intenso próximo da dose, estômago vazio e asma não controlada podem aumentar reações.','Fever, acute infection, vigorous exercise around dosing, an empty stomach and uncontrolled asthma can increase reactions.','La fiebre, la infección aguda, el ejercicio intenso en torno a la dosis, el estómago vacío y el asma no controlada pueden aumentar las reacciones.'],
    ['História remota e vaga, exantema benigno remoto ou sintomas não sugestivos: considerar provocação oral direta com amoxicilina sob observação, dose única ou graduada conforme protocolo do serviço','For a remote, unclear history, a remote benign rash or symptoms that do not suggest allergy: consider a direct oral amoxicillin challenge under observation, with a single or graded dose according to the local protocol','Ante antecedentes remotos e imprecisos, exantema benigno remoto o síntomas poco sugestivos: considerar una provocación oral directa con amoxicilina bajo observación, en dosis única o escalonada según el protocolo local'],
    ['Não iniciar sem equipe experiente e família capaz de seguir protocolo; asma não controlada e EoE ativa são fortes restrições.','Do not start without an experienced team and a family able to follow the protocol; uncontrolled asthma and active EoE are major restrictions.','No iniciar sin un equipo experimentado y una familia capaz de seguir el protocolo; el asma no controlada y la EoE activa son restricciones importantes.'],
    ['Suspender possíveis agentes desencadeantes, comunicar equipe e tratar anafilaxia imediatamente com adrenalina e suporte hemodinâmico/respiratório','Stop possible triggering agents, notify the team and treat anaphylaxis immediately with epinephrine and hemodynamic and respiratory support','Suspender los posibles desencadenantes, avisar al equipo y tratar la anafilaxia de inmediato con adrenalina y soporte hemodinámico y respiratorio'],
    ['asma não controlada apesar de CI + LABA;','uncontrolled asthma despite ICS + LABA;','asma no controlada a pesar de CI + LABA;'],
    ['se moderada/grave não controlada, terapia sistêmica direcionada.','if moderate or severe and uncontrolled, use targeted systemic therapy.','si es moderada o grave y no está controlada, usar tratamiento sistémico dirigido.'],
    ['3 doses aos 2, 4 e 6 m (intervalo 60 dias; mín. 30). Reforços com DTP aos 15 m e 4 anos.','3 doses at 2, 4 and 6 months (60-day interval; minimum 30). DTP boosters at 15 months and 4 years.','3 dosis a los 2, 4 y 6 meses (intervalo de 60 días; mínimo 30). Refuerzos con DTP a los 15 meses y a los 4 años.'],
    ['Bexsero: 2 m — 3+1; 3–5 m — 2+1; ≥11 anos — 2 doses. Trumenba: ≥10 anos — 2–3 doses.','Bexsero: 2 months — 3+1; 3–5 months — 2+1; ≥11 years — 2 doses. Trumenba: ≥10 years — 2–3 doses.','Bexsero: 2 meses — 3+1; 3–5 meses — 2+1; ≥11 años — 2 dosis. Trumenba: ≥10 años — 2–3 dosis.'],
    ['Rotina infantil do SUS durante transição de produtos; esquema de rotina 2+1 conforme idade e vacinação já recebida.','Routine pediatric SUS schedule during the product transition; routine 2+1 regimen according to age and prior vaccination.','Calendario infantil habitual del SUS durante la transición de productos; pauta habitual 2+1 según la edad y las dosis ya recibidas.'],
    ['Adultos: 1 flaconete 1–2 vezes/dia; crianças: ½ flaconete 1–2 vezes/dia.','Adults: 1 unit-dose vial 1–2 times/day; children: ½ unit-dose vial 1–2 times/day.','Adultos: 1 ampolla monodosis 1–2 veces/día; niños: ½ ampolla monodosis 1–2 veces/día.'],
    ['Bula: adulto/adolescente até 4 jatos 12/12h temporariamente (=8/dia); criança máximo 4 jatos/dia.','Label: adults and adolescents up to 4 puffs every 12 h temporarily (=8/day); children maximum 4 puffs/day.','Ficha técnica: adultos y adolescentes hasta 4 pulsaciones cada 12 h temporalmente (=8/día); niños máximo 4 pulsaciones/día.'],
    ['Bula: máximo 2 inalações 12/12h (4/dia) temporariamente; NÃO aplicar limite MART de 12.','Label: maximum 2 inhalations every 12 h (4/day) temporarily; do NOT use the MART limit of 12.','Ficha técnica: máximo 2 inhalaciones cada 12 h (4/día) temporalmente; NO aplicar el límite MART de 12.'],
    ['Imunização passiva, não vacina. Na estratégia especial do SUS: prematuros com idade gestacional até 36 semanas e 6 dias e menos de seis meses; ou menores de 24 meses com condições de risco definidas.','Passive immunization, not a vaccine. Under the special SUS strategy: infants born preterm at up to 36 weeks and 6 days of gestation who are under six months old; or children under 24 months with specified risk conditions.','Inmunización pasiva, no vacuna. En la estrategia especial del SUS: prematuros de hasta 36 semanas y 6 días de edad gestacional y menores de seis meses; o menores de 24 meses con factores de riesgo definidos.']
  ];
  // Guia ilustrado de instalação: inclui os textos dentro dos desenhos.
  entries.push(...[
  [
    "Guia ilustrado para instalar o Hub do Alergista no Android, iPhone ou iPad, com imagens de cada etapa.",
    "Illustrated guide to install Hub do Alergista on Android, iPhone or iPad, with an image for each step.",
    "Guía ilustrada para instalar Hub do Alergista en Android, iPhone o iPad, con imágenes de cada paso."
  ],
  [
    "Instalar aplicativo — Hub do Alergista",
    "Install app — Hub do Alergista",
    "Instalar aplicación — Hub do Alergista"
  ],
  [
    "Voltar ao Hub do Alergista",
    "Return to Hub do Alergista",
    "Volver a Hub do Alergista"
  ],
  [
    "Acesso rápido no celular",
    "Quick access on your phone",
    "Acceso rápido en el móvil"
  ],
  [
    "Escolha seu dispositivo e acompanhe as imagens. As setas e os contornos dourados mostram onde tocar em cada etapa.",
    "Choose your device and follow the images. The arrows and gold outlines show where to tap at each step.",
    "Elige tu dispositivo y sigue las imágenes. Las flechas y los contornos dorados indican dónde tocar en cada paso."
  ],
  [
    "Orientações de instalação",
    "Installation instructions",
    "Instrucciones de instalación"
  ],
  [
    "Sistema operacional",
    "Operating system",
    "Sistema operativo"
  ],
  [
    "Instalar no Android",
    "Install on Android",
    "Instalar en Android"
  ],
  [
    "Instalar no iPhone ou iPad",
    "Install on iPhone or iPad",
    "Instalar en iPhone o iPad"
  ],
  [
    "Abra o Hub no Google Chrome e siga as 4 etapas.",
    "Open the Hub in Google Chrome and follow the 4 steps.",
    "Abre el Hub en Google Chrome y sigue los 4 pasos."
  ],
  [
    "Abra o Hub no Safari e siga as 4 etapas.",
    "Open the Hub in Safari and follow the 4 steps.",
    "Abre el Hub en Safari y sigue los 4 pasos."
  ],
  [
    "Chrome com os três pontos do menu destacados no canto superior direito.",
    "Chrome with the three-dot menu highlighted in the upper-right corner.",
    "Chrome con el menú de tres puntos resaltado en la esquina superior derecha."
  ],
  [
    "Abra o menu do Chrome",
    "Open the Chrome menu",
    "Abre el menú de Chrome"
  ],
  [
    "Acesse",
    "Go to",
    "Accede a"
  ],
  [
    "no Chrome. Toque nos três pontos (⋮), no canto superior direito.",
    "in Chrome. Tap the three dots (⋮) in the upper-right corner.",
    "en Chrome. Toca los tres puntos (⋮) en la esquina superior derecha."
  ],
  [
    "Menu do Chrome com a opção Instalar e criar atalho destacada.",
    "Chrome menu with Install and create shortcut highlighted.",
    "Menú de Chrome con Instalar y crear acceso directo resaltado."
  ],
  [
    "Instalar e criar atalho",
    "Install and create shortcut",
    "Instalar y crear acceso directo"
  ],
  [
    "Escolha a instalação",
    "Choose installation",
    "Elige la instalación"
  ],
  [
    "Toque em Instalar e criar atalho e depois em Instalar. Em outras versões, a opção aparece como Instalar app ou Adicionar à tela inicial.",
    "Tap Install and create shortcut, then Install. In other versions, the option may appear as Install app or Add to Home screen.",
    "Toca Instalar y crear acceso directo y después Instalar. En otras versiones puede aparecer como Instalar aplicación o Añadir a la pantalla de inicio."
  ],
  [
    "Confirmação de instalação do Hub com o botão Instalar destacado.",
    "Hub installation confirmation with the Install button highlighted.",
    "Confirmación de instalación del Hub con el botón Instalar resaltado."
  ],
  [
    "Confirme no celular",
    "Confirm on your phone",
    "Confirma en el móvil"
  ],
  [
    "Toque em Instalar para confirmar. Se aparecer a criação de um atalho, toque em Adicionar.",
    "Tap Install to confirm. If a shortcut prompt appears, tap Add.",
    "Toca Instalar para confirmar. Si aparece la creación de un acceso directo, toca Añadir."
  ],
  [
    "Tela inicial do celular com o ícone do Hub do Alergista destacado.",
    "Phone home screen with the Hub do Alergista icon highlighted.",
    "Pantalla de inicio del móvil con el icono de Hub do Alergista resaltado."
  ],
  [
    "Abra pelo ícone do Hub",
    "Open using the Hub icon",
    "Abre desde el icono del Hub"
  ],
  [
    "Procure o ícone do Hub na tela inicial ou na lista de aplicativos e toque nele para abrir.",
    "Find the Hub icon on the home screen or in the app list and tap it to open.",
    "Busca el icono del Hub en la pantalla de inicio o en la lista de aplicaciones y tócalo para abrir."
  ],
  [
    "Instalar diretamente no Android",
    "Install directly on Android",
    "Instalar directamente en Android"
  ],
  [
    "Se abriu pelo WhatsApp, Instagram ou outro aplicativo, use o menu desse aplicativo para abrir o link no Chrome. Se o botão de instalação direta aparecer acima, você também pode usá-lo.",
    "If you opened this from WhatsApp, Instagram or another app, use that app’s menu to open the link in Chrome. If the direct installation button appears above, you can also use it.",
    "Si abriste el enlace desde WhatsApp, Instagram u otra aplicación, usa su menú para abrirlo en Chrome. Si aparece arriba el botón de instalación directa, también puedes usarlo."
  ],
  [
    "Safari com o botão Compartilhar, um quadrado com seta para cima, destacado.",
    "Safari with the Share button, a square with an upward arrow, highlighted.",
    "Safari con el botón Compartir, un cuadrado con una flecha hacia arriba, resaltado."
  ],
  [
    "Toque em Compartilhar",
    "Tap Share",
    "Toca Compartir"
  ],
  [
    "no Safari. Toque no quadrado com seta para cima. Em alguns layouts, abra primeiro o menu da página e escolha Compartilhar.",
    "in Safari. Tap the square with the upward arrow. In some layouts, open the page menu first and choose Share.",
    "en Safari. Toca el cuadrado con la flecha hacia arriba. En algunos diseños, abre primero el menú de la página y elige Compartir."
  ],
  [
    "Menu Compartilhar do Safari com Adicionar à Tela de Início destacado.",
    "Safari Share menu with Add to Home Screen highlighted.",
    "Menú Compartir de Safari con Añadir a pantalla de inicio resaltado."
  ],
  [
    "Adicionar à Tela de Início",
    "Add to Home Screen",
    "Añadir a pantalla de inicio"
  ],
  [
    "Adicione à Tela de Início",
    "Add to the Home Screen",
    "Añade a la pantalla de inicio"
  ],
  [
    "Role a lista de opções e toque em Adicionar à Tela de Início. Se não encontrar, vá até Editar Ações e inclua essa opção.",
    "Scroll through the options and tap Add to Home Screen. If it is missing, go to Edit Actions and add that option.",
    "Desplázate por las opciones y toca Añadir a pantalla de inicio. Si no aparece, ve a Editar acciones e incluye esa opción."
  ],
  [
    "Confirmação do Safari com Abrir como App da Web ativado e o botão Adicionar destacado.",
    "Safari confirmation with Open as Web App enabled and the Add button highlighted.",
    "Confirmación de Safari con Abrir como app web activado y el botón Añadir resaltado."
  ],
  [
    "Adicionar",
    "Add",
    "Añadir"
  ],
  [
    "Abrir como App da Web",
    "Open as Web App",
    "Abrir como app web"
  ],
  [
    "Confirme em Adicionar",
    "Confirm with Add",
    "Confirma con Añadir"
  ],
  [
    "Quando a opção estiver disponível, ative Abrir como App da Web. Depois, toque em Adicionar, no canto superior direito.",
    "When the option is available, turn on Open as Web App. Then tap Add in the upper-right corner.",
    "Cuando esté disponible, activa Abrir como app web. Después, toca Añadir en la esquina superior derecha."
  ],
  [
    "Tela de Início do iPhone com o ícone do Hub do Alergista destacado.",
    "iPhone Home Screen with the Hub do Alergista icon highlighted.",
    "Pantalla de inicio del iPhone con el icono de Hub do Alergista resaltado."
  ],
  [
    "Volte à Tela de Início e toque no ícone do Hub do Alergista para abrir o aplicativo.",
    "Return to the Home Screen and tap the Hub do Alergista icon to open the app.",
    "Vuelve a la pantalla de inicio y toca el icono de Hub do Alergista para abrir la aplicación."
  ],
  [
    "No iPad, o botão Compartilhar pode ficar na parte superior do Safari. Se abriu o link dentro de outro aplicativo, abra primeiro no Safari.",
    "On iPad, the Share button may be at the top of Safari. If the link opened inside another app, open it in Safari first.",
    "En el iPad, el botón Compartir puede estar en la parte superior de Safari. Si el enlace se abrió dentro de otra aplicación, ábrelo primero en Safari."
  ],
  [
    "Imagens ilustrativas. Os menus podem variar conforme a versão do navegador.",
    "Illustrative images. Menus may vary depending on your browser version.",
    "Imágenes ilustrativas. Los menús pueden variar según la versión del navegador."
  ],
  [
    "Pronto: o Hub fica acessível pelo ícone no celular, sem precisar da Play Store ou da App Store.",
    "All set: access the Hub from its icon on your phone, without the Play Store or App Store.",
    "Listo: accede al Hub desde su icono en el móvil, sin necesidad de Play Store ni App Store."
  ],
  [
    "O conteúdo é atualizado quando há conexão e uma nova versão é publicada.",
    "Content updates when connected and a new version is published.",
    "El contenido se actualiza cuando hay conexión y se publica una nueva versión."
  ],
  [
    "Voltar ao Hub",
    "Back to the Hub",
    "Volver al Hub"
  ],
  [
    "Orientações oficiais:",
    "Official instructions:",
    "Instrucciones oficiales:"
  ],
  [
    "Instalação concluída.",
    "Installation complete.",
    "Instalación completada."
  ],
  [
    "Para instalar, siga as instruções do Chrome acima.",
    "To install, follow the Chrome instructions above.",
    "Para instalar, sigue las instrucciones de Chrome anteriores."
  ],
  [
    "Instalação solicitada. Confira a tela inicial.",
    "Installation requested. Check your home screen.",
    "Instalación solicitada. Revisa la pantalla de inicio."
  ],
  [
    "Instalação não confirmada. Você pode usar o menu do Chrome.",
    "Installation was not confirmed. You can use the Chrome menu.",
    "La instalación no se confirmó. Puedes usar el menú de Chrome."
  ],
  [
    "Não foi possível abrir a instalação direta. Use o menu do Chrome.",
    "Direct installation could not open. Use the Chrome menu.",
    "No se pudo abrir la instalación directa. Usa el menú de Chrome."
  ],
  [
    "Android",
    "Android",
    "Android"
  ],
  [
    "Apple",
    "Apple",
    "Apple"
  ]
]);
  var labels=Object.create(null);
  entries.forEach(function(entry){labels[entry[0]]={en:entry[1],es:entry[2]};});
  var numberPattern=/\d+(?:[.,:/–-]\d+)*/g;
  var templates=[
    ['{0} resultados encontrados','{0} results found','{0} resultados encontrados'],
    ['{0} medicamento(s) encontrado(s)','{0} medication(s) found','{0} medicamento(s) encontrado(s)'],
    ['{0} apresentações','{0} strengths and forms','{0} presentaciones'],
    ['{0} itens','{0} items','{0} elementos'],
    ['{0} exames','{0} tests','{0} pruebas'],
    ['{0} artigos','{0} articles','{0} artículos'],
    ['{0} referências','{0} references','{0} referencias'],
    ['{0} vacinas','{0} vaccines','{0} vacunas'],
    ['{0} resultados','{0} results','{0} resultados'],
    ['{0} protocolos','{0} protocols','{0} protocolos'],
    ['{0} de {1}','{0} of {1}','{0} de {1}'],
    ['Pergunta {0} de {1}','Question {0} of {1}','Pregunta {0} de {1}'],
    ['Etapa {0} de {1}','Step {0} of {1}','Paso {0} de {1}'],
    ['Ver medicamentos indicados ({0})','View indicated medications ({0})','Ver medicamentos indicados ({0})'],
    ['Última atualização: {0}','Last update: {0}','Última actualización: {0}'],
    ['Última verificação: {0}','Last checked: {0}','Última verificación: {0}'],
    ['Fonte verificada em {0}','Source checked on {0}','Fuente revisada el {0}'],
    ['Verificação diária concluída em {0}','Daily check completed on {0}','Verificación diaria completada el {0}'],
    ['{0} fármacos em ordem alfabética','{0} drugs in alphabetical order','{0} fármacos en orden alfabético'],
    ['{0} novos conteúdos','{0} new updates','{0} novedades'],
    ['Novidades do Hub: {0} conteúdo(s) novo(s)','Hub updates: {0} new item(s)','Novedades del Hub: {0} elemento(s) nuevo(s)'],
    ['{0} hidratantes • {1} marcas • selecione uma combinação','{0} moisturizers • {1} brands • select a combination','{0} hidratantes • {1} marcas • selecciona una combinación'],
    ['Ex: {0}','E.g. {0}','P. ej. {0}'],
    ['{0} ano','{0} year','{0} año'],
    ['{0} anos','{0} years','{0} años'],
    ['{0} mês','{0} month','{0} mes'],
    ['{0} meses','{0} months','{0} meses'],
    ['{0} dia','{0} day','{0} día'],
    ['{0} dias','{0} days','{0} días'],
    ['{0} semana','{0} week','{0} semana'],
    ['{0} semanas','{0} weeks','{0} semanas'],
    ['{0} resposta','{0} reply','{0} respuesta'],
    ['{0} respostas','{0} replies','{0} respuestas'],
    ['{0} dose','{0} dose','{0} dosis'],
    ['{0} doses','{0} doses','{0} dosis'],
    ['{0} pontos','{0} points','{0} puntos'],
    ['Revisado em {0}','Reviewed on {0}','Revisado el {0}'],
    ['Atualizado em {0}','Updated on {0}','Actualizado el {0}']
  ];
  var templateLabels=Object.create(null);
  templates.forEach(function(entry){templateLabels[entry[0]]={en:entry[1],es:entry[2]};});
  var namedLabels=[
    [/^Consultar preços de (.+) nas farmácias$/, 'Check pharmacy prices for {name}', 'Consultar precios de {name} en farmacias'],
    [/^Abrir ou fechar ficha de (.+)$/, 'Open or close {name} details', 'Abrir o cerrar la ficha de {name}'],
    [/^Abrir informações: (.+)$/, 'Open {name} information', 'Abrir información de {name}'],
    [/^Logomarca (.+)$/, '{name} logo', 'Logotipo de {name}'],
    [/^Identidade visual do Hub: (.+)$/, 'Hub visual identity: {name}', 'Identidad visual del Hub: {name}']
  ];
  var publicationMonths={
    jan:['Jan','ene'],fev:['Feb','feb'],mar:['Mar','mar'],abr:['Apr','abr'],
    mai:['May','may'],jun:['Jun','jun'],jul:['Jul','jul'],ago:['Aug','ago'],
    set:['Sep','sep'],out:['Oct','oct'],nov:['Nov','nov'],dez:['Dec','dic']
  };
  var catalogs=Object.create(null);
  var requests=Object.create(null);
  var failed=Object.create(null);
  var textRecords=new WeakMap();
  var attributeRecords=new WeakMap();
  var controls=[];
  var pending=new Set();
  var scheduled=false;
  var originalTitle;
  var translatedAttributes=['placeholder','aria-label','aria-description','aria-valuetext','alt','title','label','value'];
  var skip='script,style,noscript,pre,code,[data-hub-i18n-skip],[contenteditable]:not([contenteditable="false"]),.page:not(.active)';
  var statusCopy={
    'pt-BR':['Idioma da interface','',''],
    en:['Interface language','Loading translations…','Translations could not load. Try again when connected.'],
    es:['Idioma de la interfaz','Cargando traducciones…','No se pudieron cargar las traducciones. Inténtalo de nuevo al conectarte.']
  };

  function normalize(value){return value.replace(/\s+/g,' ').trim();}

  function translatedPhrase(source){
    var label=labels[source];
    var catalog=catalogs[language];
    if(label)return label[language];
    for(var labelPattern of namedLabels){
      var match=source.match(labelPattern[0]);
      if(match)return labelPattern[language==='en'?1:2].replace('{name}',function(){return match[1];});
    }
    var date=source.match(/^(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\/(\d{4})$/i);
    if(date)return publicationMonths[date[1].toLowerCase()][language==='en'?0:1]+'/'+date[2];
    var numbers=[];
    var template=source.replace(numberPattern,function(value){numbers.push(value);return '{'+(numbers.length-1)+'}';});
    var translations=templateLabels[template];
    if(translations)return translations[language].replace(/\{(\d+)\}/g,function(_,index){return numbers[index];});
    return catalog&&Object.hasOwn(catalog,source)?catalog[source]:source;
  }

  function translate(value){
    if(language==='pt-BR'||typeof value!=='string'||!value.trim())return value;
    var leading=value.match(/^\s*/)[0];
    var trailing=value.match(/\s*$/)[0];
    var source=normalize(value);
    if(value.trim().includes('\n\n')){
      return value.split(/(\n\n+)/).map(function(paragraph){return paragraph.trim()?translate(paragraph):paragraph;}).join('');
    }
    var result=translatedPhrase(source);
    // Dates, source names and short status labels are often joined in a single text node.
    if(result===source&&source.includes(' · ')){
      result=source.split(' · ').map(translatedPhrase).join(' · ');
    }
    return result===source?value:leading+result+trailing;
  }

  function recordFor(record,current){
    return record&&record.rendered===current?record:{original:current,rendered:current};
  }

  function translateText(node){
    var current=node.nodeValue;
    if(!current||!current.trim()||node.parentElement?.tagName==='TEXTAREA')return;
    var record=recordFor(textRecords.get(node),current);
    var next=translate(record.original);
    record.rendered=next;
    textRecords.set(node,record);
    if(current===next)return;
    var option=node.parentElement;
    if(option?.tagName==='OPTION'&&!option.hasAttribute('value')){
      option.value=option.value;
    }
    node.nodeValue=next;
  }

  function sourceText(node){
    if(!node)return '';
    if(node.nodeType===Node.TEXT_NODE)return recordFor(textRecords.get(node),node.nodeValue).original;
    return Array.from(node.childNodes,sourceText).join('');
  }

  function translateAttributes(el,keys){
    var records=attributeRecords.get(el);
    for(var key of keys){
      if(key==='value'&&!(el.tagName==='INPUT'&&/^(button|submit|reset)$/i.test(el.type)))continue;
      if(!el.hasAttribute(key))continue;
      if(!records){
        records=Object.create(null);
        attributeRecords.set(el,records);
      }
      var current=el.getAttribute(key);
      var record=recordFor(records[key],current);
      var next=translate(record.original);
      record.rendered=next;
      records[key]=record;
      if(current!==next)el.setAttribute(key,next);
    }
  }

  function translateSubtree(root){
    if(!root.isConnected||![Node.ELEMENT_NODE,Node.TEXT_NODE].includes(root.nodeType))return;
    var el=root.nodeType===Node.ELEMENT_NODE?root:root.parentElement;
    if(!el||el.closest(skip))return;
    if(root.nodeType===Node.TEXT_NODE){
      translateText(root);
      return;
    }
    translateAttributes(root,translatedAttributes);
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{
      acceptNode:function(node){
        return node.nodeType===Node.ELEMENT_NODE&&node.matches(skip)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;
      }
    });
    for(var node=walker.nextNode();node;node=walker.nextNode()){
      if(node.nodeType===Node.TEXT_NODE)translateText(node);
      else translateAttributes(node,translatedAttributes);
    }
  }

  function syncControls(){
    var copy=statusCopy[language];
    controls.forEach(function(control){
      control.value=language;
      control.setAttribute('aria-label',copy[0]);
    });
    var control=document.getElementById('hubLanguageControl');
    var code=document.getElementById('hubLangCode');
    if(code)code.textContent=codes[language];
    var loading=language!=='pt-BR'&&!catalogs[language]&&!failed[language];
    if(control){
      control.classList.toggle('hub-language-loading',loading);
      control.title=failed[language]?copy[2]:copy[0];
      control.setAttribute('aria-busy',String(loading));
    }
    var status=document.getElementById('hubTranslationStatus');
    if(status)status.textContent=failed[language]?copy[2]:loading?copy[1]:'';
  }

  function applyLanguage(){
    document.documentElement.lang=language;
    document.title=translate(originalTitle);
    document.head.querySelectorAll('meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]').forEach(function(el){
      translateAttributes(el,['content']);
    });
    syncControls();
    translateSubtree(document.body);
    window.dispatchEvent(new Event('resize'));
  }

  function loadLanguage(next){
    if(next==='pt-BR'||catalogs[next]||requests[next])return;
    delete failed[next];
    requests[next]=fetch('/data/hub-i18n-'+next+'.json?v=20261115-traducao3',{
      cache:'no-cache',credentials:'same-origin'
    }).then(function(response){
      if(!response.ok)throw new Error('Catalogue unavailable');
      return response.json();
    }).then(function(catalog){
      if(!catalog||typeof catalog!=='object'||Array.isArray(catalog))throw new Error('Invalid catalogue');
      catalogs[next]=catalog;
    }).catch(function(){failed[next]=true;}).finally(function(){
      delete requests[next];
      if(language===next)applyLanguage();
    });
  }

  function selectLanguage(next){
    if(!SUPPORTED.includes(next))return;
    language=next;
    if(originalTitle===undefined)return;
    loadLanguage(next);
    applyLanguage();
    document.dispatchEvent(new CustomEvent('hub:languagechange',{detail:{language:language}}));
  }

  function setLanguage(next){
    if(!SUPPORTED.includes(next))return;
    try{localStorage.setItem(KEY,next);}catch(e){}
    selectLanguage(next);
  }

  function makeSelect(cssClass){
    var control=document.createElement('select');
    control.className=cssClass;
    control.setAttribute('data-hub-i18n-skip','');
    [['pt-BR','Português'],['en','English'],['es','Español']].forEach(function(pair){
      var option=new Option(pair[1],pair[0]);
      option.lang=pair[0];
      control.appendChild(option);
    });
    control.addEventListener('change',function(){setLanguage(control.value);});
    controls.push(control);
    return control;
  }

  function queueChanges(records){
    records.forEach(function(record){
      var target=record.target;
      if(record.type==='childList'){
        record.addedNodes.forEach(function(node){pending.add(node);});
      }else if(record.type==='characterData'){
        if(textRecords.get(target)?.rendered!==target.nodeValue)pending.add(target);
      }else if(record.attributeName==='class'){
        if(target.classList.contains('page')&&target.classList.contains('active'))pending.add(target);
      }else if(attributeRecords.get(target)?.[record.attributeName]?.rendered!==target.getAttribute(record.attributeName)){
        pending.add(target);
      }
    });
    if(scheduled||!pending.size)return;
    scheduled=true;
    requestAnimationFrame(function(){
      scheduled=false;
      var work=Array.from(pending);
      pending.clear();
      work.forEach(translateSubtree);
    });
  }

  function install(){
    if(document.getElementById('hubLanguageControl'))return;
    originalTitle=document.title;
    var bar=document.querySelector('.topbar');
    var shell=document.createElement('div');
    shell.className=bar?'hub-language-control':'hub-language-control hub-language-floating';
    shell.id='hubLanguageControl';
    shell.setAttribute('data-hub-i18n-skip','');
    shell.innerHTML='<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></svg><span id="hubLangCode">PT</span><span class="hub-lang-arrow" aria-hidden="true">⌄</span>';
    shell.appendChild(makeSelect('hub-language-native'));
    var profileBtn=document.getElementById('btnPerfil');
    if(bar)bar.insertBefore(shell,bar.contains(profileBtn)?profileBtn:null);
    else document.body.prepend(shell);
    var profile=document.getElementById('page-perfil');
    if(profile){
      var panel=document.createElement('section');
      panel.className='hub-language-preferences';
      panel.innerHTML='<label for="hubLanguageSelectSettings" class="hub-language-label">Idioma da interface</label>';
      var settings=makeSelect('hub-language-settings-select');
      settings.id='hubLanguageSelectSettings';
      panel.appendChild(settings);
      var status=document.createElement('p');
      status.id='hubTranslationStatus';
      status.className='hub-language-description';
      status.setAttribute('aria-live','polite');
      status.setAttribute('data-hub-i18n-skip','');
      panel.appendChild(status);
      profile.insertBefore(panel,profile.children[1]||null);
    }
    new MutationObserver(queueChanges).observe(document.body,{
      subtree:true,childList:true,characterData:true,attributes:true,
      attributeFilter:[...translatedAttributes,'class']
    });
    selectLanguage(language);
    window.addEventListener('online',function(){
      if(failed[language]){loadLanguage(language);syncControls();}
    });
    window.addEventListener('storage',function(event){
      if(event.key===KEY&&event.newValue!==language)selectLanguage(event.newValue||'pt-BR');
    });
  }

  window.HubI18n={
    getLanguage:function(){return language;},
    setLanguage:setLanguage,
    translate:translate,
    sourceText:sourceText
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
