// Type definitions for Electron API exposed via preload
export interface ElectronAPI {
  toggleWindowMode: (mode?: 'compact' | 'expanded') => Promise<'compact' | 'expanded'>;
  getWindowMode: () => Promise<'compact' | 'expanded'>;
  minimizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  focusWindow: () => Promise<void>;
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
  getPlatform: () => Promise<NodeJS.Platform>;
  requestResize: (payload: { width: number; height: number; anchor?: 'top' | 'center' | 'bottom' }) => Promise<any>;
  onWindowModeChanged: (callback: (mode: 'compact' | 'expanded') => void) => () => void;
  onResizeComplete: (callback: (bounds: any) => void) => () => void;
  onRefresh: (callback: () => void) => () => void;
  orbClicked: () => Promise<boolean>;
  calendar: {
    initialize: () => Promise<{ success: boolean; authenticated?: boolean; error?: string }>;
    authenticate: () => Promise<{ success: boolean; authUrl?: string; error?: string }>;
    authenticateWithCode: (code: string) => Promise<{ success: boolean; error?: string }>;
    checkAuth: () => Promise<{ authenticated: boolean }>;
    createEvent: (eventData: {
      summary: string;
      description?: string;
      startDateTime: string;
      endDateTime: string;
      location?: string;
      attendees?: string[];
    }) => Promise<{ success: boolean; eventId?: string; eventLink?: string; error?: string }>;
    signOut: () => Promise<{ success: boolean; error?: string }>;
  };
  onCalendarAuthSuccess: (callback: () => void) => () => void;
  onCalendarAuthError: (callback: (error: any) => void) => () => void;
  gemini: {
    sendMessage: (message: string, conversationHistory: any[]) => Promise<{
      success: boolean;
      response?: string;
      error?: string;
    }>;
  };
  places: {
    searchNearby: (request: {
      location: { lat: number; lng: number };
      radius: number;
      type?: string;
      keyword?: string;
    }) => Promise<{
      success: boolean;
      results?: Array<any>;
      error?: string;
    }>;
    searchText: (request: {
      query: string;
      location?: { lat: number; lng: number };
      radius?: number;
    }) => Promise<{
      success: boolean;
      results?: Array<any>;
      error?: string;
    }>;
    geocode: (request: {
      address: string;
    }) => Promise<{
      success: boolean;
      location?: { lat: number; lng: number; display_name: string };
      error?: string;
    }>;
    getLocationFromIP: () => Promise<{
      success: boolean;
      location?: { lat: number; lng: number; city: string; country: string };
      error?: string;
    }>;
  };
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
