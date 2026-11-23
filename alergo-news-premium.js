/* Alergo News — a Home e as duas rotas do jornal usam a mesma edição. */
(function () {
  'use strict';

  const cache = 'hub_alergo_news_v2';
  const cincoMinutos = 5 * 60 * 1000;
  const fuso = 'America/Sao_Paulo';
  const formatoDia = new Intl.DateTimeFormat('pt-BR', {timeZone: fuso});
  const formatoAtualizacao = new Intl.DateTimeFormat('pt-BR', {
    timeZone: fuso, dateStyle: 'short', timeStyle: 'short'
  });
  const edicao = document.getElementById('alergoNewsEdicao');
  const corpo = document.getElementById('jornalCorpo');
  const sub = document.getElementById('jornalSub');
  const mancheteHome = document.getElementById('alertaNoticiaTexto');
  if (!edicao || !corpo || !sub || !mancheteHome) return;
  const subtituloPadrao = sub.textContent;
  const manchetePadrao = mancheteHome.textContent;
  let fontes = {edicao: [], radar: [], feed: [], atualizadoEm: ''};
  let emAndamento = null;
  let ultimaConsulta = 0;
  let ultimaExibicao = '';

  function dataPublicacao(valor) {
    const texto = String(valor || '').trim();
    const iso = texto.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1');
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      // Uma data sem horário corresponde ao próprio dia de publicação no Brasil.
      const instante = Date.parse(iso + 'T00:00:00-03:00');
      if (Number.isFinite(instante) && new Date(instante).toISOString().slice(0, 10) === iso) {
        return {instante, iso, rotulo: iso.split('-').reverse().join('/')};
      }
      return null;
    }
    const instante = Date.parse(texto);
    if (!Number.isFinite(instante)) return null;
    return {instante, iso: new Date(instante).toISOString(), rotulo: formatoDia.format(instante)};
  }

  function noticia(item) {
    const titulo = String(item?.titulo || item?.manchete || '').trim();
    if (!titulo) return null;
    let link;
    try { link = new URL(item.url); } catch { return null; }
    if (link.protocol !== 'https:') return null;
    const url = link.href;
    link.hash = '';
    for (const chave of [...link.searchParams.keys()]) {
      if (/^(utm_|fbclid$|gclid$)/i.test(chave)) link.searchParams.delete(chave);
    }
    return {
      titulo, url, dominio: link.hostname,
      chaveUrl: link.href.replace(/\/$/, ''),
      fonte: String(item.fonte || 'Mídia').trim(),
      data: dataPublicacao(item.data),
      resumo: String(item.resumo || '').trim()
    };
  }

  function reportagens() {
    const itens = [...fontes.edicao, ...fontes.radar, ...fontes.feed]
      .map(noticia).filter(Boolean)
      .sort((a, b) => (b.data?.instante ?? -Infinity) - (a.data?.instante ?? -Infinity));
    const urls = new Set();
    const titulos = new Set();
    return itens.filter(item => {
      const chave = item.titulo.normalize('NFKD').replace(/\p{M}/gu, '')
        .toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
      if (urls.has(item.chaveUrl) || titulos.has(chave)) return false;
      urls.add(item.chaveUrl);
      titulos.add(chave);
      return true;
    });
  }

  function elemento(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  }

  async function compartilhar(item, status) {
    if (navigator.share) {
      try {
        await navigator.share({title: item.titulo, url: item.url});
        return;
      } catch (erro) {
        if (erro.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(item.url);
      status.textContent = 'Link copiado.';
    } catch {
      window.prompt('Copie o link da reportagem', item.url);
    }
  }

  function cartao(item, principal) {
    const linha = elemento(principal ? 'article' : 'li', principal ? 'an-principal' : 'an-item');
    const meta = elemento('div', 'an-meta');
    const icone = elemento('img');
    icone.alt = '';
    icone.width = icone.height = 16;
    icone.loading = 'lazy';
    icone.addEventListener('error', () => icone.remove(), {once: true});
    icone.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(item.dominio) + '&sz=32';
    const data = item.data ? elemento('time', '', item.data.rotulo) : elemento('span', '', 'Data não informada');
    if (item.data) data.dateTime = item.data.iso;
    const separador = elemento('span', 'an-separador', '·');
    separador.setAttribute('aria-hidden', 'true');
    meta.append(icone, elemento('span', 'an-fonte', item.fonte), separador, data);
    const titulo = elemento('h2', 'an-titulo');
    const link = elemento('a', 'an-link', item.titulo);
    link.href = item.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    titulo.append(link);
    linha.append(meta, titulo);
    if (item.resumo) linha.append(elemento('p', 'an-resumo', item.resumo));
    if (principal) {
      const acoes = elemento('div', 'an-acoes');
      const ler = elemento('span', 'an-ler', 'Ler reportagem');
      ler.setAttribute('aria-hidden', 'true');
      const botao = elemento('button', 'an-compartilhar', 'Compartilhar');
      const status = elemento('span', 'an-status');
      status.setAttribute('role', 'status');
      botao.type = 'button';
      botao.addEventListener('click', () => compartilhar(item, status));
      acoes.append(ler, botao, status);
      linha.append(acoes);
    }
    return linha;
  }

  function mostrar(disponivel) {
    const itens = reportagens();
    const exibicao = JSON.stringify([itens, fontes.atualizadoEm, !itens.length && disponivel]);
    if (exibicao === ultimaExibicao) return;
    ultimaExibicao = exibicao;
    const fragmento = document.createDocumentFragment();
    const principal = itens[0]?.data ? itens[0] : null;
    const anteriores = principal ? itens.slice(1) : itens;
    if (principal) fragmento.append(cartao(principal, true));
    if (anteriores.length) {
      const lista = elemento('ol', 'an-lista');
      lista.setAttribute('aria-label', 'Outras reportagens');
      for (const item of anteriores) lista.append(cartao(item, false));
      fragmento.append(lista);
    }
    if (!itens.length) {
      const mensagem = elemento('p', 'an-mensagem', disponivel
        ? 'Nenhuma reportagem verificada no momento.' : 'Não foi possível carregar as reportagens agora.');
      mensagem.setAttribute('role', 'status');
      fragmento.append(mensagem);
    }
    corpo.replaceChildren(fragmento);
    mancheteHome.textContent = principal
      ? principal.fonte + ' · ' + principal.data.rotulo + ': ' + principal.titulo : manchetePadrao;
    const atualizado = Date.parse(fontes.atualizadoEm);
    sub.textContent = Number.isFinite(atualizado) ? 'Atualizado em ' + formatoAtualizacao.format(atualizado) : subtituloPadrao;
  }

  async function lerFonte(url) {
    try {
      const resposta = await fetch(url, {cache: 'no-cache', signal: window.AbortSignal?.timeout?.(8000)});
      return resposta.ok ? await resposta.json() : null;
    } catch { return null; }
  }

  async function carregar() {
    const [local, radar, feed] = await Promise.all([
      lerFonte('jornal/edicao.json'), lerFonte('jornal/radar.json'), lerFonte('/news')
    ]);
    const temEdicao = Array.isArray(local?.noticias);
    const temRadar = Array.isArray(radar?.itens);
    const temFeed = Array.isArray(feed?.itens);
    if (temEdicao) fontes.edicao = local.noticias;
    if (temRadar) fontes.radar = radar.itens.filter(i => i?.verificado === true && i.status === 'verificado');
    if (temFeed) fontes.feed = feed.itens;
    if (temRadar || temFeed) fontes.atualizadoEm = radar?.atualizadoEm || feed?.atualizadoEm || fontes.atualizadoEm;
    const disponivel = temEdicao || temRadar || temFeed;
    if (disponivel) {
      ultimaConsulta = Date.now();
      try { localStorage.setItem(cache, JSON.stringify(fontes)); } catch {}
    }
    mostrar(disponivel);
  }

  function atualizar() {
    if (emAndamento) return emAndamento;
    if (Date.now() - ultimaConsulta < cincoMinutos) return;
    emAndamento = carregar().finally(() => { emAndamento = null; });
    return emAndamento;
  }

  function abrir(pagina) {
    // Links já salvos para #/alergonews e #/jornal abrem o mesmo conteúdo.
    const alvo = document.getElementById('page-' + pagina);
    if (alvo && edicao.parentElement !== alvo) alvo.append(edicao);
    return atualizar();
  }

  try {
    const anterior = JSON.parse(localStorage.getItem(cache));
    if (anterior && [anterior.edicao, anterior.radar, anterior.feed].every(Array.isArray)) {
      fontes = anterior;
      mostrar(true);
    }
  } catch {}
  window.AlergoNews = {abrir};
  abrir(document.getElementById('page-alergonews')?.classList.contains('active') ? 'alergonews' : 'jornal');
  document.addEventListener('visibilitychange', () => { if (!document.hidden) atualizar(); });
})();
