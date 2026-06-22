# ARAU · Panel de edición — puesta en marcha

El sitio ahora se genera con **Eleventy** y tiene un **panel de administración** (Sveltia CMS) para que
Agustina edite la carta, los precios, los eventos, las fotos, los horarios y el contacto **sin tocar código**.

```
arau-brunch/
├── src/                 ← el sitio (plantillas + datos)
│   ├── index.njk        ← portada
│   ├── carta.njk        ← carta
│   ├── _includes/       ← partes reutilizables (carta-sections, eventos)
│   └── _data/           ← EL CONTENIDO EDITABLE (lo que toca el panel)
│       ├── carta.json   · secciones, platos, precios, etiquetas, DISPONIBLE
│       ├── eventos.json · evento destacado + tarjetas
│       ├── galeria.json · fotos de la galería
│       └── site.json    · hero, horarios, contacto
├── admin/               ← el panel (config.yml + index.html)
├── img/  fonts/  styles.css  script.js
├── .eleventy.js  package.json  netlify.toml
└── _site/               ← lo que se publica (se genera solo; NO se edita a mano)
```

## Cómo se trabaja (resumen)

- **Agustina** entra a `https://TU-SITIO/admin`, edita y toca **Publicar**. Eso guarda en GitHub y
  Netlify reconstruye el sitio solo en ~1 minuto.
- **Vos / desarrollo:** `npm install` una vez, después `npm run dev` para ver en local
  (http://localhost:8080) o `npm run build` para generar `_site/`.

---

## Puesta en marcha (una sola vez) — pasos en Netlify

> Necesitás el repo en GitHub y una cuenta de Netlify (gratis).

1. **Subí el repo a GitHub** (ya tenés el repo). Confirmá que estén subidos `src/`, `admin/`,
   `package.json`, `.eleventy.js`, `netlify.toml`, `img/`, `fonts/`. (No subas `node_modules/` ni
   `_site/` — ya están en `.gitignore`.)

2. **Conectá el sitio en Netlify:** New site → *Import from Git* → elegí el repo.
   Netlify lee `netlify.toml` y detecta solo: build `npm run build`, publish `_site`. Deploy.

3. **Activá el login del panel (Netlify Identity + Git Gateway):**
   - En el sitio de Netlify → **Identity** → *Enable Identity*.
   - Identity → *Registration*: poné **Invite only** (así no se anota cualquiera).
   - Identity → *Services* → **Enable Git Gateway**.

4. **Invitá a Agustina:** Identity → *Invite users* → su email. Le llega un mail, pone su contraseña,
   y ya entra a `https://TU-SITIO/admin`.

5. **Dominio propio (opcional):** Netlify → *Domain settings* → agregá `araubrunch.com` (o `.es`).
   Después actualizá la `baseUrl` y los `canonical`/`og:url` (en `src/_data/site.json` y los `<head>`)
   al dominio final.

---

## Reservas → que le lleguen solas

El formulario de reserva ya está conectado a **Netlify Forms**. Para que Agustina las reciba:

- **Por email (fácil):** Netlify → *Forms* → *Form notifications* → *Add notification* → *Email* →
  su correo. Cada reserva le llega al instante.
- **Por WhatsApp (opcional):** Netlify → Forms → notificación tipo *Outgoing webhook*, conectado a un
  flujo gratis de **Make.com** o **Zapier** que reenvía a WhatsApp. (Necesita configurar ese flujo una vez.)

---

## Qué puede editar Agustina en el panel

- **Carta** → cada sección y plato: nombre, descripción, **precio**, etiquetas (GF/VG/VE/⭐) y el
  interruptor **Disponible** (apagalo y el plato sale como *Agotado* en la web, sin borrarlo).
- **Eventos** → el evento destacado y las tarjetas (texto, foto, frecuencia, tira de fotos).
- **Galería** → sumar/quitar/reordenar fotos.
- **Configuración** → hero (portada), **horarios** y **contacto** (teléfono, WhatsApp, email, redes).

---

## Pendiente / a confirmar antes de publicar

- **Datos reales:** precios (hoy orientativos), teléfono/WhatsApp/email, reseñas y números de la portada,
  horarios reales, y el dominio. Todo se edita desde el panel.
- **Usuario para empleados (rol "mozo"):** el panel gratis (Sveltia/Decap) da acceso por usuario pero
  **no** permite limitar a "solo marcar agotado" a nivel de campo. Opciones para esa función:
  (a) darle a un empleado un usuario y confiar en que solo toque *Disponible*;
  (b) más adelante, una mini-pantalla aparte solo de "agotados"; o
  (c) un CMS pago con permisos por campo. Lo dejo señalado como **fase 2**.
