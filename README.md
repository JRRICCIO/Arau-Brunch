# ARAU · Grilled Brunch & Café de Especialidad — sitio web

Landing de una sola página para **ARAU** (brunch a la brasa, Eixample, Barcelona).
Hecho con HTML + CSS + JavaScript puro. **Sin build, sin dependencias** → se sube tal cual a Netlify.

```
arau-brunch/
├── index.html      # Toda la estructura y los textos
├── styles.css      # Diseño (paleta brasa, tipografía, animaciones)
├── script.js       # Nav móvil, animaciones al hacer scroll, form de reserva
├── netlify.toml    # Config de deploy (cabeceras + cache)
└── README.md
```

## Ver el sitio en local

No necesita servidor: abrí `index.html` con doble clic en el navegador.
Para una vista más fiel (rutas relativas, mapa, etc.) levantá un servidor estático:

```bash
# Con Python (ya viene en la mayoría de equipos)
python -m http.server 3000
# luego abrí  http://localhost:3000

# o con Node
npx serve .
```

## Editar el contenido (lo más común)

Todo el texto está en **`index.html`**, en español y bien señalizado por secciones:

| Querés cambiar… | Buscá en `index.html`… |
|---|---|
| Platos y descripciones | la sección `<!-- CARTA -->` (`<ul class="dishes">`) |
| Textos del café | la sección `<!-- CAFÉ -->` (`.cafe__lead`, `.cafe__chips`) |
| Eventos | la sección `<!-- EVENTOS -->` (`<ul class="events">`) |
| Programa de fidelidad | el bloque `.loyalty` en `<!-- EVENTOS -->` |
| Horarios | la sección `<!-- VISITANOS -->` (`<ul class="hours">`) |
| Dirección / teléfono / email | sección `<!-- VISITANOS -->` y el `<!-- FOOTER -->` |
| Reseñas de clientes | sección `<!-- EXPERIENCIA -->` (`<ul class="quotes">`) |
| Redes sociales | los `<a class="social" ...>` en `<!-- VISITANOS -->` |

> ⚠️ **A confirmar antes de publicar:**
> - El teléfono `+34 612 123 123` y el WhatsApp `wa.me/34612123123` son **de ejemplo** —
>   cambialos por los reales (header, Reservas, Visitanos y footer).
> - **Día de cierre:** martes cerrado (confirmado por el dueño).
> - **Logo:** la mascota (tacita sonriente) es una versión original en SVG inspirada en la suya.
>   Si tenés el logo oficial en SVG/PNG, se reemplaza fácil en el header, el hero y el footer.

## Colores y tipografía

Se controlan desde las variables al inicio de `styles.css` (bloque `:root`):

```css
--terra:    #bd4b2b; /* terracota / teja (acento principal de la marca) */
--gold:     #d99a3e; /* dorado / miel (acentos sobre oscuro) */
--cream:    #f3e9d6; /* crema cálida (fondo principal) */
--espresso: #241812; /* espresso (secciones oscuras: Café, Visitanos, footer) */
--olive:    #7c8456; /* verde palta (guiño aussie, uso puntual) */
```

Tipografías: **Fraunces** (títulos) + **Inter** (texto), cargadas desde Google Fonts.

## Fotos reales

La carpeta `img/` ya tiene fotos reales del local (galería + 3 platos + café). Para sumar o
cambiar fotos:

1. Poné la imagen nueva en `img/`.
2. **Platos:** en un plato con ícono (Tru Mila, Bagel, Açaí) reemplazá el bloque
   `<div class="dish__artband ...">…</div>` por
   `<div class="dish__photo"><img src="img/tru-mila.jpg" alt="" loading="lazy" /></div>`
   y cambiá la clase del `<li>` de `dish--banded` a `dish--photo`.
3. **Galería:** agregá/cambiá un `<figure class="galeria__item">` en la sección `<!-- GALERÍA -->`.

> Las fotos actuales se tomaron del perfil público de Google Maps del local. Si Agustina tiene
> las originales en alta resolución, se reemplazan 1:1 manteniendo los mismos nombres de archivo.

## Logo

El logo (la tacita con anteojos sosteniendo cuchillo y tenedor) es una **recreación vectorial
en SVG** del logo real de ARAU — va inline en el header, el hero, el footer y el favicon, y usa
`currentColor`, así que toma el color de cada sección. Si Agustina tiene el logo oficial en
SVG/PNG, se reemplaza fácil en esos cuatro lugares.

## El formulario de reservas

No usa servidor: al enviar **abre el correo del visitante** con la solicitud ya redactada
hacia `hola@araubrunch.com`. Si más adelante querés que llegue solo (sin abrir el mail),
se puede conectar a **Netlify Forms** o a un servicio como Formspree.

## Deploy en Netlify

- **Arrastrar y soltar:** entrá a Netlify → "Add new site" → "Deploy manually" → soltá esta carpeta.
- **Con Git:** subí la carpeta a un repo y conectalo; Netlify detecta `netlify.toml` solo.

---
Hecho con fuego 🔥 en Barcelona.
