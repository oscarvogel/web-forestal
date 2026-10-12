---
name: Forestal Garuhapé — Home editorial
description: Sistema documental industrial de Home e interiores editoriales; lectura y contacto adaptados por superficie.
colors:
  forest: "#082d25"
  night: "#061c17"
  brand: "#0f766e"
  cream: "#f1eee6"
  white: "#f7f7f6"
  muted: "#cbd9d2"
  focus: "#bde4d4"
  field: "#0e2a23"
  field-border: "#788f84"
  error-border: "#ff938b"
  error-surface: "#54241f"
  caption: "#b3c9bd"
  number: "#8cb7a6"
  ink-muted: "#56645d"
  success-surface: "#e9f4ed"
  success-ink: "#065f46"
  control-white: "#ffffff"
  rule-light: "#a7b6a9"
  field-border-light: "#9db2a8"
  frame-dark: "#1c3931"
  error-text: "#ffc1bc"
typography:
  display:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(48px, 7.4vw, 112px)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(40px, 4.8vw, 74px)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.045em"
  contact:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(44px, 5.6vw, 84px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.05em"
  year:
    fontFamily: "Manrope Variable, Manrope, system-ui, sans-serif"
    fontSize: "clamp(96px, 13vw, 180px)"
    fontWeight: 700
    lineHeight: 0.85
    letterSpacing: "-0.07em"
  body:
    fontFamily: "Work Sans Variable, Work Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Work Sans Variable, Work Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0.12em"
  action:
    fontFamily: "Work Sans Variable, Work Sans, system-ui, sans-serif"
    fontSize: "0.96rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  straight: "0px"
  video-control: "2px"
  control: "3px"
spacing:
  icon-gap: "12px"
  group: "24px"
  mobile-gutter: "20px"
  tablet-gutter: "32px"
  gutter: "48px"
  scene: "80px"
  section: "100px"
components:
  button-submit:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.control-white}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.25rem"
  button-submit-hover:
    backgroundColor: "{colors.success-ink}"
    textColor: "{colors.control-white}"
  button-nav:
    backgroundColor: "{colors.control-white}"
    textColor: "{colors.forest}"
    rounded: "{rounded.control}"
  field-home:
    backgroundColor: "{colors.field}"
    textColor: "{colors.control-white}"
    typography: "{typography.body}"
    rounded: "{rounded.straight}"
    padding: "0.75rem 0.85rem"
  chapter-link:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.straight}"
  catalog-link:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.straight}"
    padding: "8px 0"
  video-toggle:
    backgroundColor: "rgb(6 28 23 / 65%)"
    textColor: "{colors.white}"
    rounded: "{rounded.video-control}"
    padding: "8px 12px"
  sgc-moment:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.straight}"
    padding: "40px 0"
  status-success:
    backgroundColor: "{colors.success-surface}"
    textColor: "{colors.success-ink}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1rem"
  status-error:
    backgroundColor: "{colors.error-surface}"
    textColor: "{colors.control-white}"
    rounded: "{rounded.control}"
    padding: "0.85rem 1rem"
---

# Design System: Forestal Garuhapé — Home editorial

## Overview

**Creative North Star: "Industrial Forestry Documentary"**

Fotografía operativa propia, titulares gigantes, rótulos pequeños y numeración de servicios construyen el lenguaje documental industrial elegido por el usuario. El bosque y el negro verde sostienen la operación; el crema marca las pausas institucionales. Manrope da escala a los mensajes, Work Sans organiza la lectura y Tabler Outline acompaña las acciones. La diferencia marcada entre título y metadata es una decisión explícita del brief.

**Estado: Home editorial publicada en `98e7d72`; tercera modernización local, 2026-10-06.** La instrucción de implementar autorizó la composición y su integración; no existe una aprobación del storyboard pendiente. Este documento extrae el sistema real de `src/css/home.css` y los estilos compartidos que Home hereda de `src/css/styles.css`. Para páginas interiores, `src/css/styles.css` continúa como autoridad: las aperturas fotográficas comparten identidad con Home y continúan con superficies claras de lectura.

Fuentes: plantillas `src/_includes/home/*`, cabecera y contacto compartidos, `src/js/home.js` y `src/js/main.js`; contrato y estado en `docs/PROPUESTA_MODERNIZACION.md`, `docs/STORYBOARD_EDITORIAL.md` y `docs/FASE_FINAL.md`. La revisión histórica de V2 se conserva en `docs/evidencia/v2-home/` y `.impeccable/review/`. La revisión actual con Apple Design y capturas 1440/768/390/360 se registra en `docs/STORYBOARD_EDITORIAL.md` y `docs/evidencia/home-editorial-2026-10-05/`. La entrega sigue siendo local, sin commit, push ni publicación.

**Key Characteristics:**

- Fotografías operativas reales, logo institucional y mapa con países verificados.
- Titulares gigantes, rótulos pequeños y numeración visible por capacidad.
- Bosque y negro verde alternados con pausas crema.
- Un único motor GSAP/ScrollTrigger con Lenis para la Home elegible.
- Fotos y contenido en flujo como alternativa estática.
- Consulta contextual editable y formulario comercial real.

## Colors

La paleta usa los colores extraídos del CSS implementado. Los valores del frontmatter son normativos para esta documentación de Home.

### Primary

- **Bosque (`forest`)**: imágenes, SGC, cabecera sólida y tinta institucional sobre crema.
- **Verde institucional (`brand`)**: envío comercial y enlaces sobre crema.

### Neutral

- **Negro verde (`night`)**: apertura, recorrido, contacto y pie.
- **Crema de pausa (`cream`)**: año institucional y alcance regional.
- **Blanco suave (`white`) y blanco de controles (`control-white`)**: titulares y lectura sobre oscuro; campos y acciones compartidas, respectivamente.
- **Texto secundario (`muted`)**: introducción, SGC y contenidos de apoyo.
- **Pie operativo (`caption`) y numeración (`number`)**: foto estática y catálogo/índice de capítulos.
- **Tinta secundaria (`ink-muted`)**: aclaraciones sobre crema.
- **Filete sobre crema (`rule-light`) y borde de campo claro (`field-border-light`)**: separadores de alcance regional y campos de formularios interiores.
- **Marco oscuro (`frame-dark`) y texto de error (`error-text`)**: fondo de reserva de imágenes del recorrido y mensajes de error sobre oscuro.
- **Foco claro (`focus`)**: foco en hero, operación, SGC, contacto y pie; selección y caret.
- **Campo y borde (`field`, `field-border`)**: entrada de consulta sobre fondo oscuro.
- **Error (`error-border`, `error-surface`)**: campo inválido y feedback de fallo.
- **Confirmación (`success-surface`, `success-ink`)**: mensaje de envío aceptado y hover del botón compartido.

Las rampas OKLCH de ocho muestras del sidecar se sintetizan para el panel; no son una nueva paleta aplicada al sitio.

**The Surface Authority Rule.** Home V2 usa `home.css` junto con los estilos compartidos; las páginas interiores conservan `styles.css` como autoridad.

## Typography

**Display Font:** Manrope Variable (Manrope, system-ui, sans-serif).
**Body Font:** Work Sans Variable (Work Sans, system-ui, sans-serif).

Fuentes locales precargadas, con `font-display: swap`. Manrope (600/700) establece jerarquía; Work Sans (400/600) sirve a lectura y controles. El brief exige el contraste entre titulares gigantes y rótulos pequeños del hero y los servicios.

### Hierarchy

- **Display:** token `display` en el hero; móvil usa `clamp(42px, 10.7vw, 64px)`.
- **Headline:** token `headline` en capacidades operativas; tablet fija (40px), móvil usa `clamp(36px, 9vw, 52px)`.
- **Contact:** token `contact` en el cierre comercial; móvil usa (10.8vw).
- **Year:** token `year` en la pausa de 1993; móvil usa (29vw).
- **Body:** token `body` compartido; móvil reduce a (16px). Descripciones operativas: `clamp(16px, 1.35vw, 20px)`, ancho máximo (32ch).
- **Label:** token `label` para metadata del hero; móvil (12px). Índice de servicio (12px) con tracking (0.1em); rótulos de la base del hero (11px; 11px móvil). Se conserva su escala pequeña elegida.
- **Action:** token `action` en botones compartidos. Enlaces de servicio (15px); enlace final al catálogo en Manrope, `clamp(20px, 2.5vw, 36px)`.

Introducción, SGC y región conservan sus escalas propias de `home.css`. No se sustituyen todas por el token base de capítulo.

**The Chosen Hierarchy Rule.** Conservar los titulares gigantes y los rótulos pequeños del hero, junto con la numeración de servicios, porque forman parte de la dirección aprobada.

## Layout

Home abre con hero a sangre (100svh), poster inmediato y contenido superpuesto. La cabecera queda fija con JavaScript; es transparente sobre el hero cuando el menú está cerrado y sólida al salir. Sin JavaScript es relativa. Gutter compartido: (48px) escritorio, (32px) tablet y (20px) móvil; altura de cabecera (88/80/72px). El contenedor de la cabecera conserva el máximo compartido (1280px), mientras las escenas usan padding lateral.

La portada editorial sigue Presentación → seis capacidades → Cómo operamos → Empresa → alcance regional → SGC → consulta. Las capacidades usan fotografías y texto exterior en cuadrícula de tres columnas en escritorio, dos en tablet y una en móvil. Cada tarjeta conserva su ancla histórica y enlace al detalle.

Escritorio elegible: tres escenas de al menos 100svh, escenario fotográfico sticky debajo de la cabecera y texto que avanza en el documento. Planificar, Operar en campo y Abastecer la industria comparten fotografía a sangre, degradado de lectura y eje de texto. Acopio conserva su imagen horizontal.

La alternativa estática conserva fotos con texto en dos columnas; hasta 767px se apilan. Empresa, región y contacto pasan a una columna. La pausa crema combina 1993 y la flota real. SGC usa cuatro compromisos compactos en cuatro/dos/una columnas y fondo absoluto, sin fijación. El mapa destaca únicamente Argentina y Paraguay; no implica emplazamientos ni cobertura completa del territorio.

## Elevation & Depth

La profundidad principal procede de imágenes a sangre, gradientes y capas tonales. Hero combina transparencias verde oscuro y cierre en negro verde; SGC usa overlay oscuro al (80%). Home no añade sombras decorativas a capítulos ni una escala de tarjetas. El menú móvil compartido sí conserva `0 12px 18px rgb(0 0 0 / 12%)`; la cabecera sobre hero declara `box-shadow: none`.

## Shapes

Marcos fotográficos rectos y máscaras `inset`. Los campos de Home tienen radio (0px), el control de video (2px), y botones/feedback compartidos (3px). Los enlaces de servicio y catálogo usan borde inferior. Tabler Outline usa normalmente (1.25rem) e iconos SVG decorativos fuera del foco.

## Components

### Commercial actions

Botón de envío: token `button-submit`, mínimo (48px), foco (3px) con offset (3px), hover `button-submit-hover` y desplazamiento de activación (1px). Enviando deshabilita el control, anuncia `aria-busy` y cambia el texto a «Enviando…». Consultar en cabecera usa variante clara, mínimo (44px). El acceso final al catálogo usa token `catalog-link`, mínimo (56px) y tipografía de mayor escala.

Cada escena operativa conserva «Conocer el servicio» y «Consultar»: enlaces semánticos, mínimo (48px), icono y borde inferior. La consulta mantiene `/?servicio=<slug>#contacto`. Las seis capacidades se resuelven por slug, con biomasa correcta y consultoría canónica en `/consultoria/`.

### Inputs / Fields

Token `field-home` editable, mínimo (48px), textarea mínimo (132px), borde (1px). El foco claro y el caret sobreviven al tema oscuro. Invalidación usa `aria-invalid`, borde de error y texto vinculado; la edición limpia el error del campo.

El formulario real hace POST nativo a `/enviar_mensaje.php`. Con JavaScript, pide JSON al mismo endpoint y conserva los contratos de éxito, errores de campo y fallo; sin JavaScript mantiene el envío nativo. El éxito comunica «El envío fue aceptado», sin equipararlo a recepción efectiva de correo. Fallos de servidor o conexión mantienen una vía comercial alternativa; el fallo de conexión conserva los datos. Consulta contextual sigue siendo editable.

### Navigation

Cabecera compartida con Servicios, Nosotros, SGC y Consultar. Menú tablet/móvil con botón (48px), `aria-expanded`, cierre al navegar/fuera del menú y Escape con restauración de foco. La apertura mantiene fondo sólido aunque la cabecera esté sobre el hero. Anclas de capítulos inmediatas; Lenis suaviza la rueda. Las rutas y el ancla pública técnica `#sgi` se conservan.

### Video control

Autoplay silencioso real desde (1024px), puntero fino, sin movimiento reducido ni ahorro de datos. El poster permanece debajo del video; el botón de pausa aparece cuando hay reproducción y anuncia estado mediante etiqueta/`aria-pressed`. Pausa manual persiste; salir de pantalla u ocultar la pestaña pausa el medio. Cambios de elegibilidad retiran los `src`; móvil/reduced-motion no los asignan.

La Home usa hero-cinematic.mp4: montaje local de fotografías, 36s a 30fps, planos de 8s y disoluciones de 2s, con encuadre fijo y loop continuo. El video entra por opacidad en 1400ms. Si falla o la reproducción se rechaza, se muestra el poster y se anuncia indisponibilidad; si el control tenía foco, se pasa al enlace de recorrido. Los atributos `data-src` permiten evitar carga automática en dispositivos no elegibles.

### Operational sequence

Un contexto GSAP + ScrollTrigger coordina tres imágenes; una instancia de Lenis se integra con el ticker. Cada escena usa el mismo lienzo y degradado. La imagen entrante sube de 12% a 0%; la saliente sube de 0% a −8%, con disolución `sine.inOut` de un tercio de capítulo centrada en el cambio y `scrub: 0.6`. La cobertura de 132% y el inicio en −16% evitan bordes. No se aplica zoom ni parallax adicional.

Empresa, mapa y SGC siguen el flujo normal, con entradas breves de 20px/350ms. Contacto permanece en flujo. El contexto exige escritorio ≥1024px, puntero fino y movimiento permitido. Cambiar viewport o preferencia revierte estilos, retira ticker y destruye Lenis. Móvil, tablet, movimiento reducido, ausencia de JavaScript o fallo del motor muestran fotos y textos estáticos. No hay snap ni avances forzados.

### Contact feedback

`status-success` y `status-error` son estados existentes del formulario, con `role="status"`, `aria-live="polite"` y foco programático. Errores de campo orientan al primer control inválido; éxito o fallo de envío orientan al mensaje. Estos snippets documentan apariencia; el contrato y las peticiones viven en el formulario real.

## Do's and Don'ts

### Do:

- **Do** conservar fuentes locales, logo institucional, Tabler Outline y fotografías operativas propias.
- **Do** preservar los titulares gigantes, rótulos pequeños y numeración acordados.
- **Do** mantener una sola instancia de Lenis dentro del contexto de movimiento de Home.
- **Do** conservar lectura estática, foco visible y envío nativo sin JavaScript.
- **Do** mantener las seis capacidades por slug, consulta editable y contratos PHP existentes.
- **Do** usar el mapa exclusivamente como alcance institucional de Argentina y Paraguay.

### Don't:

- **Don't** fijar escenas narrativas en interiores: conservar su lectura en flujo.
- **Don't** asignar fuentes de video a móvil, movimiento reducido o ahorro de datos.
- **Don't** convertir la pausa manual de video en una reproducción forzada al volver a la pestaña.
- **Don't** inventar cifras, certificaciones, testimonios o ubicaciones operativas.
- **Don't** confundir las muestras manuales del storyboard con la timeline implementada en Home.
- **Don't** presentar la entrega local como publicación ni el envío aceptado como prueba de recepción de correo.


## Recursos de imagen actualizados

Los siete recursos aportados por el usuario se vinculan por servicio y usan AVIF/WebP con hash. Cosecha y Biomasa tienen recortes autorizados para excluir nombres de marca alterados, editados con imagegen; sus originales permanecen en `src/images/actualizadas/originales/`. La nueva Acopio vertical corresponde a catálogo y galería: el capítulo mantiene la fotografía horizontal y el fondo oscuro aprobados. Poster y montaje usan la nueva Cosecha. El detalle de fuentes, dimensiones y prompt figura en `docs/recursos/IMAGENES_ACTUALIZADAS.md`. Los wrappers picture de tarjetas y detalles ocupan el 100% del encuadre existente; las imágenes siguen usando object-fit cover.


## Mejoras de la auditoría Apple Design — 2026-10-05

Se aplicaron las ocho recomendaciones de `docs/AUDITORIA_APPLE_DESIGN_2026-10-05.md`: hover claro en Acopio, SVG negativo con todas sus letras blancas en las rutas, poster móvil con foco en la cabina (62% horizontal, altura 120% anclada abajo), acción Consultar visible junto al recorrido móvil, rótulos de 11–12px, entradillas completas y alcance estructurado, navegación con página/sección activa y enlace SGC en Nosotros. El texto técnico original permanece disponible en disclosures HTML nativos. El formulario orienta el mensaje y cancela la espera local a los 20 segundos, conservando datos y explicando que no se pudo confirmar el envío; no reintenta automáticamente. SGC móvil usa altura por contenido y separación de 32px; la revisión editorial posterior compacta también escritorio.

La variante del logo usa directamente `fg-negative.svg`; ya no necesita filtro específico de Home. Esta entrega sigue siendo local. Capturas posteriores bajo `docs/evidencia/apple-design-2026-10-05/despues/`. No se ejecutaron pruebas automatizadas ni envíos reales de correo.


## Interiores editoriales y consulta — 2026-10-06

Aperturas fotográficas de 480 px mínimos en escritorio, H1 40–72 px y degradado de lectura; en móvil, foto horizontal de 260 px y contenido crema con H1 32–40 px. Índice local en flujo, foco visible y enlaces de 48 px. Componentes compartidos service-opening, service-gallery y service-related con selección por slug en serviceEditorial.js. Galerías con hasta tres fotos documentales; Consultoría conserva una fotografía real amplia y sus ilustraciones como complemento desplegable.

Home conserva su relato de tres escenas, con resúmenes exclusivos de 18–28 palabras y encuadres de tarjetas propios. Empresa alinea fotografía y copy desde arriba; región y consulta usan titulares en frase. CSS comparte tokens por función y elimina overrides históricos sin nuevo motor de movimiento.

El selector opcional admite los seis servicios en HTML/JS/PHP. Las sugerencias nunca reemplazan un texto editado; éxito confirmado limpia los campos y errores conservan servicio y mensaje. El video actual usa H.264 veryslow CRF 34 (`aq-mode=3`, `tune stillimage`, GOP de 300), 1280×720 a 30 fps, 36 segundos y fundidos de 2 segundos, con los fotogramas pasando por la misma gradación de color del sitio; pesa 2.811.617 B.

Revisión y límites actuales: docs/TERCERA_MODERNIZACION_2026-10-06.md. Base anterior publicada: 98e7d72. Tercera modernización local, sin commit ni push.
