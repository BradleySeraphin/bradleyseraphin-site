(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Nav background on scroll ---------------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------------- Smooth-scroll for in-page nav links ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------------- Hero parallax layers ---------------- */
  var layers = document.querySelectorAll("[data-speed]");
  var ticking = false;

  function updateParallax() {
    var y = window.scrollY;
    layers.forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-speed")) || 0;
      el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
    });
    ticking = false;
  }

  function onScrollParallax() {
    if (!ticking && !reduceMotion) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  if (!reduceMotion) {
    window.addEventListener("scroll", onScrollParallax, { passive: true });
    updateParallax();
  }

  /* ---------------- Cursor glow ---------------- */
  var glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(pointer: fine)").matches) {
    var gx = window.innerWidth / 2, gy = window.innerHeight / 2, cx = gx, cy = gy;
    window.addEventListener("mousemove", function (e) { gx = e.clientX; gy = e.clientY; });
    (function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  } else if (glow) {
    glow.style.display = "none";
  }

  /* ---------------- Case study accordions ---------------- */
  document.querySelectorAll(".case").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest(".case__visual") || e.target.closest("a")) return;
      var wasOpen = card.classList.contains("open");
      document.querySelectorAll(".case.open").forEach(function (c) { c.classList.remove("open"); });
      if (!wasOpen) card.classList.add("open");
    });
  });

  /* ---------------- Particle network background ---------------- */
  var canvas = document.getElementById("particles");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var count = window.innerWidth < 640 ? 30 : 65;
    var w, h;

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(77,163,255,0.55)";
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "rgba(77,163,255,0.12)";
      ctx.lineWidth = 1;
      for (var a = 0; a < particles.length; a++) {
        for (var b = a + 1; b < particles.length; b++) {
          var dx = particles[a].x - particles[b].x;
          var dy = particles[a].y - particles[b].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    step();
  }

  /* ---------------- Cinematic player tabs ---------------- */
  var cinePlayer = document.getElementById("cinePlayer");
  var cineTabs = document.querySelectorAll(".cine-tabs:not(.mgr-tabs) button");
  if (cinePlayer && cineTabs.length) {
    cineTabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("active")) return;
        cineTabs.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var src = btn.getAttribute("data-src");
        var poster = btn.getAttribute("data-poster");
        cinePlayer.pause();
        cinePlayer.querySelector("source").setAttribute("src", src);
        cinePlayer.setAttribute("poster", poster);
        cinePlayer.load();
      });
    });
  }

  /* ---------------- MGR screenshot tabs ---------------- */
  var mgrShot = document.getElementById("mgrShot");
  var mgrTabs = document.querySelectorAll(".mgr-tabs button");
  if (mgrShot && mgrTabs.length) {
    mgrTabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.classList.contains("active")) return;
        mgrTabs.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        mgrShot.setAttribute("src", btn.getAttribute("data-src"));
      });
    });
  }

  /* ---------------- Chapter rail highlight ---------------- */
  var railLinks = document.querySelectorAll(".chapter-rail a");
  var chapterSections = document.querySelectorAll("section.chapter[id]");
  if (railLinks.length && chapterSections.length && "IntersectionObserver" in window) {
    var railIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            railLinks.forEach(function (l) {
              l.classList.toggle("active", l.getAttribute("data-ch") === id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    chapterSections.forEach(function (s) { railIo.observe(s); });
  }

  /* ---------------- Active nav link highlight ---------------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__links a");
  if ("IntersectionObserver" in window && sections.length) {
    var navIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (l) {
              l.style.color = l.getAttribute("href") === "#" + id ? "var(--ink)" : "";
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sections.forEach(function (s) { navIo.observe(s); });
  }
})();
