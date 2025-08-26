import { app, BrowserWindow, ipcMain, Notification, Tray, Menu } from 'electron';
import Store from 'electron-store';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { exec } from 'node:child_process';
import OpenAI from 'openai';

// Initialize OpenAI client
let openai = new OpenAI({
  apiKey: ''  // Will be loaded from store later
});

// Load API key from store
const loadApiKey = () => {
  try {
    const apiKey = store.get('openai-api-key');
    if (apiKey) {
      openai = new OpenAI({
        apiKey: apiKey
      });
      logger.log('API key loaded from store');
    }
  } catch (error) {
    logger.error('Failed to load API key from store:', error);
  }
};

// Check if OpenAI API key is valid
const isValidApiKey = async (key) => {
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return { isValid: false, error: 'API key not provided' };
  }

  try {
    // Create a new OpenAI instance with the key
    const testClient = new OpenAI({ apiKey: key });
    
    // Try to make a minimal API call to verify the key
    await testClient.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "test" }],
      max_tokens: 1
    });
    
    return { isValid: true };
  } catch (error) {
    logger.error('API key validation failed:', error.message);
    
    // Check error type
    if (error.status === 401 || error.message.includes('auth')) {
      return { isValid: false, error: 'Invalid API key' };
    } else if (error.message.includes('network') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      return { isValid: false, error: 'Network error, please check your internet connection' };
    } else {
      return { isValid: false, error: `API error: ${error.message}` };
    }
  }
};

// Logger utility
const logger = {
  get isDevelopment() {
    return !app.isPackaged;
  },
  
  log(message, ...args) {
    if (this.isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  
  warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(`[DEBUG] ${message}`, ...args);
    }
  },
  
  error(message, ...args) {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, ...args);
  }
};

// Log current environment
logger.log('Environment:', logger.isDevelopment ? 'Development' : 'Production');

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define main window as a global variable
let win = null; 

// Initialize electron-store
const store = new Store();

// Set application name explicitly
app.name = 'ZenWaves';

// Initialize default parameters
if (!store.has('wallpaperParams')) {
  store.set('wallpaperParams', {
    waveColor: '',
    isDarkMode: true,
    changeInterval: 60,
    fontFamily: 'JXZhuoKai',
    autoDeleteWallpaper: true,
  });
}

// Helper function: Get wallpaperParams property
function getWallpaperParam(paramName) {
  const params = store.get('wallpaperParams');
  if (!params) {
    logger.warn('wallpaperParams not found in store');
    return undefined;
  }
  const value = params[paramName];
  logger.log(`Getting wallpaperParam ${paramName}: ${value}`);
  return value;
}

// Helper function: Set wallpaperParams property
function setWallpaperParam(paramName, value) {
  const params = store.get('wallpaperParams');
  if (!params) {
    logger.error('wallpaperParams not found in store');
    return false;
  }
  params[paramName] = value;
  store.set('wallpaperParams', params);
  logger.log(`Set wallpaperParam ${paramName} to: ${value}`);
  return true;
}

// Delete file utility
async function deleteTempFile(filePath) {
  try {
    // Verify the file is in our wallpapers directory
    const userDataPath = app.getPath('userData');
    const wallpapersDir = path.join(userDataPath, 'wallpapers');
    
    if (!filePath.startsWith(wallpapersDir)) {
      logger.warn('Attempted to delete file outside wallpapers directory:', filePath);
      return false;
    }

    await fs.promises.unlink(filePath);
    logger.log('Wallpaper file deleted successfully:', filePath);
    return true;
  } catch (error) {
    logger.error('Failed to delete wallpaper file:', error);
    throw error;
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1500,
    height: 800,
    minWidth: 1500,  // Set minimum window size
    minHeight: 700,
    useContentSize: true,  // Use content size instead of window size
    icon: path.join(__dirname, '../public/images/logo.png'),
    autoHideMenuBar: true,  // Hide the menu bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Specify preload script
      nodeIntegration: false, // Enable Node integration
      contextIsolation: true, // Enable context isolation
    },
  });

  //logger.log('App is packaged:', app.isPackaged);
  //logger.log('Dir name is: ', __dirname);

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html')); // Production mode
  } else {
    win.loadURL('http://localhost:5173'); // Development mode
    //win.webContents.openDevTools(); // Automatically open developer tools
  };

    // When window is minimized, hide the window
    win.on('minimize', (event) => {
      event.preventDefault();
      win.hide();
    });
  
    // When window is closed, hide the window (TODO: let user can choose is window hidden or quit app when close window)
    win.on('close', (event) => {
      if (!app.isQuiting) {
        event.preventDefault();
        win.hide();
      }
      return false;
    });
}

// Store operations
ipcMain.handle('getStore', (event, key) => {
  return store.get(key);
});

ipcMain.handle('setStore', (event, key, value) => {
  store.set(key, value);
  
  // If setting the OpenAI API key, update the client
  if (key === 'openai-api-key' && value) {
    openai = new OpenAI({
      apiKey: value
    });
    logger.log('API key updated from store');
  }
  
  return true;
});

// Test handler
ipcMain.handle('ping', () => {
  return 'Pong from main!';
});

// AI interaction handler
// TODO: The AI currently returns incorrect poems, such as mismatched poems and poet names, or fabricated poems, need to fix this
ipcMain.handle('interact-with-ai', async (event, userInput) => {
  try {
    // Always use the API key from store
    const apiKey = store.get('openai-api-key');
    if (apiKey && apiKey !== openai.apiKey) {
      // Update the OpenAI client with the stored API key
      openai = new OpenAI({
        apiKey: apiKey
      });
      logger.log('Using API key from store');
    }
    
    const keyValidation = await isValidApiKey(openai.apiKey);
    if (!keyValidation.isValid) {
      logger.warn('OpenAI API key validation failed:', keyValidation.error);
      return {
        success: false,
        error: keyValidation.error
      };
    }

    // Enhanced prompt template with strict authenticity requirements
    const fullPrompt = `You are a scholarly Chinese poetry expert. Find ONLY authentic, well-documented Chinese poems that match: ${userInput}

SEARCH CRITERIA:
- If input is a POET NAME: return any famous poem by that poet
- If input is a POEM TITLE: return that specific poem
- If input contains keywords: find poems with related themes or content

CRITICAL REQUIREMENTS:
1. NEVER fabricate or create poems - only return real, historically documented Chinese poetry
2. Only return poems from verified classical Chinese poets (Tang, Song, Yuan, Ming, Qing dynasties, or modern recognized poets)
3. Ensure the verse, poem name, and author are all factually accurate
4. If uncertain about authenticity, return an error instead of guessing
5. Verify that the verse actually belongs to the specified poem and author

If you find a verified authentic poem, return JSON in this structure:
{"verse": "exact two lines from the authentic poem", "poem_name": "exact authentic poem title", "author": "verified poet name"}

If no authentic poem can be confidently identified, return:
{"error": "No verified poem found matching your search"}

DO NOT return any poems unless you are completely certain of their authenticity. It is better to return an error than fabricated content.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a rigorous Chinese poetry scholar who NEVER fabricates content. You only provide verified, authentic Chinese poetry from documented historical sources. If uncertain about authenticity, always err on the side of caution and return an error. Always respond in valid JSON format." },
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.1, // Lower temperature for more factual responses
      max_tokens: 150
    });

    const response = completion.choices[0].message.content.trim();
    
    try {
      // Parse the response to verify it's valid JSON
      const jsonResponse = JSON.parse(response);
      
      // Check if it's an error response
      if (jsonResponse.error) {
        return {
          success: false,
          error: jsonResponse.error
        };
      }
      
      // Validate the response has all required fields
      if (!jsonResponse.verse || !jsonResponse.poem_name || !jsonResponse.author) {
        return {
          success: false,
          error: 'Incomplete poem information received'
        };
      }
      
      // It's a valid poem response
      return {
        success: true,
        response: response
      };
    } catch (error) {
      logger.error('Failed to parse AI response:', error);
      return {
        success: false,
        error: 'Invalid response format from AI'
      };
    }
  } catch (error) {
    logger.error('AI interaction failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    };
  }
});

// Notification
ipcMain.handle('show-notification', (event, message, type) => {
  const notificationTitle = type === 'error' ? 'ERROR' : 
                           type === 'success' ? 'SUCCESS' : 'NOTE';
  new Notification({ 
    title: notificationTitle, 
    body: message
  }).show();
});

// Write image file for wallpaper
ipcMain.handle('writeImageFile', async (event, base64Url) => {
  try {
    // Get user data directory path
    const userDataPath = app.getPath('userData');
    logger.log('User data directory:', userDataPath);

    // Create wallpapers directory if it doesn't exist
    const wallpapersDir = path.join(userDataPath, 'wallpapers');
    await fs.promises.mkdir(wallpapersDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const imagePath = path.join(wallpapersDir, `wallpaper_${timestamp}.png`);

    // Remove the data URL prefix and convert to buffer
    const base64Data = base64Url.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Write the file
    await fs.promises.writeFile(imagePath, imageBuffer);
    logger.log('Wallpaper saved to:', imagePath);
    return imagePath;
  } catch (error) {
    logger.error('Failed to write image file:', error);
    throw error;
  }
});

// Set wallpaper
ipcMain.handle('setWallpaper', async (event, imagePath) => {
  const platform = os.platform();
  logger.log('Get platform type:', platform);
  
  return new Promise((resolve, reject) => {
    let command;
    
    if (platform === 'darwin') {
      // macOS
      command = `osascript -e 'tell application "System Events" to tell every desktop to set picture to "${imagePath}"'`;
    } else if (platform === 'win32') {
      // Windows
      // Choose the correct script path based on whether the app is packaged
      let scriptPath;
      if (app.isPackaged) {
        // Production environment path
        scriptPath = path.join(process.resourcesPath, 'app', 'dist', 'scripts', 'setWallpaper.cs');
        // If the above path is incorrect, try alternative paths
        if (!fs.existsSync(scriptPath)) {
          scriptPath = path.join(app.getAppPath(), 'scripts', 'setWallpaper.cs');
        }
      } else {
        // Development environment path
        scriptPath = path.join(__dirname, '../public/scripts/setWallpaper.cs');
      }
      
      // Check if the script file exists
      if (!fs.existsSync(scriptPath)) {
        logger.error('setWallpaper.cs script file does not exist:', scriptPath);
        reject(new Error(`Wallpaper setting script not found: ${scriptPath}`));
        return;
      }
      
      logger.log('Using script path:', scriptPath);
      
      // Use setWallpaper.cs script to set desktop wallpaper
      command = `powershell -ExecutionPolicy Bypass -NoProfile -Command "Add-Type -Path '${scriptPath}'; [Wallpaper.Setter]::SetWallpaper('${imagePath}')"`;
    } else if (platform === 'linux') {
      // Linux (GNOME or KDE)
      // For GNOME: Both picture-uri and picture-uri-dark are set for light/dark themes
      // TODO: Verify if these commands works correctly on Linux KDE
      // For KDE: Using plasma-apply-wallpaperimage (!NOT verified)
      command = `if command -v gsettings >/dev/null 2>&1; then
        gsettings set org.gnome.desktop.background picture-uri "file://${imagePath.replace(/ /g, '\\ ')}"
        gsettings set org.gnome.desktop.background picture-uri-dark "file://${imagePath.replace(/ /g, '\\ ')}"
      elif command -v plasma-apply-wallpaperimage >/dev/null 2>&1; then
        plasma-apply-wallpaperimage "${imagePath.replace(/ /g, '\\ ')}"
      else
        exit 1
      fi`;
    } else {
      reject(new Error('Unsupported platform: ' + platform + ', Set Wallpaper only supports macOS, Windows or Linux(Gnome or KDE)'));
      return;
    }
    
    exec(command, async (error, stdout, stderr) => {
      if (error) {
        logger.error('Execute command failed:', error);
        logger.error('stderr:', stderr);
        reject(new Error(`Set wallpaper failed: ${error.message}`));
      } else {
        if (stderr) {
          logger.warn('stderr (NO ERROR):', stderr);
        }
        
        if (platform === 'darwin' || platform === 'linux') {
          // On macOS or Linux, add a small delay to ensure wallpaper is set
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Check if auto delete is enabled
        const autoDelete = getWallpaperParam('autoDeleteWallpaper');
        logger.log('Auto delete wallpaper files:', autoDelete);
        
        if (autoDelete) {
          // Delete wallpaper file after setting
          try {
            await deleteTempFile(imagePath);
            logger.log('Wallpaper file deleted after setting');
          } catch (deleteError) {
            logger.warn('Failed to delete wallpaper file, but wallpaper was set successfully');
          }
        } else {
          logger.log('Keeping wallpaper file as auto-delete is disabled');
        }
        
        resolve(true);
      }
    });
  });
});

// Open the main window
let tray = null;

app.whenReady().then(() => {
  // Load API key from store
  loadApiKey();
  
  createWindow();

  // Create tray icon
  let trayIconPath;
  if (app.isPackaged) {
    // Production environment path
    trayIconPath = path.join(process.resourcesPath, 'app', 'dist', 'images', 'trayicon.png');
    // If the above path is incorrect, try alternative paths
    if (!fs.existsSync(trayIconPath)) {
      trayIconPath = path.join(app.getAppPath(), 'images', 'trayicon.png');
    }
  } else {
    // Development environment path
    trayIconPath = path.join(__dirname, '../public/images/trayicon.png');
  }

  tray = new Tray(trayIconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open', click: () => win.show() },
    { 
      label: 'Settings', 
      click: () => {
        if (win) {
          win.show(); // Ensure window is visible
          win.webContents.send('settings-channel', 'open-settings'); // Send event to renderer
        }
      } 
    },
    { label: 'Quit', click: () => {
      app.isQuiting = true;
      app.quit();
    }}
  ]);
  tray.setToolTip('ZenWaves');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => win.show());
});

// Handle app activation, when click tray icon or relaunch app from Dock on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle app quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
