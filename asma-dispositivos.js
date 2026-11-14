/* Hub do Alergista — terapia inalatória da ASMA. Revisão editorial 14/11/2026.
   Doses vinculadas à apresentação, faixa etária e bula; MART não deve ser presumido por princípio ativo.
   A GINA 2026 é citada (não reproduzida integralmente). */
(function(){
'use strict';
const GINA='https://ginasthma.org/wp-content/uploads/2026/07/GINA-Summary-Guide-2026-WEB-WMS.pdf';
const GINAFULL='https://ginasthma.org/wp-content/uploads/2026/05/GINA-2026-Strategy-Report-WMS.pdf';
const BULAS='https://consultas.anvisa.gov.br/#/bulario/';
const URL={
 aerolin:'https://consultaremedios.com.br/aerolin/bula',
 aerolinNeb:'https://consultaremedios.com.br/aerolin-para-nebulizacao/bula',
 berotec:'https://consultaremedios.com.br/berotec/bula',
 atrovent:'https://consultaremedios.com.br/atrovent/bula',
 clenilhfa:'https://consultaremedios.com.br/clenil-hfa/bula',
 clenila:'https://consultaremedios.com.br/clenil-a/bula',
 pulmicort:'https://consultaremedios.com.br/pulmicort/bula',
 busonid:'https://consultaremedios.com.br/budesonida/bula',
 flixotide:'https://consultaremedios.com.br/flixotide/bula',
 alvesco:'https://consultaremedios.com.br/alvesco/bula',
 foradil:'https://consultaremedios.com.br/foradil/bula',
 foraseq:'https://consultaremedios.com.br/foraseq/bula',
 symbicort:'https://uploads.consultaremedios.com.br/drug_leaflet/pro/Bula-Symbicort-Turbuhaler-Profissional-Consulta-Remedios.pdf',
 alenia:'https://www.ache.com.br/produto/sob-prescricao/alenia-6-200-mcg/',
 alenia100:'https://www.ache.com.br/produto/sob-prescricao/alenia-6-100-mcg/',
 alenia400:'https://www.ache.com.br/produto/sob-prescricao/alenia-12-400/',
 vannair:'https://consultaremedios.com.br/vannair/bula',
 fostair:'https://consultaremedios.com.br/fostair/bula',
 fostairDpi:'https://consultaremedios.com.br/fostair-dpi/bula',
 seretide:'https://consultaremedios.com.br/seretide/bula',
 seretideDpi:'https://consultaremedios.com.br/seretide-diskus/bula',
 relvar:'https://consultaremedios.com.br/relvar-ellipta/bula',
 spiriva:'https://consultaremedios.com.br/spiriva-respimat/bula',
 trimbow:'https://consultaremedios.com.br/trimbow/bula',
 trelegy:'https://consultaremedios.com.br/trelegy/bula'
};
function p(name,brand,device,strength,age,dose,max,mart,source,note,kind){
 return {name,brand,device,strength,age,dose,max,mart,source,note:note||'',kind:kind||'asma'};
}
/* "máxima" explicitamente classificada como limite de BULA, faixa da BULA ou limiar para buscar assistência.
   Sem um máximo validado, não inventar número. */
const PRODUCTS=[
 p('Salbutamol','Aerolin spray · genéricos','pmdi','100 mcg/jato','Adultos e crianças','Crise: adultos 1–2 jatos; crianças 1 jato (até 2, se necessário).','Uso habitual crônico de bula: até 2 jatos 4 vezes/dia (800 mcg/dia); nas crises agudas, seguir protocolo específico, não este teto de manutenção.','nao',URL.aerolin,'SABA. Não usar como único tratamento de asma.'),
 p('Salbutamol','Aerolin solução · genéricos','nebul','5 mg/mL','Adultos e crianças conforme bula','Adultos: 2,5–5 mg (0,5–1 mL) por nebulização, até 4 vezes/dia. Crianças <12 anos: 2,5 mg, podendo chegar a 5 mg em situações selecionadas.','Uso intermitente habitual até 20 mg/dia (5 mg × 4); em obstrução grave doses até 40 mg/dia apenas em hospital e sob supervisão rigorosa.','nao',URL.aerolinNeb,'Nebulização contínua usa esquema e monitorização hospitalares próprios.'),
 p('Fenoterol','Berotec gotas','nebul','5 mg/mL; 0,25 mg/gota','Adultos, adolescentes e crianças sob avaliação','Inalação: >12 anos geralmente 2 gotas (0,5 mg); casos graves hospitalares até 5 gotas. Crianças 6–12: 1–2 gotas; menores de 6 anos: 0,05 mg/kg/dose sob supervisão.','Bula: >12 anos até 8 gotas/dia sob supervisão; 6–12 anos até 6 gotas/dose, 3 vezes/dia nos casos graves; <6 anos até 4 gotas/dose e 0,15 mg/kg/dia.','nao',URL.berotec,'Diluir em 3–4 mL de SF 0,9%. Intervalo mínimo de 4 horas; não confundir dose inalatória com via oral.'),
 p('Fenoterol','Berotec aerossol','pmdi','100 mcg/jato','Adultos e crianças conforme bula','Alívio broncodilatador com spray dosimetrado; conferir posologia da apresentação.','Teto do aerossol não validado nesta revisão; não converter doses em gotas para jatos.','nao',URL.berotec,'Não usar SABA isolado como tratamento anti-inflamatório de manutenção.'),
 p('Brometo de ipratrópio','Atrovent gotas','nebul','0,25 mg/mL; 20 gotas/mL','Adultos e crianças','Manutenção: >12 anos 40 gotas (0,5 mg) 3–4 vezes/dia; crianças 6–12: 20 gotas (0,25 mg) 3–4 vezes/dia; <6 anos: 8–20 gotas 3–4 vezes/dia sob supervisão.','Acima de 2 mg/dia (>12 anos) ou 1 mg/dia (<12 anos), bula exige supervisão médica. Em crise aguda, repetição conforme protocolo.','nao',URL.atrovent,'SAMA adjuvante na exacerbação; não substitui corticoide inalatório.'),
 p('Brometo de ipratrópio','Atrovent N spray','pmdi','20 mcg/jato','Adultos e crianças >6 anos','2 jatos 4 vezes/dia.','Bula: máximo 12 jatos/dia (240 mcg).','nao',URL.atrovent,'O bocal e a concentração são específicos da apresentação.'),
 p('Formoterol','Foradil · similares','caps','12 mcg/cápsula','Adultos; pediatria conforme bula','Adultos: 1–2 cápsulas 12/12h, sempre associado a CI.','Bula: 48 mcg/dia (4 cápsulas). Não é inalador MART.','nao',URL.foradil,'LABA isolado: contraindicado como monoterapia da asma e não utilizar para crise aguda.'),
 p('Salmeterol','Serevent · similares','diskus','50 mcg/inalação','Adultos / adolescentes conforme bula','Manutenção: 1 inalação 12/12h associada a CI.','Referência posológica usual: 100 mcg/dia; confirmar produto ativo.','nao',BULAS,'LABA isolado; nunca monoterapia na asma. Não é de resgate.'),
 p('Budesonida','Busonid Caps · genéricos','caps','200 ou 400 mcg/cápsula','Adultos e crianças conforme bula','Adultos/adolescentes: 200–800 mcg 12/12h. Crianças ≥6 anos: 200–400 mcg 12/12h, conforme gravidade.','Bula da apresentação: adultos até 1.600 mcg/dia; crianças 6–11 anos até 800 mcg/dia.','nao',URL.busonid,'Corticoide inalatório (CI) de manutenção, não resgate. Cápsula somente para inalar.'),
 p('Budesonida','Pulmicort suspensão · genéricos','nebul','0,25 ou 0,50 mg/mL; flaconetes 2 mL','Adultos; crianças ≥6 meses conforme bula','Adultos: inicial 1–2 mg/dia; manutenção 0,5–4 mg/dia. Crianças ≥6 meses: inicial 0,25–0,5 mg/dia; manutenção 0,25–2 mg/dia.','Faixa de manutenção da bula: até 4 mg/dia no adulto e 2 mg/dia na criança; NÃO é teto absoluto (casos graves exigem avaliação).','nao',URL.pulmicort,'Nebulizar com equipamento indicado na bula; não é alívio imediato.'),
 p('Beclometasona','Clenil HFA spray 50','pmdi','50 mcg/jato','Adultos e crianças','Crianças: 2 jatos 12/12h (200 mcg/dia); adultos: 4 jatos 12/12h (400 mcg/dia).','Bula: crianças até 8 jatos/dia = 400 mcg; adultos até 16 jatos/dia = 800 mcg.','nao',URL.clenilhfa,'Formulação HFA; não extrapolar para formulações extrafinas.'),
 p('Beclometasona','Clenil HFA spray 200','pmdi','200 mcg/jato','Somente adultos','Inicial: 1 jato 12/12h.','Bula: até 4 jatos/dia = 800 mcg/dia.','nao',URL.clenilhfa,'Não usar a apresentação 200 mcg em crianças.'),
 p('Beclometasona','Clenil HFA spray 250 / Jet','pmdi','250 mcg/jato','Somente adultos','Inicial: 2 jatos (500 mcg) a cada 12 horas.','Bula: máximo 8 jatos/dia = 2.000 mcg/dia.','nao',URL.clenilhfa,'Jet contém espaçador integrado; não confundir com formulações extrafinas.'),
 p('Beclometasona','Clenil A','nebul','400 mcg/mL; flaconete 2 mL','Adultos e crianças','Adultos: 1 flaconete 1–2 vezes/dia; crianças: ½ flaconete 1–2 vezes/dia.','Bula: adulto máximo 1.600 mcg/dia (2 flaconetes); criança máximo 800 mcg/dia (1 flaconete).','nao',URL.clenila,'Nebulizador pneumático; não usar via oral.'),
 p('Propionato de fluticasona','Flixotide spray','pmdi','50 ou 250 mcg/jato','Adultos; crianças conforme apresentação','Adultos e adolescentes >16 anos: 100–1.000 mcg 12/12h; 4–16 anos: 50–200 mcg 12/12h.','Faixa da bula: adultos até 2.000 mcg/dia; 4–16 anos até 400 mcg/dia.','nao',URL.flixotide,'CI de manutenção; não usar como resgate.'),
 p('Propionato de fluticasona','Flixotide Diskus','diskus','Pó inalatório; concentração conforme apresentação','Adultos e crianças ≥4 anos','Adultos >16 anos: 100–1.000 mcg 12/12h; crianças 4–16: 50–200 mcg 12/12h.','Faixa da bula: adultos até 2.000 mcg/dia; crianças 4–16 até 400 mcg/dia.','nao',URL.flixotide,'A dose por jato do spray não equivale à dose do Diskus sem conferir concentração.'),
 p('Ciclesonida','Alvesco','pmdi','80 ou 160 mcg/jato','Adultos/adolescentes ≥12 anos; crianças 4–11','Uma administração ao dia; adultos/adolescentes 80–640 mcg/dia; crianças 80–160 mcg/dia.','Bula: até 640 mcg/dia ≥12 anos e 160 mcg/dia entre 4–11 anos.','nao',URL.alvesco,'CI de manutenção; confirmar apresentação comercial ativa.'),
 p('Budesonida + formoterol','Symbicort Turbuhaler 6/100','turbuhaler','100/6 mcg medidos = 80/4,5 mcg liberados','Crianças 6–11: regime GINA específico; bula por idade','GINA 2026 (6–11): etapa 3 = 1 inalação diária + 1 conforme necessidade; etapa 4 = 1 inalação 12/12h + 1 conforme necessidade.','GINA: procurar assistência se precisar de >8 inalações totais/24 h. Conferir se MART está previsto na bula nacional da idade.','gina',GINA,'MART pediátrico: recomendação da diretriz ≠ aprovação automática de toda marca. GINA Tabela 7, p.45.'),
 p('Budesonida + formoterol','Symbicort Turbuhaler 6/200','turbuhaler','200/6 mcg medidos = 160/4,5 mcg liberados','Adultos e adolescentes ≥12 anos','MART: etapa 3 = 1 inalação 12/12h + 1 conforme sintomas; etapas 4–5 = 2 inalações 12/12h + 1 conforme sintomas.','Bula/GINA: usualmente ≤8 inalações totais/dia; até 12 temporariamente. Procurar atendimento se ultrapassar 12/24h.','sim',URL.symbicort,'MART de manutenção e alívio (contar todos os acionamentos, não apenas os extras). GINA Tabela 7, p.45.'),
 p('Budesonida + formoterol','Symbicort Turbuhaler 12/400','turbuhaler','400/12 mcg medidos','Adultos e adolescentes ≥12 anos','Manutenção: 1 inalação 1–2 vezes/dia.','Bula: máximo 2 inalações 12/12h (4/dia) temporariamente; NÃO aplicar limite MART de 12.','nao',URL.symbicort,'Dose alta não é AIR nem MART e não deve ser usada como alívio.'),
 p('Budesonida + formoterol','Alenia 6/100','caps','100/6 mcg medidos por cápsula','≥4 anos conforme bula','Adultos ≥12: 1–2 cápsulas 12/12h. Crianças ≥4: 1 cápsula 1–2 vezes/dia.','Bula: manutenção máximo 4 cápsulas/dia; para adultos/adolescentes, até 8 cápsulas/dia temporariamente em exacerbação orientada.','adicional',URL.alenia100,'Doses adicionais constam na bula, mas não tratar cápsula como equivalente automático ao esquema MART dos estudos.'),
 p('Budesonida + formoterol','Alenia 6/200','caps','200/6 mcg medidos por cápsula','≥4 anos conforme bula','Adultos ≥12: 1–2 cápsulas 12/12h; crianças ≥4: 1 cápsula 1–2 vezes/dia.','Bula: manutenção máximo 4 cápsulas/dia; adultos/adolescentes podem usar até 8 cápsulas/dia temporariamente sob orientação.','adicional',URL.alenia,'Não extrapolar limite de 12 inalações do Turbuhaler à cápsula.'),
 p('Budesonida + formoterol','Alenia 12/400','caps','400/12 mcg por cápsula','Adultos, adolescentes e crianças ≥6 anos','Adultos/adolescentes: 1 cápsula 1–2 vezes/dia; crianças ≥6 anos: 1 cápsula 1–2 vezes/dia.','Bula: adultos/adolescentes até 2 cápsulas 12/12h (4/dia) em casos selecionados; pediatria dose habitual 2/dia.','nao',URL.alenia400,'Alta concentração NÃO é MART e não deve ser usada como resgate.'),
 p('Budesonida + formoterol','Vannair 6/100','pmdi','100/6 mcg por jato','Adultos/adolescentes ≥12; crianças 6–11','Adultos/adolescentes: 2 jatos 1–2 vezes/dia; crianças 6–11: 2 jatos 12/12h.','Bula: adulto/adolescente até 4 jatos 12/12h temporariamente (=8/dia); criança máximo 4 jatos/dia.','nao',URL.vannair,'Bula consultada descreve manutenção, não presumir MART por ser a mesma combinação química.'),
 p('Budesonida + formoterol','Vannair 6/200','pmdi','200/6 mcg por jato','Adultos/adolescentes ≥12','2 jatos 1–2 vezes/dia.','Bula: até 4 jatos 12/12h temporariamente (=8 jatos/dia).','nao',URL.vannair,'Não registrar como MART de bula sem validação regulatória da apresentação.'),
 p('Formoterol + budesonida (cápsulas separadas)','Foraseq 12 + 200 / 400','caps','Formoterol 12 mcg + budesonida 200 ou 400 mcg em cápsulas separadas','Adultos; crianças ≥6 anos','Adultos: formoterol 1–2 cápsulas 12/12h; budesonida 200–400 mcg 1–2 vezes/dia. Crianças: 1 cápsula de formoterol 12/12h e budesonida conforme gravidade.','Bula: adultos formoterol até 4 cápsulas/dia (48 mcg), budesonida até 1.600 mcg/dia; crianças formoterol até 2 cápsulas/dia, budesonida até 800 mcg/dia.','nao',URL.foraseq,'São cápsulas SEPARADAS, não um único inalador para MART/resgate.'),
 p('Beclometasona + formoterol','Fostair 100/6 spray','pmdi','100/6 mcg por jato, extrafino','Adultos ≥18 anos','MART: 1 jato 12/12h + 1 conforme sintomas; manutenção isolada: 1–2 jatos 12/12h.','Bula: MART máximo 8 jatos/24h (2 fixos + até 6 de alívio); manutenção isolada máximo 4 jatos/dia.','sim',URL.fostair,'GINA 2026 sugere buscar assistência acima de 12 total/24h para a combinação, mas teto da bula brasileira é 8. Adotar bula na prescrição usual.'),
 p('Beclometasona + formoterol','Fostair DPI 100/6 Next','next','100/6 mcg por acionamento, extrafino','Adultos ≥18 anos','MART: 1 acionamento 12/12h + 1 conforme sintomas; manutenção isolada: 1–2 acionamentos 12/12h.','Bula: MART máximo 8 acionamentos/24h; manutenção isolada máximo 4/dia.','sim',URL.fostairDpi,'Dispositivo Next DPI é pó seco. Conferir a técnica de abertura da tampa.'),
 p('Beclometasona + formoterol','Fostair 200/6 spray','pmdi','200/6 mcg por jato, extrafino','Adultos ≥18 anos','Manutenção: 2 jatos 12/12h.','Bula: máximo 4 jatos/dia.','nao',URL.fostair,'NÃO usar 200/6 como MART/AIR.'),
 p('Beclometasona + formoterol','Fostair DPI 200/6 Next','next','200/6 mcg por acionamento, extrafino','Adultos ≥18 anos','Manutenção: 2 acionamentos 12/12h.','Bula: máximo 4 acionamentos/dia.','nao',URL.fostairDpi,'NÃO usar 200/6 como MART/AIR.'),
 p('Salmeterol + propionato de fluticasona','Seretide Diskus','diskus','50/100; 50/250; 50/500 mcg/inalação','Adultos/adolescentes ≥12; crianças ≥4','Adultos/adolescentes: 1 inalação 12/12h da concentração indicada; crianças ≥4: 50/100 1 inalação 12/12h.','Bula: 2 inalações/dia da apresentação prescrita (50/500 = 1.000 mcg/dia de fluticasona).','nao',URL.seretideDpi,'Salmeterol não permite MART.'),
 p('Salmeterol + propionato de fluticasona','Seretide spray','pmdi','25/50; 25/125; 25/250 mcg/jato','Adultos/adolescentes ≥12; crianças ≥4','Adultos/adolescentes: 2 jatos 12/12h; crianças ≥4: 25/50, 2 jatos 12/12h.','Bula: 4 jatos/dia da concentração indicada (25/250 = 1.000 mcg/dia de fluticasona).','nao',URL.seretide,'Não é MART.'),
 p('Furoato de fluticasona + vilanterol','Relvar Ellipta','ellipta','100/25 ou 200/25 mcg medidos = 92/22 ou 184/22 mcg liberados','Adultos/adolescentes ≥12','1 inalação 1 vez/dia; selecionar 100/25 ou 200/25 conforme gravidade.','Bula: máximo 1 inalação/dia da apresentação de maior concentração (200/25).','nao',URL.relvar,'Vilanterol não é formoterol; nunca usar como alívio/MART.'),
 p('Fluticasona + formoterol','Flutiform (registro/apresentações a confirmar)','pmdi','A apresentação brasileira vigente deve ser confirmada','A confirmar','Posologia não publicada no catálogo sem apresentação brasileira validada.','Sem máximo confiável até validação de registro e bula.','nao',BULAS,'Mesmo tendo formoterol, não presumir MART: combinação não possui suporte GINA para AIR.'),
 p('Tiotrópio','Spiriva Respimat','respimat','2,5 mcg/jato','≥6 anos, uso adicional','2 jatos sequenciais 1 vez ao dia = 5 mcg/dia.','Bula: máximo 2 jatos/dia = 5 mcg/dia.','nao',URL.spiriva,'LAMA adjuvante, não substitui CI nem é medicação de resgate.'),
 p('Beclometasona + formoterol + glicopirrônio','Trimbow spray','pmdi','100/6/10 mcg por jato (confirmar concentração do produto)','Adultos ≥18 anos','2 jatos a cada 12 horas.','Bula: 4 jatos/dia.','nao',URL.trimbow,'Tripla terapia de manutenção; NÃO é MART mesmo contendo formoterol.')
];
const DPOC=[
 ['Indacaterol — Onbrize','caps','LABA de manutenção na DPOC, não é tratamento isolado da asma'],
 ['Olodaterol — Striverdi','respimat','LABA de manutenção na DPOC, não é tratamento isolado da asma'],
 ['Glicopirrônio — Seebri','caps','LAMA de manutenção na DPOC'],
 ['Umeclidínio — Vanisto','ellipta','LAMA de manutenção na DPOC'],
 ['Aclidínio — Eklira','next','LAMA de manutenção na DPOC; confirmar dispositivo/registro'],
 ['Indacaterol + glicopirrônio — Ultibro Breezhaler','caps','LABA + LAMA de manutenção na DPOC'],
 ['Umeclidínio + vilanterol — Anoro Ellipta','ellipta','LABA + LAMA de manutenção na DPOC'],
 ['Olodaterol + tiotrópio — Spiolto Respimat','respimat','LABA + LAMA de manutenção na DPOC'],
 ['Budesonida + glicopirrônio + formoterol — Breztri','pmdi','Tripla terapia: verificar indicação e registro nacional da apresentação'],
 ['Furoato de fluticasona + umeclidínio + vilanterol — Trelegy','ellipta','Tripla terapia registrada para DPOC na bula brasileira consultada; não inferir indicação de asma']
];
const DEVICE_NAMES={
 pmdi:'Aerossol pressurizado (pMDI)',caps:'Cápsula de pó seco (Aerolizer/Breezhaler e similares)',
 nebul:'Nebulizador pneumático',turbuhaler:'Turbuhaler — pó seco',diskus:'Diskus — pó seco',
 ellipta:'Ellipta — pó seco',next:'Next DPI — pó seco',respimat:'Respimat — névoa suave'
};
const SHAPES={
 pmdi:'<rect x="24" y="5" width="17" height="29" rx="3" fill="url(#metal)" stroke="#567f8b" stroke-width="1.2"/><rect x="27" y="11" width="11" height="15" rx="2" fill="#f5fbfc"/><path d="M19 28h25v9H19z" fill="url(#teal)" stroke="#276e83" stroke-width="1.3"/><path d="M20 34h20v17a4 4 0 01-4 4H10v-9h14V35" fill="url(#ink)" stroke="#1a516a" stroke-width="1.5"/><path d="M10 46h14v8H10z" fill="#c0dfeb"/><circle cx="35" cy="33" r="2" fill="url(#gold)"/>',
 caps:'<rect x="19" y="18" width="25" height="37" rx="8" fill="url(#ink)" stroke="#124d62" stroke-width="1.5"/><rect x="24" y="7" width="16" height="15" rx="3" fill="url(#metal)" stroke="#5b8b99" stroke-width="1.2"/><path d="M24 33h16v17H24z" fill="url(#teal)"/><circle cx="46" cy="33" r="5" fill="url(#gold)" stroke="#a47a2f"/><rect x="29" y="23" width="7" height="7" rx="3.5" fill="#eaf9fc"/>',
 nebul:'<rect x="9" y="32" width="45" height="23" rx="8" fill="url(#ink)" stroke="#164d62" stroke-width="1.5"/><circle cx="43" cy="44" r="5" fill="url(#gold)"/><path d="M21 30V18h17V7H25" fill="none" stroke="#2c7b8d" stroke-width="4" stroke-linecap="round"/><path d="M18 32V19" stroke="#d4ebef" stroke-width="3"/><path d="M39 12l3-5m0 11 8-6m-2 13 8-2" stroke="#80c6d6" stroke-width="2.5" stroke-linecap="round"/>',
 turbuhaler:'<rect x="23" y="8" width="20" height="33" rx="7" fill="url(#metal)" stroke="#618c9b"/><rect x="25" y="18" width="16" height="19" rx="4" fill="url(#ink)"/><path d="M20 38h26l-3 16H23z" fill="url(#teal)" stroke="#225b75"/><path d="M20 44h26M22 49h22" stroke="#d0e9ee" stroke-width="2"/><path d="M28 8v-3h11v3" fill="#c3dce4"/>',
 diskus:'<circle cx="32" cy="31" r="23" fill="url(#ink)" stroke="#1a596d" stroke-width="1.6"/><circle cx="32" cy="31" r="16" fill="url(#teal)" stroke="#83cad1"/><path d="M32 14a17 17 0 0 1 12 29" stroke="url(#gold)" stroke-width="5" fill="none"/><rect x="35" y="39" width="23" height="11" rx="3" fill="url(#metal)" stroke="#487788"/><rect x="40" y="43" width="12" height="3" rx="1.5" fill="#fff"/>',
 ellipta:'<rect x="12" y="14" width="41" height="36" rx="10" fill="url(#metal)" stroke="#3e7182" stroke-width="2"/><path d="M29 14h24v36H29c-5-12-5-24 0-36" fill="url(#ink)" opacity=".94"/><path d="M35 19v26" stroke="#78c4d1" stroke-width="3"/><rect x="17" y="22" width="8" height="17" rx="3" fill="#fff"/><rect x="37" y="38" width="11" height="5" rx="2" fill="url(#gold)"/>',
 next:'<path d="M16 13h30l6 35H19z" fill="url(#ink)" stroke="#164b64" stroke-width="1.7"/><path d="M17 17h25l5 24H20z" fill="url(#teal)"/><rect x="27" y="7" width="11" height="10" rx="2" fill="url(#metal)"/><rect x="25" y="28" width="15" height="7" rx="2" fill="#e0f2f5"/><path d="M19 48h33" stroke="url(#gold)" stroke-width="5" stroke-linecap="round"/>',
 respimat:'<rect x="22" y="10" width="21" height="43" rx="8" fill="url(#ink)" stroke="#1d5a70" stroke-width="1.5"/><rect x="24" y="27" width="17" height="17" rx="4" fill="url(#teal)"/><rect x="26" y="5" width="14" height="9" rx="3" fill="url(#metal)"/><rect x="40" y="16" width="11" height="7" rx="3" fill="url(#metal)"/><path d="M45 13l8-3m-8 12 11 1" stroke="#87c9d7" stroke-width="2.3" stroke-linecap="round"/><path d="M24 47h17" stroke="url(#gold)" stroke-width="3"/>'
};
let iconSerial=0;
const htmlEscape=s=>String(s==null?'':s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function icon(type,small){
 type=SHAPES[type]?type:'pmdi';
 let id='asma-device-'+type+'-'+(++iconSerial);
 let defs='<defs><linearGradient id="'+id+'-ink" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#396f89"/><stop offset=".6" stop-color="#195168"/><stop offset="1" stop-color="#112f44"/></linearGradient><linearGradient id="'+id+'-teal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#a7e1e7"/><stop offset=".6" stop-color="#319faf"/><stop offset="1" stop-color="#11748b"/></linearGradient><linearGradient id="'+id+'-metal" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#cadce6"/><stop offset="1" stop-color="#7098a8"/></linearGradient><linearGradient id="'+id+'-gold" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#ffedb5"/><stop offset=".5" stop-color="#d2aa52"/><stop offset="1" stop-color="#ad7f29"/></linearGradient></defs>';
 const body=SHAPES[type].replace(/url\(#(ink|teal|metal|gold)\)/g,(_m,n)=>'url(#'+id+'-'+n+')');
 return '<span class="asma-device'+(small?' asma-device-small':'')+'" title="'+htmlEscape(DEVICE_NAMES[type])+'" aria-label="'+htmlEscape(DEVICE_NAMES[type])+'"><svg role="img" aria-label="'+htmlEscape(DEVICE_NAMES[type])+'" viewBox="0 0 64 64">'+defs+body+'</svg></span>';
}
function norm(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function badge(m){
 if(m==='sim')return '<span class="asma-mart asma-mart-yes">MART · bula</span>';
 if(m==='gina')return '<span class="asma-mart asma-mart-gina">MART · GINA / verificar bula</span>';
 if(m==='adicional')return '<span class="asma-mart asma-mart-caution">Dose adicional em bula · não equiparar a MART</span>';
 return '<span class="asma-mart asma-mart-no">Não é MART</span>';
}
function medicationCard(x,i){
 return '<details class="asma-inhaler-card" data-hub-medicamento>'+
  '<summary><span class="asma-device-anchor">'+icon(x.device)+'</span><span class="asma-inhaler-main"><span class="hub-med-nome">'+htmlEscape(x.name)+'</span><span class="asma-brand">'+htmlEscape(x.brand)+'</span><span class="asma-strength">'+htmlEscape(x.strength)+'</span></span>'+
  '<span class="asma-chevron" aria-hidden="true">⌄</span></summary>'+
  '<div class="asma-quick"><span><small>DOSE USUAL</small>'+htmlEscape(x.dose)+'</span><span><small>LIMITE / DOSE MÁXIMA</small>'+htmlEscape(x.max)+'</span></div>'+
  '<div class="asma-mart-row">'+badge(x.mart)+'</div>'+
  '<div class="asma-inhaler-more"><div><span class="asma-label">Dispositivo</span><p>'+htmlEscape(DEVICE_NAMES[x.device])+'</p></div><div><span class="asma-label">Faixa etária</span><p>'+htmlEscape(x.age)+'</p></div>'+
  (x.note?'<div><span class="asma-label">Orientações</span><p>'+htmlEscape(x.note)+'</p></div>':'')+
  '<div class="asma-inhaler-sources"><a href="'+htmlEscape(x.source)+'" target="_blank" rel="noopener noreferrer">Bula / fonte do medicamento ↗</a><a href="'+GINA+'" target="_blank" rel="noopener noreferrer">GINA 2026, Tabelas 6 e 7, pp. 44–45 ↗</a></div></div></details>';
}
function render(slot,q){
 if(!slot)return;
 const query=norm(q);
 const shown=PRODUCTS.filter(x=>!query||norm([x.name,x.brand,x.device,x.strength,x.age,x.dose,x.max,x.mart].join(' ')).includes(query));
 const other=DPOC.filter(x=>!query||norm(x.join(' ')).includes(query));
 slot.innerHTML='<div class="asma-module">'+
 '<div class="asma-note"><span class="asma-label">ASMA · TERAPIA INALATÓRIA</span><p>Ícone desenhado do dispositivo em cada apresentação. Dose habitual e limite máximo estão separados. Em regimes MART, o número total inclui manutenção + alívio. Os limites da GINA não substituem o teto da bula brasileira do produto. As faixas de dose alta de CI na GINA não são, por si, limites máximos de bula.</p></div>'+
 '<div class="asma-legend">'+Object.keys(DEVICE_NAMES).map(k=>'<span>'+icon(k,true)+'<small>'+htmlEscape(DEVICE_NAMES[k])+'</small></span>').join('')+'</div>'+
 '<div class="asma-count">'+shown.length+' apresentações para asma</div>'+
 '<div class="asma-catalog">'+(shown.length?shown.map(medicationCard).join(''):'<p class="med-empty">Nenhuma apresentação para asma corresponde à busca.</p>')+'</div>'+
 (other.length?'<details class="asma-dpoc"><summary>Outros inaladores — DPOC / registro e indicação separados ('+other.length+')</summary><p>Os itens abaixo são mantidos no catálogo geral. Não extrapolar indicações, doses ou MART da asma para a DPOC.</p><div class="asma-dpoc-list">'+other.map(x=>'<div>'+icon(x[1],true)+'<span><strong>'+htmlEscape(x[0])+'</strong><small>'+htmlEscape(x[2])+'</small></span></div>').join('')+'</div></details>':'')+
 '<p class="asma-foot">Referências: <a target="_blank" rel="noopener noreferrer" href="'+GINA+'">GINA Summary Guide 2026, Tabelas 6–7, pp. 44–45</a>; <a target="_blank" rel="noopener noreferrer" href="'+GINAFULL+'">GINA Strategy Report 2026, Boxes 4-2 e 4-8, pp. 77, 90–91</a>; bulas específicas vinculadas às fichas. Revisão documental: 14/11/2026. Disponibilidade comercial e registro ativo exigem checagem independente no <a target="_blank" rel="noopener noreferrer" href="'+BULAS+'">Bulário Anvisa</a>.</p></div>';
}
window.hubAsmaRender=render;window.hubAsmaDataset={products:PRODUCTS,devices:DEVICE_NAMES};
})();