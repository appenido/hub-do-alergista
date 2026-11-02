// Cloudflare Pages Function — proxy para o webservice oficial do CFM (SOAP 1.1)
// Rota: GET /crm?crm=12345&uf=MG
// Requer a variável de ambiente CFM_CHAVE (chave de 8 caracteres fornecida na contratação).
// Sem a chave, responde 501 { error: 'NAO_CONFIGURADO' } — o front mostra o acesso ao portal oficial.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};

const ENDPOINT = 'https://ws.cfm.org.br:8080/WebServiceConsultaMedicos/ServicoConsultaMedicos';
const NS = 'http://servico.cfm.org.br/';

const SITUACAO = {
  A: 'Regular', B: 'Suspensão parcial permanente', C: 'Cassado', E: 'Inoperante',
  F: 'Falecido', G: 'Sem o exercício da profissão na UF', I: 'Interdição cautelar, total',
  J: 'Suspenso por ordem judicial, parcial', L: 'Cancelado', M: 'Suspensão total temporária',
  N: 'Interdição cautelar, parcial', O: 'Suspenso por ordem judicial, total', P: 'Aposentado',
  R: 'Suspensão temporária', S: 'Suspenso, total', T: 'Transferido', U: 'Inscrição anulada',
  X: 'Suspenso, parcial'
};

const TIPO_INSCRICAO = {
  P: 'Principal', S: 'Secundária', V: 'Provisória', R: 'Provisória secundária',
  E: 'Estudante médico formado no exterior', T: 'Temporária'
};

const ERROS = {
  '2010': { msg: 'Falha ao validar a chave de identificação no CFM. Tente novamente.', http: 502 },
  '2030': { msg: 'Falha interna do CFM ao registrar o acesso. Tente novamente.', http: 502 },
  '2040': { msg: 'Falha do CFM ao consultar os dados do médico. Tente novamente.', http: 502 },
  '3010': { msg: 'Chave de acesso inválida ou contrato fora de vigência.', http: 502 },
  '4000': { msg: 'UF não informada.', http: 400 },
  '4010': { msg: 'Número do CRM não informado.', http: 400 },
  '4020': { msg: 'Chave de identificação não informada no servidor.', http: 500 },
  '8101': { msg: 'Médico não encontrado com esse CRM e UF.', http: 404 }
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet({ request, env }) {
  const p = new URL(request.url).searchParams;
  const crm = (p.get('crm') || p.get('numero') || '').replace(/\D/g, '');
  const uf = (p.get('uf') || '').trim().toUpperCase();
  const chave = env && env.CFM_CHAVE;

  if (!chave) {
    return json({ error: 'NAO_CONFIGURADO', mensagem: 'Integração com o CFM não configurada neste servidor.' }, 501);
  }
  if (!crm || Number(crm) === 0) return json({ error: 'PARAMETRO', mensagem: 'Informe o número do CRM.' }, 400);
  if (!/^[A-Z]{2}$/.test(uf)) return json({ error: 'PARAMETRO', mensagem: 'Selecione a UF do registro.' }, 400);

  const envelope =
    '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="' + NS + '">' +
      '<soapenv:Body><ser:Consultar>' +
        '<crm>' + crm + '</crm><uf>' + uf + '</uf><chave>' + esc(chave) + '</chave>' +
      '</ser:Consultar></soapenv:Body></soapenv:Envelope>';

  let xml;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/xml; charset=utf-8', 'SOAPAction': '""', 'Accept': 'text/xml' },
      body: envelope,
      signal: ctrl.signal
    });
    clearTimeout(t);
    xml = await res.text();
    // O serviço devolve HTTP 200 mesmo em erro de negócio; só tratamos como falha de transporte fora da faixa 2xx.
    if (!res.ok && !/<.*codigoErro/i.test(xml)) {
      return json({ error: 'INDISPONIVEL', mensagem: 'O serviço do CFM respondeu ' + res.status + '.' }, 502);
    }
  } catch (e) {
    return json({
      error: 'INDISPONIVEL',
      mensagem: e.name === 'AbortError'
        ? 'O serviço do CFM não respondeu a tempo.'
        : 'Não foi possível falar com o serviço do CFM.'
    }, 502);
  }

  // codigoErro vem com HTTP 200 e sem SOAP Fault — verificar sempre, antes de concluir ausência de registro.
  const codigoErro = tag(xml, 'codigoErro');
  if (codigoErro) {
    const e = ERROS[codigoErro] || { msg: 'O CFM retornou o código de erro ' + codigoErro + '.', http: 502 };
    return json({
      error: codigoErro === '8101' ? 'NAO_ENCONTRADO' : 'ERRO_CFM',
      codigoErro: codigoErro,
      mensagem: e.msg
    }, e.http);
  }

  const fault = tag(xml, 'faultstring');
  if (fault) return json({ error: 'ERRO_CFM', mensagem: 'O CFM recusou a consulta: ' + fault }, 502);

  const nome = tag(xml, 'nome');
  if (!nome) return json({ error: 'INDISPONIVEL', mensagem: 'Resposta do CFM em formato inesperado.' }, 502);

  const sit = (tag(xml, 'situacao') || '').toUpperCase();
  const tin = (tag(xml, 'tipoInscricao') || '').toUpperCase();

  return json({
    fonte: 'Conselho Federal de Medicina',
    consultadoEm: new Date().toISOString(),
    data: {
      nome: nome,
      crm: tag(xml, 'crm') || crm,          // preservado como texto, no formato de exibição do CFM
      uf: tag(xml, 'uf') || uf,
      situacaoCodigo: sit,
      situacao: SITUACAO[sit] || null,
      tipoInscricaoCodigo: tin,
      tipoInscricao: TIPO_INSCRICAO[tin] || null,
      dataAtualizacao: tag(xml, 'dataAtualizacao') || null,
      especialidades: tags(xml, 'especialidade')
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(Boolean)
    }
  }, 200);
}

/* ── helpers ── */
function tag(xml, nome) {
  const m = xml.match(new RegExp('<(?:\\w+:)?' + nome + '(?:\\s[^>]*)?>([\\s\\S]*?)</(?:\\w+:)?' + nome + '>', 'i'));
  return m ? unesc(m[1]).trim() : '';
}
function tags(xml, nome) {
  const re = new RegExp('<(?:\\w+:)?' + nome + '(?:\\s[^>]*)?>([\\s\\S]*?)</(?:\\w+:)?' + nome + '>', 'gi');
  const out = []; let m;
  while ((m = re.exec(xml)) !== null) out.push(unesc(m[1]));
  return out;
}
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function unesc(s) {
  return String(s).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: CORS });
}
