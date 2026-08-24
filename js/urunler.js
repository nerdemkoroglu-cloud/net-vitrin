// Ürün verisi. Her ürün için:
// id, isim, aciklama, model (glb dosya yolu), poster (önizleme görsel, opsiyonel),
// olcu, malzeme, uretimSuresi, fiyat, oneCikan (hero'da gösterilecek mi)
// tip: "A" kendi tasarımım | "B" hazır model (indirilen)
// atif: sadece tip "B" için doldur — örnek: "Small parts case — orijinal tasarım: dguisadom (Thingiverse, CC BY-SA)"
// stokta: true (satışta) | false (stokta yok, sepete eklenemez, etiket gösterilir)

const URUNLER = [
  {
    id: "net-001",
    isim: "Mustafa Kemal Atatürk",
    aciklama: "Türkiye Cumhuriyeti devletinin kurucusu.",
    model: "modeller/Mustafa_Kemal_Ataturk.glb",
    olcu: "88,25 x 103,99 x 120,00 mm",
    malzeme: "PLA",
    uretimSuresi: "4 sa,9 dk",
    fiyat: 700,
    oneCikan: true,
    tip: "B",
    atif: "",
    stokta: true
  },
    {
    id: "net-002",
    isim: "Astronot Figürü",
    aciklama: "Demo amaçlı örnek 3D model. Kendi .glb dosyanla değiştir.",
    model: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    olcu: "180 x 90 x 90 mm",
    malzeme: "PLA",
    uretimSuresi: "6 saat",
    fiyat: 450,
    oneCikan: false,
    tip: "A",
    atif: "",
    stokta: false
  },
  {
    id: "net-003",
    isim: "net-Kedi",
    aciklama: "Arduino ile çalışan kedi figürü. Elektronik bileşenler dahil değildir.",
    model: "modeller/net-Kedi.glb",
    olcu: "100,54 x 105,00 x 91,31 mm",
    malzeme: "PLA",
    uretimSuresi: "12 sa, 24 dk",
    fiyat: 440,
    oneCikan: false,
    tip: "A",
    atif: "",
    stokta: true
  },

];
