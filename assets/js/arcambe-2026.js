(function () {
  var body = document.body;
  if (!body) return;

  body.classList.add("arcambe-refresh");

  if (!document.querySelector(".skip-link")) {
    var skip = document.createElement("a");
    skip.className = "skip-link";
    skip.href = "#conteudo";
    skip.textContent = "Saltar para o conteudo";
    document.body.insertBefore(skip, document.body.firstChild);
  }

  var mainTarget = document.querySelector("main, header, section");
  if (mainTarget && !mainTarget.id) {
    mainTarget.id = "conteudo";
  }

  var current = window.location.pathname.split("/").pop() || "index.html";
  var isLanding = current.indexOf("lp-") === 0;
  if (isLanding) {
    body.classList.add("is-landing");
  }

  document.querySelectorAll("nav a[href]").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var target = href.split("#")[0];
    if (target === current || (current === "" && target === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  document.querySelectorAll("a[target=\"_blank\"]").forEach(function (link) {
    var rel = (link.getAttribute("rel") || "").split(/\s+/);
    ["noopener", "noreferrer"].forEach(function (value) {
      if (rel.indexOf(value) === -1) rel.push(value);
    });
    link.setAttribute("rel", rel.join(" ").trim());
  });

  document.querySelectorAll("img").forEach(function (img, index) {
    if (!img.hasAttribute("loading") && index > 1) {
      img.setAttribute("loading", "lazy");
    }
    if (!img.hasAttribute("decoding")) {
      img.setAttribute("decoding", "async");
    }
  });

  var menuButton = document.getElementById("mobile-menu-btn");
  var mobileMenu = document.getElementById("mobile-menu");
  if (menuButton && mobileMenu) {
    menuButton.setAttribute("aria-controls", "mobile-menu");
    menuButton.setAttribute("aria-expanded", mobileMenu.classList.contains("hidden") ? "false" : "true");
    menuButton.addEventListener("click", function () {
      window.setTimeout(function () {
        menuButton.setAttribute("aria-expanded", mobileMenu.classList.contains("hidden") ? "false" : "true");
      }, 0);
    });
  }

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function () {
      var button = form.querySelector("button[type=\"submit\"]");
      if (!button || button.dataset.locked === "true") return;
      button.dataset.locked = "true";
      button.setAttribute("aria-busy", "true");
      window.setTimeout(function () {
        button.dataset.locked = "false";
        button.removeAttribute("aria-busy");
      }, 6500);
    });
  });

  if (isLanding && !document.querySelector(".arc-floating-cta")) {
    var cta = document.createElement("a");
    cta.className = "arc-floating-cta";
    cta.href = "orcamento.html";
    cta.setAttribute("aria-label", "Solicitar proposta para este servico");
    cta.innerHTML = '<i class="fa-solid fa-file-signature" aria-hidden="true"></i><span>Solicitar proposta</span>';
    document.body.appendChild(cta);
  }

  var heroCanvas = document.querySelector(".arc-hero-canvas");
  if (heroCanvas && heroCanvas.getContext) {
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var ctx = heroCanvas.getContext("2d");
    var points = [];
    var raf = 0;

    function resizeHeroCanvas() {
      var rect = heroCanvas.getBoundingClientRect();
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      heroCanvas.width = Math.max(1, Math.floor(rect.width * ratio));
      heroCanvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildHeroPoints(rect.width, rect.height);
      drawHeroCanvas(0, true);
    }

    function buildHeroPoints(width, height) {
      points = [];
      var columns = Math.max(5, Math.floor(width / 170));
      var rows = Math.max(4, Math.floor(height / 150));
      for (var y = 0; y <= rows; y += 1) {
        for (var x = 0; x <= columns; x += 1) {
          points.push({
            x: (width * x) / columns,
            y: (height * y) / rows,
            phase: (x * 0.7) + (y * 1.2)
          });
        }
      }
    }

    function drawHeroCanvas(time, drawOnce) {
      var width = heroCanvas.clientWidth;
      var height = heroCanvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      points.forEach(function (point, index) {
        var drift = reduceMotion ? 0 : Math.sin((time / 1800) + point.phase) * 7;
        var x = point.x + drift;
        var y = point.y + drift * 0.35;
        var next = points[index + 1];
        var below = points[index + Math.max(5, Math.floor(width / 170)) + 1];

        ctx.fillStyle = "rgba(184, 217, 198, 0.34)";
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();

        [next, below].forEach(function (target) {
          if (!target) return;
          var tx = target.x + drift * 0.6;
          var ty = target.y + drift * 0.25;
          var distance = Math.hypot(tx - x, ty - y);
          if (distance > 210) return;
          ctx.strokeStyle = "rgba(184, 217, 198, 0.12)";
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        });
      });

      if (!reduceMotion && !drawOnce) {
        raf = window.requestAnimationFrame(drawHeroCanvas);
      }
    }

    resizeHeroCanvas();
    window.addEventListener("resize", resizeHeroCanvas, { passive: true });
    if (!reduceMotion) {
      raf = window.requestAnimationFrame(drawHeroCanvas);
    }
    window.addEventListener("beforeunload", function () {
      if (raf) window.cancelAnimationFrame(raf);
    });
  }
})();
