import { app, BrowserWindow, globalShortcut, ipcMain, screen, nativeTheme, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import windowStateKeeper from 'electron-window-state';
import { GoogleCalendarService } from '../src/services/google-calendar.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

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
      webSecurity: !isDev,
      devTools: isDev,
    },
  });

  // Track window state
  windowState.manage(mainWindow);

  // Handle external links - open in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  // Prevent navigation to external sites
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const isLocal = url.startsWith('http://localhost') || url.startsWith('file://');
    if (!isLocal) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Set CSP for development
  if (isDev) {
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://generativelanguage.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"]
        }
      });
    });
  }

  // Load app
  if (isDev) {
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devServerUrl);
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
    const devServerUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    orbWindow.loadURL(`${devServerUrl}/#/orb`);
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

ipcMain.handle('open-external', async (_, url: string) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to open external URL:', error);
    return { success: false, error: error.message };
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

// Gemini API handler with retry logic and fallback models
ipcMain.handle('gemini:send-message', async (_, { message, conversationHistory }) => {
  // Helper function to sleep/delay
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Retry with exponential backoff (reduced retries for free tier)
  async function callGeminiWithRetry(
    genAI: any,
    modelName: string,
    history: any[],
    userMessage: string,
    maxRetries = 0 // No retries - fail fast to avoid quota burn
  ): Promise<any> {
    const delays = [3000]; // Single 3s delay if needed
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: {
            maxOutputTokens: 1000, // Increased to allow proper responses
            temperature: 0.9,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE',
            },
          ],
          systemInstruction: 'You are Sky, a helpful AI assistant. Be conversational and friendly.',
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);
        const response = result.response;
        
        // Extract text using the proper method
        let text = '';
        
        // First try the built-in text() method
        if (typeof response.text === 'function') {
          text = response.text();
        }
        
        // If text() returns empty, extract from candidates manually
        if (!text && response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (candidate.content?.parts && candidate.content.parts.length > 0) {
            // Concatenate all parts
            text = candidate.content.parts
              .map((part: any) => part.text || '')
              .join('');
          }
        }
        
        // Trim the result
        text = text.trim();
        
        // Check if response was cut off due to token limits
        if (response.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
          // Still return what we have, but it might be incomplete
          if (!text) {
            throw new Error('Response truncated - no text generated before token limit');
          }
        }
        
        // Validate we got actual text
        if (!text) {
          throw new Error('Gemini returned empty response');
        }
        
        return { success: true, response: text, modelUsed: modelName };
      } catch (error: any) {
        const isOverloaded = error.status === 503 || 
                           error.message?.includes('overloaded') ||
                           error.message?.includes('503');
        
        // If this is the last retry or not an overload error, throw
        if (attempt === maxRetries || !isOverloaded) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        const delay = delays[attempt];
        await sleep(delay);
      }
    }
    
    throw new Error('Max retries exceeded');
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // For free tier: minimal conversation history to reduce token usage
    // Only use last 2 messages (1 user + 1 assistant) instead of 6
    const mappedHistory = conversationHistory.slice(-2).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Gemini requires first message to be from 'user'
    // Find the first 'user' message and start from there
    let history = [];
    let foundFirstUser = false;
    for (const msg of mappedHistory) {
      if (!foundFirstUser && msg.role === 'user') {
        foundFirstUser = true;
      }
      if (foundFirstUser) {
        history.push(msg);
      }
    }

    // Use single stable model for free tier (no fallbacks to avoid quota exhaustion)
    const modelName = 'gemini-2.5-flash'; // Latest model
    
    try {
      const result = await callGeminiWithRetry(genAI, modelName, history, message);
      return { success: true, response: result.response };
    } catch (error: any) {
      
      // Check if it's a quota error (429)
      if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('429')) {
        throw new Error('API quota exceeded. Please wait a minute before trying again.');
      }
      
      throw error;
    }
    
  } catch (error: any) {
    // Provide user-friendly error messages
    let userMessage = error.message || 'Failed to get AI response';
    
    if (userMessage.includes('empty response')) {
      userMessage = 'The AI returned an empty response. This may be due to content filtering or API limits. Please try rephrasing your question.';
    } else if (error.status === 503 || userMessage.includes('overloaded')) {
      userMessage = 'AI is temporarily overloaded. Please try again in a moment.';
    } else if (error.status === 429 || userMessage.includes('quota') || userMessage.includes('429')) {
      userMessage = '⏱️ Free tier quota reached. Please wait 60 seconds before sending another message.';
    } else if (error.status === 400 && userMessage.includes('SAFETY')) {
      userMessage = 'Your message was blocked by safety filters. Please rephrase your question.';
    }
    
    return { success: false, error: userMessage };
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
    
    return { success: true, authenticated: calendarService.isAuthenticated() };
  } catch (error: any) {
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
    if (!calendarService) {
      return { success: false, error: 'Calendar service not initialized' };
    }
    
    const isAuth = calendarService.isAuthenticated();
    
    if (!isAuth) {
      return { success: false, error: 'Not authenticated. Please sign in to Google Calendar.' };
    }
    
    const result = await calendarService.createEvent({
      summary: eventData.summary,
      description: eventData.description,
      startDateTime: new Date(eventData.startDateTime),
      endDateTime: new Date(eventData.endDateTime),
      location: eventData.location,
      attendees: eventData.attendees,
    });
    
    return result;
  } catch (error: any) {
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
