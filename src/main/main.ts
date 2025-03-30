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

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Initialize audio detection service
  if (mainWindow) {
    audioDetectionService = new AudioDetectionService(mainWindow);
    audioDetectionService.startMonitoring();
  }

  // Initialize MeetingService
  meetingService = new MeetingService(mainWindow);

  mainWindow.on('closed', () => {
    if (audioDetectionService) {
      audioDetectionService.stopMonitoring();
    }
    mainWindow = null;
  });
}

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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle meeting-related IPC events
ipcMain.handle('start-meeting', async () => {
  if (meetingService) {
    await meetingService.startRecording();
  }
});

ipcMain.handle('stop-meeting', async () => {
  if (meetingService) {
    await meetingService.stopRecording();
  }
}); 