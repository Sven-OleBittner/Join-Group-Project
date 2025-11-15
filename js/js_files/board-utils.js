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