import React, { useState, useRef } from 'react';
import { FileSignature, Upload, X, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PrescriptionUploadProps {
  onBack: () => void;
  user: any; // User type
}

export const PrescriptionUploadView: React.FC<PrescriptionUploadProps> = ({ onBack, user }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validation
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        setStatus('error');
        setErrorMessage('يرجى رفع صورة أو ملف PDF فقط.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setStatus('error');
        setErrorMessage('حجم الملف يجب أن لا يتجاوز 5 ميجابايت.');
        return;
      }

      setSelectedFile(file);
      setStatus('idle');
      
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    if (!user) {
      setStatus('error');
      setErrorMessage('يجب تسجيل الدخول أولاً لرفع الروشتة.');
      return;
    }

    setUploading(true);
    setStatus('idle');

    try {
      // Create a unique file name
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `prescriptions/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('medical_records')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Save record in the database (optional, depending on your schema)
      // await supabase.from('prescriptions').insert([{ user_id: user.id, file_path: filePath, status: 'pending' }]);

      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage('حدث خطأ أثناء رفع الروشتة. يرجى المحاولة مرة أخرى لاحقاً.');
    } finally {
      setUploading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">تم استلام روشتتك بنجاح!</h2>
          <p className="text-gray-500 mb-8 mt-4">
            سيقوم أحد الصيادلة لدينا بمراجعة الروشتة وسنتواصل معك قريباً لتأكيد الطلب وتوضيح التكلفة.
          </p>
          <button 
            onClick={onBack}
            className="bg-primary-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-primary-700 transition"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileSignature size={32} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">صرف روشتة</h2>
        <p className="text-gray-500">ارفع صورة الروشتة وسنقوم بتجهيز الأدوية وتوصيلها لك</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        
        {status === 'error' && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <span className="font-medium text-sm">{errorMessage}</span>
          </div>
        )}

        {!selectedFile ? (
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all"
              >
                <Upload size={32} className="mb-3" />
                <span className="font-bold">رفع من المعرض</span>
                <span className="text-xs text-gray-400 mt-1">صورة أو PDF (الحد الأقصى 5MB)</span>
              </button>
              
              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('capture', 'environment');
                    fileInputRef.current.click();
                    setTimeout(() => {
                      if (fileInputRef.current) fileInputRef.current.removeAttribute('capture');
                    }, 100);
                  }
                }}
                className="border-2 border-primary-100 bg-primary-50 rounded-xl p-8 flex flex-col items-center justify-center text-primary-600 hover:bg-primary-100 transition-all"
              >
                <Camera size={32} className="mb-3" />
                <span className="font-bold">التقاط صورة</span>
                <span className="text-xs opacity-80 mt-1">استخدم كاميرا الهاتف</span>
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <h4 className="font-bold text-yellow-800 mb-1 flex items-center gap-2">
                <AlertCircle size={16} /> تعليمات هامة:
              </h4>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>تأكد من أن صورة الروشتة واضحة ومقروءة.</li>
                <li>يجب أن تحتوي الروشتة على ختم الطبيب وتاريخ حديث.</li>
                <li>الأدوية الخاضعة للرقابة تتطلب تسليم الروشتة الأصلية للمندوب.</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95">
            <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center mb-6">
              {previewUrl ? (
                <img src={previewUrl} alt="Prescription preview" className="max-w-full max-h-[400px] object-contain" />
              ) : (
                <div className="py-20 flex flex-col items-center text-gray-500">
                  <FileSignature size={48} className="mb-4 opacity-50" />
                  <span className="font-bold">{selectedFile.name}</span>
                  <span className="text-sm mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              )}
              
              <button 
                onClick={clearSelection}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur text-red-600 p-2 rounded-full hover:bg-red-50 transition shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <button 
              onClick={handleUpload}
              disabled={uploading}
              className={`w-full flex justify-center items-center gap-2 font-bold py-4 rounded-xl transition-all shadow-sm ${
                uploading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  جاري الرفع...
                </>
              ) : (
                'تأكيد وإرسال الروشتة'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
