# Trabajo práctico: migración a PHP, modularización y SSR

**Autor:** Angel De Piero  
**Curso:** 4°3ra CS TT Informática  
**Proyecto:** Deftones Fan Site

## Descripción

Partí del sitio hecho con HTML, CSS y JavaScript y migré sus páginas a PHP para ejecutarlas en un servidor local. Separé el encabezado, el menú y el pie de página en plantillas reutilizables; de esa forma, los cambios en esas partes se hacen una sola vez y se reflejan en todas las pantallas.

Conservé el contenido y el diseño, y sumé títulos dinámicos, el indicador de la sección activa y variables para la configuración local.

## Prototipo de Figma

Comparto el prototipo del sitio en [Figma](https://www.figma.com/proto/lDl8NHTJ41YZ2SRrrDBtwG/Sin-t%C3%ADtulo?node-id=0-1&t=0SoaMP6MJ3joY78W-1).

## Tecnologías que utilicé

- HTML5 para la estructura y el contenido de cada página.
- CSS3 para la presentación común y el diseño adaptable.
- JavaScript para las interacciones del sitio.
- PHP 8 para generar las páginas en el servidor e incluir las plantillas.
- Apache y XAMPP para ejecutar el proyecto localmente.
- Git y GitHub para registrar y compartir los cambios.

No necesité MySQL ni phpMyAdmin porque la consigna no requiere una base de datos.

## Cómo ejecutar el sitio con XAMPP

1. Instalé XAMPP y coloqué la carpeta del proyecto dentro de `C:\xampp\htdocs\deftones-site`.
2. Si todavía no existe `.env`, copio `.env.example` y nombro la copia `.env` en la carpeta principal.
3. Abro el **XAMPP Control Panel** y presiono **Start** junto a **Apache**. No hace falta iniciar MySQL.
4. Visito `http://localhost/deftones-site/` en el navegador.

No abro los archivos PHP con doble clic: para que PHP los procese, entro al sitio desde `localhost`.

## Evidencias

### Sitio ejecutándose en el servidor local

Capturé el sitio abierto desde `localhost`, con el enlace de Inicio activo.

![Deftones Fan Site ejecutándose en localhost](evidencias/01-sitio-local-inicio.png)

### Modularización SSI

Separé el encabezado y la apertura del documento en `includes/header.php`, el menú en `includes/nav.php` y el pie con los scripts en `includes/footer.php`. Cada página de `html/` incorpora estas partes con `require_once`.

**Pie de página y carga de scripts:**

![Código de includes/footer.php](evidencias/02-footer-php.png)

**Encabezado y metadatos:**

![Código de includes/header.php](evidencias/03-header-php.png)

**Menú compartido:**

![Código de includes/nav.php](evidencias/04-nav-php.png)

### Título dinámico y navegación activa

En cada página PHP defino `$titulo_pagina` y `$pagina_actual`. El encabezado muestra el título correspondiente y el menú agrega `class="active"` y `aria-current="page"` al enlace de la sección actual. Por ejemplo, al entrar a Discografía, el título generado es **Discografía de Deftones: álbumes y canciones** y el enlace de esa sección queda activo.

![Página local de Discografía con el enlace de esa sección activo](evidencias/05-navegacion-discografia.png)

### Variables de configuración

Guardo el nombre del sitio, el correo de contacto y el entorno en `.env`, que Git ignora por ser una configuración local. En cambio, incluyo `.env.example` como plantilla con las variables necesarias.

![Contenido de .env.example](evidencias/06-env-example.png)

## Qué implementé

### Migración de HTML a PHP

Convertí las 14 páginas de `html/` a archivos `.php` y actualicé los enlaces internos. También pasé la página de entrada de la raíz a `index.php`, que dirige a la portada.

### Inclusiones SSI y renderizado del lado del servidor

Creé estos archivos compartidos:

- `includes/header.php`: metadatos, hoja de estilos, nombre de la aplicación e inicio del encabezado.
- `includes/nav.php`: enlaces internos y estado activo de la página actual.
- `includes/footer.php`: pie de página y scripts compartidos.
- `config/env.php`: lectura y validación de los valores locales de `.env`.

Cada página define antes de incluir la plantilla sus variables `$titulo_pagina`, `$descripcion_pagina` y `$pagina_actual`. PHP combina esos datos con las plantillas y envía el HTML generado al navegador; a eso se refiere el renderizado del lado del servidor.

### Configuración y cuidado de datos

Agregué `.env` a `.gitignore` para no subir la configuración local y dejé `.env.example` en el repositorio como modelo. En esta versión definí `APP_NAME`, `APP_EMAIL` y `APP_ENV`; no guardo contraseñas ni claves secretas en esas variables.

## Comprobaciones

Comprobé que PHP interprete las páginas, que cada una muestre su título y que el enlace activo corresponda a la sección navegada. También verifiqué que Git ignore `.env` y permita incluir `.env.example`.

## Estado de entrega

Desarrollé estos cambios en la rama `feature/migracion-php-ssi`. La integración mediante Pull Request queda pendiente.
