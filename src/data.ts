import { Category, Product, Order } from './types';

export const categories: Category[] = [
  { id: 'c1', name: 'العناية بالبشرة', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=400&q=80' },
  { id: 'c2', name: 'الفيتامينات', image: 'https://images.unsplash.com/photo-1550572017-edb73edfe68c?w=400&q=80' },
  { id: 'c3', name: 'مستحضرات تجميل', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80' },
  { id: 'c4', name: 'العناية بالشعر', image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=400&q=80' },
  { id: 'c5', name: 'الأدوية', image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8b79d?w=400&q=80' },
  { id: 'c6', name: 'الأم والطفل', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80' },
  { id: 'c7', name: 'مستلزمات طبية', image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=400&q=80' },
];

export const brands = [
  'Vichy', 'La Roche-Posay', 'Cerave', 'Centrum', 'Bioderma', 'L\'Oreal', 'Panadol', 'Omron', 'Pampers', 'Aspirin'
];

export const products: Product[] = [
  {
    id: 'p1',
    name: 'فيشي مينيرال 89 سيروم مرطب ومقوي للبشرة مع حمض الهيالورونيك - 50 مل',
    description: 'يجمع سيروم فيشي مينيرال 89 بين مياه فيشي المعدنية الغنية بـ 15 معدنًا وحمض الهيالورونيك الطبيعي لتقوية حاجز البشرة وترطيبها بعمق ووقايتها من التلوث والبهتان.',
    price: 680,
    originalPrice: 850,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    category: 'العناية بالبشرة',
    brand: 'Vichy',
    prescriptionRequired: false,
    rating: 4.8,
    reviews: 142,
    inStock: true
  },
  {
    id: 'p2',
    name: 'لاروش بوزيه جل غسول إيفاكلار رغوي منقٍ للبشرة الدهنية والحساسة - 200 مل',
    description: 'ينظف غسول لاروش بوزيه إيفاكلار البشرة بلطف بفضل المكونات المهدئة والمنقية، ويزيل الإفرازات الدهنية الزائدة ويترك البشرة نظيفة ومنعشة.',
    price: 420,
    originalPrice: 480,
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&q=80',
    category: 'العناية بالبشرة',
    brand: 'La Roche-Posay',
    prescriptionRequired: false,
    rating: 4.7,
    reviews: 98,
    inStock: true
  },
  {
    id: 'p3',
    name: 'سيرافي لوشن مرطب يومي للبشرة الجافة إلى شديدة الجفاف - 236 مل',
    description: 'لوشن خفيف للغاية ومقاوم للجفاف يحتوي على 3 سيراميدات أساسية وحمض الهيالورونيك لتوفير ترطيب فوري يدوم 24 ساعة وحماية الحاجز الطبيعي للبشرة.',
    price: 390,
    originalPrice: 450,
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80',
    category: 'العناية بالبشرة',
    brand: 'Cerave',
    prescriptionRequired: false,
    rating: 4.9,
    reviews: 210,
    inStock: true
  },
  {
    id: 'p4',
    name: 'سنتروم مكمل غذائي مع لوتين متعدد الفيتامينات والمعادن - 30 قرص',
    description: 'حبوب سنتروم لدعم الصحة العامة والنشاط اليومي والمناعة، غنية باللوتين لدعم صحة العين والفيتامينات والمعادن الأساسية للجسم.',
    price: 550,
    originalPrice: 650,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80',
    category: 'الفيتامينات',
    brand: 'Centrum',
    prescriptionRequired: false,
    rating: 4.6,
    reviews: 84,
    inStock: true
  },
  {
    id: 'p5',
    name: 'بنادول إكسترا لتسكين الآلام ومكافحة الصداع والبرد والحرارة - 24 قرص',
    description: 'يوفر بنادول إكسترا راحة سريعة وفعالة من الصداع، آلام المفاصل، نزلات البرد، والتهابات الحلق بفضل تركيبته الخاصة من الباراسيتامول والكافيين.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5e4a8b79d?w=500&q=80',
    category: 'الأدوية',
    brand: 'Panadol',
    prescriptionRequired: false,
    rating: 4.9,
    reviews: 340,
    inStock: true
  },
  {
    id: 'p6',
    name: 'بامبرز عناية مميزة حفاضات مقاس 4 وسط (9-14 كجم) - عبوة 60 حفاضة',
    description: 'تضمن حفاضات بامبرز عناية مميزة جفافًا وحماية فائقة للبشرة مع قنوات الامتصاص السريع والنعومة الحريرية الفاخرة لراحة الطفل طوال اليوم.',
    price: 380,
    originalPrice: 420,
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=500&q=80',
    category: 'الأم والطفل',
    brand: 'Pampers',
    prescriptionRequired: false,
    rating: 4.8,
    reviews: 115,
    inStock: true
  },
  {
    id: 'p7',
    name: 'أومرون جهاز إلكتروني لقياس ضغط الدم من الذراع M3 بالكامل تلقائياً',
    description: 'جهاز قياس ضغط الدم السريري عالي الدقة من أومرون، مزود بتقنية التحقق الذكي، ومؤشر ضربات القلب غير المنتظمة لحفظ قراءات متعددة.',
    price: 2450,
    originalPrice: 2800,
    image: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=500&q=80',
    category: 'مستلزمات طبية',
    brand: 'Omron',
    prescriptionRequired: false,
    rating: 4.9,
    reviews: 67,
    inStock: true
  },
  {
    id: 'p8',
    name: 'بيوديرما سينسيبيو H2O محلول ميسيلار لتنظيف وإزالة المكياج وتهدئة البشرة',
    description: 'مزيل مكياج بيوديرما الشهير ينظف الوجه والعينين بعمق بلطف دون التسبب بتهيج البشرة الحساسة بفضل تركيبته الفسيولوجية الخالية من الصابون.',
    price: 490,
    originalPrice: 590,
    image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80',
    category: 'مستحضرات تجميل',
    brand: 'Bioderma',
    prescriptionRequired: false,
    rating: 4.8,
    reviews: 184,
    inStock: true
  },
  {
    id: 'p9',
    name: 'لوريال باريس سيروم إلفيف هيدرا هيالورونيك لإنعاش وترطيب الشعر التالف',
    description: 'سيروم للشعر غني بحمض الهيالورونيك يغلف ألياف الشعر على الفور لزيادة الحيوية والترطيب واللمعان دون ترك أي ثقل أو ملمس دهني.',
    price: 310,
    originalPrice: 350,
    image: 'https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500&q=80',
    category: 'العناية بالشعر',
    brand: 'L\'Oreal',
    prescriptionRequired: false,
    rating: 4.5,
    reviews: 54,
    inStock: true
  },
  {
    id: 'p10',
    name: 'أسبرين بروتكت 100 مجم للوقاية من التجلطات وحماية صمام القلب - 30 قرص',
    description: 'أسبرين بروتكت بجرعة منخفضة مخصص لحماية الأوعية الدموية والوقاية من السكتات والجلطات القلبية تحت إشراف طبي.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80',
    category: 'الأدوية',
    brand: 'Aspirin',
    prescriptionRequired: true,
    rating: 4.8,
    reviews: 156,
    inStock: true
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-2026-613',
    date: '2026-06-01T15:30:00.000Z',
    items: [
      {
        product: products[0],
        quantity: 1
      },
      {
        product: products[4],
        quantity: 2
      }
    ],
    total: 855,
    status: 'Delivered'
  },
  {
    id: 'ORD-2026-904',
    date: '2026-06-03T11:20:00.000Z',
    items: [
      {
        product: products[2],
        quantity: 2
      }
    ],
    total: 805,
    status: 'Processing'
  }
];
