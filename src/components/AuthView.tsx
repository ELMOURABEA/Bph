import React, { useState } from 'react';

interface AuthProps {
  onLogin: (phone: string, name: string) => void;
}

export const AuthView: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    onLogin(phone, name || 'مستخدم جديد');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h2>
          <p className="text-gray-500">
            {isRegister ? 'قم بإنشاء حساب للتمتع بمميزات صيدليات البندارى' : 'مرحباً بك مجدداً في صيدليات البندارى'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {isRegister && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم بالكامل</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                placeholder="أدخل اسمك"
              />
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الهاتف</label>
            <div className="flex relative">
              <div className="flex items-center px-4 bg-gray-50 border border-l-0 border-gray-200 rounded-r-xl border-r-2 dir-ltr">
                <span className="font-bold text-gray-700">+20</span>
                <span className="ml-2 text-xl">🇪🇬</span>
              </div>
              <input 
                type="tel" 
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dir-ltr text-right"
                placeholder="1X XXXX XXXX"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-colors mb-6 shadow-sm"
          >
            {isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-gray-500 hover:text-gray-900 font-medium"
            >
              {isRegister ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'عميل جديد؟ أنشئ حساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
