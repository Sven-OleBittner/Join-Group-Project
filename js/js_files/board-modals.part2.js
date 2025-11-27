/**
 * Sets element text content
 * @param {string} id - Element ID
 * @param {string} text - Text content
 */
function setElementTextById(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
  }
}


/**
 * Fills task details modal with data
 * @param {Object} data - Task data
 * @param {string} type - Task type
 */
function fillTaskDetails(data, type) {
  setChip(type);
  setElementTextById("td-title", data.title || "");
  setElementTextById("td-desc", data.desc || "");
  setElementTextById("td-due", data.dueDate || "—");
  setPriority(data.priority || "medium");
  setAssignees(data.assignees || []);
  setSubtasks(data.subtasks || []);
}


/**
 * Gets focusable elements in modal
 * @param {HTMLElement} modal - Modal element
 * @returns {NodeList}
 */
function getFocusableElements(modal) {
  return modal.querySelectorAll(
    'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
  );
}


/**
 * Handles tab key in modal
 * @param {KeyboardEvent} e - Keyboard event
 * @param {Element} firstElement - First focusable element
 * @param {Element} lastElement - Last focusable element
 */
function handleTabKey(e, firstElement, lastElement) {
  if (e.shiftKey && document.activeElement === firstElement) {
    e.preventDefault();
    lastElement.focus();
  } else if (!e.shiftKey && document.activeElement === lastElement) {
    e.preventDefault();
    firstElement.focus();
  }
}


/**
 * Creates focus trap handler
 * @param {NodeList} focusables - Focusable elements
 * @returns {Function}
 */
function createFocusTrapHandler(focusables) {
  if (!focusables.length) return () => { };
  
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  
  return (e) => {
    if (e.key === "Tab") {
      handleTabKey(e, first, last);
    }
  };
}


/**
 * Traps focus within modal
 * @param {HTMLElement} modal - Modal element
 */
function trapFocus(modal) {
  const focusables = getFocusableElements(modal);
  const handler = createFocusTrapHandler(focusables);
  
  modal.__trap = handler;
  document.addEventListener("keydown", handler);
  
  (focusables[0] || modal).focus();
}


/**
 * Removes focus trap
 * @param {HTMLElement} modal - Modal element
 */
function removeFocusTrap(modal) {
  if (modal.__trap) {
    document.removeEventListener("keydown", modal.__trap);
  }
}


/**
 * Closes task details modal
 * @param {HTMLElement} modal - Modal element
 * @param {Element} lastFocused - Last focused element
 */
function closeTaskDetails(modal, lastFocused) {
  modal.classList.remove("is-open");
  hideOverlay();
  removeFocusTrap(modal);
  lastFocused?.focus?.();
}


/**
 * Wires task details modal
 */
function wireTaskDetailsModal() {
  const modal = document.getElementById("td-modal");
  if (!modal) return;
  
  let lastFocused = null;
  
  document.querySelector("[data-td-close]")?.addEventListener("click", () => {
    closeTaskDetails(modal, lastFocused);
  });
  
  window.openDetails = (type, data) => {
    lastFocused = document.activeElement;
    fillTaskDetails(data, type);
    showOverlay();
    modal.classList.add("is-open");
    trapFocus(modal);
  };
}


/**
 * Selects priority button
 * @param {HTMLElement} button - Button element
 */
function selectPriorityBtn(button) {
  document.querySelectorAll(".priority__btn")
    .forEach(x => x.classList.remove("priority__btn--active"));
  button.classList.add("priority__btn--active");
}


/**
 * Updates priority hidden input
 * @param {HTMLElement} button - Button element
 */
function updatePriorityInput(button) {
  const input = button.closest(".priority")?.querySelector("input[name='priority']");
  input?.setAttribute("value", button.dataset.value || "medium");
}


/**
 * Handles priority button click
 * @param {HTMLElement} button - Button element
 */
function handlePriorityClick(button) {
  selectPriorityBtn(button);
  updatePriorityInput(button);
}


/**
 * Binds priority button events
 */
function bindPriorityButtons() {
  document.querySelectorAll(".priority__btn").forEach(btn => {
    btn.addEventListener("click", () => handlePriorityClick(btn));
  });
}


/**
 * Adds subtask to list
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} ul - List element
 */
function addSubtaskToList(input, ul) {
  const value = input.value.trim();
  if (!value) return;
  
  const li = document.createElement("li");
  li.textContent = value;
  ul.appendChild(li);
  input.value = "";
}


/**
 * Handles subtask Enter key
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} ul - List element
 */
function handleSubtaskEnter(e, input, ul) {
  if (e.key !== "Enter") return;
  e.preventDefault();
  addSubtaskToList(input, ul);
}


/**
 * Binds subtask input Enter key
 */
function bindSubtaskInput() {
  const input = document.querySelector("[data-subtasks] input");
  const ul = document.querySelector(".subtasks__list");
  if (!input || !ul) return;
  
  input.addEventListener("keydown", e => handleSubtaskEnter(e, input, ul));
}


/**
 * Validates form required fields
 * @param {HTMLFormElement} form - Form element
 * @returns {boolean}
 */
function validateFormRequiredFields(form) {
  const title = form.querySelector('[name="title"]')?.value.trim();
  const due = form.querySelector('[name="due"]')?.value.trim();
  const category = form.querySelector('[name="category"]')?.value;
  
  if (!title) {
    alert('Please enter a title');
    return false;
  }
  if (!due) {
    alert('Please select a due date');
    return false;
  }
  if (!category) {
    alert('Please select a category');
    return false;
  }
  return true;
}


/**
 * Handles cancel button click
 */
function handleCancelClick() {
  document.getElementById("at-modal")?.classList.remove("is-open");
  hideOverlay();
}


/**
 * Handles create button click
 * @param {Event} e - Click event
 */
function handleCreateClick(e) {
  const form = beGetForm();
  if (!form || form.dataset.editingId) return;
  
  if (!validateFormRequiredFields(form)) {
    e.preventDefault();
  }
}


/**
 * Binds add task form buttons
 */
function bindAddTaskButtons() {
  document.getElementById("at-cancel")?.addEventListener("click", handleCancelClick);
  document.getElementById("at-create")?.addEventListener("click", handleCreateClick);
}


/**
 * Creates type hidden input
 * @returns {HTMLInputElement}
 */
function createTypeHiddenInput() {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'type';
  input.value = 'story';
  return input;
}


/**
 * Updates type based on category
 * @param {HTMLSelectElement} categorySelect - Category select
 * @param {HTMLInputElement} typeInput - Type input
 */
function updateTypeFromCategory(categorySelect, typeInput) {
  typeInput.value = categorySelect.value === 'Technical Task' ?
    'technical' : 'story';
}


/**
 * Sets up category change listener
 * @param {HTMLFormElement} form - Form element
 */
function setupCategoryListener(form) {
  const cat = form.querySelector('[name="category"]');
  let typeHidden = form.querySelector('[name="type"]');
  
  if (!typeHidden) {
    typeHidden = createTypeHiddenInput();
    form.appendChild(typeHidden);
  }
  
  cat?.addEventListener('change', () => {
    updateTypeFromCategory(cat, typeHidden);
  });
}


/**
 * Wires add task form
 */
function wireAddTaskForm() {
  bindPriorityButtons();
  bindSubtaskInput();
  bindAddTaskButtons();
  
  const form = beGetForm();
  if (form) {
    setupCategoryListener(form);
  }
}


/**
 * Handles overlay click
 * @param {Event} e - Click event
 */
function handleOverlayClick(e) {
  if (e.target?.id === "at-overlay") {
    closeAllOpenModals();
  }
}


/**
 * Handles escape key
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscapeKey(e) {
  if (e.key === "Escape") {
    closeAllOpenModals();
  }
}


/**
 * Binds global modal events
 */
function bindGlobalModalEvents() {
  document.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKey);
}


/**
 * Creates task card HTML
 * @param {Object} task - Task data
 * @returns {string}
 */
function createTaskCardHTML(task) {
  return `
    <div class="task-category" style="background:${task.category.color}">
      ${task.category.name}
    </div>
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p><b>Due:</b> ${task.dueDate}</p>
    <p><b>Priority:</b> ${task.priority}</p>
  `;
}