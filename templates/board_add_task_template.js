function getAddTaskTemplate() {
    return `
<form  method="dialog" class="task-form" id="task-form">
            <div class="form-left">
              <label for="title">Title<span class="required">*</span></label>
              <input type="text" id="title" placeholder="Enter a title" />

              <label for="description">Description</label>
              <textarea
                id="description"
                placeholder="Enter a Description"
              ></textarea>

              <label for="due-date"
                >Due date<span class="required">*</span></label
              >
              <div class="date-wrapper">
                <input type="text" id="due-date" placeholder="dd/mm/yyyy" />
                <img
                  src="./assets/img/add_task_due_date_calendar_icon.svg"
                  class="icon-calendar"
                  alt=""
                />
              </div>
            </div>

            <div class="form-divider"></div>

            <div class="form-right">
              <label>Priority</label>
              <div class="priority-options">
                <button type="button" class="priority urgent">
                  Urgent
                  <img
                    src="./assets/img/red_high_urgent.svg"
                    alt="Urgent Arrow"
                  />
                </button>
                <button type="button" class="priority medium">
                  Medium
                  <img
                    src="./assets/img/icons8-equal-50.png"
                    alt="equal sign"
                  />
                </button>
                <button type="button" class="priority low">
                  Low
                  <img
                    src="./assets/img/green_low_urgent.svg"
                    alt="Low Arrow"
                  />
                </button>
              </div>

              <label>Assigned to</label>
              <div class="dropdown full-expandable assigned-to" id="assignees">
                <div class="dropdown-toggle" role="button" tabindex="0">
                  <span class="placeholder">Select contacts to assign</span>
                  <img
                    class="caret"
                    src="./assets/img/arrow_drop_down.svg"
                    alt=""
                  />
                </div>
                <div class="dropdown-menu">
                  <div class="dropdown-search">
                    <input
                      type="text"
                      id="assignee-search"
                      placeholder="Search contacts"
                    />
                  </div>
                  <div class="options" id="assignee-options"></div>
                </div>
              </div>
              <div class="chips assigned-chips" id="assignee-chips"></div>

              <label>Category<span class="required">*</span></label>
              <div
                class="dropdown full-expandable category-select"
                id="category"
              >
                <div class="dropdown-toggle" role="button" tabindex="0">
                  <span class="placeholder">Select task category</span>
                  <img
                    class="caret"
                    src="./assets/img/arrow_drop_down.svg"
                    alt=""
                  />
                </div>
                <div class="dropdown-menu">
                  <div class="dropdown-search">
                    <input
                      type="text"
                      id="category-search"
                      placeholder="Search categories"
                    />
                  </div>
                  <div class="options" id="category-options"></div>
                </div>
              </div>
              <div class="chips category-chipbox" id="category-chipbox"></div>

              <label>Subtasks</label>
              <div class="subtasks">
                <input
                  type="text"
                  id="subtask-input"
                  placeholder="Add new subtask"
                />
                <div class="subtask-icons">
                  <img
                    src="./assets/img/Subtasks icons11.svg"
                    id="subtask-add-icon"
                    alt=""
                  />
                  <img
                    src="./assets/img/iconoir_cancel.svg"
                    id="subtask-cancel-icon"
                    style="display: none"
                    alt=""
                  />
                  <img
                    src="./assets/img/check.svg"
                    id="subtask-confirm-icon"
                    style="display: none"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </form>`        
}