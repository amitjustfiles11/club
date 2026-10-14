/* ---------------------------------------------------------
   1. YOUR PEOPLE  (edit this list)
   photo: path to the image file. If it fails to load,
   a coloured avatar with initials is shown instead.
--------------------------------------------------------- */
const people = [
  { name: "Aarav Sharma", role: "Founder",       photo: "images/aarav.jpg", c1: "#ff9a8b", c2: "#ff3366", initials: "AS" },
  { name: "Meera Iyer",   role: "Lead Designer", photo: "images/meera.jpg", c1: "#a1c4fd", c2: "#5b6cff", initials: "MI" },
  { name: "Rohan Das",    role: "Developer",     photo: "images/rohan.jpg", c1: "#84fab0", c2: "#12a384", initials: "RD" }
];

const photoBox = document.getElementById("photo");
const nameEl   = document.getElementById("name");
const roleEl   = document.getElementById("role");
let index = 0;

function avatar(p) {
  return `<svg viewBox="0 0 100 100" role="img" aria-label="${p.name}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.c1}"/><stop offset="1" stop-color="${p.c2}"/>
    </linearGradient></defs>
    <rect width="100" height="100" fill="url(#g)"/>
    <text x="50" y="60" text-anchor="middle" font-size="34"
          font-family="Georgia,serif" fill="#fff" font-weight="700">${p.initials}</text>
  </svg>`;
}

function showPerson() {
  const p = people[index];
  photoBox.innerHTML = "";
  const img = new Image();
  img.alt = `${p.name}, ${p.role}`;
  img.draggable = false;
  img.onerror = () => { photoBox.innerHTML = avatar(p); };
  img.src = p.photo;
  photoBox.appendChild(img);
  nameEl.textContent = p.name;
  roleEl.textContent = p.role;
}
showPerson();

/* ---------------------------------------------------------
   2. SWING PHYSICS  (pendulum)
--------------------------------------------------------- */
const hang = document.getElementById("hang");
const pin  = document.getElementById("pin");

const STIFFNESS = 22;   // higher = swings faster
const DAMPING   = 0.55; // higher = stops sooner

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let angle = reduceMotion ? 0 : 0.5; // starting swing (radians)
let velocity = 0;
let dragging = false;
let lastAngle = 0;
let lastTime = 0;
let prevFrame = performance.now();

function pivotPoint() {
  const r = pin.getBoundingClientRect();
  return [r.left, r.top];
}

/* ---------------------------------------------------------
   3. DRAG WITH MOUSE OR FINGER
--------------------------------------------------------- */
hang.addEventListener("pointerdown", (e) => {
  dragging = true;
  hang.classList.add("drag");
  hang.setPointerCapture(e.pointerId);
  lastAngle = angle;
  lastTime = performance.now();
  velocity = 0;
});

hang.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const [px, py] = pivotPoint();

  let newAngle = Math.atan2(-(e.clientX - px), Math.max(40, e.clientY - py));
  newAngle = Math.max(-1.3, Math.min(1.3, newAngle)); // max tilt

  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  if (dt > 0) {
    // smooth the release speed
    velocity = velocity * 0.6 + ((newAngle - lastAngle) / dt) * 0.4;
  }

  angle = newAngle;
  lastAngle = newAngle;
  lastTime = now;
});

function stopDrag() {
  if (!dragging) return;
  dragging = false;
  hang.classList.remove("drag");
  velocity = Math.max(-8, Math.min(8, velocity)); // limit throw speed
}
hang.addEventListener("pointerup", stopDrag);
hang.addEventListener("pointercancel", stopDrag);

/* ---------------------------------------------------------
   4. PREV / NEXT BUTTONS
--------------------------------------------------------- */
function kick(direction) { velocity += direction * 5; }

document.getElementById("next").addEventListener("click", () => {
  index = (index + 1) % people.length;
  showPerson();
  kick(1);
});

document.getElementById("prev").addEventListener("click", () => {
  index = (index - 1 + people.length) % people.length;
  showPerson();
  kick(-1);
});

/* ---------------------------------------------------------
   5. ANIMATION LOOP
--------------------------------------------------------- */
function loop(now) {
  const dt = Math.min(0.033, (now - prevFrame) / 1000);
  prevFrame = now;

  if (!dragging) {
    const acceleration = -STIFFNESS * Math.sin(angle) - DAMPING * velocity;
    velocity += acceleration * dt;
    angle += velocity * dt;
  }

  hang.style.transform = `rotate(${angle}rad)`;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
