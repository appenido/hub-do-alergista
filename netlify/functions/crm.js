// Netlify Function — proxy para API do CFM (resolve CORS)
const https = require('https');

exports.handler = async function(event) {
  const { nome, crm, uf } = event.queryStringParameters || {};

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  // Busca por CRM + UF
  if (crm && uf) {
    const url = `https://sistemas.cfm.org.br/apicfm/medicos/${crm}/${uf.toUpperCase()}`;
    try {
      const data = await fetchJSON(url);
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch(e) {
      return { statusCode: 502, headers, body: JSON.stringify({ erro: e.message }) };
    }
  }

  // Busca por nome
  if (nome) {
    const encoded = encodeURIComponent(nome.trim());
    const url = `https://sistemas.cfm.org.br/apicfm/medicos/pesquisaNome?nome=${encoded}`;
    try {
      const data = await fetchJSON(url);
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch(e) {
      return { statusCode: 502, headers, body: JSON.stringify({ erro: e.message }) };
    }
  }

  return { statusCode: 400, headers, body: JSON.stringify({ erro: 'Informe crm+uf ou nome' }) };
};

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'application/json'
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch(e) { reject(new Error('Resposta inválida do CFM')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}
