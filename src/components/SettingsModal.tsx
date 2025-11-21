import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useAppStore();

  const themes = [
    { 
      id: 'light', 
      name: 'Light',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill="#FFB800" />
          <path d="M12 1v3M12 20v3M22 12h-3M5 12H2M19.07 4.93l-2.12 2.12M7.05 16.95l-2.12 2.12M19.07 19.07l-2.12-2.12M7.05 7.05L4.93 4.93" stroke="#FFB800" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    { 
      id: 'dark', 
      name: 'Dark',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#5E5CE6" />
        </svg>
      )
    },
    { 
      id: 'system', 
      name: 'System',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="13" rx="2" stroke="#007AFF" strokeWidth="2" fill="none" />
          <path d="M8 21h8M12 17v4" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="10" r="1.5" fill="#007AFF" />
        </svg>
      )
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: 9999, pointerEvents: 'auto' }}
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none p-4" style={{ zIndex: 10000 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full max-w-[440px] bg-white rounded-xl shadow-2xl overflow-hidden"
              style={{ position: 'relative', zIndex: 10001 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Done button clicked');
                    onClose();
                  }}
                  className="text-[15px] text-blue-500 hover:text-blue-600 font-normal"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  Done
                </button>
                <h3 className="text-[17px] font-semibold text-gray-900">
                  Settings
                </h3>
                <div className="w-12"></div>
              </div>

              {/* Content */}
              <div className="px-5 py-6">
                <div>
                  <label className="block text-[13px] font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                    Appearance
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((theme) => (
                      <motion.button
                        key={theme.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Theme button clicked:', theme.id);
                          updatePreferences({ theme: theme.id as any });
                        }}
                        className={`flex flex-col items-center gap-3 p-5 rounded-xl transition-all ${
                          preferences.theme === theme.id
                            ? 'bg-blue-50 ring-2 ring-blue-500'
                            : 'bg-gray-100 hover:bg-gray-150'
                        }`}
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                      >
                        <div className="flex items-center justify-center">
                          {theme.icon}
                        </div>
                        <span className={`text-[15px] font-medium ${
                          preferences.theme === theme.id ? 'text-blue-600' : 'text-gray-700'
                        }`}>
                          {theme.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
