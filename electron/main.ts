import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import windowStateKeeper from 'electron-window-state';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const isMac = process.platform === 'darwin';

let mainWindow: BrowserWindow | null = null;
let windowMode: 'compact' | 'expanded' = 'compact';

const COMPACT_SIZE = { width: 420, height: 200 };
const EXPANDED_SIZE = { width: 900, height: 700 };

function createWindow() {
  // Load window state
  const windowState = windowStateKeeper({
    defaultWidth: COMPACT_SIZE.width,
    defaultHeight: COMPACT_SIZE.height,
  });

  // Get primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Position window at bottom-right by default for compact mode
  const x = width - COMPACT_SIZE.width - 20;
  const y = height - COMPACT_SIZE.height - 20;

  mainWindow = new BrowserWindow({
    x: windowState.x || x,
    y: windowState.y || y,
    width: COMPACT_SIZE.width,
    height: COMPACT_SIZE.height,
    minWidth: 380,
    minHeight: 180,
    frame: false,
    transparent: true,
    resizable: false, // Start non-resizable in compact mode
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: true,
    backgroundColor: isMac ? undefined : '#00000000',
    vibrancy: isMac ? 'sidebar' : undefined, // macOS only
    visualEffectState: isMac ? 'active' : undefined, // macOS only
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, isDev ? 'preload.mjs' : 'preload.js'),
      webSecurity: true,
    },
  });

  // Track window state
  windowState.manage(mainWindow);

  // Load app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // macOS-specific: Apply vibrancy effect
  if (isMac && mainWindow) {
    mainWindow.setVibrancy('sidebar');
  }
}

function toggleWindowMode(mode?: 'compact' | 'expanded') {
  if (!mainWindow) {
    console.error('Cannot toggle window mode: mainWindow is null');
    return;
  }

  const targetMode = mode || (windowMode === 'compact' ? 'expanded' : 'compact');
  const previousMode = windowMode;
  windowMode = targetMode;

  console.log(`🔄 Toggling window mode: ${previousMode} → ${targetMode}`);

  if (targetMode === 'expanded') {
    // Expand to full window
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    const x = Math.floor((width - EXPANDED_SIZE.width) / 2);
    const y = Math.floor((height - EXPANDED_SIZE.height) / 2);

    // Enable resizing first
    mainWindow.setResizable(true);
    
    // Set bounds with animation
    mainWindow.setBounds({
      x,
      y,
      width: EXPANDED_SIZE.width,
      height: EXPANDED_SIZE.height,
    }, true);
    
    // Remove always on top for better UX in expanded mode
    mainWindow.setAlwaysOnTop(false);
    
    console.log(`✓ Expanded to ${EXPANDED_SIZE.width}x${EXPANDED_SIZE.height} at (${x}, ${y})`);
  } else {
    // Collapse to compact
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    
    const x = width - COMPACT_SIZE.width - 20;
    const y = height - COMPACT_SIZE.height - 20;

    // Set bounds with animation
    mainWindow.setBounds({
      x,
      y,
      width: COMPACT_SIZE.width,
      height: COMPACT_SIZE.height,
    }, true);
    
    // Disable resizing and enable always on top
    mainWindow.setResizable(false);
    mainWindow.setAlwaysOnTop(true);
    
    console.log(`✓ Compacted to ${COMPACT_SIZE.width}x${COMPACT_SIZE.height} at (${x}, ${y})`);
  }

  // Notify renderer with a small delay to ensure window is resized
  setTimeout(() => {
    mainWindow?.webContents.send('window-mode-changed', targetMode);
    console.log(`📡 Notified renderer of mode change: ${targetMode}`);
  }, 50);
}

function registerShortcuts() {
  // Try multiple shortcuts in order of preference (less likely to conflict)
  const shortcuts = isMac 
    ? ['Command+`', 'CommandOrControl+Shift+Y', 'Command+Shift+Space']
    : ['Control+`', 'CommandOrControl+Shift+Y', 'Control+Alt+K'];
  
  let registered = false;
  
  for (const shortcut of shortcuts) {
    try {
      registered = globalShortcut.register(shortcut, () => {
        if (!mainWindow) {
          createWindow();
          return;
        }

        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      });

      if (registered) {
        console.log(`✓ Registered global shortcut: ${shortcut}`);
        break;
      }
    } catch (error) {
      console.warn(`Failed to register ${shortcut}:`, error);
    }
  }

  if (!registered) {
    console.warn('⚠ Could not register any global shortcut. App will still work via system tray.');
  }
}

// IPC Handlers
ipcMain.handle('toggle-window-mode', async (_, mode?: 'compact' | 'expanded') => {
  toggleWindowMode(mode);
  return windowMode;
});

ipcMain.handle('get-window-mode', async () => {
  return windowMode;
});

ipcMain.handle('get-platform', async () => {
  return process.platform;
});

ipcMain.handle('minimize-window', async () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('close-window', async () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('focus-window', async () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

// App lifecycle
app.whenReady().then(() => {
  // Set app user model id for Windows (fixes cache issues)
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.sky.assistant');
  }
  
  createWindow();
  
  // Register shortcuts after window is created and app is fully ready
  setTimeout(() => {
    registerShortcuts();
  }, 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

// Clean up shortcuts before quitting
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  console.log('✓ Unregistered all global shortcuts');
});

// Handle second instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}
