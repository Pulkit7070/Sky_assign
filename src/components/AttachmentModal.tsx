import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAttach: (file: File) => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({ isOpen, onClose, onAttach }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  };

  const isValidFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    return validTypes.includes(file.type);
  };

  const handleAttach = () => {
    if (selectedFile) {
      onAttach(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
              <h2 className="text-lg font-medium text-gray-800 mb-6 tracking-tight">Attach File</h2>

              <div
                className={`relative border-2 border-dashed rounded-[20px] p-10 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-400/60 bg-blue-50/20 scale-[1.01]' 
                    : selectedFile
                    ? 'border-green-400/50 bg-green-50/10'
                    : 'border-gray-300/40 bg-white/5 hover:bg-white/10 hover:border-gray-400/60'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                style={{ cursor: selectedFile ? 'default' : 'pointer' }}
              >
                {selectedFile ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <div className="w-14 h-14 mx-auto bg-linear-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
                      {selectedFile.type.startsWith('image/') ? (
                        <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <p className="font-medium text-gray-800 text-sm truncate px-4">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-300/30 text-red-600 rounded-full text-xs font-medium transition-all hover:scale-105"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ y: dragActive ? -3 : 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="w-14 h-14 mx-auto mb-4 bg-linear-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
                      <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {dragActive ? 'Drop it here' : 'Drop file or click to browse'}
                    </p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF, WebP, PDF</p>
                  </motion.div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-white/20 hover:bg-white/30 border border-white/30 text-gray-700 rounded-2xl font-medium transition-all text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAttach}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-medium transition-all shadow-lg shadow-blue-500/20 text-sm"
                  >
                    Attach File
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
