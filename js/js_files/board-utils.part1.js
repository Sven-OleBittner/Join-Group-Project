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