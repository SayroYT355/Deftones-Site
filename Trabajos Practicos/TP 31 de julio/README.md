# Formularios HTML y validaciones en el sitio

**Autor:** Angel De Piero  
**Curso:** 4°3ra CS TT Informática  
**Proyecto:** Deftones Fan Site

## Introducción

En este trabajo apliqué formularios HTML en las páginas del sitio para que una persona pueda ingresar datos, crear una cuenta, iniciar sesión, comentar el artículo del blog y redactar una publicación propia. Como explica el marco teórico, `<form>` funciona como contenedor de controles y permite organizar los datos que después procesa el navegador, JavaScript o el servidor.

Los ejemplos principales están en `html/blog.html`. También hay un formulario de contacto en `html/contacto.html`.

## Crear una cuenta e iniciar sesión

En el blog, cada operación tiene su propio formulario. Para el registro usé `id="register-form"`, `action="/api/register"` y `method="post"`; para iniciar sesión, `id="login-form"`, `action="/api/login"` y el mismo método POST. Así los formularios identifican qué acción solicitan y el servidor recibe los datos en el cuerpo de la solicitud, en lugar de agregarlos a la dirección como ocurriría con GET.

```html
<form id="register-form" action="/api/register" method="post" autocomplete="on">
    <label for="register-username">Nombre de usuario
        <input id="register-username" name="username" type="text"
               minlength="3" maxlength="24" required>
    </label>
    <label for="register-password">Contraseña
        <input id="register-password" name="password" type="password"
               minlength="8" maxlength="128" required>
    </label>
    <button type="submit">Crear cuenta</button>
</form>
```

Siguiendo la teoría, cada `<label>` describe el dato pedido y su atributo `for` coincide con el `id` del campo asociado. El atributo `name` define la clave con la que se reconoce el valor enviado, por ejemplo, `username` y `password`. Uso `type="password"` para ocultar visualmente la contraseña mientras se escribe.

En los campos de usuario agregué `autocomplete="username"`, y en el registro `autocomplete="new-password"`; en el ingreso se usa `autocomplete="current-password"`. Estos valores ayudan al navegador a ofrecer el autocompletado adecuado. `autocapitalize="none"` y `spellcheck="false"` evitan que el navegador cambie automáticamente el nombre de usuario.

## Comentarios y publicaciones

El formulario de comentarios incluye un `<textarea>` porque el mensaje puede ocupar varias líneas. `rows` define su altura inicial y los límites evitan enviar un campo vacío o demasiado largo:

```html
<form id="comment-form" class="blog-form comment-form" hidden>
    <label for="comment-text">Dejá tu comentario</label>
    <textarea id="comment-text" name="text" rows="4"
              minlength="2" maxlength="1000" required
              placeholder="¿Qué te parece el álbum?"></textarea>
    <button type="submit">Publicar comentario</button>
</form>
```

El atributo `required` y los límites `minlength` y `maxlength` realizan validaciones iniciales en el navegador. `placeholder` muestra una indicación dentro del campo. La publicación del blog sigue el mismo criterio: el título admite de 4 a 120 caracteres y el texto de 20 a 10.000 caracteres.

Estos formularios aparecen después de iniciar sesión. El código de `js/blog.js` escucha el evento `submit`, evita la navegación predeterminada con `preventDefault()` y reúne los campos mediante `FormData`. Después los envía con `fetch()` como JSON a `/api/comments` o `/api/posts`. El servidor en `server.php` vuelve a revisar los datos y guarda la información; por eso la validación del navegador mejora la experiencia, pero no reemplaza la validación del servidor.

## Botones y estado de la cuenta

Los botones que envían formularios tienen `type="submit"`. El botón para cerrar sesión tiene `type="button"`, ya que ejecuta una acción de JavaScript y no debe enviar el formulario que pudiera contenerlo. También se desactivan temporalmente los botones de envío mientras se procesa cada solicitud para evitar envíos repetidos.

Los formularios de comentario y publicación comienzan con `hidden`. JavaScript los muestra cuando hay una sesión activa; cuando no la hay, los comentarios y las publicaciones existentes igual pueden leerse.

## Formulario de contacto

En `html/contacto.html` hay campos para nombre, correo y consulta. El correo usa `type="email"`, que permite al navegador comprobar un formato básico de dirección, y los tres campos usan `required` para que no queden vacíos. La consulta está en un `<textarea>` de cinco filas.

A diferencia de los formularios del blog, este formulario no declara `action`, `method` ni un manejador JavaScript propio. Por lo tanto, el navegador utiliza el comportamiento predeterminado del formulario, que envía por GET a la dirección actual; el sitio todavía no tiene una función de servidor conectada para recibir esa consulta. Esta distinción permite separar la presentación del formulario de una función de envío que aún no está implementada.

## Validación y seguridad de los datos

Como propone el marco teórico, las restricciones HTML ayudan a detectar errores antes del envío: campos obligatorios, tipos específicos y longitudes mínimas o máximas. En el proyecto se aplican en el navegador y también se revisan en PHP para que no se puedan eludir enviando una solicitud manual. El servidor verifica las longitudes de usuario, contraseña, comentario, título y publicación antes de guardar los datos.

El método POST evita que los datos aparezcan en la URL, aunque por sí solo no cifra la comunicación. Además, las contraseñas se procesan en el servidor usando hash antes de guardarse.

## Relación entre teoría y código

| Concepto | Aplicación en el proyecto |
|---|---|
| `<form>` | Agrupa los campos de cuenta, comentario, publicación y contacto. |
| `action` y `method` | Registro e inicio de sesión declaran una ruta `/api/...` y usan POST. |
| `<label>` con `for` | Describe cada campo y se asocia con su `id`. |
| `<input>` | `text` para usuario, `password` para contraseña y `email` para correo. |
| `<textarea>` | Se usa para comentarios, entradas y consulta de contacto. |
| `<button>` | `submit` envía; `button` ejecuta una acción como cerrar sesión. |
| Validación HTML | `required`, `minlength`, `maxlength` y `type="email"`. |
| JavaScript y servidor | `FormData` recoge los campos, `fetch` los envía y PHP los valida y procesa. |

## Archivos consultados

- `html/blog.html`: formularios de registro, ingreso, comentarios y publicaciones.
- `html/contacto.html`: formulario de consulta.
- `js/blog.js`: captura de envíos, conversión de datos y solicitudes a la API.
- `server.php`: recepción, validación y persistencia de los datos.
