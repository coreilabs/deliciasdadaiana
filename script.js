(function () {
  const whatsappMessages = {
    evento: "Olá, Delícias da Daiana! Gostaria de solicitar um orçamento para meu evento.",
    marmitex: "Olá, Delícias da Daiana! Quero informações sobre marmitex.",
    macarrao: "Olá, Delícias da Daiana! Gostaria de orçar buffet de macarrão ao vivo."
  };

  const phone = "5562984791201";
  const header = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteMenu = document.querySelector("[data-site-menu]");
  const budgetButtons = document.querySelectorAll("[data-budget]");
  const whatsappLink = document.querySelector("[data-whatsapp-link]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function makeWhatsAppUrl(message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  function closeMenu() {
    if (!menuToggle || !siteMenu) return;
    document.body.classList.remove("menu-open");
    siteMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<span class="sr-only">Abrir menu</span><i data-lucide="menu" aria-hidden="true"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function toggleMenu() {
    if (!menuToggle || !siteMenu) return;
    const isOpen = siteMenu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.innerHTML = isOpen
      ? '<span class="sr-only">Fechar menu</span><i data-lucide="x" aria-hidden="true"></i>'
      : '<span class="sr-only">Abrir menu</span><i data-lucide="menu" aria-hidden="true"></i>';
    if (window.lucide) window.lucide.createIcons();
  }

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function initCarousel() {
    if (!window.Swiper) return;

    new window.Swiper(".flavor-carousel", {
      loop: true,
      speed: 620,
      grabCursor: true,
      centeredSlides: false,
      slidesPerView: 1.08,
      spaceBetween: 14,
      loopAdditionalSlides: 4,
      autoplay: {
        delay: 2600,
        disableOnInteraction: false
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },
      navigation: {
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom"
      },
      breakpoints: {
        620: {
          slidesPerView: 2.2,
          spaceBetween: 16
        },
        860: {
          slidesPerView: 3.25,
          spaceBetween: 18
        },
        1120: {
          slidesPerView: 4.15,
          spaceBetween: 20
        }
      }
    });
  }

  function initReveal() {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window) || reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  function initParallax() {
    const parallaxItems = document.querySelectorAll("[data-parallax]");
    if (!parallaxItems.length || reduceMotion) return;

    let ticking = false;

    function update() {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const offset = (viewportCenter - center) * 0.08;
        item.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
      });
      ticking = false;
    }

    function requestTick() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
  }

  function initBudgetButtons() {
    budgetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const type = button.dataset.budget;
        const message = whatsappMessages[type] || whatsappMessages.evento;
        budgetButtons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        if (whatsappLink) whatsappLink.href = makeWhatsAppUrl(message);
      });
    });
  }

  menuToggle?.addEventListener("click", toggleMenu);
  siteMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("scroll", updateHeader, { passive: true });

  updateHeader();
  initCarousel();
  initReveal();
  initParallax();
  initBudgetButtons();

  if (window.lucide) {
    window.lucide.createIcons();
  }
})();
