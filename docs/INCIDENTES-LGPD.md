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
5. Comunicar: quando houver risco ou dano relevante, avaliar comunicação à ANPD e titulares nos prazos da Resolução CD/ANPD nº 15/2024; prazo geral de três dias úteis, ressalvadas exceções legais e regime aplicável.
6. Recuperar: corrigir vulnerabilidade, testar permissões por usuário, revalidar backups, acompanhar anomalias.
7. Documentar: manter registro do incidente, decisões, responsáveis, prazos, evidências e medidas corretivas pelo período exigido.

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
