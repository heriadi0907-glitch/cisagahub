import { ArrowUpRight, Bookmark, Check, Eye, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  ProductCategory,
  SavedPromoItem,
  SortOption,
  UmkmListing,
  UmkmTier,
} from '../types/umkm';
import {
  formatRupiah,
  getCatalogInstantSuggestions,
  getStartingPrice,
  isListingSaved,
  splitTextByHighlight,
} from '../utils/umkmLogic';
import { ProductImage } from './ProductImage';

interface CatalogSectionProps {
  listings: UmkmListing[];
  allActiveListings?: UmkmListing[];
  totalActiveCount: number;
  savedItems: SavedPromoItem[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  tierFilter: 'all' | UmkmTier;
  onSelectTierFilter: (tier: 'all' | UmkmTier) => void;
  selectedVillage: string;
  onResetVillage: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetAll: () => void;
  onSelectListing: (listing: UmkmListing) => void;
  onToggleSave: (listing: UmkmListing) => void;
}

const CATEGORIES: ProductCategory[] = ['Semua', 'Kuliner', 'Kerajinan', 'Agribisnis', 'Busana'];

const POPULAR_SEARCH_HINTS = ['Gula Aren', 'Batik', 'Kopi', 'Sale Pisang', 'Anyaman'];

function HighlightedText({ text, query }: { text: string; query: string }) {
  const segments = splitTextByHighlight(text, query);
  return (
    <>
      {segments.map((segment, idx) =>
        segment.highlight ? (
          <mark
            key={`${idx}-${segment.text}`}
            className="bg-[#FDBA74]/50 text-[#0F2744] rounded-xs px-0.5"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${idx}-${segment.text}`}>{segment.text}</span>
        )
      )}
    </>
  );
}

export function CatalogSection({
  listings,
  allActiveListings,
  totalActiveCount,
  savedItems,
  selectedCategory,
  onSelectCategory,
  tierFilter,
  onSelectTierFilter,
  selectedVillage,
  onResetVillage,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onResetAll,
  onSelectListing,
  onToggleSave,
}: CatalogSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeOptionIndex, setActiveOptionIndex] = useState(-1);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = searchQuery.trim();
  const hasActiveScopeFilters =
    selectedCategory !== 'Semua' || tierFilter !== 'all' || selectedVillage !== 'Semua Desa';

  const instantSuggestions = useMemo(
    () => getCatalogInstantSuggestions(listings, trimmedQuery, 6),
    [listings, trimmedQuery]
  );

  const crossFilterSuggestions = useMemo(() => {
    if (!allActiveListings || instantSuggestions.length > 0 || trimmedQuery === '') {
      return [];
    }
    return getCatalogInstantSuggestions(allActiveListings, trimmedQuery, 4);
  }, [allActiveListings, instantSuggestions.length, trimmedQuery]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setActiveOptionIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelectSuggestion = (listing: UmkmListing) => {
    setIsDropdownOpen(false);
    setActiveOptionIndex(-1);
    onSelectListing(listing);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    setActiveOptionIndex(-1);
    searchInputRef.current?.focus();
    setIsDropdownOpen(true);
  };

  const handleExpandSearchScope = () => {
    onSelectCategory('Semua');
    onSelectTierFilter('all');
    if (selectedVillage !== 'Semua Desa') {
      onResetVillage();
    }
    setActiveOptionIndex(-1);
  };

  const handleSearchInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setActiveOptionIndex(-1);
      return;
    }

    if (trimmedQuery === '' || instantSuggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsDropdownOpen(true);
      setActiveOptionIndex((prev) =>
        prev < instantSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsDropdownOpen(true);
      setActiveOptionIndex((prev) =>
        prev > 0 ? prev - 1 : instantSuggestions.length - 1
      );
    } else if (event.key === 'Enter' && activeOptionIndex >= 0) {
      const chosen = instantSuggestions[activeOptionIndex];
      if (chosen) {
        event.preventDefault();
        handleSelectSuggestion(chosen.listing);
      }
    }
  };

  const activeDescendantId =
    isDropdownOpen && activeOptionIndex >= 0 && instantSuggestions[activeOptionIndex]
      ? `catalog-instant-option-${instantSuggestions[activeOptionIndex].listing.id}`
      : undefined;

  return (
    <section id="katalog" className="scroll-mt-16 py-14 sm:py-20 bg-[#F8FAFC]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-[#C2410C] mb-2">
              Katalog Produk &amp; Kategori UMKM · CISAGA HUB
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0F2744] tracking-tight">
              Semua UMKM &amp; Produk Unggulan Cisaga
            </h2>
          </div>
          <p className="text-sm text-[#475569] tabular-nums">
            Menampilkan <span className="font-semibold text-[#0F2744]">{listings.length}</span> dari{' '}
            {totalActiveCount} etalase aktif
          </p>
        </div>

        {/* Interactive Filter & Instant Search Bar */}
        <div className="pb-6 mb-8 border-b border-[#E2E8F0] space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="tablist"
                aria-label="Filter kategori produk"
                className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F1F5F9] rounded-lg w-fit border border-[#E2E8F0]"
              >
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onSelectCategory(category)}
                      className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2744] ${
                        isActive
                          ? 'bg-[#0F2744] text-white shadow-xs'
                          : 'text-[#475569] hover:text-[#0F2744]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div>
                <label htmlFor="catalog-tier-filter" className="sr-only">
                  Filter paket promosi
                </label>
                <select
                  id="catalog-tier-filter"
                  value={tierFilter}
                  onChange={(e) => onSelectTierFilter(e.target.value as 'all' | UmkmTier)}
                  className="pl-3 pr-8 py-2 text-xs sm:text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744] focus:ring-1 focus:ring-[#0F2744] cursor-pointer"
                >
                  <option value="all">Paket: Semua</option>
                  <option value="premium">Paket: Premium</option>
                  <option value="reguler">Paket: Reguler (Free)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {selectedVillage !== 'Semua Desa' && (
                <button
                  type="button"
                  onClick={onResetVillage}
                  aria-label={`Hapus filter desa ${selectedVillage}`}
                  className="inline-flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium bg-[#0F2744]/10 text-[#0F2744] hover:bg-[#0F2744]/15 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Filter: {selectedVillage}</span>
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}

              <div
                ref={searchWrapperRef}
                data-testid="catalog-instant-search-wrapper"
                className="relative flex-1 sm:w-72"
              >
                <label htmlFor="catalog-search" className="sr-only">
                  Cari produk, nama usaha, menu, atau desa
                </label>
                <Search
                  className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  ref={searchInputRef}
                  id="catalog-search"
                  type="text"
                  role="combobox"
                  aria-expanded={isDropdownOpen}
                  aria-controls="catalog-instant-results"
                  aria-autocomplete="list"
                  aria-activedescendant={activeDescendantId}
                  value={searchQuery}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    setIsDropdownOpen(true);
                    setActiveOptionIndex(-1);
                  }}
                  onKeyDown={handleSearchInputKeyDown}
                  placeholder="Cari produk, usaha, menu, desa..."
                  className="w-full pl-9 pr-9 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] placeholder:text-[#475569]/70 focus:outline-none focus:border-[#0F2744] focus:ring-1 focus:ring-[#0F2744]"
                />
                {searchQuery.length > 0 && (
                  <button
                    type="button"
                    data-testid="catalog-search-clear"
                    onClick={handleClearSearch}
                    aria-label="Hapus kata kunci pencarian"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#64748B] hover:text-[#0F2744] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}

                {/* Instant Search Dropdown */}
                {isDropdownOpen && (
                  <div
                    id="catalog-instant-results"
                    data-testid="catalog-instant-results"
                    role="listbox"
                    aria-label="Hasil pencarian cepat UMKM"
                    className="absolute left-0 right-0 sm:left-auto sm:right-0 sm:w-[400px] mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-30 overflow-hidden"
                  >
                    {trimmedQuery === '' ? (
                      <div className="p-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#64748B] mb-2.5">
                          Pencarian Cepat Populer
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {POPULAR_SEARCH_HINTS.map((hint) => (
                            <button
                              key={hint}
                              type="button"
                              onClick={() => {
                                onSearchChange(hint);
                                setIsDropdownOpen(true);
                                setActiveOptionIndex(-1);
                                searchInputRef.current?.focus();
                              }}
                              className="px-2.5 py-1.5 text-xs font-medium text-[#0F2744] bg-[#F8FAFC] hover:bg-[#0F2744] hover:text-white border border-[#E2E8F0] rounded-md transition-colors cursor-pointer"
                            >
                              {hint}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : instantSuggestions.length > 0 ? (
                      <div>
                        <div className="px-3.5 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-2 text-[11px] text-[#475569]">
                          <span className="tabular-nums">
                            <strong className="text-[#0F2744]">{listings.length}</strong> etalase
                            cocok untuk &ldquo;{trimmedQuery}&rdquo;
                          </span>
                          <span className="text-[#64748B] hidden sm:inline">Esc untuk tutup</span>
                        </div>
                        <ul className="max-h-80 overflow-y-auto divide-y divide-[#F1F5F9]">
                          {instantSuggestions.map((suggestion, index) => {
                            const { listing, matchField, matchedLabel } = suggestion;
                            const isActive = index === activeOptionIndex;
                            const startingPrice = getStartingPrice(listing);
                            return (
                              <li key={listing.id}>
                                <button
                                  id={`catalog-instant-option-${listing.id}`}
                                  type="button"
                                  role="option"
                                  aria-selected={isActive}
                                  onMouseEnter={() => setActiveOptionIndex(index)}
                                  onClick={() => handleSelectSuggestion(listing)}
                                  className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 transition-colors cursor-pointer ${
                                    isActive ? 'bg-[#F1F5F9]' : 'hover:bg-[#F8FAFC]'
                                  }`}
                                >
                                  <div className="w-11 h-11 rounded-md overflow-hidden bg-[#F1F5F9] border border-[#E2E8F0] shrink-0">
                                    <ProductImage
                                      src={listing.image}
                                      alt={listing.productName}
                                      fallbackTitle={listing.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="text-xs sm:text-sm font-semibold text-[#0F2744] truncate">
                                        <HighlightedText
                                          text={listing.productName}
                                          query={trimmedQuery}
                                        />
                                      </p>
                                      <span className="font-mono tabular-nums text-xs font-semibold text-[#0F2744] shrink-0">
                                        {formatRupiah(startingPrice)}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#475569] truncate">
                                      <HighlightedText
                                        text={listing.businessName}
                                        query={trimmedQuery}
                                      />
                                      {' · '}
                                      <HighlightedText
                                        text={listing.village}
                                        query={trimmedQuery}
                                      />
                                    </p>
                                    {(matchField === 'Menu/Varian' || matchField === 'Pemilik') && (
                                      <p className="text-[11px] text-[#C2410C] truncate mt-0.5">
                                        Cocok di {matchField}:{' '}
                                        <HighlightedText
                                          text={matchedLabel}
                                          query={trimmedQuery}
                                        />
                                      </p>
                                    )}
                                  </div>
                                  <ArrowUpRight
                                    className="w-4 h-4 text-[#64748B] shrink-0"
                                    aria-hidden="true"
                                  />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                        {listings.length > instantSuggestions.length && (
                          <div className="px-3.5 py-2 bg-[#F8FAFC] border-t border-[#E2E8F0] text-[11px] text-[#475569] flex items-center justify-between">
                            <span>
                              Menampilkan {instantSuggestions.length} teratas di daftar cepat
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(false)}
                              className="font-semibold text-[#0F2744] hover:underline cursor-pointer"
                            >
                              Lihat semua {listings.length} di katalog
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3.5 space-y-2.5">
                        <p className="text-xs text-[#475569]">
                          Tidak ditemukan hasil untuk{' '}
                          <strong className="text-[#0F2744]">&ldquo;{trimmedQuery}&rdquo;</strong>
                          {hasActiveScopeFilters ? ' pada filter kategori/desa aktif' : ''}.
                        </p>
                        {crossFilterSuggestions.length > 0 ? (
                          <div className="pt-2 border-t border-[#F1F5F9] space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-semibold text-[#C2410C]">
                                Tersedia di kategori/desa lain:
                              </span>
                              <button
                                type="button"
                                onClick={handleExpandSearchScope}
                                className="text-[11px] font-semibold text-[#0F2744] hover:underline cursor-pointer"
                              >
                                Buka semua kategori
                              </button>
                            </div>
                            <ul className="space-y-1">
                              {crossFilterSuggestions.map(({ listing }) => (
                                <li key={listing.id}>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectSuggestion(listing)}
                                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#F8FAFC] flex items-center justify-between gap-2 text-xs cursor-pointer"
                                  >
                                    <span className="font-medium text-[#0F2744] truncate">
                                      <HighlightedText
                                        text={listing.productName}
                                        query={trimmedQuery}
                                      />{' '}
                                      <span className="text-[#64748B] font-normal">
                                        · {listing.category}
                                      </span>
                                    </span>
                                    <span className="font-mono text-[11px] text-[#475569] shrink-0">
                                      {formatRupiah(getStartingPrice(listing))}
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="text-xs font-semibold text-[#0F2744] hover:underline cursor-pointer"
                          >
                            Hapus kata kunci
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="catalog-sort" className="sr-only">
                  Urutkan etalase
                </label>
                <select
                  id="catalog-sort"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value as SortOption)}
                  className="w-full sm:w-auto pl-3 pr-8 py-2 text-sm bg-white border border-[#E2E8F0] rounded-lg text-[#0F2744] focus:outline-none focus:border-[#0F2744] focus:ring-1 focus:ring-[#0F2744] cursor-pointer"
                >
                  <option value="featured">Urutan: Premium Teratas</option>
                  <option value="price-asc">Kisaran: Terendah</option>
                  <option value="price-desc">Kisaran: Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {trimmedQuery !== '' && (
            <div
              data-testid="catalog-search-status"
              role="status"
              aria-live="polite"
              className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-white border border-[#E2E8F0] rounded-lg text-xs text-[#475569]"
            >
              <span>
                Pencarian instan untuk{' '}
                <strong className="text-[#0F2744]">&ldquo;{trimmedQuery}&rdquo;</strong> —{' '}
                <strong className="text-[#0F2744] tabular-nums">{listings.length}</strong> etalase
                ditemukan
              </span>
              <div className="flex items-center gap-3">
                {listings.length === 0 && hasActiveScopeFilters && (
                  <button
                    type="button"
                    onClick={handleExpandSearchScope}
                    className="font-semibold text-[#C2410C] hover:underline cursor-pointer"
                  >
                    Cari di semua kategori
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('');
                    setActiveOptionIndex(-1);
                  }}
                  className="font-semibold text-[#0F2744] hover:underline cursor-pointer"
                >
                  Hapus pencarian
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Product Showcase Grid or Empty State */}
        {listings.length === 0 ? (
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-10 text-center max-w-lg mx-auto">
            <h3 className="font-display text-lg font-semibold text-[#0F2744] mb-2">
              Etalase tidak ditemukan
            </h3>
            <p className="text-sm text-[#475569] mb-6">
              {trimmedQuery !== ''
                ? `Tidak ada UMKM atau produk Cisaga yang cocok dengan kata kunci "${trimmedQuery}".`
                : 'Tidak ada UMKM atau produk Cisaga yang cocok dengan filter yang sedang aktif.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {trimmedQuery !== '' && hasActiveScopeFilters && (
                <button
                  type="button"
                  onClick={handleExpandSearchScope}
                  className="px-4 py-2 text-sm font-medium text-[#0F2744] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors cursor-pointer"
                >
                  Cari di Semua Kategori
                </button>
              )}
              <button
                type="button"
                onClick={onResetAll}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0F2744] hover:bg-[#0B1E36] rounded-lg transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          </div>
        ) : (
          <div
            data-testid="product-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3.5"
          >
            {listings.map((listing) => {
              const startingPrice = getStartingPrice(listing);
              const saved = isListingSaved(savedItems, listing.id);
              const isPremium = listing.tier === 'premium';

              return (
                <article
                  key={listing.id}
                  data-testid={`product-card-${listing.id}`}
                  className="group bg-white border border-[#E2E8F0] rounded-lg overflow-hidden flex flex-col transition-transform duration-150 hover:-translate-y-0.5 hover:border-[#CBD5E1]"
                >
                  <div className="aspect-[4/3] bg-[#F1F5F9] overflow-hidden border-b border-[#E2E8F0]">
                    <ProductImage
                      src={listing.image}
                      alt={listing.productName}
                      fallbackTitle={listing.productName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-3 sm:p-3.5 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 text-[11px] leading-tight text-[#475569] mb-1.5 min-w-0">
                      <span
                        className={`shrink-0 ${
                          isPremium
                            ? 'font-semibold text-[#C2410C]'
                            : 'font-medium text-[#475569]'
                        }`}
                      >
                        {isPremium ? 'Premium' : 'Reguler'}
                      </span>
                      <span aria-hidden="true" className="shrink-0">
                        ·
                      </span>
                      <span className="font-semibold text-[#0F2744] shrink-0">
                        {listing.category}
                      </span>
                      <span aria-hidden="true" className="shrink-0">
                        ·
                      </span>
                      <span className="truncate">
                        <HighlightedText text={listing.village} query={trimmedQuery} />
                      </span>
                    </div>

                    <h3 className="text-[13px] sm:text-sm font-semibold text-[#0F2744] leading-snug line-clamp-2 mb-1">
                      <HighlightedText text={listing.productName} query={trimmedQuery} />
                    </h3>
                    <p className="text-[11px] text-[#475569] truncate mb-2">
                      <HighlightedText text={listing.businessName} query={trimmedQuery} />
                      {listing.variants.length > 1
                        ? ` · ${listing.variants.length} Menu`
                        : ''}
                    </p>
                    <p className="text-xs text-[#475569] leading-relaxed line-clamp-2 mb-3 flex-1">
                      <HighlightedText text={listing.shortDescription} query={trimmedQuery} />
                    </p>

                    <div className="pt-2.5 border-t border-[#E2E8F0] space-y-2">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] text-[#475569]">Mulai</span>
                        <span className="font-mono tabular-nums text-sm font-semibold text-[#0F2744]">
                          {formatRupiah(startingPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectListing(listing)}
                          aria-label={`Lihat profil dan detail ${listing.productName}`}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-medium text-[#0F2744] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] rounded-md transition-colors whitespace-nowrap cursor-pointer min-h-[36px]"
                        >
                          <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span>Detail</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleSave(listing)}
                          aria-pressed={saved}
                          aria-label={
                            saved
                              ? `Hapus ${listing.productName} dari daftar tersimpan`
                              : `Simpan ${listing.productName} ke daftar minat`
                          }
                          className={`inline-flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer min-h-[36px] ${
                            saved
                              ? 'bg-[#0F2744]/10 text-[#0F2744] border border-[#0F2744]/30 hover:bg-[#0F2744]/15'
                              : 'text-white bg-[#0F2744] hover:bg-[#0B1E36]'
                          }`}
                        >
                          {saved ? (
                            <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          ) : (
                            <Bookmark className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          )}
                          <span className="hidden xl:inline">
                            {saved ? 'Disimpan' : 'Simpan'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
