/* ═══════════════════════════════════════════════════
   IKIGAI Zweibrücken — main.js
   Assignment 3: OnPage Optimization
   Hochschule Kaiserslautern | Prof. Hendrik Speck
═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     1. NAV — transparent → frosted on scroll
  ══════════════════════════════════════ */
  var nav = document.getElementById('nav');

  function updateNav() {
    if (!nav) return;
    nav.classList.toggle('up', window.scrollY > 60);
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ══════════════════════════════════════
     2. MOBILE DRAWER
  ══════════════════════════════════════ */
  var hamburger  = document.querySelector('.hamburger');
  var drawer     = document.getElementById('nav-drawer');
  var closeBtn   = document.getElementById('drawer-close');
  var drawerLinks = drawer ? drawer.querySelectorAll('a') : [];

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger && hamburger.focus();
  }

  hamburger  && hamburger.addEventListener('click', openDrawer);
  closeBtn   && closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* Swipe left to close */
  if (drawer) {
    var swipeStartX = 0;
    drawer.addEventListener('touchstart', function (e) {
      swipeStartX = e.touches[0].clientX;
    }, { passive: true });
    drawer.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientX - swipeStartX > 60) closeDrawer();
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     3. SMOOTH SCROLL with nav offset
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var offset = 88;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════
     4. SCROLL REVEAL — IntersectionObserver
  ══════════════════════════════════════ */
  var revealEls = document.querySelectorAll('.r');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    /* Fallback for older browsers */
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ══════════════════════════════════════
     5. MENU CATEGORY TABS
  ══════════════════════════════════════ */
  var catBtns  = document.querySelectorAll('.cat-btn');
  var dishLists = document.querySelectorAll('.dish-section');

  catBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      /* Update active tab */
      catBtns.forEach(function (b) {
        b.classList.remove('on');
        b.setAttribute('aria-selected', 'false');
      });
      this.classList.add('on');
      this.setAttribute('aria-selected', 'true');

      /* Show matching dish section */
      var target = this.getAttribute('data-cat');
      dishLists.forEach(function (section) {
        section.style.display = section.getAttribute('data-cat') === target ? 'block' : 'none';
      });

      /* Scroll tab into view on mobile */
      this.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════
     6. RESERVATION FORM VALIDATION
  ══════════════════════════════════════ */
  var form    = document.getElementById('reserve-form');
  var formMsg = document.getElementById('form-msg');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var required = form.querySelectorAll('[required]');

      required.forEach(function (field) {
        var isBlank = !field.value.trim();
        field.style.borderBottomColor = isBlank ? '#c84b2f' : '';
        if (isBlank) valid = false;
      });

      if (!valid) {
        showMsg('Bitte alle Pflichtfelder (*) ausfüllen.', 'error');
        return;
      }

      /* Simulate successful submission */
      var submitBtn = form.querySelector('.btn-form');
      if (submitBtn) {
        submitBtn.textContent = 'Wird gesendet…';
        submitBtn.disabled = true;
      }

      setTimeout(function () {
        showMsg('Vielen Dank! Ihre Reservierungsanfrage wurde gesendet. Wir melden uns in Kürze.', 'success');
        form.reset();
        if (submitBtn) {
          submitBtn.textContent = 'Reservierung bestätigen';
          submitBtn.disabled = false;
        }
      }, 1200);
    });

    /* Clear error on input */
    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        this.style.borderBottomColor = '';
        if (formMsg) formMsg.className = 'form-msg';
      });
    });
  }

  function showMsg(text, type) {
    if (!formMsg) return;
    formMsg.textContent = text;
    formMsg.className   = 'form-msg ' + type;
    formMsg.setAttribute('role', 'alert');
    formMsg.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  /* ══════════════════════════════════════
     7. BACK TO TOP BUTTON
  ══════════════════════════════════════ */
  var backBtn = document.querySelector('.back-to-top');

  if (backBtn) {
    window.addEventListener('scroll', function () {
      backBtn.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });

    backBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ══════════════════════════════════════
     8. PARALLAX on hero image (subtle)
  ══════════════════════════════════════ */
  var heroFood = document.querySelector('.hero-food');
  if (heroFood && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        heroFood.style.transform = 'translateY(calc(-50% + ' + (y * 0.15) + 'px))';
      }
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     9. ACTIVE NAV LINK on scroll (Spy)
  ══════════════════════════════════════ */
  var sections    = document.querySelectorAll('section[id]');
  var navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

  if ('IntersectionObserver' in window && sections.length) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ══════════════════════════════════════
     10. HERO SCROLL HINT — fade on scroll
  ══════════════════════════════════════ */
  var scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', function () {
      scrollHint.style.opacity = Math.max(0, 1 - window.scrollY / 200);
    }, { passive: true });
  }

})();
