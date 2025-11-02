(function () {
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);
  function initPriority(root) {
    const group = root.querySelector('[data-priority]');
    if (!group) return;
    const buttons = Array.from(group.querySelectorAll('.priority__btn'));
    const select = (btn) => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const hidden = group.querySelector('input[name="priority"]');
      if (hidden) hidden.value = btn.dataset.value;
      const txt = root.querySelector('#td-prio-text');
      if (txt) txt.textContent = btn.dataset.value || '—';
    };
    buttons.forEach(btn => on(btn, 'click', () => select(btn)));
    if (!buttons.some(b => b.classList.contains('selected'))) {
      const def = buttons.find(b => b.dataset.value === 'medium') || buttons[0];
      if (def) select(def);
    }
  }

  function initSubtasks(root) {
    const wrap = root.querySelector('[data-subtasks]');
    if (!wrap) return;
    const input = wrap.querySelector('input.input, input[type="text"]');
    const list = wrap.querySelector('.subtasks__list');
    if (!input || !list) return;

    on(input, 'keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const v = input.value.trim();
        if (!v) return;
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> <span>${escapeHtml(v)}</span>`;
        list.appendChild(li);
        input.value = '';
      }
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m]));
  }

  function initDate(root) {
    const input = root.querySelector('input[type="date"]');
    if (!input) return;
    if (window.flatpickr && !input.dataset.fp) {
      input.type = 'text';
      input.placeholder = 'dd/mm/yyyy';
      input.dataset.fp = '1';
      window.flatpickr(input, { dateFormat: 'd/m/Y' });
    }
  }

  function initPreviewBindings(root) {
    const title = root.querySelector('input[name="title"], #title');
    const desc  = root.querySelector('textarea[name="description"], #description');
    const due   = root.querySelector('input[name="due"], #due-date');
    const outT  = document.querySelector('#td-title');
    const outD  = document.querySelector('#td-desc');
    const outDue= document.querySelector('#td-due');

    if (title && outT) on(title, 'input', () => outT.textContent = title.value);
    if (desc && outD)  on(desc, 'input',  () => outD.textContent = desc.value);
    if (due && outDue) {
      const fmt = (val) => val.replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_,y,m,d)=>`${d}/${m}/${y}`);
      on(due, 'input', () => outDue.textContent = fmt(due.value) || due.value || '—');
    }
  }

  function init(root) {
    initPriority(root);
    initSubtasks(root);
    initDate(root);
    initPreviewBindings(root);
  }

  
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('.kb-add-btn, .kb-col-add, #at-open, [data-open-addtask]');
    if (!openBtn) return;
    setTimeout(() => {
      const dialog = document.querySelector('#at-modal .at-dialog, .td-dialog') || document;
      init(dialog);
    }, 0);
  });

  
  document.addEventListener('DOMContentLoaded', () => {
    const dialog = document.querySelector('#at-modal .at-dialog, .td-dialog');
    if (dialog) init(dialog);
  });
})();
