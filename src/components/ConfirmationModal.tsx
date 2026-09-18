import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Check, X, ShieldAlert } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'success' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'primary',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl border border-[#c1c9bd]/30 space-y-4"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                variant === 'danger'
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : variant === 'success'
                  ? 'bg-[#b8f1b9] text-[#002108]'
                  : 'bg-[#ffdcc3] text-[#904d00]'
              }`}
            >
              {variant === 'danger' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-[16px] font-bold text-[#1b1b1e] leading-snug">{title}</h3>
              <p className="text-[13px] text-[#414940] leading-relaxed">{message}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onCancel}
              className="py-2.5 px-3 rounded-xl bg-[#f0edf1] hover:bg-[#eae7eb] text-[#1b1b1e] font-semibold text-[13px] transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`py-2.5 px-3 rounded-xl font-bold text-[13px] text-white transition-colors cursor-pointer shadow-xs ${
                variant === 'danger'
                  ? 'bg-[#ba1a1a] hover:bg-[#93000a]'
                  : variant === 'success'
                  ? 'bg-[#1e5128] hover:bg-[#013a13]'
                  : 'bg-[#904d00] hover:bg-[#6e3900]'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
