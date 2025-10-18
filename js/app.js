/* ============================================================
   BEBIDA SELADA® v3.3.1 — APP.JS
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

/* ============================================================
   MODAL DE VERIFICAÇÃO
   ============================================================ */

const verifyModal=document.getElementById("verifyModal");
const stateChecking=document.getElementById("stateChecking");
const stateResult=document.getElementById("stateResult");
const stateReward=document.getElementById("stateReward");
const btnCompartilhar=document.getElementById("btnCompartilhar");
const backToResult=document.getElementById("backToResult");
const downloadBadge=document.getElementById("downloadBadge");
const confettiCanvas=document.getElementById("confetti");

/* === Funções principais === */
function openVerifyModal(){
  if(!verifyModal) return;
  verifyModal.classList.add("active");
  verifyModal.classList.remove("invisible","opacity-0");
  stateChecking?.classList.remove("hidden");
  stateResult?.classList.add("hidden");
  stateReward?.classList.add("hidden");
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

/* === Eventos === */
document.querySelectorAll(".qrButton, #qrButton, .qr-demo").forEach(btn=>{
  btn.addEventListener("click",(e)=>{ e.preventDefault(); openVerifyModal(); });
});
document.querySelectorAll('#closeModal, .btn-close, [data-close="modal"]').forEach(btn=>{
  btn.addEventListener('click',()=>hideVerifyModal());
});
verifyModal?.addEventListener("click",(e)=>{ if(e.target===verifyModal) hideVerifyModal(); });
addEventListener("keydown",(e)=>{ if(e.key==="Escape" && verifyModal?.classList.contains("active")) hideVerifyModal(); });

/* === Efeito de verificação === */
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
    data:new Date().toLocaleString("pt-BR")
  };
}

async function runVerification(){
  flashSweep();
  stateChecking?.classList.remove("hidden");
  await wait(300); 
  await playScanSound(); 
  await wait(2400);

  const d = getAuditData();

  // Garante que os elementos sejam lidos mesmo se estiverem ocultos
  const resNome = document.getElementById("resNome");
  const resCidade = document.getElementById("resCidade");
  const resLote = document.getElementById("resLote");
  const resAuditor = document.getElementById("resAuditor");
  const resData = document.getElementById("resData");

  if(resNome) resNome.textContent = d.nome;
  if(resCidade) resCidade.textContent = d.cidade;
  if(resLote) resLote.textContent = d.lote;
  if(resAuditor) resAuditor.textContent = d.auditor;
  if(resData) resData.textContent = d.data;

  // Exibe o resultado
  stateChecking?.classList.add("hidden");
  stateResult?.classList.remove("hidden");

  // Microanimação de entrada no check
  const check = stateResult?.querySelector('.h-14.w-14');
  if (check) {
    check.animate(
      [{ transform: "scale(0.6)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }],
      { duration: 400, easing: "ease-out" }
    );
  }
}

/* === Compartilhar === */
btnCompartilhar?.addEventListener("click", async ()=>{
  const text="Selo verificado e aprovado na Bebida Selada® — Confiança que se vê.";
  try{
    if(navigator.share){ await navigator.share({title:"Bebida Selada®", text, url:location.href}); }
    else if(navigator.clipboard?.writeText){ 
      await navigator.clipboard.writeText(text+" "+location.href); 
      alert("Texto copiado para compartilhar."); 
    }
  }catch(_){}
});

/* ============================================================
   PLANOS — MODAL DE DETALHES
   ============================================================ */
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
    if(planPrice){ planPrice.innerHTML=p.price.from?`<span class='line-through mr-2'>${p.price.from}</span> <strong>${p.price.now}</strong>`:`<strong>${p.price.now}</strong>`; }
    if(planBenefits){ planBenefits.innerHTML=p.benefits.map((b)=>`<li>• ${b}</li>`).join(""); }
    planModal.classList.add("active"); planModal.classList.remove("invisible","opacity-0");
    planTalk?.addEventListener("click",()=>{ 
      const w=window.open("https://wa.me/5513982259477","_blank","noopener,noreferrer"); 
      if(w) w.opener=null; 
    },{once:true});
  });
});
closePlanModal?.addEventListener("click",()=>{ planModal?.classList.add("opacity-0"); setTimeout(()=>planModal?.classList.add("invisible"),200); planModal?.classList.remove("active"); });
planModal?.addEventListener("click",(e)=>{ if(e.target===planModal){ planModal.classList.add("opacity-0"); setTimeout(()=>planModal.classList.add("invisible"),200); planModal.classList.remove("active"); }});

/* ============================================================
   KPI ANIMATION + FORM + PWA
   ============================================================ */

/* KPIs */
document.querySelectorAll(".kpi").forEach(el=>{
  const target=Number(el.dataset.target||"0"); const dur=1000; const start=performance.now();
  function step(ts){ const p=Math.min(1,(ts-start)/dur); const val=Math.floor(target*p); el.textContent=val.toLocaleString("pt-BR"); if(p<1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
});

/* Formulário de lead */
const leadForm=document.getElementById("leadForm");
const leadFeedback=document.getElementById("leadFeedback");
leadForm?.addEventListener("submit",(e)=>{ e.preventDefault(); leadFeedback?.classList.remove("hidden"); leadForm.reset(); });

/* PWA install banner */
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

/* SW atualização suave */
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
