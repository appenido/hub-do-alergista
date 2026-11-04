# Matriz de operações de tratamento — Hub do Alergista
Data: 04/11/2026. Estado: minuta para validação pelo controlador e advogado; fundamentos são hipóteses a verificar, não autorização automática.

| Fluxo | Titular / categorias de dados | Finalidade legítima | Hipótese legal candidata | Provável controlador / demais agentes | Compartilhamento | Retenção | Pendência |
|---|---|---|---|---|---|---|---|
| Cadastro médico | Profissional: nome, e-mail, especialidade, CRM, RQE, endereço profissional | conta, acesso e personalização | Art. 7º V conforme contrato; 7º II em obrigação comprovada; 7º IX sob avaliação | Administrador jurídico do Hub a identificar / Supabase Auth | Supabase; Cloudflare no tráfego | definir ciclo de conta e obrigações | identidade/controlador, canal de contato, condições de uso e registro |
| Preferências e favoritos | Profissional: áreas de interesse e itens salvos | experiência de navegação | art. 7º V ou IX conforme vínculo e necessidade | Hub | cache do navegador; eventualmente terceiros | vincular à preferência, permitir exclusão | distinguir preferências de métricas de rastreio e cookies |
| Segurança operacional | Usuários e visitantes: IP, logs técnicos, eventos e tokens | segurança, antiabuso, investigação | art. 7º II e/ou IX conforme operação concreta | Hub/fornecedor, papéis por finalidade | Cloudflare/Supabase | documentar, minimizar e proteger | política, acesso, tempo, eventual transferência |
| Cálculo de escore sem identificação | Profissional usando dados não pessoais | cálculo educacional | LGPD não incide sobre dado efetivamente anônimo, ressalvada reidentificação | Hub | preferencialmente local | preferencialmente nenhuma persistência | confirmar se não resta identificador e se não há rastreamento |
| Score identificado no histórico | Paciente: nome, data, sintomas, score, detalhes clínicos | registro de apoio ao cuidado individual | art. 11 II f se procedimento assistencial; outras hipóteses específicas conforme caso | Médico/clínica/hospital possivelmente controlador; Hub precisa classificação contratual | Supabase, infra | depende se é prontuário ou registro transitório | termo controlador-operador, RIPD, guarda, acesso e exclusão |
| Formulários UCT, UAS7, SNOT-22 | Paciente: nome, data, respostas de saúde, token de sessão | questionário enviado pelo profissional | art. 11 II f em procedimento assistencial; se consentimento for fundamento, art. 11 I exige especificidade/destaque | Médico/clínica/hospital e eventualmente Hub, conforme fatos | Supabase, paciente, profissional titular | expiração de sessão não exclui dado; definir descarte | transparência pré-coleta, pediatria, direitos, retenção |
| Histórico clínico local no navegador | Paciente: nome e dados de infusão, vacinação, scores | apoio local ao profissional | mesmo fundamento da finalidade assistencial, quando identificável | Profissional/clínica e eventualmente Hub conforme tratamento | dispositivo do profissional, backup se houver | determinar expurgo e uso de dispositivo | armazenamento em claro, exportação, indisponibilidade e perda |
| IA do Hub (Gemini) | Pergunta do usuário e, indevidamente, dados clínicos que ela possa conter | assistência educacional | dados anônimos; se pessoais, fundamento específico art. 7º ou 11 e transferências art. 33 | Hub, profissional e fornecedor, conforme regras contratuais | Google e infraestrutura Cloudflare; eventual processamento no exterior | política do fornecedor a verificar | consentimento não presumido, DPA, treinamento/retenção, bloqueio de identificáveis |
| IA externa configurada pelo usuário | Prompt, dados potencialmente pessoais, credenciais | ferramenta opcional | a verificar para cada provedor, inclusive art. 11 se sensível | pode haver controlador independente ou operador, conforme contrato | provedor escolhido | contrato/política específica | termos de tratamento e transferência; não armazenar segredos persistentemente |
| Pedidos LGPD | Usuário: ID, espécie de pedido, status; contato quando aplicável | atender direitos, comprovar prestação de contas | art. 7º II e obrigações correlatas, conforme operação | controlador do Hub ou controlador do atendimento, a definir | equipe autorizada | prazo compatível com obrigação de prestação de contas | canal externo para pacientes, prazos, autenticação, processo de resposta |
| Dados de criança/adolescente | Dados sensíveis pediátricos e dados do responsável quando necessários | cuidado e acompanhamento | hipótese art. 11 pertinente, com art. 14 e Enunciado ANPD 1/2023 | instituição/profissional responsável e papel do Hub a qualificar | fornecedores autorizados | conforme classificação assistencial | análise documentada do melhor interesse, representação, linguagem acessível |
| Incidentes e investigação | logs, categorias de dados e evidências mínimas | segurança e conformidade | base compatível com dever legal/regulatório e prevenção | controlador, apoio de operadores | equipe de segurança, autoridade se obrigatório | registro de incidentes no mínimo cinco anos | responsável, data de ciência, evidências e decisão de comunicação |

## Regras de preenchimento e aprovação
1. Identificar controladores por pessoa jurídica/física real, não por nome comercial ou domínio.
2. Registrar base legal por tratamento, inclusive cada finalidade secundária; não reutilizar art. 11 II f para marketing, análise comercial ou treinamento externo.
3. Dados sensíveis: não usar legítimo interesse do art. 7º IX como hipótese autônoma; conferir rol do art. 11.
4. Documentar meios técnicos, contratos, operadores/suboperadores, região dos dados e acesso internacional.
5. Definir retenção por categoria e justificativa; a regra de 20 anos refere-se a prontuários, não a todo dado do Hub.
6. Documentar vínculo entre profissional e paciente, perfil autorizado e autorização institucional quando aplicável.
7. Disponibilizar identificação do controlador, canal público acessível ao titular e processo de atendimento.
8. Só alterar status para 'aprovado' após assinatura do controlador e validação jurídica.

## Referências
LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
ANPD agentes de tratamento: https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-para-definicoes-dos-agentes-de-tratamento-de-dados-pessoais-e-do-encarregado
Enunciado ANPD 1/2023: https://bibliotecadigital.mj.gov.br/handle/1/10215
Lei 13.787/2018: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13787.htm
