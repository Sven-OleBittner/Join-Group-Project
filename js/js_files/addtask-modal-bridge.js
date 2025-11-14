(function () {
  /** Додати слухач лише якщо елемент існує. */
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);


  /** Ініціалізує вибір пріоритету (Urgent/Medium/Low).
   *  @param {HTMLElement} root
   */
  function initPriority(root) {
    const group = root.querySelector('[data-priority]'); if (!group) return;
    const btns = Array.from(group.querySelectorAll('.priority__btn'));
    const select = (btn) => {
      btns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const hidden = group.querySelector('input[name="priority"]');
      if (hidden) hidden.value = btn.dataset.value || 'medium';
      const out = root.querySelector('#td-prio-text');
      if (out) out.textContent = btn.dataset.value || '—';
    };
    btns.forEach(b => on(b, 'click', () => select(b)));
    if (!btns.some(b => b.classList.contains('selected'))) select(btns[0]);
  }


  /** Екранує потенційно небезпечні символи. */
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }


  /** Створює li для підзадачі без innerHTML.
   *  @param {string} text
   *  @returns {HTMLLIElement}
   */
  function createSubtaskItem(text) {
    const li = document.createElement('li');
    const cb = document.createElement('input'); cb.type = 'checkbox';
    const span = document.createElement('span'); span.textContent = text;
    li.append(cb, span);
    return li;
  }


  /** Ініціалізує додавання підзадач по Enter.
   *  @param {HTMLElement} root
   */
  function initSubtasks(root) {
    const box = root.querySelector('[data-subtasks]'); if (!box) return;
    const input = box.querySelector('input.input, input[type="text"]');
    const list = box.querySelector('.subtasks__list'); if (!input || !list) return;
    on(input, 'keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const v = input.value.trim(); if (!v) return;
      list.appendChild(createSubtaskItem(escapeHtml(v)));
      input.value = '';
    });
  }


  /** Вмикає flatpickr для дати дю-дейту, якщо доступний.
   *  @param {HTMLElement} root
   */
  function initDate(root) {
    const input = root.querySelector('input[type="date"]'); if (!input) return;
    if (window.flatpickr && !input.dataset.fp) {
      input.type = 'text'; input.placeholder = 'dd/mm/yyyy'; input.dataset.fp = '1';
      window.flatpickr(input, { dateFormat: 'd/m/Y' });
    }
  }


  /** Live-прев’ю заголовка/опису/дати у вікні деталей.
   *  @param {HTMLElement} root
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


  /** Комплексна ініціалізація модалки Add Task.
   *  @param {HTMLElement} root
   */
  function initAddTaskModal(root) {
    initPriority(root);
    initSubtasks(root);
    initDate(root);
    initPreviewBindings(root);
  }


  /** Лінива ініціалізація модалки при відкритті. */
  document.addEventListener('click', (e) => {
    const open = e.target.closest('.kb-add-btn, .kb-col-add, #at-open, [data-open-addtask]');
    if (!open) return;
    setTimeout(() => {
      const dlg = document.querySelector('#at-modal .at-dialog') || document;
      initAddTaskModal(dlg);
    }, 0);
  });


  /** Ініціалізуємо модалку, якщо вона вже у DOM. */
  document.addEventListener('DOMContentLoaded', () => {
    const dlg = document.querySelector('#at-modal .at-dialog');
    if (dlg) initAddTaskModal(dlg);
  });
})();




/** Обробляє submit форми Add Task та зберігає у localStorage. */
document.addEventListener('DOMContentLoaded', () => {
  const f = document.getElementById('taskForm'); if (!f) return;
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = (n) => f.querySelector(`[name="${n}"]`);
    const title = q('title')?.value.trim() || '';
    const description = q('description')?.value.trim() || '';
    const due = q('due')?.value || '';
    const category = q('category')?.value || '';
    const priority = q('priority')?.value || 'medium';
    if (!title || !due || !category) return alert('Please fill required');
    const [Y, M, D] = due.split('-');
    const task = {
      id: Date.now(),
      title, description,
      dueDate: `${D}/${M}/${Y}`,
      priority,
      category: { name: category, color: category==='Technical Task'?'#6c8cff':category==='User Story'?'#8fd58a':'#999' },
      assigned: [], status: 'todo'
    };
    const arr = JSON.parse(localStorage.getItem('tasks') || '[]');
    arr.push(task); localStorage.setItem('tasks', JSON.stringify(arr));
    document.getElementById('at-close')?.click();
  });
});




/** Початкові ініціалізації, що не конфліктують із дропдаунами. */
document.addEventListener('DOMContentLoaded', () => {
  if (window.flatpickr) flatpickr('#due-date', { dateFormat: 'd/m/Y' });
  // не викликаємо setupDropdownToggles(), щоб уникнути дублю лісенерів
  if (typeof renderContacts === 'function') renderContacts();
  if (typeof renderCategories === 'function') renderCategories();
  if (typeof ensureChipsContainers === 'function') ensureChipsContainers();
  if (typeof setupSubtasks === 'function') setupSubtasks();
  (document.querySelectorAll('.priority') || []).forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.priority').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
    });
  });
});




/** 3D-ефект тільки на кнопках пріоритету (не на контейнері). */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.td-modal .priority__btn').forEach(b => {
    b.addEventListener('mouseenter', () => {
      b.style.transform = 'translateY(-2px)';
      b.style.boxShadow = '0 6px 14px rgba(0,0,0,.16)';
    });
    b.addEventListener('mouseleave', () => {
      b.style.transform = ''; b.style.boxShadow = '';
    });
  });
});




/** Синхронізація кольору чипа типу (User Story / Technical Task). */
document.addEventListener('DOMContentLoaded', () => {
  function setChipColor() {
    const chip = document.getElementById('td-chip'); if (!chip) return;
    const t = chip.textContent.trim().toLowerCase();
    chip.classList.remove('td-chip--story', 'td-chip--technical');
    if (t.includes('user')) chip.classList.add('td-chip--story');
    if (t.includes('technical')) chip.classList.add('td-chip--technical');
  }
  document.addEventListener('click', e => {
    if (e.target.closest('.kb-card,[data-open-task-details]')) setTimeout(setChipColor, 0);
  });
});




/** Кнопка Edit: одразу відкриває форму Add Task з підставленими даними. */
document.addEventListener('DOMContentLoaded', () => {
  function openEditModal() {
    const take = (id) => (document.getElementById(id)?.textContent || '').trim();
    document.getElementById('td-modal')?.classList.remove('is-open');
    document.getElementById('at-modal')?.classList.add('is-open');
    document.getElementById('at-overlay')?.classList.add('is-open');
    const fill = (n, v) => { const el = document.querySelector(`[name="${n}"]`); if (el) el.value = v; };
    fill('title', take('td-title')); fill('description', take('td-desc'));
    fill('due', take('td-due'));
    const cat = document.querySelector('#category .placeholder'); if (cat) cat.textContent = take('td-chip');
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('#td-edit')) { e.preventDefault(); openEditModal(); }
  });
});




/* ==== FINAL-FIX v14: стабільні дропдауни ASSIGNED TO / Category ==== */

/** @returns {HTMLElement|null} Корінь модалки Add Task */
function ddr(){ return document.getElementById('at-modal'); }


/** Закриває всі відкриті дропдауни в модалці. */
function ddClsAll(){
  const r = ddr(); if (!r) return;
  r.querySelectorAll('.dropdown.full-expandable.open')
   .forEach(x => x.classList.remove('open'));
}


/** Відкриває рівно один дропдаун.
 *  @param {HTMLElement} drop
 */
function ddOpen(drop){
  if (!drop) return; ddClsAll(); drop.classList.add('open');
}


/** Обробляє клік по .dropdown-toggle на фазі capture. */
function ddOnToggle(e){
  const t = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  const r = ddr(); if (!t || !r || !r.contains(t)) return;
  e.stopPropagation(); e.preventDefault();
  const d = t.closest('.dropdown.full-expandable');
  d.classList.contains('open') ? ddClsAll() : ddOpen(d);
}


/** Закриває дропдауни кліком поза ними. */
function ddOnClickOutside(e){
  const r = ddr(); if (!r) return;
  if (!e.target.closest('.dropdown.full-expandable')) ddClsAll();
}


/** Підтримка клавіш Esc / Enter / Space. */
function ddOnKeys(e){
  if (e.key === 'Escape') ddClsAll();
  const t = e.target.closest('.dropdown.full-expandable .dropdown-toggle');
  if (t && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); t.click(); }
}


document.addEventListener('click', ddOnToggle, true);
document.addEventListener('click', ddOnClickOutside);
document.addEventListener('keydown', ddOnKeys);
