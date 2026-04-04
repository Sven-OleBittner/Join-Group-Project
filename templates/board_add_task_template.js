function getAddTaskTemplate(buttonId) {
  return `
        <div class="add-task-container max-w-1440">
          <div class="add-task-uppercontainer">
            <h1 class="add-task-title">Add Task</h1>
            <button
              type="button"
              class="close-btn-modal"
              onclick="closeAddTaskModal()"
            >
              &times;
            </button>
          </div>
          <form class="task-form" id="task-form">
            <div class="form-left">
              <label for="title">Title<span class="required">*</span></label>
              <input
                type="text"
                id="title"
                placeholder="Enter a title"
                onblur="validateTitle()"
                oninput="validateTitle()"
              />
              <span class="error-message" id="title-error"
                >This field is required!</span
              >

              <label for="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter a Description"
              ></textarea>

              <label for="date">Due date<span class="required">*</span></label>
              <div class="date-wrapper">
                <input
                  type="date"
                  id="date"
                  placeholder="dd/mm/yyyy"
                  onblur="validateDate()"
                  oninput="validateDate()"
                />
                <img
                  src="./assets/img/add_task_due_date_calendar_icon.svg"
                  class="icon-calendar"
                  alt=""
                />
              </div>
              <span class="error-message" id="date-error"
                >This field is required!</span
              >
              <span class="error-message" id="date-format-error"
                >Please use format dd/mm/yyyy!</span
              >
              <span class="error-message" id="date-possible-error"
                >Please use the actual date as the last possible date!</span
              >
            </div>

            <div class="form-divider"></div>

            <div class="form-right">
              <label>Priority</label>
              <div id="priority" class="priority-options">
                <button
                  type="button"
                  class="priority urgent"
                  id="priority-urgent"
                  onclick="selectPriority('urgent')"
                >
                  Urgent
                  <img
                    src="./assets/img/red_high_urgent.svg"
                    alt="Urgent Arrow"
                  />
                </button>
                <button
                  type="button"
                  class="priority medium selected"
                  id="priority-medium"
                  onclick="selectPriority('medium')"
                >
                  Medium
                  <img
                    src="./assets/img/icons8-equal-50.png"
                    alt="equal sign"
                  />
                </button>
                <button
                  type="button"
                  class="priority low"
                  id="priority-low"
                  onclick="selectPriority('low')"
                >
                  Low
                  <img
                    src="./assets/img/green_low_urgent.svg"
                    alt="Low Arrow"
                  />
                </button>
              </div>

              <label>Assigned to</label>
              <div class="custom-select" id="assignees">
                <div
                  class="select-selected"
                  id="assignees-selected"
                  onclick="
                    toggleDropdown('assignees');
                    event.stopPropagation();
                  "
                >
                  Select contacts to assign
                </div>
                <div
                  class="select-items select-hide"
                  id="assignees-items"
                ></div>
              </div>
              <div class="assigned-chips" id="assigned-chips"></div>

              <label>Category<span class="required">*</span></label>
              <div class="custom-select" id="category">
                <div
                  class="select-selected"
                  id="category-selected"
                  onclick="
                    toggleDropdown('category');
                    event.stopPropagation();
                  "
                >
                  Select task category
                </div>
                <div class="select-items select-hide" id="category-items">
                  <div onclick="selectCategoryOption('Technical Task'); enableCreateButton();">
                    Technical Task
                  </div>
                  <div onclick="selectCategoryOption('User Story'); enableCreateButton();">
                    User Story
                  </div>
                </div>
              </div>
              <span class="error-message" id="category-error"
                >This field is required</span
              >

              <label for="subtask-input">Subtasks</label>
              <div id="subtasks" class="subtasks">
                <input
                  type="text"
                  id="subtask-input"
                  placeholder="Add new subtask"
                  onfocus="showSubtaskIcons()"
                />
                <div class="subtask-icons">
                  <img
                    src="./assets/img/iconoir_cancel.svg"
                    id="subtask-cancel-icon"
                    class="d-none c-pointer"
                    onclick="cancelSubtask()"
                  />
                  <img
                    src="./assets/img/check.svg"
                    id="subtask-confirm-icon"
                    class="d-none c-pointer"
                    onclick="addSubtask()"
                  />
                </div>
              </div>
              <div class="subtask-list" id="subtask-list"></div>
            </div>
          </form>

          <div class="form-footer">
            <div class="footer-left">
              <span class="required">*</span> This field is required
            </div>
            <div class="form-actions">
              <button
                type="button"
                class="clear-btn"
                id="clear-btn"
                onclick="clearForm(); enableCreateButton();"
              >
                Clear <img src="./assets/img/iconoir_cancel.svg" alt="x" />
              </button>
              <button
                type="button"
                class="create-btn"
                id="create-btn"
                onclick="postNewTask('create-btn')"
                disabled
              >
                Create Task <img src="./assets/img/check.svg" alt="check" />
              </button>
            </div>
          </div>
        </div>
                  `;
}
