/* v3.3.1 app core (menu, theme, verify modal, PWA) */
(function initTheme(){
  try{
    const saved = localStorage.getItem("bs_theme");
    if(saved){ document.documentElement.setAttribute("data-theme", saved); }
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches){
      document.documentElement.setAttribute("data-theme","dark");
    }
  }catch(_){}
})();

const wait=(ms)=>new Promise(r=>setTimeout(r,ms));

const menuBtn=document.getElementById("menuBtn");
const menuList=document.getElementById("menuList");
menuBtn?.addEventListener("click",()=>{
  const expanded=menuBtn.getAttribute("aria-expanded")==="true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  menuList?.classList.toggle("hidden");
});

const themeToggle=document.getElementById("themeToggle");
function setTheme(mode){
  document.documentElement.setAttribute("data-theme", mode);
  try{ localStorage.setItem("bs_theme", mode);}catch(_){}
}
themeToggle?.addEventListener("click",()=>{
  const current=document.documentElement.getAttribute("data-theme")||"light";
  setTheme(current==="light"?"dark":"light");
});

const progress=document.getElementById("scrollProgress");
function updateProgress(){
  const y=window.scrollY||0;
  const h=Math.max(1,document.body.scrollHeight-window.innerHeight);
  const pct=Math.min(100,Math.max(0,(y/h)*100));
  if(progress) progress.style.width=pct+"%";
}
addEventListener("scroll",updateProgress,{passive:true});
addEventListener("load",updateProgress);

const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("visible"); io.unobserve(en.target);} });
},{threshold:.14});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

const verifyModal=document.getElementById("verifyModal");
const stateChecking=document.getElementById("stateChecking");
const stateResult=document.getElementById("stateResult");

function openVerifyModal(){
  if(!verifyModal) return;
  verifyModal.classList.remove("invisible","opacity-0");
  verifyModal.classList.add("active");
  stateChecking?.classList.remove("hidden");
  stateResult?.classList.add("hidden");
  document.body.style.overflow="hidden";
  runVerification();
}
function hideVerifyModal(){
  if(!verifyModal) return;
  verifyModal.classList.add("opacity-0");
  setTimeout(()=>verifyModal.classList.add("invisible"),200);
  verifyModal.classList.remove("active");
  document.body.style.overflow="";
}
document.querySelectorAll(".qrButton, #qrButton, .qr-demo").forEach(btn=>{
  btn.addEventListener("click",(e)=>{ e.preventDefault(); openVerifyModal(); });
});
document.querySelectorAll('#closeModal, .btn-close, [data-close="modal"]').forEach(btn=>{
  btn.addEventListener('click',()=>hideVerifyModal());
});
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
  el.style.transition="none"; el.style.opacity="1";
  requestAnimationFrame(()=>{ setTimeout(()=>{ el.style.transition="opacity .6s ease"; el.style.opacity=".55"; setTimeout(()=>el.style.opacity=".35",220); }, 40); });
}
function getAuditData(){
  return { nome:"Adega Modelo", cidade:"Peruíbe/SP", lote:"LOT-PRD-2025-10-A13", auditor:"E. Rocha", data:new Date().toLocaleString("pt-BR") };
}
async function runVerification(){
  flashSweep();
  stateChecking?.classList.remove("hidden");
  stateResult?.classList.add("hidden");
  await wait(300); await playScanSound(); await wait(2200);
  const d=getAuditData();
  const resNome=document.getElementById('resNome');
  const resCidade=document.getElementById('resCidade');
  const resLote=document.getElementById('resLote');
  const resAuditor=document.getElementById('resAuditor');
  const resData=document.getElementById('resData');
  if(resNome&&resCidade&&resLote&&resAuditor&&resData){
    resNome.textContent=d.nome; resCidade.textContent=d.cidade; resLote.textContent=d.lote; resAuditor.textContent=d.auditor; resData.textContent=d.data;
    stateChecking?.classList.add("hidden");
    stateResult?.classList.remove("hidden");
  }
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt=e;
  document.getElementById('pwaBanner')?.classList.remove('hidden');
});
document.getElementById('pwaDismiss')?.addEventListener('click',()=>document.getElementById('pwaBanner')?.classList.add('hidden'));
document.getElementById('pwaInstall')?.addEventListener('click', async ()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  document.getElementById('pwaBanner')?.classList.add('hidden');
});

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
