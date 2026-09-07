#!/usr/bin/env bash
#
# scripts/cv-pdf.sh — genera el PDF del CV imprimiendo la propia página /resume.
#
#   npm run cv:pdf              # ES + EN a public/cv/
#   npm run cv:pdf -- --shot    # además, capturas PNG de página completa
#
# El PDF NO se maqueta aparte: sale de `resume.html` con la maqueta de papel
# (clase `is-paper`) de src/css/pages/resume.css. Así la web y el PDF no pueden
# divergir — pero implica que **cada vez que se toque el diseño hay que volver
# a ejecutar esto y versionar el PDF resultante**.
#
# El parámetro `?pdf=1` pone la página en modo descarga: `resume.js` mide el
# contenido y publica su altura, y `scripts/print-pdf.mjs` imprime UNA sola
# página de 210 mm de ancho por ese alto — no un A4 paginado.
#
# Se imprime contra el build de `dist/` servido por `vite preview`, no contra
# el dev server: en dev el CSS lo inyecta el HMR por JS y Chrome llega a
# imprimir antes de que se aplique.

set -euo pipefail

cd "$(dirname "$0")/.."

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PORT="${CV_PDF_PORT:-4173}"
OUT="public/cv"
SHOT=0

[ "${1:-}" = "--shot" ] && SHOT=1

[ -x "$CHROME" ] || {
    echo "✗ no encuentro Chrome en: $CHROME (exporta CHROME=/ruta/a/chrome)" >&2
    exit 1
}

step() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }

step "Build"
npm run build >/dev/null

step "Servidor de preview en :$PORT"
npx vite preview --port "$PORT" --strictPort >/dev/null 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in $(seq 1 40); do
    curl -sfo /dev/null "http://localhost:$PORT/resume.html" && break
    sleep 0.25
done

mkdir -p "$OUT"

for lang in es en; do
    url="http://localhost:$PORT/resume.html?lang=$lang&pdf=1"
    step "PDF ($lang)"
    CHROME="$CHROME" node scripts/print-pdf.mjs "$url" "$OUT/juan-gutierrez-cv-$lang.pdf"
    ls -lh "$OUT/juan-gutierrez-cv-$lang.pdf" | awk '{print "  peso: " $5}'

    # El objetivo es una única página. Si aparece una segunda es que la medida
    # de `resume.js` se quedó corta (fuentes sin cargar, casi siempre).
    if command -v pdfinfo >/dev/null 2>&1; then
        paginas=$(pdfinfo "$OUT/juan-gutierrez-cv-$lang.pdf" | awk '/^Pages:/ {print $2}')
        medida=$(pdfinfo "$OUT/juan-gutierrez-cv-$lang.pdf" | awk -F': +' '/^Page size/ {print $2}')
        if [ "$paginas" = "1" ]; then
            echo "  1 página · $medida"
        else
            printf '\033[31m  ✗ %s páginas (se esperaba 1)\033[0m\n' "$paginas" >&2
        fi
    fi

    if [ "$SHOT" -eq 1 ]; then
        "$CHROME" --headless --disable-gpu --no-sandbox \
            --window-size=1440,900 \
            --screenshot="/tmp/resume-$lang.png" \
            --virtual-time-budget=10000 \
            "http://localhost:$PORT/resume.html?lang=$lang" 2>/dev/null
        echo "  captura → /tmp/resume-$lang.png"
    fi
done

printf '\n\033[32m✓ PDF del CV regenerado en %s/\033[0m\n' "$OUT"
