import React from 'react';
import { Pill, Activity, Sparkles, Baby, Stethoscope, Droplets, Filter, X } from 'lucide-react';
import { Category, FilterState } from '../types';

const iconMap: Record<string, React.ReactNode> = {
  Pill: <Pill size={18} />,
  Activity: <Activity size={18} />,
  Sparkles: <Sparkles size={18} />,
  Baby: <Baby size={18} />,
  Stethoscope: <Stethoscope size={18} />,
  Droplets: <Droplets size={18} />
};

interface SidebarProps {
  categories: Category[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ categories, filters, setFilters, isOpen, onClose }) => {
  
  const handleCategoryToggle = (categoryName: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryName)
        ? prev.categories.filter(c => c !== categoryName)
        : [...prev.categories, categoryName]
    }));
  };

  const handlePrescriptionToggle = (value: boolean | null) => {
    setFilters(prev => ({ ...prev, prescriptionOnly: value }));
  };

  const clearFilters = () => {
    setFilters({ categories: [], brands: [], priceRange: [0, 5000], prescriptionOnly: null });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:sticky top-0 md:top-20 left-0 h-[100dvh] md:h-[calc(100vh-5rem)]
        w-72 bg-white md:bg-transparent z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-y-auto border-r border-gray-100 md:border-none shadow-2xl md:shadow-none
        p-6
      `}>
        <div className="flex items-center justify-between mb-8 md:hidden">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
            <Filter size={20} />
            <h2>Filters</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="hidden md:flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-900 text-lg">Categories</h2>
          {(filters.categories.length > 0 || filters.prescriptionOnly !== null) && (
            <button onClick={clearFilters} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
              Clear All
            </button>
          )}
        </div>

        {/* Categories Section */}
        <div className="space-y-1 mb-8">
          {categories.map((category) => {
            const isSelected = filters.categories.includes(category.name);
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.name)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-emerald-50 text-emerald-700 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`${isSelected ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {iconMap[category.icon] || <span className="w-4 h-4" />}
                  </div>
                  <span className="text-sm">{category.name}</span>
                </div>
                {/* Visual indicator of selection isn't strictly necessary since background changes, but a tick could go here */}
              </button>
            );
          })}
        </div>

        {/* Type Filter */}
        <div className="mb-8">
          <h3 className="font-bold text-gray-900 mb-4 px-2">Access Type</h3>
          <div className="space-y-2 px-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="prescription"
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                checked={filters.prescriptionOnly === null}
                onChange={() => handlePrescriptionToggle(null)}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">All Products</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="prescription"
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                checked={filters.prescriptionOnly === false}
                onChange={() => handlePrescriptionToggle(false)}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Over The Counter (OTC)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="prescription"
                className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
                checked={filters.prescriptionOnly === true}
                onChange={() => handlePrescriptionToggle(true)}
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Prescription Required</span>
            </label>
          </div>
        </div>

      </aside>
    </>
  );
};
