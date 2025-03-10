// Expose necessary functions from main process to renderer
const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Test functions
  ping: () => ipcRenderer.invoke('ping'),

  // Store operations
  getStore: (key) => ipcRenderer.invoke('getStore', key),
  setStore: (key, value) => ipcRenderer.invoke('setStore', key, value),

  // Wallpaper operations
  writeImageFile: (base64Url) => ipcRenderer.invoke('writeImageFile', base64Url),
  setWallpaper: (imagePath) => ipcRenderer.invoke('setWallpaper', imagePath),

  // Notification
  showNotification: (message, type) => ipcRenderer.invoke('show-notification', message, type),

  // Message listener
  onMessage: (callback) => {
    ipcRenderer.on('message', (event, arg) => callback(arg));
  }, 
})
