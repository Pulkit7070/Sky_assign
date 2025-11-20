import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { MessageInput } from './MessageInput';
import { ChatMessage } from './ChatMessage';
import { AutoSizingAnswer } from './AutoSizingAnswer';

export const FloatingWindow: React.FC = () => {
  const {
    getCurrentConversation,
    addConversation,
    addMessage,
    currentConversationId,
    windowMode,
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
      setTimeout(() => {
        addConversation();
        setTimeout(() => setIsRefreshing(false), 300);
      }, 200);
    });
  }, [addConversation]);

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
        `Done! The answer is being processed`,
        `Perfect! You are on right track`,
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

  const handleExpand = async () => {
    if (window.electronAPI) {
      try {
        await window.electronAPI.toggleWindowMode('expanded');
      } catch (error) {
        console.error('Failed to toggle window mode:', error);
      }
    }
  };

  const messages = currentConversation?.messages || [];
  const isEmpty = messages.length === 0;

  return (
    <motion.div
      key={currentConversationId}
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ 
        opacity: isRefreshing ? 0.4 : 1, 
        scale: isRefreshing ? 0.98 : 1, 
        y: 0,
        rotateY: isRefreshing ? 5 : 0
      }}
      transition={{ 
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="h-full flex flex-col bg-linear-to-br from-sky-bg/95 via-sky-bg-secondary/90 to-sky-bg/95 backdrop-blur-2xl rounded-sky-lg border border-sky-border/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-clip relative"
      style={{
        WebkitAppRegion: 'drag',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
      } as any}
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
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-accent-light/5 via-transparent to-sky-purple/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-sky-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-sky-purple/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Draggable header area - reduced height */}
      <div
        className="relative flex-shrink-0 h-7 flex items-center justify-between px-3 border-b border-sky-divider/30 bg-linear-to-b from-white/20 to-transparent rounded-t-sky-lg"
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
        </div>
        <span className="text-[10px] text-sky-text-secondary font-sf-pro font-medium tracking-wide">
          Sky Assistant
        </span>
        <div className="w-2.5" /> {/* Spacer for centering */}
      </div>

      {/* Messages area - auto-sizing */}
      {isEmpty ? (
        <div
          className="flex-1 overflow-y-auto px-3 py-2 min-h-0 bg-white/20 backdrop-blur-sm relative z-10 flex items-center justify-center"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          <div className="text-center px-4">
            <p className="text-sky-text-secondary text-sm font-medium">
              Hi! How can I help you today?
            </p>
          </div>
        </div>
      ) : (
        <AutoSizingAnswer messages={messages} compactWidth={420} />
      )}

      {/* Input area */}
      <div className="rounded-b-sky-lg overflow-hidden" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <MessageInput onSend={handleSendMessage} autoFocus={windowMode === 'compact'} />
      </div>
    </motion.div>
  );
};
