/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { AuthView } from './components/AuthView';
import { AccountView } from './components/AccountView';
import { AIChat } from './components/AIChat';
import { BottomNav } from './components/BottomNav';
import { OrderTrackingView } from './components/OrderTrackingView';
import { BranchLocatorView } from './components/BranchLocatorView';
import { categories, products, mockOrders } from './data';
import { FilterState, CartItem, Product, User, Order, OrderStatus } from './types';
import { Stethoscope, FileSignature, ShieldCheck, Phone, MessageCircle, Search, LogOut, Heart, ListOrdered, Facebook, Smartphone, PackageSearch } from 'lucide-react';
import { PrescriptionUploadView } from './components/PrescriptionUploadView';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [activeBanner, setActiveBanner] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 5000],
    prescriptionOnly: null,
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [toast, setToast] = useState<{title: string, message: string} | null>(null);
  const [dbProducts, setDbProducts] = useState<Product[]>(products);

  const [secondsLeft, setSecondsLeft] = useState(32400); // 9 hours
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 32400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')} : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  // Authentication & State & Data Fetching
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          setDbProducts(data as Product[]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
    
    // Auth Listener
    import('./lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email || 'مستخدم',
            phone: session.user.phone || '',
            addresses: []
          });
        }
      });

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setCurrentUser({
            id: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email || 'مستخدم',
            phone: session.user.phone || '',
            addresses: []
          });
          setCurrentTab('home');
        } else {
          setCurrentUser(null);
        }
      });
    });

    // Check local storage for wishlist
    const storedWishlist = localStorage.getItem('elb_wishlist');
    if (storedWishlist) {
      try { setWishlist(JSON.parse(storedWishlist)); } catch(e) {}
    }
    
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Simulate Order Execution Pipeline
  useEffect(() => {
    if (!orders.length) return;

    const findAndProcess = (status: OrderStatus, nextStatus: OrderStatus, delay: number) => {
      const order = orders.find(o => o.status === status);
      if (order) {
        const timer = setTimeout(() => {
          updateOrderStatus(order.id, nextStatus);
        }, delay);
        return () => clearTimeout(timer);
      }
      return undefined;
    };

    const cleanup1 = findAndProcess('Pending', 'Confirmed', 8000);
    if (!cleanup1) {
      const cleanup2 = findAndProcess('Confirmed', 'Processing', 8000);
      if (!cleanup2) {
        const cleanup3 = findAndProcess('Processing', 'OutForDelivery', 10000);
        if (!cleanup3) {
          findAndProcess('OutForDelivery', 'Delivered', 12000);
        }
      }
    }
  }, [orders]);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    
    if (newStatus === 'OutForDelivery' || newStatus === 'Delivered') {
      const title = newStatus === 'OutForDelivery' ? 'طلبك في الطريق! 🚚' : 'تم توصيل طلبك بنجاح! ✅';
      const body = `تحديث لحالة الطلب رقم #${orderId}`;
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      } else {
         setToast({ title, message: body });
      }
    }
  };

  const handleLogin = (email: string, name: string) => {
    // Current user state is managed by the supabase auth listener.
    // Setting a temporary state just in case
    if (!currentUser) {
      setCurrentUser({ id: 'U-' + Date.now(), phone: '', name, addresses: [] });
    }
    setCurrentTab('home');
  };

  const handleLogout = async () => {
    const { supabase } = await import('./lib/supabase');
    await supabase.auth.signOut();
    setCurrentUser(null);
    setCurrentTab('home');
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('هل أنت متأكد من إلغاء هذا الطلب؟')) {
      updateOrderStatus(orderId, 'Cancelled');
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      setCartOpen(false);
      setCurrentTab('account');
      return;
    }
    
    // Simulate order placement
    const newOrder: Order = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString(),
      items: [...cartItems],
      total: cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) + 25,
      status: 'Pending'
    };
    
    setOrders([newOrder, ...orders]);
    setCartItems([]);
    setCartOpen(false);
    setCurrentTab('account');
    alert(`تم استلام طلبك بنجاح! رقم الطلب: ${newOrder.id}`);
  };

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeCartItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };
  
  const toggleWishlist = (product: Product) => {
     setWishlist(prev => {
        const exists = prev.find(p => p.id === product.id);
        const newList = exists ? prev.filter(p => p.id !== product.id) : [...prev, product];
        localStorage.setItem('elb_wishlist', JSON.stringify(newList));
        return newList;
     });
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Search & Filter
  const filteredProducts = useMemo(() => {
    return dbProducts.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.category.includes(searchQuery)) {
        return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      return true;
    });
  }, [filters, searchQuery]);

  const selectCategory = (categoryName: string) => {
    setFilters({ categories: [categoryName], brands: [], priceRange: [0, 5000], prescriptionOnly: null });
    setSearchQuery('');
    setCurrentTab('search');
  };

  const selectBrand = (brandName: string) => {
    setFilters({ categories: [], brands: [brandName], priceRange: [0, 5000], prescriptionOnly: null });
    setSearchQuery('');
    setCurrentTab('search');
  };

  const renderContent = () => {
    if (currentTab === 'aichat') {
      return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-64px)] w-full">
           <AIChat onClose={() => setCurrentTab('home')} />
        </div>
      );
    }

    if (currentTab === 'menu') {
      return (
        <div className="max-w-md mx-auto py-8 px-4 h-full flex flex-col items-center">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
              <div className="flex flex-col items-center gap-2 mb-4">
                 <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-xl">
                   {currentUser ? currentUser.name.charAt(0) : 'زائر'}
                 </div>
                 <h3 className="font-bold text-gray-900">{currentUser ? currentUser.name : 'مرحباً بك في البندارى'}</h3>
              </div>
              {!currentUser && (
               <button onClick={() => setCurrentTab('account')} className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl mb-2 transition hover:bg-primary-700">
                 تسجيل الدخول / إنشاء حساب
               </button>
              )}
            </div>

            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
               <button onClick={() => setCurrentTab('account')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition">
                 <div className="flex items-center gap-3">
                   <ListOrdered size={20} className="text-gray-500" />
                   <span className="font-bold text-gray-900">طلباتي</span>
                 </div>
               </button>
               <button onClick={() => setCurrentTab('account')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition">
                 <div className="flex items-center gap-3">
                   <Heart size={20} className="text-gray-500" />
                   <span className="font-bold text-gray-900">المفضلة</span>
                 </div>
               </button>
               <button onClick={() => setCurrentTab('search')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition">
                 <div className="flex items-center gap-3">
                   <Search size={20} className="text-gray-500" />
                   <span className="font-bold text-gray-900">تصفح الأقسام</span>
                 </div>
               </button>
               
               <a href="https://admin.bendaryph.com" target="_blank" rel="noopener noreferrer" className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition border-t border-gray-100">
                 <div className="flex items-center gap-3">
                   <ShieldCheck size={20} className="text-gray-500" />
                   <span className="font-bold text-gray-900">لوحة تحكم الإدارة</span>
                 </div>
               </a>

               <div className="bg-gray-50 px-4 py-2 font-bold text-gray-500 text-sm border-t border-gray-100">تواصل معنا وحمل التطبيق</div>
               
               <a href="tel:01200400094" className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition border-t border-gray-100">
                 <div className="flex items-center gap-3">
                   <Phone size={20} className="text-gray-500" />
                   <span className="font-bold text-gray-900">اتصل بنا (01200400094)</span>
                 </div>
               </a>
               
               <a href="https://wa.me/201200400094" target="_blank" rel="noopener noreferrer" className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition border-t border-gray-100">
                 <div className="flex items-center gap-3">
                   <MessageCircle size={20} className="text-green-500" />
                   <span className="font-bold text-gray-900">واتساب (01200400094)</span>
                 </div>
               </a>

               <a href="https://www.facebook.com/share/1LSTcMaR1X/" target="_blank" rel="noopener noreferrer" className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition border-t border-gray-100">
                 <div className="flex items-center gap-3">
                   <Facebook size={20} className="text-blue-600" />
                   <span className="font-bold text-gray-900">صفحتنا على فيسبوك</span>
                 </div>
               </a>

               <a href="https://play.google.com/store/apps/details?id=com.bendarypharmacy.duaya" target="_blank" rel="noopener noreferrer" className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition border-t border-gray-100">
                 <div className="flex items-center gap-3">
                   <Smartphone size={20} className="text-gray-500" />
                   <span className="font-bold text-gray-900">تطبيق الأندرويد</span>
                 </div>
               </a>

               {currentUser && (
                 <button onClick={handleLogout} className="w-full flex justify-between items-center p-4 hover:bg-red-50 transition text-red-600 border-t border-gray-100">
                   <div className="flex items-center gap-3">
                     <LogOut size={20} />
                     <span className="font-bold">تسجيل الخروج</span>
                   </div>
                 </button>
               )}
            </div>
        </div>
      );
    }

    if (currentTab === 'account') {
      return currentUser ? (
        <AccountView 
          user={currentUser} 
          orders={orders} 
          onLogout={handleLogout} 
          wishlist={wishlist}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onCancelOrder={handleCancelOrder}
        />
      ) : (
        <AuthView onLogin={handleLogin} />
      );
    }

    if (currentTab === 'prescription') {
      return (
        <PrescriptionUploadView 
          onBack={() => setCurrentTab('home')} 
          user={currentUser} 
        />
      );
    }

    if (currentTab === 'ordertracking') {
      return (
        <OrderTrackingView 
          orders={orders} 
          onBack={() => setCurrentTab('home')} 
        />
      );
    }

    if (currentTab === 'branches') {
      return (
        <BranchLocatorView />
      );
    }

    if (currentTab === 'search' || searchQuery) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
           {/* Sidebar Categories */}
           <div className="w-full md:w-64 shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 px-2">الأقسام</h3>
                <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                  <button 
                    onClick={() => {
                      setFilters({ ...filters, categories: [] });
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-colors border ${
                      filters.categories.length === 0 ? 'bg-primary-50 border-primary-100 text-primary-700' : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    الكل
                  </button>
                  {categories.map(category => (
                    <button 
                      key={category.id}
                      onClick={() => setFilters({ ...filters, categories: [category.name] })}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold whitespace-nowrap transition-colors border text-right ${
                        filters.categories.includes(category.name) ? 'bg-primary-50 border-primary-100 text-primary-700' : 'bg-transparent border-transparent text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 hidden md:block">
                         <img src={category.image} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                      </div>
                      <span className="flex-1">{category.name}</span>
                    </button>
                  ))}
                </div>
             </div>
           </div>

           {/* Products Grid */}
           <div className="flex-1">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {searchQuery ? 'نتائج البحث' : filters.categories.length > 0 ? filters.categories[0] : 'جميع المنتجات'}
                </h2>
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredProducts.length} منتج
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <Search size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد منتجات</h3>
                  <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصفح الأقسام.</p>
                  <button 
                    onClick={() => {
                      setFilters({ categories: [], brands: [], priceRange: [0, 5000], prescriptionOnly: null });
                      setSearchQuery('');
                    }}
                    className="mt-6 font-bold text-primary-600 hover:underline"
                  >
                    إلغاء البحث والتصفية
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map(product => (
                    <ProductCard 
                       key={product.id} 
                       product={product} 
                       onAddToCart={addToCart}
                       isWishlisted={wishlist.some(p => p.id === product.id)}
                       onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              )}
           </div>
        </div>
      );
    }

    // Default Home View
    const premiumSlides = [
      {
        title: "خصومات الصيف على مستحضرات التجميل والجمال العالمية",
        subtitle: "وفر حتى 25% على براندات العناية الرائدة كـ Vichy و La Roche-Posay",
        category: "العناية بالبشرة",
        image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80",
        accent: "من خبراء باريس إليكِ",
        buttonText: "تسوقي منتجات التجميل"
      },
      {
        title: "مكملات الفيتامينات والنشاط اليومي المتكامل",
        subtitle: "اشترِ قطعة واحصل على الثانية مجاناً (1+1) من منتجات سنتروم الشاملة باللوتين",
        category: "الفيتامينات",
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1200&q=80",
        accent: "مكملات أصلية وموثقة",
        buttonText: "اكتشف الفيتامينات"
      },
      {
        title: "رعاية ممتازة لبشرة طفلكِ الحساسة",
        subtitle: "حماية فائقة ونعومة حريرية مع عروض حصرية على عبوات حفاضات بامبرز الفاخرة",
        category: "الأم والطفل",
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&q=80",
        accent: "راحة وأمان طوال اليوم",
        buttonText: "تصفح مستلزمات طفلكِ"
      }
    ];

    const staticBrands = [
      { name: 'Vichy', logo: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150&q=80', tagline: 'للبشرة الحساسة' },
      { name: 'La Roche-Posay', logo: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=150&q=80', tagline: 'رعاية جلدية فرنسية' },
      { name: 'Cerave', logo: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=150&q=80', tagline: 'لتقوية حاجز البشرة' },
      { name: 'Centrum', logo: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&q=80', tagline: 'دعم الصحة العام' },
      { name: 'Bioderma', logo: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=150&q=80', tagline: 'مزيل المكياج والنقاء' },
      { name: 'Pampers', logo: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=150&q=80', tagline: 'حفاضات رعاية فائقة' },
      { name: 'Omron', logo: 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=150&q=80', tagline: 'أجهزة قياس الضغط' }
    ];

    const seasonalTips = [
      {
        id: 't1',
        title: "نظام الوقاية من أشعة وصدمات شمس الصيف الحارة",
        desc: "التعرض المستمر للأشعة الفوق بنفسجية يعرضكِ لظهور مبكر للتجاعيد وبقع الجفاف. ينصح أطباؤنا بالتالي:",
        recommendation: "تركيبة سيروم حمض الهيالورونيك من Vichy لتخزين الترطيب + واقي شمس لاروش بوزيه بعامل حماية +50.",
        itemIds: ['p1', 'p2']
      },
      {
        id: 't2',
        title: "كيف تحارب الكسل والبهتان وتجدد مستويات الطاقة طوال الصيام أو العمل الشاق؟",
        desc: "يحتاج الجسم لتعويض مستمر للمغنيسيوم، وفيتامينات ب المركبة، ومضادات الأكسدة مثل اللوتين للحفاظ على صحة وتركيز دائم.",
        recommendation: "كبسولات Centrum الشاملة مرة واحدة يومياً بعد وجبة الإفطار مع شرب كميات غنية من المياه.",
        itemIds: ['p4']
      }
    ];

    const triggerQuickRoutineBuy = (itemIds: string[]) => {
      itemIds.forEach(id => {
        const prod = dbProducts.find(p => p.id === id);
        if (prod) {
          addToCart(prod);
        }
      });
      setToast({
        title: "تم إضافة المجموعة للقرطاس!",
        message: "تم إضافة مستحضرات المجموعة المقترحة لسلة المشتريات بنجاح لتبدأ في روتين صحي متكامل."
      });
      setTimeout(() => setToast(null), 3500);
    };

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 space-y-12">
        
        {/* Dynamic & Premium Banner Slider */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-red-950 via-neutral-900 to-black border border-red-850/20 text-white shadow-xl min-h-[340px] md:min-h-[400px] flex items-center">
          {/* Active slide image */}
          <div className="absolute inset-y-0 left-0 w-full md:w-1/2 h-full opacity-35 md:opacity-85 z-0 md:ml-auto">
            <img 
              src={premiumSlides[activeBanner].image} 
              alt="Promo banner" 
              className="w-full h-full object-cover mix-blend-luminosity transform scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          </div>

          {/* Banner content */}
          <div className="relative z-10 w-full md:w-2/3 p-6 sm:p-12 flex flex-col justify-center text-right">
            <span className="bg-[#CE1126] text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block max-w-max mb-4 shadow-sm animate-pulse">
              {premiumSlides[activeBanner].accent}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-200 tracking-tight leading-snug drop-shadow-md">
              {premiumSlides[activeBanner].title}
            </h1>
            <p className="text-sm md:text-lg text-gray-200 mt-4 max-w-xl font-medium leading-relaxed">
              {premiumSlides[activeBanner].subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button 
                onClick={() => {
                  selectCategory(premiumSlides[activeBanner].category);
                }}
                className="bg-[#CE1126] text-white hover:bg-red-750 font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-red-900/20 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
              >
                {premiumSlides[activeBanner].buttonText}
              </button>
              
              <button 
                onClick={() => setCurrentTab('prescription')}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 font-bold px-6 py-3.5 rounded-2xl backdrop-blur-md transition cursor-pointer"
              >
                صرف الروشتة الطبية
              </button>
            </div>
          </div>

          {/* Sliding indicators/bullets */}
          <div className="absolute bottom-6 right-6 md:right-12 flex items-center gap-2 z-10">
            {premiumSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveBanner(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeBanner === i ? 'w-8 bg-[#CE1126]' : 'bg-white/40 hover:bg-white/'}`}
              />
            ))}
          </div>
        </div>

        {/* Triple Action Dashboard Row (Order Tracking, VIP Club, Hot Offer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Action A: Order tracking banner - 4 columns */}
          <div 
            onClick={() => setCurrentTab('ordertracking')}
            className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:border-red-600/20 transition-all group duration-300"
          >
             <div className="space-y-4">
                <div className="w-12 h-12 bg-red-50 text-[#CE1126] rounded-2xl flex items-center justify-center border border-red-100 shadow-inner group-hover:-rotate-3 transition-transform">
                   <PackageSearch size={24} />
                </div>
                <div>
                   <h3 className="font-extrabold text-gray-950 text-base">تتبع طلبيات البنداري</h3>
                   <p className="text-gray-400 text-xs mt-1 leading-relaxed font-medium">أدخل رقم الشحنة أو رقم تتبع الطلب الخاص بك لمعرفة موعد وتفاصيل التوصيل فورا.</p>
                </div>
             </div>
             <div className="mt-6 flex items-center justify-between text-xs font-extrabold text-[#CE1126] border-t border-gray-150 pt-3 group-hover:underline">
                <span>تحقق من الشحن</span>
                <span className="bg-red-50 px-2 py-1 rounded">←</span>
             </div>
          </div>

          {/* Action B: VIP Loyalty Club Card Graphic - 5 columns */}
          <div className="lg:col-span-5 bg-gradient-to-br from-black via-zinc-900 to-[#CE1126] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-red-950/30">
            {/* Background design elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-xl -translate-x-4 -translate-y-4"></div>
            <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-red-500/5 rounded-full blur-2xl"></div>
            
            <div className="flex items-start justify-between z-10">
              <div>
                <span className="text-[10px] bg-white/10 border border-white/10 text-red-100 px-2.5 py-1 rounded-full font-black tracking-widest uppercase">نادي المكافآت VIP</span>
                <h3 className="text-xl font-black mt-2 leading-none">بطاقة البنداري الرقمية</h3>
              </div>
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            </div>

            {/* Simulated Points Balance */}
            <div className="my-6 z-10">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <p className="text-[10px] text-gray-200/75 font-semibold leading-none">مجموع نقاطك</p>
                  <span className="text-3xl font-black text-white">550 <span className="text-sm text-red-400 font-black">نقطة</span></span>
                </div>
                <span className="text-xs text-red-400 font-bold">خصم 50 ج.م متاح</span>
              </div>
              
              {/* Rewards path bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="flex justify-between text-[9px] text-red-200 mt-1.5 font-bold">
                <span>تفعيل كوبون بقيمة 100 ج.م</span>
                <span>المستوى التالي: 1000 نقطة</span>
              </div>
            </div>

            <button 
              onClick={() => {
                if (currentUser) {
                  setToast({ title: "نقاط مكافآتك مفعلة!", message: "يتم تحصيل النقاط تلقائياً على حسابك الشخصي مع كل طلب تقوم به." });
                  setTimeout(() => setToast(null), 3000);
                } else {
                  setCurrentTab('account');
                }
              }}
              className="w-full bg-[#CE1126] hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-xs z-10 transition shadow shadow-red-950/20"
            >
              {currentUser ? "تفاصيل حساب المكافآت" : "انضم الآن لمكافآت البنداري واكسب 100 نقطة مجاناً"}
            </button>
          </div>

          {/* Action C: Limited Offer Countdown - 3 columns */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-5 shadow-md border border-red-500/20 flex flex-col justify-between relative overflow-hidden">
            {/* Visual indicator tag */}
            <div className="absolute top-0 left-0 bg-[#CE1126] text-white text-[9px] font-black px-4 py-1.5 rounded-br-2xl uppercase tracking-wider font-sans">
              عرض خاص
            </div>

            <div className="mt-4">
              <h4 className="text-xs text-gray-400 font-bold">ينتهي العرض الخاص في:</h4>
              <div className="font-mono text-xl font-extrabold text-[#CE1126] mt-2 bg-red-50 rounded-xl p-3 border border-red-150 text-center tracking-widest whitespace-nowrap">
                {formatTime(secondsLeft)}
              </div>
            </div>

            <div className="my-4 border-t border-gray-150 pt-3">
              <span className="text-[10px] text-red-600 font-extrabold block">منتج العرض المحدود لهذا الأسبوع</span>
              <h4 className="font-extrabold text-black text-xs mt-1 leading-snug line-clamp-2">فيشي سيروم مرطب ومقوي للبشرة (50 مل)</h4>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-black font-black text-sm">680 <span className="text-[10px] text-gray-500 font-bold">ج.م</span></span>
                <span className="text-gray-400 line-through text-xs font-medium">850 ج.م</span>
              </div>
            </div>

            <button 
              onClick={() => {
                const vichyProd = dbProducts.find(p => p.id === 'p1');
                if (vichyProd) {
                  addToCart(vichyProd);
                  setToast({ title: 'تم تفعيل العرض!', message: 'تم إضافة سيروم فيشي بخصم 170 ج.م لسلتك بنجاح.' });
                  setTimeout(() => setToast(null), 3000);
                }
              }}
              className="w-full bg-[#CE1126] hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition"
            >
              شراء العرض الآن
            </button>
          </div>
        </div>

        {/* Global Premium Brands Locator Row (تسوق بأفخر البراندات العالمية) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-[#CE1126] block rounded-full"></span>
                 تسوق بأقوى الماركات الفرنسية والعالمية
             </h2>
             <span className="text-xs text-gray-400 font-bold hidden sm:inline">منتجات أصلية معتمدة مع ضمان التخزين الصحي</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {staticBrands.map((brand, i) => (
              <div 
                key={i}
                onClick={() => selectBrand(brand.name)}
                className="bg-white rounded-2xl p-4 border border-gray-150 hover:border-[#CE1126] hover:shadow-md transition-all duration-300 text-center cursor-pointer group flex flex-col justify-between h-[150px]"
              >
                <div className="w-full h-14 overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center p-2">
                   <span className="text-base font-black text-slate-800 tracking-wider group-hover:text-[#CE1126] transition-colors">{brand.name}</span>
                </div>
                <div className="mt-2 text-right">
                  <h4 className="font-extrabold text-gray-900 text-[11px] truncate leading-tight">{brand.name}</h4>
                  <p className="text-[9px] text-[#CE1126] font-black truncate mt-1">{brand.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Grid Selector */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-[#CE1126] block rounded-full"></span>
                 تصفح الفئات الطبية والجمالية
             </h2>
             <button onClick={() => setCurrentTab('search')} className="text-xs font-bold text-[#CE1126] hover:underline flex items-center gap-1">عرض جميع المنتجات ←</button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((category) => (
              <button 
                key={category.id}
                onClick={() => selectCategory(category.name)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex border-b-4 border-b-transparent hover:border-b-[#CE1126] shrink-0 flex-col items-center p-3 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 mb-3 border border-gray-100 group-hover:border-red-100 transition-colors">
                   <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
                </div>
                <span className="text-gray-900 font-extrabold text-[12px] text-center leading-tight">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Healthy Lifestyle Editorial Advice Desk (مستشار الطب البديل والحياة الصحية) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-[#CE1126] block rounded-full"></span>
                 المرشد الطبي والروتين المقترح من أطبائنا
             </h2>
             <button onClick={() => setCurrentTab('aichat')} className="text-xs bg-red-50 text-[#CE1126] px-3 py-1.5 rounded-lg hover:bg-red-100 transition font-extrabold">المزيد من الاستشارات المجانية</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seasonalTips.map((tip) => (
              <div key={tip.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-900 text-sm md:text-base leading-snug">{tip.title}</h3>
                  <p className="text-xs text-gray-500 md:text-sm font-medium leading-relaxed">{tip.desc}</p>
                  <div className="bg-red-50/50 rounded-xl p-4 border border-red-100/40 text-xs text-red-950 leading-relaxed font-bold">
                    <span className="text-[#CE1126] block mb-1">الجرعة أو الروتين اليومي:</span>
                    {tip.recommendation}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                  <span className="text-[11px] text-gray-400 font-bold">موصى به بواسطة د. مصطفى البنداري</span>
                  <button 
                    onClick={() => triggerQuickRoutineBuy(tip.itemIds)}
                    className="bg-[#CE1126] hover:bg-black text-white text-xs font-black px-5 py-2.5 rounded-xl transition"
                  >
                    شراء الروتين المقترح سلّة واحدة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products Showcase Section (منتجاتنا الأكثر طلباً) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h2 className="text-xl font-extrabold text-gray-950 flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-[#CE1126] block rounded-full"></span>
                 الأكثر مبيعاً والمنتجات الشائعة حالياً
             </h2>
             <button onClick={() => selectCategory('')} className="text-xs font-black text-[#CE1126] hover:underline">مشاهدة الكل ({dbProducts.length})</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbProducts.slice(0, 4).map((product) => (
               <ProductCard 
                 key={product.id} 
                 product={product} 
                 onAddToCart={addToCart}
                 isWishlisted={wishlist.some(p => p.id === product.id)}
                 onToggleWishlist={toggleWishlist}
               />
            ))}
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-red-50 selection:text-red-900" dir="rtl">
      <Navbar 
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
        onSearchClick={() => setCurrentTab('search')}
        onAccountClick={() => setCurrentTab('account')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userName={currentUser?.name}
        onChangeTab={setCurrentTab}
        wishlistCount={wishlist.length}
      />

      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer Section */}
      <footer className="bg-[#111111] text-white border-t border-zinc-800 pt-12 pb-24 md:pb-12 mt-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and brief intro */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#CE1126] rounded-xl flex items-center justify-center border border-red-600/30">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4.5 16.5C4.5 13.5 6 12 9 12h6c3 0 4.5 1.5 4.5 4.5s-1.5 4.5-4.5 4.5H9c-3 0-4.5-1.5-4.5-4.5z" />
                  <path d="M12 2v10M9 5h6" />
                </svg>
              </div>
              <span className="text-base font-extrabold text-[#CE1126]">صيدليات البندارى</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              الخيار الأول والموثوق في مصر لتوفير الأدوية والتركيبات الصيدلانية ومستحضرات التجميل العالمية والعناية بالبشرة تحت إشراف نخبة من الصيادلة والأخصائيين.
            </p>
            <div className="pt-2">
              <a 
                href="https://www.bendaryph.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block bg-[#CE1126] hover:bg-red-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition duration-300"
              >
                زيارة الموقع الرسمي: www.bendaryph.com
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-100 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-[#CE1126]">
              أقسام وتصفح سريع
            </h4>
            <ul className="space-y-2 text-xs font-bold text-gray-400">
              <li>
                <button onClick={() => setCurrentTab('home')} className="hover:text-[#CE1126] transition-colors cursor-pointer">
                  الصفحة الرئيسية للبوابة
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('search')} className="hover:text-[#CE1126] transition-colors cursor-pointer">
                  تصفح المنتجات والفئات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('prescription')} className="hover:text-[#CE1126] transition-colors cursor-pointer">
                  صرف الروشتة وتحميل الملفات
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('ordertracking')} className="hover:text-[#CE1126] transition-colors cursor-pointer">
                  تتبع طلبيات البنداري أونلاين
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('branches')} className="hover:text-[#CE1126] transition-colors cursor-pointer">
                  فروعنا وأوقات العمل
                </button>
              </li>
            </ul>
          </div>

          {/* Support and contact info */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-100 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-[#CE1126]">
              خدمة العملاء والدعم
            </h4>
            <ul className="space-y-3 text-xs font-bold text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-red-500">📞</span>
                <span>الخط الساخن: <a href="tel:01200400094" className="hover:text-white transition-colors text-gray-100">01200400094</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">💬</span>
                <span>واتساب مفعّل: <a href="https://wa.me/201200400094" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-gray-100">01200400094</a></span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-500">👥</span>
                <span>فيسبوك: <a href="https://www.facebook.com/share/1LSTcMaR1X/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">صفحة صيدليات البنداري</a></span>
              </li>
            </ul>
          </div>

          {/* Legal / apps */}
          <div className="space-y-4">
            <h4 className="text-sm font-black text-gray-100 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-8 after:h-0.5 after:bg-[#CE1126]">
              تطبيقات الهواتف الذكية
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              حمل تطبيق البنداري للهواتف الذكية للحصول على مزيد من المزايا ومتابعة نقاط مكافآتك الحصرية.
            </p>
            <div className="pt-2">
              <a 
                href="https://play.google.com/store/apps/details?id=com.bendarypharmacy.duaya" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white p-2.5 rounded-xl transition duration-300 text-xs w-max border border-zinc-700"
              >
                <span>🤖</span>
                <span className="font-extrabold text-[11px]">تحميل تطبيق الأندرويد للأجهزة الذكية</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-bold">
          <span>© 1998 - 2026 جميع الحقوق محفوظة لمجموعة صيدليات البنداري الطبية وموقعها الإلكتروني.</span>
          <div className="flex items-center gap-4">
            <a href="https://www.bendaryph.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#CE1126] transition-colors">
              البوابة الرئيسية: www.bendaryph.com
            </a>
          </div>
        </div>
      </footer>

      {/* Global In-App Toast Notification */}
      {toast && (
        <div className="fixed top-20 left-4 sm:left-auto sm:right-4 bg-white shadow-xl rounded-xl border-l-4 border-l-primary-500 p-4 z-50 flex items-start gap-4 animate-in fade-in slide-in-from-top-5 max-w-sm w-full mx-4 sm:mx-0">
           <div className="bg-primary-100 text-primary-600 p-2 rounded-full">
             <ShieldCheck size={20} />
           </div>
           <div className="flex-1">
             <h4 className="font-bold text-gray-900 text-sm mb-1">{toast.title}</h4>
             <p className="text-gray-600 text-xs">{toast.message}</p>
           </div>
        </div>
      )}

      <BottomNav 
        currentTab={currentTab} 
        onChangeTab={(tab) => {
          if (tab === 'cart') {
            setCartOpen(true);
          } else {
            setCurrentTab(tab);
          }
        }} 
        cartCount={cartCount}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeCartItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}


