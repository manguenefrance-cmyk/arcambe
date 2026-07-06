(function () {
  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
      });
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function payloadFromForm(form) {
    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = String(value).trim();
    });
    return data;
  }

  function messageFor(formType, ok) {
    var isEnglish = document.documentElement.lang.indexOf("en") === 0;
    if (ok && formType === "newsletter") {
      return isEnglish ? "Subscription confirmed. Please check your inbox." : "Subscricao confirmada. Verifique o seu e-mail.";
    }
    if (ok) {
      return isEnglish ? "Request sent. We also emailed you a confirmation." : "Pedido enviado. Tambem enviamos uma confirmacao para o seu e-mail.";
    }
    return isEnglish ? "We could not send it now. Please try again or use WhatsApp." : "Nao foi possivel enviar agora. Tente novamente ou use o WhatsApp.";
  }

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector("[data-form-status]");
      var button = form.querySelector("button[type='submit']");
      var type = form.getAttribute("data-form");
      var payload = payloadFromForm(form);

      if (payload.website) return;
      if (status) {
        status.classList.remove("error");
        status.textContent = document.documentElement.lang.indexOf("en") === 0 ? "Sending..." : "A enviar...";
      }
      if (button) button.disabled = true;

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then(function () {
          form.reset();
          if (status) status.textContent = messageFor(type, true);
        })
        .catch(function () {
          if (status) {
            status.classList.add("error");
            status.textContent = messageFor(type, false);
          }
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  });
})();
