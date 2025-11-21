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
    <div className="relative flex items-end gap-2.5 p-3 border-t border-sky-divider/30 bg-white/40 backdrop-blur-md">
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
          className="w-full resize-none bg-white/70 backdrop-blur-sm outline-none text-sky-text placeholder-sky-text-secondary text-[15px] font-sf-pro max-h-28 overflow-y-auto px-4 py-2.5 rounded-[20px] border border-sky-divider/20 focus:border-sky-accent/40 focus:ring-2 focus:ring-sky-accent/10 transition-all duration-200 shadow-sm"
          style={{ minHeight: '40px' }}
        />
        {!input.trim() && (
          <div className="absolute right-3 bottom-2.5 text-[11px] text-sky-text-tertiary font-sf-pro pointer-events-none">
            ↵ to send
          </div>
        )}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.06, rotate: 3 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleSend}
        disabled={!input.trim()}
        className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-sky-accent to-sky-accent-hover text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group"
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
          className="w-[18px] h-[18px] relative z-10 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </motion.button>
    </div>
  );
};
