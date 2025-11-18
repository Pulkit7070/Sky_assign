// Type definitions for Electron API exposed via preload
export interface ElectronAPI {
  toggleWindowMode: (mode?: 'compact' | 'expanded') => Promise<'compact' | 'expanded'>;
  getWindowMode: () => Promise<'compact' | 'expanded'>;
  minimizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
  focusWindow: () => Promise<void>;
  getPlatform: () => Promise<NodeJS.Platform>;
  onWindowModeChanged: (callback: (mode: 'compact' | 'expanded') => void) => () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
