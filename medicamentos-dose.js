/* Interface local da calculadora. Dados digitados e resultados ficam no formulário. */
(function () {
  'use strict';
  const { products, sources, reviewedOn, automatic, manual } = window.HubDoseRules;
  const BULAS = 'https://consultas.anvisa.gov.br/#/bulario/';
  const CMED = 'https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos';
  let registryRequest;
  const copy = {
    search: ['Buscar por nome ou marca', 'Search by generic name or brand', 'Buscar por nombre o marca'],
    searchHint: ['Dipirona ou Novalgina', 'Dipyrone or Novalgina', 'Dipirona o Novalgina'],
    searchButton: ['Buscar', 'Search', 'Buscar'],
    searchPending: ['Buscando medicamentos e apresentações…', 'Searching for medications and strengths…', 'Buscando medicamentos y presentaciones…'],
    searchRequired: ['Digite o princípio ativo ou a marca para buscar.', 'Enter a generic name or brand to search.', 'Escriba el principio activo o la marca para buscar.'],
    searchOffline: ['A lista da CMED está indisponível. A busca consultou o catálogo do Hub.', 'The CMED list is unavailable. Search used the Hub catalog.', 'La lista de CMED está indisponible. La búsqueda consultó el catálogo del Hub.'],
    refine: ['Use um nome mais específico para ver mais resultados.', 'Use a more specific name to narrow the results.', 'Use un nombre más específico para acotar los resultados.'],
    medicine: ['Medicamento', 'Medication', 'Medicamento'],
    selectDrug: ['Selecione um medicamento', 'Select a medication', 'Seleccione un medicamento'],
    select: ['Selecione', 'Select', 'Seleccione'],
    custom: ['Outro medicamento', 'Another medication', 'Otro medicamento'],
    unknown: ['Nenhum medicamento encontrado. Selecione “Outro medicamento” para usar o cálculo manual.', 'No medication found. Select “Another medication” for manual calculation.', 'No se encontró el medicamento. Seleccione «Otro medicamento» para usar el cálculo manual.'],
    drugName: ['Nome do medicamento', 'Medication name', 'Nombre del medicamento'],
    age: ['Idade completa', 'Age in completed years or months', 'Edad cumplida'],
    ageUnit: ['Unidade da idade', 'Age unit', 'Unidad de edad'],
    years: ['Anos', 'Years', 'Años'],
    months: ['Meses', 'Months', 'Meses'],
    kg: ['Peso (kg)', 'Weight (kg)', 'Peso (kg)'],
    mode: ['Esquema', 'Regimen', 'Esquema'],
    auto: ['Posologia de bula', 'Product-label dosing', 'Posología de ficha técnica'],
    manual: ['Cálculo manual', 'Manual calculation', 'Cálculo manual'],
    manualOnly: ['Cálculo manual disponível. Insira a posologia da bula ou do protocolo para a apresentação escolhida.', 'Manual calculation is available. Enter the label or protocol dose for the selected product.', 'Cálculo manual disponible. Introduzca la posología de la ficha técnica o del protocolo de la presentación.'],
    manualIntro: ['Use a posologia já definida para a idade, a indicação e a via.', 'Use a regimen already established for the age, indication and route.', 'Use la pauta ya definida para la edad, la indicación y la vía.'],
    presentation: ['Apresentação e concentração', 'Product and strength', 'Presentación y concentración'],
    otherPresentation: ['Informar outra apresentação', 'Enter another product or strength', 'Indicar otra presentación'],
    exactPresentation: ['Forma e concentração ou dosagem', 'Dosage form and strength', 'Forma y concentración o dosis'],
    exactPresentationHint: ['Solução oral 50 mg/mL', 'Oral solution 50 mg/mL', 'Solución oral 50 mg/mL'],
    confirmPresentation: ['Usar esta apresentação', 'Use this product and strength', 'Usar esta presentación'],
    cmedList: ['Apresentações da CMED', 'CMED product listings', 'Presentaciones de CMED'],
    cmedSource: ['Lista da CMED, versão de %1', 'CMED list dated %1', 'Lista de CMED del %1'],
    indication: ['Indicação', 'Indication', 'Indicación'],
    basis: ['Base da posologia', 'Dose basis', 'Base de la posología'],
    unit: ['Unidade da dose', 'Dose unit', 'Unidad de dosis'],
    kgDose: ['Por kg por dose', 'Per kg per dose', 'Por kg por dosis'],
    kgDay: ['Por kg por dia', 'Per kg per day', 'Por kg por día'],
    fixedDose: ['Dose fixa por administração', 'Fixed amount per administration', 'Dosis fija por administración'],
    fixedDay: ['Dose fixa por dia', 'Fixed amount per day', 'Dosis fija por día'],
    quantity: ['Valor da posologia', 'Regimen amount', 'Valor de la posología'],
    times: ['Administrações em 24 h', 'Administrations in 24 hours', 'Administraciones en 24 h'],
    concentration: ['Concentração (%1/mL), se líquida', 'Concentration (%1/mL), if liquid', 'Concentración (%1/mL), si es líquida'],
    limits: ['Limites da referência (opcional)', 'Reference limits (optional)', 'Límites de la referencia (opcional)'],
    minAge: ['Idade mínima (meses)', 'Minimum age (months)', 'Edad mínima (meses)'],
    maxAge: ['Idade máxima (meses)', 'Maximum age (months)', 'Edad máxima (meses)'],
    maxDose: ['Máximo por dose (%1)', 'Maximum per dose (%1)', 'Máximo por dosis (%1)'],
    maxDaily: ['Máximo em 24 h (%1)', 'Maximum in 24 hours (%1)', 'Máximo en 24 h (%1)'],
    calculate: ['Calcular dose', 'Calculate dose', 'Calcular dosis'],
    intro: ['Confira a indicação, a apresentação e os ajustes individuais antes de prescrever.', 'Check the indication, product and individual dose adjustments before prescribing.', 'Compruebe la indicación, la presentación y los ajustes individuales antes de prescribir.'],
    anvisa: ['Consultar Bulário da Anvisa', 'Consult Anvisa’s drug label database', 'Consultar el vademécum de Anvisa'],
    source: ['Bula profissional, seção 8', 'Professional label, section 8', 'Ficha técnica, sección 8'],
    patientLabel: ['Bula do produto, seção 6', 'Patient leaflet, section 6', 'Prospecto del producto, sección 6'],
    labelDosing: ['Bula da apresentação, seção de posologia', 'Product label dosing section', 'Prospecto de la presentación, sección de posología'],
    reviewed: ['Fonte conferida em %1', 'Source checked on %1', 'Fuente revisada el %1'],
    result: ['Por administração', 'Per administration', 'Por administración'],
    total: ['Total em 24 h', 'Total in 24 hours', 'Total en 24 h'],
    frequency: ['Frequência', 'Frequency', 'Frecuencia'],
    dailyFrequency: ['1 vez ao dia', 'Once daily', 'Una vez al día'],
    multipleFrequency: ['%1 vezes ao dia', '%1 times daily', '%1 veces al día'],
    asNeededFrequency: ['Até %1 vezes em 24 h, se necessário', 'Up to %1 times in 24 hours as needed', 'Hasta %1 veces en 24 h, si es necesario'],
    doseRange: ['%1 a %2', '%1 to %2', '%1 a %2'],
    oralInterval: ['A cada %1 h', 'Every %1 hours', 'Cada %1 h'],
    perKg: ['%1 mg/kg por dose', '%1 mg/kg per dose', '%1 mg/kg por dosis'],
    capped: ['Resultado limitado pelo teto informado.', 'The entered maximum limited this result.', 'El límite introducido acotó el resultado.'],
    manualResult: ['Calculado com a posologia informada.', 'Calculated from the entered regimen.', 'Calculado con la pauta introducida.'],
    manualVolume: ['Volume calculado pela concentração informada.', 'Volume calculated from the entered concentration.', 'Volumen calculado con la concentración introducida.'],
    patientInvalid: ['Informe a idade completa em anos ou meses e um peso maior que zero em kg.', 'Enter a completed age in years or months and a weight greater than zero in kg.', 'Indique la edad cumplida en años o meses y un peso mayor que cero en kg.'],
    selectScheme: ['Selecione a apresentação e a indicação.', 'Select the product and indication.', 'Seleccione la presentación y la indicación.'],
    manualInvalid: ['Informe uma posologia positiva e um número inteiro de administrações entre 1 e 24.', 'Enter a positive dose and a whole number of administrations from 1 to 24.', 'Indique una posología positiva y un número entero de administraciones entre 1 y 24.'],
    limitsInvalid: ['Revise os limites e a concentração. Idades precisam ser meses completos e os demais valores devem ser maiores que zero.', 'Check the limits and concentration. Ages must be whole months and other values must be greater than zero.', 'Revise los límites y la concentración. Las edades deben estar en meses cumplidos y los demás valores deben ser mayores que cero.'],
    ageOutside: ['A idade está fora dos limites informados para este esquema.', 'The age is outside the entered limits for this regimen.', 'La edad está fuera de los límites introducidos para esta pauta.'],
    quantityInvalid: ['Confira os valores e as unidades. A operação ficou fora do intervalo numérico da calculadora.', 'Check the values and units. The operation fell outside the calculator’s numeric range.', 'Revise los valores y las unidades. La operación quedó fuera del rango numérico de la calculadora.'],
    noBand: ['Idade ou peso fora das faixas cadastradas para esta apresentação e indicação.', 'Age or weight falls outside the ranges listed for this product and indication.', 'La edad o el peso están fuera de los rangos de esta presentación e indicación.'],
    eligible: ['Faixas de idade da apresentação', 'Age ranges for this product', 'Rangos de edad de la presentación'],
    fromAge: ['A partir de %1', 'From %1', 'A partir de %1'],
    ageRange: ['De %1 a menos de %2', 'From %1 to under %2', 'De %1 a menos de %2'],
    yearAge: ['%1 ano', '%1 year', '%1 año'],
    yearsAge: ['%1 anos', '%1 years', '%1 años'],
    monthAge: ['%1 mês', '%1 month', '%1 mes'],
    monthsAge: ['%1 meses', '%1 months', '%1 meses'],
    minWeight: ['≥ %1 kg', '≥ %1 kg', '≥ %1 kg'],
    loratadineBoundary: ['A bula do xarope Aché separa pesos abaixo e acima de 30 kg na faixa de 2 a 12 anos. Para 30 kg exatos, confira a posologia antes de calcular.', 'For ages 2 through 12, the Aché label lists weights below and above 30 kg. Confirm the dose separately at exactly 30 kg.', 'Entre los 2 y los 12 años, la ficha de Aché indica pesos inferiores y superiores a 30 kg. Confirme la dosis si pesa exactamente 30 kg.'],
    bilastineWeight: ['Esta solução pediátrica é para crianças de 6 a 11 anos com pelo menos 20 kg.', 'This pediatric solution is for children ages 6 through 11 who weigh at least 20 kg.', 'Esta solución pediátrica es para niños de 6 a 11 años con un peso de al menos 20 kg.'],
    fexoMismatch: ['A idade e o peso apontam para faixas diferentes na tabela da bula. Confira o esquema na fonte.', 'The age and weight fall in different rows of the label’s dosing table. Check the regimen in the source.', 'La edad y el peso corresponden a filas diferentes de la tabla de la ficha. Consulte la pauta en la fuente.'],
    renal: ['A função renal pode exigir ajuste de dose ou intervalo.', 'Renal function may require a dose or interval adjustment.', 'La función renal puede requerir un ajuste de dosis o del intervalo.'],
    renalCetirizine: ['Ajuste se houver comprometimento renal. A bula admite início com 5 mg a partir de 12 anos se essa dose controlar os sintomas.', 'Adjust for renal impairment. From age 12, the label allows starting at 5 mg if that controls symptoms.', 'Ajuste si hay deterioro renal. Desde los 12 años, la ficha admite iniciar con 5 mg si controla los síntomas.'],
    renalHepatic: ['Pode haver necessidade de ajuste na insuficiência hepática ou renal.', 'Hepatic or renal impairment may require adjustment.', 'La insuficiencia hepática o renal puede requerir ajustes.'],
    hepatic: ['Confira as restrições da bula na insuficiência hepática.', 'Check label restrictions in hepatic impairment.', 'Compruebe las restricciones de la ficha en la insuficiencia hepática.'],
    nasalInitial: ['Dose habitual ou inicial. Ajuste conforme controle e limites da bula.', 'Usual or starting dose. Adjust to symptom control and label limits.', 'Dosis habitual o inicial. Ajuste según el control y los límites de la ficha.'],
    bilastineFood: ['Administrar 1 h antes ou 2 h depois de alimentos ou sucos de frutas.', 'Give 1 hour before or 2 hours after food or fruit juice.', 'Administre 1 h antes o 2 h después de alimentos o zumos de frutas.'],
    patanolTiming: ['2 vezes ao dia, com 6 a 8 horas entre as aplicações.', 'Twice daily, with applications 6 to 8 hours apart.', '2 veces al día, con 6 a 8 horas entre aplicaciones.'],
    ketotifen: ['Uso preventivo na asma conforme bula. Pode causar sonolência.', 'Preventive asthma use per label. May cause drowsiness.', 'Uso preventivo en asma según la ficha. Puede causar somnolencia.'],
    sedating: ['Anti-histamínico sedativo.', 'Sedating antihistamine.', 'Antihistamínico sedante.'],
    thinLayer: ['Aplique uma camada fina sobre a área afetada. A quantidade depende da área tratada.', 'Apply a thin layer to the affected skin. The amount depends on the area treated.', 'Aplique una capa fina sobre la zona afectada. La cantidad depende de la superficie tratada.'],
    olopatadineSalt: ['Cada jato contém 665 µg de cloridrato de olopatadina, equivalentes a 600 µg de olopatadina base.', 'Each spray contains 665 µg of olopatadine hydrochloride, equivalent to 600 µg of olopatadine base.', 'Cada pulverización contiene 665 µg de hidrocloruro de olopatadina, equivalentes a 600 µg de olopatadina base.'],
    maintenanceOnly: ['Manutenção da asma. Para crises, siga o plano de ação do paciente.', 'Asthma maintenance. For attacks, follow the patient’s action plan.', 'Mantenimiento del asma. En las crisis, siga el plan de acción del paciente.'],
    refluxReassess: ['Reavalie após 4 semanas. A bula limita o tratamento a 8 semanas dos 12 aos 18 anos.', 'Reassess after 4 weeks. The label limits treatment to 8 weeks from ages 12 to 18.', 'Reevalúe tras 4 semanas. La ficha limita el tratamiento a 8 semanas entre los 12 y los 18 años.'],
    montelukast: ['Na asma, administrar à noite. Oriente sobre possíveis eventos neuropsiquiátricos.', 'For asthma, give in the evening. Counsel about possible neuropsychiatric effects.', 'En asma, administre por la noche e informe sobre posibles efectos neuropsiquiátricos.'],
    dipyroneLiquid: ['A tabela pediátrica usa as faixas de peso da bula, de 5 a 53 kg, entre 3 meses e 15 anos. A idade de cada linha é uma média. A faixa adulta automática exige mais de 15 anos e mais de 53 kg.', 'Use the label’s pediatric weight bands from 5 to 53 kg between age 3 months and 15 years. Ages shown in each row are averages. Automatic adult dosing requires age over 15 years and weight over 53 kg.', 'La tabla pediátrica usa los rangos de peso de la ficha, de 5 a 53 kg, entre los 3 meses y los 15 años. La edad de cada fila es una media. La pauta automática de adultos exige más de 15 años y más de 53 kg.'],
    dipyroneAdult: ['O esquema adulto da calculadora exige idade acima de 15 anos e peso acima de 53 kg.', 'The calculator’s adult regimen requires age over 15 years and weight over 53 kg.', 'La pauta de adultos de la calculadora exige más de 15 años y más de 53 kg.'],
    nostril: ['em cada narina', 'in each nostril', 'en cada fosa nasal'],
    eye: ['em cada olho afetado', 'in each affected eye', 'en cada ojo afectado'],
    twoNostrils: ['(duas narinas)', '(both nostrils)', '(ambas fosas nasales)'],
    bothEyes: ['(dois olhos)', '(both eyes)', '(ambos ojos)'],
    spray: ['jato', 'spray', 'pulverización'],
    sprays: ['jatos', 'sprays', 'pulverizaciones'],
    drop: ['gota', 'drop', 'gota'],
    drops: ['gotas', 'drops', 'gotas'],
    inhalation: ['inalação', 'inhalation', 'inhalación'],
    inhalations: ['inalações', 'inhalations', 'inhalaciones'],
    application: ['aplicação', 'application', 'aplicación'],
    applications: ['aplicações', 'applications', 'aplicaciones'],
    tabletCount: ['comprimido', 'tablet', 'comprimido'],
    tabletCounts: ['comprimidos', 'tablets', 'comprimidos'],
    perSpray: ['por jato', 'per spray', 'por pulverización'],
    perInhalation: ['por inalação', 'per inhalation', 'por inhalación'],
    syrup: ['xarope', 'syrup', 'jarabe'],
    oralSolution: ['solução oral', 'oral solution', 'solución oral'],
    oralSuspension: ['suspensão oral', 'oral suspension', 'suspensión oral'],
    oralDrops: ['gotas orais', 'oral drops', 'gotas orales'],
    tablet: ['comprimido', 'tablet', 'comprimido'],
    chewable: ['comprimido mastigável', 'chewable tablet', 'comprimido masticable'],
    nasalSpray: ['spray nasal', 'nasal spray', 'aerosol nasal'],
    eyeDrops: ['solução oftálmica', 'eye drops', 'solución oftálmica'],
    dryPowder: ['pó para inalação', 'dry powder inhaler', 'polvo para inhalación'],
    gastroResistant: ['comprimido gastrorresistente', 'gastro-resistant tablet', 'comprimido gastrorresistente'],
    cream: ['creme dermatológico', 'topical cream', 'crema dermatológica'],
    injection: ['solução injetável', 'solution for injection', 'solución inyectable'],
    effervescent: ['comprimido efervescente', 'effervescent tablet', 'comprimido efervescente'],
    suppository: ['supositório', 'suppository', 'supositorio'],
    capsule: ['cápsula', 'capsule', 'cápsula'],
    rhinitis: ['Rinite alérgica', 'Allergic rhinitis', 'Rinitis alérgica'],
    seasonalRhinitis: ['Rinite alérgica sazonal', 'Seasonal allergic rhinitis', 'Rinitis alérgica estacional'],
    rhinoconjunctivitis: ['Rinoconjuntivite alérgica', 'Allergic rhinoconjunctivitis', 'Rinoconjuntivitis alérgica'],
    rhinitisCombo: ['Rinite alérgica moderada a grave, com monoterapia insuficiente', 'Moderate to severe allergic rhinitis with inadequate response to monotherapy', 'Rinitis alérgica moderada a grave con respuesta insuficiente a la monoterapia'],
    moderateRhinitis: ['Rinite alérgica moderada a grave', 'Moderate to severe allergic rhinitis', 'Rinitis alérgica moderada a grave'],
    urticaria: ['Urticária', 'Urticaria', 'Urticaria'],
    chronicUrticaria: ['Urticária crônica idiopática', 'Chronic idiopathic urticaria', 'Urticaria crónica idiopática'],
    conjunctivitis: ['Conjuntivite alérgica', 'Allergic conjunctivitis', 'Conjuntivitis alérgica'],
    asthmaMaintenance: ['Asma, manutenção', 'Asthma maintenance', 'Asma, mantenimiento'],
    asthmaPrevention: ['Asma, prevenção conforme bula', 'Asthma prevention per label', 'Asma, prevención según ficha técnica'],
    dermatitis: ['Dermatite atópica', 'Atopic dermatitis', 'Dermatitis atópica'],
    gerd: ['DRGE sintomática sem esofagite', 'Symptomatic GERD without esophagitis', 'ERGE sintomática sin esofagitis'],
    erosiveGerd: ['Esofagite de refluxo erosiva', 'Erosive reflux esophagitis', 'Esofagitis erosiva por reflujo'],
    painFever: ['Dor ou febre', 'Pain or fever', 'Dolor o fiebre'],
    anti: ['Anti-histamínicos', 'Antihistamines', 'Antihistamínicos'],
    topicos: ['Corticoides tópicos', 'Topical corticosteroids', 'Corticoides tópicos'],
    olhos: ['Colírios', 'Eye drops', 'Colirios'],
    nasais: ['Medicamentos nasais', 'Nasal medications', 'Medicamentos nasales'],
    inalatoria: ['Terapia inalatória', 'Inhaled therapy', 'Terapia inhalada'],
    ibps: ['IBPs', 'PPIs', 'IBP'],
    outros: ['Outros medicamentos', 'Other medications', 'Otros medicamentos']
  };
  const categories = ['anti', 'topicos', 'olhos', 'nasais', 'inalatoria', 'ibps', 'outros'];
  const plural = { spray: 'sprays', drop: 'drops', inhalation: 'inhalations', tabletCount: 'tabletCounts', application: 'applications' };
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function parseDecimal(value) {
    const text = value.trim();
    if (!text) return undefined;
    return /^(?:\d+([.,]\d+)?|[.,]\d+)$/.test(text) ? Number(text.replace(',', '.')) : NaN;
  }

  async function loadRegistry() {
    if (!registryRequest) {
      registryRequest = fetch('/data/medicamentos-apresentacoes.json', {
        credentials: 'omit', signal: AbortSignal.timeout?.(4500)
      }).then(response => {
        if (!response.ok) throw new Error('CMED indisponível');
        return response.json();
      }).then(data => {
        if (!Array.isArray(data.items) || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error('CMED inválida');
        return data;
      }).catch(() => {
        registryRequest = undefined;
        return null;
      });
    }
    return registryRequest;
  }

  function catalog(entries, registry = []) {
    const map = new Map();
    const aliases = new Map();
    const add = (group, name, brand) => {
      const key = normalize(name);
      if (!map.has(key)) map.set(key, { key, group, name, brands: new Set(), aliases: new Set(), presentations: [], registered: [] });
      const item = map.get(key);
      if (brand) item.brands.add(brand);
      return item;
    };
    entries.forEach(item => add(item.group, item.name, item.brand));
    Object.entries(products).forEach(([id, product]) => {
      const item = add(product.group, product.drug, product.brand);
      item.group = product.group;
      item.presentations.push(id);
      product.aliases?.forEach(alias => {
        item.aliases.add(alias);
        aliases.set(normalize(alias), item);
      });
    });
    for (const [active, brand, forms] of registry) {
      const item = aliases.get(normalize(active)) || add('outros', active, brand);
      item.brands.add(brand);
      forms.forEach(raw => item.registered.push({ brand, raw }));
    }
    return [...map.values()].map(item => {
      const keywords = new Set([item.key, ...[...item.aliases, ...item.brands].map(normalize)]);
      return { ...item, keywords, terms: [...keywords].join(' ') };
    });
  }

  const registryForms = {
    'SOL OR GOTAS': 'oralDrops', 'SOL OR': 'oralSolution', 'SUS OR': 'oralSuspension',
    XPE: 'syrup', 'SOL INJ': 'injection', COM: 'tablet', 'COM EFEV': 'effervescent',
    'SUP RET': 'suppository', 'CAP DURA': 'capsule'
  };
  function registryPresentation(raw) {
    const parts = raw.match(/^(.+?)\s+(SOL OR GOTAS|SOL OR|SUS OR|XPE|SOL INJ|COM EFEV|COM|SUP RET|CAP DURA)$/);
    if (!parts) return { strength: raw };
    const strength = parts[1].replace(/\bMG\s*\/\s*ML\b/gi, 'mg/mL').replace(/\bMG\b/g, 'mg').replace(/\bG\b/g, 'g');
    const exactLiquid = ['SOL OR GOTAS', 'SOL OR', 'SUS OR', 'XPE', 'SOL INJ'].includes(parts[2])
      ? strength.match(/^(\d+(?:[,.]\d+)?)\s*mg\/mL$/i)
      : null;
    return { strength, form: registryForms[parts[2]], concentration: exactLiquid ? parseDecimal(exactLiquid[1]) : undefined };
  }

  function mount(container, entries) {
    const option = (value, label) => '<option value="' + escape(value) + '">' + escape(label) + '</option>';
    const label = key => '<span data-dose-copy="' + key + '"></span>';
    const input = (name, mode = 'decimal') => '<input type="text" name="' + name + '" inputmode="' + mode + '" maxlength="20">';
    const field = (key, control, wide = false) => '<label' + (wide ? ' class="med-dose-wide"' : '') + '>' + label(key) + control + '</label>';
    const selects = (name, choices) => '<select name="' + name + '">' + choices.map(([key, localized]) =>
      '<option value="' + key + '"' + (localized ? ' data-dose-copy="' + key + '"' : '') + '>' + (localized ? '' : key) + '</option>').join('') + '</select>';

    container.innerHTML =
      '<form class="med-dose" data-hub-i18n-skip data-analytics-ignore autocomplete="off" novalidate>' +
      '<div class="med-dose-search-line">' +
      field('search', '<input type="search" name="search" enterkeyhint="search" data-dose-placeholder="searchHint" maxlength="100">') +
      '<button type="button" class="med-dose-calculate" data-dose-search>' + label('searchButton') + '</button></div>' +
      '<p class="med-dose-note" data-dose-search-status role="status" hidden></p>' +
      '<div class="med-dose-grid med-dose-selection" data-dose-selection hidden>' +
      field('medicine', '<select name="medicine"></select>', true) +
      '<div class="med-dose-wide" data-dose-presentation hidden>' +
      field('presentation', '<select name="presentation"></select>') +
      '<p class="med-dose-note" data-dose-picked-presentation hidden></p>' +
      '<p class="med-dose-note" data-dose-registry-source hidden></p></div>' +
      '<div class="med-dose-wide med-dose-custom" data-dose-custom hidden>' +
      '<label class="med-dose-wide" data-dose-custom-name hidden>' + label('drugName') + '<input type="text" name="customName" maxlength="100"></label>' +
      field('exactPresentation', '<input type="text" name="customPresentation" maxlength="120" data-dose-placeholder="exactPresentationHint">') +
      '<button type="button" class="med-dose-calculate" data-dose-confirm>' + label('confirmPresentation') + '</button></div></div>' +
      '<div data-dose-patient hidden><div class="med-dose-grid">' +
      '<div class="med-dose-age">' + field('age', input('age', 'numeric')) +
      '<label class="med-dose-age-unit">' + label('ageUnit') + selects('ageUnit', [['years', true], ['months', true]]) + '</label></div>' +
      field('kg', input('weight')) +
      field('mode', selects('mode', [['auto', true], ['manual', true]]), true) +
      '</div><p class="med-dose-note" data-dose-manual-only hidden>' + label('manualOnly') + '</p>' +
      '<fieldset data-dose-auto hidden><div class="med-dose-grid">' +
      field('indication', '<select name="indication"></select>', true) +
      '</div><div class="med-dose-note" data-dose-applicability></div></fieldset>' +
      '<fieldset data-dose-manual hidden><div class="med-dose-grid">' +
      '<p class="med-dose-note med-dose-wide">' + label('manualIntro') + '</p>' +
      field('basis', selects('basis', [['kgDose', true], ['kgDay', true], ['fixedDose', true], ['fixedDay', true]])) +
      field('unit', selects('unit', [['mg'], ['µg'], ['g'], ['UI']])) +
      field('quantity', input('quantity')) +
      field('times', input('times', 'numeric')) +
      field('concentration', input('concentration'), true) +
      '</div><details class="med-dose-limits"><summary>' + label('limits') + '</summary><div class="med-dose-grid">' +
      field('minAge', input('minAge', 'numeric')) + field('maxAge', input('maxAge', 'numeric')) +
      field('maxDose', input('maxDose')) + field('maxDaily', input('maxDaily')) +
      '</div></details></fieldset>' +
      '<button type="submit" class="med-dose-calculate">' + label('calculate') + '</button>' +
      '<div class="med-dose-result" data-dose-result role="status" aria-live="polite" aria-atomic="true" hidden></div>' +
      '</div><p class="med-dose-note med-dose-footer">' + label('intro') + ' <a href="' + BULAS + '" target="_blank" rel="noopener noreferrer">' + label('anvisa') + '</a></p></form>';

    const form = container.querySelector('form');
    const controls = form.elements;
    const patient = form.querySelector('[data-dose-patient]');
    const autoFields = form.querySelector('[data-dose-auto]');
    const manualFields = form.querySelector('[data-dose-manual]');
    const selection = form.querySelector('[data-dose-selection]');
    const presentationField = form.querySelector('[data-dose-presentation]');
    const customPresentation = form.querySelector('[data-dose-custom]');
    const customName = form.querySelector('[data-dose-custom-name]');
    const confirmPresentation = form.querySelector('[data-dose-confirm]');
    const pickedPresentation = form.querySelector('[data-dose-picked-presentation]');
    const registryNote = form.querySelector('[data-dose-registry-source]');
    const manualOnly = form.querySelector('[data-dose-manual-only]');
    const searchStatus = form.querySelector('[data-dose-search-status]');
    const hint = form.querySelector('[data-dose-applicability]');
    const output = form.querySelector('[data-dose-result]');
    const localCatalog = catalog(entries);
    let fullCatalog;
    let shown = [];
    let activeQuery = '';
    let statusKey = '';
    let requestNumber = 0;
    let registryDate;
    let presentationOptions = new Map();
    let customConfirmed = false;
    let messageIndex = 0;
    let locale = 'pt-BR';

    const t = (key, first = '', second = '') => copy[key][messageIndex].replace('%1', first).replace('%2', second);
    const format = value => new Intl.NumberFormat(locale, { maximumSignificantDigits: 8, useGrouping: false }).format(value);
    const displayUnit = unit => unit === 'UI' && locale === 'en' ? 'IU' : unit;
    const measure = (amount, unit, cap = false) => {
      const shown = cap
        ? new Intl.NumberFormat(locale, { maximumSignificantDigits: 8, useGrouping: false, roundingMode: 'trunc' }).format(amount)
        : format(amount);
      const approximate = Math.abs(parseDecimal(shown) - amount) > Math.abs(amount) * Number.EPSILON * 2;
      return (approximate ? '≈ ' : '') + shown + ' ' + (plural[unit] ? t(amount === 1 ? unit : plural[unit]) : displayUnit(unit));
    };
    const ageLabel = months => months % 12 === 0 && months > 0
      ? t(months === 12 ? 'yearAge' : 'yearsAge', format(months / 12))
      : t(months === 1 ? 'monthAge' : 'monthsAge', format(months));
    const current = () => shown.find(item => item.key === controls.medicine.value);
    const chosenProduct = () => products[controls.presentation.value];
    const chosenPresentation = () => presentationOptions.get(controls.presentation.value);
    const number = name => parseDecimal(controls[name].value);
    const dateLabel = date => new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(new Date(date));

    function clearResult() {
      output.hidden = true;
      output.replaceChildren();
    }

    function setSearchStatus(key) {
      statusKey = key;
      searchStatus.hidden = !key;
      searchStatus.textContent = key ? t(key) : '';
    }

    function renderMedicines(selectDefault = false) {
      const keep = controls.medicine.value;
      const groups = categories.filter(key => shown.some(item => item.group === key));
      controls.medicine.innerHTML = option('', t('selectDrug')) + groups.map(group =>
        '<optgroup label="' + escape(t(group)) + '">' + shown.filter(item => item.group === group)
          .map(item => option(item.key, item.name)).join('') + '</optgroup>').join('') + option('custom', t('custom'));
      if (selectDefault) {
        const exact = shown.filter(item => item.keywords.has(activeQuery));
        controls.medicine.value = shown.length === 1 ? shown[0].key : exact.length === 1 ? exact[0].key : '';
      } else {
        controls.medicine.value = keep === 'custom' || shown.some(item => item.key === keep) ? keep : '';
      }
    }

    function clearSearch() {
      requestNumber++;
      activeQuery = '';
      shown = [];
      selection.hidden = true;
      controls.medicine.value = '';
      setSearchStatus('');
      renderSelection(true);
    }

    async function search() {
      const query = normalize(controls.search.value);
      clearSearch();
      if (!query) return setSearchStatus('searchRequired');
      const request = requestNumber;
      setSearchStatus('searchPending');
      const registry = await loadRegistry();
      if (request !== requestNumber) return;
      if (registry && !fullCatalog) fullCatalog = catalog(entries, registry.items);
      if (registry) registryDate = registry.date;
      const words = query.split(' ');
      const rank = item => item.keywords.has(query) ? 0 : item.key.startsWith(query) ? 1 : 2;
      const matches = (fullCatalog || localCatalog).filter(item => words.every(word => item.terms.includes(word)))
        .sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'pt-BR'));
      activeQuery = query;
      shown = matches.slice(0, 60);
      selection.hidden = false;
      setSearchStatus(!registry ? 'searchOffline' : !shown.length ? 'unknown' : matches.length > shown.length ? 'refine' : '');
      renderMedicines(true);
      renderSelection(true);
    }

    function presentation(product) {
      let strength = locale === 'en' ? product.strength.replace(/(\d),(\d)/g, '$1.$2') : product.strength;
      if (product.unit === 'spray') strength += ' ' + t('perSpray');
      if (product.unit === 'inhalation') strength += ' ' + t('perInhalation');
      return product.brand + ' · ' + t(product.form) + ' ' + strength;
    }

    function showRegistryPresentation(item) {
      return item.brand + ' · ' + (item.form ? t(item.form) + ' ' : '') + item.strength;
    }

    function fillChoices(control, options) {
      const keep = control.value;
      control.innerHTML = option('', t('select')) + options.join('');
      if ([...control.options].some(item => item.value === keep) && keep) control.value = keep;
      else control.selectedIndex = options.length === 1 ? 1 : 0;
    }

    function sourceLink(product) {
      return '<a href="' + escape(sources[product.source]) + '" target="_blank" rel="noopener noreferrer">' + escape(t(product.sourceSection || 'source')) + '</a>';
    }

    function renderIndications() {
      const product = chosenProduct();
      fillChoices(controls.indication, (product?.uses || []).map(key => option(key, t(key))));
      renderApplicability();
    }

    function renderApplicability() {
      const product = chosenProduct();
      hint.replaceChildren();
      if (!product) return;
      if (product.asNeeded) {
        hint.innerHTML = escape(t(product.outside)) + ' ' + sourceLink(product);
        return;
      }
      const ranges = product.bands.filter(b => !b.only || b.only === controls.indication.value).map(b => {
        const age = Number.isFinite(b.before)
          ? t('ageRange', ageLabel(b.from), ageLabel(b.before))
          : t('fromAge', ageLabel(b.from));
        const weight = b.minKg != null ? ' · ' + t('minWeight', format(b.minKg)) :
          b.maxKg != null ? ' · ≤ ' + format(b.maxKg) + ' kg' :
          b.belowKg != null ? ' · < ' + format(b.belowKg) + ' kg' :
          b.aboveKg != null ? ' · > ' + format(b.aboveKg) + ' kg' : '';
        return age + weight;
      });
      const ageRanges = ranges.length ? escape(t('eligible')) + ' · ' + escape([...new Set(ranges)].join(' / ')) + '<br>' : '';
      hint.innerHTML = ageRanges + sourceLink(product);
    }

    function renderMode() {
      const isManual = controls.mode.value === 'manual';
      autoFields.disabled = autoFields.hidden = isManual;
      manualFields.disabled = manualFields.hidden = !isManual;
    }

    function setConcentration() {
      const selected = chosenPresentation();
      const typed = customConfirmed ? controls.customPresentation.value.match(/^[\p{L}\s-]*(\d+(?:[,.]\d+)?)\s*mg\s*\/\s*mL\s*$/iu) : null;
      const typedMgPerMl = typed ? parseDecimal(typed[1]) : undefined;
      const mgPerMl = selected?.product?.concentration ?? selected?.concentration ?? (typedMgPerMl > 0 ? typedMgPerMl : undefined);
      const scale = { mg: 1, 'µg': 1000, g: 0.001 }[controls.unit.value];
      controls.concentration.readOnly = mgPerMl != null && scale != null;
      controls.concentration.value = controls.concentration.readOnly ? format(mgPerMl * scale) : '';
    }

    function renderPresentation(resetMode) {
      const selected = chosenPresentation();
      const product = selected?.product;
      const entered = controls.presentation.value === 'custom';
      const customDrug = controls.medicine.value === 'custom';
      customPresentation.hidden = !entered;
      customName.hidden = !customDrug;
      controls.customName.disabled = !customDrug;
      const ready = !!selected || (entered && customConfirmed);
      patient.hidden = !ready;
      manualOnly.hidden = !ready || !!product;
      controls.mode.options[0].disabled = !product;
      if (resetMode || !product) controls.mode.value = product ? 'auto' : 'manual';
      controls.mode.closest('label').hidden = !product;
      const completeLabel = product ? presentation(product) : selected?.raw ? showRegistryPresentation(selected) : '';
      pickedPresentation.hidden = completeLabel.length < 38;
      pickedPresentation.textContent = pickedPresentation.hidden ? '' : completeLabel;
      registryNote.hidden = !selected?.raw || !registryDate;
      registryNote.innerHTML = registryNote.hidden ? '' :
        '<a href="' + CMED + '" target="_blank" rel="noopener noreferrer">' + escape(t('cmedSource', dateLabel(registryDate))) + '</a>';
      renderIndications();
      renderMode();
      if (resetMode) setConcentration();
    }

    function clearRegimen() {
      manualFields.querySelectorAll('input').forEach(el => { el.value = ''; });
    }

    function renderSelection(reset) {
      const item = current();
      const custom = controls.medicine.value === 'custom';
      const keep = reset ? '' : controls.presentation.value;
      if (reset) {
        customConfirmed = false;
        controls.customName.value = custom ? controls.search.value.trim() : '';
        controls.customPresentation.value = '';
        controls.customName.setCustomValidity('');
        controls.customPresentation.setCustomValidity('');
        controls.age.value = controls.weight.value = '';
        clearRegimen();
      }
      presentationField.hidden = !item && !custom;
      presentationOptions = new Map();
      if (item) {
        const genericTerms = [item.key, ...[...item.aliases].map(normalize)];
        const brandTerms = activeQuery.split(' ').filter(word => !genericTerms.some(name => name.includes(word)));
        const matchingBrand = brand => brandTerms.every(word => normalize(brand).includes(word));
        const verified = item.presentations.filter(id => matchingBrand(products[id].brand));
        for (const id of verified) presentationOptions.set(id, { product: products[id] });
        const seen = new Set();
        item.registered.forEach(({ brand, raw }, index) => {
          if (!matchingBrand(brand)) return;
          const identity = brand + '\u0000' + raw;
          if (seen.has(identity)) return;
          seen.add(identity);
          const registered = { brand, raw, ...registryPresentation(raw) };
          const duplicate = verified.some(id => {
            const product = products[id];
            return normalize(brand) === normalize(product.brand) && registered.form === product.form &&
              normalize(registered.strength) === normalize(product.strength);
          });
          if (!duplicate) presentationOptions.set('cmed-' + index, registered);
        });
        const curatedOptions = verified.map(id => option(id, presentation(products[id])));
        const listedOptions = [...presentationOptions].filter(([, item]) => item.raw)
          .map(([id, value]) => option(id, showRegistryPresentation(value)));
        controls.presentation.innerHTML = option('', t('select')) +
          (curatedOptions.length ? '<optgroup label="' + escape(t('auto')) + '">' + curatedOptions.join('') + '</optgroup>' : '') +
          (listedOptions.length ? '<optgroup label="' + escape(t('cmedList')) + '">' + listedOptions.join('') + '</optgroup>' : '') +
          option('custom', t('otherPresentation'));
      } else {
        controls.presentation.innerHTML = option('custom', t('otherPresentation'));
      }
      controls.presentation.value = keep && (keep === 'custom' || presentationOptions.has(keep)) ? keep :
        (!presentationOptions.size && (item || custom)) ? 'custom' :
          presentationOptions.size === 1 ? presentationOptions.keys().next().value : '';
      renderPresentation(reset);
    }

    function updateUnits() {
      for (const key of ['concentration', 'maxDose', 'maxDaily']) {
        form.querySelector('[data-dose-copy="' + key + '"]').textContent = t(key, displayUnit(controls.unit.value));
      }
      const suffix = { kgDose: '/kg/dose', kgDay: '/kg/24 h', fixedDose: '/dose', fixedDay: '/24 h' };
      form.querySelector('[data-dose-copy="quantity"]').textContent = t('quantity') + ' (' + displayUnit(controls.unit.value) + suffix[controls.basis.value] + ')';
    }

    function metric(key, value) {
      return '<div><dt>' + escape(key) + '</dt><dd>' + escape(value) + '</dd></div>';
    }

    function showError(key, product) {
      output.classList.add('is-error');
      output.innerHTML = '<p>' + escape(t(key)) + '</p>' + (product ? sourceLink(product) : '');
      output.hidden = false;
    }

    function calculate() {
      clearResult();
      if (patient.hidden) return;
      const age = number('age');
      const ageMonths = Number.isInteger(age) ? age * (controls.ageUnit.value === 'years' ? 12 : 1) : NaN;
      const kg = number('weight');
      const fromLabel = controls.mode.value === 'auto';
      const product = fromLabel ? chosenProduct() : null;
      const use = controls.indication.value;
      const name = current()?.name || controls.customName.value.trim();
      if (!name) {
        controls.customName.setCustomValidity(t('drugName'));
        controls.customName.reportValidity();
        return;
      }
      const result = fromLabel ? automatic(product, use, ageMonths, kg) : manual({
        ageMonths, kg, basis: controls.basis.value, quantity: number('quantity'), times: number('times'),
        concentration: number('concentration'), maxDose: number('maxDose'), maxDaily: number('maxDaily'),
        minAge: number('minAge'), maxAge: number('maxAge')
      });
      if (result.error) return showError(result.error, product);
      const { amount, minAmount, times, ml, minMl, tablets, minTablets, drops, minDrops, daily, maxDaily, maxDose, perKg, site, capped, asNeeded } = result;
      const unit = fromLabel ? result.unit : controls.unit.value;
      const range = (min, max, unitName) => min != null
        ? t('doseRange', format(min), measure(max, unitName))
        : measure(max, unitName, capped);
      const amountLabel = range(minAmount, amount, unit) + (site ? ' ' + t(site) : '');
      const administered = drops != null ? range(minDrops, drops, 'drop')
        : tablets != null ? range(minTablets, tablets, 'tabletCount') : ml != null ? range(minMl, ml, 'mL') : '';
      const schedule = asNeeded ? t('asNeededFrequency', format(times))
        : product?.note === 'patanolTiming' ? t('patanolTiming')
        : times === 1 ? t('dailyFrequency')
        : fromLabel ? t('oralInterval', format(24 / times)) : t('multipleFrequency', format(times));
      const limitSite = site === 'nostril' ? ' ' + t('twoNostrils') : site === 'eye' ? ' ' + t('bothEyes') : '';
      const dailyMetric = daily == null ? '' : metric(t('total'), measure(daily, unit, capped) + limitSite);
      const dailyMaxMetric = maxDaily == null ? '' : metric(t('maxDaily', plural[unit] ? t(plural[unit]) : displayUnit(unit)), measure(maxDaily, unit) + limitSite);
      const doseMaxMetric = maxDose == null ? '' : metric(t('maxDose', displayUnit(unit)), measure(maxDose, unit));
      const reference = product ? sourceLink(product) + '<span> · ' + escape(t('reviewed', dateLabel(reviewedOn))) + '</span>' : '';
      const notes = [
        perKg != null && t('perKg', format(perKg)),
        product?.note && product.note !== 'patanolTiming' && t(product.note),
        !fromLabel && t('manualResult'),
        !fromLabel && ml != null && t('manualVolume'),
        capped && t('capped')
      ].filter(Boolean);
      output.classList.remove('is-error');
      const selected = chosenPresentation();
      const context = product ? presentation(product) + ' · ' + t(use) :
        name + ' · ' + (selected?.product ? presentation(selected.product) :
          selected?.raw ? showRegistryPresentation(selected) : controls.customPresentation.value.trim());
      output.innerHTML = '<p class="med-dose-context">' + escape(context) + '</p>' +
        '<p class="med-dose-result-title">' + escape(t('result')) + '</p>' +
        '<p class="med-dose-amount">' + escape(administered || amountLabel) + '</p>' +
        (administered ? '<p class="med-dose-amount-alt">' + escape(amountLabel) + '</p>' : '') +
        '<dl>' + metric(t('frequency'), schedule) + dailyMetric + dailyMaxMetric + doseMaxMetric + '</dl>' +
        notes.map(note => '<p class="med-dose-note">' + escape(note) + '</p>').join('') +
        (reference ? '<p class="med-dose-reference">' + reference + '</p>' : '');
      output.hidden = false;
    }

    function localize() {
      locale = window.HubI18n?.getLanguage() || 'pt-BR';
      messageIndex = locale === 'en' ? 1 : locale === 'es' ? 2 : 0;
      form.querySelectorAll('[data-dose-copy]').forEach(el => { el.textContent = t(el.dataset.doseCopy); });
      form.querySelectorAll('[data-dose-placeholder]').forEach(el => { el.placeholder = t(el.dataset.dosePlaceholder); });
      controls.unit.options[3].textContent = displayUnit('UI');
      setSearchStatus(statusKey);
      renderMedicines();
      renderSelection(false);
      updateUnits();
      if (!output.hidden) calculate();
    }

    form.addEventListener('input', event => {
      clearResult();
      if (event.target === controls.search) clearSearch();
      if (event.target === controls.customName || event.target === controls.customPresentation) {
        event.target.setCustomValidity('');
        if (customConfirmed) {
          customConfirmed = false;
          clearRegimen();
          renderPresentation(true);
        }
      }
    });
    form.addEventListener('change', event => {
      clearResult();
      if (event.target === controls.medicine) renderSelection(true);
      if (event.target === controls.mode) renderMode();
      if (event.target === controls.ageUnit) controls.age.value = '';
      if (event.target === controls.presentation) {
        customConfirmed = false;
        clearRegimen();
        renderPresentation(true);
      }
      if (event.target === controls.indication) renderApplicability();
      if (event.target === controls.unit || event.target === controls.basis) {
        controls.quantity.value = '';
        if (event.target === controls.unit) {
          for (const key of ['maxDose', 'maxDaily']) controls[key].value = '';
          setConcentration();
        }
        updateUnits();
      }
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      calculate();
    });
    form.querySelector('[data-dose-search]').addEventListener('click', search);
    controls.search.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        search();
      }
    });
    confirmPresentation.addEventListener('click', () => {
      if (controls.medicine.value === 'custom' && !controls.customName.value.trim()) {
        controls.customName.setCustomValidity(t('drugName'));
        return controls.customName.reportValidity();
      }
      if (!controls.customPresentation.value.trim()) {
        controls.customPresentation.setCustomValidity(t('exactPresentation'));
        return controls.customPresentation.reportValidity();
      }
      customConfirmed = true;
      renderPresentation(true);
    });
    document.addEventListener('hub:languagechange', localize);
    localize();
  }

  window.hubDoseMount = mount;
})();
