# TP de Accesibilidad Web — Sitio fan de Deftones

**Autor:** Angel De Piero
**Curso:** 4°3ra CS TT Informática
**Sitio evaluado:** sitio web temático de Deftones (14 páginas en `html/`)
**Fecha:** 26 de noviembre de 2026

> Las imágenes y el video de este trabajo están en la carpeta `capturas/`.

---

## ¿Qué es la accesibilidad web?

Es el diseño y desarrollo de sitios que puedan usar todas las personas, incluidas las que tienen alguna discapacidad visual, auditiva, motriz o cognitiva. Es un derecho, ayuda a más usuarios (personas mayores, conexiones lentas), mejora el SEO y en muchos países es una exigencia legal.

---

## 1. Navegación con teclado

Recorrí todo el sitio sin mouse, usando `Tab`, `Shift + Tab`, `Enter`, `Espacio` y las flechas.

| Elemento | Cómo se usa con teclado |
|---|---|
| Enlace "Saltar al contenido" | Es lo primero que recibe foco al presionar `Tab`; lleva directo al `<main>`. |
| Menú de navegación | Todos los enlaces se alcanzan con `Tab`; la sección activa se indica visualmente. |
| Tarjetas de discografía | Cada álbum es un enlace con foco visible. |
| Galería | Al abrir una imagen, el visor se recorre con las flechas y se cierra con `Esc`. |
| Videoclips | Los botones de reproducir/pausar y los controles son botones reales, activables con `Enter` o `Espacio`. |
| Audio de fondo | El botón de reproducción/pausa se alcanza con `Tab`. |
| Formularios del blog | Campos y botones se recorren en orden lógico. |

Además, en `css/style.css` definí **estados de foco visibles** y respeté la preferencia `prefers-reduced-motion`. No usé `tabindex` positivo: el orden del DOM coincide con el orden visual.

---

## 2. Contraste (WebAIM Contrast Checker)

Analicé en https://webaim.org/resources/contrastchecker/ la combinación principal de mi sitio: el color del texto sobre el color de fondo.

![Captura WebAIM Contrast Checker](capturas/contraste-webaim.png)

| Combinación | Color de texto | Color de fondo | Relación | Resultado |
|---|---|---|---|---|
| Texto principal sobre fondo oscuro | `#E6E3DC` | `#090B0D` | **15.38:1** | Aprueba |

Resultados que informa WebAIM para esta combinación:

| Criterio | Resultado |
|---|---|
| Texto normal, WCAG AA | Pass |
| Texto normal, WCAG AAA | Pass |
| Texto grande, WCAG AA | Pass |
| Texto grande, WCAG AAA | Pass |
| Objetos gráficos y componentes de interfaz, WCAG AA | Pass |

WCAG AA exige al menos 4.5:1 para texto normal y 3:1 para texto grande. Mi relación de 15.38:1 supera ampliamente ese mínimo y también el nivel AAA (7:1).

---

## 3. Atributo `lang`

Agregué el idioma del documento en todas mis páginas para que los lectores de pantalla usen la pronunciación correcta:

```html
<html lang="es">
```

Páginas: `index`, `biografia`, `discografia`, `integrantes`, `tours`, `galeria`, `videoclips`, `tienda`, `noticias`, `contacto`, `curso`, `blog`, `faq`, `nosotros`.

---

## 4. Texto alternativo (`alt`)

- Escribí un `alt` descriptivo para las fotos de la galería, los retratos de integrantes y las portadas de álbumes.
- Dejé `alt=""` en las imágenes puramente decorativas para que el lector de pantalla las ignore.
- Usé `figure` / `figcaption` en los retratos e incluí la fuente MP4 dentro de cada `video`.

---

## 5. Formularios con `label`

En el Blog (registro, inicio de sesión, comentario y publicación) y en Contacto, asocié cada campo con su `label` mediante `for` / `id`, y en los campos de cuenta usé nombres y `autocomplete` estándar:

```html
<label for="username">Usuario</label>
<input id="username" name="username" type="text" autocomplete="username">

<label for="password">Contraseña</label>
<input id="password" name="password" type="password" autocomplete="current-password">
```

A los formularios que no tenían un nombre visible les agregué un nombre accesible.

---

## 6. Evaluación con Lighthouse

Abrí el sitio en Google Chrome, presioné `F12`, fui a la pestaña **Lighthouse** y ejecuté el análisis de **Accesibilidad**.

### Correcciones que realicé

| # | Error detectado | Corrección | Archivo |
|---|---|---|---|
| 1 | No había forma de saltar la navegación repetida con teclado. | Agregué un enlace "Saltar al contenido" que aparece al recibir foco. | `js/site.js`, `css/style.css` |
| 2 | La navegación no tenía un nombre para lectores de pantalla. | Agregué `aria-label` al `<nav>`. | `js/site.js` |
| 3 | Formularios con campos sin nombre accesible. | Agregué `label` y nombres accesibles a los campos. | `js/site.js` |

### Resultado después de las correcciones

Analicé la página `contacto.html` en mi versión local (`http://127.0.0.1:4174/html/contacto.html`) el 26/11/2026 a las 22:04, con Lighthouse 13.5.0, emulando un Moto G Power con conexión 4G lenta:

| Categoría | Puntaje |
|---|---|
| Accesibilidad | **100** |
| Buenas prácticas | **100** |
| SEO | **100** |
| Rendimiento | **97** |

En Accesibilidad, Lighthouse reporta 20 auditorías aprobadas, 43 no aplicables y ningún fallo; además lista 10 puntos para revisar manualmente, que una herramienta automática no puede comprobar. Por eso complementé el análisis con mi prueba de teclado y con el lector de pantalla.

![Lighthouse después](capturas/lighthouse-despues.png)

En Rendimiento, Lighthouse sugiere optimizaciones (minificar CSS y JavaScript, reducir CSS y JS sin usar, recursos que bloquean el renderizado). No afectan la accesibilidad y las dejo como mejora futura.

---

## 7. Lector de pantalla (NVDA)

Instalé NVDA (gratuito, https://www.nvaccess.org/), lo inicié y navegué una página de mi sitio con `Tab`, las flechas y la tecla `H` para saltar entre encabezados. Grabé la navegación con OBS para que se escuche lo que lee el lector.

### Qué se lee correctamente

Anoté acá lo que NVDA leyó bien durante mi prueba.

### Elementos con problemas

Anoté acá los elementos que NVDA leyó mal o no leyó.

### Video de la navegación

Grabé un video corto con OBS donde se escucha la navegación con NVDA: `capturas/nvda-navegacion.mp4`

---

## Conclusión

Dejé mi sitio con navegación por teclado, idioma declarado, imágenes con `alt`, formularios con `label`, un contraste principal de 15.38:1 y un puntaje de 100 en accesibilidad en Lighthouse.
