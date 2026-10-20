(() => {
  const overlay = document.getElementById("khelOverlay");
  const openButton = document.getElementById("openKhelBook");
  const profileModal = document.getElementById("profileModal");
  const profileImage = document.getElementById("profileImage");
  const profileName = document.getElementById("profileName");
  const profileRole = document.getElementById("profileRole");
  const profileIndex = document.getElementById("profileIndex");
  const profileNext = document.getElementById("profileNext");
  const cards = [...document.querySelectorAll(".roster-card")];
  let previousFocus = null;
  let activeProfile = 0;
  const people = cards.map((card, i) => ({
    name: card.dataset.name,
    role: card.dataset.role,
    image: card.querySelector("img").getAttribute("src"),
    index: i + 1
  }));

  function lockScroll(on) { document.body.style.overflow = on ? "hidden" : ""; }
  function openBook() {
    if (!overlay) return;
    previousFocus = document.activeElement;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    lockScroll(true);
    overlay.querySelector(".close-book")?.focus();
  }
  function closeBook() {
    overlay?.classList.remove("is-open");
    overlay?.setAttribute("aria-hidden", "true");
    if (!profileModal?.classList.contains("is-open")) lockScroll(false);
    previousFocus?.focus?.();
  }
  function openProfile(index) {
    activeProfile = (index + people.length) % people.length;
    const person = people[activeProfile];
    if (!person || !profileModal) return;
    profileImage.src = person.image;
    profileImage.alt = person.name;
    profileName.textContent = person.name;
    profileRole.textContent = person.role;
    profileIndex.textContent = `PLAYER / ${String(person.index).padStart(2, "0")}`;
    profileModal.classList.add("is-open");
    profileModal.setAttribute("aria-hidden", "false");
    lockScroll(true);
    profileModal.querySelector(".profile-close")?.focus();
  }
  function closeProfile() {
    profileModal?.classList.remove("is-open");
    profileModal?.setAttribute("aria-hidden", "true");
    if (!overlay?.classList.contains("is-open")) lockScroll(false);
  }
  openButton?.addEventListener("click", openBook);
  overlay?.querySelectorAll("[data-close-khel]").forEach(el => el.addEventListener("click", closeBook));
  profileModal?.querySelectorAll("[data-close-profile]").forEach(el => el.addEventListener("click", closeProfile));
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 55}ms`;
    card.addEventListener("click", () => openProfile(index));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openProfile(index); } });
  });
  document.querySelectorAll(".book-person").forEach(button => {
    button.addEventListener("click", () => {
      closeBook();
      openProfile(Number(button.dataset.person));
    });
  });
  profileNext?.addEventListener("click", () => openProfile(activeProfile + 1));

  // Search and category filtering work together.
  let currentFilter = "all";
  const search = document.getElementById("memberSearch");
  const empty = document.getElementById("emptyState");
  function applyFilters() {
    const q = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matchesGroup = currentFilter === "all" || card.dataset.group === currentFilter;
      const matchesSearch = `${card.dataset.name} ${card.dataset.role}`.toLowerCase().includes(q);
      const show = matchesGroup && matchesSearch;
      card.hidden = !show;
      if (show) visible++;
    });
    if (empty) empty.hidden = visible !== 0;
  }
  search?.addEventListener("input", applyFilters);
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.toggle("is-active", t === tab));
      currentFilter = tab.dataset.filter;
      applyFilters();
    });
  });
  document.getElementById("topLink")?.addEventListener("click", e => { e.preventDefault(); window.scrollTo({top:0,behavior:"smooth"}); });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (profileModal?.classList.contains("is-open")) closeProfile();
      else if (overlay?.classList.contains("is-open")) closeBook();
    }
  });

  // ClubSphere integration: put data-club="khel" on the outermost KHEL card.
  // In the main website, copy the overlay/profile markup and load this script after it.
  document.addEventListener("click", e => {
    const clubCard = e.target.closest('[data-club="khel"]');
    if (!clubCard || !overlay) return;
    if (e.target.closest("a,button,input,[data-no-khel-open]")) return;
    e.preventDefault();
    openBook();
  });
  window.openKhelHangingBook = openBook;
  window.closeKhelHangingBook = closeBook;
})();
