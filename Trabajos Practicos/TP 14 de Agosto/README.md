# Trabajo práctico: CSS para todo el sitio

## Consigna

Yo tomé la consigna de agregar un archivo CSS dentro de la carpeta `css/` para manejar el estilo de todas las páginas del sitio web.

## Cómo lo resolví

Yo desarrollé una hoja de estilos compartida en [`css/style.css`](../../css/style.css). Yo enlacé las 14 páginas HTML de la carpeta `html/` a ese mismo archivo para mantener una apariencia coherente y actualizar el diseño común desde un solo lugar. Yo configuré la página `index.html` de la raíz para que redirija a `html/index.html`, donde se carga la hoja de estilos.

En cada página, yo enlacé el CSS con una ruta relativa como esta:

```html
<link rel="stylesheet" href="../css/style.css">
```

## Qué estilos implementé

### Tema general y tipografía

Yo definí variables CSS para los colores principales: fondo casi negro, superficies oscuras, bordes grises, texto claro y un acento celeste. También importé tipografías para títulos y nombres de álbumes. Apliqué un reinicio básico de márgenes, rellenos y `box-sizing`, y configuré el cuerpo de las páginas como una columna flexible que ocupa al menos toda la altura de la ventana.

### Inicio y navegación

Yo diseñé una cabecera fija durante el desplazamiento, el nombre de la banda con tipografía propia, los enlaces de navegación y sus estados de interacción. Yo usé una línea celeste debajo de la cabecera para representar el progreso de lectura. Para Inicio, yo preparé un fondo con imagen, capas oscuras y una animación sutil que permite mantener legible el contenido.

### Contenido y accesibilidad visual

Yo establecí estilos compartidos para el contenido principal, los títulos, los párrafos, los contenedores de artículos y el pie de página. También diseñé indicadores de foco visibles para poder reconocer qué enlace o control está seleccionado al navegar con teclado, y estilos para el enlace que permite saltar al contenido principal. Yo respeté la preferencia del sistema para reducir el movimiento y las animaciones.

### Integrantes, formularios y blog

Yo di formato a las tarjetas de integrantes, sus fotografías, descripciones y roles. Para Blog, diseñé formularios, campos de entrada, botones, mensajes, comentarios y publicaciones de la comunidad; organicé los formularios en columnas en pantallas amplias y en una sola columna en pantallas pequeñas.

### Galería

Yo armé una presentación vertical para las fotografías con sus textos y procedencias. También preparé la apariencia del visor ampliado: fondo oscurecido, imagen sin deformar, descripción y controles para pasar de una fotografía a otra o cerrar el visor.

### Discografía y tipografías de álbum

Yo organicé las portadas en una cuadrícula de tarjetas y asigné estilos específicos a los títulos. Según cada álbum, definí una tipografía, un color y efectos visuales propios. También estilé las descripciones y el enlace para escuchar cada disco.

### Videoclips

Yo diseñé las tarjetas de video, sus títulos y acentos de color, además del reproductor con proporción panorámica. Yo preparé estados para los controles personalizados de reproducción, volumen y posición, y para mostrar errores. En dispositivos táctiles, yo adapté la presentación para que el manejo no dependa de pasar el cursor.

### Academia, currículum e interacciones

Yo incorporé estilos para la sección de Academia, ejemplos de código, fuentes y nombres de integrantes con colores diferenciados. También di formato al visor del currículum y a sus enlaces de descarga. Para complementar la navegación, añadí estilos al botón de volver arriba, al control de audio, a las transiciones entre páginas y a los efectos sutiles de las tarjetas.

Yo coordiné algunas interacciones con las clases y estados que administra `js/site.js`, y usé CSS para definir cómo se ven esos estados.

## Adaptación a distintos dispositivos

Yo agregué reglas `@media` para reorganizar el menú, las tarjetas de álbumes, los videos, las tarjetas de integrantes y los formularios según el ancho disponible. También ajusté el visor de galería y el currículum en pantallas pequeñas. Finalmente, yo desactivé o reduje animaciones cuando el dispositivo indica que se prefiere menos movimiento.

## Resultado

Con [`css/style.css`](../../css/style.css), yo centralicé los estilos compartidos de las páginas y mantuve una identidad visual oscura, adaptable y coherente con el tema musical del sitio. Así cumplí la consigna de usar un archivo CSS ubicado en `css/` para manejar la presentación de todas las páginas.
