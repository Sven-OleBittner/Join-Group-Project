/**
 * Gets form element
 * @returns {HTMLFormElement|null}
 */
function beGetForm(){ 
  return document.querySelector("#at-modal form") || 
         document.querySelector("#taskForm"); 
}


/**
 * Opens edit modal
 * @returns {boolean}
 */
function beOpenEditModal(){
  if (window.openAddTaskPopup){ 
    window.openAddTaskPopup(); 
    return true; 
  }
  const d=document.getElementById("td-modal"); 
  if(!d) return false; 
  const showOverlay = window.showOverlay || (()=>{});
  showOverlay(); 
  d.classList.add("is-open"); 
  return true;
}


/**
 * Sets form value
 * @param {HTMLFormElement} f - Form element
 * @param {string} n - Field name
 * @param {string} v - Value
 */
function beSetFormVal(f,n,v){
  const el=f.querySelector(`[name="${n}"]`); 
  if(!el) return;
  el.value=v;
  el.dispatchEvent(new Event("input",{bubbles:true})); 
  el.dispatchEvent(new Event("change",{bubbles:true}));
}


/**
 * Converts name to initials
 * @param {string} full - Full name
 * @returns {string|null}
 */
function nameToInitials(full){
  const hit = contacts.find(c => c.name === full || 
    full.startsWith(c.name.split(' (')[0]));
  return hit ? hit.initials : null;
}


/**
 * Converts initials to name
 * @param {string} initials - Initials
 * @returns {string}
 */
function initialsToName(initials){
  const hit = contacts.find(c => c.initials === initials);
  return hit ? hit.name : initials;
}


/**
 * Preloads form with card data
 * @param {HTMLElement} card - Card element
 */
function bePreloadForm(card){
  const f=beGetForm(); 
  if(!f) return;
  const d=collectCardData(card);
  
  beSetFormVal(f,"title",d.title);
  beSetFormVal(f,"description",d.desc);
  
  const iso = (window.mmddyyyyToISO || ((s)=>s))(d.dueDate || "");
  beSetFormVal(f,"due", iso);
  beSetFormVal(f,"priority",d.priority||"medium");
  beSetFormVal(f,"type",d.type||"story");
  
  const catSel = f.querySelector('[name="category"]');
  if(catSel){
    catSel.value = (d.type === 'technical') ? 
      'Technical Task' : 'User Story';
  }
  
  const sel = f.querySelector('[name="assignees"]');
  if(sel){
    const initials = d.assignees || [];
    Array.from(sel.options).forEach(o=>{
      const init = nameToInitials(o.textContent.trim());
      o.selected = init ? initials.includes(init) : false;
    });
  }
  
  f.dataset.editingId=card.dataset.id||"";
}


/**
 * Sets text in element
 * @param {HTMLElement} root - Root element
 * @param {string} sel - Selector
 * @param {string} txt - Text content
 */
function beSetText(root,sel,txt){ 
  const el=root.querySelector(sel); 
  if(el) el.textContent=txt; 
}


/**
 * Sets priority class
 * @param {HTMLElement} card - Card element
 * @param {string} p - Priority level
 */
function beSetPrio(card,p){
  const el=card.querySelector(".kb-prio, .kb-priority"); 
  if(!el) return;
  el.classList.remove("kb-prio--low","kb-prio--medium","kb-prio--high",
    "kb-priority--low","kb-priority--medium","kb-priority--high");
  el.classList.add(el.classList.contains("kb-priority")?
    `kb-priority--${p}`:`kb-prio--${p}`);
}


/**
 * Sets task type class
 * @param {HTMLElement} card - Card element
 * @param {string} t - Task type
 */
function beSetType(card,t){
  const chip=card.querySelector(".kb-chip"); 
  if(!chip) return;
  chip.classList.toggle("kb-chip--technical",t==="technical");
  chip.classList.toggle("kb-chip--story",t!=="technical");
  chip.textContent = t==="technical" ? 
    "Technical Task" : "User Story";
}


/**
 * Applies form data to card
 * @param {HTMLElement} card - Card element
 * @param {HTMLFormElement} f - Form element
 */
function beApplyForm(card, f){
  const fd = new FormData(f);

  beSetText(card, ".kb-card-title", (fd.get("title") || "").toString());
  beSetText(card, ".kb-card-desc", (fd.get("description") || "").toString());

  const dueISO = (fd.get("due") || "").toString();
  if (dueISO){
    const toUS = (window.isoToMMDDYYYY || ((s)=>s))(dueISO);
    card.dataset.due = toUS;
  }

  const sel = f.querySelector('[name="assignees"]');
  const initials = sel ? Array.from(sel.selectedOptions)
    .map(o => nameToInitials(o.textContent.trim()))
    .filter(Boolean) : [];

  const av = card.querySelector(".kb-avatars");
  if (av) { 
    av.setAttribute("data-assignees", initials.join(",")); 
    if(typeof renderAvatars==='function') renderAvatars(); 
  }

  beSetPrio(card, (fd.get("priority") || "medium").toString());
  beSetType(card, (fd.get("type") || "story").toString());

  document.dispatchEvent(new CustomEvent("task:updated", { 
    detail: { id: card.dataset.id || "" } 
  }));
}


/**
 * Intercepts save button
 * @param {HTMLFormElement} f - Form element
 */
function beInterceptSave(f){
  const btn=document.getElementById("at-create"); 
  if(!btn || btn.dataset.beSave) return;
  btn.dataset.beSave="1";
  btn.addEventListener("click",e=>{
    if(!f.dataset.editingId) return; 
    e.preventDefault();
    const card=document.querySelector(
      `.kb-card[data-id="${f.dataset.editingId}"]`
    );
    if(card) beApplyForm(card, f);
    delete f.dataset.editingId; 
    document.getElementById("at-modal")?.classList.remove("is-open");
    const hideOverlay = window.hideOverlay || (()=>{});
    hideOverlay();
  },true);
}


/**
 * Patches openDetails function
 */
function bePatchOpenDetails(){
  if (!window.openDetails || window.openDetails.__bePatched) return;
  const orig = window.openDetails;
  window.openDetails = function(type, data){
    if (data?.cardEl){ 
      beEnsureId(data.cardEl); 
      window.__beCurrentDetailsCardId = data.cardEl.dataset.id; 
    }
    return orig(type, data);
  };
  window.openDetails.__bePatched = true;
}


/**
 * Gets current details card
 * @returns {HTMLElement|null}
 */
function beGetCurrentDetailsCard(){
  const id = window.__beCurrentDetailsCardId;
  return id ? document.querySelector(`.kb-card[data-id="${id}"]`) : null;
}


/**
 * Deletes card with confirmation
 * @param {HTMLElement} card - Card element
 */
function beDelete(card){
  const t = (card.querySelector(".kb-card-title")?.textContent||"").trim();
  if(!confirm(`Delete task${t?` "${t}"`:""}?`)) return;
  const col = beGetColumn(card); 
  card.remove(); 
  if(col) beUpdateColumnState(col);
  document.dispatchEvent(new CustomEvent("task:deleted",{
    detail:{id:card.dataset.id||""}
  }));
}


/**
 * Handles board click events
 * @param {MouseEvent} e - Click event
 */
function beOnBoardClick(e){
  const t=e.target instanceof Element?e.target:null; 
  if(!t) return;
  const edit=t.closest(".kb-card-edit, [data-action='edit'], #td-edit");
  const del =t.closest(".kb-card-delete, [data-action='delete'], #td-delete");
  if(!edit && !del) return; 
  e.preventDefault();
  const card=(edit||del)?.closest(".kb-card"); 
  if(!card) return;
  if(del) return beDelete(card);
  if(!beOpenEditModal()) return;
  bePreloadForm(card); 
  const f=beGetForm(); 
  if(f) beInterceptSave(f);
}


/**
 * Handles details modal click events
 * @param {MouseEvent} e - Click event
 */
function beOnDetailsClick(e){
  const t=e.target instanceof Element?e.target:null; 
  if(!t) return;
  const edit=t.closest("#td-modal [data-td-edit], #td-modal .td-edit, #td-modal [data-action='edit'], #td-modal #td-edit");
  const del =t.closest("#td-modal [data-td-delete], #td-modal .td-delete, #td-modal [data-action='delete'], #td-modal #td-delete");
  if(!edit && !del) return; 
  e.preventDefault();
  const card = beGetCurrentDetailsCard(); 
  if(!card) return;
  if(del){ 
    beDelete(card); 
    document.getElementById("td-modal")?.classList.remove("is-open"); 
    const hideOverlay = window.hideOverlay || (()=>{}); 
    hideOverlay(); 
    return; 
  }
  if(!beOpenEditModal()) return;
  bePreloadForm(card); 
  const f=beGetForm(); 
  if(f) beInterceptSave(f);
}


/**
 * Handles task deleted event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskDeleted(e) {
  let id = String(e.detail?.id || '');
  let arr = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  if (!arr.some(t => String(t.id) === id)) {
    const mt = document.getElementById('td-title')?.textContent?.trim() || '';
    const md = document.getElementById('td-due')?.textContent?.trim() || '';
    const hit = arr.find(t => (t.title||'')===mt && (t.dueDate||'')===md);
    if (hit) id = String(hit.id);
  }
  
  if (!id) return;
  arr = arr.filter(t => String(t.id) !== id);
  localStorage.setItem('tasks', JSON.stringify(arr));
}


/**
 * Main edit initialization
 */
function beInitEdit(){
  if (window.__kbEnhancementsEditInit) return; 
  window.__kbEnhancementsEditInit = true;
  
  const b=beGetBoard(); 
  if(!b) return;
  
  b.addEventListener("click",beOnBoardClick,true);
  document.addEventListener("click", beOnDetailsClick, true);
  document.addEventListener("task:deleted", beOnTaskDeleted);

  if (document.readyState==="loading") {
    document.addEventListener("DOMContentLoaded", bePatchOpenDetails, {once:true});
  } else {
    bePatchOpenDetails();
  }
}


if (document.readyState==="loading") {
  document.addEventListener("DOMContentLoaded", beInitEdit, {once:true});
} else {
  beInitEdit();
}