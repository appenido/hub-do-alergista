# Auditoria técnico-acadêmica — Hub do Alergista
Data: 04/11/2026
Ramo: `auditoria-clinica-integrada-2026-11-04`
Objeto: código médico em `index.html` e questionário `uct-paciente.html`.
Status: correções propostas; ainda requer validação clínica por pares, verificação de bulas ANVISA por apresentação e testes funcionais em navegador antes do uso assistencial.

## Método e níveis de segurança
Inspeção de conteúdo e regras clínicas efetivamente existentes no repositório. Prioridade: erros com potencial de dose inadequada, cálculo diagnóstico errado, contraindicação vacinal, desinformação de evidência ou prognóstico. Comparação orientada por documentos primários atuais da GINA 2026, EAACI/GA²LEN/EuroGuiDerm 2026, EAACI e ACG de EoE, AAAAI/ACAAI/CIS para reposição de IgG, SBIm 2026/27, CDC, ANS e PCDT brasileiro da Asma 2026.

A classificação abaixo discrimina risco potencial no software, não prova dano real ao paciente. Apenas teste de sintaxe JS e exemplos unitários de escores foram executados; nenhum protocolo assistencial real foi validado.

## Não conformidades identificadas e modificadas
| Severidade | Falha anterior | Ação no ramo |
|---|---|---|
| CRÍTICA | EASI calculado por quatro perguntas simplificadas sem área nem quatro sinais por região | Reconstruído: 4 regiões, área 0–6, quatro sinais 0–3, pesos etários; 0–72 |
| CRÍTICA | SCORAD usava extensão aproximada, intensidade categorizada e dividia os sintomas subjetivos por 5 | Corrigido para A/5 + 7B/2 + C, seis sinais objetivos e VAS para prurido e sono; 0–103 |
| ALTA | UAS7 permitia calcular 0/42 sem o preenchimento dos sete dias | Respostas agora obrigatórias; ausências não viram zero |
| ALTA | UCT do profissional não contemplava corretamente os quatro domínios originais | Reorganizado; alerta para uso de versão validada em português em documentos/pesquisa |
| CRÍTICA | Escore laboratorial próprio ICPE-UCE retornava diagnóstico de endótipo tipo I/IIb e antecipação terapêutica com limiares arbitrários | Substituído por checklist descritivo, explicitamente não validado, sem diagnóstico nem aconselhamento de mudança de mecanismo |
| CRÍTICA | Dose de reposição IV mensal (400 mg/kg) era extrapolada diretamente a cada semana na IgG subcutânea convencional, risco de 4× o total mensal de referência | Corrigida conversão inicial para um quarto da referência mensal a cada semana, exceto SC facilitada com hialuronidase (esquema próprio). Necessita confirmação por marca/bula |
| CRÍTICA | Velocidades de infusão IV/SC eram geradas com tabelas estáticas e duplicação automática de taxas | Bloqueada produção de velocidades numéricas e tabelas de escalonamento não verificadas; conferência de bula e protocolo institucional obrigatória |
| ALTA | IgG sérica ≥500 mg/dL implicava resposta "manter posologia", ignorando infecções e condições individuais | Meta orientativa >800 mg/dL para IEI quando apropriada; sem manutenção automática; imunodeficiências secundárias requerem metas próprias |
| ALTA | IgA isolada, enteropatia perdedora de proteína e imunomodulação de dose alta calculadas como indicações genéricas de IgGRT | Cálculo automático bloqueado; requer elegibilidade e esquema específicos |
| CRÍTICA | Histórico de anafilaxia a imunoglobulina gerava proposta de pré-medicação e infusão | Bloqueado cálculo automático; avaliar em serviço especializado, sem tratar corticosteroide/anti-H1 como prevenção suficiente |
| ALTA | Algoritmo de vacinação tratava asplenia, nefropatia e complemento como imunossupressão geral, ao mesmo tempo recomendava vacinas vivas em situações de imunodepressão | Retiradas essas três equivalências; vacina viva em crianças e gestantes filtrada por condições de risco. Decisão em IEI/HIV continua individual |
| ALTA | Referência de intervalo de 8 meses após IgIV era estendida de forma genérica a todas as vacinas vivas | Distinguida interferência em SCR/varicela dependente da dose/produto |
| MÉDIA | Datas etárias de rotavírus e indicação materna de vacina VSR desatualizadas | Alinhadas a PNI/SBIm 2026/27 com ressalva de faixa da bula |
| MÉDIA | RZV recomendada automaticamente aos 18 anos por asma/DPOC isoladas | Restringida regra etária de rotina; imunodeprimidos possuem fluxo próprio |
| CRÍTICA | O painel “Análise MBE” atribuía a qualquer artigo com palavras-chave um dos seis pareceres estáticos, inclusive números de desfechos e referências não ligadas ao DOI daquele artigo | Desativadas análises pré-fabricadas; painel informa ausência de revisão individual e oferece link para publicação original e checklist |
| ALTA | Plano genérico de asma recomendava “2–4 jatos” sem identificar broncodilatador, dispositivo ou estratégia GINA | Substituído por modelo que exige prescrição de medicação, dose e estratégia individual |
| ALTA | Bot de IgG fornecia exemplos de taxas de infusão e conduta de pré-medicação como se fossem universais | Resposta passou a exigir conferência de bula, apresentação, risco e protocolo de emergência |
| MÉDIA | Referências de urticária (2022), EoE (2017), asma (EAACI 2021) e alergia alimentar (2018) apresentadas como contemporâneas | Incorporadas fontes de urticária 2026, EoE 2024/ACG 2025, GINA e PCDT 2026 e manejo da alergia alimentar EAACI 2025 |
| ALTA | 13 links da seção de protocolos abriam buscas genéricas no PubMed, permitindo acessar estudo não correspondente à citação | Substituídos por PMIDs verificados e específicos; todos os 16 links agora apontam para artigo identificado |
| MÉDIA | Formulário remoto de UCT inseria o nome livre do paciente via `innerHTML` | Alterado para `textContent`, evitando injeção de HTML no retorno do paciente |

## Verificações técnicas concluídas
- Todos os 12 blocos de script inline no `index.html` compilados por parser JavaScript (sem erro sintático).
- Resultados testados: EASI mínimo e máximo em adultos e crianças; SCORAD mínimo/máximo; UCT mínimo/máximo; UAS7 mínimo/máximo.
- Teste automatizado: `node tests/medical-score-regression.cjs`, incluído no GitHub Actions em alterações pertinentes.
- O cálculo de referência IV→SC inicial é uma aproximação inicial e não substitui fator de conversão e posologia de marca.

## Não conformidades ainda abertas / validação clínica obrigatória antes de produção
1. Revisar manualmente cada medicamento e apresentação comercial de IgG IV/SC com bula ANVISA vigente, registro, lote de documento, indicação, velocidades, volumes por sítio, idade e compatibilidade. Sem isso, velocidades permanecerão desativadas.
2. Revisar por pares todos os protocolos de imunoglobulina, incluindo elegibilidade diagnóstica de IEI e deficiência secundária, resposta vacinal pré-tratamento, histórico de infecções, peso utilizado para doses em obesidade, metas de vale, distúrbios renais, trombose, gravidez e terapias de imunomodulação. Não reutilizar automaticamente a dose de reposição para imunomodulação.
3. Validar cópia autorizada da versão portuguesa dos instrumentos UCT, ACT, DLQI, SNOT-22 e formulários externos; paráfrases não devem ser apresentadas como escala idêntica para pesquisa, auditorias ou DUT.
4. Revisar critérios específicos e atualizações da ANS, CONITEC e ANVISA separadamente de recomendação clínica. Ex.: UAS7 ≥28 na DUT 65.11 é um requisito de cobertura suplementar, não limiar exclusivo de indicação clínica.
5. Verificar todo o calendário vacinal contra a carteira, apresentação, idade, gestação, história de doses, via, CRIE/RIE e imunossupressor. Motor atual não é sistema validado de prescrição de vacinas.
6. Fazer testes de navegador com casos simulados: crianças, gestantes, IEI, imunossupressão, usuários sem histórico, erros de entrada, cálculo IgG e fluxo de impressão; só então considerar implantação.
7. Revisar privacidade/LGPD em banco, políticas RLS e armazenamento de identificadores no UCT e no histórico de pacientes. A presente auditoria é clínico-acadêmica, não constitui auditoria de segurança.
8. Padronizar metadados de publicação (DOI/PMID, versão, consulta e método), revisão editorial humana e atualização automatizada com verificação de correspondência DOI–título–ano, nunca por palavras-chave.
9. Validar protocolo clínico com comitê de alergia/imunologia, farmácia clínica e coordenação de enfermagem, especialmente para infusão.

## Referências primárias e regulatórias (conferidas em 04/11/2026)
- EAACI/GA²LEN/EuroGuiDerm/APAAACI. International Guideline for Urticaria, Allergy 2026;81:2582–2632. https://doi.org/10.1111/all.70210
- GINA. Global Strategy for Asthma Management and Prevention e Severe Asthma Guide 2026. https://ginasthma.org/2026-gina-severe-asthma-guide/
- Ministério da Saúde. PCDT da Asma, Portaria Conjunta 43/2026, atualizado 04/09/2026. https://www.gov.br/saude/pt-br/assuntos/pcdt/a/asma/view
- EAACI. Management of IgE-mediated food allergy. Allergy 2025;80:14–36. https://pubmed.ncbi.nlm.nih.gov/39473345/
- ACG. Diagnosis and Management of Eosinophilic Esophagitis. AJG 2025. https://pubmed.ncbi.nlm.nih.gov/39745304/
- WAO/EAACI HAE 2021 revision published 2022. https://pubmed.ncbi.nlm.nih.gov/35006617/
- ETFAD SCORAD critical interpretation. https://pubmed.ncbi.nlm.nih.gov/17714568/
- ASBAI. Ler Dermatite Atópica, tabela SCORAD. https://asbai.org.br/wp-content/uploads/2023/08/Ler-Dermatite-atopica-ABRIL-2022.pdf
- SBIm calendários 2026/27. https://sbim.org.br/
- CDC. Timing and Spacing of Immunobiologics (antibody-containing products and live vaccines). https://www.cdc.gov/vaccines/hcp/imz-best-practices/timing-spacing-immunobiologics.html
- ANS. RN 465/2021 e anexo II, DUT 65 atualizada; https://www.gov.br/ans/
- AAAAI/ACAAI/CIS. Practice parameter for immunoglobulin replacement, 2025 (publicado 2026), verificar artigo integral para aplicação.
