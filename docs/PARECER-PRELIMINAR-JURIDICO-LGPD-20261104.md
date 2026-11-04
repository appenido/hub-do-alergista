# Parecer preliminar de validação jurídico-regulatória — Hub do Alergista
Data da revisão: 04/11/2026
Status: conformidade parcial; não aprovado para declaração de conformidade integral
Natureza: avaliação documental e técnico-jurídica de apoio à gestão, sujeita à revisão e assinatura de advogado habilitado e validação do controlador efetivo.

## 1. Objeto, método e limites
Escopo: site/PWA Hub do Alergista; cadastro de profissionais; calculadoras e scores clínicos; formulários SNOT-22, UCT e UAS7 enviados a pacientes; registros locais; assistente de IA; Cloudflare Pages e Supabase.
Evidências consultadas: código-fonte do GitHub appenido/hub-do-alergista, arquivos privacidade.html, termos.html, lgpd-runtime.js, docs/GOVERNANCA-LGPD.md, docs/INCIDENTES-LGPD.md e configurações de permissões no projeto Supabase central. Fontes normativas oficiais ao final.
Não foram verificados: identidade/estrutura societária do titular do Hub, procurações, vínculos contratuais com médicos/hospitais, DPA e suboperadores dos fornecedores, localização concreta de todos os fluxos, trilhas de acesso históricas, autenticação com dois usuários reais, respaldo jurídico específico para cada instituição, capacidade real de atendimento de titulares. Não houve auditoria independente nem parecer jurídico profissional.

## 2. Resultado executivo
- Inadequação material de transparência: não há nome/qualificação do controlador nem contato institucional externo devidamente identificado na política publicada, em desconformidade com os requisitos informativos dos arts. 9º, III e IV, e 41 da LGPD, ressalvada eventual dispensa de encarregado aplicável, que não dispensa canal de titulares.
- Lacuna material de governança: não existem bases legais aprovadas por finalidade ou matriz contratual que determine quando o Hub age como controlador ou operador e quando o médico/clínica/hospital controla os dados assistenciais.
- Risco alto de dados sensíveis: nome de paciente associado a scores clínicos e questionários são dados de saúde, sujeitos ao art. 11. Identificadores removidos do texto não implicam anonimização automática; pseudonimização pode continuar sendo tratamento de dados pessoais.
- Risco alto específico de menores: formulários podem alcançar crianças e adolescentes sem comprovação de avaliação documentada de melhor interesse, responsáveis e fluxos apropriados.
- Lacuna relevante de retenção: prazos por finalidade, base de expurgo, backup, exportação, guarda assistencial e descarte não foram aprovados. Não confundir expiração do link com exclusão do conteúdo.
- Pendência de transferência internacional: não há comprovação apresentada de mecanismo dos arts. 33 a 36 e Resolução CD/ANPD 19/2024 para fluxos concretos, fornecedores e suboperadores.
- Pendência de incidentes: houve anteriormente leitura direta pública de determinadas tabelas de dados clínicos, posteriormente revogada. Necessária investigação documental de acessos para qualificar eventual incidente. Ausência de prova de exploração não equivale a prova de inexistência de incidente.
- Controles técnicos favoráveis: no momento da verificação, as tabelas sensíveis examinadas não concediam SELECT direto à role anon, havia RLS, canal autenticado de solicitações do usuário, autenticação Supabase e links com sessões aleatórias. Essas verificações isoladas não certificam segurança end-to-end.

Conclusão: não recomendada declaração “100% LGPD”, “certificado LGPD” ou uso assistencial com dados identificáveis de pacientes fora de ambiente contratualmente e organizacionalmente formalizado. O módulo educacional com dados não pessoais pode ser mantido mediante controles habituais.

## 3. Qualificação jurídica dos atores (não presumir responsabilidades)
A classificação depende de quem define finalidades e meios essenciais, não da marca ou de uma cláusula unilateral:
- Cadastro, personalização e segurança da plataforma: provável controlador = pessoa física ou jurídica que efetivamente administra o Hub (identidade não comprovada). Supabase/Cloudflare podem ser operadores ou exercer papéis próprios em operações distintas; verificar contratos.
- Saúde de pacientes inseridos pelo médico: provável controlador = profissional autônomo, clínica ou hospital responsável pelo atendimento, conforme o vínculo assistencial. A pessoa jurídica administradora do Hub pode ser operadora, controladora conjunta ou controladora independente em determinadas finalidades, a determinar por fatos e contratos.
- IA de terceiros: mapear exatamente quem recebe prompts, finalidades próprias de retenção/treinamento, suboperadores, contrato e transferência internacional. Não presumir que todo provedor é apenas operador.
- Titulares menores: definir qual pessoa/instituição valida identidade e legitimidade do responsável e mantém prova quando necessária.
Atribuir controlador, operador e eventual controladoria conjunta em matriz RACI, com instruções documentadas e cláusulas de confidencialidade, incidente, eliminação, auditoria, suboperadores e assistência aos direitos.

## 4. Hipóteses legais por finalidade (não são aprovações)
Consultar a matriz em docs/MATRIZ-TRATAMENTOS-LGPD.md. Especialmente:
A. Cadastro: art. 7º V (execução de contrato) se houver relação contratual efetiva, ou art. 7º IX (legítimo interesse) apenas após teste pertinente; art. 7º II em obrigações comprovadas. Não atribuir automaticamente tudo a consentimento.
B. Scores e questionários vinculados ao atendimento: avaliar art. 11, II, f (tutela da saúde exclusivamente em procedimento de profissional, serviço ou autoridade de saúde); art. 11, II, a/d em atividades específicas, ou consentimento específico e destacado art. 11, I quando realmente aplicável. A base de tutela da saúde não autoriza uso secundário para treinamento de IA, publicidade ou prospecção comercial.
C. IA educacional: admitir somente conteúdo efetivamente anônimo/não pessoal enquanto não houver análise jurídica e contratual completa. Remover nome/CPF não torna um caso singular necessariamente anônimo.
D. Preferências e métricas: verificar necessidade, consentimento quando aplicável a rastreamento não essencial, legítimo interesse quando permitido, e mecanismos de oposição; não misturar com dado clínico sensível.
E. Pedidos de direitos: necessidade de registro e atendimento conforme deveres legais, minimização e proteção contra divulgação de identidade e respostas.

Art. 11 não contém legítimo interesse como hipótese autônoma para dados sensíveis. Cada etapa precisa ser documentada.

## 5. Direitos, transparência, encarregado e canal
A política publicada informa lacunas, mas não satisfaz plenamente os arts. 9º e 18 enquanto faltar identificação inequívoca do controlador e um canal público funcional também para pacientes não autenticados.
Se não houver dispensa válida, indicar encarregado conforme art. 41 e Resolução 18/2024, divulgar identidade e contato. Se houver qualificação aplicável como pequeno porte (Resolução 2/2022), documentar requisitos e manter canal público mesmo com dispensa de encarregado.
Criar processo de: protocolo, autenticação de identidade proporcional, identificação do controlador do registro, separação de pacientes por médico, análise de exceções, decisão motivada, resposta segura e rastreabilidade. Art. 19, II prevê até 15 dias para declaração completa, ressalvados prazos diferenciados normativamente aplicáveis. Informação simplificada deve ser disponibilizada imediatamente conforme art. 19, I. Não prometer exclusão imediata de registros assistenciais legalmente conservados.

## 6. Crianças e adolescentes
O art. 14 exige melhor interesse. Enunciado CD/ANPD 1/2023 admite fundamentos dos arts. 7º e 11 para crianças e adolescentes, observado o melhor interesse em cada caso. Não exigir consentimento dos pais de modo indiscriminado quando outra hipótese legal legítima e específica fundamente o tratamento, mas não dispensar avaliação, informação adequada, validação de representação quando cabível e minimização. Antes de disponibilizar questionários pediátricos, aprovar fluxo apropriado para responsáveis, com identificação de quem envia e quem pode consultar.

## 7. Prontuário e período de guarda
A Lei 13.787/2018, art. 6º, prevê período mínimo de 20 anos desde o último registro para descarte de prontuários, observadas exceções e regras de segurança e rastreabilidade. O Parecer CFM 19/2026 trata das condições para descarte após esse período. Scores isolados armazenados no Hub não devem ser automaticamente qualificados como prontuário oficial; a classificação depende do uso assistencial efetivo, do registro e das obrigações do serviço. Se integrarem o prontuário, avaliar obrigação de guarda, autenticidade, integridade, histórico e disponibilidade. Se forem dados temporários de apoio, justificar retenção mínima própria. Não aplicar 20 anos indiscriminadamente a cookies, contas, logs ou preferências.

## 8. Incidente anterior: qualificação documental urgente
Objeto: eventual exposição pretérita por permissões de leitura pública em tabelas clínicas; controle atualmente restringido.
O controlador deve registrar quando tomou conhecimento, intervalo da configuração, tabelas e categorias de dados, possibilidade de leitura identificável, logs de acesso Cloudflare/Supabase/PostgREST, volume de pessoas atingidas, controles compensatórios, uso indevido conhecido e avaliação de risco ou dano relevante. Preservar evidências com acesso restrito, jamais incluir registros de pacientes no repositório público.
A Resolução 15/2024 vincula comunicação à ANPD e titulares a incidente de segurança com risco ou dano relevante; prazo geral três dias úteis a partir do conhecimento do controlador de que o incidente afetou dados pessoais, ressalvadas regras legais, inclusive tratamento diferenciado eventualmente aplicável a pequenos agentes. Comunicar de forma preliminar e complementar quando cabível. Registro de incidente, inclusive não comunicado, por no mínimo cinco anos. Somente responsável legal ou encarregado autorizado pode protocolar e assinar comunicação; não emitir automaticamente comunicação sem apuração.
Este documento não afirma que ocorreu vazamento confirmado.

## 9. Transferência internacional e fornecedores
Mapear residência/região de dados, processamento remoto de backups/logs/prompts, transferência e acesso transfronteiriço, suboperadores, retenção, suporte e uso para treinamento. Verificar DPA vigente com Cloudflare, Supabase e provedores opcionais. Para transferências concretas, fundamentar art. 33 e Resolução 19/2024; se utilizados instrumentos contratuais, avaliar incorporação das cláusulas-padrão da ANPD e informações ao titular. Não assumir que datacenter no Brasil elimina todos os fluxos internacionais.

## 10. RIPD e segurança
Dados sensíveis e possível alcance de menores elevam a exposição; avaliar caso a caso critérios de alto risco da Resolução 2/2022 (critério geral e específico cumulativos para essa definição) e recomendação de RIPD da ANPD. Sugere-se RIPD preventivo com inventário, fluxo de dados, probabilidades, impactos, controles, responsáveis e risco residual. Controles de RLS são necessários, mas não suficientes: testes isolados de usuários, logs com acesso restrito, revisão de dependências, prevenção de XSS, minimização de localStorage, backups e testes de restauração, rotinas de expurgo, incidentes e resposta a titulares.

## 11. Matriz decisória — ação e responsável
P0 (antes de ampliar coleta clínica):
1. Identificar pessoa física/jurídica controladora do Hub, contatos e encarregado ou fundamentar dispensa; aprovar política e publicar canal institucional para pacientes não autenticados. Dono: administração jurídica.
2. Formalizar papéis Hub–médico–clínica/hospital e bases legais dos registros clínicos; restringir dados identificáveis sem formalização. Dono: jurídico + direção técnica.
3. Avaliar o histórico das antigas permissões públicas; preservar logs, elaborar registro de incidente e concluir parecer de comunicação. Dono: controlador + segurança + jurídico.
4. Proibir IA com dados clínicos reidentificáveis até avaliação dos termos de tratamento e transferência. Dono: produto + jurídico + segurança.
P1 (pré-liberação clínica geral):
5. Homologar fluxo pediátrico e informação a responsáveis; definir quando nome do paciente é exigido. Dono: direção técnica + jurídico.
6. Validar segregação entre dois profissionais, links de paciente, exclusão, exportação e logs, com evidências. Dono: segurança/engenharia.
7. Revisar contratos/DPA/suboperadores/transferências internacionais. Dono: administração + jurídico.
8. Aprovar registro de operações de tratamento, RIPD preliminar, política de retenção e governança de backup/restauração. Dono: controlador + tecnologia.
P2:
9. Capacitação de usuários, auditoria periódica, revisão de linguagem, revisão de IA e revisão da validade dos controles e contratos. Dono: operação + segurança.

## 12. Condições para conclusão e assinatura
Antes de emitir parecer jurídico conclusivo, anexar: contrato social ou identificação do titular da plataforma, prova de designação/dispensa e canal de titular, DPA de fornecedores, instrumentos com médicos/hospitais, inventário de dados atualizado, base legal assinada, relatório de risco de incidente, política de retenção, resultados de testes de segregação e RIPD aprovado.
Sem esses anexos, permanece o status “não validado integralmente”.

## 13. Fontes oficiais consultadas
- LGPD consolidada: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- Lei 13.787/2018: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13787.htm
- ANPD Resolução 2/2022: https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022
- ANPD comunicação de incidentes, Resolução 15/2024: https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis
- ANPD Resolução 19/2024: https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-19-de-23-de-agosto-de-2024
- ANPD Resolução 18/2024: https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/
- Enunciado ANPD 1/2023: https://bibliotecadigital.mj.gov.br/handle/1/10215
- Orientações de RIPD: https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/relatorio-de-impacto-a-protecao-de-dados-pessoais-ripd
- Parecer CFM 19/2026: https://portal.cfm.org.br/noticias/cfm-esclarece-regras-para-descarte-de-prontuarios-medicos-apos-20-anos
