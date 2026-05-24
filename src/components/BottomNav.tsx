import React from 'react';
import { Home, FileSignature, ShoppingBag, ListOrdered, Menu } from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onChangeTab: (tab: string) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onChangeTab, cartCount }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'cart', icon: ShoppingBag, label: 'السلة', badge: cartCount },
    { id: 'prescription', icon: FileSignature, label: 'الروشتة' },
    { id: 'account', icon: ListOrdered, label: 'الطلبات' },
    { id: 'menu', icon: Menu, label: 'القائمة' },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 pb-safe md:hidden z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'fill-primary-50' : ''} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center rounded-full border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
