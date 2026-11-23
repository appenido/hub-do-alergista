/* Hub do Alergista — evita preenchimento de e-mail pessoal em BUSCAS.
 * Mantém autofill em formulários clínicos e nunca lê, transmite ou armazena dados.
 * Compatível com inputs de busca renderizados após o carregamento da página.
 */
(function () {
  'use strict';
  if (window.__hubSearchAutofillGuard) return;
  window.__hubSearchAutofillGuard = true;

  var guarded = new WeakSet();
  var manuallyEntered = new WeakSet();
  var counter = 0;
  var emailOnly = /^[^\s@]{1,100}@[^\s@]{1,160}\.[^\s@]{2,24}$/i;

  function isSearch(input) {
    if (!input || input.tagName !== 'INPUT' || input.disabled) return false;
    var type = (input.getAttribute('type') || 'text').toLowerCase();
    if (type === 'search') return true;
    if (type !== 'text') return false;
    var info = [
      input.id, input.className, input.getAttribute('placeholder'),
      input.getAttribute('aria-label'), input.getAttribute('data-role'),
      input.getAttribute('data-action'), input.getAttribute('name')
    ].join(' ').toLowerCase();
    // Não modificar e-mails, credenciais nem formulários clínicos.
    if (/(?:email|e-mail|senha|password|login|paciente|medico|médico|crm|cpf)/.test(info)) return false;
    return /(?:busca|buscar|pesquisa|pesquisar|filtro|filtrar|search|filter)/.test(info);
  }

  function clearAccidentalEmail(input) {
    if (!isSearch(input) || manuallyEntered.has(input)) return;
    var value = (input.value || '').trim();
    if (!emailOnly.test(value)) return;
    // Só elimina valores com formato de e-mail inseridos num campo de pesquisa
    // sem o usuário ter digitado ou colado naquele campo.
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function protect(input) {
    if (!isSearch(input)) return;
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('spellcheck', 'false');
    input.setAttribute('aria-autocomplete', 'none');
    input.setAttribute('data-lpignore', 'true');
    input.setAttribute('data-1p-ignore', 'true');
    input.setAttribute('data-bwignore', 'true');
    if (!input.hasAttribute('name')) {
      // Nome específico, sem os termos "email", "username" ou "login".
      // Evita associação com os dados salvos em formulários do navegador.
      counter += 1;
      input.setAttribute('name', 'hub_filtro_' + (input.id || counter).replace(/[^a-z0-9_-]/gi, '_'));
    }
    if (guarded.has(input)) { clearAccidentalEmail(input); return; }
    guarded.add(input);

    input.addEventListener('keydown', function (event) {
      // Digitação real: não apagar buscas deliberadas (inclusive endereços digitados).
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey)
        manuallyEntered.add(input);
    });
    input.addEventListener('compositionstart', function () { manuallyEntered.add(input); });
    input.addEventListener('paste', function () { manuallyEntered.add(input); });
    input.addEventListener('drop', function () { manuallyEntered.add(input); });
    input.addEventListener('input', function () { clearAccidentalEmail(input); });
    input.addEventListener('focus', function () {
      clearAccidentalEmail(input);
      requestAnimationFrame(function () { clearAccidentalEmail(input); });
    });
    clearAccidentalEmail(input);
  }

  function scan(root) {
    if (!root) return;
    if (root.nodeType === 1 && root.matches && root.matches('input')) protect(root);
    if (!root.querySelectorAll) return;
    root.querySelectorAll('input').forEach(protect);
  }

  function start() {
    scan(document);
    // Chrome/Safari podem preencher campos após DOMContentLoaded, em pageshow
    // ou depois de uma navegação restaurada pelo histórico.
    requestAnimationFrame(function () { scan(document); });
    window.addEventListener('pageshow', function () {
      scan(document);
      requestAnimationFrame(function () { scan(document); });
    });
    if ('MutationObserver' in window && document.body) {
      var observer = new MutationObserver(function (changes) {
        changes.forEach(function (change) {
          change.addedNodes.forEach(scan);
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else start();
})();