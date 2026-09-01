import es from "./locales/es.json";
import en from "./locales/en.json";

const DICTS = { es, en };
const STORAGE_KEY = "i18n-lang";
const DEFAULT_LANG = "es";

function readStored() {
  try {
    return typeof localStorage !== "undefined"
      ? localStorage.getItem(STORAGE_KEY)
      : null;
  } catch {
    return null;
  }
}

function writeStored(lang) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  } catch {
    /* localStorage no disponible (tests, modo privado) */
  }
}

let current = (() => {
  const stored = readStored();
  return stored && DICTS[stored] ? stored : DEFAULT_LANG;
})();

export function getLang() {
  return current;
}

export function availableLangs() {
  return Object.keys(DICTS);
}

export function setLang(lang) {
  if (!DICTS[lang]) return current;
  const changed = current !== lang;
  current = lang;
  writeStored(lang);
  if (typeof document !== "undefined") {
    apply(document);
    if (changed) {
      document.dispatchEvent(
        new CustomEvent("i18n:change", { detail: { lang } })
      );
    }
  }
  return current;
}

function resolve(obj, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj
    );
}

export function t(key, vars) {
  let value = resolve(DICTS[current], key);
  if (value === undefined) value = resolve(DICTS[DEFAULT_LANG], key);
  if (value === undefined) return key;
  if (typeof value === "string" && vars) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.split(`{${name}}`).join(String(replacement));
    }
  }
  return value;
}

export function apply(scope = document) {
  if (!scope) return;
  scope.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  scope.querySelectorAll("[data-list]").forEach((el) => {
    const items = t(el.getAttribute("data-list"));
    if (!Array.isArray(items)) return;
    el.textContent = "";
    items.forEach((item) => {
      const node = el.ownerDocument.createElement("li");
      node.textContent = item;
      el.appendChild(node);
    });
  });
  if (typeof document !== "undefined" && scope === document) {
    document.documentElement.setAttribute("lang", current);
  }
}
