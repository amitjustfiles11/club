/*
  CLUBSPHERE KAIZEN HANGING-BOOK INTEGRATION
  1. Copy the entire `kaizen-hanging` folder into your website project.
  2. Add this script after your existing script.js (or paste the code into it).
  3. Add the CSS link shown in README.md to your index.html.
  4. A club card can opt in using data-club="kaizen". The script also detects
     a clickable club card whose visible text includes KAIZEN.
*/
(() => {
  if (document.getElementById('kaizenBookOverlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'kaizenBookOverlay';
  overlay.className = 'kh-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="kh-overlay-backdrop" data-kh-close></div>
    <section class="kh-overlay-panel" role="dialog" aria-modal="true" aria-label="KAIZEN members">
      <button class="kh-overlay-close" type="button" aria-label="Close KAIZEN member book" data-kh-close>×</button>
      <iframe class="kh-overlay-frame" title="KAIZEN hanging member book" src="kaizen-hanging/kaizen-hanging.html"></iframe>
    </section>`;
  document.body.appendChild(overlay);

  const openBook = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('kh-overlay-open');
  };
  const closeBook = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('kh-overlay-open');
  };
  overlay.querySelectorAll('[data-kh-close]').forEach(button => button.addEventListener('click', closeBook));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) closeBook();
  });
  window.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLUBSPHERE_CLOSE_KAIZEN') closeBook();
  });

  // Preferred: add data-club="kaizen" to the KAIZEN card/button.
  // Fallback: find clickable cards/buttons whose text mentions KAIZEN.
  document.addEventListener('click', event => {
    const target = event.target.closest('[data-club="kaizen"], [data-club="KAIZEN"], .club-card, .club-card button, .club-card a, button, a, [role="button"]');
    if (!target) return;
    const explicit = target.matches('[data-club="kaizen"], [data-club="KAIZEN"]') ||
      target.closest('[data-club="kaizen"], [data-club="KAIZEN"]');
    const text = (target.innerText || target.textContent || '').trim();
    if (explicit || (/\bKAIZEN\b/i.test(text) && (target.matches('.club-card, button, a, [role="button"]') || target.closest('.club-card')))) {
      event.preventDefault();
      openBook();
    }
  });
})();
