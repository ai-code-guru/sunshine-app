import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as isDev from 'electron-is-dev';
import { setupGoogleCalendarAuth, setupMicrosoftCalendarAuth } from './calendarAuth';
import { setupCalendarSync } from './calendarSync';
import { AudioDetectionService } from './audioDetection';
import MeetingService from './services/MeetingService';

let mainWindow: BrowserWindow | null = null;
let audioDetectionService: AudioDetectionService | null = null;
let meetingService: MeetingService | null = null;

// Register custom protocol
if (!app.isDefaultProtocolClient('sunshine')) {
  app.setAsDefaultProtocolClient('sunshine');
}

function cleanupServices() {
  if (audioDetectionService) {
    audioDetectionService.stopMonitoring();
    audioDetectionService = null;
  }
  if (meetingService) {
    meetingService.dispose();
    meetingService = null;
  }
}

function createWindow() {
  // Cleanup any existing services
  cleanupServices();

  console.log('Creating main window...');

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  console.log('Loading content...');
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Loading from localhost:3000');
    mainWindow.loadURL('http://localhost:3000').catch(error => {
      console.error('Failed to load URL:', error);
    });
    mainWindow.webContents.openDevTools();
  } else {
    console.log('Production mode: Loading from file');
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html')).catch(error => {
      console.error('Failed to load file:', error);
    });
    mainWindow.webContents.openDevTools(); // Also show DevTools in production for debugging
  }

  // Initialize audio detection service
  if (mainWindow) {
    console.log('Initializing audio detection service...');
    audioDetectionService = new AudioDetectionService(mainWindow);
    audioDetectionService.startMonitoring();
  }

  // Initialize MeetingService using singleton pattern
  console.log('Initializing meeting service...');
  meetingService = MeetingService.getInstance(mainWindow);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Window finished loading');
  });

  mainWindow.on('closed', () => {
    console.log('Window closed, cleaning up services...');
    cleanupServices();
    mainWindow = null;
  });
}

// Set up IPC handlers
ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

app.whenReady().then(() => {
  createWindow();
  
  // Set up calendar authentication handlers
  setupGoogleCalendarAuth();
  setupMicrosoftCalendarAuth();
  setupCalendarSync();
});

// Handle OAuth redirect
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('oauth-callback', url);
  }
});

app.on('window-all-closed', () => {
  cleanupServices();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
}); 