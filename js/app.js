/* ============================================================
   BEBIDA SELADA® v5.2 — EXECUTIVE REFINE GOLD
   UX Refinements — Toasts, Smooth Interactions & Microanimações
   ============================================================ */

console.log('%c✨ Bebida Selada® v5.2 — Executive Refine Gold', 'color:#EDC765;font-weight:bold;font-size:14px;');

/* ===== FUNÇÃO UNIVERSAL DE TOAST ===== */
function showToast(message, type = 'success') {
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = message;
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('show'));

  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

/* ===== ROLAGEM SUAVE ENTRE SEÇÕES ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Scroll suave para âncoras internas
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id && id.startsWith('#') && id.length > 1 && document.querySelector(id)) {
        e.preventDefault();
        document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ===== CONTADORES ANIMADOS (KPIs) ===== */
  const counters = document.querySelectorAll('.kpi .num');
  let hasAnimated = false;

  function animateCounters() {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const increment = Math.ceil(target / 100);
      
      const timer = setInterval(() => {
        current += increment;
        counter.textContent = current.toLocaleString('pt-BR');
        
        if (current >= target) {
          counter.textContent = target.toLocaleString('pt-BR');
          clearInterval(timer);
        }
      }, 15);
    });
    hasAnimated = true;
  }

  // Observer para animar quando a seção ficar visível
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        animateCounters();
        obs.disconnect();
      }
    });
  });

  const kpisSection = document.querySelector('#kpis');
  if (kpisSection) {
    observer.observe(kpisSection);
  }

  /* ===== FORMULÁRIO REPRESENTANTES ===== */
  const formRep = document.querySelector('#formRep');
  if (formRep) {
    formRep.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✅ Solicitação enviada com sucesso. Em breve entraremos em contato via WhatsApp.', 'success');
      formRep.reset();
    });
  }

  /* ===== FORMULÁRIO PROGRAMA CIDADES ===== */
  const formCidades = document.querySelector('#formCidades');
  if (formCidades) {
    formCidades.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✅ Solicitação enviada com sucesso. Em breve entraremos em contato via WhatsApp.', 'success');
      formCidades.reset();
    });
  }

  /* ===== MICROCOPY NO MODAL QR (Após resultado de auditoria) ===== */
  // Aguarda o modal ser exibido e adiciona microcopy institucional
  const auditResult = document.querySelector('#auditResult');
  if (auditResult) {
    // Observa quando o resultado é exibido
    const resultObserver = new MutationObserver(() => {
      if (auditResult.style.display !== 'none' && auditResult.style.display !== '') {
        // Verifica se já não existe o microcopy
        if (!auditResult.querySelector('.verification-microcopy')) {
          const existingMicro = auditResult.querySelector('.micro.muted');
          if (existingMicro) {
            const microcopy = document.createElement('p');
            microcopy.className = 'micro verification-microcopy';
            microcopy.style.cssText = 'margin-top:8px;opacity:.85;color:var(--ink-2);';
            microcopy.textContent = 'Verificação autenticada em tempo real — Powered by Rede Segura Nacional.';
            existingMicro.insertAdjacentElement('beforebegin', microcopy);
          }
        }

        // Som opcional após autenticação positiva
        try {
          const audio = new Audio('sounds/qr-sound.mp3');
          audio.volume = 0.3;
          audio.play().catch(() => {
            // Silenciosamente falha se o arquivo não existir ou autoplay bloqueado
          });
        } catch (_) {
          // Ignora erro se áudio não estiver disponível
        }
      }
    });

    resultObserver.observe(auditResult, {
      attributes: true,
      attributeFilter: ['style']
    });
  }

  /* ===== FEEDBACK VISUAL EM BOTÕES ===== */
  document.querySelectorAll('.btn, .btn-principal, .btn.primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Adiciona efeito ripple
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.6);
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
        pointer-events: none;
        animation: ripple 0.6s ease-out;
      `;
      
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* ===== LOG DE INICIALIZAÇÃO ===== */
  console.log('%c🛡️ Sistema de certificação carregado', 'color:#DAE3E7;font-size:12px;');
  console.log('%c📡 Rede Segura Nacional ativa', 'color:#DAE3E7;font-size:12px;');
});

/* ===== CSS PARA RIPPLE EFFECT ===== */
if (!document.querySelector('#ripple-animation')) {
  const style = document.createElement('style');
  style.id = 'ripple-animation';
  style.textContent = `
    @keyframes ripple {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(40);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
