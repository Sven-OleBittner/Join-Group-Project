/**
 * Gets form element
 * @returns {HTMLFormElement|null}
 */
function beGetForm() {
  return document.querySelector("#at-modal form") ||
    document.querySelector("#taskForm");
}


/**
 * Shows overlay element
 */
function beShowOverlayElement() {
  const showFn = window.showOverlay || (() => { });
  showFn();
}


/**
 * Opens add task popup via global function
 * @returns {boolean}
 */
function beTryOpenAddTaskPopup() {
  if (window.openAddTaskPopup) {
    window.openAddTaskPopup();
    return true;
  }
  return false;
}


/**
 * Opens details modal
 * @returns {boolean}
 */
function beOpenDetailsModal() {
  const modal = document.getElementById("td-modal");
  if (!modal) return false;
  
  beShowOverlayElement();
  modal.classList.add("is-open");
  return true;
}


/**
 * Opens edit modal
 * @returns {boolean}
 */
function beOpenEditModal() {
  if (beTryOpenAddTaskPopup()) return true;
  return beOpenDetailsModal();
}


/**
 * Sets form value and dispatches events
 * @param {HTMLFormElement} form - Form element
 * @param {string} name - Field name
 * @param {string} value - Field value
 */
function beSetFormVal(form, name, value) {
  const el = form.querySelector(`[name="${name}"]`);
  if (!el) return;
  
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}


/**
 * Finds contact by name
 * @param {string} fullName - Full name
 * @returns {Object|null}
 */
function beFindContactByName(fullName) {
  return contacts.find(c =>
    c.name === fullName ||
    fullName.startsWith(c.name.split(' (')[0])
  );
}


/**
 * Converts name to initials
 * @param {string} fullName - Full name
 * @returns {string|null}
 */
function nameToInitials(fullName) {
  const contact = beFindContactByName(fullName);
  return contact ? contact.initials : null;
}


/**
 * Finds contact by initials
 * @param {string} initials - Initials
 * @returns {Object|null}
 */
function beFindContactByInitials(initials) {
  return contacts.find(c => c.initials === initials);
}


/**
 * Converts initials to name
 * @param {string} initials - Initials
 * @returns {string}
 */
function initialsToName(initials) {
  const contact = beFindContactByInitials(initials);
  return contact ? contact.name : initials;
}


/**
 * Converts date format
 * @param {string} dateStr - Date string
 * @returns {string}
 */
function beConvertDateFormat(dateStr) {
  const converter = window.mmddyyyyToISO || ((s) => s);
  return converter(dateStr || "");
}


/**
 * Sets category field value
 * @param {HTMLFormElement} form - Form element
 * @param {string} type - Task type
 */
function beSetCategoryField(form, type) {
  const catSel = form.querySelector('[name="category"]');
  if (catSel) {
    catSel.value = (type === 'technical') ?
      'Technical Task' : 'User Story';
  }
}


/**
 * Selects assignees in form
 * @param {HTMLFormElement} form - Form element
 * @param {string[]} initials - Array of initials
 */
function beSelectAssignees(form, initials) {
  const sel = form.querySelector('[name="assignees"]');
  if (!sel) return;
  
  Array.from(sel.options).forEach(option => {
    const init = nameToInitials(option.textContent.trim());
    option.selected = init ? initials.includes(init) : false;
  });
}


/**
 * Preloads form with card data
 * @param {HTMLElement} card - Card element
 */
function bePreloadForm(card) {
  const form = beGetForm();
  if (!form) return;
  
  const data = collectCardData(card);
  
  beSetFormVal(form, "title", data.title);
  beSetFormVal(form, "description", data.desc);
  beSetFormVal(form, "due", beConvertDateFormat(data.dueDate));
  beSetFormVal(form, "priority", data.priority || "medium");
  beSetFormVal(form, "type", data.type || "story");
  
  beSetCategoryField(form, data.type);
  beSelectAssignees(form, data.assignees || []);
  
  form.dataset.editingId = card.dataset.id || "";
}


/**
 * Sets text in element
 * @param {HTMLElement} root - Root element
 * @param {string} selector - Selector
 * @param {string} text - Text content
 */
function beSetText(root, selector, text) {
  const el = root.querySelector(selector);
  if (el) el.textContent = text;
}


/**
 * Removes priority classes
 * @param {HTMLElement} el - Element
 */
function beRemovePriorityClasses(el) {
  el.classList.remove(
    "kb-prio--low", "kb-prio--medium", "kb-prio--high",
    "kb-priority--low", "kb-priority--medium", "kb-priority--high"
  );
}


/**
 * Adds priority class
 * @param {HTMLElement} el - Element
 * @param {string} priority - Priority level
 */
function beAddPriorityClass(el, priority) {
  const isKbPriority = el.classList.contains("kb-priority");
  const className = isKbPriority ?
    `kb-priority--${priority}` : `kb-prio--${priority}`;
  el.classList.add(className);
}


/**
 * Sets priority class
 * @param {HTMLElement} card - Card element
 * @param {string} priority - Priority level
 */
function beSetPrio(card, priority) {
  const el = card.querySelector(".kb-prio, .kb-priority");
  if (!el) return;
  
  beRemovePriorityClasses(el);
  beAddPriorityClass(el, priority);
}


/**
 * Updates chip type class
 * @param {HTMLElement} chip - Chip element
 * @param {string} type - Task type
 */
function beUpdateChipTypeClass(chip, type) {
  chip.classList.toggle("kb-chip--technical", type === "technical");
  chip.classList.toggle("kb-chip--story", type !== "technical");
}


/**
 * Sets chip text
 * @param {HTMLElement} chip - Chip element
 * @param {string} type - Task type
 */
function beSetChipText(chip, type) {
  chip.textContent = type === "technical" ?
    "Technical Task" : "User Story";
}


/**
 * Sets task type class
 * @param {HTMLElement} card - Card element
 * @param {string} type - Task type
 */
function beSetType(card, type) {
  const chip = card.querySelector(".kb-chip");
  if (!chip) return;
  
  beUpdateChipTypeClass(chip, type);
  beSetChipText(chip, type);
}


/**
 * Converts ISO date to display format
 * @param {string} isoDate - ISO format date
 * @returns {string}
 */
function beConvertISOToDisplay(isoDate) {
  const converter = window.isoToMMDDYYYY || ((s) => s);
  return converter(isoDate);
}


/**
 * Updates card due date
 * @param {HTMLElement} card - Card element
 * @param {string} dueISO - Due date in ISO format
 */
function beUpdateCardDueDate(card, dueISO) {
  if (dueISO) {
    const displayDate = beConvertISOToDisplay(dueISO);
    card.dataset.due = displayDate;
  }
}


/**
 * Gets selected assignees from form
 * @param {HTMLFormElement} form - Form element
 * @returns {string[]}
 */
function beGetSelectedAssignees(form) {
  const sel = form.querySelector('[name="assignees"]');
  if (!sel) return [];
  
  return Array.from(sel.selectedOptions)
    .map(o => nameToInitials(o.textContent.trim()))
    .filter(Boolean);
}


/**
 * Updates avatars display
 * @param {HTMLElement} card - Card element
 * @param {string[]} initials - Array of initials
 */
function beUpdateAvatarsDisplay(card, initials) {
  const av = card.querySelector(".kb-avatars");
  if (!av) return;
  
  av.setAttribute("data-assignees", initials.join(","));
  
  if (typeof renderAvatars === 'function') {
    renderAvatars();
  }
}


/**
 * Dispatches task updated event
 * @param {string} id - Task ID
 */
function beDispatchTaskUpdated(id) {
  document.dispatchEvent(new CustomEvent("task:updated", {
    detail: { id: id || "" }
  }));
}


/**
 * Applies form data to card
 * @param {HTMLElement} card - Card element
 * @param {HTMLFormElement} form - Form element
 */
function beApplyForm(card, form) {
  const fd = new FormData(form);

  beSetText(card, ".kb-card-title", (fd.get("title") || "").toString());
  beSetText(card, ".kb-card-desc", (fd.get("description") || "").toString());

  beUpdateCardDueDate(card, (fd.get("due") || "").toString());

  const initials = beGetSelectedAssignees(form);
  beUpdateAvatarsDisplay(card, initials);

  beSetPrio(card, (fd.get("priority") || "medium").toString());
  beSetType(card, (fd.get("type") || "story").toString());

  beDispatchTaskUpdated(card.dataset.id || "");
}


/**
 * Closes add task modal
 */
function beCloseAddTaskModal() {
  document.getElementById("at-modal")?.classList.remove("is-open");
  const hideOverlay = window.hideOverlay || (() => { });
  hideOverlay();
}


/**
 * Handles save button click
 * @param {Event} e - Click event
 * @param {HTMLFormElement} form - Form element
 */
function beHandleSaveClick(e, form) {
  if (!form.dataset.editingId) return;
  
  e.preventDefault();
  
  const card = document.querySelector(
    `.kb-card[data-id="${form.dataset.editingId}"]`
  );
  
  if (card) beApplyForm(card, form);
  
  delete form.dataset.editingId;
  beCloseAddTaskModal();
}


/**
 * Intercepts save button
 * @param {HTMLFormElement} form - Form element
 */
function beInterceptSave(form) {
  const btn = document.getElementById("at-create");
  if (!btn || btn.dataset.beSave) return;
  
  btn.dataset.beSave = "1";
  btn.addEventListener("click", e => beHandleSaveClick(e, form), true);
}


/**
 * Patches openDetails function
 */
function bePatchOpenDetails() {
  if (!window.openDetails || window.openDetails.__bePatched) return;
  
  const original = window.openDetails;
  
  window.openDetails = function (type, data) {
    if (data?.cardEl) {
      beEnsureId(data.cardEl);
      window.__beCurrentDetailsCardId = data.cardEl.dataset.id;
    }
    return original(type, data);
  };
  
  window.openDetails.__bePatched = true;
}


/**
 * Gets current details card
 * @returns {HTMLElement|null}
 */
function beGetCurrentDetailsCard() {
  const id = window.__beCurrentDetailsCardId;
  return id ? document.querySelector(`.kb-card[data-id="${id}"]`) : null;
}


/**
 * Gets card title text
 * @param {HTMLElement} card - Card element
 * @returns {string}
 */
function beGetCardTitle(card) {
  return (card.querySelector(".kb-card-title")?.textContent || "").trim();
}


/**
 * Shows delete confirmation
 * @param {string} title - Task title
 * @returns {boolean}
 */
function beConfirmDelete(title) {
  return confirm(`Delete task${title ? ` "${title}"` : ""}?`);
}


/**
 * Removes card from DOM
 * @param {HTMLElement} card - Card element
 */
function beRemoveCard(card) {
  const col = beGetColumn(card);
  card.remove();
  if (col) beUpdateColumnState(col);
}


/**
 * Dispatches task deleted event
 * @param {string} id - Task ID
 */
function beDispatchTaskDeleted(id) {
  document.dispatchEvent(new CustomEvent("task:deleted", {
    detail: { id: id || "" }
  }));
}


/**
 * Deletes card with confirmation
 * @param {HTMLElement} card - Card element
 */
function beDelete(card) {
  const title = beGetCardTitle(card);
  if (!beConfirmDelete(title)) return;
  
  beRemoveCard(card);
  beDispatchTaskDeleted(card.dataset.id || "");
}


/**
 * Handles edit button click
 * @param {HTMLElement} card - Card element
 */
function beHandleEditClick(card) {
  if (!beOpenEditModal()) return;
  
  bePreloadForm(card);
  const form = beGetForm();
  if (form) beInterceptSave(form);
}


/**
 * Handles board click events
 * @param {MouseEvent} e - Click event
 */
function beOnBoardClick(e) {
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;
  
  const editBtn = target.closest(".kb-card-edit, [data-action='edit'], #td-edit");
  const delBtn = target.closest(".kb-card-delete, [data-action='delete'], #td-delete");
  
  if (!editBtn && !delBtn) return;
  e.preventDefault();
  
  const card = (editBtn || delBtn)?.closest(".kb-card");
  if (!card) return;
  
  if (delBtn) {
    beDelete(card);
  } else {
    beHandleEditClick(card);
  }
}


/**
 * Closes details modal with overlay
 */
function beCloseDetailsModalWithOverlay() {
  document.getElementById("td-modal")?.classList.remove("is-open");
  const hideOverlay = window.hideOverlay || (() => { });
  hideOverlay();
}


/**
 * Handles details edit click
 * @param {HTMLElement} card - Card element
 */
function beHandleDetailsEditClick(card) {
  if (!beOpenEditModal()) return;
  
  bePreloadForm(card);
  const form = beGetForm();
  if (form) beInterceptSave(form);
}


/**
 * Handles details delete click
 * @param {HTMLElement} card - Card element
 */
function beHandleDetailsDeleteClick(card) {
  beDelete(card);
  beCloseDetailsModalWithOverlay();
}


/**
 * Handles details modal click events
 * @param {MouseEvent} e - Click event
 */
function beOnDetailsClick(e) {
  const target = e.target instanceof Element ? e.target : null;
  if (!target) return;
  
  const editBtn = target.closest("#td-modal [data-td-edit], #td-modal .td-edit, #td-modal [data-action='edit'], #td-modal #td-edit");
  const delBtn = target.closest("#td-modal [data-td-delete], #td-modal .td-delete, #td-modal [data-action='delete'], #td-modal #td-delete");
  
  if (!editBtn && !delBtn) return;
  e.preventDefault();
  
  const card = beGetCurrentDetailsCard();
  if (!card) return;
  
  if (delBtn) {
    beHandleDetailsDeleteClick(card);
  } else {
    beHandleDetailsEditClick(card);
  }
}


/**
 * Finds task in storage by title and date
 * @param {Array} tasks - Tasks array
 * @param {string} title - Task title
 * @param {string} dueDate - Due date
 * @returns {Object|null}
 */
function beFindTaskByTitleAndDate(tasks, title, dueDate) {
  return tasks.find(t =>
    (t.title || '') === title &&
    (t.dueDate || '') === dueDate
  );
}


/**
 * Gets fallback task ID from modal
 * @param {Array} tasks - Tasks array
 * @returns {string}
 */
function beGetFallbackTaskId(tasks) {
  const modalTitle = document.getElementById('td-title')?.textContent?.trim() || '';
  const modalDue = document.getElementById('td-due')?.textContent?.trim() || '';
  
  const hit = beFindTaskByTitleAndDate(tasks, modalTitle, modalDue);
  return hit ? String(hit.id) : '';
}


/**
 * Removes task from storage
 * @param {string} id - Task ID
 */
function beRemoveTaskFromStorage(id) {
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks = tasks.filter(t => String(t.id) !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Handles task deleted event
 * @param {CustomEvent} e - Custom event
 */
function beOnTaskDeleted(e) {
  let id = String(e.detail?.id || '');
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  if (!tasks.some(t => String(t.id) === id)) {
    id = beGetFallbackTaskId(tasks);
  }
  
  if (!id) return;
  
  beRemoveTaskFromStorage(id);
}


/**
 * Binds board event listeners
 * @param {HTMLElement} board - Board element
 */
function beBindBoardListeners(board) {
  board.addEventListener("click", beOnBoardClick, true);
}


/**
 * Binds details modal listeners
 */
function beBindDetailsListeners() {
  document.addEventListener("click", beOnDetailsClick, true);
  document.addEventListener("task:deleted", beOnTaskDeleted);
}


/**
 * Initializes openDetails patch
 */
function beInitializeOpenDetailsPatch() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bePatchOpenDetails, { once: true });
  } else {
    bePatchOpenDetails();
  }
}


/**
 * Main edit initialization
 */
function beInitEdit() {
  if (window.__kbEnhancementsEditInit) return;
  window.__kbEnhancementsEditInit = true;
  
  const board = beGetBoard();
  if (!board) return;
  
  beBindBoardListeners(board);
  beBindDetailsListeners();
  beInitializeOpenDetailsPatch();
}


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", beInitEdit, { once: true });
} else {
  beInitEdit();
}