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
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const electron_2 = require("electron");
class MeetingService {
    constructor(mainWindow) {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.ipcHandlers = {};
        this.mainWindow = mainWindow;
        // Create recordings directory in user's app data
        this.recordingsPath = path.join(electron_2.app.getPath('userData'), 'recordings');
        if (!fs.existsSync(this.recordingsPath)) {
            fs.mkdirSync(this.recordingsPath, { recursive: true });
        }
        this.setupIpcHandlers();
        this.startMeetingDetection();
    }
    setupIpcHandlers() {
        // Remove existing handlers if they exist
        this.removeIpcHandlers();
        // Set up new handlers
        this.ipcHandlers = {
            'start-meeting': async () => await this.startRecording(),
            'stop-meeting': async () => await this.stopRecording()
        };
        // Register new handlers
        Object.entries(this.ipcHandlers).forEach(([channel, handler]) => {
            electron_1.ipcMain.handle(channel, handler.bind(this));
        });
    }
    removeIpcHandlers() {
        Object.keys(this.ipcHandlers).forEach(channel => {
            electron_1.ipcMain.removeHandler(channel);
        });
    }
    async startMeetingDetection() {
        // TODO: Implement meeting detection logic
        // This could involve:
        // 1. Checking for active video conferencing apps (Zoom, Teams, etc.)
        // 2. Monitoring system audio for meeting-like activity
        // 3. Checking calendar events
        // For now, we'll simulate meeting detection with a timer
        setInterval(() => {
            if (!this.isRecording) {
                // Simulate meeting detection every 30 seconds
                if (Math.random() > 0.8) {
                    this.mainWindow.webContents.send('meeting-detected');
                }
            }
        }, 30000);
    }
    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                        chromeMediaSource: 'desktop'
                    }
                },
                video: false
            });
            this.mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm'
            });
            this.recordedChunks = [];
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };
            this.mediaRecorder.onstop = () => {
                this.saveRecording();
            };
            this.mediaRecorder.start();
            this.isRecording = true;
        }
        catch (error) {
            console.error('Failed to start recording:', error);
            throw error;
        }
    }
    async stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;
            this.mainWindow.webContents.send('meeting-ended');
        }
    }
    async saveRecording() {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `meeting-${timestamp}.webm`;
            const filePath = path.join(this.recordingsPath, fileName);
            // Create a blob from the recorded chunks
            const blob = new Blob(this.recordedChunks, {
                type: 'audio/webm'
            });
            // Convert blob to buffer
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            // Save to file
            fs.writeFileSync(filePath, buffer);
            console.log('Recording saved to:', filePath);
            // TODO: Upload to Supabase
            // const { data, error } = await supabase.storage
            //   .from('meeting-recordings')
            //   .upload(fileName, buffer);
            this.recordedChunks = [];
            // Notify renderer about successful save
            this.mainWindow.webContents.send('recording-saved', {
                filePath,
                timestamp,
                size: buffer.length
            });
        }
        catch (error) {
            console.error('Failed to save recording:', error);
            this.mainWindow.webContents.send('recording-save-failed', error);
        }
    }
}
exports.default = MeetingService;
