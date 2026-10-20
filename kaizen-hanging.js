(() => {
  "use strict";

  const book = document.getElementById("khBook");
  const closeButton = document.getElementById("khClose");
  const stage = document.querySelector(".kaizen-stage");
  const embedded = window.parent !== window;

  function closeBook() {
    if (embedded) {
      window.parent.postMessage({ type: "CLUBSPHERE_CLOSE_KAIZEN" }, "*");
      return;
    }

    if (history.length > 1) {
      history.back();
      return;
    }

    stage.hidden = true;
  }

  closeButton.addEventListener("click", closeBook);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeBook();
  });

  let startX = 0;
  let dragging = false;

  book.addEventListener("pointerdown", event => {
    if (event.target.closest("button")) return;
    dragging = true;
    startX = event.clientX;
    book.classList.add("kh-dragging");
    book.setPointerCapture(event.pointerId);
  });

  book.addEventListener("pointermove", event => {
    if (!dragging) return;
    const rotation = Math.max(-9, Math.min(9, (event.clientX - startX) * 0.055));
    book.style.transform = `rotate(${rotation}deg)`;
  });

  function releaseSwing() {
    if (!dragging) return;
    dragging = false;
    book.classList.remove("kh-dragging");
    book.style.transform = "";
  }

  book.addEventListener("pointerup", releaseSwing);
  book.addEventListener("pointercancel", releaseSwing);
})();
