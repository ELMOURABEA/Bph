import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, BadgeDollarSign } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  updateQuantity, 
  removeItem,
  onCheckout
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed inset-y-0 left-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">سلة المشتريات</h2>
            <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full mr-2">
              {items.length} منتجات
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">سلتك فارغة</h3>
              <p className="text-gray-500 max-w-[200px]">قم بإضافة بعض المنتجات الصحية لتبدأ.</p>
              <button 
                onClick={onClose}
                className="mt-8 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition"
              >
                تصفح المنتجات
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 group bg-white shadow-sm border border-gray-100 p-3 rounded-xl border-r-4 border-r-primary-500">
                  <div className="w-20 h-20 rounded-xl bg-gray-50 p-2 shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-1">
                       <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">
                        {item.product.name}
                      </h4>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors mr-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <p className="text-[10px] text-gray-500 mt-1">{item.product.brand}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-2">
                       <div className="font-black text-gray-900">
                          {(item.product.price * item.quantity).toFixed(2)} <span className="text-xs text-gray-500 font-bold">ج.م</span>
                        </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button 
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-primary-600 disabled:opacity-50"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-md bg-white text-gray-600 shadow-sm hover:text-primary-600"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-gray-50">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>المجموع الفرعي</span>
                <span className="font-bold text-gray-900">{subtotal.toFixed(2)} ج.م</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 font-medium">
                <span>رسوم التوصيل</span>
                <span className="font-bold text-gray-900">{deliveryFee.toFixed(2)} ج.م</span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900 text-lg">الإجمالي</span>
                <span className="font-black text-primary-600 text-xl">{total.toFixed(2)} ج.م</span>
              </div>
            </div>
            
            <div className="bg-yellow-50 text-yellow-800 text-xs font-bold p-3 rounded-lg flex items-start gap-2 mb-4">
               <BadgeDollarSign size={16} className="mt-0.5 shrink-0" />
               <p>يمكنك الدفع عبر المحافظ الإلكترونية فودافون/اورانج/اتصالات كاش على الرقم: 01200400089</p>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2"
            >
              <CreditCard size={20} />
              استكمال الطلب
            </button>
          </div>
        )}
      </div>
    </>
  );
};
