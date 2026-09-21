import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { defineConfig } from "vite";

/* El sitio es estático: el navegador no puede listar un directorio, así que
   la lectura de `public/img/work/<slug>/` ocurre aquí, en el build. El módulo
   virtual `virtual:work-media` exporta, por proyecto, la lista de medios del
   carrusel, y `projects.js` la usa para llenarlo con cuantos haya.

   Un medio no es un fichero: es un **grupo de ficheros que comparten nombre**.
   `03.webm`, `03.mp4` y `03.jpg` son una sola diapositiva de vídeo con su
   cartel, no tres. Así el mismo clip puede ir en dos formatos sin salir dos
   veces, y el cartel evita el rectángulo negro mientras el vídeo no arranca
   (que es lo que se ve con `prefers-reduced-motion`, donde no arranca nunca).

     { cuquita: [
         { kind: "image", sources: ["/img/work/cuquita/01.jpg"], poster: null },
         { kind: "video", sources: ["…/03.webm", "…/03.mp4"], poster: "…/03.jpg" },
     ] }

   El orden de `sources` importa: el navegador se queda con la primera fuente
   que sabe reproducir, así que el formato más ajustado va primero. Hoy no se
   publica ningún webm —en capturas de pantalla, que son casi todo quietas,
   x264 sale más pequeño que VP9— pero el orden queda puesto para cuando lo
   sea, porque al revés nadie llegaría a pedirlo. */
const WORK_DIR = resolve(import.meta.dirname, "public/img/work");
const IMAGEN = /\.(?:jpe?g|png|webp|avif)$/i;
const VIDEO = /\.(?:webm|mp4)$/i;

/* webm primero, mp4 después: ver el orden de `sources` arriba. */
const PESO_FUENTE = (f) => (/\.webm$/i.test(f) ? 0 : 1);

/* Orden numérico natural: 2.jpg antes que 10.jpg. El nombre del fichero manda,
   así que renombrar es la forma de reordenar el carrusel. */
const natural = (a, b) => a.localeCompare(b, "es", { numeric: true });

const sinExtension = (f) => f.replace(/\.[^.]+$/, "");

function leerMedios(slug) {
  const ficheros = readdirSync(join(WORK_DIR, slug)).filter(
    (f) => IMAGEN.test(f) || VIDEO.test(f)
  );

  /* Agrupa por nombre sin extensión, conservando el orden natural de los grupos. */
  const grupos = new Map();
  for (const f of [...ficheros].sort(natural)) {
    const clave = sinExtension(f);
    if (!grupos.has(clave)) grupos.set(clave, []);
    grupos.get(clave).push(f);
  }

  const medios = [];
  for (const [, del_grupo] of grupos) {
    const url = (f) => `/img/work/${slug}/${f}`;
    const videos = del_grupo.filter((f) => VIDEO.test(f));
    const imagenes = del_grupo.filter((f) => IMAGEN.test(f));

    if (videos.length) {
      medios.push({
        kind: "video",
        sources: [...videos]
          .sort((a, b) => PESO_FUENTE(a) - PESO_FUENTE(b))
          .map(url),
        /* Si hay imagen con el mismo nombre es el cartel, no otra diapositiva. */
        poster: imagenes.length ? url(imagenes[0]) : null,
      });
      continue;
    }
    /* Sin vídeo, cada imagen del grupo es su propia diapositiva. Es el caso raro
       de `01.jpg` y `01.png` juntos; lo normal es que el grupo tenga una sola. */
    for (const f of imagenes) {
      medios.push({ kind: "image", sources: [url(f)], poster: null });
    }
  }
  return medios;
}

function leerCapturas() {
  const mapa = {};
  for (const dir of readdirSync(WORK_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    mapa[dir.name] = leerMedios(dir.name);
  }
  return mapa;
}

function capturasDeTrabajo() {
  const ID = "virtual:work-media";
  const RESUELTO = `\0${ID}`;

  return {
    name: "work-media",
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
    resume: resolve(import.meta.dirname, "resume.html"),
    notfound: resolve(import.meta.dirname, "404.html"),
  },
  build: {
    outDir: "dist",
  },
});
