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
    baseUmkmCount: 0,
    coordinatesLabel: '7°20′S 108°30′E',
  },
  {
    name: 'Desa Bangunharja',
    commodityFocus: 'Gula Aren Organik & Olahan Nira',
    description:
      'Sentra penderes nira aren lereng perbukitan yang memproduksi gula semut kristal dan gula aren cetak alami khas Cisaga.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°19′S 108°31′E',
  },
  {
    name: 'Desa Danasari',
    commodityFocus: 'Pangan Olahan & Hasil Pertanian',
    description:
      'Sentra usaha rumahan pengolah aneka keripik singkong, rengginang, serta hasil pertanian segar yang dipasarkan ke pasar rakyat Cisaga.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°21′S 108°30′E',
  },
  {
    name: 'Desa Girimukti',
    commodityFocus: 'Komoditas Perbukitan & Kriya Kayu',
    description:
      'Kawasan perbukitan hijau dengan potensi hasil kebun, olahan rempah tradisional, serta kerajinan perkakas kayu dan bambu.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°18′S 108°32′E',
  },
  {
    name: 'Desa Karyamulya',
    commodityFocus: 'Kuliner Tradisional & Jasa Kreatif',
    description:
      'Sentra pelaku kuliner tradisional, kue basah, serta usaha konveksi dan jasa kreatif keluarga di koridor timur Cisaga.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°20′S 108°32′E',
  },
  {
    name: 'Desa Kepel',
    commodityFocus: 'Kopi Lokal & Hasil Perkebunan',
    description:
      'Kelompok tani dan penyangrai kopi rakyat dataran tinggi Cisaga dengan proses pascapanen natural dan semi-washed.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°18′S 108°28′E',
  },
  {
    name: 'Desa Mekarmukti',
    commodityFocus: 'Batik Ciamisan & Wastra Lokal',
    description:
      'Kelompok pembatik tulis dan cap bermotif flora lokal seperti daun sukun, rereng parang, serta corak khas tatar Galuh.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°20′S 108°33′E',
  },
  {
    name: 'Desa Sidamulya',
    commodityFocus: 'Agribisnis Terpadu & Olahan Pangan',
    description:
      'Desa agraris dengan penggerak UMKM olahan hasil kebun, madu ternak, dan usaha pangan kemasan untuk oleh-oleh daerah.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°21′S 108°32′E',
  },
  {
    name: 'Desa Sukahurip',
    commodityFocus: 'Beras Lokal, Jamur & Kuliner Desa',
    description:
      'Sentra pertanian produktif penghasil beras sehat, budidaya jamur tiram, dan aneka olahan camilan kering skala rumah tangga.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°19′S 108°29′E',
  },
  {
    name: 'Desa Tanjungjaya',
    commodityFocus: 'Anyaman Bambu & Kriya Rumah Tangga',
    description:
      'Komunitas pengrajin turun-temurun penghasil besek, nampan saji, kap lampu, dan keranjang bambu dengan anyaman halus bernilai ekspor.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°21′S 108°29′E',
  },
  {
    name: 'Desa Wangunjaya',
    commodityFocus: 'Sale Pisang Asap & Camilan Tradisional',
    description:
      'Sentra pengolahan pisang ambon dan pisang siem menjadi sale asap renyah serta aneka keripik khas Priangan Timur.',
    baseUmkmCount: 0,
    coordinatesLabel: '7°22′S 108°31′E',
  },
];

export const LEGACY_SEEDED_UMKM_IDS: readonly string[] = [
  'gula-aren-bangunharja',
  'batik-ciamis-mekarmukti',
  'hampers-karya-cisaga',
  'sale-pisang-wangunjaya',
  'anyaman-bambu-tanjungjaya',
  'kopi-kepel-cisaga',
  'gmaps-warung-arkan-bangunharja',
  'gmaps-warung-cahya-adhytia-bangunharja',
  'gmaps-kiripik-singkong-cisaga',
  'gmaps-dapur-kue-hana-cisaga',
  'gmaps-umkm-orion-cisaga',
  'gmaps-teras-uyut-cisaga',
  'gmaps-pentol-si-madun-cisaga',
  'gmaps-keu-saung-mbak-ani-cisaga',
  'gmaps-kedai-nurdara-danasari',
  'gmaps-warung-sembako-idah-girimukti',
  'gmaps-juve-girimukti',
  'gmaps-warung-mah-ariel-girimukti',
  'gmaps-cetakan-seroja-karyamulya',
  'gmaps-warung-bi-eti-kepel',
  'gmaps-saroja-karasa-raos-mekarmukti',
  'gmaps-tamu-coffee-mekarmukti',
  'gmaps-rm-fajar-mekarmukti',
  'gmaps-warung-mang-itang-mekarmukti',
  'gmaps-warung-ajun-sidamulya',
  'gmaps-warung-teh-elis-sidamulya',
  'gmaps-toko-cinyenang-sidamulya',
  'gmaps-toko-wawan-karawang-sukahurip',
  'gmaps-toko-sumber-rezeki-tanjungjaya',
  'gmaps-toko-barokah-tanjungjaya',
  'gmaps-kikijavamarket-wangunjaya',
  'gmaps-toko-kurnia-wangunjaya',
  'gmaps-toko-titin-wangunjaya',
  'gmaps-toko-agun-wangunjaya',
];

export const LEGACY_SEEDED_TESTIMONIAL_IDS: readonly string[] = [
  'testi-nira-lestari-1',
  'testi-batik-mekar-2',
  'testi-ibu-enok-3',
];

export const INITIAL_UMKM_LISTINGS: UmkmListing[] = [];

export const INITIAL_TESTIMONIALS: CustomerTestimonial[] = [];
