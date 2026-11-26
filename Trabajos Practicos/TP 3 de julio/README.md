# Publicación del sitio en Vercel

**Autor:** Angel De Piero  
**Curso:** 4°3ra CS TT Informática  
**Proyecto:** Deftones Fan Site

## Objetivo

Este trabajo documenta cómo publiqué el sitio web en Vercel para que se pueda visitar desde Internet sin iniciar el servidor local en PHP. La versión publicada está disponible en [Deftones Fan Site](https://deftonesfansite.vercel.app/html/index.html).

Como guía de referencia utilicé el video [Cómo subir un sitio web a Vercel](https://www.youtube.com/watch?v=cyz6UBwAuKs). El proceso que describo a continuación corresponde a la estructura actual del proyecto y al despliegue web observado.

## Preparación del proyecto

Antes de publicarlo, organicé los recursos para que Vercel pudiera servirlos como archivos del sitio:

- `index.html` está en la raíz y redirige a `html/index.html`, que contiene la portada.
- `html/` reúne las páginas del sitio.
- `css/`, `js/`, `images/`, `audio/` y `videos/` guardan los recursos que esas páginas enlazan mediante rutas relativas.
- El repositorio del proyecto está en GitHub, conectado al proyecto de Vercel.

Las rutas relativas son importantes: por ejemplo, desde una página dentro de `html/`, la hoja de estilos se carga como `../css/style.css` y una imagen como `../images/nombre-del-archivo.jpg`. Así el navegador encuentra los recursos tanto en local como en el dominio publicado.

## Proceso de publicación

1. **Subí el proyecto a GitHub.** Guardé los cambios en el repositorio para que Vercel pudiera acceder al código fuente.
2. **Importé el repositorio en Vercel.** Inicié sesión en Vercel, elegí crear un proyecto e importé el repositorio de GitHub.
3. **Configuré el despliegue como sitio estático.** El contenido principal son HTML, CSS, JavaScript y archivos multimedia. No se necesita un comando de compilación de frontend para generar las páginas.
4. **Publiqué el proyecto.** Vercel asignó un dominio y generó el despliegue inicial.
5. **Comprobé la ruta de la portada y sus recursos.** Abrí `https://deftonesfansite.vercel.app/html/index.html` y verifiqué que la página se presentara desde el dominio.
6. **Actualicé el sitio mediante Git.** Al subir nuevos cambios al repositorio conectado, Vercel puede generar otro despliegue a partir de esa versión.

## Archivos y tecnologías

| Elemento | Función en el despliegue |
|---|---|
| `index.html` | Entrada del dominio; redirige a la portada de `html/`. |
| `html/*.html` | Páginas que Vercel entrega al navegador. |
| `css/style.css` | Apariencia y diseño adaptable. |
| `js/` | Interacciones que se ejecutan en el navegador. |
| `images/`, `audio/`, `videos/` | Recursos locales solicitados por las páginas. |
| GitHub | Repositorio conectado que contiene los cambios del proyecto. |
| Vercel | Servicio que publica los archivos web y entrega el sitio en línea. |

## Diferencia entre la versión publicada y el servidor local

Vercel publica la parte estática del sitio: HTML, estilos, JavaScript y recursos. El proyecto también tiene `server.php`, que se usa al iniciar la página localmente para el registro, inicio de sesión, comentarios y publicaciones. Ese servidor PHP no se ejecuta automáticamente por el hecho de publicar archivos estáticos en Vercel. Por eso, el despliegue en Vercel sirve para recorrer el sitio, mientras que las funciones que dependen de PHP requieren un entorno que ejecute PHP y tenga configurados sus datos.

## Resultado

La publicación permite acceder al sitio desde el dominio de Vercel y navegar a la portada en `html/index.html`. Para que otros cambios aparezcan en línea, se actualiza el repositorio conectado y se espera a que Vercel termine el nuevo despliegue.

## Fuentes

- Video guía: [YouTube](https://www.youtube.com/watch?v=cyz6UBwAuKs).
- Sitio publicado: [https://deftonesfansite.vercel.app/html/index.html](https://deftonesfansite.vercel.app/html/index.html).
- Proyecto local: `index.html`, `html/`, `css/`, `js/`, `images/`, `audio/`, `videos/` y `server.php`.
