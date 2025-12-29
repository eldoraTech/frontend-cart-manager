export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  discount: number;
  category: string;
  sizes: string[];
  createdAt: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'discount-desc';

export interface FilterState {
  search: string;
  category: string;
  sizes: string[];
  priceRange: [number, number];
  hasDiscount: boolean | null;
}
