// SIPARIS_EPOSTA ve SIPARIS_WHATSAPP artık js/config.js dosyasından geliyor.

function surumBilgisiGoster() {
  const el = document.getElementById("surumBilgisi");
  if (!el || !SURUM_BILGISI.surum) return;
  el.textContent = `${SURUM_BILGISI.surum} · ${SURUM_BILGISI.tarih} ${SURUM_BILGISI.saat}`;
}

function iletisimMailGoster() {
  const el = document.getElementById("iletisimMail");
  if (!el) return;
  el.href = `mailto:${SIPARIS_EPOSTA}`;
  el.textContent = SIPARIS_EPOSTA;
}

function onayGoster(siparisNo) {
  const mesajEl = document.getElementById("onayMesaj");
  mesajEl.innerHTML = `Talebiniz alınmıştır.<br>Talep Numarası: ${siparisNo}<br>En kısa sürede dönüş yapılacaktır.`;
  document.getElementById("onayOverlay").classList.add("acik");
}

function onayKapatBagla() {
  document.getElementById("onayTamam").addEventListener("click", () => {
    document.getElementById("onayOverlay").classList.remove("acik");
    window.location.href = "urunler.html";
  });
}

function medyaHtmlUret(item) {
  if (!item) {
    return `<div class="medya-placeholder">Görsel yakında eklenecek</div>`;
  }
  if (item.tip === "model") {
    return `<model-viewer src="${item.src}" camera-controls auto-rotate shadow-intensity="0.8" exposure="1" environment-image="neutral" ar></model-viewer>`;
  }
  return `<img src="${item.src.replace('uc?export=view&id=', 'thumbnail?id=')}&sz=w1000" alt="" referrerpolicy="no-referrer">`;
}

function heroRenderEt(urun) {
  if (!urun) return;

  document.getElementById("hero").style.display = "grid";
  document.getElementById("heroSpec").style.display = "flex";

  const medyaListesi = urunMedyaListesi(urun);
  const viewer = document.getElementById("heroViewer");
  viewer.innerHTML = `
    <div class="hero-medya-ana" id="heroMedyaAna">${medyaHtmlUret(medyaListesi[0])}</div>
    ${medyaListesi.length > 1 ? `<div class="hero-thumb-serit" id="heroThumbSerit"></div>` : ""}
  `;

  if (medyaListesi.length > 1) {
    const serit = document.getElementById("heroThumbSerit");
    medyaListesi.forEach((item, index) => {
      const thumb = document.createElement("button");
      thumb.className = "hero-thumb" + (index === 0 ? " aktif" : "");
      thumb.innerHTML = item.tip === "model"
        ? `<span class="hero-thumb-3d">3D</span>`
        : `<img src="${item.src.replace('uc?export=view&id=', 'thumbnail?id=')}&sz=w200" alt="" referrerpolicy="no-referrer">`;
      thumb.addEventListener("click", () => {
        document.getElementById("heroMedyaAna").innerHTML = medyaHtmlUret(item);
        serit.querySelectorAll(".hero-thumb").forEach(t => t.classList.remove("aktif"));
        thumb.classList.add("aktif");
      });
      serit.appendChild(thumb);
    });
  }

  document.getElementById("heroId").textContent = `Stok Kodu: ${urun.id}`;
  document.getElementById("heroBaslik").textContent = urun.isim;
  document.getElementById("heroAciklama").textContent = urun.aciklama;
  document.getElementById("heroFiyat").textContent = urun.etiket ? (urun.fiyat.toLocaleString("tr-TR") + " ₺") : "———";

  document.getElementById("heroOzellikler").innerHTML = `
    <div><dt>Ölçü</dt><dd>${urun.olcu}</dd></div>
    <div><dt>Malzeme</dt><dd>${urun.malzeme}</dd></div>
    <div><dt>Üretim Süresi</dt><dd>${urun.uretimSuresi}</dd></div>
  `;

  const atifEl = document.getElementById("heroAtif");
  if (urun.atif) {
    atifEl.textContent = urun.atif;
    atifEl.style.display = "block";
  } else {
    atifEl.style.display = "none";
  }

  const heroBtn = document.getElementById("heroSepetEkle");
  if (urun.stokta) {
    heroBtn.textContent = "SEPETE EKLE";
    heroBtn.disabled = false;
    heroBtn.onclick = () => sepeteEkle(urun.id);
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
  const medyaListesi = urunMedyaListesi(urun);
  const gorselHtml = medyaHtmlUret(medyaListesi[0]);
  kart.innerHTML = `
    <div class="card-media">
      ${gorselHtml}
      ${stokEtiket}
    </div>
    <div class="product-card-body">
      <div class="product-name">${urun.isim}</div>
      <div class="product-id">Stok Kodu: ${urun.id}</div>
      <div class="product-meta">${urun.olcu} · ${urun.malzeme}</div>
      ${atifHtml}
      <div class="product-row">
        <span class="product-price">${urun.etiket ? (urun.fiyat.toLocaleString("tr-TR") + " ₺") : "———"}</span>
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

function izgaraRenderEt(kategori = "Tümü") {
  const izgara = document.getElementById("urunIzgara");
  izgara.innerHTML = "";
  const filtreli = kategori === "Tümü" ? URUNLER : URUNLER.filter(u => u.kategori === kategori);
  filtreli.forEach(urun => izgara.appendChild(urunKartiOlustur(urun)));
}

function kategoriFiltreOlustur() {
  const filtreEl = document.getElementById("kategoriFiltre");
  filtreEl.innerHTML = `<button class="filtre-btn aktif" data-kategori="Tümü">Tümü</button>`;
  KATEGORILER.forEach(k => {
    filtreEl.innerHTML += `<button class="filtre-btn" data-kategori="${k.kategori}">${k.kategori}</button>`;
  });

  document.querySelectorAll(".filtre-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filtre-btn").forEach(b => b.classList.remove("aktif"));
      btn.classList.add("aktif");
      izgaraRenderEt(btn.dataset.kategori);
    });
  });
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

document.addEventListener("DOMContentLoaded", async () => {
  await veriYukle();
  heroRenderEt();
  izgaraRenderEt();
  kategoriFiltreOlustur();
  sepetPanelBagla();
  sepetGoruntuleGuncelle();
  onayKapatBagla();
  surumBilgisiGoster();
  iletisimMailGoster();
});
