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
    { id: 'light', name: 'Light Mode', icon: '☀️' },
    { id: 'dark', name: 'Dark Mode', icon: '🌙' },
    { id: 'system', name: 'System Default', icon: '💻' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[9999]"
        onClick={onClose}
        style={{
          background: 'radial-gradient(circle at center, rgba(100, 150, 200, 0.12), rgba(50, 100, 150, 0.05))',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          className="relative max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="relative bg-white/10 border border-white/30 rounded-[28px] p-7 overflow-hidden"
            style={{
              backdropFilter: 'blur(50px) saturate(180%)',
              WebkitBackdropFilter: 'blur(50px) saturate(180%)',
              boxShadow: '0 25px 70px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
            }}
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
            
            {/* Mac-style red close button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-5 left-5 w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] shadow-md border border-red-700/20 transition-all z-10"
              title="Close"
            />

            <div className="relative">
              <h2 className="text-lg font-medium text-gray-800 mb-6 tracking-tight">Settings</h2>

              <div className="space-y-5">
                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Appearance
                  </label>
                  <div className="flex gap-2">
                    {themes.map((theme) => (
                      <motion.button
                        key={theme.id}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => updatePreferences({ theme: theme.id as any })}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                          preferences.theme === theme.id
                            ? 'bg-white/30 border-2 border-blue-400/60 shadow-lg shadow-blue-500/10'
                            : 'bg-white/10 border-2 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <span className="text-3xl">{theme.icon}</span>
                        <span className={`text-xs font-medium ${
                          preferences.theme === theme.id ? 'text-blue-700' : 'text-gray-600'
                        }`}>
                          {theme.name.split(' ')[0]}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
