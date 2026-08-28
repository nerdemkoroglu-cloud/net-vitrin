// SEPET_SIPARIS_ENDPOINT artık js/config.js dosyasındaki FORMSPREE_ENDPOINT olarak geliyor.
const SEPET_ANAHTAR = "vitrin_sepet";

function sepetOku() {
  const veri = localStorage.getItem(SEPET_ANAHTAR);
  return veri ? JSON.parse(veri) : [];
}

function sepetYaz(sepet) {
  localStorage.setItem(SEPET_ANAHTAR, JSON.stringify(sepet));
}

function sepeteEkle(urunId) {
  const sepet = sepetOku();
  const mevcut = sepet.find(k => k.id === urunId);
  if (mevcut) {
    mevcut.adet += 1;
  } else {
    sepet.push({ id: urunId, adet: 1 });
  }
  sepetYaz(sepet);
  sepetGoruntuleGuncelle();
}

function sepettenCikar(urunId) {
  let sepet = sepetOku();
  sepet = sepet.filter(k => k.id !== urunId);
  sepetYaz(sepet);
  sepetGoruntuleGuncelle();
}

function sepetToplamTutar() {
  const sepet = sepetOku();
  return sepet.reduce((toplam, kalem) => {
    const urun = URUNLER.find(u => u.id === kalem.id);
    return toplam + (urun ? urun.fiyat * kalem.adet : 0);
  }, 0);
}
function sepetEtiketliToplam() {
  const sepet = sepetOku();
  return sepet.reduce((toplam, kalem) => {
    const urun = URUNLER.find(u => u.id === kalem.id);
    return toplam + (urun && urun.etiket ? urun.fiyat * kalem.adet : 0);
  }, 0);
}

function sepetEtiketsizVarMi() {
  const sepet = sepetOku();
  return sepet.some(kalem => {
    const urun = URUNLER.find(u => u.id === kalem.id);
    return urun && !urun.etiket;
  });
}

function sepetGoruntuleGuncelle() {
  const sepet = sepetOku();
  const icerikEl = document.getElementById("sepetIcerik");
  const sayacEl = document.getElementById("sepetSayac");
  const toplamEl = document.getElementById("sepetToplam");

  sayacEl.textContent = sepet.reduce((n, k) => n + k.adet, 0);
  const etiketliToplam = sepetEtiketliToplam();
  const etiketsizVar = sepetEtiketsizVarMi();
  if (etiketliToplam > 0 && etiketsizVar) {
    toplamEl.textContent = etiketliToplam.toLocaleString("tr-TR") + " ₺ + ETİKETSİZLER";
  } else if (etiketliToplam > 0) {
    toplamEl.textContent = etiketliToplam.toLocaleString("tr-TR") + " ₺";
  } else if (etiketsizVar) {
    toplamEl.textContent = "ETİKETSİZLER";
  } else {
    toplamEl.textContent = "———";
  }

  icerikEl.innerHTML = "";
  if (sepet.length === 0) {
    icerikEl.innerHTML = '<p style="color:var(--ink-dim); font-size:13px;">Sepetiniz boş.</p>';
    return;
  }

  sepet.forEach(kalem => {
    const urun = URUNLER.find(u => u.id === kalem.id);
    if (!urun) return;
    const satir = document.createElement("div");
    satir.className = "cart-item";
    satir.innerHTML = `
      <div>
        <div class="cart-item-name">${urun.isim}</div>
        <div class="cart-item-fiyat">${urun.etiket ? "Toplam= " + (urun.fiyat * kalem.adet).toLocaleString("tr-TR") + " ₺" : "ETİKETSİZ"}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" data-id="${urun.id}" data-aksiyon="azalt">−</button>
          <span>${kalem.adet}</span>
          <button class="qty-btn" data-id="${urun.id}" data-aksiyon="artir">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${urun.id}">Kaldır</button>
    `;
    icerikEl.appendChild(satir);
  });

  icerikEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.aksiyon === "artir") miktarArtir(btn.dataset.id);
      else miktarAzalt(btn.dataset.id);
    });
  });
    icerikEl.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      sepettenCikar(btn.dataset.id);
    });
  });
}

function siparisMetniOlustur() {
  const sepet = sepetOku();
  if (sepet.length === 0) return "";

  const ad = document.getElementById("sepetAd").value.trim();
  const iletisim = document.getElementById("sepetIletisim").value.trim();
  const not = document.getElementById("sepetNot").value.trim();

  let satirlar = sepet.map(kalem => {
    const urun = URUNLER.find(u => u.id === kalem.id);
    return `- ${urun.isim} x${kalem.adet} (${(urun.fiyat * kalem.adet).toLocaleString("tr-TR")} ₺)`;
  });
  satirlar.push(`Toplam: ${sepetToplamTutar().toLocaleString("tr-TR")} ₺`);

  let baslik = "Sipariş talebi:\n";
  if (ad) baslik += `Ad Soyad: ${ad}\n`;
  if (iletisim) baslik += `İletişim: ${iletisim}\n`;
  if (not) baslik += `Not: ${not}\n`;

  return baslik + "\n" + satirlar.join("\n");
}
async function sepetSiparisiGonder() {
  const durum = document.getElementById("sepetDurum");
  const metin = siparisMetniOlustur();

  if (!metin) { alert("Sepetiniz boş."); return; }

  const ad = document.getElementById("sepetAd").value.trim();
  const iletisim = document.getElementById("sepetIletisim").value.trim();
  if (!ad) {
    alert("Ad Soyad alanını doldurun.");
    return;
  }
  if (!iletisim) {
    alert("Telefon veya E-posta alanlarından en az birini doldurun.");
    return;
  }

  durum.textContent = "Gönderiliyor...";
  durum.style.color = "var(--ink-dim)";

  let siparisNo = "";
  try {
    const sheetsYanit = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      body: JSON.stringify({
        anahtar: SHEETS_ANAHTAR,
        tur: "Sepet",
        adSoyad: ad,
        iletisim: iletisim,
        icerik: metin,
        toplamTutar: sepetToplamTutar()
      })
    });
    const sheetsSonuc = await sheetsYanit.json();
    siparisNo = sheetsSonuc.siparisNo || "";
  } catch (hata) {
    console.error("Sheets kayıt hatası:", hata);
  }

  try {
    const yanit = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        talepTuru: "Sepet Siparişi",
        siparisNo: siparisNo,
        adSoyad: ad,
        iletisim: iletisim,
        siparisOzeti: metin
      })
    });

    if (yanit.ok) {
      localStorage.removeItem(SEPET_ANAHTAR);
      document.getElementById("sepetAd").value = "";
      document.getElementById("sepetIletisim").value = "";
      document.getElementById("sepetNot").value = "";
      sepetGoruntuleGuncelle();
      document.getElementById("sepetPanel").classList.remove("open");
      document.getElementById("sepetOverlay").classList.remove("open");
      onayGoster(siparisNo || "———");
    } else {
      durum.textContent = "Gönderim başarısız oldu, tekrar deneyin.";
      durum.style.color = "var(--amber)";
    }
  } catch (hata) {
    durum.textContent = "Bağlantı hatası, tekrar deneyin.";
    durum.style.color = "var(--amber)";
  }
}
function miktarArtir(urunId) {
  const sepet = sepetOku();
  const kalem = sepet.find(k => k.id === urunId);
  if (kalem) kalem.adet += 1;
  sepetYaz(sepet);
  sepetGoruntuleGuncelle();
}

function miktarAzalt(urunId) {
  let sepet = sepetOku();
  const kalem = sepet.find(k => k.id === urunId);
  if (kalem) {
    kalem.adet -= 1;
    if (kalem.adet <= 0) {
      sepet = sepet.filter(k => k.id !== urunId);
    }
  }
  sepetYaz(sepet);
  sepetGoruntuleGuncelle();
}
