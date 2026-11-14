// Interações medicamentosas com regras referenciadas e consulta à seção 4.5 da AEMPS.
import { obterFicha, citaMedicamento, normalizar } from '../interacoes-cima.mjs';

const CABECALHOS={
  'Content-Type':'application/json; charset=utf-8',
  'Cache-Control':'no-store, private',
  'X-Content-Type-Options':'nosniff',
  'Referrer-Policy':'no-referrer',
  'Vary':'Origin'
};
function responder(obj,status=200){return new Response(JSON.stringify(obj),{status,headers:CABECALHOS});}
const SINONIMOS={
  'cyclosporine':'ciclosporina','cyclosporin':'ciclosporina','sandimmune':'ciclosporina','neoral':'ciclosporina',
  'sandimmun':'ciclosporina','sandimmun neoral':'ciclosporina','sandimmune neoral':'ciclosporina',
  'metamizol':'dipirona','metamizole':'dipirona','dipyrone':'dipirona','novalgina':'dipirona',
  'novalgina flash':'dipirona','nolotil':'dipirona','dipirona sodica':'dipirona',
  'dipirona monoidratada':'dipirona','dipirona sodica monoidratada':'dipirona','metamizol sodico':'dipirona',
  'methotrexate':'metotrexato','trexall':'metotrexato','metrexato':'metotrexato',
  'prednisone':'prednisona','prednisolone':'prednisolona','methylprednisolone':'metilprednisolona',
  'clarithromycin':'claritromicina','erythromycin':'eritromicina','azithromycin':'azitromicina',
  'fluconazole':'fluconazol','itraconazole':'itraconazol','ketoconazole':'cetoconazol',
  'voriconazole':'voriconazol','rifampin':'rifampicina','phenytoin':'fenitoina',
  'carbamazepine':'carbamazepina','phenobarbital':'fenobarbital','digoxin':'digoxina',
  'tacrolimus':'tacrolimo','tacrolimus monoidratado':'tacrolimo','prograf':'tacrolimo',
  'allopurinol':'alopurinol','colchicine':'colchicina',
  'simvastatin':'sinvastatina','simvastatina':'sinvastatina','lovastatin':'lovastatina','atorvastatin':'atorvastatina',
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
  'penicillin':'penicilina','warfarin':'varfarina','warfarina':'varfarina','marevan':'varfarina',
  'coumadin':'varfarina','varfarina sodica':'varfarina','advil':'ibuprofeno','tylenol':'paracetamol',
  'acetaminophen':'paracetamol','ciprofloxacina':'ciprofloxacino','sirdalud':'tizanidina',
  'cloridrato de tizanidina':'tizanidina','plavix':'clopidogrel','bissulfato de clopidogrel':'clopidogrel',
  'aas':'acido acetilsalicilico','a.a.s.':'acido acetilsalicilico','aspirina':'acido acetilsalicilico',
  'valproato':'acido valproico','valproato de sodio':'acido valproico',
  'linezolid':'linezolida',
  'sildenafilo':'sildenafila','viagra':'sildenafila','apixaban':'apixabana','eliquis':'apixabana',
  'zocor':'sinvastatina','procoralan':'ivabradina',
  'rivaroxaban':'rivaroxabana','xarelto':'rivaroxabana','verapamilo':'verapamil',
  'duplixent':'dupilumabe','dupixent':'dupilumabe','dupilumab':'dupilumabe',
  'omalizumab':'omalizumabe','xolair':'omalizumabe',
  'mepolizumab':'mepolizumabe','nucala':'mepolizumabe'
};
function principio(nome){
  const normal=normalizar(nome).replace(/\s+\d+(?:[.,]\d+)?\s*(?:mg|mcg|g|ml|ui|µg)(?:\s*\/\s*(?:\d+(?:[.,]\d+)?\s*)?ml)?$/,'');
  return Object.hasOwn(SINONIMOS,normal)?SINONIMOS[normal]:normal;
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
  },
  dipirona:{
    nome:'Bula brasileira de Novalgina — interações medicamentosas',
    url:'https://www.novalgina.com.br/produtos/adulto/novalgina-flash/bula'
  },
  metamizol:{
    nome:'Ficha técnica de metamizol — AEMPS/CIMA, seção 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/47633/FT_47633.html#4.5',
    atualizada:'2024-12-18'
  },
  tizanidina:{
    nome:'Ficha técnica de tizanidina — AEMPS/CIMA, seção 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/58314/FT_58314.html#4.5'
  },
  ciprofloxacino:{
    nome:'Ficha técnica de ciprofloxacino — AEMPS/CIMA, seção 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/64978/FT_64978.html#4.5'
  },
  clopidogrel:{
    nome:'Ficha técnica de clopidogrel — AEMPS/CIMA, seção 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/71622/FT_71622.html#4.5'
  },
  fluconazol:{
    nome:'Ficha técnica de fluconazol — AEMPS/CIMA, seção 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/59673/FT_59673.html#4.5'
  },
  varfarina:{
    nome:'Bula de varfarina — DailyMed, seção 7',
    url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=91fa852c-b43d-4a55-983b-74aa6827125d'
  },
  sertralina:{
    nome:'Ficha técnica de sertralina — AEMPS/CIMA, seções 4.3 e 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/86819/FT_86819.html#4.5'
  },
  tacrolimo:{
    nome:'Bula de tacrolimo sistêmico — DailyMed, seção 7',
    url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f667de1-9dfa-4bd6-8ba0-15ee2d78873b'
  },
  dipironaCiclosporina:{
    nome:'Estudo de farmacocinética de dipirona e ciclosporina — Caraco et al.',
    url:'https://pubmed.ncbi.nlm.nih.gov/10492062/'
  },
  sinvastatina:{
    nome:'Bula de sinvastatina — DailyMed, seções 4 e 7',
    url:'https://www.dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=b9c315ff-cec9-8b75-e053-2995a90aa204'
  },
  ivabradina:{
    nome:'Ficha técnica de ivabradina — AEMPS/CIMA, seções 4.3 e 4.5',
    url:'https://cima.aemps.es/cima/dochtml/ft/05316013/FT_05316013.html#4.5'
  }
};
const REGRAS=new Map();
function chave(a,b){return [principio(a),principio(b)].sort().join('|');}
function inserir(medicamento,outros,detalhes){
  for(const outro of outros){
    REGRAS.set(chave(medicamento,outro),detalhes);
  }
}

inserir('dipirona',['ciclosporina'],{
  nivel:'Requer monitorização',
  efeito:'A dipirona pode reduzir os níveis sanguíneos de ciclosporina sistêmica e comprometer a imunossupressão.',
  mecanismo:'Indução enzimática pela dipirona, principalmente do CYP3A4 no caso da ciclosporina.',
  conduta:'Preferir outro analgésico quando possível, especialmente em transplantados. Se a associação for necessária, monitorar a concentração de vale da ciclosporina e a resposta clínica durante o uso e após a retirada da dipirona. Individualizar ajustes com a equipe responsável.',
  fonte:FONTES.dipirona,
  referencias:[FONTES.metamizol,FONTES.dipironaCiclosporina]
});
inserir('dipirona',['tacrolimo'],{
  nivel:'Requer monitorização',
  efeito:'A dipirona pode reduzir as concentrações de tacrolimo sistêmico e comprometer a imunossupressão.',
  mecanismo:'Indução da via CYP3A, envolvida no metabolismo do tacrolimo.',
  conduta:'Preferir alternativa quando possível. Se a associação for necessária, monitorar a concentração de vale e a resposta clínica durante o uso e após a retirada da dipirona, com ajuste individualizado.',
  fonte:FONTES.dipirona,
  referencias:[FONTES.metamizol]
});
inserir('dipirona',['metotrexato'],{
  nivel:'Evitar associação',
  efeito:'O uso concomitante pode aumentar a toxicidade hematológica do metotrexato, sobretudo em idosos.',
  conduta:'Evitar a associação e escolher outro analgésico ou antitérmico adequado.',
  fonte:FONTES.dipirona,
  referencias:[FONTES.metamizol]
});
inserir('dipirona',['acido acetilsalicilico'],{
  nivel:'Requer cautela',
  efeito:'Se administrada junto ao ácido acetilsalicílico, a dipirona pode reduzir seu efeito antiagregante.',
  mecanismo:'Interferência da dipirona na inibição plaquetária mediada pela COX-1.',
  conduta:'Considerar outra opção analgésica em pacientes que usam ácido acetilsalicílico em baixa dose para proteção cardiovascular.',
  fonte:FONTES.dipirona,
  referencias:[FONTES.metamizol]
});
inserir('dipirona',['clorpromazina'],{
  nivel:'Interação importante',
  efeito:'A associação pode provocar hipotermia grave.',
  conduta:'Preferir outro analgésico. Se houver administração concomitante, acompanhar a temperatura e avaliar prontamente sinais de hipotermia.',
  fonte:FONTES.metamizol
});
inserir('dipirona',['bupropiona','efavirenz','metadona','sertralina'],{
  nivel:'Requer monitorização',
  efeito:'A dipirona pode reduzir a concentração do outro medicamento e comprometer sua resposta clínica.',
  mecanismo:'Indução de enzimas metabolizadoras, incluindo CYP2B6 e CYP3A4.',
  conduta:'Avaliar alternativa à dipirona. Se houver coadministração, acompanhar a resposta clínica e usar monitorização farmacológica quando aplicável.',
  fonte:FONTES.dipirona,
  referencias:[FONTES.metamizol]
});
inserir('dipirona',['acido valproico'],{
  nivel:'Requer monitorização',
  efeito:'A dipirona pode reduzir os níveis sanguíneos de valproato e diminuir sua eficácia.',
  conduta:'Considerar alternativa à dipirona. Se a associação for necessária, acompanhar a resposta e a concentração do valproato quando indicada.',
  fonte:FONTES.metamizol
});

inserir('tizanidina',['ciprofloxacino','fluvoxamina'],{
  nivel:'Contraindicada',
  efeito:'O aumento da exposição à tizanidina pode causar hipotensão prolongada e sedação importante.',
  mecanismo:'Inibição do CYP1A2, que metaboliza a tizanidina.',
  conduta:'Selecionar outro medicamento. A ficha técnica contraindica a administração concomitante.',
  fonte:FONTES.tizanidina
});
inserir('ciprofloxacino',['teofilina'],{
  nivel:'Interação importante',
  efeito:'O ciprofloxacino pode elevar a concentração de teofilina e causar toxicidade, inclusive grave.',
  conduta:'Preferir alternativa quando possível. Se houver associação, monitorar os níveis de teofilina e ajustar a dose conforme necessário.',
  fonte:FONTES.ciprofloxacino
});
inserir('ciprofloxacino',['metotrexato'],{
  nivel:'Evitar associação',
  efeito:'O ciprofloxacino pode aumentar a exposição ao metotrexato e o risco de toxicidade.',
  mecanismo:'Possível inibição do transporte tubular renal de metotrexato.',
  conduta:'Preferir antibiótico alternativo. A ficha técnica desaconselha o uso concomitante.',
  fonte:FONTES.ciprofloxacino
});
inserir('clopidogrel',['omeprazol','esomeprazol'],{
  nivel:'Evitar associação',
  efeito:'A associação pode reduzir a formação do metabólito ativo do clopidogrel e seu efeito antiagregante.',
  mecanismo:'Inibição do CYP2C19 pelo inibidor da bomba de prótons.',
  conduta:'Se a proteção gástrica for indicada, considerar pantoprazol. Separar os horários de omeprazol e clopidogrel por 12 horas não evitou a interação no estudo descrito na ficha técnica.',
  fonte:FONTES.clopidogrel
});
inserir('varfarina',['fluconazol'],{
  nivel:'Interação importante',
  efeito:'O fluconazol pode elevar o INR e aumentar o risco de sangramento.',
  mecanismo:'Inibição do metabolismo da varfarina mediado pelo CYP2C9.',
  conduta:'Monitorar o INR de perto se houver associação e reavaliar após retirar o fluconazol. Ajustar varfarina conforme o INR e o protocolo local.',
  fonte:FONTES.fluconazol,
  referencias:[FONTES.varfarina]
});
inserir('varfarina',['ibuprofeno','naproxeno','diclofenaco'],{
  nivel:'Interação importante',
  efeito:'A associação com anti-inflamatório sistêmico aumenta o risco de sangramento, especialmente gastrointestinal.',
  conduta:'Preferir alternativa ao anti-inflamatório. Se houver necessidade da associação, acompanhar sinais de sangramento e controlar a anticoagulação conforme o contexto clínico.',
  fonte:FONTES.varfarina
});
inserir('sertralina',['linezolida'],{
  nivel:'Contraindicada',
  efeito:'A combinação pode causar síndrome serotoninérgica.',
  mecanismo:'A linezolida tem atividade inibitória reversível sobre a monoaminoxidase.',
  conduta:'Selecionar alternativa quando possível. Se a linezolida for imprescindível em situação urgente, definir manejo e monitorização com a equipe responsável.',
  fonte:FONTES.sertralina
});
inserir('sertralina',['pimozida'],{
  nivel:'Contraindicada',
  efeito:'A sertralina pode aumentar a exposição à pimozida, que tem margem terapêutica estreita.',
  conduta:'Evitar o uso concomitante. Escolher uma alternativa para um dos medicamentos.',
  fonte:FONTES.sertralina
});
inserir('ivabradina',['diltiazem','verapamil'],{
  nivel:'Contraindicada',
  efeito:'A combinação aumenta a exposição à ivabradina e potencializa a redução da frequência cardíaca.',
  mecanismo:'Inibição do CYP3A4 e efeito aditivo sobre a frequência cardíaca.',
  conduta:'Selecionar uma alternativa. A ficha técnica contraindica a administração concomitante.',
  fonte:FONTES.ivabradina
});
inserir('tacrolimo',['rifampicina','rifabutina'],{
  nivel:'Interação importante',
  efeito:'A associação pode reduzir os níveis de tacrolimo sistêmico e comprometer a imunossupressão.',
  mecanismo:'Indução do CYP3A pelo antimicobacteriano.',
  conduta:'Avaliar alternativa. Se a associação for necessária, monitorar frequentemente a concentração de vale de tacrolimo no início, durante o uso e após a retirada, com ajuste individualizado.',
  fonte:FONTES.tacrolimo
});
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
inserir('ciclosporina',['sinvastatina'],
  {nivel:'Contraindicada',
   efeito:'A associação aumenta o risco de miopatia e rabdomiólise.',
   conduta:'Selecionar uma estatina compatível com a ciclosporina e conferir o limite de dose específico.',
   fonte:FONTES.sinvastatina});
inserir('ciclosporina',['lovastatina','atorvastatina','rosuvastatina','pravastatina'],
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
  if(encontrada) return {par:[a,b],situacao:'identificada',...encontrada};
  if(principio(a)==='omalizumabe'||principio(b)==='omalizumabe'){
    return {par:[a,b],situacao:'dados_insuficientes',nivel:'Evidência clínica limitada',
      efeito:'A bula do Xolair informa que não foram realizados estudos formais de interações medicamentosas com omalizumabe. Na urticária crônica espontânea, o uso concomitante com imunossupressores não foi estudado.',
      conduta:'Avaliar a associação de acordo com a indicação clínica, os riscos e o outro medicamento.',
      fonte:{nome:'Bula Xolair — seção 7, revisão de agosto de 2026',url:'https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=7f6a2191-adfb-48b9-9bfa-0d9920479f0d'}};
  }
  return {par:[a,b],situacao:'nao_avaliada',nivel:'Sem registro nas fontes consultadas',fonte:null};
}

function complementarComCima(registro, fichas){
  const ativos=registro.par.map(principio);
  const referencias=ativos.flatMap((ativo,i)=>{
    const ficha=fichas.get(ativo);
    return citaMedicamento(ficha,ativos[1-i]) ? [{
      nome:`Ficha técnica de ${registro.par[i]} — AEMPS/CIMA, seção 4.5`,
      ...ficha.fonte
    }] : [];
  });
  if(referencias.length){
    const [fonte,...adicionais]=referencias;
    return {
      par:registro.par,situacao:'mencao_documental',nivel:'Menção em ficha técnica',
      efeito:'A seção de interações de uma ficha técnica cita o outro medicamento. O significado clínico depende da orientação descrita na fonte.',
      conduta:'Consulte a seção 4.5 para confirmar o efeito, a via de administração e as orientações de uso.',
      fonte,referencias:adicionais
    };
  }
  const situacoes=ativos.map(ativo=>fichas.get(ativo)?.situacao);
  if(situacoes.includes('indisponivel'))return {
    ...registro,situacao:'consulta_incompleta',nivel:'Consulta incompleta',
    efeito:'A fonte oficial ficou indisponível para pelo menos um medicamento.',
    conduta:'Tente novamente para completar a busca.'
  };
  if(registro.situacao==='dados_insuficientes')return registro;
  if(situacoes.every(s=>s==='sem_ficha'))return {
    ...registro,nivel:'Cobertura indisponível para este par',
    efeito:'A busca pelo princípio ativo não encontrou ficha técnica para os medicamentos informados.',
    conduta:'Confira os nomes dos princípios ativos e consulte outra fonte de interações.'
  };
  return {
    ...registro,
    efeito:situacoes.includes('sem_ficha')
      ? 'Apenas um medicamento tem ficha técnica disponível na fonte consultada. Ela não cita o outro medicamento na seção de interações.'
      : 'As seções de interação das fichas consultadas não trazem menção nominal a este par.'
  };
}

async function carregarIndice(env, request){
  try{
    const url=new URL('/data/interacoes-cima.json',request.url);
    const resposta=await env.ASSETS.fetch(new Request(url));
    if(!resposta.ok)return null;
    const {ativos}=await resposta.json();
    return ativos&&typeof ativos==='object'&&!Array.isArray(ativos)?ativos:null;
  }catch(_){return null;}
}

export async function onRequestOptions(){
  return new Response(null,{status:204,headers:{...CABECALHOS,Allow:'POST, OPTIONS'}});
}
export async function onRequestPost({request,env={}}){
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
    if(p.length<2||vistos.has(p))continue;
    vistos.add(p);nomes.push(nome);
  }
  if(nomes.length<2)return responder({erro:'Informe pelo menos dois medicamentos diferentes.'},400);
  let pares=[];
  for(let i=0;i<nomes.length;i++)
    for(let j=i+1;j<nomes.length;j++)pares.push(registro(nomes[i],nomes[j]));
  const pendentes=[...new Set(pares.filter(p=>p.situacao!=='identificada').flatMap(p=>p.par.map(principio)))];
  if(pendentes.length){
    const indice=await carregarIndice(env,request);
    const fichas=new Map(pendentes.map(ativo=>[ativo,obterFicha(indice,ativo)]));
    pares=pares.map(p=>p.situacao==='identificada'?p:complementarComCima(p,fichas));
  }
  const prioridade={
    'Contraindicada':0,'Evitar associação':1,'Interação importante':2,'Requer monitorização':3,
    'Requer cautela':4,'Menção em ficha técnica':5,'Evidência clínica limitada':6,'Consulta incompleta':7
  };
  pares.sort((a,b)=>(prioridade[a.nivel]??8)-(prioridade[b.nivel]??8));
  return responder({
    dataConsulta:new Date().toISOString(),
    pares,
    identificadas:pares.filter(p=>p.situacao==='identificada').length,
    naoAvaliadas:pares.filter(p=>p.situacao!=='identificada').length,
    aviso:'A cobertura é parcial. Uma combinação sem registro continua sem confirmação de segurança.'
  });
}
