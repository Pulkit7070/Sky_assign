import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { sanitizeText } from '@/utils/platform';

interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Ask me anything...',
  autoFocus = true,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { setInputFocused } = useAppStore();

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter to send (default)
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      handleSend();
    }
    // Shift+Enter or Ctrl+Enter for new line
    if (e.key === 'Enter' && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      // Allow default behavior (newline)
      return;
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    onSend(trimmed);
    setInput('');

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const sanitized = sanitizeText(text);
    
    // Insert at cursor position
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = input.substring(0, start) + sanitized + input.substring(end);
      setInput(newValue);
      
      // Set cursor position after pasted text
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + sanitized.length;
      }, 0);
    }
  };

  return (
    <div className="relative flex items-end gap-2 p-2.5 border-t border-sky-divider/30 bg-white/30 backdrop-blur-md">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-white/60 backdrop-blur-sm outline-none text-sky-text placeholder-sky-text-secondary text-[14px] font-sf-pro max-h-24 overflow-y-auto px-3 py-2 rounded-sky border-0 focus:border-0 focus:ring-0 transition-all duration-200"
          style={{ minHeight: '36px' }}
        />
        {!input.trim() && (
          <div className="absolute right-2 bottom-2 text-[10px] text-sky-text-tertiary font-sf-pro pointer-events-none">
            Press Enter to send
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.08, rotate: 5 }}
        whileTap={{ scale: 0.92 }}
        onClick={handleSend}
        disabled={!input.trim()}
        className="flex-shrink-0 w-9 h-9 rounded-sky bg-linear-to-br from-sky-accent to-sky-accent-hover text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sky hover:shadow-sky-hover relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 relative z-10 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </motion.button>
    </div>
  );
};
