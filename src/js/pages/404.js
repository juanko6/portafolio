import { mount } from "../components/page.js";

const { main, refresh } = mount(document.querySelector("#app"), {
  page: "notfound",
});

main.classList.add("notfound");

const title = document.createElement("h1");
title.className = "notfound__title";
title.setAttribute("aria-label", "ERROR (404)");
title.innerHTML = `<span class="notfound__glitch" data-i18n="notfound.title">ERROR (404)</span>`;

const body = document.createElement("p");
body.className = "notfound__body";
body.setAttribute("data-i18n", "notfound.body");

const back = document.createElement("a");
back.className = "c-btn c-btn--lg notfound__back";
back.href = "/";
back.setAttribute("data-i18n", "notfound.back");

main.append(title, body, back);
refresh();
