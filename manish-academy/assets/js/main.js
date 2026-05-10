/* ==========================================================================
   Manish Academy - Main JS
   Handles: navbar toggle, scroll state, scroll reveal, course filter, form
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Mark active nav link based on current page ---- */
  function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '') path = 'index.html';
    var links = document.querySelectorAll('.nav-links a[data-nav]');
    links.forEach(function (link) {
      if (link.getAttribute('data-nav') === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
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
    });

    // Close menu when a link is clicked
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  /* ---- Navbar shadow on scroll ---- */
  function initNavScroll() {
    var nav = document.querySelector('.navbar');
    if (!nav) return;
    var onScroll = function () {
      if (window.scrollY > 20) nav.classList.add('scrolled');
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
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Course filter (courses page) ---- */
  function initCourseFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.course-card[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        cards.forEach(function (card) {
          var cats = (card.getAttribute('data-category') || '').split(' ');
          if (filter === 'all' || cats.indexOf(filter) !== -1) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---- Contact form validation + submit ---- */
  function initContactForm() {
    var form = document.getElementById('contact-form-el');
    if (!form) return;
    var success = document.getElementById('form-success');

    function setFieldError(fieldId, hasError) {
      var field = document.getElementById(fieldId);
      if (!field) return;
      var wrap = field.closest('.form-field');
      if (wrap) wrap.classList.toggle('has-error', !!hasError);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        name:    document.getElementById('cf-name'),
        email:   document.getElementById('cf-email'),
        phone:   document.getElementById('cf-phone'),
        course:  document.getElementById('cf-course'),
        message: document.getElementById('cf-message')
      };
      var valid = true;

      var nameVal = data.name.value.trim();
      setFieldError('cf-name', !nameVal);
      if (!nameVal) valid = false;

      var emailVal = data.email.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      setFieldError('cf-email', !emailOk);
      if (!emailOk) valid = false;

      var phoneVal = data.phone.value.trim();
      var phoneOk = /^[0-9+\-\s()]{7,20}$/.test(phoneVal);
      setFieldError('cf-phone', !phoneOk);
      if (!phoneOk) valid = false;

      var courseVal = data.course.value;
      setFieldError('cf-course', !courseVal);
      if (!courseVal) valid = false;

      var msgVal = data.message.value.trim();
      setFieldError('cf-message', msgVal.length < 5);
      if (msgVal.length < 5) valid = false;

      if (!valid) return;

      // Simulate submission (no backend) and redirect to WhatsApp
      var waMsg =
        'Manish Academy — New Inquiry\n\n' +
        'Name: ' + nameVal + '\n' +
        'Email: ' + emailVal + '\n' +
        'Phone: ' + phoneVal + '\n' +
        'Course: ' + courseVal + '\n' +
        'Message: ' + msgVal;

      // Open WhatsApp in a new tab with a prefilled message
      var waUrl = 'https://wa.me/911234567890?text=' + encodeURIComponent(waMsg);
      window.open(waUrl, '_blank');

      form.reset();
      if (success) {
        success.classList.add('active');
        form.style.display = 'none';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Clear error state while typing
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        var wrap = el.closest('.form-field');
        if (wrap) wrap.classList.remove('has-error');
      });
      el.addEventListener('change', function () {
        var wrap = el.closest('.form-field');
        if (wrap) wrap.classList.remove('has-error');
      });
    });
  }

  /* ---- Set current year in footer ---- */
  function setYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---- Init on DOM ready ---- */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    setActiveNav();
    initNavToggle();
    initNavScroll();
    initReveal();
    initCourseFilter();
    initContactForm();
    setYear();
  });
})();
