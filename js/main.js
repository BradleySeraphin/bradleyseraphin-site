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

/* ---------------- Swell model: one sea, three specialty swell trains ---------------- */
(function () {
  var LENS = {
    pm:     { name: "Product Marketing", color: "#4da3ff" },
    gtm:    { name: "Go-to-Market", color: "#3ddc84" },
    growth: { name: "User Acquisition & Growth", color: "#ffb454" }
  };
  var ORDER = ["pm", "gtm", "growth"];
  var LENS_DEFAULT = { pm: "create", gtm: "robot", growth: "ua" };

  var M = [
    { id: "veoh", axis: "Veoh", yr: "2005–08", label: "22M", co: "Veoh Networks", era: "2005–2008 · Online video's infancy", href: "work/veoh.html",
      l: { growth: { title: "Racing YouTube to a top-25 US site",
        tags: ["Viral marketing", "Community management", "Guerrilla marketing", "Homepage programming", "Growth hacking", "In-video ad formats", "22M unique monthly users"] } } },
    { id: "robot", axis: "HP Robotics", yr: "2017–18", label: "Telepresence", co: "HP Inc.", era: "2017–2018 · Strategy & Emerging Business", href: "work/hp.html",
      l: { pm: { title: "Marketing lead of a robotics project in healthcare featuring computer vision",
        tags: ["Investment opportunities", "Business cases + financial models", "Industry trends", "Market research", "TAM / SAM / SOM", "Business model creation", "Customer insights", "Competitive analysis", "Customer journeys", "User journeys", "Prototypes", "Partnerships"] },
           gtm: { title: "An AI robot for senior healthcare, and the business case that got it funded",
        tags: ["Business plan", "Business model", "Go-to-market strategy", "Market sizing", "Regulatory strategy", "Competitive landscape", "User research", "Bill and Dave Award"] } } },
    { id: "roadmap", axis: "HP Smart", yr: "2019", label: "Roadmap", co: "HP Smart", era: "2019 · Scaled Agile", href: "work/hp.html",
      l: { pm: { title: "Implemented a scaled agile SDLC with product and design; product marketing owned the product narrative and roadmap for a platform serving 3 customer segments",
        tags: ["Product narrative", "Roadmap", "Scaled Agile (SAFe)", "3 customer segments"] } } },
    { id: "data", axis: "HP Smart", yr: "2020", label: "Analytics", co: "HP Smart", era: "2020 · Analytics", href: "work/hp.html",
      l: { pm: { title: "Identified gaps in reporting, implemented fixes, generated reports, and drove strategy with data",
        tags: ["Reporting gaps + fixes", "Reports", "Data-driven strategy"] } } },
    { id: "create", axis: "HP Smart", yr: "2021–22", label: "2 launches", co: "HP Smart", era: "2021–2022 · Create segment", href: "work/hp.html",
      l: { pm: { title: "Led the Create customer segment and brought 2 solution launches to market: Memories and 4x6 duplex photo printing",
        tags: ["Segment lead", "Memories", "4x6 duplex photo printing", "Solution launches"] },
           gtm: { title: "Brought 2 solution launches to market: Memories and 4x6 duplex photo printing",
        tags: ["Memories", "4x6 duplex photo printing", "Business plan + GTM strategy", "User stories", "Launch video"] } } },
    { id: "sstk", axis: "Shutterstock", yr: "2022", label: "Creative Flow", co: "Shutterstock", era: "2022 · Creative Flow", href: "work/shutterstock.html",
      l: { pm: { title: "A GTM plan for solopreneurs, built inside an enterprise engine",
        tags: ["Positioning", "Channel strategy", "Pricing", "Landing pages", "Content strategy"] },
           gtm: { title: "A GTM plan for solopreneurs, built inside an enterprise engine",
        tags: ["Teach-first strategy", "SEO content", "Micro-influencer video", "Landing pages", "Pricing"] } } },
    { id: "ssg", axis: "Shiba Story Go", yr: "2025 launch", label: "Launch", co: "Proof of Play", era: "2025 · Shiba Story Go", href: "work/proof-of-play.html",
      l: { gtm: { title: "Launched Shiba Story Go across site, paid, social, and Discord",
        tags: ["Site", "Paid", "Social", "Discord", "100+ ad variants", "Hyper-localized ads"] } } },
    { id: "ua", axis: "Shiba Story Go", yr: "2025 UA", label: "Paid UA", co: "Proof of Play", era: "2025 · Shiba Story Go", href: "work/proof-of-play.html",
      l: { growth: { title: "Led performance marketing and user acquisition for Shiba Story Go",
        tags: ["Meta", "Google", "Apple Search Ads", "Unity", "TikTok", "AppLovin", "Mintegral", "100+ ad variants", "Appvertiser (UA agency)"] } } },
    { id: "social", axis: "Shiba Story Go", yr: "2025 social", label: "291K+", co: "Proof of Play", era: "2025 · Shiba Story Go", href: "work/proof-of-play.html",
      l: { growth: { title: "Two months, one animation team, three channels",
        tags: ["0 → 291K TikTok followers, ~7 weeks", "49.2K YouTube subscribers", "12.2K Instagram followers"] } } }
  ];

  var root = document.getElementById("swell");
  if (!root) return;
  var stage = root.querySelector(".swell__stage");
  var svg = root.querySelector(".swell__svg");
  var scan = root.querySelector(".swell__scan");
  var crest = root.querySelector(".swell__crest");
  var axis = root.querySelector(".swell__axis");
  var card = document.getElementById("swell-card");
  var backBtn = root.querySelector(".swell__back");
  var NS = "http://www.w3.org/2000/svg";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var lens = "all", selected = "create", hover = -1, pointerX = null;
  var amp = { pm: 0.62, gtm: 0.62, growth: 0.62 };     // animated layer heights
  var lift = M.map(function () { return 0; });          // animated per-moment lift

  // SVG layers, back to front
  var defs = "<defs>";
  ORDER.forEach(function (k) {
    defs += '<linearGradient id="lg-' + k + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + LENS[k].color +
      '" stop-opacity="0.55"/><stop offset="1" stop-color="' + LENS[k].color + '" stop-opacity="0"/></linearGradient>';
  });
  svg.innerHTML = defs + "</defs>";
  var fills = {}, lines = {};
  ORDER.forEach(function (k) {
    fills[k] = document.createElementNS(NS, "path"); fills[k].setAttribute("fill", "url(#lg-" + k + ")"); svg.appendChild(fills[k]);
  });
  ORDER.forEach(function (k) {
    lines[k] = document.createElementNS(NS, "path"); lines[k].setAttribute("fill", "none");
    lines[k].setAttribute("stroke", LENS[k].color); lines[k].setAttribute("stroke-width", "1.5"); svg.appendChild(lines[k]);
  });
  var sea = document.createElementNS(NS, "path");
  sea.setAttribute("fill", "none"); sea.setAttribute("stroke", "rgba(154,160,171,0.3)"); sea.setAttribute("stroke-width", "1");
  svg.appendChild(sea);

  // Axis buttons
  var ticks = M.map(function (m, i) {
    var b = document.createElement("button");
    b.type = "button"; b.setAttribute("role", "tab");
    b.innerHTML = "<span class=\"dots\">" + ORDER.map(function (k) { return m.l[k] ? '<i style="background:' + LENS[k].color + '"></i>' : ""; }).join("") +
      "</span><b>" + m.axis + "</b><em>" + m.yr + "</em>";
    b.addEventListener("click", (function (m_captured) { return function () { if (lens !== "all" && !m_captured.l[lens]) setLens("all"); select(m_captured.id); }; })(m));
    b.addEventListener("mouseenter", function () { hover = i; });
    b.addEventListener("mouseleave", function () { hover = -1; });
    axis.appendChild(b); return b;
  });

  var W = 0, H = 0, base = 0, t = 0;
  function measure() { W = svg.clientWidth; H = svg.clientHeight; base = H - 6; placeTicks(); }
  function mx(i) { var pad = Math.max(48, W * 0.06); return pad + i * (W - 2 * pad) / (M.length - 1); }
  function placeTicks() { ticks.forEach(function (b, i) { b.style.left = mx(i) + "px"; }); }
  function ripple(x, k) { return 2.5 * Math.sin(x / 36 + t * 1.3 + k) + 1.8 * Math.sin(x / 88 - t * 0.8 + k * 2); }

  function layerY(k, x) {
    var sig = (W - 2 * Math.max(48, W * 0.06)) / (M.length - 1) * 0.5, h = 0;
    for (var i = 0; i < M.length; i++) {
      if (!M[i].l[k]) continue;
      var d = (x - mx(i)) / sig;
      h += (amp[k] + lift[i]) * Math.exp(-d * d);
    }
    return base - ripple(x, ORDER.indexOf(k)) - Math.min(h, 1.25) * (H - 70);
  }
  function surfaceY(x) { var y = base; ORDER.forEach(function (k) { y = Math.min(y, layerY(k, x)); }); return y; }

  function nearest(x) {
    var best = 0, bd = 1e9;
    for (var i = 0; i < M.length; i++) { var d = Math.abs(mx(i) - x); if (d < bd) { bd = d; best = i; } }
    return best;
  }

  function tick() {
    // ease layer amplitudes toward the lens targets
    ORDER.forEach(function (k) {
      var target = lens === "all" ? 0.55 : (k === lens ? 0.95 : 0.1);
      amp[k] += (target - amp[k]) * (reduce ? 1 : 0.08);
    });
    var hi = pointerX !== null ? nearest(pointerX) : hover;
    M.forEach(function (m, i) {
      var inLens = lens === "all" || !!m.l[lens];
      var target = (m.id === selected ? 0.3 : 0) + (i === hi && inLens ? 0.18 : 0);
      lift[i] += (target - lift[i]) * (reduce ? 1 : 0.12);
    });
  }

  function draw() {
    tick();
    var step = 5, x;
    ORDER.forEach(function (k) {
      var d = "", dl = "";
      for (x = 0; x <= W + step; x += step) {
        var y = layerY(k, x).toFixed(1);
        d += (x === 0 ? "M" : " L") + x + "," + y; dl += (x === 0 ? "M" : " L") + x + "," + y;
      }
      fills[k].setAttribute("d", d + " L" + W + "," + H + " L0," + H + " Z");
      lines[k].setAttribute("d", dl);
      var active = lens === "all" || lens === k;
      fills[k].setAttribute("opacity", active ? "1" : "0.35");
      lines[k].setAttribute("stroke-opacity", active ? "0.9" : "0.2");
    });
    var ds = "";
    for (x = 0; x <= W + step; x += step) ds += (x === 0 ? "M" : " L") + x + "," + (base - ripple(x, 5)).toFixed(1);
    sea.setAttribute("d", ds);

    // selected crest label rides the surface
    var si = M.findIndex(function (m) { return m.id === selected; });
    var cx = mx(si), cy = surfaceY(cx);
    crest.style.transform = "translate(" + cx + "px," + cy + "px)";

    // scan line + rider: full opacity on hover, ghost breathe at selected x when idle
    if (pointerX !== null) {
      scan.classList.remove("is-ghost");
      scan.style.opacity = "1";
      scan.style.transform = "translateX(" + pointerX + "px)";
      scan.firstChild.style.transform = "translateY(" + surfaceY(pointerX) + "px)";
    } else {
      var si2 = M.findIndex(function (m) { return m.id === selected; });
      var gx = mx(si2);
      scan.style.transform = "translateX(" + gx + "px)";
      scan.firstChild.style.transform = "translateY(" + surfaceY(gx) + "px)";
      if (!scan.classList.contains("is-ghost")) { scan.style.opacity = ""; scan.classList.add("is-ghost"); }
    }

    ticks.forEach(function (b, i) {
      var inLens = lens === "all" || !!M[i].l[lens];
      b.classList.toggle("is-dim", !inLens);
      b.classList.toggle("is-selected", M[i].id === selected);
      b.setAttribute("aria-selected", M[i].id === selected ? "true" : "false");
    });

  }

  function lensFor(m) { return (lens !== "all" && m.l[lens]) ? lens : ORDER.filter(function (k) { return m.l[k]; })[0]; }

  function renderCard() {
    var m = M.filter(function (q) { return q.id === selected; })[0];
    var k = lensFor(m), c = m.l[k];
    crest.querySelector("b").textContent = m.label;
    crest.querySelector("span").textContent = m.co;
    crest.style.setProperty("--c", LENS[k].color);
    var proves = ORDER.filter(function (q) { return m.l[q]; }).map(function (q) {
      return '<button type="button" data-lens="' + q + '" class="' + (q === k ? "is-on" : "") + '" style="--c:' + LENS[q].color + '"><i></i>' + LENS[q].name + "</button>";
    }).join("");
    card.innerHTML = '<div class="swell__line"><span class="k">' + m.co + " · " + m.era + "</span><h4>" + c.title +
      '</h4><a href="' + m.href + '">Full story →</a></div>' +
      '<div class="swell__meta"><div class="swell__proves">' + proves + '</div><ul class="swell__tags">' +
      c.tags.map(function (tg) { return "<li>" + tg + "</li>"; }).join("") + "</ul></div>";
    card.querySelectorAll("[data-lens]").forEach(function (b) {
      b.addEventListener("click", function () { setLens(b.dataset.lens); });
    });
  }

  function beaconNeighbors() {
    var si = M.findIndex(function (m) { return m.id === selected; });
    var left = -1, right = -1;
    for (var i = si - 1; i >= 0; i--) { if (lens === "all" || M[i].l[lens]) { left = i; break; } }
    for (var j = si + 1; j < M.length; j++) { if (lens === "all" || M[j].l[lens]) { right = j; break; } }
    [left, right].forEach(function (idx) {
      if (idx < 0) return;
      var b = ticks[idx];
      b.classList.remove("is-beacon"); void b.offsetWidth;
      b.classList.add("is-beacon");
      setTimeout(function () { b.classList.remove("is-beacon"); }, 1100);
    });
  }

  function select(id) { selected = id; renderCard(); beaconNeighbors(); }

  function setLens(key) {
    lens = key;
    document.querySelectorAll(".calm__pillars button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.pillar === key ? "true" : "false");
    });
    if (key !== "all") {
      if (LENS_DEFAULT[key]) {
        selected = LENS_DEFAULT[key];
      } else {
        var cur = M.filter(function (q) { return q.id === selected; })[0];
        if (!cur.l[key]) selected = M.filter(function (q) { return q.l[key]; })[0].id;
      }
    }
    if (backBtn) backBtn.hidden = key === "all";
    renderCard();
    filterWork(key);
    runScan();
  }

  // pointer: ride the swell; click to lock a moment
  stage.addEventListener("pointermove", function (e) { var r = stage.getBoundingClientRect(); pointerX = e.clientX - r.left; });
  stage.addEventListener("pointerleave", function () { pointerX = null; });
  stage.addEventListener("click", function (e) {
    var r = stage.getBoundingClientRect(), i = nearest(e.clientX - r.left);
    if (lens !== "all" && !M[i].l[lens]) setLens("all");
    select(M[i].id);
  });
  axis.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var pool = M.filter(function (m) { return lens === "all" || m.l[lens]; });
    var i = pool.findIndex(function (m) { return m.id === selected; });
    i = (i + (e.key === "ArrowRight" ? 1 : -1) + pool.length) % pool.length;
    select(pool[i].id); ticks[M.indexOf(pool[i])].focus();
  });

  document.querySelectorAll(".calm__pillars button").forEach(function (b) {
    b.addEventListener("click", function () { setLens(lens === b.dataset.pillar ? "all" : b.dataset.pillar); });
  });
  if (backBtn) backBtn.addEventListener("click", function () { setLens("all"); });

  var filterBtns = document.querySelectorAll(".work-filter button");
  var cases = document.querySelectorAll(".case[data-pillars]");
  function filterWork(key) {
    filterBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.filter === key ? "true" : "false"); });
    cases.forEach(function (c) {
      var show = key === "all" || c.dataset.pillars.split(" ").indexOf(key) !== -1;
      c.classList.toggle("is-hidden", !show);
      if (show) c.classList.add("in-view");
    });
  }
  filterBtns.forEach(function (b) { b.addEventListener("click", function () { setLens(b.dataset.filter); }); });

  measure(); renderCard(); draw();
  window.addEventListener("resize", measure);
  if (reduce) { setInterval(draw, 300); return; }
  (function loop() { t += 0.016; draw(); requestAnimationFrame(loop); })();

  // Wave flash: briefly glow the active wave line after scan completes
  function flashWave() {
    var k = lens === "all" ? ORDER[0] : lens;
    var ln = lines[k];
    if (!ln) return;
    ln.style.filter = "drop-shadow(0 0 6px " + LENS[k].color + ") drop-shadow(0 0 14px " + LENS[k].color + ")";
    setTimeout(function () { ln.style.filter = ""; }, 700);
  }

  // Auto-scan: sweep once when stage enters view, and again on each lens switch
  var scanGen = 0;
  function runScan() {
    var gen = ++scanGen, dur = 2400, s0 = null;
    (function frame(ts) {
      if (scanGen !== gen) return;
      if (!s0) s0 = ts;
      var p = Math.min((ts - s0) / dur, 1);
      p = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      pointerX = p * (stage.offsetWidth || W);
      if (p < 1) requestAnimationFrame(frame);
      else { pointerX = null; flashWave(); }
    })(performance.now());
    var cancel = function () { if (scanGen === gen) { scanGen++; pointerX = null; } };
    stage.addEventListener("pointermove", cancel, { once: true });
    stage.addEventListener("click", cancel, { once: true });
  }
  var scanObs = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    scanObs.disconnect();
    runScan();
  }, { threshold: 0.4 });
  scanObs.observe(stage);

  // Pillar idle cycle: pulse buttons sequentially if user hasn't picked a lens after 4s
  var idleFired = false;
  setTimeout(function () {
    if (lens !== "all" || idleFired) return;
    idleFired = true;
    var btns = Array.from(document.querySelectorAll(".calm__pillars button"));
    var i = 0;
    (function next() {
      if (i >= btns.length) return;
      var b = btns[i++];
      b.classList.add("is-idle-pulse");
      setTimeout(function () { b.classList.remove("is-idle-pulse"); setTimeout(next, 160); }, 580);
    })();
  }, 4000);
})();

/* ---------------- Marquee: ensure enough groups for seamless loop at any viewport width ---------------- */
(function () {
  var wrap = document.querySelector(".marquee");
  if (!wrap) return;
  var primary = wrap.querySelector(".marquee__group");
  if (!primary) return;
  var safety = 8;
  while (wrap.scrollWidth < window.innerWidth * 3 && --safety > 0) {
    var clone = primary.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    wrap.appendChild(clone);
  }
  var n = wrap.querySelectorAll(".marquee__group").length;
  document.documentElement.style.setProperty("--marquee-shift", "-" + (100 / n).toFixed(4) + "%");
})();

/* ---------------- Flow field: wind/swell streamlines behind the hero ---------------- */
(function () {
  var cv = document.getElementById("flow");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var hero = cv.closest(".hero");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var W, H, parts = [], t = 0;

  // speed ramp like a wind map: deep blue -> site blue -> green -> amber
  var RAMP = [[31,76,133],[77,163,255],[61,220,132],[255,180,84]];
  function color(v, a) {
    v = Math.max(0, Math.min(0.999, v)) * (RAMP.length - 1);
    var i = Math.floor(v), f = v - i, c0 = RAMP[i], c1 = RAMP[i + 1];
    return "rgba(" + Math.round(c0[0] + (c1[0] - c0[0]) * f) + "," + Math.round(c0[1] + (c1[1] - c0[1]) * f) + "," +
      Math.round(c0[2] + (c1[2] - c0[2]) * f) + "," + a + ")";
  }

  // prevailing flow from the WNW toward the coast, bent by a few slow eddies
  var EDDIES = [
    { x: 0.18, y: 0.30, r: 0.16, s: 1.0 },
    { x: 0.62, y: 0.62, r: 0.13, s: -0.9 },
    { x: 0.86, y: 0.22, r: 0.10, s: 1.2 },
    { x: 0.40, y: 0.85, r: 0.12, s: 0.8 }
  ];
  function field(x, y) {
    var nx = x / W, ny = y / H;
    var vx = 1.0 + 0.35 * Math.sin(ny * 6.0 + t * 0.15) + 0.2 * Math.sin(nx * 3.1 - t * 0.1);
    var vy = 0.32 + 0.30 * Math.cos(nx * 5.0 + t * 0.12) + 0.15 * Math.sin((nx + ny) * 7.0);
    for (var k = 0; k < EDDIES.length; k++) {
      var e = EDDIES[k], dx = nx - e.x, dy = (ny - e.y) * (H / W);
      var d2 = dx * dx + dy * dy, fall = Math.exp(-d2 / (e.r * e.r));
      vx += -dy / Math.sqrt(d2 + 1e-4) * fall * 2.2 * e.s;
      vy += dx / Math.sqrt(d2 + 1e-4) * fall * 2.2 * e.s;
    }
    return [vx, vy];
  }

  function spawn(p) { p.x = Math.random() * W; p.y = Math.random() * H; p.age = 0; p.life = 60 + Math.random() * 120; return p; }

  function resize() {
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(W * H / 1400);
    parts = [];
    for (var i = 0; i < n; i++) { var p = spawn({}); p.age = Math.random() * p.life; parts.push(p); }
  }

  function step() {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.075)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1;
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], v = field(p.x, p.y), sp = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
      var nx = p.x + v[0] * 0.9, ny = p.y + v[1] * 0.9;
      var fade = Math.min(1, p.age / 20, (p.life - p.age) / 20);
      ctx.strokeStyle = color((sp - 0.6) / 2.4, (0.42 * fade).toFixed(3));
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
      p.x = nx; p.y = ny; p.age++;
      if (p.age > p.life || p.x < -5 || p.x > W + 5 || p.y < -5 || p.y > H + 5) spawn(p);
    }
    t += 0.016;
  }

  resize();
  window.addEventListener("resize", resize);
  if (reduce) { for (var i = 0; i < 120; i++) step(); return; }
  (function loop() { step(); requestAnimationFrame(loop); })();
})();
