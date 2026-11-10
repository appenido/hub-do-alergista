# Biblioteca de prompts — estado de standby (09/11/2026)

Estado atual: desativada para visitantes do Hub do Alergista.

- O botão “Prompts” foi retirado da Home.
- A página `page-prompts` está oculta por CSS e a função `navTo('prompts')` redireciona para a página inicial.
- Favoritos antigos do tipo Prompt não são exibidos, mas os dados permanecem no armazenamento local de cada usuário.
- Os modelos anteriores foram preservados em `docs/PROMPTS-ARQUIVO-ANTES-STANDBY.html`, além do histórico Git.
- Os demais recursos, incluindo artigos, guidelines, scores, imunobiológicos e notificações, não foram alterados.

## Proposta para futura reativação

Página com instrução em três passos: escolher modelo, completar campos entre colchetes e revisar antes de usar.

Três grupos: Relatórios, Consultas e Orientações. Dois modelos concisos por grupo (seis no total), com botão “Copiar modelo”. Criação de modelo próprio fica dentro de um bloco recolhível.

Antes de reativar: revisar as referências clínicas, realizar testes de cópia e favoritos, confirmar que a experiência não solicita ou armazena identificação de pacientes e conferir responsividade em dispositivos móveis e desktops.

A reativação exige uma decisão explícita: remover o bloqueio de CSS, restaurar a navegação e rever o filtro de favoritos.
