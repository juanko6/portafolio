import { t } from "../i18n/index.js";

/* T3.4 — Un campo del colofón a partir de una clave "ETIQUETA: valor".
   T6.3 — Con `href`, el valor se pinta como enlace en vez de como texto. */
export function colofonField(key, href) {
  const [label, value] = t(key).split(": ");
  const field = document.createElement("div");
  field.className = "info__colofon-field";

  const labelEl = document.createElement("span");
  labelEl.className = "info__colofon-label";
  labelEl.textContent = label;

  const valueEl = document.createElement(href ? "a" : "span");
  valueEl.className = href
    ? "info__colofon-value info__colofon-link"
    : "info__colofon-value";
  if (href) valueEl.setAttribute("href", href);
  valueEl.textContent = value;

  field.appendChild(labelEl);
  field.appendChild(valueEl);
  return field;
}

/* T3.4 — Colofón completo: desarrollo + tipografía + versión anterior
   (T6.3) + retrato + bonus. Se reconstruye en cada cambio de idioma. */
export function buildColofon() {
  const colofonEl = document.createElement("div");
  colofonEl.className = "info__colofon";
  colofonEl.appendChild(colofonField("info.colofon.desarrollo"));
  colofonEl.appendChild(colofonField("info.colofon.tipografia"));
  colofonEl.appendChild(colofonField("info.colofon.v1", "/v1/index.html"));

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
