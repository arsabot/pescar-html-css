/**
 * FUNDACIÓN PESCAR - JAVASCRIPT (STANDALONE HTML & CSS VERSION)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initScrollAnimations();
  initCounters();
  initProgramFilters();
  initProgramModal();
  initAlumniCarousel();
  initAccordions();
  initForms();
  initAudienceSwitcher();
});

/* 1. HEADER SCROLL EFFECT */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* 2. MOBILE DRAWER */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.drawer-close');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer || !toggleBtn) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* 3. SCROLL REVEAL ANIMATIONS */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* 4. ANIMATED COUNTERS */
function initCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-counter-target'));
          const prefix = el.getAttribute('data-counter-prefix') || '';
          const suffix = el.getAttribute('data-counter-suffix') || '';
          const duration = 1800; // ms
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(target * easeProgress);

            el.textContent = `${prefix}${currentVal.toLocaleString('es-AR')}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              el.textContent = `${prefix}${target.toLocaleString('es-AR')}${suffix}`;
            }
          };

          requestAnimationFrame(updateCount);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2 }
  );

  counterElements.forEach((el) => observer.observe(el));
}

/* 5. AUTO-ROTATING ALUMNI STORIES CAROUSEL */
function initAlumniCarousel() {
  const container = document.querySelector('.alumni-slides-container');
  const slides = document.querySelectorAll('.alumni-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  const wrapper = document.querySelector('.alumni-carousel-wrapper');

  if (!container || !slides.length) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let intervalId = null;

  const goToSlide = (index) => {
    currentIndex = index;
    container.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
  };

  const startAutoPlay = () => {
    if (!intervalId) {
      intervalId = setInterval(nextSlide, 5000);
    }
  };

  const stopAutoPlay = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* 6. PROGRAM CATALOG FILTERS */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programCards = document.querySelectorAll('.program-card[data-category]');

  if (!filterBtns.length || !programCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      programCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* 7. PROGRAM DETAIL MODAL */
const PROGRAM_DATA = {
  'centros-pescar': {
    title: 'Centros Pescar',
    category: 'Programa de Formación Intensiva (PFI)',
    tagline: 'Formación para el empleo en alianza estratégica con empresas e instituciones.',
    image: 'assets/images/Home-programas-CentroPescar1.jpg',
    description: 'Los Centros Pescar son programas de formación intensiva para el empleo, dirigidos a jóvenes en situación de vulnerabilidad socioeconómica. Se implementan dentro o en alianza directa con empresas e instituciones con el propósito de potenciar sus habilidades personales, técnicas y digitales, facilitando su inclusión social y laboral.',
    duration: 'De 4 a 9 meses (3 horas diarias, 4 o 5 veces por semana).',
    modality: 'Presencial o Híbrida / Virtual sincrónica.',
    target: 'Jóvenes en búsqueda de su primera oportunidad laboral o inserción formal.',
    orientations: [
      'Programación Web Full Stack',
      'Atención al Cliente y Neuroventas',
      'Administración y Finanzas',
      'Mecatrónica e Industria Automotriz',
      'Hotelería, Gastronomía y Turismo',
      'Agroindustria y Servicios Supermercadistas'
    ],
    features: [
      'Acompañamiento personalizado por un/a Orientador/a dedicado',
      'Capacitación técnica directa con colaboradores de la empresa socia',
      'Acreditación como curso de extensión universitaria por la Universidad del Salvador (USAL)',
      '2 años de seguimiento posterior y bolsa de empleo activa'
    ]
  },
  'belleza-por-un-futuro': {
    title: 'Belleza por un Futuro',
    category: 'Programa de Formación Intensiva (PFI)',
    tagline: 'Programa internacional de L\'Oréal Foundation implementado en Argentina por Pescar.',
    image: 'assets/images/Home-programas-3BXF.jpg',
    description: 'Beauty for a Better Life (Belleza por un Futuro) es un programa de responsabilidad social de la Fondation L\'Oréal presente en más de 30 países. En Argentina, Fundación Pescar es su socio ejecutor exclusivo. Capacita a personas en peluquería, maquillaje, manicuría y tratamientos faciales con nivel de excelencia profesional.',
    duration: 'Cursos intensivos de 4 a 6 meses con kits profesionales entregados a cada estudiante.',
    modality: 'Presencial y 100% online sincrónico con prácticas reales.',
    target: 'Personas mayores de 18 años en situación de vulnerabilidad que deseen emprender o insertarse en salones.',
    orientations: ['Peluquería Profesional', 'Maquillaje Profesional', 'Manicuría y Cuidado Facial'],
    features: [
      '+2.097 graduados/as desde 2017 a 2024',
      'Clases dictadas por profesionales vinculados a las marcas L\'Oréal',
      'Entrega de kits completos de herramientas y productos para práctica domiciliaria',
      '2 años de seguimiento y evaluación de impacto diseñada junto a Deloitte'
    ]
  },
  'mujeres-protagonistas': {
    title: 'Mujeres Protagonistas',
    category: 'Programa de Formación Intensiva (PFI)',
    tagline: 'Empoderamiento femenino e inserción en roles clave del mercado.',
    image: 'assets/images/ProtagonistaPescar-800x755.jpg',
    description: 'Capacitación integral en desarrollo personal, habilidades interpersonales y competencias técnicas orientadas a la atención al cliente, marketing personal, introducción al marketing digital y herramientas de gestión.',
    duration: '5 meses (3 veces por semana, 9 horas semanales).',
    modality: 'Híbrida sincrónica.',
    target: 'Mujeres que buscan autonomía económica, inserción o reconversión laboral.',
    orientations: ['Atención al Cliente', 'Marketing Digital', 'Emprendedurismo'],
    features: [
      'Formación en habilidades socioemocionales para el empoderamiento',
      'Uso de herramientas digitales laborales indispensables',
      'Acompañamiento en la construcción de un proyecto de vida sostenible'
    ]
  },
  'mi-futuro-hoy': {
    title: 'Mi Futuro Hoy',
    category: 'Talleres & Iniciativas Escolares',
    tagline: 'Orientación vocacional y transición al mundo laboral para estudiantes de secundaria.',
    image: 'assets/images/MiFuturoHoytalleres-600x480.jpg',
    description: 'Espacio pensado para estudiantes de los últimos dos años del secundario para reflexionar, proyectar y capacitarse en su próxima etapa, integrando orientación vocacional, claves de inserción laboral y uso de tecnologías.',
    duration: '12 encuentros grupales más tutorías individuales.',
    modality: 'Presencial o Virtual sincrónico articulado con escuelas secundarias.',
    target: 'Estudiantes del anteúltimo y último año de secundaria.',
    orientations: ['Orientación Vocacional', 'Inserción Laboral', 'Nuevas Tecnologías'],
    features: [
      'Involucra a docentes, tutores y directivos escolares',
      'Herramientas concretas de armado de CV y entrevistas',
      'Acompañamiento en la elección vocacional'
    ]
  },
  'mfmt-finanzas': {
    title: 'Mi Futuro, Mi Trabajo + Educación Financiera',
    category: 'Talleres & Formación Laboral',
    tagline: 'Herramientas para conseguir el primer empleo y gestionar la economía personal.',
    image: 'assets/images/MFMTTaller-800x640.jpg',
    description: 'Talleres destinados a jóvenes y adultos en búsqueda de formación para el empleo, integrando contenidos clave de preparación para el mercado de trabajo y conceptos fundamentales de educación financiera.',
    duration: 'Ciclos de talleres intensivos modulares.',
    modality: 'Presencial y Virtual.',
    target: 'Jóvenes y adultos en búsqueda de su primer empleo o reconversión.',
    orientations: ['Educación Financiera', 'Estrategias de Búsqueda Laboral', 'Proyecto de Vida'],
    features: [
      'Planificación financiera básica y herramientas de ahorro/presupuesto',
      'Desarrollo de habilidades para sostener el empleo en el tiempo',
      'Talleres prácticos de simulación de entrevistas'
    ]
  },
  'stand-up': {
    title: 'Stand Up contra el Acoso Callejero',
    category: 'Iniciativa de Impacto Social',
    tagline: 'Capacitación para visibilizar y actuar de forma segura en espacios públicos.',
    image: 'assets/images/StandupHome-600x480.jpg',
    description: 'Iniciativa internacional de L\'Oréal Paris en colaboración con la ONG Right To Be, implementada y desarrollada en Argentina por Fundación Pescar. Capacita en la metodología de las 5D para intervenir con seguridad ante situaciones de acoso.',
    duration: 'Talleres de 1 hora de alta efectividad.',
    modality: 'Virtual y Presencial para escuelas, empresas y organizaciones.',
    target: 'Personas mayores de 14 años, empresas, escuelas y público general.',
    orientations: ['Metodología 5D', 'Concientización Social', 'Seguridad Comunitaria'],
    features: [
      '+50.000 personas ya capacitadas en Argentina',
      'Herramientas prácticas de intervención segura',
      'Sin costo para instituciones y participantes'
    ]
  }
};

function initProgramModal() {
  const modal = document.getElementById('programModal');
  const closeBtn = document.querySelector('.modal-close');
  const triggerBtns = document.querySelectorAll('[data-program-trigger]');

  if (!modal) return;

  const openModal = (programKey) => {
    const data = PROGRAM_DATA[programKey];
    if (!data) return;

    document.getElementById('modalProgramTitle').textContent = data.title;
    document.getElementById('modalProgramCategory').textContent = data.category;
    document.getElementById('modalProgramTagline').textContent = data.tagline;
    document.getElementById('modalProgramDesc').textContent = data.description;
    document.getElementById('modalProgramDuration').textContent = data.duration;
    document.getElementById('modalProgramModality').textContent = data.modality;
    document.getElementById('modalProgramTarget').textContent = data.target;

    const orientationsList = document.getElementById('modalProgramOrientations');
    orientationsList.innerHTML = '';
    data.orientations.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      orientationsList.appendChild(li);
    });

    const featuresList = document.getElementById('modalProgramFeatures');
    featuresList.innerHTML = '';
    data.features.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      featuresList.appendChild(li);
    });

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-program-trigger');
      openModal(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  const backdrop = modal.querySelector('.modal-backdrop');
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* 8. ACCORDIONS / FAQ */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  if (!headers.length) return;

  headers.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isActive = item.classList.contains('active');

      const container = item.closest('.accordion');
      if (container) {
        container.querySelectorAll('.accordion-item').forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.accordion-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });
      }

      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });
}

/* 9. FORMS & VALIDATION */
function initForms() {
  const forms = document.querySelectorAll('form[data-ajax-form]');
  if (!forms.length) return;

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const alertSuccess = form.querySelector('.form-alert.success');
      const alertError = form.querySelector('.form-alert.error');

      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = '#ef4444';
        } else {
          input.style.borderColor = '';
        }
      });

      if (!isValid) {
        if (alertError) {
          alertError.textContent = 'Por favor, completá todos los campos obligatorios.';
          alertError.style.display = 'block';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Enviar Mensaje';
        }
        form.reset();
        if (alertError) alertError.style.display = 'none';
        if (alertSuccess) {
          alertSuccess.textContent = '¡Gracias por tu mensaje! Tu consulta fue registrada. El equipo de Fundación Pescar se pondrá en contacto a la brevedad.';
          alertSuccess.style.display = 'block';
        }
      }, 700);
    });
  });
}

/* 10. AUDIENCE SWITCHER */
function initAudienceSwitcher() {
  const pills = document.querySelectorAll('.audience-pill');
  if (!pills.length) return;

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
}
