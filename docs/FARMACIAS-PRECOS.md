# Consulta regional de farmácias e preços

Entrada: cifrão discreto ao lado dos nomes em Terapias Alvo e Anti-histamínicos.
A expansão ocorre no próprio card, sem mudar a ordem das fichas.

Localização: cidade/UF aproximadas pelo cabeçalho geográfico da Cloudflare Pages,
sem coletar GPS. A pessoa pode escolher outra cidade/UF; a preferência permanece
somente na sessão do navegador. A relação de redes é uma sugestão regional e os
links para mapas verificam a existência de unidades reais.

Preços de varejo: somente ofertas do feed licenciado, identificadas pela apresentação
e, quando houver, pelo EAN. Sem fonte ativa, não inventar números e disponibilizar
acesso aos comparadores Bula e Busca Remédios Brasil. A tabela CMED informa
teto regulatório (PMC), não preços praticados no balcão.

Configuração Cloudflare Pages:
- HUB_PRECOS_API_URL: endereço HTTPS do endpoint de catálogo contratado, que aceite POST
  com JSON { medication, city, uf } e Authorization: Bearer ...
- HUB_PRECOS_API_KEY: credencial secreta do catálogo.
- Resposta de exemplo:
  {"provider":"Nome do fornecedor","offers":[{"pharmacy":"Rede","presentation":"Produto 10 mg, 30 comprimidos","ean":"7891234567890","price":34.90,"verified":true,"updatedAt":"2026-11-14T14:00:00-03:00","url":"https://farmacia.exemplo.br/produto"}]}
O fornecedor deve disponibilizar preço real de varejo com autorização de uso, data de
atualização e URL verificável; não aceitar valor calculado pelo PMC. Os preços e estoques
precisam de confirmação no checkout. Verificar requisitos da LGPD para contratos de dados.

Antes de liberar os preços, testar apresentações distintas, medicamentos hospitalares,
produtos sem oferta, CEP sem rede, indisponibilidade do feed, mobile e desktop.

## Farmácias próximas: implementação 14/11/2026

- O cifrão também aparece nas fichas da aba Medicamentos; ao clicar,
  abre a área de preços no mesmo cartão, mantendo o cartão em expansão.
- A área "Mais perto de você" lista estabelecimentos identificados por
  coordenadas, ordenados por distância geográfica em linha reta. O visitante
  pode autorizar o GPS uma única vez durante a sessão, sem persistência do
  GPS. Sem autorização, usa coordenadas aproximadas da Cloudflare quando
  a cidade identificada corresponde à cidade exibida; caso contrário,
  disponibiliza pesquisa no Google Maps.
- `GOOGLE_MAPS_PLACES_API_KEY` é opcional para usar a Places API Nearby New
  (requer habilitação, chave e faturamento na Google Cloud). Sem chave,
  a API consulta OpenStreetMap/Overpass com cache aproximado para reduzir
  a carga. Atribuição OpenStreetMap deve permanecer visível.
- O usuário pode abrir Google Maps para cada filial e Google Search com
  medicamento + farmácia + cidade. Resultado de busca NÃO é dado de preço
  de loja, e nenhum preço numérico é inferido do texto da busca.
- O feed do fornecedor só atribui preço à filial quando informa
  `storeLat`, `storeLon`, nome da rede e `updatedAt` atualizado nas últimas
  24 horas, com proximidade da filial de até 180 metros. Ofertas sem filial
  validada não devem ser apresentadas como preço da farmácia mais próxima.
- O endpoint de preços também admite `storeId`, `storeAddress` e EAN. Produto
  com igual princípio ativo mas concentração/quantidade diferente não deve
  ser anunciado como a mesma apresentação.
- Google Custom Search JSON API foi encerrada para novos clientes e tem
  data de descontinuação prevista para 01/01/2027. Não depender de scraping
  de páginas ou trechos de resultados do Google para calcular preços.
- Testar com fornecedor de preço local real antes de prometer valores
  numéricos; sem feed, a interface sinaliza "Preço nesta unidade: não
  confirmado" e oferece pesquisa no Google.

Fontes de documentação:
- https://developers.google.com/maps/documentation/places/web-service/nearby-search
- https://developers.google.com/custom-search/v1/overview
- https://wiki.openstreetmap.org/wiki/Overpass_API
