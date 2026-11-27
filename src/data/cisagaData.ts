import type { CustomerTestimonial, UmkmListing, VillageInfo } from '../types/umkm';

export interface ImagePreset {
  label: string;
  url: string;
}

export const UMKM_IMAGE_PRESETS: ImagePreset[] = [
  {
    label: 'Gula Aren & Kemasan Kaca',
    url: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
  },
  {
    label: 'Sale Pisang & Keripik Kuliner',
    url: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
  },
  {
    label: 'Anyaman Bambu & Kerajinan',
    url: '/src/assets/images/prod_anyaman_bambu_1795525159061.jpg',
  },
  {
    label: 'Kain Batik & Busana Daerah',
    url: '/src/assets/images/prod_batik_ciamis_1795525160680.jpg',
  },
  {
    label: 'Kopi Sangrai & Hasil Bumi',
    url: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
  },
  {
    label: 'Paket Hantaran & Etalase Sentra',
    url: '/src/assets/images/hero_cisaga_umkm_1795525158488.jpg',
  },
];

export const CISAGA_VILLAGES: VillageInfo[] = [
  {
    name: 'Desa Cisaga',
    commodityFocus: 'Pusat Pemerintahan Kec. · Kuliner & Hantaran',
    description:
      'Pusat pemerintahan Kecamatan Cisaga sekaligus etalase bersama produk olahan pangan, bingkisan oleh-oleh daerah, dan pusat temu mitra usaha lokal.',
    baseUmkmCount: 12,
    coordinatesLabel: '7°20′S 108°30′E',
  },
  {
    name: 'Desa Bangunharja',
    commodityFocus: 'Gula Aren Organik & Olahan Nira',
    description:
      'Sentra penderes nira aren lereng perbukitan yang memproduksi gula semut kristal dan gula aren cetak alami khas Cisaga.',
    baseUmkmCount: 9,
    coordinatesLabel: '7°19′S 108°31′E',
  },
  {
    name: 'Desa Danasari',
    commodityFocus: 'Pangan Olahan & Hasil Pertanian',
    description:
      'Sentra usaha rumahan pengolah aneka keripik singkong, rengginang, serta hasil pertanian segar yang dipasarkan ke pasar rakyat Cisaga.',
    baseUmkmCount: 5,
    coordinatesLabel: '7°21′S 108°30′E',
  },
  {
    name: 'Desa Girimukti',
    commodityFocus: 'Komoditas Perbukitan & Kriya Kayu',
    description:
      'Kawasan perbukitan hijau dengan potensi hasil kebun, olahan rempah tradisional, serta kerajinan perkakas kayu dan bambu.',
    baseUmkmCount: 5,
    coordinatesLabel: '7°18′S 108°32′E',
  },
  {
    name: 'Desa Karyamulya',
    commodityFocus: 'Kuliner Tradisional & Jasa Kreatif',
    description:
      'Sentra pelaku kuliner tradisional, kue basah, serta usaha konveksi dan jasa kreatif keluarga di koridor timur Cisaga.',
    baseUmkmCount: 6,
    coordinatesLabel: '7°20′S 108°32′E',
  },
  {
    name: 'Desa Kepel',
    commodityFocus: 'Kopi Lokal & Hasil Perkebunan',
    description:
      'Kelompok tani dan penyangrai kopi rakyat dataran tinggi Cisaga dengan proses pascapanen natural dan semi-washed.',
    baseUmkmCount: 6,
    coordinatesLabel: '7°18′S 108°28′E',
  },
  {
    name: 'Desa Mekarmukti',
    commodityFocus: 'Batik Ciamisan & Wastra Lokal',
    description:
      'Kelompok pembatik tulis dan cap bermotif flora lokal seperti daun sukun, rereng parang, serta corak khas tatar Galuh.',
    baseUmkmCount: 6,
    coordinatesLabel: '7°20′S 108°33′E',
  },
  {
    name: 'Desa Sidamulya',
    commodityFocus: 'Agribisnis Terpadu & Olahan Pangan',
    description:
      'Desa agraris dengan penggerak UMKM olahan hasil kebun, madu ternak, dan usaha pangan kemasan untuk oleh-oleh daerah.',
    baseUmkmCount: 5,
    coordinatesLabel: '7°21′S 108°32′E',
  },
  {
    name: 'Desa Sukahurip',
    commodityFocus: 'Beras Lokal, Jamur & Kuliner Desa',
    description:
      'Sentra pertanian produktif penghasil beras sehat, budidaya jamur tiram, dan aneka olahan camilan kering skala rumah tangga.',
    baseUmkmCount: 5,
    coordinatesLabel: '7°19′S 108°29′E',
  },
  {
    name: 'Desa Tanjungjaya',
    commodityFocus: 'Anyaman Bambu & Kriya Rumah Tangga',
    description:
      'Komunitas pengrajin turun-temurun penghasil besek, nampan saji, kap lampu, dan keranjang bambu dengan anyaman halus bernilai ekspor.',
    baseUmkmCount: 8,
    coordinatesLabel: '7°21′S 108°29′E',
  },
  {
    name: 'Desa Wangunjaya',
    commodityFocus: 'Sale Pisang Asap & Camilan Tradisional',
    description:
      'Sentra pengolahan pisang ambon dan pisang siem menjadi sale asap renyah serta aneka keripik khas Priangan Timur.',
    baseUmkmCount: 7,
    coordinatesLabel: '7°22′S 108°31′E',
  },
];

export const INITIAL_UMKM_LISTINGS: UmkmListing[] = [
  {
    id: 'gula-aren-bangunharja',
    businessName: 'KUB Nira Lestari',
    ownerName: 'H. Dadang Kurniawan',
    productName: 'Gula Aren Semut & Cetak Bangunharja',
    category: 'Agribisnis',
    village: 'Desa Bangunharja',
    whatsapp: '081322450112',
    tier: 'premium',
    status: 'Aktif',
    price: 24000,
    unitLabel: 'Toples Semut 250g',
    shortDescription:
      'Nira aren murni lereng Bangunharja dengan aroma karamel alami tanpa campuran.',
    fullDescription:
      'Dipanen setiap pagi oleh petani penderes Desa Bangunharja dan diolah higienis menggunakan wajan tradisional. Terbuka untuk pembelian eceran, pasokan kedai kopi, maupun kemitraan reseller.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-09-10',
    variants: [
      { id: 'ga-250', label: 'Toples Semut 250g', price: 24000, availabilityNote: 'Produksi Harian' },
      { id: 'ga-500', label: 'Toples Semut 500g', price: 45000, availabilityNote: 'Siap Kirim' },
      { id: 'ga-cetak', label: 'Cetak Daun 1 kg', price: 52000, availabilityNote: 'Siap Kirim' },
    ],
  },
  {
    id: 'batik-ciamis-mekarmukti',
    businessName: 'Batik Galuh Mekar',
    ownerName: 'Rina Rahmawati',
    productName: 'Kain Batik Cap Motif Rereng Sukun',
    category: 'Busana',
    village: 'Desa Mekarmukti',
    whatsapp: '081224903371',
    tier: 'premium',
    status: 'Aktif',
    price: 165000,
    unitLabel: 'Lembaran 200 × 115 cm',
    shortDescription:
      'Katun primisima halus dengan pewarnaan hijau rimba dan sogan khas Priangan.',
    fullDescription:
      'Motif rereng daun sukun dan sulur Galuh dicap dengan malam lebah alami di Desa Mekarmukti. Tersedia untuk seragam instansi, komunitas, maupun busana acara resmi.',
    image: '/src/assets/images/prod_batik_ciamis_1795525160680.jpg',
    createdAt: '2026-09-14',
    variants: [
      { id: 'bt-200', label: 'Lembaran 200 × 115 cm', price: 165000, availabilityNote: 'Siap Kirim' },
      { id: 'bt-250', label: 'Lembaran Premium 250 × 115 cm', price: 210000, availabilityNote: 'Stok Terbatas' },
    ],
  },
  {
    id: 'hampers-karya-cisaga',
    businessName: 'Sentra Promosi CISAGA HUB',
    ownerName: 'Yanti Suryani',
    productName: 'Paket Hantaran Karya Asli Cisaga',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081395661402',
    tier: 'premium',
    status: 'Aktif',
    price: 145000,
    unitLabel: 'Paket Reguler (3 Produk)',
    shortDescription:
      'Keranjang bambu berisi kopi Kepel, gula semut Bangunharja, dan sale Wangunjaya.',
    fullDescription:
      'Kolaborasi lintas pelaku UMKM binaan Kecamatan Cisaga untuk bingkisan tamu kedinasan, suvenir kegiatan, maupun oleh-oleh keluarga dalam kemasan anyaman bambu.',
    image: '/src/assets/images/hero_cisaga_umkm_1795525158488.jpg',
    createdAt: '2026-09-18',
    variants: [
      { id: 'hm-reg', label: 'Paket Reguler (3 Produk)', price: 145000, availabilityNote: 'Siap Dipesan' },
      { id: 'hm-eks', label: 'Paket Eksklusif (+ Selendang Batik)', price: 285000, availabilityNote: 'Pre-order 2 Hari' },
    ],
  },
  {
    id: 'sale-pisang-wangunjaya',
    businessName: 'Dapur Ibu Enok',
    ownerName: 'Enok Suryati',
    productName: 'Sale Pisang Asap Renyah Wangunjaya',
    category: 'Kuliner',
    village: 'Desa Wangunjaya',
    whatsapp: '085223819044',
    tier: 'reguler',
    status: 'Aktif',
    price: 18000,
    unitLabel: 'Kemasan 200g',
    shortDescription:
      'Pisang pilihan diasap tradisional lalu dipanggang hingga manis legit dan renyah.',
    fullDescription:
      'Dibuat dari pisang siem matang pohon tanpa pemanis buatan. Proses pengasapan kayu rambutan menjaga tekstur kenyal sekaligus renyah di bagian luar, cocok untuk oleh-oleh khas Cisaga.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-10-02',
    variants: [
      { id: 'sp-200', label: 'Kemasan 200g', price: 18000, availabilityNote: 'Siap Kirim' },
      { id: 'sp-450', label: 'Kemasan Keluarga 450g', price: 36000, availabilityNote: 'Siap Kirim' },
    ],
  },
  {
    id: 'anyaman-bambu-tanjungjaya',
    businessName: 'Sanggar Kriya Sauyunan',
    ownerName: 'Ujang Komara',
    productName: 'Nampan & Kap Lampu Anyaman Bambu Tali',
    category: 'Kerajinan',
    village: 'Desa Tanjungjaya',
    whatsapp: '082117648830',
    tier: 'reguler',
    status: 'Aktif',
    price: 78000,
    unitLabel: 'Nampan Saji 32cm',
    shortDescription:
      'Anyaman bambu tali pilihan dengan finishing vernis aman pangan dan tahan lembap.',
    fullDescription:
      'Setiap bilah bambu diserut manual hingga seragam oleh pengrajin senior Desa Tanjungjaya. Menerima pesanan satuan maupun pengadaan dekorasi kafe, hotel, dan suvenir acara.',
    image: '/src/assets/images/prod_anyaman_bambu_1795525159061.jpg',
    createdAt: '2026-10-05',
    variants: [
      { id: 'ab-nampan', label: 'Nampan Saji 32cm', price: 78000, availabilityNote: 'Siap Kirim' },
      { id: 'ab-kap', label: 'Kap Lampu Silinder', price: 135000, availabilityNote: 'Pre-order 3 Hari' },
      { id: 'ab-set', label: 'Set Nampan + Kap Lampu', price: 198000, availabilityNote: 'Pre-order 4 Hari' },
    ],
  },
  {
    id: 'kopi-kepel-cisaga',
    businessName: 'Roastery Tani Kepel',
    ownerName: 'Asep Herdiana',
    productName: 'Kopi Robusta & Arabika Sangrai Kepel',
    category: 'Agribisnis',
    village: 'Desa Kepel',
    whatsapp: '085314772209',
    tier: 'reguler',
    status: 'Aktif',
    price: 58000,
    unitLabel: 'Biji Utuh 250g',
    shortDescription:
      'Biji kopi petik merah dataran tinggi Kepel dengan profil sangrai medium-dark.',
    fullDescription:
      'Menghadirkan cita rasa cokelat hitam, gula aren, dan keasaman lembut khas kebun rakyat Desa Kepel. Tersedia untuk penikmat rumahan dan pasokan kedai kopi.',
    image: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
    createdAt: '2026-10-12',
    variants: [
      { id: 'kp-biji', label: 'Biji Utuh 250g', price: 58000, availabilityNote: 'Fresh Roast' },
      { id: 'kp-halus', label: 'Giling Tubruk Halus 250g', price: 58000, availabilityNote: 'Fresh Roast' },
      { id: 'kp-v60', label: 'Giling Sedang Pour-Over 250g', price: 62000, availabilityNote: 'Fresh Roast' },
    ],
  },
  // UMKM Terverifikasi Google Maps per Desa di Kecamatan Cisaga
  {
    id: 'gmaps-warung-arkan-bangunharja',
    businessName: 'Warung Arkan',
    ownerName: 'Pengelola Warung Arkan',
    productName: 'Kedai Kopi & Sajian Minuman Hangat',
    category: 'Kuliner',
    village: 'Desa Bangunharja',
    whatsapp: '085321654342',
    tier: 'reguler',
    status: 'Aktif',
    price: 10000,
    unitLabel: 'Porsi Sajian Kopi & Camilan',
    shortDescription:
      'Kedai kopi lokal di Dusun Mekarmulya, Jl. Cikadu, Desa Bangunharja, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Kedai Kopi di alamat PG2X+R32, Dusun Mekarmulya Jl. Cikadu, Bangunharja, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0853-2165-4342.',
    image: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
    createdAt: '2026-06-12',
    variants: [
      { id: 'gmaps-arkan-1', label: 'Porsi Sajian Kopi & Camilan', price: 10000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-warung-cahya-adhytia-bangunharja',
    businessName: 'Warung Cahya Adhytia',
    ownerName: 'Pengelola Warung Cahya Adhytia',
    productName: 'Bahan Pangan & Kebutuhan Harian Bangunharja',
    category: 'Agribisnis',
    village: 'Desa Bangunharja',
    whatsapp: '081223658620',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Kebutuhan Pokok',
    shortDescription:
      'Toko bahan makanan warga di wilayah Desa Bangunharja, Kecamatan Cisaga, Kabupaten Ciamis.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di alamat PH62+X5G, Bangunharja, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0812-2365-8620.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-06-18',
    variants: [
      { id: 'gmaps-cahya-1', label: 'Paket Kebutuhan Pokok', price: 15000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-kiripik-singkong-cisaga',
    businessName: 'Kiripik Singkong Cisaga',
    ownerName: 'Pengelola Kiripik Singkong Cisaga',
    productName: 'Keripik Singkong Renyah Khas Cisaga',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081214231484',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Kemasan Oleh-Oleh 250g',
    shortDescription:
      'Sentra olahan keripik singkong khas Dusun Cisaga Kota RT 03 RW 05 No. 55, Desa Cisaga.',
    fullDescription:
      'Terdata di Google Maps di alamat Dusun Cisaga Kota RT 3 RW 5 No. 55, Cisaga, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Melayani pemesanan eceran dan oleh-oleh khas Cisaga. Kontak: 0812-1423-1484.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-06-22',
    variants: [
      { id: 'gmaps-kiripik-1', label: 'Kemasan Oleh-Oleh 250g', price: 15000, availabilityNote: 'Siap Pesan' },
    ],
  },
  {
    id: 'gmaps-dapur-kue-hana-cisaga',
    businessName: 'DAPUR KUE HANA CISAGA',
    ownerName: 'Pengelola Dapur Kue Hana',
    productName: 'Aneka Kue Rumahan & Roti Segar Cisaga',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '0895703231764',
    tier: 'reguler',
    status: 'Aktif',
    price: 25000,
    unitLabel: 'Box Kue Pilihan',
    shortDescription:
      'Toko roti dan aneka kue buatan rumah di Jl. Ciminyak, Desa Cisaga, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko Roti di Jl. Ciminyak, Cisaga, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Menerima pesanan kue harian dan hantaran. Kontak: 0895-7032-31764.',
    image: '/src/assets/images/hero_cisaga_umkm_1795525158488.jpg',
    createdAt: '2026-06-25',
    variants: [
      { id: 'gmaps-hana-1', label: 'Box Kue Pilihan', price: 25000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-umkm-orion-cisaga',
    businessName: 'Umkm ORION',
    ownerName: 'Pengelola Umkm ORION',
    productName: 'Produk Olahan & Produksi Lokal ORION',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '085711187856',
    tier: 'reguler',
    status: 'Aktif',
    price: 20000,
    unitLabel: 'Paket Produk ORION',
    shortDescription:
      'Pelaku usaha produsen lokal di Dusun Cimanggu RT 03/RW 10, Desa Cisaga, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Produsen di alamat MG4C+X8M, RT.03/RW.10, Cimanggu, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0857-1118-7856.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-07-02',
    variants: [
      { id: 'gmaps-orion-1', label: 'Paket Produk ORION', price: 20000, availabilityNote: 'Siap Pesan' },
    ],
  },
  {
    id: 'gmaps-teras-uyut-cisaga',
    businessName: 'TERAS UYUT Cisaga Mie Ayam Pangsit Baso',
    ownerName: 'Pengelola Teras Uyut Cisaga',
    productName: 'Mie Ayam, Pangsit & Bakso Hangat',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '08999495997',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Porsi Mie Ayam / Bakso',
    shortDescription:
      'Kedai mie ayam, pangsit, dan bakso di Jl. Ciminyak No.74, Desa Cisaga, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Restoran Bakso di Jl. Ciminyak No.74, Cisaga, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak pemesanan: 0899-9495-997.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-07-05',
    variants: [
      { id: 'gmaps-uyut-1', label: 'Porsi Mie Ayam / Bakso', price: 15000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-pentol-si-madun-cisaga',
    businessName: 'Pentol Si Madun',
    ownerName: 'Pengelola Pentol Si Madun',
    productName: 'Pentol & Bakso Daging Khas Cimanggu',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '085294934800',
    tier: 'reguler',
    status: 'Aktif',
    price: 10000,
    unitLabel: 'Porsi Pentol Hangat',
    shortDescription:
      'Usaha kuliner pentol dan bakso di Dusun Cimanggu RT 01/RW 10, Desa Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Restoran Bakso di Dusun Cimanggu, RT.01/RW.10, Cisaga, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0852-9493-4800.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-07-08',
    variants: [
      { id: 'gmaps-madun-1', label: 'Porsi Pentol Hangat', price: 10000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-keu-saung-mbak-ani-cisaga',
    businessName: 'KEU SAUNG / SOTO AYAM MBAK ANI',
    ownerName: 'Mbak Ani',
    productName: 'Soto Ayam Kuah Gurih & Kedai Kopi',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '085353491226',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Porsi Soto Ayam',
    shortDescription:
      'Warung soto ayam dan kedai kopi santai di wilayah Desa Cisaga, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Kedai Kopi di alamat MG48+RM5, Cisaga, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0853-5349-1226.',
    image: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
    createdAt: '2026-07-10',
    variants: [
      { id: 'gmaps-mbakani-1', label: 'Porsi Soto Ayam', price: 15000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-kedai-nurdara-danasari',
    businessName: 'Kedai Nurdara',
    ownerName: 'Pengelola Kedai Nurdara',
    productName: 'Menu Sarapan & Makan Siang Rumahan',
    category: 'Kuliner',
    village: 'Desa Danasari',
    whatsapp: '081559628506',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Menu Harian',
    shortDescription:
      'Kedai sarapan dan makan siang warga di Desa Danasari, Kecamatan Cisaga, Ciamis.',
    fullDescription:
      'Terdata di Google Maps sebagai Kedai Sarapan & Makan Siang di alamat MFG2+8GM, Danasari, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0815-5962-8506.',
    image: '/src/assets/images/hero_cisaga_umkm_1795525158488.jpg',
    createdAt: '2026-07-12',
    variants: [
      { id: 'gmaps-nurdara-1', label: 'Paket Menu Harian', price: 15000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-warung-sembako-idah-girimukti',
    businessName: 'Warung sembako idah',
    ownerName: 'Ibu Idah',
    productName: 'Sembako & Hasil Bumi Dusun Ciawitali',
    category: 'Agribisnis',
    village: 'Desa Girimukti',
    whatsapp: '081222720816',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Bahan Pokok',
    shortDescription:
      'Toko sembako dan kebutuhan pangan warga di Dusun Ciawitali, Desa Girimukti.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko sembako di Dusun Ciawitali, Girimukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46291. Kontak langsung: 0812-2272-0816.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-07-14',
    variants: [
      { id: 'gmaps-idah-1', label: 'Paket Bahan Pokok', price: 15000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-juve-girimukti',
    businessName: 'Juve',
    ownerName: 'Pengelola Toko Juve',
    productName: 'Bahan Makanan & Kebutuhan Rumah Tangga',
    category: 'Agribisnis',
    village: 'Desa Girimukti',
    whatsapp: '081323919010',
    tier: 'reguler',
    status: 'Aktif',
    price: 12000,
    unitLabel: 'Paket Belanja Harian',
    shortDescription:
      'Toko bahan makanan lokal di Desa Girimukti, Kecamatan Cisaga, Kabupaten Ciamis.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di alamat PG8C+H8W, Girimukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0813-2391-9010.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-07-16',
    variants: [
      { id: 'gmaps-juve-1', label: 'Paket Belanja Harian', price: 12000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-warung-mah-ariel-girimukti',
    businessName: 'Warung mah Ariel',
    ownerName: 'Mamah Ariel',
    productName: 'Jajanan & Kebutuhan Harian Cihawu',
    category: 'Kuliner',
    village: 'Desa Girimukti',
    whatsapp: '081395909063',
    tier: 'reguler',
    status: 'Aktif',
    price: 10000,
    unitLabel: 'Paket Camilan & Harian',
    shortDescription:
      'Minimarket dan warung kebutuhan harian di Kampung Cihawu RT 08/RW 05, Desa Girimukti.',
    fullDescription:
      'Terdata di Google Maps sebagai Minimarket di Kampung Cihawu, RT.08/RW.05, Desa Girimukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak: 0813-9590-9063.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-07-18',
    variants: [
      { id: 'gmaps-ariel-1', label: 'Paket Camilan & Harian', price: 10000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-cetakan-seroja-karyamulya',
    businessName: 'Cetakan seroja',
    ownerName: 'Pengelola Cetakan Seroja',
    productName: 'Cetakan Kue Seroja & Perlengkapan Rumah Tangga',
    category: 'Kerajinan',
    village: 'Desa Karyamulya',
    whatsapp: '085251879585',
    tier: 'reguler',
    status: 'Aktif',
    price: 35000,
    unitLabel: 'Unit Cetakan Seroja',
    shortDescription:
      'Grosir dan perajin cetakan kue seroja di Jl. Campalung Bantardawa I, Desa Karyamulya.',
    fullDescription:
      'Terdata di Google Maps sebagai Grosir Perlengkapan Rumah Tangga di alamat MCPV+82G, Jl. Campalung Bantardawa I, RT.005/RW.006, Karyamulya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak: 0852-5187-9585.',
    image: '/src/assets/images/prod_anyaman_bambu_1795525159061.jpg',
    createdAt: '2026-07-20',
    variants: [
      { id: 'gmaps-seroja-1', label: 'Unit Cetakan Seroja', price: 35000, availabilityNote: 'Siap Kirim' },
    ],
  },
  {
    id: 'gmaps-warung-bi-eti-kepel',
    businessName: 'Warung Bi Eti p eman',
    ownerName: 'Bi Eti',
    productName: 'Sembako, Bumbu Dapur & Jajanan Desa Kepel',
    category: 'Agribisnis',
    village: 'Desa Kepel',
    whatsapp: '082319674934',
    tier: 'reguler',
    status: 'Aktif',
    price: 12000,
    unitLabel: 'Paket Belanja Dapur',
    shortDescription:
      'Toko kelontong dan penyedia bahan pangan warga di Jl. Mekarmulya, Desa Kepel, Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko Kelontong di alamat MFCM+FGX, Jl. Mekarmulya, Kepel, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0823-1967-4934.',
    image: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
    createdAt: '2026-07-22',
    variants: [
      { id: 'gmaps-bieti-1', label: 'Paket Belanja Dapur', price: 12000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-saroja-karasa-raos-mekarmukti',
    businessName: 'Makanan khas Ciamis "Saroja" [Karasa Raos]',
    ownerName: 'Pengelola Karasa Raos',
    productName: 'Kue Seroja & Oleh-Oleh Khas Ciamis',
    category: 'Kuliner',
    village: 'Desa Mekarmukti',
    whatsapp: '085861181117',
    tier: 'reguler',
    status: 'Aktif',
    price: 20000,
    unitLabel: 'Kemasan Kue Seroja',
    shortDescription:
      'Pemasok kue tradisional seroja dan makanan khas Ciamis di Jl. Ciamis - Banjar, Mekarmukti.',
    fullDescription:
      'Terdata di Google Maps sebagai Pemasok Produk Makanan di alamat MG24+QRX, Jl. Ciamis - Banjar, Mekarmukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak: 0858-6118-1117.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-07-25',
    variants: [
      { id: 'gmaps-saroja-1', label: 'Kemasan Kue Seroja', price: 20000, availabilityNote: 'Siap Pesan' },
    ],
  },
  {
    id: 'gmaps-tamu-coffee-mekarmukti',
    businessName: 'Tamu Coffee and Eatery',
    ownerName: 'Pengelola Tamu Coffee',
    productName: 'Kopi Racikan & Menu Eatery Cisaga',
    category: 'Kuliner',
    village: 'Desa Mekarmukti',
    whatsapp: '082260183284',
    tier: 'reguler',
    status: 'Aktif',
    price: 18000,
    unitLabel: 'Minuman Kopi & Camilan',
    shortDescription:
      'Kedai kopi dan eatery modern di Jl. Ciamis - Banjar No.341, Desa Mekarmukti, Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Kedai Kopi di Jl. Ciamis - Banjar No.341, Mekarmukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46271. Kontak langsung: 0822-6018-3284.',
    image: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
    createdAt: '2026-07-27',
    variants: [
      { id: 'gmaps-tamu-1', label: 'Minuman Kopi & Camilan', price: 18000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-rm-fajar-mekarmukti',
    businessName: 'RM Fajar (Ayam Goreng, Bakar, Pepes Bebeong dan Sop Buntut)',
    ownerName: 'Pengelola RM Fajar',
    productName: 'Ayam Bakar, Pepes Bebeong & Sop Buntut Sunda',
    category: 'Kuliner',
    village: 'Desa Mekarmukti',
    whatsapp: '085286812345',
    tier: 'reguler',
    status: 'Aktif',
    price: 28000,
    unitLabel: 'Porsi Hidangan Sunda',
    shortDescription:
      'Restoran Sunda di Jl. Ciamis - Banjar No.280, Mekarmukti dengan menu pepes bebeong khas.',
    fullDescription:
      'Terdata di Google Maps sebagai Restoran Sunda di Jl. Ciamis - Banjar No.280, Mekarmukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46271. Kontak reservasi & pesan: 0852-8681-2345.',
    image: '/src/assets/images/hero_cisaga_umkm_1795525158488.jpg',
    createdAt: '2026-07-29',
    variants: [
      { id: 'gmaps-rmfajar-1', label: 'Porsi Hidangan Sunda', price: 28000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-warung-mang-itang-mekarmukti',
    businessName: 'Warung Mang ITANG',
    ownerName: 'Mang Itang',
    productName: 'Bahan Makanan & Sembako Mekarmukti',
    category: 'Agribisnis',
    village: 'Desa Mekarmukti',
    whatsapp: '081283812178',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Kebutuhan Dapur',
    shortDescription:
      'Toko bahan makanan dan kebutuhan harian warga di Desa Mekarmukti, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di alamat JGXC+HFH, Mekarmukti, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0812-8381-2178.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-08-02',
    variants: [
      { id: 'gmaps-itang-1', label: 'Paket Kebutuhan Dapur', price: 15000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-warung-ajun-sidamulya',
    businessName: 'Warung Ajun',
    ownerName: 'Pengelola Warung Ajun',
    productName: 'Kopi Seduh & Sajian Kedai Sidamulya',
    category: 'Kuliner',
    village: 'Desa Sidamulya',
    whatsapp: '081321882212',
    tier: 'reguler',
    status: 'Aktif',
    price: 10000,
    unitLabel: 'Sajian Kopi & Gorengan',
    shortDescription:
      'Kedai kopi dan tempat singgah santai warga di Desa Sidamulya, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Kedai Kopi di alamat MFX8+375, Sidamulya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0813-2188-2212.',
    image: '/src/assets/images/prod_kopi_cisaga_1795525161174.jpg',
    createdAt: '2026-08-05',
    variants: [
      { id: 'gmaps-ajun-1', label: 'Sajian Kopi & Gorengan', price: 10000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-warung-teh-elis-sidamulya',
    businessName: 'Warung Teh Elis',
    ownerName: 'Teh Elis',
    productName: 'Jajanan Rumahan & Kebutuhan Harian',
    category: 'Kuliner',
    village: 'Desa Sidamulya',
    whatsapp: '081318684268',
    tier: 'reguler',
    status: 'Aktif',
    price: 10000,
    unitLabel: 'Paket Jajanan Harian',
    shortDescription:
      'Usaha toko dan jajanan masyarakat lokal di Desa Sidamulya, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko di wilayah Sidamulya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0813-1868-4268.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-08-08',
    variants: [
      { id: 'gmaps-tehelis-1', label: 'Paket Jajanan Harian', price: 10000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-toko-cinyenang-sidamulya',
    businessName: 'Toko Bahan Makanan Dusun Cinyenang',
    ownerName: 'Pengelola Toko Cinyenang',
    productName: 'Bahan Pangan Segar & Sembako Cinyenang',
    category: 'Agribisnis',
    village: 'Desa Sidamulya',
    whatsapp: '085224269715',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Bahan Masakan',
    shortDescription:
      'Toko bahan makanan warga di Dusun Cinyenang, Desa Sidamulya, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps (Dusun Cinyenang, kategori Toko bahan makanan) di alamat PF27+VC4, Unnamed Road Cinyenang, Sidamulya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak: 0852-2426-9715.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-08-10',
    variants: [
      { id: 'gmaps-cinyenang-1', label: 'Paket Bahan Masakan', price: 15000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-toko-wawan-karawang-sukahurip',
    businessName: 'Toko Wawan Karawang',
    ownerName: 'Wawan Karawang',
    productName: 'Perlengkapan Rumah Tangga & Perabot Desa',
    category: 'Kerajinan',
    village: 'Desa Sukahurip',
    whatsapp: '082216645253',
    tier: 'reguler',
    status: 'Aktif',
    price: 25000,
    unitLabel: 'Perlengkapan Rumah Tangga',
    shortDescription:
      'Toko perlengkapan rumah tangga di Jl. Raya Rancah, Desa Sukahurip, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko Perlengkapan Rumah di Jl. Raya Rancah, Sukahurip, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0822-1664-5253.',
    image: '/src/assets/images/prod_anyaman_bambu_1795525159061.jpg',
    createdAt: '2026-08-12',
    variants: [
      { id: 'gmaps-wawan-1', label: 'Perlengkapan Rumah Tangga', price: 25000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-toko-sumber-rezeki-tanjungjaya',
    businessName: 'Toko Sumber Rezeki',
    ownerName: 'Pengelola Sumber Rezeki',
    productName: 'Bahan Makanan & Kebutuhan Pokok Bantardawa',
    category: 'Agribisnis',
    village: 'Desa Tanjungjaya',
    whatsapp: '085700428032',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Sembako Harian',
    shortDescription:
      'Toko bahan makanan 24 jam di Jl. Bantardawa I, Desa Tanjungjaya, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di alamat MGG3+8HX, Jl. Bantardawa I, Tanjungjaya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak: 0857-0042-8032.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-08-15',
    variants: [
      { id: 'gmaps-sumberrezeki-1', label: 'Paket Sembako Harian', price: 15000, availabilityNote: 'Buka 24 Jam' },
    ],
  },
  {
    id: 'gmaps-toko-barokah-tanjungjaya',
    businessName: 'Toko Barokah',
    ownerName: 'Pengelola Toko Barokah',
    productName: 'Bahan Pangan & Jajanan Dusun Sukajaya',
    category: 'Kuliner',
    village: 'Desa Tanjungjaya',
    whatsapp: '08125565144',
    tier: 'reguler',
    status: 'Aktif',
    price: 12000,
    unitLabel: 'Paket Belanja Harian',
    shortDescription:
      'Toko bahan makanan dan kebutuhan warga di Sukajaya RT 19/RW 09, Desa Tanjungjaya.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di Sukajaya RT19/RW09, Tanjungjaya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0812-5565-144.',
    image: '/src/assets/images/prod_sale_pisang_1795525159243.jpg',
    createdAt: '2026-08-17',
    variants: [
      { id: 'gmaps-barokah-1', label: 'Paket Belanja Harian', price: 12000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-kikijavamarket-wangunjaya',
    businessName: 'Kikijavamarket',
    ownerName: 'Pengelola Kikijavamarket',
    productName: 'Bahan Makanan & Produk Harian Pasirlugina',
    category: 'Agribisnis',
    village: 'Desa Wangunjaya',
    whatsapp: '081222481960',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Belanja Pangan',
    shortDescription:
      'Toko bahan makanan di Dusun Pasirlugina RT 01/RW 03, Desa Wangunjaya, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di Dusun Pasirlugina, RT.1/RW.3, Wangunjaya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0812-2248-1960.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-08-19',
    variants: [
      { id: 'gmaps-kiki-1', label: 'Paket Belanja Pangan', price: 15000, availabilityNote: 'Tersedia Harian' },
    ],
  },
  {
    id: 'gmaps-toko-kurnia-wangunjaya',
    businessName: 'Toko Kurnia',
    ownerName: 'Pengelola Toko Kurnia',
    productName: 'Aneka Kebutuhan Pokok & Jajanan Wangunjaya',
    category: 'Kuliner',
    village: 'Desa Wangunjaya',
    whatsapp: '085323699666',
    tier: 'reguler',
    status: 'Aktif',
    price: 15000,
    unitLabel: 'Paket Belanja Harian',
    shortDescription:
      'Pusat perbelanjaan warga 24 jam di Desa Wangunjaya, Kecamatan Cisaga, Kabupaten Ciamis.',
    fullDescription:
      'Terdata di Google Maps sebagai Pusat Perbelanjaan di alamat MGF8+FW9, Wangunjaya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0853-2369-9666.',
    image: '/src/assets/images/hero_cisaga_umkm_1795525158488.jpg',
    createdAt: '2026-08-21',
    variants: [
      { id: 'gmaps-kurnia-1', label: 'Paket Belanja Harian', price: 15000, availabilityNote: 'Buka 24 Jam' },
    ],
  },
  {
    id: 'gmaps-toko-titin-wangunjaya',
    businessName: 'TOKO TITIN',
    ownerName: 'Ibu Titin',
    productName: 'Bahan Makanan & Sembako Wangunjaya',
    category: 'Agribisnis',
    village: 'Desa Wangunjaya',
    whatsapp: '085793425062',
    tier: 'reguler',
    status: 'Aktif',
    price: 12000,
    unitLabel: 'Paket Bahan Pangan',
    shortDescription:
      'Toko bahan makanan keluarga di Desa Wangunjaya, Kecamatan Cisaga, Kabupaten Ciamis.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko bahan makanan di alamat MGFC+2V8, Wangunjaya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0857-9342-5062.',
    image: '/src/assets/images/prod_gula_aren_1795525158657.jpg',
    createdAt: '2026-08-23',
    variants: [
      { id: 'gmaps-titin-1', label: 'Paket Bahan Pangan', price: 12000, availabilityNote: 'Buka Harian' },
    ],
  },
  {
    id: 'gmaps-toko-agun-wangunjaya',
    businessName: 'Toko AGUN',
    ownerName: 'Pengelola Toko AGUN',
    productName: 'Sandang & Perlengkapan Harian Wangunjaya',
    category: 'Busana',
    village: 'Desa Wangunjaya',
    whatsapp: '085794626058',
    tier: 'reguler',
    status: 'Aktif',
    price: 25000,
    unitLabel: 'Item Perlengkapan Harian',
    shortDescription:
      'Toko umum penyedia kebutuhan harian dan sandang di Desa Wangunjaya, Kecamatan Cisaga.',
    fullDescription:
      'Terdata di Google Maps sebagai Toko umum di alamat MGFG+H3, Wangunjaya, Kec. Cisaga, Kabupaten Ciamis, Jawa Barat 46386. Kontak langsung: 0857-9462-6058.',
    image: '/src/assets/images/prod_batik_ciamis_1795525160680.jpg',
    createdAt: '2026-08-25',
    variants: [
      { id: 'gmaps-agun-1', label: 'Item Perlengkapan Harian', price: 25000, availabilityNote: 'Buka Harian' },
    ],
  },
];

export const INITIAL_TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 'testi-nira-lestari-1',
    customerName: 'Rizky Pratama',
    customerRole: 'Pemilik Kedai Kopi · Ciamis',
    umkmId: 'gula-aren-bangunharja',
    umkmName: 'KUB Nira Lestari',
    productPurchased: 'Toples Semut 500g',
    rating: 5,
    quote:
      'Gula aren semut dari Bangunharja ini larut sempurna untuk menu kopi susu di kedai kami. Aromanya wangi alami tanpa campuran pemanis tambahan.',
    isPublished: true,
    createdAt: '2026-10-18',
  },
  {
    id: 'testi-batik-mekar-2',
    customerName: 'Hj. Dewi Anggraeni',
    customerRole: 'Koordinator Acara Instansi · Banjar',
    umkmId: 'batik-ciamis-mekarmukti',
    umkmName: 'Batik Galuh Mekar',
    productPurchased: 'Kain Batik Cap Motif Rereng Sukun',
    rating: 5,
    quote:
      'Kami memesan 35 lembar batik seragam acara kantor. Kain katunnya adem, motif rereng sukun rapi, dan pengiriman tepat waktu sesuai jadwal.',
    isPublished: true,
    createdAt: '2026-10-25',
  },
  {
    id: 'testi-ibu-enok-3',
    customerName: 'Siti Nurjanah',
    customerRole: 'Pelanggan Oleh-Oleh · Tasikmalaya',
    umkmId: 'sale-pisang-wangunjaya',
    umkmName: 'Dapur Ibu Enok',
    productPurchased: 'Sale Pisang Asap Renyah 450g',
    rating: 5,
    quote:
      'Sale pisangnya renyah di luar tapi tetap lembut manis legit di dalam. Kemasannya aman dikirim ke luar kota dan langsung jadi favorit keluarga.',
    isPublished: true,
    createdAt: '2026-11-03',
  },
];

