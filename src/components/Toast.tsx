import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, BellRing } from 'lucide-react';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    error: <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-sky-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400',
    warning: 'border-amber-500/20 bg-amber-950/20 text-amber-400',
    error: 'border-rose-500/20 bg-rose-950/20 text-rose-400',
    info: 'border-sky-500/20 bg-sky-950/20 text-sky-400',
  };

  return (
    <div
      id={`toast-${toast.id}`}
      className={`border rounded-md px-4 py-3 shadow-lg flex items-center justify-between gap-3 min-w-[280px] max-w-sm animate-slide-in font-sans text-xs ${borders[toast.type]}`}
    >
      <div className="flex items-center gap-2.5">
        {icons[toast.type]}
        <span className="font-medium text-[#dce3ef]">{toast.message}</span>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-[#8c909f] hover:text-white transition-colors p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
