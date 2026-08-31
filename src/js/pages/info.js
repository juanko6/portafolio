import { mount } from "../components/page.js";

const { main, refresh } = mount(document.querySelector("#app"), { page: "info" });

/* T3.1 — Head: badge + título + sub */
const head = document.createElement("header");
head.className = "info__head";
head.innerHTML = `
  <span class="info__badge" data-i18n="info.badge"></span>
  <h1 class="info__title" data-i18n="info.title"></h1>
  <p class="info__sub" data-i18n="info.sub"></p>
`;
main.appendChild(head);

refresh();
