// ÚNICA fuente de datos de Work (listado + details). T4.1.
// Regla: todo lo estructurado de /work vive aquí; el chrome UI va por i18n.
// `repo` apunta a la cuenta GitHub como placeholder hasta tener las URLs reales
// de cada repo (pendiente, ver memoria.md → "Pendiente / abierto").

export const PROJECTS = [
  {
    slug: "menuunfolded",
    name: "MenuUnfolded",
    timeline: "2026 – PRESENTE",
    place: "ESPAÑA",
    about:
      "SaaS que digitaliza cartas de restaurantes con QR: panel de administración, estadísticas de escaneo y suscripción freemium con Stripe. Importador de cartas con IA multimodal que extrae platos de fotos o PDFs.",
    rol: [
      "Full Stack",
      "Next.js + TypeScript",
      "FastAPI + PostgreSQL",
      "Stripe + SSE",
      "CI/CD + Docker",
    ],
    extra: "~100 visitas diarias · en producción con cliente real",
    site: "https://menuunfolded.com",
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/menuunfolded-1.jpg",
      "/img/work/menuunfolded-2.jpg",
      "/img/work/menuunfolded-3.jpg",
    ],
  },
  {
    slug: "loomcast",
    name: "Loomcast",
    timeline: "JUL 2026 – PRESENTE",
    place: "LOCAL",
    about:
      "Estudio multimedia con IA generativa 100 % local: pipeline tema → guion → voz → subtítulos → imágenes → clips → montaje 9:16, con inferencia local sobre Apple Silicon.",
    rol: [
      "Full Stack",
      "Python + FastAPI",
      "Astro + Svelte",
      "llama.cpp + ComfyUI",
      "ffmpeg",
    ],
    extra: "Benchmarking que redujo el render de horas a ~1,5 min por vídeo",
    site: null,
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/loomcast-1.jpg",
      "/img/work/loomcast-2.jpg",
      "/img/work/loomcast-3.jpg",
    ],
  },
  {
    slug: "nuxoasist",
    name: "NuxoAsist",
    timeline: "ENE – JUN 2026",
    place: "ESPAÑA",
    about:
      "Sistema de control horario alineado con la normativa española: fichaje, pausas, horas extra, ausencias y exportación para inspección. Auditoría append-only con autor, fecha y motivo.",
    rol: [
      "Full Stack",
      "Node 22 + Fastify 5",
      "React 19 + Tailwind",
      "OpenAPI 3.1 (36 endpoints)",
      "178 tests Vitest",
    ],
    extra: null,
    site: null,
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/nuxoasist-1.jpg",
      "/img/work/nuxoasist-2.jpg",
      "/img/work/nuxoasist-3.jpg",
    ],
  },
  {
    slug: "mindcheck",
    name: "MindCheck",
    timeline: "2025",
    place: "REMOTE",
    about:
      "Plataforma educativa que convierte documentos PDF en tests interactivos de opción múltiple con IA.",
    rol: [
      "Full Stack",
      "Next.js + TypeScript",
      "FastAPI + PostgreSQL",
      "JWT + sesiones",
    ],
    extra: null,
    site: null,
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/mindcheck-1.jpg",
      "/img/work/mindcheck-2.jpg",
      "/img/work/mindcheck-3.jpg",
    ],
  },
];
