# Plano de resposta a incidentes de dados pessoais — Hub do Alergista
Versão inicial 04/11/2026. O responsável legal deve aprovar e designar equipe, canal e substitutos.

## Identificação
Incidente inclui acesso indevido, exposição pública, perda, alteração, indisponibilidade ou compartilhamento indevido de dados pessoais (incluindo escores e questionários clínicos).
Registrar hora da detecção e hora em que o controlador tomou conhecimento. Não publicar identificadores de pacientes em GitHub Issues, capturas públicas, logs ou mensagens compartilhadas.

## Fluxo
1. Identificar: registrar data/hora, fonte, sistema, dados potencialmente afetados, responsáveis e evidências mínimas.
2. Conter: revogar chaves ou sessões comprometidas, restringir políticas de acesso, bloquear rotas exploradas, preservar logs de forma segura. Manter continuidade assistencial quando necessário.
3. Investigar: determinar vetor, período de exposição, operações de leitura/escrita, identificação aproximada de titulares, terceiros e possibilidade de cópia.
4. Qualificar risco: avaliar volume, categoria, sensibilidade, idade dos titulares, potencial de discriminação, sigilo profissional, segurança da identidade e extensão da exposição.
5. Comunicar: avaliar se há risco ou dano relevante nos termos do art. 5º da Resolução CD/ANPD nº 15/2024; prazo geral de três dias úteis contados do conhecimento pelo controlador de que o incidente afetou dados pessoais, ressalvadas regras específicas e regimes diferenciados efetivamente aplicáveis. A mera vulnerabilidade não prova acesso indevido; a ausência de prova não dispensa investigação.
6. Recuperar: corrigir vulnerabilidade, testar permissões por usuário, revalidar backups, acompanhar anomalias.
7. Documentar: manter registro do incidente, inclusive quando não comunicado, pelo prazo mínimo de cinco anos após o registro (art. 10 da Resolução CD/ANPD nº 15/2024), ressalvadas obrigações legais de guarda por prazo maior. Registrar motivos de eventual não comunicação.

## Apuração específica das permissões públicas anteriores
A auditoria técnica identificou que tabelas de questionários clínicos permitiam leitura pública direta em configuração anterior, depois restringida. Essa constatação constitui sinal de risco de exposição e exige avaliação de incidentes pelo controlador. Determinar a janela de exposição, logs e capacidade efetiva de consulta, categorias e quantidade de dados, possibilidade de identificação, medidas de mitigação e critérios de comunicação. Preservar evidências em local restrito, sem inserir nomes ou dados clínicos em repositório público. Não declarar que houve vazamento sem evidência.

## Situações de acionamento imediato
- SQL/RPC anônimo retornando nomes e respostas de pacientes.
- Consulta de scores com email arbitrário ou outro ID de usuário.
- Chave secreta ou service_role em código público.
- Recebimento de informações identificáveis em chatbot de IA externo sem base legal/controle.
- Exposição de exportação de dados de um usuário a outro.
- Links de sessões com tokens adivinháveis ou passíveis de enumeração.

## Modelo de registro
Protocolo: [gerar ID interno]
Identificado em (data/hora): [preencher]
Conhecimento do controlador: [preencher]
Sistemas: [preencher]
Natureza dos dados: [preencher]
Possíveis titulares afetados: [número aproximado, sem publicar nomes]
Medidas de contenção: [preencher]
Risco ou dano relevante: [avaliação e evidências]
Necessidade/prazo da comunicação: [parecer]
Comunicação enviada a: [ANPD/titulares; data]
Causa-raiz e prevenção de recorrência: [preencher]
Encerramento e responsável: [preencher]

## Pendências organizacionais
- Nomear o responsável pelo incidente, contato de emergência e substituto.
- Definir acesso aos logs dos fornecedores e fluxo contratual de alerta.
- Simular uma ocorrência e testar o prazo de comunicação.
- Formalizar critérios de escalonamento jurídico e médico.

Referência: https://www.gov.br/anpd/pt-br/canais_atendimento/agente-de-tratamento/comunicado-de-incidente-de-seguranca-cis
