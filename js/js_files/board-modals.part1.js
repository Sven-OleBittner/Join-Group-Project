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