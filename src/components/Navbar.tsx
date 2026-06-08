import React, { useState } from 'react';
import { ShoppingCart, Search, User, Bell, Phone, MapPin, Sparkles, Heart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onAccountClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userName?: string;
  // Optional extra callbacks for the premium experience
  onChangeTab?: (tab: string) => void;
  wishlistCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  onMenuClick,
  onSearchClick,
  onAccountClick,
  searchQuery,
  setSearchQuery,
  userName,
  onChangeTab,
  wishlistCount = 0
}) => {
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const popularSearches = [
    { label: 'سيرافي مرطب', term: 'سيرافي' },
    { label: 'لاروش رغوي', term: 'لاروش بوزيه' },
    { label: 'فيتامينات', term: 'الفيتامينات' },
    { label: 'بنادول إكسترا', term: 'بنادول' },
    { label: 'بيوديرما', term: 'بيوديرما' }
  ];

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    onSearchClick();
    setShowSearchSuggestions(false);
  };

  return (
    <header className="sticky top-0 z-45 bg-white shadow-md border-b border-gray-100">
      {/* Top Multi-Info Announcement Bar (Crimson Red / Pure White / Black Accent) */}
      <div className="bg-black text-white text-[11px] md:text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Right side: Promo banner */}
          <div className="flex items-center gap-2 font-bold text-gray-100">
            <Sparkles size={14} className="text-[#E11D48] animate-pulse" />
            <span>شحن مجاني للطلبات أكبر من 300 ج.م وسرعة فائقة في التوصيل لجميع المحافظات!</span>
          </div>

          {/* Left side: Quick actions links linked directly to bendaryph services */}
          <div className="flex items-center gap-4 text-gray-300 font-bold">
            <button 
              onClick={() => onChangeTab?.('ordertracking')}
              className="hover:text-[#E11D48] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>تتبع طلبك</span>
            </button>
            <span className="opacity-30">|</span>
            <button 
              onClick={() => onChangeTab?.('branches')}
              className="hover:text-[#E11D48] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <MapPin size={13} className="text-[#E11D48]" />
              <span>فروعنا</span>
            </button>
            <span className="opacity-30">|</span>
            <a href="https://www.bendaryph.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#E11D48] transition-colors">
              <span>موقعنا: www.bendaryph.com</span>
            </a>
            <span className="opacity-30">|</span>
            <a href="tel:01200400094" className="hover:text-[#E11D48] transition-colors flex items-center gap-1">
              <Phone size={13} />
              <span>اتصل بنا: 01200400094</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 bg-white">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo & Presentation (RTL Right side) */}
          <div 
            onClick={() => {
              if (onChangeTab) {
                onChangeTab('home');
              } else {
                window.location.href = "https://www.bendaryph.com";
              }
            }} 
            className="flex items-center gap-2 cursor-pointer shrink-0 select-none"
          >
            {/* Elegant double-ring pharmaceutical logo with Red design */}
            <div className="relative w-11 h-11 bg-[#CE1126] rounded-2xl flex items-center justify-center shadow-md shadow-red-900/10 border border-red-700/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2.5">
                <path d="M4.5 16.5C4.5 13.5 6 12 9 12h6c3 0 4.5 1.5 4.5 4.5s-1.5 4.5-4.5 4.5H9c-3 0-4.5-1.5-4.5-4.5z" />
                <path d="M12 2v10M9 5h6" />
              </svg>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-black rounded-full animate-ping"></div>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-black rounded-full"></div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-extrabold text-[#CE1126] tracking-tight leading-none font-display">صيدليات البندارى</span>
              <span className="text-[10px] md:text-[11px] text-gray-900 font-bold tracking-widest uppercase leading-normal">EL-BENDARY PHARMACY</span>
            </div>
          </div>

          {/* Luxury Search Engine with Suggested Prompt keywords (Desktop) */}
          <div className="flex-1 max-w-2xl mx-2 lg:mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#CE1126]" />
              </div>
              <input
                type="text"
                className="block w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl leading-5 font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-[#CE1126] transition-all duration-300 text-sm"
                placeholder="ابحث عن أدوية، فيتامينات، مستحضرات تجميل..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value) onSearchClick();
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                onClick={onSearchClick}
              />
              
              {/* Popular tags below the header */}
              <div className="absolute right-1 top-12 left-1 bg-white/40 flex items-center gap-2 py-1 overflow-x-auto scrollbar-none z-10 select-none">
                <span className="text-[10px] text-gray-400 font-bold shrink-0">أكثر بحثاً:</span>
                {popularSearches.map((ps, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSuggestionClick(ps.term)}
                    className="text-[11px] bg-white border border-gray-150 hover:bg-red-500/5 hover:text-[#CE1126] text-gray-600 px-2.5 py-0.5 rounded-full font-bold transition-all shrink-0 cursor-pointer"
                  >
                    {ps.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Deck (Left Side in RTL) */}
          <div className="flex items-center gap-1 md:gap-3">
            
            {/* Locator Button */}
            <button 
              onClick={() => onChangeTab?.('branches')}
              className="p-2 text-gray-500 hover:text-[#CE1126] hover:bg-gray-50 rounded-xl transition-all flex items-center gap-1 group font-bold text-sm"
              title="تحديد الفروع"
            >
              <MapPin size={22} className="group-hover:scale-105 transition-transform text-[#CE1126]" />
              <span className="hidden lg:inline text-gray-900">الفروع</span>
            </button>

            {/* AI Advisor Button */}
            <button 
              onClick={() => onChangeTab?.('aichat')}
              className="p-2 text-[#CE1126] bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center gap-1 font-bold text-sm border border-red-100 animate-pulse"
              title="مستشارك الطبي الذكي"
            >
              <svg className="w-5 h-5 text-[#CE1126]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a10 10 0 0110 10c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" />
                <path d="M12 6v6M12 16h.01" />
              </svg>
              <span className="hidden sm:inline text-xs">الصيدلي الذكي</span>
            </button>
            
            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            {/* Account Tab */}
            <button 
              onClick={onAccountClick}
              className="p-2 text-gray-500 hover:text-[#CE1126] hover:bg-gray-50 rounded-xl transition-all flex items-center gap-1.5 font-bold text-sm"
            >
              <User size={22} className="text-gray-700" />
              <span className="hidden sm:inline max-w-[100px] truncate text-gray-900">{userName ? userName.split(' ')[0] : 'تسجيل'}</span>
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => onChangeTab?.('account')}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-50 rounded-xl transition-all relative flex items-center"
              title="المفضلة"
            >
              <Heart size={22} className="text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold leading-none text-white bg-[#CE1126] rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative p-2.5 bg-[#CE1126] text-white hover:bg-red-700 rounded-xl transition-all shadow-md shadow-red-950/10 flex items-center gap-2 group ml-1 font-bold text-sm"
            >
              <ShoppingCart size={20} className="group-hover:rotate-6 transition-transform" />
              <span className="hidden md:inline font-black text-white">السلة</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -left-1.5 inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-black leading-none text-[#CE1126] bg-white rounded-full shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
        </div>

        {/* Mobile Search - Bottom Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pr-10 pl-4 py-3 bg-gray-50 border border-gray-200 rounded-xl leading-5 font-bold placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-[#CE1126] transition-all duration-300 text-sm shadow-inner"
              placeholder="ابحث عن أدوية أو منتجات العناية بالبشرة..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) onSearchClick();
              }}
              onClick={onSearchClick}
            />
          </div>
        </div>
      </div>

      {/* Category Dropdown Navigation Bar (Desktop Only) */}
      <div className="border-t border-gray-100 bg-[#FAFAFA] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-2.5 overflow-x-auto scrollbar-none">
          <div className="flex items-center justify-between text-xs lg:text-sm font-bold text-gray-700 gap-6">
            <div className="flex items-center gap-1 text-[#CE1126] hover:opacity-85 cursor-pointer" onClick={() => onChangeTab?.('home')}>
              <Sparkles size={16} className="text-[#CE1126]" />
              <span className="font-extrabold text-[#CE1126]">الرئيسية</span>
            </div>
            
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">العناية بالبشرة</button>
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">الفيتامينات والمكملات</button>
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">مستحضرات تجميل</button>
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">العناية بالشعر</button>
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">الأدوية والوصفات</button>
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">الأم والطفل</button>
            <button onClick={() => onChangeTab?.('search')} className="hover:text-[#CE1126] transition-colors shrink-0 text-gray-800">معدات ومستلزمات طبية</button>
            
            <div className="h-4 w-px bg-gray-200"></div>
            
            <button 
              onClick={() => onChangeTab?.('prescription')}
              className="text-[#CE1126] hover:text-red-700 flex items-center gap-1 font-extrabold shrink-0"
            >
              <span>صرف روشتة أونلاين</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
