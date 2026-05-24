import React from 'react';
import { Plus, Star, ShieldAlert, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col h-full group">
      {/* Discount Badge */}
      {product.originalPrice && (
        <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md">
          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% خصم
        </div>
      )}
      
      {/* Wishlist Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
        className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-400 hover:text-primary-600 transition-colors shadow-sm"
      >
        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} className={isWishlisted ? 'text-primary-600' : ''} />
      </button>

      {product.prescriptionRequired && (
        <div className="absolute top-10 left-2 z-10 bg-orange-100/90 backdrop-blur-sm text-orange-700 p-1.5 rounded-md" title="وصفة طبية مطلوبة">
          <ShieldAlert size={16} />
        </div>
      )}

      {/* Product Image */}
      <div className="w-full aspect-square bg-gray-50 p-4 shrink-0 flex items-center justify-center relative">
         <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
         />
      </div>

      {/* Meta */}
      <div className="flex-1 p-3 flex flex-col">
        <div className="text-[10px] font-bold text-primary-600 mb-1 tracking-wider uppercase">
          {product.brand}
        </div>
        
        <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
          <span className="text-xs font-bold text-gray-700">{product.rating}</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <div className="text-lg font-black text-primary-600 leading-none mb-0.5">
              {product.price.toFixed(2)} <span className="text-xs font-bold">ج.م</span>
            </div>
            {product.originalPrice && (
               <div className="text-xs font-medium text-gray-400 line-through">
                {product.originalPrice.toFixed(2)} ج.م
               </div>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="w-9 h-9 bg-primary-50 text-primary-600 flex items-center justify-center rounded-lg hover:bg-primary-600 hover:text-white transition-colors border border-primary-100 disabled:opacity-50"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
