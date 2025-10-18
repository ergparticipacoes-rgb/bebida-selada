/* ============================================================
   BEBIDA SELADA® v4.1 PRIME+ — APP.JS
   ============================================================ */

/* === Inicialização de tema === */
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

/* === Menu === */
const menuBtn=document.getElementById("menuBtn");
const menuList=document.getElementById("menuList");
menuBtn?.addEventListener("click",()=>{
  const expanded=menuBtn.getAttribute("aria-expanded")==="true";
  menuBtn.setAttribute("aria-expanded", String(!expanded));
  menuList?.classList.toggle("hidden");
});

/* === Tema (persistente) === */
const themeToggle=document.getElementById("themeToggle");
function setTheme(mode){
  document.documentElement.setAttribute("data-theme", mode);
  try{ localStorage.setItem("bs_theme", mode);}catch(_){}
}
themeToggle?.addEventListener("click",()=>{
  const current=document.documentElement.getAttribute("data-theme")||"light";
  setTheme(current==="light"?"dark":"light");
});

/* === Progresso de rolagem === */
const progress=document.getElementById("scrollProgress");
function updateProgress(){
  const y=window.scrollY||0;
  const h=Math.max(1,document.body.scrollHeight-window.innerHeight);
  const pct=Math.min(100,Math.max(0,(y/h)*100));
  if(progress) progress.style.width=pct+"%";
}
addEventListener("scroll",updateProgress,{passive:true});
addEventListener("load",updateProgress);

/* === Animações Reveal === */
const io=new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){en.target.classList.add("visible");io.unobserve(en.target);}
  });
},{threshold:.14});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* === QR Button (modal simulado) === */
document.querySelectorAll(".qrButton").forEach(btn=>{
  btn.addEventListener("click", async (e)=>{
    e.preventDefault();
    flashSweep();
    await wait(300);
    playScanSound();
  });
});

/* === Efeito de som leve === */
async function playScanSound(){
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx) return;
  const ctx=new Ctx();
  const osc=ctx.createOscillator();const gain=ctx.createGain();
  osc.type="triangle";osc.frequency.value=740;
  gain.gain.setValueAtTime(0.0001,ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.06,ctx.currentTime+0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.22);
  osc.connect(gain);gain.connect(ctx.destination);
  osc.start();osc.stop(ctx.currentTime+0.24);
}

/* === Flash (simulação visual da varredura) === */
function flashSweep(){
  const el=document.querySelector(".qr-sweep-white");
  if(!el) return;
  el.style.transition="none";
  el.style.opacity="1";
  requestAnimationFrame(()=>{
    setTimeout(()=>{
      el.style.transition="opacity .6s ease";
      el.style.opacity="0.6";
      setTimeout(()=>el.style.opacity="0.3",240);
    },50);
  });
}

/* === PWA Banner === */
let deferredPrompt;
window.addEventListener('beforeinstallprompt',(e)=>{
  e.preventDefault();
  deferredPrompt=e;
  const banner=document.getElementById('pwaBanner');
  if(banner) banner.classList.remove('hidden');
});
document.getElementById('pwaDismiss')?.addEventListener('click',()=>document.getElementById('pwaBanner')?.classList.add('hidden'));
document.getElementById('pwaInstall')?.addEventListener('click',async()=>{
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  document.getElementById('pwaBanner')?.classList.add('hidden');
});

/* === Service Worker atualização suave === */
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
