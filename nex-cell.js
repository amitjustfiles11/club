const members = [
  {name:"Jiya Kaushik", role:"President", group:"Leadership", photo:"assets/jiya-kaushik.jpg",
   quote:"I've always believed the best ideas start with people who are willing to try. As President of NEX-CELL, I want to build a space where creativity feels limitless and ideas turn into action. I enjoy creating experiences that people remember, not just events they attend. For me, leadership is about inspiring people to believe in themselves before anything else."},
  {name:"Akshita Saxena", role:"Vice President", group:"Leadership", photo:"assets/akshita-saxena.jpg",
   quote:"I believe every great venture starts with one brave decision to just begin. As Vice President, my job is to make sure this club feels less like a meeting and more like a movement. Big ideas, bold moves, and the right people around you — that's what this club is all about. Come as you are. Leave with a purpose."},
  {name:"Anuj Sonkar", role:"Treasurer", group:"Leadership", photo:"assets/anuj-sonkar.jpg",
   quote:"Strong ideas need thoughtful planning and responsible decisions. As Treasurer, I help keep our ambitions grounded, our resources purposeful, and our next big step within reach."},
  {name:"Tejas Dadhich", role:"Developer Head", group:"Tech Team", photo:"assets/tejas-dadhich.jpg",
   quote:"Technology gives ideas a way to become real. As Developer Head, I want to build useful experiences, explore new tools, and turn ambitious concepts into things people can use."},
  {name:"Anushka", role:"Design and Creative Head", group:"Design Team", photo:"assets/anushka.jpg",
   quote:"Every idea deserves a thoughtful expression. I bring creativity, visual storytelling, and design thinking together to help NEX-CELL make its ideas memorable."},
  {name:"Mayank Rajput", role:"Core Member", group:"Core Team", photo:"assets/mayank-rajput.jpg",
   quote:"Great communities are built by people who keep showing up, sharing ideas, and helping each other grow. I'm excited to contribute to the energy and ambition that make NEX-CELL special."}
];
let current = 0;
const $ = id => document.getElementById(id);
const photo = $("memberPhoto");
const panel = $("memberPanel");
const dots = $("memberDots");

function renderMember(index) {
  current = (index + members.length) % members.length;
  const m = members[current];
  panel.classList.remove("is-changing");
  void panel.offsetWidth;
  photo.src = m.photo;
  photo.alt = m.name;
  $("memberName").textContent = m.name;
  $("memberRole").textContent = m.role.toUpperCase();
  $("memberPill").textContent = m.group.toUpperCase();
  $("memberIndex").textContent = String(current + 1).padStart(2, "0");
  $("memberQuote").textContent = m.quote;
  $("memberCredit").textContent = `— ${m.name}, ${m.role}`;
  $("pageCount").textContent = `${String(current + 1).padStart(2, "0")} — ${String(members.length).padStart(2, "0")}`;
  [...dots.children].forEach((dot, i) => {
    dot.classList.toggle("active", i === current);
    dot.setAttribute("aria-current", i === current ? "true" : "false");
  });
  panel.classList.add("is-changing");
}
members.forEach((m, i) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Show ${m.name}`);
  dot.addEventListener("click", () => renderMember(i));
  dots.appendChild(dot);
});
$("prevMember").addEventListener("click", () => renderMember(current - 1));
$("nextMember").addEventListener("click", () => renderMember(current + 1));
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") renderMember(current - 1);
  if (e.key === "ArrowRight") renderMember(current + 1);
  if (e.key === "Escape" && window.parent !== window) {
    window.parent.postMessage({type:"CLUBSPHERE_CLOSE_NEX_CELL"}, window.location.origin);
  }
});

// Simple touch swipe support for phones.
let touchStartX = 0;
panel.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; }, {passive:true});
panel.addEventListener("touchend", e => {
  const delta = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(delta) > 50) renderMember(current + (delta < 0 ? 1 : -1));
}, {passive:true});
