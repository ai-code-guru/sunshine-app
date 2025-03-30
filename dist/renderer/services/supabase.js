"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.getCurrentProfile = getCurrentProfile;
exports.updateCalendarCredentials = updateCalendarCredentials;
exports.disconnectCalendar = disconnectCalendar;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://koyimcgjaoqxvwyscwaz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveWltY2dqYW9xeHZ3eXNjd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Nzk0OTAsImV4cCI6MjA1ODA1NTQ5MH0.XS6bfk65fNVSDmKD2k6CzbonON7DTYN9cyVn-S5uwNI';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
// Helper function to get the current user's profile
async function getCurrentProfile() {
    try {
        const { data: { user } } = await exports.supabase.auth.getUser();
        if (!user)
            return null;
        const { data: profile } = await exports.supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        return profile;
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
}
// Helper function to update calendar credentials
async function updateCalendarCredentials(userId, provider, credentials) {
    try {
        const { error } = await exports.supabase
            .from('profiles')
            .update({
            calendar_provider: provider,
            calendar_connected: true,
            calendar_email: credentials.email,
            calendar_credentials: {
                access_token: credentials.access_token,
                refresh_token: credentials.refresh_token,
                expires_at: credentials.expires_at,
            },
        })
            .eq('id', userId);
        if (error)
            throw error;
    }
    catch (error) {
        console.error('Error updating calendar credentials:', error);
        throw error;
    }
}
// Helper function to disconnect calendar
async function disconnectCalendar(userId) {
    try {
        const { error } = await exports.supabase
            .from('profiles')
            .update({
            calendar_provider: null,
            calendar_connected: false,
            calendar_email: null,
            calendar_credentials: null,
        })
            .eq('id', userId);
        if (error)
            throw error;
    }
    catch (error) {
        console.error('Error disconnecting calendar:', error);
        throw error;
    }
}
