const TZ = "Europe/Madrid";

const FMT = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: TZ,
});

export function getClockParts(date = new Date()) {
  let hour = "00";
  let minute = "00";
  for (const part of FMT.formatToParts(date)) {
    if (part.type === "hour") hour = part.value;
    else if (part.type === "minute") minute = part.value;
  }
  return { hour, minute };
}

export function mount(el, _opts = {}) {
  const initial = getClockParts();
  el.innerHTML = [
    '<span class="c-clock__time" data-time>',
    `<span data-hour>${initial.hour}</span>`,
    '<span class="c-clock__colon">:</span>',
    `<span data-minute>${initial.minute}</span>`,
    '<span class="c-clock__tz" data-i18n="clock.tz">CET</span>',
    "</span>",
  ].join("");

  const hourEl = el.querySelector("[data-hour]");
  const minuteEl = el.querySelector("[data-minute]");
  let last = `${initial.hour}${initial.minute}`;

  function tick() {
    const { hour, minute } = getClockParts();
    const signature = `${hour}${minute}`;
    if (signature !== last) {
      hourEl.textContent = hour;
      minuteEl.textContent = minute;
      last = signature;
    }
  }

  const id = setInterval(tick, 1000);
  return {
    stop() {
      clearInterval(id);
    },
  };
}
