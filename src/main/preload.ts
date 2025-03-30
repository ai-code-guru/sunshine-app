import { contextBridge, ipcRenderer, shell } from 'electron';

console.log('Preload script starting...');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
try {
  console.log('Setting up context bridge...');
  contextBridge.exposeInMainWorld(
    'electron',
    {
      startMeeting: async () => {
        try {
          return await ipcRenderer.invoke('start-meeting');
        } catch (error) {
          console.error('Error invoking start-meeting:', error);
          throw error;
        }
      },
      stopMeeting: async () => {
        try {
          return await ipcRenderer.invoke('stop-meeting');
        } catch (error) {
          console.error('Error invoking stop-meeting:', error);
          throw error;
        }
      },
      onMeetingDetected: (callback: () => void) => {
        try {
          const handler = () => callback();
          ipcRenderer.on('meeting-detected', handler);
          return () => {
            try {
              ipcRenderer.removeListener('meeting-detected', handler);
            } catch (error) {
              console.error('Error removing meeting-detected listener:', error);
            }
          };
        } catch (error) {
          console.error('Error setting up meeting-detected listener:', error);
          return () => {}; // Return no-op cleanup function
        }
      },
      onMeetingEnded: (callback: () => void) => {
        try {
          const handler = () => callback();
          ipcRenderer.on('meeting-ended', handler);
          return () => {
            try {
              ipcRenderer.removeListener('meeting-ended', handler);
            } catch (error) {
              console.error('Error removing meeting-ended listener:', error);
            }
          };
        } catch (error) {
          console.error('Error setting up meeting-ended listener:', error);
          return () => {}; // Return no-op cleanup function
        }
      },
      onRecordingSaved: (callback: (data: { filePath: string; timestamp: string; size: number }) => void) => {
        try {
          const handler = (_: any, data: any) => callback(data);
          ipcRenderer.on('recording-saved', handler);
          return () => {
            try {
              ipcRenderer.removeListener('recording-saved', handler);
            } catch (error) {
              console.error('Error removing recording-saved listener:', error);
            }
          };
        } catch (error) {
          console.error('Error setting up recording-saved listener:', error);
          return () => {}; // Return no-op cleanup function
        }
      },
      onRecordingSaveFailed: (callback: (error: Error) => void) => {
        try {
          const handler = (_: any, error: Error) => callback(error);
          ipcRenderer.on('recording-save-failed', handler);
          return () => {
            try {
              ipcRenderer.removeListener('recording-save-failed', handler);
            } catch (error) {
              console.error('Error removing recording-save-failed listener:', error);
            }
          };
        } catch (error) {
          console.error('Error setting up recording-save-failed listener:', error);
          return () => {}; // Return no-op cleanup function
        }
      },
      openExternal: async (url: string) => {
        try {
          return await shell.openExternal(url);
        } catch (error) {
          console.error('Error opening external URL:', error);
          throw error;
        }
      },
      closeWindow: () => {
        try {
          ipcRenderer.send('close-window');
        } catch (error) {
          console.error('Error closing window:', error);
          throw error;
        }
      }
    }
  );
  console.log('Context bridge setup complete');
} catch (error) {
  console.error('Error in preload script:', error);
} 