# Web Forestal Garuhapé SA

Sitio web corporativo de **Forestal Garuhapé SA**, empresa de servicios forestales, logística y consultoría para la cadena foresto-industrial (Argentina, Paraguay y Mercosur).

Sitio en producción: <https://forestalgaruhape.com.ar>

Sitio estático generado con **[Eleventy](https://www.11ty.dev/)** + **[Tailwind CSS](https://tailwindcss.com/)**. Sin base de datos, sin framework de runtime: el resultado es HTML plano que se publica en un hosting Apache.

---

## Stack

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Generador de sitios | Eleventy (`@11ty/eleventy`) | 2.0.1 |
| CSS | Tailwind CSS | 3.3.3 |
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
| `npm run dev` | Levanta Eleventy (`:8080`) **y** Tailwind en modo watch, en paralelo. Es el comando de desarrollo diario. |
| `npm start` | Solo Eleventy con servidor y livereload (sin recompilar Tailwind). |
| `npm run build` | Genera el sitio completo en `_site/` con `NODE_ENV=production`. |
| `npm run watch` | Eleventy en modo watch (sin servidor). |
| `npm run build:tailwind` | Compila Tailwind a `_site/css/styles.css` minificado. |
| `npm test` | `build` + verificación de consistencia del contacto de WhatsApp. |
| `npm run clean` | Borra `_site/`. |

> **Nota Windows:** el script `clean` usa `rm -rf _site`, que es sintaxis de Unix. En PowerShell usá `Remove-Item -Recurse -Force _site` o `npx rimraf _site`.

### Desarrollo

```bash
npm install
npm run dev
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
    │   ├── tailwind.css          # Entrada de Tailwind (capas y componentes)
    │   └── styles.css            # Salida compilada
    ├── js/main.js             # Animación al scroll, hero video, menú móvil, sliders
    └── images/                # Fotos, logos (.svg), videos del hero
```

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

Los tokens técnicos viven en `tailwind.config.js` (`brand`, `font-display`, `font-body`).

---

## Licencia

MIT — ver `package.json`.
