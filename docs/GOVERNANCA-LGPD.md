# Governança de dados — Hub do Alergista
Versão: 04/11/2026. Documento operacional inicial. Não constitui certificado de conformidade.

## 1. Escopo técnico
Aplicativo Web/PWA: hubdoalergista.pages.dev. Fonte: GitHub appenido/hub-do-alergista.
Hospedagem: Cloudflare Pages/Functions. Dados de autenticação e questionários: Supabase (projeto central-penido; região sa-east-1).
O Supabase é compartilhado com outras aplicações; toda mudança precisa ser limitada ao escopo do Hub.

## 2. Inventário preliminar de operações de tratamento
| Operação | Dados pessoais | Finalidade | Agentes / acesso | Base legal e retenção |
|---|---|---|---|---|
| Conta de profissional | nome, e-mail, categoria, especialidade, CRM, RQE, endereço opcional | identificação, acesso e personalização | operador da plataforma, fornecedor de autenticação | a definir por finalidade; retenção a validar |
| Interesses e preferências | temas, favoritos e configurações | personalização | próprio usuário / sistema | avaliar fundamento; minimizar localStorage |
| Escores clínicos | nome de paciente, data, índices e respostas | documentação de apoio para profissional responsável | somente profissional autorizado | dados sensíveis: documentar hipótese do art. 11 LGPD; avaliar obrigação de guarda |
| SNOT-22, UCT, UAS7 | nome facultativo, respostas, data, sessão | coleta de questionários | link temporário do paciente e profissional que gerou sessão | base legal e conservação a definir com controlador |
| Assistente IA | pergunta e contexto enviados | apoio educacional | Cloudflare e serviço externo selecionado (Gemini, OpenAI etc.) | bloquear identificadores, avaliar contratos e transferência internacional |
| Solicitações de privacidade | ID do titular, tipo de pedido, data, status | exercício de direitos | usuário e administradores autorizados | registro por obrigação legal/legítima prestação de contas; prazo a definir |
| Segurança e operação | IP, logs técnicos e token de sessão em trânsito | segurança, disponibilidade e prevenção de abuso | fornecedores de infraestrutura | tratamento mínimo, prazos do fornecedor a revisar |

## 3. Medidas já aplicadas
- Login com Supabase Auth; fallback inseguro com hash local removido.
- Token de autenticação mantido em sessionStorage, metadados de UI isolados, expiração validada pelo JWT e renovação por refresh token.
- Funções score_* usam auth.uid() e correspondência do e-mail real do Auth, não apenas e-mail fornecido pelo cliente.
- Tabelas de resultados sensíveis não têm concessões de leitura/escrita direta a usuários anônimos.
- SNOT-22, UCT e UAS7 usam sessão de alto entropia gerada no banco após login do profissional.
- SNOT-22 e UCT: consulta do resultado somente pelo profissional que abriu a sessão.
- UAS7: acesso por token temporário no link do paciente durante até 21 dias. O token equivale a credencial; compartilhamento permite acesso.
- Chaves pessoais de IA migradas de localStorage para sessionStorage.
- Página de privacidade, avisos, solicitação de direitos e exportação autenticada.
- Cabeçalhos de referência reduzida, antienquadramento e cache restrito nas páginas clínicas.
- Aviso/checagem de identificadores antes de consultar IA, com validação adicional no servidor.

## 4. Riscos residuais e dependências
1. Ausência de identificação formal/publicada do controlador, encarregado ou canal externo; precisa ser preenchida por responsável legal.
2. Evidência contratual: revisar DPAs, suboperadores e mecanismos de transferência internacional para Cloudflare, Supabase, Google e provedores opcionais.
3. O sistema não se declara prontuário eletrônico certificado. É necessário avaliar regulamentação profissional, retenção assistencial, uso de dados clínicos e segregação por clínica.
4. Histórico legado SNOT-22 anterior às sessões seguras permanece preservado, mas não deve ser automaticamente vinculado a outro usuário sem prova de titularidade.
5. O projeto Supabase tem funções SECURITY DEFINER usadas por outros módulos; auditar individualmente antes de restringir para não interromper serviços de terceiros.
6. A detecção textual de dados identificáveis em prompts de IA é incompleta; o fluxo deve permanecer exclusivamente educacional até análise jurídica/contratual.
7. Integrações de IA e scripts de terceiros requerem revisão de supply chain, eventuais transferências internacionais e configuração de Content Security Policy sem uso amplo de inline scripts.
8. Sessões em sessionStorage não são cookies HttpOnly. Endurecimento definitivo demanda backend de sessão ou refatoração JS para evitar XSS.
9. A plataforma precisa de rotinas documentadas de backup, restauro, revisão periódica de acessos e expurgo conforme retenção.
10. Testes funcionais em navegador real, com duas contas distintas e pacientes de teste, são necessários antes de atestar isolamento multitenant.

## 5. Matriz de responsabilidades (atribuições a confirmar)
- Controlador de cadastro do Hub: identificar razão social/nome, CNPJ/CPF cabível, endereço e contato público.
- Controlador dos registros clínicos: esclarecer a relação contratual com profissional/estabelecimento.
- Operadores: qualificar e contratar fornecedores, definir localização e suboperadores.
- Encarregado/canal: indicar responsável ou justificar regime legal aplicável; criar contato direto para pacientes e usuários.
- Segurança: responsável pela revisão de permissões, chaves, backups, incidentes e manutenção.
- Atendimento de direitos: responsável por registro, classificação, comprovação de identidade, resposta e retenção do protocolo.

## 6. Política de retenção — deliberação obrigatória
Não fixar prazos arbitrários para prontuários e documentos de saúde. Aprovar separadamente:
- Conta: permanência, exclusão e exceções legais.
- Logs: finalidade, prazo e acesso.
- Dados clínicos: classificação como documento assistencial ou apoio educativo e normas de guarda aplicáveis.
- Sessões: links expiram em 48h (SNOT-22/UCT) ou 21d (UAS7). Expiração não apaga respostas.
- Pedidos LGPD: prazo e comprovação de resposta.
- Backups: ciclos de retenção, criptografia e procedimento de eliminação/isolamento.

## 7. Rotina operacional
Semanalmente: revisar eventos de acesso, vulnerabilidades de dependências e alertas de infraestrutura.
Mensalmente: testar acesso cruzado com duas contas, recuperação de backups, revogação de sessão e resposta a pedidos.
A cada modificação: revisar se novos campos exigem mudança no aviso, hipótese legal, logs, contratos, retenção e RIPD.
Em incidente: seguir o plano em INCIDENTES-LGPD.md e avaliar comunicação conforme Resolução CD/ANPD nº 15/2024.

Fontes principais:
- LGPD: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD: https://www.gov.br/anpd/
- Segurança Supabase: https://supabase.com/docs/guides/api/securing-your-api
