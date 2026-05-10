/* ==========================================================================
   Manish Academy — Main JS
   Navbar, mobile menu, scroll reveal, course filter, form validation
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Active nav link based on current page ---- */
  function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    if (!path || path === '') path = 'index.html';
    var links = document.querySelectorAll('.nav-links a[data-nav]');
    links.forEach(function (link) {
      if (link.getAttribute('data-nav') === path) link.classList.add('active');
      else link.classList.remove('active');
    });
  }

  /* ---- Mobile nav toggle ---- */
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.querySelector('.nav-links');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Navbar scrolled state ---- */
  function initNavScroll() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Scroll reveal ---- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Subtle hero parallax ---- */
  function initHeroParallax() {
    var media = document.querySelector('.hero-media');
    if (!media) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        media.style.transform = 'translateY(' + (y * 0.15) + 'px)';
      }
    }, { passive: true });
  }

  /* ---- Course filter ---- */
  function initCourseFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.course-item[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-category') || '').split(' ');
          if (filter === 'all' || cats.indexOf(filter) !== -1) card.classList.remove('hidden');
          else card.classList.add('hidden');
        });
      });
    });
  }

  /* ---- Contact form validation + submit ---- */
  function initContactForm() {
    var form = document.getElementById('contact-form-el');
    if (!form) return;
    var success = document.getElementById('form-success');

    function setError(id, bad) {
      var el = document.getElementById(id);
      if (!el) return;
      var wrap = el.closest('.form-field');
      if (wrap) wrap.classList.toggle('has-error', !!bad);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cf-name').value.trim();
      var email = document.getElementById('cf-email').value.trim();
      var phone = document.getElementById('cf-phone').value.trim();
      var course = document.getElementById('cf-course').value;
      var msg = document.getElementById('cf-message').value.trim();

      var valid = true;
      if (!name) { setError('cf-name', true); valid = false; } else setError('cf-name', false);

      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) { setError('cf-email', true); valid = false; } else setError('cf-email', false);

      var phoneOk = /^[0-9+\-\s()]{7,20}$/.test(phone);
      if (!phoneOk) { setError('cf-phone', true); valid = false; } else setError('cf-phone', false);

      if (!course) { setError('cf-course', true); valid = false; } else setError('cf-course', false);
      if (msg.length < 5) { setError('cf-message', true); valid = false; } else setError('cf-message', false);

      if (!valid) return;

      var waMsg =
        'Manish Academy — New Inquiry\n\n' +
        'Name: ' + name + '\n' +
        'Email: ' + email + '\n' +
        'Phone: ' + phone + '\n' +
        'Course: ' + course + '\n' +
        'Message: ' + msg;
      var waUrl = 'https://wa.me/911234567890?text=' + encodeURIComponent(waMsg);
      window.open(waUrl, '_blank');

      form.reset();
      if (success) {
        form.style.display = 'none';
        success.classList.add('active');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      ['input', 'change'].forEach(function (evt) {
        el.addEventListener(evt, function () {
          var wrap = el.closest('.form-field');
          if (wrap) wrap.classList.remove('has-error');
        });
      });
    });
  }

  /* ---- Newsletter form (footer) ---- */
  function initNewsletter() {
    var form = document.querySelector('.newsletter-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      var btn = form.querySelector('button');
      if (!input.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        input.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        input.focus();
        return;
      }
      input.style.borderColor = '';
      btn.textContent = 'Subscribed ✓';
      input.value = '';
      setTimeout(function () { btn.textContent = 'Subscribe'; }, 3000);
    });
  }

  /* ---- Set current year ---- */
  function setYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---- Init ---- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    setActiveNav();
    initNavToggle();
    initNavScroll();
    initReveal();
    initHeroParallax();
    initCourseFilter();
    initContactForm();
    initNewsletter();
    setYear();
  });
})();
