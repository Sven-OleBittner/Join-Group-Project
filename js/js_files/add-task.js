/**
 * Add Task functionality
 */
function add_task_init(){
    return;
}

/**
 * Toggle dropdown
 */
function toggleDropdown(id) {
  const items = document.getElementById(id + '-items');
  items.classList.toggle('select-hide');
}

/**
 * Select category
 */
function selectCategoryOption(value) {
  document.getElementById('category-selected').textContent = value;
  document.getElementById('category-items').classList.add('select-hide');
}

/**
 * Select priority
 */
function selectPriority(priority) {
  document.getElementById('priority-urgent').classList.remove('selected');
  document.getElementById('priority-medium').classList.remove('selected');
  document.getElementById('priority-low').classList.remove('selected');
  document.getElementById('priority-' + priority).classList.add('selected');
}
