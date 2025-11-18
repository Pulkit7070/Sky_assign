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
});
