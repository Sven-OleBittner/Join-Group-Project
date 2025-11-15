function taskTemplate(t, ass, pr, type, el) {
  return `<div class="kb-card-top">
      <span class="kb-chip kb-chip--${type}">${
    t.category?.name || "User Story"
  }</span>
    </div>
      <h3 class="kb-card-title">${t.title}</h3>
      <p class="kb-card-desc">${t.description || ""}</p>
      <footer class="kb-card-foot">
        <div class="kb-avatars" data-assignees="${ass}"></div>
        <div class="kb-prio kb-prio--${pr}">
          <span class="kb-prio__icon" aria-hidden="true"></span>
        </div>
      </footer>`;
}