import { Category, Product, Order } from './types';

export const categories: Category[] = [
  { id: 'c1', name: 'الأدوية', image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8b79d?w=400&q=80' },
  { id: 'c2', name: 'العناية بالبشرة', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&q=80' },
  { id: 'c3', name: 'العناية بالشعر', image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&q=80' },
  { id: 'c4', name: 'العناية الشخصية', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  { id: 'c5', name: 'الفيتامينات', image: 'https://images.unsplash.com/photo-1550572017-edb73edfe68c?w=400&q=80' },
  { id: 'c6', name: 'الأم والطفل', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80' },
  { id: 'c7', name: 'مستلزمات طبية', image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=400&q=80' },
  { id: 'c8', name: 'مستحضرات تجميل', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80' },
];

export const brands = [
  'Panadol', 'Pfizer', 'Vichy', 'La Roche-Posay', 'Johnson & Johnson', 
  'Pampers', 'Cerave', 'Centrum', 'Omron', 'Aspirin'
];

export const products: Product[] = [];

export const mockOrders: Order[] = [];
