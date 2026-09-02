import { mount } from "../components/page.js";
import { t } from "../i18n/index.js";
import { LINKS } from "../components/footer.js";

const { main, refresh } = mount(document.querySelector("#app"), {
  page: "info",
});

let infoRoot = null;

const WEB_URLS = [
  { href: LINKS.mail, external: false },
  { href: LINKS.github, external: true },
  { href: LINKS.linkedin, external: true },
  { href: "https://menuunfolded.com", external: true },
];

/* Crea un bloque con etiqueta (pill) + contenido y lo añade a un target */
function section(labelKey, content, target) {
  const s = document.createElement("section");
  s.className = "info__section";
  const label = document.createElement("span");
  label.className = "info__label";
  label.setAttribute("data-i18n", labelKey);
  s.appendChild(label);
  if (typeof content === "string") s.insertAdjacentHTML("beforeend", content);
  else s.appendChild(content);
  target.appendChild(s);
  return s;
}

/* T3.3 — RESUMEN (historial: título + sub) */
function buildResumen() {
  const resumenEl = document.createElement("ul");
  resumenEl.className = "info__resumen";
  t("info.resumen.items").forEach((item) => {
    const [title, ...rest] = item.split(" · ");
    const li = document.createElement("li");
    li.className = "info__resumen__item";
    const titleEl = document.createElement("span");
    titleEl.className = "info__resumen__title";
    titleEl.textContent = title;
    li.appendChild(titleEl);
    if (rest.length) {
      const subEl = document.createElement("span");
      subEl.className = "info__resumen__sub";
      subEl.textContent = rest.join(" / ");
      li.appendChild(subEl);
    }
    resumenEl.appendChild(li);
  });
  return resumenEl;
}

/* T3.3 — ON THE WEB (enlaces inline) */
function buildWeb() {
  const webLinks = t("info.onTheWeb.links");
  const webEl = document.createElement("div");
  webEl.className = "info__web";
  webLinks.forEach((label, i) => {
    const url = WEB_URLS[i] ?? { href: "#", external: false };
    const a = document.createElement("a");
    a.className = "info__weblink";
    a.textContent = label;
    a.href = url.href;
    if (url.external) a.setAttribute("target", "_blank");
    webEl.appendChild(a);
    if (i < webLinks.length - 1) webEl.append(",\u00a0");
  });
  return webEl;
}

/* T3.4 — COLOFÓN (desarrollo + tipografía + retrato + bonus) */
function colofonField(key) {
  const [label, value] = t(key).split(": ");
  const field = document.createElement("div");
  field.className = "info__colofon-field";
  const labelEl = document.createElement("span");
  labelEl.className = "info__colofon-label";
  labelEl.textContent = label;
  const valueEl = document.createElement("span");
  valueEl.className = "info__colofon-value";
  valueEl.textContent = value;
  field.appendChild(labelEl);
  field.appendChild(valueEl);
  return field;
}

function buildColofon() {
  const colofonEl = document.createElement("div");
  colofonEl.className = "info__colofon";
  colofonEl.appendChild(colofonField("info.colofon.desarrollo"));
  colofonEl.appendChild(colofonField("info.colofon.tipografia"));
  const portrait = document.createElement("img");
  portrait.className = "info__portrait";
  portrait.src = "/img/retrato.jpg";
  portrait.alt = "";
  portrait.loading = "lazy";
  colofonEl.appendChild(portrait);
  const bonus = document.createElement("p");
  bonus.className = "info__bonus";
  bonus.setAttribute("data-i18n", "info.colofon.bonus");
  colofonEl.appendChild(bonus);
  return colofonEl;
}

/* T3.1 + T3.2 + T3.3 + T3.4 + T5.2 — Construye toda la página. Se reconstruye
     en cada cambio de idioma (evento i18n:change) porque RESUMEN, ON THE WEB y
     COLOFÓN se generan con t() dinámicamente y apply() no los refresca. */
let cream;
function build() {
  main.innerHTML = "";
  infoRoot = document.createElement("div");
  infoRoot.className = "info";
  main.appendChild(infoRoot);

  /* T3.1 — Head: badge + título + sub (sin fondo claro) */
  const head = document.createElement("header");
  head.className = "info__head";
  head.innerHTML = `
      <span class="info__badge" data-i18n="info.badge"></span>
      <h1 class="info__title" data-i18n="info.title"></h1>
      <p class="info__sub" data-i18n="info.sub"></p>
    `;
  infoRoot.appendChild(head);

  /* Cream wrapper solo para About Me */
  cream = document.createElement("div");
  cream.className = "cream-section";
  infoRoot.appendChild(cream);

  /* T3.2 — SOBRE MÍ (dentro del cream) */
  section(
    "info.sobreMi.title",
    `
      <p class="info__sobre" data-i18n="info.sobreMi.text"></p>
      <p class="info__nota" data-i18n="info.sobreMi.nota"></p>
    `,
    cream
  );

  /* T3.2 — FOCUS (fuera del cream) */
  section(
    "info.focus.title",
    `<ul class="info__list" data-list="info.focus.items"></ul>`,
    infoRoot
  );

  /* T3.2 — EXTRA (fuera del cream) */
  section(
    "info.extra.title",
    `<ul class="info__list" data-list="info.extra.items"></ul>`,
    infoRoot
  );

  /* T3.3 — RESUMEN (fuera del cream) */
  section("info.resumen.title", buildResumen(), infoRoot);

  /* T3.3 — ON THE WEB (fuera del cream) */
  section("info.onTheWeb.title", buildWeb(), infoRoot);

  /* T3.4 — COLOFÓN (fuera del cream) */
  section("info.colofon.title", buildColofon(), infoRoot);

  /* T3.2 — EMAIL (fuera del cream) */
  section(
    "info.email.title",
    `<a class="info__email" href="mailto:${t("info.email.text")}" data-i18n="info.email.text"></a>`,
    infoRoot
  );

  refresh();
}

build();
document.addEventListener("i18n:change", build);
