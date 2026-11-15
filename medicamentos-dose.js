/* Interface local da calculadora. Dados digitados e resultados ficam no formulário. */
(function () {
  'use strict';
  const { products, sources, reviewedOn, automatic, manual } = window.HubDoseRules;
  const BULAS = 'https://consultas.anvisa.gov.br/#/bulario/';
  const copy = {
    search: ['Buscar por nome ou marca', 'Search by generic name or brand', 'Buscar por nombre o marca'],
    searchHint: ['Ex.: desloratadina ou Desalex', 'E.g. desloratadine or Desalex', 'Ej.: desloratadina o Desalex'],
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
    presentation: ['Apresentação', 'Product and strength', 'Presentación'],
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
    reviewed: ['Fonte conferida em %1', 'Source checked on %1', 'Fuente revisada el %1'],
    result: ['Por administração', 'Per administration', 'Por administración'],
    total: ['Total em 24 h', 'Total in 24 hours', 'Total en 24 h'],
    frequency: ['Frequência', 'Frequency', 'Frecuencia'],
    dailyFrequency: ['1 vez ao dia', 'Once daily', 'Una vez al día'],
    multipleFrequency: ['%1 vezes ao dia', '%1 times daily', '%1 veces al día'],
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
  const normalize = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function parseDecimal(value) {
    const text = value.trim();
    if (!text) return undefined;
    return /^(?:\d+([.,]\d+)?|[.,]\d+)$/.test(text) ? Number(text.replace(',', '.')) : NaN;
  }

  function catalog(entries) {
    const map = new Map();
    const add = (group, name, brand, productId) => {
      const key = normalize(name);
      if (!map.has(key)) map.set(key, { key, group, name, brands: new Set(), presentations: [] });
      const item = map.get(key);
      if (brand) item.brands.add(brand);
      if (productId) {
        item.group = group;
        item.presentations.push(productId);
      }
    };
    entries.forEach(item => add(item.group, item.name, item.brand));
    Object.entries(products).forEach(([id, item]) => add(item.group, item.drug, item.brand, id));
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
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
      '<div class="med-dose-grid">' +
      field('search', '<input type="search" name="search" data-dose-placeholder="searchHint" maxlength="100">', true) +
      field('medicine', '<select name="medicine"></select>', true) +
      '</div><p class="med-dose-note" data-dose-search-status role="status" hidden></p>' +
      '<div data-dose-patient hidden><div class="med-dose-grid">' +
      '<div class="med-dose-age">' + field('age', input('age', 'numeric')) +
      '<label class="med-dose-age-unit">' + label('ageUnit') + selects('ageUnit', [['years', true], ['months', true]]) + '</label></div>' +
      field('kg', input('weight')) +
      field('mode', selects('mode', [['auto', true], ['manual', true]]), true) +
      '</div><p class="med-dose-note" data-dose-manual-only hidden>' + label('manualOnly') + '</p>' +
      '<fieldset data-dose-auto hidden><div class="med-dose-grid">' +
      field('presentation', '<select name="presentation"></select>') +
      field('indication', '<select name="indication"></select>') +
      '</div><div class="med-dose-note" data-dose-applicability></div></fieldset>' +
      '<fieldset data-dose-manual hidden><div class="med-dose-grid">' +
      '<label class="med-dose-wide" data-dose-custom hidden>' + label('drugName') + '<input type="text" name="customName" maxlength="100"></label>' +
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
    const customName = form.querySelector('[data-dose-custom]');
    const manualOnly = form.querySelector('[data-dose-manual-only]');
    const searchStatus = form.querySelector('[data-dose-search-status]');
    const hint = form.querySelector('[data-dose-applicability]');
    const output = form.querySelector('[data-dose-result]');
    const medicines = catalog(entries);
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
    const current = () => medicines.find(item => item.key === controls.medicine.value);
    const chosenProduct = () => products[controls.presentation.value];
    const number = name => parseDecimal(controls[name].value);

    function clearResult() {
      output.hidden = true;
      output.replaceChildren();
    }

    function renderMedicines() {
      const keep = controls.medicine.value;
      const words = normalize(controls.search.value).trim().split(/\s+/).filter(Boolean);
      const matches = medicines.filter(item => {
        const terms = normalize([item.name, ...item.brands].join(' '));
        return words.every(word => terms.includes(word));
      });
      const groups = categories.filter(key => matches.some(item => item.group === key));
      controls.medicine.innerHTML = option('', t('selectDrug')) + groups.map(group =>
        '<optgroup label="' + escape(t(group)) + '">' + matches.filter(item => item.group === group)
          .map(item => option(item.key, item.name)).join('') + '</optgroup>').join('') + option('custom', t('custom'));
      controls.medicine.value = keep === 'custom' || matches.some(item => item.key === keep) ? keep : '';
      searchStatus.hidden = matches.length > 0;
      searchStatus.textContent = matches.length ? '' : t('unknown');
      return controls.medicine.value !== keep;
    }

    function presentation(product) {
      let strength = locale === 'en' ? product.strength.replace(/(\d),(\d)/g, '$1.$2') : product.strength;
      if (product.unit === 'spray') strength += ' ' + t('perSpray');
      if (product.unit === 'inhalation') strength += ' ' + t('perInhalation');
      return product.brand + ' · ' + t(product.form) + ' ' + strength;
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

    function renderSelection(resetMode) {
      const item = current();
      const custom = controls.medicine.value === 'custom';
      const available = item?.presentations || [];
      patient.hidden = !item && !custom;
      manualOnly.hidden = !item || !!available.length;
      controls.mode.options[0].disabled = !available.length;
      if (resetMode || !available.length) controls.mode.value = available.length ? 'auto' : 'manual';
      controls.mode.closest('label').hidden = !available.length;
      customName.hidden = !custom;
      controls.customName.disabled = !custom;
      fillChoices(controls.presentation, available.map(key => option(key, presentation(products[key]))));
      renderIndications();
      renderMode();
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
      const { amount, times, ml, tablets, drops, daily, maxDaily, maxDose, perKg, site, capped } = result;
      const unit = fromLabel ? result.unit : controls.unit.value;
      const amountLabel = measure(amount, unit, capped) + (site ? ' ' + t(site) : '');
      const administered = drops != null ? measure(drops, 'drop')
        : tablets != null ? measure(tablets, 'tabletCount') : ml != null ? measure(ml, 'mL', capped) : '';
      const schedule = product?.note === 'patanolTiming' ? t('patanolTiming')
        : times === 1 ? t('dailyFrequency')
        : fromLabel ? t('oralInterval', format(24 / times)) : t('multipleFrequency', format(times));
      const limitSite = site === 'nostril' ? ' ' + t('twoNostrils') : site === 'eye' ? ' ' + t('bothEyes') : '';
      const dailyMetric = daily == null ? '' : metric(t('total'), measure(daily, unit, capped) + limitSite);
      const dailyMaxMetric = maxDaily == null ? '' : metric(t('maxDaily', plural[unit] ? t(plural[unit]) : displayUnit(unit)), measure(maxDaily, unit) + limitSite);
      const doseMaxMetric = maxDose == null ? '' : metric(t('maxDose', displayUnit(unit)), measure(maxDose, unit));
      const reference = product ? sourceLink(product) + '<span> · ' + escape(t('reviewed', new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(new Date(reviewedOn)))) + '</span>' : '';
      const notes = [
        perKg != null && t('perKg', format(perKg)),
        product?.note && product.note !== 'patanolTiming' && t(product.note),
        !fromLabel && t('manualResult'),
        !fromLabel && ml != null && t('manualVolume'),
        capped && t('capped')
      ].filter(Boolean);
      output.classList.remove('is-error');
      output.innerHTML = '<p class="med-dose-context">' + escape(product ? presentation(product) + ' · ' + t(use) : name) + '</p>' +
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
      renderMedicines();
      renderSelection(false);
      updateUnits();
      if (!output.hidden) calculate();
    }

    form.addEventListener('input', event => {
      clearResult();
      if (event.target === controls.search && renderMedicines()) renderSelection(true);
      if (event.target === controls.customName) controls.customName.setCustomValidity('');
    });
    form.addEventListener('change', event => {
      clearResult();
      if (event.target === controls.medicine) {
        manualFields.querySelectorAll('input').forEach(el => { el.value = ''; });
        controls.customName.setCustomValidity('');
        renderSelection(true);
      }
      if (event.target === controls.mode) renderMode();
      if (event.target === controls.ageUnit) controls.age.value = '';
      if (event.target === controls.presentation) renderIndications();
      if (event.target === controls.indication) renderApplicability();
      if (event.target === controls.unit || event.target === controls.basis) {
        controls.quantity.value = '';
        if (event.target === controls.unit) {
          for (const key of ['concentration', 'maxDose', 'maxDaily']) controls[key].value = '';
        }
        updateUnits();
      }
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      calculate();
    });
    document.addEventListener('hub:languagechange', localize);
    localize();
  }

  window.hubDoseMount = mount;
})();
