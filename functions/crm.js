// Cloudflare Pages Function — proxy para a busca pública de médicos do CFM
// Rota: /crm?crm=12345&uf=MG  |  /crm?nome=Fulano  (+ &debug=1 para resposta crua)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};

const API = 'https://portal.cfm.org.br/api_rest_php/api/v1/medicos/buscar_medicos';

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet({ request }) {
  const p = new URL(request.url).searchParams;
  const nome  = (p.get('nome') || '').trim();
  const crm   = (p.get('crm') || p.get('numero') || '').trim();
  const uf    = (p.get('uf') || '').trim().toUpperCase();
  const debug = p.get('debug');

  if (!nome && !crm) return json({ erro: 'Informe crm+uf ou nome' }, 400);

  const filtro = {
    medico: {
      nome: nome,
      ufMedico: uf,
      crmMedico: crm,
      municipio: '',
      tipoInscricao: '',
      situacao: '',
      detalhe: '',
      especialidade: '',
      areaAtuacao: '',
      buscaPor: crm ? 'crm' : 'medico',
      pageNumber: 1,
      pageSize: 20
    }
  };

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    const body = new URLSearchParams();
    body.set('medico', JSON.stringify(filtro.medico));

    const res = await fetch(API, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://portal.cfm.org.br',
        'Referer': 'https://portal.cfm.org.br/busca-medicos'
      },
      body: body.toString(),
      signal: ctrl.signal
    });
    clearTimeout(t);

    const texto = await res.text();
    if (debug) return json({ debug: true, status: res.status, corpo: texto.slice(0, 1200) }, 200);

    let dados;
    try { dados = JSON.parse(texto); }
    catch { return json({ erro: 'CFM respondeu ' + res.status + ' (nao-JSON)', detalhe: texto.slice(0, 200) }, 502); }

    let lista = dados && (dados.dados || dados.data || dados.medicos || dados.result || dados.items);
    if (!Array.isArray(lista)) lista = Array.isArray(dados) ? dados : [];

    const norm = lista.map(m => ({
      nome_razao_social: m.NOME || m.nome || m.nome_razao_social || '',
      numero_registro:   m.CRM  || m.crm  || m.numero_registro   || '',
      uf:                m.UF   || m.uf   || '',
      categoria:         m.CATEGORIA || m.categoria || 'Médico',
      situacao:          m.SITUACAO || m.situacao || '',
      tipo_inscricao:    m.TIPO_INSCRICAO || m.tipoInscricao || '',
      data_inscricao:    m.DATAINSCRICAO || m.data_inscricao || '',
      endereco:          m.ENDERECO || m.endereco || '',
      especialidade:     m.ESPECIALIDADE || m.especialidade || ''
    }));

    if (!norm.length) return json({ modo: 'lista', data: [] }, 200);
    if (crm && uf)    return json({ modo: 'individual', data: norm[0] }, 200);
    return json({ modo: 'lista', data: norm }, 200);
  } catch (e) {
    return json({ erro: e.name === 'AbortError' ? 'Timeout' : e.message }, 502);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: CORS });
}
