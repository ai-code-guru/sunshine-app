"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
console.log('Preload script starting...');
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
try {
    console.log('Setting up context bridge...');
    electron_1.contextBridge.exposeInMainWorld('electron', {
        startMeeting: async () => {
            try {
                return await electron_1.ipcRenderer.invoke('start-meeting');
            }
            catch (error) {
                console.error('Error invoking start-meeting:', error);
                throw error;
            }
        },
        stopMeeting: async () => {
            try {
                return await electron_1.ipcRenderer.invoke('stop-meeting');
            }
            catch (error) {
                console.error('Error invoking stop-meeting:', error);
                throw error;
            }
        },
        onMeetingDetected: (callback) => {
            try {
                const handler = () => callback();
                electron_1.ipcRenderer.on('meeting-detected', handler);
                return () => {
                    try {
                        electron_1.ipcRenderer.removeListener('meeting-detected', handler);
                    }
                    catch (error) {
                        console.error('Error removing meeting-detected listener:', error);
                    }
                };
            }
            catch (error) {
                console.error('Error setting up meeting-detected listener:', error);
                return () => { }; // Return no-op cleanup function
            }
        },
        onMeetingEnded: (callback) => {
            try {
                const handler = () => callback();
                electron_1.ipcRenderer.on('meeting-ended', handler);
                return () => {
                    try {
                        electron_1.ipcRenderer.removeListener('meeting-ended', handler);
                    }
                    catch (error) {
                        console.error('Error removing meeting-ended listener:', error);
                    }
                };
            }
            catch (error) {
                console.error('Error setting up meeting-ended listener:', error);
                return () => { }; // Return no-op cleanup function
            }
        },
        onRecordingSaved: (callback) => {
            try {
                const handler = (_, data) => callback(data);
                electron_1.ipcRenderer.on('recording-saved', handler);
                return () => {
                    try {
                        electron_1.ipcRenderer.removeListener('recording-saved', handler);
                    }
                    catch (error) {
                        console.error('Error removing recording-saved listener:', error);
                    }
                };
            }
            catch (error) {
                console.error('Error setting up recording-saved listener:', error);
                return () => { }; // Return no-op cleanup function
            }
        },
        onRecordingSaveFailed: (callback) => {
            try {
                const handler = (_, error) => callback(error);
                electron_1.ipcRenderer.on('recording-save-failed', handler);
                return () => {
                    try {
                        electron_1.ipcRenderer.removeListener('recording-save-failed', handler);
                    }
                    catch (error) {
                        console.error('Error removing recording-save-failed listener:', error);
                    }
                };
            }
            catch (error) {
                console.error('Error setting up recording-save-failed listener:', error);
                return () => { }; // Return no-op cleanup function
            }
        }
    });
    console.log('Context bridge setup complete');
}
catch (error) {
    console.error('Error in preload script:', error);
}
