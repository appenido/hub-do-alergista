# RIPD preliminar — Hub do Alergista
Data da elaboração: 04/11/2026
Classificação: minuta técnica de avaliação de impacto, sem aprovação ou assinatura do controlador.
Base: LGPD arts. 5º XVII, 6º, 11, 14, 38, 46, 48 e 50; orientações ANPD de RIPD.

## 1. Tratamentos avaliados
Cadastro profissional e preferências; registros de scores identificados; respostas de pacientes nos formulários SNOT-22, UCT, UAS7; registros clínicos locais; integração com prestadores de IA. Controlador, operadores e contrato jurídico por finalidade: não comprovados; bloqueio de aprovação.

## 2. Necessidade e proporcionalidade
- Para calcular escores, nome completo não é tecnicamente necessário. Persistência nominal somente quando houver finalidade clínica específica e base legal válida.
- Não coletar CPF, CNS, telefone, endereço, prontuário e detalhes não essenciais nos formulários, salvo justificativa assistencial formalizada.
- Dados pediátricos exigem avaliação e documentação de melhor interesse; registrar condição/representação se necessária, sem coleta excessiva.
- Dados usados para ensino de IA devem ser efetivamente anônimos. A presença de um caso raro e combinação de atributos clínicos pode reidentificar paciente, mesmo sem nome.

## 3. Riscos identificados
Escala qualitativa: probabilidade (baixa/média/alta), impacto (moderado/alto/muito alto), nível residual após controles descritos, ainda não testados independentemente.

| ID | Cenário | Risco inerente | Controles já identificados | Risco residual/pendência |
|---|---|---|---|---|
| R01 | Acesso de outro profissional a histórico de paciente | muito alto | Supabase Auth, sessões e funções vinculadas a proprietário, políticas RLS | alto até teste com contas distintas e negativa confirmada |
| R02 | Exposição de dados por links de questionário | alto | IDs aleatórios, prazo e validação de sessão | médio/alto conforme compartilhamento do link e expiração real |
| R03 | Exposição prévia decorrente de permissões públicas antigas | muito alto | permissões de leitura revogadas | alto até análise de logs e qualificação de incidente |
| R04 | Reidentificação no envio de prompt a IA externa | muito alto | avisos e filtros textuais | alto: filtros por regex não demonstram anonimização |
| R05 | Perda de dispositivo com histórico local de saúde | alto | exportação/limpeza disponível parcialmente | alto: persistência local pode estar em claro |
| R06 | Coleta de dados pediátricos sem fluxo de representação | alto | nenhum procedimento completo demonstrado | alto: não liberar fluxo pediátrico identificado sem validação |
| R07 | Pedidos de pacientes sem canal direto institucional | alto | pedidos autenticados para usuários do Hub | alto: não há encaminhamento formal externo e SLA validado |
| R08 | Retenção indefinida de dados clínicos e backups | alto | expiração de tokens de questionário | alto: link expirar não elimina banco; falta calendário de retenção |
| R09 | Uso de terceiro sem mecanismo documentado de transferência | alto | política informa existência de fornecedores | alto: faltam contratos, DPA e documentação de transferência |
| R10 | Contas profissionais e credenciais expostas por XSS/terceiros | alto | alguns headers/validações e armazenamento de sessão | médio/alto: requer CSP mais estrita, testes e SRI/revisão de dependências |

## 4. Fluxos e ciclo de vida
Coleta: formulário Web/QR ou cadastro; transporte: HTTPS; armazenamento: Supabase e navegador local; acesso: usuário autenticado ou link aleatório sob política do questionário; compartilhamento: infraestrutura Cloudflare/Supabase e provedores de IA para prompts; término: sem procedimento consolidado e assinado para todas as classes.
As transferências internacionais e suboperadores devem ser mapeados por contrato e região, não inferidos apenas pela região do banco.

## 5. Medidas propostas e critérios de aceite
1. Definição de controladores e operadores, contatos e instruções contratuais aprovadas.
2. Testes negativos de leitura, gravação e exclusão cruzada por dois médicos e usuários anônimos, com dados sintéticos; anexar logs e evidências.
3. Fluxo de resposta a pacientes e responsáveis com canal próprio, encaminhamento, verificação de identidade e protocolo.
4. Readequação dos formulários de menores e transparência pré-coleta conforme art. 14.
5. Plano de backup/retenção por classe de dados, justificativa para guarda assistencial e rotina de expurgo verificável.
6. Bloqueio de dados sensíveis identificáveis em IA até análise contratual e, quando pertinente, transferência internacional.
7. Apuração documentada do risco do acesso público antigo e decisão formal sobre comunicação.
8. Lista e assinatura dos responsáveis pelo risco e pela revisão periódica.

## 6. Registro de aceite de risco
Controlador: não indicado.
Responsável técnico: não indicado.
Encarregado / dispensa: não comprovado.
Assessoria jurídica: não assinou.
Risco residual aceito? Não.
Liberação clínica irrestrita? Não recomendada.
Próxima reavaliação: após inclusão de contratos, canal de titulares e evidências de testes; revisão após qualquer mudança material no tratamento.

## 7. Referências
https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/relatorio-de-impacto-a-protecao-de-dados-pessoais-ripd
https://www.gov.br/anpd/pt-br/acesso-a-informacao/institucional/atos-normativos/regulamentacoes_anpd/resolucao-cd-anpd-no-2-de-27-de-janeiro-de-2022
