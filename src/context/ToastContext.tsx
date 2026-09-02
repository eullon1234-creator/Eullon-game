import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, Info, Trophy, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'achievement';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  icon?: string;
}

interface ToastContextType {
  showToast: (title: string, message?: string, type?: ToastType, icon?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success', icon?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast: ToastItem = { id, type, title, message, icon };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up ${
              toast.type === 'achievement'
                ? 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-glow-amber'
                : toast.type === 'success'
                ? 'bg-gamer-900/95 border-emerald-500/40 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-gamer-900/95 border-rose-500/40 text-rose-300'
                : 'bg-gamer-900/95 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {toast.type === 'achievement' ? (
                <span className="text-2xl">{toast.icon || '🏆'}</span>
              ) : toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <Info className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-wide text-white flex items-center gap-1.5">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed break-words">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};
