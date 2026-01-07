/**
 * Contact data array
 * @type {Array<{initials: string, name: string}>}
 */
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


/**
 * Icon paths configuration
 * @type {Object}
 */
const ICONS = {
  prio: {
    low: ["./assets/img/green_low_urgent.svg", "./assets/icons/green_low_urgent.svg"],
    medium: ["./assets/img/Prio media.svg", "./assets/icons/Prio media.svg"],
    high: ["./assets/img/red_high_urgent.svg", "./assets/icons/red_high_urgent.svg"]
  }
};


/**
 * Sets image source with fallback
 * @param {HTMLImageElement} img - Image element
 * @param {string[]} srcs - Array of source paths
 */
function setIconWithFallback(img, srcs) {
  if (!img || !srcs?.length) return;
  
  let i = 0;
  img.onerror = () => {
    if (i + 1 < srcs.length) {
      img.src = srcs[++i];
    } else {
      img.remove();
    }
  };
  
  img.src = srcs[0];
}


/**
 * Checks if element is interactive
 * @param {Element} el - Element to check
 * @returns {boolean}
 */
function isInteractive(el) {
  return el instanceof Element &&
    !!el.closest("button,a,input,textarea,select,[data-interactive]");
}


/**
 * Checks if viewport is desktop
 * @returns {boolean}
 */
function isDesktop() {
  return matchMedia("(min-width:1024px)").matches;
}


/**
 * Parses MM/DD/YYYY date string
 * @param {string} dateStr - Date string
 * @returns {Object|null}
 */
function parseMMDDYYYY(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? { mm: match[1], dd: match[2], yyyy: match[3] } : null;
}


/**
 * Converts MM/DD/YYYY to ISO format
 * @param {string} dateStr - Date string
 * @returns {string}
 */
function mmddyyyyToISO(dateStr) {
  const parsed = parseMMDDYYYY(dateStr);
  if (!parsed) return dateStr;
  
  return `${parsed.yyyy}-${parsed.mm}-${parsed.dd}`;
}


/**
 * Parses ISO date string
 * @param {string} dateStr - ISO date string
 * @returns {Object|null}
 */
function parseISODate(dateStr) {
  if (!dateStr) return null;
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return match ? { yyyy: match[1], mm: match[2], dd: match[3] } : null;
}


/**
 * Converts ISO to MM/DD/YYYY format
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
function isoToMMDDYYYY(dateStr) {
  const parsed = parseISODate(dateStr);
  if (!parsed) return dateStr;
  
  return `${parsed.mm}/${parsed.dd}/${parsed.yyyy}`;
}


/**
 * Gets assignees list from attribute
 * @param {HTMLElement} element - Element with data-assignees
 * @returns {string[]}
 */
function getAssigneesList(element) {
  const assignees = element.getAttribute("data-assignees") || "";
  return assignees.split(",")
    .map(v => v.trim())
    .filter(Boolean);
}


/**
 * Clears element content
 * @param {HTMLElement} element - Element to clear
 */
function clearElement(element) {
  element.innerHTML = "";
}


/**
 * Creates avatar element
 * @param {string} initials - Contact initials
 * @param {string} name - Contact name
 * @returns {HTMLElement}
 */
function createAvatarElement(initials, name) {
  const avatar = document.createElement("div");
  avatar.className = "kb-avatar kb-avatar--" + initials;
  avatar.textContent = initials;
  avatar.title = name;
  avatar.setAttribute("aria-label", name);
  return avatar;
}


/**
 * Renders single avatar
 * @param {HTMLElement} box - Container element
 * @param {string} initials - Contact initials
 */
function renderSingleAvatar(box, initials) {
  const person = contacts.find(c => c.initials === initials);
  if (!person) return;
  
  const avatar = createAvatarElement(initials, person.name);
  box.appendChild(avatar);
}


/**
 * Renders avatar circles in cards
 */
function renderAvatars() {
  document.querySelectorAll(".kb-avatars").forEach(box => {
    const list = getAssigneesList(box);
    clearElement(box);
    list.forEach(initials => renderSingleAvatar(box, initials));
  });
}


/**
 * Gets priority classes from element
 * @param {HTMLElement} element - Element to check
 * @returns {DOMTokenList}
 */
function getPriorityClasses(element) {
  return element.classList;
}


/**
 * Checks if has low priority
 * @param {DOMTokenList} classes - Class list
 * @returns {boolean}
 */
function hasLowPriority(classes) {
  return classes.contains("kb-prio--low") ||
    classes.contains("kb-priority--low");
}


/**
 * Checks if has high priority
 * @param {DOMTokenList} classes - Class list
 * @returns {boolean}
 */
function hasHighPriority(classes) {
  return classes.contains("kb-prio--high") ||
    classes.contains("kb-priority--high");
}


/**
 * Gets priority from card element
 * @param {HTMLElement} card - Card element
 * @returns {string}
 */
function getPriorityFromCard(card) {
  const el = card.querySelector(".kb-prio,.kb-priority");
  if (!el) return "medium";
  
  const classes = getPriorityClasses(el);
  
  if (hasLowPriority(classes)) return "low";
  if (hasHighPriority(classes)) return "high";
  
  return "medium";
}


/**
 * Gets card type from chip
 * @param {HTMLElement} chip - Chip element
 * @returns {string}
 */
function getCardType(chip) {
  return chip?.classList.contains("kb-chip--technical") ?
    "technical" : "story";
}


/**
 * Gets text content safely
 * @param {HTMLElement} element - Element
 * @returns {string}
 */
function getTextContent(element) {
  return (element?.textContent || "").trim();
}


/**
 * Parses subtasks from dataset
 * @param {string} subtasksData - Subtasks data
 * @returns {string[]}
 */
function parseSubtasks(subtasksData) {
  try {
    return JSON.parse(subtasksData);
  } catch {
    return subtasksData.split(",").map(s => s.trim()).filter(Boolean);
  }
}


/**
 * Gets subtasks from card
 * @param {HTMLElement} card - Card element
 * @returns {string[]}
 */
function getCardSubtasks(card) {
  if (!card.dataset.subtasks) return [];
  return parseSubtasks(card.dataset.subtasks);
}


/**
 * Collects all data from card
 * @param {HTMLElement} card - Card element
 * @returns {Object}
 */
function collectCardData(card) {
  const chip = card.querySelector(".kb-chip");
  const type = getCardType(chip);
  const title = getTextContent(card.querySelector(".kb-card-title"));
  const desc = getTextContent(card.querySelector(".kb-card-desc"));
  const priority = getPriorityFromCard(card);
  const assignees = getAssigneesList(card.querySelector(".kb-avatars"));
  const dueDate = card.dataset.due || "";
  const subtasks = getCardSubtasks(card);
  
  return {
    type,
    title,
    desc,
    priority,
    assignees,
    dueDate,
    subtasks,
    cardEl: card
  };
}


/**
 * Creates circle element
 * @param {string} initials - Contact initials
 * @returns {HTMLElement}
 */
function createCircleElement(initials) {
  const circle = document.createElement("span");
  circle.className = "td-person__circle td-person__circle--" + initials;
  circle.textContent = initials;
  return circle;
}


/**
 * Creates name element
 * @param {string} name - Contact name
 * @returns {HTMLElement}
 */
function createNameElement(name) {
  const nameEl = document.createElement("span");
  nameEl.className = "td-person__name";
  nameEl.textContent = name;
  return nameEl;
}


/**
 * Creates person circle element
 * @param {string} initials - Initials
 * @param {string} name - Full name
 * @returns {HTMLElement}
 */
function personCircle(initials, name) {
  const root = document.createElement("div");
  root.className = "td-person";
  
  const circle = createCircleElement(initials);
  const nameEl = createNameElement(name);
  
  root.append(circle, nameEl);
  return root;
}


/**
 * Gets overlay element
 * @returns {HTMLElement|null}
 */
function getOverlay() {
  return document.getElementById("at-overlay");
}


/**
 * Sets body overflow
 * @param {string} value - Overflow value
 */
function setBodyOverflow(value) {
  document.body.style.overflow = value;
}


/**
 * Shows overlay
 */
function showOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  
  overlay.classList.add("is-open");
  setBodyOverflow("hidden");
}


/**
 * Hides overlay
 */
function hideOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  
  overlay.classList.remove("is-open");
  setBodyOverflow("");
}


/**
 * Closes all open modals
 */
function closeAllOpenModals() {
  document.querySelectorAll(".td-modal.is-open,.at-modal.is-open")
    .forEach(modal => modal.classList.remove("is-open"));
  hideOverlay();
}


/**
 * Sets search icon source
 * @param {HTMLElement} icon - Icon element
 */
function setSearchIcon(icon) {
  icon.src = "./assets/img/board_input_search_icon.svg";
  icon.alt = "Search";
}


/**
 * Clears add button content
 * @param {HTMLElement} button - Button element
 */
function clearAddButton(button) {
  button.textContent = "";
}


/**
 * Initializes search icon
 */
function initializeSearchIcon() {
  const searchIcon = document.querySelector(".kb-search .kb-icon");
  if (searchIcon) {
    setSearchIcon(searchIcon);
  }
}


/**
 * Initializes add buttons
 */
function initializeAddButtons() {
  document.querySelectorAll(".kb-col-add").forEach(button => {
    clearAddButton(button);
  });
}


/**
 * Initializes static icons
 */
function initStaticIcons() {
  initializeSearchIcon();
  initializeAddButtons();
}