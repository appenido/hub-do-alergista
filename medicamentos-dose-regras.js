/* Posologias de apresentações específicas. Idades em meses completos. */
(function () {
  'use strict';

  const reviewedOn = '2026-11-15';
  const sources = {
    desalex: 'https://organonpro.com/pt-br/wp-content/uploads/sites/4/2026/05/Desalex_bula-profissional.pdf',
    loratadina: 'https://www.ache.com.br/wp-content/uploads/loratadina-xarope_BU05_VPS_768-1.pdf',
    zyrtec: 'https://br.gsk.com/media/rrahp2do/zyrtec-solu%C3%A7%C3%A3o-oral.pdf',
    zyxem: 'https://img.drogasil.com.br/raiadrogasil_bula/ZYXEM.pdf',
    allegra: 'https://static.drogarianovaesperanca.com.br/pdf/bula-allegra-pediatrico-6mg-suspensao-frasco-com-150ml-sanofi-5260.pdf',
    alektos: 'https://assets-dam.takeda.com/raw/upload/v1675191271/legacy-dotcom/siteassets/pt-br/home/what-we-do/produtos/bula-alektos-ped_0320_vps.pdf',
    ebastel: 'https://eurofarma.com.br/produtos/bulas/view/healthcare/pt/bula-ebastel.html',
    asmofen: 'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Asmofen-Profissional-Consulta-Remedios.pdf',
    polaramine: 'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Polaramine-Profissional-Consulta-Remedios.pdf',
    elocom: 'https://drogariasp.vteximg.com.br/arquivos/41335---elocom-alum-creme-schering-plough-20g.pdf',
    avamys: 'https://br.gsk.com/media/6298/avamys.pdf',
    nasonex: 'https://www.organon.com/brazil/wp-content/uploads/sites/33/2023/06/nasonex_bula_profissional.pdf',
    flixonase: 'https://br.gsk.com/media/6275/flixonase-spray-nasal-aquoso.pdf',
    dymista: 'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Dymista-Profissional-Consulta-Remedios.pdf',
    ryaltris: 'https://glenmarkpharma.com.br/wp-content/uploads/2026/10/Ryaltris_Bula_Paciente_VP00.pdf',
    patanol: 'https://www.pro.novartis.com/br-pt/sites/pro_novartis_com_br/files/2026-01/Bula-PATANOL-Solucao-Oftalmica-Esteril-Medico.pdf',
    patanolS: 'https://www.pro.novartis.com/br-pt/sites/pro_novartis_com_br/files/2026-01/Bula-PATANOL-S-Solucao-Oftalmica-Esteril-Medico.pdf',
    seretide: 'https://br.gsk.com/media/e1apjdob/seretide-diskus-l1711-master.pdf',
    nexium: 'https://www.azmed.com.br/content/dam/multibrand/br/pt/azmed-2022/home/bulas-profissionais/bulas/Nexium_Bula_Profissional.pdf',
    singulair: 'https://www.organon.com/brazil/wp-content/uploads/sites/33/2023/06/singulair_bula_profissional.pdf',
    novalginaSolucao: 'https://www.novalgina.com.br/dam/jcr%3Ae7d8abe2-f90e-4ea9-b498-2c5c8d874580/bula_sol_oral.pdf',
    novalginaGotas: 'https://www.novalgina.com.br/dam/jcr%3A500f2f54-73af-4785-a006-5ee50b70c92a/Bula%20Novalgina%20Gotas.pdf',
    novalginaComprimidos: 'https://www.novalgina.com.br/dam/jcr%3Ae555a18f-8827-4522-a99e-6a36d1c2e4dc/Bula%20Novalgina%20Comprimido%201g_500mg.pdf',
    sbpFebre: 'https://www.sbp.com.br/fileadmin/user_upload/sbp/2025/maio/16/24896f-DC_-Abordag_Febre_Aguda_em_Pediatria_e_Reflexoes_VIRTUAL.pdf',
    emaDipirona: 'https://www.ema.europa.eu/en/documents/referral/metamizole-article-31-referral-annex-iii_en.pdf'
  };

  const rhinitis = ['rhinitis'];
  const rhinitisUrticaria = ['rhinitis', 'urticaria'];
  const ocular = ['conjunctivitis'];
  const nasal = { group: 'nasais', form: 'nasalSpray', unit: 'spray', site: 'nostril', dailySites: 2 };
  const eye = { group: 'olhos', drug: 'Olopatadina', form: 'eyeDrops', unit: 'drop', site: 'eye' };
  const seretide = { group: 'inalatoria', drug: 'Salmeterol + propionato de fluticasona', brand: 'Seretide Diskus', form: 'dryPowder', unit: 'inhalation', source: 'seretide', uses: ['asthmaMaintenance'], note: 'maintenanceOnly' };
  const nexium = { group: 'ibps', drug: 'Esomeprazol', brand: 'Nexium', form: 'gastroResistant', source: 'nexium', note: 'refluxReassess' };
  const singulair = { group: 'outros', drug: 'Montelucaste', brand: 'Singulair', source: 'singulair', uses: ['asthmaMaintenance'], note: 'montelukast' };

  // O limite superior de idade é exclusivo. Os limites de peso são explícitos.
  function band(from, before, dose, times = 1, criteria = {}) {
    return { from, before, dose, times, ...criteria };
  }

  const novalgina = {
    group: 'outros', drug: 'Dipirona', brand: 'Novalgina',
    aliases: ['Dipirona monoidratada', 'Dipirona sódica', 'Metamizol', 'Dipyrone'], uses: ['painFever'],
    sourceSection: 'labelDosing', asNeeded: true, intervalHours: 6
  };
  // Doses por faixa de peso das bulas das duas apresentações, em mg.
  const novalginaWeightRanges = [
    { minKg: 5, maxKg: 8, solution: [62.5, 125], drops: [50, 125] },
    { minKg: 9, maxKg: 15, solution: [125, 250], drops: [75, 250] },
    { minKg: 16, maxKg: 23, solution: [187.5, 375], drops: [125, 375] },
    { minKg: 24, maxKg: 30, solution: [250, 500], drops: [200, 500] },
    { minKg: 31, maxKg: 45, solution: [375, 750], drops: [250, 750] },
    { minKg: 46, maxKg: 53, solution: [437.5, 875], drops: [375, 875] }
  ];
  // EMA, anexo III, seção 4.2, e bula: menor dose inicial da apresentação no esquema adulto.
  const adultNovalgina = band(180, Infinity, 500, 4, { aboveKg: 53, maxDaily: 4000, guidance: 'emaDipirona' });
  function novalginaLiquidBands(form) {
    // SBP, quadro 1: iniciar no limite inferior de 10 mg/kg e respeitar os limites da bula.
    return novalginaWeightRanges.map(({ minKg, maxKg, [form]: [minDose, maxDose] }) =>
      band(3, 180, 10, 4, {
        perKg: true, minKg, maxKg, minDose, maxDose, maxMgPerKg: 16, maxDaily: maxDose * 4, guidance: 'sbpFebre'
      })
    ).concat(adultNovalgina);
  }

  const products = {
    'novalgina-solucao': { ...novalgina, form: 'oralSolution', strength: '50 mg/mL', concentration: 50,
      source: 'novalginaSolucao', outside: 'dipyroneLiquid', bands: novalginaLiquidBands('solution') },
    'novalgina-gotas': { ...novalgina, form: 'oralDrops', strength: '500 mg/mL', concentration: 500, dropsPerMl: 20,
      source: 'novalginaGotas', outside: 'dipyroneLiquid', bands: novalginaLiquidBands('drops') },
    'novalgina-500': { ...novalgina, form: 'tablet', strength: '500 mg', unitSize: 500,
      source: 'novalginaComprimidos', outside: 'dipyroneAdult', bands: [adultNovalgina] },
    'novalgina-1g': { ...novalgina, form: 'tablet', strength: '1 g', unitSize: 1000,
      source: 'novalginaComprimidos', outside: 'dipyroneAdult', bands: [adultNovalgina] },
    'desalex-xarope': { group: 'anti', drug: 'Desloratadina', brand: 'Desalex', form: 'syrup', strength: '0,5 mg/mL', concentration: 0.5, source: 'desalex', uses: rhinitisUrticaria,
      bands: [band(6, 12, 1), band(12, 72, 1.25), band(72, 144, 2.5), band(144, Infinity, 5)] },
    'desalex-comprimido': { group: 'anti', drug: 'Desloratadina', brand: 'Desalex', form: 'tablet', strength: '5 mg', unitSize: 5, source: 'desalex', uses: rhinitisUrticaria,
      bands: [band(144, Infinity, 5)] },
    'loratadina-ache': { group: 'anti', drug: 'Loratadina', brand: 'Loratadina Aché', form: 'syrup', strength: '1 mg/mL', concentration: 1, source: 'loratadina', uses: rhinitisUrticaria,
      bands: [band(24, 156, 5, 1, { belowKg: 30, maxDaily: 5 }), band(24, 156, 10, 1, { aboveKg: 30, maxDaily: 10 }), band(156, Infinity, 10, 1, { maxDaily: 10 })],
      outside: 'loratadineBoundary', note: 'renalHepatic' },
    'zyrtec-solucao': { group: 'anti', drug: 'Cetirizina', brand: 'Zyrtec', form: 'oralSolution', strength: '1 mg/mL', concentration: 1, source: 'zyrtec', uses: rhinitisUrticaria, note: 'renalCetirizine',
      bands: [band(24, 72, 2.5, 2), band(72, 144, 5, 2), band(144, Infinity, 10)] },
    'zyxem-gotas': { group: 'anti', drug: 'Levocetirizina', brand: 'Zyxem', form: 'oralDrops', strength: '5 mg/mL', concentration: 5, dropsPerMl: 20, source: 'zyxem', sourceSection: 'patientLabel', uses: rhinitisUrticaria, note: 'renal',
      bands: [band(24, 72, 1.25, 2, { maxDaily: 2.5 }), band(72, Infinity, 5, 1, { maxDaily: 5 })] },
    'allegra-pediatrico': { group: 'anti', drug: 'Fexofenadina', brand: 'Allegra Pediátrico', form: 'oralSuspension', strength: '6 mg/mL', concentration: 6, source: 'allegra', sourceSection: 'patientLabel', uses: ['seasonalRhinitis', 'chronicUrticaria'], note: 'renal', outside: 'fexoMismatch',
      bands: [band(6, 24, 15, 2, { maxKg: 10.5, only: 'chronicUrticaria' }), band(24, 144, 30, 2, { aboveKg: 10.5 })] },
    'alektos-ped': { group: 'anti', drug: 'Bilastina', brand: 'Alektos Ped', form: 'oralSolution', strength: '2,5 mg/mL', concentration: 2.5, source: 'alektos', uses: ['rhinoconjunctivitis', 'urticaria'], note: 'bilastineFood', outside: 'bilastineWeight',
      bands: [band(72, 144, 10, 1, { minKg: 20 })] },
    'ebastel-xarope': { group: 'anti', drug: 'Ebastina', brand: 'Ebastel', form: 'syrup', strength: '1 mg/mL', concentration: 1, source: 'ebastel', uses: rhinitisUrticaria, note: 'hepatic',
      bands: [band(24, 72, 2.5), band(72, 144, 5), band(156, Infinity, 10)] },
    'asmofen-xarope': { group: 'anti', drug: 'Cetotifeno', brand: 'Asmofen', form: 'syrup', strength: '0,2 mg/mL', concentration: 0.2, source: 'asmofen', uses: ['asthmaPrevention', 'rhinitis'], note: 'ketotifen',
      bands: [band(6, 36, 0.05, 2, { perKg: true }), band(36, 216, 1, 2)] },
    'polaramine-solucao': { group: 'anti', drug: 'Dexclorfeniramina', brand: 'Polaramine', form: 'oralSolution', strength: '0,4 mg/mL', concentration: 0.4, source: 'polaramine', uses: rhinitisUrticaria, note: 'sedating',
      bands: [band(24, 72, 0.5, 3, { maxDaily: 3 }), band(72, 156, 1, 3, { maxDaily: 6 }), band(156, Infinity, 2, 3, { maxDaily: 12 })] },
    'elocom-creme': { group: 'topicos', drug: 'Furoato de mometasona 0,1%', brand: 'Elocom', form: 'cream', strength: '1 mg/g', unit: 'application', source: 'elocom', sourceSection: 'patientLabel', uses: ['dermatitis'], note: 'thinLayer',
      bands: [band(24, Infinity, 1)] },
    'avamys-spray': { ...nasal, drug: 'Furoato de fluticasona', brand: 'Avamys', strength: '27,5 µg', source: 'avamys', uses: rhinitis, note: 'nasalInitial',
      bands: [band(24, 144, 1, 1, { maxDaily: 4 }), band(144, Infinity, 2, 1, { maxDaily: 4 })] },
    'nasonex-spray': { ...nasal, drug: 'Furoato de mometasona', brand: 'Nasonex', strength: '50 µg', source: 'nasonex', uses: rhinitis, note: 'nasalInitial',
      bands: [band(24, 144, 1), band(144, Infinity, 2, 1, { maxDaily: 8 })] },
    'flixonase-spray': { ...nasal, drug: 'Propionato de fluticasona', brand: 'Flixonase', strength: '50 µg', source: 'flixonase', uses: rhinitis, note: 'nasalInitial',
      bands: [band(48, 144, 1, 1, { maxDaily: 4 }), band(144, Infinity, 2, 1, { maxDaily: 8 })] },
    'dymista-spray': { ...nasal, drug: 'Azelastina + propionato de fluticasona', brand: 'Dymista', strength: '137 µg + 50 µg', source: 'dymista', uses: ['rhinitisCombo'],
      bands: [band(72, Infinity, 1, 2)] },
    'ryaltris-spray': { ...nasal, drug: 'Olopatadina + furoato de mometasona', brand: 'Ryaltris', strength: '665 µg + 25 µg', source: 'ryaltris', sourceSection: 'patientLabel', uses: ['moderateRhinitis'], note: 'olopatadineSalt',
      bands: [band(144, Infinity, 2, 2)] },
    'patanol-colirio': { ...eye, brand: 'Patanol', strength: '1,11 mg/mL', source: 'patanol', uses: ocular, note: 'patanolTiming',
      bands: [band(36, Infinity, 1, 2, { maxDaily: 4 })] },
    'patanol-s-colirio': { ...eye, brand: 'Patanol S', strength: '2,22 mg/mL', source: 'patanolS', uses: ocular,
      bands: [band(36, Infinity, 1, 1, { maxDaily: 2 })] },
    'seretide-diskus-100': { ...seretide, strength: '50 µg + 100 µg', bands: [band(48, Infinity, 1, 2)] },
    'seretide-diskus-250': { ...seretide, strength: '50 µg + 250 µg', bands: [band(144, Infinity, 1, 2)] },
    'seretide-diskus-500': { ...seretide, strength: '50 µg + 500 µg', bands: [band(144, Infinity, 1, 2)] },
    'nexium-20': { ...nexium, strength: '20 mg', unitSize: 20, uses: ['gerd'], bands: [band(144, Infinity, 20)] },
    'nexium-40': { ...nexium, strength: '40 mg', unitSize: 40, uses: ['erosiveGerd'], bands: [band(144, Infinity, 40)] },
    'singulair-4': { ...singulair, form: 'chewable', strength: '4 mg', unitSize: 4, bands: [band(24, 72, 4)] },
    'singulair-5': { ...singulair, form: 'chewable', strength: '5 mg', unitSize: 5, bands: [band(72, 180, 5)] },
    'singulair-10': { ...singulair, form: 'tablet', strength: '10 mg', unitSize: 10, bands: [band(180, Infinity, 10)] }
  };

  function validPatient(ageMonths, kg) {
    return Number.isInteger(ageMonths) && ageMonths >= 0 && ageMonths <= 1440 && Number.isFinite(kg) && kg > 0;
  }

  function betweenNovalginaWeightBands(bands, kg) {
    // Nos decimais entre duas faixas inteiras, usar somente os limites em comum.
    const lower = bands.find(b => b.perKg && kg > b.maxKg && kg < b.maxKg + 1);
    if (!lower) return undefined;
    const upper = bands.find(b => b.perKg && b.minKg === lower.maxKg + 1);
    if (!upper) return undefined;
    return {
      ...lower,
      minDose: Math.max(lower.minDose, upper.minDose),
      maxDose: Math.min(lower.maxDose, upper.maxDose),
      maxDaily: Math.min(lower.maxDaily, upper.maxDaily)
    };
  }

  function startingWeightDose(product, row, kg, base) {
    const starting = Math.max(base, row.minDose);
    const mgPerDrop = product.dropsPerMl ? product.concentration / product.dropsPerMl : 0;
    const drops = mgPerDrop ? starting / mgPerDrop : 0;
    const amount = mgPerDrop ? Math.ceil(drops - Number.EPSILON * drops) * mgPerDrop : starting;
    if (amount > Math.min(row.maxDose, row.maxMgPerKg * kg)) return { error: 'dipyroneMeasure' };
    return { amount, labelMinimumApplied: starting > base, wholeDropApplied: amount > starting };
  }

  function automatic(product, use, ageMonths, kg) {
    if (!validPatient(ageMonths, kg)) return { error: 'patientInvalid' };
    if (!product || !product.uses.includes(use)) return { error: 'selectScheme' };
    const eligible = product.bands.filter(b => ageMonths >= b.from && ageMonths < b.before && (b.only == null || b.only === use));
    const row = eligible.find(b =>
      (b.minKg == null || kg >= b.minKg) && (b.maxKg == null || kg <= b.maxKg) &&
      (b.aboveKg == null || kg > b.aboveKg) && (b.belowKg == null || kg < b.belowKg)) ||
      (product.asNeeded ? betweenNovalginaWeightBands(eligible, kg) : undefined);
    if (!row) return { error: (eligible.length || product.asNeeded) && product.outside ? product.outside : 'noBand' };
    const base = row.dose * (row.perKg ? kg : 1);
    const dosage = row.maxMgPerKg ? startingWeightDose(product, row, kg, base) : { amount: base };
    if (dosage.error) return dosage;
    const { amount } = dosage;
    if (!Number.isFinite(amount) || amount <= 0) return { error: 'quantityInvalid' };
    const ml = product.concentration && amount / product.concentration;
    if (ml != null && (!Number.isFinite(ml) || ml <= 0)) return { error: 'quantityInvalid' };
    return {
      ...dosage, ml, unit: product.unit || 'mg', times: row.times, site: product.site,
      asNeeded: product.asNeeded, intervalHours: product.intervalHours, guidance: row.guidance,
      daily: product.asNeeded || product.site === 'eye' ? undefined : amount * row.times * (product.dailySites || 1),
      maxDaily: product.asNeeded ? Math.min(row.maxDaily, amount * row.times) : row.maxDaily,
      perKg: row.perKg ? row.dose : undefined,
      tablets: product.unitSize ? amount / product.unitSize : undefined,
      drops: product.dropsPerMl ? Math.round(ml * product.dropsPerMl) : undefined
    };
  }

  const manualMethods = { kgDose: [true, false], kgDay: [true, true], fixedDose: [false, false], fixedDay: [false, true] };

  function manual(input) {
    const { ageMonths, kg, basis, quantity, times, concentration, maxDose, maxDaily, minAge, maxAge } = input;
    if (!validPatient(ageMonths, kg)) return { error: 'patientInvalid' };
    const method = Object.hasOwn(manualMethods, basis) && manualMethods[basis];
    if (!method || !Number.isFinite(quantity) || quantity <= 0 || !Number.isInteger(times) || times < 1 || times > 24) {
      return { error: 'manualInvalid' };
    }
    const optionalPositive = value => value == null || (Number.isFinite(value) && value > 0);
    const optionalAge = value => value == null || (Number.isInteger(value) && value >= 0 && value <= 1440);
    if (![concentration, maxDose, maxDaily].every(optionalPositive) ||
        ![minAge, maxAge].every(optionalAge) || (minAge != null && maxAge != null && minAge > maxAge)) {
      return { error: 'limitsInvalid' };
    }
    if ((minAge != null && ageMonths < minAge) || (maxAge != null && ageMonths > maxAge)) return { error: 'ageOutside' };
    const [perKg, perDay] = method;
    const base = (perKg ? quantity * kg : quantity) / (perDay ? times : 1);
    if (!Number.isFinite(base) || base <= 0) return { error: 'quantityInvalid' };
    const amount = Math.min(base, maxDose ?? Infinity, maxDaily != null ? maxDaily / times : Infinity);
    const daily = amount * times;
    const ml = concentration == null ? undefined : amount / concentration;
    if (!Number.isFinite(daily) || daily <= 0 || (ml != null && (!Number.isFinite(ml) || ml <= 0))) {
      return { error: 'quantityInvalid' };
    }
    return { amount, daily, ml, times, maxDaily, maxDose, capped: amount < base };
  }

  window.HubDoseRules = { reviewedOn, sources, products, automatic, manual };
})();
