export interface Product {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  originalPrice?: number;
  discountPrice?: number;
  affiliateUrl: string;
  date: string; // ISO format or string like "março 05, 2026"
  category: 'moda' | 'casa' | 'bebe-brinquedos' | 'calcados' | 'packs-videos' | 'aluguel' | 'outros';
  isFeatured?: boolean;
  clicks: number;
  rating?: number;
  whatsAppButtonText?: string;
  platforms?: 'shopee' | 'amazon' | 'whatsapp' | 'outros';
}

export type CategoryFilter = 'todos' | 'moda' | 'casa' | 'bebe-brinquedos' | 'calcados' | 'packs-videos' | 'aluguel' | 'outros';

export interface User {
  email: string;
  name: string;
  isAdmin: boolean;
  useBiometrics?: boolean;
}
