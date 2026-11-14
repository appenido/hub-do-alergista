/* Hub do Alergista - verificacao documental SEM inteligencia artificial.
   Dados de bula por /interacoes (openFDA SPL); Medscape abre site original. */
(function(){
'use strict';
const AZUL='#1e5490', BORDA='#dce6f0';
function criar(tag,texto,estilo){
  const el=document.createElement(tag);
  if(texto!==undefined&&texto!==null)el.textContent=texto;
  if(estilo)el.style.cssText=estilo;
  return el;
}
function botaoMedscape(){
  const b=criar('button','Conferir combinações no Medscape ↗',
    'background:#eaf3fc;color:#1e5490;border:1px solid #a9c7e9;border-radius:10px;padding:12px;font:700 12.5px Manrope,sans-serif;width:100%;cursor:pointer;margin-top:12px');
  b.type='button';
  b.addEventListener('click',function(){
    if(typeof abrirMedscapeInteracao==='function')abrirMedscapeInteracao();
    else window.open('https://reference.medscape.com/drug-interactionchecker','_blank','noopener,noreferrer');
  });
  return b;
}
function mensagem(box,titulo,descricao){
  box.style.display='block';box.style.whiteSpace='normal';box.replaceChildren();
  box.appendChild(criar('div',titulo,'font-size:14px;font-weight:800;margin-bottom:7px'));
  box.appendChild(criar('p',descricao,'font-size:12px;color:#52677a;line-height:1.55'));
  box.appendChild(botaoMedscape());
}
function dataFDA(yyyymmdd){
  if(!/^\d{8}$/.test(yyyymmdd||''))return 'Data não informada';
  return yyyymmdd.slice(6,8)+'/'+yyyymmdd.slice(4,6)+'/'+yyyymmdd.slice(0,4);
}
function linkOficial(link,texto){
  const a=criar('a',texto||'Ver bula original ↗',
    'display:inline-block;color:#176b91;font-size:11.5px;font-weight:800;text-decoration:underline;margin-top:8px;overflow-wrap:anywhere');
  a.href=link;a.target='_blank';a.rel='noopener noreferrer';a.referrerPolicy='no-referrer';
  return a;
}
function avisoTexto(p){
  return criar('p',p,'font-size:12px;color:#506475;line-height:1.55;margin:8px 0');
}
function renderizar(box,d){
  box.style.display='block';box.style.whiteSpace='normal';box.replaceChildren();
  const bulas=Array.isArray(d.bulas)?d.bulas:[];
  const pares=Array.isArray(d.pares)?d.pares:[];
  box.appendChild(criar('div','Consulta documental de interações',
    'font-size:15px;font-weight:800;color:#102f45;margin-bottom:5px'));
  box.appendChild(avisoTexto('Fonte: bulas dos Estados Unidos via openFDA. Consulta sem IA em '+new Date(d.dataConsulta||Date.now()).toLocaleString('pt-BR')+'. Os textos originais estão em inglês.'));
  const encontrados=bulas.filter(x=>x.status==='encontrado').length;
  box.appendChild(criar('div',encontrados+' de '+bulas.length+' medicamento(s) com bula localizada',
    'font-size:12px;font-weight:700;color:#285a78;margin-bottom:14px'));
  const aviso=criar('div','Esta ferramenta não determina que um par é seguro ou contraindicado. Ela localiza menções nas bulas; a ausência de menção não exclui interação.',
    'font-size:12px;line-height:1.6;padding:11px;background:#fff6e6;border-left:3px solid #bb8722;border-radius:8px;color:#79571e;margin-bottom:14px');
  box.appendChild(aviso);
  if(pares.length){
    box.appendChild(criar('div','Combinações informadas','font-size:13px;font-weight:800;margin:7px 0 10px'));
    pares.forEach(function(p){
      const qtd=Array.isArray(p.mencoes)?p.mencoes.length:0;
      const card=criar('details',undefined,
        'border:1px solid '+BORDA+';border-radius:11px;margin-bottom:9px;background:#fff;overflow:hidden');
      const sum=criar('summary',undefined,
        'list-style-position:inside;cursor:pointer;padding:13px;font-size:12.5px;font-weight:800;color:#1a3f54;line-height:1.6');
      sum.textContent=(p.par||[]).join(' + ');
      const st=criar('div',qtd?'Menção textual encontrada em bula':'Sem menção explícita na seção consultada',
        'padding:0 13px 11px;font-size:11.5px;color:'+(qtd?'#73521b':'#66788a'));
      card.appendChild(sum);card.appendChild(st);
      const body=criar('div',undefined,'padding:0 13px 13px;line-height:1.65;font-size:12px;color:#425769');
      if(qtd){
        body.appendChild(avisoTexto('Menção textual não equivale, isoladamente, à confirmação de interação clínica.'));
        p.mencoes.forEach(function(m){
          const trecho=criar('div',undefined,'border-top:1px solid #e5ebf0;padding:10px 0');
          trecho.appendChild(criar('div','Bula: '+m.medicamento,
            'font-size:11px;font-weight:800;color:#1b506c;margin-bottom:4px'));
          trecho.appendChild(criar('div',m.trecho,'font-size:11.5px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere'));
          trecho.appendChild(linkOficial(m.link));
          body.appendChild(trecho);
        });
      }else{
        body.appendChild(avisoTexto('Não foi localizada uma menção direta entre estes nomes nas seções retornadas. Isso NÃO significa ausência de interação. Uma bula ausente ou uma interação descrita somente por classe farmacológica pode não ser identificada.'));
      }
      card.appendChild(body);box.appendChild(card);
    });
  }
  box.appendChild(criar('div','Bulas consultadas — expanda para ler','font-size:13px;font-weight:800;margin:18px 0 9px'));
  bulas.forEach(function(b){
    const card=criar('details',undefined,'border:1px solid '+BORDA+';border-radius:11px;margin-bottom:9px;background:#fbfcff;overflow:hidden');
    const sum=criar('summary',b.medicamento+(b.status==='encontrado'?' · '+(b.nome||'bula'):' · não localizada'),
      'cursor:pointer;padding:13px;font-size:12px;font-weight:800;color:#1b415c;overflow-wrap:anywhere');
    card.appendChild(sum);
    const cont=criar('div',undefined,'padding:0 13px 15px');
    if(b.status==='encontrado'){
      cont.appendChild(avisoTexto((b.marca?'Marca: '+b.marca+' · ':'')+'Atualização da bula: '+dataFDA(b.atualizado)));
      if(b.temSecao){
        const sec=criar('div',b.secaoInteracoes,
          'font-size:11.5px;white-space:pre-wrap;line-height:1.65;color:#32495c;overflow-wrap:anywhere;max-height:420px;overflow-y:auto;border:1px solid #e4eaf0;border-radius:8px;padding:12px;background:#fff');
        cont.appendChild(sec);
        if(b.secaoTruncada)cont.appendChild(avisoTexto('Texto parcial devido ao limite de exibição. Consulte a bula integral.'));
      }else cont.appendChild(avisoTexto('O registro foi localizado, mas não apresenta uma seção estruturada de interações medicamentosas na resposta consultada.'));
      cont.appendChild(linkOficial(b.link));
    }else{
      const falha=b.status==='limite'?'Limite temporário da fonte pública atingido.':
        b.status==='indisponivel'?'Não foi possível consultar a fonte pública.':
        'Sem correspondência confirmada na base norte-americana.';
      cont.appendChild(avisoTexto(falha+' Não se pode inferir ausência de interação.'));
    }
    card.appendChild(cont);box.appendChild(card);
  });
  box.appendChild(botaoMedscape());
  box.appendChild(avisoTexto('Use também a bula brasileira (Anvisa) e uma base especializada de interações. A base openFDA é norte-americana e não cobre todos os medicamentos registrados no Brasil.'));
}
async function consultarInteracoesSemIA(){
  const box=document.getElementById('diResultado');
  const btn=document.getElementById('diVerificarBtn');
  if(!box||!btn)return;
  let nomes=typeof diColetarMeds==='function'?diColetarMeds():[];
  const conhecidos=new Set();
  nomes=nomes.filter(function(n){
    const key=n.toLocaleLowerCase('pt-BR').trim();
    if(conhecidos.has(key))return false;
    conhecidos.add(key);return true;
  });
  if(nomes.length<2){mensagem(box,'Informe pelo menos dois medicamentos','Insira dois princípios ativos diferentes para consultar as bulas.');return;}
  if(nomes.length>12){mensagem(box,'Limite de medicamentos','Consulte até 12 medicamentos por vez. Para listas maiores, divida a consulta em grupos.');return;}
  const ac=new AbortController();
  const timer=setTimeout(function(){ac.abort();},55000);
  btn.disabled=true;
  btn.textContent='Consultando bulas…';
  box.style.display='block';
  box.style.whiteSpace='normal';
  box.replaceChildren(criar('div','Consultando a base pública de bulas da FDA…',
    'color:#23435b;font-size:13px;font-weight:700;padding:8px 0'));
  try{
    const r=await fetch('/interacoes',{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({medicamentos:nomes}),cache:'no-store',signal:ac.signal
    });
    const d=await r.json().catch(function(){return null;});
    if(!r.ok||!d||!Array.isArray(d.bulas)){
      mensagem(box,'Não foi possível consultar as bulas',
        (d&&d.erro?d.erro+' ':'')+'Não há resultado de interação confirmado. Use a consulta especializada do Medscape.');
      return;
    }
    renderizar(box,d);
  }catch(e){
    mensagem(box,'Fonte pública temporariamente indisponível',
      e&&e.name==='AbortError'?'A consulta excedeu o tempo limite. Nenhuma interação foi descartada.':
        'Falha de comunicação com a base de bulas. Nenhuma interação foi descartada.');
  }finally{
    clearTimeout(timer);btn.disabled=false;btn.textContent='Consultar bulas sem IA';
  }
}
window.consultarInteracoesSemIA=consultarInteracoesSemIA;
})();
