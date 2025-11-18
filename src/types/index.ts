export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export type ActionState = 'ready' | 'loading' | 'error' | 'completed';

export interface Action {
  id: string;
  label: string;
  icon?: string;
  state: ActionState;
  description?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  hotkey: string;
  windowWidth: number;
  enableAnimations: boolean;
}

export interface AppState {
  // Window state
  windowMode: 'compact' | 'expanded';
  setWindowMode: (mode: 'compact' | 'expanded') => void;
  
  // Conversations
  conversations: Conversation[];
  currentConversationId: string | null;
  
  // Actions
  addConversation: () => string;
  deleteConversation: (id: string) => void;
  setCurrentConversation: (id: string) => void;
  addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  
  // Current conversation helpers
  getCurrentConversation: () => Conversation | undefined;
  
  // Actions
  actions: Action[];
  updateAction: (id: string, updates: Partial<Action>) => void;
  
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  
  // UI state
  isInputFocused: boolean;
  setInputFocused: (focused: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}
