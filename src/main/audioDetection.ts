import { BrowserWindow, ipcMain } from 'electron';
import { desktopCapturer } from 'electron';

interface DesktopCapturerSourceWithAudio extends Electron.DesktopCapturerSource {
  audio?: boolean;
}

export class AudioDetectionService {
  private window: BrowserWindow;
  private isMonitoring: boolean = false;
  private audioCheckInterval: NodeJS.Timeout | null = null;

  constructor(window: BrowserWindow) {
    this.window = window;
  }

  async startMonitoring() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;

    // Check for audio sources every second
    this.audioCheckInterval = setInterval(async () => {
      const sources = (await desktopCapturer.getSources({
        types: ['window', 'screen'],
        thumbnailSize: { width: 0, height: 0 }
      })) as DesktopCapturerSourceWithAudio[];

      // Check if any source has audio
      const hasAudioSource = sources.some(source => source.audio);
      
      // If there are active audio sources, notify the renderer
      if (hasAudioSource) {
        this.window.webContents.send('audio-detected');
      }
    }, 1000);
  }

  stopMonitoring() {
    if (this.audioCheckInterval) {
      clearInterval(this.audioCheckInterval);
      this.audioCheckInterval = null;
    }
    this.isMonitoring = false;
  }
}

export async function hasAudioDevices(): Promise<boolean> {
  try {
    const sources = (await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 0, height: 0 }
    })) as DesktopCapturerSourceWithAudio[];
    
    return sources.some(source => source.audio);
  } catch (error) {
    console.error('Error checking for audio devices:', error);
    return false;
  }
}

export async function getAudioSources(): Promise<DesktopCapturerSourceWithAudio[]> {
  try {
    const sources = (await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 0, height: 0 }
    })) as DesktopCapturerSourceWithAudio[];
    
    return sources.filter(source => source.audio);
  } catch (error) {
    console.error('Error getting audio sources:', error);
    return [];
  }
} 