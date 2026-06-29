// Hace que, en cada página, `site`/`carta`/`eventos`/`galeria`/`ui`/`lang`
// apunten al contenido del idioma actual (data.lng viene de la paginación).
function code(data) {
  return data.lng && data.lng.code ? data.lng.code : "es";
}
function slice(data, key) {
  const c = (data.i18n && data.i18n[code(data)]) || {};
  return c[key];
}

module.exports = {
  lang: (data) => code(data),
  site: (data) => slice(data, "site"),
  carta: (data) => slice(data, "carta"),
  eventos: (data) => slice(data, "eventos"),
  galeria: (data) => slice(data, "galeria"),
  ui: (data) => slice(data, "ui"),
};
