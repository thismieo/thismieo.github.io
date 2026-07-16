(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.querySelector("#neural-bg");
  const cursorAura = document.querySelector(".cursor-aura");
  const progressBar = document.querySelector(".scroll-progress");
  const typedSignal = document.querySelector("#typed-signal");
  const heroStage = document.querySelector(".core-stage");
  const spotlightCards = document.querySelectorAll(
    ".metrics-grid article, .glass-card, .roadmap-step, .stack-card, .focus-card, .project-card, .contact-card"
  );

  const phrases = [
    "Python foundations active",
    "Algorithms loading",
    "Machine learning next",
    "Building one commit at a time",
    "Neural systems in the roadmap"
  ];

  const updateScrollProgress = () => {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (!prefersReducedMotion && typedSignal) {
    let phraseIndex = 0;
    let characterIndex = 0;
    let deleting = false;

    const typeNext = () => {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        characterIndex += 1;
        typedSignal.textContent = phrase.slice(0, characterIndex);

        if (characterIndex >= phrase.length) {
          deleting = true;
          window.setTimeout(typeNext, 1500);
          return;
        }
      } else {
        characterIndex -= 1;
        typedSignal.textContent = phrase.slice(0, characterIndex);

        if (characterIndex <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          window.setTimeout(typeNext, 340);
          return;
        }
      }

      window.setTimeout(typeNext, deleting ? 34 : 62);
    };

    typedSignal.textContent = "";
    typeNext();
  }

  if (!prefersReducedMotion && cursorAura && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        cursorAura.classList.add("active");
        cursorAura.style.left = `${event.clientX}px`;
        cursorAura.style.top = `${event.clientY}px`;
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", () => cursorAura.classList.remove("active"));
  }

  spotlightCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${event.clientY - rect.top}px`);
    });
  });

  if (!prefersReducedMotion && heroStage && window.matchMedia("(pointer: fine)").matches) {
    const heroVisual = heroStage.closest(".hero-visual");

    heroVisual?.addEventListener("pointermove", (event) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroStage.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 7}deg) translateZ(0)`;
    });

    heroVisual?.addEventListener("pointerleave", () => {
      heroStage.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
    });
  }

  if (!canvas || prefersReducedMotion) return;

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const pointer = {
    x: -1000,
    y: -1000,
    active: false
  };

  const palette = [
    { r: 103, g: 232, b: 249 },
    { r: 96, g: 165, b: 250 },
    { r: 167, g: 139, b: 250 },
    { r: 240, g: 168, b: 191 }
  ];

  let width = 0;
  let height = 0;
  let ratio = 1;
  let nodes = [];
  let animationFrame = 0;

  class Node {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.radius = Math.random() * 1.6 + 0.7;
      this.velocityX = (Math.random() - 0.5) * 0.18;
      this.velocityY = -(Math.random() * 0.14 + 0.035);
      this.phase = Math.random() * Math.PI * 2;
      this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update(time) {
      this.phase += 0.008;
      this.x += this.velocityX + Math.sin(this.phase) * 0.035;
      this.y += this.velocityY;

      if (pointer.active) {
        const dx = this.x - pointer.x;
        const dy = this.y - pointer.y;
        const distanceSquared = dx * dx + dy * dy;
        const influenceRadius = 170;

        if (distanceSquared < influenceRadius * influenceRadius && distanceSquared > 0.01) {
          const distance = Math.sqrt(distanceSquared);
          const force = (1 - distance / influenceRadius) * 0.24;
          this.x += (dx / distance) * force;
          this.y += (dy / distance) * force;
        }
      }

      if (this.y < -24 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
        this.x = Math.random() * width;
      }

      this.pulse = 0.68 + Math.sin(time * 0.0017 + this.phase) * 0.22;
    }

    draw() {
      const { r, g, b } = this.color;
      context.beginPath();
      context.arc(this.x, this.y, this.radius * (0.9 + this.pulse * 0.22), 0, Math.PI * 2);
      context.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.35 + this.pulse * 0.28})`;
      context.shadowBlur = 11;
      context.shadowColor = `rgba(${r}, ${g}, ${b}, 0.65)`;
      context.fill();
      context.shadowBlur = 0;
    }
  }

  const calculateNodeCount = () => {
    const area = width * height;
    const mobile = width < 700;
    const count = Math.round(area / (mobile ? 35000 : 25000));
    return Math.max(mobile ? 18 : 34, Math.min(mobile ? 32 : 72, count));
  };

  const resizeCanvas = () => {
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const targetCount = calculateNodeCount();
    if (nodes.length > targetCount) {
      nodes = nodes.slice(0, targetCount);
    }
    while (nodes.length < targetCount) {
      nodes.push(new Node());
    }
  };

  const drawConnections = () => {
    const connectionDistance = width < 700 ? 105 : 135;
    const connectionDistanceSquared = connectionDistance * connectionDistance;

    for (let index = 0; index < nodes.length; index += 1) {
      const first = nodes[index];

      for (let secondIndex = index + 1; secondIndex < nodes.length; secondIndex += 1) {
        const second = nodes[secondIndex];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared >= connectionDistanceSquared) continue;

        const opacity = (1 - Math.sqrt(distanceSquared) / connectionDistance) * 0.13;
        const gradient = context.createLinearGradient(first.x, first.y, second.x, second.y);
        gradient.addColorStop(0, `rgba(${first.color.r}, ${first.color.g}, ${first.color.b}, ${opacity})`);
        gradient.addColorStop(1, `rgba(${second.color.r}, ${second.color.g}, ${second.color.b}, ${opacity})`);

        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.strokeStyle = gradient;
        context.lineWidth = 0.7;
        context.stroke();
      }
    }
  };

  const drawPointerConnections = () => {
    if (!pointer.active || width < 700) return;

    nodes.forEach((node) => {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 150) return;

      context.beginPath();
      context.moveTo(pointer.x, pointer.y);
      context.lineTo(node.x, node.y);
      context.strokeStyle = `rgba(103, 232, 249, ${(1 - distance / 150) * 0.18})`;
      context.lineWidth = 0.8;
      context.stroke();
    });
  };

  const animate = (time) => {
    context.clearRect(0, 0, width, height);
    nodes.forEach((node) => node.update(time));
    drawConnections();
    drawPointerConnections();
    nodes.forEach((node) => node.draw());
    animationFrame = window.requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resizeCanvas, { passive: true });
  window.addEventListener(
    "pointermove",
    (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    },
    { passive: true }
  );
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
    } else {
      animationFrame = window.requestAnimationFrame(animate);
    }
  });

  resizeCanvas();
  animationFrame = window.requestAnimationFrame(animate);
})();

/* Portfolio V4 — cinematic portrait, refined AI core, and project showcase */
(() => {
  const hero = document.querySelector("#home");
  const heroGrid = hero?.querySelector(".hero-grid");
  const heroMetrics = hero?.querySelector(".metrics-grid");
  const brandPortrait = document.querySelector(".brand-portrait img");
  const core = document.querySelector(".core");
  const projectsGrid = document.querySelector("#projects .projects-grid");
  const projectsIntro = document.querySelector("#projects .section-heading > p");
  const portraitSource = brandPortrait?.src;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (hero && portraitSource) {
    const maroonWash = document.createElement("div");
    maroonWash.className = "hero-maroon-wash";
    maroonWash.setAttribute("aria-hidden", "true");

    const portraitBackdrop = document.createElement("div");
    portraitBackdrop.className = "hero-portrait-backdrop";
    portraitBackdrop.setAttribute("aria-hidden", "true");
    portraitBackdrop.style.backgroundImage = `url("${portraitSource}")`;

    const portraitMeta = document.createElement("div");
    portraitMeta.className = "portrait-meta";
    portraitMeta.innerHTML = `<span>PERSONAL IDENTITY</span><strong>Mohammed Muayad</strong><small>AI Engineering Journey · Baghdad</small>`;
    portraitBackdrop.appendChild(portraitMeta);

    hero.prepend(maroonWash);
    hero.insertBefore(portraitBackdrop, heroGrid || hero.firstChild);

    const updatePortrait = () => {
      const heroHeight = Math.max(hero.offsetHeight, window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / (heroHeight * 0.74)));
      const mobile = window.innerWidth < 700;
      const baseOpacity = mobile ? 0.16 : 0.32;
      portraitBackdrop.style.opacity = String(baseOpacity * (1 - progress));
      portraitBackdrop.style.transform = reducedMotion
        ? "translate3d(0, 0, 0)"
        : `translate3d(0, ${progress * -135}px, 0) scale(${1 + progress * 0.035})`;
    };

    window.addEventListener("scroll", updatePortrait, { passive: true });
    window.addEventListener("resize", updatePortrait, { passive: true });
    updatePortrait();
  }

  if (heroGrid) heroGrid.classList.add("hero-grid-v4");
  if (heroMetrics) heroMetrics.classList.add("metrics-v4");

  if (core) {
    core.classList.remove("profile-core");
    core.classList.add("core-v4");
    core.innerHTML = `
      <small>INTELLIGENCE ENGINE</small>
      <strong>AI</strong>
      <span>LEARN · TRAIN · BUILD</span>
      <i class="core-spark core-spark-one" aria-hidden="true"></i>
      <i class="core-spark core-spark-two" aria-hidden="true"></i>
      <i class="core-spark core-spark-three" aria-hidden="true"></i>
    `;
  }

  if (projectsIntro) {
    projectsIntro.textContent =
      "Future portfolio systems presented as clear engineering concepts, each designed to become a documented repository when its learning stage begins.";
  }

  if (projectsGrid) {
    projectsGrid.innerHTML = `
      <article class="project-card project-concept project-health project-v4 visible">
        <div class="project-visual project-visual-health" aria-hidden="true">
          <svg viewBox="0 0 360 120"><path class="grid-line" d="M0 30H360M0 60H360M0 90H360M60 0V120M120 0V120M180 0V120M240 0V120M300 0V120"/><path class="signal-line" d="M0 72 L42 72 L59 58 L77 84 L99 35 L121 73 L154 73 L176 63 L198 77 L225 48 L246 73 L360 73"/></svg>
          <div class="visual-badge"><span>DATA SIGNAL</span><b>HEALTH / 01</b></div>
        </div>
        <div class="project-body">
          <div class="project-top"><span>HEALTH DATA ANALYSIS</span><b>01</b></div>
          <h3>Heart Disease Risk Analysis</h3>
          <p>A planned analysis of patient indicators such as age, blood pressure, cholesterol, heart rate, and chest-pain patterns to discover meaningful health trends.</p>
          <div class="project-tags"><span>Python</span><span>Pandas</span><span>Healthcare Data</span></div>
          <span class="project-status status-planned">PLANNED</span>
        </div>
      </article>

      <article class="project-card project-concept project-fraud project-v4 visible">
        <div class="project-visual project-visual-fraud" aria-hidden="true">
          <svg viewBox="0 0 360 120"><g class="network-lines"><path d="M30 88L94 34L164 72L226 26L322 68"/><path d="M30 88L164 72L322 68"/><path d="M94 34L226 26"/></g><g class="network-nodes"><circle cx="30" cy="88" r="7"/><circle cx="94" cy="34" r="7"/><circle cx="164" cy="72" r="9"/><circle cx="226" cy="26" r="7"/><circle cx="322" cy="68" r="8"/></g></svg>
          <div class="visual-badge"><span>ANOMALY MAP</span><b>SECURITY / 02</b></div>
        </div>
        <div class="project-body">
          <div class="project-top"><span>FINANCIAL INTELLIGENCE</span><b>02</b></div>
          <h3>Fraud Detection System</h3>
          <p>A future classification system designed to detect unusual transaction patterns and separate normal financial behavior from suspicious activity.</p>
          <div class="project-tags"><span>Machine Learning</span><span>Classification</span><span>Security</span></div>
          <span class="project-status status-roadmap">ROADMAP</span>
        </div>
      </article>

      <article class="project-card project-concept project-traffic project-v4 visible">
        <div class="project-visual project-visual-traffic" aria-hidden="true">
          <svg viewBox="0 0 360 120"><path class="road road-one" d="M-10 92C70 26 126 25 187 66S287 114 374 30"/><path class="road road-two" d="M-12 111C76 45 127 44 184 82S281 131 374 48"/><g class="traffic-points"><circle cx="57" cy="55" r="5"/><circle cx="135" cy="46" r="5"/><circle cx="210" cy="79" r="5"/><circle cx="302" cy="72" r="5"/></g></svg>
          <div class="visual-badge"><span>FLOW FORECAST</span><b>SMART CITY / 03</b></div>
        </div>
        <div class="project-body">
          <div class="project-top"><span>SMART CITY AI</span><b>03</b></div>
          <h3>Smart Traffic Flow Prediction</h3>
          <p>A future time-series and machine-learning system for forecasting congestion patterns and supporting more efficient urban traffic decisions.</p>
          <div class="project-tags"><span>Time Series</span><span>Prediction</span><span>Smart Systems</span></div>
          <span class="project-status status-future">FUTURE</span>
        </div>
      </article>
    `;
  }

  const style = document.createElement("style");
  style.dataset.portfolioV4 = "true";
  style.textContent = `
    :root {
      --maroon-v4: #8f2448;
      --maroon-v4-soft: rgba(143, 36, 72, 0.18);
      --maroon-v4-deep: rgba(76, 14, 41, 0.36);
    }

    .hero {
      position: relative;
      isolation: isolate;
      background:
        radial-gradient(circle at 76% 16%, rgba(143, 36, 72, 0.12), transparent 28%),
        radial-gradient(circle at 16% 42%, rgba(6, 182, 212, 0.08), transparent 34%);
    }

    .hero-maroon-wash {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
      background:
        linear-gradient(128deg, transparent 42%, rgba(143, 36, 72, 0.07) 68%, rgba(76, 14, 41, 0.19) 100%),
        radial-gradient(ellipse at 82% 33%, rgba(159, 39, 78, 0.15), transparent 43%);
    }

    .hero-maroon-wash::after {
      content: "";
      position: absolute;
      right: -11%;
      top: 9%;
      width: 48vw;
      height: 48vw;
      max-width: 720px;
      max-height: 720px;
      border: 1px solid rgba(240, 168, 191, 0.07);
      border-radius: 50%;
      box-shadow:
        0 0 0 58px rgba(159, 39, 78, 0.015),
        0 0 0 116px rgba(159, 39, 78, 0.01),
        0 0 150px rgba(143, 36, 72, 0.08);
      animation: v4MaroonBreath 8s ease-in-out infinite;
    }

    .hero-grid-v4,
    .metrics-v4 {
      position: relative;
      z-index: 4;
    }

    .hero-portrait-backdrop {
      position: absolute;
      top: 86px;
      right: 25%;
      z-index: 1;
      width: min(32vw, 470px);
      height: min(78vh, 720px);
      pointer-events: none;
      border-radius: 48% 48% 38% 38%;
      background-position: 50% 38%;
      background-repeat: no-repeat;
      background-size: cover;
      filter: grayscale(0.16) saturate(0.74) contrast(1.08);
      mix-blend-mode: screen;
      -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 11%, #000 57%, transparent 94%), radial-gradient(ellipse at center, #000 35%, transparent 75%);
      mask-image: linear-gradient(to bottom, transparent 0%, #000 11%, #000 57%, transparent 94%), radial-gradient(ellipse at center, #000 35%, transparent 75%);
      -webkit-mask-composite: source-in;
      mask-composite: intersect;
      will-change: opacity, transform;
      transition: opacity 80ms linear, transform 80ms linear;
    }

    .hero-portrait-backdrop::before {
      content: "";
      position: absolute;
      inset: 7% 4% 5%;
      border: 1px solid rgba(240, 168, 191, 0.12);
      border-radius: 48% 48% 42% 42%;
      box-shadow: inset 0 0 80px rgba(3, 7, 18, 0.28), 0 0 70px rgba(143, 36, 72, 0.08);
    }

    .portrait-meta {
      position: absolute;
      left: 50%;
      bottom: 6%;
      width: max-content;
      max-width: 82%;
      display: grid;
      padding: 10px 13px;
      transform: translateX(-50%);
      border: 1px solid rgba(240, 168, 191, 0.14);
      border-radius: 12px;
      background: rgba(3, 7, 18, 0.58);
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(13px);
      text-align: center;
    }

    .portrait-meta span,
    .portrait-meta small {
      color: #aab7ca;
      font-size: 0.48rem;
      font-weight: 800;
      letter-spacing: 0.13em;
    }

    .portrait-meta strong {
      color: #f8fafc;
      font-family: "Space Grotesk", sans-serif;
      font-size: 0.76rem;
    }

    .hero-copy {
      text-shadow: 0 8px 42px rgba(3, 7, 18, 0.86);
    }

    .core.core-v4 {
      overflow: visible;
      isolation: isolate;
      background:
        radial-gradient(circle at 36% 28%, rgba(103, 232, 249, 0.19), transparent 27%),
        radial-gradient(circle at 68% 72%, rgba(143, 36, 72, 0.2), transparent 36%),
        rgba(4, 10, 23, 0.96);
      border-color: rgba(103, 232, 249, 0.52);
      box-shadow:
        inset 0 0 48px rgba(6, 182, 212, 0.09),
        inset 0 -30px 50px rgba(143, 36, 72, 0.08),
        0 0 0 7px rgba(6, 182, 212, 0.025),
        0 0 78px rgba(6, 182, 212, 0.15);
    }

    .core.core-v4::before {
      border-color: rgba(103, 232, 249, 0.22);
      box-shadow: 0 0 32px rgba(6, 182, 212, 0.08);
    }

    .core.core-v4::after {
      inset: -25px;
      border-color: rgba(240, 168, 191, 0.11);
      animation-delay: 1.3s;
    }

    .core.core-v4 small,
    .core.core-v4 span {
      position: static;
      width: auto;
      max-width: none;
      padding: 0;
      transform: none;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
      text-shadow: none;
      white-space: nowrap;
    }

    .core.core-v4 small {
      color: #9cb0c8;
      font-size: 0.52rem;
      letter-spacing: 0.18em;
    }

    .core.core-v4 strong {
      margin: 5px 0 2px;
      background: linear-gradient(135deg, #fff 5%, #67e8f9 43%, #a78bfa 70%, #f0a8bf 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      font-size: 3.6rem;
      filter: drop-shadow(0 0 17px rgba(103, 232, 249, 0.18));
    }

    .core.core-v4 span {
      color: #8190a8;
      font-size: 0.48rem;
      letter-spacing: 0.14em;
    }

    .core-spark {
      position: absolute;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #67e8f9;
      box-shadow: 0 0 14px currentColor;
      animation: v4Spark 4.6s ease-in-out infinite;
    }

    .core-spark-one { top: 13%; right: 21%; }
    .core-spark-two { right: 11%; bottom: 27%; animation-delay: -1.6s; color: #f0a8bf; background: currentColor; }
    .core-spark-three { bottom: 12%; left: 26%; animation-delay: -3s; color: #a78bfa; background: currentColor; }

    #projects {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 94% 20%, rgba(143, 36, 72, 0.08), transparent 32%),
        linear-gradient(180deg, transparent, rgba(143, 36, 72, 0.018), transparent);
    }

    #projects::before {
      content: "";
      position: absolute;
      inset: 18% -20% auto auto;
      width: 520px;
      height: 520px;
      border: 1px solid rgba(240, 168, 191, 0.045);
      border-radius: 50%;
      box-shadow: 0 0 0 70px rgba(143, 36, 72, 0.012), 0 0 120px rgba(143, 36, 72, 0.035);
      pointer-events: none;
    }

    .projects-grid {
      align-items: stretch;
    }

    .project-v4 {
      min-height: 520px;
      display: flex;
      flex-direction: column;
      padding: 0;
      overflow: hidden;
      border-color: rgba(255, 255, 255, 0.095);
      background: linear-gradient(155deg, rgba(15, 24, 45, 0.88), rgba(6, 12, 28, 0.9));
      box-shadow: 0 28px 70px rgba(0, 0, 0, 0.25);
    }

    .project-v4:hover {
      transform: translateY(-8px);
      border-color: rgba(103, 232, 249, 0.22);
      box-shadow: 0 34px 86px rgba(0, 0, 0, 0.35), 0 0 36px rgba(6, 182, 212, 0.035);
    }

    .project-v4::before {
      opacity: 0.45;
    }

    .project-visual {
      position: relative;
      height: 168px;
      flex: 0 0 auto;
      overflow: hidden;
      border-bottom: 1px solid rgba(255, 255, 255, 0.075);
      background:
        linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.07), transparent 70%);
      background-size: 24px 24px, 24px 24px, auto;
    }

    .project-visual::after {
      content: "";
      position: absolute;
      inset: auto 0 0;
      height: 70%;
      background: linear-gradient(to top, rgba(5, 11, 25, 0.92), transparent);
      pointer-events: none;
    }

    .project-visual svg {
      position: absolute;
      inset: 18px 0 0;
      width: 100%;
      height: calc(100% - 18px);
      overflow: visible;
    }

    .visual-badge {
      position: absolute;
      left: 18px;
      bottom: 15px;
      z-index: 2;
      display: grid;
      padding: 7px 10px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9px;
      background: rgba(3, 7, 18, 0.64);
      backdrop-filter: blur(10px);
    }

    .visual-badge span {
      color: #75859e;
      font-size: 0.48rem;
      font-weight: 800;
      letter-spacing: 0.14em;
    }

    .visual-badge b {
      color: #e9f9ff;
      font-size: 0.62rem;
      letter-spacing: 0.07em;
    }

    .project-body {
      min-height: 0;
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 24px;
    }

    .project-body .project-top {
      margin-bottom: 27px;
    }

    .project-body h3 {
      margin: 0 0 13px;
      font-size: 1.38rem;
    }

    .project-body p {
      margin-bottom: 24px;
    }

    .project-body .project-tags {
      margin-top: auto;
    }

    .project-body .project-status {
      margin-top: 21px;
    }

    .project-visual-health .grid-line {
      fill: none;
      stroke: rgba(103, 232, 249, 0.07);
      stroke-width: 1;
    }

    .project-visual-health .signal-line {
      fill: none;
      stroke: #6ee7b7;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 430;
      filter: drop-shadow(0 0 7px rgba(110, 231, 183, 0.52));
      animation: v4SignalDraw 5s ease-in-out infinite;
    }

    .project-visual-fraud .network-lines path {
      fill: none;
      stroke: rgba(147, 197, 253, 0.3);
      stroke-width: 1.4;
      stroke-dasharray: 5 8;
      animation: v4Dash 5s linear infinite;
    }

    .project-visual-fraud .network-nodes circle {
      fill: #93c5fd;
      stroke: rgba(255, 255, 255, 0.22);
      stroke-width: 1;
      filter: drop-shadow(0 0 8px rgba(147, 197, 253, 0.62));
      animation: v4NodePulse 3.2s ease-in-out infinite;
    }

    .project-visual-fraud .network-nodes circle:nth-child(3) {
      fill: #f0a8bf;
      animation-delay: -1.4s;
    }

    .project-visual-traffic .road {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-dasharray: 12 10;
      animation: v4RoadFlow 4.2s linear infinite;
    }

    .project-visual-traffic .road-one { stroke: rgba(240, 168, 191, 0.58); }
    .project-visual-traffic .road-two { stroke: rgba(167, 139, 250, 0.38); animation-direction: reverse; }

    .project-visual-traffic .traffic-points circle {
      fill: #f0a8bf;
      filter: drop-shadow(0 0 8px rgba(240, 168, 191, 0.72));
      animation: v4TrafficPulse 2.8s ease-in-out infinite;
    }

    .project-visual-traffic .traffic-points circle:nth-child(2n) { animation-delay: -1.1s; }

    .project-traffic {
      --project-accent: rgba(143, 36, 72, 0.24);
    }

    @keyframes v4MaroonBreath {
      0%, 100% { transform: scale(0.96); opacity: 0.5; }
      50% { transform: scale(1.04); opacity: 1; }
    }

    @keyframes v4Spark {
      0%, 100% { transform: scale(0.72); opacity: 0.36; }
      50% { transform: scale(1.35); opacity: 1; }
    }

    @keyframes v4SignalDraw {
      0%, 15% { stroke-dashoffset: 430; opacity: 0.28; }
      48%, 72% { stroke-dashoffset: 0; opacity: 1; }
      100% { stroke-dashoffset: -430; opacity: 0.35; }
    }

    @keyframes v4Dash { to { stroke-dashoffset: -52; } }

    @keyframes v4NodePulse {
      0%, 100% { transform: scale(0.8); opacity: 0.55; transform-box: fill-box; transform-origin: center; }
      50% { transform: scale(1.2); opacity: 1; }
    }

    @keyframes v4RoadFlow { to { stroke-dashoffset: -44; } }

    @keyframes v4TrafficPulse {
      0%, 100% { opacity: 0.35; }
      50% { opacity: 1; }
    }

    @media (max-width: 1120px) {
      .hero-portrait-backdrop {
        right: 18%;
        width: min(35vw, 420px);
      }
    }

    @media (max-width: 860px) {
      .hero-portrait-backdrop {
        top: 90px;
        right: 50%;
        width: min(60vw, 430px);
        height: 54vh;
        transform: translateX(50%);
        opacity: 0.14;
        mix-blend-mode: screen;
      }

      .portrait-meta {
        display: none;
      }

      .hero-copy {
        position: relative;
        z-index: 3;
      }

      .hero-visual {
        position: relative;
        z-index: 4;
      }

      .project-v4 {
        min-height: 500px;
      }
    }

    @media (max-width: 580px) {
      .hero-maroon-wash::after {
        right: -42%;
        top: 16%;
        width: 105vw;
        height: 105vw;
      }

      .hero-portrait-backdrop {
        top: 86px;
        right: -8%;
        width: 74vw;
        height: 52vh;
        background-position: 50% 34%;
        transform: none;
        opacity: 0.12;
      }

      .core.core-v4 strong {
        font-size: 2.65rem;
      }

      .core.core-v4 small {
        font-size: 0.38rem;
      }

      .core.core-v4 span {
        font-size: 0.34rem;
      }

      .project-v4 {
        min-height: 0;
      }

      .project-visual {
        height: 145px;
      }

      .project-body {
        padding: 21px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-maroon-wash::after,
      .core-spark,
      .signal-line,
      .network-lines path,
      .network-nodes circle,
      .road,
      .traffic-points circle {
        animation: none !important;
      }
    }
  `;

  document.head.appendChild(style);
})();
