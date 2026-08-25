const SEPET_SIPARIS_ENDPOINT = "https://formspree.io/f/xljrkkvr";
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

function sepetGoruntuleGuncelle() {
  const sepet = sepetOku();
  const icerikEl = document.getElementById("sepetIcerik");
  const sayacEl = document.getElementById("sepetSayac");
  const toplamEl = document.getElementById("sepetToplam");

  sayacEl.textContent = sepet.reduce((n, k) => n + k.adet, 0);
  toplamEl.textContent = "———";

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
        <div class="cart-item-meta">Adet: ${kalem.adet}</div>
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
}

function siparisMetniOlustur() {
  const sepet = sepetOku();
  if (sepet.length === 0) return "";

  const ad = document.getElementById("sepetAd").value.trim();
  const iletisim = document.getElementById("sepetIletisim").value.trim();

  let satirlar = sepet.map(kalem => {
    const urun = URUNLER.find(u => u.id === kalem.id);
    return `- ${urun.isim} x${kalem.adet} (${(urun.fiyat * kalem.adet).toLocaleString("tr-TR")} ₺)`;
  });
  satirlar.push(`Toplam: ${sepetToplamTutar().toLocaleString("tr-TR")} ₺`);

  let baslik = "Sipariş talebi:\n";
  if (ad) baslik += `Ad Soyad: ${ad}\n`;
  if (iletisim) baslik += `İletişim: ${iletisim}\n`;

  return baslik + "\n" + satirlar.join("\n");
}
async function sepetSiparisiGonder() {
  const durum = document.getElementById("sepetDurum");
  const metin = siparisMetniOlustur();

  if (!metin) { alert("Sepetiniz boş."); return; }

  const ad = document.getElementById("sepetAd").value.trim();
  const iletisim = document.getElementById("sepetIletisim").value.trim();
  if (!ad || !iletisim) {
    alert("Ad Soyad ve Telefon/E-posta alanlarını doldurun.");
    return;
  }

  durum.textContent = "Gönderiliyor...";
  durum.style.color = "var(--ink-dim)";

  try {
    const yanit = await fetch(SEPET_SIPARIS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        talepTuru: "Sepet Siparişi",
        adSoyad: ad,
        iletisim: iletisim,
        siparisOzeti: metin
      })
    });

    if (yanit.ok) {
      durum.textContent = "Siparişiniz alındı. En kısa sürede dönüş yapılacaktır.";
      durum.style.color = "var(--steel)";
      localStorage.removeItem(SEPET_ANAHTAR);
      sepetGoruntuleGuncelle();
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
