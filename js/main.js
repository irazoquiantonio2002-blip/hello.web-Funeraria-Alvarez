(() => {
  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("nav-toggle");
  const loader = document.getElementById("loading-screen");
  const year = document.getElementById("year");
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImage = document.getElementById("gallery-lightbox-image");
  const lightboxClose = document.querySelector(".gallery-lightbox-close");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("is-hidden");
    }, 420);
  });

  const setHeaderState = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    toggle.classList.toggle("is-open", Boolean(isOpen));
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  document.querySelectorAll(".nav-link, .main-nav .btn").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      toggle?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14 });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      observer.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];

  const syncActiveLink = () => {
    const current = sections
      .filter((section) => section.offsetTop - 120 <= window.scrollY)
      .pop();

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current?.id}`);
    });
  };

  syncActiveLink();
  window.addEventListener("scroll", syncActiveLink, { passive: true });

  const words = [
    "servicios funerarios 24 horas",
    "traslados locales y nacionales",
    "trámites y certificados",
    "velación, cremación y ataúdes"
  ];
  const typewriter = document.getElementById("typewriter");
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    if (!typewriter) return;

    const currentWord = words[wordIndex];
    const nextText = currentWord.slice(0, charIndex);
    typewriter.textContent = nextText;

    if (!deleting && charIndex < currentWord.length) {
      charIndex += 1;
      window.setTimeout(type, 52);
      return;
    }

    if (!deleting && charIndex === currentWord.length) {
      deleting = true;
      window.setTimeout(type, 1500);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(type, 26);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(type, 260);
  };

  type();

  const closeLightbox = () => {
    lightbox?.classList.remove("is-open");
    lightbox?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    if (lightboxImage) lightboxImage.removeAttribute("src");
  };

  document.querySelectorAll(".gallery-item img").forEach((image) => {
    image.parentElement?.addEventListener("click", () => {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("lightbox-open");
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  const canvas = document.getElementById("particles-canvas");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    const particles = [];
    const particleCount = 58;
    let width = 0;
    let height = 0;
    let animationFrame;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const seedParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.6,
          speed: Math.random() * 0.22 + 0.08,
          drift: Math.random() * 0.18 - 0.09,
          alpha: Math.random() * 0.48 + 0.12
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        particle.y -= particle.speed;
        particle.x += particle.drift;

        if (particle.y < -10) {
          particle.y = height + 10;
          particle.x = Math.random() * width;
        }

        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 5
        );
        gradient.addColorStop(0, `rgba(231, 200, 115, ${particle.alpha})`);
        gradient.addColorStop(1, "rgba(231, 200, 115, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    const resetCanvas = () => {
      window.cancelAnimationFrame(animationFrame);
      resize();
      seedParticles();
      draw();
    };

    resetCanvas();
    window.addEventListener("resize", resetCanvas);
  }
})();
