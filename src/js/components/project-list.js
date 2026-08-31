import { mount as mountCard } from "./project-card.js";

export function mount(el, { projects }) {
  const list = document.createElement("ul");
  list.className = "work-list";
  for (const project of projects) {
    const item = document.createElement("li");
    mountCard(item, { project });
    list.append(item);
  }
  el.append(list);
}
