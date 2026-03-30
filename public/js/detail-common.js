/* ============================================================
   detail-common.js  —  shared across travel / hajj / work pages

   HOW TO USE THE GALLERY IN HTML:
   ─────────────────────────────────────────────────────────
   1. Give each page a PHOTOS array BEFORE loading this script:
      <script>
        var GALLERY_PHOTOS = [
          { src: 'img/photo1.jpg', caption: 'Optional caption' },
          { src: 'img/photo2.jpg', caption: '' },
        ];
      </script>
   2. Use the gallery HTML structure shown in the detail pages.
   ─────────────────────────────────────────────────────────
   If GALLERY_PHOTOS is not defined the gallery still works
   using the thumb data-src attributes.
   ============================================================ */

(function () {
  'use strict';

  /* ── GALLERY SETUP ─────────────────────────────────────── */
  var current = 0;

  function galleryInit() {
    var thumbs   = document.querySelectorAll('.g-thumb');
    var mainImg  = document.getElementById('mainImg');
    var caption  = document.querySelector('.g-caption');
    var counter  = document.querySelector('.gallery-counter');
    var stage    = document.querySelector('.gallery-stage');
    var lightbox = document.getElementById('gLightbox');
    var lbImg    = document.getElementById('lbImg');
    var lbLabel  = document.getElementById('lbLabel');

    if (!thumbs.length || !mainImg) return;

    /* Build photos array from thumbs if GALLERY_PHOTOS not set */
    var photos = (typeof GALLERY_PHOTOS !== 'undefined' && GALLERY_PHOTOS.length)
      ? GALLERY_PHOTOS
      : Array.from(thumbs).map(function (t) {
          return {
            src:     t.getAttribute('data-full') || t.querySelector('img').src.replace(/\/\d+\/\d+(\?.*)?$/, '/800/500'),
            caption: t.getAttribute('data-caption') || ''
          };
        });

    var total = photos.length;

    /* Main image gets smooth fade */
    mainImg.style.transition = 'opacity .14s ease';

    function goTo(idx) {
      idx = ((idx % total) + total) % total;
      current = idx;

      /* fade swap */
      mainImg.style.opacity = '0';
      setTimeout(function () {
        mainImg.src = photos[idx].src;
        mainImg.style.opacity = '1';
      }, 140);

      /* caption */
      if (caption) caption.textContent = photos[idx].caption || '';

      /* counter */
      if (counter) counter.textContent = (idx + 1) + ' / ' + total;

      /* thumbs */
      thumbs.forEach(function (t, i) {
        t.classList.toggle('active', i === idx);
      });

      /* lightbox sync */
      if (lbImg)   lbImg.src = photos[idx].src;
      if (lbLabel) lbLabel.textContent = (idx + 1) + ' / ' + total;
    }

    /* thumb clicks */
    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { goTo(i); });
    });

    /* stage arrows */
    var sPrev = document.querySelector('.stage-arrow.s-prev');
    var sNext = document.querySelector('.stage-arrow.s-next');
    if (sPrev) sPrev.addEventListener('click', function (e) { e.stopPropagation(); goTo(current - 1); });
    if (sNext) sNext.addEventListener('click', function (e) { e.stopPropagation(); goTo(current + 1); });

    /* open lightbox */
    if (stage && lightbox) {
      stage.addEventListener('click', function (e) {
        if (e.target.classList.contains('stage-arrow')) return;
        lbImg.src = photos[current].src;
        if (lbLabel) lbLabel.textContent = (current + 1) + ' / ' + total;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    }

    /* lightbox close */
    function closeLb() {
      if (lightbox) lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    var lbClose = document.getElementById('lbClose');
    if (lbClose) lbClose.addEventListener('click', closeLb);
    if (lightbox) lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });

    /* lightbox arrows */
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    if (lbPrev) lbPrev.addEventListener('click', function () { goTo(current - 1); });
    if (lbNext) lbNext.addEventListener('click', function () { goTo(current + 1); });

    /* keyboard */
    document.addEventListener('keydown', function (e) {
      if (!lightbox || !lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLb();
      if (e.key === 'ArrowLeft')  goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    /* init counter */
    if (counter) counter.textContent = '1 / ' + total;
  }

  /* ── HERO IMAGE FADE-IN ─────────────────────────────────── */
  function heroInit() {
    var heroBg = document.getElementById('heroBg');
    if (!heroBg) return;
    if (heroBg.complete) {
      heroBg.classList.add('loaded');
    } else {
      heroBg.addEventListener('load', function () { heroBg.classList.add('loaded'); });
    }
  }

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  function navbarInit() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ── HAMBURGER ──────────────────────────────────────────── */
  function hamburgerInit() {
    var hamburger = document.getElementById('hamburger');
    var navLinks  = document.getElementById('nav-links');
    if (!hamburger || !navLinks) return;

    function openMenu() {
      hamburger.classList.add('open');
      navLinks.classList.add('open');
      document.body.classList.add('menu-open');
      navLinks.querySelectorAll('li').forEach(function (li, i) {
        li.style.transitionDelay = (0.06 + i * 0.07) + 's';
        setTimeout(function () { li.classList.add('revealed'); }, 20);
      });
    }
    function closeMenu() {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
      navLinks.querySelectorAll('li').forEach(function (li) {
        li.classList.remove('revealed');
        li.style.transitionDelay = '0s';
      });
    }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    document.addEventListener('click', function (e) {
      if (navLinks.classList.contains('open') &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) closeMenu();
    });

    /* mobile About dropdown */
    document.querySelectorAll('.has-dropdown').forEach(function (li) {
      var btn = li.querySelector('.dropdown-trigger');
      if (!btn) return;
      btn.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.stopPropagation();
          li.classList.toggle('mobile-open');
        }
      });
    });
  }

  /* ── BOOKING FORM ───────────────────────────────────────── */
  function bookingInit() {
    var btn = document.getElementById('btnBook');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var name  = document.getElementById('bfName');
      var phone = document.getElementById('bfPhone');
      if (!name || !phone) return;
      if (!name.value.trim() || !phone.value.trim()) {
        name.style.borderColor = '#ef4444';
        name.focus();
        setTimeout(function () { name.style.borderColor = ''; }, 2500);
        return;
      }
      btn.textContent = '✓ Submitted!';
      btn.disabled = true;
      var ok = document.getElementById('bookOk');
      if (ok) { ok.style.display = 'block'; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }

  /* ── BOOT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    heroInit();
    navbarInit();
    hamburgerInit();
    bookingInit();
    galleryInit();
  });

})();