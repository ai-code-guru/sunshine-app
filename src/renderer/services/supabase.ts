import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://koyimcgjaoqxvwyscwaz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveWltY2dqYW9xeHZ3eXNjd2F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Nzk0OTAsImV4cCI6MjA1ODA1NTQ5MH0.XS6bfk65fNVSDmKD2k6CzbonON7DTYN9cyVn-S5uwNI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_id?: string;
  calendar_provider?: 'google' | 'microsoft';
  calendar_connected: boolean;
  calendar_email?: string;
  calendar_credentials?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface Company {
  id: string;
  name: string;
  username: string;
  logo_url?: string;
  brand_color?: string;
  created_at: string;
}

// Helper function to get the current user's profile
export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

// Helper function to update calendar credentials
export async function updateCalendarCredentials(
  userId: string,
  provider: 'google' | 'microsoft',
  credentials: {
    email: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
) {
  try {
    const { error } = await supabase
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

    if (error) throw error;
  } catch (error) {
    console.error('Error updating calendar credentials:', error);
    throw error;
  }
}

// Helper function to disconnect calendar
export async function disconnectCalendar(userId: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        calendar_provider: null,
        calendar_connected: false,
        calendar_email: null,
        calendar_credentials: null,
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error disconnecting calendar:', error);
    throw error;
  }
} 