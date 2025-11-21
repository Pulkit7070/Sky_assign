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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileFocus={{ scale: 1.01 }}
      className="bg-white/80 backdrop-blur-xl rounded-full border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.12)] px-5 py-2.5 hover:shadow-[0_6px_28px_rgba(0,0,0,0.15)] transition-all duration-200"
      style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      } as any}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
        className="w-full bg-transparent outline-none text-sky-text placeholder-sky-text-secondary/70 text-[15px] font-sf-pro"
        style={{
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      />
    </motion.div>
  );
};
