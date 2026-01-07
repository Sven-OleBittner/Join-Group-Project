/**
 * Task categories configuration
 * @type {Array<{name: string, color: string}>}
 */
const categories = [
  { name: "Technical Task", color: "#6c8cff" },
  { name: "User Story", color: "#8fd58a" },
];


/**
 * Selected items state
 * @type {Object}
 */
const selected = {
  contacts: new Set(),
  category: null
};


/**
 * Initializes flatpickr date picker
 */
function initializeDatePicker() {
  if (window.flatpickr) {
    flatpickr('#due-date', { dateFormat: 'd/m/Y' });
  }
}


/**
 * Sets up priority button selection
 */
function setupPriorityButtons() {
  document.querySelectorAll('.priority').forEach((btn) => {
    btn.addEventListener('click', () => selectPriorityButton(btn));
  });
}


/**
 * Selects specific priority button
 * @param {HTMLElement} btn - Button to select
 */
function selectPriorityButton(btn) {
  document.querySelectorAll('.priority').forEach((b) => {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
}


/**
 * Renders contact options in dropdown
 */
async function renderContacts() {
  const menu = document.querySelector('.dropdown.assigned-to .dropdown-menu');
  if (!menu) return;

  menu.innerHTML = '';
  const contactsData = await getData('contacts');
  const contactsArr = contactsData ? Object.values(contactsData) : [];
  
  contactsArr.forEach((contact, idx) => {
    const row = createContactOption(contact, idx);
    menu.appendChild(row);
  });
}


/**
 * Creates single contact option element
 * @param {Object} contact - Contact data
 * @param {number} idx - Contact index
 * @returns {HTMLElement}
 */
function createContactOption(contact, idx) {
  const row = document.createElement('label');
  row.className = 'contact-option';

  const avatar = createContactAvatar(contact);
  const name = createContactName(contact);
  const checkbox = createContactCheckbox(idx);

  row.appendChild(avatar);
  row.appendChild(name);
  row.appendChild(checkbox);
  
  return row;
}


/**
 * Creates contact avatar element
 * @param {Object} contact - Contact data
 * @returns {HTMLElement}
 */
function createContactAvatar(contact) {
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.style.backgroundColor = contact.color;
  avatar.textContent = contact.initials;
  return avatar;
}


/**
 * Creates contact name element
 * @param {Object} contact - Contact data
 * @returns {HTMLElement}
 */
function createContactName(contact) {
  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = contact.name;
  return name;
}


/**
 * Creates contact checkbox
 * @param {number} idx - Contact index
 * @returns {HTMLInputElement}
 */
function createContactCheckbox(idx) {
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.addEventListener('change', () => handleContactChange(cb, idx));
  return cb;
}


/**
 * Handles contact checkbox change
 * @param {HTMLInputElement} cb - Checkbox element
 * @param {number} idx - Contact index
 */
function handleContactChange(cb, idx) {
  if (cb.checked) {
    selected.contacts.add(idx);
  } else {
    selected.contacts.delete(idx);
  }
  updateAssignedChips();
}


/**
 * Renders category options in dropdown
 */
function renderCategories() {
  const menu = document.querySelector('.dropdown.category-select .dropdown-menu');
  if (!menu) return;

  menu.innerHTML = '';
  categories.forEach((cat, idx) => {
    const row = createCategoryOption(cat, idx, menu);
    menu.appendChild(row);
  });
}


/**
 * Creates single category option element
 * @param {Object} cat - Category data
 * @param {number} idx - Category index
 * @param {HTMLElement} menu - Parent menu element
 * @returns {HTMLElement}
 */
function createCategoryOption(cat, idx, menu) {
  const row = document.createElement('label');
  row.className = 'category-option';

  const dot = createCategoryDot(cat);
  const name = createCategoryName(cat);
  const checkbox = createCategoryCheckbox(idx, menu);

  row.appendChild(dot);
  row.appendChild(name);
  row.appendChild(checkbox);
  
  return row;
}


/**
 * Creates category color dot
 * @param {Object} cat - Category data
 * @returns {HTMLElement}
 */
function createCategoryDot(cat) {
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.backgroundColor = cat.color;
  return dot;
}


/**
 * Creates category name element
 * @param {Object} cat - Category data
 * @returns {HTMLElement}
 */
function createCategoryName(cat) {
  const name = document.createElement('span');
  name.className = 'name';
  name.textContent = cat.name;
  return name;
}


/**
 * Creates category checkbox
 * @param {number} idx - Category index
 * @param {HTMLElement} menu - Parent menu element
 * @returns {HTMLInputElement}
 */
function createCategoryCheckbox(idx, menu) {
  const cb = document.createElement('input');
  cb.type = 'checkbox';
  cb.addEventListener('change', () => handleCategoryChange(cb, idx, menu));
  return cb;
}


/**
 * Handles category checkbox change
 * @param {HTMLInputElement} cb - Checkbox element
 * @param {number} idx - Category index
 * @param {HTMLElement} menu - Parent menu element
 */
function handleCategoryChange(cb, idx, menu) {
  if (cb.checked) {
    selected.category = idx;
    deselectOtherCategories(cb, menu);
  } else {
    selected.category = null;
  }
  updateCategoryChip();
}


/**
 * Deselects other category checkboxes
 * @param {HTMLInputElement} currentCb - Current checkbox
 * @param {HTMLElement} menu - Parent menu element
 */
function deselectOtherCategories(currentCb, menu) {
  menu.querySelectorAll('input[type="checkbox"]').forEach((other) => {
    if (other !== currentCb) other.checked = false;
  });
}


/**
 * Sets up dropdown toggle listeners
 */
function setupDropdownToggles() {
  document.querySelectorAll('.dropdown.full-expandable').forEach((dd) => {
    const toggle = dd.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => handleDropdownToggle(e, dd));
  });
}


/**
 * Handles dropdown toggle click
 * @param {Event} e - Click event
 * @param {HTMLElement} dd - Dropdown element
 */
function handleDropdownToggle(e, dd) {
  e.stopPropagation();
  dd.classList.toggle('open');
}


/**
 * Ensures chip containers exist
 */
function ensureChipsContainers() {
  ensureAssignedChipsContainer();
  ensureCategoryChipsContainer();
}


/**
 * Ensures assigned chips container exists
 */
function ensureAssignedChipsContainer() {
  const assignedDD = document.querySelector('.dropdown.assigned-to');
  if (assignedDD && !document.querySelector('.assigned-chips')) {
    const wrap = createChipsContainer('assigned-chips');
    assignedDD.insertAdjacentElement('afterend', wrap);
  }
}


/**
 * Ensures category chips container exists
 */
function ensureCategoryChipsContainer() {
  const categoryDD = document.querySelector('.dropdown.category-select');
  if (categoryDD && !document.querySelector('.category-chips')) {
    const wrap = createChipsContainer('category-chips');
    categoryDD.insertAdjacentElement('afterend', wrap);
  }
}


/**
 * Creates chips container element
 * @param {string} className - Container class name
 * @returns {HTMLElement}
 */
function createChipsContainer(className) {
  const wrap = document.createElement('div');
  wrap.className = `chips ${className}`;
  wrap.style.display = 'flex';
  return wrap;
}


/**
 * Updates assigned contact chips display
 */
async function updateAssignedChips() {
  const box = document.querySelector('.assigned-chips');
  if (!box) return;
  
  box.innerHTML = '';
  const contactsData = await getData('contacts');
  const contactsArr = contactsData ? Object.values(contactsData) : [];
  
  contactsArr.forEach((contact, idx) => {
    if (selected.contacts.has(idx)) {
      const chip = createAssignedChip(contact);
      box.appendChild(chip);
    }
  });
}


/**
 * Creates assigned contact chip
 * @param {Object} contact - Contact data
 * @returns {HTMLElement}
 */
function createAssignedChip(contact) {
  const chip = document.createElement('div');
  chip.className = 'avatar-chip';
  chip.style.backgroundColor = contact.color;
  chip.textContent = contact.initials;
  return chip;
}


/**
 * Updates category chip display
 */
function updateCategoryChip() {
  const box = document.querySelector('.category-chips');
  if (!box) return;
  
  box.innerHTML = '';
  if (selected.category === null) return;

  const cat = categories[selected.category];
  const chip = createCategoryChip(cat);
  box.appendChild(chip);
}


/**
 * Creates category chip element
 * @param {Object} cat - Category data
 * @returns {HTMLElement}
 */
function createCategoryChip(cat) {
  const chip = document.createElement('div');
  chip.className = 'category-chip';

  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.style.backgroundColor = cat.color;

  const label = document.createElement('span');
  label.textContent = cat.name;

  chip.appendChild(dot);
  chip.appendChild(label);
  
  return chip;
}


/**
 * Sets up subtask input functionality
 */
function setupSubtasks() {
  const input = document.getElementById('subtask-input');
  const plus = document.getElementById('subtask-add-icon');
  const cancel = document.getElementById('subtask-cancel-icon');
  const confirm = document.getElementById('subtask-confirm-icon');
  
  if (!input || !plus || !cancel || !confirm) return;

  input.addEventListener('input', () => handleSubtaskInput(input, plus, cancel, confirm));
  cancel.addEventListener('click', () => handleSubtaskCancel(input, plus, cancel, confirm));
  confirm.addEventListener('click', () => handleSubtaskConfirm(input, plus, cancel, confirm));
}


/**
 * Handles subtask input change
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} plus - Plus icon
 * @param {HTMLElement} cancel - Cancel icon
 * @param {HTMLElement} confirm - Confirm icon
 */
function handleSubtaskInput(input, plus, cancel, confirm) {
  const hasText = input.value.trim() !== '';
  plus.style.display = hasText ? 'none' : 'inline';
  cancel.style.display = hasText ? 'inline' : 'none';
  confirm.style.display = hasText ? 'inline' : 'none';
}


/**
 * Handles subtask cancel click
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} plus - Plus icon
 * @param {HTMLElement} cancel - Cancel icon
 * @param {HTMLElement} confirm - Confirm icon
 */
function handleSubtaskCancel(input, plus, cancel, confirm) {
  input.value = '';
  plus.style.display = 'inline';
  cancel.style.display = 'none';
  confirm.style.display = 'none';
}


/**
 * Handles subtask confirm click
 * @param {HTMLInputElement} input - Input element
 * @param {HTMLElement} plus - Plus icon
 * @param {HTMLElement} cancel - Cancel icon
 * @param {HTMLElement} confirm - Confirm icon
 */
function handleSubtaskConfirm(input, plus, cancel, confirm) {
  const value = input.value.trim();
  if (!value) return;
  
  console.log('Subtask added:', value);
  input.value = '';
  plus.style.display = 'inline';
  cancel.style.display = 'none';
  confirm.style.display = 'none';
}


/**
 * Gets input value by ID
 * @param {string} id - Element ID
 * @returns {string}
 */
function getInputValue(id) {
  return document.getElementById(id)?.value.trim() || '';
}


/**
 * Gets selected priority
 * @returns {string}
 */
function getSelectedPriority() {
  return document.querySelector('.priority.selected')?.classList[1] || '';
}


/**
 * Validates required fields
 * @returns {boolean}
 */
function validateRequiredFields() {
  const title = getInputValue('title');
  const dueDate = getInputValue('due-date');
  
  if (!title || !dueDate || selected.category === null) {
    alert('Fill all required fields');
    return false;
  }
  return true;
}


/**
 * Creates task object from form data
 * @returns {Object}
 */
async function createTaskObject() {
  const contactsData = await getData('contacts');
  const contactsArr = contactsData ? Object.values(contactsData) : [];
  
  return {
    id: Date.now(),
    title: getInputValue('title'),
    description: getInputValue('description'),
    dueDate: getInputValue('due-date'),
    priority: getSelectedPriority(),
    category: categories[selected.category],
    assigned: [...selected.contacts].map(i => contactsArr[i]),
    status: 'todo'
  };
}


/**
 * Saves task to localStorage
 * @param {Object} task - Task object
 */
function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Handles create button click
 * @param {Event} e - Click event
 */
async function handleCreateTask(e) {
  e.preventDefault();
  
  if (!validateRequiredFields()) return;
  
  const task = await createTaskObject();
  saveTaskToStorage(task);
  location.href = 'board.html';
}


/**
 * Sets up create button listener
 */
function setupCreateButton() {
  const createBtn = document.querySelector('.create-btn');
  if (createBtn) {
    createBtn.addEventListener('click', handleCreateTask);
  }
}


/**
 * Checks if viewport is mobile
 * @returns {boolean}
 */
function isMobile() {
  return window.innerWidth <= 945;
}


/**
 * Toggles help elements visibility
 * @param {boolean} mobile - Is mobile viewport
 */
function toggleHelpElements(mobile) {
  const helpEls = document.querySelectorAll(
    '.header .help, .header .help-icon, .header [aria-label="Help"], .header button[title="Help"], .header .question-mark'
  );
  
  helpEls.forEach(el => {
    el.style.display = mobile ? 'none' : '';
  });
}


/**
 * Toggles brand logo visibility
 * @param {boolean} mobile - Is mobile viewport
 */
function toggleBrandLogo(mobile) {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let brand = header.querySelector('.brand');
  
  if (mobile && !brand) {
    brand = createBrandElement();
    header.insertBefore(brand, header.firstChild);
  } else if (!mobile && brand) {
    header.removeChild(brand);
  }
}


/**
 * Creates brand logo element
 * @returns {HTMLElement}
 */
function createBrandElement() {
  const brand = document.createElement('div');
  brand.className = 'brand';
  
  const img = document.createElement('img');
  img.className = 'brand-logo';
  img.alt = 'Logo';
  img.src = 'assets/img/Capa 2.svg';
  img.style.width = '45px';
  
  brand.appendChild(img);
  return brand;
}


/**
 * Checks and updates mobile layout
 */
function checkMobileLayout() {
  const mobile = isMobile();
  toggleHelpElements(mobile);
  toggleBrandLogo(mobile);
}


/**
 * Initializes mobile layout handler
 */
function initializeMobileLayout() {
  checkMobileLayout();
  window.addEventListener('resize', checkMobileLayout);
}


/**
 * Main initialization function
 */
async function initializeAddTask() {
  initializeDatePicker();
  setupPriorityButtons();
  await renderContacts();
  renderCategories();
  setupDropdownToggles();
  ensureChipsContainers();
  setupSubtasks();
  setupCreateButton();
  initializeMobileLayout();
}


document.addEventListener('DOMContentLoaded', initializeAddTask);