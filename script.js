(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const dialog = $("#appDialog");
  const toast = $("#toast");
  let toastTimer;
  let activeFilter = "all";
  const clubs = {
    "KAIZEN": { kicker: "TECHNOLOGY · DEVELOPMENT · CP · KI", text: "KAIZEN combines Development, Competitive Programming, and KI into one technology community. This profile can later show the official description, leadership, upcoming events, membership rules, and announcements.", art: "⌘" },
    "NEX-CELL": { kicker: "ENTREPRENEURSHIP · STARTUPS", text: "NEX-CELL is about entrepreneurship, startup culture, innovation, and helping students turn ideas into something real.", art: "↗" },
    "MALHAR": { kicker: "EVENTS · ENTERTAINMENT · CULTURE", text: "MALHAR brings campus life to the stage through college events, entertainment, cultural activities, and campus-wide programs.", art: "✳" },
    "Khel Society": { kicker: "SPORTS · GAMES · TOURNAMENTS", text: "Khel Society brings students together through sports, games, tournaments, and athletic activities. Add the official club logo when it is available.", art: "♜" }
  };

  function notify(message) {
    $("#toastMessage").textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function openDialog({kicker = "CAMPUS CIRCLE", title, text, callout = "This is a front-end prototype. Secure accounts, membership applications, registrations, and notifications need a backend.", art = "✦", action = "Sounds good"}) {
    $("#dialogKicker").textContent = kicker;
    $("#dialogTitle").textContent = title;
    $("#dialogBody").textContent = text;
    $("#dialogCallout").textContent = callout;
    $("#dialogArt").textContent = art;
    $("#dialogConfirm").innerHTML = `${action} <span>↗</span>`;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.alert(`${title}\n\n${text}`);
  }
  $("#dialogClose").addEventListener("click", () => dialog.close());
  $("#dialogConfirm").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

  function filterClubs() {
    const query = $("#clubSearch").value.trim().toLowerCase();
    let count = 0;
    $$(".club-card").forEach(card => {
      const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
      const matchesQuery = card.dataset.name.includes(query);
      const visible = matchesCategory && matchesQuery;
      card.hidden = !visible;
      if (visible) count++;
    });
    $("#emptyState").hidden = count > 0;
  }
  $("#clubSearch").addEventListener("input", filterClubs);
  $$(".filter").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    $$(".filter").forEach(item => item.classList.toggle("active", item === button));
    filterClubs();
  }));
  $("#clearFilters").addEventListener("click", () => {
    activeFilter = "all";
    $("#clubSearch").value = "";
    $$(".filter").forEach(item => item.classList.toggle("active", item.dataset.filter === "all"));
    filterClubs();
  });
  // Keyboard shortcut to focus the directory search.
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#clubSearch").focus();
      $("#clubs").scrollIntoView({behavior: "smooth"});
    }
    if (event.key === "Escape" && dialog.open) dialog.close();
  });

  $$(".card-action").forEach(button => button.addEventListener("click", () => {
    const name = button.dataset.club;
    const club = clubs[name];
    openDialog({kicker: club.kicker, title: name, text: club.text, art: club.art, action: "Close profile"});
  }));

  const storage = {
    get(key, fallback) { try { const value = localStorage.getItem(key); return value === null ? fallback : value; } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* Storage may be unavailable in private browsing. */ } }
  };
  const favouriteKey = "clubsphere-favourites";
  const themeKey = "clubsphere-theme";
  let favourites = [];
  try {
    const savedFavourites = storage.get(favouriteKey, storage.get("clubespare-favourites", "[]"));
    favourites = JSON.parse(savedFavourites);
  } catch { favourites = []; }
  if (!Array.isArray(favourites)) favourites = [];
  function paintFavourites() {
    $$("[data-favorite]").forEach(button => {
      const saved = favourites.includes(button.dataset.favorite);
      button.classList.toggle("saved", saved);
      button.textContent = saved ? "♥" : "♡";
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute("aria-label", `${saved ? "Remove" : "Save"} ${button.dataset.favorite} ${saved ? "from" : "to"} favourites`);
    });
  }
  $$("[data-favorite]").forEach(button => button.addEventListener("click", () => {
    const name = button.dataset.favorite;
    favourites = favourites.includes(name) ? favourites.filter(item => item !== name) : [...favourites, name];
    storage.set(favouriteKey, JSON.stringify(favourites));
    paintFavourites();
    notify(favourites.includes(name) ? `${name} added to your favourites` : `${name} removed from favourites`);
  }));
  paintFavourites();

  const body = document.body;
  function setTheme(theme) {
    const light = theme === "light";
    body.classList.toggle("light", light);
    $("#themeIcon").textContent = light ? "⏾" : "☀";
    $("#themeToggle").setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    storage.set(themeKey, theme);
  }
  setTheme(storage.get(themeKey, storage.get("clubespare-theme", "dark")));
  $("#themeToggle").addEventListener("click", () => {
    const next = body.classList.contains("light") ? "dark" : "light";
    setTheme(next);
    notify(`${next === "light" ? "Light" : "Dark"} theme enabled`);
  });

  const mobileMenu = $("#mobileMenu");
  const navigation = $("#navigation");
  mobileMenu.addEventListener("click", () => {
    const expanded = navigation.classList.toggle("open");
    mobileMenu.setAttribute("aria-expanded", String(expanded));
    mobileMenu.setAttribute("aria-label", expanded ? "Close navigation" : "Open navigation");
    mobileMenu.textContent = expanded ? "×" : "☰";
  });
  $$(".nav-item", navigation).forEach(link => link.addEventListener("click", () => {
    navigation.classList.remove("open");
    mobileMenu.setAttribute("aria-expanded", "false");
    mobileMenu.textContent = "☰";
  }));

  $("#signInBtn").addEventListener("click", () => openDialog({
    kicker: "STUDENT ACCOUNT", title: "Your campus life, in one place.",
    text: "Secure student sign-in will unlock your dashboard, membership requests, event registrations, notifications, and participation history.",
    callout: "Authentication is not connected yet. Before real launch, add verified student accounts, password recovery, and role-based access for students, club leaders, and college admins.",
    art: "↗", action: "Got it"
  }));
  $("#eventsExplore").addEventListener("click", () => openDialog({
    kicker: "EVENT DISCOVERY", title: "Make room for what’s next.",
    text: "The next version can show real events with dates, venues, registration rules, capacity, organizer details, and cancellation updates. Event ideas shown on this page are illustrative only.",
    callout: "Per-event registration policy: public guest registration or login-required registration. Guest registration must not create a student account or club membership.",
    art: "◷", action: "Sounds good"
  }));

  // Small entrance treatment for cards; functionality remains available if observers are unsupported.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    $$(".club-card, .event-card, .about-copy").forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(12px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
      observer.observe(el);
    });
    const style = document.createElement("style");
    style.textContent = ".in-view{opacity:1!important;transform:translateY(0)!important}";
    document.head.appendChild(style);
  }

})()

/* ==========================================
   SCROLL-BASED LOGO ROTATION

   Purpose:
   Rotates the background logo as the user
   moves down or up the page.

   Customize:
   rotationSpeed = 0.25 means 0.25 degrees
   of rotation per pixel scrolled.
========================================== */

function initScrollSpinner() {
    const spinner = document.querySelector(
        ".scroll-spinner__image"
    );

    if (!spinner) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const rotationSpeed = 0.25;

    let animationFrame = null;

    function updateSpinner() {
        animationFrame = null;

        if (prefersReducedMotion.matches) {
            spinner.style.transform = "rotate(0deg)";
            return;
        }

        const scrollPosition = window.scrollY || 0;
        const rotation = scrollPosition * rotationSpeed;

        spinner.style.transform = `rotate(${rotation}deg)`;
    }

    function requestSpinnerUpdate() {
        if (animationFrame !== null) return;

        animationFrame = requestAnimationFrame(
            updateSpinner
        );
    }

    window.addEventListener(
        "scroll",
        requestSpinnerUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestSpinnerUpdate,
        { passive: true }
    );

    prefersReducedMotion.addEventListener(
        "change",
        requestSpinnerUpdate
    );

    updateSpinner();
}

/* Initialize after the HTML has loaded. */
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initScrollSpinner
    );
} else {
    initScrollSpinner();
}

/* Cursor-driven tagline movement */
const fallText = document.querySelector(".fall-text");

if (fallText) {
    fallText.addEventListener("mousemove", (event) => {
        const rect = fallText.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        fallText.style.setProperty("--cursor-x", x.toFixed(2));
        fallText.style.setProperty("--cursor-y", y.toFixed(2));
    });

    fallText.addEventListener("mouseleave", () => {
        fallText.style.setProperty("--cursor-x", "0");
        fallText.style.setProperty("--cursor-y", "0");
    });
}

document.querySelectorAll(".metric").forEach((metric) => {
  const icon = metric.querySelector(".metric-icon");

  if (!icon) return;

  metric.addEventListener("mouseenter", () => {
    icon.style.transform = "translateY(-4px)";
    icon.style.background = "rgba(20, 184, 166, 0.22)";
    icon.style.boxShadow = "0 8px 22px rgba(20, 184, 166, 0.18)";

    const svg = icon.querySelector("svg");

    if (svg) {
      svg.style.transform = "rotate(-8deg) scale(1.12)";
    }
  });

  metric.addEventListener("mouseleave", () => {
    icon.style.transform = "translateY(0)";
    icon.style.background = "rgba(20, 184, 166, 0.12)";
    icon.style.boxShadow = "none";

    const svg = icon.querySelector("svg");

    if (svg) {
      svg.style.transform = "rotate(0deg) scale(1)";
    }
  });
});

function updateCampusStatus() {
  const pill = document.getElementById("campus-status");
  const text = document.getElementById("campus-status-text");

  if (!pill || !text) return;

  // Demo only: replace with your actual authentication system
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  pill.classList.toggle("online", isLoggedIn);
  text.textContent = isLoggedIn ? "" : "";
}

updateCampusStatus();





const spotlight = document.createElement("div");
spotlight.className = "cursor-spotlight";

const cursor = document.createElement("div");
cursor.className = "invert-cursor";

document.body.append(spotlight, cursor);

let mouseX = -100;
let mouseY = -100;
let spotlightX = mouseX;
let spotlightY = mouseY;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.querySelectorAll("a, button, .metric, [role='button']")
  .forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering");
    });
  });

function animateCursor() {
  spotlightX += (mouseX - spotlightX) * 0.10;
  spotlightY += (mouseY - spotlightY) * 0.10;

  cursorX += (mouseX - cursorX) * 0.22;
  cursorY += (mouseY - cursorY) * 0.22;

  spotlight.style.left = `${spotlightX}px`;
  spotlight.style.top = `${spotlightY}px`;

  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;

  requestAnimationFrame(animateCursor);
}

if (window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  animateCursor();
}

document.querySelectorAll(".ascii-glitch").forEach((el) => {
  const original = el.textContent;
  const chars = '!?&#&^&*!@#@$@012542345678899';
  let waves = [];
  let frame = null;
  let cursorPos = 0;
  let hovering = false;

  const duration = 1000;
  const spread = 1;

  function animate() {
    const now = performance.now();
    waves = waves.filter(w => now - w.time < duration);

    if (!waves.length) {
      el.textContent = original;
      el.classList.remove("as");
      frame = null;
      return;
    }

    const text = [...original];
    const maxDist = Math.max(original.length, 1);

    waves.forEach(w => {
      const progress = Math.min((now - w.time) / duration, 1);
      const radius = progress * (maxDist + 5) / spread;

      text.forEach((char, i) => {
        if (char === " ") return;

        const dist = Math.abs(i - w.pos);
        if (dist <= radius && radius - dist <= 3) {
          text[i] = chars[
            Math.floor(now / 40 + dist * 3) % chars.length
          ];
        }
      });
    });

    el.textContent = text.join("");
    frame = requestAnimationFrame(animate);
  }

  function addWave(event) {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    cursorPos = Math.max(
      0,
      Math.min(
        original.length - 1,
        Math.round((x / rect.width) * original.length)
      )
    );

    waves.push({ pos: cursorPos, time: performance.now() });
    if (waves.length > 8) waves.shift();

    el.classList.add("as");
    if (frame === null) frame = requestAnimationFrame(animate);
  }

  el.addEventListener("mouseenter", event => {
    hovering = true;
    addWave(event);
  });

  el.addEventListener("mousemove", event => {
    if (!hovering) return;
    addWave(event);
  });

  el.addEventListener("mouseleave", () => {
    hovering = false;
  });
});


// effect 2
document.querySelectorAll(".ascii-glitchn").forEach((el) => {
  const original = el.textContent;
  const chars = '!?&#&^&*!@#@$@012542345678899';
  let waves = [];
  let frame = null;
  let cursorPos = 0;
  let hovering = false;

  const duration = 1000;
  const spread = 1;

  function animate() {
    const now = performance.now();
    waves = waves.filter(w => now - w.time < duration);

    if (!waves.length) {
      el.textContent = original;
      el.classList.remove("as");
      frame = null;
      return;
    }

    const text = [...original];
    const maxDist = Math.max(original.length, 1);

    waves.forEach(w => {
      const progress = Math.min((now - w.time) / duration, 1);
      const radius = progress * (maxDist + 5) / spread;

      text.forEach((char, i) => {
        if (char === " ") return;

        const dist = Math.abs(i - w.pos);
        if (dist <= radius && radius - dist <= 3) {
          text[i] = chars[
            Math.floor(now / 40 + dist * 3) % chars.length
          ];
        }
      });
    });

    el.textContent = text.join("");
    frame = requestAnimationFrame(animate);
  }

  function addWave(event) {
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    cursorPos = Math.max(
      0,
      Math.min(
        original.length - 1,
        Math.round((x / rect.width) * original.length)
      )
    );

    waves.push({ pos: cursorPos, time: performance.now() });
    if (waves.length > 8) waves.shift();

    el.classList.add("as");
    if (frame === null) frame = requestAnimationFrame(animate);
  }

  el.addEventListener("mouseenter", event => {
    hovering = true;
    addWave(event);
  });

  el.addEventListener("mousemove", event => {
    if (!hovering) return;
    addWave(event);
  });

  el.addEventListener("mouseleave", () => {
    hovering = false;
  });
});
// button style 

document.querySelectorAll(".creepy-button").forEach((button) => {
  const eyes = button.querySelectorAll(".creepy-eye");

  button.addEventListener("pointermove", (event) => {
    eyes.forEach((eye) => {
      const pupil = eye.querySelector(".creepy-pupil");
      const rect = eye.getBoundingClientRect();

      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);

      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy) / 12, 3);

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      pupil.style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  });

  button.addEventListener("pointerleave", () => {
    button.querySelectorAll(".creepy-pupil").forEach((pupil) => {
      pupil.style.transform = "translate(-50%, -50%)";
    });
  });
});



document.querySelectorAll(".stagger-text").forEach((paragraph) => {
  // Preserve the original sentence
  const text = paragraph.textContent.trim();
  const words = text.split(/\s+/);

  // Keep the complete sentence accessible to screen readers
  paragraph.setAttribute("aria-label", text);
  paragraph.setAttribute("role", "text");

  // Create an animated span for each word
  paragraph.innerHTML = "";

  words.forEach((word, index) => {
    const span = document.createElement("span");

    span.className = "stagger-word";
    span.textContent = word;

    // Each word starts 70ms after the previous word
    span.style.setProperty("--delay", `${index * 70}ms`);
    span.setAttribute("aria-hidden", "true");

    paragraph.appendChild(span);

    // Preserve normal spaces between words
    if (index < words.length - 1) {
      paragraph.appendChild(document.createTextNode(" "));
    }
  });
});





