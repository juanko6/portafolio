// ÚNICA fuente de datos de Work (listado + details). T4.1 / T5.2.
// Regla: todo lo estructurado de /work vive aquí; el chrome UI va por i18n.
// T5.2 — bilingüe completo: la prosa traducible (timeline/place/about/extra)
// vive en `content: { es, en }`. `name`, `rol`, `site`, `repo`, `images` y
// `slug` son universales (términos técnicos / URLs) y no se traducen.
// `repo` apunta a la cuenta GitHub como placeholder hasta tener las URLs reales
// de cada repo (pendiente, ver memoria.md → "Pendiente / abierto").

export function getProjectContent(project, lang) {
  const c = project.content;
  return (lang && c[lang]) || c.es;
}

export const PROJECTS = [
  {
    slug: "menuunfolded",
    name: "MenuUnfolded",
    rol: [
      "Full Stack",
      "Next.js + TypeScript",
      "FastAPI + PostgreSQL",
      "Stripe + SSE",
      "CI/CD + Docker",
    ],
    site: "https://menuunfolded.com",
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/menuunfolded-1.jpg",
      "/img/work/menuunfolded-2.jpg",
      "/img/work/menuunfolded-3.jpg",
    ],
    content: {
      es: {
        timeline: "2026 – PRESENTE",
        place: "ESPAÑA",
        about:
          "SaaS que digitaliza cartas de restaurantes con QR: panel de administración, estadísticas de escaneo y suscripción freemium con Stripe. Importador de cartas con IA multimodal que extrae platos de fotos o PDFs.",
        extra: "~100 visitas diarias · en producción con cliente real",
      },
      en: {
        timeline: "2026 – PRESENT",
        place: "SPAIN",
        about:
          "SaaS that digitizes restaurant menus with QR codes: admin panel, scan statistics and a freemium subscription with Stripe. AI multimodal menu importer that extracts dishes from photos or PDFs.",
        extra: "~100 daily visits · live in production with a real client",
      },
    },
  },
  {
    slug: "loomcast",
    name: "Loomcast",
    rol: [
      "Full Stack",
      "Python + FastAPI",
      "Astro + Svelte",
      "llama.cpp + ComfyUI",
      "ffmpeg",
    ],
    site: null,
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/loomcast-1.jpg",
      "/img/work/loomcast-2.jpg",
      "/img/work/loomcast-3.jpg",
    ],
    content: {
      es: {
        timeline: "JUL 2026 – PRESENTE",
        place: "LOCAL",
        about:
          "Estudio multimedia con IA generativa 100 % local: pipeline tema → guion → voz → subtítulos → imágenes → clips → montaje 9:16, con inferencia local sobre Apple Silicon.",
        extra:
          "Benchmarking que redujo el render de horas a ~1,5 min por vídeo",
      },
      en: {
        timeline: "JUL 2026 – PRESENT",
        place: "LOCAL",
        about:
          "Multimedia studio with 100% local generative AI: a topic → script → voice → subtitles → images → clips → 9:16 edit pipeline, running local inference on Apple Silicon.",
        extra:
          "Benchmarking that cut rendering from hours to ~1.5 min per video",
      },
    },
  },
  {
    slug: "nuxoasist",
    name: "NuxoAsist",
    rol: [
      "Full Stack",
      "Node 22 + Fastify 5",
      "React 19 + Tailwind",
      "OpenAPI 3.1 (36 endpoints)",
      "178 tests Vitest",
    ],
    site: null,
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/nuxoasist-1.jpg",
      "/img/work/nuxoasist-2.jpg",
      "/img/work/nuxoasist-3.jpg",
    ],
    content: {
      es: {
        timeline: "ENE – JUN 2026",
        place: "ESPAÑA",
        about:
          "Sistema de control horario alineado con la normativa española: fichaje, pausas, horas extra, ausencias y exportación para inspección. Auditoría append-only con autor, fecha y motivo.",
        extra: null,
      },
      en: {
        timeline: "JAN – JUN 2026",
        place: "SPAIN",
        about:
          "Time-tracking system aligned with Spanish labor law: clock-in, breaks, overtime, absences and export for inspection. Append-only audit log with author, date and reason.",
        extra: null,
      },
    },
  },
  {
    slug: "mindcheck",
    name: "MindCheck",
    rol: [
      "Full Stack",
      "Next.js + TypeScript",
      "FastAPI + PostgreSQL",
      "JWT + sesiones",
    ],
    site: null,
    repo: "https://github.com/juanko6",
    images: [
      "/img/work/mindcheck-1.jpg",
      "/img/work/mindcheck-2.jpg",
      "/img/work/mindcheck-3.jpg",
    ],
    content: {
      es: {
        timeline: "2025",
        place: "REMOTE",
        about:
          "Plataforma educativa que convierte documentos PDF en tests interactivos de opción múltiple con IA.",
        extra: null,
      },
      en: {
        timeline: "2025",
        place: "REMOTE",
        about:
          "Educational platform that turns PDF documents into interactive multiple-choice tests with AI.",
        extra: null,
      },
    },
  },
];
