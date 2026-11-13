# Deftones — sitio web fan

## Informe académico de desarrollo web

**Autor:** Angel De Piero
**Curso:** 4°3ra CS TT Informática
**Proyecto:** sitio web temático de Deftones para la materia, dirigido al Prof. Artaza
**Fecha de esta edición del informe:** 13 de noviembre de 2026

---

## Resumen

Este proyecto presenta un sitio web multipágina dedicado a Deftones. Reúne información biográfica, discográfica y visual, contenidos educativos sobre el sonido de la banda, videoclips locales y espacios de participación. Se construyó con HTML, CSS y JavaScript, y se incorporó un servidor local en Node.js para servir el sitio, registrar cuentas y gestionar comentarios y publicaciones sin una base SQL.

La versión documentada contiene **14 páginas**, una hoja de estilos común, recursos visuales y audiovisuales locales, navegación compartida y controles interactivos. El sistema de usuarios y publicaciones está pensado para funcionar en el entorno local del proyecto. Los comentarios y las publicaciones se pueden transferir entre computadoras al sincronizar los archivos de datos con Git.

## Objetivos

- Organizar el contenido del sitio en páginas conectadas mediante una navegación común.
- Presentar la información con una identidad visual coherente y referencias tipográficas y cromáticas asociadas a los álbumes.
- Incorporar controles útiles para la galería, los videoclips, el audio de fondo y la navegación.
- Explicar, mediante la Academia, cómo interactúan voz, guitarras, bajo, batería y capas electrónicas en el sonido de Deftones.
- Implementar una primera versión local de registro, inicio de sesión, comentarios y publicaciones comunitarias.
- Facilitar el inicio del sitio y la sincronización de cambios con scripts de Windows.

## Estructura del proyecto

| Ruta | Función |
|---|---|
| `index.html` | Acceso sencillo que redirige a la portada dentro de `html/`. |
| `html/` | Las 14 páginas del sitio y su navegación interna. |
| `css/style.css` | Estilos compartidos, diseño adaptable, tipografías, animaciones y componentes. |
| `js/site.js` | Navegación y comportamientos comunes del sitio. |
| `js/blog.js` | Formularios de cuenta, comentarios y publicaciones comunitarias. |
| `js/server.js` | Servidor HTTP local, archivos estáticos y API del blog. |
| `images/` | Fotografías, portadas, iconos y fondo de Inicio. |
| `videos/` | Archivos MP4 usados por la sección Videoclips. |
| `audio/` | Archivo MP3 de Swerve City para el audio de fondo. |
| `data/comments.json` | Comentarios públicos compartibles entre copias del proyecto. |
| `data/posts.json` | Publicaciones públicas de la comunidad, compartibles entre copias. |
| `data/local-store.json` | Cuentas locales; está excluido de Git. |
| `Github subir y bajar/` | Scripts para actualizar el proyecto y subir cambios. |
| `Iniciar la página.bat` | Inicia Node.js y abre el sitio en el navegador. |
| `docs/capturas/` | Capturas comparativas de las 14 páginas. |

## Historial de desarrollo

### Sitio multipágina y organización

Se organizaron las páginas dentro de `html/` y se ajustaron las rutas relativas a hojas de estilo, JavaScript, imágenes, audio y video. Se agregó un `index.html` en la carpeta principal para que el proyecto se pueda abrir sin buscar la portada dentro de `html/`.

### Diseño visual e interacción

Se consolidó una interfaz oscura con detalles celestes, bordes finos y tarjetas de contenido. La tipografía general y los colores elegidos para las portadas se conservaron como parte de la identidad del sitio; los tratamientos particulares de cada álbum se usan en Discografía, Academia y Videoclips.

Se añadieron o ajustaron navegación adaptable, indicador de sección activa, animaciones suaves al aparecer los bloques, realce de tarjetas, botón para volver arriba, estados de foco visibles y compatibilidad con la preferencia de movimiento reducido del sistema. Las animaciones de imágenes quedan contenidas dentro de sus tarjetas.

### Audio y video

Se incorporó Swerve City desde `audio/` como audio ambiental al 30 % del volumen, con un botón pequeño de reproducción/pausa. El estado y la posición se guardan en `sessionStorage` para conservar la reproducción al navegar por las páginas.

La sección Videoclips pasó a usar archivos MP4 locales. Cada tarjeta incluye un botón central de reproducción, controles personalizados durante la reproducción y el estilo visual del álbum asociado. La interacción central permite reproducir o pausar el video.

### Galería e integrantes

La Galería mantiene las fotografías en una columna vertical para respetar su proporción. Cada foto conserva un pie separado por un borde y crédito cuando está disponible. Al seleccionar una imagen, se abre una vista ampliada con navegación anterior/siguiente, cierre y contador; se puede recorrer con el teclado.

Integrantes presenta retratos y biografías ampliadas para Chino Moreno, Stephen Carpenter, Abe Cunningham, Frank Delgado, Chi Cheng, Sergio Vega y Fred Sablan. Se ajustó el encuadre de varios retratos para mantener los rostros dentro del cuadro.

### Discografía y Academia

Discografía presenta diez álbumes de estudio como tarjetas enlazadas a Spotify. La tipografía y el color de cada nombre acompañan la estética de su álbum, con tratamiento destacado para Diamond Eyes y otras portadas.

Academia desarrolla una guía para analizar el sonido de la banda. Incluye el diálogo entre las dos guitarras, el contraste vocal de Chino, el groove y el bajo de Abe y Chi, las capas de Frank Delgado y las distintas etapas de bajo. Las menciones a integrantes y discos tienen color y tipografía contextual; el texto usa voseo rioplatense.

### Blog y servidor local

El artículo sobre White Pony se amplió con secciones sobre producción, dinámica e influencia. Se reemplazó la lista fija de comentarios por formularios conectados a la API local.

El registro requiere nombre de usuario único y contraseña. La comparación de nombres normaliza espacios exteriores y mayúsculas, por lo que no se pueden registrar variantes duplicadas solo por cambiar el uso de mayúsculas. Las contraseñas se almacenan con hash y salt usando `scrypt`; la sesión se identifica con una cookie `HttpOnly` y `SameSite=Lax`.

Las personas pueden leer comentarios y publicaciones sin iniciar sesión. Para publicar un comentario o una entrada hace falta una cuenta activa. El autor se muestra como `@usuario` y cada publicación incluye fecha, título y texto.

Las cuentas se guardan solo en `data/local-store.json` y no viajan con Git. Los comentarios y publicaciones están en `data/comments.json` y `data/posts.json`; al subir esos archivos al repositorio y descargar los cambios en otra computadora, el contenido público queda disponible allí también. Este mecanismo es una solución local provisoria, todavía sin SQL.

### Acceso y sincronización

Se agregaron scripts `.bat` para descargar actualizaciones y subir cambios con un mensaje asociado al nombre de la comisión. También se creó **Iniciar la página.bat**, que ejecuta `node js/server.js` y abre el sitio en el navegador.

### Hitos registrados en Git

El historial local registra la evolución del repositorio. El primer commit del repositorio contiene solo el README inicial; la primera versión completa del sitio es `d5ef1d4`. Luego se registraron la integración con GitHub, el mensaje de presentación y los scripts para actualizar el proyecto. El commit `7133c2b` incorpora el servidor local y el inicio de sesión. Las mejoras de comentarios, publicaciones comunitarias, sus archivos compartibles y este informe pertenecen a la edición actual de trabajo.

## Descripción de las páginas

| Página | Contenido y función principal |
|---|---|
| **Inicio** (`html/index.html`) | Portada con imagen de fondo, presentación de la banda y accesos a Historia y Discografía. Incluye el control discreto de audio ambiental. |
| **Biografía** (`html/biografia.html`) | Historia de la banda, formación, recorrido y material de referencia. |
| **Biografía** (`html/biografia.html`) | Recorrido biográfico por la trayectoria de Deftones y sus distintas etapas. |`n| **Discografía** (`html/discografia.html`) | Diez álbumes de estudio en tarjetas con portadas y enlaces externos de Spotify. |
| **Integrantes** (`html/integrantes.html`) | Retratos, roles musicales y biografías de siete integrantes y exintegrantes. |
| **Tours** (`html/tours.html`) | Calendario informativo y accesos a Galería y entradas. Las fechas presentadas son contenido estático del sitio. |
| **Galería** (`html/galeria.html`) | Veinte imágenes archivísticas en orden vertical, con pies, créditos y visor ampliado. |
| **Videoclips** (`html/videoclips.html`) | Cuatro videoclips servidos desde MP4 locales con reproductor personalizado. |
| **Tienda** (`html/tienda.html`) | Presentación de merchandising y botones de navegación; no procesa pagos. |
| **Noticias** (`html/noticias.html`) | Sección informativa con accesos al calendario y al Blog. |
| **Contacto** (`html/contacto.html`) | Interfaz de formulario de contacto. No está conectada a un servicio de envío. |
| **Academia** (`html/curso.html`) | Guía de escucha y composición sobre las capas rítmicas, vocales, instrumentales y ambientales. |
| **Blog** (`html/blog.html`) | Artículo editorial, comentarios y publicaciones propias de la comunidad. Leer es público; escribir requiere cuenta. |
| **Preguntas frecuentes** (`html/faq.html`) | Respuestas breves sobre el contenido y el propósito del sitio. |
| **Quiénes somos** (`html/nosotros.html`) | Presentación del autor y del propósito académico del proyecto. |

## Partes importantes del código

### HTML: estructura y contenido

Cada archivo de `html/` representa una página. La estructura usa `header`, `nav`, `main`, `article`, `section` y `footer` para separar navegación, contenido y pie. Los encabezados establecen jerarquías; las imágenes incluyen texto alternativo; los botones y campos de formulario tienen etiquetas y nombres accesibles.

El HTML deja el contenido visible y su significado. Por ejemplo, cada álbum es un enlace con nombre accesible, cada retrato usa `figure`/`figcaption`, y los reproductores incluyen `video` y su fuente MP4. La página Blog incluye formularios separados de registro, inicio de sesión, comentario y publicación.

### CSS: identidad y adaptación

`css/style.css` centraliza las variables de color, tipografías, espaciados, bordes, estados de foco y reglas de diseño. La hoja usa cuadrículas y flexbox para organizar tarjetas; las consultas de medios ajustan el menú, la discografía, los formularios y las galerías a pantallas angostas.

Las clases específicas (`.album-name.diamond`, `.video-card--around`, `.member-name.abe`, entre otras) permiten dar un estilo propio a un álbum o integrante sin alterar toda la página. Las transiciones se reducen cuando el dispositivo solicita `prefers-reduced-motion`.

### JavaScript del sitio

`js/site.js` conecta las interacciones compartidas: menú adaptable, animaciones de entrada, tarjetas interactivas, visor de Galería, controles del reproductor, indicador de progreso, botón para volver arriba y audio ambiental persistente entre páginas.

`js/blog.js` realiza solicitudes a la API del mismo origen. Actualiza los formularios según el estado de sesión, obtiene comentarios y publicaciones, y crea cada elemento con `textContent` para mostrar el texto como contenido y no interpretarlo como HTML.

### Node.js: servidor y API local

`js/server.js` usa módulos incluidos con Node.js (`http`, `fs`, `path` y `crypto`), sin dependencias de terceros. Sirve los archivos del proyecto, gestiona rangos de bytes para que los MP4 puedan avanzar en el tiempo y expone rutas JSON:

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/session` | Consulta la sesión actual. |
| `POST` | `/api/register` | Crea una cuenta con nombre único y contraseña protegida con hash. |
| `POST` | `/api/login` | Valida usuario y contraseña e inicia sesión. |
| `POST` | `/api/logout` | Cierra la sesión local. |
| `GET` / `POST` | `/api/comments` | Lee comentarios públicamente o publica uno con sesión iniciada. |
| `GET` / `POST` | `/api/posts` | Lee publicaciones públicamente o crea una entrada con sesión iniciada. |

Las entradas de texto se validan por longitud. La interfaz inserta autores y contenidos mediante nodos de texto. Los archivos JSON hacen que esta primera versión sea fácil de revisar y reemplazar posteriormente por almacenamiento SQL.

## Ejecución

1. Instalá Node.js si todavía no está disponible en el equipo.
2. Abrí **Iniciar la página.bat** desde la carpeta principal del proyecto. También podés iniciar el servidor desde una terminal con:

   ```bash
   node js/server.js
   ```

3. Visitá `http://localhost:4173/`.
4. Dejá abierta la ventana del servidor mientras uses el sitio.

Para que otra computadora vea los comentarios y publicaciones nuevos, subí `data/comments.json` y `data/posts.json` a GitHub con el script **SUBIR_CAMBIOS.bat** y descargá los cambios en la otra copia. Las cuentas y sesiones no se comparten entre equipos.

## Alcance y limitaciones

Esta entrega es un prototipo local de una página fan. No incluye SQL, servicio de correo, moderación de contenido, recuperación de contraseñas, comercio electrónico real ni publicación pública de la API. El contacto y el calendario son secciones informativas estáticas. Para poner las cuentas y publicaciones en Internet harían falta una base de datos central, controles adicionales de seguridad, moderación y alojamiento de servidor.

## Correcciones de acceso y blog personal

En esta edición se reforzó el inicio de sesión y se hizo más visible el espacio para publicar entradas propias:

- Los formularios de registro y acceso declaran `method`, `action`, `autocomplete` y nombres de campo estándar (`username`, `new-password` y `current-password`). Esto ayuda al navegador a ofrecer el guardado y autocompletado de credenciales.
- La página no lee contraseñas guardadas ni cookies desde JavaScript. El administrador de contraseñas del navegador completa los campos; el navegador adjunta automáticamente la cookie de sesión en solicitudes del mismo origen y Node.js la valida en el servidor.
- La comprobación de sesión se ejecuta separada de la carga de comentarios y publicaciones. Si falla la carga de contenido, el estado de acceso no queda trabado como si la persona hubiera cerrado sesión.
- `Tu blog personal` queda visible al comienzo de la página. Después de iniciar sesión, aparece el formulario para publicar y la lista `Mis entradas`; las publicaciones también se muestran en `Blogs de la comunidad`.
- El iniciador comprueba si el puerto `4173` ya está ocupado y avisa que se cierre el servidor anterior antes de volver a abrir el sitio. Así se evita continuar navegando accidentalmente contra una instancia vieja de Node.js.

Este apartado registra las correcciones funcionales de la edición actual y no requiere capturas adicionales.
## Comparativas visuales

Las capturas están hechas en el mismo navegador y tamaño de ventana, y se recortaron para mostrar solo el área del sitio. La referencia **Antes** es la primera versión completa registrada en Git (`d5ef1d4`, 13 de noviembre de 2026); **Después** es la edición actual documentada. El historial no conserva capturas anteriores a ese commit: gran parte del diseño visual ya estaba incorporada en la primera versión registrada, por eso varias comparaciones se ven parecidas. No se presentan imágenes inventadas de una versión antigua.

Abrí cada fila para ver las capturas emparejadas. Los archivos están en `docs/capturas/`.
<details>
<summary>01 · Inicio — Portada, fondo y audio ambiental.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/01-inicio-antes.jpg" alt="Inicio, primera versión registrada" width="100%"></td><td><img src="docs/capturas/01-inicio-despues.jpg" alt="Inicio, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>02 · Biografía — Historia y material de referencia.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/02-biografia-antes.jpg" alt="Biografía, primera versión registrada" width="100%"></td><td><img src="docs/capturas/02-biografia-despues.jpg" alt="Biografía, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>03 · Discografía — Diez álbumes con portadas y enlaces Spotify.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/03-discografia-antes.jpg" alt="Discografía, primera versión registrada" width="100%"></td><td><img src="docs/capturas/03-discografia-despues.jpg" alt="Discografía, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>04 · Integrantes — Retratos, roles y biografías.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/04-integrantes-antes.jpg" alt="Integrantes, primera versión registrada" width="100%"></td><td><img src="docs/capturas/04-integrantes-despues.jpg" alt="Integrantes, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>05 · Tours — Calendario y accesos de gira.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/05-tours-antes.jpg" alt="Tours, primera versión registrada" width="100%"></td><td><img src="docs/capturas/05-tours-despues.jpg" alt="Tours, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>06 · Galería — Fotos verticales, pies y visor ampliado.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/06-galeria-antes.jpg" alt="Galería, primera versión registrada" width="100%"></td><td><img src="docs/capturas/06-galeria-despues.jpg" alt="Galería, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>07 · Videoclips — Reproductores locales con estilo por álbum.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/07-videoclips-antes.jpg" alt="Videoclips, primera versión registrada" width="100%"></td><td><img src="docs/capturas/07-videoclips-despues.jpg" alt="Videoclips, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>08 · Tienda — Presentación de merchandising.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/08-tienda-antes.jpg" alt="Tienda, primera versión registrada" width="100%"></td><td><img src="docs/capturas/08-tienda-despues.jpg" alt="Tienda, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>09 · Noticias — Novedades y enlaces internos.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/09-noticias-antes.jpg" alt="Noticias, primera versión registrada" width="100%"></td><td><img src="docs/capturas/09-noticias-despues.jpg" alt="Noticias, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>10 · Contacto — Formulario visual de contacto.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/10-contacto-antes.jpg" alt="Contacto, primera versión registrada" width="100%"></td><td><img src="docs/capturas/10-contacto-despues.jpg" alt="Contacto, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>11 · Academia — Guía de escucha y composición.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/11-academia-antes.jpg" alt="Academia, primera versión registrada" width="100%"></td><td><img src="docs/capturas/11-academia-despues.jpg" alt="Academia, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>12 · Blog — Artículo, comentarios y publicaciones comunitarias.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/12-blog-antes.jpg" alt="Blog, primera versión registrada" width="100%"></td><td><img src="docs/capturas/12-blog-despues.jpg" alt="Blog, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>13 · Preguntas frecuentes — Preguntas y respuestas del sitio.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/13-preguntas-frecuentes-antes.jpg" alt="Preguntas frecuentes, primera versión registrada" width="100%"></td><td><img src="docs/capturas/13-preguntas-frecuentes-despues.jpg" alt="Preguntas frecuentes, edición actual" width="100%"></td></tr></tbody></table>

</details>

<details>
<summary>14 · Quiénes somos — Presentación académica del autor.</summary>

<table><thead><tr><th>Primera versión registrada</th><th>Edición actual</th></tr></thead><tbody><tr><td><img src="docs/capturas/14-quienes-somos-antes.jpg" alt="Quiénes somos, primera versión registrada" width="100%"></td><td><img src="docs/capturas/14-quienes-somos-despues.jpg" alt="Quiénes somos, edición actual" width="100%"></td></tr></tbody></table>

</details>

## Referencias de implementación

- Páginas y contenido: [`html/`](html/)
- Diseño compartido: [`css/style.css`](css/style.css)
- Interacciones generales: [`js/site.js`](js/site.js)
- Cuenta, comentarios y publicaciones: [`js/blog.js`](js/blog.js), [`js/server.js`](js/server.js)
- Datos compartibles de la comunidad: [`data/comments.json`](data/comments.json), [`data/posts.json`](data/posts.json)
- Capturas comparativas: [`docs/capturas/`](docs/capturas/)

---

**Desarrollado por Angel De Piero — 4°3ra CS TT Informática.**