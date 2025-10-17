/* Bebida Selada® v2.6.3 Prime — JS */

/* AJUSTE FINO v3.1 */
(function initTheme(){
  try{
    const saved = localStorage.getItem("bs_theme");
    if(saved){ document.documentElement.setAttribute("data-theme", saved); }
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
      document.documentElement.setAttribute("data-theme","dark");
    }
  }catch(_){}
})();

const wait = (ms)=>new Promise(r=>setTimeout(r,ms));

/* Menu */
const menuBtn=document.getElementById("menuBtn");
const menuList=document.getElementById("menuList");
menuBtn?.addEventListener("click",()=>{
  const expanded=menuBtn.getAttribute("aria-expanded")==="true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  menuList?.classList.toggle("hidden");
});

/* Theme toggle (persisted) */
const themeToggle=document.getElementById("themeToggle");
function setTheme(mode){
  document.documentElement.setAttribute("data-theme", mode);
  try{ localStorage.setItem("bs_theme", mode);}catch(_){}
}
themeToggle?.addEventListener("click",()=>{
  const current=document.documentElement.getAttribute("data-theme")||"light";
  setTheme(current==="light"?"dark":"light");
});

/* Scroll progress */
const progress=document.getElementById("scrollProgress");
function updateProgress(){
  const y=window.scrollY||0;
  const h=Math.max(1,document.body.scrollHeight-window.innerHeight);
  const pct=Math.min(100,Math.max(0,(y/h)*100));
  if(progress) progress.style.width=pct+"%";
}
addEventListener("scroll",updateProgress,{passive:true});
addEventListener("load",updateProgress);

/* Reveal on scroll */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){en.target.classList.add("visible");io.unobserve(en.target);}
  });
},{threshold:.14});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* Modal de verificação */
const verifyModal=document.getElementById("verifyModal");
const qrButton=document.getElementById("qrButton");
const closeModal=document.getElementById("closeModal");
const stateChecking=document.getElementById("stateChecking");
const stateResult=document.getElementById("stateResult");
const stateReward=document.getElementById("stateReward");
const btnBrinde=document.getElementById("btnBrinde");
const backToResult=document.getElementById("backToResult");
const btnCompartilhar=document.getElementById("btnCompartilhar");
const confettiCanvas=document.getElementById("confetti");
const downloadBadge=document.getElementById("downloadBadge");

function openVerifyModal(){
  if(!verifyModal) return;
  verifyModal.classList.add("active");
  verifyModal.classList.remove("invisible","opacity-0");
  stateChecking?.classList.remove("hidden");
  stateResult?.classList.add("hidden");
  stateReward?.classList.add("hidden");
  runVerification();
}
function hideVerifyModal(){
  if(!verifyModal) return;
  verifyModal.classList.add("opacity-0");
  setTimeout(()=>verifyModal.classList.add("invisible"),200);
  verifyModal.classList.remove("active");
}
qrButton?.addEventListener("click",openVerifyModal);
closeModal?.addEventListener("click",hideVerifyModal);
verifyModal?.addEventListener("click",(e)=>{ if(e.target===verifyModal) hideVerifyModal(); });
addEventListener("keydown",(e)=>{ if(e.key==="Escape" && verifyModal?.classList.contains("active")) hideVerifyModal(); });

async function playScanSound(){
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx) return;
  const ctx=new Ctx();
  const osc=ctx.createOscillator();const gain=ctx.createGain();
  osc.type="triangle";osc.frequency.value=740;
  gain.gain.setValueAtTime(0.0001,ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06,ctx.currentTime+0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.22);
  osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+0.24);
}
function flashSweep(){
  const el=document.querySelector(".qr-sweep"); if(!el) return;
  el.style.transition="none"; el.style.opacity="0.95";
  requestAnimationFrame(()=>{ setTimeout(()=>{ el.style.transition="opacity .6s ease"; el.style.opacity=".7"; setTimeout(()=>el.style.opacity=".35",220); }, 40); });
}
function getAuditData(){
  return {
    nome:"Adega Modelo", cidade:"Peruíbe/SP",
    lote:"LOT-PRD-2025-10-A13", auditor:"E. Rocha",
    data: new Date().toLocaleString("pt-BR")
  };
}
async function runVerification(){
  flashSweep();
  stateChecking?.classList.remove("hidden");
  await wait(300); await playScanSound(); await wait(2800);
  const d=getAuditData();
  const set=(id,val)=>{const el=document.getElementById(id); if(el) el.textContent=val;};
  set("resNome",d.nome); set("resCidade",d.cidade); set("resLote",d.lote); set("resAuditor",d.auditor); set("resData",d.data);
  stateChecking?.classList.add("hidden"); stateResult?.classList.remove("hidden");
}

btnBrinde?.addEventListener("click", async ()=>{
  if(!stateResult||!stateReward) return;
  stateResult.classList.add("hidden"); stateReward.classList.remove("hidden");
  runConfetti(confettiCanvas);
  const dataUrl=await generateBadge(); if(downloadBadge) downloadBadge.setAttribute("href", dataUrl);
});
backToResult?.addEventListener("click",()=>{ stateReward?.classList.add("hidden"); stateResult?.classList.remove("hidden"); });
btnCompartilhar?.addEventListener("click", async ()=>{
  const text="Selo verificado e aprovado na Bebida Selada® — Confiança que se vê.";
  try{
    if(navigator.share){ await navigator.share({title:"Bebida Selada®", text, url: location.href}); }
    else if(navigator.clipboard?.writeText){ await navigator.clipboard.writeText(text+" "+location.href); alert("Texto copiado para compartilhar."); }
  }catch(_){}
});

function runConfetti(canvas){
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  const rect=canvas.parentElement.getBoundingClientRect();
  canvas.width=rect.width; canvas.height=rect.height;
  const N=120;
  const pieces=[...Array(N)].map(()=>({x:Math.random()*rect.width,y:-20-Math.random()*rect.height*.5,w:6+Math.random()*6,h:8+Math.random()*10,vy:2+Math.random()*3,vx:-1+Math.random()*2,r:Math.random()*360,vr:-6+Math.random()*12,c:Math.random()}));
  let run=true; setTimeout(()=>run=false,1800);
  (function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(const p of pieces){
      p.y+=p.vy; p.x+=p.vx; p.r+=p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r*Math.PI/180);
      const colors=["#F6D477","#EDC765","#D9A93E","#8B5CF6","#2E8797","#1B424E"];
      ctx.fillStyle=colors[Math.floor(p.c*colors.length)%colors.length];
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    }
    if(run) requestAnimationFrame(loop);
  })();
}
async function generateBadge(){
  const size=320; const c=document.createElement("canvas"); c.width=size; c.height=size; const ctx=c.getContext("2d");
  const g=ctx.createLinearGradient(0,0,0,size); g.addColorStop(0,"#1B424E"); g.addColorStop(1,"#0E2A33"); ctx.fillStyle=g; ctx.fillRect(0,0,size,size);
  ctx.strokeStyle="#EDC765"; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(size/2,size/2,size/2-18,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle="#F6D47722"; ctx.beginPath(); ctx.arc(size/2,size/2,size/2-30,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#EDC765"; ctx.font="700 20px Inter, Arial"; ctx.textAlign="center";
  ctx.fillText("Bebida Selada®", size/2, size/2-10);
  ctx.font="700 18px Inter, Arial"; ctx.fillText("Confiança Selada", size/2, size/2+18);
  return c.toDataURL("image/png");
}

/* KPIs */
const kpis=document.querySelectorAll(".kpi");
if(kpis.length){
  const kpiIO=new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
      if(!entry.isIntersecting) return;
      const el=entry.target; const target=Number(el.dataset.target||"0"); const dur=1100; const start=performance.now();
      function step(ts){ const p=Math.min(1,(ts-start)/dur); const val=Math.floor(target*p); el.textContent=val.toLocaleString("pt-BR"); if(p<1) requestAnimationFrame(step); else kpiIO.unobserve(el); }
      requestAnimationFrame(step);
    });
  },{threshold:.35});
  kpis.forEach(el=>kpiIO.observe(el));
}

/* Lead form (fake submit) */
const leadForm=document.getElementById("leadForm");
const leadFeedback=document.getElementById("leadFeedback");
leadForm?.addEventListener("submit",(e)=>{ e.preventDefault(); leadFeedback?.classList.remove("hidden"); leadForm.reset(); });

/* Plan modal */
const planModal=document.getElementById("planModal");
const closePlanModal=document.getElementById("closePlanModal");
const planTitle=document.getElementById("planTitle");
const planPrice=document.getElementById("planPrice");
const planBenefits=document.getElementById("planBenefits");
const planTalk=document.getElementById("planTalk");
const plans={
  essencial:{title:"Essencial",price:{from:"R$ 197",now:"R$ 119/mês"},benefits:["Selo digital + QR dinâmico","Entradas de lote mensais","Canal WhatsApp prioritário","Acesso ao painel do estabelecimento"]},
  pro:{title:"Pro",price:{from:"R$ 247",now:"R$ 189/mês"},benefits:["Todos os recursos do Essencial","Painel de lotes avançado","Auditorias ampliadas","Destaque na Rede Segura"]},
  proplus:{title:"Pro+",price:{from:"",now:"Sob consulta"},benefits:["Lotes ilimitados","Auditoria contínua","Suporte dedicado e SLA","Integrações personalizadas"]}
};
document.querySelectorAll(".btn-plan-details").forEach((btn)=>{
  btn.addEventListener("click",()=>{
    const key=btn.dataset.plan||"essencial"; const p=plans[key]||plans.essencial;
    if(!planModal) return;
    planTitle&&(planTitle.textContent=`Plano ${p.title}`);
    if(planPrice){ planPrice.innerHTML=p.price.from?`<span class="line-through mr-2">${p.price.from}</span> <strong>${p.price.now}</strong>`:`<strong>${p.price.now}</strong>`; }
    if(planBenefits){ planBenefits.innerHTML=p.benefits.map((b)=>`<li>• ${b}</li>`).join(""); }
    planModal.classList.add("active"); planModal.classList.remove("invisible","opacity-0");
    planTalk?.addEventListener("click",()=>{ const w=window.open("https://wa.me/5513982259477","_blank","noopener,noreferrer"); if(w) w.opener=null; },{once:true});
  });
});
closePlanModal?.addEventListener("click",()=>{ planModal?.classList.add("opacity-0"); setTimeout(()=>planModal?.classList.add("invisible"),200); planModal?.classList.remove("active"); });
planModal?.addEventListener("click",(e)=>{ if(e.target===planModal){ planModal.classList.add("opacity-0"); setTimeout(()=>planModal.classList.add("invisible"),200); planModal.classList.remove("active"); }});

/* SW - auto update with soft reload */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("/service-worker.js").then((reg)=>{
    if(reg.waiting){ reg.waiting.postMessage("skipWaiting"); }
    reg.addEventListener("updatefound",()=>{
      const sw=reg.installing;
      sw?.addEventListener("statechange",()=>{
        if(sw.state==="installed" && reg.waiting){
          reg.waiting.postMessage("skipWaiting");
        }
      });
    });
  }).catch(()=>{});
  let refreshing=false;
  navigator.serviceWorker.addEventListener("controllerchange",()=>{
    if(refreshing) return; refreshing=true; window.location.reload();
  });
}


/* v3.2 Premium JS */
// KPI reveal ensure works on mobile
document.querySelectorAll('.kpi').forEach(el=>{ el.style.opacity=1; });

// PWA install (mobile)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  if (typeof a2hsEligible !== 'undefined' && a2hsEligible) { a2hsShow(); }
});
document.getElementById('pwaDismiss')?.addEventListener('click',()=>{
  document.getElementById('pwaBanner')?.classList.add('hidden');
});
document.getElementById('pwaInstall')?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById('pwaBanner')?.classList.add('hidden');
});

// Theme toggle sticky on mobile
themeToggle?.classList.add('theme-toggle-mobile');

// Make demo QR open the verification modal as well
document.querySelector('.qr-demo')?.addEventListener('click', (e)=>{ e.preventDefault(); openVerifyModal(); });

/* ---- A2HS Banner (PWA Add to Home Screen) ---- */
let a2hsInteractions = 0;
let a2hsEligible = false;
// Reuse existing deferredPrompt variable if present
// Show custom banner only on mobile and when eligible
function a2hsIsMobile(){
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
}
function a2hsSnoozed(){
  try{ const until = localStorage.getItem('a2hs_snooze_until'); return until && Date.now() < Number(until); }catch(_){ return false; }
}
function a2hsInstalled(){
  try{ return localStorage.getItem('a2hs_installed') === 'true'; }catch(_){ return false; }
}
function a2hsShow(){
  if(!a2hsIsMobile() || a2hsSnoozed() || a2hsInstalled() || !deferredPrompt) return false;
  const el = document.getElementById('a2hsBanner'); if(!el) return;
  el.classList.remove('hidden');
  setTimeout(()=>document.getElementById('a2hsInstall')?.focus(), 50);
  return true;
}
function a2hsHide(){ document.getElementById('a2hsBanner')?.classList.add('hidden'); }

function a2hsSchedule(){
  let shown = false;
  const tryShow = ()=>{
    a2hsEligible = true;
    if(!shown){ shown = a2hsShow(); }
  };
  const onScrollOnce = ()=>{ a2hsInteractions++; if(a2hsInteractions >= 2){ tryShow(); } };
  const onClickOnce = ()=>{ a2hsInteractions++; if(a2hsInteractions >= 2){ tryShow(); } };
  window.addEventListener('scroll', onScrollOnce, {passive:true, once:true});
  window.addEventListener('click', onClickOnce, {once:true});
  setTimeout(tryShow, 15000);
}
window.addEventListener('load', a2hsSchedule);

// second handler not needed; first one above already defers prompt

document.getElementById('a2hsInstall')?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  a2hsHide();
  if(choice.outcome === 'accepted'){
    try{ localStorage.setItem('a2hs_installed','true'); }catch(_){ }
  }else{
    try{ localStorage.setItem('a2hs_snooze_until', String(Date.now() + 7*24*60*60*1000)); }catch(_){ }
  }
});

document.getElementById('a2hsLater')?.addEventListener('click', ()=>{
  a2hsHide();
  try{ localStorage.setItem('a2hs_snooze_until', String(Date.now() + 7*24*60*60*1000)); }catch(_){ }
});

// Close on Esc
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') a2hsHide(); });
