// src/data/deals.js

// ✅ IMPORTATION DES MODULES D'IMAGES
// L'utilisation de l'alias @/assets/ nécessite la configuration du tsconfig.json
import vacuum1 from '@/assets/Vacuum-cleaner-1.webp';
import vacuum2 from '@/assets/Vacuum-cleaner-2.webp';
import vacuum3 from '@/assets/Vacuum-cleaner-3.webp';
import vacuum4 from '@/assets/Vacuum-cleaner-4.webp';

import board1 from '@/assets/Ergonomic-Board-1.png';
import board2 from '@/assets/Ergonomic-Board-2.png';
import board3 from '@/assets/Ergonomic-Board-3.webp';
import board4 from '@/assets/Ergonomic-Board-4.webp';

import filer1 from '@/assets/Filer-1.webp';
import filer2 from '@/assets/Filer-2.webp';
import filer3 from '@/assets/Filer-3.png';
import filer4 from '@/assets/Filer-4.webp';

export const deals = [
  {
    id: 'vacuum-cleaner',
    categoryId: 'tech',
    title: "Smart Vacuum cleaner",
    discount: 65,
    price: 11.98,
    oldPrice: 35.19,
    statut: "End soon",
    expiresAt: "2025-12-30T23:59:59",
    affiliateUrl: "https://temu.to/k/pzun6dohj3o",
    platform: "Temu",
    images: [vacuum1, vacuum2, vacuum3, vacuum4]
  },
  {
    id: 'ergonomic-board',
    categoryId: 'home',
    title: "Ergonomic Training Board",
    discount: 78,
    price: 9.94,
    oldPrice: 47.0,
    statut: "Limited offer",
    expiresAt: "2025-12-30T12:00:00",
    affiliateUrl: "https://temu.to/k/p68kog9st0a",
    platform: "Temu",
    images: [board1, board2, board3, board4]
  },
  {
    id: 'electric-filer',
    categoryId: 'fashion',
    title: "Rechargeable Electric Filer",
    discount: 81,
    price: 6.08,
    oldPrice: 33.0,
    statut: "Limited offer",
    expiresAt: "2025-12-30T18:30:00",
    affiliateUrl: "https://temu.to/k/pzhk30hxh89",
    platform: "Temu",
    images: [filer1, filer2, filer3, filer4]
  }
];

export function getDealsByCategory(categoryId) {
  return deals.filter(deal => deal.categoryId === categoryId);
}

export function getDealById(id) {
  return deals.find(deal => deal.id === id);
}

export function getAffiliateLink(deal, source = 'homepage') {
  if (!deal.affiliateUrl) return '#';
  try {
    const url = new URL(deal.affiliateUrl);
    url.searchParams.append('utm_source', 'greatthingmarket');
    url.searchParams.append('utm_medium', source);
    return url.toString();
  } catch (e) {
    return deal.affiliateUrl;
  }
}