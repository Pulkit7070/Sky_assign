import { app, BrowserWindow, globalShortcut, ipcMain, screen, nativeTheme, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import windowStateKeeper from 'electron-window-state';
import { GoogleCalendarService } from '../src/services/google-calendar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
const isMac = process.platform === 'darwin';

let mainWindow: BrowserWindow | null = null;
let orbWindow: BrowserWindow | null = null;
let windowMode: 'compact' | 'expanded' = 'compact';
let isMainWindowVisible = false;

// Google Calendar service instance
let calendarService: GoogleCalendarService | null = null;

const COMPACT_SIZE = { width: 650, height: 500 };
const EXPANDED_SIZE = { width: 900, height: 700 };
const ORB_SIZE = { width: 100, height: 100 };

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
    resizable: true,
    alwaysOnTop: true,
    skipTaskbar: false,
    hasShadow: false,
    show: false,
    backgroundColor: '#00000000',
    vibrancy: isMac ? 'under-window' : undefined,
    visualEffectState: isMac ? 'active' : undefined,
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

  if (isMac && mainWindow) {
    mainWindow.setVibrancy('sidebar');
  }
}

function createOrbWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  orbWindow = new BrowserWindow({
    width: ORB_SIZE.width,
    height: ORB_SIZE.height,
    x: width - ORB_SIZE.width - 20,
    y: height - ORB_SIZE.height - 20,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    hasShadow: false,
    focusable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, isDev ? 'preload.mjs' : 'preload.js'),
    },
  });

  if (isDev) {
    orbWindow.loadURL('http://localhost:5173/#/orb');
  } else {
    orbWindow.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'orb' });
  }

  // Show orb window once loaded
  orbWindow.once('ready-to-show', () => {
    orbWindow?.show();
  });

  orbWindow.on('closed', () => {
    orbWindow = null;
  });
}

function toggleWindowMode(mode?: 'compact' | 'expanded') {
  if (!mainWindow) {
    console.error('Cannot toggle window mode: mainWindow is null');
    return;
  }

  const targetMode = mode || (windowMode === 'compact' ? 'expanded' : 'compact');
  const previousMode = windowMode;
  windowMode = targetMode;

  if (targetMode === 'expanded') {
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
    
    console.log(`Γ£ô Expanded to ${EXPANDED_SIZE.width}x${EXPANDED_SIZE.height} at (${x}, ${y})`);
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
    
    // Keep resizing enabled and set always on top
    mainWindow.setAlwaysOnTop(true);
  }

  setTimeout(() => {
    mainWindow?.webContents.send('window-mode-changed', targetMode);
  }, 50);
}

function registerShortcuts() {
  // Primary shortcut: Ctrl+Shift+Space (Windows) / Command+Shift+Space (Mac)
  const shortcuts = isMac 
    ? ['Command+Shift+Space', 'Command+`', 'CommandOrControl+Shift+Y']
    : ['Control+Shift+Space', 'Control+`', 'CommandOrControl+Shift+Y'];
  
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
          isMainWindowVisible = false;
        } else {
          mainWindow.show();
          mainWindow.focus();
          isMainWindowVisible = true;
        }
      });

      if (registered) {
        console.log(`✓ Registered hotkey: ${shortcut}`);
        break;
      }
    } catch (error) {
      // Try next shortcut
    }
  }
  
  const refreshKey = isMac ? 'Command+R' : 'Control+R';
  globalShortcut.register(refreshKey, () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('sky:do-refresh');
    }
  });
}

// IPC Handlers
ipcMain.handle('orb-clicked', async () => {
  if (!mainWindow) {
    createWindow();
  }
  
  if (isMainWindowVisible) {
    mainWindow?.hide();
    isMainWindowVisible = false;
  } else {
    mainWindow?.show();
    mainWindow?.focus();
    isMainWindowVisible = true;
  }
  
  return isMainWindowVisible;
});

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
  // Close all windows first
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.destroy();
  }
  if (orbWindow && !orbWindow.isDestroyed()) {
    orbWindow.destroy();
  }
  // Quit the entire application
  app.quit();
});

ipcMain.handle('focus-window', async () => {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});

// Refresh/New Chat handler
ipcMain.handle('sky:refresh', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { error: 'no-window' };
  
  try {
    // Send refresh event to renderer
    win.webContents.send('sky:do-refresh');
    return { ok: true };
  } catch (error) {
    console.error('Refresh error:', error);
    return { error: String(error) };
  }
});

// Google Calendar handlers
ipcMain.handle('calendar:initialize', async () => {
  try {
    // Initialize calendar service
    calendarService = new GoogleCalendarService();
    
    const fs = await import('fs');
    
    // Check multiple locations for credentials
    const possiblePaths = [
      // 1. User data directory (production location)
      path.join(app.getPath('userData'), 'google-credentials.json'),
      // 2. Project root (development convenience)
      path.join(__dirname, '../google-credentials.json'),
      path.join(__dirname, '../../google-credentials.json'),
      path.join(process.cwd(), 'google-credentials.json'),
    ];
    
    let credentialsPath: string | null = null;
    for (const testPath of possiblePaths) {
      console.log('🔍 Checking for credentials at:', testPath);
      if (fs.existsSync(testPath)) {
        credentialsPath = testPath;
        console.log('✅ Found credentials at:', testPath);
        break;
      }
    }
    
    if (!credentialsPath) {
      const userDataPath = app.getPath('userData');
      return {
        success: false,
        error: `Google Calendar credentials not found. Please place google-credentials.json in:\n1. ${userDataPath}\n2. Project root: ${process.cwd()}`,
      };
    }
    
    const credentialsData = await fs.promises.readFile(credentialsPath, 'utf-8');
    const credentials = JSON.parse(credentialsData);
    
    await calendarService.initialize({
      client_id: credentials.installed.client_id,
      client_secret: credentials.installed.client_secret,
      redirect_uris: credentials.installed.redirect_uris,
    });
    
    console.log('✅ Calendar service initialized successfully');
    return { success: true, authenticated: calendarService.isAuthenticated() };
  } catch (error: any) {
    console.error('❌ Calendar initialization error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('calendar:authenticate', async () => {
  try {
    if (!calendarService) {
      return { success: false, error: 'Calendar service not initialized' };
    }
    
    const authUrl = calendarService.getAuthUrl();
    
    // Create a new window to handle OAuth
    const authWindow = new BrowserWindow({
      width: 500,
      height: 600,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    authWindow.loadURL(authUrl);

    // Listen for redirect
    authWindow.webContents.on('will-redirect', async (event, url) => {
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      
      if (code) {
        authWindow.close();
        
        try {
          await calendarService.authenticateWithCode(code);
          
          // Notify renderer process
          if (mainWindow) {
            mainWindow.webContents.send('calendar:auth-success');
          }
        } catch (error) {
          console.error('Failed to exchange code:', error);
          if (mainWindow) {
            mainWindow.webContents.send('calendar:auth-error', error);
          }
        }
      }
    });

    // Handle window close
    authWindow.on('closed', () => {
      authWindow.destroy();
    });
    
    return { success: true, authUrl };
  } catch (error: any) {
    console.error('Authentication error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('calendar:authenticate-with-code', async (_, code: string) => {
  try {
    if (!calendarService) {
      return { success: false, error: 'Calendar service not initialized' };
    }
    
    await calendarService.authenticateWithCode(code);
    
    return { success: true };
  } catch (error: any) {
    console.error('Authentication with code error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('calendar:check-auth', async () => {
  try {
    if (!calendarService) {
      return { authenticated: false };
    }
    
    return { authenticated: calendarService.isAuthenticated() };
  } catch (error) {
    return { authenticated: false };
  }
});

ipcMain.handle('calendar:create-event', async (_, eventData) => {
  try {
    console.log('📅 [Main] Received create-event request:', eventData);
    
    if (!calendarService) {
      console.error('❌ [Main] Calendar service not initialized');
      return { success: false, error: 'Calendar service not initialized' };
    }
    
    const isAuth = calendarService.isAuthenticated();
    console.log('🔐 [Main] Authentication status:', isAuth);
    
    if (!isAuth) {
      console.error('❌ [Main] Not authenticated');
      return { success: false, error: 'Not authenticated. Please sign in to Google Calendar.' };
    }
    
    console.log('✅ [Main] Creating event...');
    const result = await calendarService.createEvent({
      summary: eventData.summary,
      description: eventData.description,
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
      location: eventData.location,
      attendees: eventData.attendees,
    });
    
    console.log('📅 [Main] Event creation result:', result);
    
    return result;
  } catch (error: any) {
    console.error('Create event error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('calendar:sign-out', async () => {
  try {
    if (!calendarService) {
      return { success: false, error: 'Calendar service not initialized' };
    }
    
    await calendarService.signOut();
    
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
});

// Dynamic resize handler
ipcMain.handle('sky:request-resize', async (event, { width, height, anchor }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { error: 'no-window' };

  try {
    // Get display bounds and work area
    const display = screen.getDisplayMatching(win.getBounds());
    const workArea = display.workArea;
    
    // Clamp height to available space with margins
    const minH = 100;
    const maxH = Math.min(height, workArea.height - 40);
    const clampedHeight = Math.max(minH, Math.min(maxH, height));
    
    // Get current bounds
    const current = win.getBounds();
    let newY = current.y;
    
    // Adjust Y position based on anchor
    if (anchor === 'bottom') {
      newY = current.y - (clampedHeight - current.height);
    } else if (anchor === 'center') {
      newY = current.y - Math.round((clampedHeight - current.height) / 2);
    }
    
    // Ensure window stays within work area
    if (newY < workArea.y) newY = workArea.y;
    if (newY + clampedHeight > workArea.y + workArea.height) {
      newY = workArea.y + workArea.height - clampedHeight;
    }
    
    // Set new bounds
    win.setBounds({
      x: current.x,
      y: Math.round(newY),
      width: Math.round(width),
      height: Math.round(clampedHeight)
    }, true);
    
    // Notify renderer of completion
    setTimeout(() => {
      win.webContents.send('sky:resize-complete', win.getBounds());
    }, 50);
    
    return { ok: true, bounds: win.getBounds() };
  } catch (error) {
    return { error: String(error) };
  }
});

// App lifecycle
app.whenReady().then(() => {
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.sky.assistant');
  }
  
  createWindow();
  createOrbWindow();
  
  setTimeout(() => {
    registerShortcuts();
  }, 1000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
      createOrbWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
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
