import { Product } from '@/types/product';

const PRODUCTS_KEY = 'products';
const AUTH_KEY = 'isAdmin';

// Default products for initial state
const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton Tee',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    price: 49.99,
    discount: 20,
    category: 'T-Shirts',
    sizes: ['S', 'M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Slim Fit Denim Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
    price: 89.99,
    discount: 15,
    category: 'Jeans',
    sizes: ['S', 'M', 'L'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Casual Linen Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop',
    price: 69.99,
    discount: 0,
    category: 'Shirts',
    sizes: ['M', 'L', 'XL'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Wool Blend Sweater',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
    price: 129.99,
    discount: 30,
    category: 'Sweaters',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Athletic Running Shorts',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=500&fit=crop',
    price: 44.99,
    discount: 10,
    category: 'Shorts',
    sizes: ['S', 'M', 'L'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Elegant Summer Dress',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
    price: 159.99,
    discount: 25,
    category: 'Dresses',
    sizes: ['XS', 'S', 'M', 'L'],
    createdAt: new Date().toISOString(),
  },
];

export const getProducts = (): Product[] => {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  return JSON.parse(stored);
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
};

export const getProductById = (id: string): Product | undefined => {
  return getProducts().find((p) => p.id === id);
};

// Auth functions
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (email: string, password: string): boolean => {
  if (email === 'admin@gmail.com' && password === 'admin123') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

// Categories and sizes
export const CATEGORIES = ['T-Shirts', 'Jeans', 'Shirts', 'Sweaters', 'Shorts', 'Dresses', 'Jackets', 'Accessories'];
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
