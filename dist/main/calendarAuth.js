"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupGoogleCalendarAuth = setupGoogleCalendarAuth;
exports.setupMicrosoftCalendarAuth = setupMicrosoftCalendarAuth;
exports.handleGoogleAuth = handleGoogleAuth;
exports.handleMicrosoftAuth = handleMicrosoftAuth;
const electron_1 = require("electron");
const googleapis_1 = require("googleapis");
const microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
// Google OAuth configuration
const GOOGLE_CLIENT_ID = '125103330601-qtpjo7sthi2s5rj5esbcohlnfhghfg31.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_REDIRECT_URI = 'sunshine://oauth/google';
// Microsoft OAuth configuration
const MICROSOFT_CLIENT_ID = '25591a87-e880-47a4-a52e-c963bd03a8ee';
const MICROSOFT_CLIENT_SECRET = 'TTW8Q~vEHQpDp1ERy3vMqgpk3ufNyRQ.UaxpoaGZ';
const MICROSOFT_REDIRECT_URI = 'sunshine://oauth/microsoft';
// Google OAuth client
const googleOAuth2Client = new googleapis_1.google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
// Handle Google Calendar OAuth
function setupGoogleCalendarAuth() {
    electron_1.ipcMain.handle('connect-google-calendar', async () => {
        try {
            const authWindow = new electron_1.BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });
            const authUrl = googleOAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: [
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/calendar.events',
                    'https://www.googleapis.com/auth/calendar.readonly',
                    'https://www.googleapis.com/auth/userinfo.email'
                ]
            });
            authWindow.loadURL(authUrl);
            return new Promise((resolve, reject) => {
                authWindow.webContents.on('will-redirect', async (event, url) => {
                    if (url.startsWith(GOOGLE_REDIRECT_URI)) {
                        const code = new URL(url).searchParams.get('code');
                        if (!code) {
                            reject(new Error('No code received'));
                            return;
                        }
                        try {
                            const { tokens } = await googleOAuth2Client.getToken(code);
                            googleOAuth2Client.setCredentials(tokens);
                            // Get user email
                            const oauth2 = googleapis_1.google.oauth2({ version: 'v2', auth: googleOAuth2Client });
                            const { data: userInfo } = await oauth2.userinfo.get();
                            resolve({
                                success: true,
                                credentials: {
                                    provider: 'google',
                                    email: userInfo.email,
                                    accessToken: tokens.access_token,
                                    refreshToken: tokens.refresh_token,
                                    expiresAt: tokens.expiry_date
                                }
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                        finally {
                            authWindow.close();
                        }
                    }
                });
                authWindow.on('closed', () => {
                    reject(new Error('Window was closed'));
                });
            });
        }
        catch (error) {
            console.error('Google Calendar auth error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            };
        }
    });
}
// Handle Microsoft Calendar OAuth
function setupMicrosoftCalendarAuth() {
    electron_1.ipcMain.handle('connect-microsoft-calendar', async () => {
        try {
            const authWindow = new electron_1.BrowserWindow({
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true
                }
            });
            const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(MICROSOFT_REDIRECT_URI)}&scope=${encodeURIComponent('Calendars.ReadWrite User.Read offline_access')}`;
            authWindow.loadURL(authUrl);
            return new Promise((resolve, reject) => {
                authWindow.webContents.on('will-redirect', async (event, url) => {
                    if (url.startsWith(MICROSOFT_REDIRECT_URI)) {
                        const code = new URL(url).searchParams.get('code');
                        if (!code) {
                            reject(new Error('No code received'));
                            return;
                        }
                        try {
                            const tokenResponse = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: new URLSearchParams({
                                    client_id: MICROSOFT_CLIENT_ID,
                                    client_secret: MICROSOFT_CLIENT_SECRET,
                                    code,
                                    redirect_uri: MICROSOFT_REDIRECT_URI,
                                    grant_type: 'authorization_code'
                                })
                            });
                            const tokens = await tokenResponse.json();
                            // Get user email
                            const graphClient = microsoft_graph_client_1.Client.init({
                                authProvider: (done) => {
                                    done(null, tokens.access_token);
                                }
                            });
                            const userInfo = await graphClient.api('/me').get();
                            resolve({
                                success: true,
                                credentials: {
                                    provider: 'microsoft',
                                    email: userInfo.userPrincipalName,
                                    accessToken: tokens.access_token,
                                    refreshToken: tokens.refresh_token,
                                    expiresAt: Date.now() + tokens.expires_in * 1000
                                }
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                        finally {
                            authWindow.close();
                        }
                    }
                });
                authWindow.on('closed', () => {
                    reject(new Error('Window was closed'));
                });
            });
        }
        catch (error) {
            console.error('Microsoft Calendar auth error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An unknown error occurred'
            };
        }
    });
}
async function handleGoogleAuth() {
    try {
        // ... existing code ...
        return {
            success: false,
            error: 'Not implemented'
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}
async function handleMicrosoftAuth() {
    try {
        // ... existing code ...
        return {
            success: false,
            error: 'Not implemented'
        };
    }
    catch (error) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}
