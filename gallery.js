(function () {
  'use strict';

  var GALLERY_DATA = {
    sports: [
      'IMG_8514.jpg', 'IMG_8639.jpg', 'IMG_8652.jpg', 'IMG_8667.jpg', 'IMG_8680.jpg',
      'IMG_8694.jpg', 'IMG_8711.jpg', 'IMG_8727.jpg', 'IMG_8741.jpg', 'IMG_8754.jpg',
      'IMG_8768.jpg', 'IMG_8783.jpg', 'IMG_8797.jpg', 'IMG_8810.jpg', 'IMG_8823.jpg',
      'IMG_8836.jpg', 'IMG_8849.jpg', 'IMG_8862.jpg', 'IMG_8875.jpg', 'IMG_8888.jpg',
      'IMG_8901.jpg', 'IMG_8914.jpg', 'IMG_8927.jpg', 'IMG_8940.jpg', 'IMG_8953.jpg',
      'IMG_8966.jpg', 'IMG_8979.jpg', 'IMG_8992.jpg', 'IMG_9005.jpg', 'IMG_9018.jpg',
      'IMG_9031.jpg', 'IMG_9044.jpg', 'IMG_9057.jpg', 'IMG_9070.jpg', 'IMG_9085.jpg',
      'IMG_9098.jpg', 'IMG_9113.jpg', 'IMG_9131.jpg'
    ],
    character: [
      'IMG_0002.JPG', 'IMG_0020.JPG', 'IMG_0036.JPG', 'IMG_0055.JPG', 'IMG_0067.JPG',
      'IMG_0083.JPG', 'IMG_0098.JPG', 'IMG_0116.JPG', 'IMG_0142.JPG', 'IMG_0157.JPG',
      'IMG_0168.JPG', 'IMG_0179.JPG', 'IMG_0191.JPG', 'IMG_0205.JPG', 'IMG_0219.JPG',
      'IMG_0230.JPG', 'IMG_0241.JPG', 'IMG_0256.JPG', 'IMG_0269.JPG', 'IMG_0287.JPG',
      'IMG_0302.JPG', 'IMG_0315.JPG', 'IMG_0327.JPG', 'IMG_0340.JPG', 'IMG_0351.JPG',
      'IMG_0366.JPG', 'IMG_0387.JPG', 'IMG_0408.JPG', 'IMG_0423.JPG', 'IMG_0443.JPG',
      'IMG_0456.JPG', 'IMG_0469.JPG', 'IMG_9720.JPG', 'IMG_9731.JPG', 'IMG_9743.JPG',
      'IMG_9756.JPG', 'IMG_9767.JPG', 'IMG_9780.JPG', 'IMG_9791.JPG', 'IMG_9802.JPG',
      'IMG_9814.JPG', 'IMG_9825.JPG', 'IMG_9838.JPG', 'IMG_9853.JPG', 'IMG_9868.JPG',
      'IMG_9886.JPG', 'IMG_9902.JPG', 'IMG_9921.JPG', 'IMG_9934.JPG', 'IMG_9954.JPG',
      'IMG_9971.JPG', 'IMG_9991.JPG'
    ],
    ghana: [
      'IMG_7483.jpg', 'IMG_7535.jpg', 'IMG_7549.jpg', 'IMG_7569.jpg', 'IMG_7581.jpg',
      'IMG_7593.jpg', 'IMG_7655.jpg', 'IMG_7656.jpg', 'IMG_7670.jpg', 'IMG_7676.jpg',
      'IMG_7697.jpg', 'IMG_7710.jpg', 'IMG_7718.jpg', 'IMG_7734.jpg', 'IMG_7742.jpg',
      'IMG_7777.jpg', 'IMG_7795.jpg', 'IMG_7839.jpg', 'IMG_7882.jpg', 'IMG_7883.jpg',
      'IMG_7901.jpg', 'IMG_7923.jpg', 'IMG_7924.jpg', 'IMG_7958.jpg', 'IMG_7974.jpg',
      'IMG_7981.jpg', 'IMG_7993.jpg', 'IMG_8006.jpg', 'IMG_8007.jpg', 'IMG_8029.jpg',
      'IMG_8046.jpg', 'IMG_8048.jpg', 'IMG_8056.jpg', 'IMG_8067.jpg', 'IMG_8088.jpg',
      'IMG_8098.jpg', 'IMG_8146.jpg', 'IMG_8160.jpg', 'IMG_8162.jpg', 'IMG_8167.jpg',
      'IMG_8175.jpg', 'IMG_8177.jpg', 'IMG_8188.jpg', 'IMG_8196.jpg', 'IMG_8255.jpg',
      'IMG_8259.jpg', 'IMG_8262.jpg', 'IMG_8335.jpg', 'IMG_8349.jpg', 'IMG_8359.jpg',
      'IMG_8362.jpg', 'IMG_8388.jpg', 'IMG_8405.jpg', 'IMG_8410.jpg', 'IMG_8428.jpg',
      'IMG_8429.jpg', 'IMG_8472.jpg'
    ],
    others: [
      'Herons admission 2024--.jpg', 'IMG_0541.jpg', 'IMG_0692.jpg', 'IMG_0711.jpg',
      'IMG_0720.jpg', 'IMG_0721.jpg', 'IMG_0790.jpg', 'IMG_0791.jpg', 'IMG_0794.jpg',
      'IMG_0795.jpg', 'IMG_0797.jpg',
      'WhatsApp Image 2023-01-10 at 08.43.28.jpeg',
      'WhatsApp Image 2023-01-10 at 08.43.30.jpeg',
      'WhatsApp Image 2023-01-10 at 08.43.31.jpeg',
      'WhatsApp Image 2023-01-10 at 09.52.59.jpeg',
      'WhatsApp Image 2023-01-10 at 09.53.01.jpeg',
      'WhatsApp Image 2023-01-10 at 09.53.02.jpeg',
      'WhatsApp Image 2023-01-10 at 09.53.03 (1).jpeg',
      'WhatsApp Image 2023-01-10 at 09.53.03.jpeg',
      'WhatsApp Image 2024-06-25 at 17.54.34.jpeg',
      'WhatsApp Image 2024-06-27 at 14.26.54.jpeg',
      'WhatsApp Image 2024-06-27 at 14.26.55.jpeg',
      'WhatsApp Image 2024-06-27 at 14.26.56.jpeg',
      'WhatsApp Image 2024-07-01 at 16.07.34.jpeg',
      'WhatsApp Image 2024-07-01 at 16.10.00.jpeg',
      'WhatsApp Image 2024-07-01 at 16.10.02.jpeg',
      'WhatsApp Image 2024-07-01 at 16.11.31.jpeg',
      'WhatsApp Image 2024-07-01 at 16.13.36.jpeg',
      'WhatsApp Image 2024-07-01 at 16.15.42.jpeg',
      'WhatsApp Image 2024-07-01 at 16.16.00.jpeg',
      'WhatsApp Image 2024-07-01 at 16.17.51.jpeg',
      'WhatsApp Image 2024-07-01 at 16.25.47 (1).jpeg',
      'WhatsApp Image 2024-07-01 at 16.25.47.jpeg',
      'WhatsApp Image 2024-07-02 at 23.44.40.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.05 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.05.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.06 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.06.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.07 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.07 (2).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.07.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.08 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.08.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.09.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.10 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.10 (2).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.10.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.11 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.11.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.12 (1).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.12 (2).jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.12.jpeg',
      'WhatsApp Image 2024-07-02 at 23.46.13.jpeg',
      'WhatsApp Image 2024-07-03 at 09.59.42.jpeg'
    ]
  };

  var CAT_LABELS = {
    sports: 'Sports Day',
    character: 'Character Day',
    ghana: 'Ghana Day',
    others: 'School Life'
  };

  var CAT_DIRS = {
    sports: 'sports-day',
    character: 'character-day',
    ghana: 'ghana-day',
    others: 'others'
  };

  var CAT_ORDER = ['sports', 'ghana', 'character', 'others'];
  var FEATURED_COUNT = 8;
  var BATCH_SIZE = 24;

  var HERO_PICKS = [
    { cat: 'sports', file: 'IMG_8667.jpg' },
    { cat: 'ghana', file: 'IMG_7718.jpg' },
    { cat: 'character', file: 'IMG_0116.JPG' },
    { cat: 'others', file: 'IMG_0541.jpg' }
  ];

  var BENTO_LAYOUT = ['hero', '', '', '', 'wide', 'wide', '', ''];

  var allItems = [];
  var itemsByCat = {};
  var visibleItems = [];
  var lightboxItems = [];
  var renderedCount = 0;

  var activeFilter = 'all';
  var lbIndex = 0;

  var galGrid = document.getElementById('galGrid');
  var galSections = document.getElementById('galSections');
  var galCount = document.getElementById('galCount');
  var galLoadMore = document.getElementById('galLoadMore');
  var galLoadBtn = document.getElementById('galLoadBtn');
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCaption');

  function buildItem(cat, file) {
    return {
      src: 'assets/gallery/' + CAT_DIRS[cat] + '/' + file,
      cat: cat,
      label: CAT_LABELS[cat]
    };
  }

  function initData() {
    CAT_ORDER.forEach(function (cat) {
      itemsByCat[cat] = GALLERY_DATA[cat].map(function (file) {
        return buildItem(cat, file);
      });
      allItems = allItems.concat(itemsByCat[cat]);
    });
    galCount.textContent = allItems.length;
  }

  function buildHero() {
    var strip = document.getElementById('heroStrip');
    if (!strip) return;

    HERO_PICKS.forEach(function (pick, i) {
      var img = document.createElement('img');
      img.src = 'assets/gallery/' + CAT_DIRS[pick.cat] + '/' + pick.file;
      img.alt = '';
      img.loading = i < 2 ? 'eager' : 'lazy';
      img.decoding = 'async';
      strip.appendChild(img);
    });
  }

  var imgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      var img = card.querySelector('img');
      if (!img || !img.dataset.src) return;

      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.onload = function () {
        card.classList.add('is-loaded');
        imgObserver.unobserve(card);
      };
      img.onerror = function () {
        card.style.display = 'none';
        imgObserver.unobserve(card);
      };
    });
  }, { rootMargin: '300px 0px' });

  var loadMoreObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting || activeFilter === 'all') return;
      if (renderedCount < visibleItems.length) {
        renderBatch(renderedCount);
      }
    });
  }, { rootMargin: '200px 0px' });

  function createCard(item, idx, layout) {
    var card = document.createElement('figure');
    card.className = 'gal-card';
    if (layout) card.classList.add('gal-card--' + layout);
    card.dataset.idx = idx;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'View ' + item.label + ' photo');

    var img = document.createElement('img');
    img.dataset.src = item.src;
    img.alt = item.label;
    img.loading = 'lazy';
    img.decoding = 'async';

    var overlay = document.createElement('div');
    overlay.className = 'gal-card__overlay';

    var badge = document.createElement('span');
    badge.className = 'gal-card__badge';
    badge.textContent = item.label;

    card.appendChild(img);
    card.appendChild(overlay);
    card.appendChild(badge);

    card.addEventListener('click', function () { openLightbox(idx, card.dataset.lbScope); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx, card.dataset.lbScope);
      }
    });

    imgObserver.observe(card);
    return card;
  }

  function renderSections() {
    galGrid.hidden = true;
    galSections.hidden = false;
    galSections.innerHTML = '';
    galLoadMore.hidden = true;

    CAT_ORDER.forEach(function (cat) {
      var items = itemsByCat[cat];
      var section = document.createElement('section');
      section.className = 'gal-section';
      section.id = 'gal-' + cat;

      var head = document.createElement('div');
      head.className = 'gal-section__head';
      head.innerHTML =
        '<div class="gal-section__copy">' +
          '<p class="gal-section__eyebrow">' + CAT_LABELS[cat] + '</p>' +
          '<h2 class="gal-section__title">' + CAT_LABELS[cat] + '</h2>' +
          '<p class="gal-section__count">' + items.length + ' photos</p>' +
        '</div>' +
        '<button type="button" class="gal-section__cta" data-filter="' + cat + '">View all</button>';

      var grid = document.createElement('div');
      grid.className = 'gal-bento';

      items.slice(0, FEATURED_COUNT).forEach(function (item, i) {
        var card = createCard(item, i, BENTO_LAYOUT[i]);
        card.dataset.lbScope = cat;
        grid.appendChild(card);
      });

      section.appendChild(head);
      section.appendChild(grid);
      galSections.appendChild(section);
    });

    galSections.querySelectorAll('.gal-section__cta').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setFilter(btn.dataset.filter);
      });
    });
  }

  function renderBatch(startIdx) {
    var end = Math.min(startIdx + BATCH_SIZE, visibleItems.length);
    var frag = document.createDocumentFragment();

    for (var i = startIdx; i < end; i++) {
      frag.appendChild(createCard(visibleItems[i], i));
    }

    galGrid.appendChild(frag);
    renderedCount = end;
    updateLoadMore();
  }

  function updateLoadMore() {
    if (activeFilter === 'all') {
      galLoadMore.hidden = true;
      return;
    }

    if (renderedCount >= visibleItems.length) {
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
    galGrid.className = 'gal-grid';

    galCount.textContent = visibleItems.length;

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
      galCount.textContent = allItems.length;
      renderSections();
      return;
    }

    visibleItems = itemsByCat[filter] || [];
    renderCategoryGrid();
  }

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

  function showLbItem() {
    var item = lightboxItems[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.label;
    lbCap.textContent = item.label + ' · ' + (lbIndex + 1) + ' / ' + lightboxItems.length;
  }

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
    document.getElementById('lbPrev').addEventListener('click', function () {
      lbIndex = (lbIndex - 1 + lightboxItems.length) % lightboxItems.length;
      showLbItem();
    });
    document.getElementById('lbNext').addEventListener('click', function () {
      lbIndex = (lbIndex + 1) % lightboxItems.length;
      showLbItem();
    });

    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (lb.hasAttribute('hidden')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        lbIndex = (lbIndex - 1 + lightboxItems.length) % lightboxItems.length;
        showLbItem();
      }
      if (e.key === 'ArrowRight') {
        lbIndex = (lbIndex + 1) % lightboxItems.length;
        showLbItem();
      }
    });
  }

  function handleDeepLink() {
    var cat = new URLSearchParams(window.location.search).get('cat');
    if (cat && GALLERY_DATA[cat]) {
      setFilter(cat);
      return;
    }
    setFilter('all');
  }

  initData();
  buildHero();
  bindEvents();
  handleDeepLink();

  document.querySelectorAll('#year, .js-year').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
