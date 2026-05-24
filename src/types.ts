export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  prescriptionRequired: boolean;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  icon?: string;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  prescriptionOnly: boolean | null;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Address {
  id: string;
  label: string;
  details: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  addresses: Address[];
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
}
