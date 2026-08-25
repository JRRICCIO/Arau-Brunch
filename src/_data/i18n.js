// Carga el contenido de cada idioma desde src/_data/locales/<lang>/*.json
// y lo expone como `content` (content.es.carta, content.en.site, etc.).
// Si falta un archivo en un idioma, cae al español para no romper el build.
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "locales");
const FILES = ["site", "carta", "eventos", "galeria", "ui", "contenido"];
const LANGS = ["es", "en", "fr", "ca"];

function read(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch (e) { return null; }
}
function loadLang(lang) {
  const out = {};
  for (const f of FILES) {
    out[f] =
      read(path.join(DIR, lang, f + ".json")) ||
      read(path.join(DIR, "es", f + ".json")) ||
      {};
  }
  return out;
}

// El precio Y la foto de cada plato son iguales en todos los idiomas: se
// definen UNA sola vez en la carta en Español y se replican al resto al
// construir (por posición: misma sección y mismo plato). Si una sección no
// está alineada entre idiomas, se deja lo propio de ese idioma.
function syncSharedFields(content) {
  const es = content.es;
  if (!es || !es.carta || !Array.isArray(es.carta.sections)) return;
  const esSecs = es.carta.sections;
  for (const lang of LANGS) {
    if (lang === "es") continue;
    const c = content[lang];
    if (!c || !c.carta || !Array.isArray(c.carta.sections)) continue;
    const secs = c.carta.sections;
    if (secs.length !== esSecs.length) continue;
    for (let i = 0; i < secs.length; i++) {
      const esItems = esSecs[i].items || [];
      const items = secs[i].items || [];
      if (items.length !== esItems.length) continue; // sección desalineada → no tocar
      for (let j = 0; j < items.length; j++) {
        if (esItems[j] && items[j]) {
          items[j].precio = esItems[j].precio;
          items[j].foto = esItems[j].foto;
        }
      }
    }
  }
}

module.exports = function () {
  const content = {};
  for (const lang of LANGS) content[lang] = loadLang(lang);
  syncSharedFields(content);
  return content;
};
