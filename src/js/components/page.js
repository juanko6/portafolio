import { mount as mountNav } from "./nav.js";
import { mount as mountFooter } from "./footer.js";
import { mount as mountClock } from "./clock.js";
import { apply } from "../i18n/index.js";

export function mount(el, { page = "lobby" } = {}) {
  el.innerHTML = `
    <header class="c-header">
      <div class="c-nav-slot"></div>
    </header>
    <main class="c-main" data-page="${page}"></main>
    <div class="c-footer-slot"></div>
  `;

  const onBack = page === "lobby" ? null : () => window.history.back();
  const nav = mountNav(el.querySelector(".c-nav-slot"), { page, onBack });
  mountClock(nav.clockSlot);
  mountFooter(el.querySelector(".c-footer-slot"), {});

  apply(document);

  return {
    main: el.querySelector(".c-main"),
    langSlot: nav.langSlot,
    refresh: () => apply(document),
  };
}
