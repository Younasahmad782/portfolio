/* Muhammad Younus — portfolio behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme toggle (remembers choice; otherwise follows the OS) ---- */
  var themeBtn = document.getElementById('themeBtn');
  function currentTheme() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeLabel() {
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-label', currentTheme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (themeBtn) {
    syncThemeLabel();
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeLabel();
    });
  }

  /* ---- Mobile menu ---- */
  var menuBtn = document.getElementById('menuBtn');
  var navLinks = document.getElementById('navLinks');
  function setMenu(open) {
    if (!menuBtn || !navLinks) return;
    navLinks.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
    navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* ---- Active section highlighting (nav on home page, table of contents on case study) ---- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('[data-spy] a[href^="#"], #navLinks a[href^="#"]'));
  var targets = spyLinks
    .map(function (a) { var id = a.getAttribute('href').slice(1); return id && id !== 'top' ? document.getElementById(id) : null; })
    .filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    targets.forEach(function (t) { spy.observe(t); });
  }

  /* ---- Reveal on scroll (content is visible by default without JS) ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Copy email ---- */
  var copyBtn = document.getElementById('copyEmailBtn');
  var copyStatus = document.getElementById('copyStatus');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = 'khokharunus782@gmail.com';
      function done(ok) {
        if (copyStatus) copyStatus.textContent = ok ? 'Email address copied.' : 'Copy failed. Please copy it manually: ' + email;
        setTimeout(function () { if (copyStatus) copyStatus.textContent = ''; }, 4000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  }

  /* ---- Resume: shown only when a real PDF has been added ----
     1. Put the PDF at assets/resume/Muhammad-Younus-Resume.pdf
     2. Change RESUME_AVAILABLE to true.                                  */
  var RESUME_AVAILABLE = true;
  if (RESUME_AVAILABLE) {
    document.querySelectorAll('[data-resume]').forEach(function (el) { el.hidden = false; });
  }

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
