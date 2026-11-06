import { SceneEngine } from "./scene-engine.js";

const $ = (id) => document.getElementById(id);

const STORAGE_KEY = "zero_house_phase1_save_v1";
const SCENE_COMPLETE_KEY = "zero_house_scene1_complete_v1";

const sceneEngine = new SceneEngine({
  scene: $("scene-art"),
  caption: $("location-caption"),
  portraits: { man: $("portrait-man"), chief: $("portrait-chief"), daichi: $("portrait-daichi") }
});

const lines = [
  { speaker:"UNKNOWN MAN", role:"man", text:"Please... you have to listen to me. I'm going to die tonight." },
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"Calm down. What exactly are you saying? Who is going to kill you?" },
  { speaker:"UNKNOWN MAN", role:"man", text:"Someone is coming. I know they're coming for me. I won't make it through the night." },
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"You're telling us someone is going to kill you, but you don't know who?" },
  { speaker:"UNKNOWN MAN", role:"man", text:"I received a message. Please... look at this." , action:"evidence"},
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"ZERO HOUSE? I've never heard of it." },
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"I've searched the internet and the dark web. There's nothing useful. No trace of this organization." , action:"search"},
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"This sounds like illegal lending. People borrow money from these lenders and then come to us when they can't repay." },
  { speaker:"DAICHI", role:"daichi", text:"Sir, something about this doesn't feel right. We shouldn't dismiss it so casually." },
  { speaker:"UNKNOWN MAN", role:"man", text:"Please. Just place someone near my apartment for tonight. Bring me back here tomorrow morning. That's all I'm asking." },
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"We can't assign an officer to stand outside your apartment all night. You should leave." },
  { speaker:"UNKNOWN MAN", role:"man", text:"But—" },
  { speaker:"HEAD POLICE OFFICER", role:"chief", text:"That's enough. You may go." }
];

let index = 0;
let history = [];
let evidenceSeen = false;
let searchShown = false;
let toastTimer;

function showToast(message){
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>el.classList.remove("show"), 2100);
}

function renderLine(){
  if(index >= lines.length){ finishScene(); return; }
  const line = lines[index];
  $("speaker-name").textContent = line.speaker;
  $("dialogue-text").textContent = line.text;
  $("dialogue-count").textContent = `${String(index+1).padStart(2,"0")} — ${String(lines.length).padStart(2,"0")}`;
  $("progress-bar").style.width = `${((index+1)/lines.length)*100}%`;
  sceneEngine.present(line, index);
  $("skip-button").classList.toggle("hidden", !isSceneCompleted());
  $("next-button").innerHTML = line.action === "evidence" && !evidenceSeen
    ? 'EXAMINE MESSAGE <span>↗</span>'
    : 'CONTINUE <span>↓</span>';
  saveGame();
}

function advance(){
  if(index >= lines.length){ finishScene(); return; }
  const line = lines[index];
  history.push({speaker:line.speaker,text:line.text});
  if(line.action === "evidence" && !evidenceSeen){
    $("evidence-overlay").classList.remove("hidden");
    return;
  }
  if(line.action === "search" && !searchShown){
    searchShown = true;
    showToast("SEARCH COMPLETE · NO RECORDS FOUND");
  }
  index++;
  renderLine();
}

function closeEvidence(){
  evidenceSeen = true;
  $("evidence-overlay").classList.add("hidden");
  index++;
  renderLine();
  showToast("EVIDENCE LOGGED · MESSAGE 01");
}

function finishScene(){
  $("chapter-end").classList.remove("hidden");
  localStorage.setItem(SCENE_COMPLETE_KEY, "true");
  localStorage.setItem(STORAGE_KEY, JSON.stringify({index:lines.length,history,evidenceSeen:true,complete:true}));
}

function startGame(saved=false){
  $("title-screen").classList.add("hidden");
  $("story-screen").classList.remove("hidden");
  $("chapter-end").classList.add("hidden");
  if(saved){
    const data = readSave();
    if(data){
      index = Math.min(data.index || 0, lines.length);
      history = data.history || [];
      evidenceSeen = !!data.evidenceSeen;
      searchShown = index > 7;
    }
  } else {
    index = 0; history = []; evidenceSeen = false; searchShown = false;
    saveGame();
  }
  $("evidence-overlay").classList.add("hidden");
  $("history-overlay").classList.add("hidden");
  sceneEngine.reset();
  renderLine();
}

function isSceneCompleted(){ return localStorage.getItem(SCENE_COMPLETE_KEY) === "true"; }

function readSave(){
  try{return JSON.parse(localStorage.getItem(STORAGE_KEY));}catch{return null;}
}
function saveGame(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify({index,history,evidenceSeen,complete:false}));
}
function updateContinue(){
  const save = readSave();
  $("continue-game").style.opacity = save && (save.index>0 || save.complete) ? "1" : ".35";
  $("continue-game").disabled = !(save && (save.index>0 || save.complete));
}
function showHistory(){
  const list = $("history-list");
  list.innerHTML = "";
  if(!history.length){
    list.innerHTML = '<p class="evidence-note">No dialogue recorded yet.</p>';
  } else {
    history.forEach(item=>{
      const row = document.createElement("div");
      row.className = "history-entry";
      const name = document.createElement("strong");
      name.textContent = item.speaker;
      const text = document.createElement("p");
      text.textContent = item.text;
      row.append(name,text);
      list.append(row);
    });
  }
  $("history-overlay").classList.remove("hidden");
}

$("new-game").addEventListener("click",()=>startGame(false));
$("continue-game").addEventListener("click",()=>startGame(true));
$("next-button").addEventListener("click",advance);
$("evidence-confirm").addEventListener("click",closeEvidence);
$("close-evidence").addEventListener("click",closeEvidence);
$("history-button").addEventListener("click",showHistory);
$("close-history").addEventListener("click",()=>$("history-overlay").classList.add("hidden"));
$("skip-button").addEventListener("click",()=>{
  if(!isSceneCompleted()) return;
  history.push(...lines.slice(index).map(line=>({speaker:line.speaker,text:line.text})));
  index=lines.length;
  evidenceSeen=true;
  saveGame();
  finishScene();
});
$("back-title").addEventListener("click",()=>{
  saveGame();
  $("story-screen").classList.add("hidden");
  $("title-screen").classList.remove("hidden");
  updateContinue();
});
$("return-title-end").addEventListener("click",()=>{
  $("chapter-end").classList.add("hidden");
  $("story-screen").classList.add("hidden");
  $("title-screen").classList.remove("hidden");
  localStorage.setItem(STORAGE_KEY,JSON.stringify({index:0,history:[],evidenceSeen:false,complete:true}));
  updateContinue();
});

document.addEventListener("keydown",(event)=>{
  if(event.key==="Escape"){
    $("evidence-overlay").classList.add("hidden");
    $("history-overlay").classList.add("hidden");
  }
  if(event.key===" " || event.key==="Enter"){
    if(!$("story-screen").classList.contains("hidden") &&
       $("evidence-overlay").classList.contains("hidden") &&
       $("history-overlay").classList.contains("hidden") &&
       $("chapter-end").classList.contains("hidden")){
      event.preventDefault(); advance();
    }
  }
});

updateContinue();
