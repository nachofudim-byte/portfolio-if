document.addEventListener('DOMContentLoaded', function () {

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     PRELOADER
  ========================================================= */
  var preloader = document.getElementById('preloader');
  if (preloader) {
    var minDelay = prefersReducedMotion ? 0 : 650;
    setTimeout(function () {
      preloader.classList.add('hidden');
    }, minDelay);
  }

  /* =========================================================
     NAVBAR SCROLL
  ========================================================= */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });


  /* =========================================================
     HAMBURGER MENU
  ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('menu-overlay');

  // Guarda posición del scroll antes de fijar el body (fix iOS Safari)
  var scrollY = 0;

  function openMenu() {
    scrollY = window.scrollY;
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    overlay.classList.add('visible');
    document.body.classList.add('menu-open');
    document.body.style.top = '-' + scrollY + 'px';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.classList.remove('menu-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function toggleMenu() {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', closeMenu);

  // Cerrar al hacer click en cualquier link del nav
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      if (typeof closeModal === 'function') closeModal();
    }
  });

  // Cerrar modal con backdrop y botón X
  var modalBackdrop = document.getElementById('modal-backdrop');
  var modalCloseBtn = document.getElementById('modal-close');
  if (modalBackdrop) modalBackdrop.addEventListener('click', function() { if (typeof closeModal === 'function') closeModal(); });
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', function() { if (typeof closeModal === 'function') closeModal(); });

  // Exponer closeMenu globalmente por si acaso
  window.closeMenu = closeMenu;


  /* =========================================================
     ACTIVE NAV LINK AL SCROLLEAR
  ========================================================= */
  const sections  = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(function (s) {
      if (window.scrollY >= s.offsetTop - 130) current = s.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });


  /* =========================================================
     CLICK EN TARJETA → ABRIR MODAL
  ========================================================= */
  var worksGrid = document.getElementById('works-grid');
  if (worksGrid) {
    worksGrid.addEventListener('click', function (e) {
      var card = e.target.closest('.work-card');
      if (!card) return;
      var type  = card.getAttribute('data-type');
      var title = card.getAttribute('data-title');
      var desc  = card.getAttribute('data-desc');
      if (type === 'carousel') {
        var images = (card.getAttribute('data-images') || '').split('|').filter(Boolean);
        if (images.length) openModal('carousel', images, title, desc);
      } else {
        var src = card.getAttribute('data-src');
        if (type && src) openModal(type, src, title, desc);
      }
    });
  }

  /* =========================================================
     VIDEO HOVER PLAY (solo desktop)
  ========================================================= */
  var isTouchDevice = window.matchMedia('(hover: none)').matches;
  if (!isTouchDevice) {
    document.querySelectorAll('.video-thumb').forEach(function (thumb) {
      var video = thumb.querySelector('video');
      if (!video) return;
      var card = thumb.closest('.work-card');
      card.addEventListener('mouseenter', function () { video.play().catch(function(){}); });
      card.addEventListener('mouseleave', function () { video.pause(); video.currentTime = 0; });
    });
  }


  /* =========================================================
     TABS: REELS / PUBLICACIONES
  ========================================================= */
  var tabBtns   = document.querySelectorAll('.filter-btn[data-tab]');
  var workCards = document.querySelectorAll('#works-grid .work-card');

  function applyTab(tab) {
    workCards.forEach(function (card) {
      var type = card.getAttribute('data-type');
      var isReel = type === 'video';
      var show = tab === 'reels' ? isReel : !isReel;
      card.style.display = show ? '' : 'none';
      if (show) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    });
  }

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      applyTab(btn.getAttribute('data-tab'));
    });
  });

  if (tabBtns.length) applyTab('reels');


  /* =========================================================
     SKILL BARS ANIMACIÓN
  ========================================================= */
  var skillBars = document.querySelectorAll('.skill-bar-fill');

  if (skillBars.length > 0 && 'IntersectionObserver' in window) {
    var barObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var targetW = bar.getAttribute('data-width');
          if (!prefersReducedMotion) {
            bar.style.transition = 'width 1.2s cubic-bezier(0.16,1,0.3,1)';
          }
          bar.style.width = targetW;
          barObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(function (bar) {
      var w = bar.style.getPropertyValue('--w') || '0%';
      bar.setAttribute('data-width', w);
      bar.style.removeProperty('--w');
      bar.style.width = '0%';
      barObserver.observe(bar);
    });
  }


  /* =========================================================
     CONTADOR DE STATS
  ========================================================= */
  var statNums = document.querySelectorAll('.stat-num[data-count]');

  if (statNums.length > 0 && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        statObserver.unobserve(entry.target);

        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var textNode = el.firstChild;
        if (!textNode || prefersReducedMotion) return;

        var duration = 1100;
        var start = null;
        textNode.nodeValue = '0';

        function step(ts) {
          if (!start) start = ts;
          var progress = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          textNode.nodeValue = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    statNums.forEach(function (el) { statObserver.observe(el); });
  }


  /* =========================================================
     SPOTLIGHT EN TARJETAS (glow que sigue el cursor)
  ========================================================= */
  if (!isTouchDevice) {
    var spotlightSelector = '.service-card, .exp-preview-card, .stat-card, .work-card, .timeline-content, .edu-card, .contact-card';
    document.querySelectorAll(spotlightSelector).forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }


  /* =========================================================
     COPIAR EMAIL AL PORTAPAPELES
  ========================================================= */
  document.querySelectorAll('.copy-btn[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        var original = btn.textContent;
        btn.textContent = '¡Copiado!';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('copied');
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        done();
      }
    });
  });


  /* =========================================================
     FADE IN AL HACER SCROLL
  ========================================================= */

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var fadeItems = document.querySelectorAll('.stat-card, .timeline-content, .edu-card, .contact-card, .info-item, .exp-preview-card, .service-card, .tools-group');

    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    fadeItems.forEach(function (el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.04) + 's, transform 0.5s cubic-bezier(0.16,1,0.3,1) ' + (i * 0.04) + 's';
      fadeObserver.observe(el);
    });
  }

}); // fin DOMContentLoaded


/* =========================================================
   MODAL  — global para poder llamar desde onclick del HTML
========================================================= */
var carouselState = { images: [], index: 0 };

function renderCarouselFrame() {
  var img     = document.getElementById('carousel-img');
  var counter = document.getElementById('carousel-counter');
  if (!img) return;
  img.src = carouselState.images[carouselState.index];
  if (counter) counter.textContent = (carouselState.index + 1) + ' / ' + carouselState.images.length;
}

function carouselNav(delta) {
  var len = carouselState.images.length;
  if (!len) return;
  carouselState.index = (carouselState.index + delta + len) % len;
  renderCarouselFrame();
}

function openModal(type, src, title, desc) {
  var modal    = document.getElementById('modal');
  var mediaEl  = document.getElementById('modal-media');
  var titleEl  = document.getElementById('modal-title');
  var descEl   = document.getElementById('modal-desc');

  // Limpiar contenido anterior
  mediaEl.innerHTML = '';
  titleEl.textContent = title || '';
  descEl.textContent  = desc  || '';

  if (type === 'video' && src) {
    var v = document.createElement('video');
    v.src      = src;
    v.controls = true;
    v.autoplay = true;
    v.setAttribute('playsinline', '');
    v.style.cssText = 'width:100%;max-height:62vh;background:#000;display:block;';
    mediaEl.appendChild(v);
  } else if (type === 'image' && src) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = title || '';
    img.style.cssText = 'width:100%;max-height:70vh;object-fit:contain;background:#000;display:block;';
    mediaEl.appendChild(img);
  } else if (type === 'carousel' && src && src.length) {
    carouselState.images = src;
    carouselState.index = 0;

    var wrap = document.createElement('div');
    wrap.className = 'carousel-modal';

    var cImg = document.createElement('img');
    cImg.id = 'carousel-img';
    cImg.alt = title || '';

    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'carousel-nav carousel-prev';
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.innerHTML = '&#8249;';
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); carouselNav(-1); });

    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'carousel-nav carousel-next';
    nextBtn.setAttribute('aria-label', 'Siguiente');
    nextBtn.innerHTML = '&#8250;';
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); carouselNav(1); });

    var counter = document.createElement('span');
    counter.id = 'carousel-counter';
    counter.className = 'carousel-counter';

    wrap.appendChild(cImg);
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);
    wrap.appendChild(counter);
    mediaEl.appendChild(wrap);
    renderCarouselFrame();
  }

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  var modal   = document.getElementById('modal');
  var mediaEl = document.getElementById('modal-media');
  var video   = mediaEl.querySelector('video');
  if (video) { video.pause(); video.src = ''; }
  mediaEl.innerHTML = '';
  carouselState = { images: [], index: 0 };
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  var modal = document.getElementById('modal');
  if (!modal || modal.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') carouselNav(-1);
  if (e.key === 'ArrowRight') carouselNav(1);
});
