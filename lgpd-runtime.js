/* Proteção de dados: sessão autenticada, questionários e direitos dos titulares.
   Registros clínicos não devem ser enviados a IA externa com identificadores. */
(function(){
'use strict';
const SB='https://jpdtqtenlivxgjkyizcg.supabase.co';
const KEY='sb_publishable_CzAI8BUm2Po7CfobLlxv8A_NtuTil8j';
const AUTH='hub_secure_auth';
let refreshPending=null;
let recuperacaoPendente=null;
function lerAuth(){try{return JSON.parse(sessionStorage.getItem(AUTH)||'{}');}catch(_){return {};}}
function erro(msg){throw new Error(msg);}
function limparCredenciais(){
  try{sessionStorage.removeItem(AUTH);localStorage.removeItem('hub_session');}catch(_){}
}
function validoJwt(token){
  try{const p=JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));return Number(p.exp||0)*1000;}catch(_){return 0;}
}
function manterIdentidade(email,nome){
  localStorage.setItem('hub_session',JSON.stringify({email:String(email||'').toLowerCase(),nome:String(nome||''),v:3,exp:Date.now()+86400000}));
}
function armazenarAuth(email,nome,access,refresh){
  if(!access||!refresh)erro('A autenticação não retornou uma sessão válida.');
  const exp=validoJwt(access);if(exp<Date.now())erro('A sessão fornecida expirou.');
  sessionStorage.setItem(AUTH,JSON.stringify({access,refresh,exp}));
  manterIdentidade(email,nome);
}
async function token(){
  const a=lerAuth();
  if(a.access && a.exp>Date.now()+60000)return a.access;
  if(!a.refresh){limparCredenciais();erro('Entre na sua conta para acessar registros clínicos.');}
  if(!refreshPending){
    refreshPending=fetch(SB+'/auth/v1/token?grant_type=refresh_token',{
      method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({refresh_token:a.refresh})
    }).then(async r=>{const d=await r.json();if(!r.ok||!d.access_token||!d.refresh_token)erro('Sessão expirada. Faça login novamente.');
      const perfil=JSON.parse(localStorage.getItem('hub_session')||'{}');
      armazenarAuth(perfil.email,perfil.nome,d.access_token,d.refresh_token);
      return d.access_token;
    }).catch(e=>{limparCredenciais();throw e;}).finally(()=>{refreshPending=null;});
  }
  return refreshPending;
}
async function rpc(nome,dados,autenticado=true){
  const jwt=autenticado?await token():KEY;
  const res=await fetch(SB+'/rest/v1/rpc/'+nome,{
    method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+jwt,'Content-Type':'application/json'},
    body:JSON.stringify(dados||{})
  });
  if(!res.ok)erro('Operação não autorizada ou indisponível ('+res.status+').');
  return res.status===204?null:res.json();
}
window._hubTokenValido=token;
window._sbToken=function(){return lerAuth().access||'';};
window._hubRpc=rpc;
window._scoreRpc=function(fn,body){
  if(!/^score_(salvar|pacientes|do_paciente|editar|apagar)$/.test(fn))return Promise.reject(new Error('Operação não permitida.'));
  return rpc(fn,body,true);
};
window._iniciarSessao=function(email,nome,access,refresh){
  armazenarAuth(email,nome,access,refresh);
  var tela=document.getElementById('authScreen');if(tela)tela.style.display='none';
  if(typeof window._mostrarApp==='function')window._mostrarApp();
  if(typeof window._atualizarInfoUsuario==='function')window._atualizarInfoUsuario();
  try{if(typeof window.atualizarHero==='function')window.atualizarHero();}catch(_){}
  if(typeof window.toast==='function')window.toast('✓','Você entrou na sua conta.');
  return true;
};
window.fazerLogin=async function(){
  const campo=(id)=>document.getElementById(id);
  const email=(campo('loginEmail')?.value||'').trim().toLowerCase();
  const senha=campo('loginSenha')?.value||'';
  const aviso=campo('loginErr'),botao=campo('btnEntrarHub');
  const legado=campo('btnCadastroAntigo');
  if(legado)legado.hidden=true;
  aviso.textContent='';
  if(!email||!email.includes('@')||!senha){
    aviso.textContent='Informe um e-mail válido e sua senha.';return;
  }
  if(botao){botao.disabled=true;botao.textContent='Entrando…';}
  aviso.textContent='Verificando seus dados…';
  try{
    const resp=await fetch(SB+'/auth/v1/token?grant_type=password',{
      method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email,password:senha})
    });
    const dados=await resp.json().catch(()=>({}));
    if(!resp.ok||!dados.access_token||!dados.refresh_token){
      const detalhe=String(dados.error_code||dados.error||dados.msg||dados.message||'').toLowerCase();
      if(resp.status===429){erro('Muitas tentativas de acesso. Tente novamente mais tarde.');}
      if(/not.confirmed|email.not.confirmed/.test(detalhe))
        erro('Seu e-mail ainda não foi confirmado. Verifique a mensagem enviada no cadastro.');
      if(/invalid|credentials|login|password/.test(detalhe)||resp.status===400)
        erro('E-mail ou senha incorretos. Você pode recuperar a senha abaixo.');
      erro('Não foi possível autenticar sua conta. Tente novamente.');
    }
    const meta=(dados.user&&dados.user.user_metadata)||{};
    window._iniciarSessao(email,meta.nome||email,dados.access_token,dados.refresh_token);
    if(typeof window._salvarLocal==='function')window._salvarLocal(email,meta);
    aviso.textContent='';
    campo('loginSenha').value='';
  }catch(e){
    aviso.textContent=e.message||'Não foi possível entrar. Verifique sua conexão.';
    // Contas antigas podiam existir apenas neste navegador, sem autenticação na nuvem.
    try{
      const antigos=JSON.parse(sessionStorage.getItem('hub_users')||'{}');
      if(antigos[email]&&legado)legado.hidden=false;
    }catch(_){}
  }finally{
    if(botao){botao.disabled=false;botao.textContent='Entrar';}
  }
};
window.fazerCadastro=async function(){
  const get=id=>(document.getElementById(id)||{}).value||'';
  const aviso=document.getElementById('cadErr');
  const email=get('cadEmail').trim().toLowerCase(),senha=get('cadSenha');
  const cat=get('cadCategoria'),nome=get('cadNome').trim(),esp=get('cadEspecialidade').trim();
  aviso.textContent='';
  if(!nome||!cat||!email.includes('@')){aviso.textContent='Informe nome, categoria e e-mail válido.';return;}
  if(cat==='especialista'&&!esp){aviso.textContent='Informe sua especialidade.';return;}
  if(senha.length<12){aviso.textContent='Use uma senha com pelo menos 12 caracteres.';return;}
  if(senha!==get('cadSenha2')){aviso.textContent='As senhas não coincidem.';return;}
  const meta={app:'hub',nome,categoria:cat,
    especialidade:cat==='especialista'?esp:(typeof CATEGORIA_LABEL!=='undefined'?CATEGORIA_LABEL[cat]||cat:cat),
    endereco:'',crm:'',rqe:null,interesses:(typeof _interessesSelecionados==='function'?_interessesSelecionados():[])};
  aviso.textContent='Criando conta…';
  try{
    const r=await fetch(SB+'/auth/v1/signup',{method:'POST',
      headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email,password:senha,data:meta})}),d=await r.json();
    if(!r.ok)erro(d.msg||d.message||d.error_description||'Falha ao criar conta.');
    if(d.access_token&&d.refresh_token){
      if(typeof _salvarLocal==='function')_salvarLocal(email,meta);
      window._iniciarSessao(email,nome,d.access_token,d.refresh_token);
    }else{
      window._cadPendente={email,senha,nome,meta};
      if(typeof window._mostrarCodigo==='function')window._mostrarCodigo(email);
    }
    aviso.textContent='';
  }catch(e){aviso.textContent=e.message+' Não foi criada nenhuma conta local.';}
};
const sairOriginal=window.fazerLogout;
window.fazerLogout=function(){
  const a=lerAuth();
  if(a.access)fetch(SB+'/auth/v1/logout',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+a.access}}).catch(()=>{});
  limparCredenciais();
  try{sessionStorage.removeItem('hub_snot22_hist');sessionStorage.removeItem('hub_uct_hist');}catch(_){}
  if(typeof sairOriginal==='function')sairOriginal();
};
function mostrarErroQR(tipo,err){
  const el=document.getElementById(tipo+'-qr-canvas');
  if(el)el.textContent='Faça login para gerar link seguro. '+(err&&err.message||'');
  if(typeof window.toast==='function')window.toast('⚠','Autenticação necessária para gerar o questionário.');
}
async function criarSessao(tipo){
  const id=await rpc('clinical_criar_sessao',{p_tipo:tipo},true);
  if(typeof id!=='string'||!new RegExp('^'+tipo+'-[a-f0-9]{32}$').test(id))erro('Erro na criação da sessão.');
  return id;
}
function gerarQR(tipo,gerador){
  criarSessao(tipo).then(id=>{
    if(tipo==='uct')window._uctSessaoId=id;
    else if(tipo==='snot22')window._snot22SessaoId=id;
    else window._uas7SessaoId=id;
    const continuar=()=>{
      const el=document.getElementById(tipo+'-qr-canvas');
      if(el&&typeof gerador==='function')gerador();
    };
    if(window.QRCode){continuar();return;}
    const script=document.createElement('script');
    script.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    script.onload=continuar;script.onerror=()=>mostrarErroQR(tipo,new Error('QR Code indisponível'));
    document.head.appendChild(script);
  }).catch(e=>mostrarErroQR(tipo,e));
}
window._snot22IniciarSessao=()=>gerarQR('snot22',window._snot22GerarQR);
window._uas7IniciarQR=()=>gerarQR('uas7',window._uas7GerarQR);
window._uctIniciarSessao=()=>gerarQR('uct',window._uctGerarQR);
window._snot22LinkPaciente=function(){return window._snot22SessaoId?window._snot22PatientUrl+'?s='+window._snot22SessaoId:'';};
window._uas7LinkPaciente=function(){return window._uas7SessaoId?window._uas7PatientUrl+'?s='+window._uas7SessaoId:'';};
window._snot22Checar=function(){
  if(!window._snot22SessaoId)return;
  rpc('snot22_da_sessao',{p_sessao:window._snot22SessaoId},true).then(rows=>{
    if(!rows||!rows.length)return;
    if(typeof window._snot22PararPolling==='function')window._snot22PararPolling();
    window._snot22MostrarResultado(rows[0]);window._snot22SalvarHistorico(rows[0]);
    const e=document.getElementById('snot22-historico-wrap');if(e)e.innerHTML=window._snot22RenderHistorico();
  }).catch(()=>{});
};
window._uctChecar=function(){
  if(!window._uctSessaoId)return;
  rpc('uct_da_sessao',{p_sessao:window._uctSessaoId},true).then(rows=>{
    if(!rows||!rows.length)return;
    if(typeof window._uctPararPolling==='function')window._uctPararPolling();
    window._uctMostrarResultado(rows[0]);window._uctSalvarHistorico(rows[0]);
    const e=document.getElementById('uct-historico-wrap');if(e)e.innerHTML=window._uctRenderHistorico();
  }).catch(()=>{});
};
const perguntaOriginal=window.perguntarIaHub;
const proibido=/(?:\b\d{3}[. ]?\d{3}[. ]?\d{3}[- ]?\d{2}\b)|(?:\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)|(?:\b(?:CPF|RG|CNS|prontuário|nome completo|paciente:)[\s:]+\S+)/i;
window.perguntarIaHub=function(){
  const ta=document.getElementById('iaHubPergunta'),q=ta&&ta.value||'';
  if(proibido.test(q)){alert('Remova identificadores de pacientes antes de consultar a IA.');return;}
  if(!sessionStorage.getItem('hub_ia_avisado')){
    if(!confirm('Antes de enviar, confirme que a pergunta não contém informações que identifiquem um paciente. O conteúdo pode ser processado por serviço externo.'))return;
    sessionStorage.setItem('hub_ia_avisado','1');
  }
  if(typeof perguntaOriginal==='function')perguntaOriginal();
};
function limparChavesLegadas(){
  try{
    Object.keys(localStorage).filter(k=>k.indexOf('hub_aikey_')===0).forEach(k=>{
      const v=localStorage.getItem(k);
      if(v&&!sessionStorage.getItem(k))sessionStorage.setItem(k,v);
      localStorage.removeItem(k);
    });
  }catch(_){}
}
async function exportarDados(){
  if(!confirm('Exportar seu perfil e registros clínicos? O arquivo ficará sem criptografia no dispositivo. Guarde-o em local seguro.'))return;
  try{
    await token();
    const perfil=JSON.parse(localStorage.getItem('hub_session')||'{}');
    const users=JSON.parse(sessionStorage.getItem('hub_users')||'{}');
    const nomes=await rpc('score_pacientes',{p_email:perfil.email});
    const registros=[];
    for(const p of (nomes||[])){
      const rr=await rpc('score_do_paciente',{p_email:perfil.email,p_paciente:p.paciente_nome});
      registros.push({paciente:p.paciente_nome,resultados:rr});
    }
    const out={exportado_em:new Date().toISOString(),perfil:{...perfil,...(users[perfil.email]||{})},registros};
    delete out.perfil.hash;delete out.perfil.token;delete out.perfil.refresh;
    const blob=new Blob([JSON.stringify(out,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='hub-meus-dados-'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }catch(e){alert('Não foi possível exportar: '+e.message);}
}
async function solicitar(tipo){
  const descricao=tipo==='exclusao'?'exclusão de dados ou da conta':'acesso ou correção de dados';
  if(!confirm('Deseja registrar uma solicitação de '+descricao+'? O pedido será analisado conforme a legislação aplicável.'))return;
  try{await rpc('privacy_submit_request',{p_kind:tipo},true);alert('Solicitação registrada. Nenhum dado foi alterado ou excluído neste momento. Acompanhe o andamento nesta seção.');}
  catch(e){alert('Falha ao registrar: '+e.message);}
}
async function consultarPedidos(){
  try{
    const jwt=await token();
    const resp=await fetch(SB+'/rest/v1/privacy_requests?select=kind,status,criado_em&order=criado_em.desc&limit=20',
      {headers:{apikey:KEY,Authorization:'Bearer '+jwt}});
    if(!resp.ok)erro('Consulta de pedidos indisponível.');
    const rows=await resp.json();
    const nomes={acesso_correcao:'Acesso/correção',exclusao:'Exclusão'};
    alert(rows.length?rows.map(x=>(nomes[x.kind]||x.kind)+' — '+x.status+' — '+new Date(x.criado_em).toLocaleDateString('pt-BR')).join('\n'):'Nenhuma solicitação registrada.');
  }catch(e){alert(e.message);}
}
function limparDadosLocais(){
  if(!confirm('Apagar o histórico local dos questionários e as chaves de IA salvas nesta sessão? Os registros do servidor serão preservados.'))return;
  try{
    ['hub_snot22_hist','hub_uct_hist','hub_uas7_hist'].forEach(k=>{localStorage.removeItem(k);sessionStorage.removeItem(k);});
    Object.keys(localStorage).filter(k=>k.indexOf('hub_aikey_')===0).forEach(k=>localStorage.removeItem(k));
    Object.keys(sessionStorage).filter(k=>k.indexOf('hub_aikey_')===0).forEach(k=>sessionStorage.removeItem(k));
  }catch(_){}
  alert('Histórico local dos questionários e chaves de IA apagados. Os dados armazenados no servidor não foram alterados.');
}
function telaPrivacidade(){
  const destino=document.getElementById('page-perfil');
  if(!destino||document.getElementById('hub-privacidade'))return;
  const wrap=document.createElement('section');wrap.id='hub-privacidade';
  wrap.style.cssText='margin:14px 12px;padding:13px;border:1px solid #dbe5eb;border-radius:12px;background:white;';
  const h=document.createElement('h3');h.textContent='Privacidade e segurança';h.style.cssText='font-size:14px;line-height:1.4;font-weight:650;margin:0 0 7px;color:#0d1f2d';wrap.appendChild(h);
  const p=document.createElement('p');p.textContent='Consulte e exporte seus dados ou solicite acesso, correção e exclusão, conforme a legislação aplicável.';p.style.cssText='font-size:11px;line-height:1.45;color:#495866;margin:0 0 7px;';wrap.appendChild(p);
  function add(label,fn){
    const b=document.createElement('button');b.type='button';b.textContent=label;
    b.style.cssText='display:block;width:100%;text-align:left;padding:8px 10px;margin-top:5px;border:1px solid #dbe5eb;border-radius:8px;background:#f5f9fa;color:#0d1f2d;font-family:inherit;font-size:11.5px;line-height:1.4;font-weight:500;cursor:pointer;';
    b.addEventListener('click',fn);wrap.appendChild(b);
  }
  add('Política de privacidade',()=>location.assign('privacidade.html'));
  add('Exportar meus dados',exportarDados);
  add('Solicitar acesso ou correção',()=>solicitar('acesso_correcao'));
  add('Solicitar a exclusão dos meus dados ou da conta',()=>solicitar('exclusao'));
  add('Acompanhar solicitações',consultarPedidos);
  add('Limpar histórico dos questionários e chaves de IA',limparDadosLocais);
  add('Privacidade no uso da inteligência artificial',()=>location.assign('privacidade.html#ia'));
  destino.appendChild(wrap);
}
function inicializar(){
  limparChavesLegadas();
  try{
    const antiga=JSON.parse(localStorage.getItem('hub_session')||'{}');
    const atual=lerAuth();
    if(!atual.access && antiga.token && antiga.refresh && validoJwt(antiga.token)>Date.now()){
      armazenarAuth(antiga.email,antiga.nome,antiga.token,antiga.refresh);
    }else if(!atual.access){localStorage.removeItem('hub_session');}
    else if(antiga.token||antiga.refresh){manterIdentidade(antiga.email,antiga.nome);}
    const perfisLegados=localStorage.getItem('hub_users');
    if(perfisLegados&&!sessionStorage.getItem('hub_users'))sessionStorage.setItem('hub_users',perfisLegados);
    localStorage.removeItem('hub_users');
    const usuarios=JSON.parse(sessionStorage.getItem('hub_users')||'{}');
    for(const u of Object.values(usuarios)){if(u&&typeof u==='object')delete u.hash;}
    sessionStorage.setItem('hub_users',JSON.stringify(usuarios));
  }catch(_){}
  const campo=document.getElementById('cadSenha');if(campo)campo.minLength=12;
  const label=document.querySelector('label[for="cadSenha"]');
  if(label)label.textContent='Senha (mín. 12 caracteres)';
  const form=document.getElementById('formCad');
  if(form&&!form.querySelector('.hub-link-lgpd')){
    const aviso=document.createElement('p');aviso.className='hub-link-lgpd';
    aviso.style.cssText='font-size:11px;line-height:1.5;color:#64748b;';
    aviso.textContent='Antes de criar a conta, consulte a ';
    const a=document.createElement('a');a.href='privacidade.html';a.textContent='Política de Privacidade';aviso.appendChild(a);
    const btn=form.querySelector('button.auth-btn');if(btn)form.insertBefore(aviso,btn);
  }
  telaPrivacidade();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicializar);else inicializar();
})();
