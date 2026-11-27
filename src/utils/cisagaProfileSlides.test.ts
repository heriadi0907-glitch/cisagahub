import assert from 'node:assert/strict';
import test from 'node:test';
import { CISAGA_VILLAGES, INITIAL_UMKM_LISTINGS } from '../data/cisagaData';
import { createAdminListingEntry } from './umkmLogic';
import { buildCisagaProfileSlides, getNextSlideIndex } from './cisagaProfileSlides';

const EXPECTED_11_VILLAGES = [
  'Desa Bangunharja',
  'Desa Cisaga',
  'Desa Danasari',
  'Desa Girimukti',
  'Desa Karyamulya',
  'Desa Kepel',
  'Desa Mekarmukti',
  'Desa Sidamulya',
  'Desa Sukahurip',
  'Desa Tanjungjaya',
  'Desa Wangunjaya',
];

test('buildCisagaProfileSlides creates overview slide plus all 11 Cisaga villages with dynamic counts', () => {
  assert.equal(CISAGA_VILLAGES.length, 11);
  for (const villageName of EXPECTED_11_VILLAGES) {
    assert.ok(
      CISAGA_VILLAGES.some((v) => v.name === villageName),
      `Expected ${villageName} in CISAGA_VILLAGES`
    );
  }

  const emptySlides = buildCisagaProfileSlides(CISAGA_VILLAGES, INITIAL_UMKM_LISTINGS, 0);

  assert.equal(emptySlides.length, 12);
  assert.equal(emptySlides[0].id, 'wilayah-kecamatan-cisaga');
  assert.equal(emptySlides[0].indexLabel, '01');
  assert.equal(emptySlides[0].umkmCount, 0);
  assert.match(emptySlides[0].subtitle, /11 Desa Terhubung/);
  assert.equal(emptySlides[0].villageFilterTarget, null);

  const cisagaCenterSlide = emptySlides.find((s) => s.villageFilterTarget === 'Desa Cisaga');
  assert.ok(cisagaCenterSlide);
  assert.match(cisagaCenterSlide.subtitle, /Pusat Pemerintahan/i);

  const emptyBangunharja = emptySlides.find((s) => s.villageFilterTarget === 'Desa Bangunharja');
  assert.ok(emptyBangunharja);
  assert.equal(emptyBangunharja.shortLabel, 'Bangunharja');
  assert.equal(emptyBangunharja.umkmCount, 0);

  const activeBangunharja = createAdminListingEntry({
    businessName: 'Saung Nira Bangunharja',
    ownerName: 'Pak Hendra',
    productName: 'Gula Semut Organik',
    category: 'Agribisnis',
    village: 'Desa Bangunharja',
    whatsapp: '081211112222',
    tier: 'premium',
    status: 'Aktif',
    price: '32000',
    unitLabel: 'Kemasan 500g',
    shortDescription: 'Gula aren semut alami khas petani Desa Bangunharja.',
    image: '',
  });
  const activeSlides = buildCisagaProfileSlides(CISAGA_VILLAGES, [activeBangunharja], 1);
  assert.equal(activeSlides[0].umkmCount, 1);
  assert.equal(
    activeSlides.find((s) => s.villageFilterTarget === 'Desa Bangunharja')?.umkmCount,
    1
  );

  const sukahuripSlide = emptySlides.find((s) => s.villageFilterTarget === 'Desa Sukahurip');
  assert.ok(sukahuripSlide);
  assert.equal(sukahuripSlide.shortLabel, 'Sukahurip');
});

test('getNextSlideIndex wraps cleanly in both directions for 12 slides', () => {
  assert.equal(getNextSlideIndex(0, 'prev', 12), 11);
  assert.equal(getNextSlideIndex(11, 'next', 12), 0);
  assert.equal(getNextSlideIndex(2, 'next', 12), 3);
  assert.equal(getNextSlideIndex(2, 'prev', 12), 1);
  assert.equal(getNextSlideIndex(0, 'next', 0), 0);
});
