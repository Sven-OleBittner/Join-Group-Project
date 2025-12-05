/**
 * Adds event listener safely
 * @param {HTMLElement} el - Element
 * @param {string} evt - Event name
 * @param {Function} fn - Handler function
 */
const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

/**
 * Escapes HTML special characters
 * @param {string} s - String to escape
 * @returns {string}
 */
function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m])
  );
}

/**
 * Creates subtask list item
 * @param {string} text - Subtask text
 * @returns {HTMLLIElement}
 */
function createSubtaskItem(text) {
  const li = document.createElement("li");
  const cb = document.createElement("input");
  cb.type = "checkbox";

  const span = document.createElement("span");
  span.textContent = text;

  li.append(cb, span);
  return li;
}

/**
 * Selects priority button
 * @param {HTMLElement} btn - Button to select
 * @param {HTMLElement[]} btns - All buttons
 * @param {HTMLElement} group - Button group
 * @param {HTMLElement} root - Root element
 */
function selectPriorityButton(btn, btns, group, root) {
  btns.forEach((b) => {
    b.classList.remove("selected", "priority__btn--active");
  });

  btn.classList.add("selected", "priority__btn--active");

  updatePriorityHiddenInput(btn, group);
  updatePriorityDisplay(btn, root);
}

/**
 * Updates priority hidden input value
 * @param {HTMLElement} btn - Selected button
 * @param {HTMLElement} group - Button group
 */
function updatePriorityHiddenInput(btn, group) {
  const hidden = group.querySelector('input[name="priority"]');
  if (hidden) {
    hidden.value = btn.dataset.value || "medium";
  }
}

/**
 * Updates priority display text
 * @param {HTMLElement} btn - Selected button
 * @param {HTMLElement} root - Root element
 */
function updatePriorityDisplay(btn, root) {
  const out = root.querySelector("#td-prio-text");
  if (out) {
    out.textContent = btn.dataset.value || "—";
  }
}

/**
 * Initializes priority selection
 * @param {HTMLElement} root - Root element
 */
function initPriority(root) {
  const group = root.querySelector("[data-priority]");
  if (!group) return;

  const btns = Array.from(group.querySelectorAll(".priority__btn"));

  btns.forEach((b) => {
    on(b, "click", () => selectPriorityButton(b, btns, group, root));
  });

  selectDefaultPriority(btns);
}

/**
 * Selects default medium priority
 * @param {HTMLElement[]} btns - Priority buttons
 */
function selectDefaultPriority(btns) {
  const hasSelected = btns.some(
    (b) =>
      b.classList.contains("selected") ||
      b.classList.contains("priority__btn--active")
  );

  if (!hasSelected) {
    const mediumBtn = btns.find((b) => b.dataset.value === "medium") || btns[1];
    if (mediumBtn) mediumBtn.click();
  }
}

/**
 * Handles subtask input keydown
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} list - List element
 */
function handleSubtaskKeydown(e, input, list) {
  if (e.key !== "Enter") return;

  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  list.appendChild(createSubtaskItem(escapeHtml(value)));
  input.value = "";
}

/**
 * Initializes subtasks input
 * @param {HTMLElement} root - Root element
 */
function initSubtasks(root) {
  const box = root.querySelector("[data-subtasks]");
  if (!box) return;

  const input = box.querySelector('input.input, input[type="text"]');
  const list = box.querySelector(".subtasks__list");
  if (!input || !list) return;

  on(input, "keydown", (e) => handleSubtaskKeydown(e, input, list));
}

/**
 * Initializes flatpickr on date input
 * @param {HTMLInputElement} input - Date input element
 */
function initializeFlatpickr(input) {
  if (window.flatpickr && !input.dataset.fp) {
    input.type = "text";
    input.placeholder = "dd/mm/yyyy";
    input.dataset.fp = "1";
    window.flatpickr(input, { dateFormat: "d/m/Y" });
  }
}

/**
 * Initializes date picker
 * @param {HTMLElement} root - Root element
 */
function initDate(root) {
  const input = root.querySelector('input[type="date"], #due-date');
  if (!input) return;

  initializeFlatpickr(input);
}

/**
 * Binds title input to preview
 * @param {HTMLElement} root - Root element
 */
function bindTitlePreview(root) {
  const input = root.querySelector('input[name="title"], #title');
  const output = document.querySelector("#td-title");

  if (input && output) {
    on(input, "input", () => (output.textContent = input.value));
  }
}

/**
 * Binds description input to preview
 * @param {HTMLElement} root - Root element
 */
function bindDescriptionPreview(root) {
  const input = root.querySelector(
    'textarea[name="description"], #description'
  );
  const output = document.querySelector("#td-desc");

  if (input && output) {
    on(input, "input", () => (output.textContent = input.value));
  }
}

/**
 * Formats date from ISO to display format
 * @param {string} isoDate - ISO format date
 * @returns {string}
 */
function formatDateForDisplay(isoDate) {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : isoDate || "—";
}

/**
 * Binds due date input to preview
 * @param {HTMLElement} root - Root element
 */
function bindDueDatePreview(root) {
  const input = root.querySelector('input[name="due"], #due-date');
  const output = document.querySelector("#td-due");

  if (input && output) {
    on(input, "input", () => {
      output.textContent = formatDateForDisplay(input.value);
    });
  }
}

/**
 * Initializes preview bindings
 * @param {HTMLElement} root - Root element
 */
function initPreviewBindings(root) {
  bindTitlePreview(root);
  bindDescriptionPreview(root);
  bindDueDatePreview(root);
}

/**
 * Initializes add task modal
 * @param {HTMLElement} root - Root element
 */
function initAddTaskModal(root) {
  initPriority(root);
  initSubtasks(root);
  initDate(root);
  initPreviewBindings(root);
}

/**
 * Gets form field value
 * @param {HTMLFormElement} form - Form element
 * @param {string} name - Field name
 * @returns {string}
 */
function getFormFieldValue(form, name) {
  return form.querySelector(`[name="${name}"]`)?.value.trim() || "";
}

/**
 * Gets category color by name
 * @param {string} category - Category name
 * @returns {string}
 */
function getCategoryColor(category) {
  if (category === "Technical Task") return "#6c8cff";
  if (category === "User Story") return "#8fd58a";
  return "#999";
}

/**
 * Formats date for task object
 * @param {string} isoDate - ISO format date
 * @returns {string}
 */
function formatTaskDate(isoDate) {
  const [Y, M, D] = isoDate.split("-");
  return `${D}/${M}/${Y}`;
}

/**
 * Creates task object from form
 * @param {HTMLFormElement} form - Form element
 * @returns {Object}
 */
function createTaskFromForm(form) {
  const title = getFormFieldValue(form, "title");
  const description = getFormFieldValue(form, "description");
  const due = getFormFieldValue(form, "due");
  const category = getFormFieldValue(form, "category");
  const priority = getFormFieldValue(form, "priority") || "medium";

  return {
    id: Date.now(),
    title,
    description,
    dueDate: formatTaskDate(due),
    priority,
    category: {
      name: category,
      color: getCategoryColor(category),
    },
    assigned: [],
    status: "todo",
  };
}

/**
 * Validates form required fields
 * @param {string} title - Task title
 * @param {string} due - Due date
 * @param {string} category - Category
 * @returns {boolean}
 */
function validateFormFields(title, due, category) {
  if (!title || !due || !category) {
    alert("Please fill in all required fields");
    return false;
  }
  return true;
}

/**
 * Saves task to localStorage
 * @param {Object} task - Task object
 */
function saveTask(task) {
  const arr = JSON.parse(localStorage.getItem("tasks") || "[]");
  arr.push(task);
  localStorage.setItem("tasks", JSON.stringify(arr));
}

/**
 * Handles form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = document.getElementById("taskForm");
  if (!form) return;

  const title = getFormFieldValue(form, "title");
  const due = getFormFieldValue(form, "due");
  const category = getFormFieldValue(form, "category");

  if (!validateFormFields(title, due, category)) return;

  const task = createTaskFromForm(form);
  saveTask(task);

  document.getElementById("at-close")?.click();
}

/**
 * Sets chip color based on text
 * @param {HTMLElement} chip - Chip element
 */
function applyChipColor(chip) {
  const text = chip.textContent.trim().toLowerCase();
  chip.classList.remove("td-chip--story", "td-chip--technical");

  if (text.includes("user")) {
    chip.classList.add("td-chip--story");
  }
  if (text.includes("technical")) {
    chip.classList.add("td-chip--technical");
  }
}

/**
 * Sets chip color in details modal
 */
function setChipColor() {
  const chip = document.getElementById("td-chip");
  if (!chip) return;

  applyChipColor(chip);
}
