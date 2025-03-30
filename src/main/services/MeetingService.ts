import { ipcMain, BrowserWindow } from 'electron';
import { desktopCapturer } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

class MeetingService {
  private mainWindow: BrowserWindow;
  private isRecording: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private recordingsPath: string;
  private ipcHandlers: { [key: string]: (...args: any[]) => Promise<void> } = {};

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    
    // Create recordings directory in user's app data
    this.recordingsPath = path.join(app.getPath('userData'), 'recordings');
    if (!fs.existsSync(this.recordingsPath)) {
      fs.mkdirSync(this.recordingsPath, { recursive: true });
    }

    this.setupIpcHandlers();
    this.startMeetingDetection();
  }

  private setupIpcHandlers() {
    // Remove existing handlers if they exist
    this.removeIpcHandlers();

    // Set up new handlers
    this.ipcHandlers = {
      'start-meeting': async () => await this.startRecording(),
      'stop-meeting': async () => await this.stopRecording()
    };

    // Register new handlers
    Object.entries(this.ipcHandlers).forEach(([channel, handler]) => {
      ipcMain.handle(channel, handler.bind(this));
    });
  }

  private removeIpcHandlers() {
    Object.keys(this.ipcHandlers).forEach(channel => {
      ipcMain.removeHandler(channel);
    });
  }

  private async startMeetingDetection() {
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

  public async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: 'desktop'
          }
        },
        video: false
      } as any);

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

    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  public async stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.mainWindow.webContents.send('meeting-ended');
    }
  }

  private async saveRecording() {
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
    } catch (error) {
      console.error('Failed to save recording:', error);
      this.mainWindow.webContents.send('recording-save-failed', error);
    }
  }
}

export default MeetingService; 