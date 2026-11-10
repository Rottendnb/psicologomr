const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const pageProgress = document.querySelector('[data-page-progress]');
const backToTop = document.querySelector('[data-back-to-top]');
const navDropdowns = Array.from(document.querySelectorAll('.nav-dropdown'));

const closeNavDropdowns = (except = null) => {
  navDropdowns.forEach(dropdown => {
    if (dropdown === except) return;

    dropdown.classList.remove('is-open');
    dropdown.querySelector('.nav-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
  });
};

// Si la fotografía exterior aún no se ha subido al servidor, evitamos
// mostrar el icono de imagen rota y usamos el retrato principal como respaldo.
const exteriorPortraits = new Set([
  ...document.querySelectorAll('img[src$="miguel-angel-exterior.png"]'),
  ...Array.from(document.querySelectorAll('source[srcset$="miguel-angel-exterior.png"]'))
    .map(source => source.parentElement?.querySelector('img'))
    .filter(Boolean)
]);

exteriorPortraits.forEach(image => {
  const usePortraitFallback = () => {
    image.closest('picture')?.querySelectorAll('source').forEach(source => source.remove());
    image.src = 'img/miguel-angel.jpg';
  };

  image.addEventListener('error', usePortraitFallback, { once: true });

  if (image.complete && image.naturalWidth === 0) {
    usePortraitFallback();
  }
});

const updateScrollUI = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;

  if (pageProgress) {
    pageProgress.style.transform = `scaleX(${progress})`;
  }

  if (backToTop) {
    backToTop.classList.toggle('is-visible', window.scrollY > 700);
  }
};

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (header) {
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

if (toggle && nav) {
  const closeMenu = (returnFocus = false) => {
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');

    closeNavDropdowns();

    if (returnFocus) {
      toggle.focus();
    }
  };

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu(true);
    }
  });

  document.addEventListener('click', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1050) {
      closeMenu();
    }
  }, { passive: true });
}

navDropdowns.forEach(dropdown => {
  const dropdownToggle = dropdown.querySelector('.nav-dropdown-toggle');

  if (!dropdownToggle) return;

  dropdownToggle.addEventListener('click', event => {
    event.stopPropagation();
    const willOpen = !dropdown.classList.contains('is-open');

    closeNavDropdowns(dropdown);
    dropdown.classList.toggle('is-open', willOpen);
    dropdownToggle.setAttribute('aria-expanded', String(willOpen));
  });
});

document.addEventListener('click', event => {
  if (!event.target.closest('.nav-dropdown')) {
    closeNavDropdowns();
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;

  const openDropdown = document.querySelector('.nav-dropdown.is-open');
  const openToggle = openDropdown?.querySelector('.nav-dropdown-toggle');

  if (openDropdown && openToggle) {
    closeNavDropdowns();
    openToggle.focus();
  }
});

const sectionLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const observedSections = sectionLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sectionLinks.length && observedSections.length) {
  const setCurrentSection = sectionId => {
    sectionLinks.forEach(link => {
      const isCurrent = link.getAttribute('href') === `#${sectionId}`;

      if (isCurrent) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const sectionObserver = new IntersectionObserver(entries => {
    const visibleSection = entries.find(entry => entry.isIntersecting);

    if (visibleSection) {
      setCurrentSection(visibleSection.target.id);
    }
  }, {
    rootMargin: '-20% 0px -65% 0px',
    threshold: 0
  });

  observedSections.forEach(section => sectionObserver.observe(section));
}

const revealGroups = [
  '.section-heading',
  '.support-card',
  '.guide-intro',
  '.guide-panel',
  '.choice-intro',
  '.choice-card',
  '.service-card',
  '.first-step-intro',
  '.first-step-list li',
  '.first-step-actions',
  '.price-card',
  '.practice-card',
  '.location-copy',
  '.map-card',
  '.steps li',
  '.about-portrait',
  '.about-copy',
  '.review-card',
  '.booking-copy',
  '.calendly-card',
  '.instagram-copy',
  '.instagram-grid',
  '.faq-intro',
  '.accordion',
  '.profile-story-heading',
  '.profile-story-copy',
  '.cv-timeline li',
  '.cv-sidebar',
  '.principles-grid article',
  '.profile-closing-grid',
  '.method-map-card',
  '.method-pillars-grid article',
  '.method-process-list li',
  '.method-first-copy',
  '.method-first-list li',
  '.method-expect-card',
  '.method-fit',
  '.therapy-start-card',
  '.therapy-needs-grid article',
  '.therapy-process-list li',
  '.first-session-copy',
  '.first-session-list',
  '.therapy-professional-photo',
  '.therapy-professional-copy',
  '.therapy-final-grid',
  '.couple-dialogue-card',
  '.couple-no-blame-grid',
  '.couple-process-list li',
  '.couple-outcomes-grid article',
  '.family-system-card',
  '.family-perspective-grid',
  '.family-participation-copy',
  '.family-participation-options article',
  '.family-process-grid li',
  '.police-plan-card',
  '.police-key-grid article',
  '.police-phase-list > li',
  '.police-training-copy',
  '.police-training-grid article',
  '.police-ethics-grid',
  '.police-simulation-card',
  '.police-price-card',
  '.police-final-grid'
];

const revealItems = Array.from(document.querySelectorAll(revealGroups.join(',')));

revealItems.forEach((item, index) => {
  item.classList.add('reveal');
  item.classList.add(`reveal-delay-${index % 3}`);
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -8% 0px',
    threshold: .08
  });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const year = document.querySelector('#year');

if (year) {
  year.textContent = new Date().getFullYear();
}

const guideForm = document.querySelector('[data-guide-form]');
const guideSubmit = document.querySelector('[data-guide-submit]');
const guideResult = document.querySelector('[data-guide-result]');
const guideTitle = document.querySelector('[data-guide-title]');
const guideCopy = document.querySelector('[data-guide-copy]');
const guideWhatsApp = document.querySelector('[data-guide-whatsapp]');
const guideBack = document.querySelector('[data-guide-back]');

const guideRecommendations = {
  individual: {
    title: 'La terapia individual puede ser un buen punto de partida.',
    copy: 'En un espacio individual podrás comprender qué te está ocurriendo, definir objetivos y trabajar herramientas adaptadas a tu situación.',
    message: 'Hola, he utilizado el orientador de la web y creo que busco terapia individual. Me gustaría consultar disponibilidad.'
  },
  couple: {
    title: 'La terapia de pareja puede ayudaros a avanzar juntos.',
    copy: 'La primera sesión permite comprender el conflicto, escuchar ambas perspectivas y acordar objetivos para mejorar la relación y la comunicación.',
    message: 'Hola, he utilizado el orientador de la web y queremos información sobre terapia de pareja. Me gustaría consultar disponibilidad.'
  },
  family: {
    title: 'La terapia familiar puede ofreceros un espacio compartido.',
    copy: 'Podréis abordar lo que está ocurriendo con una mirada conjunta, mejorar el diálogo y buscar cambios que cuiden a todos los miembros de la familia.',
    message: 'Hola, he utilizado el orientador de la web y buscamos terapia familiar. Me gustaría consultar disponibilidad.'
  },
  unsure: {
    title: 'Podemos orientarte antes de que reserves.',
    copy: 'No necesitas saber qué modalidad elegir. Cuéntame brevemente tu situación por WhatsApp y veremos cuál puede ser el mejor primer paso para ti.',
    message: 'Hola, he utilizado el orientador de la web y no tengo claro qué tipo de terapia necesito. ¿Podrías orientarme antes de reservar?'
  }
};

if (guideForm && guideSubmit && guideResult && guideTitle && guideCopy && guideWhatsApp) {
  guideForm.addEventListener('change', () => {
    guideSubmit.disabled = !guideForm.querySelector('input[name="therapy-need"]:checked');
  });

  guideForm.addEventListener('submit', event => {
    event.preventDefault();

    const selected = guideForm.querySelector('input[name="therapy-need"]:checked');
    const recommendation = selected ? guideRecommendations[selected.value] : null;

    if (!recommendation) {
      return;
    }

    guideTitle.textContent = recommendation.title;
    guideCopy.textContent = recommendation.copy;
    guideWhatsApp.href = `https://api.whatsapp.com/send?phone=34622033566&text=${encodeURIComponent(recommendation.message)}`;
    guideForm.hidden = true;
    guideResult.hidden = false;
    guideResult.focus({ preventScroll: true });
  });
}

if (guideBack && guideForm && guideResult) {
  guideBack.addEventListener('click', () => {
    guideResult.hidden = true;
    guideForm.hidden = false;
    guideForm.querySelector('input[name="therapy-need"]:checked')?.focus({ preventScroll: true });
  });
}

document.querySelectorAll('.accordion details').forEach(currentDetail => {
  currentDetail.addEventListener('toggle', () => {
    if (!currentDetail.open) {
      return;
    }

    document.querySelectorAll('.accordion details[open]').forEach(openDetail => {
      if (openDetail !== currentDetail) {
        openDetail.removeAttribute('open');
      }
    });
  });
});

const contactForm = document.querySelector('[data-contact-form]');
const contactStatus = document.querySelector('[data-contact-status]');
const contactMessage = document.querySelector('#mensaje');
const contactMessageCount = document.querySelector('[data-message-count]');

if (contactMessage && contactMessageCount) {
  const updateMessageCount = () => {
    contactMessageCount.textContent = `${contactMessage.value.length} / ${contactMessage.maxLength}`;
  };

  contactMessage.addEventListener('input', updateMessageCount);
  updateMessageCount();
}

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const reason = data.get('motivo') || 'Consulta general';
    const subject = `Consulta web: ${reason}`;
    const body = [
      `Nombre: ${data.get('nombre') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Teléfono: ${data.get('telefono') || 'No indicado'}`,
      `Motivo: ${reason}`,
      '',
      'Mensaje:',
      data.get('mensaje') || ''
    ].join('\n');

    if (contactStatus) {
      contactStatus.textContent = 'Se abrirá tu aplicación de correo con el mensaje preparado. Revísalo y pulsa Enviar.';
    }

    window.location.href = `mailto:info@psicologomr.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

