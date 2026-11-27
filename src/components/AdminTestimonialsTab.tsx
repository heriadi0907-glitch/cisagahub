import { Eye, EyeOff, MessageSquareQuote, Plus, Star, Trash2, X } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import type {
  CustomerTestimonial,
  CustomerTestimonialFormData,
  UmkmListing,
} from '../types/umkm';
import { getTestimonialStats, validateTestimonialForm } from '../utils/umkmLogic';

interface AdminTestimonialsTabProps {
  listings: UmkmListing[];
  testimonials: CustomerTestimonial[];
  onCreateTestimonial: (data: CustomerTestimonialFormData) => Promise<void>;
  onTogglePublish: (id: string) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
}

const createInitialTestimonialForm = (listings: UmkmListing[]): CustomerTestimonialFormData => ({
  customerName: '',
  customerRole: '',
  umkmId: listings[0]?.id ?? '',
  productPurchased: listings[0]?.productName ?? '',
  rating: 5,
  quote: '',
  isPublished: true,
});

export function AdminTestimonialsTab({
  listings,
  testimonials,
  onCreateTestimonial,
  onTogglePublish,
  onDeleteTestimonial,
}: AdminTestimonialsTabProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<CustomerTestimonialFormData>(() =>
    createInitialTestimonialForm(listings)
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof CustomerTestimonialFormData, string>>
  >({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const stats = useMemo(() => getTestimonialStats(testimonials), [testimonials]);

  const handleOpenForm = () => {
    setForm(createInitialTestimonialForm(listings));
    setErrors({});
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const handleSelectUmkm = (nextUmkmId: string) => {
    const matched = listings.find((item) => item.id === nextUmkmId);
    setForm((prev) => ({
      ...prev,
      umkmId: nextUmkmId,
      productPurchased:
        prev.productPurchased.trim() === '' ||
        listings.some((l) => l.productName === prev.productPurchased)
          ? (matched?.productName ?? '')
          : prev.productPurchased,
    }));
    setErrors((prev) => ({ ...prev, umkmId: undefined }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateTestimonialForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    setSubmitError(null);
    try {
      await onCreateTestimonial(form);
      setIsFormOpen(false);
      setForm(createInitialTestimonialForm(listings));
      setErrors({});
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Gagal menyimpan testimoni pelanggan.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div data-testid="admin-testimonials-view" className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs text-[#475569] mb-1">Total Testimoni</p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-[#0F2744]">
            {stats.total}
          </p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs text-[#475569] mb-1">Tayang di Beranda</p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-[#047857]">
            {stats.publishedCount}
          </p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs text-[#475569] mb-1">Disembunyikan</p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-[#475569]">
            {stats.total - stats.publishedCount}
          </p>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5">
          <p className="text-xs text-[#475569] mb-1">Rata-Rata Rating</p>
          <p className="font-mono tabular-nums text-2xl font-semibold text-[#EA580C]">
            {stats.publishedCount > 0 ? `${stats.averageRating.toFixed(1)} / 5.0` : '0.0'}
          </p>
        </div>
      </div>

      {/* Header + Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E2E8F0] rounded-xl p-5">
        <div>
          <h2 className="font-display text-lg font-bold text-[#0F2744]">
            Kelola Testimoni Pelanggan
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-0.5">
            Tambahkan ulasan pembeli untuk ditampilkan di bagian Testimoni Pelanggan pada beranda
            CISAGA HUB.
          </p>
        </div>
        <button
          type="button"
          data-testid="admin-add-testimonial-btn"
          onClick={handleOpenForm}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {/* Add Testimonial Form */}
      {isFormOpen && (
        <div
          data-testid="admin-testimonial-form-panel"
          className="bg-white border border-[#0F2744] rounded-xl p-6 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4 pb-4 mb-5 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-display text-xl font-bold text-[#0F2744]">
                Tambah Ulasan Pembeli Baru
              </h3>
              <p className="text-xs text-[#475569] mt-0.5">
                Pilih UMKM terdaftar lalu masukkan ulasan pelanggan sebagai social proof.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              aria-label="Tutup formulir testimoni"
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#0F2744] cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <form
            data-testid="admin-testimonial-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            {submitError && (
              <div
                role="alert"
                className="p-3 rounded-lg bg-[#B91C1C]/5 border border-[#B91C1C]/30 text-xs font-medium text-[#B91C1C]"
              >
                {submitError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="testi-umkm-id"
                  className="block text-xs font-semibold text-[#0F2744] mb-1.5"
                >
                  UMKM Terdaftar *
                </label>
                <select
                  id="testi-umkm-id"
                  value={form.umkmId}
                  onChange={(e) => handleSelectUmkm(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
                >
                  <option value="">Pilih UMKM...</option>
                  {listings.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.businessName} — {item.village}
                    </option>
                  ))}
                </select>
                {errors.umkmId && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.umkmId}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="testi-product"
                  className="block text-xs font-semibold text-[#0F2744] mb-1.5"
                >
                  Produk yang Dibeli (Opsional)
                </label>
                <input
                  id="testi-product"
                  type="text"
                  maxLength={120}
                  value={form.productPurchased}
                  onChange={(e) => setForm({ ...form, productPurchased: e.target.value })}
                  placeholder="Contoh: Gula Aren Semut 500g"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
                />
              </div>

              <div>
                <label
                  htmlFor="testi-customer-name"
                  className="block text-xs font-semibold text-[#0F2744] mb-1.5"
                >
                  Nama Pembeli *
                </label>
                <input
                  id="testi-customer-name"
                  type="text"
                  maxLength={80}
                  value={form.customerName}
                  onChange={(e) => {
                    setForm({ ...form, customerName: e.target.value });
                    setErrors((prev) => ({ ...prev, customerName: undefined }));
                  }}
                  placeholder="Contoh: Rizky Pratama"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
                />
                {errors.customerName && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="testi-customer-role"
                  className="block text-xs font-semibold text-[#0F2744] mb-1.5"
                >
                  Keterangan / Asal Pembeli *
                </label>
                <input
                  id="testi-customer-role"
                  type="text"
                  maxLength={80}
                  value={form.customerRole}
                  onChange={(e) => {
                    setForm({ ...form, customerRole: e.target.value });
                    setErrors((prev) => ({ ...prev, customerRole: undefined }));
                  }}
                  placeholder="Contoh: Pelanggan Oleh-Oleh · Ciamis"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
                />
                {errors.customerRole && (
                  <p className="text-xs text-[#B91C1C] mt-1">{errors.customerRole}</p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-semibold text-[#0F2744] mb-1.5">
                Rating Bintang *
              </span>
              <div className="inline-flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const active = starValue <= form.rating;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, rating: starValue });
                        setErrors((prev) => ({ ...prev, rating: undefined }));
                      }}
                      aria-label={`Beri ${starValue} bintang`}
                      className="p-1.5 rounded-md border border-[#E2E8F0] hover:border-[#EA580C] transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          active ? 'text-[#EA580C] fill-[#EA580C]' : 'text-[#CBD5E1]'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  );
                })}
                <span className="ml-2 font-mono text-xs font-semibold text-[#0F2744]">
                  {form.rating} / 5
                </span>
              </div>
              {errors.rating && <p className="text-xs text-[#B91C1C] mt-1">{errors.rating}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="testi-quote"
                  className="block text-xs font-semibold text-[#0F2744]"
                >
                  Isi Ulasan / Testimoni *
                </label>
                <span className="font-mono text-[11px] text-[#64748B]">
                  {form.quote.length}/600
                </span>
              </div>
              <textarea
                id="testi-quote"
                rows={3}
                maxLength={600}
                value={form.quote}
                onChange={(e) => {
                  setForm({ ...form, quote: e.target.value });
                  setErrors((prev) => ({ ...prev, quote: undefined }));
                }}
                placeholder="Tuliskan ulasan asli pembeli tentang kualitas produk atau pelayanan UMKM..."
                className="w-full px-3 py-2.5 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
              />
              {errors.quote && <p className="text-xs text-[#B91C1C] mt-1">{errors.quote}</p>}
            </div>

            <label className="inline-flex items-center gap-2.5 text-sm text-[#0F2744] cursor-pointer">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                className="w-4 h-4 accent-[#0F2744] rounded"
              />
              <span>Tampilkan langsung di halaman beranda (Testimoni Pelanggan)</span>
            </label>

            <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#0F2744] hover:bg-[#0B1E36] disabled:opacity-60 rounded-lg cursor-pointer"
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Testimoni'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div
        data-testid="admin-testimonials-list"
        className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden"
      >
        {testimonials.length === 0 ? (
          <div className="p-10 text-center space-y-3">
            <MessageSquareQuote className="w-8 h-8 text-[#94A3B8] mx-auto" aria-hidden="true" />
            <p className="font-display text-lg font-bold text-[#0F2744]">
              Belum ada testimoni pelanggan
            </p>
            <p className="text-sm text-[#475569]">
              Tambahkan ulasan pembeli pertama untuk memperkuat kepercayaan pengunjung pada UMKM
              Cisaga.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E2E8F0]">
            {testimonials.map((item) => (
              <div
                key={item.id}
                data-testid={`admin-testimonial-row-${item.id}`}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F8FAFC]/70 transition-colors"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-semibold text-sm text-[#0F2744]">
                      {item.customerName}
                    </span>
                    <span className="text-xs text-[#64748B]">({item.customerRole})</span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        item.isPublished
                          ? 'bg-[#047857]/10 text-[#047857]'
                          : 'bg-[#E2E8F0] text-[#475569]'
                      }`}
                    >
                      {item.isPublished ? 'Tayang di Beranda' : 'Disembunyikan'}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-0.5 text-[#EA580C]">
                      {Array.from({ length: 5 }, (_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3.5 h-3.5 ${
                            idx < item.rating ? 'fill-[#EA580C] text-[#EA580C]' : 'text-[#CBD5E1]'
                          }`}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                    <span className="font-semibold text-[#0F2744]">UMKM: {item.umkmName}</span>
                    {item.productPurchased && (
                      <span className="text-[#64748B]">· {item.productPurchased}</span>
                    )}
                    <span className="font-mono text-[11px] text-[#94A3B8]">{item.createdAt}</span>
                  </div>

                  <p className="text-sm text-[#475569] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => void onTogglePublish(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2744] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-md cursor-pointer"
                  >
                    {item.isPublished ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Sembunyikan</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Tayangkan</span>
                      </>
                    )}
                  </button>

                  {confirmDeleteId === item.id ? (
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          void onDeleteTestimonial(item.id);
                          setConfirmDeleteId(null);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded-md cursor-pointer"
                      >
                        Konfirmasi Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1.5 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded-md cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(item.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] bg-[#B91C1C]/5 hover:bg-[#B91C1C]/10 border border-[#B91C1C]/30 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
