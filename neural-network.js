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
