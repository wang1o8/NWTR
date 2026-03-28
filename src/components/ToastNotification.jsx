import React, { useEffect, useState } from 'react';
import { useGameStore } from '../engine/useGameStore';
import { motion, AnimatePresence } from 'motion/react';

export const ToastNotification = () => {
  const toastQueue = useGameStore((state) => state.toastQueue);
  const removeToast = useGameStore((state) => state.removeToast);

  // Limit to 3 toasts visible at once
  const visibleToasts = toastQueue.slice(0, 3);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const bgColor = toast.type === 'item' ? 'bg-indigo-900/90' : 'bg-slate-900/90';
  const borderColor = toast.type === 'item' ? 'border-indigo-400/50' : 'border-slate-400/50';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`${bgColor} ${borderColor} border px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 min-w-[200px] backdrop-blur-sm`}
    >
      <span className="text-xl">{toast.icon}</span>
      <span className="text-sm font-medium text-white">{toast.message}</span>
    </motion.div>
  );
};
