import React from 'react';
import { OrderStatus } from '../types';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderProgressProps {
  status: OrderStatus;
}


const STEPS: { id: OrderStatus; label: string }[] = [
  { id: 'Pending', label: 'قيد المراجعة' },
  { id: 'Confirmed', label: 'تم التأكيد' },
  { id: 'Processing', label: 'جاري التجهيز' },
  { id: 'OutForDelivery', label: 'في الطريق' },
  { id: 'Delivered', label: 'تم التوصيل' }
];

export const OrderProgress: React.FC<OrderProgressProps> = ({ status }) => {
  if (status === 'Cancelled') {
    return (
      <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-bold border border-red-100 text-center">
        تم إلغاء هذا الطلب
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.id === status);

  return (
    <div className="relative py-4">
      {/* Progress Bar Track */}
      <div className="absolute top-6 left-4 right-4 h-1 bg-gray-100 rounded-full" dir="ltr" />
      <div 
        className="absolute top-6 right-4 h-1 bg-primary-600 rounded-full transition-all duration-500" 
        dir="rtl"
        style={{ width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%` }}
      />
      
      {/* Steps */}
      <div className="relative flex justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isActive = index === currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative">
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-primary-200 rounded-full z-0 w-5 h-5"
                />
              )}
              <motion.div 
                layout
                className={`w-5 h-5 rounded-full flex items-center justify-center z-10 border-2 transition-colors duration-300 ${
                  isCompleted 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'bg-white border-gray-200'
                }`}
              >
                {isCompleted && <Check size={12} strokeWidth={4} />}
              </motion.div>
              <span className={`text-[10px] sm:text-xs mt-2 font-bold text-center ${
                isActive ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
