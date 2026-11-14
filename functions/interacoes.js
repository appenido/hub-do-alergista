// Interações medicamentosas - base de regras clínicas rastreáveis, em português.
// A base é parcial. Ausência de correspondência significa "não avaliada",
// nunca "sem interação". Nenhum serviço externo é necessário para responder.
const CABECALHOS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store, private',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'Vary':'Origin'
};
function responder(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:CABECALHOS});}
function normalizar(texto){
  return String(texto||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/\s+/g,' ').trim();
}
const SINONIMOS={
  'cyclosporine':'ciclosporina','cyclosporin':'ciclosporina','sandimmune':'ciclosporina','neoral':'ciclosporina',
  'methotrexate':'metotrexato','trexall':'metotrexato',
  'prednisone':'prednisona','prednisolone':'prednisolona','methylprednisolone':'metilprednisolona',
  'clarithromycin':'claritromicina','erythromycin':'eritromicina','azithromycin':'azitromicina',
  'fluconazole':'fluconazol','itraconazole':'itraconazol','ketoconazole':'cetoconazol',
  'voriconazole':'voriconazol','rifampin':'rifampicina','phenytoin':'fenitoina',
  'carbamazepine':'carbamazepina','phenobarbital':'fenobarbital','digoxin':'digoxina',
  'tacrolimus':'tacrolimo','allopurinol':'alopurinol','colchicine':'colchicina',
  'simvastatin':'sinvastatina','lovastatin':'lovastatina','atorvastatin':'atorvastatina',
  'rosuvastatin':'rosuvastatina','pravastatin':'pravastatina','hydroxyzine':'hidroxizina',
  'citalopram':'citalopram','escitalopram':'escitalopram','fluoxetine':'fluoxetina',
  'amiodarone':'amiodarona','sotalol':'sotalol','moxifloxacin':'moxifloxacino',
  'levofloxacin':'levofloxacino','azathioprine':'azatioprina','imuran':'azatioprina',
  'febuxostat':'febuxostate','ibuprofen':'ibuprofeno','naproxen':'naproxeno',
  'diclofenac':'diclofenaco','sulfamethoxazole':'sulfametoxazol','trimethoprim':'trimetoprima',
  'sulfametoxazol + trimetoprima':'sulfametoxazol/trimetoprima',
  'trimetoprima + sulfametoxazol':'sulfametoxazol/trimetoprima',
  'trimetoprima/sulfametoxazol':'sulfametoxazol/trimetoprima',
  'sulfametoxazol-trimetoprima':'sulfametoxazol/trimetoprima',
  'cotrimoxazol':'sulfametoxazol/trimetoprima','bactrim':'sulfametoxazol/trimetoprima',
  'septra':'sulfametoxazol/trimetoprima',
  'omeprazole':'omeprazol','pantoprazole':'pantoprazol',
  'theophylline':'teofilina','ciprofloxacin':'ciprofloxacino',
  'vancomycin':'vancomicina','gentamicin':'gentamicina','amoxicillin':'amoxicilina',
  'penicillin':'penicilina','warfarin':'varfarina',
  'duplixent':'dupilumabe','dupixent':'dupilumabe','dupilumab':'dupilumabe',
  'omalizumab':'omalizumabe','xolair':'omalizumabe',
  'mepolizumab':'mepolizumabe','nucala':'mepolizumabe'
};
function principio(nome){
  const normal=normalizar(nome);
  return SINONIMOS[normal]||normal;
}
const FONTES={
  ciclosporina:{
    nome:'Bula de ciclosporina — FDA, 2026',
    url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/050573s048lbl.pdf'
  },
  metotrexato:{
    nome:'Bula de metotrexato — FDA, 2026',
    url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2026/214121s005lbl.pdf'
  },
  metotrexatoOutro:{
    nome:'Bula de metotrexato — FDA',
    url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2020/205776s004lbl.pdf'
  },
  cotrimoxazol:{
    nome:'Bula de sulfametoxazol/trimetoprima — FDA, 2024',
    url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/017376s066lbl.pdf'
  },
  azatioprina:{
    nome:'Bula de azatioprina — FDA, 2024',
    url:'https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/017391s018lbl.pdf'
  },
  claritromicina:{
    nome:'Bula de claritromicina — DailyMed',
    url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=d5be5f12-6392-4d7d-ab23-ebc205ac1a85'
  },
  hidroxizina:{
    nome:'Recomendação regulatória sobre hidroxizina — EMA',
    url:'https://www.ema.europa.eu/en/documents/referral/hydroxyzine-article-31-referral-annex-iii_en.pdf'
  }
};
const REGRAS=new Map();
function chave(a,b){return [principio(a),principio(b)].sort().join('|');}
function inserir(medicamento,outros,detalhes){
  for(const outro of outros){
    REGRAS.set(chave(medicamento,outro),detalhes);
  }
}
// Ciclosporina: interações farmacocinéticas e nefrotoxicidade descritas em bula.
inserir('ciclosporina',
  ['claritromicina','eritromicina','azitromicina','fluconazol','itraconazol','cetoconazol','voriconazol','diltiazem','verapamil','alopurinol','amiodarona','metilprednisolona'],
  {nivel:'Interação importante',
   efeito:'Pode elevar a concentração de ciclosporina e aumentar o risco de toxicidade, inclusive renal.',
   conduta:'Reavaliar a associação; acompanhar creatinina, pressão arterial e concentrações de ciclosporina quando indicadas. Ajustar conforme resposta e monitorização.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',
  ['rifampicina','carbamazepina','fenitoina','fenobarbital','oxcarbazepina'],
  {nivel:'Interação importante',
   efeito:'Pode reduzir a exposição à ciclosporina, com risco de perda de eficácia.',
   conduta:'Preferir alternativa quando possível; se necessário, acompanhar níveis de ciclosporina e resposta clínica, com ajuste individualizado.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',['metotrexato','diclofenaco','naproxeno','ibuprofeno','gentamicina','vancomicina','ciprofloxacino','tobramicina','sulfametoxazol/trimetoprima'],
  {nivel:'Interação importante',
   efeito:'Há potencial de nefrotoxicidade aditiva. O risco varia com dose, função renal e outros fatores.',
   conduta:'Reavaliar a combinação, monitorar creatinina e outros parâmetros renais e considerar alternativa diante de comprometimento renal.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',['prednisona','prednisolona'],
  {nivel:'Requer monitorização',
   efeito:'A ciclosporina pode reduzir a depuração da prednisolona, aumentando sua exposição; pode haver efeitos imunossupressores aditivos.',
   conduta:'Individualizar dose e duração; monitorar efeitos adversos e sinais de toxicidade, inclusive infecciosa.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',['digoxina'],
  {nivel:'Interação importante',
   efeito:'Pode reduzir a depuração de digoxina e provocar toxicidade digitálica importante.',
   conduta:'Evitar quando houver opção mais segura; se associadas, acompanhar concentrações de digoxina, função renal e sinais de toxicidade.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',['sinvastatina','lovastatina','atorvastatina','rosuvastatina','pravastatina'],
  {nivel:'Interação importante',
   efeito:'Pode aumentar a exposição a estatinas e o risco de miopatia e rabdomiólise; restrições variam conforme a estatina.',
   conduta:'Conferir contraindicação e limites de dose específicos da estatina; preferir alternativa compatível e investigar sintomas musculares.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',['colchicina'],
  {nivel:'Interação importante',
   efeito:'Pode aumentar a exposição à colchicina, com risco de toxicidade neuromuscular e hematológica, especialmente na disfunção renal.',
   conduta:'Evitar a associação quando possível. Quando inevitável, revisar dose da colchicina e monitorar efeitos tóxicos e função renal.',
   fonte:FONTES.ciclosporina});
inserir('ciclosporina',['tacrolimo'],
  {nivel:'Evitar associação',
   efeito:'Dois inibidores de calcineurina podem potencializar nefrotoxicidade.',
   conduta:'Evitar uso concomitante, salvo situação excepcional prevista em protocolo especializado.',
   fonte:FONTES.ciclosporina});

// Metotrexato: interferência na eliminação, mielotoxicidade e toxicidade orgânica.
inserir('metotrexato',['sulfametoxazol/trimetoprima'],
  {nivel:'Evitar associação',
   efeito:'Pode aumentar a exposição ao metotrexato e produzir mielossupressão importante por interação renal e efeito antifolato aditivo.',
   conduta:'Evitar a combinação e preferir antibiótico alternativo. Se houver indicação excepcional, avaliar função renal e hemograma com vigilância rigorosa.',
   fonte:FONTES.cotrimoxazol});
inserir('metotrexato',['ibuprofeno','naproxeno','diclofenaco'],
  {nivel:'Interação importante',
   efeito:'Anti-inflamatórios podem reduzir a eliminação de metotrexato e aumentar a toxicidade; o risco é particularmente relevante em doses altas e na disfunção renal.',
   conduta:'Avaliar dose de metotrexato, função renal e necessidade de anti-inflamatório; monitorar toxicidade. Não extrapolar o risco de altas doses para todos os esquemas.',
   fonte:FONTES.metotrexato});
inserir('metotrexato',['omeprazol','pantoprazol'],
  {nivel:'Requer monitorização',
   efeito:'Inibidores da bomba de prótons podem retardar a eliminação de metotrexato, especialmente em esquemas de doses altas.',
   conduta:'Revisar necessidade do protetor gástrico e protocolo utilizado; avaliar alternativas e acompanhar níveis de metotrexato quando indicados.',
   fonte:FONTES.metotrexato});
inserir('metotrexato',['amoxicilina','penicilina'],
  {nivel:'Requer monitorização',
   efeito:'Penicilinas podem reduzir a depuração renal do metotrexato, elevando o risco de toxicidade.',
   conduta:'Preferir alternativa adequada quando houver risco relevante e monitorar toxicidade hematológica, gastrointestinal e renal.',
   fonte:FONTES.metotrexato});
inserir('metotrexato',['teofilina'],
  {nivel:'Requer monitorização',
   efeito:'Metotrexato pode diminuir a depuração de teofilina e aumentar sua exposição.',
   conduta:'Monitorar sintomas e níveis de teofilina, com ajuste quando necessário.',
   fonte:FONTES.metotrexatoOutro});
inserir('metotrexato',['azatioprina'],
  {nivel:'Requer monitorização',
   efeito:'Pode haver aumento de risco de hepatotoxicidade com imunossupressores hepatotóxicos concomitantes.',
   conduta:'Reavaliar a necessidade da associação e acompanhar testes hepáticos e hemograma.',
   fonte:FONTES.metotrexatoOutro});

// Azatioprina: inibição de xantina oxidase.
inserir('azatioprina',['alopurinol'],
  {nivel:'Interação importante',
   efeito:'O alopurinol inibe uma via de inativação da azatioprina, aumentando risco de mielotoxicidade grave.',
   conduta:'A bula recomenda reduzir azatioprina para aproximadamente 1/3 a 1/4 da dose usual se a associação for necessária, sob supervisão especializada e hemogramas seriados.',
   fonte:FONTES.azatioprina});
inserir('azatioprina',['febuxostate'],
  {nivel:'Evitar associação',
   efeito:'A inibição da xantina oxidase pode aumentar a toxicidade hematológica da azatioprina.',
   conduta:'Evitar o uso concomitante e selecionar alternativa terapêutica.',
   fonte:FONTES.azatioprina});

// Claritromicina: inibição da CYP3A4.
inserir('claritromicina',['sinvastatina','lovastatina'],
  {nivel:'Contraindicada',
   efeito:'Pode elevar acentuadamente a exposição à estatina, com risco de rabdomiólise.',
   conduta:'Não associar. Selecionar antibiótico ou tratamento hipolipemiante alternativo conforme a indicação clínica.',
   fonte:FONTES.claritromicina});
inserir('claritromicina',['colchicina'],
  {nivel:'Evitar associação',
   efeito:'Inibição da CYP3A4 e da glicoproteína P pode elevar a colchicina a níveis tóxicos, com relatos de desfechos graves.',
   conduta:'Evitar a combinação, especialmente em doença renal ou hepática; escolher alternativa.',
   fonte:FONTES.claritromicina});
inserir('claritromicina',['atorvastatina'],
  {nivel:'Interação importante',
   efeito:'Pode aumentar os níveis da atorvastatina, elevando o risco de toxicidade muscular.',
   conduta:'Reavaliar necessidade da combinação; considerar interrupção temporária, alternativa ou ajuste conforme bula e situação clínica.',
   fonte:FONTES.claritromicina});

// Hidroxizina: risco arrítmico aditivo.
inserir('hidroxizina',['citalopram','escitalopram','amiodarona','sotalol','eritromicina','levofloxacino','moxifloxacino'],
  {nivel:'Contraindicada',
   efeito:'A combinação aumenta o risco de prolongamento do intervalo QT e de torsades de pointes.',
   conduta:'Não associar; selecionar alternativa com menor potencial de prolongamento do QT.',
   fonte:FONTES.hidroxizina});
inserir('hidroxizina',['claritromicina','azitromicina','fluoxetina'],
  {nivel:'Interação importante',
   efeito:'Há potencial de prolongamento aditivo do intervalo QT e arritmia ventricular.',
   conduta:'Evitar quando houver alternativa e avaliar fatores de risco cardíacos, eletrolíticos e outros fármacos que prolonguem o QT.',
   fonte:{nome:'Bula de hidroxizina — DailyMed',url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=63fdf791-1a58-45ba-8ef2-15b80bb24f23'}});

function registro(a,b){
  const encontrada=REGRAS.get(chave(a,b));
  return encontrada?
    {par:[a,b],situacao:'identificada',nivel:encontrada.nivel,
      efeito:encontrada.efeito,conduta:encontrada.conduta,fonte:encontrada.fonte}:
    {par:[a,b],situacao:'nao_avaliada',nivel:'Não avaliada nesta base',
      efeito:'Esta combinação não possui registro clínico revisado na base disponível.',
      conduta:'Não conclua que a associação é segura. Consulte uma fonte farmacológica validada antes de prescrever.',
      fonte:null};
}
export async function onRequestOptions(){
  return new Response(null,{status:204,headers:{...CABECALHOS,Allow:'POST, OPTIONS'}});
}
export async function onRequestPost({request}){
  const origem=request.headers.get('Origin');
  if(origem&&origem!==new URL(request.url).origin)return responder({erro:'Origem não autorizada.'},403);
  if(Number(request.headers.get('Content-Length')||0)>4000)return responder({erro:'Requisição muito extensa.'},413);
  let corpo;
  try{corpo=await request.json();}catch(_){return responder({erro:'Requisição inválida.'},400);}
  const medicamentos=corpo?.medicamentos;
  if(!Array.isArray(medicamentos)||medicamentos.length<2||medicamentos.length>12||
    medicamentos.some(x=>typeof x!=='string'||x.length>80||!/^[\p{L}\p{M}\p{N} (),.+/\-]+$/u.test(x.trim()))){
    return responder({erro:'Informe de 2 a 12 medicamentos válidos, sem dados de pacientes.'},400);
  }
  const vistos=new Set(), nomes=[];
  for(const bruto of medicamentos){
    const nome=bruto.trim(),p=principio(nome);
    if(nome.length<2||vistos.has(p))continue;
    vistos.add(p);nomes.push(nome);
  }
  if(nomes.length<2)return responder({erro:'Informe pelo menos dois medicamentos diferentes.'},400);
  const pares=[];
  for(let i=0;i<nomes.length;i++)
    for(let j=i+1;j<nomes.length;j++)pares.push(registro(nomes[i],nomes[j]));
  const prioridade={'Contraindicada':0,'Evitar associação':1,'Interação importante':2,'Requer monitorização':3,'Não avaliada nesta base':4};
  pares.sort((a,b)=>prioridade[a.nivel]-prioridade[b.nivel]);
  return responder({
    dataConsulta:new Date().toISOString(),
    pares,
    identificadas:pares.filter(p=>p.situacao==='identificada').length,
    naoAvaliadas:pares.filter(p=>p.situacao==='nao_avaliada').length,
    aviso:'A base possui cobertura parcial. Uma combinação não avaliada não deve ser interpretada como isenta de interação.'
  });
}
