# Auditoria com rastreabilidade — 21/11/2026

Relatório técnico parcial. Não certifica segurança, conformidade LGPD ou adequação clínica. Não contém identificadores de pacientes.

## Datas independentes
- Consulta ao banco e ao GitHub: 21/11/2026; diagnósticos Supabase observados às 04h09min03s (Brasília). Leitura das fichas ocorreu nesta execução; horário por ficha não registrado.
- Última revisão clínica integral comprovada por ficha: NÃO ESTABELECIDA. As datas históricas exibidas no aplicativo não provam validação documental integral.
- Data de publicação da evidência: conservar somente o que tiver sido confirmado na fonte primária, sem substituir pela data da auditoria.

## Fichas de Terapias Alvo
Datas históricas indicadas apenas como conteúdo exibido no código, não como revisão comprovada.

| Ficha | Datas históricas exibidas em 2026 | Última revisão clínica integral comprovada | Pendências |
|---|---|---|---|
| Dupilumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Omalizumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Mepolizumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Benralizumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Tezepelumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Upadacitinibe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Abrocitinibe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Tralokinumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Lebriquizumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Nemolizumabe | 13/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Midostaurina | 04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Depemoquimabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Lanadelumabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |
| Garadacimabe | 02/10;04/11 | NÃO ESTABELECIDA | PENDENTE: bula brasileira vigente; ANVISA; DUT/Rol ANS; PCDT/CONITEC; doses por indicação/idade/peso; contraindicações; monitorização; vacinas e SUS/ANS |

## Fontes primárias oficiais consultadas
- ANVISA, comunicado sobre depemoquimabe Densurko, publicado em 11/05/2026: https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/anvisa-autoriza-novo-medicamento-biologico-para-doencas-respiratorias. Não equivale a validação da bula.
- ANVISA, descrição do registro de garadacimabe Andembry, publicada em 11/03/2026: https://www.gov.br/anvisa/pt-br/assuntos/medicamentos/novos-medicamentos-e-indicacoes/andembry-r-garadacimabe.
- Ministério da Saúde/CONITEC, lista de PCDT: asma, portaria publicada em 02/04/2026 e anexo alterado em 04/09/2026: https://www.gov.br/conitec/pt-br/assuntos/avaliacao-de-tecnologias-em-saude/protocolos-clinicos-e-diretrizes-terapeuticas/pcdt.
- ANS, atualização de DUTs aprovada em 30/01/2026: https://www.gov.br/ans/pt-br/assuntos/noticias/beneficiario/ans-aprova-novas-tecnologias-para-integrarem-o-rol.
- Para as outras 12 fichas não foi validada individualmente uma nova data de publicação de evidência nem sua correspondência com bula/DUT.

## Segurança e LGPD — consultado diretamente
- Central-penido: 17 funções SECURITY DEFINER invocáveis por anon; 18 por authenticated; 15 tabelas RLS sem políticas; 2 funções com search_path modificável.
- Producao-ceai: 1 função privilegiada por anon e 34 por authenticated. Contagens de alertas não significam exploração comprovada.
- UAS7: tabelas com RLS e sem grants SELECT anon/auth; chaves aleatórias de 256 bits, diferentes para profissional e paciente, armazenadas apenas como hashes SHA-256; exigência de consentimento no primeiro registro e exclusão em cascata.
- Pendências: criação de acompanhamento sem login, ausência de rate limit verificável, leitura profissional por chave portadora, retenção sem prazo final definido, falta de controlador e canal institucional documentados. Expiração do link de 45 dias não é exclusão do dado.
- Não foram acessados pacientes nem aplicadas alterações de permissões em banco compartilhado.

## Alterações e verificações reais
- Coletor AlergoNews: concorrência máxima 3, retentativa gradual após 429/5xx e preservação da lista verificada em falha; workflow 21/11 passou, radar atualizado às 04h13 com 2 verificadas, 4 pendentes e 0 falhas de fonte. Cobertura ainda baixa.
- Quatro publicações sobre angioedema hereditário (PMID 42990719, 42165046, 41606636 e 35497649) movidas para categoria aeh, com filtro próprio e cache isolado. Data verifiedAt da biblioteca mantida em 09/11/2026.
- Suíte de estabilidade: 126 testes aprovados na versão após atualização dos testes; auditoria estática de privacidade aprovada. NÃO comprovam proteção clínica/LGPD completa nem navegação visual.
- UpToDate: checkedAt 14/11/2026, sourceUpdatedAt 06/10/2026; atualização editorial não confirmada. Não alterar data de revisão clínica.
- Testes reais de clique, responsividade, leitor de tela e links de todos os artigos não concluídos por falta de navegador interativo nesta execução.
- Radares regulatórios ANVISA, ANS, CONITEC, DOU: atos individualizados e links não verificados. Calculadoras e 14 fichas: validação clínica completa PENDENTE.

## Intervenções ainda necessárias
1. Validar autorizações internas das RPCs com testes negativos de acesso em homologação antes de alterar permissões do sistema compartilhado.
2. Formalizar identificação jurídica do controlador, canal de solicitações e política de retenção/exclusão; revisar acesso profissional ao UAS7.
3. Confrontar posologia, contraindicações e cobertura de cada ficha com bulas vigentes e atos oficiais.
4. Aumentar diversidade editorial do radar mantendo verificação de URL, fonte, data e acontecimento.
5. Executar revisão científica individual dos Protocolos de bolso, vacinas, IgE, imunoglobulinas e testes reais de acessibilidade.
