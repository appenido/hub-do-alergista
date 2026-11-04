# Relatório de Impacto à Proteção de Dados (RIPD) — versão de trabalho
Emissão: 04/11/2026. Documento preliminar, dependente de validação jurídica, contratual e operacional.

## Escopo
Plataforma web para apoio educacional e clínico a profissionais, com cadastro e personalização; biblioteca de diretrizes, IA; cálculo e histórico de escores ACT, UCT, UAS7, SNOT-22 etc.; coleta por links temporários para pacientes.

## Necessidade e proporcionalidade
- Dados profissionais para autenticação, perfil e personalização.
- Dados clínicos identificáveis são sensíveis; quando possível usar identificador interno e minimizar dados.
- O fluxo de IA deve excluir identificadores, mas a filtragem automática não garante anonimização.
- Questionários com nome facultativo informam a finalidade antes do envio.
- Evitar duplicação, armazenamento local permanente e identificadores em serviços de terceiros.

## Agentes e responsabilidades
Controlador do cadastro e agentes responsáveis pelos dados dos pacientes precisam ser formalmente identificados. Fornecedores: Cloudflare, Supabase e serviços de IA selecionados pelo usuário. Contratos, suboperadores e transferências internacionais estão sujeitos a validação.

## Bases legais
Formalizar fundamento dos arts. 7º e 11 da LGPD por finalidade. Não presumir consentimento ou tutela da saúde indiscriminadamente. Considerar sigilo profissional e normas setoriais.

## Riscos e mitigações
| Risco | Severidade inicial | Mitigação implementada |
|---|---|---|
| Leitura pública dos resultados SNOT/UCT | Crítica | Remoção da leitura direta anônima |
| Histórico de escores acessível por email arbitrário | Crítica | Autorização via auth.uid e identidade real no banco |
| Tokens previsíveis a partir da data | Alta | Identificador aleatório criado no banco |
| Login local com hash inadequado | Alta | Remoção do login local |
| Envio de identificadores para IA | Alta | Aviso, checagem servidor e finalidade educacional |
| XSS com nomes em HTML | Alta | Escapamento de nomes; refatoração adicional pendente |
| Armazenamento persistente de credenciais | Alta | Sessões e chaves em armazenamento temporário |
| Retenção e contratos indefinidos | Alta | Inventário inicial; decisões jurídicas pendentes |

## Riscos residuais
1. SessionStorage é acessível a JavaScript; CSP rigorosa e refatoração dos scripts inline ainda necessárias.
2. Quem possui link UAS7 válido pode consultar respostas; o link constitui credencial temporária.
3. Filtros de conteúdo não detectam todos os identificadores e não garantem anonimização.
4. Retenção e responsabilidades clínicas ainda precisam de avaliação formal.
5. O Supabase é compartilhado; funções de outros módulos requerem auditoria separada.
6. Os registros históricos de questionários sem associação verificável ao médico não devem ser reatribuídos automaticamente.
7. Faltam validação do domínio Cloudflare em navegador real, testes multicliente, análise de dependências, contratos e canal externo de titulares.

## Testes exigidos
- Com duas contas distintas, provar isolamento de scores e impossibilidade de editar dados do outro usuário.
- Anonimato: provar 401/403 nas RPCs de histórico.
- Criar SNOT-22, UCT e UAS7; responder por link anônimo; conferir autor, expiração e única associação ao médico.
- Reutilizar link expirado e tentar manipular token com valores de data.
- Confirmar que não há chave de IA, senha ou refresh token em localStorage.
- Verificar XSS, cabeçalhos HTTP, logs, restauração de backup e operações com dados sensíveis.
- Revalidar a versão publicada do Cloudflare Pages.
- Exigir aprovação formal do controlador, segurança e jurídico.

## Responsáveis e aprovação
Controlador: a identificar.
Encarregado ou contato externo: a designar conforme regime aplicável.
Retenção e exclusão: a definir por finalidade e obrigação legal.
Contratos de operadores: análise pendente.
Data e assinatura de aprovação: pendentes.

Este documento não constitui atestado de conformidade nem RIPD final.
