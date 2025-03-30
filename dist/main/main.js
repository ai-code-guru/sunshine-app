"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const calendarAuth_1 = require("./calendarAuth");
const calendarSync_1 = require("./calendarSync");
const audioDetection_1 = require("./audioDetection");
const MeetingService_1 = __importDefault(require("./services/MeetingService"));
let mainWindow = null;
let audioDetectionService = null;
let meetingService = null;
// Register custom protocol
if (!electron_1.app.isDefaultProtocolClient('sunshine')) {
    electron_1.app.setAsDefaultProtocolClient('sunshine');
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
    mainWindow = new electron_1.BrowserWindow({
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
    }
    else {
        console.log('Production mode: Loading from file');
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html')).catch(error => {
            console.error('Failed to load file:', error);
        });
        mainWindow.webContents.openDevTools(); // Also show DevTools in production for debugging
    }
    // Initialize audio detection service
    if (mainWindow) {
        console.log('Initializing audio detection service...');
        audioDetectionService = new audioDetection_1.AudioDetectionService(mainWindow);
        audioDetectionService.startMonitoring();
    }
    // Initialize MeetingService using singleton pattern
    console.log('Initializing meeting service...');
    meetingService = MeetingService_1.default.getInstance(mainWindow);
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
electron_1.app.whenReady().then(() => {
    createWindow();
    // Set up calendar authentication handlers
    (0, calendarAuth_1.setupGoogleCalendarAuth)();
    (0, calendarAuth_1.setupMicrosoftCalendarAuth)();
    (0, calendarSync_1.setupCalendarSync)();
});
// Handle OAuth redirect
electron_1.app.on('open-url', (event, url) => {
    event.preventDefault();
    if (mainWindow) {
        mainWindow.webContents.send('oauth-callback', url);
    }
});
electron_1.app.on('window-all-closed', () => {
    cleanupServices();
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
