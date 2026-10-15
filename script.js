// Muhammad Younus — portfolio interactions.
// Plain vanilla JS: mobile menu, scrollspy, reveal-on-scroll, copy-email, footer year.

(function () {
  "use strict";

  // --- Mobile menu ---
  var menuBtn = document.getElementById("menuBtn");
  var nav = document.querySelector(".site-nav nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.textContent = open ? "✕" : "☰";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "☰";
      });
    });
  }

  // --- Scrollspy: highlight the nav link for the section in view ---
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var sections = spyLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  function onScroll() {
    var pos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= pos) current = sec;
    });
    spyLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Reveal on scroll ---
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // --- Copy email button ---
  var copyBtn = document.getElementById("copyEmailBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "khokharunus782@gmail.com";
      function done() {
        var original = copyBtn.textContent;
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = original; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () { fallback(); });
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = email;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) { /* noop */ }
        document.body.removeChild(ta);
        done();
      }
    });
  }

  // --- Footer year ---
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
