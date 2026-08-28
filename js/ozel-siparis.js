// Özel Sipariş formu Formspree servisine gönderilir (ücretsiz, aylık 50 gönderim).
// Kurulum: formspree.io'da ücretsiz hesap aç, yeni form oluştur, sana verdiği
// "form endpoint" adresini aşağıya yapıştır. Adres şu formatta olur:
// https://formspree.io/f/xxxxxxxx

// OZEL_SIPARIS_ENDPOINT artık js/config.js dosyasındaki FORMSPREE_ENDPOINT olarak geliyor.

function ozelSiparisFormBagla() {
  const form = document.getElementById("ozelSiparisForm");
  const durum = document.getElementById("ozelSiparisDurum");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (FORMSPREE_ENDPOINT.includes("BURAYA_FORM_ID_YAZILACAK")) {
      durum.textContent = "Form henüz bağlanmadı. (OZEL_SIPARIS_ENDPOINT ayarlanmalı)";
      durum.style.color = "var(--amber)";
      return;
    }

    durum.textContent = "Gönderiliyor...";
    durum.style.color = "var(--ink-dim)";

    const adSoyad = form.querySelector('[name="adSoyad"]').value.trim();
    const telefon = form.querySelector('[name="telefon"]').value.trim();
    const eposta = form.querySelector('[name="eposta"]').value.trim();
    const aciklama = form.querySelector('[name="aciklama"]').value.trim();
    const iletisim = telefon || eposta;

    if (!adSoyad) {
      alert("Ad Soyad alanını doldurun.");
      return;
    }
    if (!iletisim) {
      alert("Telefon veya E-posta alanlarından en az birini doldurun.");
      return;
    }

    let siparisNo = "";
    try {
      const sheetsYanit = await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          anahtar: SHEETS_ANAHTAR,
          tur: "Özel",
          adSoyad: adSoyad,
          iletisim: iletisim,
          icerik: aciklama,
          toplamTutar: ""
        })
      });
      const sheetsSonuc = await sheetsYanit.json();
      siparisNo = sheetsSonuc.siparisNo || "";
    } catch (hata) {
      console.error("Sheets kayıt hatası:", hata);
    }

    try {
      const veri = new FormData(form);
      if (siparisNo) veri.append("siparisNo", siparisNo);
      const yanit = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: veri,
        headers: { "Accept": "application/json" }
      });

      if (yanit.ok) {
        form.reset();
        onayGoster(siparisNo || "———");
      } else {
        durum.textContent = "Gönderim başarısız oldu, tekrar deneyin.";
        durum.style.color = "var(--amber)";
      }
    } catch (hata) {
      console.error("Gerçek hata:", hata);
      durum.textContent = "Bağlantı hatası, tekrar deneyin.";
      durum.style.color = "var(--amber)";
    }
  });
}

document.addEventListener("DOMContentLoaded", ozelSiparisFormBagla);
