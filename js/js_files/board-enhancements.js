/** @returns {HTMLElement|null} */
function beGetBoard(){ return document.querySelector(".kb-columns"); }

/** @param {Element} el @returns {HTMLElement|null} */
function beGetColumn(el){ return el?.closest("[data-status], .kb-column, .kb-col") || null; }

/** @param {Element} col @returns {HTMLElement} */
function beCardsWrap(col){ return col.querySelector(".kb-cards, .kb-card-list, [data-cards]") || col; }

/** @param {HTMLElement} col @returns {HTMLElement|null} */
function beGetEmptyBox(col){ return col.querySelector(".kb-empty, [data-empty]") || null; }

/** @param {HTMLElement} col */
function beUpdateColumnState(col){
  const hasCards = !!beCardsWrap(col).querySelector(".kb-card");
  const box = beGetEmptyBox(col); if (box) box.hidden = hasCards;
}

function beSyncAllColumns(){
  document.querySelectorAll("[data-status], .kb-column, .kb-col")
    .forEach(el => beUpdateColumnState(/** @type {HTMLElement} */(el)));
}

/** @param {HTMLElement} card */
function beEnsureId(card){
  if (!card.dataset.id) card.dataset.id = "kb_" + Math.random().toString(36).slice(2,9);
}

/** @param {HTMLElement} card */
function beMakeDraggable(card){
  beEnsureId(card); card.setAttribute("draggable","true");
  card.addEventListener("dragstart",beOnDragStart);
  card.addEventListener("dragend",beOnDragEnd);
}

/** @param {DragEvent} e */
function beOnDragStart(e){
  const c = /** @type {HTMLElement} */(e.currentTarget);
  if (e.dataTransfer){ e.dataTransfer.setData("text/plain",c.dataset.id||""); e.dataTransfer.setDragImage(c,10,10); }
  c.classList.add("is-dragging","is-tilted");
}

/** @param {DragEvent} e */
function beOnDragEnd(e){
  const c = /** @type {HTMLElement} */(e.currentTarget);
  c.classList.remove("is-dragging","is-tilted");
}

/** @param {DragEvent} e */
function beOnDragOver(e){
  const col = beGetColumn(/** @type {Element} */(e.target)); if (!col) return;
  e.preventDefault(); if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  col.classList.add("is-dragover");
}

/** @param {DragEvent} e */
function beOnDragLeave(e){
  const col = beGetColumn(/** @type {Element} */(e.target));
  if (col) col.classList.remove("is-dragover");
}

/** @param {DragEvent} e */
function beOnDrop(e){
  const b = beGetBoard(); const col = beGetColumn(/** @type {Element} */(e.target));
  if (!b || !col) return; e.preventDefault(); col.classList.remove("is-dragover");
  const id = e.dataTransfer?.getData("text/plain"); if (!id) return;
  const card = b.querySelector(`.kb-card[data-id="${id}"]`); if (!card) return;
  const fromCol = beGetColumn(card);
  beCardsWrap(col).appendChild(card);
  if (fromCol) beUpdateColumnState(fromCol);
  beUpdateColumnState(col);
  const status = col.getAttribute("data-status") || ""; if (status) card.dataset.status = status;
  document.dispatchEvent(new CustomEvent("task:moved",{detail:{id,status}}));
}

/** @param {HTMLElement} root */
function beInitDnd(root){
  root.querySelectorAll(".kb-card").forEach(c=>beMakeDraggable(/** @type {HTMLElement} */(c)));
  root.addEventListener("dragover",beOnDragOver);
  root.addEventListener("dragleave",beOnDragLeave);
  root.addEventListener("drop",beOnDrop);
}

/** @param {HTMLElement} el */
function beWatchNewCards(el){
  const mo = new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{
    if(!(n instanceof HTMLElement)) return;
    if(n.matches(".kb-card")){ beMakeDraggable(n); const col=beGetColumn(n)||beGetColumn(n.parentElement); if(col) beUpdateColumnState(col); }
    n.querySelectorAll?.(".kb-card").forEach(c=>{ beMakeDraggable(/** @type {HTMLElement} */(c)); const col=beGetColumn(c)||beGetColumn(c.parentElement); if(col) beUpdateColumnState(col); });
  })));
  mo.observe(el,{childList:true,subtree:true});
}

/** @param {HTMLElement} card */
function beDelete(card){
  const t = (card.querySelector(".kb-card-title")?.textContent||"").trim();
  if(!confirm(`Видалити картку${t?` “${t}”`:""}?`)) return;
  const col = beGetColumn(card); card.remove(); if(col) beUpdateColumnState(col);
  document.dispatchEvent(new CustomEvent("task:deleted",{detail:{id:card.dataset.id||""}}));
}

/** @returns {HTMLFormElement|null} */
function beGetForm(){ return document.querySelector("#at-modal form") || document.querySelector("#taskForm"); }

/** @returns {boolean} */
function beOpenEditModal(){
  if (window.openAddTaskPopup){ window.openAddTaskPopup(); return true; }
  const d=document.getElementById("td-modal"); if(!d) return false; showOverlay(); d.classList.add("is-open"); return true;
}

/** @param {HTMLFormElement} f @param {string} n @param {string} v */
function beSetFormVal(f,n,v){
  const el=f.querySelector(`[name="${n}"]`); if(!el) return;
  /** @type {HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement} */(el).value=v;
  el.dispatchEvent(new Event("input",{bubbles:true})); el.dispatchEvent(new Event("change",{bubbles:true}));
}

/** @param {HTMLElement} card */
function bePreloadForm(card){
  const f=beGetForm(); if(!f) return;
  const d=collectCardData(card);
  beSetFormVal(f,"title",d.title); beSetFormVal(f,"description",d.desc);
  beSetFormVal(f,"due",d.dueDate||""); beSetFormVal(f,"assignees",(d.assignees||[]).join(", "));
  beSetFormVal(f,"priority",d.priority||"medium"); beSetFormVal(f,"type",d.type||"story");
  f.dataset.editingId=card.dataset.id||"";
}

/** @param {HTMLElement} root @param {string} sel @param {string} txt */
function beSetText(root,sel,txt){ const el=root.querySelector(sel); if(el) el.textContent=txt; }

/** @param {HTMLElement} card @param {"low"|"medium"|"high"} p */
function beSetPrio(card,p){
  const el=card.querySelector(".kb-prio, .kb-priority"); if(!el) return;
  el.classList.remove("kb-prio--low","kb-prio--medium","kb-prio--high","kb-priority--low","kb-priority--medium","kb-priority--high");
  el.classList.add(el.classList.contains("kb-priority")?`kb-priority--${p}`:`kb-prio--${p}`);
}

/** @param {HTMLElement} card @param {"technical"|"story"} t */
function beSetType(card,t){
  const chip=card.querySelector(".kb-chip"); if(!chip) return;
  chip.classList.toggle("kb-chip--technical",t==="technical");
  chip.classList.toggle("kb-chip--story",t!=="technical");
}

/** @param {HTMLElement} card @param {HTMLFormElement} f */
function beApplyForm(card, f){
  const fd = new FormData(f);
  beSetText(card, ".kb-card-title", (fd.get("title") || "").toString());
  beSetText(card, ".kb-card-desc", (fd.get("description") || "").toString());
  const due = (fd.get("due") || "").toString(); if (due) card.dataset.due = due;
  const list = (fd.get("assignees") || "").toString().split(",").map(s => s.trim()).filter(Boolean);
  const av = card.querySelector(".kb-avatars"); if (av) { av.setAttribute("data-assignees", list.join(",")); renderAvatars(); }
  beSetPrio(card, (fd.get("priority") || "medium").toString());
  beSetType(card, (fd.get("type") || "story").toString());
  document.dispatchEvent(new CustomEvent("task:updated", { detail: { id: card.dataset.id || "" } }));
}

/** @param {HTMLFormElement} f */
function beInterceptSave(f){
  const btn=document.getElementById("at-create"); if(!btn || btn.dataset.beSave) return;
  btn.dataset.beSave="1";
  btn.addEventListener("click",e=>{
    if(!f.dataset.editingId) return;
    e.preventDefault();
    const card=document.querySelector(`.kb-card[data-id="${f.dataset.editingId}"]`);
    if(card) beApplyForm(/** @type {HTMLElement} */(card), f);
    delete f.dataset.editingId; document.getElementById("at-modal")?.classList.remove("is-open"); hideOverlay();
  },true);
}


function bePatchOpenDetails(){
  if (!window.openDetails || window.openDetails.__bePatched) return;
  const orig = window.openDetails;
  window.openDetails = function(type, data){
    if (data?.cardEl){ beEnsureId(data.cardEl); window.__beCurrentDetailsCardId = data.cardEl.dataset.id; }
    return orig(type, data);
  };
  window.openDetails.__bePatched = true;
}

/** @param {MouseEvent} e */
function beOnBoardClick(e){
  const t=e.target instanceof Element?e.target:null; if(!t) return;
  const edit=t.closest(".kb-card-edit, [data-action='edit'], #td-edit");
  const del =t.closest(".kb-card-delete, [data-action='delete'], #td-delete");
  if(!edit && !del) return; e.preventDefault();
  const card=/** @type {HTMLElement} */((edit||del))?.closest(".kb-card"); if(!card) return;
  if(del) return beDelete(card);
  if(!beOpenEditModal()) return bePromptEdit(card);
  bePreloadForm(card); const f=beGetForm(); if(f) beInterceptSave(f);
}

/** @returns {HTMLElement|null} */
function beGetCurrentDetailsCard(){
  const id = window.__beCurrentDetailsCardId;
  return id ? document.querySelector(`.kb-card[data-id="${id}"]`) : null;
}

/** @param {MouseEvent} e */
function beOnDetailsClick(e){
  const t=e.target instanceof Element?e.target:null; if(!t) return;
  const edit=t.closest("#td-modal [data-td-edit], #td-modal .td-edit, #td-modal [data-action='edit'], #td-modal #td-edit");
  const del =t.closest("#td-modal [data-td-delete], #td-modal .td-delete, #td-modal [data-action='delete'], #td-modal #td-delete");
  if(!edit && !del) return; e.preventDefault();
  const card = beGetCurrentDetailsCard(); if(!card) return;
  if(del){ beDelete(card); document.getElementById("td-modal")?.classList.remove("is-open"); hideOverlay(); return; }
  if(!beOpenEditModal()) return bePromptEdit(card);
  bePreloadForm(card); const f=beGetForm(); if(f) beInterceptSave(f);
}

/** @param {HTMLElement} card */
function bePromptEdit(card){
  const d=collectCardData(card);
  const t=prompt("Заголовок:",d.title||""); if(t==null) return;
  const s=prompt("Опис:",d.desc||""); beSetText(card,".kb-card-title",t); beSetText(card,".kb-card-desc",s||"");
}

function beWireFeedback(){
  const toast = t => console.log(t);
  document.addEventListener("task:moved",  ()=>toast("Task moved"));
  document.addEventListener("task:updated",()=>toast("Task updated"));
  document.addEventListener("task:deleted",()=>toast("Task deleted"));
}


(function beInit(){
  if (window.__kbEnhancementsInit) return; window.__kbEnhancementsInit = true;
  const b=beGetBoard(); if(!b) return;
  b.querySelectorAll(".kb-card").forEach(c=>beEnsureId(/** @type {HTMLElement} */(c)));
  beInitDnd(b); beWatchNewCards(b);
  b.addEventListener("click",beOnBoardClick,true);         
  document.addEventListener("click", beOnDetailsClick, true); 
  beSyncAllColumns(); beWireFeedback();
  if (document.readyState==="loading") document.addEventListener("DOMContentLoaded", bePatchOpenDetails, {once:true});
  else bePatchOpenDetails();
})();
