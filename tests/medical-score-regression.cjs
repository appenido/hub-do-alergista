'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('var SCORES={');
const end = html.indexOf('\n  };', start);
assert(start >= 0 && end > start, 'Bloco de escores não encontrado');
const scores = new Function(html.slice(start, end + 5) + '\nreturn SCORES;')();

function verify(name, actual, expected) {
  assert.equal(actual, expected, name);
  console.log('OK: ' + name + ' = ' + actual);
}

const maximumEASI = Array.from({length: 4}, () => [6,3,3,3,3]).flat();
const zeroEASI = Array.from({length: 4}, () => [0,0,0,0,0]).flat();
verify('EASI adulto máximo', scores.easi.calc([1, ...maximumEASI]).score, '72,0/72');
verify('EASI criança máximo', scores.easi.calc([0, ...maximumEASI]).score, '72,0/72');
verify('EASI zero', scores.easi.calc([1, ...zeroEASI]).score, '0,0/72');
verify('SCORAD máximo', scores.scorad.calc([100,3,3,3,3,3,3,10,10]).score, '103,0/103');
verify('SCORAD zero', scores.scorad.calc([0,0,0,0,0,0,0,0,0]).score, '0,0/103');
verify('UCT máximo', scores.uct.calc([4,4,4,4]).score, '16/16');
verify('UCT zero', scores.uct.calc([0,0,0,0]).score, '0/16');
verify('UAS7 máximo', scores.uas.calc([6,6,6,6,6,6,6]).score, '42/42');
verify('UAS7 zero', scores.uas.calc([0,0,0,0,0,0,0]).score, '0/42');
assert(!html.includes('var MBE_ANALYSES'), 'As análises MBE genéricas devem permanecer desativadas');
assert(!html.includes('UCE TIPO IIb'), 'Pontuação não validada de endotipagem não pode retornar');
console.log('Onze verificações concluídas.');
