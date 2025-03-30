"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
electron_1.contextBridge.exposeInMainWorld('electron', {
    startMeeting: () => electron_1.ipcRenderer.invoke('start-meeting'),
    stopMeeting: () => electron_1.ipcRenderer.invoke('stop-meeting'),
    onMeetingDetected: (callback) => {
        electron_1.ipcRenderer.on('meeting-detected', () => callback());
    },
    onMeetingEnded: (callback) => {
        electron_1.ipcRenderer.on('meeting-ended', () => callback());
    },
    onRecordingSaved: (callback) => {
        electron_1.ipcRenderer.on('recording-saved', (_, data) => callback(data));
    },
    onRecordingSaveFailed: (callback) => {
        electron_1.ipcRenderer.on('recording-save-failed', (_, error) => callback(error));
    }
});
