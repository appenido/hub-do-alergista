# Consulta de CRM — integração com o webservice do CFM

## Como funciona

O módulo **Consultar CRM** tem dois estados, decididos pelo servidor:

| Estado | Condição | O que o visitante vê |
|---|---|---|
| Sem integração | variável `CFM_CHAVE` ausente | Cartão com o texto "Consulte o registro e as especialidades de um médico na busca oficial do CFM." e o botão **Consultar no CFM**, que abre `https://portal.cfm.org.br/busca-medicos` em nova aba (`rel="noopener noreferrer"`). Nenhum formulário que aparente estar conectado ao CFM. |
| Com integração | `CFM_CHAVE` definida | Campos **Número do CRM** e **UF**, botão **Consultar médico**, resultado exibido na própria tela. |

A tela chama `/crm?crm=0&uf=` ao abrir. Resposta `501 NAO_CONFIGURADO` ⇒ modo sem integração.

## Backend

`functions/crm.js` (Cloudflare Pages Function), rota `GET /crm?crm=<numero>&uf=<UF>`.

- Operação **Consultar** do webservice oficial, SOAP 1.1 sobre HTTPS/TLS 1.2
- Endpoint: `https://ws.cfm.org.br:8080/WebServiceConsultaMedicos/ServicoConsultaMedicos`
- Namespace: `http://servico.cfm.org.br/`
- Cabeçalhos: `Content-Type: text/xml; charset=utf-8` e `SOAPAction: ""`
- Parâmetros: `crm` (até 7 dígitos, sem prefixo), `uf` (2 letras maiúsculas), `chave` (8 caracteres)
- A chave vive **apenas no servidor**, lida de `env.CFM_CHAVE`. Nunca é enviada ao navegador nem gravada em log.

## Configuração da chave

Cloudflare Pages → projeto → **Settings → Environment variables** → adicionar:

```
CFM_CHAVE = <chave de 8 caracteres fornecida pelo CFM na contratação>
```

Marcar como **Secret** (encrypted) e aplicar a Production e Preview. Depois, **Redeploy** — variáveis novas só valem no build seguinte.

Contratação: https://sis.cfm.org.br/listamedicos/informacoes (cadastro no SEI-Medicina, documentação, pagamento; chave com validade anual).

## Tratamento de erros

O serviço devolve **HTTP 200 mesmo em erro de negócio**, com `codigoErro` no corpo e sem SOAP Fault — por isso `codigoErro` é sempre verificado antes de concluir qualquer coisa sobre o registro.

| codigoErro | Resposta ao visitante |
|---|---|
| 8101 | "Médico não encontrado" — único caso em que se afirma ausência de registro |
| 3010 | Chave inválida ou contrato fora de vigência (falha técnica) |
| 2010 / 2030 / 2040 | Falha do CFM, sugerindo nova tentativa |
| 4000 / 4010 / 4020 | Parâmetro ausente |
| outros | Código repassado com aviso de falha técnica |

Falha de rede, timeout (15 s), HTTP fora de 2xx ou XML inesperado ⇒ "Serviço indisponível", sempre com a ressalva de que **é falha técnica, não ausência de registro**. Validação de campos é feita no navegador (CRM só dígitos, UF obrigatória) e repetida no servidor.

## Apresentação do resultado

Exibidos apenas os dados retornados: nome, CRM/UF, situação (tabela 5.1), tipo de inscrição (tabela 5.2), data de atualização do cadastro e cada especialidade com seu RQE, com espaços normalizados e texto íntegro. O CRM é preservado como texto, no formato de exibição do CFM. O rodapé do cartão identifica a fonte e separa **cadastro atualizado em** (dado do CFM) de **consulta realizada em** (horário local da requisição).

## Busca por nome

Não contemplada pela operação `Consultar`, que exige CRM + UF. A tela oferece o link para a busca oficial, sem parâmetros inventados.

## Iframe

Não utilizado. O portal do CFM não declara permissão de incorporação e usa reCAPTCHA; embutir seria presumir compatibilidade e contornar proteção. O acesso se dá pelo botão em nova aba.

## O que foi testado

- Modo sem chave: `/crm` responde `501 NAO_CONFIGURADO`; a tela mostra o cartão e o botão para o portal. **Verificado em produção.**
- Validação de campos, estados de carregamento, mensagens de erro e alternância entre os dois modos. **Verificados.**
- Sintaxe do backend (`node --check`). **Verificado.**

## O que depende da liberação do CFM

A consulta real — envelope SOAP, leitura de `codigoErro`, mapeamento de situação/tipo e renderização das especialidades com RQE — foi escrita conforme o manual oficial, mas **não pôde ser executada contra o serviço**: ele exige chave contratada. Validar assim que a chave for emitida, com um CRM conhecido e um CRM inexistente (deve retornar 8101).
