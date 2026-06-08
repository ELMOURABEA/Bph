import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { MapPin, Phone, Clock, Compass, ShieldCheck, Check } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with modern bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Helper component to programmatically pan/zoom map on branch click
const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  coordinates: [number, number];
  services: string[];
}

export const BranchLocatorView: React.FC = () => {
  const branches: Branch[] = [
    {
      id: 'b1',
      name: 'الفرع الرئيسي - المنصورة (حي الجامعة)',
      city: 'المنصورة',
      address: 'شارع جيهان، بجوار بوابة جيهان لجامعة المنصورة، الدقهلية',
      phone: '01200400094',
      hours: 'مفتوح 24 ساعة طوال أيام الأسبوع',
      coordinates: [31.04138, 31.3533],
      services: ['خدمة التوصيل 24 ساعة', 'قياس الضغط والسكر مجاناً', 'ركن مخصص للأطفال', 'دعم التأمين الطبي']
    },
    {
      id: 'b2',
      name: 'فرع القاهرة - مدينة نصر',
      city: 'القاهرة',
      address: 'شارع عباس العقاد، بجوار بنك مصر، مدينة نصر، القاهرة',
      phone: '01200400095',
      hours: 'من 8 صباحاً حتى 2 بعد منتصف الليل',
      coordinates: [30.0617, 31.3364],
      services: ['خدمة التوصيل المنزلي السريع', 'قياس السكر والوزن مجاناً', 'استشارات مستحضرات التجميل']
    },
    {
      id: 'b3',
      name: 'فرع الإسكندرية - سموحة',
      city: 'الإسكندرية',
      address: 'شارع فوزى معاذ، أمام نادى سموحة الرياضى، الإسكندرية',
      phone: '01200400096',
      hours: 'مفتوح 24 ساعة طوال أيام الأسبوع',
      coordinates: [31.2001, 29.9187],
      services: ['خدمة التوصيل 24 ساعة', 'قياس الضغط مجاناً', 'دعم التأمين الطبي']
    }
  ];

  const [selectedBranch, setSelectedBranch] = useState<Branch>(branches[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>(branches[0].coordinates);
  const [zoom, setZoom] = useState<number>(14);

  const selectBranchHandler = (branch: Branch) => {
    setSelectedBranch(branch);
    setMapCenter(branch.coordinates);
    setZoom(15);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <div className="text-center mb-10">
        <span className="text-xs bg-red-50 text-[#CE1126] px-4 py-1.5 rounded-full font-extrabold tracking-widest uppercase">محدد مواقع الفروع</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-4 mb-2">فروع صيدليات البنداري</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-bold text-sm">
          تفضل بزيارة أقرب فروعنا إليك، تتوفر لدينا أحدث الخدمات واللوازم والمشورات الطبية المتخصصة
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
        {/* Branches Directory Panel - 5 Columns */}
        <div className="lg:col-span-5 flex flex-col h-[550px] divide-y divide-gray-100">
          <div className="p-5 bg-gray-50">
            <h3 className="font-extrabold text-[#CE1126] text-base mb-1">دليل الفروع</h3>
            <p className="text-xs text-gray-400 font-bold">اختر فرعاً لعرض موقعه الجغرافي وتفاصيله الكاملة</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {branches.map((branch) => {
              const isSelected = selectedBranch.id === branch.id;
              return (
                <div 
                  key={branch.id}
                  onClick={() => selectBranchHandler(branch)}
                  className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 relative ${
                    isSelected 
                      ? 'bg-gradient-to-l from-red-50/50 to-white border-[#CE1126] shadow-md shadow-red-900/10' 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isSelected ? 'bg-[#CE1126] text-white' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-extrabold text-red-600 block mb-0.5">{branch.city}</span>
                      <h4 className="font-black text-gray-900 text-sm leading-snug">{branch.name}</h4>
                      <p className="text-xs text-gray-500 mt-1 lines-2 font-medium">{branch.address}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                    <span className="flex items-center gap-1 font-bold">
                      <Clock size={12} className="text-red-500" />
                      {branch.hours.includes('24') ? 'مفتوح 24 ساعة' : 'عادي'}
                    </span>
                    <span className="text-[#CE1126] font-black group-hover:underline flex items-center gap-1 text-[11px]">
                      تحديد الاتجاه <Compass size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Panel & Selected Branch Information - 7 Columns */}
        <div className="lg:col-span-7 flex flex-col h-[550px] relative">
          
          {/* Map wrapper */}
          <div className="flex-1 relative z-0 border-b border-gray-100">
            <MapContainer 
              center={mapCenter} 
              zoom={zoom} 
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
            >
              <ChangeMapView center={mapCenter} zoom={zoom} />
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                attribution="&copy; OpenStreetMap" 
              />
              {branches.map(b => (
                <Marker 
                  key={b.id} 
                  position={b.coordinates}
                  eventHandlers={{
                    click: () => setSelectedBranch(b)
                  }}
                >
                  <Popup className="font-sans font-bold">
                    <div className="p-1">
                      <h4 className="font-black text-[#CE1126] text-xs mb-1">{b.name}</h4>
                      <p className="text-[10px] text-gray-500 font-medium mb-1">{b.address}</p>
                      <span className="text-[9px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold">{b.hours}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Selected Branch Detail Card Overlay at the bottom */}
          <div className="p-5 bg-white border-t border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-gray-900 text-base flex items-center gap-2">
                  <span>{selectedBranch.name}</span>
                  <span className="text-xs bg-red-50 text-[#CE1126] px-2 py-0.5 rounded font-black flex items-center gap-1">
                    <ShieldCheck size={12} /> موثق
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">{selectedBranch.address}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a 
                  href={`tel:${selectedBranch.phone}`}
                  className="bg-[#CE1126] text-white hover:bg-black p-3 rounded-xl transition flex items-center gap-2 font-bold text-xs shadow-md shadow-red-900/10"
                >
                  <Phone size={14} />
                  <span>اتصال: {selectedBranch.phone}</span>
                </a>
              </div>
            </div>

            {/* List of services provided */}
            <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-gray-50">
              {selectedBranch.services.map((service, index) => (
                <span 
                  key={index}
                  className="bg-red-50 border border-red-100 text-red-800 text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <Check size={12} className="text-[#CE1126]" />
                  {service}
                </span>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
