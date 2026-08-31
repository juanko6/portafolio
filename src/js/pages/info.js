import { mount } from "../components/page.js";
import { t } from "../i18n/index.js";

const { main, refresh } = mount(document.querySelector("#app"), {
  page: "info",
});

/* Crea un bloque con etiqueta (pill) + contenido y lo añade a main */
function section(labelKey, innerHTML) {
  const s = document.createElement("section");
  s.className = "info__section";
  s.innerHTML = `<span class="info__label" data-i18n="${labelKey}"></span>${innerHTML}`;
  main.appendChild(s);
  return s;
}

/* T3.1 — Head: badge + título + sub */
const head = document.createElement("header");
head.className = "info__head";
head.innerHTML = `
  <span class="info__badge" data-i18n="info.badge"></span>
  <h1 class="info__title" data-i18n="info.title"></h1>
  <p class="info__sub" data-i18n="info.sub"></p>
`;
main.appendChild(head);

/* T3.2 — SOBRE MÍ */
section(
  "info.sobreMi.title",
  `
  <p class="info__sobre" data-i18n="info.sobreMi.text"></p>
  <p class="info__nota" data-i18n="info.sobreMi.nota"></p>
`
);

/* T3.2 — EMAIL */
section(
  "info.email.title",
  `<a class="info__email" href="mailto:${t("info.email.text")}" data-i18n="info.email.text"></a>`
);

/* T3.2 — FOCUS */
section(
  "info.focus.title",
  `<ul class="info__list" data-list="info.focus.items"></ul>`
);

/* T3.2 — EXTRA */
section(
  "info.extra.title",
  `<ul class="info__list" data-list="info.extra.items"></ul>`
);

refresh();
