/* ============================================================
   GALLERY — gallery.js
   Data comes from gallery-data.js (auto-generated manifest of
   optimized WebP photos with real dimensions). Thumbs power the
   masonry grid; full-size versions power the lightbox.
   ============================================================ */
(function () {
  'use strict';

  if (typeof GALLERY_MANIFEST === 'undefined') return;

  var CATS = [
    { key: 'sports',    dir: 'sports-day',    label: 'Sports Day',    emoji: '🏅' },
    { key: 'ghana',     dir: 'ghana-day',     label: 'Ghana Day',     emoji: '🇬🇭' },
    { key: 'character', dir: 'character-day', label: 'Character Day', emoji: '🎭' },
    { key: 'others',    dir: 'others',        label: 'School Life',   emoji: '🏫' }
  ];

  var FEATURED_COUNT = 10;
  var BATCH_SIZE = 24;
  var THUMB_W = 640;

  var allItems = [];
  var itemsByCat = {};
  var visibleItems = [];
  var lightboxItems = [];
  var renderedCount = 0;
  var activeFilter = 'all';
  var lbIndex = 0;

  var galGrid = document.getElementById('galGrid');
  var galSections = document.getElementById('galSections');
  var galLoadMore = document.getElementById('galLoadMore');
  var galLoadBtn = document.getElementById('galLoadBtn');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCaption');

  /* ---------- data ---------- */

  function initData() {
    CATS.forEach(function (cat) {
      var photos = GALLERY_MANIFEST[cat.dir] || [];
      itemsByCat[cat.key] = photos.map(function (p) {
        return {
          thumb: 'assets/gallery-opt/' + cat.dir + '/thumb/' + p.n + '.webp',
          full: 'assets/gallery-opt/' + cat.dir + '/full/' + p.n + '.webp',
          w: p.w,
          h: p.h,
          cat: cat.key,
          label: cat.label
        };
      });
      allItems = allItems.concat(itemsByCat[cat.key]);
    });

    // photo counts inside the filter tabs
    document.querySelectorAll('.gal-tab').forEach(function (btn) {
      var f = btn.dataset.filter;
      var n = f === 'all' ? allItems.length : (itemsByCat[f] || []).length;
      var span = document.createElement('span');
      span.className = 'gal-tab__n';
      span.textContent = n;
      btn.appendChild(span);
    });
  }

  /* ---------- hero story deck ---------- */

  function buildDeck() {
    var deck = document.getElementById('heroDeck');
    if (!deck) return;

    // interleave 3 photos from each category
    var picks = [];
    for (var i = 0; i < 3; i++) {
      CATS.forEach(function (cat) {
        var item = itemsByCat[cat.key][i * 4]; // skip a few so cards vary
        if (item) picks.push(item);
      });
    }

    var tilts = [-7, 4, -3, 6, -5, 3, -6, 5, -4, 7, -3, 5];
    var dys = [10, -14, 18, -8, 12, -16, 8, -10, 16, -12, 10, -14];

    var track = document.createElement('div');
    track.className = 'gal-deck__track';
    var dragDistance = 0; // suppress card clicks after a real drag

    // two identical sets -> seamless wrap at half the track width
    for (var copy = 0; copy < 2; copy++) {
      /* eslint-disable no-loop-func */
      picks.forEach(function (item, idx) {
        var card = document.createElement('div');
        card.className = 'gal-deck__card';
        card.style.setProperty('--tilt', tilts[idx % tilts.length] + 'deg');
        card.style.setProperty('--dy', dys[idx % dys.length] + 'px');

        var img = document.createElement('img');
        img.src = item.thumb;
        img.alt = item.label;
        img.loading = idx < 6 ? 'eager' : 'lazy';
        img.decoding = 'async';
        img.draggable = false;
        card.appendChild(img);

        card.addEventListener('click', function () {
          if (dragDistance > 6) return; // that was a drag, not a click
          lightboxItems = allItems;
          lbIndex = allItems.indexOf(item);
          if (lbIndex < 0) lbIndex = 0;
          showLbItem();
          lb.removeAttribute('hidden');
          document.body.style.overflow = 'hidden';
        });

        track.appendChild(card);
      });
    }

    deck.appendChild(track);

    /* Infinite motion: drag with momentum, slow drift when idle.
       ox is the wall's absolute offset; the track is translated by
       -mod(ox, half) so it wraps forever in either direction. */
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DRIFT = 24; // px per second when nobody is touching it

    var half = 0;
    function measure() { half = track.scrollWidth / 2; }
    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', function () { setTimeout(measure, 100); });

    var ox = 0;
    var vx = 0;
    var dragging = false;
    var hovering = false;
    var lastX = 0;
    var raf = 0;
    var last = performance.now();
    var inView = true;

    function mod(v, m) { return ((v % m) + m) % m; }

    function tick(now) {
      raf = 0;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!dragging) {
        vx *= 0.94; // momentum decay
        if (Math.abs(vx) < 0.05) vx = 0;
        ox += vx;
        if (vx === 0 && !hovering && !reducedMotion) {
          ox += DRIFT * dt;
        }
      }

      if (half > 0) {
        track.style.transform = 'translate3d(' + (-mod(ox, half)) + 'px, 0, 0)';
      }
      if (inView) raf = requestAnimationFrame(tick);
    }

    var io = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(deck);

    deck.addEventListener('pointerdown', function (e) {
      dragging = true;
      vx = 0;
      lastX = e.clientX;
      dragDistance = 0;
      deck.classList.add('is-dragging');
      deck.setPointerCapture(e.pointerId);
    });
    deck.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      dragDistance += Math.abs(dx);
      ox -= dx; // wall follows the finger
      vx = -dx; // carried into momentum on release
    });
    function endDrag() {
      dragging = false;
      deck.classList.remove('is-dragging');
    }
    deck.addEventListener('pointerup', endDrag);
    deck.addEventListener('pointercancel', endDrag);

    // drift pauses while the mouse is over the deck (touch keeps drifting)
    deck.addEventListener('mouseenter', function () { hovering = true; });
    deck.addEventListener('mouseleave', function () { hovering = false; });

    raf = requestAnimationFrame(tick);
  }

  /* ---------- masonry layout ---------- */

  function colsFor(width) {
    if (width >= 1100) return 4;
    if (width >= 760) return 3;
    return 2;
  }

  function layoutMasonry(grid) {
    var width = grid.clientWidth;
    if (!width) return;
    var cols = colsFor(width);
    grid.style.setProperty('--cols', cols);

    var gap = parseFloat(getComputedStyle(grid).columnGap) || 14;
    var colW = (width - (cols - 1) * gap) / cols;

    for (var i = 0; i < grid.children.length; i++) {
      var card = grid.children[i];
      var ar = parseFloat(card.dataset.ar);
      if (!ar) continue;
      var cardH = colW * ar;
      card.style.marginBottom = gap + 'px';
      card.style.gridRowEnd = 'span ' + Math.max(4, Math.round((cardH + gap) / 8));
    }
  }

  function layoutAll() {
    document.querySelectorAll('.gal-masonry').forEach(function (grid) {
      if (!grid.closest('[hidden]')) layoutMasonry(grid);
    });
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutAll, 150);
  });

  /* ---------- cards ---------- */

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: '60px 0px' });

  function createCard(item, idx, scope) {
    var card = document.createElement('figure');
    card.className = 'gal-card';
    card.dataset.ar = (item.h / item.w).toFixed(4);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View ' + item.label + ' photo');

    var img = document.createElement('img');
    img.src = item.thumb;
    img.alt = item.label;
    img.width = THUMB_W;
    img.height = Math.round(THUMB_W * item.h / item.w);
    img.loading = 'lazy';
    img.decoding = 'async';
    if (img.complete && img.naturalWidth) {
      card.classList.add('is-loaded');
    } else {
      img.onload = function () { card.classList.add('is-loaded'); };
      img.onerror = function () { card.style.display = 'none'; };
    }

    var overlay = document.createElement('div');
    overlay.className = 'gal-card__overlay';

    var badge = document.createElement('span');
    badge.className = 'gal-card__badge';
    badge.textContent = item.label;

    card.appendChild(img);
    card.appendChild(overlay);
    card.appendChild(badge);

    function open() { openLightbox(idx, scope); }
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    revealObserver.observe(card);
    return card;
  }

  /* ---------- "All" view: one section per event ---------- */

  function renderSections() {
    galGrid.hidden = true;
    galSections.hidden = false;
    galSections.innerHTML = '';
    galLoadMore.hidden = true;

    CATS.forEach(function (cat) {
      var items = itemsByCat[cat.key];
      if (!items.length) return;

      var section = document.createElement('section');
      section.className = 'gal-section';
      section.id = 'gal-' + cat.key;

      var head = document.createElement('div');
      head.className = 'gal-section__head';
      head.innerHTML =
        '<div class="gal-section__copy">' +
          '<p class="gal-section__eyebrow">Featured moments</p>' +
          '<h2 class="gal-section__title">' + cat.label + '</h2>' +
          '<p class="gal-section__count">' + items.length + ' photos</p>' +
        '</div>' +
        '<button type="button" class="gal-section__cta" data-filter="' + cat.key + '">View all ' + items.length + '</button>';

      var grid = document.createElement('div');
      grid.className = 'gal-masonry';

      items.slice(0, FEATURED_COUNT).forEach(function (item, i) {
        grid.appendChild(createCard(item, i, cat.key));
      });

      section.appendChild(head);
      section.appendChild(grid);
      galSections.appendChild(section);
      layoutMasonry(grid);
    });

    galSections.querySelectorAll('.gal-section__cta').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setFilter(btn.dataset.filter);
        window.scrollTo({ top: document.getElementById('gallery').offsetTop - 120, behavior: 'smooth' });
      });
    });
  }

  /* ---------- filtered view: full masonry with batches ---------- */

  var loadMoreObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || activeFilter === 'all') return;
      if (renderedCount < visibleItems.length) renderBatch(renderedCount);
    });
  }, { rootMargin: '400px 0px' });

  function renderBatch(startIdx) {
    var end = Math.min(startIdx + BATCH_SIZE, visibleItems.length);
    var frag = document.createDocumentFragment();
    for (var i = startIdx; i < end; i++) {
      frag.appendChild(createCard(visibleItems[i], i, null));
    }
    galGrid.appendChild(frag);
    renderedCount = end;
    layoutMasonry(galGrid);
    updateLoadMore();
  }

  function updateLoadMore() {
    if (activeFilter === 'all' || renderedCount >= visibleItems.length) {
      galLoadMore.hidden = true;
      loadMoreObserver.disconnect();
      return;
    }
    galLoadMore.hidden = false;
    galLoadBtn.textContent = 'Load more (' + (visibleItems.length - renderedCount) + ' remaining)';
    loadMoreObserver.observe(galLoadMore);
  }

  function renderCategoryGrid() {
    galSections.hidden = true;
    galGrid.hidden = false;
    galGrid.innerHTML = '';
    galGrid.className = 'gal-masonry';

    if (!visibleItems.length) {
      galGrid.innerHTML =
        '<div class="gal-empty">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
            '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
            '<path d="M3 9l4-4 4 4 4-4 4 4"/>' +
            '<circle cx="8.5" cy="13.5" r="1.5"/>' +
          '</svg>' +
          '<p>No photos found in this category.</p>' +
        '</div>';
      galLoadMore.hidden = true;
      return;
    }

    renderBatch(0);
  }

  function setFilter(filter) {
    activeFilter = filter;
    renderedCount = 0;
    loadMoreObserver.disconnect();

    document.querySelectorAll('.gal-tab').forEach(function (btn) {
      var isActive = btn.dataset.filter === filter;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    if (filter === 'all') {
      renderSections();
      return;
    }

    visibleItems = itemsByCat[filter] || [];
    renderCategoryGrid();
  }

  /* ---------- lightbox ---------- */

  function openLightbox(idx, scope) {
    if (scope && itemsByCat[scope]) {
      lightboxItems = itemsByCat[scope];
    } else if (activeFilter === 'all') {
      lightboxItems = allItems;
    } else {
      lightboxItems = visibleItems;
    }
    lbIndex = idx;
    showLbItem();
    lb.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function preload(idx) {
    var item = lightboxItems[idx];
    if (item) new Image().src = item.full;
  }

  function showLbItem() {
    var item = lightboxItems[lbIndex];
    lbImg.classList.add('is-switching');
    var next = new Image();
    next.onload = function () {
      lbImg.src = item.full;
      lbImg.alt = item.label;
      lbImg.classList.remove('is-switching');
    };
    next.onerror = function () {
      lbImg.src = item.thumb;
      lbImg.classList.remove('is-switching');
    };
    next.src = item.full;
    lbCap.textContent = item.label + ' · ' + (lbIndex + 1) + ' / ' + lightboxItems.length;

    // warm the neighbours so arrows feel instant
    preload((lbIndex + 1) % lightboxItems.length);
    preload((lbIndex - 1 + lightboxItems.length) % lightboxItems.length);
  }

  function lbStep(dir) {
    lbIndex = (lbIndex + dir + lightboxItems.length) % lightboxItems.length;
    showLbItem();
  }

  /* ---------- events ---------- */

  function bindEvents() {
    document.querySelectorAll('.gal-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setFilter(btn.dataset.filter);
      });
    });

    galLoadBtn.addEventListener('click', function () {
      renderBatch(renderedCount);
    });

    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', function () { lbStep(-1); });
    document.getElementById('lbNext').addEventListener('click', function () { lbStep(1); });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    // swipe to navigate on touch
    var touchX = null;
    lb.addEventListener('touchstart', function (e) {
      touchX = e.touches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) > 45) lbStep(dx > 0 ? -1 : 1);
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (lb.hasAttribute('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') lbStep(-1);
      if (e.key === 'ArrowRight') lbStep(1);
    });
  }

  function handleDeepLink() {
    var cat = new URLSearchParams(window.location.search).get('cat');
    if (cat && itemsByCat[cat]) {
      setFilter(cat);
      return;
    }
    setFilter('all');
  }

  initData();
  buildDeck();
  bindEvents();
  handleDeepLink();

  document.querySelectorAll('#year, .js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
