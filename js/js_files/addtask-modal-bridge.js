/**
 * Add event listener safely
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
  return s.replace(/[&<>"']/g, m => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[m]));
}


/**
 * Creates subtask list item
 * @param {string} text - Subtask text
 * @returns {HTMLLIElement}
 */
function createSubtaskItem(text) {
  const li = document.createElement('li');
  const cb = document.createElement('input'); 
  cb.type = 'checkbox';
  const span = document.createElement('span'); 
  span.textContent = text;
  li.append(cb, span);
  return li;
}


/**
 * Initializes priority selection
 * @param {HTMLElement} root - Root element
 */
function initPriority(root) {
  const group = root.querySelector('[data-priority]'); 
  if (!group) return;
  const btns = Array.from(group.querySelectorAll('.priority__btn'));
  
  const select = (btn) => {
    btns.forEach(b => b.classList.remove('selected','priority__btn--active'));
    btn.classList.add('selected','priority__btn--active');
    const hidden = group.querySelector('input[name="priority"]');
    if (hidden) hidden.value = btn.dataset.value || 'medium';
    const out = root.querySelector('#td-prio-text');
    if (out) out.textContent = btn.dataset.value || '—';
  };
  
  btns.forEach(b => on(b, 'click', () => select(b)));
  
  if (!btns.some(b => b.classList.contains('selected') || 
      b.classList.contains('priority__btn--active'))) {
    const mediumBtn = btns.find(b => b.dataset.value === 'medium') || btns[1];
    if(mediumBtn) select(mediumBtn);
  }
}


/**
 * Initializes subtasks input
 * @param {HTMLElement} root - Root element
 */
function initSubtasks(root) {
  const box = root.querySelector('[data-subtasks]'); 
  if (!box) return;
  const input = box.querySelector('input.input, input[type="text"]');
  const list = box.querySelector('.subtasks__list'); 
  if (!input || !list) return;
  
  on(input, 'keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    const v = input.value.trim(); 
    if (!v) return;
    list.appendChild(createSubtaskItem(escapeHtml(v)));
    input.value = '';
  });
}


/**
 * Initializes date picker
 * @param {HTMLElement} root - Root element
 */
function initDate(root) {
  const input = root.querySelector('input[type="date"], #due-date'); 
  if (!input) return;
  if (window.flatpickr && !input.dataset.fp) {
    input.type = 'text'; 
    input.placeholder = 'dd/mm/yyyy'; 
    input.dataset.fp = '1';
    window.flatpickr(input, { dateFormat: 'd/m/Y' });
  }
}


/**
 * Initializes preview bindings
 * @param {HTMLElement} root - Root element
 */
function initPreviewBindings(root) {
  const t = root.querySelector('input[name="title"], #title');
  const d = root.querySelector('textarea[name="description"], #description');
  const due = root.querySelector('input[name="due"], #due-date');
  const outT = document.querySelector('#td-title');
  const outD = document.querySelector('#td-desc');
  const outDue = document.querySelector('#td-due');
  
  if (t && outT) on(t, 'input', () => (outT.textContent = t.value));
  if (d && outD) on(d, 'input', () => (outD.textContent = d.value));
  if (due && outDue) on(due, 'input', () => {
    const m = due.value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    outDue.textContent = m ? `${m[3]}/${m[2]}/${m[1]}` : (due.value || '—');
  });
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
 * Handles form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
  e.preventDefault();
  const f = document.getElementById('taskForm'); 
  if (!f) return;
  
  const q = (n) => f.querySelector(`[name="${n}"]`);
  const title = q('title')?.value.trim() || '';
  const description = q('description')?.value.trim() || '';
  const due = q('due')?.value || '';
  const category = q('category')?.value || '';
  const priority = q('priority')?.value || 'medium';
  
  if (!title || !due || !category) {
    alert('Please fill in all required fields');
    return;
  }
  
  const [Y, M, D] = due.split('-');
  const task = {
    id: Date.now(),
    title, 
    description,
    dueDate: `${D}/${M}/${Y}`,
    priority,
    category: { 
      name: category, 
      color: category==='Technical Task'?'#6c8cff':
             category==='User Story'?'#8fd58a':'#999' 
    },
    assigned: [], 
    status: 'todo'
  };
  
  const arr = JSON.parse(localStorage.getItem('tasks') || '[]');
  arr.push(task); 
  localStorage.setItem('tasks', JSON.stringify(arr));
  
  document.getElementById('at-close')?.click();
}


/**
 * Sets chip color in details modal
 */
function setChipColor() {
  const chip = document.getElementById('td-chip'); 
  if (!chip) return;
  const t = chip.textContent.trim().toLowerCase();
  chip.classList.remove('td-chip--story', 'td-chip--technical');
  if (t.includes('user')) chip.classList.add('td-chip--story');
  if (t.includes('technical')) chip.classList.add('td-chip--technical');
}


/**
 * Opens edit modal with prefilled data
 */
function openEditModal() {
  const take = (id) => (document.getElementById(id)?.textContent || '').trim();
  
  document.getElementById('td-modal')?.classList.remove('is-open');
  document.getElementById('at-modal')?.classList.add('is-open');
  document.getElementById('at-overlay')?.classList.add('is-open');
  
  const fill = (n, v) => { 
    const el = document.querySelector(`[name="${n}"]`); 
    if (el) el.value = v; 
  };
  
  fill('title', take('td-title')); 
  fill('description', take('td-desc'));
  fill('due', take('td-due'));
  
  const cat = document.querySelector('#category .placeholder'); 
  if (cat) cat.textContent = take('td-chip');
}


/**
 * Gets add task modal root
 * @returns {HTMLElement|null}
 */
function ddr(){ 
  return document.getElementById('at-modal'); 
}


/**
 * Closes all dropdowns
 */
function ddClsAll(){
  const r = ddr(); 
  if (!r) return;
  r.querySelectorAll('.dropdown.full-expandable.open')
   .forEach(x => x.classList.remove('open'));
}


/**
 * Opens specific dropdown
 * @param {HTMLElement} drop - Dropdown element
 */
function ddOpen(drop){
  if (!drop) return; 
  ddClsAll(); 
  drop.classList.add('open');
}


/**
 * Handles dropdown toggle click
 * @param {Event} e - Click event
 */
function ddOnToggle(e){
  const t = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  const r = ddr(); 
  if (!t || !r || !r.contains(t)) return;
  e.stopPropagation(); 
  e.preventDefault();
  const d = t.closest('.dropdown.full-expandable');
  d.classList.contains('open') ? ddClsAll() : ddOpen(d);
}


/**
 * Handles click outside dropdowns
 * @param {Event} e - Click event
 */
function ddOnClickOutside(e){
  const r = ddr(); 
  if (!r) return;
  if (!e.target.closest('.dropdown.full-expandable')) ddClsAll();
}


/**
 * Handles keyboard events for dropdowns
 * @param {KeyboardEvent} e - Keyboard event
 */
function ddOnKeys(e){
  if (e.key === 'Escape') ddClsAll();
  const t = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  if (t && (e.key === ' ' || e.key === 'Enter')) { 
    e.preventDefault(); 
    t.click(); 
  }
}


/**
 * Adds 3D hover effect to priority buttons
 */
function add3DHoverEffect() {
  document.querySelectorAll('.td-modal .priority__btn').forEach(b => {
    b.addEventListener('mouseenter', () => {
      b.style.transform = 'translateY(-2px)';
      b.style.boxShadow = '0 6px 14px rgba(0,0,0,.16)';
    });
    b.addEventListener('mouseleave', () => {
      b.style.transform = ''; 
      b.style.boxShadow = '';
    });
  });
}


/**
 * Main initialization
 */
function initBridge(){
  if(window.__bridgeInit) return;
  window.__bridgeInit = true;
  
  const f = document.getElementById('taskForm');
  if (f) f.addEventListener('submit', handleFormSubmit);
  
  document.addEventListener('click', (e) => {
    const open = e.target.closest('.kb-add-btn, .kb-col-add, #at-open, [data-open-addtask]');
    if (open) {
      setTimeout(() => {
        const dlg = document.querySelector('#at-modal .at-dialog') || document;
        initAddTaskModal(dlg);
      }, 0);
    }
  });
  
  document.addEventListener('click', e => {
    if (e.target.closest('.kb-card,[data-open-task-details]')) {
      setTimeout(setChipColor, 0);
    }
  });
  
  document.addEventListener('click', (e) => {
    if (e.target.closest('#td-edit')) { 
      e.preventDefault(); 
      openEditModal(); 
    }
  });
  
  document.addEventListener('click', ddOnToggle, true);
  document.addEventListener('click', ddOnClickOutside);
  document.addEventListener('keydown', ddOnKeys);
  
  const dlg = document.querySelector('#at-modal .at-dialog');
  if (dlg) initAddTaskModal(dlg);
  
  if (window.flatpickr) {
    const dueDateInput = document.querySelector('#due-date');
    if(dueDateInput) flatpickr(dueDateInput, { dateFormat: 'd/m/Y' });
  }
  
  add3DHoverEffect();
}


if (document.readyState==="loading") {
  document.addEventListener("DOMContentLoaded", initBridge, {once:true});
} else {
  initBridge();
}