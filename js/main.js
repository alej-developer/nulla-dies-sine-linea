/* ============================================================
   NULLA DIES SINE LINEA — Main JavaScript
   Portfolio interactivity, i18n, gallery, lightbox, forms
   ============================================================ */

;(function () {
  'use strict';

  // ── Artwork Data ──
  // Replace image paths with real photos when available
  const ARTWORKS = [
    {
      id: 1,
      title: { es: 'El pescador', en: 'The Fisherman' },
      category: 'pintura',
      technique: { es: 'Óleo sobre lienzo', en: 'Oil on canvas' },
      dimensions: '120 × 80 cm',
      year: '2025',
      image: 'assets/images/obras/pescador.jpg',
      forSale: true,
      price: null, // Consultar
      sold: false
    },
    {
      id: 2,
      title: { es: 'Fragmentos de azul', en: 'Blue Fragments' },
      category: 'pintura',
      technique: { es: 'Acrílico sobre lienzo', en: 'Acrylic on canvas' },
      dimensions: '100 × 70 cm',
      year: '2025',
      image: 'assets/images/obras/fragmentos-azul.jpg',
      forSale: true,
      price: 450,
      sold: false
    },
    {
      id: 3,
      title: { es: 'Silueta nocturna', en: 'Night Silhouette' },
      category: 'dibujo',
      technique: { es: 'Carboncillo sobre papel', en: 'Charcoal on paper' },
      dimensions: '50 × 35 cm',
      year: '2024',
      image: 'assets/images/obras/silueta-nocturna.jpg',
      forSale: true,
      price: 180,
      sold: false
    },
    {
      id: 4,
      title: { es: 'Torso clásico', en: 'Classic Torso' },
      category: 'escultura',
      technique: { es: 'Arcilla modelada', en: 'Modeled clay' },
      dimensions: '45 × 20 × 15 cm',
      year: '2024',
      image: 'assets/images/obras/torso-clasico.jpg',
      forSale: true,
      price: 600,
      sold: true
    },
    {
      id: 5,
      title: { es: 'Ondas y reflejos', en: 'Waves and Reflections' },
      category: 'pintura',
      technique: { es: 'Técnica mixta sobre tabla', en: 'Mixed media on board' },
      dimensions: '90 × 60 cm',
      year: '2025',
      image: 'assets/images/obras/ondas-reflejos.jpg',
      forSale: false,
      price: null,
      sold: false
    },
    {
      id: 6,
      title: { es: 'Manos al viento', en: 'Hands in the Wind' },
      category: 'dibujo',
      technique: { es: 'Grafito sobre papel', en: 'Graphite on paper' },
      dimensions: '40 × 30 cm',
      year: '2024',
      image: 'assets/images/obras/manos-viento.jpg',
      forSale: true,
      price: 150,
      sold: false
    },
    {
      id: 7,
      title: { es: 'Figura emergente', en: 'Emerging Figure' },
      category: 'escultura',
      technique: { es: 'Yeso patinado', en: 'Patinated plaster' },
      dimensions: '35 × 18 × 12 cm',
      year: '2025',
      image: 'assets/images/obras/figura-emergente.jpg',
      forSale: true,
      price: 380,
      sold: false
    },
    {
      id: 8,
      title: { es: 'Retrato interior', en: 'Inner Portrait' },
      category: 'pintura',
      technique: { es: 'Óleo sobre lienzo', en: 'Oil on canvas' },
      dimensions: '80 × 60 cm',
      year: '2024',
      image: 'assets/images/obras/retrato-interior.jpg',
      forSale: true,
      price: 520,
      sold: false
    },
    {
      id: 9,
      title: { es: 'Líneas del alma', en: 'Lines of the Soul' },
      category: 'dibujo',
      technique: { es: 'Tinta china sobre papel', en: 'India ink on paper' },
      dimensions: '60 × 42 cm',
      year: '2025',
      image: 'assets/images/obras/lineas-alma.jpg',
      forSale: true,
      price: 200,
      sold: false
    }
  ];

  // ── State ──
  let currentLang = localStorage.getItem('ndsl-lang') || 'es';
  let currentFilter = 'all';
  let lightboxIndex = -1;
  let filteredArtworks = [...ARTWORKS];

  // ── DOM References ──
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  // ── Initialize ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupNavigation();
    setupLanguageToggle();
    applyLanguage(currentLang);
    renderGallery();
    renderShop();
    setupGalleryFilters();
    setupLightbox();
    setupForms();
    setupScrollAnimations();
    setupCounterAnimations();
    setupLoader();
    generatePlaceholderImages();
  }

  // ── Loading Screen ──
  function setupLoader() {
    const loader = $('#loader');
    if (!loader) return;

    // Dismiss loader after animation completes
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => loader.remove(), 600);
    }, 1800);
  }

  // ── Navigation ──
  function setupNavigation() {
    const nav = $('#nav');
    const hamburger = $('#hamburger');
    const navLinks = $('#navLinks');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 50);
      lastScroll = scrollY;
    }, { passive: true });

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu on link click
    $$('.nav__link', navLinks).forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Active link highlighting on scroll
    const sections = $$('section[id]');
    const observerOptions = { threshold: 0.3 };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          $$('.nav__link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // ── Language System ──
  function setupLanguageToggle() {
    $$('.lang-toggle__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        if (lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem('ndsl-lang', lang);
        applyLanguage(lang);

        // Re-render content
        renderGallery();
        renderShop();
      });
    });
  }

  function applyLanguage(lang) {
    // Update toggle buttons
    $$('.lang-toggle__btn').forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update all elements with data-es/data-en
    $$('[data-es][data-en]').forEach(el => {
      const text = el.dataset[lang];
      if (text) {
        // For elements that contain only text (no children)
        if (el.children.length === 0 || el.tagName === 'OPTION') {
          el.textContent = text;
        }
      }
    });

    // Update placeholders
    $$('[data-placeholder-es][data-placeholder-en]').forEach(el => {
      el.placeholder = el.dataset[`placeholder${lang === 'es' ? 'Es' : 'En'}`];
    });

    // Update page title
    document.title = lang === 'es'
      ? 'NULLA DIES SINE LINEA — Tomás Andrés Delgado | Escultura · Pintura · Dibujo'
      : 'NULLA DIES SINE LINEA — Tomás Andrés Delgado | Sculpture · Painting · Drawing';
  }

  // ── Gallery Rendering ──
  function renderGallery() {
    const gallery = $('#gallery');
    if (!gallery) return;

    filteredArtworks = currentFilter === 'all'
      ? [...ARTWORKS]
      : ARTWORKS.filter(a => a.category === currentFilter);

    gallery.innerHTML = filteredArtworks.map((art, idx) => {
      const catLabels = {
        pintura: { es: 'Pintura', en: 'Painting' },
        escultura: { es: 'Escultura', en: 'Sculpture' },
        dibujo: { es: 'Dibujo', en: 'Drawing' }
      };

      return `
        <div class="gallery__item reveal" data-index="${idx}" data-category="${art.category}">
          <img
            class="gallery__img"
            src="${art.image}"
            alt="${art.title[currentLang]}"
            loading="lazy"
            onerror="this.src='data:image/svg+xml,${encodeURIComponent(generatePlaceholderSVG(art.title[currentLang], art.category))}';"
          />
          <span class="gallery__item-category">${catLabels[art.category][currentLang]}</span>
          <div class="gallery__overlay">
            <div class="gallery__item-title">${art.title[currentLang]}</div>
            <div class="gallery__item-meta">${art.technique[currentLang]} · ${art.year}</div>
          </div>
        </div>
      `;
    }).join('');

    // Re-apply scroll animations to new elements
    setupScrollAnimations();
  }

  // ── Gallery Filters ──
  function setupGalleryFilters() {
    $$('.portfolio__filter').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.portfolio__filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderGallery();
      });
    });
  }

  // ── Shop Rendering ──
  function renderShop() {
    const shopGrid = $('#shopGrid');
    if (!shopGrid) return;

    const shopItems = ARTWORKS.filter(a => a.forSale);
    const lang = currentLang;

    shopGrid.innerHTML = shopItems.map(art => {
      const badgeClass = art.sold ? 'shop-card__badge--sold' : 'shop-card__badge--available';
      const badgeText = art.sold
        ? (lang === 'es' ? 'Vendido' : 'Sold')
        : (lang === 'es' ? 'Disponible' : 'Available');

      const priceDisplay = art.price
        ? (art.sold
          ? `<span class="shop-card__price--sold">${art.price}€</span>`
          : `<span class="shop-card__price">${art.price}€</span>`)
        : `<span class="shop-card__price" style="font-size:0.9rem;">${lang === 'es' ? 'Consultar' : 'Inquire'}</span>`;

      const ctaText = art.sold
        ? ''
        : `<a href="#contact" class="btn btn--sm btn--outline">${lang === 'es' ? 'Comprar' : 'Buy'}</a>`;

      return `
        <div class="shop-card reveal">
          <span class="shop-card__badge ${badgeClass}">${badgeText}</span>
          <div class="shop-card__image-wrap">
            <img
              class="shop-card__image"
              src="${art.image}"
              alt="${art.title[lang]}"
              loading="lazy"
              onerror="this.src='data:image/svg+xml,${encodeURIComponent(generatePlaceholderSVG(art.title[lang], art.category))}';"
            />
          </div>
          <div class="shop-card__body">
            <h3 class="shop-card__title">${art.title[lang]}</h3>
            <p class="shop-card__technique">${art.technique[lang]} · ${art.dimensions}</p>
            <div class="shop-card__footer">
              ${priceDisplay}
              ${ctaText}
            </div>
          </div>
        </div>
      `;
    }).join('');

    setupScrollAnimations();
  }

  // ── Lightbox ──
  function setupLightbox() {
    const lightbox = $('#lightbox');
    const lightboxImg = $('#lightboxImg');
    const lightboxTitle = $('#lightboxTitle');
    const lightboxTechnique = $('#lightboxTechnique');
    const lightboxDimensions = $('#lightboxDimensions');
    const lightboxYear = $('#lightboxYear');

    // Open lightbox on gallery item click
    document.addEventListener('click', (e) => {
      const item = e.target.closest('.gallery__item');
      if (!item) return;

      lightboxIndex = parseInt(item.dataset.index, 10);
      updateLightbox();
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    // Close
    $('#lightboxClose').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Navigate
    $('#lightboxPrev').addEventListener('click', () => {
      lightboxIndex = (lightboxIndex - 1 + filteredArtworks.length) % filteredArtworks.length;
      updateLightbox();
    });

    $('#lightboxNext').addEventListener('click', () => {
      lightboxIndex = (lightboxIndex + 1) % filteredArtworks.length;
      updateLightbox();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
      if (e.key === 'ArrowRight') $('#lightboxNext').click();
    });

    function updateLightbox() {
      const art = filteredArtworks[lightboxIndex];
      if (!art) return;
      lightboxImg.src = art.image;
      lightboxImg.alt = art.title[currentLang];
      lightboxTitle.textContent = art.title[currentLang];
      lightboxTechnique.textContent = art.technique[currentLang];
      lightboxDimensions.textContent = art.dimensions;
      lightboxYear.textContent = art.year;
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── Forms ──
  function setupForms() {
    // Commission form → mailto
    const commissionForm = $('#commissionForm');
    if (commissionForm) {
      commissionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(commissionForm)) return;

        const data = new FormData(commissionForm);
        const lang = currentLang;

        const subject = lang === 'es'
          ? `Solicitud de encargo — ${data.get('name')}`
          : `Commission request — ${data.get('name')}`;

        const body = lang === 'es'
          ? `Hola Tomás,\n\nMe gustaría solicitar un encargo:\n\n` +
            `Nombre: ${data.get('name')}\n` +
            `Email: ${data.get('email')}\n` +
            `Tipo de obra: ${data.get('type')}\n` +
            `Dimensiones: ${data.get('size') || 'No especificado'}\n` +
            `Descripción: ${data.get('description')}\n` +
            `Presupuesto: ${data.get('budget') || 'No especificado'}\n` +
            `Plazo: ${data.get('deadline') || 'No especificado'}\n\n` +
            `Quedo a la espera de tu respuesta.\n\nSaludos.`
          : `Hi Tomás,\n\nI would like to request a commission:\n\n` +
            `Name: ${data.get('name')}\n` +
            `Email: ${data.get('email')}\n` +
            `Type of work: ${data.get('type')}\n` +
            `Dimensions: ${data.get('size') || 'Not specified'}\n` +
            `Description: ${data.get('description')}\n` +
            `Budget: ${data.get('budget') || 'Not specified'}\n` +
            `Deadline: ${data.get('deadline') || 'Not specified'}\n\n` +
            `Looking forward to your reply.\n\nBest regards.`;

        const mailto = `mailto:tomasandresdelgado2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;

        showToast(lang === 'es' ? '¡Solicitud preparada! Se abrirá tu email.' : 'Request prepared! Your email will open.');
        commissionForm.reset();
      });
    }

    // Contact form → mailto
    const contactForm = $('#contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(contactForm)) return;

        const data = new FormData(contactForm);
        const lang = currentLang;

        const subject = data.get('subject') || (lang === 'es' ? 'Contacto desde la web' : 'Contact from website');
        const body = `${data.get('message')}\n\n---\n${data.get('name')}\n${data.get('email')}`;

        const mailto = `mailto:tomasandresdelgado2002@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;

        showToast(lang === 'es' ? '¡Mensaje preparado! Se abrirá tu email.' : 'Message prepared! Your email will open.');
        contactForm.reset();
      });
    }
  }

  function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--error)';
        valid = false;
      }
      if (field.type === 'email' && field.value && !isValidEmail(field.value)) {
        field.style.borderColor = 'var(--error)';
        valid = false;
      }
    });

    if (!valid) {
      showToast(
        currentLang === 'es' ? 'Por favor, completa los campos obligatorios.' : 'Please fill in the required fields.',
        'error'
      );
    }

    return valid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Toast Notification ──
  function showToast(message, type = 'success') {
    const toast = $('#toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  // ── Scroll Animations ──
  function setupScrollAnimations() {
    const reveals = $$('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });
  }

  // ── Counter Animations ──
  function setupCounterAnimations() {
    const counters = $$('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count, 10);
          animateCounter(el, 0, target, 1500);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(el, start, end, duration) {
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // ── Placeholder Image Generator ──
  // Creates artistic SVG placeholders when real images aren't available
  function generatePlaceholderSVG(title, category) {
    const colors = {
      pintura: { bg: '#1a2a3a', accent: '#C4793A', secondary: '#5B7B99' },
      escultura: { bg: '#1a1a1a', accent: '#8a7e6d', secondary: '#5E574D' },
      dibujo: { bg: '#151515', accent: '#9B9083', secondary: '#3D3832' }
    };

    const c = colors[category] || colors.pintura;
    const seed = hashCode(title);
    const shapes = generateAbstractShapes(seed, c);

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">
      <rect width="400" height="500" fill="${c.bg}"/>
      ${shapes}
      <text x="200" y="460" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${c.accent}" opacity="0.7">${escapeXml(title)}</text>
    </svg>`;
  }

  function generateAbstractShapes(seed, colors) {
    let shapes = '';
    const random = seededRandom(seed);

    for (let i = 0; i < 5; i++) {
      const x = random() * 350 + 25;
      const y = random() * 400 + 25;
      const r = random() * 60 + 20;
      const opacity = random() * 0.3 + 0.1;
      const color = random() > 0.5 ? colors.accent : colors.secondary;

      if (random() > 0.5) {
        shapes += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}"/>`;
      } else {
        const w = random() * 120 + 30;
        const h = random() * 80 + 20;
        const rot = random() * 45 - 22;
        shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${opacity}" transform="rotate(${rot} ${x + w / 2} ${y + h / 2})" rx="2"/>`;
      }
    }

    // Add some lines (like brush strokes)
    for (let i = 0; i < 3; i++) {
      const x1 = random() * 300 + 50;
      const y1 = random() * 350 + 50;
      const x2 = x1 + random() * 150 - 75;
      const y2 = y1 + random() * 150 - 75;
      shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors.accent}" stroke-width="${random() * 3 + 1}" opacity="${random() * 0.3 + 0.1}" stroke-linecap="round"/>`;
    }

    return shapes;
  }

  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function seededRandom(seed) {
    let s = seed;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function escapeXml(str) {
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    })[c]);
  }

  // ── Generate placeholder images directory ──
  function generatePlaceholderImages() {
    // Images will use onerror fallback to SVG placeholders
    // This function is a no-op; real images should be placed in assets/images/obras/
    console.log('NULLA DIES SINE LINEA — Portfolio loaded');
    console.log('Replace images in assets/images/obras/ with real artwork photos');
  }

})();
