// ==========================================================
// NET-VİTRİN — MERKEZİ AYAR DOSYASI (config.js)
// Bu dosya projenin TEK kontrol panelidir.
// Bağlantı adresleri, gizli anahtarlar ve genel sabitler
// buradan yönetilir. Başka hiçbir dosyada bu bilgiler
// tekrar tanımlanmaz.
// ==========================================================

// Google Apps Script'in yayınlanmış web adresi.
// Ürün/kategori verisini buradan okuruz, sipariş kaydını
// buraya yazarız.
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwtZRC8W1zKp8Vyox-vHhb9WIUyF9lskFBID6g0LmovKUodXA6vK2y4vdZqVHPVMVs/exec";

// Apps Script'e erişim için gizli anahtar.
// Bu anahtar Kod.gs dosyasındaki GIZLI_ANAHTAR ile birebir
// aynı olmalı, yoksa istekler reddedilir.
const SHEETS_ANAHTAR = "Parola.08";

// Formspree form adresi — hem sepet siparişi hem özel
// sipariş formu bu adrese gönderim yapar (aylık 50 gönderim
// sınırı olan ücretsiz plan).
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xljrkkvr";

// Sitede "Sorularınız için" yazısının yanında gösterilen
// iletişim e-postası. Footer bu bilgiyi buradan okur.
const SIPARIS_EPOSTA = "nerdemkoroglu@gmail.com";

// TODO: WhatsApp üzerinden sipariş bildirimi ileride
// eklenebilir, şu an aktif kullanılmıyor.
const SIPARIS_WHATSAPP = "905356537047"; // format: "905XXXXXXXXX"

