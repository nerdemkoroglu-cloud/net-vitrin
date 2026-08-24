// TODO: sipariş talebinin gideceği WhatsApp numarası / e-posta burada tanımlanacak
const SIPARIS_EPOSTA = "ornek@eposta.com";
const SIPARIS_WHATSAPP = "905356537047"; // örnek: "905XXXXXXXXX" — boşsa e-posta kullanılır

function heroRenderEt(urun) {
  const hero = urun || URUNLER.find(u => u.oneCikan) || URUNLER[0];
  if (!hero) return;

  document.getElementById("heroModel").src = hero.model;
  document.getElementById("heroBaslik").textContent = hero.isim;
  document.getElementById("heroId").textContent = hero.id;
  document.getElementById("heroAciklama").textContent = hero.aciklama;
  document.getElementById("heroFiyat").textContent = hero.fiyat.toLocaleString("tr-TR") + " ₺";

  document.getElementById("heroOzellikler").innerHTML = `
    <div><dt>Ölçü</dt><dd>${hero.olcu}</dd></div>
    <div><dt>Malzeme</dt><dd>${hero.malzeme}</dd></div>
    <div><dt>Üretim Süresi</dt><dd>${hero.uretimSuresi}</dd></div>
  `;

  const atifEl = document.getElementById("heroAtif");
  if (hero.atif) {
    atifEl.textContent = hero.atif;
    atifEl.style.display = "block";
  } else {
    atifEl.style.display = "none";
  }

    const heroBtn = document.getElementById("heroSepetEkle");
  if (hero.stokta) {
    heroBtn.textContent = "SEPETE EKLE";
    heroBtn.disabled = false;
    heroBtn.onclick = () => sepeteEkle(hero.id);
  } else {
    heroBtn.textContent = "STOKTA YOK";
    heroBtn.disabled = true;
    heroBtn.onclick = null;
  }
}

function urunKartiOlustur(urun) {
  const kart = document.createElement("div");
  kart.className = "product-card";
  const atifHtml = urun.atif ? `<div class="product-atif">${urun.atif}</div>` : "";
  const stokEtiket = !urun.stokta ? `<div class="stok-etiket">STOKTA YOK</div>` : "";
  const butonHtml = urun.stokta
    ? `<button class="btn-add" data-id="${urun.id}">SEPETE EKLE</button>`
    : `<button class="btn-add" disabled>STOKTA YOK</button>`;
  kart.innerHTML = `
    <div class="card-media">
      <model-viewer src="${urun.model}" camera-controls auto-rotate shadow-intensity="0.8"></model-viewer>
      ${stokEtiket}
    </div>
    <div class="product-card-body">
      <div class="product-name">${urun.isim}</div>
      <div class="product-id">${urun.id}</div>
      <div class="product-meta">${urun.olcu} · ${urun.malzeme}</div>
      ${atifHtml}
      <div class="product-row">
        <span class="product-price">${urun.fiyat.toLocaleString("tr-TR")} ₺</span>
        ${butonHtml}
      </div>
    </div>
  `;
  if (urun.stokta) {
    kart.querySelector(".btn-add").addEventListener("click", (e) => {
      e.stopPropagation();
      sepeteEkle(urun.id);
    });
  }
  kart.addEventListener("click", () => {
    heroRenderEt(urun);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  return kart;
}

function izgaraRenderEt() {
  const izgara = document.getElementById("urunIzgara");
  izgara.innerHTML = "";
  URUNLER.forEach(urun => izgara.appendChild(urunKartiOlustur(urun)));
}

function sepetPanelBagla() {
  const panel = document.getElementById("sepetPanel");
  const overlay = document.getElementById("sepetOverlay");

  document.getElementById("sepetButon").addEventListener("click", () => {
    panel.classList.add("open");
    overlay.classList.add("open");
  });
  document.getElementById("sepetKapat").addEventListener("click", () => {
    panel.classList.remove("open");
    overlay.classList.remove("open");
  });
  overlay.addEventListener("click", () => {
    panel.classList.remove("open");
    overlay.classList.remove("open");
  });

  document.getElementById("siparisGonder").addEventListener("click", sepetSiparisiGonder);
}

document.addEventListener("DOMContentLoaded", () => {
  heroRenderEt();
  izgaraRenderEt();
  sepetPanelBagla();
  sepetGoruntuleGuncelle();
});
