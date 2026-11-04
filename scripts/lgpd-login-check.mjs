import fs from 'node:fs';
import assert from 'node:assert/strict';

const runtime=fs.readFileSync('lgpd-runtime.js','utf8');
const pagina=fs.readFileSync('index.html','utf8');
const privacidade=fs.readFileSync('privacidade.html','utf8');
const worker=fs.readFileSync('sw.js','utf8');

assert(pagina.includes('id="btnEntrarHub"'));
assert(pagina.includes('id="btnRecuperarSenha"'));
assert(pagina.includes('id="btnReenviarConfirmacao"'));
assert(pagina.includes('id="btnCadastroAntigo"'));
assert(pagina.includes('id="formRedefinirSenha"'));
assert(runtime.includes("window.redefinirSenhaHub"));
assert(runtime.includes("window.reenviarConfirmacaoHub"));
assert(runtime.includes("font-size:11.5px;line-height:1.4"));
assert(privacidade.includes('body{font-size:12.5px'));
assert(worker.includes('lgpd-runtime.js?v=20261104-3'));
assert(pagina.includes('lgpd-runtime.js?v=20261104-3'));
new Function(runtime);

function armazenamento(){
  const dados=new Map();
  return {getItem:key=>dados.get(key)||null,setItem:(key,value)=>dados.set(key,String(value)),
    removeItem:key=>dados.delete(key),key:index=>[...dados.keys()][index],
    get length(){return dados.size;}};
}
function cenario(correto){
  const sessionStorage=armazenamento(),localStorage=armazenamento();
  const campos={
    loginEmail:{value:'usuario@example.com'},loginSenha:{value:'senha-simulada'},
    loginErr:{textContent:''},btnEntrarHub:{textContent:'Entrar',disabled:false},
    btnCadastroAntigo:{hidden:true},btnReenviarConfirmacao:{hidden:true},
    authScreen:{style:{display:'flex'}}
  };
  const document={readyState:'loading',getElementById:id=>campos[id]||null,
    addEventListener:()=>{},querySelector:()=>null};
  const window={_salvarLocal:()=>{},_mostrarApp:()=>{},_atualizarInfoUsuario:()=>{},toast:()=>{}};
  const fetch=async url=>{
    if(url.includes('grant_type=password')){
      return correto ? {ok:true,status:200,json:async()=>({
        access_token:'cabecalho.payload.assinatura',refresh_token:'token-de-teste',
        user:{user_metadata:{nome:'Pessoa de Teste'}}
      })}:{ok:false,status:400,json:async()=>({error_code:'invalid_credentials'})};
    }
    return {ok:true,status:200,json:async()=>({})};
  };
  const executar=new Function('window','document','sessionStorage','localStorage','fetch',
    'atob','alert','confirm','URLSearchParams','location','history',runtime);
  executar(window,document,sessionStorage,localStorage,fetch,()=>JSON.stringify({exp:4102444800}),
    ()=>{},()=>true,URLSearchParams,
    {origin:'https://hubdoalergista.pages.dev',hash:'',search:'',pathname:'/'},
    {replaceState:()=>{}});
  return {window,campos,sessionStorage,localStorage};
}

const valido=cenario(true);
await valido.window.fazerLogin();
assert(valido.sessionStorage.getItem('hub_secure_auth'));
assert(!valido.localStorage.getItem('hub_session').includes('token-de-teste'));
assert.equal(valido.campos.loginSenha.value,'');
assert.equal(valido.campos.authScreen.style.display,'none');

const invalido=cenario(false);
await invalido.window.fazerLogin();
assert(invalido.campos.loginErr.textContent.includes('E-mail ou senha incorretos'));
assert(!invalido.sessionStorage.getItem('hub_secure_auth'));

console.log('Testes de login e privacidade concluídos com sucesso (simulação local).');
