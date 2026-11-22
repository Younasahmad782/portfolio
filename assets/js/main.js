/* Muhammad Younus — portfolio behaviour. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  /* ================= SETTINGS YOU CAN EDIT ================= */
  var CONTACT_EMAIL = 'khokharunus782@gmail.com';
  /* Contact form endpoint. Create a free form at https://formspree.io (or use any
     service that accepts a JSON POST) and paste its URL here, e.g.
     'https://formspree.io/f/xxxxxxxx'. While this is empty, the form opens the
     visitor's email app with the message pre-filled, so it still works. */
  var FORM_ENDPOINT = '';
  var RESUME_AVAILABLE = true; /* PDF lives at assets/resume/Muhammad-Younus-Resume.pdf */
  /* ========================================================== */

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Theme toggle (dark by default; remembers the choice) ---- */
  var themeBtn = document.getElementById('themeBtn');
  function currentTheme() { return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark'; }
  function syncTheme() {
    var light = currentTheme() === 'light';
    if (themeBtn) themeBtn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light ? '#fafaf8' : '#0b0c10');
  }
  if (themeBtn) {
    syncTheme();
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncTheme();
    });
  }

  /* ---- Mobile menu ---- */
  var menuBtn = document.getElementById('menuBtn');
  var menuEl = document.getElementById('navLinks');
  function setMenu(open) {
    if (!menuBtn || !menuEl) return;
    menuEl.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (menuBtn && menuEl) {
    menuBtn.addEventListener('click', function () { setMenu(!menuEl.classList.contains('open')); });
    menuEl.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuEl.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* ---- Nav border once the page scrolls ---- */
  var nav = document.getElementById('siteNav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Active section highlighting (home page) ---- */
  var spyLinks = menuEl ? Array.prototype.slice.call(menuEl.querySelectorAll('a[href^="#"]')) : [];
  var spyPairs = spyLinks.map(function (a) { return { link: a, target: document.getElementById(a.getAttribute('href').slice(1)) }; })
    .filter(function (p) { return p.target; });
  function setActive(link) {
    spyLinks.forEach(function (a) { if (a === link) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  if (spyPairs.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        spyPairs.forEach(function (p) { if (p.target === en.target) setActive(p.link); });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    spyPairs.forEach(function (p) { spy.observe(p.target); });
    window.addEventListener('scroll', function () { if (window.scrollY < 120) setActive(null); }, { passive: true });
  }

  /* ---- Table of contents (case study page) ---- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('[data-spy] a[href^="#"]'));
  var tocTargets = tocLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
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

  /* ---- Scroll reveal (content is visible by default without JS) ---- */
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
      function done(ok) {
        if (copyStatus) copyStatus.textContent = ok ? 'Email address copied.' : 'Copy failed. Please copy it manually: ' + CONTACT_EMAIL;
        setTimeout(function () { if (copyStatus) copyStatus.textContent = ''; }, 4000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(CONTACT_EMAIL).then(function () { done(true); }, function () { done(false); });
      } else { done(false); }
    });
  }

  /* ---- Contact form ---- */
  var form = document.getElementById('contactForm');
  if (form) {
    var statusEl = document.getElementById('cfStatus');
    var submitBtn = document.getElementById('cfSubmit');
    function say(msg, kind) { statusEl.textContent = msg; statusEl.className = 'form-status' + (kind ? ' ' + kind : ''); }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f._gotcha && f._gotcha.value) return; /* spam trap */
      var name = f.name.value.trim(), email = f.email.value.trim(), subject = f.subject.value.trim(), message = f.message.value.trim();
      if (!name || !message) { say('Please enter your name and a message.', 'err'); (name ? f.message : f.name).focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please enter a valid email address so I can reply.', 'err'); f.email.focus(); return; }
      var subj = subject || 'Message from ' + name;

      if (!FORM_ENDPOINT) {
        var body = message + '\n\n— ' + name + ' (' + email + ')';
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
        say('Opening your email app with the message ready to send.', 'ok');
        return;
      }
      submitBtn.disabled = true; say('Sending…');
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name, email: email, subject: subj, message: message })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        form.reset(); say('Thanks, your message was sent. I’ll reply by email.', 'ok');
      }).catch(function () {
        say('The message could not be sent. Please email ' + CONTACT_EMAIL + ' directly.', 'err');
      }).then(function () { submitBtn.disabled = false; });
    });
  }

  /* ---- Resume links ---- */
  if (RESUME_AVAILABLE) document.querySelectorAll('[data-resume]').forEach(function (el) { el.hidden = false; });

  /* ---- Footer year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
