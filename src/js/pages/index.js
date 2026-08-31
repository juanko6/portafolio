import { mount as mountPage } from "../components/page.js";
import { mount as mountHero } from "../components/hero-canvas.js";

const { main } = mountPage(document.querySelector("#app"), { page: "lobby" });

const hero = document.createElement("div");
hero.className = "lobby__hero";
main.appendChild(hero);
mountHero(hero, {});
