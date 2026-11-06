# Padrão obrigatório de interação — abrir conteúdo no local

Aplicável a todas as seções do Hub do Alergista (web, PWA Android/iOS e telas responsivas).

## Regra
Ao tocar/clicar em um cartão, título, comentário, referência interna ou outra ação para **revelar conteúdo da mesma página**, apresentar o texto no próprio cartão ou em painel imediatamente abaixo da linha visual em que ele está. É proibido mandar o usuário para o fim da tela, deslocar o foco, ou usar rolagem automática só para mostrar o conteúdo expandido. O cartão acionado deve permanecer visível na mesma região e poder ser fechado ali, por toque no próprio cartão ou em botão "Fechar". Preservar foco, sem rolagem involuntária, e expor estado por aria-expanded/aria-controls.

## Padrão de grade
Quando cards formam uma grade horizontal (biológicos, vacinas, protocolos), inserir o painel após o último card da linha selecionada e ocupar a largura total da grade. Não deslocar o usuário até uma lista de detalhes ao final da página.

## Tabelas e cálculos
Notas de rodapé acionadas em tabelas devem aparecer junto à respectiva linha (e serem acessíveis por teclado). Resultados de calculadoras devem surgir junto ao formulário ou ação que os gerou. Evitar scrollIntoView e scrollTo nesses fluxos.

## Exceções necessárias
Navegação explícita para outra seção, seleção de um resultado de busca (que precisa localizar o item de destino), links externos, e rolagem dentro de chat/listas são operações diferentes de uma expansão e podem rolar intencionalmente. Não quebrar a navegação, o histórico, a busca nem a acessibilidade para evitar tais operações.

## Controle
Manter teste automatizado em tests/expansao-local.test.mjs. Toda nova interface expansível deve seguir esta regra e receber cobertura de regressão quando possível.
