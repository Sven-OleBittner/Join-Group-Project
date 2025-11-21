/**
 * Gets board element
 * @returns {HTMLElement|null}
 */
function beGetBoard() {
  return document.querySelector(".kb-columns");
}


/**
 * Gets column element from child
 * @param {Element} el - Child element
 * @returns {HTMLElement|null}
 */
function beGetColumn(el) {
  return el?.closest(".kb-col, .kb-column, [data-status]:not(.kb-card)") || null;
}


/**
 * Gets cards wrapper in column
 * @param {Element} col - Column element
 * @returns {HTMLElement}
 */
function beCardsWrap(col) {
  return col.querySelector(".kb-cards, .kb-card-list, [data-cards]") || col;
}


/**
 * Gets empty box element
 * @param {HTMLElement} col - Column element
 * @returns {HTMLElement|null}
 */
function beGetEmptyBox(col) {
  return col.querySelector(".kb-empty, [data-empty]") || null;
}


/**
 * Checks if column has cards
 * @param {HTMLElement} col - Column element
 * @returns {boolean}
 */
function beColumnHasCards(col) {
  return !!beCardsWrap(col).querySelector(".kb-card");
}


/**
 * Updates column empty state
 * @param {HTMLElement} col - Column element
 */
function beUpdateColumnState(col) {
  const hasCards = beColumnHasCards(col);
  const box = beGetEmptyBox(col);
  if (box) box.hidden = hasCards;
}


/**
 * Syncs all columns empty states
 */
function beSyncAllColumns() {
  document.querySelectorAll("[data-status], .kb-column, .kb-col")
    .forEach(el => beUpdateColumnState(el));
}


/**
 * Generates unique card ID
 * @returns {string}
 */
function beGenerateCardId() {
  return "kb_" + Math.random().toString(36).slice(2, 9);
}


/**
 * Ensures card has unique ID
 * @param {HTMLElement} card - Card element
 */
function beEnsureId(card) {
  if (!card.dataset.id) {
    card.dataset.id = beGenerateCardId();
  }
}


/**
 * Adds dragging classes to card
 * @param {HTMLElement} card - Card element
 */
function beAddDraggingClass(card) {
  card.classList.add("is-dragging", "is-tilted");
}


/**
 * Removes dragging classes from card
 * @param {HTMLElement} card - Card element
 */
function beRemoveDraggingClass(card) {
  card.classList.remove("is-dragging", "is-tilted");
}


/**
 * Handles drag start event
 * @param {DragEvent} e - Drag event
 */
function beOnDragStart(e) {
  const card = e.currentTarget;
  
  if (e.dataTransfer) {
    e.dataTransfer.setData("text/plain", card.dataset.id || "");
    e.dataTransfer.setDragImage(card, 10, 10);
  }
  
  beAddDraggingClass(card);
}


/**
 * Handles drag end event
 * @param {DragEvent} e - Drag event
 */
function beOnDragEnd(e) {
  const card = e.currentTarget;
  beRemoveDraggingClass(card);
}


/**
 * Makes card draggable
 * @param {HTMLElement} card - Card element
 */
function beMakeDraggable(card) {
  beEnsureId(card);
  card.setAttribute("draggable", "true");
  card.addEventListener("dragstart", beOnDragStart);
  card.addEventListener("dragend", beOnDragEnd);
}


/**
 * Adds dragover class to column
 * @param {HTMLElement} col - Column element
 */
function beAddDragoverClass(col) {
  col.classList.add("is-dragover");
}


/**
 * Removes dragover class from column
 * @param {HTMLElement} col - Column element
 */
function beRemoveDragoverClass(col) {
  col.classList.remove("is-dragover");
}


/**
 * Handles drag over event
 * @param {DragEvent} e - Drag event
 */
function beOnDragOver(e) {
  const col = beGetColumn(e.target);
  if (!col) return;
  
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  
  beAddDragoverClass(col);
}


/**
 * Handles drag leave event
 * @param {DragEvent} e - Drag event
 */
function beOnDragLeave(e) {
  const col = beGetColumn(e.target);
  if (col) beRemoveDragoverClass(col);
}


/**
 * Gets card by ID
 * @param {string} id - Card ID
 * @returns {HTMLElement|null}
 */
function beGetCardById(id) {
  const board = beGetBoard();
  return board?.querySelector(`.kb-card[data-id="${id}"]`) || null;
}


/**
 * Moves card to column
 * @param {HTMLElement} card - Card element
 * @param {HTMLElement} col - Column element
 */
function beMoveCardToColumn(card, col) {
  beCardsWrap(col).appendChild(card);
}


/**
 * Updates card status
 * @param {HTMLElement} card - Card element
 * @param {HTMLElement} col - Column element
 */
function beUpdateCardStatus(card, col) {
  const status = col.getAttribute("data-status") || "";
  if (status) card.dataset.status = status;
}


/**
 * Dispatches task moved event
 * @param {string} id - Card ID
 * @param {string} status - New status
 */
function beDispatchTaskMoved(id, status) {
  document.dispatchEvent(new CustomEvent("task:moved", {
    detail: { id, status }
  }));
}


/**
 * Handles drop event
 * @param {DragEvent} e - Drop event
 */
function beOnDrop(e) {
  const board = beGetBoard();
  const col = beGetColumn(e.target);
  
  if (!board || !col) return;
  
  e.preventDefault();
  beRemoveDragoverClass(col);
  
  const id = e.dataTransfer?.getData("text/plain");
  if (!id) return;
  
  const card = beGetCardById(id);
  if (!card) return;
  
  const fromCol = beGetColumn(card);
  
  beMoveCardToColumn(card, col);
  
  if (fromCol) beUpdateColumnState(fromCol);
  beUpdateColumnState(col);
  beUpdateCardStatus(card, col);
  
  beDispatchTaskMoved(id, card.dataset.status || "");
}


/**
 * Initializes drag and drop
 * @param {HTMLElement} root - Root element
 */
function beInitDnd(root) {
  root.querySelectorAll(".kb-card").forEach(c => beMakeDraggable(c));
  root.addEventListener("dragover", beOnDragOver);
  root.addEventListener("dragleave", beOnDragLeave);
  root.addEventListener("drop", beOnDrop);
}


/**
 * Processes added card node
 * @param {Node} node - Added node
 */
function beProcessAddedCard(node) {
  if (!(node instanceof HTMLElement)) return;
  
  if (node.matches(".kb-card")) {
    beMakeDraggable(node);
    const col = beGetColumn(node) || beGetColumn(node.parentElement);
    if (col) beUpdateColumnState(col);
  }
  
  node.querySelectorAll?.(".kb-card").forEach(card => {
    beMakeDraggable(card);
    const col = beGetColumn(card) || beGetColumn(card.parentElement);
    if (col) beUpdateColumnState(col);
  });
}


/**
 * Processes mutation records
 * @param {MutationRecord[]} mutations - Mutation records
 */
function beProcessMutations(mutations) {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => beProcessAddedCard(node));
  });
}


/**
 * Watches for new cards being added
 * @param {HTMLElement} el - Element to observe
 */
function beWatchNewCards(el) {
  const observer = new MutationObserver(beProcessMutations);
  observer.observe(el, { childList: true, subtree: true });
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
 * Shows toast message
 * @param {string} message - Toast message
 */
function beShowToast(message) {
  console.log(message);
}


/**
 * Wires feedback events
 */
function beWireFeedback() {
  document.addEventListener("task:moved", () => beShowToast("Task moved"));
  document.addEventListener("task:updated", () => beShowToast("Task updated"));
  document.addEventListener("task:deleted", () => beShowToast("Task deleted"));
}


/**
 * Gets task priority class
 * @param {string} priority - Priority value
 * @returns {string}
 */
function beGetPriorityClass(priority) {
  return priority === 'urgent' ? 'high' : (priority || 'medium');
}


/**
 * Gets task type class
 * @param {string} categoryName - Category name
 * @returns {string}
 */
function beGetTaskTypeClass(categoryName) {
  return categoryName === 'Technical Task' ? 'technical' : 'story';
}


/**
 * Gets assignees string
 * @param {Array} assigned - Assigned contacts
 * @returns {string}
 */
function beGetAssigneesString(assigned) {
  return (assigned || []).map(x => x.initials).join(', ');
}


/**
 * Generates card HTML
 * @param {Object} task - Task data
 * @returns {string}
 */
function beGenerateCardHTML(task) {
  const assignees = beGetAssigneesString(task.assigned);
  const priority = beGetPriorityClass(task.priority);
  const type = beGetTaskTypeClass(task.category?.name);
  const categoryName = task.category?.name || 'User Story';
  
  return `<div class="kb-card-top">
    <span class="kb-chip kb-chip--${type}">${categoryName}</span>
  </div>
  <h3 class="kb-card-title">${task.title}</h3>
  <p class="kb-card-desc">${task.description || ''}</p>
  <footer class="kb-card-foot">
    <div class="kb-avatars" data-assignees="${assignees}"></div>
    <div class="kb-prio kb-prio--${priority}">
      <span class="kb-prio__icon" aria-hidden="true"></span>
    </div>
  </footer>`;
}


/**
 * Creates card element
 * @param {Object} task - Task data
 * @returns {HTMLElement}
 */
function beCreateCardElement(task) {
  const el = document.createElement('article');
  el.className = 'kb-card';
  el.dataset.due = task.dueDate || '';
  
  if (task.id != null) {
    el.dataset.id = String(task.id);
  }
  
  el.innerHTML = beGenerateCardHTML(task);
  
  return el;
}


/**
 * Appends card to list
 * @param {HTMLElement} list - List element
 * @param {Object} task - Task data
 */
function beAppendCardToList(list, task) {
  const card = beCreateCardElement(task);
  list.appendChild(card);
}


/**
 * Renders avatars after loading
 */
function beRenderAvatarsIfAvailable() {
  if (typeof renderAvatars === 'function') {
    renderAvatars();
  }
}


/**
 * Loads tasks from localStorage
 */
function beLoadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const list = document.querySelector('.kb-col[data-status="todo"] [data-cards]');
  
  if (!list || !tasks.length) return;
  
  tasks.forEach(task => beAppendCardToList(list, task));
  
  beRenderAvatarsIfAvailable();
}


/**
 * Finds task in storage by ID
 * @param {Array} tasks - Tasks array
 * @param {string} id - Task ID
 * @returns {number}
 */
function beFindTaskIndex(tasks, id) {
  return tasks.findIndex(t => String(t.id) === String(id));
}


/**
 * Updates task status in storage
 * @param {string} id - Task ID
 * @param {string} status - New status
 */
function beUpdateTaskStatusInStorage(id, status) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const index = beFindTaskIndex(tasks, id);
  
  if (index > -1) {
    tasks[index].status = status;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}


/**
 * Handles task moved event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskMoved(e) {
  const { id, status } = e.detail || {};
  if (!id || !status) return;
  
  beUpdateTaskStatusInStorage(id, status);
}


/**
 * Ensures all cards have IDs
 * @param {HTMLElement} board - Board element
 */
function beEnsureAllCardsHaveIds(board) {
  board.querySelectorAll(".kb-card").forEach(card => beEnsureId(card));
}


/**
 * Binds all event listeners
 */
function beBindEventListeners() {
  document.addEventListener("task:moved", beEnsureEmptyVisible);
  document.addEventListener("task:deleted", beEnsureEmptyVisible);
  document.addEventListener("task:updated", beEnsureEmptyVisible);
  document.addEventListener("task:moved", beOnTaskMoved);
}


/**
 * Main core initialization
 */
function beInitCore() {
  if (window.__kbEnhancementsCoreInit) return;
  window.__kbEnhancementsCoreInit = true;
  
  const board = beGetBoard();
  if (!board) return;
  
  beEnsureAllCardsHaveIds(board);
  beInitDnd(board);
  beWatchNewCards(board);
  beSyncAllColumns();
  beWireFeedback();
  beLoadTasks();
  beBindEventListeners();
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", beInitCore, { once: true });
} else {
  beInitCore();
}