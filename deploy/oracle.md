# Despliegue en Oracle Cloud

Runbook de `juanko.com`. El sitio es estático: Vite compila en local y `rsync` sube el
resultado. En el servidor no hay build, ni Node, ni contenedores.

---

## La instancia

| | |
|---|---|
| Acceso | `ssh mindcheck` → `ubuntu@168.75.106.115` |
| Sistema | Ubuntu 22.04 LTS, x86_64, 2 vCPU |
| Memoria | 956 MB + 2 GB de swap en `/swapfile` |
| Disco | 45 GB (~20 % usado) |
| Servidor web | nginx **1.18.0** |
| Puertos abiertos | 22, 80, 443 y nada más |
| Docker | instalado pero **desactivado**; `sudo systemctl enable --now docker` lo devuelve |

`ubuntu` es un usuario normal con `sudo`. SSH solo por clave pública: ni contraseñas ni root.

Rutas que importan:

```
/var/www/portafolio            el sitio (propiedad de ubuntu:www-data, 755)
/var/www/juanko.com            el portafolio v1 — copia de rescate, ver Rollback
/etc/nginx/sites-available/juanko.com
/etc/letsencrypt/live/juanko.com/
/var/log/nginx/portafolio.{access,error}.log
```

---

## Publicar

Desde la raíz del repo, en tu máquina:

```bash
npm run deploy
```

Hace lint, tests, build, sube `dist/` con `rsync --delete` y comprueba la URL. **No hay que
recargar nginx**: son ficheros estáticos y los sirve del disco.

Para ensayar sin tocar nada:

```bash
npm run deploy -- --dry-run
```

Otras opciones: `--skip-checks` (salta lint y tests) y `--help`. El destino se puede cambiar con
`DEPLOY_HOST`, `DEPLOY_PATH` y `DEPLOY_URL` sin editar el script.

El script **se niega a publicar** si faltan páginas en el build o si el destino no es escribible.
No lo esquives: `rsync --delete` deja el servidor idéntico a `dist/`, así que un build a medias
vaciaría el sitio.

---

## Alta inicial

Ya está hecho. Queda aquí por si hay que reconstruirlo en otra máquina.

**1. El directorio**, propiedad del usuario que publica para no necesitar `sudo` en cada envío:

```bash
sudo mkdir -p /var/www/portafolio
sudo chown ubuntu:www-data /var/www/portafolio
sudo chmod 755 /var/www/portafolio
```

**2. `rsync`**, que la imagen de Oracle no trae:

```bash
sudo apt-get install -y rsync
```

**3. La configuración de nginx.** Se copia `deploy/nginx.conf` del repo, se prueba y se recarga:

```bash
scp deploy/nginx.conf mindcheck:/tmp/juanko.com.conf
ssh mindcheck 'sudo cp /tmp/juanko.com.conf /etc/nginx/sites-available/juanko.com \
  && sudo ln -sf /etc/nginx/sites-available/juanko.com /etc/nginx/sites-enabled/ \
  && sudo nginx -t && sudo systemctl reload nginx'
```

`nginx -t` antes de recargar, siempre. Una configuración inválida no recarga, pero si el proceso
se reinicia con ella el sitio entero se cae.

**4. El certificado** ya existe y cubre `juanko.com` y `www.juanko.com`. Si hubiera que rehacerlo:

```bash
sudo certbot --nginx -d juanko.com -d www.juanko.com
```

### Validar la config sin arriesgar la viva

Se puede probar un `nginx.conf` sin instalarlo, montando una configuración de usar y tirar que
solo lo incluya a él:

```bash
scp deploy/nginx.conf mindcheck:/tmp/test.conf
ssh mindcheck 'printf "events {}\nhttp {\n  include /etc/nginx/mime.types;\n  include /tmp/test.conf;\n}\n" > /tmp/nginx-test.conf
  sudo nginx -t -c /tmp/nginx-test.conf; rm -f /tmp/test.conf /tmp/nginx-test.conf'
```

Comprueba sintaxis, rutas y certificados sin tocar lo que está sirviendo.

---

## Rollback

`/var/www/juanko.com/` conserva el portafolio v1 tal y como estaba antes del cambio. Para volver
atrás basta con devolver el `root` y recargar:

```bash
ssh mindcheck 'sudo sed -i "s|root /var/www/portafolio;|root /var/www/juanko.com;|" \
  /etc/nginx/sites-available/juanko.com && sudo nginx -t && sudo systemctl reload nginx'
```

Vuelta a la normalidad: la misma orden al revés. Cuando el sitio nuevo lleve un tiempo estable,
ese directorio se puede borrar: el v1 vive también en el repo, en `public/v1/`, y se publica en
`https://juanko.com/v1/`.

---

## TLS

`certbot` 1.21.0 (paquete de apt, no snap). Su `timer` está activo y comprueba dos veces al día;
renueva cuando quedan menos de 30 días. No hay que hacer nada.

Verificado el 03/09/2026: `certbot renew --dry-run` → *all simulated renewals succeeded*. Tarda
varios minutos en esta máquina, y mientras corre bloquea cualquier otro `certbot`.

```bash
ssh mindcheck 'sudo certbot certificates'      # qué hay y cuándo caduca
ssh mindcheck 'sudo certbot renew --dry-run'   # ensayo de renovación
ssh mindcheck 'systemctl list-timers certbot.timer'
```

Si una renovación falla, casi siempre es que el puerto 80 no llega: certbot valida por HTTP. Repasa
que la security list de Oracle y `ufw` sigan permitiéndolo.

---

## Cuando algo va mal

**El sitio da 404 en todo.** El `root` apunta a un directorio vacío o inexistente. Comprueba que
`/var/www/portafolio/index.html` existe y vuelve a publicar.

**Publico y no cambia nada.** Caché del navegador. Los HTML se sirven sin caché agresiva, pero
`/assets/` va con `immutable` a un año — por eso Vite pone un hash en cada nombre y cada build
genera rutas nuevas. Prueba con `curl -sI https://juanko.com/` y mira el `last-modified`.

**`nginx -t` falla tras editar la config.** No recargues. Los mensajes de nginx dicen fichero y
línea. Si te quedas atascado, `deploy/nginx.conf` en el repo es la fuente de verdad: cópialo otra
vez y empieza de ahí.

**No puedo escribir en `/var/www/portafolio`.** Se perdió la propiedad, normalmente porque algo
escribió como root. Se arregla con el `chown` del alta inicial.

**Las páginas se sirven pero sin estilos.** Falta `dist/assets/`. Reconstruye en local y vuelve a
publicar; el guardián del script debería haberlo impedido.

Registros:

```bash
ssh mindcheck 'sudo tail -50 /var/log/nginx/portafolio.error.log'
ssh mindcheck 'sudo tail -50 /var/log/nginx/portafolio.access.log'
```

---

## Trampas de esta máquina

Cinco cosas que ya nos han mordido. Están aquí para no repetirlas.

**1. `http2` es del socket, no del vhost.** nginx 1.18 no admite `http2 on;` (eso es 1.25.1+), va
como opción del `listen`. Y basta declararla en **un** server por puerto: si aparece dos veces en
el mismo `:443`, nginx da `duplicate listen options` y **no arranca ninguna configuración**.
Pasó al revés: el bloque que la declaraba era el de MindCheck, y al borrarlo el sitio cayó a
HTTP/1.1 sin que nada avisara. Se comprueba con `curl -sI --http2 https://juanko.com | head -1`.

**2. UFW no protege los puertos que publica Docker.** Docker mete reglas **DNAT** en
`nat/PREROUTING`: el tráfico va por la cadena `FORWARD` y nunca pasa por `INPUT`, que es donde
vive UFW. Había reglas `DENY` para 3000 y 8000 y los puertos respondían igual desde internet. Si
algún día vuelve un contenedor, publícalo como `127.0.0.1:puerto:puerto` — es la única defensa
que no depende de la capa de red de Oracle.

**3. Hay dos cortafuegos, no uno.** UFW en la máquina y la *security list* de la VCN en Oracle.
Un puerto necesita permiso en los dos. Si algo no llega y en el servidor todo parece correcto,
mira la consola de Oracle antes de volverte loco.

**4. `try_files ... /404.html` devuelve un 200.** Poner la página de error como último argumento
de `try_files` hace un redirect interno y responde `200 OK` con el contenido del 404, que para un
buscador significa "esta página existe". Lo correcto es `try_files ... =404` y dejar que
`error_page` la sirva. Se verifica con `curl -sI https://juanko.com/noexiste | head -1`.

**5. Un `location` con `add_header` propio descarta los heredados.** No se suman: se sustituyen.
Los bloques de caché de `nginx.conf` repiten las tres cabeceras de seguridad por eso. Si añades
una nueva a nivel de server, tienes que replicarla en ellos o esas rutas se quedarán sin ella.

---

## Qué NO hacer

- **No compilar en el servidor.** 956 MB de RAM sin Node instalado. El build va siempre en local.
- **No meter el sitio en un contenedor.** Es HTML estático y el nginx del host ya lo sirve.
- **No cambiar a Caddy** por el TLS automático: certbot ya renueva solo y Caddy consume bastante
  más memoria en una máquina que no la tiene.
- **No activar HSTS** hasta que el sitio lleve semanas estable. El navegador lo cachea durante
  meses y no hay forma rápida de deshacerlo. La línea está preparada y comentada en `nginx.conf`.
