# Canta

Ejercicios de vocalización con afinación en vivo. En vivo: https://goyogramadors.github.io/canta/

Este repo es solo un caparazón: `index.html` + `manifest.webmanifest` + `sw.js`. Todo el código y
los audios viven en [`goyogramadors/cancionero`](https://github.com/goyogramadors/cancionero)
(`app/core/`, `app/tools/canta/`, `app/canta-media/`) y se cargan aquí por **ruta absoluta**
(`/cancionero/app/...`) — mismo origen `goyogramadors.github.io`, sin duplicar nada.

Para agregar o sacar un ejercicio de este sitio: edita el array `SB_CANTA_ALLOW` en `index.html`
con los ids de `cancionero/app/canta-media/index.json`. Detalle completo de cómo funciona en
`cancionero:app/ARQUITECTURA.md` → "Canta para alumnos".

**Publicación:** GitHub Pages, rama `main`, carpeta `/`. Como este sitio depende de archivos
publicados en `cancionero`, un cambio ahí (por ejemplo un ejercicio nuevo) puede requerir esperar a
que ese sitio republique también.
