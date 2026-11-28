import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CISAGA_VILLAGES,
  INITIAL_TESTIMONIALS,
  INITIAL_UMKM_LISTINGS,
} from '../data/cisagaData';
import type { UmkmListing } from '../types/umkm';
import {
  addAdminPhotoOption,
  buildUmkmAutoChatMessage,
  buildWhatsAppUrl,
  createAdminListingEntry,
  createFreeListingEntry,
  cycleListingStatus,
  deleteAdminPhotoOption,
  deleteListingById,
  filterAdminListings,
  filterAndSortListings,
  formatRupiah,
  getAdminPortalSummary,
  getCatalogInstantSuggestions,
  getListingAllImages,
  getMonthlyUmkmRegistrationTrend,
  getPremiumTopListings,
  getTestimonialStats,
  hasAnySocialLinks,
  isAuthorizedAdminEmail,
  isDeveloperAdminPath,
  isSafeUmkmImagePath,
  loadAdminPhotoOptions,
  normalizeSocialMediaLink,
  saveAdminPhotoOptions,
  splitTextByHighlight,
  toggleListingTier,
  updateAdminListingEntry,
  updateAdminPhotoOption,
  validateAdminSocialLinks,
  validateAdminUmkmForm,
  validateContactMessageForm,
  validateFreeRegistrationForm,
  validateTestimonialForm,
} from './umkmLogic';

const createSampleUmkmFixtures = (): UmkmListing[] => [
  {
    ...createAdminListingEntry({
      businessName: 'KUB Nira Lestari',
      ownerName: 'Pak Hendra',
      productName: 'Gula Aren Semut Organik',
      category: 'Agribisnis',
      village: 'Desa Bangunharja',
      whatsapp: '081211110001',
      tier: 'premium',
      status: 'Aktif',
      price: '32000',
      unitLabel: 'Kemasan 500g',
      shortDescription: 'Gula aren semut murni olahan petani penderes Desa Bangunharja.',
      image: '',
    }),
    id: 'gula-aren-bangunharja',
    createdAt: '2026-09-05',
  },
  {
    ...createAdminListingEntry({
      businessName: 'Batik Galuh Mekar',
      ownerName: 'Ibu Yanti',
      productName: 'Kain Batik Tulis Motif Cisaga',
      category: 'Busana',
      village: 'Desa Mekarmukti',
      whatsapp: '081211110002',
      tier: 'premium',
      status: 'Aktif',
      price: '185000',
      unitLabel: 'Lembar 2m',
      shortDescription: 'Batik tulis dan cap khas tatar Galuh dari perajin Desa Mekarmukti.',
      image: '',
    }),
    id: 'batik-ciamis-mekarmukti',
    createdAt: '2026-09-12',
  },
  {
    ...createAdminListingEntry({
      businessName: 'Sentra Promosi CISAGA HUB',
      ownerName: 'Kang Roni',
      productName: 'Paket Hantaran Oleh-Oleh Cisaga',
      category: 'Kuliner',
      village: 'Desa Cisaga',
      whatsapp: '081211110003',
      tier: 'premium',
      status: 'Aktif',
      price: '95000',
      unitLabel: 'Box Hantaran',
      shortDescription: 'Paket hantaran aneka produk unggulan pelaku usaha Kecamatan Cisaga.',
      image: '',
    }),
    id: 'hampers-karya-cisaga',
    createdAt: '2026-09-21',
  },
  {
    ...createAdminListingEntry({
      businessName: 'Dapur Ibu Enok',
      ownerName: 'Ibu Enok',
      productName: 'Sale Pisang Asap Renyah',
      category: 'Kuliner',
      village: 'Desa Wangunjaya',
      whatsapp: '081211110004',
      tier: 'reguler',
      status: 'Aktif',
      price: '20000',
      unitLabel: 'Pouch 250g',
      shortDescription: 'Sale pisang asap manis legit olahan rumahan Desa Wangunjaya.',
      image: '',
    }),
    id: 'sale-pisang-wangunjaya',
    createdAt: '2026-10-03',
  },
  {
    ...createAdminListingEntry({
      businessName: 'Kriya Bambu Tanjung',
      ownerName: 'Pak Ujang',
      productName: 'Anyaman Bambu Nampan & Besek',
      category: 'Kerajinan',
      village: 'Desa Tanjungjaya',
      whatsapp: '081211110005',
      tier: 'reguler',
      status: 'Aktif',
      price: '45000',
      unitLabel: 'Set 5 Pcs',
      shortDescription: 'Kerajinan anyaman bambu halus untuk kemasan makanan dan dekorasi.',
      image: '',
    }),
    id: 'anyaman-bambu-tanjungjaya',
    createdAt: '2026-10-11',
  },
  {
    ...createAdminListingEntry({
      businessName: 'Kopi Rakyat Kepel',
      ownerName: 'Mang Dede',
      productName: 'Kopi Robusta Sangrai Kepel',
      category: 'Agribisnis',
      village: 'Desa Kepel',
      whatsapp: '081211110006',
      tier: 'reguler',
      status: 'Aktif',
      price: '35000',
      unitLabel: 'Pouch 200g',
      shortDescription: 'Kopi robusta petik merah dataran tinggi Desa Kepel Kecamatan Cisaga.',
      image: '',
    }),
    id: 'kopi-kepel-cisaga',
    createdAt: '2026-10-20',
  },
];

test('getPremiumTopListings returns only active premium listings and featured sort places premium first', () => {
  const sampleListings = createSampleUmkmFixtures();
  const premium = getPremiumTopListings(sampleListings);
  assert.equal(premium.length, 3);
  assert.ok(premium.every((item) => item.tier === 'premium' && item.status === 'Aktif'));

  const sortedAll = filterAndSortListings(sampleListings, {
    category: 'Semua',
    tierFilter: 'all',
    village: 'Semua Desa',
    query: '',
    sortBy: 'featured',
  });
  assert.equal(sortedAll[0].tier, 'premium');
  assert.equal(sortedAll[2].tier, 'premium');
  assert.equal(sortedAll[3].tier, 'reguler');
});

test('admin tier toggle, status toggle, and delete update listings accurately', () => {
  const sampleListings = createSampleUmkmFixtures();
  const saleItem = sampleListings.find((i) => i.id === 'sale-pisang-wangunjaya')!;
  assert.equal(saleItem.tier, 'reguler');

  // Upgrade reguler to premium -> now appears in getPremiumTopListings
  const upgraded = toggleListingTier(sampleListings, saleItem.id);
  assert.equal(getPremiumTopListings(upgraded).length, 4);

  // Deactivate an active item -> excluded from public active premium list
  const deactivated = cycleListingStatus(upgraded, saleItem.id);
  assert.equal(getPremiumTopListings(deactivated).length, 3);

  // Delete removes item completely
  const afterDelete = deleteListingById(deactivated, saleItem.id);
  assert.equal(afterDelete.length, sampleListings.length - 1);
});

test('admin and free registration forms validate inputs and create proper tier entries', () => {
  const invalidAdmin = validateAdminUmkmForm({
    businessName: '',
    ownerName: 'A',
    productName: 'K',
    category: 'Kuliner',
    village: '',
    whatsapp: '123',
    tier: 'premium',
    status: 'Aktif',
    price: '',
    unitLabel: '',
    shortDescription: 'Pendek',
    image: '',
  });
  assert.ok(invalidAdmin.businessName);
  assert.ok(invalidAdmin.village);
  assert.ok(invalidAdmin.whatsapp);
  assert.ok(invalidAdmin.price);
  assert.ok(invalidAdmin.shortDescription);

  // Prices below Rp1.000 (e.g. 0, 500) and large values (e.g. 500000000) are valid without min/max caps
  for (const freePrice of ['0', '500', '500000000']) {
    const validAdminPrice = validateAdminUmkmForm({
      businessName: 'Opak Ketan Cisaga',
      ownerName: 'H. Rahmat',
      productName: 'Opak Bakar Khas Cisaga',
      category: 'Kuliner',
      village: 'Desa Cisaga',
      whatsapp: '081322445566',
      tier: 'premium',
      status: 'Aktif',
      price: freePrice,
      unitLabel: 'Bungkus 250g',
      shortDescription: 'Opak ketan gurih dibakar di atas bara arang kelapa tradisional.',
      image: '',
      variants: [
        {
          label: 'Kemasan Mini',
          price: freePrice,
          availabilityNote: 'Tersedia',
        },
      ],
    });
    assert.equal(validAdminPrice.price, undefined);
    assert.equal(validAdminPrice.variants, undefined);
  }

  const createdLowPrice = createAdminListingEntry({
    businessName: 'Jajanan Pasar Cisaga',
    ownerName: 'Ibu Imas',
    productName: 'Gorengan Satuan',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081322445566',
    tier: 'reguler',
    status: 'Aktif',
    price: '500',
    unitLabel: 'Per Pcs',
    shortDescription: 'Aneka gorengan hangat harian mulai harga satuan lima ratus rupiah.',
    image: '',
    variants: [
      { label: 'Bakwan Satuan', price: '500', availabilityNote: 'Ready' },
      { label: 'Gratis Tester', price: '0', availabilityNote: 'Promo' },
      { label: 'Paket Kemitraan Besar', price: '250000000', availabilityNote: 'Custom' },
    ],
  });
  assert.equal(createdLowPrice.price, 500);
  assert.equal(createdLowPrice.variants[0].price, 500);
  assert.equal(createdLowPrice.variants[1].price, 0);
  assert.equal(createdLowPrice.variants[2].price, 250000000);

  const createdAdmin = createAdminListingEntry({
    businessName: 'Opak Ketan Cisaga',
    ownerName: 'H. Rahmat',
    productName: 'Opak Bakar Khas Cisaga',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081322445566',
    tier: 'premium',
    status: 'Aktif',
    price: '25000',
    unitLabel: 'Bungkus 250g',
    shortDescription: 'Opak ketan gurih dibakar di atas bara arang kelapa tradisional.',
    image: '',
  });
  assert.equal(createdAdmin.tier, 'premium');
  assert.equal(createdAdmin.status, 'Aktif');
  assert.equal(createdAdmin.price, 25000);

  const invalidFree = validateFreeRegistrationForm({
    businessName: 'AB',
    ownerName: 'C',
    village: '',
    category: 'Kuliner',
    whatsapp: '081',
    signatureProduct: 'Ku',
    estimatedPrice: 'abc',
  });
  assert.ok(invalidFree.businessName);
  assert.ok(invalidFree.estimatedPrice);

  for (const freeEstimate of ['0', '100', '500', '350000000']) {
    const validFree = validateFreeRegistrationForm({
      businessName: 'Kerupuk Melarat Cisaga',
      ownerName: 'Ibu Nani',
      village: 'Desa Wangunjaya',
      category: 'Kuliner',
      whatsapp: '085211334455',
      signatureProduct: 'Kerupuk Pasir Warna',
      estimatedPrice: freeEstimate,
    });
    assert.equal(validFree.estimatedPrice, undefined);
  }

  const createdFree = createFreeListingEntry({
    businessName: 'Kerupuk Melarat Cisaga',
    ownerName: 'Ibu Nani',
    village: 'Desa Wangunjaya',
    category: 'Kuliner',
    whatsapp: '085211334455',
    signatureProduct: 'Kerupuk Pasir Warna',
    estimatedPrice: '500',
  });
  assert.equal(createdFree.tier, 'reguler');
  assert.equal(createdFree.status, 'Menunggu Verifikasi');
  assert.equal(createdFree.price, 500);
});

test('admin menu/service items and uploaded gallery photos are preserved and searchable', () => {
  const created = createAdminListingEntry({
    businessName: 'Warung Liwet Cisaga',
    ownerName: 'Teh Sari',
    productName: 'Aneka Masakan Sunda & Catering',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081234567890',
    tier: 'premium',
    status: 'Aktif',
    price: '22000',
    unitLabel: 'Paket Liwet Pribadi',
    shortDescription: 'Sajian liwet kastrol autentik dengan pilihan lauk dan paket prasmanan.',
    image: '/uploads/umkm-12345-abcdef.jpg',
    galleryImages: [
      '/uploads/umkm-12345-gallery1.png',
      'javascript:alert(1)', // unsafe URL must be ignored
    ],
    variants: [
      {
        label: 'Paket Nasi Liwet Ayam Bakar',
        price: '28000',
        availabilityNote: 'Tersedia Harian',
        image: '/uploads/umkm-12345-menu1.webp',
      },
      {
        label: 'Layanan Catering Rapat 20 Porsi',
        price: '450000',
        availabilityNote: 'Pre-order 1 Hari',
      },
    ],
  });

  assert.equal(created.image, '/uploads/umkm-12345-abcdef.jpg');
  assert.deepEqual(created.galleryImages, ['/uploads/umkm-12345-gallery1.png']);
  assert.equal(created.variants.length, 2);
  assert.equal(created.variants[1].label, 'Layanan Catering Rapat 20 Porsi');
  assert.equal(created.variants[1].price, 450000);

  const allPhotos = getListingAllImages(created);
  assert.deepEqual(allPhotos, [
    '/uploads/umkm-12345-abcdef.jpg',
    '/uploads/umkm-12345-gallery1.png',
    '/uploads/umkm-12345-menu1.webp',
  ]);

  // Search by menu/service name finds the listing
  const searchMatch = filterAndSortListings([created], {
    category: 'Semua',
    tierFilter: 'all',
    village: 'Semua Desa',
    query: 'Catering Rapat',
    sortBy: 'featured',
  });
  assert.equal(searchMatch.length, 1);

  // Updating listing preserves edited menu items
  const updated = updateAdminListingEntry(created, {
    businessName: created.businessName,
    ownerName: created.ownerName,
    productName: created.productName,
    category: created.category,
    village: created.village,
    whatsapp: created.whatsapp,
    tier: created.tier,
    status: created.status,
    price: '30000',
    unitLabel: 'Paket Nasi Liwet Ayam Bakar',
    shortDescription: created.shortDescription,
    image: created.image,
    galleryImages: [],
    variants: [
      { label: 'Paket Nasi Liwet Ayam Bakar', price: '30000', availabilityNote: 'Siap Antar' },
      { label: 'Jasa Nasi Box Syukuran', price: '25000', availabilityNote: 'Minimal 10 Box' },
      { label: 'Sambal Dadak Botolan', price: '18000', availabilityNote: 'Ready Stok' },
    ],
  });
  assert.equal(updated.variants.length, 3);
  assert.equal(updated.variants[2].label, 'Sambal Dadak Botolan');
});

test('formatRupiah and buildWhatsAppUrl format cleanly', () => {
  assert.equal(formatRupiah(165000), 'Rp165.000');
  assert.equal(
    buildWhatsAppUrl('0812-3456-7890', 'Tes'),
    'https://wa.me/6281234567890?text=Tes'
  );
  assert.equal(
    buildWhatsAppUrl('81234567890', 'Halo'),
    'https://wa.me/6281234567890?text=Halo'
  );
});

test('validateContactMessageForm validates name, email, optional whatsapp, subject, and message length', () => {
  const invalid = validateContactMessageForm({
    name: 'A',
    email: 'bukan-email',
    whatsapp: '123',
    subject: 'X',
    message: 'A',
  });
  assert.ok(invalid.name);
  assert.ok(invalid.email);
  assert.ok(invalid.whatsapp);
  assert.ok(invalid.subject);
  assert.ok(invalid.message);

  const missingEmail = validateContactMessageForm({
    name: 'Dede',
    email: '',
    whatsapp: '081234567890',
    subject: 'Pertanyaan Umum',
    message: 'Tes',
  });
  assert.ok(missingEmail.email);

  const validEmailOnly = validateContactMessageForm({
    name: 'Siti Rahma',
    email: 'siti@contoh.id',
    whatsapp: '',
    subject: 'Permintaan Kemitraan Produk',
    message: 'Halo admin',
  });
  assert.deepEqual(validEmailOnly, {});

  const validWithOptionalWhatsapp = validateContactMessageForm({
    name: 'Dede Kurniawan',
    email: 'dede@contoh.id',
    whatsapp: '81234567890',
    subject: 'Promosi UMKM Premium',
    message: 'Tes pesan singkat',
  });
  assert.deepEqual(validWithOptionalWhatsapp, {});
});

test('isDeveloperAdminPath grants admin view entry only on dedicated developer paths', () => {
  assert.equal(isDeveloperAdminPath('/'), false);
  assert.equal(isDeveloperAdminPath('/katalog'), false);
  assert.equal(isDeveloperAdminPath('/admin'), true);
  assert.equal(isDeveloperAdminPath('/admin/'), true);
  assert.equal(isDeveloperAdminPath('/portal-developer'), true);
});

test('getAdminPortalSummary calculates active UMKM, unread messages, and premium UMKM counts', () => {
  const pendingFree = createFreeListingEntry({
    businessName: 'Basreng Teh Ani',
    ownerName: 'Teh Ani',
    village: 'Desa Cisaga',
    category: 'Kuliner',
    whatsapp: '081211112222',
    signatureProduct: 'Basreng Pedas Daun Jeruk',
    estimatedPrice: '15000',
  });
  const inactivePremium = createAdminListingEntry({
    businessName: 'Batik Nonaktif',
    ownerName: 'Pak Dedi',
    productName: 'Kain Batik',
    category: 'Busana',
    village: 'Desa Mekarmukti',
    whatsapp: '081333334444',
    tier: 'premium',
    status: 'Nonaktif',
    price: '120000',
    unitLabel: 'Lembar',
    shortDescription: 'Batik tulis motif khas Cisaga untuk contoh status nonaktif.',
    image: '',
  });
  const baseFixtures = createSampleUmkmFixtures();
  const sampleListings = [...baseFixtures, pendingFree, inactivePremium];
  const sampleMessages = [
    {
      id: 'm1',
      name: 'Budi',
      email: 'budi@contoh.id',
      whatsapp: '081200000001',
      subject: 'Tanya Promo',
      message: 'Halo admin',
      status: 'unread' as const,
      created_at: '2026-11-26T00:00:00.000Z',
    },
    {
      id: 'm2',
      name: 'Sari',
      email: 'sari@contoh.id',
      whatsapp: '',
      subject: 'Kemitraan',
      message: 'Ingin bergabung',
      status: 'unread' as const,
      created_at: '2026-11-26T00:05:00.000Z',
    },
    {
      id: 'm3',
      name: 'Rudi',
      email: 'rudi@contoh.id',
      whatsapp: '',
      subject: 'Sudah Dibaca',
      message: 'Terima kasih',
      status: 'read' as const,
      created_at: '2026-11-25T10:00:00.000Z',
    },
  ];

  const summary = getAdminPortalSummary(sampleListings, sampleMessages);
  const expectedActive = baseFixtures.filter((item) => item.status === 'Aktif').length;
  const expectedPremium =
    baseFixtures.filter((item) => item.tier === 'premium').length + 1;

  assert.equal(summary.activeUmkmCount, expectedActive);
  assert.equal(summary.unreadMessagesCount, 2);
  assert.equal(summary.premiumUmkmCount, expectedPremium);

  const emptySummary = getAdminPortalSummary([], []);
  assert.deepEqual(emptySummary, {
    activeUmkmCount: 0,
    unreadMessagesCount: 0,
    premiumUmkmCount: 0,
  });
});

test('filterAdminListings performs real-time live search prioritizing businessName matches across tabs', () => {
  const customA = createAdminListingEntry({
    businessName: 'Saung Madu Cisaga',
    ownerName: 'Kang Asep',
    productName: 'Madu Hutan Murni',
    category: 'Agribisnis',
    village: 'Desa Danasari',
    whatsapp: '081277778888',
    tier: 'premium',
    status: 'Aktif',
    price: '75000',
    unitLabel: 'Botol 500ml',
    shortDescription: 'Madu hutan alami dari peternakan lebah Kecamatan Cisaga.',
    image: '',
  });
  const customB = createAdminListingEntry({
    businessName: 'Keripik Mak Enah',
    ownerName: 'Bu Enah',
    productName: 'Keripik Pisang Madu',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081299990000',
    tier: 'reguler',
    status: 'Aktif',
    price: '18000',
    unitLabel: 'Pouch 200g',
    shortDescription: 'Keripik pisang renyah dengan baluran madu manis alami.',
    image: '',
  });

  const combined = [customB, customA];

  // Live typing 'saung' matches businessName immediately
  const byBusinessPrefix = filterAdminListings(combined, 'all', 'sau');
  assert.equal(byBusinessPrefix.length, 1);
  assert.equal(byBusinessPrefix[0].businessName, 'Saung Madu Cisaga');

  // Typing 'madu' matches both, ranking businessName match ('Saung Madu Cisaga') ahead of productName match
  const rankedByBusinessName = filterAdminListings(combined, 'all', 'madu');
  assert.equal(rankedByBusinessName.length, 2);
  assert.equal(rankedByBusinessName[0].businessName, 'Saung Madu Cisaga');

  // Combining filterTab with live search query
  const regulerOnly = filterAdminListings(combined, 'reguler', 'madu');
  assert.equal(regulerOnly.length, 1);
  assert.equal(regulerOnly[0].businessName, 'Keripik Mak Enah');
});

test('getMonthlyUmkmRegistrationTrend aggregates monthly registrations continuously with tier counts', () => {
  const fixedNow = new Date('2026-11-26T00:00:00.000Z');
  const novEntry = {
    ...createAdminListingEntry({
      businessName: 'Kedai Kopi Baru',
      ownerName: 'Kang Dedi',
      productName: 'Kopi Tubruk Cisaga',
      category: 'Kuliner',
      village: 'Desa Cisaga',
      whatsapp: '081255556666',
      tier: 'premium',
      status: 'Aktif',
      price: '20000',
      unitLabel: 'Gelas',
      shortDescription: 'Kedai kopi lokal dengan sajian kopi robusta khas Kecamatan Cisaga.',
      image: '',
    }),
    createdAt: '2026-11-18',
  };

  const sampleFixtures = createSampleUmkmFixtures();
  const trend = getMonthlyUmkmRegistrationTrend([...sampleFixtures, novEntry], fixedNow);
  assert.equal(trend.length, 6);
  assert.equal(trend[0].monthKey, '2026-06');
  assert.equal(trend[trend.length - 1].monthKey, '2026-11');

  const sep = trend.find((p) => p.monthKey === '2026-09');
  const okt = trend.find((p) => p.monthKey === '2026-10');
  const nov = trend.find((p) => p.monthKey === '2026-11');
  assert.deepEqual(sep, {
    monthKey: '2026-09',
    monthLabel: 'Sep 2026',
    total: 3,
    premium: 3,
    reguler: 0,
  });
  assert.deepEqual(okt, {
    monthKey: '2026-10',
    monthLabel: 'Okt 2026',
    total: 3,
    premium: 0,
    reguler: 3,
  });
  assert.deepEqual(nov, {
    monthKey: '2026-11',
    monthLabel: 'Nov 2026',
    total: 1,
    premium: 1,
    reguler: 0,
  });

  const emptyTrend = getMonthlyUmkmRegistrationTrend([], fixedNow);
  assert.equal(emptyTrend.length, 6);
  assert.ok(emptyTrend.every((p) => p.total === 0));
});

test('validateTestimonialForm and getTestimonialStats validate inputs and compute published rating average', () => {
  const invalid = validateTestimonialForm({
    customerName: 'A',
    customerRole: '',
    umkmId: '',
    productPurchased: '',
    rating: 0,
    quote: 'Pendek',
    isPublished: true,
  });
  assert.ok(invalid.customerName);
  assert.ok(invalid.customerRole);
  assert.ok(invalid.umkmId);
  assert.ok(invalid.rating);
  assert.ok(invalid.quote);

  const valid = validateTestimonialForm({
    customerName: 'Rizky Pratama',
    customerRole: 'Pembeli · Ciamis',
    umkmId: 'gula-aren-bangunharja',
    productPurchased: 'Gula Aren Semut 500g',
    rating: 5,
    quote: 'Kualitas gula aren sangat baik, aromanya harum dan pengemasannya rapi.',
    isPublished: true,
  });
  assert.deepEqual(valid, {});

  const stats = getTestimonialStats([
    {
      id: 't1',
      customerName: 'Budi',
      customerRole: 'Pembeli',
      umkmId: 'gula-aren-bangunharja',
      umkmName: 'KUB Nira Lestari',
      productPurchased: 'Gula Semut',
      rating: 5,
      quote: 'Produk sangat memuaskan dan pengiriman cepat.',
      isPublished: true,
      createdAt: '2026-11-20',
    },
    {
      id: 't2',
      customerName: 'Ani',
      customerRole: 'Reseller',
      umkmId: 'batik-ciamis-mekarmukti',
      umkmName: 'Batik Galuh Mekar',
      productPurchased: 'Kain Batik',
      rating: 4,
      quote: 'Motif batiknya halus dan sangat diminati pelanggan kami.',
      isPublished: true,
      createdAt: '2026-11-22',
    },
    {
      id: 't3',
      customerName: 'Hidden Draft',
      customerRole: 'Draft',
      umkmId: 'sale-pisang-wangunjaya',
      umkmName: 'Dapur Ibu Enok',
      productPurchased: 'Sale Pisang',
      rating: 1,
      quote: 'Ulasan draft belum dipublikasikan ke halaman utama.',
      isPublished: false,
      createdAt: '2026-11-23',
    },
  ]);

  assert.equal(stats.total, 3);
  assert.equal(stats.publishedCount, 2);
  assert.equal(stats.averageRating, 4.5);
});

test('getCatalogInstantSuggestions returns ranked live results by product, business, variant, and village', () => {
  const sampleListings = createSampleUmkmFixtures();
  assert.deepEqual(getCatalogInstantSuggestions(sampleListings, '   '), []);
  assert.deepEqual(getCatalogInstantSuggestions([], 'gula'), []);

  const gulaMatches = getCatalogInstantSuggestions(sampleListings, 'gula', 4);
  assert.ok(gulaMatches.length >= 1);
  assert.equal(gulaMatches[0].listing.id, 'gula-aren-bangunharja');
  assert.equal(gulaMatches[0].matchField, 'Produk');

  const villageMatches = getCatalogInstantSuggestions(sampleListings, 'Mekarmukti', 6);
  assert.ok(villageMatches.length >= 1);
  assert.ok(villageMatches.every((entry) => entry.listing.status === 'Aktif'));
  assert.ok(villageMatches.some((entry) => entry.matchField === 'Desa'));

  const limited = getCatalogInstantSuggestions(sampleListings, 'Desa', 2);
  assert.equal(limited.length, 2);
});

test('splitTextByHighlight safely splits case-insensitive query matches without HTML', () => {
  assert.deepEqual(splitTextByHighlight('Gula Aren Semut Asli', ''), [
    { text: 'Gula Aren Semut Asli', highlight: false },
  ]);

  assert.deepEqual(splitTextByHighlight('Gula Aren Semut Asli', 'aren'), [
    { text: 'Gula ', highlight: false },
    { text: 'Aren', highlight: true },
    { text: ' Semut Asli', highlight: false },
  ]);

  assert.deepEqual(splitTextByHighlight('Kopi Cisaga & Kopi Tubruk', 'kopi'), [
    { text: 'Kopi', highlight: true },
    { text: ' Cisaga & ', highlight: false },
    { text: 'Kopi', highlight: true },
    { text: ' Tubruk', highlight: false },
  ]);
});

test('isAuthorizedAdminEmail authorizes verified owner and heriadi0907@gmail.com only', () => {
  assert.equal(isAuthorizedAdminEmail('herzz@smkn2banjar-jabar.sch.id', true), true);
  assert.equal(isAuthorizedAdminEmail('HERIADI0907@GMAIL.COM', true), true);
  assert.equal(isAuthorizedAdminEmail('heriadi0907@gmail.com', false), false);
  assert.equal(isAuthorizedAdminEmail('other@gmail.com', true), false);
  assert.equal(isAuthorizedAdminEmail(null, true), false);
});

test('INITIAL_UMKM_LISTINGS and INITIAL_TESTIMONIALS start empty while all 11 Cisaga villages have zero base count', () => {
  assert.equal(INITIAL_UMKM_LISTINGS.length, 0);
  assert.equal(INITIAL_TESTIMONIALS.length, 0);
  assert.equal(CISAGA_VILLAGES.length, 11);

  for (const village of CISAGA_VILLAGES) {
    assert.ok(village.name.startsWith('Desa '));
    assert.equal(village.baseUmkmCount, 0);
    assert.ok(village.coordinatesLabel.length > 0);
  }
});

test('normalizeSocialMediaLink, validateAdminSocialLinks, and hasAnySocialLinks normalize handles and block XSS URLs', () => {
  assert.equal(
    normalizeSocialMediaLink('instagram', '@kedai.cisaga').value,
    'https://instagram.com/kedai.cisaga'
  );
  assert.equal(
    normalizeSocialMediaLink('tiktok', 'kopi_cisaga').value,
    'https://www.tiktok.com/@kopi_cisaga'
  );
  assert.equal(
    normalizeSocialMediaLink('facebook', 'toko.cisaga').value,
    'https://www.facebook.com/toko.cisaga'
  );
  assert.equal(
    normalizeSocialMediaLink('website', 'umkmcisaga.id').value,
    'https://umkmcisaga.id/'
  );

  assert.ok(normalizeSocialMediaLink('instagram', 'javascript:alert(1)').error);
  assert.ok(normalizeSocialMediaLink('website', 'data:text/html,<script>').error);
  assert.ok(normalizeSocialMediaLink('facebook', 'nama dengan spasi').error);
  assert.ok(normalizeSocialMediaLink('website', 'tanpadomain').error);

  const validSet = validateAdminSocialLinks({
    instagram: '@batik_cisaga',
    website: 'https://batikcisaga.id/katalog',
    facebook: '',
  });
  assert.deepEqual(validSet.errors, {});
  assert.equal(validSet.links.instagram, 'https://instagram.com/batik_cisaga');
  assert.equal(validSet.links.website, 'https://batikcisaga.id/katalog');
  assert.equal(validSet.links.facebook, undefined);

  assert.equal(hasAnySocialLinks(validSet.links), true);
  assert.equal(hasAnySocialLinks({}), false);
  assert.equal(hasAnySocialLinks(undefined), false);
});

test('buildUmkmAutoChatMessage renders fallback and custom template placeholders accurately', () => {
  const defaultMsg = buildUmkmAutoChatMessage(
    {
      businessName: 'Saung Liwet',
      productName: 'Nasi Liwet Kastrol',
      village: 'Desa Cisaga',
      unitLabel: 'Paket 4 Orang',
      whatsappAutoMessage: '',
    },
    'Paket Liwet Komplit'
  );
  assert.match(defaultMsg, /Saung Liwet/);
  assert.match(defaultMsg, /Paket Liwet Komplit/);
  assert.match(defaultMsg, /CISAGA HUB/);

  const customMsg = buildUmkmAutoChatMessage(
    {
      businessName: 'Kedai Kopi Cisaga',
      productName: 'Kopi Robusta Asli',
      village: 'Desa Bangunharja',
      unitLabel: 'Kemasan 250g',
      whatsappAutoMessage: 'Halo {usaha} ({desa}), saya ingin pesan {menu} - {produk}.',
    },
    'Giling Halus 500g'
  );
  assert.equal(
    customMsg,
    'Halo Kedai Kopi Cisaga (Desa Bangunharja), saya ingin pesan Giling Halus 500g - Kopi Robusta Asli.'
  );
});

test('isSafeUmkmImagePath accepts compressed base64 raster uploads and rejects SVG or HTML payloads', () => {
  const validPng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const validJpeg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/';
  const validWebp = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';

  assert.equal(isSafeUmkmImagePath(validPng), true);
  assert.equal(isSafeUmkmImagePath(validJpeg), true);
  assert.equal(isSafeUmkmImagePath(validWebp), true);
  assert.equal(isSafeUmkmImagePath('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='), false);
  assert.equal(isSafeUmkmImagePath('data:text/html;base64,PHNjcmlwdD4='), false);
  assert.equal(isSafeUmkmImagePath('javascript:alert(1)'), false);
});

test('validateAdminUmkmForm, createAdminListingEntry, and updateAdminListingEntry handle whatsappAutoMessage, socialLinks, and base64 photos', () => {
  const invalidSocial = validateAdminUmkmForm({
    businessName: 'Usaha Valid',
    ownerName: 'Pak Valid',
    productName: 'Produk Valid',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081234567890',
    whatsappAutoMessage: 'Halo {usaha}',
    socialLinks: { instagram: 'javascript:alert(1)' },
    tier: 'reguler',
    status: 'Aktif',
    price: '15000',
    unitLabel: 'Porsi',
    shortDescription: 'Deskripsi produk minimal sepuluh karakter aman.',
    image: '',
  });
  assert.ok(invalidSocial.socialLinks);

  const validPng =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const created = createAdminListingEntry({
    businessName: 'Warung Sambal Cisaga',
    ownerName: 'Ibu Neng',
    productName: 'Sambal Terasi Asli',
    category: 'Kuliner',
    village: 'Desa Sidamulya',
    whatsapp: '0813-2200-1122',
    whatsappAutoMessage: 'Halo {usaha}, mau pesan {menu} ya.',
    socialLinks: {
      instagram: '@warungsambal.cisaga',
      tiktok: 'warungsambal',
    },
    tier: 'premium',
    status: 'Aktif',
    price: '25000',
    unitLabel: 'Toples 200g',
    shortDescription: 'Sambal rumahan pedas nikmat khas Desa Sidamulya Kecamatan Cisaga.',
    image: validPng,
    variants: [
      {
        label: 'Toples 200g Original',
        price: '25000',
        availabilityNote: 'Ready Stok',
        image: validPng,
      },
    ],
  });

  assert.equal(created.whatsapp, '081322001122');
  assert.equal(created.whatsappAutoMessage, 'Halo {usaha}, mau pesan {menu} ya.');
  assert.deepEqual(created.socialLinks, {
    instagram: 'https://instagram.com/warungsambal.cisaga',
    tiktok: 'https://www.tiktok.com/@warungsambal',
  });
  assert.equal(created.image, validPng);
  assert.equal(created.variants[0].image, validPng);

  const cleared = updateAdminListingEntry(created, {
    businessName: created.businessName,
    ownerName: created.ownerName,
    productName: created.productName,
    category: created.category,
    village: created.village,
    whatsapp: '085299887766',
    whatsappAutoMessage: '',
    socialLinks: {
      instagram: '',
      tiktok: '',
      facebook: 'warungsambal.cisaga',
    },
    tier: 'reguler',
    status: 'Aktif',
    price: '27000',
    unitLabel: 'Toples 200g',
    shortDescription: created.shortDescription,
    image: validPng,
    variants: created.variants.map((v) => ({
      id: v.id,
      label: v.label,
      price: '27000',
      availabilityNote: v.availabilityNote,
      image: v.image,
    })),
  });

  assert.equal(cleared.whatsapp, '085299887766');
  assert.equal(cleared.whatsappAutoMessage, '');
  assert.deepEqual(cleared.socialLinks, {
    facebook: 'https://www.facebook.com/warungsambal.cisaga',
  });
});

test('admin photo options default to empty and support add, edit, delete, persistence, and safe upload paths', () => {
  const store = new Map<string, string>();
  const mockStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
  };

  // Defaults to empty array (no forced hardcoded presets)
  assert.deepEqual(loadAdminPhotoOptions(mockStorage), []);

  // Rejects unsafe/external URLs
  const badUrl = addAdminPhotoOption([], 'Opsi Bahaya', 'javascript:alert(1)');
  assert.ok(badUrl.error);
  assert.equal(badUrl.options.length, 0);
  assert.equal(isSafeUmkmImagePath('https://evil.example/x.png'), false);

  // Accepts safe uploaded raster path
  const added = addAdminPhotoOption([], 'Foto Toko Utama', '/uploads/umkm-101-toko.jpg');
  assert.equal(added.error, undefined);
  assert.equal(added.options.length, 1);
  assert.equal(added.options[0].label, 'Foto Toko Utama');

  // Edit existing option label & uploaded photo path
  const edited = updateAdminPhotoOption(
    added.options,
    added.options[0].id,
    'Foto Etalase Baru',
    '/uploads/umkm-102-etalase.webp'
  );
  assert.equal(edited.error, undefined);
  assert.equal(edited.options[0].label, 'Foto Etalase Baru');
  assert.equal(edited.options[0].url, '/uploads/umkm-102-etalase.webp');

  saveAdminPhotoOptions(edited.options, mockStorage);
  assert.equal(loadAdminPhotoOptions(mockStorage).length, 1);
  assert.equal(loadAdminPhotoOptions(mockStorage)[0].label, 'Foto Etalase Baru');

  // Delete option returns empty list
  const remaining = deleteAdminPhotoOption(edited.options, edited.options[0].id);
  assert.deepEqual(remaining, []);

  // Empty image stays empty when creating or clearing a listing
  const createdEmpty = createAdminListingEntry({
    businessName: 'Usaha Tanpa Foto',
    ownerName: 'Pak Budi',
    productName: 'Jasa Jahit Cisaga',
    category: 'Busana',
    village: 'Desa Cisaga',
    whatsapp: '081234567890',
    tier: 'reguler',
    status: 'Aktif',
    price: '35000',
    unitLabel: 'Per Potong',
    shortDescription: 'Layanan jahit pakaian rapi dan cepat di Desa Cisaga.',
    image: '',
  });
  assert.equal(createdEmpty.image, '');

  const invalidImageForm = validateAdminUmkmForm({
    businessName: 'Usaha Valid',
    ownerName: 'Pak Valid',
    productName: 'Produk Valid',
    category: 'Kuliner',
    village: 'Desa Cisaga',
    whatsapp: '081234567890',
    tier: 'reguler',
    status: 'Aktif',
    price: '15000',
    unitLabel: 'Porsi',
    shortDescription: 'Deskripsi produk minimal sepuluh karakter aman.',
    image: 'javascript:alert(1)',
  });
  assert.ok(invalidImageForm.image);
});

