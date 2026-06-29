// Carga el contenido de cada idioma desde src/_data/locales/<lang>/*.json
// y lo expone como `content` (content.es.carta, content.en.site, etc.).
// Si falta un archivo en un idioma, cae al español para no romper el build.
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "locales");
const FILES = ["site", "carta", "eventos", "galeria", "ui"];
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

module.exports = function () {
  const content = {};
  for (const lang of LANGS) content[lang] = loadLang(lang);
  return content;
};
