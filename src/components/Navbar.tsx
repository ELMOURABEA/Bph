import React from 'react';
import { ShoppingCart, Search, Menu, User, Bell, Phone } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
  onSearchClick: () => void;
  onAccountClick: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  onMenuClick,
  onSearchClick,
  onAccountClick,
  searchQuery,
  setSearchQuery,
  userName
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Icons Context (Right in RTL) */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-primary-600">
              <Bell size={24} />
            </button>
            <a href="tel:01200400094" className="text-gray-600 hover:text-primary-600">
              <Phone size={24} />
            </a>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-2xl mx-4 lg:mx-12 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary-600" />
              </div>
              <input
                type="text"
                className="block w-full pr-10 pl-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all duration-200 sm:text-sm"
                placeholder="البحث عن منتج ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={onSearchClick}
              />
            </div>
          </div>

          {/* Logo & Desktop Actions */}
          <div className="flex items-center gap-4">
            
            <div className="hidden sm:flex items-center gap-4 ml-4 border-l border-gray-200 pl-4">
              <button 
                onClick={onAccountClick}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary-600 transition-colors"
              >
                <User size={20} />
                <span>{userName || 'تسجيل دخول'}</span>
              </button>
              
              <button 
                onClick={onCartClick}
                className="relative p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
              <img 
                src="https://play-lh.googleusercontent.com/yL9BI7YVzh_lQN4ghSJv387TvBpbGvACLzqe3FLB8l91on2fwDrOeQVFU-QzZJv-5DVdZ9ixbZTvjEKBSO82rRw" 
                alt="El-Bendary Pharmacy Logo" 
                className="w-14 h-14 rounded-full object-cover"
              />
              <div className="flex flex-col">
                 <div className="text-[14px] font-bold text-gray-900 leading-tight">صيدليات البندارى</div>
                 <div className="text-[12px] text-gray-500 font-bold tracking-wide">El-Bendary Pharmacy</div>
              </div>
            </div>
            
          </div>
          
        </div>
        
        {/* Mobile Search - Shows under navbar on small screens */}
        <div className="pb-4 md:hidden">
          <div className="relative group">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pr-10 pl-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all duration-200 text-base font-medium text-gray-900 shadow-sm"
              placeholder="البحث عن منتج ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={onSearchClick}
            />
          </div>
        </div>

      </div>
    </header>
  );
};
