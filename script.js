
/* =========================================================
   MAJID // CINEMATIC PRESENTATION ENGINE
   HTML + CSS + JS — no external libraries
   ========================================================= */

const slides = [...document.querySelectorAll('.slide')];
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const counter = document.getElementById('counter');
const bar = document.getElementById('progressBar');
let index = 0, locked = false, sx = null, sy = null;

const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

const css = document.createElement('style');
css.textContent = `
body{overflow-x:hidden}
#cinematic-fx{position:fixed;inset:0;z-index:99999;pointer-events:none;overflow:hidden;perspective:1200px}
#cinematic-fx .blackout{position:absolute;inset:0;background:#000;opacity:0}
#cinematic-fx .tunnel{position:absolute;inset:-50%;background:
 repeating-conic-gradient(from 0deg,rgba(98,255,176,.14) 0 1deg,transparent 1deg 8deg);
 mask-image:radial-gradient(circle,transparent 0 10%,#000 45%,transparent 72%);
 opacity:0;transform:perspective(500px) translateZ(-500px) rotate(0deg)}
#cinematic-fx .grid{position:absolute;left:-30%;bottom:-55%;width:160%;height:110%;
 background:
 linear-gradient(rgba(92,231,255,.18) 1px,transparent 1px),
 linear-gradient(90deg,rgba(92,231,255,.18) 1px,transparent 1px);
 background-size:55px 55px;transform:perspective(420px) rotateX(65deg);opacity:0}
#cinematic-fx .core{position:absolute;left:50%;top:50%;width:10px;height:10px;border-radius:50%;
 transform:translate(-50%,-50%) scale(.1);background:white;opacity:0;
 box-shadow:0 0 20px white,0 0 70px #62ffb0,0 0 150px #5ce7ff}
#cinematic-fx .ring{position:absolute;left:50%;top:50%;width:8vmin;height:8vmin;border:1px solid #62ffb0;
 border-radius:50%;transform:translate(-50%,-50%) scale(.1);opacity:0;
 box-shadow:0 0 25px #62ffb0}
#cinematic-fx .ring:nth-child(2){border-color:#5ce7ff}
#cinematic-fx .ring:nth-child(3){border-color:white;border-style:dashed}
#cinematic-fx .scan{position:absolute;left:-5%;top:-5%;width:110%;height:2px;
 background:linear-gradient(90deg,transparent,#62ffb0,#fff,#5ce7ff,transparent);
 box-shadow:0 0 20px #62ffb0;opacity:0}
#cinematic-fx .flash{position:absolute;inset:0;
 background:radial-gradient(circle at var(--x) var(--y),rgba(255,255,255,.95),rgba(98,255,176,.18) 12%,transparent 45%);
 opacity:0}
#cinematic-fx .label{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(.7);
 color:white;font:700 14px monospace;letter-spacing:.45em;text-shadow:0 0 20px #62ffb0;opacity:0}
.fx-dot{position:absolute;width:3px;height:3px;border-radius:50%;background:#62ffb0;
 box-shadow:0 0 12px #62ffb0;opacity:0}

@keyframes tunnel{0%{opacity:0;transform:perspective(500px) translateZ(-900px) rotate(0)}
 15%{opacity:1}100%{opacity:0;transform:perspective(500px) translateZ(700px) rotate(180deg)}}
@keyframes grid{0%{opacity:0;transform:perspective(420px) rotateX(65deg) translateY(100px)}
 25%{opacity:1}100%{opacity:0;transform:perspective(420px) rotateX(65deg) translateY(-140px)}}
@keyframes core{0%{opacity:0;transform:translate(-50%,-50%) scale(.1)}
 30%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(85)}}
@keyframes ring{0%{opacity:0;transform:translate(-50%,-50%) scale(.05) rotate(0)}
 20%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(22) rotate(360deg)}}
@keyframes scan{0%{top:-5%;opacity:0}15%{opacity:1}100%{top:105%;opacity:0}}
@keyframes flash{0%{opacity:0}18%{opacity:.9}100%{opacity:0}}
@keyframes label{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}
 35%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(1.15)}}
@keyframes dot{0%{opacity:0;transform:translate(0,0) scale(.2)}
 15%{opacity:1}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(1.8)}}

.slide.fx-in-right{animation:inRight .9s cubic-bezier(.12,1,.25,1) both}
.slide.fx-in-left{animation:inLeft .9s cubic-bezier(.12,1,.25,1) both}
.slide.fx-out-left{animation:outLeft .7s cubic-bezier(.7,0,.84,0) both}
.slide.fx-out-right{animation:outRight .7s cubic-bezier(.7,0,.84,0) both}
.slide.fx-in-right>*{animation:content .8s .12s cubic-bezier(.16,1,.3,1) both}
.slide.fx-in-left>*{animation:content .8s .12s cubic-bezier(.16,1,.3,1) both}
.slide.fx-in-right>*:nth-child(2),.slide.fx-in-left>*:nth-child(2){animation-delay:.2s}
.slide.fx-in-right>*:nth-child(3),.slide.fx-in-left>*:nth-child(3){animation-delay:.28s}
@keyframes inRight{0%{opacity:0;transform:translate3d(100%,0,0) rotateY(-24deg) scale(.82);filter:blur(18px)}
 55%{opacity:1}100%{opacity:1;transform:none;filter:blur(0)}}
@keyframes inLeft{0%{opacity:0;transform:translate3d(-100%,0,0) rotateY(24deg) scale(.82);filter:blur(18px)}
 55%{opacity:1}100%{opacity:1;transform:none;filter:blur(0)}}
@keyframes outLeft{to{opacity:0;transform:translate3d(-35%,0,0) rotateY(16deg) scale(.86);filter:blur(12px)}}
@keyframes outRight{to{opacity:0;transform:translate3d(35%,0,0) rotateY(-16deg) scale(.86);filter:blur(12px)}}
@keyframes content{from{opacity:0;transform:translateY(30px) scale(.96);filter:blur(8px)}
 to{opacity:1;transform:none;filter:blur(0)}}
@media(prefers-reduced-motion:reduce){#cinematic-fx{display:none!important}.slide[class*="fx-"]{animation:none!important}}
`;
document.head.appendChild(css);

const fx = document.createElement('div');
fx.id = 'cinematic-fx';
fx.innerHTML = `
<div class="blackout"></div><div class="tunnel"></div><div class="grid"></div>
<div class="core"></div><div class="ring"></div><div class="ring"></div><div class="ring"></div>
<div class="scan"></div><div class="flash"></div><div class="label"></div>`;
document.body.appendChild(fx);

function particles(dir){
  const n = innerWidth < 700 ? 35 : 75;
  for(let i=0;i<n;i++){
    const d=document.createElement('i');
    d.className='fx-dot';
    d.style.left=(dir>0 ? Math.random()*45 : 55+Math.random()*45)+'vw';
    d.style.top=Math.random()*100+'vh';
    d.style.setProperty('--dx',(dir>0 ? 1 : -1)*(120+Math.random()*500)+'px');
    d.style.setProperty('--dy',(Math.random()-.5)*500+'px');
    d.style.animation=`dot ${.65+Math.random()*.45}s ${Math.random()*.18}s cubic-bezier(.15,.8,.2,1) both`;
    fx.appendChild(d);
    setTimeout(()=>d.remove(),1200);
  }
}

function runFX(dir,target){
  const tunnel=fx.querySelector('.tunnel'), grid=fx.querySelector('.grid');
  const core=fx.querySelector('.core'), rings=fx.querySelectorAll('.ring');
  const scan=fx.querySelector('.scan'), flash=fx.querySelector('.flash');
  const label=fx.querySelector('.label');
  label.textContent=['INITIALIZING','NEURAL LINK','MEMORY FRAME','DATA STREAM','NEXT DIMENSION'][target%5];
  flash.style.setProperty('--x',dir>0?'25%':'75%');
  flash.style.setProperty('--y',(20+Math.random()*60)+'%');
  [tunnel,grid,core,scan,flash,label,...rings].forEach(e=>{e.style.animation='none';void e.offsetWidth});
  tunnel.style.animation='tunnel .95s cubic-bezier(.15,.8,.2,1) both';
  grid.style.animation='grid .9s ease-out both';
  core.style.animation='core .8s cubic-bezier(.1,.8,.1,1) both';
  rings.forEach((r,i)=>r.style.animation=`ring 1s ${i*.07}s cubic-bezier(.1,.8,.1,1) both`);
  scan.style.animation='scan .75s ease-in-out both';
  flash.style.animation='flash .75s ease-out both';
  label.style.animation='label .65s .08s cubic-bezier(.16,1,.3,1) both';
  particles(dir);
}

function update(){
  counter.textContent=`${fa(index+1)} / ${fa(slides.length)}`;
  bar.style.width=`${(index+1)/slides.length*100}%`;
}

function show(i,dir=null,instant=false){
  const ni=(i+slides.length)%slides.length;
  if(ni===index&&!instant || locked&&!instant)return;
  if(instant){
    slides.forEach((s,k)=>{s.className=s.className.replace(/\bfx-\S+/g,'');s.classList.toggle('active',k===ni)});
    index=ni;update();return;
  }
  locked=true;
  const old=index, direction=dir ?? (ni>old?1:-1);
  const a=slides[old], b=slides[ni];
  runFX(direction,ni);
  a.classList.remove('fx-in-left','fx-in-right','fx-out-left','fx-out-right');
  b.classList.remove('fx-in-left','fx-in-right','fx-out-left','fx-out-right');
  a.classList.add(direction>0?'fx-out-left':'fx-out-right');
  b.classList.add('active',direction>0?'fx-in-right':'fx-in-left');
  index=ni;update();
  setTimeout(()=>{
    a.classList.remove('active','fx-out-left','fx-out-right');
    b.classList.remove('fx-in-left','fx-in-right');
    b.classList.add('active');
    locked=false;
  },980);
}

function next(){show(index+1,1)}
function prev(){show(index-1,-1)}
nextBtn.onclick=next; prevBtn.onclick=prev;
document.querySelectorAll('[data-next]').forEach(b=>b.onclick=next);

addEventListener('keydown',e=>{
  if(['ArrowLeft',' ','PageDown'].includes(e.key)){e.preventDefault();next()}
  if(['ArrowRight','PageUp'].includes(e.key)){e.preventDefault();prev()}
  if(e.key==='Home')show(0,-1,true);
  if(e.key==='End')show(slides.length-1,1,true);
});
document.addEventListener('touchstart',e=>{sx=e.changedTouches[0].clientX;sy=e.changedTouches[0].clientY},{passive:true});
document.addEventListener('touchend',e=>{
  if(sx===null)return;
  const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
  if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))(dx<0?next:prev)();
  sx=sy=null;
});
show(0,null,true);
