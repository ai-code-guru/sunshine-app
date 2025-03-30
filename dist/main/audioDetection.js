"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioDetectionService = void 0;
exports.hasAudioDevices = hasAudioDevices;
exports.getAudioSources = getAudioSources;
const electron_1 = require("electron");
class AudioDetectionService {
    constructor(window) {
        this.isMonitoring = false;
        this.audioCheckInterval = null;
        this.window = window;
    }
    async startMonitoring() {
        if (this.isMonitoring)
            return;
        this.isMonitoring = true;
        // Check for audio sources every second
        this.audioCheckInterval = setInterval(async () => {
            const sources = (await electron_1.desktopCapturer.getSources({
                types: ['window', 'screen'],
                thumbnailSize: { width: 0, height: 0 }
            }));
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
exports.AudioDetectionService = AudioDetectionService;
async function hasAudioDevices() {
    try {
        const sources = (await electron_1.desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 0, height: 0 }
        }));
        return sources.some(source => source.audio);
    }
    catch (error) {
        console.error('Error checking for audio devices:', error);
        return false;
    }
}
async function getAudioSources() {
    try {
        const sources = (await electron_1.desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 0, height: 0 }
        }));
        return sources.filter(source => source.audio);
    }
    catch (error) {
        console.error('Error getting audio sources:', error);
        return [];
    }
}
