/* Muhammad Younus portfolio. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  /* ===== Settings you can edit ===== */
  var CONTACT_EMAIL = 'khokharunus782@gmail.com';
  /* Optional: paste a Formspree (or similar) endpoint to receive messages directly,
     e.g. 'https://formspree.io/f/xxxxxxxx'. While empty, the form opens the visitor's
     email app with the message pre-filled. */
  var FORM_ENDPOINT = '';
  /* ================================= */

  /* Mobile menu */
  var menuBtn = document.getElementById('menuBtn');
  var menuEl = document.getElementById('navLinks');
  function setMenu(open) {
    if (!menuBtn || !menuEl) return;
    menuEl.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  if (menuBtn && menuEl) {
    menuBtn.addEventListener('click', function () { setMenu(!menuEl.classList.contains('open')); });
    menuEl.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuEl.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });
  }

  /* Nav border on scroll */
  var nav = document.getElementById('siteNav');
  function onScroll() { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active section in nav (home page) */
  var links = menuEl ? Array.prototype.slice.call(menuEl.querySelectorAll('a[href^="#"]')) : [];
  var pairs = links.map(function (a) {
    var id = a.getAttribute('href').slice(1);
    return { link: a, target: id === 'top' ? null : document.getElementById(id) };
  }).filter(function (p) { return p.target; });
  if (pairs.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        pairs.forEach(function (p) {
          if (p.target === en.target) p.link.setAttribute('aria-current', 'true');
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    pairs.forEach(function (p) { spy.observe(p.target); });
    window.addEventListener('scroll', function () {
      if (window.scrollY < 200) links.forEach(function (a) { a.removeAttribute('aria-current'); });
    }, { passive: true });
  }

  /* Case study table of contents */
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

  /* Scroll progress bar */
  var bar = document.getElementById('progress');
  if (bar) {
    var ticking = false;
    var upd = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  /* Scroll reveal with stagger (content is visible without JS) */
  var revealSel = '.section-head, .featured, .card, .service, .skill-group, .step, .why, .cert, .cert-note, .about-photo, .about-copy, .contact-card, .cs-body section, .cs-hero .shot';
  var items = Array.prototype.slice.call(document.querySelectorAll(revealSel));
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  items.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (n) { return n.matches(revealSel); });
    el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4));
    el.classList.add('reveal');
  });
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* BizFlow preview switcher */
  var previewImg = document.getElementById('previewImg');
  var previewCap = document.getElementById('previewCap');
  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb'));
  thumbs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-pressed') === 'true') return;
      thumbs.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      previewImg.classList.add('swap');
      setTimeout(function () {
        previewImg.src = btn.dataset.src;
        previewImg.alt = btn.dataset.alt;
        previewImg.classList.remove('swap');
      }, 120);
      if (previewCap) previewCap.textContent = btn.dataset.cap;
    });
  });

  /* Copy email */
  var copyBtn = document.getElementById('copyEmailBtn');
  var copyStatus = document.getElementById('copyStatus');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      function done(ok) {
        copyStatus.textContent = ok ? 'Email address copied.' : 'Copy failed. Please copy it manually: ' + CONTACT_EMAIL;
        setTimeout(function () { copyStatus.textContent = ''; }, 4000);
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(CONTACT_EMAIL).then(function () { done(true); }, function () { done(legacyCopy()); });
      } else { done(legacyCopy()); }
    });
  }
  function legacyCopy() {
    try {
      var ta = document.createElement('textarea');
      ta.value = CONTACT_EMAIL; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand('copy'); document.body.removeChild(ta); return ok;
    } catch (e) { return false; }
  }

  /* Contact form */
  var form = document.getElementById('contactForm');
  if (form) {
    var statusEl = document.getElementById('cfStatus');
    var submitBtn = document.getElementById('cfSubmit');
    var say = function (msg, kind) { statusEl.textContent = msg; statusEl.className = 'form-status' + (kind ? ' ' + kind : ''); };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements;
      if (f._gotcha && f._gotcha.value) return;
      var name = f.name.value.trim(), email = f.email.value.trim(), type = f.type.value, message = f.message.value.trim();
      if (!name) { say('Please enter your name.', 'err'); f.name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please enter a valid email address so I can reply.', 'err'); f.email.focus(); return; }
      if (!message) { say('Please add a few details about your project.', 'err'); f.message.focus(); return; }
      var subject = 'Project enquiry: ' + type;

      if (!FORM_ENDPOINT) {
        var body = message + '\n\nProject type: ' + type + '\nFrom: ' + name + ' (' + email + ')';
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        say('Opening your email app with the message ready to send.', 'ok');
        return;
      }
      submitBtn.disabled = true; say('Sending…');
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: name, email: email, type: type, subject: subject, message: message })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        form.reset(); say('Thanks, your message was sent. I’ll reply by email.', 'ok');
      }).catch(function () {
        say('The message could not be sent. Please email ' + CONTACT_EMAIL + ' directly.', 'err');
      }).then(function () { submitBtn.disabled = false; });
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
