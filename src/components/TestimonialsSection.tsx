import { ArrowUpRight, MessageSquareQuote, Star } from 'lucide-react';
import { useMemo } from 'react';
import type { CustomerTestimonial } from '../types/umkm';
import { getTestimonialStats } from '../utils/umkmLogic';

interface TestimonialsSectionProps {
  testimonials: CustomerTestimonial[];
  onSelectUmkmById?: (umkmId: string) => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'P';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function TestimonialsSection({
  testimonials,
  onSelectUmkmById,
}: TestimonialsSectionProps) {
  const published = useMemo(
    () => testimonials.filter((item) => item.isPublished),
    [testimonials]
  );
  const stats = useMemo(() => getTestimonialStats(published), [published]);

  if (published.length === 0) {
    return null;
  }

  return (
    <section
      id="testimoni"
      data-testid="testimonials-section"
      className="scroll-mt-14 py-7 sm:py-9 bg-[#F8FAFC] border-b border-[#E2E8F0]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-[60ch]">
            <p className="text-xs font-semibold tracking-wide text-[#C2410C] mb-1">
              Testimoni Pelanggan · Social Proof UMKM Cisaga
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2744] tracking-tight leading-snug mb-1.5">
              Apa Kata Pembeli Tentang UMKM Terdaftar
            </h2>
            <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
              Pengalaman nyata pelanggan, instansi, dan mitra reseller yang telah bertransaksi
              langsung dengan pelaku usaha lokal Kecamatan Cisaga.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-3 flex items-center gap-3.5 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#EA580C]/10 text-[#EA580C] flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-[#EA580C]" aria-hidden="true" />
            </div>
            <div>
              <p className="font-mono tabular-nums text-xl font-bold text-[#0F2744]">
                {stats.averageRating.toFixed(1)}{' '}
                <span className="text-xs font-normal text-[#64748B]">/ 5.0</span>
              </p>
              <p className="text-xs text-[#475569]">
                Berdasarkan{' '}
                <span className="font-semibold text-[#0F2744]">{stats.publishedCount}</span>{' '}
                ulasan terkurasi
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {published.map((item) => (
            <article
              key={item.id}
              data-testid={`testimonial-card-${item.id}`}
              className="bg-white border border-[#E2E8F0] rounded-xl p-4 sm:p-5 flex flex-col justify-between gap-3.5"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="inline-flex items-center gap-1"
                    aria-label={`Rating ${item.rating} dari 5 bintang`}
                  >
                    {Array.from({ length: 5 }, (_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < item.rating
                            ? 'text-[#EA580C] fill-[#EA580C]'
                            : 'text-[#CBD5E1]'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <MessageSquareQuote
                    className="w-5 h-5 text-[#94A3B8] shrink-0"
                    aria-hidden="true"
                  />
                </div>

                <p className="text-sm sm:text-[15px] text-[#0F2744] leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="space-y-3 pt-2.5 border-t border-[#E2E8F0]">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-[#64748B]">UMKM Diulas</p>
                    <p className="text-xs font-semibold text-[#0F2744] truncate">
                      {item.umkmName}
                    </p>
                    {item.productPurchased && (
                      <p className="text-[11px] text-[#475569] truncate">
                        Produk: {item.productPurchased}
                      </p>
                    )}
                  </div>
                  {onSelectUmkmById && (
                    <button
                      type="button"
                      onClick={() => onSelectUmkmById(item.umkmId)}
                      aria-label={`Lihat detail ${item.umkmName}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Lihat</span>
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full bg-[#0F2744] text-white text-xs font-bold flex items-center justify-center shrink-0"
                      aria-hidden="true"
                    >
                      {getInitials(item.customerName)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#0F2744] truncate">
                        {item.customerName}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">{item.customerRole}</p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-[#94A3B8] shrink-0">
                    {item.createdAt}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
