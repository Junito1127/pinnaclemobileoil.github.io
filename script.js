(function () {
  var CALENDLY = "https://calendly.com/pantojaefrain1127/pinnacle-appointment";

  // Mobile menu
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.getElementById("menu");
  toggle.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Terms & Conditions open/close
  var termsBtn = document.getElementById("termsToggle");
  var termsPanel = document.getElementById("termsPanel");
  function setTerms(open) {
    termsBtn.setAttribute("aria-expanded", open);
    termsPanel.hidden = !open;
  }
  termsBtn.addEventListener("click", function () {
    setTerms(termsBtn.getAttribute("aria-expanded") !== "true");
  });
  document.querySelectorAll("[data-open-terms]").forEach(function (a) {
    a.addEventListener("click", function () { setTerms(true); });
  });

  // Quote calculator
  var form = document.getElementById("quoteForm");
  var totalEl = document.getElementById("total");
  var summaryEl = document.getElementById("summary");
  var agree = document.getElementById("agree");
  var bookBtn = document.getElementById("bookBtn");
  var copyBtn = document.getElementById("copyBtn");
  var copyMsg = document.getElementById("copyMsg");

  function money(n) { return "$" + n.toFixed(2).replace(/\.00$/, ""); }

  function buildQuote() {
    var tier = form.querySelector('input[name="tier"]:checked');
    var total = Number(tier.value);
    var lines = [tier.dataset.label + " - " + money(Number(tier.value))];
    form.querySelectorAll('input[name="addon"]:checked').forEach(function (a) {
      total += Number(a.value);
      lines.push(a.dataset.label + " - " + money(Number(a.value)));
    });
    return { total: total, lines: lines };
  }

  function update() {
    var q = buildQuote();
    totalEl.textContent = money(q.total);
    summaryEl.textContent = q.lines.join(" + ");
  }
  form.addEventListener("change", update);
  update();

  // Pricing card buttons pre-select a tier
  document.querySelectorAll("[data-pick]").forEach(function (b) {
    b.addEventListener("click", function () {
      var val = b.dataset.pick === "large" ? "125" : "95";
      var input = form.querySelector('input[name="tier"][value="' + val + '"]');
      if (input) { input.checked = true; update(); }
    });
  });

  // Agreement gate
  agree.addEventListener("change", function () { bookBtn.disabled = !agree.checked; });
  bookBtn.addEventListener("click", function () {
    document.getElementById("book").scrollIntoView({ behavior: "smooth" });
  });

  // Copy quote
  copyBtn.addEventListener("click", function () {
    var q = buildQuote();
    var text = "Pinnacle Mobile Oil quote\n" + q.lines.join("\n") + "\nEstimated total: " + money(q.total);
    function done(ok) {
      copyMsg.textContent = ok
        ? "Quote copied. Paste it into the notes box on the booking form."
        : "Could not copy automatically. Select and copy: " + q.lines.join(" + ") + " (Total " + money(q.total) + ")";
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });

  // Gentle reveal on scroll (skipped if the browser does not support it)
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var targets = document.querySelectorAll(".step, .price-card, .addon, .quote-card, .notice-card, .calendly-wrap, .strip-grid > div");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();
})();
