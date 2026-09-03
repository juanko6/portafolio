#!/usr/bin/env bash
#
# deploy/publish.sh — publica el portafolio en la instancia Oracle.
#
#   ./deploy/publish.sh              # comprueba, construye y publica
#   ./deploy/publish.sh --dry-run    # igual, pero rsync solo enseña qué haría
#   ./deploy/publish.sh --skip-checks
#
# El build se hace SIEMPRE en local: la instancia no tiene Node y con ~950 MB
# de RAM un `vite build` allí es pedir un OOM. Ver deploy/oracle.md.
#
# Variables de entorno para apuntar a otro sitio sin tocar el script:
#   DEPLOY_HOST (por defecto: mindcheck, el alias de ~/.ssh/config)
#   DEPLOY_PATH (por defecto: /var/www/portafolio)
#   DEPLOY_URL  (por defecto: https://juanko.com)

set -euo pipefail

HOST="${DEPLOY_HOST:-mindcheck}"
DEST="${DEPLOY_PATH:-/var/www/portafolio}"
URL="${DEPLOY_URL:-https://juanko.com}"

DRY_RUN=0
SKIP_CHECKS=0

while [ $# -gt 0 ]; do
    case "$1" in
        -n | --dry-run) DRY_RUN=1 ;;
        --skip-checks) SKIP_CHECKS=1 ;;
        -h | --help)
            # imprime la cabecera hasta la primera línea que no sea comentario
            awk 'NR>2 && /^#/ { sub(/^# ?/, ""); print; next } NR>2 { exit }' "$0"
            exit 0
            ;;
        *)
            echo "opción desconocida: $1 (usa --help)" >&2
            exit 2
            ;;
    esac
    shift
done

cd "$(dirname "$0")/.."

step() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }
fail() { printf '\033[31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

# ---------------------------------------------------------------------------
# 1. Calidad. Se salta con --skip-checks, pero por defecto no se publica nada
#    que no pase lo mismo que exige el CI.
# ---------------------------------------------------------------------------
if [ "$SKIP_CHECKS" -eq 0 ]; then
    step "Lint"
    npm run lint
    step "Tests"
    npm test
else
    echo "⚠ comprobaciones saltadas (--skip-checks)"
fi

# ---------------------------------------------------------------------------
# 2. Build
# ---------------------------------------------------------------------------
step "Build"
npm run build

# ---------------------------------------------------------------------------
# 3. Red de seguridad. rsync va con --delete: si dist/ estuviese vacío o a
#    medias, vaciaría el servidor. Se exige que estén las cuatro entradas del
#    MPA y el archivo del v1 antes de tocar nada remoto.
# ---------------------------------------------------------------------------
step "Comprobando el build"
for f in index.html info.html work.html 404.html v1/index.html; do
    [ -s "dist/$f" ] || fail "falta dist/$f — el build no está completo, no publico"
done
[ -d dist/assets ] || fail "falta dist/assets — el build no está completo, no publico"
echo "  las 5 páginas y assets/ están donde deben"

step "Comprobando el acceso a $HOST"
ssh -o BatchMode=yes -o ConnectTimeout=10 "$HOST" "[ -d '$DEST' ] && [ -w '$DEST' ]" \
    || fail "no puedo escribir en $HOST:$DEST — revisa deploy/oracle.md (alta inicial)"
echo "  $HOST:$DEST accesible y escribible"

# ---------------------------------------------------------------------------
# 4. Publicación. --delete deja el servidor idéntico a dist/, sin restos de
#    despliegues anteriores. .DS_Store se excluye porque Vite copia public/
#    entera y macOS los siembra por ahí.
# ---------------------------------------------------------------------------
RSYNC_FLAGS=(-az --delete --exclude=".DS_Store" --itemize-changes)
if [ "$DRY_RUN" -eq 1 ]; then
    RSYNC_FLAGS+=(--dry-run)
    step "rsync (EN SECO — no se cambia nada)"
else
    step "rsync → $HOST:$DEST"
fi

rsync "${RSYNC_FLAGS[@]}" dist/ "$HOST:$DEST/"

if [ "$DRY_RUN" -eq 1 ]; then
    printf '\n\033[1mEnsayo terminado.\033[0m Quita --dry-run para publicar de verdad.\n'
    exit 0
fi

# ---------------------------------------------------------------------------
# 5. Comprobación posterior. No hace falta recargar nginx: son ficheros
#    estáticos y los sirve directamente del disco.
# ---------------------------------------------------------------------------
step "Comprobando $URL"
code=$(curl -s -o /dev/null -m 15 -w '%{http_code}' "$URL/" || echo "000")
if [ "$code" != "200" ]; then
    echo "⚠ $URL/ responde $code — revisa la config de nginx"
elif curl -s -m 15 "$URL/" | grep -q 'id="app"'; then
    echo "  $URL/ sirve el portafolio nuevo (200)"
else
    echo "⚠ $URL/ responde 200 pero no parece el portafolio nuevo."
    echo "  ¿El root de nginx sigue apuntando al sitio antiguo? Ver deploy/oracle.md."
fi

printf '\n\033[32m✓ Publicado.\033[0m\n'
