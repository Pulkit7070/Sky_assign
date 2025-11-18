import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Conversation, Message, Action } from '@/types';

const initialActions: Action[] = [
  { id: '1', label: 'Summarize', state: 'ready' },
  { id: '2', label: 'Translate', state: 'ready' },
  { id: '3', label: 'Explain Code', state: 'ready' },
  { id: '4', label: 'Fix Grammar', state: 'ready' },
  { id: '5', label: 'Generate Ideas', state: 'ready' },
];

const generateId = () => Math.random().toString(36).substring(2, 11);

const generateTitle = (firstMessage: string): string => {
  const maxLength = 30;
  if (firstMessage.length <= maxLength) {
    return firstMessage;
  }
  return firstMessage.substring(0, maxLength) + '...';
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Window state
      windowMode: 'compact',
      setWindowMode: (mode) => set({ windowMode: mode }),

      // Conversations
      conversations: [],
      currentConversationId: null,

      // Actions
      addConversation: () => {
        const id = generateId();
        const newConversation: Conversation = {
          id,
          title: 'New Conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
          currentConversationId: id,
        }));
        
        return id;
      },

      deleteConversation: (id) => {
        set((state) => {
          const filtered = state.conversations.filter((c) => c.id !== id);
          const newCurrentId =
            state.currentConversationId === id
              ? filtered[0]?.id || null
              : state.currentConversationId;
          
          return {
            conversations: filtered,
            currentConversationId: newCurrentId,
          };
        });
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },

      addMessage: (conversationId, message) => {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          timestamp: Date.now(),
          status: message.status || 'sent',
        };

        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              const messages = [...conv.messages, newMessage];
              const title =
                conv.messages.length === 0 && newMessage.role === 'user'
                  ? generateTitle(newMessage.content)
                  : conv.title;

              return {
                ...conv,
                messages,
                title,
                updatedAt: Date.now(),
              };
            }
            return conv;
          });

          return { conversations };
        });
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              const messages = conv.messages.map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              );
              return { ...conv, messages, updatedAt: Date.now() };
            }
            return conv;
          });

          return { conversations };
        });
      },

      deleteMessage: (conversationId, messageId) => {
        set((state) => {
          const conversations = state.conversations.map((conv) => {
            if (conv.id === conversationId) {
              const messages = conv.messages.filter((msg) => msg.id !== messageId);
              return { ...conv, messages, updatedAt: Date.now() };
            }
            return conv;
          });

          return { conversations };
        });
      },

      getCurrentConversation: () => {
        const state = get();
        return state.conversations.find((c) => c.id === state.currentConversationId);
      },

      // Actions
      actions: initialActions,

      updateAction: (id, updates) => {
        set((state) => ({
          actions: state.actions.map((action) =>
            action.id === id ? { ...action, ...updates } : action
          ),
        }));
      },

      // Preferences
      preferences: {
        theme: 'system',
        hotkey: 'Command+Space',
        windowWidth: 420,
        enableAnimations: true,
      },

      updatePreferences: (updates) => {
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        }));
      },

      // UI state
      isInputFocused: false,
      setInputFocused: (focused) => set({ isInputFocused: focused }),
      
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'sky-assistant-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId,
        preferences: state.preferences,
        windowMode: state.windowMode,
      }),
    }
  )
);
