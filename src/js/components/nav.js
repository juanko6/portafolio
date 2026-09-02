import { t } from "../i18n/index.js";

export function mount(el, { page = "lobby", onBack = null } = {}) {
  el.classList.add("c-nav");

  const backMarkup = onBack
    ? '<button class="c-nav__back" type="button" data-back data-i18n="nav.back">Back</button>'
    : "";

  el.innerHTML = `
    <div class="c-nav__left">
      <a class="c-nav__link" href="/" data-i18n="nav.name">${t("nav.name")}</a>
      <span class="c-nav__label" aria-hidden="true">&nbsp;/&nbsp;<span data-i18n="nav.${page}">${t(`nav.${page}`)}</span></span>
    </div>
    <div class="c-nav__right">
      <span class="c-nav__lang" data-lang-slot></span>
      ${backMarkup}
    </div>
  `;

  const backEl = el.querySelector("[data-back]");
  if (backEl && onBack) {
    backEl.addEventListener("click", () => onBack());
  }

  return {
    langSlot: el.querySelector("[data-lang-slot]"),
  };
}
