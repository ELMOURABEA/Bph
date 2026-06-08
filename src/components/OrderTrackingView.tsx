import React, { useState } from 'react';
import { Package, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with modern bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { OrderProgress } from './OrderProgress';
import { Order } from '../types';

interface OrderTrackingProps {
  orders: Order[];
  onBack: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingProps> = ({ orders, onBack }) => {
  const [orderQuery, setOrderQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery) return;
    const order = orders.find(o => o.id.toLowerCase() === orderQuery.trim().toLowerCase());
    setSearchedOrder(order || null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-full flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold transition">
        <ArrowRight size={20} />
        العودة الرئيسية
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">تتبع طلبك</h2>
        <p className="text-gray-500">أدخل رقم الطلب لمعرفة حالة التوصيل الحالية</p>
      </div>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex relative">
          <input 
            type="text" 
            value={orderQuery}
            onChange={e => setOrderQuery(e.target.value)}
            placeholder="مثال: ORD-2024-123"
            className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none shadow-sm transition-all text-left dir-ltr"
          />
          <button type="submit" className="absolute left-2 top-2 bottom-2 bg-primary-600 text-white px-6 rounded-lg font-bold hover:bg-primary-700 transition">
            تتبع
          </button>
        </div>
      </form>

      {orderQuery && searchedOrder ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">طلب #{searchedOrder.id}</h3>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <MapPin size={16} /> 
                العنوان المسجل
              </div>
            </div>
            <div className="font-black text-primary-600 text-xl mt-4 sm:mt-0 bg-primary-50 px-4 py-2 rounded-xl text-center">
              {searchedOrder.total.toFixed(2)} <span className="text-sm">ج.م</span>
            </div>
          </div>

          <OrderProgress status={searchedOrder.status} />

          <div className="mt-8 mb-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm relative" style={{ height: '240px' }}>
            <MapContainer 
              bounds={[[30.0444, 31.2357], [30.0500, 31.2400]]} 
              style={{ height: '100%', width: '100%', zIndex: 0 }} 
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                attribution="&copy; OpenStreetMap" 
              />
              {/* Pharmacy Branch */}
              <Marker position={[30.0444, 31.2357]}>
                <Popup className="font-bold font-sans">صيدلية البنداري - الفرع الرئيسي</Popup>
              </Marker>
              {/* Delivery Location */}
              <Marker position={[30.0500, 31.2400]}>
                <Popup className="font-bold font-sans">عنوان التوصيل المسجل</Popup>
              </Marker>
            </MapContainer>
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm z-[1000] text-xs font-bold text-gray-700 flex items-center gap-2">
              <MapPin size={14} className="text-primary-600" />
              موقع التسليم
            </div>
          </div>

          {searchedOrder.status === 'Delivered' && (
            <div className="mt-8 bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 font-bold border border-green-100">
              <CheckCircle size={24} />
              تم توصيل الطلب بنجاح. شكراً لتسوقك من صيدليات البندارى!
            </div>
          )}
        </div>
      ) : orderQuery && searchedOrder === null ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">طلب غير موجود</h3>
          <p className="text-gray-500">تأكد من كتابة رقم الطلب بشكل صحيح وحاول مرة أخرى.</p>
        </div>
      ) : null}
    </div>
  );
};
