import { UMKM_IMAGE_PRESETS } from '../data/cisagaData';
import type {
  AdminUmkmFormData,
  BusinessCategory,
  ContactMessage,
  ContactMessageFormData,
  ContactTopic,
  CustomerTestimonial,
  CustomerTestimonialFormData,
  FreeRegistrationFormData,
  ProductCategory,
  PromoInquiryFormData,
  SavedPromoItem,
  SortOption,
  UmkmListing,
  UmkmTier,
} from '../types/umkm';

export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  return `Rp${rounded.toLocaleString('id-ID')}`;
}

export function getStartingPrice(listing: UmkmListing): number {
  if (listing.variants.length === 0) return listing.price;
  return Math.min(...listing.variants.map((v) => v.price));
}

export function isSafeUmkmImagePath(url: string): boolean {
  const trimmed = url.trim();
  if (trimmed === '') return false;
  if (UMKM_IMAGE_PRESETS.some((p) => p.url === trimmed)) return true;
  return /^\/uploads\/umkm-[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(trimmed);
}

export function getListingAllImages(listing: UmkmListing): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  const pushIfUnique = (img?: string) => {
    const trimmed = (img ?? '').trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    result.push(trimmed);
  };

  pushIfUnique(listing.image);
  for (const img of listing.galleryImages ?? []) {
    pushIfUnique(img);
  }
  for (const variant of listing.variants) {
    pushIfUnique(variant.image);
  }
  return result;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  let normalized = digits;
  if (digits.startsWith('0')) {
    normalized = `62${digits.slice(1)}`;
  } else if (digits.startsWith('8')) {
    normalized = `62${digits}`;
  }
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}

export function getPremiumTopListings(listings: UmkmListing[]): UmkmListing[] {
  return listings.filter((item) => item.status === 'Aktif' && item.tier === 'premium');
}

export interface ListingFilterParams {
  category: ProductCategory;
  tierFilter: 'all' | UmkmTier;
  village: string;
  query: string;
  sortBy: SortOption;
  includeUnverified?: boolean;
}

function getListingQueryMatchRank(item: UmkmListing, normalizedQuery: string): number {
  const productLower = item.productName.toLowerCase();
  const businessLower = item.businessName.toLowerCase();
  if (productLower.startsWith(normalizedQuery)) return 0;
  if (businessLower.startsWith(normalizedQuery)) return 1;
  if (productLower.includes(normalizedQuery)) return 2;
  if (businessLower.includes(normalizedQuery)) return 3;
  if (item.variants.some((v) => v.label.toLowerCase().includes(normalizedQuery))) return 4;
  if (item.village.toLowerCase().includes(normalizedQuery)) return 5;
  if (item.ownerName.toLowerCase().includes(normalizedQuery)) return 6;
  return 7;
}

export function filterAndSortListings(
  listings: UmkmListing[],
  params: ListingFilterParams
): UmkmListing[] {
  const normalizedQuery = params.query.trim().toLowerCase();

  const filtered = listings.filter((item) => {
    if (!params.includeUnverified && item.status !== 'Aktif') {
      return false;
    }

    const matchesCategory =
      params.category === 'Semua' || item.category === params.category;
    const matchesTier = params.tierFilter === 'all' || item.tier === params.tierFilter;
    const matchesVillage =
      params.village === 'Semua Desa' || item.village === params.village;
    const matchesQuery =
      normalizedQuery === '' ||
      item.productName.toLowerCase().includes(normalizedQuery) ||
      item.businessName.toLowerCase().includes(normalizedQuery) ||
      item.ownerName.toLowerCase().includes(normalizedQuery) ||
      item.village.toLowerCase().includes(normalizedQuery) ||
      item.shortDescription.toLowerCase().includes(normalizedQuery) ||
      item.variants.some((v) => v.label.toLowerCase().includes(normalizedQuery));

    return matchesCategory && matchesTier && matchesVillage && matchesQuery;
  });

  if (params.sortBy === 'price-asc') {
    return [...filtered].sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
  }
  if (params.sortBy === 'price-desc') {
    return [...filtered].sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
  }

  // Default 'featured' sort: when searching, rank strong product/business matches first (tier breaks ties);
  // when query is empty, Premium always appears first, Reguler after.
  return [...filtered].sort((a, b) => {
    if (normalizedQuery !== '') {
      const rankDiff =
        getListingQueryMatchRank(a, normalizedQuery) -
        getListingQueryMatchRank(b, normalizedQuery);
      if (rankDiff !== 0) return rankDiff;
    }
    if (a.tier === b.tier) return 0;
    return a.tier === 'premium' ? -1 : 1;
  });
}

export function isListingSaved(
  savedItems: SavedPromoItem[],
  listingId: string,
  variantId?: string
): boolean {
  if (variantId) {
    return savedItems.some(
      (item) => item.listingId === listingId && item.variantId === variantId
    );
  }
  return savedItems.some((item) => item.listingId === listingId);
}

export function saveListingToPromo(
  savedItems: SavedPromoItem[],
  listing: UmkmListing,
  variantId?: string
): SavedPromoItem[] {
  const variant =
    (variantId ? listing.variants.find((v) => v.id === variantId) : undefined) ??
    listing.variants[0];

  const resolvedVariantId = variant?.id ?? `${listing.id}-default`;
  const resolvedLabel = variant?.label ?? listing.unitLabel;
  const resolvedPrice = variant?.price ?? listing.price;

  const exists = savedItems.some(
    (item) => item.listingId === listing.id && item.variantId === resolvedVariantId
  );
  if (exists) return savedItems;

  return [
    ...savedItems,
    {
      listingId: listing.id,
      variantId: resolvedVariantId,
      productName: listing.productName,
      variantLabel: resolvedLabel,
      businessName: listing.businessName,
      whatsapp: listing.whatsapp,
      village: listing.village,
      tier: listing.tier,
      estimatedPrice: resolvedPrice,
      image: listing.image,
    },
  ];
}

export function toggleQuickSaveListing(
  savedItems: SavedPromoItem[],
  listing: UmkmListing
): SavedPromoItem[] {
  if (isListingSaved(savedItems, listing.id)) {
    return savedItems.filter((item) => item.listingId !== listing.id);
  }
  return saveListingToPromo(savedItems, listing);
}

export function removeSavedPromoItem(
  savedItems: SavedPromoItem[],
  listingId: string,
  variantId: string
): SavedPromoItem[] {
  return savedItems.filter(
    (item) => !(item.listingId === listingId && item.variantId === variantId)
  );
}

export function isValidIndonesianPhone(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, '');
  return (
    digits.length >= 10 &&
    digits.length <= 15 &&
    (digits.startsWith('08') || digits.startsWith('62'))
  );
}

export function validatePromoInquiryForm(
  form: PromoInquiryFormData
): Partial<Record<keyof PromoInquiryFormData, string>> {
  const errors: Partial<Record<keyof PromoInquiryFormData, string>> = {};

  if (form.requesterName.trim().length < 3) {
    errors.requesterName = 'Nama lengkap minimal 3 karakter.';
  }
  if (!isValidIndonesianPhone(form.whatsapp)) {
    errors.whatsapp = 'Masukkan nomor WhatsApp aktif (contoh: 081234567890).';
  }
  if (form.organizationOrAddress.trim().length < 4) {
    errors.organizationOrAddress = 'Tuliskan nama instansi, usaha, atau wilayah Anda.';
  }

  return errors;
}

export function validateFreeRegistrationForm(
  form: FreeRegistrationFormData
): Partial<Record<keyof FreeRegistrationFormData, string>> {
  const errors: Partial<Record<keyof FreeRegistrationFormData, string>> = {};

  if (form.businessName.trim().length < 3) {
    errors.businessName = 'Nama usaha minimal 3 karakter.';
  }
  if (form.ownerName.trim().length < 3) {
    errors.ownerName = 'Nama pemilik minimal 3 karakter.';
  }
  if (form.village.trim() === '') {
    errors.village = 'Pilih desa asal di Kecamatan Cisaga.';
  }
  if (!isValidIndonesianPhone(form.whatsapp)) {
    errors.whatsapp = 'Masukkan nomor WhatsApp aktif (contoh: 081234567890).';
  }
  if (form.signatureProduct.trim().length < 4) {
    errors.signatureProduct = 'Sebutkan minimal satu produk unggulan usaha Anda.';
  }
  const parsedPrice = Number(form.estimatedPrice);
  if (Number.isNaN(parsedPrice) || parsedPrice < 1000) {
    errors.estimatedPrice = 'Masukkan kisaran harga mulai (minimal Rp1.000).';
  }

  return errors;
}

export function validateAdminUmkmForm(
  form: AdminUmkmFormData
): Partial<Record<keyof AdminUmkmFormData, string>> {
  const errors: Partial<Record<keyof AdminUmkmFormData, string>> = {};

  if (form.businessName.trim().length < 3) {
    errors.businessName = 'Nama usaha minimal 3 karakter.';
  }
  if (form.ownerName.trim().length < 3) {
    errors.ownerName = 'Nama pemilik minimal 3 karakter.';
  }
  if (form.productName.trim().length < 3) {
    errors.productName = 'Nama produk unggulan minimal 3 karakter.';
  }
  if (form.village.trim() === '') {
    errors.village = 'Pilih desa asal di Kecamatan Cisaga.';
  }
  if (!isValidIndonesianPhone(form.whatsapp)) {
    errors.whatsapp = 'Masukkan nomor WhatsApp aktif (contoh: 081234567890).';
  }
  const parsedPrice = Number(form.price);
  if (Number.isNaN(parsedPrice) || parsedPrice < 1000) {
    errors.price = 'Harga kisaran minimal Rp1.000.';
  }
  if (form.shortDescription.trim().length < 10) {
    errors.shortDescription = 'Deskripsi singkat minimal 10 karakter.';
  }

  if (form.variants && form.variants.length > 0) {
    for (const item of form.variants) {
      if (item.label.trim().length < 2) {
        errors.variants = 'Setiap nama menu atau layanan minimal 2 karakter.';
        break;
      }
      const itemPrice = Number(item.price);
      if (Number.isNaN(itemPrice) || itemPrice < 1000) {
        errors.variants = 'Setiap harga menu atau layanan minimal Rp1.000.';
        break;
      }
    }
  }

  return errors;
}

function getDefaultImageForCategory(category: BusinessCategory): string {
  switch (category) {
    case 'Agribisnis':
      return UMKM_IMAGE_PRESETS[0].url;
    case 'Kuliner':
      return UMKM_IMAGE_PRESETS[1].url;
    case 'Kerajinan':
      return UMKM_IMAGE_PRESETS[2].url;
    case 'Busana':
      return UMKM_IMAGE_PRESETS[3].url;
    default:
      return UMKM_IMAGE_PRESETS[5].url;
  }
}

export function createFreeListingEntry(form: FreeRegistrationFormData): UmkmListing {
  const id = `umkm-free-${Date.now()}`;
  const price = Math.round(Number(form.estimatedPrice));
  const productName = form.signatureProduct.trim();
  return {
    id,
    businessName: form.businessName.trim(),
    ownerName: form.ownerName.trim(),
    productName,
    category: form.category,
    village: form.village,
    whatsapp: form.whatsapp.replace(/[^0-9]/g, ''),
    tier: 'reguler',
    status: 'Menunggu Verifikasi',
    price,
    unitLabel: 'Kemasan Standar',
    shortDescription: `Produk lokal ${form.village} dari ${form.businessName.trim()} kategori ${form.category}.`,
    fullDescription: `${productName} diproduksi langsung oleh ${form.businessName.trim()} (${form.ownerName.trim()}) di ${form.village}, Kecamatan Cisaga.`,
    image: getDefaultImageForCategory(form.category),
    createdAt: new Date().toISOString().slice(0, 10),
    variants: [
      {
        id: `${id}-std`,
        label: 'Kemasan Standar',
        price,
        availabilityNote: 'Terdaftar Gratis',
      },
    ],
  };
}

function buildNormalizedVariantsFromForm(
  baseId: string,
  form: AdminUmkmFormData,
  fallbackPrice: number,
  fallbackUnitLabel: string
) {
  if (form.variants && form.variants.length > 0) {
    return form.variants.map((item, idx) => {
      const parsedItemPrice = Math.round(Number(item.price));
      const safeImage = item.image && isSafeUmkmImagePath(item.image) ? item.image.trim() : undefined;
      return {
        id: item.id && item.id.trim().length > 0 ? item.id.trim() : `${baseId}-v${idx + 1}`,
        label: item.label.trim(),
        price: Number.isFinite(parsedItemPrice) && parsedItemPrice >= 1000 ? parsedItemPrice : fallbackPrice,
        availabilityNote: item.availabilityNote.trim() || 'Tersedia',
        ...(safeImage ? { image: safeImage } : {}),
      };
    });
  }

  return [
    {
      id: `${baseId}-v1`,
      label: fallbackUnitLabel,
      price: fallbackPrice,
      availabilityNote: form.tier === 'premium' ? 'Mitra Premium' : 'Siap Dipromosikan',
    },
  ];
}

function normalizeGalleryImages(galleryImages: string[] | undefined, primaryImage: string): string[] {
  if (!Array.isArray(galleryImages)) return [];
  const seen = new Set<string>([primaryImage]);
  const cleaned: string[] = [];
  for (const raw of galleryImages) {
    const trimmed = typeof raw === 'string' ? raw.trim() : '';
    if (!trimmed || seen.has(trimmed) || !isSafeUmkmImagePath(trimmed)) continue;
    seen.add(trimmed);
    cleaned.push(trimmed);
    if (cleaned.length >= 6) break;
  }
  return cleaned;
}

export function createAdminListingEntry(form: AdminUmkmFormData): UmkmListing {
  const id = `umkm-adm-${Date.now()}`;
  const price = Math.round(Number(form.price));
  const unitLabel = form.unitLabel.trim() || 'Kemasan Standar';
  const shortDesc = form.shortDescription.trim();
  const primaryImage = isSafeUmkmImagePath(form.image)
    ? form.image.trim()
    : getDefaultImageForCategory(form.category);
  const variants = buildNormalizedVariantsFromForm(id, form, price, unitLabel);
  const galleryImages = normalizeGalleryImages(form.galleryImages, primaryImage);

  return {
    id,
    businessName: form.businessName.trim(),
    ownerName: form.ownerName.trim(),
    productName: form.productName.trim(),
    category: form.category,
    village: form.village,
    whatsapp: form.whatsapp.replace(/[^0-9]/g, ''),
    tier: form.tier,
    status: form.status,
    price: variants[0]?.price ?? price,
    unitLabel: variants[0]?.label ?? unitLabel,
    shortDescription: shortDesc,
    fullDescription: `${shortDesc} Dikelola oleh ${form.businessName.trim()} (${form.ownerName.trim()}) di ${form.village}, Kecamatan Cisaga.`,
    image: primaryImage,
    ...(galleryImages.length > 0 ? { galleryImages } : {}),
    createdAt: new Date().toISOString().slice(0, 10),
    variants,
  };
}

export function updateAdminListingEntry(
  existing: UmkmListing,
  form: AdminUmkmFormData
): UmkmListing {
  const price = Math.round(Number(form.price));
  const unitLabel = form.unitLabel.trim() || existing.unitLabel;
  const shortDesc = form.shortDescription.trim();
  const primaryImage = isSafeUmkmImagePath(form.image) ? form.image.trim() : existing.image;
  const variants =
    form.variants && form.variants.length > 0
      ? buildNormalizedVariantsFromForm(existing.id, form, price, unitLabel)
      : existing.variants.map((v, idx) =>
          idx === 0 ? { ...v, label: unitLabel, price } : v
        );
  const galleryImages = normalizeGalleryImages(form.galleryImages, primaryImage);

  return {
    ...existing,
    businessName: form.businessName.trim(),
    ownerName: form.ownerName.trim(),
    productName: form.productName.trim(),
    category: form.category,
    village: form.village,
    whatsapp: form.whatsapp.replace(/[^0-9]/g, ''),
    tier: form.tier,
    status: form.status,
    price: variants[0]?.price ?? price,
    unitLabel: variants[0]?.label ?? unitLabel,
    shortDescription: shortDesc,
    fullDescription: `${shortDesc} Dikelola oleh ${form.businessName.trim()} (${form.ownerName.trim()}) di ${form.village}, Kecamatan Cisaga.`,
    image: primaryImage,
    galleryImages,
    variants,
  };
}

export function toggleListingTier(listings: UmkmListing[], id: string): UmkmListing[] {
  return listings.map((item) =>
    item.id === id
      ? { ...item, tier: item.tier === 'premium' ? 'reguler' : 'premium' }
      : item
  );
}

export function cycleListingStatus(listings: UmkmListing[], id: string): UmkmListing[] {
  return listings.map((item) => {
    if (item.id !== id) return item;
    const nextStatus = item.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    return { ...item, status: nextStatus };
  });
}

export function deleteListingById(listings: UmkmListing[], id: string): UmkmListing[] {
  return listings.filter((item) => item.id !== id);
}

export function generateInquiryCode(
  seedNumber = Math.floor(1000 + Math.random() * 9000)
): string {
  return `PRM-${seedNumber}`;
}

export const CONTACT_TOPICS: ContactTopic[] = [
  'Pertanyaan Umum',
  'Promosi UMKM Premium',
  'Kemitraan & Reseller',
  'Bantuan Pendaftaran',
  'Saran & Masukan',
];

export function isValidEmailAddress(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  if (trimmed.length > 120) return false;
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(trimmed);
}

export function isValidContactPhone(phone: string): boolean {
  const digits = phone.replace(/[^0-9]/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

export function getContactStatusLabel(status: string): string {
  switch (status) {
    case 'unread':
    case 'Baru':
      return 'Belum Dibaca';
    case 'read':
    case 'Dibaca':
      return 'Sudah Dibaca';
    case 'replied':
    case 'Selesai':
      return 'Sudah Dibalas';
    default:
      return status;
  }
}

export function validateContactMessageForm(
  form: ContactMessageFormData
): Partial<Record<keyof ContactMessageFormData, string>> {
  const errors: Partial<Record<keyof ContactMessageFormData, string>> = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const whatsappDigits = form.whatsapp.replace(/[^0-9]/g, '');
  const subject = form.subject.trim();
  const message = form.message.trim();

  if (name.length < 2 || name.length > 80) {
    errors.name = 'Masukkan nama lengkap Anda (2–80 karakter).';
  }
  if (!isValidEmailAddress(email)) {
    errors.email = 'Masukkan alamat email yang valid (contoh: nama@contoh.id).';
  }
  if (whatsappDigits.length > 0 && !isValidContactPhone(form.whatsapp)) {
    errors.whatsapp = 'Nomor WhatsApp harus berisi 8–15 digit angka jika diisi.';
  }
  if (subject.length < 2 || subject.length > 120) {
    errors.subject = 'Masukkan subjek pesan (2–120 karakter).';
  }
  if (message.length < 2 || message.length > 1500) {
    errors.message = 'Isi pesan minimal 2 karakter (maksimal 1.500 karakter).';
  }

  return errors;
}

export function formatContactDate(isoTimestamp: string): string {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) return isoTimestamp;
  return parsed.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isDeveloperAdminPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '').toLowerCase();
  return normalized === '/admin' || normalized === '/portal-developer';
}

export type AdminFilterTab = 'all' | 'premium' | 'reguler' | 'pending';

export interface AdminPortalSummary {
  activeUmkmCount: number;
  unreadMessagesCount: number;
  premiumUmkmCount: number;
}

export function getAdminPortalSummary(
  listings: UmkmListing[],
  messages: ContactMessage[]
): AdminPortalSummary {
  return {
    activeUmkmCount: listings.filter((item) => item.status === 'Aktif').length,
    unreadMessagesCount: messages.filter((msg) => msg.status === 'unread').length,
    premiumUmkmCount: listings.filter((item) => item.tier === 'premium').length,
  };
}

export function filterAdminListings(
  listings: UmkmListing[],
  filterTab: AdminFilterTab,
  searchQuery: string
): UmkmListing[] {
  const q = searchQuery.trim().toLowerCase();

  const tabFiltered = listings.filter((item) => {
    if (filterTab === 'premium' && item.tier !== 'premium') return false;
    if (filterTab === 'reguler' && item.tier !== 'reguler') return false;
    if (filterTab === 'pending' && item.status !== 'Menunggu Verifikasi') return false;
    return true;
  });

  if (q === '') {
    return tabFiltered;
  }

  const scored: { item: UmkmListing; rank: number }[] = [];
  for (const item of tabFiltered) {
    const businessLower = item.businessName.toLowerCase();
    if (businessLower.startsWith(q)) {
      scored.push({ item, rank: 0 });
    } else if (businessLower.includes(q)) {
      scored.push({ item, rank: 1 });
    } else if (
      item.productName.toLowerCase().includes(q) ||
      item.ownerName.toLowerCase().includes(q) ||
      item.village.toLowerCase().includes(q)
    ) {
      scored.push({ item, rank: 2 });
    }
  }

  scored.sort((a, b) => a.rank - b.rank);
  return scored.map((entry) => entry.item);
}

export interface MonthlyRegistrationTrendPoint {
  monthKey: string;
  monthLabel: string;
  total: number;
  premium: number;
  reguler: number;
}

const INDONESIAN_SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

function extractYearMonth(rawDate: string): { year: number; month: number } | null {
  const trimmed = (rawDate ?? '').trim();
  const isoMatch = /^(\d{4})-(\d{2})/.exec(trimmed);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]);
    if (year >= 2000 && year <= 2100 && month >= 1 && month <= 12) {
      return { year, month };
    }
  }
  const parsed = Date.parse(trimmed);
  if (!Number.isNaN(parsed)) {
    const d = new Date(parsed);
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
  }
  return null;
}

function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function formatMonthLabel(year: number, month: number): string {
  const shortMonth = INDONESIAN_SHORT_MONTHS[month - 1] ?? String(month);
  return `${shortMonth} ${year}`;
}

function monthIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

function fromMonthIndex(idx: number): { year: number; month: number } {
  const year = Math.floor(idx / 12);
  const month = (idx % 12) + 1;
  return { year, month };
}

export function getMonthlyUmkmRegistrationTrend(
  listings: UmkmListing[],
  nowDate: Date = new Date()
): MonthlyRegistrationTrendPoint[] {
  const countsByMonth = new Map<string, { total: number; premium: number; reguler: number }>();
  let minIdx: number | null = null;
  let maxIdx: number | null = null;

  for (const item of listings) {
    const ym = extractYearMonth(item.createdAt);
    if (!ym) continue;
    const key = toMonthKey(ym.year, ym.month);
    const idx = monthIndex(ym.year, ym.month);
    if (minIdx === null || idx < minIdx) minIdx = idx;
    if (maxIdx === null || idx > maxIdx) maxIdx = idx;

    const current = countsByMonth.get(key) ?? { total: 0, premium: 0, reguler: 0 };
    current.total += 1;
    if (item.tier === 'premium') {
      current.premium += 1;
    } else {
      current.reguler += 1;
    }
    countsByMonth.set(key, current);
  }

  const nowIdx = monthIndex(nowDate.getFullYear(), nowDate.getMonth() + 1);
  const endIdx = maxIdx !== null ? Math.max(maxIdx, nowIdx) : nowIdx;
  const trailingStartIdx = endIdx - 5;
  const earliestAllowedIdx = endIdx - 11;
  const startIdx =
    minIdx !== null
      ? Math.max(earliestAllowedIdx, Math.min(minIdx, trailingStartIdx))
      : trailingStartIdx;

  const series: MonthlyRegistrationTrendPoint[] = [];
  for (let idx = startIdx; idx <= endIdx; idx += 1) {
    const { year, month } = fromMonthIndex(idx);
    const key = toMonthKey(year, month);
    const bucket = countsByMonth.get(key) ?? { total: 0, premium: 0, reguler: 0 };
    series.push({
      monthKey: key,
      monthLabel: formatMonthLabel(year, month),
      total: bucket.total,
      premium: bucket.premium,
      reguler: bucket.reguler,
    });
  }

  return series;
}

export function validateTestimonialForm(
  form: CustomerTestimonialFormData
): Partial<Record<keyof CustomerTestimonialFormData, string>> {
  const errors: Partial<Record<keyof CustomerTestimonialFormData, string>> = {};
  const customerName = form.customerName.trim();
  const customerRole = form.customerRole.trim();
  const umkmId = form.umkmId.trim();
  const quote = form.quote.trim();
  const rating = Number(form.rating);

  if (customerName.length < 2 || customerName.length > 80) {
    errors.customerName = 'Nama pembeli harus 2–80 karakter.';
  }
  if (customerRole.length < 2 || customerRole.length > 80) {
    errors.customerRole = 'Keterangan atau asal pembeli harus 2–80 karakter.';
  }
  if (!/^[a-zA-Z0-9_-]{2,80}$/.test(umkmId)) {
    errors.umkmId = 'Pilih salah satu UMKM yang terdaftar.';
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    errors.rating = 'Pilih rating antara 1 hingga 5 bintang.';
  }
  if (quote.length < 10 || quote.length > 600) {
    errors.quote = 'Isi ulasan testimoni minimal 10 karakter (maksimal 600 karakter).';
  }

  return errors;
}

export interface TestimonialStats {
  total: number;
  publishedCount: number;
  averageRating: number;
}

export function getTestimonialStats(testimonials: CustomerTestimonial[]): TestimonialStats {
  const published = testimonials.filter((item) => item.isPublished);
  const count = published.length;
  const averageRating =
    count > 0
      ? Math.round((published.reduce((sum, item) => sum + item.rating, 0) / count) * 10) / 10
      : 0;

  return {
    total: testimonials.length,
    publishedCount: count,
    averageRating,
  };
}

export type CatalogMatchField =
  | 'Produk'
  | 'Usaha'
  | 'Menu/Varian'
  | 'Desa'
  | 'Pemilik'
  | 'Deskripsi';

export interface CatalogInstantSuggestion {
  listing: UmkmListing;
  matchField: CatalogMatchField;
  matchedLabel: string;
}

export function getCatalogInstantSuggestions(
  listings: UmkmListing[],
  query: string,
  maxResults = 6
): CatalogInstantSuggestion[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery === '' || maxResults <= 0) {
    return [];
  }

  const scored: { suggestion: CatalogInstantSuggestion; rank: number }[] = [];

  for (const item of listings) {
    if (item.status !== 'Aktif') continue;

    const productLower = item.productName.toLowerCase();
    const businessLower = item.businessName.toLowerCase();
    const villageLower = item.village.toLowerCase();
    const ownerLower = item.ownerName.toLowerCase();
    const descLower = item.shortDescription.toLowerCase();
    const matchedVariant = item.variants.find((v) =>
      v.label.toLowerCase().includes(normalizedQuery)
    );

    let rank = -1;
    let matchField: CatalogMatchField = 'Produk';
    let matchedLabel = item.productName;

    if (productLower.startsWith(normalizedQuery)) {
      rank = 0;
      matchField = 'Produk';
      matchedLabel = item.productName;
    } else if (businessLower.startsWith(normalizedQuery)) {
      rank = 1;
      matchField = 'Usaha';
      matchedLabel = item.businessName;
    } else if (productLower.includes(normalizedQuery)) {
      rank = 2;
      matchField = 'Produk';
      matchedLabel = item.productName;
    } else if (businessLower.includes(normalizedQuery)) {
      rank = 3;
      matchField = 'Usaha';
      matchedLabel = item.businessName;
    } else if (matchedVariant) {
      rank = 4;
      matchField = 'Menu/Varian';
      matchedLabel = matchedVariant.label;
    } else if (villageLower.includes(normalizedQuery)) {
      rank = 5;
      matchField = 'Desa';
      matchedLabel = item.village;
    } else if (ownerLower.includes(normalizedQuery)) {
      rank = 6;
      matchField = 'Pemilik';
      matchedLabel = item.ownerName;
    } else if (descLower.includes(normalizedQuery)) {
      rank = 7;
      matchField = 'Deskripsi';
      matchedLabel = item.shortDescription;
    }

    if (rank >= 0) {
      scored.push({
        suggestion: {
          listing: item,
          matchField,
          matchedLabel,
        },
        rank,
      });
    }
  }

  scored.sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    if (a.suggestion.listing.tier === b.suggestion.listing.tier) return 0;
    return a.suggestion.listing.tier === 'premium' ? -1 : 1;
  });

  return scored.slice(0, maxResults).map((entry) => entry.suggestion);
}

export interface HighlightSegment {
  text: string;
  highlight: boolean;
}

export function splitTextByHighlight(text: string, query: string): HighlightSegment[] {
  const trimmedQuery = query.trim();
  if (!trimmedQuery || trimmedQuery.length > 80 || text.length === 0) {
    return [{ text, highlight: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = trimmedQuery.toLowerCase();
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  while (cursor < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, cursor);
    if (matchIndex === -1) {
      segments.push({ text: text.slice(cursor), highlight: false });
      break;
    }
    if (matchIndex > cursor) {
      segments.push({ text: text.slice(cursor, matchIndex), highlight: false });
    }
    const matchEnd = matchIndex + trimmedQuery.length;
    segments.push({ text: text.slice(matchIndex, matchEnd), highlight: true });
    cursor = matchEnd;
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}

export const AUTHORIZED_ADMIN_EMAILS = [
  'herzz@smkn2banjar-jabar.sch.id',
  'heriadi0907@gmail.com',
] as const;

export function isAuthorizedAdminEmail(
  email: string | null | undefined,
  emailVerified: boolean
): boolean {
  if (!email || !emailVerified) return false;
  const normalized = email.trim().toLowerCase();
  return AUTHORIZED_ADMIN_EMAILS.some((allowed) => allowed === normalized);
}



