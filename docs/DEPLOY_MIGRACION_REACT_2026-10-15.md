# Deploy migración a React — 15/10/2026

Bitácora del primer despliegue del sitio React (`fg-site`) a producción, y de los
cuatro problemas que aparecieron en el camino.

- **Repo:** `oscarvogel/web-forestal`, rama `main`
- **Commits:** `b2376c3` → `0061254` (6 commits, incluye el PR de Roman `ea2452f`)
- **Destino:** <https://forestalgaruhape.com.ar> — FTP Ferozo, `DEPLOY_DIR=/` (chroot a `public_html`)
- **Resultado:** en producción, verificado byte a byte contra el build local

---

## 1. Qué se hizo

1. **Actualización del repo.** `git pull --ff-only`. El PR de Roman ya estaba
   mergeado: `feat: integrar migracion a React (fg-site, PR #2 de RomanVC)`.

2. **`fg-site/.env`.** No existía. `deploy-config.mjs` resuelve el `.env`
   relativo a `fg-site/`, así que el de la raíz no alcanzaba. Se generó desde el
   `.env` raíz con `tmp/sync-fg-env.mjs`, sin imprimir la contraseña.
   **VITE_GA_ID quedó vacío**: el sitio Eleventy viejo tampoco tenía Analytics,
   así que no es una regresión.

3. **Build y tests.** `npm install` (103 paquetes) y `npm test`:
   12 páginas prerenderizadas, `sitemap.xml`, `robots.txt`, `llms.txt` y
   `__spa-fallback.html`. 355 archivos, 26,5 MB.

4. **Backup antes de escribir.** Se respaldaron los **23 archivos** que el deploy
   iba a sobrescribir (los 12 HTML, `.htaccess`, `enviar_mensaje.php`,
   `sitemap.xml`, `robots.txt`, `llms.txt`, 6 animaciones JSON), con
   `tmp/backup-rollback.js` y restaurador `tmp/restaurar.js`.
   Quedaron en `tmp/rollback-20261015-0914/`.

5. **Deploy.** Con `npm run deploy` dentro de `fg-site`.

6. **Verificación.** `tmp/verificar-produccion.mjs` compara lo que sirve el
   sitio contra el build local, archivo por archivo.

---

## 2. Bugs encontrados

### 2.1 `deploy.mjs` anidaba las carpetas y rompía el deploy (crítico)

**Síntoma.** Primer intento: `553 Can't open that file` en el archivo 57 de 355,
justo al llegar al primero de `img/`. El sitio quedó a medio actualizar: la
home y 11 páginas seguían viejas, `/consultoria/` ya era nueva, `img/` y
`video/` no existían.

**Causa.** `ensureDir()` de basic-ftp v5 **no es idempotente**: hace `MKD` + `cd`
y **deja el cursor adentro del directorio**, sin volver atrás. `deploy.mjs`
pasaba rutas relativas, así que cada llamada anidaba sobre la anterior:

```
/animations/assets/consultoria/images/img/nosotros/privacidad/servicios/…
```

Son 22 carpetas vacías colgadas de `/animations`. Como `img/` y `video/` nunca
se crearon en la raíz, la subida moría al primer archivo de `img/`.

**Fix.** Pasar rutas absolutas: `ensureDir()` hace `cd('/')` antes de navegar si
el path empieza con `/`, y eso corta el arrastre. Medido contra el servidor:

```
ensureDir('/animations')  / -> /animations   | en la raiz: true
ensureDir('/assets')  /animations -> /assets   | en la raiz: true
ensureDir('/consultoria')  /assets -> /consultoria   | en la raiz: true
ensureDir('/img')  /consultoria -> /img   | en la raiz: true
```

**Las 22 carpetas basura se borraron** con `tmp/limpiar-basura.js`, que solo
borra directorios, solo bajo `/animations/assets`, y aborta si encuentra un
archivo.

> El `deploy.js` de la raíz (sitio Eleventy) lo hacía bien: armaba rutas
> absolutas y volvía con `cd('/')`. La migración a React reintrodujo el bug.

### 2.2 El deploy revirtió un arreglo del formulario de contacto (regresión propia)

**Síntoma.** `/enviar_mensaje.php` devuelve **HTTP 500**.

**Diagnóstico.** El `error_log` del servidor (bajado por FTP) atribuye el fallo a
`Call to undefined function str_contains()` en la línea 14. Se subió un probe
temporal que imprimió la versión y la borró:

```
PHP_VERSION=7.4.33
```

El hosting corre **PHP 7.4**. El archivo nuevo usaba:

- `str_contains()` → PHP 8.0+
- tipos de retorno `: never` → PHP 8.1+

**Lo importante:** el archivo que estaba en producción antes del deploy **ya
tenía el arreglo** (`strpos(...) !== false` y `: void`). El diff contra el
build eran **3 líneas**. El PR de Roman reintrodujo el bug y el deploy lo
subió, dejando el formulario de contacto caído.

**Fix.** Se restauraron esas 3 líneas en `fg-site/public/enviar_mensaje.php`. El
build resultante es **byte a byte idéntico** al que estaba funcionando, y se
subió solo ese archivo con `tmp/subir-uno.js`.

**Verificado por HTTP:** `200` con `Accept: text/html` y `405 {"ok":false}` con
`Accept: application/json` (correcto: el endpoint es solo POST).

**Guarda agregada.** `scripts/check-build.mjs` ahora falla el build si
`enviar_mensaje.php` usa `str_contains`, `str_starts_with`, `str_ends_with`,
`: never`, `?->` o `match()`. Probado en negativo: inyectando `str_contains` el
test falla con exit 1.

### 2.3 `scripts/backup-produccion.js` se cuelga (no bloqueante)

`node scripts/backup-produccion.js` se quedó **3,5 minutos sin avanzar** bajando
`images/galeria/caminos_forestales.png` (0 bytes escritos). Se abortó.

El backup completo son 504 archivos / 144 MB, casi todo `images/`, y ese
contenido **no hace falta para volver atrás**: el deploy es reemplazo selectivo
y nunca borra, así que los media que ya están en el servidor siguen ahí.

Se resolvió con `tmp/backup-rollback.js`, que no lista producción: recorre los
paths del build e intenta bajar cada uno. Tarda ~1 minuto y baja exactamente el
conjunto de rollback.

**El script original sigue sin arreglar** — queda como pendiente.

### 2.4 `client.list()` sobre una ruta inexistente devuelve `[]` (trampa de diagnóstico)

Hizo creer que `/animations/assets` seguía existiendo después de borrarla.
`basic-ftp` devuelve **array vacío** en vez de error 550, así que "no existe" y
"existe pero vacía" se ven iguales. La forma correcta es preguntar al padre y
verificar si el nombre está en la lista.

### 2.5 Comentarios corruptos en `.htaccess` (cosmético)

Dos líneas del `.htaccess` del build quedaron con texto pegado, probablemente por
una herramienta que comió caracteres:

- línea 6: `# Evitar elRewriteChracterescaping`
- línea 65: `# Configurar cabeceras HTTP para prevenir.Clickjacking`

Son **comentarios**: no afectan el comportamiento de Apache. El archivo está en
UTF-8 válido, sin BOM, sin mojibake (verificado a nivel de bytes).

---

## 3. Estado verificado en producción

Comparado byte a byte contra `fg-site/build/client`:

| URL | Estado |
| --- | --- |
| `/` y las 11 páginas de sección y servicio | coinciden |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | coinciden |
| `/images/clientes/*.svg` | coinciden |
| `/img/1470-1280.avif` (114.446 B) | coincide |
| `/video/hero-cinematic.mp4` (2.811.617 B) | coincide |
| `/enviar_mensaje.php` | `303` (redirect correcto del formulario) |
| URL inexistente | `404` con 2149 B = `__spa-fallback.html` exacto |

**Ninguna página quedó a medias.** El 404 de Apache sirve el shell de React
Router: el fallback funciona.

---

## 4. Cambios en el repo (sin commitear)

```
 M fg-site/public/enviar_mensaje.php   3 líneas: compatibilidad con PHP 7.4
 M fg-site/scripts/check-build.mjs     guarda contra funciones de PHP 8
 M fg-site/scripts/deploy.mjs          ensureDir() con rutas absolutas
?? scripts/borrar-web-vieja.js         (preexistente, no es de este deploy)
?? scripts/descargar-web-vieja.js      (preexistente, no es de este deploy)
```

`fg-site/.env` tiene `DEPLOY_CONFIRM=NO` (se volvió a bajar el candado).

Ayudas de este deploy, todas en `tmp/` (gitignored, se pueden borrar):
`sync-fg-env.mjs`, `backup-rollback.js`, `restaurar.js`, `limpiar-basura.js`,
`subir-uno.js`, `verificar-produccion.mjs`, `sonda-php.js`, `sonda-ensuredir.js`,
`orden-deploy.js`.

---

## 5. Pendientes

1. **Commitear los tres cambios.** El fix de `deploy.mjs` es importante: sin él,
   el próximo deploy falla igual en la primera carpeta nueva.
2. **`scripts/backup-produccion.js` sigue colgando** (§2.3). Reemplazarlo por
   `tmp/backup-rollback.js` o arreglar el manejo de timeouts.
3. **PHP 7.4 en el hosting.** El código nuevo tiene que seguir siendo compatible
   con 7.4 mientras siga así. Si se puede subir a 8.1+ en el panel, se levanta
   el techo; si no, la guarda de `check-build.mjs` es la red.
4. **Assets viejos acumulados en el servidor.** El deploy nunca borra: cada
   deploy deja los bundles con hash anterior. `assets/` ya tenía 326 archivos.
   Habría que definir una limpieza (con su propio backup).
5. **`npm audit`: 1 vulnerabilidad alta** en las dependencias de `fg-site`.
   Revisar con `npm audit` antes de aplicar `--force`.
6. **`VITE_GA_ID` vacío.** Sin banner de cookies ni medición. Igual que antes
   del deploy, pero queda pendiente si se quiere analytics.
7. **Comentarios del `.htaccess`** (§2.5).
8. **Limpiar `/images`** (124 MB) si ya no lo usa el sitio React: el build nuevo
   usa `img/` e `images/clientes/`.

---

## 6. Para volver atrás

```powershell
node tmp/restaurar.js "tmp/rollback-20261015-0914"          # simulación
node tmp/restaurar.js "tmp/rollback-20261015-0914" --ejecutar
```

Restaura los 23 archivos del estado previo. Los archivos que el deploy agregó no
se borran (el restaurador tampoco borra), pero no están referenciados por
ningún HTML.

---

## 7. Anexo: reporte de Search Console del 15/10

Llegó una notificación de **Search Console → Indexación → Páginas** con:

| Motivo | Páginas |
| --- | --- |
| Error de servidor (5xx) | 17 |
| No se ha encontrado (404) | 4 |
| Página con redirección | 4 |
| Rastreada: actualmente sin indexar | 1 |

**No hay ningún 5xx actual.** Se probaron 31 URLs adversariales contra el sitio
vivo (inexistentes, con mayúsculas, `//doble//`, `/wp-admin/`, `/.env`, paths
profundos, `/v1/`): 26 devolvieron 404, 2 un 200 y 2 un 403. **Cero 5xx.** Una
404 inventada devuelve 404 y no 500, así que el `ErrorDocument` está bien armado.

**Las 17 URLs son del WordPress viejo**, no del sitio actual:

- Patrón `/servicios/1-servicios-de-cosecha` … `/servicios/8-transporte-de-combustible-diesel`
- Patrón `/novedades/1-pagina` … `/novedades/11-transporte-bitrem-targa-distancia`
- `/usuarios/1/pagina` (típico de WordPress)
- `/servicio/2-servicios-de-transporte` (singular)
- `/guiado/che/certificados_iso.pdf`

**Último rastreo: entre el 14 de junio y el 7 de agosto de 2025**, o sea hace más
de un año. Hoy las 17 devuelven **404 limpio**, que es la respuesta correcta para
una URL muerta.

También se verificó que la migración **no perdió ninguna URL**: los 6 slugs de
servicios son idénticos entre `src/_data/todos_los_servicios.json` (Eleventy) y
`fg-site/app/content/servicios.json` (React).

### Opcional: 301 desde los servicios viejos

Siete URLs tienen equivalente directo en el sitio actual y podrían redirigir con
`RedirectMatch` en el `.htaccess`, para conservar valor de SEO residual:

| URL vieja | Equivalente actual |
| --- | --- |
| `/servicios/1-servicios-de-cosecha` | `/servicios/cosecha-forestal/` |
| `/servicios/2-servicios-de-transporte` | `/servicios/transporte-forestal/` |
| `/servicios/3-energia-biomasa` | `/servicios/aprovechamiento-biomasa-forestal/` |
| `/servicios/4-transporte-de-vehiculos-especiales` | `/servicios/transporte-forestal/` |
| `/servicios/6-servicio-de-mantenimiento-de-caminos` | `/servicios/caminos-forestales/` |
| `/servicios/7-servicio-transporte-bitrem-camion` | `/servicios/transporte-forestal/` |
| `/servicios/8-transporte-de-combustible-diesel` | `/servicios/transporte-forestal/` |

Las `/novedades/*` y `/usuarios/*` no tienen equivalente: dejarlas en 404, que es
lo correcto.

**Valor real: bajo.** Google no las rastrea desde hace más de un año y van a
desaparecer solas del índice. Es una optimización, no una corrección.

---

## 8. Efectos ausentes en resoluciones bajas + caché de 30 días (aplicado)

Síntoma reportado: en una computadora los efectos del sitio nuevo no se veían,
en otra sí. **No faltaba nada subido**: verificado contra producción, 17
peticiones todas 200 y **cero errores de consola**.

Había dos causas distintas.

### 8.1 Caché: el HTML se servía cacheado 30 días

```
/                    Cache-Control: public, max-age=2592000   (30 días)
/assets/site-*.css   Cache-Control: public, max-age=2592000
ETag: null
```

`ExpiresDefault "access plus 1 month"` capturaba también a `text/html`, y sin
`ETag` el navegador ni siquiera revalida. Como el HTML es el que apunta a los
bundles, una máquina con el `index.html` viejo cacheado seguía pidiendo los
bundles viejos — que además siguen en el servidor, porque el deploy nunca
borra. **Esto se repetía en cada deploy.**

**Fix aplicado** en `fg-site/public/.htaccess`:

```apache
<IfModule mod_headers.c>
  <FilesMatch "\.(html|json|data)$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  <FilesMatch "\.(js|css|woff2|avif|webp|svg|mp4|ico|png|jpg|jpeg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
```

`Header set` corre después de `mod_expires`, así que gana sobre el
`ExpiresDefault`. El HTML ahora se revalida siempre; los bundles, que llevan
hash en el nombre, se cachean un año.

### 8.2 Los efectos se apagaban por debajo de 1024px

`app/lib/motion.ts` definiaba un único gate para 7 animaciones:

```js
desktopMotion = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
```

La restricción de 1024px **no era técnica**: los rails no dependen del ancho
porque el layout se reordena con `data-[motion=on]` (`w-max` y
`min(58vw, 62rem)`), o sea que se adaptan solos. Lo que realmente los rompe es
el **táctil**, donde un rail horizontal fijado pelea con el scroll nativo.

**Fix aplicado**: se partió en dos constantes según el criterio real de cada
animación.

```ts
export const motionAllowed = '(pointer: fine) and (prefers-reduced-motion: no-preference)'
export const heroVideoAllowed = '(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
```

- `motionAllowed`: rails, escenas fijadas, scrub y scroll suave. Ahora funcionan
  a cualquier ancho, en cualquier ventana.
- `heroVideoAllowed`: solo el video del hero, que pesa 2,8 MB. Ahí el ancho sí
  importa, así que conserva un mínimo de 768px.

`prefers-reduced-motion` **no se relajó en ningún caso**: es accesibilidad. Por
eso una PC con "Efectos de animación" apagados en Windows ve el sitio sin
animaciones, pero completo y sin errores. Para probarlo en DevTools:
*Rendering → Emulate CSS media feature `prefers-reduced-motion`*.

**Verificado contra el build local** con `vite preview`, no leyendo el código:

| Ancho | gate viejo | gate nuevo | `data-motion="on"` | Recorrido del rail |
| --- | --- | --- | --- | --- |
| 760px | `false` | `true` | activo | 2063px |
| 500px | `false` | `true` | activo (3 secciones) | 1355px |

Sin errores de consola en ninguno de los dos anchos.

### Nota sobre `prefers-reduced-motion`

Sigue siendo una causa posible de "no se ven los efectos", y es independiente
de todo lo anterior. Para descartarla en una máquina:

```js
matchMedia('(prefers-reduced-motion: reduce)').matches   // true = es eso
matchMedia('(pointer: fine)').matches                     // false = pantalla tactil
```

---

## 9. Animaciones independientes de la preferencia del sistema

El problema de §8.2 se resolvió de otra manera: en vez de relajar el filtro,
**se eliminó la dependencia de `prefers-reduced-motion`**. Commit
`7e229ef`, rama `codex/animations-ignore-os-motion`.

Cambios (19 archivos) más allá de los gates:

| Archivo | Qué cambió |
| --- | --- |
| `app/lib/motion.ts` | `motionAllowed = '(pointer: fine)'` |
| `app/lib/reveal.ts` | se saca el `return` temprano por `prefersReducedMotion()` |
| `app/lib/smooth.ts` | se elimina el export `prefersReducedMotion` |
| `app/components/Lottie.tsx` | siempre `play()`, ya no `goToAndStop` en el último frame |
| `app/components/Nav.tsx` | el menú móvil anima siempre |
| `app/components/reactbits/LogoLoop.tsx` | se saca el return temprano |
| `app/components/reactbits/ScrollVelocity.tsx` | idem |
| `app/sections/Cifras.tsx` | `gsap.matchMedia()` → `gsap.context()` |
| `app/app.css` | se borra el bloque `@media (prefers-reduced-motion: reduce)` |

Y se agrega **`scripts/check-motion-policy.mjs`**, wired en `npm test`, que falla
el build si algún `.css`/`.ts`/`.tsx` vuelve a mencionar la preferencia.

### Dos defectos encontrados en la revisión

**a) El hero perdía la entrada en móvil (regresión).** Al dejar una sola
condición, `mm.add({ rail: motionAllowed })` envolvía **también** la timeline de
entrada del hero, no solo la escena anclada. Como `motionAllowed` exige puntero
fino, en cualquier táctil la entrada no se reproducía nunca: antes sí pasaba
(la entrada era para todos y solo el anclado era de escritorio). Corregido con
una segunda condición siempre verdadera:

```js
mm.add({ rail: motionAllowed, siempre: '(min-width: 0px)' }, (context) => {
```

**b) El guard no distinguía código de documentación.** Buscaba texto crudo, así
que escribir el término en un comentario rompía el build, o sea que la decisión
no se podía ni documentar en el propio código que la aplica. Ahora saca
comentarios antes de buscar.

Verificado con prueba negativa: inyectando
`window.matchMedia('(prefers-reduced-motion: reduce)')` el guard falla con
`exit=1` señalando el archivo; con la mención solo en comentario, pasa.

### Verificación visual

| Contexto | Resultado |
| --- | --- |
| 390×844 táctil | hero **sí** anima (escala del pin `1→0→0.117→0.654→1.128`), rail apagado, Lenis apagado, video sin cargar |
| 1920×1080 escritorio | 3 secciones con `data-motion=on`, rail de 4416px, Lenis activo, video cargado, 15 animaciones `data-anim`, 0 errores |

> **Nota de accesibilidad:** quitar `prefers-reduced-motion` significa que quien
> tenga esa preferencia activa por motivos de salud (trastornos vestibulares,
> migrañas) verá el sitio con movimiento completo. Es una decisión deliberada del
> proyecto, por eso quedó blindada con el guard. Si alguna vez se quiere
> recuperar, hay que desactivar `check-motion-policy.mjs` en el mismo commit.