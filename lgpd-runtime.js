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
  try{
    sessionStorage.removeItem(AUTH);
    sessionStorage.removeItem('hub_users');
    localStorage.removeItem('hub_session');
  }catch(_){}
  if(typeof window._bloquearApp==='function')window._bloquearApp();
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
  if(!a.refresh){limparCredenciais();erro('Registros clínicos não estão disponíveis na versão pública sem autenticação.');}
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
  const reenviar=campo('btnReenviarConfirmacao');
  if(legado)legado.hidden=true;
  if(reenviar)reenviar.hidden=true;
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
      if(/not.confirmed|email.not.confirmed/.test(detalhe)){
        if(reenviar)reenviar.hidden=false;
        erro('O e-mail ainda não foi confirmado. Confira a mensagem do cadastro ou solicite outro código.');
      }
      if(/invalid|credentials|login|password/.test(detalhe)||resp.status===400)
        erro('E-mail ou senha incorretos. Você pode recuperar a senha abaixo.');
      erro('Não foi possível autenticar sua conta. Tente novamente.');
    }
    const meta=(dados.user&&dados.user.user_metadata)||{};
    if(typeof window._salvarLocal==='function')window._salvarLocal(email,meta);
    window._iniciarSessao(email,meta.nome||email,dados.access_token,dados.refresh_token);
    aviso.textContent='';
    campo('loginSenha').value='';
  }catch(e){
    const m=String(e&&e.message||'');
    aviso.textContent=/failed to fetch|networkerror|network request failed|load failed/i.test(m)
      ?'Não foi possível conectar ao servidor. Verifique a conexão e tente novamente.'
      :m||'Não foi possível entrar. Tente novamente.';
    // Contas antigas podiam existir apenas neste navegador, sem autenticação na nuvem.
    try{
      const antigos=JSON.parse(sessionStorage.getItem('hub_users')||'{}');
      if(antigos[email]&&legado)legado.hidden=false;
    }catch(_){}
  }finally{
    if(botao){botao.disabled=false;botao.textContent='Entrar';}
  }
};
window.reenviarConfirmacaoHub=async function(){
  const campo=document.getElementById('loginEmail');
  const aviso=document.getElementById('loginErr');
  const email=(campo?.value||'').trim().toLowerCase();
  if(!email||!email.includes('@')){aviso.textContent='Informe seu e-mail para reenviar a confirmação.';return;}
  const btn=document.getElementById('btnReenviarConfirmacao');
  if(btn)btn.disabled=true;
  try{
    const r=await fetch(SB+'/auth/v1/resend',{
      method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({type:'signup',email})
    });
    if(r.status===429)erro('Muitas solicitações. Tente novamente mais tarde.');
    if(!r.ok)erro('Não foi possível reenviar a confirmação. Tente novamente.');
    aviso.textContent='Se houver um cadastro pendente, enviaremos uma nova mensagem de confirmação. Confira também a pasta de spam.';
  }catch(e){aviso.textContent=e.message||'Falha de conexão. Tente novamente.';}
  finally{if(btn)btn.disabled=false;}
};
window.solicitarRecuperacaoSenha=async function(){
  const campo=document.getElementById('loginEmail');
  const aviso=document.getElementById('loginErr');
  const botao=document.getElementById('btnRecuperarSenha');
  const email=(campo&&campo.value||'').trim().toLowerCase();
  if(!email||!email.includes('@')){
    aviso.textContent='Digite seu e-mail no campo acima para recuperar a senha.';
    if(campo)campo.focus();
    return;
  }
  aviso.textContent='Enviando instruções de recuperação…';
  if(botao)botao.disabled=true;
  try{
    const destino='https://hubdoalergista.pages.dev/';
    const r=await fetch(SB+'/auth/v1/recover?redirect_to='+encodeURIComponent(destino),{
      method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    if(r.status===429)erro('Muitas solicitações. Tente novamente mais tarde.');
    if(!r.ok)erro('Não foi possível enviar as instruções de recuperação. Tente novamente.');
    aviso.textContent='Se houver uma conta com esse e-mail, você receberá as instruções para redefinir a senha. Confira também a pasta de spam.';
  }catch(e){aviso.textContent=e.message||'Falha de conexão. Tente novamente.';}
  finally{if(botao)botao.disabled=false;}
};
window.abrirCadastroExistente=function(){
  const email=(document.getElementById('loginEmail')?.value||'').trim().toLowerCase();
  if(typeof window.authModo==='function')window.authModo('cadastro');
  const emailCampo=document.getElementById('cadEmail');
  if(emailCampo)emailCampo.value=email;
  try{
    const u=JSON.parse(sessionStorage.getItem('hub_users')||'{}')[email]||{};
    const nome=document.getElementById('cadNome');
    const categoria=document.getElementById('cadCategoria');
    if(nome&&u.nome)nome.value=u.nome;
    if(categoria&&u.categoria)categoria.value=u.categoria;
    if(typeof window._cadCatMudou==='function')window._cadCatMudou();
    const especialidade=document.getElementById('cadEspecialidade');
    if(especialidade&&u.especialidade)especialidade.value=u.especialidade;
  }catch(_){}
  const aviso=document.getElementById('cadErr');
  if(aviso)aviso.textContent='Seu cadastro anterior pode estar salvo apenas neste navegador. Para voltar a entrar com segurança, crie uma conta com esse e-mail e confirme a mensagem que receber.';
};
function mostrarRecuperacaoSenha(){
  const tela=document.getElementById('authScreen');
  const form=document.getElementById('formRedefinirSenha');
  if(!tela||!form)return;
  tela.style.display='flex';
  ['formLogin','formCad','formCodigo'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.style.display='none';
  });
  const tabs=document.querySelector('.auth-tabs');
  if(tabs)tabs.style.display='none';
  form.style.display='';
  const senha=document.getElementById('novaSenhaHub');
  if(senha)senha.focus();
}
async function recuperarRetorno(){
  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  const search=new URLSearchParams(location.search);
  if((hash.get('type')||search.get('type'))!=='recovery')return;
  // Evita manter tokens de recuperação no histórico, em capturas ou em links compartilhados.
  if(typeof history!=='undefined'&&history.replaceState)
    history.replaceState(null,'',location.pathname);
  let access=hash.get('access_token'),refresh=hash.get('refresh_token');
  try{
    const tokenHash=hash.get('token_hash')||search.get('token_hash');
    if(!access&&tokenHash){
      const v=await fetch(SB+'/auth/v1/verify',{
        method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
        body:JSON.stringify({token_hash:tokenHash,type:'recovery'})
      });
      const d=await v.json();
      if(!v.ok)erro('Link de recuperação inválido ou expirado.');
      access=d.access_token;refresh=d.refresh_token;
    }
    if(!access)erro('O link de recuperação está incompleto. Solicite um novo.');
    const r=await fetch(SB+'/auth/v1/user',{
      headers:{apikey:KEY,Authorization:'Bearer '+access}
    });
    if(!r.ok)erro('O link de recuperação expirou. Solicite um novo.');
    const u=await r.json();
    if(!u||!u.email)erro('Não foi possível validar o titular da conta.');
    recuperacaoPendente={access,refresh,email:u.email,nome:u.user_metadata&&u.user_metadata.nome||u.email};
    mostrarRecuperacaoSenha();
  }catch(e){
    const aviso=document.getElementById('loginErr');
    if(aviso)aviso.textContent=e.message||'Não foi possível validar o link de recuperação.';
    if(typeof window.abrirAuth==='function')window.abrirAuth('login');
  }
}
window.redefinirSenhaHub=async function(){
  const aviso=document.getElementById('novaSenhaErrHub');
  const senha=document.getElementById('novaSenhaHub')?.value||'';
  const repetida=document.getElementById('novaSenhaConfirmacaoHub')?.value||'';
  const botao=document.getElementById('btnSalvarNovaSenhaHub');
  if(!recuperacaoPendente){aviso.textContent='Solicite um novo link de recuperação.';return;}
  if(senha.length<12){aviso.textContent='Crie uma senha com pelo menos 12 caracteres.';return;}
  if(senha!==repetida){aviso.textContent='As senhas não coincidem.';return;}
  if(botao)botao.disabled=true;
  aviso.textContent='Atualizando sua senha…';
  try{
    const r=await fetch(SB+'/auth/v1/user',{
      method:'PUT',headers:{apikey:KEY,Authorization:'Bearer '+recuperacaoPendente.access,'Content-Type':'application/json'},
      body:JSON.stringify({password:senha})
    });
    if(!r.ok)erro('Não foi possível alterar a senha. Solicite um novo link.');
    const email=recuperacaoPendente.email;
    fetch(SB+'/auth/v1/logout',{
      method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+recuperacaoPendente.access}
    }).catch(()=>{});
    recuperacaoPendente=null;
    limparCredenciais();
    const form=document.getElementById('formRedefinirSenha');
    if(form)form.style.display='none';
    if(typeof window.authModo==='function')window.authModo('login');
    const campo=document.getElementById('loginEmail');
    if(campo)campo.value=email;
    document.getElementById('loginErr').textContent='Senha alterada. Entre com sua nova senha.';
  }catch(e){aviso.textContent=e.message||'Erro ao atualizar a senha.';}
  finally{if(botao)botao.disabled=false;}
};
window.fazerCadastro=async function(){
  const get=id=>(document.getElementById(id)||{}).value||'';
  const aviso=document.getElementById('cadErr');
  const botao=document.querySelector('#formCad button.auth-btn');
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
  aviso.textContent='Solicitando cadastro…';
  if(botao){botao.disabled=true;botao.textContent='Enviando…';}
  try{
    const r=await fetch(SB+'/auth/v1/signup?redirect_to='+encodeURIComponent('https://hubdoalergista.pages.dev/'),{method:'POST',
      headers:{apikey:KEY,'Content-Type':'application/json'},
      body:JSON.stringify({email,password:senha,data:meta})});
    const d=await r.json().catch(()=>({}));
    if(!r.ok){
      const code=String(d.error_code||d.code||d.error||'').toLowerCase();
      const detalhe=String(d.msg||d.message||d.error_description||'');
      if(r.status===429||code.includes('rate_limit'))
        erro('O servidor atingiu o limite de solicitações de e-mail. Aguarde e tente novamente mais tarde.');
      if(code.includes('email_address_not_authorized'))
        erro('O serviço de e-mail ainda não está habilitado para este destinatário. O administrador precisa configurar SMTP próprio no Supabase.');
      if(/sending.*email|email.*sending|smtp|mailer/i.test(detalhe))
        erro('O servidor não conseguiu enviar a mensagem de confirmação. Avise o administrador do Hub.');
      if(/already.registered|already.exists/i.test(code+' '+detalhe))
        erro('Se já possui cadastro, use Entrar ou Esqueci minha senha, na tela inicial.');
      erro('Não foi possível solicitar o cadastro ('+r.status+'). Tente novamente ou entre em contato com o administrador.');
    }
    if(d.access_token&&d.refresh_token){
      if(typeof _salvarLocal==='function')_salvarLocal(email,meta);
      window._iniciarSessao(email,nome,d.access_token,d.refresh_token);
    }else{
      // O Supabase pode devolver 200 para um e-mail já cadastrado sem enviar e-mail.
      // Não presumir que a mensagem foi enviada; oferecer acesso à conta existente.
      window._cadPendente={email,nome,meta};
      if(typeof window._mostrarCodigo==='function')window._mostrarCodigo(email);
      const status=document.getElementById('cadEnvioStatus');
      if(status)status.textContent='Solicitação recebida. Se esta for uma nova conta, procure o código ou link de confirmação no e-mail e no spam. Caso já possua cadastro, utilize Entrar ou Esqueci minha senha.';
    }
    aviso.textContent='';
  }catch(e){
    const m=String(e&&e.message||'');
    aviso.textContent=/failed to fetch|networkerror|load failed/i.test(m)
      ?'Não foi possível conectar ao servidor de cadastro. Verifique a conexão e tente novamente.'
      :m||'Falha ao solicitar cadastro.';
  }finally{
    if(botao){botao.disabled=false;botao.textContent='Criar conta →';}
  }
};
const sairOriginal=window.fazerLogout;
window.fazerLogout=function(){
  const a=lerAuth();
  if(a.access)fetch(SB+'/auth/v1/logout',{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+a.access}}).catch(()=>{});
  limparCredenciais();
  try{sessionStorage.removeItem('hub_snot22_hist');sessionStorage.removeItem('hub_uct_hist');}catch(_){}
  if(typeof sairOriginal==='function')sairOriginal();
  if(typeof window._bloquearApp==='function')window._bloquearApp();
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
  const p=document.createElement('p');p.textContent='O acesso aos conteúdos é livre. Preferências são armazenadas neste navegador; registros clínicos protegidos no servidor não são disponibilizados sem autenticação.';p.style.cssText='font-size:11px;line-height:1.45;color:#495866;margin:0 0 7px;';wrap.appendChild(p);
  function add(label,fn){
    const b=document.createElement('button');b.type='button';b.textContent=label;
    b.style.cssText='display:block;width:100%;text-align:left;padding:8px 10px;margin-top:5px;border:1px solid #dbe5eb;border-radius:8px;background:#f5f9fa;color:#0d1f2d;font-family:inherit;font-size:11.5px;line-height:1.4;font-weight:500;cursor:pointer;';
    b.addEventListener('click',fn);wrap.appendChild(b);
  }
  add('Política de privacidade',()=>location.assign('privacidade.html'));
  add('Limpar histórico dos questionários e chaves de IA',limparDadosLocais);
  add('Limpar preferências deste dispositivo',()=>{
    if(!confirm('Apagar as áreas de interesse selecionadas neste dispositivo?'))return;
    localStorage.removeItem('hub_public_interesses');
    if(typeof window.preencherPerfil==='function')window.preencherPerfil();
    if(typeof window.atualizarHero==='function')window.atualizarHero();
    if(typeof window.carregarFeedHome==='function')window.carregarFeedHome(true);
  });
  add('Privacidade no uso da inteligência artificial',()=>location.assign('privacidade.html#ia'));
  destino.appendChild(wrap);
}
async function validarSessaoNaAbertura(){
  const sessao=lerAuth();
  if(!sessao.access && !sessao.refresh){
    limparCredenciais();
    return;
  }
  try{
    const jwt=await token();
    const resposta=await fetch(SB+'/auth/v1/user',{
      method:'GET',
      headers:{apikey:KEY,Authorization:'Bearer '+jwt},
      cache:'no-store'
    });
    // Ignorar respostas de uma sessão anterior se houve novo login ou saída.
    if(lerAuth().access!==jwt)return;
    if(resposta.status===401||resposta.status===403){
      limparCredenciais();
      return;
    }
    if(!resposta.ok)erro('Não foi possível validar a sessão.');
    const usuario=await resposta.json();
    if(!usuario || !usuario.id || !usuario.email){
      limparCredenciais();
      return;
    }
    const meta=usuario.user_metadata||{};
    manterIdentidade(usuario.email,meta.nome||usuario.email);
    if(typeof window._salvarLocal==='function')window._salvarLocal(usuario.email,meta);
    if(typeof window._mostrarApp==='function')window._mostrarApp();
    if(typeof window._atualizarInfoUsuario==='function')window._atualizarInfoUsuario();
    try{if(typeof window.atualizarHero==='function')window.atualizarHero();}catch(_){}
  }catch(e){
    // Falha na conexão não autoriza abrir o aplicativo sem validação.
    if(typeof window._bloquearApp==='function')window._bloquearApp();
    const aviso=document.getElementById('loginErr');
    if(aviso)aviso.textContent='Não foi possível validar sua sessão. Entre novamente para continuar.';
  }
}
async function confirmarRetornoCadastro(){
  const hash=new URLSearchParams(location.hash.replace(/^#/,''));
  const search=new URLSearchParams(location.search);
  const tipo=hash.get('type')||search.get('type');
  if(tipo!=='signup'&&tipo!=='email')return;
  let access=hash.get('access_token'),refresh=hash.get('refresh_token');
  const tokenHash=hash.get('token_hash')||search.get('token_hash');
  if(history&&history.replaceState)history.replaceState(null,'',location.pathname);
  try{
    if(!access&&tokenHash){
      const resp=await fetch(SB+'/auth/v1/verify',{
        method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},
        body:JSON.stringify({token_hash:tokenHash,type:tipo})
      });
      const dados=await resp.json().catch(()=>({}));
      if(!resp.ok)erro('O link de confirmação é inválido ou expirou.');
      access=dados.access_token;refresh=dados.refresh_token;
    }
    if(!access||!refresh)erro('Não foi possível concluir a confirmação. Entre com seu e-mail e senha.');
    const resp=await fetch(SB+'/auth/v1/user',{
      headers:{apikey:KEY,Authorization:'Bearer '+access},cache:'no-store'
    });
    if(!resp.ok)erro('Não foi possível validar o link de confirmação.');
    const usuario=await resp.json();
    if(!usuario||!usuario.id||!usuario.email)erro('Os dados da conta não foram confirmados.');
    const meta=usuario.user_metadata||{};
    if(typeof window._salvarLocal==='function')window._salvarLocal(usuario.email,meta);
    window._iniciarSessao(usuario.email,meta.nome||usuario.email,access,refresh);
  }catch(e){
    const aviso=document.getElementById('loginErr');
    if(aviso)aviso.textContent=e.message||'Não foi possível validar a confirmação de e-mail.';
    if(typeof window.abrirAuth==='function')window.abrirAuth('login');
  }
}
function inicializar(){
  limparChavesLegadas();
  // Migrar somente as preferências não sensíveis antes de descartar as sessões anteriores.
  try{
    if(!localStorage.getItem('hub_public_interesses')){
      const sessao=JSON.parse(localStorage.getItem('hub_session')||'{}');
      const usuarios=JSON.parse(sessionStorage.getItem('hub_users')||localStorage.getItem('hub_users')||'{}');
      const ints=(usuarios[sessao.email]||{}).interesses;
      if(Array.isArray(ints))localStorage.setItem('hub_public_interesses',JSON.stringify(ints.slice(0,3)));
    }
  }catch(_){}
  limparCredenciais();
  try{localStorage.removeItem('hub_users');}catch(_){}
  telaPrivacidade();
  if(typeof window._mostrarApp==='function')window._mostrarApp();
  if(typeof window.atualizarHero==='function')window.atualizarHero();
  if(typeof window.filtrarHomeArtigos==='function')window.filtrarHomeArtigos();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inicializar);else inicializar();
})();
