import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: -24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md pointer-events-auto"
        >
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md flex items-center justify-between gap-3 text-[13px] font-medium leading-snug ${
              toast.type === 'warning'
                ? 'bg-[#fff7ed] border-[#fed7aa] text-[#9a3412]'
                : toast.type === 'info'
                ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
                : 'bg-[#143e21] border-[#1e5831] text-[#f2fbf4] shadow-emerald-950/20'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-[#ea580c] shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-[#16a34a] shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#86efac] shrink-0" />
              )}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
