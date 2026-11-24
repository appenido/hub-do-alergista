/* Catálogo de apresentações: dados da CMED; nunca inferir posologia de um registro. */
(function () {
  'use strict';
  const normalize = value => String(value ?? '').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const number = value => Number(String(value).replace(',', '.'));
  const format = value => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value);
  const routes = {
    oralSolution: 'solução oral', oralSuspension: 'suspensão oral',
    oralPowder: 'pó para suspensão oral (reconstituída)',
    oralDrops: 'gotas orais', syrup: 'xarope',
    tablet: 'comprimido', capsule: 'cápsula', dragee: 'drágea',
    injection: 'injetável — somente consulta',
    eyeDrops: 'oftálmico — somente consulta',
    nasalSpray: 'nasal — somente consulta',
    topical: 'tópico — somente consulta',
    other: 'via não identificada — somente consulta',
    combination: 'associação — exige dose por componente'
  };
  const liquidForms = new Set(['oralSolution', 'oralSuspension', 'oralPowder', 'oralDrops', 'syrup']);
  const solidForms = new Set(['tablet', 'capsule', 'dragee']);
  function parsePresentation(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    const formText = raw.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const mgMl = formText.match(/^(\d+(?:[.,]\d+)?)\s*MG\s*\/\s*(?:(\d+(?:[.,]\d+)?)\s*)?ML\b/);
    const solid = formText.match(/^(\d+(?:[.,]\d+)?)\s*(MG|G|MCG)\s+(COM|CAP|DRG|CPR)\b/);
    const oralPowderUnprepared = formText.match(/^(\d+(?:[.,]\d+)?)\s*(MG|G)\s+PO\s+SUS(?:\s+OR)?\b/);
    const hasSolid = /\b(?:COM|CAP|DRG|CPR)\b/.test(formText);
    const combination = /\s\+\s|\d\s*MG\s*\+|\+\s*\d|^\(.*\+/.test(formText);
    let form = null;
    let strength = null;
    let concentration = null;
    let unitSize = null;
    if (mgMl) {
      concentration = number(mgMl[1]) / (mgMl[2] ? number(mgMl[2]) : 1);
      strength = format(concentration) + ' mg/mL';
      if (/\b(?:INJ|INFUS|IV|IM|SC|EV)\b/.test(formText)) form = 'injection';
      else if (/\bOFT\b/.test(formText)) form = 'eyeDrops';
      else if (/\bNAS\b/.test(formText)) form = 'nasalSpray';
      else if (/\b(?:TOP|DERM|CREM|GEL)\b/.test(formText)) form = 'topical';
      else if (/\bXPE\b/.test(formText)) form = 'syrup';
      else if (/\b(?:PO|P0)\s+SUS\b/.test(formText)) form = 'oralPowder';
      else if (/\bGOT(?:AS)?\b/.test(formText)) form = 'oralDrops';
      else if (/\bSUS\s+OR\b/.test(formText)) form = 'oralSuspension';
      else if (/\bSOL\s+OR\b/.test(formText)) form = 'oralSolution';
      else form = 'other';
    } else if (solid) {
      const strengthMg = number(solid[1]) * (solid[2] === 'G' ? 1000 : solid[2] === 'MCG' ? 0.001 : 1);
      strength = format(strengthMg) + ' mg';
      unitSize = strengthMg;
      form = solid[3] === 'CAP' ? 'capsule' : solid[3] === 'DRG' ? 'dragee' : 'tablet';
    } else if (hasSolid && combination) {
      form = 'combination';
      strength = raw.split(/\s(?:COM|CAP|DRG|CPR)\b/)[0].trim();
    } else if (oralPowderUnprepared) {
      form = 'oralPowder';
      strength = format(number(oralPowderUnprepared[1]) * (oralPowderUnprepared[2] === 'G' ? 1000 : 1)) + ' mg totais no frasco';
    }
    if (!form) return null;
    if (!(concentration > 0) && !(unitSize > 0) && form !== 'combination' && form !== 'oralPowder') return null;
    const qualifiers = [];
    if (/\bLIB\s+(?:PROL|RETARD|MOD)\b/.test(formText)) qualifiers.push('liberação modificada');
    if (/\bCOM\s+ORODISP\b/.test(formText)) qualifiers.push('orodispersível');
    if (/\bCOM\s+MAST\b/.test(formText)) qualifiers.push('mastigável');
    if (/\bCOM\s+SUBL\b/.test(formText)) qualifiers.push('sublingual');
    if (/\bCOM\s+REV\b/.test(formText)) qualifiers.push('revestido');
    if (/\b(?:GASTRORRES|LIB\s+RET)\b/.test(formText)) qualifiers.push('liberação especial');
    const calculable = !combination && ((concentration > 0 && liquidForms.has(form)) || (unitSize > 0 && solidForms.has(form)));
    return { raw, form, strength, concentration, unitSize, calculable, label: strength + ' · ' + routes[form] +
      (qualifiers.length ? ' · ' + qualifiers.join(', ') : '') +
      (combination && form !== 'combination' ? ' · associação (sem cálculo)' : '') +
      (oralPowderUnprepared ? ' · concentração após reconstituição não informada (sem cálculo)' : '') };
  }

  function buildCatalog(entries, registry, products) {
    const map = new Map();
    const aliasMap = new Map();
    const add = (group, name) => {
      const key = normalize(name);
      if (!map.has(key)) map.set(key, { key, group, name, aliases: new Set(), presentations: [], registered: [] });
      return map.get(key);
    };
    for (const entry of entries) {
      if (entry && entry.name) add(entry.group || 'outros', entry.name);
    }
    for (const [id, product] of Object.entries(products || {})) {
      if (!(product.concentration > 0) && !(product.unitSize > 0)) continue;
      if (!liquidForms.has(product.form) && !solidForms.has(product.form) && product.form !== 'chewable' && product.form !== 'gastroResistant' && product.form !== 'effervescent') continue;
      const item = add(product.group, product.drug);
      item.group = product.group;
      item.presentations.push(id);
      for (const alias of [...(product.aliases || []), product.brand].filter(Boolean)) {
        item.aliases.add(alias);
        aliasMap.set(normalize(alias), item);
      }
    }
    for (const row of registry || []) {
      if (!Array.isArray(row) || row.length < 3 || !Array.isArray(row[2])) continue;
      const [active, brand, forms] = row;
      const parsed = forms.map(parsePresentation).filter(Boolean);
      if (!parsed.length || !active) continue;
      const item = aliasMap.get(normalize(active)) || add('outros', active);
      if (brand) item.aliases.add(brand);
      const combinedActive = /\+|;/.test(active);
      for (const presentation of parsed) item.registered.push({ ...presentation, brand,
        calculable: presentation.calculable && !combinedActive,
        label: presentation.label + (combinedActive ? ' · associação: dose por componente necessária' : '') });
    }
    return [...map.values()].filter(item => item.presentations.length || item.registered.length).map(item => {
      const keywords = new Set([item.key, ...[...item.aliases].map(normalize)]);
      return { ...item, keywords, terms: [...keywords].join(' ') };
    });
  }
  window.HubDoseCatalog = { parsePresentation, buildCatalog, normalize, routes };
})();
