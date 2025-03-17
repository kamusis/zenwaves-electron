/**
 * Type definitions for Electron preload APIs
 */
export interface ElectronAPI {
  /** Test function that returns a greeting */
  sayHello: () => Promise<string>;
  
  /** Async ping function for IPC communication test */
  ping: () => Promise<string>;
  
  /** Get a value from electron-store */
  getStore: (key: string) => Promise<any>;
  
  /** Set a value in electron-store */
  setStore: (key: string, value: any) => Promise<void>;
  
  /** Register a callback for receiving messages from main process */
  onMessage: (callback: (arg: any) => void) => void;
  
  /** Settings channel message */
  onSettingsChannel: (callback: (arg: any) => void) => void;
  
  /** Write text content to Downloads directory */
  writeTextFile: (text: string) => Promise<string>;
  
  /** Write base64 image to Downloads directory */
  writeImageFile: (dataUrl: string) => Promise<string | undefined>;
  
  /** Delete a file */
  deleteFile: (filePath: string) => Promise<void>;
  
  /** Set system wallpaper */
  setWallpaper: (imagePath: string) => Promise<boolean>;

  /** Interact with OpenAI API */
  interactWithAI: (userInput: string) => Promise<{
    success: boolean;
    response?: string;
    error?: string;
  }>;
  
  /** Show a notification */
  showNotification: (message: string, type?: string) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
