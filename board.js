/* =======================================================
   Data
======================================================= */
// Contacts data
const contacts = [
  { initials: "SM", name: "Sofia Müller (You)" },
  { initials: "AM", name: "Anton Mayer"        },
  { initials: "AS", name: "Anja Schulz"        },
  { initials: "BZ", name: "Benedikt Ziegler"   },
  { initials: "DE", name: "David Eisenberg"    },
  { initials: "EF", name: "Eva Fischer"        },
  { initials: "EM", name: "Emmanuel Mauer"     },
  { initials: "MB", name: "Marcel Bauer"       },
  { initials: "TW", name: "Tatjana Wolf"       }
];

// Icon paths (з можливими варіантами назв файлів)
const ICONS = {
  search: [
    "./assets/img/board_input_search_icon.svg",
    "./assets/icons/board_input_search_icon.svg"
  ],
  plus: [
    "./assets/img/board_collumn_plus button.svg",
    "./assets/img/board_column_plus_button.svg",
    "./assets/icons/board_collumn_plus button.svg"
  ],
  prio: {
    low:    ["./assets/img/green_low_urgent.svg", "./assets/icons/green_low_urgent.svg"],
    medium: ["./assets/img/Prio media.svg", "./assets/icons/Prio media.svg"],
    high:   ["./assets/img/red_high_urgent.svg", "./assets/icons/red_high_urgent.svg"]
  },
  subtasks: ["./assets/img/Subtasks icons11.svg", "./assets/icons/Subtasks icons11.svg"]
};


/* =======================================================
   Boot
======================================================= */
document.addEventListener("DOMContentLoaded", function () {
  initStaticIcons();
  renderAvatars();
  bindHeaderAndColumnPlus();
  bindCardPopups();         // opens details popup
  wireAddTaskModal();       // exposes window.openAddTaskPopup
  wireTaskDetailsModal();   // exposes window.openUserStoryPopup / openTechnicalTaskPopup
  wireAddTaskFormLogic();   // form handlers
});


/* =======================================================
   Helpers for robust icons
======================================================= */
function setIconWithFallback(imgEl, candidates) {
  if (!imgEl || !candidates || !candidates.length) return;
  let i = 0;
  imgEl.onerror = function () {
    i++;
    if (i < candidates.length) imgEl.src = candidates[i];
    else imgEl.remove(); // останній шанс — якщо все мимо, прибираємо биту іконку
  };
  imgEl.src = candidates[0];
}
function makeIconImg(className, candidates, alt) {
  const img = document.createElement("img");
  if (className) img.className = className;
  img.alt = alt || "";
  setIconWithFallback(img, candidates);
  return img;
}


/* =======================================================
   Static icons / badges
======================================================= */
function initStaticIcons() {
  setSearchIcon();
  setPlusIcons();
  setPriorityIcons();
  setSubtasksIcons();
}

function setSearchIcon() {
  const img = document.querySelector(".kb-search .kb-icon");
  if (img) setIconWithFallback(img, ICONS.search);
}

function setPlusIcons() {
  const buttons = document.querySelectorAll(".kb-col-add");
  for (let i = 0; i < buttons.length; i++) {
    const img = makeIconImg("kb-plus-img", ICONS.plus, "Add task");
    buttons[i].innerHTML = "";
    buttons[i].appendChild(img);
  }
}

function setPriorityIcons() {
  const prios = document.querySelectorAll(".kb-priority");
  for (let i = 0; i < prios.length; i++) {
    let type = "medium";
    if (prios[i].classList.contains("kb-priority--low"))  type = "low";
    if (prios[i].classList.contains("kb-priority--high")) type = "high";
    prios[i].innerHTML = "";
    prios[i].appendChild(makeIconImg("", ICONS.prio[type], type + " priority"));
  }
}

function setSubtasksIcons() {
  const subs = document.querySelectorAll(".kb-subtasks");
  for (let i = 0; i < subs.length; i++) {
    const text = subs[i].textContent.trim();
    if (text && text.includes("/")) {
      const wrap = document.createElement("span");
      const img = makeIconImg("", ICONS.subtasks, "Subtasks");
      wrap.appendChild(img);
      wrap.appendChild(document.createTextNode(" " + text));
      subs[i].innerHTML = "";
      subs[i].appendChild(wrap);
    }
  }
}


/* =======================================================
   Avatars
======================================================= */
function renderAvatars() {
  const boxes = document.querySelectorAll(".kb-avatars");
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const raw = box.dataset.assignees || "";
    const initialsList = raw.split(",");
    box.innerHTML = "";

    for (let j = 0; j < initialsList.length; j++) {
      const initials = initialsList[j].trim();
      if (!initials) continue;

      const contact = getContactByInitials(initials);
      if (!contact) continue;

      const avatar = document.createElement("div");
      avatar.className = "kb-avatar kb-avatar--" + initials;
      avatar.textContent = initials;
      avatar.title = contact.name;
      avatar.setAttribute("aria-label", contact.name);
      box.appendChild(avatar);
    }
  }
}
function getContactByInitials(initials) {
  for (let i = 0; i < contacts.length; i++) {
    if (contacts[i].initials === initials) return contacts[i];
  }
  return null;
}


/* =======================================================
   Add Task trigger (header button + column plus)
======================================================= */
function bindHeaderAndColumnPlus() {
  const addBtn = document.querySelector(".kb-add-btn");
  if (addBtn) {
    addBtn.addEventListener("click", function (e) {
      e.preventDefault();
      triggerAddTaskPopup();
    });
  }
  const colPlus = document.querySelectorAll(".kb-col-add");
  for (let i = 0; i < colPlus.length; i++) {
    colPlus[i].addEventListener("click", function (e) {
      e.preventDefault();
      triggerAddTaskPopup();
    });
  }
}

/** Safe trigger for Add-Task popup. */
function triggerAddTaskPopup() {
  const fn1 = (typeof window.openAddTaskPopup === "function") ? window.openAddTaskPopup : null;
  if (fn1 && fn1 !== triggerAddTaskPopup) { fn1(); return; }

  const ev = new CustomEvent("open-add-task");
  document.dispatchEvent(ev);

  // резервний варіант: перейти на окрему сторінку, якщо модалки немає
  setTimeout(function () {
    if (!triggerAddTaskPopup._handled) window.location.href = "add_task.html";
  }, 0);
}
document.addEventListener("open-add-task", function () {
  triggerAddTaskPopup._handled = true;
}, { once: true });


/* =======================================================
   Card click → Task Details popup
======================================================= */
function isInteractive(target) {
  return !!target.closest("button, a, input, textarea, select, label, .kb-col-add, .kb-plus-img");
}

function collectCardData(card) {
  let type = "story";
  const chip = card.querySelector(".kb-chip");
  if (chip && chip.classList.contains("kb-chip--technical")) type = "technical";

  const title = (card.querySelector(".kb-card-title") || {}).textContent || "";
  const desc  = (card.querySelector(".kb-card-desc")  || {}).textContent || "";

  let priority = "medium";
  const p = card.querySelector(".kb-priority");
  if (p) {
    if (p.classList.contains("kb-priority--low"))  priority = "low";
    if (p.classList.contains("kb-priority--high")) priority = "high";
  }

  const assignees = [];
  const box = card.querySelector(".kb-avatars");
  if (box && box.dataset.assignees) {
    const arr = box.dataset.assignees.split(",");
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i].trim();
      if (v) assignees.push(v);
    }
  }

  return {
    type: type,
    title: title.trim(),
    desc:  desc.trim(),
    priority: priority,
    assignees: assignees,
    cardEl: card
  };
}

function bindCardPopups() {
  const columns = document.querySelector(".kb-columns");
  if (!columns) return;

  columns.addEventListener("click", function (e) {
    if (isInteractive(e.target)) return;

    const card = e.target.closest(".kb-card");
    if (!card || !columns.contains(card)) return;

    const data = collectCardData(card);
    openCardPopup(data.type, data);
  });
}

function openCardPopup(type, data) {
  if (type === "story" && typeof window.openUserStoryPopup === "function") {
    window.openUserStoryPopup(data);
    return;
  }
  if (type === "technical" && typeof window.openTechnicalTaskPopup === "function") {
    window.openTechnicalTaskPopup(data);
    return;
  }
  const evtName = (type === "story") ? "open-user-story" : "open-technical-task";
  const ev = new CustomEvent(evtName, { detail: data });
  document.dispatchEvent(ev);
}


/* =======================================================
   Shared overlay helpers
======================================================= */
function showOverlay() {
  const overlay = document.getElementById("at-overlay");
  if (overlay) {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
}
function hideOverlay() {
  const overlay = document.getElementById("at-overlay");
  if (overlay) {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "at-overlay") closeAllOpenModals();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeAllOpenModals();
});
function closeAllOpenModals() {
  const openModals = document.querySelectorAll(".is-open.td-modal, .is-open.at-modal");
  for (let i = 0; i < openModals.length; i++) {
    openModals[i].classList.remove("is-open");
  }
  hideOverlay();
}


/* =======================================================
   Add Task modal wiring
======================================================= */
function wireAddTaskModal() {
  const modal = document.getElementById("at-modal");
  if (!modal) return;

  window.openAddTaskPopup = function () {
    // прибираємо 'hidden', якщо раптом залишився в HTML
    modal.classList.remove("hidden");
    showOverlay();
    modal.classList.add("is-open");
  };

  // close X button
  const closeBtn = document.getElementById("at-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("is-open");
      hideOverlay();
    });
  }
}


/* =======================================================
   Task Details modal wiring
======================================================= */
function wireTaskDetailsModal() {
  const modal = document.getElementById("td-modal");
  if (!modal) return;

  const PRIO_ICONS = { low: ICONS.prio.low, medium: ICONS.prio.medium, high: ICONS.prio.high };

  function setChip(type) {
    const el = document.getElementById("td-chip");
    if (!el) return;
    el.className = "td-chip " + (type === "technical" ? "td-chip--technical" : "td-chip--story");
    el.textContent = type === "technical" ? "Technical Task" : "User Story";
  }

  function setPriority(prio) {
    const t = document.getElementById("td-prio-text");
    const i = document.getElementById("td-prio-icon");
    if (t) t.textContent = prio ? (prio.charAt(0).toUpperCase() + prio.slice(1)) : "—";
    if (i) {
      i.innerHTML = "";
      i.appendChild(makeIconImg("", PRIO_ICONS[prio] || PRIO_ICONS.medium, ""));
    }
  }

  function renderAssignees(initials) {
    const wrap = document.getElementById("td-assignees");
    if (!wrap) return;
    wrap.innerHTML = "";
    if (!initials || !initials.length) return;

    for (let k = 0; k < initials.length; k++) {
      const init = initials[k];
      const person = getContactByInitials(init);

      const row = document.createElement("div");
      row.className = "td-assignee";

      const av = document.createElement("div");
      av.className = "kb-avatar kb-avatar--" + init;
      av.textContent = init;
      av.title = person ? person.name : init;

      const name = document.createElement("span");
      name.textContent = person ? person.name : init;

      row.appendChild(av);
      row.appendChild(name);
      wrap.appendChild(row);
    }
  }

  function setSubtasks(list) {
    const block = document.getElementById("td-subtasks");
    const ul = document.getElementById("td-subtasks-list");
    if (!block || !ul) return;

    ul.innerHTML = "";
    if (!list || !list.length) { block.hidden = true; return; }

    for (let i = 0; i < list.length; i++) {
      const li = document.createElement("li");
      li.textContent = list[i];
      li.prepend(document.createTextNode("✅ "));
      ul.appendChild(li);
    }
    block.hidden = false;
  }

  function fillTaskDetails(data, type) {
    setChip(type);

    const titleEl = document.getElementById("td-title");
    const descEl  = document.getElementById("td-desc");
    const dueEl   = document.getElementById("td-due");

    if (titleEl) titleEl.textContent = data.title || "";
    if (descEl)  descEl.textContent  = data.desc  || "";
    if (dueEl)   dueEl.textContent   = data.dueDate || "—";

    setPriority(data.priority || "medium");
    renderAssignees(data.assignees || []);
    setSubtasks(data.subtasks || []);
  }

  function openDetails(type, data) {
    fillTaskDetails(data, type);
    showOverlay();
    modal.classList.add("is-open");
  }

  window.openUserStoryPopup = function (data) { openDetails("story", data); };
  window.openTechnicalTaskPopup = function (data) { openDetails("technical", data); };

  const closeBtn = modal.querySelector("[data-td-close]");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("is-open");
      hideOverlay();
    });
  }
}


/* =======================================================
   Add Task form logic
======================================================= */
function wireAddTaskFormLogic() {
  // Priority buttons
  document.querySelectorAll(".priority__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".priority__btn")
        .forEach(b => b.classList.remove("priority__btn--active"));
      btn.classList.add("priority__btn--active");
      btn.closest(".priority")
        .querySelector("input[name='priority']").value = btn.dataset.value;
    });
  });

  // Subtasks
  const subtasksInput = document.querySelector("[data-subtasks] input");
  const subtasksList  = document.querySelector(".subtasks__list");
  if (subtasksInput) {
    subtasksInput.addEventListener("keydown", e => {
      if (e.key === "Enter" && subtasksInput.value.trim()) {
        e.preventDefault();
        const li = document.createElement("li");
        li.textContent = subtasksInput.value.trim();
        subtasksList.appendChild(li);
        subtasksInput.value = "";
      }
    });
  }

  // Cancel button
  document.getElementById("at-cancel")?.addEventListener("click", () => {
    const modal = document.getElementById("at-modal");
    modal.classList.remove("is-open");
    hideOverlay();
  });

  // Create button
  document.getElementById("at-create")?.addEventListener("click", e => {
    e.preventDefault();
    const form = document.querySelector("#at-modal form") || document.querySelector("#taskForm");
    if (!form) return;
    const formData = new FormData(form);
    console.log("New Task:", Object.fromEntries(formData.entries()));
    const modal = document.getElementById("at-modal");
    modal.classList.remove("is-open");
    hideOverlay();
  });
}
