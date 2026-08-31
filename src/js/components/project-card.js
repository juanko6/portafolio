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
  el.append(head);
}
