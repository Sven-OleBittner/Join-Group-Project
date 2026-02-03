function getAddTaskTemplate() {
    return `
        <!-- overlay + modals -->
   

    <div
      id="at-modal"
      class="at-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="at-title"
    >
      <div class="at-dialog">
        <form id="taskForm">
          <div class="at-header">
            <h2 id="at-title">Add Task</h2>
            <button
              id="at-close"
              class="at-close"
              type="button"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          <div class="at-grid">
            <!-- LEFT COLUMN -->
            <div class="at-col">
              <label class="field">
                <span class="field__label"
                  >Title<span class="req">*</span></span
                >
                <input class="input" name="title" placeholder="Enter a title" />
              </label>

              <label class="field">
                <span class="field__label_description">Description</span>
                <textarea
                  class="textarea"
                  name="description"
                  placeholder="Enter a Description"
                ></textarea>
              </label>

              <label class="field">
                <span class="field__label_due_date"
                  >Due date<span class="req">*</span></span
                >
                <div class="date-wrapper">
                  <input
                    type="date"
                    id="due-date"
                    name="due"
                    placeholder="dd/mm/yyyy"
                  />
                  <img
                    src="./assets/img/add_task_due_date_calendar_icon.svg"
                    class="icon-calendar"
                    alt=""
                  />
                </div>
              </label>
            </div>

            <!-- RIGHT COLUMN -->
            <div class="at-col at-col--right">
              <!-- PRIORITY -->
              <div class="field">
                <span class="field__label">Priority</span>
                <div class="priority priority-options" data-priority>
                  <button
                    type="button"
                    class="priority__btn"
                    data-value="urgent"
                  >
                    Urgent <img src="./assets/img/red_high_urgent.svg" alt="" />
                  </button>
                  <button
                    type="button"
                    class="priority__btn priority__btn"
                    data-value="medium"
                  >
                    Medium <img src="./assets/img/icons8-equal-50.png" alt="" />
                  </button>
                  <button type="button" class="priority__btn" data-value="low">
                    Low <img src="./assets/img/green_low_urgent.svg" alt="" />
                  </button>
                  <input type="hidden" name="priority" value="medium" />
                </div>
              </div>

              <!-- ASSIGNED TO -->
              <label class="field">
                <span class="field__label">Assigned to</span>
                <div
                  class="dropdown full-expandable assigned-to"
                  id="assignees"
                >
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
              </label>
              <div class="chips assigned-chips" id="assignee-chips"></div>

              <!-- CATEGORY -->
              <label class="field">
                <span class="field__label"
                  >Category<span class="req">*</span></span
                >
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
              </label>
              <div class="chips category-chipbox" id="category-chipbox"></div>

              <!-- SUBTASKS -->
              <div class="field">
                <span class="field__label">Subtasks</span>
                <div class="subtasks" data-subtasks>
                  <input
                    class="input"
                    type="text"
                    id="subtask-input"
                    placeholder="Add new subtask"
                  />
                  <ul class="subtasks__list"></ul>
                </div>
              </div>
            </div>
          </div>
          <div class="at-footer">
            <span class="at-footer-modal">
              This field is required
              <span class="req">*</span>
            </span>
            <div class="at-footer">
              <button type="button" id="at-cancel" class="btn">Cancel</button>
              <button type="submit" id="at-create" class="btn btn-primary">
                Create Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
`        
}