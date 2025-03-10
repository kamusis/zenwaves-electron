import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import os from 'node:os';
import { exec } from 'node:child_process';

// 获取 __dirname 等价物
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 初始化 electron-store
const store = new Store();

// 初始化默认参数
if (!store.has('wallpaperParams')) {
  store.set('wallpaperParams', {
    waveColor: '',
    isDarkMode: true,
    changeInterval: 60,
    fontFamily: 'JXZhuoKai'
  });
}

// 辅助函数：获取 wallpaperParams 中的单个属性
function getWallpaperParam(paramName) {
  const params = store.get('wallpaperParams');
  return params ? params[paramName] : undefined;
}

// 辅助函数：设置 wallpaperParams 中的单个属性
function setWallpaperParam(paramName, value) {
  const params = store.get('wallpaperParams');
  if (params) {
    params[paramName] = value;
    store.set('wallpaperParams', params);
    return true;
  }
  return false;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/images/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 指定 preload 脚本
      nodeIntegration: false, // 开启 Node 集成
      contextIsolation: true, // 启用上下文隔离
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html')); // 生产模式
  } else {
    win.loadURL('http://localhost:5173'); // 开发模式
    win.webContents.openDevTools(); // 自动打开开发者工具
  }
}

// 处理 ping 请求
ipcMain.handle('ping', async () => {
  return 'Pong from main!';
});

// 处理 getStore 请求
ipcMain.handle('getStore', async (event, key) => {
  if (key.includes('.')) {
    // 处理单个属性获取，例如 'wallpaperParams.waveColor'
    const [objKey, paramName] = key.split('.');
    if (objKey === 'wallpaperParams') {
      return getWallpaperParam(paramName);
    }
  }
  return store.get(key);
});

// 处理 setStore 请求
ipcMain.handle('setStore', async (event, key, value) => {
  if (key.includes('.')) {
    // 处理单个属性设置，例如 'wallpaperParams.waveColor'
    const [objKey, paramName] = key.split('.');
    if (objKey === 'wallpaperParams') {
      return setWallpaperParam(paramName, value);
    }
  }
  store.set(key, value);
  return true;
});

// 处理文本写入到下载目录
ipcMain.handle('writeTextFile', async (event, text) => {
  const downloadsPath = path.join(os.homedir(), 'Downloads');
  const filePath = path.join(downloadsPath, Date.now().toString() + '.txt');
  fs.writeFileSync(filePath, text, { encoding: 'utf-8' });
  return filePath;
});

// 处理图片写入到下载目录
ipcMain.handle('writeImageFile', async (event, base64Url) => {
  const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url);
  if (!matchs) return null;
  
  const downloadsPath = path.join(os.homedir(), 'Downloads');
  const filePath = path.join(downloadsPath, Date.now().toString() + '.' + matchs[1]);
  fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), { encoding: 'base64' });
  return filePath;
});

// 处理删除文件
ipcMain.handle('deleteFile', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    // 检查文件是否存在
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // 文件不存在，直接返回成功
        resolve(true);
        return;
      }

      // 检查文件权限
      fs.access(filePath, fs.constants.W_OK, (err) => {
        if (err) {
          reject(new Error('没有文件删除权限'));
          return;
        }

        // 删除文件
        fs.unlink(filePath, (error) => {
          if (error) {
            reject(new Error(`删除文件失败: ${error.message}`));
          } else {
            resolve(true);
          }
        });
      });
    });
  });
});

// 处理设置壁纸
ipcMain.handle('setWallpaper', async (event, imagePath) => {
  const platform = os.platform();
  console.log('[DEBUG] Get platform type:', platform);
  
  return new Promise((resolve, reject) => {
    let command;
    
    if (platform === 'darwin') {
      // macOS
      command = `osascript -e 'tell application "System Events" to tell every desktop to set picture to "${imagePath}"'`;
    } else if (platform === 'win32') {
      // Windows
      // Get the absolute path of the setWallpaper.cs script file
      const scriptPath = path.join(__dirname, '../public/scripts/setWallpaper.cs');
      // Using setWallpaper.cs script to set desktop wallpaper on Windows systems
      command = `powershell -ExecutionPolicy Bypass -NoProfile -Command "Add-Type -Path '${scriptPath}'; [Wallpaper.Setter]::SetWallpaper('${imagePath}')"`;
    } else if (platform === 'linux') {
      // Linux 
      // For GNOME: Both picture-uri and picture-uri-dark are set for light/dark themes
      // For KDE: Using plasma-apply-wallpaperimage
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
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('[DEBUG] Execute command failed:', error);
        console.error('[DEBUG] stderr:', stderr);
        reject(new Error(`Set wallpaper failed: ${error.message}`));
      } else {
        if (stderr) {
          console.warn('[DEBUG] stderr (NO ERROR):', stderr);
        }
        resolve(true);
      }
    });
  });
});

// 打开窗口
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