import { getLang, setLang } from "../i18n";

const LANGS = ["es", "en"];

export function mount(el) {
  if (!el) return { stop() {} };

  el.classList.add("c-lang");

  const buttons = LANGS.map((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "c-lang__btn";
    btn.dataset.lang = lang;
    btn.textContent = lang.toUpperCase();
    el.appendChild(btn);
    return btn;
  });

  const sync = () => {
    const current = getLang();
    buttons.forEach((btn) => {
      const active = btn.dataset.lang === current;
      btn.setAttribute("aria-pressed", String(active));
      btn.classList.toggle("is-active", active);
    });
  };

  const onChange = () => sync();
  const onKey = (e) => {
    const lang = e.target?.dataset?.lang;
    if (LANGS.includes(lang) && lang !== getLang()) {
      setLang(lang);
      sync();
    }
  };

  el.addEventListener("click", onKey);
  document.addEventListener("i18n:change", onChange);
  sync();

  return {
    stop() {
      el.removeEventListener("click", onKey);
      document.removeEventListener("i18n:change", onChange);
    },
  };
}
