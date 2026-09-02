import { mount } from "../components/page.js";
import { t } from "../i18n/index.js";
import { mount as mountList } from "../components/project-list.js";
import { PROJECTS } from "../data/projects.js";

const { main, refresh } = mount(document.querySelector("#app"), {
  page: "work",
});

/* T4.2 + T5.2 — Construye el contenido dinámico (head con count, listado,
   LET'S TALK) según el idioma activo. Se reconstruye en cada cambio de
   idioma (evento i18n:change) porque parte del contenido usa t() + data
   bilingüe de projects.js que apply() no toca. */
function build() {
  main.innerHTML = "";
  const work = document.createElement("div");
  work.className = "work";
  main.appendChild(work);

  /* T4.2 — Head: título (con count) + años + sub */
  const head = document.createElement("header");
  head.className = "work__head";
  head.innerHTML = `
    <h1 class="work__title"></h1>
    <span class="work__years" data-i18n="work.years"></span>
    <p class="work__sub" data-i18n="work.sub"></p>
  `;
  head.querySelector(".work__title").textContent = t("work.title", {
    count: `(${PROJECTS.length})`,
  });
  work.appendChild(head);

  /* T4.2 — Listado de proyectos */
  mountList(work, { projects: PROJECTS });

  /* T4.6 — Bloque LET'S TALK */
  const letsTalk = document.createElement("section");
  letsTalk.className = "work__letstalk";

  const cream = document.createElement("div");
  cream.className = "cream-section";

  const chip = document.createElement("span");
  chip.className = "work__letstalk-chip";
  chip.dataset.i18n = "work.letsTalk.title";
  const text = document.createElement("p");
  text.className = "work__letstalk-text";
  const intro = document.createElement("span");
  intro.dataset.i18n = "work.letsTalk.intro";
  const email = document.createElement("a");
  email.className = "work__letstalk-email";
  email.dataset.i18n = "work.letsTalk.email";
  email.href = `mailto:${t("work.letsTalk.email")}`;
  text.append(intro, " ", email);
  cream.append(chip, text);
  letsTalk.appendChild(cream);
  work.appendChild(letsTalk);

  refresh();
}

build();
document.addEventListener("i18n:change", build);
