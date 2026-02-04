/**
 * Add Task functionality
 */

/**
 * Selects a priority and removes selection from other priority buttons
 * @param {string} priority - The priority type: 'urgent', 'medium', or 'low'
 */
function selectPriority(priority) {
  document.getElementById('priority-urgent').classList.remove('selected');
  document.getElementById('priority-medium').classList.remove('selected');
  document.getElementById('priority-low').classList.remove('selected');
  
  document.getElementById(`priority-${priority}`).classList.add('selected');
}
