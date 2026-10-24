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

  /* ---- Active section highlighting: ONE source of truth (aria-current).
     Root cause of the old bug: the Home link points to "#top", and the old
     code mapped "#top" to null, so Home was never observed and could never
     become active again. Fix: "#top" now maps to the hero section, so the
     top of the page is a real observed section like any other. Clicks set
     the active tab immediately; the observer only takes over once the
     destination section is reached (or the user scrolls manually), so the
     two never fight. A scroll-position fallback guarantees Home is active
     at the very top even on viewports taller than the hero. ---- */
  function setActive(links, activeLink) {
    links.forEach(function (a) {
      if (a === activeLink) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  function sectionTarget(link) {
    var id = link.getAttribute('href').slice(1);
    if (!id || id === 'top') return document.querySelector('.hero') || document.body;
    return document.getElementById(id);
  }

  /* Main nav (home page). Case-study nav links point at ../index.html#...
     and are intentionally left alone: that page marks Projects active in HTML.
     NOTE: these are deliberately NOT named navLinks — the mobile-menu code
     above owns that name for the menu element, and reusing it here used to
     shadow it and break the mobile menu entirely. */
  var navEl = document.getElementById('navLinks');
  var navSpyAnchors = navEl ? Array.prototype.slice.call(navEl.querySelectorAll('a[href^="#"]')) : [];
  var navPairs = navSpyAnchors.map(function (a) { return { link: a, target: sectionTarget(a) }; })
    .filter(function (p) { return p.target; });
  var homeLink = null;
  navSpyAnchors.forEach(function (a) { if (a.getAttribute('href') === '#top') homeLink = a; });
  var scrollingTo = null, scrollingTimer = null;
  function clearScrollTarget() {
    scrollingTo = null;
    if (scrollingTimer) { clearTimeout(scrollingTimer); scrollingTimer = null; }
    syncTop();
  }
  function syncTop() {
    if (!scrollingTo && homeLink && window.scrollY <= 10) setActive(navSpyAnchors, homeLink);
  }
  if (navPairs.length) {
    navSpyAnchors.forEach(function (a) {
      a.addEventListener('click', function () {
        setActive(navSpyAnchors, a);
        scrollingTo = a.getAttribute('href').slice(1) || 'top';
        if (scrollingTimer) clearTimeout(scrollingTimer);
        scrollingTimer = setTimeout(clearScrollTarget, 2000);
      });
    });
    /* Manual scrolling cancels a click-driven scroll: the observer resumes. */
    window.addEventListener('wheel', clearScrollTarget, { passive: true });
    window.addEventListener('touchmove', clearScrollTarget, { passive: true });
    window.addEventListener('keydown', function (e) {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) !== -1) clearScrollTarget();
    });
    if ('IntersectionObserver' in window) {
      var navSpy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var pair = null;
          navPairs.forEach(function (p) { if (p.target === en.target) pair = p; });
          if (!pair) return;
          var id = pair.link.getAttribute('href').slice(1) || 'top';
          if (scrollingTo && scrollingTo !== id) return; /* still travelling: wait */
          if (scrollingTo === id) clearScrollTarget();
          setActive(navSpyAnchors, pair.link);
        });
      }, { rootMargin: '-30% 0px -65% 0px' });
      navPairs.forEach(function (p) { navSpy.observe(p.target); });
    }
    window.addEventListener('scroll', syncTop, { passive: true });
    syncTop();
  }

  /* Table of contents (case study page only). */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('[data-spy] a[href^="#"]'));
  var tocTargets = tocLinks
    .map(function (a) { var id = a.getAttribute('href').slice(1); return id ? document.getElementById(id) : null; })
    .filter(Boolean);
  if ('IntersectionObserver' in window && tocTargets.length) {
    var tocSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + en.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    tocTargets.forEach(function (t) { tocSpy.observe(t); });
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
