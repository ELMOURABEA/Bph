import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowRight, Loader2 } from 'lucide-react';

interface AIChatProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'أهلاً بك! أنا الصيدلي الآلي المساعد الخاص بصيدليات البنداري. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'عذراً، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 mt-16 pb-16 md:pb-0">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="text-gray-600 p-1 hover:bg-gray-100 rounded-full">
            <ArrowRight size={24} />
          </button>
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Bot size={24} className="text-primary-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">الصيدلي الآلي</h2>
            <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#CE1126] inline-block animate-pulse"></span>
              متصل - صيدلية البنداري الذكية
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 mt-auto mb-1">
                {msg.role === 'user' ? <User size={16} className="text-gray-600" /> : <Bot size={16} className="text-gray-600" />}
              </div>
              <div 
                className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}
              >
                <div 
                   className="text-sm leading-relaxed" 
                   style={{ whiteSpace: 'pre-wrap' }}
                   dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} 
                />
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row gap-2">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 mt-auto mb-1">
                <Bot size={16} className="text-gray-600" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-200 rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="text-primary-600 animate-spin" />
                <span className="text-sm text-gray-500">جاري كتابة الرد...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 p-3 pb-6 md:pb-3 sticky bottom-[64px] md:bottom-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب استفسارك الطبي هنا..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 pr-4 pl-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute left-1.5 top-1.5 bottom-1.5 bg-primary-600 text-white w-9 rounded-full flex items-center justify-center hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={16} className="mr-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
