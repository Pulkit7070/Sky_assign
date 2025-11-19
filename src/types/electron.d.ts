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
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
