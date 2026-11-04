// Auditoria das referências contra o próprio registro bibliográfico do PubMed.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile(new URL('../guidelines-referencias.json',import.meta.url),'utf8'));
const ids=catalog.itens.map(i=>i.pmid);
const response=await fetch('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&tool=HubDoAlergista&id='+ids.join(','),{signal:AbortSignal.timeout(30000)});
assert.ok(response.ok,'PubMed HTTP '+response.status);
const d=await response.json();
assert.ok(d.result,'PubMed sem metadados');
const norm=s=>String(s).normalize('NFKD').replace(/<[^>]*>/g,'').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
let errors=0;
for(const i of catalog.itens){
  const r=d.result[i.pmid];
  const doi=r?.articleids?.find(a=>a.idtype==='doi')?.value;
  const pmc=r?.articleids?.find(a=>a.idtype==='pmc')?.value;
  const matches=r&&String(r.uid)===i.pmid&&norm(r.title)===norm(i.title)&&doi?.toLowerCase()===i.doi.toLowerCase()&&(!i.pmcid||pmc===i.pmcid);
  if(!matches){console.error(JSON.stringify({pmid:i.pmid,expected:i.title,actual:r?.title,expectedDoi:i.doi,actualDoi:doi,expectedPmc:i.pmcid,actualPmc:pmc}));errors++;}
}
assert.equal(errors,0,'Referências com metadados divergentes');
console.log(ids.length+' referências: título, PMID, DOI e PMC conferem com o PubMed.');
