import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import Store from 'electron-store';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { exec } from 'node:child_process';

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

// Initialize electron-store
const store = new Store();

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
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1100,  // Set minimum window size
    minHeight: 700,
    useContentSize: true,  // Use content size instead of window size
    icon: path.join(__dirname, '../public/images/logo.png'),
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
  }
}

// Store operations
ipcMain.handle('getStore', async (event, key) => {
  if (key.includes('.')) {
    // Handle single property access, e.g., 'wallpaperParams.waveColor'
    const [objKey, paramName] = key.split('.');
    if (objKey === 'wallpaperParams') {
      return getWallpaperParam(paramName);
    }
  }
  return store.get(key);
});

ipcMain.handle('setStore', async (event, key, value) => {
  if (key.includes('.')) {
    // Handle single property setting, e.g., 'wallpaperParams.waveColor'
    const [objKey, paramName] = key.split('.');
    if (objKey === 'wallpaperParams') {
      return setWallpaperParam(paramName, value);
    }
  }
  store.set(key, value);
  return true;
});

// Test handler
ipcMain.handle('ping', () => {
  return 'Pong from main!';
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
app.whenReady().then(() => {
  createWindow();
  setTimeout(() => {
    const win = BrowserWindow.getAllWindows()[0];
    win.webContents.send('message', 'Hello from main process!');
  }, 2000);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});