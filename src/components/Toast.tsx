import React from 'react';
import { CheckCircle2, Zap, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto p-3.5 rounded-xl bg-[#0d131f]/95 border border-white/15 shadow-2xl backdrop-blur-xl flex items-start gap-3"
          >
            <div className="mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              {toast.type === 'info' && (
                <Zap className="w-4 h-4 text-[#ff7a00]" />
              )}
              {toast.type === 'warning' && (
                <AlertCircle className="w-4 h-4 text-amber-400" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold text-slate-100 font-mono">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-white transition p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

