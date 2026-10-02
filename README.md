# Web Forestal Garuhapé SA

Sitio web corporativo de **Forestal Garuhapé SA**, empresa de servicios forestales, logística y consultoría para la cadena foresto-industrial (Argentina, Paraguay y Mercosur).

Sitio en producción: <https://forestalgaruhape.com.ar>

Sitio estático generado con **[Eleventy](https://www.11ty.dev/)** + **[Tailwind CSS](https://tailwindcss.com/)**. Sin base de datos, sin framework de runtime: el resultado es HTML plano que se publica en un hosting Apache.

---

## Stack

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Generador de sitios | Eleventy (`@11ty/eleventy`) | 2.0.1 |
| CSS | Tailwind CSS — vía Play CDN (se compila en el navegador) | 3.x |
| CSS propio | `src/css/styles.css` (variables de tema, accesibilidad) | — |
| Motor de plantillas | Nunjucks (`.njk`) | — |
| Carruseles | Swiper 8 (CDN) | 8 |
| Tipografías | Playfair Display + Work Sans (Google Fonts) | — |
| Formulario de contacto | PHP nativo (`mail()`) | — |
| Hosting objetivo | Apache (`.htaccess`) | — |

Verificado en **Node v24.21.0** / **npm 11.19.0**.

---

## Requisitos

- **Node.js** 18 o superior (probado en v24).
- **npm** 9 o superior.
- Para el formulario de contacto en producción: un hosting con **Apache** y **PHP** habilitado.

---

## Instalación

```bash
git clone https://github.com/oscarvogel/web-forestal.git
cd web-forestal
npm install
```

---

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm start` | Levanta Eleventy con servidor y livereload en `:8080`. Es el comando de desarrollo. |
| `npm run build` | Genera el sitio completo en `_site/` con `NODE_ENV=production`. |
| `npm run watch` | Eleventy en modo watch (sin servidor). |
| `npm test` | `build` + verificación de consistencia del contacto de WhatsApp. |
| `npm run clean` | Borra `_site/`. |

> **Nota Windows:** el script `clean` usa `rm -rf _site`, que es sintaxis de Unix. En PowerShell usá `Remove-Item -Recurse -Force _site` o `npx rimraf _site`.

### Desarrollo

```bash
npm install
npm start
# http://localhost:8080
```

El build actual genera **16 páginas** y copia **142 archivos** de assets en menos de un segundo.

---

## Estructura del proyecto

```
.
├── .eleventy.js              # Configuración de Eleventy (inputs, passthrough, alias)
├── tailwind.config.js        # Tokens de marca: colores, tipografías
├── package.json
├── MANUAL_MARCA_FORESTAL_GARUHAPE.md   # Manual de marca (identidad, tono, usos)
├── scripts/
│   ├── build.js              # Wrapper de build con NODE_ENV=production
│   └── check-contact.mjs     # Test: consistencia del teléfono/WhatsApp oficial
└── src/
    ├── index.njk             # Home (arma secciones)
    ├── servicios/
    │   ├── index.njk         # Listado de servicios
    │   └── detalle.njk       # Template paginado: 1 página por servicio
    ├── consultoria/index.njk
    ├── nosotros/index.njk
    ├── trabaja/index.njk
    ├── privacidad/index.njk
    ├── terminos/index.njk
    ├── robots.njk            # Genera robots.txt
    ├── sitemap.njk           # Genera sitemap.xml
    ├── llms.njk              # Genera llms.txt
    ├── enviar_mensaje.php    # Receptor del formulario de contacto
    ├── .htaccess             # HTTPS, caché, gzip, cabeceras de seguridad
    │
    ├── _data/                # ← TODO el contenido editable vive acá
    │   ├── site.json             # Datos globales: nombre, URL, contacto, keywords
    │   ├── navigation.json       # Links del menú
    │   ├── servicios.json        # Grilla de servicios de la home
    │   ├── todos_los_servicios.json  # Fuente de las páginas de detalle
    │   ├── galeria.json
    │   ├── galerias/             # 1 JSON por servicio (se indexa por nombre)
    │   ├── clientes.json
    │   ├── nosotros.json
    │   ├── consultoria.json
    │   ├── equipo.json
    │   └── sgi.json              # Contenido de Sistema de Gestión de Calidad
    │
    ├── _includes/
    │   ├── layouts/base.njk      # Layout raíz: <head>, fuentes, banner, footer
    │   ├── components/           # meta, header, hero, footer, form-cv, whatsapp
    │   └── sections/             # servicios, nosotros, sgi, galeria, clientes...
    │
    ├── css/
    │   ├── tailwind.css          # Solo directives @tailwind. Hoy NO se compila (ver abajo)
    │   └── styles.css            # CSS propio del sitio — este es el que se carga
    ├── js/main.js             # Animación al scroll, hero video, menú móvil, sliders
    └── images/                # Fotos, logos (.svg), videos del hero
```

### Cómo se carga el CSS

Las utilidades de Tailwind llegan por el **Play CDN** (`https://cdn.tailwindcss.com`), que compila las clases **en el navegador** en cada visita. `src/css/styles.css` es CSS propio y se carga con `<link>`.

Consecuencias a tener en cuenta:

- **`tailwind.config.js` no se está aplicando.** El Play CDN no lee ese archivo, así que la paleta `brand` y las fuentes `font-display` / `font-body` definidas ahí **no están activas**. El sitio usa clases estándar (`emerald-700`, etc.) y define las tipografías con variables CSS en `base.njk`.
- **No hay paso de compilación de Tailwind.** `src/css/tailwind.css` quedó sin uso.
- El Play CDN está pensado para desarrollo: suma peso al JS del cliente y no es lo recomendado para producción. Migrar al pipeline real (compilar con `tailwindcss` a un `.css` estático y quitar el `<script>` del CDN) es la deuda técnica pendiente de este repo. Ver "Deuda técnica conocida".

---

## Cómo funciona: todo es data-driven

La web no tiene contenido hardcodeado en el HTML. Las páginas se arman con Nunjucks leyendo los JSON de `src/_data/`, y Eleventy los expone como variables globales.

### Editar textos de la empresa

`src/_data/site.json` — nombre, dominio, título y descripción por defecto, email, teléfono y keywords de SEO.

### Editar servicios (la parte más común)

El listado de la home sale de `src/_data/servicios.json`.
Las **páginas individuales** se generan automáticamente desde `src/_data/todos_los_servicios.json` usando paginación de Eleventy: cada objeto del array produce una URL.

Para **agregar un servicio nuevo**:

1. Agregá un objeto a `src/_data/todos_los_servicios.json`:

```json
{
  "titulo": "Nombre del Servicio",
  "slug": "nombre-del-servicio",
  "imagen": "/images/servicios/imagen.png",
  "descripcion": "Texto corto para el listado y el SEO.",
  "descripcion_ampliada": "Texto largo de la página de detalle. Admite <br> y HTML."
}
```

2. Agregalo también a `src/_data/servicios.json` para que aparezca en la home.
3. Opcionalmente creá `src/_data/galerias/nombre-del-servicio.json` con el formato:

```json
[
  { "src": "/images/servicios/foto.jpg", "alt": "Descripción accesible", "title": "Pie de foto" }
]
```

4. `npm run build`. La página `/servicios/nombre-del-servicio/index.html` se crea sola.

> El `slug` debe coincidir con el nombre del archivo en `_data/galerias/`, porque ahí se resuelve la galería de cada detalle.

### Editar secciones de la home

`src/index.njk` es apenas una lista de includes. Las secciones commented-out están disponibles y se pueden reactivar:

```njk
{% include "components/hero.njk" %}
{% include "sections/servicios.njk" %}
{% include "sections/nosotros.njk" %}
{% include "sections/sgi.njk" %}
{# {% include "sections/galeria.njk" %} #}
{# {% include "sections/clientes.njk" %} #}
```

---

## SEO

- Metadatos por página vía `components/meta.njk`, alimentados por el front-matter (`title`, `description`, `seo.*`).
- `sitemap.njk` y `robots.njk` se generan en el build.
- `llms.njk` genera un `llms.txt` con el resumen del sitio.
- En producción, `.htaccess` fuerza HTTPS, canonicaliza el dominio sin `www` y aplica caché y `gzip`.

---

## Formulario de contacto

El formulario hace `POST` a `src/enviar_mensaje.php`, que se copia tal cual al build.

- Destino: `secretaria@forestalgaruhape.com.ar`.
- Honeypot: campo oculto `website` (si viene relleno, se descarta en silencio).
- Valida nombre, mensaje y formato de email.
- Redirige con `303` a `/?contacto=enviado#contacto` o `/?contacto=error#contacto`; `main.js` muestra el mensaje en pantalla.
- Usa `Reply-To` para que la respuesta llegue al interested.

> `mail()` depende del `sendmail` del servidor. Si en tu hosting no está configurado, migrá a SMTP (PHPMailer o similar).

---

## Test

```bash
npm test
```

Ejecuta el build y después `scripts/check-contact.mjs`, que falla si:

- falta el teléfono oficial `+54 9 3743 48-5849` o el número de WhatsApp `5493743485849`, o
- aparece algún número anterior (`+54 9 3743 47-1089` / `5493743471089`) en `src/`, el manual de marca o `_site/`.

Escanea `src/`, `MANUAL_MARCA_FORESTAL_GARUHAPE.md` y `_site/`.

---

## Deploy

El build produce un sitio estático completo en `_site/`. Subí **el contenido de `_site/`** al hosting Apache (no la raíz del proyecto).

```bash
npm run build
# publicar el contenido de _site/ en el document root del servidor
```

El `.htaccess` y `enviar_mensaje.php` ya están incluidos en el build.

---

## Marca

`MANUAL_MARCA_FORESTAL_GARUHAPE.md` documenta la identidad de la empresa: esencia, propósito, visión, posicionamiento, atributos, uso del nombre, paleta y tipografías. **Consultalo antes de generar contenido nuevo** para mantener coherencia de tono y estilo.

Los tokens técnicos están en `tailwind.config.js` (`brand`, `font-display`, `font-body`), pero **hoy ese archivo no se aplica al sitio** (ver "Cómo se carga el CSS"). Si migrás al pipeline compilado, esos tokens pasan a estar activos: verificá que las clases que agregues existan en esa paleta.

---

## Deuda técnica conocida

Cosas detectadas al documentar el repo, pendientes a decisión:

1. **Play CDN de Tailwind en producción.** Compila las clases en el navegador en cada visita. Lo correcto es compilar a CSS estático en el build. Es el cambio con más impacto en performance.
2. **`tailwind.config.js` no se aplica.** Al migrar al pipeline, revisar que ninguna clase nueva dependa de la paleta `brand`.
3. **`src/css/tailwind.css` está sin uso.** Se puede borrar o usar como entrada del pipeline.
4. **`keywords` vacío** en `package.json`.
5. **Sin CI.** Cada cambio depende de que alguien corra `npm test` a mano.
6. **`npm run clean` no funciona en Windows** (usa `rm -rf`).

---

## Licencia

MIT — ver [`LICENSE`](LICENSE) o el campo `license` en `package.json`.
