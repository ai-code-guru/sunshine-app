"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupCalendarSync = setupCalendarSync;
const electron_1 = require("electron");
const googleapis_1 = require("googleapis");
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
// Calendar sync handler
function setupCalendarSync() {
    electron_1.ipcMain.handle('sync-calendar', async (event, { provider, credentials }) => {
        try {
            if (provider === 'google') {
                return await syncGoogleCalendar(credentials);
            }
            else if (provider === 'microsoft') {
                return await syncMicrosoftCalendar(credentials);
            }
            else {
                throw new Error('Invalid calendar provider');
            }
        }
        catch (error) {
            console.error('Calendar sync error:', error);
            return { success: false, error: error.message || 'Unknown error occurred' };
        }
    });
}
// Sync Google Calendar
async function syncGoogleCalendar(credentials) {
    const oauth2Client = new googleapis_1.google.auth.OAuth2();
    oauth2Client.setCredentials(credentials);
    // Check if token needs refresh
    if (Date.now() >= credentials.expires_at) {
        try {
            const { credentials: newCredentials } = await oauth2Client.refreshAccessToken();
            if (newCredentials.access_token) {
                credentials.access_token = newCredentials.access_token;
            }
            if (newCredentials.expiry_date) {
                credentials.expires_at = newCredentials.expiry_date;
            }
        }
        catch (error) {
            console.error('Failed to refresh Google token:', error);
            throw error;
        }
    }
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth: oauth2Client });
    try {
        // Get events for the next month
        const now = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        const response = await calendar.events.list({
            calendarId: 'primary',
            timeMin: now.toISOString(),
            timeMax: oneMonthFromNow.toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
        });
        return {
            success: true,
            events: response.data.items,
            credentials: {
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token,
                expires_at: credentials.expires_at,
            },
        };
    }
    catch (error) {
        console.error('Failed to fetch Google Calendar events:', error);
        throw error;
    }
}
// Sync Microsoft Calendar
async function syncMicrosoftCalendar(credentials) {
    // Check if token needs refresh
    if (Date.now() >= credentials.expires_at) {
        try {
            const response = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: process.env.MICROSOFT_CLIENT_ID,
                    client_secret: process.env.MICROSOFT_CLIENT_SECRET,
                    refresh_token: credentials.refresh_token,
                    grant_type: 'refresh_token',
                }),
            });
            const tokens = await response.json();
            if (tokens.access_token) {
                credentials.access_token = tokens.access_token;
            }
            if (tokens.expires_in) {
                credentials.expires_at = Date.now() + tokens.expires_in * 1000;
            }
        }
        catch (error) {
            console.error('Failed to refresh Microsoft token:', error);
            throw error;
        }
    }
    const graphClient = microsoft_graph_client_1.Client.init({
        authProvider: (done) => {
            done(null, credentials.access_token);
        },
    });
    try {
        // Get events for the next month
        const now = new Date();
        const oneMonthFromNow = new Date();
        oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
        const response = await graphClient
            .api('/me/calendar/events')
            .filter(`start/dateTime ge '${now.toISOString()}' and end/dateTime le '${oneMonthFromNow.toISOString()}'`)
            .orderby('start/dateTime')
            .get();
        return {
            success: true,
            events: response.value,
            credentials: {
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token,
                expires_at: credentials.expires_at,
            },
        };
    }
    catch (error) {
        console.error('Failed to fetch Microsoft Calendar events:', error);
        throw error;
    }
}
