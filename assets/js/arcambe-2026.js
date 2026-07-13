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
})();
