import React from 'react';
import { X as CloseIcon } from 'lucide-react';

export const CertificateModal = ({ isOpen, onClose, imageSrc, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10"
        >
          <CloseIcon size={24} />
        </button>
        <div className="p-2 bg-slate-100 dark:bg-black/20">
          <img src={imageSrc} alt={title} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
        </div>
        <div className="p-6 bg-white dark:bg-slate-900">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
      </div>
    </div>
  );
};
