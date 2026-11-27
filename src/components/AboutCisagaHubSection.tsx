import {
  CheckCircle2,
  CircleDot,
  Cpu,
  Mountain,
  Palette,
  Quote,
  ShoppingCart,
  Store,
  Sun,
  Target,
} from 'lucide-react';
import { CISAGA_HUB_LOGO_PATH } from './BrandLogo';

const LOGO_PHILOSOPHY_ITEMS = [
  {
    code: 'A',
    title: 'Huruf C dan Lingkaran',
    description:
      'Melambangkan identitas Kecamatan Cisaga sekaligus simbol konektivitas yang menghubungkan pelaku UMKM, konsumen, dan masyarakat dalam satu ekosistem digital.',
    icon: CircleDot,
    accentClass: 'text-[#0F2744] bg-[#0F2744]/8',
  },
  {
    code: 'B',
    title: 'Sawah dan Pegunungan',
    description:
      'Melambangkan kekayaan alam dan potensi pertanian Kecamatan Cisaga. Hamparan persawahan merepresentasikan kehidupan masyarakat serta sumber ekonomi lokal.',
    icon: Mountain,
    accentClass: 'text-[#047857] bg-[#047857]/10',
  },
  {
    code: 'C',
    title: 'Toko dan Produk UMKM',
    description:
      'Melambangkan berbagai usaha masyarakat—mulai dari perdagangan, produk olahan, kerajinan, hingga kuliner—bahwa setiap usaha lokal berkesempatan berkembang.',
    icon: Store,
    accentClass: 'text-[#0F2744] bg-[#0F2744]/8',
  },
  {
    code: 'D',
    title: 'Keranjang Belanja Digital',
    description:
      'Melambangkan aktivitas perdagangan dan transaksi ekonomi yang semakin mudah melalui pemanfaatan teknologi digital.',
    icon: ShoppingCart,
    accentClass: 'text-[#EA580C] bg-[#EA580C]/10',
  },
  {
    code: 'E',
    title: 'Elemen Pixel dan Teknologi',
    description:
      'Melambangkan transformasi digital, inovasi, dan perkembangan zaman. Cisaga Hub membantu UMKM beradaptasi dengan teknologi untuk menjangkau pasar lebih luas.',
    icon: Cpu,
    accentClass: 'text-[#0284C7] bg-[#0284C7]/10',
  },
  {
    code: 'F',
    title: 'Matahari',
    description:
      'Melambangkan harapan, awal baru, dan optimisme terhadap pertumbuhan ekonomi masyarakat Kecamatan Cisaga.',
    icon: Sun,
    accentClass: 'text-[#D97706] bg-[#D97706]/10',
  },
];

const COLOR_MEANINGS = [
  {
    name: 'Biru Tua',
    swatchClass: 'bg-[#0F2744]',
    meaning: 'Profesionalisme, kepercayaan, dan teknologi.',
  },
  {
    name: 'Biru Cerah',
    swatchClass: 'bg-[#0284C7]',
    meaning: 'Inovasi, konektivitas, dan perkembangan digital.',
  },
  {
    name: 'Hijau',
    swatchClass: 'bg-[#16A34A]',
    meaning: 'Pertanian, kesuburan, dan potensi alam Cisaga.',
  },
  {
    name: 'Oranye',
    swatchClass: 'bg-[#EA580C]',
    meaning: 'Semangat kewirausahaan, kreativitas, dan pertumbuhan ekonomi.',
  },
  {
    name: 'Putih',
    swatchClass: 'bg-white border border-[#CBD5E1]',
    meaning: 'Keterbukaan, kemudahan, dan transparansi.',
  },
];

const MISSION_ITEMS = [
  {
    title: 'Digitalisasi UMKM',
    description:
      'Membantu pelaku UMKM Cisaga memperkenalkan dan memasarkan produk melalui platform digital.',
  },
  {
    title: 'Promosi Produk Lokal',
    description:
      'Menyediakan wadah promosi untuk memperkenalkan produk unggulan masyarakat Kecamatan Cisaga.',
  },
  {
    title: 'Memperluas Jangkauan Pasar',
    description:
      'Menghubungkan pelaku usaha dengan konsumen dari berbagai wilayah melalui teknologi digital.',
  },
  {
    title: 'Mendukung Ekonomi Lokal',
    description:
      'Mendorong pertumbuhan usaha masyarakat di sektor pertanian, peternakan, kuliner, perdagangan, dan industri kreatif.',
  },
  {
    title: 'Membangun Ekosistem UMKM',
    description:
      'Menciptakan ruang kolaborasi antara pelaku usaha, konsumen, komunitas, dan pihak terkait.',
  },
];

const BRAND_IDENTITY_ROWS = [
  { label: 'Nama', value: 'Cisaga Hub' },
  { label: 'Kategori', value: 'Digital UMKM Ecosystem' },
  { label: 'Fokus', value: 'UMKM Kecamatan Cisaga' },
  { label: 'Konsep', value: 'Local Business, Digital Innovation' },
  { label: 'Slogan', value: 'Dukung UMKM Cisaga, Go Digital Bersama' },
  { label: 'Nilai Utama', value: 'Konektivitas, inovasi, pemberdayaan, kolaborasi' },
];

export function AboutCisagaHubSection() {
  return (
    <section
      id="tentang"
      className="scroll-mt-16 py-14 sm:py-20 bg-white border-b border-[#E2E8F0]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-12">
        {/* Header & Logo Showcase + Meaning of Name & Slogan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-12 border-b border-[#E2E8F0]">
          <div className="lg:col-span-5">
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 sm:p-6">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-center">
                <img
                  src={CISAGA_HUB_LOGO_PATH}
                  alt="Logo Resmi CISAGA HUB — Dukung UMKM Cisaga, Go Digital Bersama"
                  className="w-full max-w-[360px] h-auto object-contain"
                />
              </div>
              <div className="mt-4 pt-4 border-t border-[#E2E8F0] text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
                  Filosofi Slogan
                </p>
                <p className="font-display text-base sm:text-lg font-bold text-[#0F2744] mt-1">
                  &ldquo;Dukung UMKM Cisaga, Go Digital Bersama.&rdquo;
                </p>
                <p className="text-xs text-[#475569] leading-relaxed mt-1.5">
                  Mengajak masyarakat bersama-sama mendukung perkembangan usaha lokal melalui
                  teknologi digital sebagai jembatan antara pelaku usaha dan konsumen.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div>
              <p className="text-xs font-semibold tracking-wide text-[#EA580C] mb-2">
                Tentang CISAGA HUB · Filosofi &amp; Makna Logo
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2744] tracking-tight leading-snug mb-3">
                Pusat Penghubung Potensi &amp; Pelaku UMKM Kecamatan Cisaga
              </h2>
              <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
                Cisaga Hub merupakan platform digital yang hadir sebagai pusat informasi, promosi,
                dan pengembangan Usaha Mikro, Kecil, dan Menengah (UMKM) di Kecamatan Cisaga,
                Kabupaten Ciamis. Nama Cisaga Hub merepresentasikan semangat untuk menghubungkan
                potensi lokal dengan perkembangan teknologi digital agar produk dan usaha
                masyarakat Cisaga memiliki kesempatan lebih luas untuk dikenal.
              </p>
            </div>

            {/* Makna Nama CISAGA HUB */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-3">
              <h3 className="font-display text-base font-bold text-[#0F2744]">
                Makna Nama CISAGA HUB
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
                  <p className="font-mono text-xs font-bold text-[#0F2744] mb-1">CISAGA</p>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Identitas wilayah dan representasi seluruh potensi masyarakat Kecamatan Cisaga.
                  </p>
                </div>
                <div className="bg-white border border-[#E2E8F0] rounded-lg p-3.5">
                  <p className="font-mono text-xs font-bold text-[#C2410C] mb-1">HUB</p>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    Pusat penghubung atau pusat ekosistem yang mempertemukan berbagai pihak dalam
                    satu wadah.
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#0F2744]">
                Makna utuh:{' '}
                <span className="text-[#475569] font-normal">
                  Pusat penghubung potensi dan pelaku UMKM Kecamatan Cisaga melalui pemanfaatan
                  teknologi digital.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* 1. Filosofi 6 Unsur Logo */}
        <div className="space-y-6">
          <div className="max-w-[68ch]">
            <p className="text-xs font-semibold text-[#C2410C] mb-1">1. Filosofi Logo</p>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F2744] tracking-tight">
              Sinergi Potensi Alam, Ekonomi Masyarakat &amp; Teknologi Digital
            </h3>
            <p className="text-sm text-[#475569] mt-1.5 leading-relaxed">
              Logo Cisaga Hub menggabungkan unsur potensi alam, kegiatan ekonomi masyarakat, dan
              teknologi digital sebagai identitas daerah yang terus berkembang.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {LOGO_PHILOSOPHY_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.code}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg inline-flex items-center justify-center ${item.accentClass}`}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#64748B]">
                      Unsur {item.code}
                    </span>
                  </div>
                  <h4 className="font-display text-base font-bold text-[#0F2744]">{item.title}</h4>
                  <p className="text-sm text-[#475569] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Makna Warna + 6. Identitas Utama Brand */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#C2410C]" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-[#0F2744]">2. Makna Warna</h3>
            </div>
            <div className="divide-y divide-[#E2E8F0] bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              {COLOR_MEANINGS.map((color) => (
                <div key={color.name} className="px-4 py-3 flex items-start gap-3.5">
                  <span
                    className={`w-5 h-5 rounded-md shrink-0 mt-0.5 ${color.swatchClass}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F2744]">{color.name}</p>
                    <p className="text-xs sm:text-sm text-[#475569]">{color.meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#0F2744]" aria-hidden="true" />
              <h3 className="font-display text-lg font-bold text-[#0F2744]">
                Identitas Utama Brand
              </h3>
            </div>
            <div className="divide-y divide-[#E2E8F0] bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
              {BRAND_IDENTITY_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    {row.label}
                  </span>
                  <span className="text-sm font-medium text-[#0F2744] sm:text-right">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Visi & Misi */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 bg-[#0F2744] text-white rounded-xl p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FDBA74] mb-2">
                Visi CISAGA HUB
              </p>
              <h3 className="font-display text-xl font-bold mb-4 leading-snug">
                Ekosistem Digital UMKM Kecamatan Cisaga yang Inovatif &amp; Berkelanjutan
              </h3>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Menjadi pusat ekosistem digital UMKM Kecamatan Cisaga yang inovatif, inklusif, dan
                berkelanjutan dalam mendorong pertumbuhan ekonomi lokal serta memperluas jangkauan
                pasar produk unggulan daerah.
              </p>
            </div>
            <p className="text-xs text-[#FDBA74] font-medium pt-6 mt-6 border-t border-white/15">
              Dukung UMKM Cisaga, Go Digital Bersama.
            </p>
          </div>

          <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 sm:p-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
              Misi CISAGA HUB
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {MISSION_ITEMS.map((mission, idx) => (
                <div
                  key={mission.title}
                  className={`bg-white border border-[#E2E8F0] rounded-lg p-4 space-y-1.5 ${
                    idx === MISSION_ITEMS.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" aria-hidden="true" />
                    <h4 className="text-sm font-bold text-[#0F2744]">{mission.title}</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kesimpulan Filosofis */}
        <div className="bg-[#FFF7ED] border border-[#FDBA74]/60 rounded-xl p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#EA580C] text-white inline-flex items-center justify-center shrink-0">
            <Quote className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#C2410C]">
              Kesimpulan Filosofis
            </p>
            <p className="text-sm sm:text-base text-[#0F2744] leading-relaxed">
              Cisaga Hub membawa gagasan bahwa setiap potensi lokal memiliki peluang untuk
              berkembang ketika dipertemukan dengan teknologi. Dari hasil pertanian, peternakan,
              hingga produk kuliner masyarakat, semuanya memiliki tempat untuk dikenal,
              dipromosikan, dan berkembang melalui satu ekosistem digital.
            </p>
            <p className="font-display text-sm sm:text-base font-bold text-[#0F2744]">
              Cisaga Hub — Menghubungkan Potensi Lokal, Membangun Ekonomi Digital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
