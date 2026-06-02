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
import { categories, products, mockOrders } from './data';
import { FilterState, CartItem, Product, User, Order, OrderStatus } from './types';
import { Stethoscope, FileSignature, ShieldCheck, Phone, MessageCircle, Search, LogOut, Heart, ListOrdered, Facebook, Smartphone } from 'lucide-react';
import { OrderProgress } from './components/OrderProgress';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
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

  // Authentication & State & Data Fetching
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data) {
          setDbProducts(data as Product[]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
    
    // Check local storage for user & wishlist
    const storedUser = localStorage.getItem('elb_user');
    if (storedUser) {
      try { setCurrentUser(JSON.parse(storedUser)); } catch(e) {}
    }
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

  const handleLogin = (phone: string, name: string) => {
    const user: User = { id: 'U-' + Date.now(), phone, name, addresses: [] };
    setCurrentUser(user);
    localStorage.setItem('elb_user', JSON.stringify(user));
    setCurrentTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('elb_user');
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
        <div className="max-w-2xl mx-auto py-12 px-4 text-center">
           <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileSignature size={48} />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 mb-4">ارسال روشتة</h2>
           <p className="text-gray-600 mb-8">قم بتصوير الروشتة أو المنتج وارسالها لنا، وسنقوم بتوصيل طلبك في أسرع وقت.</p>
           
           <div className="grid grid-cols-2 gap-4">
              <button className="bg-primary-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition">
                <span>كاميرا</span>
              </button>
              <button className="bg-primary-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition">
                <span>معرض الصور</span>
              </button>
           </div>
           
           <div className="mt-8 pt-8 border-t border-gray-200">
             <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-500 font-medium">
               يمكنك كتابة طلبك هنا<br/>
               مثال: علبة بنادول + بامبرز مقاس 5
             </div>
             <button className="w-full mt-4 bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700">التالي</button>
           </div>
        </div>
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
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        
        {/* Welcome Video Section */}
        <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-6 bg-black relative">
          <video 
            className="w-full h-48 md:h-64 object-cover opacity-90"
            autoPlay 
            loop 
            muted 
            playsInline
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h2 className="text-white text-2xl font-bold mb-2">مرحباً بك في صيدليات البنداري</h2>
            <p className="text-gray-200">الرعاية الصحية المتكاملة بين يديك</p>
          </div>
          {currentUser && currentUser.name.toLowerCase().includes('admin') && (
            <button 
              onClick={() => alert(`تغيير الفيديوهات متاح للوحة تحكم الإدارة على الرابط: https://admin.bendaryph.com`)}
              className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 text-white px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-md transition-colors z-20"
            >
              إدارة الفيديو (Admin)
            </button>
          )}
        </div>

        {/* Quick Links matching app design */}
        <div className="grid grid-cols-3 gap-3 mb-6">
           <button onClick={() => setCurrentTab('search')} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
             <div className="py-4 flex items-center justify-center text-gray-800">
                <Search size={32} strokeWidth={2.5} />
             </div>
             <div className="bg-primary-600 text-white w-full text-center py-2 font-bold text-sm">
                تصفح الاقسام
             </div>
           </button>
           <button onClick={() => setCurrentTab('prescription')} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
             <div className="py-4 flex items-center justify-center text-gray-800">
                <FileSignature size={32} strokeWidth={2.5} />
             </div>
             <div className="bg-primary-600 text-white w-full text-center py-2 font-bold text-sm">
                الروشتة
             </div>
           </button>
           <button className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group border border-gray-100">
             <div className="py-4 flex items-center justify-center text-gray-800">
                <ShieldCheck size={32} strokeWidth={2.5} />
             </div>
             <div className="bg-primary-600 text-white w-full text-center py-2 font-bold text-sm">
                التأمين الطبي
             </div>
           </button>
        </div>

        {/* Main Ad Slot */}
        <div className="w-full h-24 sm:h-32 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border border-gray-200 overflow-hidden relative group cursor-pointer hover:opacity-95 transition-opacity">
          <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm z-10">إعلان</div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-800 flex items-center flex-col justify-center text-white p-4 text-center">
            <span className="font-bold text-lg mb-1">مساحة إعلانية لشركائنا</span>
            <span className="text-xs opacity-80">(NEXT_PUBLIC_AD_SLOT_MAIN)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-10">
           <button className="bg-white border border-primary-600 rounded-xl py-3 px-4 flex items-center justify-between hover:bg-primary-50 transition-colors shadow-sm">
              <span className="font-bold text-primary-700 text-lg">العروض الخاصة</span>
              <span className="text-primary-600 text-2xl font-black rotate-[-15deg]">%</span>
           </button>
           <button onClick={() => setCurrentTab('aichat')} className="bg-white border border-primary-600 rounded-xl py-3 px-4 flex items-center justify-between hover:bg-primary-50 transition-colors shadow-sm">
              <span className="font-bold text-primary-700 text-lg">استشير صيدلي</span>
              <Stethoscope size={24} className="text-primary-600" />
           </button>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-secondary-600 block rounded-full"></span>
               تسوق بالأقسام
           </h2>
           <button onClick={() => setCurrentTab('search')} className="text-sm font-bold text-primary-600 hover:text-primary-700">عرض الكل</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 mb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((category) => (
            <button 
              key={category.id}
              onClick={() => selectCategory(category.name)}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all flex border-b-4 border-b-transparent hover:border-b-primary-500 shrink-0 w-[110px] flex-col items-center p-3"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50 mb-3 border-2 border-gray-100 group-hover:border-primary-100 transition-colors">
                 <img src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" />
              </div>
              <span className="text-gray-800 font-bold text-[12px] text-center leading-tight">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Recommended Products Horizontal Scroll */}
        <div className="flex items-center justify-between mb-4 mt-8">
           <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
               <span className="w-1.5 h-6 bg-primary-600 block rounded-full"></span>
               منتجات مقترحة
           </h2>
           <button onClick={() => selectCategory('')} className="text-sm font-bold text-secondary-600 hover:text-secondary-700">عرض الكل</button>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {dbProducts.slice(0, 6).map((product) => (
             <div key={product.id} className="shrink-0 w-[240px]">
               <ProductCard 
                 product={product} 
                 onAddToCart={addToCart}
                 isWishlisted={wishlist.some(p => p.id === product.id)}
                 onToggleWishlist={toggleWishlist}
               />
             </div>
          ))}
        </div>
        
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-primary-100 selection:text-primary-900" dir="rtl">
      <Navbar 
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
        onSearchClick={() => setCurrentTab('search')}
        onAccountClick={() => setCurrentTab('account')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userName={currentUser?.name}
      />

      <main className="flex-1">
        {renderContent()}
      </main>

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
        onChangeTab={setCurrentTab} 
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


