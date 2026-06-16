/* ============================================================
   VIVI CRIA MUNDOS — Script completo
   ============================================================ */

const CONFIG = {
  brandName:    "Vivi Cria Mundos",
  whatsappNumber: "5500000000000", // Substitua pelo número real
  instagramUrl:   "https://instagram.com/", // Substitua pelo Instagram real
};

// ---- DOM elements ----
const body         = document.body;
const header       = document.querySelector("[data-header]");
const menuToggle   = document.querySelector(".menu-toggle");
const navLinks     = document.querySelector(".nav-links");
const cursorGlow   = document.querySelector(".cursor-glow");
const yearEl       = document.querySelector("#year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const normalizedPhone = CONFIG.whatsappNumber.replace(/\D/g, "");

if (yearEl) yearEl.textContent = new Date().getFullYear();

// Update Instagram links
document.querySelectorAll("a[href='https://instagram.com/']").forEach((link) => {
  if (CONFIG.instagramUrl) link.href = CONFIG.instagramUrl;
});

// ---- WhatsApp ----
function makeWhatsAppUrl(message) {
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

function bindWhatsAppLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    const msg = el.getAttribute("data-whatsapp") || `Olá! Vim pelo site da ${CONFIG.brandName}.`;
    el.href = makeWhatsAppUrl(msg);
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
}
bindWhatsAppLinks();

// ---- Header scroll ----
window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}, { passive: true });

// ---- Mobile menu ----
menuToggle?.addEventListener("click", () => {
  const opened = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});
navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// ---- Active nav link ----
const sectionLinks   = Array.from(navLinks?.querySelectorAll("a[href^='#']") || []);
const linkedSections = sectionLinks
  .map((l) => document.querySelector(l.getAttribute("href")))
  .filter(Boolean);

if (linkedSections.length) {
  const navObs = new IntersectionObserver(
    (entries) => {
      const vis = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis) {
        sectionLinks.forEach((l) => {
          l.getAttribute("href") === `#${vis.target.id}`
            ? l.setAttribute("aria-current", "page")
            : l.removeAttribute("aria-current");
        });
      }
    },
    { threshold: 0.42, rootMargin: "-18% 0px -54% 0px" }
  );
  linkedSections.forEach((s) => navObs.observe(s));
}

// ---- Reveal on scroll ----
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visible");
      revealObs.unobserve(e.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));

// ---- Count-up numbers ----
const countObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const final = Number(el.dataset.count);
      const dur = 1400;
      const start = performance.now();
      function anim(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(final * eased);
        if (p < 1) requestAnimationFrame(anim);
      }
      requestAnimationFrame(anim);
      countObs.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));

// ---- Magnetic buttons ----
document.querySelectorAll(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    if (prefersReducedMotion) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * 0.09}px, ${y * 0.13}px)`;
  });
  el.addEventListener("mouseleave", () => { el.style.transform = ""; });
});

// ---- 3D Tilt cards ----
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (prefersReducedMotion || window.innerWidth < 900) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(1000px) rotateX(${y * -6}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

// ---- Cursor glow ----
window.addEventListener("pointermove", (e) => {
  if (!cursorGlow || prefersReducedMotion || window.innerWidth < 900) return;
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top  = `${e.clientY}px`;
}, { passive: true });
window.addEventListener("pointerleave", () => {
  if (cursorGlow) cursorGlow.style.opacity = "0";
});

// ---- Accordion ----
document.querySelectorAll(".accordion-button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    const content  = btn.nextElementSibling;

    document.querySelectorAll(".accordion-button").forEach((other) => {
      if (other === btn) return;
      other.setAttribute("aria-expanded", "false");
      other.nextElementSibling.style.maxHeight = "0";
    });

    btn.setAttribute("aria-expanded", String(!expanded));
    content.style.maxHeight = expanded ? "0" : `${content.scrollHeight}px`;
  });
});

// ---- Filter (projects) ----
const filterBtns = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;
    filterBtns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");

    projectCards.forEach((card) => {
      const cats = card.dataset.category.split(" ");
      const show = filter === "all" || cats.includes(filter);
      card.classList.toggle("is-hidden", !show);
      card.setAttribute("aria-hidden", String(!show));
      card.querySelectorAll("a, button").forEach((ctrl) => {
        show ? ctrl.removeAttribute("tabindex") : ctrl.setAttribute("tabindex", "-1");
      });
    });
  });
});

// ---- Particle Canvas (filamentos, cubos e brilhos 3D) ----
(function initParticles() {
  const canvas = document.querySelector("#particleCanvas");
  if (!canvas || prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let trails = [];
  let W = 0, H = 0, animId = null;
  let tick = 0;

  const COLORS = ["#00d4ff", "#a855f7", "#ffd700", "#ff6b35", "#ff4da6", "#00ff88"];

  function setup() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = W < 600 ? 36 : W < 1000 ? 62 : 92;
    particles = Array.from({ length: count }, () => createParticle(Math.random() * W, Math.random() * H));

    const trailCount = W < 700 ? 3 : 6;
    trails = Array.from({ length: trailCount }, (_, i) => ({
      phase: Math.random() * Math.PI * 2,
      y: (H / (trailCount + 1)) * (i + 1),
      amp: 26 + Math.random() * 44,
      speed: 0.006 + Math.random() * 0.006,
      color: COLORS[i % COLORS.length],
      width: 2 + Math.random() * 2,
    }));
  }

  function createParticle(x, y) {
    const typeRoll = Math.random();
    return {
      x,
      y,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: -(Math.random() * 0.48 + 0.08),
      alpha: Math.random() * 0.55 + 0.12,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      drift: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: typeRoll > 0.72 ? "cube" : typeRoll > 0.46 ? "star" : "dot",
    };
  }

  function drawStar(x, y, r, color, alpha, rotation = 0) {
    const spikes = 4;
    const inner  = r * 0.42;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const ang = (i * Math.PI) / spikes - Math.PI / 2;
      const rad = i % 2 === 0 ? r : inner;
      i === 0
        ? ctx.moveTo(Math.cos(ang) * rad, Math.sin(ang) * rad)
        : ctx.lineTo(Math.cos(ang) * rad, Math.sin(ang) * rad);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawCube(x, y, s, color, alpha, rotation = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(-s / 2, -s / 2, s, s);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.18;
    ctx.fill();
    ctx.restore();
  }

  function drawFilamentTrail(trail) {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = trail.color;
    ctx.shadowColor = trail.color;
    ctx.shadowBlur = 18;
    ctx.lineWidth = trail.width;
    ctx.beginPath();
    for (let x = -40; x <= W + 40; x += 20) {
      const y = trail.y + Math.sin(x * 0.012 + trail.phase + tick * trail.speed) * trail.amp;
      if (x === -40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    trails.forEach(drawFilamentTrail);

    particles.forEach((p, index) => {
      p.drift += 0.012;
      p.rotation += p.rotationSpeed;
      p.x += p.speedX + Math.sin(p.drift) * 0.22;
      p.y += p.speedY;

      if (p.y < -24 || p.x < -24 || p.x > W + 24) {
        particles[index] = createParticle(Math.random() * W, H + Math.random() * 80);
        return;
      }

      if (p.type === "star") {
        drawStar(p.x, p.y, p.size * 2.3, p.color, p.alpha, p.rotation);
      } else if (p.type === "cube") {
        drawCube(p.x, p.y, p.size * 4, p.color, p.alpha * 0.75, p.rotation);
      } else {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    animId = requestAnimationFrame(draw);
  }

  setup();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    setup();
    draw();
  }, { passive: true });
})();

// ---- Quiz ----
(function initQuiz() {
  const questions = [
    {
      label: "Ocasião",
      question: "Para que você quer o projeto?",
      options: [
        "Presente para alguém especial",
        "Decorar minha casa ou escritório",
        "Criar brinquedos ou lembranças especiais",
        "Criar algo só para mim",
      ],
    },
    {
      label: "Tipo de peça",
      question: "Que tipo de peça te interessa mais?",
      options: [
        "Miniatura / réplica de algo real",
        "Peça decorativa e artística",
        "Brinquedo personalizado",
        "Item religioso ou lembrança de fé",
        "Não sei ainda, quero sugestões",
      ],
    },
    {
      label: "Personalização",
      question: "Qual nível de personalização você quer?",
      options: [
        "Algo já pronto, só escolho a cor",
        "Quero pequenos ajustes num modelo",
        "Projeto 100% do zero, do meu jeito",
        "Tenho um arquivo e quero só imprimir",
      ],
    },
    {
      label: "Prazo",
      question: "Qual é o seu prazo?",
      options: [
        "Urgente (até 3 dias)",
        "Normal (até 1 semana)",
        "Tenho bastante tempo",
        "Ainda não sei a data",
      ],
    },
  ];

  const card         = document.querySelector(".quiz-card");
  const qBlock       = document.querySelector("[data-quiz-question]");
  const qTitle       = qBlock?.querySelector("h3");
  const qOverline    = qBlock?.querySelector(".quiz-overline, p");
  const optionsWrap  = document.querySelector("[data-quiz-options]");
  const backBtn      = document.querySelector("[data-quiz-back]");
  const nextBtn      = document.querySelector("[data-quiz-next]");
  const stepLabel    = document.querySelector("[data-quiz-step-label]");
  const bar          = document.querySelector("[data-quiz-bar]");
  const resultBlock  = document.querySelector("[data-quiz-result]");
  const summaryEl    = document.querySelector("[data-quiz-summary]");
  const whatsappBtn  = document.querySelector("[data-quiz-whatsapp]");
  const restartBtn   = document.querySelector("[data-quiz-restart]");
  const actionsBlock = document.querySelector("[data-quiz-actions]");

  if (!card || !qTitle || !optionsWrap || !backBtn || !nextBtn) return;

  let step = 0;
  const answers = [];

  function renderStep() {
    const q = questions[step];
    qBlock.hidden = false;
    if (resultBlock)  resultBlock.hidden  = true;
    if (actionsBlock) actionsBlock.hidden = false;

    qTitle.textContent = q.question;
    if (qOverline) qOverline.textContent = q.label;
    optionsWrap.innerHTML = "";

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-option";
      btn.textContent = opt;
      btn.setAttribute("aria-pressed", answers[step] === opt ? "true" : "false");
      if (answers[step] === opt) btn.classList.add("is-selected");

      btn.addEventListener("click", () => {
        answers[step] = opt;
        optionsWrap.querySelectorAll(".quiz-option").forEach((b) => {
          b.classList.remove("is-selected");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-selected");
        btn.setAttribute("aria-pressed", "true");
        nextBtn.disabled = false;
      });

      optionsWrap.appendChild(btn);
    });

    if (stepLabel) stepLabel.textContent = `Etapa ${step + 1} de ${questions.length}`;
    if (bar) bar.style.width = `${((step + 1) / questions.length) * 100}%`;

    backBtn.disabled = step === 0;
    nextBtn.textContent = step === questions.length - 1 ? "Ver resultado →" : "Continuar →";
    nextBtn.disabled = !answers[step];
  }

  function showResult() {
    qBlock.hidden  = true;
    if (resultBlock)  resultBlock.hidden  = false;
    if (actionsBlock) actionsBlock.hidden = true;
    if (stepLabel) stepLabel.textContent = "Quiz concluído!";
    if (bar) bar.style.width = "100%";

    if (summaryEl) {
      summaryEl.innerHTML = questions
        .map((q, i) => `<p><strong>${q.label}:</strong> ${answers[i]}</p>`)
        .join("");
    }

    if (whatsappBtn) {
      const lines = [
        `Olá Vivi! Vim pelo site da ${CONFIG.brandName} e respondi ao quiz de projetos.`,
        "Quero uma sugestão personalizada para mim!",
        "",
        ...questions.map((q, i) => `${q.label}: ${answers[i]}`),
      ];
      whatsappBtn.href = makeWhatsAppUrl(lines.join("\n"));
      whatsappBtn.target = "_blank";
      whatsappBtn.rel = "noopener noreferrer";
    }
  }

  renderStep();

  nextBtn.addEventListener("click", () => {
    if (!answers[step]) return;
    if (step < questions.length - 1) {
      step++;
      renderStep();
      card.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
      return;
    }
    showResult();
    card.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
  });

  backBtn.addEventListener("click", () => {
    if (step === 0) return;
    step--;
    renderStep();
  });

  restartBtn?.addEventListener("click", () => {
    step = 0;
    answers.length = 0;
    renderStep();
  });
})();


// ---- Parallax colorido da cena principal ----
(function initViviParallax() {
  const hero = document.querySelector(".hero");
  const movable = document.querySelectorAll(".hero-visual [data-depth]");
  if (!hero || !movable.length || prefersReducedMotion) return;

  hero.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 900) return;
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    movable.forEach((el) => {
      const depth = Number(el.dataset.depth || 0.2);
      el.style.transform = `translate3d(${x * depth * 46}px, ${y * depth * 46}px, ${depth * 70}px)`;
    });
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    movable.forEach((el) => { el.style.transform = ""; });
  });
})();

// ---- Explosão de filamentos nos botões importantes ----
(function initFilamentBursts() {
  if (prefersReducedMotion) return;
  const colors = ["#00d4ff", "#a855f7", "#ff4da6", "#ffd700", "#00ff88", "#ff6b35"];
  const targets = document.querySelectorAll(".btn-primary, .btn-whatsapp, .project-cta, .nav-cta");

  function burst(x, y) {
    for (let i = 0; i < 14; i++) {
      const spark = document.createElement("span");
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.35;
      const distance = 32 + Math.random() * 58;
      spark.className = "filament-spark";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      spark.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      spark.style.setProperty("--spark-color", colors[i % colors.length]);
      document.body.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove(), { once: true });
    }
  }

  targets.forEach((el) => {
    el.addEventListener("pointerdown", (event) => burst(event.clientX, event.clientY));
  });
})();
