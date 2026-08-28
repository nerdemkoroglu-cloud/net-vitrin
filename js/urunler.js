// SHEETS_ENDPOINT ve SHEETS_ANAHTAR artık js/config.js dosyasından geliyor.

let URUNLER = [];
let KATEGORILER = [];
let SURUM_BILGISI = {};

function dosyaVarMi(url) {
  return fetch(url, { method: "HEAD" }).then(r => r.ok).catch(() => false);
}

async function veriYukle(deneme = 0) {
  let yanit;
  try {
    yanit = await fetch(`${SHEETS_ENDPOINT}?anahtar=${encodeURIComponent(SHEETS_ANAHTAR)}`);
    if (!yanit.ok) throw new Error("Sunucu hatası");
  } catch (hata) {
    if (deneme < 2) {
      await new Promise(r => setTimeout(r, 1500));
      return veriYukle(deneme + 1);
    }
    throw hata;
  }
  const veri = await yanit.json();
  KATEGORILER = veri.kategoriler.sort((a, b) => a.sira - b.sira);
  SURUM_BILGISI = veri.surumBilgisi || {};

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