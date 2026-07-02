// Genera los códigos QR de ARAU (carta + pedido en la mesa).
// Uso: node scripts/gen-qr.js   ·   o:  node scripts/gen-qr.js https://araubrunch.com 14
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const BASE = (process.argv[2] || "https://araubrunch.es").replace(/\/$/, "");
const MESAS = parseInt(process.argv[3] || "12", 10);
const OUT = path.join(__dirname, "..", "qr");
fs.mkdirSync(OUT, { recursive: true });

const opts = {
  errorCorrectionLevel: "M",
  margin: 2,
  width: 1000,
  color: { dark: "#241812", light: "#ffffff" }, // espresso sobre blanco (legible al escanear)
};

async function make(url, file) {
  await QRCode.toFile(path.join(OUT, file + ".png"), url, opts);
  console.log("OK", file + ".png", "->", url);
}

(async () => {
  // Carta general (modo pedido) + carta a secas
  await make(BASE + "/carta.html", "carta");
  await make(BASE + "/carta.html?pedir=1", "carta-pedir");
  // Una por mesa
  for (let i = 1; i <= MESAS; i++) {
    await make(BASE + "/carta.html?mesa=" + i, "mesa-" + String(i).padStart(2, "0"));
  }
  console.log("\nListo. " + (MESAS + 2) + " QR en /qr. Cambiá el dominio así: node scripts/gen-qr.js https://araubrunch.com 12");
})();
