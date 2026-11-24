/* Interface local da calculadora. Dados digitados e resultados ficam no formulário. */
(function () {
  'use strict';
  const { products, sources, reviewedOn, automatic, manual } = window.HubDoseRules;
  const CMED = 'https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/cmed/precos';
  const BULARIO = 'https://www.gov.br/anvisa/pt-br/sistemas/bulario-eletronico';
  const { buildCatalog, routes } = window.HubDoseCatalog;
  let registryRequest;
  const copy = {
    search: ['Buscar princípio ativo', 'Search generic name', 'Buscar principio activo'],
    searchHint: ['Ex. dipirona', 'E.g. dipyrone', 'Ej. dipirona'],
    searchButton: ['Buscar', 'Search', 'Buscar'],
    searchPending: ['Buscando medicamentos e apresentações…', 'Searching for medications and strengths…', 'Buscando medicamentos y presentaciones…'],
    searchRequired: ['Digite o princípio ativo para buscar.', 'Enter a generic name to search.', 'Escriba el principio activo para buscar.'],
    searchOffline: ['A lista da CMED está indisponível. A busca consultou o catálogo do Hub.', 'The CMED list is unavailable. Search used the Hub catalog.', 'La lista de CMED está indisponible. La búsqueda consultó el catálogo del Hub.'],
    refine: ['Use um nome mais específico para ver mais resultados.', 'Use a more specific name to narrow the results.', 'Use un nombre más específico para acotar los resultados.'],
    medicine: ['Princípio ativo', 'Generic name', 'Principio activo'],
    selectDrug: ['Selecione um medicamento', 'Select a medication', 'Seleccione un medicamento'],
    select: ['Selecione', 'Select', 'Seleccione'],
    custom: ['Outro medicamento', 'Another medication', 'Otro medicamento'],
    unknown: ['Nenhuma apresentação encontrada. Use “Outro medicamento” para informar o teor e a posologia prescrita.', 'No oral liquid in mg/mL found. Use “Another medication” to enter the concentration and prescribed regimen.', 'No se encontró un líquido oral en mg/mL. Use «Otro medicamento» para introducir la concentración y la pauta prescrita.'],
    drugName: ['Princípio ativo', 'Generic name', 'Principio activo'],
    age: ['Idade completa', 'Age in completed years or months', 'Edad cumplida'],
    ageUnit: ['Unidade da idade', 'Age unit', 'Unidad de edad'],
    years: ['Anos', 'Years', 'Años'],
    months: ['Meses', 'Months', 'Meses'],
    kg: ['Peso (kg)', 'Weight (kg)', 'Peso (kg)'],
    mode: ['Esquema', 'Regimen', 'Esquema'],
    auto: ['Posologia de bula', 'Product-label dosing', 'Posología de ficha técnica'],
    manual: ['Cálculo manual', 'Manual calculation', 'Cálculo manual'],
    manualOnly: ['Apresentação da CMED: informe a posologia prescrita. O cadastro da apresentação não valida automaticamente a dose.', 'CMED product: enter the prescribed regimen. A listing does not validate the dose.', 'Presentación CMED: introduzca la dosis prescrita; el registro no valida la posología.'],
    prescribedRegimen: ['Informar posologia prescrita', 'Enter prescribed regimen', 'Introducir pauta prescrita'],
    presentation: ['Apresentação e via', 'Product strength and route', 'Presentación y vía'],
    otherPresentation: ['Outra apresentação (manual)', 'Other strength (manual)', 'Otra presentación (manual)'],
    exactPresentation: ['Concentração oral (mg/mL) ou teor (mg/unidade)', 'Oral concentration (mg/mL) or strength (mg/unit)', 'Concentración oral (mg/mL) o contenido (mg/unidad)'],
    customKind: ['Forma da apresentação', 'Dosage form', 'Forma farmacéutica'],
    customLiquid: ['Líquido oral (mg/mL)', 'Oral liquid (mg/mL)', 'Líquido oral (mg/mL)'],
    customSolid: ['Comprimido (mg/unidade)', 'Tablet (mg/unit)', 'Comprimido (mg/unidad)'],
    routeUnavailable: ['Apresentação encontrada, mas não é possível calcular esta via ou associação de substâncias nesta calculadora oral.', 'Product found, but this route or combination cannot be calculated here.', 'Presentación encontrada, pero esta vía o asociación no admite cálculo aquí.'],
    fractionNote: ['Quantidade fracionária apenas matemática: não presume que comprimidos possam ser partidos ou cápsulas abertas. Confirme a possibilidade de fracionamento e prefira a apresentação com teor adequado.', 'Fractional tablet count is mathematical only; splitting may be contraindicated.', 'La fracción de comprimido es solo matemática; puede no ser divisible.'],
    exactPresentationHint: ['Ex. 50', 'E.g. 50', 'Ej. 50'],
    confirmPresentation: ['Usar concentração', 'Use concentration', 'Usar concentración'],
    concentrationInvalid: ['Informe concentração em mg/mL ou teor em mg por comprimido maior que zero.', 'Enter concentration in mg/mL or mg per tablet greater than zero.', 'Indique concentración en mg/mL o contenido en mg por comprimido.'],
    pediatricOnly: ['Esta calculadora é para pacientes com menos de 18 anos.', 'This calculator is for patients younger than 18 years.', 'Esta calculadora es para pacientes menores de 18 años.'],
    criteria: ['Critérios e referências', 'Criteria and references', 'Criterios y referencias'],
    cmedList: ['Apresentações da CMED', 'CMED product listings', 'Presentaciones de CMED'],
    cmedSource: ['Apresentações CMED · %1', 'CMED product list · %1', 'Presentaciones CMED · %1'],
    bularioSource: ['Bulário Eletrônico da Anvisa', 'Anvisa Electronic Drug Labels', 'Vademécum de Anvisa'],
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
    sbpFebre: ['SBP 2025, Quadro 1', 'SBP 2025, Table 1', 'SBP 2025, Cuadro 1'],
    emaDipirona: ['EMA, posologia, seção 4.2', 'EMA, dosing, section 4.2', 'EMA, posología, sección 4.2'],
    reviewed: ['Fonte conferida em %1', 'Source checked on %1', 'Fuente revisada el %1'],
    result: ['Dose por administração', 'Dose per administration', 'Dosis por administración'],
    initialDose: ['Dose inicial por administração', 'Starting dose per administration', 'Dosis inicial por administración'],
    total: ['Total em 24 h', 'Total in 24 hours', 'Total en 24 h'],
    frequency: ['Frequência', 'Frequency', 'Frecuencia'],
    dailyFrequency: ['1 vez ao dia', 'Once daily', 'Una vez al día'],
    multipleFrequency: ['%1 vezes ao dia', '%1 times daily', '%1 veces al día'],
    asNeededFrequency: ['A cada %1 h, se necessário. Até %2 vezes em 24 h.', 'Every %1 hours as needed. Up to %2 times in 24 hours.', 'Cada %1 h si es necesario. Hasta %2 veces en 24 h.'],
    maxCalculatedDaily: ['Máximo em 24 h com esta dose', '24-hour maximum with this dose', 'Máximo en 24 h con esta dosis'],
    oralInterval: ['A cada %1 h', 'Every %1 hours', 'Cada %1 h'],
    perKg: ['%1 mg/kg por dose', '%1 mg/kg per dose', '%1 mg/kg por dosis'],
    weightCalculation: ['Cálculo inicial com %1 kg × %2 mg/kg.', 'Starting calculation with %1 kg × %2 mg/kg.', 'Cálculo inicial con %1 kg × %2 mg/kg.'],
    labelMinimumApplied: ['Aplicada a menor dose da bula para o peso informado.', 'Used the lowest label dose for the entered weight.', 'Se aplicó la dosis mínima de la ficha para el peso indicado.'],
    wholeDropApplied: ['Ajustada para gota inteira dentro dos limites da apresentação.', 'Adjusted to a whole drop within the limits for this product.', 'Se ajustó a una gota entera dentro de los límites de la presentación.'],
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
    loratadineBoundary: ['A referência deste xarope separa pesos abaixo e acima de 30 kg entre 2 e 12 anos. Para 30 kg exatos, informe a posologia prescrita.', 'The reference for this syrup separates weights below and above 30 kg from ages 2 through 12. At exactly 30 kg, enter the prescribed regimen.', 'La referencia de este jarabe separa los pesos inferiores y superiores a 30 kg entre los 2 y los 12 años. Para 30 kg exactos, introduzca la pauta prescrita.'],
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
    dipyroneLiquid: ['De 3 meses a menos de 15 anos, com peso de 5 a 53 kg. De 15 a menos de 18 anos, com peso acima de 53 kg.', 'From 3 months to under 15 years at 5 to 53 kg. From 15 to under 18 years at over 53 kg.', 'De 3 meses a menos de 15 años, con un peso de 5 a 53 kg. De 15 a menos de 18 años, con un peso superior a 53 kg.'],
    dipyroneAdult: ['O esquema desta apresentação exige idade a partir de 15 anos e peso acima de 53 kg.', 'This product’s regimen requires age 15 or older and weight over 53 kg.', 'La pauta de esta presentación exige al menos 15 años y un peso superior a 53 kg.'],
    dipyroneMeasure: ['A dose mensurável fica fora dos limites desta apresentação para o peso informado. Confira a bula e a formulação.', 'The measurable dose falls outside this product’s limits for the entered weight. Check the label and formulation.', 'La dosis medible queda fuera de los límites de esta presentación para el peso indicado. Consulte la ficha y la formulación.'],
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
    painFever: ['Febre ou dor leve a moderada', 'Fever or mild to moderate pain', 'Fiebre o dolor leve a moderado'],
    anti: ['Anti-histamínicos', 'Antihistamines', 'Antihistamínicos'],
    topicos: ['Corticoides tópicos', 'Topical corticosteroids', 'Corticoides tópicos'],
    olhos: ['Colírios', 'Eye drops', 'Colirios'],
    nasais: ['Medicamentos nasais', 'Nasal medications', 'Medicamentos nasales'],
    inalatoria: ['Terapia inalatória', 'Inhaled therapy', 'Terapia inhalada'],
    ibps: ['IBPs', 'PPIs', 'IBP'],
    outros: ['Outros medicamentos', 'Other medications', 'Otros medicamentos']
  };
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

  // Esquemas pediátricos por diagnóstico; não equivalem a posologia de bula.
  const antibioticPresets = [["Sinusite bacteriana — dose habitual (ABORL-CCF 2024)",25,2,12,1000,2000,"7–10 dias; ABORL-CCF: 25–50 mg/kg/dia, aqui selecionado 50. Observar casos leves selecionados; tratar quando indicado.","https://pmc.ncbi.nlm.nih.gov/articles/PMC12148406/#t0020",false],["Sinusite — dose alta (ABORL-CCF 2024 / consenso 2025)",45,2,12,1000,2000,"7–10 dias (ABORL); consenso 2025: pelo menos 10 dias. Suspeita de pneumococo menos sensível; não usar de rotina.","https://pmc.ncbi.nlm.nih.gov/articles/PMC12148406/#t0020",false],["Pneumonia não complicada — SBP 2022",25,2,3,2000,4000,"7 dias (SBP); 5 dias em casos selecionados sem gravidade e com boa evolução. Reavaliar em 48–72 h. Máximo SBP 4 g/dia.","https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/agosto/03/23358e-DC-Pneumonias_Adquiridas_Nao_Complicadas.pdf",false],["Pneumonia não complicada — SBP 2022, 8/8 h",16.666666666666668,3,3,1333.3333333333333,4000,"7 dias (SBP); 5 dias em casos selecionados sem gravidade. Reavaliar em 48–72 h.","https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/agosto/03/23358e-DC-Pneumonias_Adquiridas_Nao_Complicadas.pdf",false],["Pneumonia — dose alta (consenso intersocietário 2024)",30,3,3,1000,3000,"5 dias se não complicada e boa evolução; resistência local e avaliação clínica.","https://pmc.ncbi.nlm.nih.gov/articles/PMC11491012/",false],["Pneumonia — dose alta, 12/12 h (consenso 2024)",45,2,3,1000,2000,"5 dias se não complicada; alternativa de intervalo para adesão. Teto operacional conservador UCSF.","https://pmc.ncbi.nlm.nih.gov/articles/PMC11491012/",false],["Otite média aguda — dose habitual (SBP)",25,2,6,1000,2000,"SBP: 40–50 mg/kg/dia; aqui selecionado 50. Duração AAP: 5–7 dias em maiores com doença leve; 10 dias se <2 anos ou grave. Observação em casos elegíveis.","https://www.sbp.com.br/pediatria-para-familias/doencas/otite-media/",false],["Otite média aguda — dose alta (AAP / consenso 2025)",45,2,6,1000,2000,"AAP: 80–90 mg/kg/dia; aqui selecionado 90. 10 dias se <2 anos ou grave; 7 dias de 2–5 anos leve/moderada; 5–7 dias ≥6 anos leve/moderada.","https://www.sbp.com.br/fileadmin/user_upload/pdfs/CLINICAL_PRACTICE_GUIDELINE_The_Diagnosis_Management-of-Acute-Otitis-Media.pdf",false],["Faringoamigdalite por S. pyogenes — CDC",25,2,36,500,1000,"10 dias; confirmar por teste rápido/cultura conforme indicação. Não é tratamento dirigido ao pneumococo.","https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html",false],["Faringoamigdalite por S. pyogenes — dose diária única",50,1,36,1000,1000,"10 dias; confirmar diagnóstico. Clavulanato não indicado de rotina.","https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html",false],["Sinusite — amoxicilina/clavulanato, dose habitual",22.5,2,12,875,1750,"7–10 dias; produtores de betalactamase ou falha; IDSA favorece a associação empiricamente.","https://pmc.ncbi.nlm.nih.gov/articles/PMC12148406/#t0020",true],["Sinusite — amoxicilina/clavulanato, dose alta",45,2,12,2000,4000,"7–10 dias (ABORL); ≥10 dias (consenso 2025). Quadro grave ou risco de resistência; selecionar 600/42,9 mg/5 mL. Teto 2 g/dose é excepcional em alto risco; verificar limite da formulação.","https://pmc.ncbi.nlm.nih.gov/articles/PMC11948864/",true],["Otite — amoxicilina/clavulanato, dose alta",45,2,6,1000,2000,"10 dias se <2 anos ou grave; 5–7 dias em crianças maiores de baixo risco. Amoxicilina nos últimos 30 dias, conjuntivite purulenta, recorrência sem resposta ou falha 48–72 h.","https://www.sbp.com.br/fileadmin/user_upload/pdfs/CLINICAL_PRACTICE_GUIDELINE_The_Diagnosis_Management-of-Acute-Otitis-Media.pdf",true],["Pneumonia — associação, se suspeita de produtores de betalactamase",22.5,2,3,875,1750,"Não é primeira escolha para pneumococo isolado. SBP 2022 admite associação como segunda opção em dose habitual; reavaliar falha, complicações e etiologia; individualizar duração.","https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/agosto/03/23358e-DC-Pneumonias_Adquiridas_Nao_Complicadas.pdf",true]];
  const antibioticSources = {"sbp":"https://www.sbp.com.br/fileadmin/user_upload/sbp/2022/agosto/03/23358e-DC-Pneumonias_Adquiridas_Nao_Complicadas.pdf","aborl":"https://pmc.ncbi.nlm.nih.gov/articles/PMC12148406/#t0020","sin":"https://pmc.ncbi.nlm.nih.gov/articles/PMC11948864/","oma":"https://pmc.ncbi.nlm.nih.gov/articles/PMC11844117/","aap":"https://www.sbp.com.br/fileadmin/user_upload/pdfs/CLINICAL_PRACTICE_GUIDELINE_The_Diagnosis_Management-of-Acute-Otitis-Media.pdf","sbpoma":"https://www.sbp.com.br/pediatria-para-familias/doencas/otite-media/","cdc":"https://www.cdc.gov/group-a-strep/hcp/clinical-guidance/strep-throat.html","pneumo":"https://pmc.ncbi.nlm.nih.gov/articles/PMC11491012/","ucsf":"https://idmp.ucsf.edu/content/maximum-dosing-for-amoxicillin-and-amoxicillin-clavulanate-0","idsa":"https://www.idsociety.org/practice-guideline/community-acquired-pneumonia-in-infants-and-children/","cdcoma":"https://www.cdc.gov/antibiotic-use/hcp/clinical-care/pediatric-outpatient.html"};
  function antibioticType(name) {
    const n = normalize(name || '');
    if (!/amoxicilina/.test(n)) return '';
    if (/clavulan/.test(n) && !/sulbactam|azitromicina|omeprazol|claritromicina/.test(n)) return 'combo';
    if (/^(amoxicilina|amoxicilina tri-hidratada|amoxicilina tri hidratada|amoxicilina triidratada|amoxicilina trihidratada)$/.test(n)) return 'plain';
    return '';
  }
  function catalog(entries, registry = []) {
    const list = buildCatalog(entries, registry, products);
    function curated(name, type, forms) {
      const found = list.filter(item => antibioticType(item.name) === type);
      const primary = found.find(item => normalize(item.name) === normalize(name));
      const item = primary || {key: normalize(name), name, group:'outros', aliases:new Set(), presentations:[], registered:[], keywords:new Set([normalize(name)]), terms:normalize(name)};
      const keywords = new Set([normalize(name), ...found.flatMap(x=>[...x.keywords])]);
      item.keywords = keywords; item.terms = [...keywords].join(' ');
      item.registered = [...forms, ...found.flatMap(x=>x.registered).map(x=>type==='combo'?{...x,calculable:false}:x)];
      return item;
    }
    const plain = [200,250,400,500].map(mg=>({form:'oralSuspension',strength:mg+' mg/5 mL',concentration:mg/5,calculable:true,label:mg+' mg/5 mL · suspensão oral (conferir apresentação)'}));
    plain.push(...[500,875].map(mg=>({form:'tablet',strength:mg+' mg',unitSize:mg,calculable:true,label:mg+' mg/unidade · conferir apresentação'})));
    const combo = [[200,28.5],[400,57],[600,42.9]].map(([a,c])=>({form:'oralSuspension',strength:a+' + '+c+' mg/5 mL',concentration:a/5,clavConcentration:c/5,calculable:true,label:a+' + '+String(c).replace('.',',')+' mg/5 mL · suspensão oral'}));
    return [...list.filter(x=>!antibioticType(x.name)), curated('Amoxicilina','plain',plain),curated('Amoxicilina + clavulanato de potássio','combo',combo)];
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
      '<p class="med-dose-note" data-dose-route-alert role="status" hidden></p></div>' +
      '<div class="med-dose-wide med-dose-custom" data-dose-custom hidden>' +
      '<label class="med-dose-wide" data-dose-custom-name hidden>' + label('drugName') + '<input type="text" name="customName" maxlength="100"></label>' +
      field('customKind', '<select name="customUnit"><option value="liquid" data-dose-copy="customLiquid"></option><option value="tablet" data-dose-copy="customSolid"></option></select>') +
      field('exactPresentation', '<input type="text" name="customPresentation" inputmode="decimal" maxlength="20" data-dose-placeholder="exactPresentationHint">') +
      '<button type="button" class="med-dose-calculate" data-dose-confirm>' + label('confirmPresentation') + '</button></div></div>' +
      '<div data-dose-patient hidden><input type="hidden" name="mode" value="auto"><input type="hidden" name="unit" value="mg">' +
      '<fieldset data-dose-auto hidden><div class="med-dose-grid">' +
      field('indication', '<select name="indication"></select>', true) + '</div></fieldset>' +
      '<div class="med-dose-grid med-dose-patient-grid">' +
      '<div class="med-dose-age">' + field('age', input('age', 'numeric')) +
      '<label class="med-dose-age-unit">' + label('ageUnit') + selects('ageUnit', [['years', true], ['months', true]]) + '</label></div>' +
      field('kg', input('weight')) +
      '</div><p class="med-dose-note" data-dose-manual-only hidden>' + label('manualOnly') + '</p>' +
      '<fieldset data-dose-manual hidden><div class="med-dose-grid">' +
      field('basis', selects('basis', [['kgDose', true], ['kgDay', true], ['fixedDose', true], ['fixedDay', true]]), true) +
      '<div class="med-dose-wide" data-dose-antibiotic hidden></div>' +
      field('quantity', input('quantity')) +
      field('times', input('times', 'numeric')) + '<input type="hidden" name="concentration">' +
      '</div><details class="med-dose-limits"><summary>' + label('limits') + '</summary><div class="med-dose-grid">' +
      field('minAge', input('minAge', 'numeric')) + field('maxAge', input('maxAge', 'numeric')) +
      field('maxDose', input('maxDose')) + field('maxDaily', input('maxDaily')) +
      '</div></details></fieldset>' +
      '<button type="submit" class="med-dose-calculate">' + label('calculate') + '</button>' +
      '<div class="med-dose-result" data-dose-result role="status" aria-live="polite" aria-atomic="true" hidden></div>' +
      '<details class="med-dose-references" data-dose-references hidden><summary>' + label('criteria') + '</summary>' +
      '<div class="med-dose-note" data-dose-applicability></div>' +
      '<p class="med-dose-note" data-dose-registry-source hidden></p></details></div></form>';

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
    const referenceDetails = form.querySelector('[data-dose-references]');
    const registryNote = form.querySelector('[data-dose-registry-source]');
    const routeAlert = form.querySelector('[data-dose-route-alert]');
    const manualOnly = form.querySelector('[data-dose-manual-only]');
    const searchStatus = form.querySelector('[data-dose-search-status]');
    const hint = form.querySelector('[data-dose-applicability]');
    const output = form.querySelector('[data-dose-result]');
    const antibioticPanel = form.querySelector('[data-dose-antibiotic]');
    let antibioticApplied = null;
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
    const measure = (amount, unit, cap = false) => {
      const shown = cap
        ? new Intl.NumberFormat(locale, { maximumSignificantDigits: 8, useGrouping: false, roundingMode: 'trunc' }).format(amount)
        : format(amount);
      const approximate = Math.abs(parseDecimal(shown) - amount) > Math.abs(amount) * Number.EPSILON * 2;
      return (approximate ? '≈ ' : '') + shown + ' ' + unit;
    };
    const ageLabel = months => months % 12 === 0 && months > 0
      ? t(months === 12 ? 'yearAge' : 'yearsAge', format(months / 12))
      : t(months === 1 ? 'monthAge' : 'monthsAge', format(months));
    const current = () => shown.find(item => item.key === controls.medicine.value);
    const chosenProduct = () => chosenPresentation()?.product;
    const chosenPresentation = () => presentationOptions.get(controls.presentation.value);
    const number = name => parseDecimal(controls[name].value);
    const dateLabel = date => new Intl.DateTimeFormat(locale, { timeZone: 'UTC' }).format(new Date(date));

    function activeAntibiotic() {
      return antibioticType(current()?.name || controls.customName.value);
    }
    function renderAntibiotic() {
      const type = activeAntibiotic();
      const visible = !!type && !patient.hidden && controls.mode.value === 'manual';
      antibioticPanel.hidden = !visible;
      if (!visible) { antibioticPanel.replaceChildren(); antibioticApplied = null; return; }
      const selected = chosenPresentation();
      const rows = antibioticPresets.map((p,i)=>({p,i})).filter(({p})=>p[8] === (type==='combo'));
      antibioticPanel.innerHTML = '<section class="med-dose-regulatory"><strong>Recomendações pediátricas por indicação</strong>' +
        '<p>Via oral, infecção não complicada, quando antibiótico indicado. Dose em mg/kg/dose de amoxicilina. Selecione o esquema e aplique ao cálculo. Tetos operacionais por referência, não equivalem à dose máxima de bula.</p>' +
        '<label>Diagnóstico e diretriz<select data-antibiotic-scheme>'+option('','Selecione o esquema')+
        rows.map(({p,i})=>option(i,p[0]+' · '+format(p[1])+' mg/kg/dose · '+format(24/p[2])+'/'+format(24/p[2])+' h')).join('')+'</select></label>'+
        '<div data-antibiotic-detail></div><button type="button" class="med-dose-calculate" data-antibiotic-apply>Aplicar dose recomendada</button>'+
        '<p>Clavulanato: útil contra H. influenzae e M. catarrhalis produtores de betalactamase; não corrige resistência pneumocócica por alteração das PBPs. Faringoamigdalite: alvo S. pyogenes; não associar de rotina.</p>'+
        '<p>Imunodeficiência (inclusive deficiência de anticorpos), suspeita de doença invasiva, alergia relevante a betalactâmicos, disfunção renal ou sinais de gravidade: avaliação individual; não aplicar automaticamente. Reavaliar em 48–72 h. Lactentes pequenos com febre exigem avaliação urgente.</p>'+
        '<p><a href="'+antibioticSources.ucsf+'" target="_blank" rel="noopener noreferrer">Limites e formulações (UCSF)</a> · <a href="'+antibioticSources.idsa+'" target="_blank" rel="noopener noreferrer">IDSA/PIDS 2026: atualização de pneumonia complicada</a> · <a href="'+antibioticSources.cdcoma+'" target="_blank" rel="noopener noreferrer">CDC: indicação e uso racional</a></p></section>';
      const select = antibioticPanel.querySelector('[data-antibiotic-scheme]');
      const detail = antibioticPanel.querySelector('[data-antibiotic-detail]');
      const button = antibioticPanel.querySelector('[data-antibiotic-apply]');
      function show() {
        const p = select.value === '' ? null : antibioticPresets[Number(select.value)];
        detail.innerHTML = p ? '<p>'+escape(format(p[1]*p[2])+' mg/kg/dia · '+format(p[1])+' mg/kg/dose · teto '+format(p[4])+' mg/dose e '+format(p[5])+' mg/dia · idade mínima operacional '+p[3]+' meses')+'</p><p>'+escape(p[6])+'</p><a href="'+escape(p[7])+'" target="_blank" rel="noopener noreferrer">Referência do esquema</a>' : '';
        button.disabled = !p || (type==='combo' && (!(selected?.clavConcentration>0) || (p[1]*p[2]*selected.clavConcentration/selected.concentration > 6.45)));
        if (p && button.disabled) detail.insertAdjacentHTML('beforeend','<p>Selecione uma formulação com relação amoxicilina/clavulanato adequada. Para dose alta, prefira 600/42,9 mg por 5 mL (aprox. 14:1).</p>');
      }
      if (antibioticApplied !== null && rows.some(x=>x.i===antibioticApplied)) select.value=String(antibioticApplied);
      select.addEventListener('change',show);
      button.addEventListener('click',()=>{
        if (button.disabled || select.value==='') return;
        const i=Number(select.value), p=antibioticPresets[i];
        controls.basis.value='kgDose'; controls.quantity.value=String(p[1]); controls.times.value=String(p[2]);
        controls.minAge.value=String(p[3]); controls.maxAge.value='215'; controls.maxDose.value=String(p[4]); controls.maxDaily.value=String(p[5]);
        antibioticApplied=i; updateUnits(); clearResult();
      });
      show();
    }
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
      controls.medicine.innerHTML = option('', t('selectDrug')) + shown.map(item => option(item.key, item.name)).join('') +
        option('custom', t('custom'));
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

    function concentrationLabel(value) {
      return format(value) + ' mg/mL';
    }

    function fillChoices(control, options) {
      const keep = control.value;
      control.innerHTML = option('', t('select')) + options.join('');
      if ([...control.options].some(item => item.value === keep) && keep) control.value = keep;
      else control.selectedIndex = options.length === 1 ? 1 : 0;
    }

    function referenceLink(key, label) {
      return '<a href="' + escape(sources[key]) + '" target="_blank" rel="noopener noreferrer">' + escape(t(label)) + '</a>';
    }

    function sourceLink(product) {
      return referenceLink(product.source, product.sourceSection || 'source');
    }

    function renderIndications() {
      const product = chosenProduct();
      fillChoices(controls.indication, (product?.uses || []).map(key => option(key, t(key))));
      renderApplicability();
    }

    function regulatoryRanges(product) {
      const bands = (product.bands || []).filter(b => !b.only || b.only === controls.indication.value);
      if (!bands.length) return '<p>Faixa etária e dose máxima não cadastradas para esta indicação.</p>';
      const unit = product.unit === 'spray' ? 'jatos' : product.unit === 'drop' ? 'gotas' :
        product.unit === 'inhalation' ? 'inalações' : product.unit === 'application' ? 'aplicações' : 'mg';
      const rows = bands.map(b => {
        const age = b.before === Infinity ? t('fromAge', ageLabel(b.from)) :
          t('ageRange', ageLabel(b.from), ageLabel(b.before));
        const weight = b.minKg != null && b.maxKg != null ? format(b.minKg) + '–' + format(b.maxKg) + ' kg' :
          b.minKg != null ? '≥ ' + format(b.minKg) + ' kg' :
          b.maxKg != null ? '≤ ' + format(b.maxKg) + ' kg' :
          b.aboveKg != null ? '> ' + format(b.aboveKg) + ' kg' :
          b.belowKg != null ? '< ' + format(b.belowKg) + ' kg' : '';
        const max = Number.isFinite(b.maxDaily) && b.maxDaily > 0
          ? 'Máximo cadastrado: ' + format(b.maxDaily) + ' ' + unit + '/24 h'
          : 'Teto numérico específico não cadastrado';
        return '<li>' + escape(age + (weight ? ' · ' + weight : '') + ' — ' + max) + '</li>';
      });
      return '<div class="med-dose-regulatory"><strong>Faixa etária e dose máxima da apresentação</strong><ul>' +
        [...new Set(rows)].join('') +
        '</ul><small>Os limites exibidos só correspondem à indicação e à apresentação selecionadas; a ausência de teto numérico não significa dose ilimitada.</small></div>';
    }

    function renderApplicability() {
      const product = chosenProduct();
      hint.replaceChildren();
      if (!product) return;
      if (product.asNeeded) {
        hint.innerHTML = regulatoryRanges(product) + escape(t(product.outside)) + ' ' + sourceLink(product);
        return;
      }
      const ranges = product.bands.filter(b => !b.only || b.only === controls.indication.value).map(b => {
        const age = b.before === Infinity ? t('fromAge', ageLabel(b.from)) : t('ageRange', ageLabel(b.from), ageLabel(b.before));
        const weight = b.minKg != null && b.maxKg != null ? ' · ' + format(b.minKg) + '–' + format(b.maxKg) + ' kg' :
          b.minKg != null ? ' · ' + t('minWeight', format(b.minKg)) :
          b.maxKg != null ? ' · ≤ ' + format(b.maxKg) + ' kg' :
          b.belowKg != null ? ' · < ' + format(b.belowKg) + ' kg' :
          b.aboveKg != null ? ' · > ' + format(b.aboveKg) + ' kg' : '';
        return age + weight;
      });
      const ageRanges = ranges.length ? escape(t('eligible')) + ' · ' + escape([...new Set(ranges)].join(' / ')) + '<br>' : '';
      hint.innerHTML = regulatoryRanges(product) + ageRanges + sourceLink(product);
    }

    function renderMode() {
      const isManual = controls.mode.value === 'manual';
      autoFields.disabled = autoFields.hidden = isManual;
      manualFields.disabled = manualFields.hidden = !isManual;
    }

    function setConcentration() {
      const selected = chosenPresentation();
      const mgPerMl = selected?.concentration ?? (customConfirmed && controls.customUnit.value === 'liquid' ? number('customPresentation') : undefined);
      controls.concentration.value = mgPerMl > 0 ? format(mgPerMl) : '';
    }

    function renderPresentation(resetMode) {
      const selected = chosenPresentation();
      const product = selected?.product;
      const entered = controls.presentation.value === 'custom';
      const customDrug = controls.medicine.value === 'custom';
      customPresentation.hidden = !entered;
      customName.hidden = !customDrug;
      controls.customName.disabled = !customDrug;
      const unsupported = selected?.calculable === false;
      const ready = !unsupported && (!!selected || (entered && customConfirmed));
      patient.hidden = !ready;
      routeAlert.hidden = !unsupported;
      routeAlert.textContent = unsupported ? t('routeUnavailable') : '';
      if (resetMode || !product) controls.mode.value = product ? 'auto' : 'manual';
      manualOnly.hidden = !ready || controls.mode.value !== 'manual';
      registryNote.hidden = !selected?.raw && !unsupported;
      registryNote.innerHTML = registryNote.hidden ? '' :
        (registryDate ? '<a href="' + CMED + '" target="_blank" rel="noopener noreferrer">' + escape(t('cmedSource', dateLabel(registryDate))) + '</a> · ' : '') +
        '<a href="' + BULARIO + '" target="_blank" rel="noopener noreferrer">' + escape(t('bularioSource')) + '</a>' +
        (unsupported ? '<p>' + escape(t('routeUnavailable')) + '</p>' : '') +
        (selected?.raw ? '<p>' + escape(selected.raw + (selected.brand ? ' · ' + selected.brand : '')) + '</p><p>Faixa etária e dose máxima de bula não foram validadas automaticamente para esta apresentação da CMED; a posologia manual não representa aprovação regulatória.</p>' : '');
      referenceDetails.hidden = (!ready && !unsupported) || (!product && registryNote.hidden);
      renderIndications();
      renderMode();
      if (resetMode) setConcentration();
      if (resetMode) antibioticApplied = null;
      renderAntibiotic();
    }

    function clearRegimen() {
      antibioticApplied = null;
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
        const seen = new Set();
        item.presentations.forEach(id => {
          const product = products[id];
          const value = { product, form: product.form, strength: product.strength, concentration: product.concentration,
            unitSize: product.unitSize, calculable: true };
          const signature = product.form + ':' + (product.concentration || product.unitSize) + ':' + product.strength;
          if (seen.has(signature)) return;
          seen.add(signature);
          presentationOptions.set(id, value);
        });
        item.registered.forEach((registered, index) => {
          const signature = registered.form + ':' + (registered.concentration || registered.unitSize || registered.strength) +
            ':' + (/\bLIB\s+(?:PROL|RETARD|MOD)\b/.exec(registered.raw)?.[0] || '');
          if (seen.has(signature)) return;
          seen.add(signature);
          presentationOptions.set('cmed-' + index, registered);
        });
        controls.presentation.innerHTML = option('', t('select')) + [...presentationOptions]
          .map(([id, value]) => option(id, value.label || (value.strength + ' · ' + (routes[value.form] || value.form)))).join('') +
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
      for (const key of ['maxDose', 'maxDaily']) {
        form.querySelector('[data-dose-copy="' + key + '"]').textContent = t(key, 'mg');
      }
      const suffix = { kgDose: '/kg/dose', kgDay: '/kg/24 h', fixedDose: '/dose', fixedDay: '/24 h' };
      form.querySelector('[data-dose-copy="quantity"]').textContent = t('quantity') + ' (mg' + suffix[controls.basis.value] + ')';
    }

    function metric(key, value) {
      return '<div><dt>' + escape(key) + '</dt><dd>' + escape(value) + '</dd></div>';
    }

    function showError(key, product) {
      output.classList.add('is-error');
      output.innerHTML = '<p>' + escape(t(key)) + '</p>' + (product ? sourceLink(product) +
        '<button type="button" class="med-dose-prescribed" data-dose-prescribed>' + escape(t('prescribedRegimen')) + '</button>' : '');
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
      const selected = chosenPresentation();
      if (selected?.calculable === false) return showError('routeUnavailable');
      const unitSize = selected?.unitSize || (controls.presentation.value === 'custom' && customConfirmed &&
        controls.customUnit.value === 'tablet' ? number('customPresentation') : undefined);
      if (!(number('concentration') > 0) && !(unitSize > 0)) return showError('concentrationInvalid');
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
      const { amount, times, ml, daily, maxDaily, maxDose, perKg, capped, asNeeded, intervalHours, guidance } = result;
      const type = activeAntibiotic();
      let antibioticNote = '';
      if (type === 'combo') {
        if (!(selected?.clavConcentration > 0) || !(selected?.concentration > 0) || !Number.isFinite(ml)) {
          output.classList.add('is-error'); output.textContent='Associação: selecione uma apresentação com ambas as concentrações confirmadas; não é seguro calcular pela soma dos componentes.'; output.hidden=false; return;
        }
        const clavDose = ml * selected.clavConcentration;
        const clavDailyKg = clavDose * times / kg;
        if (clavDailyKg > 6.45) {
          output.classList.add('is-error'); output.textContent='Clavulanato acima do alvo operacional de 6,4 mg/kg/dia (tolerância de arredondamento da formulação). Selecione outra apresentação ou revise o esquema.'; output.hidden=false; return;
        }
        antibioticNote = '<p class="med-dose-note">Amoxicilina: '+escape(measure(amount,'mg'))+'/dose · Clavulanato: '+escape(measure(clavDose,'mg'))+'/dose · '+escape(format(clavDailyKg))+' mg/kg/dia de clavulanato.</p>';
      }
      if (type && antibioticApplied !== null) {
        const p = antibioticPresets[antibioticApplied];
        antibioticNote += '<p class="med-dose-note">'+escape(p[0]+' · '+p[6])+' <a href="'+escape(p[7])+'" target="_blank" rel="noopener noreferrer">Fonte</a></p>';
      }
      const amountLabel = measure(amount, 'mg', capped);
      const unitCount = unitSize > 0 ? amount / unitSize : undefined;
      const unitLabel = selected?.form === 'capsule' ? 'cápsulas' : selected?.form === 'dragee' ? 'drágeas' : 'comprimidos';
      const administered = unitCount != null ? measure(unitCount, unitLabel, capped) : measure(ml, 'mL', capped);
      const schedule = asNeeded ? t('asNeededFrequency', format(intervalHours), format(times))
        : times === 1 ? t('dailyFrequency')
        : fromLabel ? t('oralInterval', format(24 / times)) : t('multipleFrequency', format(times));
      const dailyMetric = daily == null ? '' : metric(t('total'), measure(daily, 'mg', capped));
      const dailyMaxLabel = asNeeded ? t('maxCalculatedDaily') : t('maxDaily', 'mg');
      const dailyMaxMetric = maxDaily == null ? '' : metric(dailyMaxLabel, measure(maxDaily, 'mg'));
      const doseMaxMetric = maxDose == null ? '' : metric(t('maxDose', 'mg'), measure(maxDose, 'mg'));
      const reference = product ? [sourceLink(product), guidance && referenceLink(guidance, guidance),
        escape(t('reviewed', dateLabel(reviewedOn)))].filter(Boolean).join(' · ') : '';
      const notes = [
        perKg != null && (asNeeded ? t('weightCalculation', format(kg), format(perKg)) : t('perKg', format(perKg))),
        result.labelMinimumApplied && t('labelMinimumApplied'),
        result.wholeDropApplied && t('wholeDropApplied'),
        product?.note && t(product.note),
        !fromLabel && t('manualResult'),
        !fromLabel && ml != null && t('manualVolume'),
        unitCount != null && Math.abs(unitCount - Math.round(unitCount)) > 1e-8 && t('fractionNote'),
        capped && t('capped')
      ].filter(Boolean);
      output.classList.remove('is-error');
      const context = name + ' · ' + (selected?.label || selected?.strength ||
        (unitSize > 0 ? format(unitSize) + ' mg/comprimido' : concentrationLabel(number('concentration')))) +
        (product ? ' · ' + t(use) : '');
      output.innerHTML = '<p class="med-dose-context">' + escape(context) + '</p>' +
        '<p class="med-dose-result-title">' + escape(t(asNeeded ? 'initialDose' : 'result')) + '</p>' +
        '<p class="med-dose-amount">' + escape(administered) + '</p>' +
        '<p class="med-dose-amount-alt">' + escape(amountLabel) + '</p>' +
        '<dl>' + metric(t('frequency'), schedule) + dailyMetric + dailyMaxMetric + doseMaxMetric + '</dl>' +
        notes.map(note => '<p class="med-dose-note">' + escape(note) + '</p>').join('') +
        antibioticNote + (reference ? '<p class="med-dose-reference">' + reference + '</p>' : '');
      output.hidden = false;
    }

    function localize() {
      locale = window.HubI18n?.getLanguage() || 'pt-BR';
      messageIndex = locale === 'en' ? 1 : locale === 'es' ? 2 : 0;
      form.querySelectorAll('[data-dose-copy]').forEach(el => { el.textContent = t(el.dataset.doseCopy); });
      form.querySelectorAll('[data-dose-placeholder]').forEach(el => { el.placeholder = t(el.dataset.dosePlaceholder); });
      setSearchStatus(statusKey);
      renderMedicines();
      renderSelection(false);
      updateUnits();
      if (!output.hidden) calculate();
    }

    form.addEventListener('input', event => {
      clearResult();
      if (['quantity','times','basis','minAge','maxAge','maxDose','maxDaily'].some(key=>event.target===controls[key])) antibioticApplied=null;
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
      if (event.target === controls.ageUnit) controls.age.value = '';
      if (event.target === controls.presentation || event.target === controls.customUnit) {
        customConfirmed = false;
        clearRegimen();
        renderPresentation(true);
      }
      if (event.target === controls.indication) renderApplicability();
      if (event.target === controls.basis) {
        antibioticApplied = null;
        controls.quantity.value = '';
        updateUnits();
      }
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      calculate();
    });
    form.addEventListener('click', event => {
      if (!event.target.closest('[data-dose-prescribed]')) return;
      controls.mode.value = 'manual';
      manualOnly.hidden = false;
      clearResult();
      renderMode();
      renderAntibiotic();
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
      if (!(number('customPresentation') > 0)) {
        controls.customPresentation.setCustomValidity(t('concentrationInvalid'));
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
