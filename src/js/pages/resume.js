import { mount } from "../components/page.js";
import { getLang, t } from "../i18n/index.js";
import { LINKS } from "../components/footer.js";

/* T8.2 — Currículum en web. Todo el contenido vive en `resume.*` de los JSON de
   idioma, así que la página se reconstruye entera en cada cambio de idioma (el
   mismo patrón que info.js: apply() solo refresca [data-i18n] y [data-list],
   y aquí casi nada es un nodo plano).

   El PDF descargable NO es un fichero maquetado a mano: se genera desde esta
   misma página con `npm run cv:pdf` (ver scripts/cv-pdf.sh), de modo que el
   diseño de la web y el del PDF no pueden divergir. */

const { main, refresh } = mount(document.querySelector("#app"), {
  page: "resume",
});

const PDF = {
  es: "/cv/juan-gutierrez-cv-es.pdf",
  en: "/cv/juan-gutierrez-cv-en.pdf",
};

const CONTACTO = [
  { label: "juanko.dev@gmail.com", href: LINKS.mail, external: false },
  { label: "github.com/juanko6", href: LINKS.github, external: true },
  { label: "linkedin.com/in/juanko6", href: LINKS.linkedin, external: true },
  { label: "juanko.com", href: "/", external: false },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/* Bloque del cuerpo: etiqueta pill (reusa .info__label) + contenido */
function block(title, target) {
  const section = el("section", "resume__block");
  section.appendChild(el("span", "info__label resume__blocklabel", title));
  const body = el("div", "resume__blockbody");
  section.appendChild(body);
  target.appendChild(section);
  return body;
}

/* Grupo del raíl lateral: título en mono + contenido */
function railGroup(title, target) {
  const group = el("div", "resume__group");
  group.appendChild(el("h2", "resume__grouptitle", title));
  const body = el("div", "resume__groupbody");
  group.appendChild(body);
  target.appendChild(group);
  return body;
}

function bullets(items) {
  const list = el("ul", "resume__bullets");
  items.forEach((item) => list.appendChild(el("li", null, item)));
  return list;
}

/* Cabecera de una entrada: nombre + fechas a los extremos, sub debajo */
function entryHead(name, sub, dates, link) {
  const head = el("div", "resume__entryhead");
  const row = el("div", "resume__entryrow");
  const nameEl = el("span", "resume__entryname", name);
  row.appendChild(nameEl);
  row.appendChild(el("span", "resume__entrydates", dates));
  head.appendChild(row);

  if (sub) {
    const subEl = el("p", "resume__entrysub");
    subEl.textContent = sub;
    if (link) {
      subEl.append(" · ");
      const a = el("a", "resume__entrylink", link);
      a.href = `https://${link}`;
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
      subEl.appendChild(a);
    }
    head.appendChild(subEl);
  }
  return head;
}

function buildRail() {
  const rail = el("aside", "resume__rail");

  const download = el("a", "resume__download");
  download.href = PDF[getLang()] ?? PDF.es;
  download.setAttribute("download", "");
  download.appendChild(el("span", null, t("resume.download")));
  download.append(" ↓");
  rail.appendChild(download);

  const contacto = railGroup(t("resume.contacto.title"), rail);
  contacto.appendChild(
    el("p", "resume__contactline", t("resume.contacto.location"))
  );
  CONTACTO.forEach(({ label, href, external }) => {
    const a = el("a", "resume__contactlink", label);
    a.href = href;
    if (external) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
    contacto.appendChild(a);
  });

  const stack = railGroup(t("resume.stack.title"), rail);
  t("resume.stack.groups").forEach(({ label, items }) => {
    stack.appendChild(el("p", "resume__stacklabel", label));
    const list = el("ul", "resume__stacklist");
    items.forEach((item) => list.appendChild(el("li", null, item)));
    stack.appendChild(list);
  });

  rail.appendChild(el("p", "resume__updated", t("resume.updated")));
  return rail;
}

function buildBody() {
  const body = el("div", "resume__body");

  const head = el("header", "resume__head");
  const title = el("h1", "resume__name");
  title.appendChild(el("span", "resume__nameline", "JUAN"));
  title.appendChild(el("span", "resume__nameline", "GUTIÉRREZ"));
  head.appendChild(title);
  head.appendChild(el("p", "resume__role", t("resume.role")));
  head.appendChild(el("p", "resume__sub", t("resume.sub")));
  body.appendChild(head);

  const perfil = block(t("resume.perfil.title"), body);
  perfil.appendChild(el("p", "resume__lede", t("resume.perfil.text")));
  perfil.appendChild(el("p", "resume__prose", t("resume.perfil.text2")));

  const experiencia = block(t("resume.experiencia.title"), body);
  t("resume.experiencia.items").forEach((item) => {
    const entry = el("article", "resume__entry");
    entry.appendChild(
      entryHead(`${item.org} — ${item.role}`, item.place, item.dates)
    );
    entry.appendChild(bullets(item.bullets));
    experiencia.appendChild(entry);
  });

  const proyectos = block(t("resume.proyectos.title"), body);
  t("resume.proyectos.items").forEach((item) => {
    const entry = el("article", "resume__entry");
    entry.appendChild(
      entryHead(item.name, item.kind, item.dates, item.link || null)
    );
    entry.appendChild(bullets(item.bullets));
    entry.appendChild(el("p", "resume__tech", item.tech));
    if (item.extra) entry.appendChild(el("p", "resume__extra", item.extra));
    proyectos.appendChild(entry);
  });

  const educacion = block(t("resume.educacion.title"), body);
  t("resume.educacion.items").forEach((item) => {
    const entry = el("article", "resume__entry");
    entry.appendChild(entryHead(item.title, item.org, item.dates));
    educacion.appendChild(entry);
  });

  const extra = block(t("resume.extra.title"), body);
  extra.appendChild(bullets(t("resume.extra.items")));

  return body;
}

function build() {
  main.innerHTML = "";
  const root = el("div", "resume");
  root.appendChild(buildRail());
  root.appendChild(buildBody());
  main.appendChild(root);
  refresh();
}

build();
document.addEventListener("i18n:change", build);
