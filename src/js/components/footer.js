const LINKS = {
  mail: "mailto:juanko6@gmail.com",
  github: "https://github.com/juanko6",
  linkedin: "https://www.linkedin.com/in/juanko6",
};

const STAR =
  "M6 0a7.815 7.815 0 0 0 6 6 7.815 7.815 0 0 0-6 6 7.815 7.815 0 0 0-6-6 7.815 7.815 0 0 0 6-6Z";

export function mount(el, { onBackToTop = null } = {}) {
  const year = String(new Date().getFullYear()).slice(-2);

  el.innerHTML = `
    <div class="c-footer__left">
      <span class="c-footer__loc"><span aria-hidden="true">⊕</span>&nbsp;<span data-i18n="footer.location">Alicante, ESPAÑA</span></span>
      <button class="c-footer__top" type="button" data-to-top><span data-i18n="footer.backToTop">Back to top</span>&nbsp;<span aria-hidden="true">↑</span></button>
    </div>
    <div class="c-footer__linkarea">
      <div class="c-footer__links">
        <a class="c-footer__link" href="${LINKS.mail}" data-i18n="footer.links.mail">Mail</a><span class="c-footer__sep">,&nbsp;</span>
        <a class="c-footer__link" href="${LINKS.github}" target="_blank" rel="noopener" data-i18n="footer.links.github">GitHub</a><span class="c-footer__sep">,&nbsp;</span>
        <a class="c-footer__link" href="${LINKS.linkedin}" target="_blank" rel="noopener" data-i18n="footer.links.linkedin">LinkedIn</a>
      </div>
      <div class="c-footer__copyrightarea">
        <svg class="c-footer__star" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="${STAR}" /></svg>
        <span class="c-footer__copyright"><span data-i18n="footer.copyright">©JG/</span><span data-footer-year>${year}</span></span>
      </div>
    </div>
  `;

  const topEl = el.querySelector("[data-to-top]");
  topEl.addEventListener("click", () => {
    if (onBackToTop) onBackToTop();
    else window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
