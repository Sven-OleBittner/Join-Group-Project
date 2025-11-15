/**
 * Gets board element
 * @returns {HTMLElement|null}
 */
function beGetBoard(){ 
  return document.querySelector(".kb-columns"); 
}


/**
 * Gets column element from child
 * @param {Element} el - Child element
 * @returns {HTMLElement|null}
 */
function beGetColumn(el){
  return el?.closest(".kb-col, .kb-column, [data-status]:not(.kb-card)") || null;
}


/**
 * Gets cards wrapper in column
 * @param {Element} col - Column element
 * @returns {HTMLElement}
 */
function beCardsWrap(col){ 
  return col.querySelector(".kb-cards, .kb-card-list, [data-cards]") || col; 
}


/**
 * Gets empty box element
 * @param {HTMLElement} col - Column element
 * @returns {HTMLElement|null}
 */
function beGetEmptyBox(col){ 
  return col.querySelector(".kb-empty, [data-empty]") || null; 
}


/**
 * Updates column empty state
 * @param {HTMLElement} col - Column element
 */
function beUpdateColumnState(col){
  const hasCards = !!beCardsWrap(col).querySelector(".kb-card");
  const box = beGetEmptyBox(col); 
  if (box) box.hidden = hasCards;
}


/**
 * Syncs all columns empty states
 */
function beSyncAllColumns(){
  document.querySelectorAll("[data-status], .kb-column, .kb-col")
    .forEach(el => beUpdateColumnState(el));
}


/**
 * Ensures card has unique ID
 * @param {HTMLElement} card - Card element
 */
function beEnsureId(card){
  if (!card.dataset.id) {
    card.dataset.id = "kb_" + Math.random().toString(36).slice(2,9);
  }
}


/**
 * Makes card draggable
 * @param {HTMLElement} card - Card element
 */
function beMakeDraggable(card){
  beEnsureId(card); 
  card.setAttribute("draggable","true");
  card.addEventListener("dragstart",beOnDragStart);
  card.addEventListener("dragend",beOnDragEnd);
}


/**
 * Handles drag start event
 * @param {DragEvent} e - Drag event
 */
function beOnDragStart(e){
  const c = e.currentTarget;
  if (e.dataTransfer){ 
    e.dataTransfer.setData("text/plain",c.dataset.id||""); 
    e.dataTransfer.setDragImage(c,10,10); 
  }
  c.classList.add("is-dragging","is-tilted");
}


/**
 * Handles drag end event
 * @param {DragEvent} e - Drag event
 */
function beOnDragEnd(e){
  const c = e.currentTarget;
  c.classList.remove("is-dragging","is-tilted");
}


/**
 * Handles drag over event
 * @param {DragEvent} e - Drag event
 */
function beOnDragOver(e){
  const col = beGetColumn(e.target); 
  if (!col) return;
  e.preventDefault(); 
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  col.classList.add("is-dragover");
}


/**
 * Handles drag leave event
 * @param {DragEvent} e - Drag event
 */
function beOnDragLeave(e){
  const col = beGetColumn(e.target);
  if (col) col.classList.remove("is-dragover");
}


/**
 * Handles drop event
 * @param {DragEvent} e - Drop event
 */
function beOnDrop(e){
  const b = beGetBoard(); 
  const col = beGetColumn(e.target);
  if (!b || !col) return; 
  e.preventDefault(); 
  col.classList.remove("is-dragover");
  const id = e.dataTransfer?.getData("text/plain"); 
  if (!id) return;
  const card = b.querySelector(`.kb-card[data-id="${id}"]`); 
  if (!card) return;
  const fromCol = beGetColumn(card);
  beCardsWrap(col).appendChild(card);
  if (fromCol) beUpdateColumnState(fromCol);
  beUpdateColumnState(col);
  const status = col.getAttribute("data-status") || ""; 
  if (status) card.dataset.status = status;
  document.dispatchEvent(new CustomEvent("task:moved",{
    detail:{id,status}
  }));
}


/**
 * Initializes drag and drop
 * @param {HTMLElement} root - Root element
 */
function beInitDnd(root){
  root.querySelectorAll(".kb-card").forEach(c=>beMakeDraggable(c));
  root.addEventListener("dragover",beOnDragOver);
  root.addEventListener("dragleave",beOnDragLeave);
  root.addEventListener("drop",beOnDrop);
}


/**
 * Watches for new cards being added
 * @param {HTMLElement} el - Element to observe
 */
function beWatchNewCards(el){
  const mo = new MutationObserver(m=>m.forEach(x=>x.addedNodes.forEach(n=>{
    if(!(n instanceof HTMLElement)) return;
    if(n.matches(".kb-card")){ 
      beMakeDraggable(n); 
      const col=beGetColumn(n)||beGetColumn(n.parentElement); 
      if(col) beUpdateColumnState(col); 
    }
    n.querySelectorAll?.(".kb-card").forEach(c=>{ 
      beMakeDraggable(c); 
      const col=beGetColumn(c)||beGetColumn(c.parentElement); 
      if(col) beUpdateColumnState(col); 
    });
  })));
  mo.observe(el,{childList:true,subtree:true});
}


/**
 * Ensures empty boxes are visible
 */
function beEnsureEmptyVisible() {
  document.querySelectorAll("[data-status], .kb-col").forEach(col => {
    const wrap = beCardsWrap(col);
    const empty = beGetEmptyBox(col);
    const hasCards = !!wrap.querySelector(".kb-card");
    if (empty) empty.hidden = hasCards;
  });
}


/**
 * Wires feedback events
 */
function beWireFeedback(){
  const toast = t => console.log(t);
  document.addEventListener("task:moved",  ()=>toast("Task moved"));
  document.addEventListener("task:updated",()=>toast("Task updated"));
  document.addEventListener("task:deleted",()=>toast("Task deleted"));
}


/**
 * Loads tasks from localStorage
 */
function beLoadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const list = document.querySelector('.kb-col[data-status="todo"] [data-cards]');
  if (!list || !tasks.length) return;
  
  tasks.forEach(t => {
    const ass = (t.assigned || []).map(x => x.initials).join(', ');
    const pr  = t.priority === 'urgent' ? 'high' : (t.priority || 'medium');
    const type = t.category?.name === 'Technical Task' ? 'technical' : 'story';
    const el = document.createElement('article');
    el.className = 'kb-card'; 
    el.dataset.due = t.dueDate || '';
    if(t.id != null) el.dataset.id = String(t.id);
    el.innerHTML = taskTemplate(t, ass, pr, type, el);
    list.appendChild(el);
  });
  
  if (typeof renderAvatars === 'function') renderAvatars();
}


/**
 * Handles task moved event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskMoved(e) {
  const { id, status } = e.detail || {};
  if (!id || !status) return;
  const arr = JSON.parse(localStorage.getItem('tasks') || '[]');
  const ix = arr.findIndex(t => String(t.id) === String(id));
  if (ix > -1) {
    arr[ix].status = status;
    localStorage.setItem('tasks', JSON.stringify(arr));
  }
}


/**
 * Main core initialization
 */
function beInitCore(){
  if (window.__kbEnhancementsCoreInit) return; 
  window.__kbEnhancementsCoreInit = true;
  
  const b=beGetBoard(); 
  if(!b) return;
  
  b.querySelectorAll(".kb-card").forEach(c=>beEnsureId(c));
  beInitDnd(b); 
  beWatchNewCards(b);
  beSyncAllColumns(); 
  beWireFeedback();
  
  beLoadTasks();
  
  document.addEventListener("task:moved", beEnsureEmptyVisible);
  document.addEventListener("task:deleted", beEnsureEmptyVisible);
  document.addEventListener("task:updated", beEnsureEmptyVisible);
  document.addEventListener("task:moved", beOnTaskMoved);
}


if (document.readyState==="loading") {
  document.addEventListener("DOMContentLoaded", beInitCore, {once:true});
} else {
  beInitCore();
}