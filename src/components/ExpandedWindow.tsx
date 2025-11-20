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
    clearCurrentConversation,
  } = useAppStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const currentConversation = getCurrentConversation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  useEffect(() => {
    if (!window.electronAPI?.onRefresh) return;
    
    return window.electronAPI.onRefresh(() => {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 500);
    });
  }, []);

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

    setTimeout(() => {
      const responses = [
        `Hi! 👋`,
        `Got it!`,
        `Sure, I can help with that.`,
        `Hello! How can I assist you?`,
        `I'm Sky Assistant, your AI companion. I can help you with various tasks like answering questions, providing explanations, and assisting with your daily workflow. What would you like to know?`,
        `That's a great question! Let me break it down for you: First, we need to understand the core concept. Then, we can explore practical applications. Finally, I'll provide some specific examples.`,
        `Here's what I found: The solution involves multiple steps. You'll need to consider both the technical aspects and the practical implementation. Would you like me to go into more detail?`,
        `I'd be happy to help explain that! Here's a comprehensive overview:\n\n1. **First Point**: This is the foundational concept you need to understand.\n2. **Second Point**: Building on that, we can explore the next layer of complexity.\n3. **Third Point**: Finally, we tie everything together with practical applications.\n\nThe key is to approach this systematically and ensure you understand each step before moving forward.`,
        `Let me provide you with a detailed explanation:\n\nThe process involves several stages. Initially, you'll want to gather all relevant information and analyze the requirements carefully. This ensures you have a solid foundation.\n\nNext, consider the different approaches available. Each method has its own advantages and trade-offs, so it's important to evaluate them based on your specific needs.\n\nFinally, implementation requires careful attention to detail and thorough testing to ensure everything works as expected.`,
        `Here's a quick code example:\n\n\`\`\`javascript\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to Sky Assistant.\`;\n}\n\nconsole.log(greet('User'));\n\`\`\`\n\nThis demonstrates the basic syntax and structure you'll need.`,
        `Done! ✓`,
        `Perfect!`,
        `Here are the key points:\n• First important item\n• Second consideration\n• Third aspect to remember\n• Fourth detail to note\n• Final takeaway`,
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      addMessage(conversationId!, {
        role: 'assistant',
        content: randomResponse,
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
      animate={{ 
        opacity: isRefreshing ? 0.6 : 1, 
        scale: isRefreshing ? 0.99 : 1, 
        y: 0 
      }}
      transition={{ 
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full flex bg-linear-to-br from-sky-bg/95 via-sky-bg-secondary/90 to-sky-bg/95 backdrop-blur-2xl rounded-sky-xl border border-sky-border/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-clip relative"
    >
      {/* Refresh overlay animation */}
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-sky-accent/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "linear", repeat: Infinity }}
              className="text-sky-accent"
            >
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
          className="flex-shrink-0 h-14 flex items-center justify-between px-6 border-b border-sky-divider/30 bg-linear-to-b from-white/60 via-white/40 to-transparent backdrop-blur-md relative z-10 rounded-tr-sky-xl"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          <div className="flex items-center gap-2">
            {/* macOS Traffic Light Buttons */}
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(255, 59, 48, 0.4)' }}
              whileTap={{ scale: 0.85 }}
              onClick={() => window.electronAPI?.closeWindow()}
              className="w-3 h-3 rounded-full bg-sky-error shadow-inner relative group transition-all duration-200"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Close"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-1.5 h-1.5 text-red-900" fill="none" viewBox="0 0 12 12">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 3l6 6M9 3l-6 6" />
                </svg>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(255, 157, 0, 0.4)' }}
              whileTap={{ scale: 0.85 }}
              onClick={handleCollapse}
              className="w-3 h-3 rounded-full bg-sky-warning shadow-inner relative group transition-all duration-200"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Minimize to compact view"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-2 h-0.5 text-yellow-900" fill="currentColor" viewBox="0 0 8 2">
                  <rect width="8" height="2" rx="1" />
                </svg>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, boxShadow: '0 0 12px rgba(52, 199, 89, 0.4)' }}
              whileTap={{ scale: 0.85 }}
              className="w-3 h-3 rounded-full bg-sky-success shadow-inner relative group transition-all duration-200"
              style={{ WebkitAppRegion: 'no-drag' } as any}
              title="Maximize"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
              <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <svg className="w-2 h-2 text-green-900" fill="none" viewBox="0 0 8 8">
                  <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M1 4l1.5 1.5M7 4l-1.5 1.5M4 1v6" />
                </svg>
              </div>
            </motion.button>
          </div>

          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-sm font-semibold text-sky-text tracking-tight">
            {currentConversation?.title || 'Sky Assistant'}
          </h1>

          <div className="w-24" style={{ WebkitAppRegion: 'no-drag' } as any}>
            {/* Spacer for centering title */}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-white/20 backdrop-blur-sm">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div className="absolute inset-0 bg-sky-accent/10 rounded-full blur-3xl" />
                <div className="relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl p-12 shadow-sky-lg border border-white/60">
                  <h2 className="text-2xl font-semibold text-sky-text mb-3 text-center">
                    Welcome to Sky Assistant
                  </h2>
                  <p className="text-sky-text-secondary text-center max-w-sm leading-relaxed">
                    I'm here to help you with anything you need. Start a conversation by typing a
                    message below.
                  </p>
                </div>
              </motion.div>
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
        <div className="rounded-br-sky-xl overflow-hidden">
          <MessageInput onSend={handleSendMessage} autoFocus={false} />
        </div>
      </div>
    </motion.div>
  );
};
