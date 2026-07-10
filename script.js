/* ===================================================================
   Herons International School — interactions
   =================================================================== */
(function () {
  "use strict";

  /* ---------- Year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Eased smooth scroll helper ---------- */
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function smoothScrollTo(targetY, duration) {
    var startY = window.pageYOffset;
    var diff = targetY - startY
    var start = null;
    if (Math.abs(diff) < 2) return;
    var rootStyle = document.documentElement.style;
    var prevBehavior = rootStyle.scrollBehavior;
    rootStyle.scrollBehavior = "auto";
    function step(ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;
      var progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        rootStyle.scrollBehavior = prevBehavior;
      }
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- Full-screen menu ---------- */
  var drawer = document.getElementById("drawer");
  var menuBtn = document.getElementById("menuBtn");
  var drawerClose = document.getElementById("drawerClose");
  var openDrawer = function () {
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
  };
  var closeDrawer = function () {
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
  };
  if (menuBtn) menuBtn.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeDrawer);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });

  /* ---------- Scroll to top button ---------- */
  var toTop = document.getElementById("toTop");
  if (toTop) {
    var toggleToTop = function () {
      toTop.classList.toggle("is-visible", window.pageYOffset > 600);
    };
    window.addEventListener("scroll", toggleToTop, { passive: true });
    toggleToTop();
    toTop.addEventListener("click", function () {
      smoothScrollTo(0, 750);
    });
  }

  /* ---------- HERO CAROUSEL (Slide-Left + Zoom) ---------- */
  var heroSlides = Array.prototype.slice.call(document.querySelectorAll('.hero-carousel__slide'));
  var heroDots = Array.prototype.slice.call(document.querySelectorAll('.hero-carousel__dot'));
  var heroIndex = 0;
  var heroTimer = null;
  // Reduced time as requested so it flips faster
  var HERO_DWELL_MS = 3800; 

  function updateHero(newIndex) {
    if (!heroSlides.length) return;
    if (newIndex === heroIndex) return;

    var currentSlide = heroSlides[heroIndex];
    var nextSlide = heroSlides[newIndex];

    // Current slide slides out to the left
    currentSlide.classList.remove('is-active');
    currentSlide.classList.add('is-exiting');

    // Next slide appears and zooms in
    nextSlide.classList.add('is-active');
    nextSlide.classList.remove('is-exiting');

    // Clean up exiting class after animation completes (800ms)
    setTimeout(function() {
      currentSlide.classList.remove('is-exiting');
    }, 850);

    // Update dots
    heroDots.forEach(function(dot, i) {
      if (i === newIndex) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });

    heroIndex = newIndex;
  }

  function nextHero() {
    var nextIndex = (heroIndex + 1) % heroSlides.length;
    updateHero(nextIndex);
  }

  function startHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = setInterval(nextHero, HERO_DWELL_MS);
  }

  if (heroSlides.length > 0) {
    // Initialize click listeners for dots
    heroDots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        updateHero(i);
        startHeroTimer(); // Reset timer on manual click
      });
    });

    startHeroTimer();
  }

  /* ---------- About photo carousel (swipe right→left) ---------- */
  var aboutTrack = document.getElementById("aboutTrack");
  var aboutSlides = aboutTrack
    ? Array.prototype.slice.call(aboutTrack.children)
    : [];
  var aboutIndex = 0;
  var aboutTimer = null;
  var ABOUT_DWELL_MS = 4000;

  function goAbout(i) {
    if (!aboutSlides.length) return;
    aboutIndex = (i + aboutSlides.length) % aboutSlides.length;
    aboutTrack.style.transform = "translateX(-" + aboutIndex * 100 + "%)";
  }
  function restartAbout() {
    if (aboutTimer) clearInterval(aboutTimer);
    aboutTimer = setInterval(function () {
      goAbout(aboutIndex + 1);
    }, ABOUT_DWELL_MS);
  }
  if (aboutSlides.length > 1) restartAbout();

  /* ---------- About features carousel ---------- */
  var featItems = Array.prototype.slice.call(
    document.querySelectorAll("#featuresList li")
  );
  var featIndex = 0;
  var featPrev = document.getElementById("featPrev");
  var featNext = document.getElementById("featNext");
  var featTimer = null;

  function goFeat(i) {
    if (!featItems.length) return;
    featIndex = (i + featItems.length) % featItems.length;
    featItems.forEach(function (li, idx) {
      li.classList.toggle("is-active", idx === featIndex);
    });
  }
  function restartFeat() {
    if (featTimer) clearInterval(featTimer);
    featTimer = setInterval(function () {
      goFeat(featIndex + 1);
    }, 3200);
  }
  if (featPrev)
    featPrev.addEventListener("click", function () {
      goFeat(featIndex - 1);
      restartFeat();
    });
  if (featNext)
    featNext.addEventListener("click", function () {
      goFeat(featIndex + 1);
      restartFeat();
    });
  featItems.forEach(function (li, idx) {
    li.addEventListener("click", function () {
      goFeat(idx);
      restartFeat();
    });
  });
  if (featItems.length) restartFeat();

  /* ---------- Ages infinite pebble carousel ---------- */
  var agesTrack = document.getElementById("agesTrack");
  var agesViewport = document.getElementById("agesViewport");
  var agesDotsWrap = document.getElementById("agesDots");

  if (agesTrack && agesViewport) {
    var agesDwell = 4000;
    var agesTimer = null;
    var agesAnimating = false;
    var agesIndex = 0;
    var agesRealCount = 0;
    var agesSlides = [];
    var agesDots = [];
    var agesCopies = 3;

    function agesLogicalIndex(trackIndex) {
      return (
        ((trackIndex % agesRealCount) + agesRealCount) %
        agesRealCount
      );
    }

    function agesSetActive(trackIndex) {
      agesSlides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === trackIndex);
      });
      var logical = agesLogicalIndex(trackIndex);
      agesDots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === logical);
        dot.setAttribute("aria-selected", i === logical ? "true" : "false");
      });
    }

    function agesPosition(animate) {
      var slide = agesSlides[agesIndex];
      if (!slide) return;
      var x =
        agesViewport.offsetWidth / 2 -
        slide.offsetLeft -
        slide.offsetWidth / 2;
      agesTrack.classList.toggle("is-animating", !!animate);
      agesTrack.style.transform = "translateX(" + x + "px)";
      agesSetActive(agesIndex);
    }

    function agesGoTo(trackIndex, animate) {
      if (agesAnimating && animate) return;
      agesIndex = trackIndex;
      if (animate) agesAnimating = true;
      agesPosition(animate);
      if (!animate) agesAnimating = false;
    }

    function agesGoToLogical(logical, animate) {
      agesGoTo(agesRealCount + logical, animate);
    }

    function agesRecenterIfNeeded() {
      var jumped = false;
      if (agesIndex >= agesRealCount * 2) {
        agesIndex -= agesRealCount;
        jumped = true;
      } else if (agesIndex < agesRealCount) {
        agesIndex += agesRealCount;
        jumped = true;
      }
      if (jumped) {
        agesTrack.classList.remove("is-animating");
        agesPosition(false);
      }
      agesSetActive(agesIndex);
    }

    function agesAfterTransition() {
      agesAnimating = false;
      agesRecenterIfNeeded();
    }

    function agesNext() {
      agesGoTo(agesIndex + 1, true);
    }

    function agesPrev() {
      agesGoTo(agesIndex - 1, true);
    }

    function agesRestartAuto() {
      if (agesTimer) clearInterval(agesTimer);
      agesTimer = setInterval(agesNext, agesDwell);
    }

    function agesInit() {
      var originals = Array.prototype.slice.call(
        agesTrack.querySelectorAll(".ages-slide")
      );
      agesRealCount = originals.length;
      if (!agesRealCount) return;

      var templates = originals.map(function (slide) {
        return slide.cloneNode(true);
      });

      agesTrack.innerHTML = "";
      for (var copy = 0; copy < agesCopies; copy++) {
        templates.forEach(function (tpl, slideIdx) {
          var node = tpl.cloneNode(true);
          if (copy !== 1) {
            node.classList.add("ages-slide--clone");
            node.setAttribute("aria-hidden", "true");
          }
          var hit = node.querySelector(".ages-slide__hit");
          if (hit) {
            hit.setAttribute(
              "aria-label",
              originals[slideIdx]
                .querySelector(".ages-slide__hit")
                .getAttribute("aria-label")
            );
            if (copy !== 1) hit.setAttribute("tabindex", "-1");
          }
          agesTrack.appendChild(node);
        });
      }

      agesSlides = Array.prototype.slice.call(
        agesTrack.querySelectorAll(".ages-slide")
      );
      agesIndex = agesRealCount;

      if (agesDotsWrap) {
        agesDotsWrap.innerHTML = "";
        for (var d = 0; d < agesRealCount; d++) {
          var btn = document.createElement("button");
          btn.setAttribute("role", "tab");
          btn.setAttribute("aria-label", "Age group " + (d + 1));
          btn.setAttribute("aria-selected", d === 0 ? "true" : "false");
          if (d === 0) btn.classList.add("is-active");
          (function (logical) {
            btn.addEventListener("click", function () {
              agesGoToLogical(logical, true);
              agesRestartAuto();
            });
          })(d);
          agesDotsWrap.appendChild(btn);
        }
        agesDots = Array.prototype.slice.call(agesDotsWrap.children);
      }

      agesTrack.addEventListener("transitionend", function (e) {
        if (e.target === agesTrack && e.propertyName === "transform") {
          agesAfterTransition();
        }
      });

      agesTrack.addEventListener("click", function (e) {
        var hit = e.target.closest(".ages-slide__hit");
        if (!hit) return;
        var slide = hit.closest(".ages-slide");
        var i = agesSlides.indexOf(slide);
        if (i === -1 || i === agesIndex || agesAnimating) return;
        agesGoTo(i, true);
        agesRestartAuto();
      });

      var dragStartX = 0;
      var dragDelta = 0;
      var isDragging = false;

      agesViewport.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        isDragging = true;
        dragStartX = e.clientX;
        dragDelta = 0;
        agesViewport.classList.add("is-dragging");
        agesTrack.classList.remove("is-animating");
        if (agesTimer) clearInterval(agesTimer);
      });

      window.addEventListener("pointermove", function (e) {
        if (!isDragging) return;
        dragDelta = e.clientX - dragStartX;
        var slide = agesSlides[agesIndex];
        var base =
          agesViewport.offsetWidth / 2 -
          slide.offsetLeft -
          slide.offsetWidth / 2;
        agesTrack.style.transform =
          "translateX(" + (base + dragDelta) + "px)";
      });

      window.addEventListener("pointerup", function () {
        if (!isDragging) return;
        isDragging = false;
        agesViewport.classList.remove("is-dragging");
        if (Math.abs(dragDelta) > 60) {
          if (dragDelta < 0) agesNext();
          else agesPrev();
        } else {
          agesPosition(true);
        }
        agesRestartAuto();
      });

      window.addEventListener("resize", function () {
        agesRecenterIfNeeded();
        agesPosition(false);
      });

      agesPosition(false);
      agesRestartAuto();
    }

    if (document.readyState === "complete") agesInit();
    else window.addEventListener("load", agesInit);
  }

  /* ---------- Locator tabs + map swap ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".locator__tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".locator__card"));
  var mapImgs = Array.prototype.slice.call(
    document.querySelectorAll(".locator__map-img")
  );
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var key = tab.getAttribute("data-loc");
      tabs.forEach(function (t) {
        t.classList.toggle("is-active", t === tab);
      });
      panels.forEach(function (p) {
        p.classList.toggle("is-active", p.getAttribute("data-panel") === key);
      });
      mapImgs.forEach(function (img) {
        img.classList.toggle("is-active", img.getAttribute("data-map") === key);
      });
    });
  });

  /* ---------- "Only at Herons" scroll-spy ---------- */
  var onlyCards = Array.prototype.slice.call(
    document.querySelectorAll("#onlyCards .only__card")
  );
  var onlyItems = Array.prototype.slice.call(
    document.querySelectorAll("#onlyList li")
  );

  function setOnlyActive(step) {
    onlyItems.forEach(function (li) {
      var s = parseInt(li.getAttribute("data-step"), 10);
      li.classList.toggle("is-active", s === step);
      li.classList.toggle("is-done", s < step);
    });
  }

  if (onlyCards.length && onlyItems.length && "IntersectionObserver" in window) {
    var onlySpy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var step = parseInt(entry.target.getAttribute("data-step"), 10);
            setOnlyActive(step);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    onlyCards.forEach(function (card) {
      onlySpy.observe(card);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = [
    ".about__heading",
    ".about__collage",
    ".about__lede",
    ".journey__heading",
    ".journey__sub",
    ".journey__map",
    ".stats__grid",
    ".ages__heading",
    ".ages-carousel",
    ".campus__top",
    ".campus__bottom",
    ".locator",
    ".story__text",
    ".paths__heading",
    ".paths__grid",
  ]
    .map(function (sel) {
      return document.querySelector(sel);
    })
    .filter(Boolean);

  revealEls.forEach(function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-in");
    });
  }
})();
