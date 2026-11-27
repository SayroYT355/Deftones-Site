# Trabajo práctico: JavaScript en el Deftones Fan Site

**Autor:** Angel De Piero  
**Curso:** 4°3ra CS TT Informática  
**Proyecto:** Deftones Fan Site

## Introducción

En este trabajo incorporé ejercicios de JavaScript al sitio para practicar mensajes, validación de formularios, fecha y hora, cambio de tema y resumen de datos. También aproveché interacciones que el sitio ya tenía, como el menú móvil y la galería.

Yo coloqué la lógica compartida en [`js/site.js`](../../js/site.js). Para mostrar los errores y los nuevos controles, también actualicé [`html/contacto.php`](../../html/contacto.php) y agregué estilos en [`css/style.css`](../../css/style.css).

## 1. Saludo al cargar el sitio

Yo agregué un saludo con `alert()` cuando se carga el sitio por primera vez en una pestaña. Uso `sessionStorage` para no repetirlo cada vez que se navega a otra página durante la misma sesión.

```js
window.alert('¡Hola! Bienvenido/a al sitio de Deftones.');
```

## 2. Validación del formulario de contacto

Yo adapté el formulario de Contacto para revisar los campos antes de mostrar el resumen. Compruebo que el nombre y la consulta no estén vacíos, incluso si se ingresan solamente espacios, y verifico que el correo tenga un formato básico válido.

Cuando un dato no es válido, yo muestro un mensaje personalizado debajo del campo, marco el control con `aria-invalid` y llevo el foco al primer campo que necesita corrección. También agregué `aria-live` para que las tecnologías de asistencia puedan anunciar los mensajes.

## 3. Fecha y hora actualizadas

Yo agregué un reloj al pie de página. Para obtener la fecha y la hora uso `new Date()` y actualizo su contenido cada segundo con `setInterval()`. Muestro el resultado con formato local en español y actualizo el atributo `datetime` del elemento `<time>`.

## 4. Menú interactivo

Yo aproveché el menú móvil que ya tenía el sitio. Configuré su botón para mostrar u ocultar la navegación y actualizar el atributo `aria-expanded`; también conservé la opción de cerrar el menú con `Escape`. En escritorio, yo mantengo los enlaces disponibles en la cabecera.

## 5. Galería de imágenes

Yo mantuve el visor de imágenes que ya estaba implementado. Al seleccionar una fotografía, yo la muestro ampliada con su descripción y procedencia. Configuré botones para pasar a la imagen anterior o siguiente, y también mantuve la navegación con las flechas del teclado y el cierre con `Escape`.

## 6. Cambio de tema

Yo agregué un botón para alternar entre el tema oscuro, que se usa por defecto, y un tema claro. Con JavaScript cambio las clases `dark-mode` y `light-theme` del elemento `<body>`, y con CSS adapto los fondos, textos, tarjetas y colores de álbumes.

Guardo la elección en `localStorage` para conservarla al cambiar de página o volver a visitar el sitio desde el mismo navegador.

## 7. Resumen del formulario antes de enviar

Yo hice que, después de completar correctamente los campos y presionar **Revisar datos**, aparezca un resumen con el nombre, el correo y la consulta. Inserto los valores con `textContent` para mostrarlos como texto y no interpretarlos como HTML.

Con el resumen yo puedo revisar la información antes de continuar. Por ahora no envío ni guardo datos desde este formulario; dejo la conexión con un servidor y una base de datos para otro trabajo. Como publiqué en Vercel la parte estática del sitio, la lógica de PHP local no se ejecuta allí sin configurar un backend.

## Funciones que ya tenía el sitio

Además de los ejercicios anteriores, yo mantuve las interacciones generales que ya formaban parte del sitio: navegación interna, enlace para saltar al contenido principal, controles de videoclips, audio de fondo, botón para volver arriba y animaciones que respetan la preferencia de movimiento reducido del dispositivo.

## Archivos de referencia

- [`js/site.js`](../../js/site.js): saludo, validación, reloj, tema, navegación y galería.
- [`html/contacto.php`](../../html/contacto.php): campos, mensajes de error y estructura del resumen.
- [`css/style.css`](../../css/style.css): presentación del formulario, los mensajes, el reloj y los temas.

## Verificación

Yo comprobé que `js/site.js` no tuviera errores de sintaxis con `node --check` y revisé los cambios con `git diff --check`. No conecté el formulario a PHP ni a una base de datos en línea.
