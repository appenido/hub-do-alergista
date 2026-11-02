// Cloudflare Pages Function — proxy para a API do CFM (resolve CORS)
// Rota: /crm?crm=12345&uf=MG   ou   /crm?nome=Fulano

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8'
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet({ request }) {
  const params = new URL(request.url).searchParams;
  const nome = params.get('nome');
  const crm  = params.get('crm');
  const uf   = params.get('uf');

  let alvo;
  if (crm && uf) {
    alvo = `https://sistemas.cfm.org.br/apicfm/medicos/${encodeURIComponent(crm)}/${encodeURIComponent(uf.toUpperCase())}`;
  } else if (nome) {
    alvo = `https://sistemas.cfm.org.br/apicfm/medicos/pesquisaNome?nome=${encodeURIComponent(nome.trim())}`;
  } else {
    return json({ erro: 'Informe crm+uf ou nome' }, 400);
  }

  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(alvo, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      signal: ctrl.signal
    });
    clearTimeout(t);
    const texto = await res.text();
    let dados;
    try { dados = JSON.parse(texto); }
    catch { return json({ erro: 'Resposta inválida do CFM', detalhe: texto.slice(0, 200) }, 502); }

    // o app espera { modo, data }
    let lista = dados;
    if (lista && !Array.isArray(lista)) {
      lista = lista.dados || lista.data || lista.medicos || lista.result || lista.items || lista;
    }
    if (Array.isArray(lista)) {
      if (!lista.length) return json({ modo: 'lista', data: [] }, 200);
      if (crm && uf) return json({ modo: 'individual', data: lista[0] }, 200);
      return json({ modo: 'lista', data: lista }, 200);
    }
    return json({ modo: 'individual', data: lista }, 200);
  } catch (e) {
    return json({ erro: e.name === 'AbortError' ? 'Timeout' : e.message }, 502);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: CORS });
}
