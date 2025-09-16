/** @type {{initials:string,name:string}[]} */
const contacts = [
  { initials: "SM", name: "Sofia Müller (You)" },
  { initials: "AM", name: "Anton Mayer" },
  { initials: "AS", name: "Anja Schulz" },
  { initials: "BZ", name: "Benedikt Ziegler" },
  { initials: "DE", name: "David Eisenberg" },
  { initials: "EF", name: "Eva Fischer" },
  { initials: "EM", name: "Emmanuel Mauer" },
  { initials: "MB", name: "Marcel Bauer" },
  { initials: "TW", name: "Tatjana Wolf" }
];


/** @type {Record<string, string[] | Record<string, string[]>>} */
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
    low: ["./assets/img/green_low_urgent.svg", "./assets/icons/green_low_urgent.svg"],
    medium: ["./assets/img/Prio media.svg", "./assets/icons/Prio media.svg"],
    high: ["./assets/img/red_high_urgent.svg", "./assets/icons/red_high_urgent.svg"]
  },
  subtasks: ["./assets/img/Subtasks icons11.svg", "./assets/icons/Subtasks icons11.svg"]
};


document.addEventListener("DOMContentLoaded", () => {
  initStaticIcons();
  renderAvatars();
  bindAddTaskTriggers();
  bindCardPopups();
  wireAddTaskModal();
  wireTaskDetailsModal();
  wireAddTaskForm();
  bindFooterAddTaskAdaptive();
});


/** @returns {boolean} true if mobile breakpoint is active */
function isMobile() {
  return window.matchMedia("(max-width: 945px)").matches;
}


function openAddTaskDependingOnViewport() {
  if (isMobile()) window.location.href = "add_task.html";
  else triggerAddTaskPopup();
}


/**
 * Set image src with fallback candidates.
 * @param {HTMLImageElement} img
 * @param {string[]} candidates
 */


function setIconWithFallback(img, candidates) {
  if (!img || !candidates?.length) return;
  let i = 0;
  img.onerror = () => (i + 1 < candidates.length) ? (img.src = candidates[++i]) : img.remove();
  img.src = candidates[0];
}


/**
 * Create <img> and apply fallback loader.
 * @param {string} className
 * @param {string[]} candidates
 * @param {string} alt
 * @returns {HTMLImageElement}
 */


function createIconImg(className, candidates, alt) {
  const img = document.createElement("img");
  if (className) img.className = className;
  img.alt = alt || "";
  setIconWithFallback(img, candidates);
  return img;
}


function initStaticIcons() {
  const s = document.querySelector(".kb-search .kb-icon");
  if (s) setIconWithFallback(s, /** @type {string[]} */(ICONS.search));
  document.querySelectorAll(".kb-col-add").forEach(btn => {
    btn.innerHTML = "";
    btn.appendChild(createIconImg("kb-plus-img", /** @type {string[]} */(ICONS.plus), "Add task"));
  });
  document.querySelectorAll(".kb-priority").forEach(el => {
    let type = "medium";
    if (el.classList.contains("kb-priority--low")) type = "low";
    if (el.classList.contains("kb-priority--high")) type = "high";
    el.innerHTML = "";
    el.appendChild(createIconImg("", /** @type {any} */(ICONS.prio)[type], `${type} priority`));
  });
  document.querySelectorAll(".kb-subtasks").forEach(el => {
    const t = el.textContent?.trim() || "";
    if (!t.includes("/")) return;
    const wrap = document.createElement("span");
    wrap.appendChild(createIconImg("", /** @type {string[]} */(ICONS.subtasks), "Subtasks"));
    wrap.appendChild(document.createTextNode(" " + t));
    el.innerHTML = "";
    el.appendChild(wrap);
  });
}


/**
 * @param {string} initials
 * @returns {{initials:string,name:string}|null}
 */


function getContactByInitials(initials) {
  return contacts.find(c => c.initials === initials) || null;
}


function renderAvatars() {
  document.querySelectorAll(".kb-avatars").forEach(box => {
    const list = (box.getAttribute("data-assignees") || "").split(",").map(v => v.trim()).filter(Boolean);
    box.innerHTML = "";
    list.forEach(init => {
      const person = getContactByInitials(init);
      if (!person) return;
      const el = document.createElement("div");
      el.className = "kb-avatar kb-avatar--" + init;
      el.textContent = init;
      el.title = person.name;
      el.setAttribute("aria-label", person.name);
      box.appendChild(el);
    });
  });
}


function bindAddTaskTriggers() {
  const addBtn = document.querySelector(".kb-add-btn");
  if (addBtn) addBtn.addEventListener("click", e => { e.preventDefault(); openAddTaskDependingOnViewport(); });
  document.querySelectorAll(".kb-col-add").forEach(btn => {
    btn.addEventListener("click", e => { e.preventDefault(); openAddTaskDependingOnViewport(); });
  });
}


function triggerAddTaskPopup() {
  const canOpen = typeof window.openAddTaskPopup === "function";
  if (canOpen) return window.openAddTaskPopup();
  const ev = new CustomEvent("open-add-task");
  document.dispatchEvent(ev);
  setTimeout(() => window.location.href = "add_task.html", 0);
}


function bindFooterAddTaskAdaptive() {
  const sel = '.footer-nav a[href="add_task.html"], .footer-nav a[href="./add_task.html"]';
  document.querySelectorAll(sel).forEach(link => {
    link.addEventListener("click", e => {
      if (isMobile()) return;
      e.preventDefault();
      triggerAddTaskPopup();
    });
  });
}


/**
 * @param {EventTarget} t
 * @returns {boolean}
 */


function isInteractive(t) {
  return !!(t && /** @type {Element} */(t).closest("button, a, input, textarea, select, label, .kb-col-add, .kb-plus-img"));
}


/**
 * @param {Element} card
 * @returns {{type:'story'|'technical', title:string, desc:string, priority:'low'|'medium'|'high', assignees:string[], cardEl:Element}}
 */


function collectCardData(card) {
  const chip = card.querySelector(".kb-chip");
  const type = chip?.classList.contains("kb-chip--technical") ? "technical" : "story";
  const title = (card.querySelector(".kb-card-title")?.textContent || "").trim();
  const desc = (card.querySelector(".kb-card-desc")?.textContent || "").trim();
  let priority = "medium";
  const p = card.querySelector(".kb-priority");
  if (p?.classList.contains("kb-priority--low")) priority = "low";
  if (p?.classList.contains("kb-priority--high")) priority = "high";
  const raw = card.querySelector(".kb-avatars")?.getAttribute("data-assignees") || "";
  const assignees = raw.split(",").map(v => v.trim()).filter(Boolean);
  return { type, title, desc, priority, assignees, cardEl: card };
}


function bindCardPopups() {
  const wrap = document.querySelector(".kb-columns");
  if (!wrap) return;
  wrap.addEventListener("click", e => {
    if (isInteractive(e.target)) return;
    const card = /** @type {Element|null} */(e.target instanceof Element ? e.target.closest(".kb-card") : null);
    if (!card || !wrap.contains(card)) return;
    const data = collectCardData(card);
    openCardPopup(data.type, data);
  });
}


/**
 * @param {'story'|'technical'} type
 * @param {any} data
 */


function openCardPopup(type, data) {
  if (type === "story" && typeof window.openUserStoryPopup === "function") return window.openUserStoryPopup(data);
  if (type === "technical" && typeof window.openTechnicalTaskPopup === "function") return window.openTechnicalTaskPopup(data);
  const evt = new CustomEvent(type === "story" ? "open-user-story" : "open-technical-task", { detail: data });
  document.dispatchEvent(evt);
}


function showOverlay() {
  const o = document.getElementById("at-overlay");
  if (!o) return;
  o.classList.add("is-open");
  document.body.style.overflow = "hidden";
}


function hideOverlay() {
  const o = document.getElementById("at-overlay");
  if (!o) return;
  o.classList.remove("is-open");
  document.body.style.overflow = "";
}


function closeAllOpenModals() {
  document.querySelectorAll(".is-open.td-modal, .is-open.at-modal").forEach(m => m.classList.remove("is-open"));
  hideOverlay();
}
document.addEventListener("click", e => { if ((e.target)?.id === "at-overlay") closeAllOpenModals(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllOpenModals(); });


function wireAddTaskModal() {
  const modal = document.getElementById("at-modal");
  if (!modal) return;
  window.openAddTaskPopup = () => { modal.classList.remove("hidden"); showOverlay(); modal.classList.add("is-open"); };
  const closeBtn = document.getElementById("at-close");
  if (closeBtn) closeBtn.addEventListener("click", () => { modal.classList.remove("is-open"); hideOverlay(); });
}


function wireTaskDetailsModal() {
  const modal = document.getElementById("td-modal");
  if (!modal) return;
  const prioIcons = /** @type {{[k:string]: string[]}} */(ICONS.prio);
  /** @param {'story'|'technical'} type */


  function setChip(type) {
    const el = document.getElementById("td-chip");
    if (!el) return;
    el.className = "td-chip " + (type === "technical" ? "td-chip--technical" : "td-chip--story");
    el.textContent = type === "technical" ? "Technical Task" : "User Story";
  }
  /** @param {'low'|'medium'|'high'} prio */


  function setPriority(prio) {
    const t = document.getElementById("td-prio-text");
    const i = document.getElementById("td-prio-icon");
    if (t) t.textContent = prio.charAt(0).toUpperCase() + prio.slice(1);
    if (i) { i.innerHTML = ""; i.appendChild(createIconImg("", prioIcons[prio] || prioIcons.medium, "")); }
  }
  /** @param {string[]} list */


  function renderAssignees(list) {
    const wrap = document.getElementById("td-assignees");
    if (!wrap) return;
    wrap.innerHTML = "";
    list.forEach(init => {
      const p = getContactByInitials(init);
      const row = document.createElement("div");
      row.className = "td-assignee";
      const av = document.createElement("div");
      av.className = "kb-avatar kb-avatar--" + init;
      av.textContent = init;
      av.title = p ? p.name : init;
      const name = document.createElement("span");
      name.textContent = p ? p.name : init;
      row.append(av, name);
      wrap.appendChild(row);
    });
  }


  /** @param {string[]} list */


  function setSubtasks(list) {
    const block = document.getElementById("td-subtasks");
    const ul = document.getElementById("td-subtasks-list");
    if (!block || !ul) return;
    ul.innerHTML = "";
    if (!list?.length) { block.hidden = true; return; }
    list.forEach(t => { const li = document.createElement("li"); li.textContent = t; li.prepend(document.createTextNode("✅ ")); ul.appendChild(li); });
    block.hidden = false;
  }


  /** @param {any} data @param {'story'|'technical'} type */


  function fillTaskDetails(data, type) {
    setChip(type);
    const t = document.getElementById("td-title");
    const d = document.getElementById("td-desc");
    const due = document.getElementById("td-due");
    if (t) t.textContent = data.title || "";
    if (d) d.textContent = data.desc || "";
    if (due) due.textContent = data.dueDate || "—";
    setPriority(data.priority || "medium");
    renderAssignees(data.assignees || []);
    setSubtasks(data.subtasks || []);
  }


  /** @param {'story'|'technical'} type @param {any} data */


  function openDetails(type, data) {
    fillTaskDetails(data, type);
    showOverlay();
    modal.classList.add("is-open");
  }
  window.openUserStoryPopup = data => openDetails("story", data);
  window.openTechnicalTaskPopup = data => openDetails("technical", data);
  const closeBtn = modal.querySelector("[data-td-close]");
  if (closeBtn) closeBtn.addEventListener("click", () => { modal.classList.remove("is-open"); hideOverlay(); });
}


function wireAddTaskForm() {
  document.querySelectorAll(".priority__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".priority__btn").forEach(b => b.classList.remove("priority__btn--active"));
      btn.classList.add("priority__btn--active");
      btn.closest(".priority")?.querySelector("input[name='priority']")?.setAttribute("value", btn.dataset.value || "medium");
    });
  });
  const subtasksInput = document.querySelector("[data-subtasks] input");
  const subtasksList = document.querySelector(".subtasks__list");
  if (subtasksInput && subtasksList) {
    subtasksInput.addEventListener("keydown", e => {
      if (e.key !== "Enter") return;
      const v = subtasksInput.value.trim();
      if (!v) return e.preventDefault();
      e.preventDefault();
      const li = document.createElement("li");
      li.textContent = v;
      subtasksList.appendChild(li);
      subtasksInput.value = "";
    });
  }
  document.getElementById("at-cancel")?.addEventListener("click", () => {
    document.getElementById("at-modal")?.classList.remove("is-open");
    hideOverlay();
  });
  document.getElementById("at-create")?.addEventListener("click", e => {
    e.preventDefault();
    const form = document.querySelector("#at-modal form") || document.querySelector("#taskForm");
    if (!form) return;
    const fd = new FormData(/** @type {HTMLFormElement} */(form));
    console.log("New Task:", Object.fromEntries(fd.entries()));
    document.getElementById("at-modal")?.classList.remove("is-open");
    hideOverlay();
  });
}