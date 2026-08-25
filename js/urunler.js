const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwtZRC8W1zKp8Vyox-vHhb9WIUyF9lskFBID6g0LmovKUodXA6vK2y4vdZqVHPVMVs/exec";
const SHEETS_ANAHTAR = "Parola.08";

let URUNLER = [];
let KATEGORILER = [];

function dosyaVarMi(url) {
  return fetch(url, { method: "HEAD" }).then(r => r.ok).catch(() => false);
}

async function veriYukle() {
  const yanit = await fetch(`${SHEETS_ENDPOINT}?anahtar=${encodeURIComponent(SHEETS_ANAHTAR)}`);
  const veri = await yanit.json();
  KATEGORILER = veri.kategoriler.sort((a, b) => a.sira - b.sira);

  URUNLER = await Promise.all(veri.urunler.map(async (u) => {
    u.model = u.hariciModel && u.hariciModel.trim() ? u.hariciModel.trim() : `modeller/${u.dosyaAdi}.glb`;
    u.modelVarMi = await dosyaVarMi(u.model);
    return u;
  }));
}

function urunMedyaListesi(urun) {
  const liste = [];
  if (urun.modelVarMi) liste.push({ tip: "model", src: urun.model });
  (urun.gorselListesi || []).forEach(g => liste.push({ tip: "gorsel", src: g }));
  return liste;
}