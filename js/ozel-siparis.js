// Özel Sipariş formu Formspree servisine gönderilir (ücretsiz, aylık 50 gönderim).
// Kurulum: formspree.io'da ücretsiz hesap aç, yeni form oluştur, sana verdiği
// "form endpoint" adresini aşağıya yapıştır. Adres şu formatta olur:
// https://formspree.io/f/xxxxxxxx

const OZEL_SIPARIS_ENDPOINT = "https://formspree.io/f/xljrkkvr";

function ozelSiparisFormBagla() {
  const form = document.getElementById("ozelSiparisForm");
  const durum = document.getElementById("ozelSiparisDurum");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (OZEL_SIPARIS_ENDPOINT.includes("BURAYA_FORM_ID_YAZILACAK")) {
      durum.textContent = "Form henüz bağlanmadı. (OZEL_SIPARIS_ENDPOINT ayarlanmalı)";
      durum.style.color = "var(--amber)";
      return;
    }

    durum.textContent = "Gönderiliyor...";
    durum.style.color = "var(--ink-dim)";

    try {
      const veri = new FormData(form);
      const yanit = await fetch(OZEL_SIPARIS_ENDPOINT, {
        method: "POST",
        body: veri,
        headers: { "Accept": "application/json" }
      });

      if (yanit.ok) {
        durum.textContent = "Talebiniz alındı. En kısa sürede dönüş yapılacaktır.";
        durum.style.color = "var(--steel)";
        form.reset();
      } else {
        durum.textContent = "Gönderim başarısız oldu, tekrar deneyin.";
        durum.style.color = "var(--amber)";
      }
    } catch (hata) {
      durum.textContent = "Bağlantı hatası, tekrar deneyin.";
      durum.style.color = "var(--amber)";
    }
  });
}

document.addEventListener("DOMContentLoaded", ozelSiparisFormBagla);
