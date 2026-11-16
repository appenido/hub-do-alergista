/* Diário UAS7 — acompanha a mesma semana pelo link individual. */
(function () {
  "use strict";
  const endpoint = "https://jpdtqtenlivxgjkyizcg.supabase.co/functions/v1/uas7-diario";
  const patientKey = new URLSearchParams(window.location.hash.slice(1)).get("p") || "";
  const el = id => document.getElementById(id);
  let latest = null;
  function message(title, detail) {
    el("mensagem").hidden = false;
    el("mensagemTitulo").textContent = title;
    el("mensagemTexto").textContent = detail;
  }
  async function api(action, extra) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(Object.assign({action: action, token: patientKey}, extra || {})),
      credentials: "omit",
      cache: "no-store"
    });
    const body = await response.json();
    if (!response.ok || !body.ok) throw new Error(body.erro || "Falha de conexão");
    return body;
  }
  function addDay(date, n) {
    const day = new Date(date + "T12:00:00Z");
    day.setUTCDate(day.getUTCDate() + n);
    return day.toISOString().slice(0, 10);
  }
  function show(response) {
    latest = response;
    el("mensagem").hidden = true;
    el("painelProgresso").hidden = false;
    el("subProgresso").textContent = response.respondidos + " de 7 dias registrados";
    el("pontuacao").textContent = response.completo ?
       "UAS7: " + response.total + "/42" : "Parcial: " + response.parcial + " pontos";
    el("detalheProgresso").textContent = response.completo ? "Sete dias consecutivos completos." :
      "Os dias não respondidos não entram como zero.";
    const days = el("diasProgresso");
    days.replaceChildren();
    const logged = new Set(response.registros.map(item => item.data));
    for (let index = 0; index < 7; index++) {
      const when = response.inicio ? addDay(response.inicio, index) : null;
      const div = document.createElement("div");
      div.className = "uas-day" + (logged.has(when) ? " done" : when === response.hoje ? " today" : when && when < response.hoje ? " missed" : "");
      div.textContent = (index + 1) + (logged.has(when) ? " ✓" : "");
      days.append(div);
    }
    const list = el("listaRespostas");
    list.replaceChildren();
    const line = document.createElement("p");
    line.className = "uas-muted";
    line.textContent = response.registros.map(item => item.data + ": " + item.pontos + "/6").join(" · ");
    list.append(line);
    const answered = logged.has(response.hoje);
    el("formDiario").hidden = answered || response.encerrado;
    el("cadastro").hidden = response.cadastrado;
    el("blocoConsentimento").hidden = response.cadastrado;
    el("etapaAtual").textContent = response.inicio ? "Dia " + Math.min(response.diaAtual, 7) : "Dia 1";
    if (answered) message("Resposta salva", "Volte amanhã à noite usando este mesmo link.");
    if (response.encerrado) message(response.completo ? "Diário concluído" : "Período encerrado",
       response.completo ? "Seu resultado está disponível ao profissional." :
       "Há dias sem resposta. Solicite um novo acompanhamento.");
  }
  async function load() {
    try {
      if (!/^[0-9a-f]{64}$/.test(patientKey)) throw new Error("Link inválido. Solicite outro QR Code.");
      show(await api("patient-status"));
    } catch (error) {
      el("formDiario").hidden = true;
      message("Diário indisponível", error.message);
    }
  }
  el("formDiario").addEventListener("submit", async event => {
    event.preventDefault();
    const warning = el("avisoFormulario");
    warning.textContent = "";
    const papulas = document.querySelector('input[name="papulas"]:checked');
    const prurido = document.querySelector('input[name="prurido"]:checked');
    if (!papulas || !prurido) {
      warning.textContent = "Selecione uma opção para pápulas e uma para coceira.";
      return;
    }
    const data = {papulas: Number(papulas.value), prurido: Number(prurido.value)};
    if (!latest || !latest.cadastrado) {
      const nome = el("pacienteNome").value.trim();
      const cidade = el("pacienteCidade").value.trim();
      const rawAge = el("pacienteIdade").value;
      const idade = Number(rawAge);
      if (nome.length < 3 || cidade.length < 2 || rawAge === "" ||
          !Number.isInteger(idade) || idade < 0 || idade > 120) {
        warning.textContent = "Informe seu nome, idade e cidade de origem.";
        return;
      }
      if (!el("consentimento").checked) {
        warning.textContent = "Confirme a autorização antes de enviar.";
        return;
      }
      Object.assign(data, {nome, cidade, idade, consentimento: true});
    }
    const submit = el("enviar");
    submit.disabled = true;
    submit.textContent = "Salvando resposta…";
    try {
      const saved = await api("submit", data);
      el("formDiario").reset();
      show(Object.assign({}, saved, {cadastrado: true}));
      window.scrollTo({top: 0, behavior: "smooth"});
    } catch (error) {
      warning.textContent = error.message || "Não foi possível salvar.";
    } finally {
      submit.disabled = false;
      submit.textContent = "Salvar resposta de hoje";
    }
  });
  el("excluir").addEventListener("click", async () => {
    if (!confirm("Deseja excluir este acompanhamento e todas as respostas definitivamente?")) return;
    try {
      await api("delete", {tipo: "paciente"});
      el("formDiario").hidden = true;
      el("painelProgresso").hidden = true;
      el("excluir").hidden = true;
      message("Dados excluídos", "O acompanhamento foi apagado do servidor.");
    } catch (error) {
      message("Falha na exclusão", error.message);
    }
  });
  load();
})();