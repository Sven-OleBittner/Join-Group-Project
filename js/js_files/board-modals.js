/**
 * Checks if viewport is desktop
 * @returns {boolean}
 */
function isDesktopViewport() {
  return isDesktop();
}


/**
 * Opens add task view based on viewport
 */
function openAddTaskView() {
  if (isDesktopViewport() && window.openAddTaskPopup) {
    openAddTaskPopup();
  } else {
    triggerAddTaskPopup();
  }
}


/**
 * Binds click events to add task buttons
 */
function bindAddTaskTriggers() {
  document.querySelectorAll(".kb-add-btn,.kb-col-add")
    .forEach(btn => btn.addEventListener("click", handleAddTaskClick));
}


/**
 * Handles add task button click
 * @param {Event} e - Click event
 */
function handleAddTaskClick(e) {
  e.preventDefault();
  openAddTaskView();
}


/**
 * Triggers navigation to add task page
 */
function triggerAddTaskPopup() {
  document.dispatchEvent(new CustomEvent("open-add-task"));
  setTimeout(() => location.href = "add_task.html", 0);
}


/**
 * Checks if element is interactive
 * @param {Element} el - Element to check
 * @returns {boolean}
 */
function isElementInteractive(el) {
  return isInteractive(el);
}


/**
 * Gets clicked card element
 * @param {Element} target - Click target
 * @returns {HTMLElement|null}
 */
function getClickedCard(target) {
  return target instanceof Element ? target.closest(".kb-card") : null;
}


/**
 * Ensures card has ID
 * @param {HTMLElement} card - Card element
 */
function ensureCardHasId(card) {
  if (!card.dataset.id) {
    card.dataset.id = "kb_" + Math.random().toString(36).slice(2, 9);
  }
}


/**
 * Sets current details card ID
 * @param {string} id - Card ID
 */
function setCurrentDetailsCardId(id) {
  window.__beCurrentDetailsCardId = id;
}


/**
 * Opens details with card data
 * @param {Object} data - Card data
 */
function openCardDetails(data) {
  openDetails(data.type, data);
}


/**
 * Handles card click
 * @param {HTMLElement} card - Card element
 */
function handleCardClick(card) {
  ensureCardHasId(card);
  setCurrentDetailsCardId(card.dataset.id);
  
  const data = collectCardData(card);
  openCardDetails(data);
}


/**
 * Binds card click events for details modal
 */
function bindCardPopups() {
  const wrap = document.querySelector(".kb-columns");
  if (!wrap) return;
  
  wrap.addEventListener("click", e => {
    const target = e.target;
    
    if (isElementInteractive(target)) return;
    
    const card = getClickedCard(target);
    if (!card || !wrap.contains(card)) return;
    
    handleCardClick(card);
  });
}


/**
 * Wires add task modal events
 */
function wireAddTaskModal() {
  const modal = document.getElementById("at-modal");
  if (!modal) return;
  
  window.openAddTaskPopup = () => {
    showOverlay();
    modal.classList.add("is-open");
  };
  
  document.getElementById("at-close")?.addEventListener("click", () => {
    modal.classList.remove("is-open");
    hideOverlay();
  });
}


/**
 * Sets chip class based on type
 * @param {HTMLElement} el - Chip element
 * @param {string} type - Task type
 */
function setChipClass(el, type) {
  el.className = "td-chip " + (type === "technical" ?
    "td-chip--technical" : "td-chip--story");
}


/**
 * Sets chip text based on type
 * @param {HTMLElement} el - Chip element
 * @param {string} type - Task type
 */
function setChipTextContent(el, type) {
  el.textContent = type === "technical" ?
    "Technical Task" : "User Story";
}


/**
 * Sets chip type in details modal
 * @param {string} type - Task type
 */
function setChip(type) {
  const el = document.getElementById("td-chip");
  if (!el) return;
  
  setChipClass(el, type);
  setChipTextContent(el, type);
}


/**
 * Capitalizes first letter
 * @param {string} str - String to capitalize
 * @returns {string}
 */
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}


/**
 * Sets priority text
 * @param {string} prio - Priority level
 */
function setPriorityText(prio) {
  const txt = document.getElementById("td-prio-text");
  if (txt) {
    txt.textContent = capitalize(prio);
  }
}


/**
 * Creates priority icon image
 * @param {string} prio - Priority level
 * @returns {HTMLImageElement}
 */
function createPriorityIcon(prio) {
  const img = document.createElement("img");
  img.className = "td-prio-img";
  img.alt = "Priority";
  setIconWithFallback(img, ICONS.prio[prio] || ICONS.prio.medium);
  return img;
}


/**
 * Sets priority icon
 * @param {string} prio - Priority level
 */
function setPriorityIcon(prio) {
  const box = document.getElementById("td-prio-icon");
  if (!box) return;
  
  box.innerHTML = "";
  const img = createPriorityIcon(prio);
  box.appendChild(img);
}


/**
 * Sets priority display
 * @param {string} prio - Priority level
 */
function setPriority(prio) {
  setPriorityText(prio);
  setPriorityIcon(prio);
}


/**
 * Finds contact by initials
 * @param {string} initials - Contact initials
 * @returns {Object|null}
 */
function findContact(initials) {
  return contacts.find(c => c.initials === initials);
}


/**
 * Creates assignee circle
 * @param {string} initials - Contact initials
 * @param {string} name - Contact name
 * @returns {HTMLElement}
 */
function createAssigneeCircle(initials, name) {
  return personCircle(initials, name);
}


/**
 * Appends assignee to box
 * @param {HTMLElement} box - Container element
 * @param {string} initials - Contact initials
 */
function appendAssignee(box, initials) {
  const person = findContact(initials);
  if (person) {
    const circle = createAssigneeCircle(initials, person.name);
    box.appendChild(circle);
  }
}


/**
 * Sets assignees in details modal
 * @param {string[]} list - Array of initials
 */
function setAssignees(list) {
  const box = document.getElementById("td-assignees");
  if (!box) return;
  
  box.innerHTML = "";
  (list || []).forEach(initials => appendAssignee(box, initials));
}


/**
 * Creates subtask list item
 * @param {string} text - Subtask text
 * @returns {HTMLLIElement}
 */
function createSubtaskListItem(text) {
  const li = document.createElement("li");
  li.className = "td-task";
  
  const button = document.createElement("button");
  button.type = "button";
  button.className = "td-checkbox";
  
  const span = document.createElement("span");
  span.className = "td-task__label";
  span.textContent = text;
  
  li.append(button, span);
  return li;
}


/**
 * Appends subtasks to list
 * @param {HTMLElement} ul - List element
 * @param {string[]} subtasks - Subtasks array
 */
function appendSubtasks(ul, subtasks) {
  subtasks.forEach(text => {
    const li = createSubtaskListItem(text);
    ul.appendChild(li);
  });
}


/**
 * Shows subtasks block
 * @param {HTMLElement} block - Block element
 * @param {HTMLElement} ul - List element
 * @param {string[]} list - Subtasks array
 */
function showSubtasksBlock(block, ul, list) {
  ul.innerHTML = "";
  appendSubtasks(ul, list);
  block.hidden = false;
}


/**
 * Hides subtasks block
 * @param {HTMLElement} block - Block element
 */
function hideSubtasksBlock(block) {
  block.hidden = true;
}


/**
 * Sets subtasks list
 * @param {string[]} list - Array of subtasks
 */
function setSubtasks(list) {
  const block = document.getElementById("td-subtasks");
  const ul = document.getElementById("td-subtasks-list");
  
  if (!block || !ul) return;
  
  if (!list?.length) {
    hideSubtasksBlock(block);
  } else {
    showSubtasksBlock(block, ul, list);
  }
}


/**
 * Toggles subtask checkbox
 * @param {HTMLElement} checkbox - Checkbox element
 */
function toggleSubtaskCheckbox(checkbox) {
  checkbox.classList.toggle("is-checked");
  checkbox.parentElement?.classList.toggle("is-done");
}


/**
 * Binds subtask checkbox toggles
 */
function bindSubtaskToggles() {
  const ul = document.getElementById("td-subtasks-list");
  if (!ul) return;
  
  ul.addEventListener("click", e => {
    const checkbox = e.target.closest(".td-checkbox");
    if (checkbox) {
      toggleSubtaskCheckbox(checkbox);
    }
  });
}


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


/**
 * Creates task card element
 * @param {Object} task - Task data
 * @returns {HTMLElement}
 */
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.innerHTML = createTaskCardHTML(task);
  return card;
}


/**
 * Renders tasks in container
 * @param {HTMLElement} container - Container element
 * @param {Array} tasks - Tasks array
 */
function renderTasksInContainer(container, tasks) {
  tasks.forEach(task => {
    const card = createTaskCard(task);
    container.appendChild(card);
  });
}


/**
 * Loads tasks into board
 */
function loadTasksIntoBoard() {
  const container = document.getElementById('task-board');
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  if (container) {
    renderTasksInContainer(container, tasks);
  }
}


/**
 * Main board initialization
 */
function initBoard() {
  initStaticIcons();
  renderAvatars();
  bindAddTaskTriggers();
  bindCardPopups();
  wireAddTaskModal();
  wireTaskDetailsModal();
  wireAddTaskForm();
  bindSubtaskToggles();
  bindGlobalModalEvents();
  loadTasksIntoBoard();
}


window.addEventListener("DOMContentLoaded", initBoard);