import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    startMeeting: () => ipcRenderer.invoke('start-meeting'),
    stopMeeting: () => ipcRenderer.invoke('stop-meeting'),
    onMeetingDetected: (callback: () => void) => {
      ipcRenderer.on('meeting-detected', () => callback());
    },
    onMeetingEnded: (callback: () => void) => {
      ipcRenderer.on('meeting-ended', () => callback());
    },
    onRecordingSaved: (callback: (data: { filePath: string; timestamp: string; size: number }) => void) => {
      ipcRenderer.on('recording-saved', (_, data) => callback(data));
    },
    onRecordingSaveFailed: (callback: (error: Error) => void) => {
      ipcRenderer.on('recording-save-failed', (_, error) => callback(error));
    }
  }
); 