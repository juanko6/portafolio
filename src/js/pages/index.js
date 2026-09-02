import { mount as mountPage } from "../components/page.js";
import { mount as mountHero } from "../components/hero-canvas.js";

const { main, refresh } = mountPage(document.querySelector("#app"), {
  page: "lobby",
});

const lobby = document.createElement("div");
lobby.className = "lobby";
main.appendChild(lobby);

const cta = document.createElement("nav");
cta.className = "lobby__cta";
cta.innerHTML = `
  <a class="c-btn c-btn--lg" href="/info.html" data-i18n="lobby.cta.info"></a>
  <a class="c-btn c-btn--lg" href="/work.html" data-i18n="lobby.cta.work"></a>
`;
lobby.appendChild(cta);

const hero = document.createElement("div");
hero.className = "lobby__hero";
lobby.appendChild(hero);
mountHero(hero, {});

const meta = document.createElement("section");
meta.className = "lobby__meta";
meta.innerHTML = `
  <div class="lobby__badges" data-i18n-block="lobby__badges">
    <span class="c-badge c-badge--star">★</span>
    <span class="c-badge" data-i18n="lobby.badges.fs"></span>
    <span class="c-badge" data-i18n="lobby.badges.year"></span>
  </div>
  <p class="lobby__desc" data-i18n="lobby.desc"></p>
  <div class="lobby__status">
    <span class="lobby__status__label" data-i18n="lobby.statusLabel"></span>
    <span class="lobby__status__text" data-i18n="lobby.status"></span>
  </div>
`;
lobby.appendChild(meta);
refresh();
