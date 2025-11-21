import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  fileName: string;
  fileSize: number;
  onClose: () => void;
  onRemove: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  imageUrl,
  fileName,
  fileSize,
  onClose,
  onRemove,
}) => {
  if (!isOpen || !imageUrl) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-[10000]"
        onClick={onClose}
        style={{
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-4xl max-h-[90vh] mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* macOS-style window */}
          <div 
            className="relative bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: '0 25px 100px rgba(0, 0, 0, 0.5), 0 0 0 0.5px rgba(255, 255, 255, 0.2) inset',
            }}
          >
            {/* macOS-style title bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200/60">
              {/* Traffic light buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] shadow-sm border border-red-700/20 transition-all"
                  title="Close"
                />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm border border-yellow-700/20" />
                <div className="w-3 h-3 rounded-full bg-[#28C840] shadow-sm border border-green-700/20" />
              </div>

              {/* File info */}
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-gray-800 truncate px-8">{fileName}</p>
                <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
              </div>

              {/* Empty space for symmetry */}
              <div className="w-[60px]" />
            </div>

            {/* Image container */}
            <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 p-8">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                src={imageUrl}
                alt={fileName}
                className="max-w-full max-h-[70vh] mx-auto rounded-xl shadow-2xl ring-1 ring-black/10"
                style={{
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/60">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRemove}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-300/40 text-red-700 rounded-lg text-sm font-medium transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove Image
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                Done
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
