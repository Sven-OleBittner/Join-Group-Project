/**
 * Contact data array
 * @type {Array<{initials: string, name: string}>}
 */
const contacts = [
  {initials:"SM",name:"Sofia Müller (You)"},
  {initials:"AM",name:"Anton Mayer"},
  {initials:"AS",name:"Anja Schulz"},
  {initials:"BZ",name:"Benedikt Ziegler"},
  {initials:"DE",name:"David Eisenberg"},
  {initials:"EF",name:"Eva Fischer"},
  {initials:"EM",name:"Emmanuel Mauer"},
  {initials:"MB",name:"Marcel Bauer"},
  {initials:"TW",name:"Tatjana Wolf"}
];


/**
 * Icon paths configuration
 * @type {Object}
 */
const ICONS = {
  prio:{
    low:["./assets/img/green_low_urgent.svg","./assets/icons/green_low_urgent.svg"],
    medium:["./assets/img/Prio media.svg","./assets/icons/Prio media.svg"],
    high:["./assets/img/red_high_urgent.svg","./assets/icons/red_high_urgent.svg"]
  }
};


/**
 * Sets image source with fallback
 * @param {HTMLImageElement} img - Image element
 * @param {string[]} srcs - Array of source paths
 */
function setIconWithFallback(img,srcs){
  if(!img || !srcs?.length) return;
  let i=0;
  img.onerror = () => i+1 < srcs.length ? img.src = srcs[++i] : img.remove();
  img.src = srcs[0];
}


/**
 * Checks if element is interactive
 * @param {Element} el - Element to check
 * @returns {boolean}
 */
function isInteractive(el){
  return el instanceof Element &&
         !!el.closest("button,a,input,textarea,select,[data-interactive]");
}


/**
 * Checks if viewport is desktop
 * @returns {boolean}
 */
function isDesktop(){ 
  return matchMedia("(min-width:1024px)").matches; 
}


/**
 * Converts MM/DD/YYYY to ISO format
 * @param {string} s - Date string
 * @returns {string}
 */
function mmddyyyyToISO(s){
  if(!s) return "";
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if(!m) return s;
  const [,mm,dd,yyyy] = m;
  return `${yyyy}-${mm}-${dd}`;
}


/**
 * Converts ISO to MM/DD/YYYY format
 * @param {string} s - ISO date string
 * @returns {string}
 */
function isoToMMDDYYYY(s){
  if(!s) return "";
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m) return s;
  const [,yyyy,mm,dd] = m;
  return `${mm}/${dd}/${yyyy}`;
}


/**
 * Opens add task modal based on viewport
 */
function openAddTaskView(){
  if(isDesktop() && window.openAddTaskPopup) openAddTaskPopup();
  else triggerAddTaskPopup();
}


/**
 * Renders avatar circles in cards
 */
function renderAvatars(){
  document.querySelectorAll(".kb-avatars").forEach(b=>{
    const list=(b.getAttribute("data-assignees")||"").split(",")
      .map(v=>v.trim()).filter(Boolean);
    b.innerHTML="";
    list.forEach(i=>{
      const p=contacts.find(c=>c.initials===i); 
      if(!p) return;
      const e=document.createElement("div");
      e.className="kb-avatar kb-avatar--"+i; 
      e.textContent=i;
      e.title=p.name; 
      e.setAttribute("aria-label",p.name); 
      b.appendChild(e);
    });
  });
}


/**
 * Binds click events to add task buttons
 */
function bindAddTaskTriggers(){
  document.querySelectorAll(".kb-add-btn,.kb-col-add")
    .forEach(btn=>btn.addEventListener("click",e=>{
      e.preventDefault();
      openAddTaskView();
    }));
}


/**
 * Triggers navigation to add task page
 */
function triggerAddTaskPopup(){
  document.dispatchEvent(new CustomEvent("open-add-task"));
  setTimeout(()=>location.href="add_task.html",0);
}


/**
 * Gets priority from card element
 * @param {HTMLElement} card - Card element
 * @returns {string}
 */
function getPriorityFromCard(card){
  const el=card.querySelector(".kb-prio,.kb-priority");
  if(!el) return "medium";
  const c=el.classList;
  if(c.contains("kb-prio--low")||c.contains("kb-priority--low")) return "low";
  if(c.contains("kb-prio--high")||c.contains("kb-priority--high")) return "high";
  return "medium";
}


/**
 * Collects all data from card
 * @param {HTMLElement} card - Card element
 * @returns {Object}
 */
function collectCardData(card){
  const chip=card.querySelector(".kb-chip");
  const type=chip?.classList.contains("kb-chip--technical")?"technical":"story";
  const title=(card.querySelector(".kb-card-title")?.textContent||"").trim();
  const desc=(card.querySelector(".kb-card-desc")?.textContent||"").trim();
  const priority=getPriorityFromCard(card);
  const assignees=(card.querySelector(".kb-avatars")?.getAttribute("data-assignees")||"")
    .split(",").map(v=>v.trim()).filter(Boolean);
  const dueDate=card.dataset.due||"";
  let subtasks=[];
  if(card.dataset.subtasks){
    try{
      subtasks=JSON.parse(card.dataset.subtasks);
    }catch{
      subtasks=card.dataset.subtasks.split(",").map(s=>s.trim()).filter(Boolean);
    }
  }
  return {type,title,desc,priority,assignees,dueDate,subtasks,cardEl:card};
}


/**
 * Binds card click events for details modal
 */
function bindCardPopups(){
  const wrap=document.querySelector(".kb-columns"); 
  if(!wrap) return;
  wrap.addEventListener("click",e=>{
    const t=e.target; 
    if(isInteractive(t)) return;
    const card=t instanceof Element?t.closest(".kb-card"):null;
    if(!card||!wrap.contains(card)) return;
    if(!card.dataset.id) card.dataset.id="kb_"+Math.random().toString(36).slice(2,9);
    window.__beCurrentDetailsCardId=card.dataset.id;
    const d=collectCardData(card); 
    openDetails(d.type,d);
  });
}


/**
 * Shows overlay
 */
function showOverlay(){
  const o=document.getElementById("at-overlay"); 
  if(!o) return;
  o.classList.add("is-open"); 
  document.body.style.overflow="hidden";
}


/**
 * Hides overlay
 */
function hideOverlay(){
  const o=document.getElementById("at-overlay"); 
  if(!o) return;
  o.classList.remove("is-open"); 
  document.body.style.overflow="";
}


/**
 * Closes all open modals
 */
function closeAllOpenModals(){
  document.querySelectorAll(".td-modal.is-open,.at-modal.is-open")
    .forEach(m=>m.classList.remove("is-open"));
  hideOverlay();
}


/**
 * Wires add task modal events
 */
function wireAddTaskModal(){
  const m=document.getElementById("at-modal"); 
  if(!m) return;
  window.openAddTaskPopup=()=>{ 
    showOverlay(); 
    m.classList.add("is-open"); 
  };
  document.getElementById("at-close")?.addEventListener("click",()=>{
    m.classList.remove("is-open"); 
    hideOverlay();
  });
}


/**
 * Sets chip type in details modal
 * @param {string} type - Task type
 */
function setChip(type){
  const el=document.getElementById("td-chip"); 
  if(!el) return;
  el.className="td-chip "+(type==="technical"?"td-chip--technical":"td-chip--story");
  el.textContent=type==="technical"?"Technical Task":"User Story";
}


/**
 * Sets priority display
 * @param {string} prio - Priority level
 */
function setPriority(prio){
  const txt=document.getElementById("td-prio-text");
  const box=document.getElementById("td-prio-icon");
  if(txt) txt.textContent=prio[0].toUpperCase()+prio.slice(1);
  if(!box) return; 
  box.innerHTML="";
  const img=document.createElement("img");
  img.className="td-prio-img"; 
  img.alt="Priority";
  setIconWithFallback(img, ICONS.prio[prio]||ICONS.prio.medium);
  box.appendChild(img);
}


/**
 * Creates person circle element
 * @param {string} init - Initials
 * @param {string} name - Full name
 * @returns {HTMLElement}
 */
function personCircle(init,name){
  const r=document.createElement("div"); 
  r.className="td-person";
  const c=document.createElement("span"); 
  c.className="td-person__circle td-person__circle--"+init; 
  c.textContent=init;
  const n=document.createElement("span"); 
  n.className="td-person__name"; 
  n.textContent=name;
  r.append(c,n); 
  return r;
}


/**
 * Sets assignees in details modal
 * @param {string[]} list - Array of initials
 */
function setAssignees(list){
  const box=document.getElementById("td-assignees"); 
  if(!box) return;
  box.innerHTML=""; 
  (list||[]).forEach(i=>{ 
    const p=contacts.find(c=>c.initials===i); 
    if(p) box.appendChild(personCircle(i,p.name)); 
  });
}


/**
 * Sets subtasks list
 * @param {string[]} list - Array of subtasks
 */
function setSubtasks(list){
  const block=document.getElementById("td-subtasks"); 
  const ul=document.getElementById("td-subtasks-list");
  if(!block||!ul) return; 
  ul.innerHTML="";
  if(!list?.length){ 
    block.hidden=true; 
    return; 
  }
  list.forEach(t=>{ 
    const li=document.createElement("li"); 
    li.className="td-task";
    const b=document.createElement("button"); 
    b.type="button"; 
    b.className="td-checkbox";
    const s=document.createElement("span"); 
    s.className="td-task__label"; 
    s.textContent=t;
    li.append(b,s); 
    ul.appendChild(li);
  }); 
  block.hidden=false;
}


/**
 * Binds subtask checkbox toggles
 */
function bindSubtaskToggles(){
  const ul=document.getElementById("td-subtasks-list"); 
  if(!ul) return;
  ul.addEventListener("click",e=>{ 
    const b=e.target.closest(".td-checkbox"); 
    if(!b)return;
    b.classList.toggle("is-checked"); 
    b.parentElement?.classList.toggle("is-done");
  });
}


/**
 * Fills task details modal with data
 * @param {Object} d - Task data
 * @param {string} t - Task type
 */
function fillTaskDetails(d,t){
  setChip(t);
  document.getElementById("td-title").textContent=d.title||"";
  document.getElementById("td-desc").textContent=d.desc||"";
  document.getElementById("td-due").textContent=d.dueDate||"—";
  setPriority(d.priority||"medium"); 
  setAssignees(d.assignees||[]); 
  setSubtasks(d.subtasks||[]);
}


/**
 * Traps focus within modal
 * @param {HTMLElement} m - Modal element
 */
function trapFocus(m){
  const fs=m.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
  const a=fs[0],z=fs[fs.length-1];
  function onKey(e){ 
    if(e.key!=="Tab"||!fs.length)return;
    if(e.shiftKey&&document.activeElement===a){
      e.preventDefault();
      z.focus();
    } else if(!e.shiftKey&&document.activeElement===z){
      e.preventDefault();
      a.focus();
    }
  } 
  m.__trap=onKey; 
  document.addEventListener("keydown",onKey); 
  (a||m).focus();
}


/**
 * Wires task details modal
 */
function wireTaskDetailsModal(){
  const m=document.getElementById("td-modal"); 
  if(!m) return;
  let lastF=null;
  document.querySelector("[data-td-close]")?.addEventListener("click",()=>{
    m.classList.remove("is-open"); 
    hideOverlay(); 
    if(m.__trap) document.removeEventListener("keydown",m.__trap); 
    lastF?.focus?.();
  });
  window.openDetails=(type,data)=>{
    lastF=document.activeElement; 
    fillTaskDetails(data,type);
    showOverlay(); 
    m.classList.add("is-open"); 
    trapFocus(m);
  };
}


/**
 * Binds priority button events
 */
function bindPriorityButtons(){
  document.querySelectorAll(".priority__btn").forEach(b=>{
    b.addEventListener("click",()=>{
      document.querySelectorAll(".priority__btn")
        .forEach(x=>x.classList.remove("priority__btn--active"));
      b.classList.add("priority__btn--active");
      b.closest(".priority")?.querySelector("input[name='priority']")
        ?.setAttribute("value",b.dataset.value||"medium");
    });
  });
}


/**
 * Binds subtask input Enter key
 */
function bindSubtaskInput(){
  const i=document.querySelector("[data-subtasks] input"); 
  const ul=document.querySelector(".subtasks__list");
  if(!i||!ul) return;
  i.addEventListener("keydown",e=>{
    if(e.key!=="Enter") return;
    const v=i.value.trim(); 
    if(!v) return e.preventDefault();
    e.preventDefault(); 
    const li=document.createElement("li"); 
    li.textContent=v; 
    ul.appendChild(li); 
    i.value="";
  });
}


/**
 * Validates form fields
 * @param {HTMLFormElement} f - Form element
 * @returns {boolean}
 */
function validateForm(f){
  const title = f.querySelector('[name="title"]')?.value.trim();
  const due = f.querySelector('[name="due"]')?.value.trim();
  const category = f.querySelector('[name="category"]')?.value;
  
  if(!title){
    alert('Please enter a title');
    return false;
  }
  if(!due){
    alert('Please select a due date');
    return false;
  }
  if(!category){
    alert('Please select a category');
    return false;
  }
  return true;
}


/**
 * Binds add task form buttons
 */
function bindAddTaskButtons(){
  document.getElementById("at-cancel")?.addEventListener("click",()=>{ 
    document.getElementById("at-modal")?.classList.remove("is-open"); 
    hideOverlay(); 
  });
  document.getElementById("at-create")?.addEventListener("click",e=>{
    const f = beGetForm();
    if(!f || f.dataset.editingId) return;
    if(!validateForm(f)){
      e.preventDefault();
    }
  });
}


/**
 * Wires add task form
 */
function wireAddTaskForm(){
  bindPriorityButtons(); 
  bindSubtaskInput(); 
  bindAddTaskButtons();
  const f = beGetForm();
  if(f){
    const cat = f.querySelector('[name="category"]');
    let typeHidden = f.querySelector('[name="type"]');
    if(!typeHidden){
      typeHidden = document.createElement('input');
      typeHidden.type = 'hidden'; 
      typeHidden.name = 'type'; 
      typeHidden.value = 'story';
      f.appendChild(typeHidden);
    }
    cat?.addEventListener('change', () => {
      typeHidden.value = cat.value === 'Technical Task' ? 'technical' : 'story';
    });
  }
}


/**
 * Initializes static icons
 */
function initStaticIcons(){
  const s=document.querySelector(".kb-search .kb-icon");
  if(s){
    s.src="./assets/img/board_input_search_icon.svg";
    s.alt="Search";
  }
  document.querySelectorAll(".kb-col-add").forEach(b=>b.textContent="");
}


/**
 * Main initialization function
 */
function initBoard(){
  initStaticIcons();
  renderAvatars();
  bindAddTaskTriggers();
  bindCardPopups();
  wireAddTaskModal();
  wireTaskDetailsModal();
  wireAddTaskForm();
  bindSubtaskToggles();
  
  document.addEventListener("click",e=>{ 
    if(e.target?.id==="at-overlay") closeAllOpenModals(); 
  });
  document.addEventListener("keydown",e=>{ 
    if(e.key==="Escape") closeAllOpenModals(); 
  });
  
  const container = document.getElementById('task-board');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  if (container) {
    tasks.forEach(task => {
      const card = document.createElement('div');
      card.className = 'task-card';
      card.innerHTML = `
        <div class="task-category" style="background:${task.category.color}">
          ${task.category.name}
        </div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p><b>Due:</b> ${task.dueDate}</p>
        <p><b>Priority:</b> ${task.priority}</p>
      `;
      container.appendChild(card);
    });
  }
}


window.addEventListener("DOMContentLoaded", initBoard);