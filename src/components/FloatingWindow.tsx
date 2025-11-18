import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { MessageInput } from './MessageInput';
import { ChatMessage } from './ChatMessage';

export const FloatingWindow: React.FC = () => {
  const {
    getCurrentConversation,
    addConversation,
    addMessage,
    currentConversationId,
    windowMode,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentConversation = getCurrentConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSendMessage = async (content: string) => {
    let conversationId = currentConversationId;

    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = addConversation();
    }

    // Add user message
    addMessage(conversationId, {
      role: 'user',
      content,
      status: 'sent',
    });

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      addMessage(conversationId!, {
        role: 'assistant',
        content: `I received your message: "${content}"\n\nThis is a mock response. In production, this would be replaced with actual AI API integration.`,
        status: 'sent',
      });
    }, 1000);
  };

  const handleExpand = async () => {
    console.log('🟢 Expand button clicked');
    if (window.electronAPI) {
      console.log('📡 Calling electronAPI.toggleWindowMode...');
      try {
        await window.electronAPI.toggleWindowMode('expanded');
        console.log('✓ Toggle window mode successful');
      } catch (error) {
        console.error('❌ Error toggling window mode:', error);
      }
    } else {
      console.error('❌ electronAPI not available');
    }
  };

  const messages = currentConversation?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full flex flex-col bg-sky-bg backdrop-blur-sky-heavy rounded-sky-lg border border-sky-border/40 shadow-sky-lg overflow-hidden relative"
      style={{
        WebkitAppRegion: 'drag',
      } as any}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />
      
      {/* Draggable header area - reduced height */}
      <div
        className="relative flex-shrink-0 h-7 flex items-center justify-between px-3 border-b border-sky-divider/30 bg-gradient-to-b from-white/20 to-transparent"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-1.5">
          <motion.button
            whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(52, 199, 89, 0.4)' }}
            whileTap={{ scale: 0.85 }}
            onClick={handleExpand}
            className="w-2.5 h-2.5 rounded-full bg-sky-success shadow-inner relative group transition-all duration-200"
            style={{ WebkitAppRegion: 'no-drag' } as any}
            title="Expand to full view"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20" />
          </motion.button>
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-sky-warning shadow-inner relative"
            whileHover={{ scale: 1.15 }}
            title="Minimize"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          </motion.div>
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-sky-error shadow-inner relative cursor-pointer"
            whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(255, 59, 48, 0.4)' }}
            whileTap={{ scale: 0.85 }}
            onClick={() => window.electronAPI?.closeWindow()}
            title="Close"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
          </motion.div>
        </div>
        <span className="text-[10px] text-sky-text-secondary font-sf-pro font-medium tracking-wide">
          Sky Assistant
        </span>
        <div className="w-2.5" /> {/* Spacer for centering */}
      </div>

      {/* Messages area - more space */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2 min-h-0"
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sky-text-secondary text-sm text-center">
              👋 Hi! How can I help you today?
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message: any, index: number) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={{ WebkitAppRegion: 'no-drag' } as any}>
        <MessageInput onSend={handleSendMessage} autoFocus={windowMode === 'compact'} />
      </div>
    </motion.div>
  );
};
