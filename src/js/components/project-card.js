import { t } from "../i18n/index.js";
import { mount as mountCarousel } from "./carousel.js";

const CHEVRON =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

export function mount(el, { project }) {
  el.className = "work-card";

  const head = document.createElement("div");
  head.className = "work-card__head";

  const title = document.createElement("h3");
  title.className = "work-card__title";
  title.textContent = project.name;

  const meta = document.createElement("div");
  meta.className = "work-card__meta";
  const timeline = document.createElement("span");
  timeline.className = "work-card__timeline";
  timeline.textContent = project.timeline;
  const place = document.createElement("span");
  place.className = "work-card__place";
  place.textContent = project.place;
  meta.append(timeline, place);

  head.append(title, meta);

  const detail = document.createElement("div");
  detail.className = "work-card__detail";
  detail.hidden = true;
  buildDetail(detail, project);

  const actions = document.createElement("div");
  actions.className = "work-card__actions";

  if (project.site) {
    actions.appendChild(makeLink(t("project.site"), project.site));
  }
  actions.appendChild(makeLink(t("project.repo"), project.repo));

  const expand = document.createElement("button");
  expand.className = "work-card__btn";
  expand.type = "button";
  expand.setAttribute("aria-expanded", "false");
  const expandLabel = document.createElement("span");
  expandLabel.textContent = t("project.expand");
  const chevron = document.createElement("span");
  chevron.className = "work-card__chevron";
  chevron.innerHTML = CHEVRON;
  expand.append(expandLabel, chevron);
  expand.addEventListener("click", () => {
    const open = el.classList.toggle("is-open");
    expand.setAttribute("aria-expanded", String(open));
    expandLabel.textContent = open
      ? t("project.collapse")
      : t("project.expand");
    detail.hidden = !open;
  });
  actions.appendChild(expand);

  el.append(head, detail, actions);
}

function makeLink(label, href) {
  const a = document.createElement("a");
  a.className = "work-card__btn";
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = label;
  return a;
}

function buildDetail(detail, project) {
  const carouselWrap = document.createElement("div");
  mountCarousel(carouselWrap, { images: project.images });
  detail.appendChild(carouselWrap);

  detail.appendChild(makeSection("project.about", project.about));
  detail.appendChild(makeSection("project.rol", makeRoleList(project.rol)));

  if (project.extra) {
    detail.appendChild(makeSection("project.extra", project.extra));
  }
}

function makeSection(labelKey, content) {
  const s = document.createElement("div");
  s.className = "work-card__section";
  const label = document.createElement("span");
  label.className = "work-card__label";
  label.textContent = t(labelKey);
  s.appendChild(label);
  if (typeof content === "string") {
    const p = document.createElement("p");
    p.className = "work-card__text";
    p.textContent = content;
    s.appendChild(p);
  } else {
    s.appendChild(content);
  }
  return s;
}

function makeRoleList(items) {
  const ul = document.createElement("ul");
  ul.className = "work-card__roles";
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
  }
  return ul;
}
