export type MessageRole = 'user' | 'assistant' | 'system';

export type MessageStatus = 'sending' | 'sent' | 'error';

export interface CalendarEventData {
  title: string;
  location?: string;
  startDate: string;
  startTime: string;
  endTime: string;
  invitees?: string[];
}

export interface MapPlace {
  name: string;
  description: string;
  rating: number;
  distance?: string;
}

export interface ActionOption {
  id: string;
  label: string;
  description?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  status?: MessageStatus;
  // Enhanced message data
  messageType?: 'calendar' | 'maps' | 'action' | 'default';
  calendarEvent?: CalendarEventData;
  mapPlaces?: MapPlace[];
  actionOptions?: ActionOption[];
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

// OpenStreetMap + Photon API Types (100% FREE - No API Key Required)
export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface OSMPlace {
  osm_id: string | number;
  name: string;
  address: string;
  location: PlaceLocation;
  type?: string;
  category?: string;
  distance?: number; // Distance in meters from search location
}

export interface NearbySearchRequest {
  location: PlaceLocation;
  radius: number; // in meters
  type?: string;
  keyword?: string;
}

export interface TextSearchRequest {
  query: string;
  location?: PlaceLocation;
  radius?: number;
}

export interface GeocodeRequest {
  address: string;
}

export interface GeocodeResult {
  location: PlaceLocation;
  display_name: string;
}

export interface PlacesResponse {
  results: OSMPlace[];
  status?: string;
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
  clearCurrentConversation: () => void;
  
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
