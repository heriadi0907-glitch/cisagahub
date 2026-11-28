import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  ImagePlus,
  MessageCircle,
  Plus,
  SlidersHorizontal,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type {
  AdminUmkmFormData,
  AdminVariantFormItem,
  BusinessCategory,
  SocialPlatform,
  UmkmStatus,
  UmkmTier,
  VillageInfo,
} from '../types/umkm';
import {
  type AdminPhotoOption,
  addAdminPhotoOption,
  buildUmkmAutoChatMessage,
  buildWhatsAppUrl,
  deleteAdminPhotoOption,
  hasAnySocialLinks,
  isValidIndonesianPhone,
  loadAdminPhotoOptions,
  saveAdminPhotoOptions,
  SOCIAL_LINK_PLATFORMS,
  updateAdminPhotoOption,
} from '../utils/umkmLogic';
import { ProductImage } from './ProductImage';

interface AdminUmkmFormProps {
  form: AdminUmkmFormData;
  editingId: string | null;
  villages: VillageInfo[];
  errors: Partial<Record<keyof AdminUmkmFormData, string>>;
  socialErrors: Partial<Record<SocialPlatform, string>>;
  submitError: string | null;
  uploadError: string | null;
  uploadingTarget: string | null;
  isSaving: boolean;
  onUpdateForm: (updater: (prev: AdminUmkmFormData) => AdminUmkmFormData) => void;
  onClearError: (field: keyof AdminUmkmFormData) => void;
  onClearSocialError: (platform: SocialPlatform) => void;
  onSetUploadError: (message: string | null) => void;
  onSetUploadingTarget: (target: string | null) => void;
  onUploadImage: (file: File) => Promise<string>;
  onSubmit: (e: FormEvent) => Promise<void>;
  onCancel: () => void;
}

const BUSINESS_CATEGORIES: BusinessCategory[] = [
  'Kuliner',
  'Kerajinan',
  'Agribisnis',
  'Busana',
];

const WA_TEMPLATE_PRESETS = [
  {
    label: 'Template Produk',
    text: 'Halo {usaha}, saya ingin memesan {menu} ({produk}) yang saya lihat di CISAGA HUB. Apakah stok tersedia?',
  },
  {
    label: 'Template Layanan',
    text: 'Halo {usaha}, saya tertarik menggunakan layanan {menu} ({produk}) dari CISAGA HUB. Boleh info jadwal dan estimasi biayanya?',
  },
] as const;

const SOCIAL_FIELD_META: Record<SocialPlatform, { label: string; placeholder: string }> = {
  instagram: {
    label: 'Instagram',
    placeholder: '@usaha_cisaga atau https://instagram.com/...',
  },
  facebook: {
    label: 'Facebook',
    placeholder: 'HalamanFB atau https://facebook.com/...',
  },
  tiktok: {
    label: 'TikTok',
    placeholder: '@usaha_cisaga atau https://tiktok.com/@...',
  },
  website: {
    label: 'Website / Toko Online / Maps',
    placeholder: 'https://shopee.co.id/... atau tokocisaga.id',
  },
};

export function AdminUmkmForm({
  form,
  editingId,
  villages,
  errors,
  socialErrors,
  submitError,
  uploadError,
  uploadingTarget,
  isSaving,
  onUpdateForm,
  onClearError,
  onClearSocialError,
  onSetUploadError,
  onSetUploadingTarget,
  onUploadImage,
  onSubmit,
  onCancel,
}: AdminUmkmFormProps) {
  const hasAdvancedData = useMemo(() => {
    const hasCustomWa = (form.whatsappAutoMessage ?? '').trim().length > 0;
    const hasSocial = hasAnySocialLinks(form.socialLinks) ||
      SOCIAL_LINK_PLATFORMS.some((p) => (form.socialLinks?.[p] ?? '').trim().length > 0);
    const hasGallery = (form.galleryImages ?? []).length > 0;
    const hasMultipleVariants = (form.variants ?? []).length > 1;
    return hasCustomWa || hasSocial || hasGallery || hasMultipleVariants;
  }, [form.whatsappAutoMessage, form.socialLinks, form.galleryImages, form.variants]);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(() => Boolean(editingId && hasAdvancedData));
  const [photoOptions, setPhotoOptions] = useState<AdminPhotoOption[]>(() =>
    loadAdminPhotoOptions()
  );
  const [isEditingPhotoOptions, setIsEditingPhotoOptions] = useState(false);
  const [newOptionLabel, setNewOptionLabel] = useState('');
  const [newOptionUrl, setNewOptionUrl] = useState('');
  const [photoOptionError, setPhotoOptionError] = useState<string | null>(null);

  useEffect(() => {
    if (editingId && hasAdvancedData) {
      setShowAdvanced(true);
    } else if (!editingId) {
      setShowAdvanced(false);
    }
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (errors.whatsappAutoMessage || errors.socialLinks || errors.variants) {
      setShowAdvanced(true);
    }
  }, [errors.whatsappAutoMessage, errors.socialLinks, errors.variants]);

  const previewAutoChatText = useMemo(
    () =>
      buildUmkmAutoChatMessage(
        {
          businessName: form.businessName.trim() || 'Nama Usaha UMKM',
          productName: form.productName.trim() || 'Produk / Layanan Unggulan',
          village: form.village || 'Kec. Cisaga',
          unitLabel:
            form.variants?.[0]?.label.trim() || form.unitLabel.trim() || 'Menu Utama',
          whatsappAutoMessage: form.whatsappAutoMessage,
        },
        form.variants?.[0]?.label.trim() || form.unitLabel.trim() || undefined
      ),
    [
      form.businessName,
      form.productName,
      form.village,
      form.unitLabel,
      form.variants,
      form.whatsappAutoMessage,
    ]
  );

  const handlePrimaryPhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    onSetUploadError(null);
    onSetUploadingTarget('primary');
    try {
      const url = await onUploadImage(file);
      onUpdateForm((prev) => ({ ...prev, image: url }));
      if (errors.image) onClearError('image');
    } catch (err) {
      onSetUploadError(err instanceof Error ? err.message : 'Gagal mengunggah foto utama.');
    } finally {
      onSetUploadingTarget(null);
    }
  };

  const persistPhotoOptions = (next: AdminPhotoOption[]) => {
    setPhotoOptions(next);
    saveAdminPhotoOptions(next);
  };

  const handleAddCustomPhotoOption = () => {
    setPhotoOptionError(null);
    const result = addAdminPhotoOption(photoOptions, newOptionLabel, newOptionUrl || form.image);
    if (result.error) {
      setPhotoOptionError(result.error);
      return;
    }
    persistPhotoOptions(result.options);
    const created = result.options[result.options.length - 1];
    if (created && form.image.trim() === '') {
      onUpdateForm((prev) => ({ ...prev, image: created.url }));
      if (errors.image) onClearError('image');
    }
    setNewOptionLabel('');
    setNewOptionUrl('');
  };

  const handleUploadForNewOption = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoOptionError(null);
    onSetUploadingTarget('option-new');
    try {
      const url = await onUploadImage(file);
      setNewOptionUrl(url);
    } catch (err) {
      setPhotoOptionError(err instanceof Error ? err.message : 'Gagal mengunggah foto opsi.');
    } finally {
      onSetUploadingTarget(null);
    }
  };

  const handleUpdateSavedOption = (id: string, nextLabel: string, nextUrl: string) => {
    setPhotoOptionError(null);
    const result = updateAdminPhotoOption(photoOptions, id, nextLabel, nextUrl);
    if (result.error) {
      setPhotoOptionError(result.error);
      return;
    }
    persistPhotoOptions(result.options);
  };

  const handleUploadForSavedOption = async (
    id: string,
    label: string,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setPhotoOptionError(null);
    onSetUploadingTarget(`option-${id}`);
    try {
      const url = await onUploadImage(file);
      handleUpdateSavedOption(id, label, url);
    } catch (err) {
      setPhotoOptionError(err instanceof Error ? err.message : 'Gagal mengganti foto opsi.');
    } finally {
      onSetUploadingTarget(null);
    }
  };

  const handleDeleteSavedOption = (id: string) => {
    setPhotoOptionError(null);
    const removed = photoOptions.find((opt) => opt.id === id);
    const next = deleteAdminPhotoOption(photoOptions, id);
    persistPhotoOptions(next);
    if (removed && form.image === removed.url) {
      onUpdateForm((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (files.length === 0) return;

    const existingGallery = form.galleryImages ?? [];
    const remainingSlots = Math.max(0, 6 - existingGallery.length);
    if (remainingSlots === 0) {
      onSetUploadError('Maksimal 6 foto galeri tambahan per UMKM.');
      return;
    }

    onSetUploadError(null);
    onSetUploadingTarget('gallery');
    try {
      const uploadedUrls: string[] = [];
      for (const file of files.slice(0, remainingSlots)) {
        const url = await onUploadImage(file);
        uploadedUrls.push(url);
      }
      onUpdateForm((prev) => ({
        ...prev,
        galleryImages: [...(prev.galleryImages ?? []), ...uploadedUrls].slice(0, 6),
      }));
    } catch (err) {
      onSetUploadError(err instanceof Error ? err.message : 'Gagal mengunggah foto galeri.');
    } finally {
      onSetUploadingTarget(null);
    }
  };

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    onUpdateForm((prev) => ({
      ...prev,
      galleryImages: (prev.galleryImages ?? []).filter((url) => url !== urlToRemove),
    }));
  };

  const handleMakeGalleryPrimary = (urlToPromote: string) => {
    onUpdateForm((prev) => {
      const nextGallery = (prev.galleryImages ?? []).filter((url) => url !== urlToPromote);
      if (prev.image && prev.image !== urlToPromote && nextGallery.length < 6) {
        nextGallery.unshift(prev.image);
      }
      return {
        ...prev,
        image: urlToPromote,
        galleryImages: nextGallery,
      };
    });
  };

  const handleAddVariantRow = () => {
    onUpdateForm((prev) => {
      const currentVariants = prev.variants ?? [];
      if (currentVariants.length >= 25) return prev;
      return {
        ...prev,
        variants: [
          ...currentVariants,
          {
            label: '',
            price: prev.price || '20000',
            availabilityNote: 'Tersedia',
          },
        ],
      };
    });
    if (errors.variants) onClearError('variants');
  };

  const handleUpdateVariantField = (
    index: number,
    field: keyof AdminVariantFormItem,
    value: string
  ) => {
    onUpdateForm((prev) => {
      const currentVariants = [...(prev.variants ?? [])];
      if (!currentVariants[index]) return prev;
      currentVariants[index] = { ...currentVariants[index], [field]: value };
      return { ...prev, variants: currentVariants };
    });
    if (errors.variants) onClearError('variants');
  };

  const handleRemoveVariantRow = (index: number) => {
    onUpdateForm((prev) => {
      const currentVariants = prev.variants ?? [];
      if (currentVariants.length <= 1) return prev;
      return {
        ...prev,
        variants: currentVariants.filter((_, idx) => idx !== index),
      };
    });
  };

  const handleVariantPhotoUpload = async (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    onSetUploadError(null);
    onSetUploadingTarget(`variant-${index}`);
    try {
      const url = await onUploadImage(file);
      onUpdateForm((prev) => {
        const currentVariants = [...(prev.variants ?? [])];
        if (!currentVariants[index]) return prev;
        currentVariants[index] = { ...currentVariants[index], image: url };
        return { ...prev, variants: currentVariants };
      });
    } catch (err) {
      onSetUploadError(err instanceof Error ? err.message : 'Gagal mengunggah foto menu/layanan.');
    } finally {
      onSetUploadingTarget(null);
    }
  };

  const handleMoveVariantRow = (index: number, direction: 'up' | 'down') => {
    onUpdateForm((prev) => {
      const currentVariants = [...(prev.variants ?? [])];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentVariants.length) return prev;
      const [moved] = currentVariants.splice(index, 1);
      currentVariants.splice(targetIndex, 0, moved);
      return { ...prev, variants: currentVariants };
    });
  };

  const handleSocialFieldChange = (platform: SocialPlatform, value: string) => {
    onUpdateForm((prev) => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks ?? {}),
        [platform]: value,
      },
    }));
    if (socialErrors[platform]) onClearSocialError(platform);
    if (errors.socialLinks) onClearError('socialLinks');
  };

  return (
    <div
      data-testid="admin-umkm-form-panel"
      className="scroll-mt-16 bg-white border border-[#CBD5E1] rounded-xl p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3 pb-3 mb-3.5 border-b border-[#E2E8F0]">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#0F2744]">
            {editingId
              ? `Edit UMKM: ${form.businessName || 'Usaha Terpilih'}`
              : 'Tambah UMKM Baru'}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Isi data utama di bawah ini, lalu simpan. Pengaturan chat WA, sosmed, dan daftar menu
            tambahan bersifat opsional.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Tutup formulir admin"
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#0F2744] shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} noValidate className="space-y-3.5">
        {submitError && (
          <div
            role="alert"
            className="p-3 rounded-lg bg-[#B91C1C]/5 border border-[#B91C1C]/30 text-xs font-medium text-[#B91C1C]"
          >
            {submitError}
          </div>
        )}

        {/* Data Utama (Ringkas & Cepat) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label
              htmlFor="admin-business-name"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Nama Usaha / Brand *
            </label>
            <input
              id="admin-business-name"
              type="text"
              value={form.businessName}
              onChange={(e) => {
                onUpdateForm((prev) => ({ ...prev, businessName: e.target.value }));
                if (errors.businessName) onClearError('businessName');
              }}
              placeholder="Contoh: Opak Ketan Cisaga"
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
            />
            {errors.businessName && (
              <p className="text-xs text-[#B91C1C] mt-1">{errors.businessName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="admin-owner-name"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Nama Pemilik *
            </label>
            <input
              id="admin-owner-name"
              type="text"
              value={form.ownerName}
              onChange={(e) => {
                onUpdateForm((prev) => ({ ...prev, ownerName: e.target.value }));
                if (errors.ownerName) onClearError('ownerName');
              }}
              placeholder="Nama pemilik usaha"
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
            />
            {errors.ownerName && (
              <p className="text-xs text-[#B91C1C] mt-1">{errors.ownerName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="admin-product-name"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Produk / Layanan Utama *
            </label>
            <input
              id="admin-product-name"
              type="text"
              value={form.productName}
              onChange={(e) => {
                onUpdateForm((prev) => ({ ...prev, productName: e.target.value }));
                if (errors.productName) onClearError('productName');
              }}
              placeholder="Contoh: Opak Bakar Arang"
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
            />
            {errors.productName && (
              <p className="text-xs text-[#B91C1C] mt-1">{errors.productName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="admin-village"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Desa Asal *
            </label>
            <select
              id="admin-village"
              value={form.village}
              onChange={(e) => {
                onUpdateForm((prev) => ({ ...prev, village: e.target.value }));
                if (errors.village) onClearError('village');
              }}
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744] cursor-pointer"
            >
              <option value="">Pilih Desa...</option>
              {villages.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
            {errors.village && <p className="text-xs text-[#B91C1C] mt-1">{errors.village}</p>}
          </div>

          <div>
            <label
              htmlFor="admin-category"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Kategori
            </label>
            <select
              id="admin-category"
              value={form.category}
              onChange={(e) =>
                onUpdateForm((prev) => ({
                  ...prev,
                  category: e.target.value as BusinessCategory,
                }))
              }
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744] cursor-pointer"
            >
              {BUSINESS_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="admin-whatsapp"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Nomor WhatsApp *
            </label>
            <input
              id="admin-whatsapp"
              type="tel"
              value={form.whatsapp}
              onChange={(e) => {
                onUpdateForm((prev) => ({ ...prev, whatsapp: e.target.value }));
                if (errors.whatsapp) onClearError('whatsapp');
              }}
              placeholder="081234567890"
              className="w-full px-2.5 py-1.5 text-sm font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
            />
            {errors.whatsapp && <p className="text-xs text-[#B91C1C] mt-1">{errors.whatsapp}</p>}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label
                htmlFor="admin-price"
                className="block text-xs font-semibold text-[#0F2744] mb-1"
              >
                Harga Mulai (Rp) *
              </label>
              <input
                id="admin-price"
                type="number"
                step="any"
                value={form.price}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateForm((prev) => ({
                    ...prev,
                    price: val,
                    variants:
                      prev.variants && prev.variants.length === 1
                        ? [{ ...prev.variants[0], price: val }]
                        : prev.variants,
                  }));
                  if (errors.price) onClearError('price');
                }}
                className="w-full px-2.5 py-1.5 text-sm font-mono tabular-nums bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
              />
              {errors.price && <p className="text-xs text-[#B91C1C] mt-1">{errors.price}</p>}
            </div>

            <div>
              <label
                htmlFor="admin-unit-label"
                className="block text-xs font-semibold text-[#0F2744] mb-1"
              >
                Satuan / Porsi
              </label>
              <input
                id="admin-unit-label"
                type="text"
                value={form.unitLabel}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateForm((prev) => ({
                    ...prev,
                    unitLabel: val,
                    variants:
                      prev.variants && prev.variants.length === 1
                        ? [{ ...prev.variants[0], label: val || 'Kemasan Standar' }]
                        : prev.variants,
                  }));
                }}
                placeholder="Kemasan 250g"
                className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-tier"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Paket Promosi
            </label>
            <select
              id="admin-tier"
              value={form.tier}
              onChange={(e) =>
                onUpdateForm((prev) => ({ ...prev, tier: e.target.value as UmkmTier }))
              }
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744] cursor-pointer"
            >
              <option value="reguler">Reguler (Free)</option>
              <option value="premium">Premium (Posisi Atas)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="admin-status"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Status Tayang
            </label>
            <select
              id="admin-status"
              value={form.status}
              onChange={(e) =>
                onUpdateForm((prev) => ({ ...prev, status: e.target.value as UmkmStatus }))
              }
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744] cursor-pointer"
            >
              <option value="Aktif">Aktif (Tayang Publik)</option>
              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        {/* Deskripsi & Foto Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          <div className="lg:col-span-7">
            <label
              htmlFor="admin-short-desc"
              className="block text-xs font-semibold text-[#0F2744] mb-1"
            >
              Deskripsi Singkat *
            </label>
            <textarea
              id="admin-short-desc"
              rows={2}
              value={form.shortDescription}
              onChange={(e) => {
                onUpdateForm((prev) => ({ ...prev, shortDescription: e.target.value }));
                if (errors.shortDescription) onClearError('shortDescription');
              }}
              placeholder="Jelaskan singkat produk, layanan, atau alamat usaha..."
              className="w-full px-2.5 py-1.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
            />
            {errors.shortDescription && (
              <p className="text-xs text-[#B91C1C] mt-1">{errors.shortDescription}</p>
            )}
          </div>

          <div className="lg:col-span-5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold text-[#0F2744]">
                Foto Utama Etalase (Opsional)
              </span>
              <button
                type="button"
                data-testid="admin-toggle-photo-options"
                aria-expanded={isEditingPhotoOptions}
                onClick={() => {
                  setPhotoOptionError(null);
                  setIsEditingPhotoOptions((prev) => !prev);
                }}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F2744] hover:text-[#EA580C] cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
                <span>{isEditingPhotoOptions ? 'Tutup Pengaturan Opsi' : 'Atur Opsi'}</span>
              </button>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-16 h-14 rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] shrink-0">
                <ProductImage
                  src={form.image}
                  alt="Pratinjau foto"
                  fallbackTitle="Kosong"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <label
                    htmlFor="admin-primary-photo-upload"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0F2744] hover:bg-[#0B1E36] rounded-md cursor-pointer whitespace-nowrap"
                  >
                    <Upload className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{uploadingTarget === 'primary' ? 'Mengunggah...' : 'Upload Foto'}</span>
                  </label>
                  <input
                    id="admin-primary-photo-upload"
                    data-testid="admin-primary-photo-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => void handlePrimaryPhotoUpload(e)}
                    disabled={uploadingTarget !== null}
                    className="sr-only"
                  />
                  <select
                    id="admin-image-preset"
                    data-testid="admin-image-option-select"
                    aria-label="Pilih opsi foto"
                    value={form.image}
                    onChange={(e) => {
                      onUpdateForm((prev) => ({ ...prev, image: e.target.value }));
                      if (errors.image) onClearError('image');
                    }}
                    className="flex-1 min-w-[130px] px-2.5 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:border-[#0F2744] cursor-pointer"
                  >
                    <option value="">-- Kosong / Belum Dipilih --</option>
                    {form.image.trim() !== '' &&
                      !photoOptions.some((opt) => opt.url === form.image) && (
                        <option value={form.image}>Foto Aktif Saat Ini</option>
                      )}
                    {photoOptions.map((opt) => (
                      <option key={opt.id} value={opt.url}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <label htmlFor="admin-image-url-input" className="sr-only">
                    Path atau alamat foto aktif
                  </label>
                  <input
                    id="admin-image-url-input"
                    data-testid="admin-image-url-input"
                    type="text"
                    value={form.image}
                    onChange={(e) => {
                      onUpdateForm((prev) => ({ ...prev, image: e.target.value }));
                      if (errors.image) onClearError('image');
                    }}
                    placeholder="Kosong (upload foto atau atur opsi)"
                    className="flex-1 min-w-0 px-2.5 py-1 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F2744] placeholder:text-[#94A3B8] focus:outline-none focus:bg-white focus:border-[#0F2744]"
                  />
                  {form.image.trim() !== '' && (
                    <button
                      type="button"
                      data-testid="admin-clear-primary-photo"
                      onClick={() => {
                        onUpdateForm((prev) => ({ ...prev, image: '' }));
                        if (errors.image) onClearError('image');
                      }}
                      className="px-2 py-1 text-[11px] font-medium text-[#475569] hover:text-[#B91C1C] bg-white border border-[#E2E8F0] rounded-md whitespace-nowrap cursor-pointer"
                    >
                      Kosongkan
                    </button>
                  )}
                </div>

                {errors.image && (
                  <p role="alert" className="text-[11px] font-medium text-[#B91C1C]">
                    {errors.image}
                  </p>
                )}
                {uploadError && (
                  <p role="alert" className="text-[11px] font-medium text-[#B91C1C]">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>

            {isEditingPhotoOptions && (
              <div
                data-testid="admin-photo-options-editor"
                className="mt-2.5 p-3 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold text-[#0F2744]">
                    Atur Opsi Pilihan Foto ({photoOptions.length})
                  </p>
                  {photoOptions.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        persistPhotoOptions([]);
                        setPhotoOptionError(null);
                      }}
                      className="text-[11px] font-medium text-[#B91C1C] hover:underline cursor-pointer"
                    >
                      Kosongkan Semua Opsi
                    </button>
                  )}
                </div>

                {photoOptions.length === 0 ? (
                  <p className="text-[11px] text-[#64748B]">
                    Daftar opsi saat ini kosong. Tambahkan opsi baru di bawah dengan nama &amp;
                    upload foto agar bisa dipilih dan diedit kapan saja.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                    {photoOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-1.5 bg-white p-1.5 rounded border border-[#E2E8F0]"
                      >
                        <div className="w-7 h-7 rounded overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] shrink-0">
                          <ProductImage
                            src={opt.url}
                            alt={opt.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          aria-label={`Edit nama opsi ${opt.label}`}
                          value={opt.label}
                          onChange={(e) =>
                            handleUpdateSavedOption(opt.id, e.target.value, opt.url)
                          }
                          className="flex-1 min-w-0 px-2 py-1 text-[11px] bg-[#F8FAFC] border border-[#E2E8F0] rounded text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
                        />
                        <label
                          htmlFor={`admin-saved-option-upload-${opt.id}`}
                          className="px-2 py-1 text-[10px] font-medium text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded cursor-pointer whitespace-nowrap"
                        >
                          {uploadingTarget === `option-${opt.id}` ? '...' : 'Ganti Foto'}
                        </label>
                        <input
                          id={`admin-saved-option-upload-${opt.id}`}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => void handleUploadForSavedOption(opt.id, opt.label, e)}
                          disabled={uploadingTarget !== null}
                          className="sr-only"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateForm((prev) => ({ ...prev, image: opt.url }));
                            if (errors.image) onClearError('image');
                          }}
                          className="px-1.5 py-1 text-[10px] font-semibold text-[#0F2744] hover:text-[#EA580C] cursor-pointer whitespace-nowrap"
                        >
                          Pakai
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedOption(opt.id)}
                          aria-label={`Hapus opsi ${opt.label}`}
                          className="p-1 text-[#64748B] hover:text-[#B91C1C] cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-[#E2E8F0] space-y-1.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <input
                      type="text"
                      data-testid="admin-new-photo-option-label"
                      value={newOptionLabel}
                      onChange={(e) => {
                        setNewOptionLabel(e.target.value);
                        setPhotoOptionError(null);
                      }}
                      placeholder="Nama opsi (mis. Toko Depan)"
                      className="flex-1 min-w-[140px] px-2 py-1 text-xs bg-white border border-[#E2E8F0] rounded focus:outline-none focus:border-[#0F2744]"
                    />
                    <label
                      htmlFor="admin-option-photo-upload"
                      className="px-2.5 py-1 text-[11px] font-medium text-[#0F2744] bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] rounded cursor-pointer whitespace-nowrap"
                    >
                      {uploadingTarget === 'option-new'
                        ? 'Mengunggah...'
                        : newOptionUrl
                          ? 'Foto Siap ✓'
                          : 'Upload Foto'}
                    </label>
                    <input
                      id="admin-option-photo-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(e) => void handleUploadForNewOption(e)}
                      disabled={uploadingTarget !== null}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      data-testid="admin-save-photo-option-btn"
                      onClick={handleAddCustomPhotoOption}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                      <span>Tambah Opsi</span>
                    </button>
                  </div>
                  {photoOptionError ? (
                    <p role="alert" className="text-[11px] font-medium text-[#B91C1C]">
                      {photoOptionError}
                    </p>
                  ) : (
                    <p className="text-[10px] text-[#64748B]">
                      Jika foto utama sudah diunggah, cukup ketik nama opsi lalu klik Tambah Opsi.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progressive Disclosure: Pengaturan Tambahan (Opsional) */}
        <div className="border-t border-[#E2E8F0] pt-3">
          <button
            type="button"
            data-testid="admin-toggle-advanced-form"
            aria-expanded={showAdvanced}
            onClick={() => setShowAdvanced((prev) => !prev)}
            className="w-full flex items-center justify-between gap-3 py-1.5 text-left text-xs sm:text-sm font-semibold text-[#0F2744] hover:text-[#EA580C] transition-colors cursor-pointer"
          >
            <span>
              Pengaturan Tambahan (Opsional): Chat WA Otomatis, Media Sosial, Galeri &amp; Daftar
              Menu ({(form.variants ?? []).length})
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
          </button>

          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] divide-y divide-[#E2E8F0] space-y-4">
              {/* 1. Chat Otomatis WA */}
              <div data-testid="admin-wa-autochat-section" className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2744]">
                    <MessageCircle className="w-4 h-4 text-[#EA580C]" aria-hidden="true" />
                    <span>Chat Otomatis WhatsApp</span>
                  </div>
                  {isValidIndonesianPhone(form.whatsapp) && (
                    <a
                      href={buildWhatsAppUrl(form.whatsapp, previewAutoChatText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="admin-wa-autochat-test-link"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C2410C] hover:underline"
                    >
                      <span>Tes Link Chat WA</span>
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {WA_TEMPLATE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        onUpdateForm((prev) => ({ ...prev, whatsappAutoMessage: preset.text }));
                        if (errors.whatsappAutoMessage) onClearError('whatsappAutoMessage');
                      }}
                      className="px-2.5 py-1 text-xs font-medium text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md cursor-pointer"
                    >
                      + {preset.label}
                    </button>
                  ))}
                  {(form.whatsappAutoMessage ?? '').trim() !== '' && (
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateForm((prev) => ({ ...prev, whatsappAutoMessage: '' }))
                      }
                      className="px-2.5 py-1 text-xs font-medium text-[#475569] hover:text-[#B91C1C] border border-[#E2E8F0] rounded-md cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <textarea
                  id="admin-wa-auto-message"
                  data-testid="admin-wa-auto-message-input"
                  rows={2}
                  maxLength={500}
                  value={form.whatsappAutoMessage ?? ''}
                  onChange={(e) => {
                    onUpdateForm((prev) => ({ ...prev, whatsappAutoMessage: e.target.value }));
                    if (errors.whatsappAutoMessage) onClearError('whatsappAutoMessage');
                  }}
                  placeholder="Kosongkan untuk format standar, atau pakai variabel {usaha}, {produk}, {menu}, {desa}..."
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-none focus:bg-white focus:border-[#0F2744]"
                />
                {errors.whatsappAutoMessage && (
                  <p className="text-xs text-[#B91C1C]">{errors.whatsappAutoMessage}</p>
                )}
                <p
                  data-testid="admin-wa-autochat-preview"
                  className="text-[11px] text-[#64748B]"
                >
                  Pratinjau: &ldquo;{previewAutoChatText}&rdquo;
                </p>
              </div>

              {/* 2. Media Sosial */}
              <div data-testid="admin-social-media-section" className="pt-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0F2744]">
                  <Globe className="w-4 h-4 text-[#0F2744]" aria-hidden="true" />
                  <span>Media Sosial &amp; Tautan Toko (Jika Ada)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {SOCIAL_LINK_PLATFORMS.map((platform) => {
                    const meta = SOCIAL_FIELD_META[platform];
                    const val = form.socialLinks?.[platform] ?? '';
                    const fieldError = socialErrors[platform];
                    return (
                      <div key={platform}>
                        <label
                          htmlFor={`admin-social-${platform}`}
                          className="block text-[11px] font-semibold text-[#475569] mb-1"
                        >
                          {meta.label}
                        </label>
                        <input
                          id={`admin-social-${platform}`}
                          data-testid={`admin-social-${platform}-input`}
                          type="text"
                          maxLength={200}
                          value={val}
                          onChange={(e) => handleSocialFieldChange(platform, e.target.value)}
                          placeholder={meta.placeholder}
                          className="w-full px-2.5 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:bg-white focus:border-[#0F2744]"
                        />
                        {fieldError && (
                          <p className="text-[11px] text-[#B91C1C] mt-1">{fieldError}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Galeri Foto Tambahan */}
              <div className="pt-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#0F2744]">
                    Galeri Foto Tambahan ({(form.galleryImages ?? []).length}/6)
                  </span>
                  <label
                    htmlFor="admin-gallery-photo-upload"
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border ${
                      (form.galleryImages ?? []).length >= 6
                        ? 'border-[#E2E8F0] text-[#94A3B8] cursor-not-allowed'
                        : 'border-[#0F2744] text-[#0F2744] hover:bg-[#F8FAFC] cursor-pointer'
                    }`}
                  >
                    <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tambah Foto Galeri</span>
                  </label>
                  <input
                    id="admin-gallery-photo-upload"
                    data-testid="admin-gallery-photo-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={(e) => void handleGalleryUpload(e)}
                    disabled={
                      uploadingTarget !== null || (form.galleryImages ?? []).length >= 6
                    }
                    className="sr-only"
                  />
                </div>

                {(form.galleryImages ?? []).length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {(form.galleryImages ?? []).map((url, idx) => (
                      <div
                        key={url}
                        className="rounded-md border border-[#E2E8F0] overflow-hidden bg-white"
                      >
                        <div className="aspect-[4/3] bg-[#F1F5F9]">
                          <ProductImage
                            src={url}
                            alt={`Foto galeri ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="px-1.5 py-1 flex items-center justify-between gap-1 text-[10px]">
                          <button
                            type="button"
                            onClick={() => handleMakeGalleryPrimary(url)}
                            className="text-[#0F2744] hover:text-[#EA580C] font-medium truncate cursor-pointer"
                          >
                            Utama
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(url)}
                            aria-label={`Hapus foto galeri ${idx + 1}`}
                            className="text-[#64748B] hover:text-[#B91C1C] cursor-pointer"
                          >
                            <X className="w-3 h-3" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Daftar Menu / Produk / Layanan */}
              <div data-testid="admin-menu-editor" className="pt-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-[#0F2744]">
                    Daftar Menu / Layanan &amp; Produk ({(form.variants ?? []).length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-md cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Tambah Menu / Layanan</span>
                  </button>
                </div>

                {errors.variants && (
                  <p role="alert" className="text-xs font-medium text-[#B91C1C]">
                    {errors.variants}
                  </p>
                )}

                <div className="space-y-2">
                  {(form.variants ?? []).map((item, idx) => (
                    <div
                      key={item.id ?? `variant-row-${idx}`}
                      data-testid={`admin-menu-row-${idx}`}
                      className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end pb-2.5 border-b border-[#F1F5F9] last:border-b-0"
                    >
                      <div className="md:col-span-4">
                        <label
                          htmlFor={`admin-variant-label-${idx}`}
                          className="block text-[11px] font-medium text-[#475569] mb-1"
                        >
                          Menu / Layanan #{idx + 1}
                        </label>
                        <input
                          id={`admin-variant-label-${idx}`}
                          type="text"
                          value={item.label}
                          onChange={(e) => handleUpdateVariantField(idx, 'label', e.target.value)}
                          placeholder="Contoh: Paket Nasi Liwet"
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:bg-white focus:border-[#0F2744]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label
                          htmlFor={`admin-variant-price-${idx}`}
                          className="block text-[11px] font-medium text-[#475569] mb-1"
                        >
                          Harga (Rp)
                        </label>
                        <input
                          id={`admin-variant-price-${idx}`}
                          type="number"
                          step="any"
                          value={item.price}
                          onChange={(e) => handleUpdateVariantField(idx, 'price', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm font-mono tabular-nums bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:bg-white focus:border-[#0F2744]"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label
                          htmlFor={`admin-variant-note-${idx}`}
                          className="block text-[11px] font-medium text-[#475569] mb-1"
                        >
                          Keterangan
                        </label>
                        <input
                          id={`admin-variant-note-${idx}`}
                          type="text"
                          value={item.availabilityNote}
                          onChange={(e) =>
                            handleUpdateVariantField(idx, 'availabilityNote', e.target.value)
                          }
                          placeholder="Tersedia"
                          className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-md focus:outline-none focus:bg-white focus:border-[#0F2744]"
                        />
                      </div>

                      <div className="md:col-span-3 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {item.image && (
                            <div className="relative w-8 h-8 rounded border border-[#E2E8F0] overflow-hidden shrink-0">
                              <ProductImage
                                src={item.image}
                                alt={`Foto ${item.label || `menu ${idx + 1}`}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleUpdateVariantField(idx, 'image', '')}
                                aria-label={`Hapus foto menu ${idx + 1}`}
                                className="absolute top-0 right-0 bg-[#0F2744]/85 text-white p-0.5 cursor-pointer"
                              >
                                <X className="w-2.5 h-2.5" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                          <label
                            htmlFor={`admin-variant-photo-${idx}`}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md cursor-pointer whitespace-nowrap"
                          >
                            <Upload className="w-3 h-3" aria-hidden="true" />
                            <span>{item.image ? 'Ganti' : 'Foto'}</span>
                          </label>
                          <input
                            id={`admin-variant-photo-${idx}`}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => void handleVariantPhotoUpload(idx, e)}
                            disabled={uploadingTarget !== null}
                            className="sr-only"
                          />
                        </div>

                        <div className="inline-flex items-center gap-1 shrink-0">
                          {(form.variants ?? []).length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleMoveVariantRow(idx, 'up')}
                                disabled={idx === 0}
                                aria-label={`Naikkan urutan menu ${idx + 1}`}
                                className="inline-flex items-center justify-center w-7 h-7 rounded border border-[#E2E8F0] text-[#475569] hover:text-[#0F2744] disabled:opacity-35 cursor-pointer"
                              >
                                <ArrowUp className="w-3 h-3" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveVariantRow(idx, 'down')}
                                disabled={idx === (form.variants ?? []).length - 1}
                                aria-label={`Turunkan urutan menu ${idx + 1}`}
                                className="inline-flex items-center justify-center w-7 h-7 rounded border border-[#E2E8F0] text-[#475569] hover:text-[#0F2744] disabled:opacity-35 cursor-pointer"
                              >
                                <ArrowDown className="w-3 h-3" aria-hidden="true" />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantRow(idx)}
                            disabled={(form.variants ?? []).length <= 1}
                            aria-label={`Hapus baris menu ${idx + 1}`}
                            className="inline-flex items-center justify-center w-7 h-7 rounded border border-[#E2E8F0] text-[#475569] hover:text-[#B91C1C] disabled:opacity-35 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#475569] hover:text-[#0F2744] border border-[#E2E8F0] rounded-lg cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-60 rounded-lg cursor-pointer whitespace-nowrap"
          >
            {isSaving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Simpan UMKM'}
          </button>
        </div>
      </form>
    </div>
  );
}
