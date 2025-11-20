import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TransparentInputProps {
  onSend: (message: string) => void;
  autoFocus?: boolean;
}

export const TransparentInput: React.FC<TransparentInputProps> = ({
  onSend,
  autoFocus = true,
}) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileFocus={{ scale: 1.02 }}
      className="bg-[rgba(230,240,250,0.85)] backdrop-blur-xl rounded-full border-2 border-white/50 shadow-[0_8px_32px_rgba(100,150,200,0.25)] px-4 py-2.5"
      style={{
        backdropFilter: 'blur(24px) saturate(200%)',
        WebkitBackdropFilter: 'blur(24px) saturate(200%)',
        boxShadow: '0 8px 32px rgba(100, 150, 200, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      } as any}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type to start..."
        className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-600/70 text-sm font-medium"
      />
    </motion.div>
  );
};
