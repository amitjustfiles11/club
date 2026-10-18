/* MALHAR team profiles. Add verified social URLs in the member objects below. */
const members = [
 {name:"Sapna Singh",position:"President",year:"2nd Year",role:"President leading MALHAR cultural initiatives at Mirai.",photo:"assets/sapna-singh.png",alt:"Sapna Singh, MALHAR President",instagram:"",linkedin:""},
 {name:"Kiran Sinha",position:"Vice President",year:"2nd Year",role:"Vice President leading MALHAR cultural initiatives at Mirai.",photo:"assets/kiran-sinha.png",alt:"Kiran Sinha, MALHAR Vice President",instagram:"",linkedin:""},
 {name:"Anshika",position:"Treasurer",year:"2nd Year",role:"Treasurer managing MALHAR club coordination and cultural activities at Mirai.",photo:"assets/anshika.png",alt:"Anshika, MALHAR Treasurer",instagram:"",linkedin:""},
 {name:"Dhruv Tomar",position:"Media Head",year:"2nd Year",role:"Media Head capturing and sharing MALHAR cultural initiatives at Mirai.",photo:"assets/dhruv-tomar.png",alt:"Dhruv Tomar, MALHAR Media Head",instagram:"",linkedin:""}
];
const hang=document.getElementById("hang"),photo=document.getElementById("photo"),nameEl=document.getElementById("name"),roleEl=document.getElementById("role"),positionBadge=document.getElementById("positionBadge"),yearBadge=document.getElementById("yearBadge"),currentIndex=document.getElementById("currentIndex"),instagramLink=document.getElementById("instagramLink"),linkedinLink=document.getElementById("linkedinLink"),dotsWrap=document.getElementById("memberDots");
let index=0;
function setSocialLink(anchor,url){
 if(url && /^https:\/\/(www\.)?(instagram\.com|linkedin\.com)\//i.test(url)){anchor.href=url;anchor.style.display="flex";}
 else{anchor.removeAttribute("href");anchor.style.display="none";anchor.setAttribute("aria-disabled","true");}
}
function showMember(nextIndex){
 index=(nextIndex+members.length)%members.length;const m=members[index];
 photo.src=m.photo;photo.alt=m.alt;nameEl.textContent=m.name;roleEl.textContent=m.role;positionBadge.textContent=m.position;yearBadge.textContent=m.year;currentIndex.textContent=String(index+1).padStart(2,"0");
 setSocialLink(instagramLink,m.instagram);setSocialLink(linkedinLink,m.linkedin);
 [...dotsWrap.children].forEach((dot,i)=>{dot.classList.toggle("active",i===index);dot.setAttribute("aria-pressed",String(i===index));});
 if(hang.animate)hang.animate([{opacity:.65,scale:.985},{opacity:1,scale:1}],{duration:260,easing:"cubic-bezier(.2,.8,.2,1)"});
}
members.forEach((m,i)=>{const dot=document.createElement("button");dot.type="button";dot.className="member-dot"+(i===0?" active":"");dot.setAttribute("aria-label","Show "+m.name);dot.setAttribute("aria-pressed",String(i===0));dot.addEventListener("click",()=>showMember(i));dotsWrap.appendChild(dot);});
document.getElementById("prev").addEventListener("click",()=>showMember(index-1));document.getElementById("next").addEventListener("click",()=>showMember(index+1));
document.addEventListener("keydown",e=>{if(e.key==="ArrowLeft")showMember(index-1);if(e.key==="ArrowRight")showMember(index+1);});
let dragging=false,startX=0,startRotation=0,lastX=0,lastTime=0,velocity=0,rotation=0,animationFrame=null;
function setRotation(v){rotation=Math.max(-22,Math.min(22,v));hang.style.transform=`rotate(${rotation}deg)`;}
hang.addEventListener("pointerdown",e=>{if(e.target.closest("a,button"))return;dragging=true;hang.style.animationPlayState="paused";startX=e.clientX;startRotation=rotation;lastX=e.clientX;lastTime=performance.now();velocity=0;if(animationFrame)cancelAnimationFrame(animationFrame);hang.setPointerCapture(e.pointerId);});
hang.addEventListener("pointermove",e=>{if(!dragging)return;const now=performance.now(),dt=Math.max(1,now-lastTime);velocity=(e.clientX-lastX)/dt;lastX=e.clientX;lastTime=now;setRotation(startRotation+(e.clientX-startX)*.22);});
function releaseSwing(){if(!dragging)return;dragging=false;let v=velocity*5;const tick=()=>{v+=(-rotation*.045)-(v*.09);setRotation(rotation+v);if(Math.abs(rotation)<.15&&Math.abs(v)<.15){setRotation(0);hang.style.transform="";hang.style.animationPlayState="running";animationFrame=null;return;}animationFrame=requestAnimationFrame(tick);};animationFrame=requestAnimationFrame(tick);}
hang.addEventListener("pointerup",releaseSwing);hang.addEventListener("pointercancel",releaseSwing);hang.addEventListener("lostpointercapture",()=>{if(dragging)releaseSwing();});
showMember(0);
