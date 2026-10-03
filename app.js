
const $ = s => document.querySelector(s);
const data = window.COURSE_DATA || {lectures:[], labs:[]};

function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

function renderLectures(filter=""){
  const q=filter.trim().toLowerCase();
  const items=data.lectures.filter(x=>(x.title+" "+x.fullTitle).toLowerCase().includes(q));
  $("#lectureGrid").innerHTML=items.map(x=>`
    <article class="lecture-card" data-id="${x.id}" tabindex="0">
      <div class="numtag">ДӘРІС ${String(x.number).padStart(2,"0")}</div>
      <h3>${esc(x.title)}</h3>
      <div class="card-arrow">→</div>
    </article>`).join("") || `<div class="reader-empty">Бұл атаумен бөлім табылмады.</div>`;
  document.querySelectorAll(".lecture-card").forEach(c=>{
    c.onclick=()=>openReader("lecture",c.dataset.id);
    c.onkeydown=e=>{if(e.key==="Enter") c.click()};
  });
}
function renderLabs(){
  $("#labGrid").innerHTML=data.labs.map(x=>`
    <article class="lab-card" data-id="${x.id}" tabindex="0">
      <div class="numtag">LAB ${String(x.number).padStart(2,"0")}</div>
      <h3>${esc(x.title)}</h3>
      <div class="lab-meta">Практикалық бөлімді ашу →</div>
    </article>`).join("");
  document.querySelectorAll(".lab-card").forEach(c=>{
    c.onclick=()=>openReader("lab",c.dataset.id);
    c.onkeydown=e=>{if(e.key==="Enter") c.click()};
  });
}
function openReader(type,id){
  const arr=type==="lecture"?data.lectures:data.labs;
  const x=arr.find(v=>v.id===id); if(!x)return;
  const label=type==="lecture"?`ДӘРІС ${String(x.number).padStart(2,"0")}`:`LAB ${String(x.number).padStart(2,"0")}`;
  $("#readerContent").innerHTML=`
    <article class="reader">
      <div class="reader-head">
        <div class="numtag">${label}</div>
        <h2>${esc(x.title)}</h2>
        <p>Найзағараева А.А. материалдары негізінде</p>
      </div>
      <div class="reader-body">${esc(x.text || "Бұл бөлімнің толық мәтіні файлдан автоматты түрде бөлініп алынбады. Негізгі тақырып сақталған.")}</div>
    </article>`;
  location.hash="reader";
  window.scrollTo({top:$("#reader").offsetTop-90,behavior:"smooth"});
}
$("#searchInput").addEventListener("input",e=>renderLectures(e.target.value));
$("#runCode").onclick=()=>{
  const code=$("#codeEditor").value;
  const out=$("#runResult");
  if(/cout\s*<<[\s\S]*Hello,\s*C\+\+!/i.test(code)) {out.textContent="✓ Тексеру сәтті: Hello, C++! табылды";out.style.color="var(--accent)";}
  else if(/cout\s*<</.test(code)){out.textContent="✓ cout қолданылған. Код логикасын компиляторда тексеруге болады.";out.style.color="var(--accent)";}
  else {out.textContent="! cout << арқылы мәтін шығаруды қосып көр.";out.style.color="var(--danger)";}
};
$("#resetCode").onclick=()=>$("#codeEditor").value=`#include <iostream>
using namespace std;

int main() {
    cout << "Hello, C++!";
    return 0;
}`;
$("#themeBtn").onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("cpp-theme",document.body.classList.contains("light")?"light":"dark")};
if(localStorage.getItem("cpp-theme")==="light")document.body.classList.add("light");
renderLectures();renderLabs();

// If a URL contains #lecture-7 / #lab-4, open it directly.
window.addEventListener("load",()=>{
  const h=location.hash;
  if(h.startsWith("#lecture-")) openReader("lecture",h.slice(1));
  if(h.startsWith("#lab-")) openReader("lab",h.slice(1));
});
