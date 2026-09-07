#!/usr/bin/env node
/*
 * scripts/print-pdf.mjs — imprime /resume a un PDF de UNA sola página.
 *
 *   node scripts/print-pdf.mjs <url> <fichero.pdf>
 *
 * Por qué no basta `chrome --headless --print-to-pdf`: esa bandera imprime
 * cuando se le acaba el presupuesto de tiempo virtual, sin esperar a nadie. La
 * página necesita las fuentes cargadas para medir su altura real, y en la
 * práctica unas veces llegaba y otras no — el mismo comando daba una página en
 * inglés y un A4 partido en dos en español.
 *
 * Aquí se habla con Chrome por CDP: se espera a que `resume.js` mida, inyecte
 * su `@page` y lo anuncie en `data-pdf-alto-mm`, y solo entonces se imprime.
 * Determinista, y sin dependencias: el cliente WebSocket es el global de Node.
 */

import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [url, salida] = process.argv.slice(2);
if (!url || !salida) {
  console.error("uso: node scripts/print-pdf.mjs <url> <fichero.pdf>");
  process.exit(2);
}

const CHROME =
  process.env.CHROME ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PUERTO = Number(process.env.CDP_PORT ?? 9333);

const ESPERA_MS = 30000;

const dormir = (ms) => new Promise((listo) => setTimeout(listo, ms));

async function esperar(intento, descripcion) {
  const limite = Date.now() + ESPERA_MS;
  while (Date.now() < limite) {
    const valor = await intento();
    if (valor) return valor;
    await dormir(150);
  }
  throw new Error(`agotada la espera: ${descripcion}`);
}

/* Cliente CDP mínimo: un id por mensaje y una promesa por id. */
function conectar(wsUrl) {
  const ws = new WebSocket(wsUrl);
  const pendientes = new Map();
  let siguiente = 0;

  ws.addEventListener("message", (evento) => {
    const msg = JSON.parse(evento.data);
    const pendiente = pendientes.get(msg.id);
    if (!pendiente) return; /* es un evento, no una respuesta */
    pendientes.delete(msg.id);
    if (msg.error) pendiente.rechazar(new Error(msg.error.message));
    else pendiente.resolver(msg.result);
  });

  const abierto = new Promise((resolver, rechazar) => {
    ws.addEventListener("open", resolver, { once: true });
    ws.addEventListener("error", () => rechazar(new Error("CDP: no conecta")), {
      once: true,
    });
  });

  return {
    abierto,
    cerrar: () => ws.close(),
    enviar(method, params = {}) {
      const id = ++siguiente;
      return new Promise((resolver, rechazar) => {
        pendientes.set(id, { resolver, rechazar });
        ws.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

const perfil = mkdtempSync(join(tmpdir(), "cv-pdf-"));
const chrome = spawn(
  CHROME,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    `--remote-debugging-port=${PUERTO}`,
    `--user-data-dir=${perfil}`,
    "about:blank",
  ],
  { stdio: "ignore" }
);

let cdp = null;
try {
  const version = await esperar(
    () =>
      fetch(`http://127.0.0.1:${PUERTO}/json/version`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    "que Chrome abra el puerto de depuración"
  );
  if (!version.webSocketDebuggerUrl) throw new Error("CDP sin endpoint");

  /* Pestaña nueva ya apuntando a la URL. Chrome moderno pide PUT aquí. */
  const destino = await fetch(
    `http://127.0.0.1:${PUERTO}/json/new?${encodeURIComponent(url)}`,
    { method: "PUT" }
  ).then((r) => r.json());

  cdp = conectar(destino.webSocketDebuggerUrl);
  await cdp.abierto;
  await cdp.enviar("Page.enable");

  /* El testigo que deja `prepararPaginaUnica()` en resume.js. Esperarlo es la
     razón de ser de este script. */
  const altoMm = await esperar(async () => {
    const { result } = await cdp.enviar("Runtime.evaluate", {
      expression: "document.documentElement.dataset.pdfAltoMm ?? ''",
      returnByValue: true,
    });
    return result.value ? Number(result.value) : null;
  }, "que la página publique su altura en data-pdf-alto-mm");

  /* `preferCSSPageSize` deja mandar al `@page` que inyecta la página. Pasar el
     tamaño por aquí en su lugar no funciona: Chrome haría el PDF del alto
     pedido pero seguiría paginando el contenido según el `@page` del CSS. */
  const { data } = await cdp.enviar("Page.printToPDF", {
    printBackground: true /* los cuadraditos naranjas de las viñetas */,
    preferCSSPageSize: true,
  });

  writeFileSync(salida, Buffer.from(data, "base64"));
  console.log(`  ${salida} — 210×${altoMm} mm`);
} finally {
  cdp?.cerrar();
  chrome.kill();
  rmSync(perfil, { recursive: true, force: true });
}
