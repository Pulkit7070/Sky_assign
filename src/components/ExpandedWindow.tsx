import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { ConversationList } from './ConversationList';
import { MessageInput } from './MessageInput';
import { ChatMessage } from './ChatMessage';
import { ActionTabs } from './ActionTabs';

export const ExpandedWindow: React.FC = () => {
  const {
    getCurrentConversation,
    addConversation,
    addMessage,
    currentConversationId,
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
        content: `I received your message: "${content}"\n\nThis is a mock response. In production, this would be replaced with actual AI API integration.\n\n**Features demonstrated:**\n- Markdown rendering\n- Code highlighting\n- Multi-line support\n\n\`\`\`typescript\nconst greeting = "Hello, Sky!";\nconsole.log(greeting);\n\`\`\``,
        status: 'sent',
      });
    }, 1000);
  };

  const handleCollapse = async () => {
    if (window.electronAPI) {
      await window.electronAPI.toggleWindowMode('compact');
    }
  };

  const messages = currentConversation?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full flex bg-gradient-to-br from-sky-bg via-sky-bg-secondary to-sky-bg backdrop-blur-sky-heavy rounded-sky-xl border border-sky-border/40 shadow-sky-lg overflow-hidden relative"
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-accent-light/5 via-transparent to-sky-purple/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-purple/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Sidebar */}
      <ConversationList />

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Header with macOS traffic lights style */}
        <div
          className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-sky-divider/30 bg-gradient-to-b from-white/60 via-white/40 to-transparent backdrop-blur-md relative z-10"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <div className="flex items-center gap-2.5">
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(255, 157, 0, 0.4)' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCollapse}
              className="w-3 h-3 rounded-full bg-yellow-500"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Collapse"
            />
            <h1 className="text-base font-semibold text-sky-text">
              {currentConversation?.title || 'Sky Assistant'}
            </h1>
          </div>

          <div
            className="flex items-center gap-2"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.electronAPI?.minimizeWindow()}
              className="p-2 rounded-lg hover:bg-white/40 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-sky-text"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.electronAPI?.closeWindow()}
              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-red-500"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-xl font-semibold text-sky-text mb-2">
                Welcome to Sky Assistant
              </h2>
              <p className="text-sky-text-secondary text-center max-w-md">
                I'm here to help you with anything you need. Start a conversation by typing a
                message below.
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

        {/* Action tabs */}
        <ActionTabs />

        {/* Input area */}
        <MessageInput onSend={handleSendMessage} autoFocus={false} />
      </div>
    </motion.div>
  );
};
