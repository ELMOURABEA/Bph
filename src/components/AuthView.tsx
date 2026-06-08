import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: (email: string, name: string) => void;
}

export const AuthView: React.FC<AuthProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'تم إرسال رسالة التأكيد إلى بريدك الإلكتروني! يرجى التحقق منه.' });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin(email, data.user?.user_metadata?.full_name || 'مستخدم');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'حدث خطأ ما' });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'فشل في الاتصال بجوجل' });
    }
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

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <button 
            type="button"
            onClick={signInWithGoogle}
            className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            تسجيل الدخول باستخدام جوجل
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-500 font-medium">أو عبر البريد الإلكتروني</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-4">
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

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dir-ltr text-right"
                placeholder="email@example.com"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
              <input 
                type="password" 
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all dir-ltr text-right"
                placeholder="********"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-xl transition-colors mb-6 shadow-sm ${loading ? 'bg-gray-400' : 'bg-primary-600 hover:bg-primary-700'}`}
            >
              {loading ? 'جاري المعالجة...' : (isRegister ? 'إنشاء حساب' : 'تسجيل الدخول')}
            </button>

            <div className="text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setMessage(null);
                }}
                className="text-gray-500 hover:text-gray-900 font-medium"
              >
                {isRegister ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'عميل جديد؟ أنشئ حساب'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
