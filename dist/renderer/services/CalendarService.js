"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class CalendarService {
    constructor() { }
    static getInstance() {
        if (!CalendarService.instance) {
            CalendarService.instance = new CalendarService();
        }
        return CalendarService.instance;
    }
    async connectGoogle() {
        try {
            // The main process will handle the OAuth flow
            const result = await electron_1.ipcRenderer.invoke('connect-google-calendar');
            if (result.success) {
                this.credentials = result.credentials;
                this.currentProvider = 'google';
            }
            else {
                throw new Error(result.error);
            }
        }
        catch (error) {
            console.error('Failed to connect Google Calendar:', error);
            throw error;
        }
    }
    async connectMicrosoft() {
        try {
            // The main process will handle the OAuth flow
            const result = await electron_1.ipcRenderer.invoke('connect-microsoft-calendar');
            if (result.success) {
                this.credentials = result.credentials;
                this.currentProvider = 'microsoft';
            }
            else {
                throw new Error(result.error);
            }
        }
        catch (error) {
            console.error('Failed to connect Microsoft Calendar:', error);
            throw error;
        }
    }
    async disconnect() {
        if (!this.currentProvider || !this.credentials) {
            return;
        }
        try {
            await electron_1.ipcRenderer.invoke(`disconnect-${this.currentProvider}-calendar`);
            this.credentials = undefined;
            this.currentProvider = undefined;
        }
        catch (error) {
            console.error('Failed to disconnect calendar:', error);
            throw error;
        }
    }
    async getEvents(start, end) {
        if (!this.currentProvider || !this.credentials) {
            throw new Error('No calendar connected');
        }
        try {
            const result = await electron_1.ipcRenderer.invoke('get-calendar-events', {
                provider: this.currentProvider,
                start: start.toISOString(),
                end: end.toISOString(),
            });
            if (result.success) {
                return result.events.map((event) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                }));
            }
            else {
                throw new Error(result.error);
            }
        }
        catch (error) {
            console.error('Failed to fetch calendar events:', error);
            throw error;
        }
    }
    async createEvent(event) {
        if (!this.currentProvider || !this.credentials) {
            throw new Error('No calendar connected');
        }
        try {
            const result = await electron_1.ipcRenderer.invoke('create-calendar-event', {
                provider: this.currentProvider,
                event: {
                    ...event,
                    start: event.start.toISOString(),
                    end: event.end.toISOString(),
                },
            });
            if (result.success) {
                return {
                    ...result.event,
                    start: new Date(result.event.start),
                    end: new Date(result.event.end),
                };
            }
            else {
                throw new Error(result.error);
            }
        }
        catch (error) {
            console.error('Failed to create calendar event:', error);
            throw error;
        }
    }
    getCurrentProvider() {
        return this.currentProvider;
    }
    getConnectedEmail() {
        return this.credentials?.email;
    }
    isConnected() {
        return !!this.credentials;
    }
}
exports.default = CalendarService.getInstance();
