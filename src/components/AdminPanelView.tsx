import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Check,
  CheckCheck,
  Edit3,
  Eye,
  Inbox,
  LogOut,
  Mail,
  MessageCircle,
  MessageSquareQuote,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type {
  AdminUmkmFormData,
  ContactMessage,
  ContactMessageStatus,
  CustomerTestimonial,
  CustomerTestimonialFormData,
  SocialPlatform,
  UmkmListing,
  VillageInfo,
} from '../types/umkm';
import {
  type AdminFilterTab,
  buildWhatsAppUrl,
  filterAdminListings,
  formatContactDate,
  formatRupiah,
  getAdminPortalSummary,
  getContactStatusLabel,
  getListingAllImages,
  hasAnySocialLinks,
  isValidEmailAddress,
  validateAdminSocialLinks,
  validateAdminUmkmForm,
} from '../utils/umkmLogic';
import { AdminTestimonialsTab } from './AdminTestimonialsTab';
import { AdminUmkmForm } from './AdminUmkmForm';
import { ProductImage } from './ProductImage';
import { UmkmRegistrationTrendChart } from './UmkmRegistrationTrendChart';

interface AdminPanelViewProps {
  adminUsername: string;
  listings: UmkmListing[];
  messages: ContactMessage[];
  testimonials: CustomerTestimonial[];
  villages: VillageInfo[];
  onCreateListing: (data: AdminUmkmFormData) => Promise<void>;
  onUpdateListing: (id: string, data: AdminUmkmFormData) => Promise<void>;
  onUploadImage: (file: File) => Promise<string>;
  onToggleTier: (id: string) => Promise<void>;
  onCycleStatus: (id: string) => Promise<void>;
  onDeleteListing: (id: string) => Promise<void>;
  onDeleteAllListings: () => Promise<void>;
  onUpdateMessageStatus: (id: string, status: ContactMessageStatus) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  onRefreshMessages: () => Promise<void>;
  onCreateTestimonial: (data: CustomerTestimonialFormData) => Promise<void>;
  onToggleTestimonialPublish: (id: string) => Promise<void>;
  onDeleteTestimonial: (id: string) => Promise<void>;
  onLogout: () => Promise<void>;
}

type AdminWorkspaceTab = 'umkm' | 'messages' | 'testimonials';

const createEmptyForm = (): AdminUmkmFormData => ({
  businessName: '',
  ownerName: '',
  productName: '',
  category: 'Kuliner',
  village: '',
  whatsapp: '',
  whatsappAutoMessage: '',
  socialLinks: {
    instagram: '',
    facebook: '',
    tiktok: '',
    website: '',
  },
  tier: 'reguler',
  status: 'Aktif',
  price: '25000',
  unitLabel: 'Kemasan 250g',
  shortDescription: '',
  image: '',
  galleryImages: [],
  variants: [
    {
      label: 'Paket / Menu Utama',
      price: '25000',
      availabilityNote: 'Tersedia Harian',
    },
  ],
});

export function AdminPanelView({
  adminUsername,
  listings,
  messages,
  testimonials,
  villages,
  onCreateListing,
  onUpdateListing,
  onUploadImage,
  onToggleTier,
  onCycleStatus,
  onDeleteListing,
  onDeleteAllListings,
  onUpdateMessageStatus,
  onDeleteMessage,
  onRefreshMessages,
  onCreateTestimonial,
  onToggleTestimonialPublish,
  onDeleteTestimonial,
  onLogout,
}: AdminPanelViewProps) {
  const [workspaceTab, setWorkspaceTab] = useState<AdminWorkspaceTab>('umkm');
  const [messageFilter, setMessageFilter] = useState<'all' | ContactMessageStatus>('all');
  const [messageSearch, setMessageSearch] = useState<string>('');
  const [messageSortOrder, setMessageSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [confirmDeleteMessageId, setConfirmDeleteMessageId] = useState<string | null>(null);
  const [isRefreshingMessages, setIsRefreshingMessages] = useState<boolean>(false);

  const [filterTab, setFilterTab] = useState<AdminFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(() => listings.length === 0);
  const [hasDismissedEmptyForm, setHasDismissedEmptyForm] = useState(false);
  const [showTrendChart, setShowTrendChart] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminUmkmFormData>(() => createEmptyForm());
  const [errors, setErrors] = useState<Partial<Record<keyof AdminUmkmFormData, string>>>({});
  const [socialErrors, setSocialErrors] = useState<Partial<Record<SocialPlatform, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const formPanelRef = useRef<HTMLDivElement>(null);

  // Open the simple Add UMKM form automatically if portal starts empty
  useEffect(() => {
    if (listings.length === 0 && !hasDismissedEmptyForm && !editingId) {
      setIsFormOpen(true);
    }
  }, [listings.length, hasDismissedEmptyForm, editingId]);

  const portalSummary = useMemo(
    () => getAdminPortalSummary(listings, messages),
    [listings, messages]
  );

  const messageStats = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((m) => m.status === 'unread').length;
    const read = messages.filter((m) => m.status === 'read').length;
    const replied = messages.filter((m) => m.status === 'replied').length;
    return { total, unread, read, replied };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const q = messageSearch.trim().toLowerCase();
    const list = messages.filter((m) => {
      if (messageFilter !== 'all' && m.status !== messageFilter) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
    return [...list].sort((a, b) => {
      const diff = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return messageSortOrder === 'newest' ? diff : -diff;
    });
  }, [messages, messageFilter, messageSearch, messageSortOrder]);

  const selectedMessage = useMemo(
    () => (selectedMessageId ? messages.find((m) => m.id === selectedMessageId) ?? null : null),
    [messages, selectedMessageId]
  );

  const handleOpenMessageDetail = (msg: ContactMessage) => {
    setSelectedMessageId(msg.id);
    if (msg.status === 'unread') {
      void onUpdateMessageStatus(msg.id, 'read');
    }
  };

  useEffect(() => {
    if (!selectedMessageId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedMessageId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMessageId]);

  const filteredRows = useMemo(
    () => filterAdminListings(listings, filterTab, searchQuery),
    [listings, filterTab, searchQuery]
  );

  const scrollToFormPanel = () => {
    window.requestAnimationFrame(() => {
      formPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(createEmptyForm());
    setErrors({});
    setSocialErrors({});
    setSubmitError(null);
    setUploadError(null);
    setIsFormOpen(true);
    scrollToFormPanel();
  };

  const openEditForm = (item: UmkmListing) => {
    setEditingId(item.id);
    setForm({
      businessName: item.businessName,
      ownerName: item.ownerName,
      productName: item.productName,
      category: item.category,
      village: item.village,
      whatsapp: item.whatsapp,
      whatsappAutoMessage: item.whatsappAutoMessage ?? '',
      socialLinks: {
        instagram: item.socialLinks?.instagram ?? '',
        facebook: item.socialLinks?.facebook ?? '',
        tiktok: item.socialLinks?.tiktok ?? '',
        website: item.socialLinks?.website ?? '',
      },
      tier: item.tier,
      status: item.status,
      price: String(item.price),
      unitLabel: item.unitLabel,
      shortDescription: item.shortDescription,
      image: item.image,
      galleryImages: item.galleryImages ?? [],
      variants:
        item.variants.length > 0
          ? item.variants.map((v) => ({
              id: v.id,
              label: v.label,
              price: String(v.price),
              availabilityNote: v.availabilityNote,
              image: v.image,
            }))
          : [
              {
                label: item.unitLabel || 'Kemasan Standar',
                price: String(item.price),
                availabilityNote: 'Tersedia',
              },
            ],
    });
    setErrors({});
    setSocialErrors({});
    setSubmitError(null);
    setUploadError(null);
    setIsFormOpen(true);
    scrollToFormPanel();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    if (listings.length === 0) {
      setHasDismissedEmptyForm(true);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const validationErrors = validateAdminUmkmForm(form);
    const socialValidation = validateAdminSocialLinks(form.socialLinks);
    setSocialErrors(socialValidation.errors);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await onUpdateListing(editingId, form);
      } else {
        await onCreateListing(form);
      }
      setIsFormOpen(false);
      setEditingId(null);
      setHasDismissedEmptyForm(false);
      setForm(createEmptyForm());
      setErrors({});
      setSocialErrors({});
      setUploadError(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Gagal menyimpan data UMKM.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      await onDeleteAllListings();
      setConfirmDeleteAll(false);
      setEditingId(null);
      setHasDismissedEmptyForm(false);
      setIsFormOpen(true);
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <section
      data-testid="admin-panel-view"
      className="py-5 sm:py-6 max-w-[1200px] mx-auto px-4 sm:px-6 space-y-4"
    >
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#E2E8F0]">
        <div>
          <p className="text-xs font-semibold text-[#C2410C] mb-1">
            Portal Admin CISAGA HUB ({adminUsername})
          </p>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2744] tracking-tight">
            Kelola UMKM Kecamatan Cisaga
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            data-testid="admin-open-create-btn"
            onClick={() => {
              setWorkspaceTab('umkm');
              openCreateForm();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Tambah UMKM</span>
          </button>

          <button
            type="button"
            onClick={() => void onLogout()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[#475569] hover:text-[#B91C1C] bg-white border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Single Clean Summary Strip (4 Metrics) */}
      <div
        data-testid="admin-summary-cards"
        aria-label="Ringkasan portal CISAGA HUB"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3"
      >
        <div className="bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5">
          <p className="text-xs text-[#64748B]">Total UMKM</p>
          <p
            data-testid="admin-metric-total"
            className="font-mono tabular-nums text-2xl font-bold text-[#0F2744] mt-0.5"
          >
            {listings.length}
          </p>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl px-3.5 py-2.5">
          <p className="text-xs text-[#64748B]">Aktif di Katalog</p>
          <p
            data-testid="summary-active-umkm"
            className="font-mono tabular-nums text-2xl font-bold text-[#047857] mt-0.5"
          >
            {portalSummary.activeUmkmCount}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setWorkspaceTab('umkm');
            setFilterTab('premium');
          }}
          className="text-left bg-white border border-[#E2E8F0] hover:border-[#EA580C]/50 rounded-xl px-3.5 py-2.5 transition-colors cursor-pointer"
        >
          <p className="text-xs text-[#64748B]">UMKM Premium</p>
          <p
            data-testid="summary-premium-umkm"
            className="font-mono tabular-nums text-2xl font-bold text-[#EA580C] mt-0.5"
          >
            {portalSummary.premiumUmkmCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => {
            setWorkspaceTab('messages');
            setMessageFilter('unread');
          }}
          className="text-left bg-white border border-[#E2E8F0] hover:border-[#EA580C]/50 rounded-xl px-3.5 py-2.5 transition-colors cursor-pointer"
        >
          <p className="text-xs text-[#64748B]">Pesan Belum Dibaca</p>
          <p
            data-testid="summary-unread-messages"
            className="font-mono tabular-nums text-2xl font-bold text-[#0F2744] mt-0.5"
          >
            {portalSummary.unreadMessagesCount}
          </p>
        </button>
      </div>

      {/* Workspace Tabs */}
      <div
        role="tablist"
        aria-label="Bagian portal admin"
        className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg"
      >
        <button
          type="button"
          role="tab"
          aria-selected={workspaceTab === 'umkm'}
          onClick={() => setWorkspaceTab('umkm')}
          className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            workspaceTab === 'umkm'
              ? 'bg-[#0F2744] text-white shadow-xs'
              : 'text-[#475569] hover:text-[#0F2744]'
          }`}
        >
          Data UMKM ({listings.length})
        </button>

        <button
          type="button"
          role="tab"
          data-testid="admin-tab-messages"
          aria-selected={workspaceTab === 'messages'}
          onClick={() => {
            setWorkspaceTab('messages');
            setIsRefreshingMessages(true);
            void onRefreshMessages().finally(() => setIsRefreshingMessages(false));
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            workspaceTab === 'messages'
              ? 'bg-[#0F2744] text-white shadow-xs'
              : 'text-[#475569] hover:text-[#0F2744]'
          }`}
        >
          <Inbox className="w-4 h-4" aria-hidden="true" />
          <span>Kotak Masuk ({messages.length})</span>
          {messageStats.unread > 0 && (
            <span
              data-testid="admin-unread-badge"
              className={`font-mono tabular-nums text-[11px] px-1.5 py-0.5 rounded ${
                workspaceTab === 'messages'
                  ? 'bg-[#EA580C] text-white'
                  : 'bg-[#EA580C]/15 text-[#C2410C]'
              }`}
            >
              {messageStats.unread}
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          data-testid="admin-tab-testimonials"
          aria-selected={workspaceTab === 'testimonials'}
          onClick={() => setWorkspaceTab('testimonials')}
          className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            workspaceTab === 'testimonials'
              ? 'bg-[#0F2744] text-white shadow-xs'
              : 'text-[#475569] hover:text-[#0F2744]'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4" aria-hidden="true" />
          <span>Testimoni ({testimonials.length})</span>
        </button>
      </div>

      {workspaceTab === 'testimonials' ? (
        <AdminTestimonialsTab
          listings={listings}
          testimonials={testimonials}
          onCreateTestimonial={onCreateTestimonial}
          onTogglePublish={onToggleTestimonialPublish}
          onDeleteTestimonial={onDeleteTestimonial}
        />
      ) : workspaceTab === 'messages' ? (
        <div data-testid="admin-messages-view" className="space-y-4">
          {/* Inbox Filter + Search + Sort + Refresh */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Filter status pesan masuk"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg w-fit"
            >
              {(
                [
                  { id: 'all', label: `Semua (${messageStats.total})` },
                  { id: 'unread', label: `Belum Dibaca (${messageStats.unread})` },
                  { id: 'read', label: `Sudah Dibaca (${messageStats.read})` },
                  { id: 'replied', label: `Sudah Dibalas (${messageStats.replied})` },
                ] as const
              ).map((tab) => {
                const active = messageFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setMessageFilter(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'bg-[#0F2744] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#0F2744]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <label htmlFor="admin-message-search" className="sr-only">
                  Cari pesan masuk
                </label>
                <Search
                  className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-message-search"
                  type="search"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="Cari nama, email, subjek..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744]"
                />
              </div>

              <select
                aria-label="Urutkan pesan berdasarkan tanggal"
                value={messageSortOrder}
                onChange={(e) =>
                  setMessageSortOrder(e.target.value === 'oldest' ? 'oldest' : 'newest')
                }
                className="px-3 py-2 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744] cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
              </select>

              <button
                type="button"
                disabled={isRefreshingMessages}
                onClick={() => {
                  setIsRefreshingMessages(true);
                  void onRefreshMessages().finally(() => setIsRefreshingMessages(false));
                }}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium text-[#0F2744] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshingMessages ? 'animate-spin' : ''}`}
                  aria-hidden="true"
                />
                <span>Muat Ulang</span>
              </button>
            </div>
          </div>

          {/* Messages List */}
          {filteredMessages.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 text-center">
              <p className="font-display text-lg font-bold text-[#0F2744] mb-1">
                Belum ada pesan pada filter ini
              </p>
              <p className="text-sm text-[#475569]">
                Pesan yang dikirim pengunjung melalui formulir Hubungi Saya akan langsung muncul di
                sini secara otomatis.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => {
                const hasWhatsapp = msg.whatsapp.replace(/[^0-9]/g, '').length > 0;
                const replyWaUrl = hasWhatsapp
                  ? buildWhatsAppUrl(
                      msg.whatsapp,
                      `Halo ${msg.name}, kami dari pengelola CISAGA HUB menanggapi pesan Anda terkait "${msg.subject}".`
                    )
                  : '';
                const hasValidEmail = Boolean(msg.email && isValidEmailAddress(msg.email));

                return (
                  <article
                    key={msg.id}
                    data-testid={`admin-message-row-${msg.id}`}
                    className={`bg-white border rounded-xl p-4 sm:p-5 space-y-3 ${
                      msg.status === 'unread' ? 'border-[#EA580C]/50' : 'border-[#E2E8F0]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#475569] mb-1">
                          <span
                            className={`font-semibold ${
                              msg.status === 'unread'
                                ? 'text-[#C2410C]'
                                : msg.status === 'replied'
                                  ? 'text-[#047857]'
                                  : 'text-[#0F2744]'
                            }`}
                          >
                            {getContactStatusLabel(msg.status)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#0F2744]">{msg.subject}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {formatContactDate(msg.created_at)}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#0F2744]">{msg.name}</h3>
                        <p className="text-xs text-[#475569] mt-0.5 font-mono tabular-nums">
                          {hasValidEmail ? `Email: ${msg.email}` : ''}
                          {hasValidEmail && hasWhatsapp ? ' · ' : ''}
                          {hasWhatsapp ? `WA: ${msg.whatsapp}` : ''}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenMessageDetail(msg)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Lihat Detail</span>
                        </button>

                        {hasWhatsapp && (
                          <a
                            href={replyWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-md transition-colors whitespace-nowrap"
                          >
                            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Balas WA</span>
                          </a>
                        )}

                        {hasValidEmail && (
                          <a
                            href={`mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent(`Balasan CISAGA HUB: ${msg.subject}`)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md transition-colors whitespace-nowrap"
                          >
                            <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Balas Email</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-[#0F2744] leading-relaxed whitespace-pre-line line-clamp-3">
                      {msg.message}
                    </p>

                    <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {msg.status === 'unread' && (
                          <button
                            type="button"
                            onClick={() => void onUpdateMessageStatus(msg.id, 'read')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0F2744] bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-md cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Tandai Dibaca</span>
                          </button>
                        )}
                        {msg.status !== 'replied' && (
                          <button
                            type="button"
                            onClick={() => void onUpdateMessageStatus(msg.id, 'replied')}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#047857] bg-[#047857]/10 hover:bg-[#047857]/15 border border-[#047857]/30 rounded-md cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Tandai Sudah Dibalas</span>
                          </button>
                        )}
                        <select
                          aria-label={`Ubah status pesan dari ${msg.name}`}
                          value={msg.status}
                          onChange={(e) =>
                            void onUpdateMessageStatus(
                              msg.id,
                              e.target.value as ContactMessageStatus
                            )
                          }
                          className="px-2.5 py-1.5 text-xs font-medium text-[#0F2744] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md cursor-pointer"
                        >
                          <option value="unread">Belum Dibaca</option>
                          <option value="read">Sudah Dibaca</option>
                          <option value="replied">Sudah Dibalas</option>
                        </select>
                      </div>

                      {confirmDeleteMessageId === msg.id ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              void onDeleteMessage(msg.id);
                              setConfirmDeleteMessageId(null);
                              if (selectedMessageId === msg.id) setSelectedMessageId(null);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded cursor-pointer"
                          >
                            Ya, Hapus
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteMessageId(null)}
                            className="px-2 py-1 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteMessageId(msg.id)}
                          aria-label={`Hapus pesan dari ${msg.name}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#475569] hover:text-[#B91C1C] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Message Detail Modal */}
          {selectedMessage && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-message-detail-title"
              data-testid="admin-message-detail-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2744]/50 backdrop-blur-xs"
            >
              <div className="bg-white border border-[#E2E8F0] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 shadow-xl">
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-semibold text-[#C2410C] mb-1">
                      Detail Pesan Pengunjung
                    </p>
                    <h2
                      id="admin-message-detail-title"
                      className="font-display text-xl font-bold text-[#0F2744]"
                    >
                      {selectedMessage.subject}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMessageId(null)}
                    aria-label="Tutup detail pesan"
                    className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] text-[#475569] hover:text-[#0F2744] cursor-pointer"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs">
                  <div>
                    <p className="text-[#475569]">Pengirim</p>
                    <p className="font-semibold text-[#0F2744] text-sm mt-0.5">
                      {selectedMessage.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#475569]">Tanggal Dikirim</p>
                    <p className="font-mono tabular-nums text-[#0F2744] mt-0.5">
                      {formatContactDate(selectedMessage.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#475569]">Email</p>
                    <p className="font-mono text-[#0F2744] mt-0.5">{selectedMessage.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[#475569]">Nomor WhatsApp</p>
                    <p className="font-mono tabular-nums text-[#0F2744] mt-0.5">
                      {selectedMessage.whatsapp || '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#475569] mb-2">Isi Pesan Lengkap</p>
                  <div className="p-4 bg-white border border-[#E2E8F0] rounded-lg text-sm text-[#0F2744] leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor="detail-status-select"
                      className="text-xs font-semibold text-[#475569]"
                    >
                      Status:
                    </label>
                    <select
                      id="detail-status-select"
                      value={selectedMessage.status}
                      onChange={(e) =>
                        void onUpdateMessageStatus(
                          selectedMessage.id,
                          e.target.value as ContactMessageStatus
                        )
                      }
                      className="px-3 py-1.5 text-xs font-semibold text-[#0F2744] bg-[#F8FAFC] border border-[#E2E8F0] rounded-md cursor-pointer"
                    >
                      <option value="unread">Belum Dibaca</option>
                      <option value="read">Sudah Dibaca</option>
                      <option value="replied">Sudah Dibalas</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {selectedMessage.whatsapp.replace(/[^0-9]/g, '').length > 0 && (
                      <a
                        href={buildWhatsAppUrl(
                          selectedMessage.whatsapp,
                          `Halo ${selectedMessage.name}, kami dari pengelola CISAGA HUB menanggapi pesan Anda terkait "${selectedMessage.subject}".`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-md transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Balas WA</span>
                      </a>
                    )}
                    {selectedMessage.email && isValidEmailAddress(selectedMessage.email) && (
                      <a
                        href={`mailto:${encodeURIComponent(selectedMessage.email)}?subject=${encodeURIComponent(`Balasan CISAGA HUB: ${selectedMessage.subject}`)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Balas Email</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void onDeleteMessage(selectedMessage.id);
                        setSelectedMessageId(null);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#B91C1C] bg-[#B91C1C]/5 hover:bg-[#B91C1C]/10 border border-[#B91C1C]/30 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Streamlined Add / Edit UMKM Form */}
          {isFormOpen && (
            <div ref={formPanelRef}>
              <AdminUmkmForm
                form={form}
                editingId={editingId}
                villages={villages}
                errors={errors}
                socialErrors={socialErrors}
                submitError={submitError}
                uploadError={uploadError}
                uploadingTarget={uploadingTarget}
                isSaving={isSaving}
                onUpdateForm={setForm}
                onClearError={(field) => setErrors((prev) => ({ ...prev, [field]: undefined }))}
                onClearSocialError={(platform) =>
                  setSocialErrors((prev) => ({ ...prev, [platform]: undefined }))
                }
                onSetUploadError={setUploadError}
                onSetUploadingTarget={setUploadingTarget}
                onUploadImage={onUploadImage}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
              />
            </div>
          )}

          {/* Filter, Live Search, Chart Toggle & Bulk Delete Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Filter daftar admin UMKM"
              className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg w-fit"
            >
              {(
                [
                  { id: 'all', label: 'Semua' },
                  { id: 'premium', label: 'Premium' },
                  { id: 'reguler', label: 'Reguler' },
                  { id: 'pending', label: 'Menunggu' },
                ] as const
              ).map((tab) => {
                const active = filterTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilterTab(tab.id)}
                    className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-[#0F2744] text-white shadow-xs'
                        : 'text-[#475569] hover:text-[#0F2744]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <label htmlFor="admin-search" className="sr-only">
                  Cari UMKM berdasarkan nama usaha secara langsung
                </label>
                <Search
                  className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="admin-search"
                  data-testid="admin-live-search"
                  type="text"
                  autoComplete="off"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama usaha..."
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0F2744]"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    data-testid="admin-search-clear"
                    aria-label="Hapus pencarian nama usaha"
                    onClick={() => setSearchQuery('')}
                    className="w-6 h-6 inline-flex items-center justify-center rounded text-[#64748B] hover:text-[#0F2744] absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>

              <button
                type="button"
                data-testid="admin-toggle-trend-chart"
                aria-expanded={showTrendChart}
                onClick={() => setShowTrendChart((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  showTrendChart
                    ? 'bg-[#0F2744] text-white border-[#0F2744]'
                    : 'bg-white text-[#0F2744] border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <BarChart3 className="w-4 h-4" aria-hidden="true" />
                <span>Grafik Tren</span>
              </button>

              {listings.length > 0 &&
                (confirmDeleteAll ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      data-testid="admin-confirm-delete-all"
                      disabled={isDeletingAll}
                      onClick={() => void handleConfirmDeleteAll()}
                      className="px-3 py-2 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] disabled:opacity-60 rounded-lg whitespace-nowrap cursor-pointer"
                    >
                      {isDeletingAll ? 'Menghapus...' : `Ya, Hapus Semua (${listings.length})`}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteAll(false)}
                      className="px-2.5 py-2 text-xs font-medium text-[#475569] bg-white border border-[#E2E8F0] rounded-lg cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    data-testid="admin-delete-all-btn"
                    onClick={() => setConfirmDeleteAll(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-[#B91C1C] bg-white hover:bg-[#B91C1C]/5 border border-[#E2E8F0] hover:border-[#B91C1C]/30 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span>Hapus Semua</span>
                  </button>
                ))}
            </div>
          </div>

          {showTrendChart && <UmkmRegistrationTrendChart listings={listings} />}

          {/* Clean Management Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden">
            {filteredRows.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-display text-lg font-bold text-[#0F2744] mb-1">
                  {listings.length === 0
                    ? 'Belum ada data UMKM'
                    : 'Tidak ada data UMKM pada filter ini'}
                </p>
                <p className="text-sm text-[#475569] mb-4">
                  {listings.length === 0
                    ? 'Silakan isi formulir Tambah UMKM di atas untuk mulai menampilkan usaha lokal Cisaga.'
                    : searchQuery.trim()
                      ? `Tidak ditemukan UMKM dengan nama "${searchQuery.trim()}".`
                      : 'Ubah filter atau tambahkan UMKM baru.'}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {(searchQuery.trim() !== '' || filterTab !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterTab('all');
                      }}
                      className="px-4 py-2 text-sm font-semibold text-[#0F2744] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] rounded-lg cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                  {!isFormOpen && (
                    <button
                      type="button"
                      onClick={openCreateForm}
                      className="px-4 py-2 text-sm font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg cursor-pointer"
                    >
                      Tambah UMKM Baru
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#475569]">
                      <th className="py-2.5 px-3.5">Usaha &amp; Produk</th>
                      <th className="py-2.5 px-3.5">Desa &amp; Kategori</th>
                      <th className="py-2.5 px-3.5 text-right">Harga</th>
                      <th className="py-2.5 px-3.5">Paket</th>
                      <th className="py-2.5 px-3.5">Status</th>
                      <th className="py-2.5 px-3.5 text-right">Kelola</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-sm">
                    {filteredRows.map((item) => {
                      const isPremium = item.tier === 'premium';
                      const isPending = item.status === 'Menunggu Verifikasi';
                      const isActive = item.status === 'Aktif';

                      return (
                        <tr
                          key={item.id}
                          data-testid={`admin-row-${item.id}`}
                          className="hover:bg-[#F8FAFC]/80 transition-colors"
                        >
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E8F0] bg-[#F1F5F9] shrink-0">
                                <ProductImage
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-[#0F2744] truncate max-w-[230px]">
                                  {item.businessName}
                                </p>
                                <p className="text-xs text-[#475569] truncate max-w-[230px]">
                                  {item.productName} · {item.ownerName}
                                </p>
                                <p className="text-[11px] text-[#64748B] font-mono tabular-nums mt-0.5">
                                  {item.whatsapp}
                                  {item.variants.length > 1
                                    ? ` · ${item.variants.length} menu`
                                    : ''}
                                  {getListingAllImages(item).length > 1
                                    ? ` · ${getListingAllImages(item).length} foto`
                                    : ''}
                                  {hasAnySocialLinks(item.socialLinks) ? ' · Sosmed' : ''}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <p className="text-[#0F2744] font-medium">{item.village}</p>
                            <p className="text-xs text-[#64748B]">{item.category}</p>
                          </td>

                          <td className="py-2.5 px-3.5 text-right font-mono tabular-nums font-medium text-[#0F2744] whitespace-nowrap">
                            {formatRupiah(item.price)}
                          </td>

                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => void onToggleTier(item.id)}
                              aria-label={
                                isPremium
                                  ? `Turunkan ${item.businessName} ke Reguler Free`
                                  : `Jadikan ${item.businessName} sebagai Premium`
                              }
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border cursor-pointer ${
                                isPremium
                                  ? 'border-[#EA580C]/40 bg-[#EA580C]/10 text-[#C2410C]'
                                  : 'border-[#E2E8F0] bg-white text-[#475569] hover:text-[#0F2744]'
                              }`}
                            >
                              {isPremium ? (
                                <ArrowDown className="w-3 h-3" aria-hidden="true" />
                              ) : (
                                <ArrowUp className="w-3 h-3 text-[#EA580C]" aria-hidden="true" />
                              )}
                              <span>{isPremium ? 'Premium' : 'Reguler'}</span>
                            </button>
                          </td>

                          <td className="py-2.5 px-3.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => void onCycleStatus(item.id)}
                              aria-label={`Ubah status publikasi ${item.businessName}, saat ini ${item.status}`}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded border cursor-pointer ${
                                isActive
                                  ? 'border-[#047857]/30 bg-[#047857]/10 text-[#047857]'
                                  : isPending
                                    ? 'border-[#EA580C]/30 bg-[#EA580C]/10 text-[#C2410C]'
                                    : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#475569]'
                              }`}
                            >
                              {isActive && <Check className="w-3 h-3" aria-hidden="true" />}
                              <span>{item.status}</span>
                            </button>
                          </td>

                          <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                            {confirmDeleteId === item.id ? (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    void onDeleteListing(item.id);
                                    setConfirmDeleteId(null);
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-white bg-[#B91C1C] hover:bg-[#991B1B] rounded cursor-pointer"
                                >
                                  Ya, Hapus
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="px-2 py-1 text-xs font-medium text-[#475569] border border-[#E2E8F0] rounded cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(item)}
                                  aria-label={`Edit ${item.businessName}`}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#0F2744] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] rounded-md cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(item.id)}
                                  aria-label={`Hapus ${item.businessName}`}
                                  className="inline-flex items-center justify-center w-8 h-8 text-[#475569] hover:text-[#B91C1C] border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] rounded-md cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
