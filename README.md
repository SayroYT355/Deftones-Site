# Deftones-Site
Proyecto para el Prof. Artaza.

## Servidor local

Requiere Node.js instalado. Desde esta carpeta ejecutá:

```bash
node js/server.js
```

Después abrí http://localhost:4173/ en el navegador. El servidor local entrega las páginas y ofrece una primera versión de cuentas y comentarios para el blog, sin dependencias externas.

Las cuentas y los comentarios se guardan en `data/local-store.json`. Las contraseñas se guardan como hashes con salt; el archivo de datos está excluido de Git y no se debe publicar. Las sesiones viven en memoria y se cierran al reiniciar el servidor.
