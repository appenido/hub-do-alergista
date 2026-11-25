/* Portfólio brasileiro complementar de fórmulas — revisado em 25/11/2026.
 * Linhas comerciais distintas; gramaturas e kits não são repetidos como produtos.
 * Links institucionais: Danone Nutricia / Mundo Danone / Nestlé.
 */
(function(){
'use strict';
var linhas="Aptamil Pepti|D|extensa|aplv|0 a 36 meses|Extensamente hidrolisada para tratamento nutricional da APLV.\nNeoAdvance sem sabor|D|amino|aplv-pediatria|1 a 10 anos|Preparação pediátrica de aminoácidos livres para necessidades dietéticas especiais relacionadas à APLV.\nNeoForte baunilha|D|amino|aplv-suporte|3 a 10 anos|Suplemento pediátrico de aminoácidos para crianças com APLV; não é fórmula de lactente.\nNeoForte morango|D|amino|aplv-suporte|3 a 10 anos|Suplemento pediátrico de aminoácidos para crianças com APLV; não é fórmula completa de lactente.\nNeoSpoon|D|amino|aplv-suporte|Uso pediátrico conforme rótulo|Mistura de aminoácidos para preparações de colher, sem proteína do leite; não é fórmula infantil completa.\nAptamil Soja 2|D|soja|aplv-alternativa|0 a 12 meses; na APLV considerar após 6 meses|Fórmula de soja sem proteínas lácteas. Na APLV, usar apenas em casos selecionados após 6 meses e sem alergia à soja.\nNAN Science Pro Soja|N|soja|aplv-alternativa|0 a 12 meses; na APLV considerar após 6 meses|Fórmula de proteína isolada de soja. Alternativa seletiva para APLV após 6 meses e sem alergia associada à soja.\nAptamil Premium 1|D|intacta|rotina0|0 a 6 meses|Fórmula padrão de partida com proteínas lácteas íntegras; não indicada para APLV.\nAptamil Profutura 1|D|intacta|rotina0|0 a 6 meses|Fórmula padrão de partida à base de leite; não trata APLV.\nAptamil Profutura Gold 1|D|intacta|rotina0|0 a 6 meses|Fórmula de partida com ingredientes lácteos e HMO; não indicada para APLV.\nMilupa 1|D|intacta|rotina0|0 a 6 meses|Fórmula infantil de partida com proteína do leite; não é apropriada para APLV.\nNAN Supreme Pro 0–6 meses|N|intacta|rotina0|0 a 6 meses|Fórmula padrão com proteínas lácteas e HMOs; não é terapia para APLV.\nNAN Comfor 0–6 meses|N|intacta|rotina0|0 a 6 meses|Fórmula padrão com proteínas lácteas, prebióticos e DHA/ARA; não trata APLV.\nNestogeno 0–6 meses|N|intacta|rotina0|0 a 6 meses|Fórmula padrão de partida, com proteína láctea; não indicada na APLV.\nAptamil Premium 2|D|intacta|rotina1|6 a 12 meses|Fórmula de seguimento com proteínas do leite intactas; não indicada na APLV.\nAptamil Profutura 2|D|intacta|rotina1|6 a 12 meses|Fórmula de seguimento com proteína láctea; não trata APLV.\nAptamil Profutura Gold 2|D|intacta|rotina1|6 a 12 meses|Fórmula de seguimento com proteína láctea e HMO; não trata APLV.\nMilupa 2|D|intacta|rotina1|6 a 12 meses|Fórmula infantil de seguimento com proteína láctea; não indicada para APLV.\nNAN Supreme Pro 6–12 meses|N|intacta|rotina1|6 a 12 meses|Fórmula de seguimento com proteína láctea e HMO; não indicada na APLV.\nNAN Comfor 6–12 meses|N|intacta|rotina1|6 a 12 meses|Fórmula de seguimento com proteína láctea; não é tratamento para APLV.\nNestogeno 6–12 meses|N|intacta|rotina1|6 a 12 meses|Fórmula de seguimento com proteína láctea; não indicada para APLV.\nAptanutri Premium 3|D|intacta|primeira|1 a 3 anos|Fórmula de primeira infância com ingredientes lácteos; não serve para exclusão de proteínas do leite.\nAptanutri Profutura 3|D|intacta|primeira|1 a 3 anos|Fórmula de seguimento para crianças de primeira infância contendo ingredientes do leite.\nAptanutri Profutura Gold 3|D|intacta|primeira|1 a 3 anos|Fórmula de primeira infância com ingredientes lácteos e HMO; não trata APLV.\nAptanutri Soja 3|D|soja|primeira|1 a 3 anos|Fórmula de seguimento à base de soja; uso seletivo na APLV sem alergia concomitante à soja.\nNANLAC Supreme Pro|N|intacta|primeira|1 a 3 anos|Fórmula de primeira infância com ingredientes lácteos e HMOs; não indicada para APLV.\nNANLAC Comfor|N|intacta|primeira|1 a 3 anos|Fórmula de primeira infância com proteínas lácteas; não indicada para APLV.\nNestoNutri|N|intacta|primeira|A partir de 1 ano|Fórmula de primeira infância com ingredientes lácteos; não usar na dieta de exclusão da APLV.\nAptamil Sensitive Active|D|parcial|especial|0 a 36 meses|Fórmula com proteínas do leite parcialmente hidrolisadas; não serve para tratar APLV confirmada.\nAptamil HA ProExpert|D|parcial|especial|Conforme faixa etária da embalagem|Fórmula com proteínas do leite parcialmente hidrolisadas; inadequada para terapia da APLV.\nAptamil SL|D|lactose|especial|0 a 36 meses|Fórmula com restrição de lactose, que não equivale à exclusão de proteínas do leite na APLV.\nNAN Science Pro S.L.|N|lactose|especial|0 a 36 meses|Fórmula com restrição de lactose, não indicada para APLV.\nAptamil RR|D|espessada|especial|0 a 12 meses|Fórmula espessada com goma jataí para demandas relacionadas à regurgitação; contém proteínas lácteas.\nNAN Science Pro EspessAR HMO|N|espessada|especial|0 a 12 meses|Fórmula espessada para lactentes com necessidades específicas de regurgitação; não trata APLV.\nNestogeno Espessar|N|espessada|especial|0 a 12 meses|Fórmula de seguimento espessada contendo proteínas lácteas; não trata APLV.\nNAN Science Pro Sensitive HMO|N|especial|especial|0 a 6 meses|Fórmula para necessidades digestivas específicas. Não equiparar à fórmula extensamente hidrolisada para APLV.\nAptamil ProExpert Pré|D|prematuro|prematuros|Prematuros e recém-nascidos de alto risco|Fórmula especial para prematuros, com indicação e seguimento da neonatologia.\nAptamil ProExpert Pré Transition|D|prematuro|prematuros|Pré-termo e transição pós-alta|Fórmula de transição para prematuros, com metas nutricionais especializadas.\nPré NAN Transition|N|prematuro|prematuros|Pré-termo e transição|Fórmula especial para recém-nascidos pré-termo e/ou de alto risco.\nInfatrini pó|D|hipercalorica|especial|Lactentes e primeira infância|Fórmula hipercalórica (1 kcal/mL na diluição padrão) para demandas nutricionais especiais.\nInfatrini líquido 125 mL|D|hipercalorica|especial|Lactentes e primeira infância|Fórmula hipercalórica líquida, pronta para uso, com 1 kcal/mL.\nTyr Anamix Infant|D|metabolica|metabolicas|Lactentes com indicação metabólica|Fórmula dietoterápica para tirosinemia, com restrição de tirosina e fenilalanina.\nMMA/PA Anamix Infant|D|metabolica|metabolicas|Lactentes com indicação metabólica|Fórmula dietoterápica específica para acidemia metilmalônica ou propiônica.\nPKU Nutri Concentrated 1|D|metabolica|metabolicas|Lactentes com indicação metabólica|Fórmula específica para fenilcetonúria ou hiperfenilalaninemia, sob supervisão metabólica.";
var D='https://www.mundodanone.com.br/infantil/formulas-infantis/c';
var DA='https://www.mundodanone.com.br/infantil/formulas-infantis/aplv/c';
var DE='https://www.mundodanone.com.br/infantil/formulas-infantis/formulas-especializadas/c';
var D1='https://www.mundodanone.com.br/infantil/formulas-infantis/1-a-3-anos/c';
var N='https://www.nestlefamilynes.com.br/formulas-infantis';
var NS='https://www.nestle.com.br/marcas/alimentos-infantis';
var tipos={intacta:'Proteína láctea intacta',extensa:'Proteína extensamente hidrolisada',amino:'Aminoácidos livres',
soja:'Proteína isolada de soja',parcial:'Proteína parcialmente hidrolisada',lactose:'Fórmula sem lactose',
espessada:'Fórmula espessada',especial:'Fórmula especial',prematuro:'Fórmula para prematuridade',
hipercalorica:'Fórmula hipercalórica',metabolica:'Fórmula para doença metabólica'};
var fotos={
'Aptamil Premium 1':'https://www.drogariaminasbrasil.com.br/media/webp/catalog/product/cache/74c1057f7991b4edb2bc7bdaa94de933/image/17221b678/formula-infantil-aptamil-premium-1-800g_jpg.webp',
'Aptamil Profutura Gold 1':'https://images.tcdn.com.br/img/img_prod/1109462/formula_aptamil_1_profutura_gold_800g_1_20260424122423_75a20d2cb34e.png',
'NAN Supreme Pro 0–6 meses':'https://mixalimentos.agilecdn.com.br/113295_1.jpg',
'NAN Comfor 0–6 meses':'https://img.drogaraia.com.br/catalog/product/n/a/nan_comfor_1_1.jpg?height=450&quality=85&type=resize&width=450',
'Nestogeno 0–6 meses':'https://down-br.img.susercontent.com/file/bfb60217cf018475d6d562b7dc8154c6'
};
function fonte(fab,cat,nome){
if(fab==='N'){
 if(nome==='Pré NAN Transition')return 'https://www.nestlenutre.com.br/marcas/nan/formula-infantil-pre-nan-transition-400g';
 return cat==='primeira'?NS:N;
}
if(cat==='aplv'||cat==='aplv-pediatria'||cat==='aplv-suporte'||cat==='aplv-alternativa')return DA;
if(cat==='primeira')return D1;
if(cat==='especial'||cat==='prematuros'||cat==='metabolicas')return DE;
return D;
}
function prep(nome){
if(nome==='Infatrini líquido 125 mL')return 'Apresentação líquida pronta para uso; não diluir. Acondicionamento e conservação conforme embalagem, respeitando o prazo após abertura.';
return 'Preparar conforme a tabela de reconstituição da apresentação comercial (colher-medida original, volume exato de água e quantidade de pó). A proporção varia por produto e pode mudar com reformulações; não adotar 1 medida/30 mL indiscriminadamente.';
}
function volume(cat,tipo,nome){
if(nome==='Infatrini líquido 125 mL')return 'Densidade de 1 kcal/mL. Exemplo: 200 kcal provenientes do produto correspondem a 200 mL prontos; o volume diário é definido pela meta energética individual.';
if(tipo==='prematuro')return 'Volume (mL/kg/dia), meta energética e proteína são definidos pela neonatologia conforme idade corrigida, tolerância, balanço hídrico e crescimento.';
if(cat==='metabolicas')return 'Quantidade individualizada pela equipe de erros inatos do metabolismo, considerando ingestão de aminoácidos, exames e necessidades energéticas.';
if(cat==='aplv-suporte'||cat==='aplv-pediatria')return 'Calcular a contribuição energética/proteica necessária. Suplementos não substituem automaticamente uma fórmula completa ou refeições; volumes e medidas variam por produto.';
if(cat==='primeira')return 'Incorporar ao plano alimentar conforme idade, ingestão de outros alimentos e evolução de crescimento, sem aplicar fórmula fixa de volume por kg.';
if(cat==='rotina0')return 'Em lactente de 0–6 meses alimentado exclusivamente por fórmula, ~150 mL/kg/dia é apenas um ponto inicial de planejamento, com ajuste por crescimento, apetite e necessidade nutricional.';
if(cat==='rotina1')return 'De 6–12 meses, individualizar número de ofertas e volume com a alimentação complementar, peso e curva de crescimento.';
if(tipo==='soja')return 'Na APLV, uso seletivo conforme idade, fenótipo e tolerância à soja, em geral após 6 meses. Volume individualizado por necessidade energética e alimentação complementar.';
return 'A quantidade diária depende de idade, peso, diagnóstico, meta energética, tolerância e alimentação complementar. Evitar prescrição universal por marca.';
}
function ofertar(cat,tipo){
if(tipo==='prematuro')return 'Administrar por via oral ou enteral conforme estratégia neonatal e avaliação da sucção, sem modificar a densidade da fórmula.';
if(tipo==='metabolica')return 'Oferecer somente como parte do regime dietético específico prescrito pela equipe especializada; não utilizar na ausência do diagnóstico.';
if(tipo==='espessada')return 'Preparar na proporção indicada e observar a viscosidade final e a adequação do bico. Não acrescentar espessantes sem prescrição.';
if(cat==='aplv-suporte')return 'Ofertar conforme o tipo (bebida ou preparo em consistência de colher); pode integrar refeições, sem substituir automaticamente a fórmula principal.';
if(cat==='primeira'||cat==='aplv-pediatria')return 'Ofertar preferencialmente em copo, conforme a idade, incorporando ao plano alimentar diário com monitoramento nutricional.';
return 'Ofertar em mamadas fracionadas, por mamadeira ou copo conforme a idade; higienizar utensílios e descartar sobras da mamada.';
}
function grupo(cat){return cat.startsWith('aplv')?'infantil':cat==='primeira'?'pediatrica':'infantil';}
window.HubFormulasCatalogoAdicional=linhas.split('\n').map(function(line,i){
var x=line.split('|'),nome=x[0],fab=x[1],tipo=x[2],cat=x[3],idade=x[4],ind=x[5];
var p={id:'formula-nova-'+i,nome:nome,fabricante:fab==='D'?'Danone / Nutricia':'Nestlé',
classe:tipo,classeNome:tipos[tipo],categoria:cat,grupo:grupo(cat),idade:idade,
energia:tipo==='hipercalorica'?'1 kcal/mL':'Densidade conforme versão comercial',
preparo:prep(nome),indicacao:ind,posologia:volume(cat,tipo,nome),
oferta:ofertar(cat,tipo),fonte:fonte(fab,cat,nome),imagem:fotos[nome]||''};
if(nome==='Aptamil Premium 1'){
p.alerta='Anvisa, 19/03/2026: recolhimento de três lotes da apresentação 800 g (2026.09.07, 2026.10.03 e 2026.09.09) por presença de cereulida. Não utilizar lotes afetados; demais lotes não foram incluídos.';
p.alertaFonte='https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-proibe-venda-de-formula-infantil-contaminada-por-toxina';
p.alertaFonteRotulo='Anvisa — recolhimento por lote';
}
if(['NAN Supreme Pro 0–6 meses','NAN Supreme Pro 6–12 meses','Nestogeno 0–6 meses','NANLAC Supreme Pro','NANLAC Comfor','NAN Science Pro Sensitive HMO'].includes(nome)){
p.alerta='Recolhimento preventivo Nestlé em 2026: verificar embalagem, gramatura e lote no comunicado oficial antes do uso. A medida abrange lotes específicos, não toda a linha.';
p.alertaFonte='https://www.nestlefamilynes.com.br/recolhimento-de-produto';
p.alertaFonteRotulo='Nestlé — conferir lotes afetados';
}
return p;
});
})();