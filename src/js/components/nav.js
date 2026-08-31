import { t } from "../i18n/index.js";

const TIME_FRAME =
  "M7.237 23.5.5 16.764V7.237L7.237.5h71.526L85.5 7.237v9.527L78.763 23.5H7.237Z";

export function mount(el, { page = "lobby", onBack = null } = {}) {
  const backMarkup = onBack
    ? '<button class="c-nav__back" type="button" data-back data-i18n="nav.back">Back</button>'
    : "";

  el.innerHTML = `
    <div class="c-nav__left">
      <a class="c-nav__link" href="/" data-i18n="nav.name">${t("nav.name")}</a>
      <span class="c-nav__label" aria-hidden="true">&nbsp;/&nbsp;<span data-i18n="nav.${page}">${t(`nav.${page}`)}</span></span>
    </div>
    <div class="c-nav__time">
      <svg class="c-nav__time-frame" viewBox="0 0 86 24" fill="none" aria-hidden="true"><path d="${TIME_FRAME}" /></svg>
      <span class="c-nav__clock" data-clock-slot></span>
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
    clockSlot: el.querySelector("[data-clock-slot]"),
    langSlot: el.querySelector("[data-lang-slot]"),
  };
}
