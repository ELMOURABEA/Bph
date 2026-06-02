import React, { useState } from 'react';
import { User, FileText, ShoppingBag, MapPin, Search, Heart, Package, XCircle } from 'lucide-react';
import { Order, User as UserType, Product } from '../types';
import { OrderProgress } from './OrderProgress';
import { ProductCard } from './ProductCard';

interface AccountProps {
  user: UserType | null;
  orders: Order[];
  onLogout: () => void;
  wishlist: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onCancelOrder?: (orderId: string) => void;
}

export const AccountView: React.FC<AccountProps> = ({ user, orders, onLogout, wishlist, onToggleWishlist, onAddToCart, onCancelOrder }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses'>('orders');

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">حسابي</h2>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-500 dir-ltr text-right">{user.phone}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold border-b-2 transition-colors ${activeTab === 'orders' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Package size={20} /> الطلبات
        </button>
        <button 
          onClick={() => setActiveTab('wishlist')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold border-b-2 transition-colors ${activeTab === 'wishlist' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <Heart size={20} /> المفضلة
        </button>
        <button 
          onClick={() => setActiveTab('addresses')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold border-b-2 transition-colors ${activeTab === 'addresses' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
        >
          <MapPin size={20} /> العناوين
        </button>
      </div>

      <div>
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <Package size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold">لا توجد طلبات سابقة.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex flex-wrap justify-between items-center mb-6 border-b border-gray-50 pb-4">
                    <div>
                       <span className="font-bold text-gray-900 text-lg">طلب #{order.id}</span>
                       <div className="text-sm text-gray-500 mt-1">
                         {new Date(order.date).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                    <div className="font-black text-primary-600 text-xl mt-2 sm:mt-0 flex flex-col items-end gap-2">
                      <span>{order.total.toFixed(2)} <span className="text-sm">ج.م</span></span>
                      {(order.status === 'Pending' || order.status === 'Confirmed') && onCancelOrder && (
                        <button 
                          onClick={() => onCancelOrder(order.id)}
                          className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 font-bold transition-colors"
                        >
                          <XCircle size={16} /> إلغاء الطلب
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <OrderProgress status={order.status} />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-gray-900 mb-3">تفاصيل المنتجات</h4>
                    <ul className="space-y-2">
                       {order.items.map(item => (
                         <li key={item.product.id} className="flex justify-between items-center text-sm">
                           <span className="text-gray-700 font-medium">{item.quantity}x {item.product.name}</span>
                           <span className="text-gray-900 font-bold">{(item.product.price * item.quantity).toFixed(2)} ج.م</span>
                         </li>
                       ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-bold mb-4">قائمة المفضلة فارغة</p>
                <p className="text-sm text-gray-400">تصفح المنتجات واضغط على علامة القلب لإضافتها هنا.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {wishlist.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={onAddToCart}
                    isWishlisted={true}
                    onToggleWishlist={onToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'addresses' && (
          <div>
            {user.addresses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                 <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                 <p className="text-gray-500 font-bold mb-4">لم تقم بإضافة عناوين بعد.</p>
                 <button className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold">إضافة عنوان جديد</button>
              </div>
            ) : (
              user.addresses.map(address => (
                <div key={address.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                  <div className="bg-primary-50 p-3 rounded-full text-primary-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{address.label}</h4>
                    <p className="text-gray-600">{address.details}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
