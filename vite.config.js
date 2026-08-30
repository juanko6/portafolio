import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
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
