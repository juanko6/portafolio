#!/usr/bin/env bash
#
# scripts/cv-pdf.sh — genera el PDF del CV imprimiendo la propia página /resume.
#
#   npm run cv:pdf              # ES + EN a public/cv/
#   npm run cv:pdf -- --shot    # además, capturas PNG de página completa
#
# El PDF NO se maqueta aparte: sale de `resume.html` con los estilos
# `@media print` de src/css/pages/resume.css. Así la web y el PDF no pueden
# divergir — pero implica que **cada vez que se toque el diseño hay que volver
# a ejecutar esto y versionar el PDF resultante**.
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
    url="http://localhost:$PORT/resume.html?lang=$lang"
    step "PDF ($lang)"
    "$CHROME" --headless --disable-gpu --no-sandbox \
        --no-pdf-header-footer \
        --virtual-time-budget=10000 \
        --print-to-pdf="$OUT/juan-gutierrez-cv-$lang.pdf" \
        "$url" 2>/dev/null
    ls -lh "$OUT/juan-gutierrez-cv-$lang.pdf" | awk '{print "  " $9 " — " $5}'

    if [ "$SHOT" -eq 1 ]; then
        "$CHROME" --headless --disable-gpu --no-sandbox \
            --window-size=1440,900 \
            --screenshot="/tmp/resume-$lang.png" \
            --virtual-time-budget=10000 \
            "$url" 2>/dev/null
        echo "  captura → /tmp/resume-$lang.png"
    fi
done

printf '\n\033[32m✓ PDF del CV regenerado en %s/\033[0m\n' "$OUT"
