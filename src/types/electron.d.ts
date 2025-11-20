// Type definitions for Electron API exposed via preload
export interface ElectronAPI {
  toggleWindowMode: (mode?: 'compact' | 'expanded') => Promise<'compact' | 'expanded'>;
  getWindowMode: () => Promise<'compact' | 'expanded'>;
  minimizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  focusWindow: () => Promise<void>;
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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
