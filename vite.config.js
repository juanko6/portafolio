import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig } from "vite";

/* El sitio es estático: el navegador no puede listar un directorio, así que
   la lectura de `public/img/work/<slug>/` ocurre aquí, en el build. El módulo
   virtual `virtual:work-images` exporta { slug: ["/img/work/slug/01.jpg", …] }
   y `projects.js` lo usa para llenar el carrusel con cuantas haya. */
const WORK_DIR = resolve(import.meta.dirname, "public/img/work");
const EXT = /\.(?:jpe?g|png|webp|avif)$/i;

function leerCapturas() {
  const mapa = {};
  for (const dir of readdirSync(WORK_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    mapa[dir.name] = readdirSync(join(WORK_DIR, dir.name))
      .filter((f) => EXT.test(f))
      /* Orden numérico natural: 2.jpg antes que 10.jpg. El nombre del fichero
         manda, así que renombrar es la forma de reordenar el carrusel. */
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
      .map((f) => `/img/work/${dir.name}/${f}`);
  }
  return mapa;
}

function capturasDeTrabajo() {
  const ID = "virtual:work-images";
  const RESUELTO = `\0${ID}`;

  return {
    name: "work-images",
    resolveId: (id) => (id === ID ? RESUELTO : null),
    load(id) {
      if (id !== RESUELTO) return null;
      return `export default ${JSON.stringify(leerCapturas(), null, 2)};`;
    },
    /* En desarrollo, añadir o quitar una captura recarga la página: sin esto
       el módulo virtual se quedaría con la lista de cuando arrancó el servidor. */
    configureServer(server) {
      server.watcher.add(WORK_DIR);
      const refrescar = (ruta) => {
        if (!ruta.startsWith(WORK_DIR)) return;
        const mod = server.moduleGraph.getModuleById(RESUELTO);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: "full-reload" });
      };
      server.watcher.on("add", refrescar);
      server.watcher.on("unlink", refrescar);
    },
  };
}

export default defineConfig({
  plugins: [capturasDeTrabajo()],
  input: {
    main: resolve(import.meta.dirname, "index.html"),
    info: resolve(import.meta.dirname, "info.html"),
    work: resolve(import.meta.dirname, "work.html"),
    notfound: resolve(import.meta.dirname, "404.html"),
  },
  build: {
    outDir: "dist",
  },
});
