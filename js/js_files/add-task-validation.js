/**
 * Add Task - Form Validation & UI Helpers
 * Handles form validation, priority selection, dropdowns and form reset
 */

/**
 * Toggles the visibility of a dropdown menu
 * @param {string} id - The ID of the dropdown to toggle
 * @returns {void}
 */
function toggleDropdown(id) {
  const items = document.getElementById(id + "-items");
  items.classList.toggle("select-hide");
}

/**
 * Closes a dropdown menu
 * @param {string} id - The ID of the dropdown to close
 * @returns {void}
 */
function closeDropdown(id) {
  const dropdown = document.getElementById(id);
  dropdown.classList.add("select-hide");
}

/**
 * Selects a category option and closes the category dropdown
 * @param {string} value - The category value to select
 * @returns {void}
 */
function selectCategoryOption(value) {
  document.getElementById("category-selected").textContent = value;
  document.getElementById("category-items").classList.add("select-hide");
  validateCategory();
}

/**
 * Selects a priority level and updates the UI accordingly
 * @param {string} priority - The priority level to select ('urgent', 'medium', or 'low')
 * @returns {void}
 */
function selectPriority(priority) {
  document.getElementById("priority-urgent").classList.remove("selected");
  document.getElementById("priority-medium").classList.remove("selected");
  document.getElementById("priority-low").classList.remove("selected");
  document.getElementById("priority-" + priority).classList.add("selected");
}

/**
 * Sets the default priority selection to 'medium' on page load
 * @returns {void}
 */
function standartselectPriority() {
  document.getElementById("priority-medium").classList.add("selected");
}

/**
 * Clears all form fields and resets to default state
 * @returns {void}
 */
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("date").value = "";
  selectPriority("medium");
  clearAssignedContacts();
  document.getElementById("category-selected").textContent =
    "Select task category";
  subtasks = [];
  renderSubtasks();
  document.getElementById("subtask-input").value = "";
  hideSubtaskIcons();
  clearValidationErrors();
}

/**
 * Clears all validation error states
 * @returns {void}
 */
function clearValidationErrors() {
  document.getElementById("title").classList.remove("input-error");
  document.getElementById("title-error").classList.remove("visible");
  document.getElementById("date").classList.remove("input-error");
  document.getElementById("date-error").classList.remove("visible");
  document.getElementById("category").classList.remove("select-error");
  document.getElementById("category-error").classList.remove("visible");
}

/**
 * Validates all required fields
 * @returns {boolean} True if all required fields are filled
 */
function validateForm() {
  let isValid = true;
  isValid = validateTitle() && isValid;
  isValid = validateDate() && isValid;
  isValid = validateCategory() && isValid;
  return isValid;
}

/**
 * Validates the title field
 * @returns {boolean} True if title is filled
 */
function validateTitle() {
  const title = document.getElementById("title");
  const error = document.getElementById("title-error");
  if (!title.value.trim()) {
    title.classList.add("input-error");
    error.classList.add("visible");
    return false;
  }
  title.classList.remove("input-error");
  error.classList.remove("visible");
  return true;
}

/**
 * Validates the date field
 * @returns {boolean} True if date is filled and has correct format
 */
function validateDate() {
  const date = document.getElementById("date");
  const value = date.value.trim();
  resetDateErrors();
  if (!value) return showDateError("date-error-empty", date);
  if (date.type === "date" || isIsoDate(value)) {
    if (!isIsoValid(value)) return showDateError("date-format-error", date);
    if (!isIsoNotPast(value)) return showDateError("date-possible-error", date);
  } else {
    if (!isValidDateFormat(value))
      return showDateError("date-format-error", date);
    if (!isPossibleDate(value))
      return showDateError("date-possible-error", date);
  }
  date.classList.remove("input-error");
  return true;
}

/**
 * Checks if value matches ISO date format (yyyy-mm-dd)
 * @param {string} value - The date string to check
 * @returns {boolean} True if format is valid
 */
function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Validates if the ISO date is a real calendar date
 * @param {string} value - The date string in ISO format to validate
 * @returns {boolean} True if the date is valid
 */
function isIsoValid(value) {
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

/**
 * Checks if the ISO date is not in the past
 * @param {string} value - The date string in ISO format to check
 * @returns {boolean} True if the date is today or in the future
 */
function isIsoNotPast(value) {
  const [y, m, d] = value.split("-").map(Number);
  const parsed = new Date(y, m - 1, d);
  const today = new Date();
  const todayMid = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return parsed >= todayMid;
}

/**
 * Set the `min` attribute of any date input with id 'date' to today's date
 * in ISO format (yyyy-mm-dd) so past dates cannot be selected.
 */
function setDateMinToday() {
  const el = document.getElementById("date");
  if (!el) return;
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  el.min = `${y}-${m}-${d}`;
}

/**
 * Checks if value matches dd/mm/yyyy or dd.mm.yyyy format
 * Regex: ^       = Start of string
 *        \d{2}   = Exactly 2 digits (day)
 *        [\/\.]  = Separator: forward slash or dot
 *        \d{2}   = Exactly 2 digits (month)
 *        [\/\.]  = Separator: forward slash or dot
 *        \d{4}   = Exactly 4 digits (year)
 *        $       = End of string
 * @param {string} value - The date string to check
 * @returns {boolean} True if format is valid (accepts '/' or '.')
 */
function isValidDateFormat(value) {
  return /^\d{2}[\/\.]\d{2}[\/\.]\d{4}$/.test(value);
}

/**
 * Checks if a date string (dd/mm/yyyy or dd.mm.yyyy) represents a real calendar date
 * and is today or in the future.
 * @param {string} value - The date string to validate (dd/mm/yyyy or dd.mm.yyyy)
 * @returns {boolean} True if the date is valid and not in the past
 */
function isPossibleDate(value) {
  // Support both '/' and '.' as separators
  const [day, month, year] = value.split(/[\/\.]/).map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date >=
      new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      )
  );
}

/**
 * Resets all date error messages
 * @returns {void}
 */
function resetDateErrors() {
  document.getElementById("date-error").innerHTML = "";
}

/**
 * Shows a specific date error message
 * @param {string} errorId - The ID of the error element
 * @param {HTMLElement} date - The date input element
 * @returns {boolean} Always returns false
 */
function showDateError(errorId, date) {
  let errorContainer = document.getElementById("date-error");
  errorContainer.innerHTML = "";
  switch (errorId) {
    case "date-error-empty":
      errorContainer.innerHTML =
        'This field is required!';
      break;
    case "date-format-error":
      errorContainer.innerHTML =
        'Please use format dd/mm/yyyy or dd.mm.yyyy!';
      break;
    case "date-possible-error":
      errorContainer.innerHTML =
        'Please use the actual date as the last possible date!';
      break;
  }
  date.classList.add("input-error");
  errorContainer.classList.add("visible");
  return false;
}

/**
 * Validates the category field
 * @returns {boolean} True if category is selected
 */
function validateCategory() {
  const category = document.getElementById("category");
  const selected = document.getElementById("category-selected");
  const error = document.getElementById("category-error");
  if (selected.textContent === "Select task category") {
    category.classList.add("select-error");
    error.classList.add("visible");
    return false;
  }
  category.classList.remove("select-error");
  error.classList.remove("visible");
  return true;
}

/**
 * Enables the Create Task button if all required fields are valid
 */
/**
 * Enables or disables the Create Task button based on form validity.
 * @returns {void}
 */
function enableCreateButton() {
  const createBtn = document.getElementById("create-btn");
  if (validateTitle() && validateDate() && validateCategory()) {
    createBtn.disabled = false;
  } else {
    createBtn.disabled = true;
  }
}
