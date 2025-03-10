// Only need electron to expose all the functions from main.js to renderer
const { contextBridge, ipcRenderer } = require('electron');

// 暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // test函数
  sayHello: () => 'Hello from preload!',

  // 与主进程通信的测试函数（异步）
  ping: () => ipcRenderer.invoke('ping'),

  // store 操作
  getStore: (key) => ipcRenderer.invoke('getStore', key),
  setStore: (key, value) => ipcRenderer.invoke('setStore', key, value),

  // 文件操作
  writeTextFile: (text) => ipcRenderer.invoke('writeTextFile', text),
  writeImageFile: (base64Url) => ipcRenderer.invoke('writeImageFile', base64Url),
  deleteFile: (filePath) => ipcRenderer.invoke('deleteFile', filePath),
  
  // 壁纸操作
  setWallpaper: (imagePath) => ipcRenderer.invoke('setWallpaper', imagePath),

  // 接收主进程消息的函数
  onMessage: (callback) => {
    ipcRenderer.on('message', (event, arg) => callback(arg));
  }, 
})
