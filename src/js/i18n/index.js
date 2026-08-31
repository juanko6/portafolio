import es from "./locales/es.json";

const DICTS = { es };
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
  current = lang;
  writeStored(lang);
  if (typeof document !== "undefined") apply(document);
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
  if (typeof document !== "undefined" && scope === document) {
    document.documentElement.setAttribute("lang", current);
  }
}
