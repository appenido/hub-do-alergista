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
