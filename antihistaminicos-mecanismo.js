/* Hub do Alergista — receptor H1 em uma unica cena WebGL tridimensional.
   Esquema estrutural didatico inspirado em PDB 3RZE; NAO e dinamica molecular. */
(function(){
'use strict';
var oldInit=window.ahInit;
if(typeof oldInit!=='function')return;
var ready=null, world=null, raf=0, last=0, elapsed=0, paused=false, manual=null, dragging=false, yaw=0;
var duration=16800, reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var root, details, status, phaseText, meter, playBtn;
var phases={
 basal:{tag:'01 · SEM LIGANTE',title:'Atividade constitutiva basal',text:'O receptor H1 pode alternar espontaneamente entre conformações ativas e inativas, mesmo sem histamina.',level:'Atividade basal'},
 hist:{tag:'02 · HISTAMINA',title:'Agonismo: receptor ativado',text:'A histamina se liga ao receptor H1 e favorece seu estado ativo, ampliando a sinalização intracelular.',level:'Sinalização elevada'},
 inverse:{tag:'03 · ANTI-H1',title:'Agonismo inverso: estado inativo',text:'O anti-histamínico H1 estabiliza preferencialmente a conformação inativa e reduz a atividade constitutiva.',level:'Sinalização reduzida'}
};
var html=[
'<details class="ah-mechanism ah3d" id="ahMechanism">',
'<summary><span class="ah-mech-icon" aria-hidden="true">H₁</span><span class="ah-mech-label">Entenda o mecanismo de ação dos anti-histamínicos<small>Uma animação molecular 3D · histamina e agonismo inverso</small></span><span class="ah-mech-arrow" aria-hidden="true">⌄</span></summary>',
'<div class="ah3d-content">',
'<div class="ah3d-intro"><div class="ah3d-eyebrow">FARMACODINÂMICA · RECEPTOR H1</div><h3>O receptor H1 em três dimensões</h3><p>Da ativação pela histamina à estabilização do estado inativo pelo anti-H1.</p></div>',
'<div class="ah3d-stage" id="ah3dStage"><canvas id="ah3dCanvas" aria-label="Representação tridimensional do receptor H1, membrana celular, histamina e anti-histamínico"></canvas>',
'<div class="ah3d-grain" aria-hidden="true"></div><div class="ah3d-top"><span class="ah3d-live"><span class="ah3d-live-dot"></span> MODELO 3D INTERATIVO</span><span class="ah3d-place">MEIO EXTRACELULAR</span></div>',
'<div class="ah3d-key"><span><i class="ah3d-dot ah3d-dot-protein"></i>Receptor H1</span><span><i class="ah3d-dot ah3d-dot-hist"></i>Histamina</span><span><i class="ah3d-dot ah3d-dot-drug"></i>Anti-H1</span></div>',
'<div class="ah3d-bottom">CITOPLASMA <span>↔ Arraste para girar o modelo</span></div>',
'<div class="ah3d-loading" id="ah3dLoading" role="status">Preparando visualização tridimensional…</div>',
'</div>',
'<div class="ah3d-info" aria-live="polite"><div class="ah3d-step" id="ah3dStep">01 · SEM LIGANTE</div><div class="ah3d-info-title" id="ah3dTitle">Atividade constitutiva basal</div><p id="ah3dText">O receptor H1 pode alternar espontaneamente entre estados ativos e inativos.</p><div class="ah3d-signal"><span id="ah3dSignalLabel">Atividade basal</span><div class="ah3d-meter"><span id="ah3dMeter"></span></div></div></div>',
'<div class="ah3d-controls"><div class="ah3d-modes" role="group" aria-label="Estado do receptor"><button type="button" data-ah3d-mode="basal" aria-pressed="true">Sem ligante</button><button type="button" data-ah3d-mode="hist" aria-pressed="false">Histamina</button><button type="button" data-ah3d-mode="inverse" aria-pressed="false">Anti-H1</button></div>',
'<div class="ah3d-actions"><button type="button" data-ah3d-play>↻ Reproduzir</button><button type="button" data-ah3d-pause aria-pressed="false">Ⅱ Pausar</button></div></div>',
'<div class="ah3d-track" aria-hidden="true"><span id="ah3dProgress"></span></div>',
'<p class="ah3d-note">Visualização estrutural ilustrativa baseada na arquitetura de sete hélices do H1 e inspirada na estrutura experimental 3RZE (H1–doxepina). Os ligantes, deslocamentos e sinais são esquemáticos, não trajetórias atômicas medidas. <a href="https://www.rcsb.org/structure/3RZE" target="_blank" rel="noopener noreferrer">Estrutura H1 · PDB 3RZE</a> · <a href="https://doi.org/10.1038/nature10236" target="_blank" rel="noopener noreferrer">Shimamura et al., Nature 2011</a>.</p>',
'</div></details>'
].join('');
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function smooth(a){var x=clamp(a,0,1);return x*x*(3-2*x);}
function dims(){if(!world)return;var rect=world.canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;world.camera.aspect=rect.width/rect.height;world.camera.updateProjectionMatrix();world.renderer.setSize(rect.width,rect.height,false);}
function build(THREE,canvas){
 var renderer=new THREE.WebGLRenderer({canvas:canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.8));
 renderer.setClearColor(0x071a2b,0);
 if(THREE.SRGBColorSpace)renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.28;
 var scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(42,1,.1,80);
 scene.fog=new THREE.FogExp2(0x081e33,.014);
 camera.position.set(6.5,3.5,8.2);camera.lookAt(0,0,0);
 scene.add(new THREE.HemisphereLight(0xdaf7ff,0x284c71,2.5));
 var area=new THREE.DirectionalLight(0xd9f9ff,3.4);area.position.set(-4,8,6);scene.add(area);
 var edge=new THREE.PointLight(0x63c5ea,70,15,2);edge.position.set(3,-1,-4);scene.add(edge);
 var warm=new THREE.PointLight(0xffb882,55,13,2);warm.position.set(-5,4,0);scene.add(warm);
 var group=new THREE.Group();scene.add(group);
 var protein=new THREE.Group();group.add(protein);
 var matProtein=[
  new THREE.MeshPhysicalMaterial({color:0x63c2e6,roughness:.32,metalness:.16,clearcoat:.58,clearcoatRoughness:.22}),
  new THREE.MeshPhysicalMaterial({color:0x3da4cb,roughness:.37,metalness:.17,clearcoat:.54}),
  new THREE.MeshPhysicalMaterial({color:0x5c99df,roughness:.38,metalness:.17,clearcoat:.48}),
  new THREE.MeshPhysicalMaterial({color:0x6bcacb,roughness:.33,metalness:.13,clearcoat:.45})
 ];
 function tube(points,r,mat,steps){var curve=new THREE.CatmullRomCurve3(points);var m=new THREE.Mesh(new THREE.TubeGeometry(curve,steps||50,r,9,false),mat);return m;}
 var centers=[];
 for(var k=0;k<7;k++){
  var angle=k*Math.PI*2/7+.27;
  var xx=Math.cos(angle)*1.04,zz=Math.sin(angle)*.92;centers.push([xx,zz]);
  var points=[],shift=(k%2===0?1:-1);
  for(var j=0;j<=85;j++){
   var u=j/85, y=-1.84+u*3.68;
   var theta=u*Math.PI*12+angle;
   points.push(new THREE.Vector3(xx+Math.cos(theta)*.13+Math.sin(u*5+k)*.055,
       y,zz+Math.sin(theta)*.13+Math.cos(u*4+k)*.055));
  }
  var helix=tube(points,.155,matProtein[k%4],170);
  helix.rotation.y=angle;protein.add(helix);
  if(k===5)protein.userData.helix6=helix;
  var nxt=(k+1)%7;
  if(k<6){
   var a1=(k+.27)*Math.PI*2/7,a2=(nxt+.27)*Math.PI*2/7;
   var yEnd=k%2===0?1.75:-1.75;
   var loop=[new THREE.Vector3(xx,yEnd,zz),
    new THREE.Vector3((xx+Math.cos(a2)*1.04)*.5,yEnd+(k%2===0?.62:-.62),(zz+Math.sin(a2)*.92)*.5),
    new THREE.Vector3(Math.cos(a2)*1.04,yEnd,Math.sin(a2)*.92)];
   protein.add(tube(loop,.088,matProtein[(k+1)%4],30));
  }
 }
 var pocket=new THREE.Mesh(new THREE.SphereGeometry(.46,24,16),new THREE.MeshPhysicalMaterial({color:0x72bddd,transparent:true,opacity:.20,roughness:.2,metalness:.18,depthWrite:false}));
 pocket.position.set(0,1.36,0);protein.add(pocket);
 var lipidHead=new THREE.MeshPhysicalMaterial({color:0x6dbcc9,transparent:true,opacity:.62,roughness:.35,metalness:.07,depthWrite:false});
 var lipidTail=new THREE.MeshStandardMaterial({color:0x306e8f,transparent:true,opacity:.3,roughness:.75,depthWrite:false});
 var globe=new THREE.SphereGeometry(.105,10,9),stick=new THREE.CylinderGeometry(.023,.023,.46,6);
 var heads=[],tails=[];
 var dummy=new THREE.Object3D();
 for(var x=-4.0;x<=4.1;x+=.47)for(var z=-2.9;z<=3.0;z+=.47){
  if(x*x+z*z<2.9)continue;
  for(var side of [-1,1]){
   heads.push([x+(z%2)*.07,side*.62,z]);
   for(var t of [-1,1])tails.push([x+t*.075,side*.22,z]);
  }
 }
 var headMesh=new THREE.InstancedMesh(globe,lipidHead,heads.length);
 heads.forEach(function(p,i){dummy.position.set(p[0],p[1],p[2]);dummy.scale.setScalar(.8);dummy.updateMatrix();headMesh.setMatrixAt(i,dummy.matrix);});
 headMesh.instanceMatrix.needsUpdate=true;group.add(headMesh);
 var tailMesh=new THREE.InstancedMesh(stick,lipidTail,tails.length);
 tails.forEach(function(p,i){dummy.position.set(p[0],p[1],p[2]);dummy.scale.setScalar(.85);dummy.updateMatrix();tailMesh.setMatrixAt(i,dummy.matrix);});
 tailMesh.instanceMatrix.needsUpdate=true;group.add(tailMesh);
 var slab=new THREE.Mesh(new THREE.BoxGeometry(8.5,.92,6.4),new THREE.MeshPhysicalMaterial({color:0x23627b,transparent:true,opacity:.085,roughness:.3,side:THREE.DoubleSide,depthWrite:false}));
 group.add(slab);
 var gProtein=new THREE.Group();gProtein.position.set(.1,-2.15,.18);
 var gpMat=new THREE.MeshPhysicalMaterial({color:0x62b5ad,metalness:.13,roughness:.34,clearcoat:.42});
 [[-.46,0,0,.58],[.4,-.08,0,.43],[.02,-.28,.48,.42]].forEach(function(p){var m=new THREE.Mesh(new THREE.IcosahedronGeometry(p[3],2),gpMat);m.position.set(p[0],p[1],p[2]);gProtein.add(m);});
 group.add(gProtein);
 var atomGeometry=new THREE.SphereGeometry(1,18,12);
 function ligand(coords,edges,palette){
  var g=new THREE.Group();
  coords.forEach(function(p){
   var mat=new THREE.MeshPhysicalMaterial({color:palette[p[3]],metalness:.13,roughness:.24,clearcoat:.8,clearcoatRoughness:.12});
   var sphere=new THREE.Mesh(atomGeometry,mat);sphere.position.set(p[0],p[1],p[2]);sphere.scale.setScalar(p[3]==='N'?.16:.19);g.add(sphere);
  });
  edges.forEach(function(b){
   var a=new THREE.Vector3(coords[b[0]][0],coords[b[0]][1],coords[b[0]][2]),c=new THREE.Vector3(coords[b[1]][0],coords[b[1]][1],coords[b[1]][2]),dir=c.clone().sub(a);
   var bond=new THREE.Mesh(new THREE.CylinderGeometry(.052,.052,dir.length(),9),new THREE.MeshStandardMaterial({color:0xdfedf4,metalness:.15,roughness:.26}));
   bond.position.copy(a).add(c).multiplyScalar(.5);bond.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());g.add(bond);
  });
  return g;
 }
 var his=ligand([[-.4,.02,0,'C'],[-.16,.27,0,'N'],[.18,.28,0,'C'],[.35,-.04,0,'N'],[.09,-.28,0,'C'],[-.31,-.3,0,'C'],[.66,-.23,0,'N']],[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[3,6]],{C:0xf6a45f,N:0x376ddd});
 his.scale.setScalar(.9);group.add(his);
 var antiCoords=[],antiEdges=[];
 for(var i=0;i<7;i++){var a=i*2*Math.PI/7;antiCoords.push([Math.cos(a)*.5,Math.sin(a)*.5,0,'C']);if(i>0)antiEdges.push([i-1,i]);}
 antiEdges.push([6,0]);antiCoords.push([.55,-.42,.13,'N'],[.88,-.68,.20,'C'],[1.16,-.48,.14,'N'],[-.60,.03,.21,'C']);
 antiEdges.push([6,7],[7,8],[8,9],[3,10]);
 var anti=ligand(antiCoords,antiEdges,{C:0xa692ff,N:0x65d4ef});anti.scale.setScalar(.87);group.add(anti);
 var sparks=[],sparkGroup=new THREE.Group();group.add(sparkGroup);
 for(var p=0;p<36;p++){
  var sphere2=new THREE.Mesh(new THREE.SphereGeometry(.044+(p%4)*.012,8,6),
    new THREE.MeshBasicMaterial({color:p%3===0?0xffb568:0x72e5ce,transparent:true,opacity:.8,depthWrite:false}));
  sparkGroup.add(sphere2);sparks.push(sphere2);
 }
 return {THREE,renderer,scene,camera,group,protein,hist:his,anti,gProtein,sparks,canvas,activity:0,angle:0};
}
function fallback(reason){
 var loading=document.getElementById('ah3dLoading');
 if(loading){loading.classList.add('ah3d-failed');loading.textContent='Visualização 3D indisponível neste dispositivo ou conexão. '+(reason||'Use os controles abaixo para ler as etapas.');}
 var canvas=document.getElementById('ah3dCanvas');if(canvas)canvas.style.display='none';
}
async function load(){
 if(world)return world;if(ready)return ready;
 ready=(async function(){
  var THREE;
  try{THREE=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');}
  catch(err){THREE=await import('https://unpkg.com/three@0.169.0/build/three.module.js');}
  if(!details||!details.isConnected)throw new Error('Painel fechado.');
  var canvas=document.getElementById('ah3dCanvas');
  world=build(THREE,canvas);
  var indicator=document.getElementById('ah3dLoading');if(indicator)indicator.remove();
  yaw=0;dims();
  if(window.ResizeObserver){world.observer=new ResizeObserver(dims);world.observer.observe(canvas.parentElement);}
  else window.addEventListener('resize',dims);
  canvas.addEventListener('pointerdown',function(e){dragging=true;canvas.setPointerCapture(e.pointerId);canvas.dataset.x=e.clientX;});
  canvas.addEventListener('pointermove',function(e){if(!dragging)return;var dx=e.clientX-Number(canvas.dataset.x||e.clientX);canvas.dataset.x=e.clientX;yaw+=dx*.007;draw();});
  canvas.addEventListener('pointerup',function(){dragging=false;});
  canvas.addEventListener('pointercancel',function(){dragging=false;});
  return world;
 })().catch(function(err){ready=null;fallback('');return null;});
 return ready;
}
function calc(t){
 var hist=smooth((t-3400)/1450)*(1-smooth((t-8350)/1150));
 var inverse=smooth((t-10300)/1500)*(1-smooth((t-16000)/750));
 return {hist:hist,inverse:inverse,signal:clamp(.22+hist*.76-inverse*.17,.04,1),
   state:t<3500?'basal':t<10100?'hist':'inverse'};
}
function setLabel(which,signal){
 var item=phases[which];if(!item)return;
 if(status.textContent!==item.tag){
  status.textContent=item.tag;
  document.getElementById('ah3dTitle').textContent=item.title;
  phaseText.textContent=item.text;
  document.getElementById('ah3dSignalLabel').textContent=item.level;
 }
 meter.style.width=Math.round(signal*100)+'%';
 meter.style.background=signal>.6?'linear-gradient(90deg,#f5b76e,#f27966)':which==='inverse'?'linear-gradient(90deg,#75b2b8,#9d8bf0)':'linear-gradient(90deg,#418ca7,#64c5ba)';
 root.querySelectorAll('[data-ah3d-mode]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.ah3dMode===which));});
}
function draw(){
 if(!world)return;
 var THREE=world.THREE;
 var v=manual==='basal'?{hist:0,inverse:0,signal:.22,state:'basal'}:
  manual==='hist'?{hist:1,inverse:0,signal:.98,state:'hist'}:
  manual==='inverse'?{hist:0,inverse:1,signal:.05,state:'inverse'}:calc(elapsed%duration);
 setLabel(v.state,v.signal);
 var his=world.hist,anti=world.anti;
 his.position.set(.07,3.85-(v.hist*2.43),.09);his.scale.setScalar(.9*Math.max(.001,v.hist));his.rotation.y=elapsed*.0003;
 anti.position.set(-.25,3.98-(v.inverse*2.62),.03);anti.scale.setScalar(.80*Math.max(.001,v.inverse));anti.rotation.y=-.17+elapsed*.00016;
 if(world.protein.userData.helix6){
  world.protein.userData.helix6.position.x=v.hist*.25-v.inverse*.06;
 }
 world.gProtein.scale.setScalar(1+v.hist*.14);
 world.gProtein.rotation.y=.2+v.hist*.23;
 var n=world.sparks.length;
 for(var i=0;i<n;i++){
  var s=world.sparks[i],u=(i*.127+elapsed*.00013)%1;
  var a=(i*2.39996),radius=.4+((i*7)%13)*.11;
  s.position.set(Math.cos(a)*radius,-2.35-u*1.32,Math.sin(a)*radius);
  s.material.opacity=v.signal*(.28+.55*(1-u));
  s.scale.setScalar(v.signal<.10?.3:1);
 }
 world.group.rotation.y=yaw+Math.sin(elapsed*.00013)*.14;
 world.renderer.render(world.scene,world.camera);
 var prog=document.getElementById('ah3dProgress');if(prog)prog.style.width=manual?'100%':Math.floor(elapsed%duration/duration*100)+'%';
}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=0;}
function tick(t){
 if(!details||!details.open||document.hidden){stop();return;}
 if(last&&!paused&&!manual)elapsed+=(t-last);last=t;draw();
 raf=requestAnimationFrame(tick);
}
function loop(){if(!raf&&world&&details&&details.open){last=0;raf=requestAnimationFrame(tick);}}
function setPaused(p){paused=p;var b=root.querySelector('[data-ah3d-pause]');b.setAttribute('aria-pressed',String(p));b.textContent=p?'▶ Continuar':'Ⅱ Pausar';if(world)draw();}
function setManual(mode){manual=mode;setPaused(true);if(!world)setLabel(mode,mode==='hist'?1:mode==='inverse'?.05:.22);else draw();}
function prepare(){
 if(!details||!details.open)return;
 load().then(function(w){if(w&&details.open){if(reduced){setManual('inverse');}else{loop();}}});
}
window.ahInit=function(){
 oldInit();
 var host=document.getElementById('ahApp');if(!host||host.querySelector('#ahMechanism'))return;
 var bar=host.querySelector('.ah-toolbar');if(!bar)return;
 bar.insertAdjacentHTML('beforebegin',html);
 root=host;details=host.querySelector('#ahMechanism');
 status=host.querySelector('#ah3dStep');phaseText=host.querySelector('#ah3dText');meter=host.querySelector('#ah3dMeter');
 details.addEventListener('toggle',function(){if(details.open)prepare();else stop();});
 details.addEventListener('click',function(e){
  var mode=e.target.closest('[data-ah3d-mode]');
  if(mode){setManual(mode.dataset.ah3dMode);return;}
  if(e.target.closest('[data-ah3d-play]')){manual=null;elapsed=0;setPaused(false);prepare();return;}
  if(e.target.closest('[data-ah3d-pause]')){if(manual){manual=null;}setPaused(!paused);prepare();}
 });
 document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else if(details&&details.open)prepare();});
};
})();