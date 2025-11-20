import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  toggleWindowMode: (mode?: 'compact' | 'expanded') => 
    ipcRenderer.invoke('toggle-window-mode', mode),
  getWindowMode: () => 
    ipcRenderer.invoke('get-window-mode'),
  minimizeWindow: () => 
    ipcRenderer.invoke('minimize-window'),
  closeWindow: () => 
    ipcRenderer.invoke('close-window'),
  focusWindow: () => 
    ipcRenderer.invoke('focus-window'),
  
  // Dynamic resizing
  requestResize: (payload: { width: number; height: number; anchor?: 'top' | 'center' | 'bottom' }) =>
    ipcRenderer.invoke('sky:request-resize', payload),
  
  // Platform info
  getPlatform: () => 
    ipcRenderer.invoke('get-platform'),
  
  // Event listeners
  onWindowModeChanged: (callback: (mode: 'compact' | 'expanded') => void) => {
    const subscription = (_: any, mode: 'compact' | 'expanded') => callback(mode);
    ipcRenderer.on('window-mode-changed', subscription);
    
    return () => {
      ipcRenderer.removeListener('window-mode-changed', subscription);
    };
  },
  
  onResizeComplete: (callback: (bounds: any) => void) => {
    const subscription = (_: any, bounds: any) => callback(bounds);
    ipcRenderer.on('sky:resize-complete', subscription);
    
    return () => {
      ipcRenderer.removeListener('sky:resize-complete', subscription);
    };
  },
  
  // Refresh event listener
  onRefresh: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('sky:do-refresh', subscription);
    
    return () => {
      ipcRenderer.removeListener('sky:do-refresh', subscription);
    };
  },
  
  // Orb interaction
  orbClicked: () => ipcRenderer.invoke('orb-clicked'),
  
  // Google Calendar API
  calendar: {
    initialize: () => 
      ipcRenderer.invoke('calendar:initialize'),
    authenticate: () => 
      ipcRenderer.invoke('calendar:authenticate'),
    authenticateWithCode: (code: string) => 
      ipcRenderer.invoke('calendar:authenticate-with-code', code),
    checkAuth: () => 
      ipcRenderer.invoke('calendar:check-auth'),
    createEvent: (eventData: {
      summary: string;
      description?: string;
      startDateTime: string;
      endDateTime: string;
      location?: string;
      attendees?: string[];
    }) => ipcRenderer.invoke('calendar:create-event', eventData),
    signOut: () => 
      ipcRenderer.invoke('calendar:sign-out'),
  },

  // Calendar auth events
  onCalendarAuthSuccess: (callback: () => void) => {
    const subscription = () => callback();
    ipcRenderer.on('calendar:auth-success', subscription);
    
    return () => {
      ipcRenderer.removeListener('calendar:auth-success', subscription);
    };
  },

  onCalendarAuthError: (callback: (error: any) => void) => {
    const subscription = (_: any, error: any) => callback(error);
    ipcRenderer.on('calendar:auth-error', subscription);
    
    return () => {
      ipcRenderer.removeListener('calendar:auth-error', subscription);
    };
  },
});
