import { ipcRenderer } from 'electron';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

export interface AvailabilitySlot {
  id: string;
  user_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  recurrence?: string;
  buffer_before?: number;
  buffer_after?: number;
  created_at: string;
  updated_at: string;
}

export interface LunchBreak {
  id: string;
  user_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  attendees: Array<{ name: string; avatar: string }>;
  status: "upcoming" | "pending" | "recurring" | "past" | "cancelled";
  source: "google" | "microsoft" | "database";
  start?: Date;
  end?: Date;
}

export interface BookingLink {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description?: string;
  duration: number; // minutes
  availabilitySlots: string[]; // Array of availability slot IDs
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarSyncOptions {
  timeMin?: string;
  timeMax?: string;
  maxResults?: number;
}

export interface Conflict {
  slot: AvailabilitySlot;
  event: CalendarEvent;
}

export interface SyncState {
  lastSynced: string | null;
  hasValidToken: boolean;
  error: string | null;
}

class CalendarSyncService {
  private static instance: CalendarSyncService;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private cachedEvents: CalendarEvent[] = [];

  private constructor() {
    // Load cached events from localStorage
    const cachedEventsStr = localStorage.getItem('cachedEvents');
    if (cachedEventsStr) {
      this.cachedEvents = JSON.parse(cachedEventsStr);
    }
  }

  public static getInstance(): CalendarSyncService {
    if (!CalendarSyncService.instance) {
      CalendarSyncService.instance = new CalendarSyncService();
    }
    return CalendarSyncService.instance;
  }

  async getSyncState(): Promise<SyncState> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('User not authenticated');
      }

      const { data: syncToken, error } = await supabase
        .from('calendar_sync_tokens')
        .select('sync_token, updated_at')
        .eq('user_id', user.user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }

      const { data: session } = await supabase.auth.getSession();
      const hasValidToken = !!session?.session?.provider_token;

      return {
        lastSynced: syncToken?.updated_at || null,
        hasValidToken,
        error: null
      };
    } catch (error) {
      console.error('Error getting sync state:', error);
      return {
        lastSynced: null,
        hasValidToken: false,
        error: 'Failed to get sync state'
      };
    }
  }

  async syncCalendar(): Promise<SyncState> {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session) {
        throw new Error('No active session');
      }

      const { provider_token } = session.session;
      if (!provider_token) {
        throw new Error('No valid provider token');
      }

      // Fetch events based on provider
      const provider = session.session.user.app_metadata.provider;
      let events: CalendarEvent[] = [];
      
      if (provider === 'google') {
        events = await this.fetchGoogleCalendarEvents(session.session);
      } else if (provider === 'azure') {
        events = await this.fetchMicrosoftCalendarEvents(session.session);
      }

      // Cache events in localStorage
      this.cachedEvents = events;
      localStorage.setItem('cachedEvents', JSON.stringify(events));

      // Update sync token in Supabase
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('calendar_sync_tokens')
        .upsert({ 
          user_id: session.session.user.id,
          sync_token: now,
          updated_at: now
        });

      if (error) throw error;

      return {
        lastSynced: now,
        hasValidToken: true,
        error: null
      };
    } catch (error: any) {
      console.error('Error syncing calendar:', error);
      return {
        lastSynced: null,
        hasValidToken: false,
        error: error.message || 'Failed to sync calendar'
      };
    }
  }

  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    // Filter cached events based on date range
    return this.cachedEvents.filter(event => {
      const eventStart = event.start || new Date(`${event.date}T${event.start_time}`);
      const eventEnd = event.end || new Date(`${event.date}T${event.end_time}`);
      return eventStart >= startDate && eventEnd <= endDate;
    });
  }

  async requestCalendarAccess(): Promise<boolean> {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error getting session:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        // If no session, try to sign in with the default provider
        const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: 'http://localhost:5173/auth/callback',
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });

        if (signInError) {
          console.error('Error signing in:', signInError);
          throw new Error('Failed to sign in');
        }

        if (!signInData?.url) {
          throw new Error('No sign-in URL received');
        }

        // Open the sign-in URL in Electron
        if (window.electron) {
          window.electron.openExternal(signInData.url);
        } else {
          window.open(signInData.url, '_blank');
        }
        return true;
      }

      // If we have a session, proceed with calendar access
      const provider = session.user.app_metadata.provider;
      const functionName = provider === 'google' ? 'fetch-calendar-events' : 'fetch-microsoft-calendar';

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { action: 'request_access' }
      });

      if (error) throw error;

      // The function should return a URL for OAuth consent
      if (data?.authUrl) {
        // Open the auth URL in Electron
        if (window.electron) {
          window.electron.openExternal(data.authUrl);
        } else {
          window.open(data.authUrl, '_blank');
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error requesting calendar access:', error);
      throw error;
    }
  }

  public async fetchAvailabilitySlots(): Promise<AvailabilitySlot[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', user.user.id);
      
    if (error) {
      console.error('Error fetching availability slots:', error);
      throw error;
    }
    
    return data || [];
  }

  public async fetchLunchBreaks(): Promise<LunchBreak[]> {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('lunch_breaks')
      .select('*')
      .eq('user_id', user.user.id);
      
    if (error) {
      console.error('Error fetching lunch breaks:', error);
      throw error;
    }
    
    return data || [];
  }

  public async saveAvailability(day: string, slots: { start: string; end: string }[]): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // First delete existing slots for this day
      const { error: deleteError } = await supabase
        .from("availability")
        .delete()
        .eq("user_id", user.user.id)
        .eq("day_of_week", day);
        
      if (deleteError) throw deleteError;
      
      // Then insert new slots if there are any
      if (slots.length > 0) {
        const newSlots = slots.map(slot => ({
          user_id: user.user.id,
          day_of_week: day,
          start_time: slot.start,
          end_time: slot.end
        }));
        
        const { error: insertError } = await supabase
          .from("availability")
          .insert(newSlots);
          
        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      throw error;
    }
  }

  public async saveLunchBreak(day: string, start: string, end: string): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      throw new Error('User not authenticated');
    }
    
    try {
      // Get existing lunch break for this day
      const { data: existingBreaks, error: fetchError } = await supabase
        .from("lunch_breaks")
        .select("*")
        .eq("user_id", user.user.id)
        .eq("day_of_week", day);
        
      if (fetchError) throw fetchError;
      
      if (existingBreaks && existingBreaks.length > 0) {
        // Update existing lunch break
        const { error } = await supabase
          .from("lunch_breaks")
          .update({
            start_time: start,
            end_time: end
          })
          .eq("id", existingBreaks[0].id);
          
        if (error) throw error;
      } else {
        // Insert new lunch break
        const { error } = await supabase
          .from("lunch_breaks")
          .insert({
            user_id: user.user.id,
            day_of_week: day,
            start_time: start,
            end_time: end
          });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error saving lunch break:", error);
      throw error;
    }
  }

  public async fetchGoogleCalendarEvents(session: Session, options: CalendarSyncOptions = {}): Promise<CalendarEvent[]> {
    if (!session?.provider_token) {
      throw new Error("No valid Google token found");
    }

    try {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(now.getMonth() + 1);
      
      const params = new URLSearchParams({
        timeMin: options.timeMin || now.toISOString(),
        timeMax: options.timeMax || oneMonthLater.toISOString(),
        maxResults: options.maxResults?.toString() || "100"
      });

      const response = await fetch(
        `https://koyimcgjaoqxvwyscwaz.supabase.co/functions/v1/fetch-calendar-events?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.provider_token}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch calendar events: ${errorText}`);
      }

      const data = await response.json();
      return data.events as CalendarEvent[];
    } catch (error) {
      console.error("Error fetching Google Calendar events:", error);
      throw error;
    }
  }

  public async fetchMicrosoftCalendarEvents(session: Session, options: CalendarSyncOptions = {}): Promise<CalendarEvent[]> {
    if (!session?.provider_token) {
      throw new Error("No valid Microsoft token found");
    }

    try {
      const now = new Date();
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(now.getMonth() + 1);
      
      const params = new URLSearchParams({
        timeMin: options.timeMin || now.toISOString(),
        timeMax: options.timeMax || oneMonthLater.toISOString(),
        maxResults: options.maxResults?.toString() || "100"
      });

      const response = await fetch(
        `https://koyimcgjaoqxvwyscwaz.supabase.co/functions/v1/fetch-microsoft-calendar?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.provider_token}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch calendar events: ${errorText}`);
      }

      const data = await response.json();
      return data.events as CalendarEvent[];
    } catch (error) {
      console.error("Error fetching Microsoft Calendar events:", error);
      throw error;
    }
  }

  public checkForConflicts(
    availabilitySlots: AvailabilitySlot[],
    calendarEvents: CalendarEvent[]
  ): Conflict[] {
    const conflicts: Conflict[] = [];
    
    // Map weekday numbers to day names
    const dayMap: Record<number, string> = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    };
    
    // Process each calendar event
    calendarEvents.forEach(event => {
      // Skip if not upcoming
      if (event.status !== 'upcoming') return;
      
      // Create Date objects if they don't exist
      const eventStart = event.start || new Date(`${event.date}T${event.start_time}`);
      const eventEnd = event.end || new Date(`${event.date}T${event.end_time}`);
      
      // Get the day of week
      const dayOfWeek = dayMap[eventStart.getDay()];
      
      // Filter availability slots for this day
      const slotsForDay = availabilitySlots.filter(
        slot => slot.day_of_week === dayOfWeek
      );
      
      // Check each slot for conflicts
      slotsForDay.forEach(slot => {
        // Parse slot times
        const [slotStartHour, slotStartMinute] = slot.start_time.split(':').map(num => parseInt(num));
        const [slotEndHour, slotEndMinute] = slot.end_time.split(':').map(num => parseInt(num));
        
        // Create slot start/end times on same day as event
        const slotStart = new Date(eventStart);
        slotStart.setHours(slotStartHour, slotStartMinute, 0, 0);
        
        const slotEnd = new Date(eventStart);
        slotEnd.setHours(slotEndHour, slotEndMinute, 0, 0);
        
        // Check for overlap
        if (
          (eventStart >= slotStart && eventStart < slotEnd) || // Event starts during slot
          (eventEnd > slotStart && eventEnd <= slotEnd) || // Event ends during slot
          (eventStart <= slotStart && eventEnd >= slotEnd) // Event completely contains slot
        ) {
          conflicts.push({ slot, event });
        }
      });
    });
    
    return conflicts;
  }

  public startSync(): void {
    if (this.syncInterval) {
      return;
    }

    this.syncInterval = setInterval(async () => {
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.provider_token) {
          return;
        }

        await this.syncCalendar();
      } catch (error) {
        console.error('Error during calendar sync:', error);
      }
    }, this.SYNC_INTERVAL);
  }

  public stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Create a new availability slot
  public async createAvailabilitySlot(slot: Omit<AvailabilitySlot, 'id' | 'created_at' | 'updated_at'>): Promise<AvailabilitySlot> {
    const { data, error } = await supabase
      .from('availability_slots')
      .insert({
        user_id: slot.user_id,
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time,
        recurrence: slot.recurrence,
        buffer_before: slot.buffer_before,
        buffer_after: slot.buffer_after
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create availability slot: ${error.message}`);
    }

    return data;
  }

  // Get availability slots for a user
  public async getAvailabilitySlots(userId: string): Promise<AvailabilitySlot[]> {
    const { data, error } = await supabase
      .from('availability_slots')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to fetch availability slots: ${error.message}`);
    }

    return data || [];
  }

  // Create a new booking link
  public async createBookingLink(link: Omit<BookingLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookingLink> {
    try {
      const { data, error } = await supabase
        .from('booking_links')
        .insert([{
          user_id: link.userId,
          title: link.title,
          slug: link.slug.toLowerCase().replace(/\s+/g, '-'),
          description: link.description,
          duration: link.duration,
          availability_slots: link.availabilitySlots,
          timezone: link.timezone,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        userId: data.user_id,
        availabilitySlots: data.availability_slots,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Failed to create booking link:', error);
      throw error;
    }
  }

  // Get booking links for a user
  public async getBookingLinks(userId: string): Promise<BookingLink[]> {
    try {
      const { data, error } = await supabase
        .from('booking_links')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data.map(link => ({
        id: link.id,
        userId: link.user_id,
        title: link.title,
        slug: link.slug,
        description: link.description,
        duration: link.duration,
        availabilitySlots: link.availability_slots,
        timezone: link.timezone,
        createdAt: new Date(link.created_at),
        updatedAt: new Date(link.updated_at),
      }));
    } catch (error) {
      console.error('Failed to get booking links:', error);
      throw error;
    }
  }

  // Update a booking link
  public async updateBookingLink(id: string, updates: Partial<Omit<BookingLink, 'id' | 'createdAt' | 'updatedAt'>>): Promise<BookingLink> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) updateData.title = updates.title;
      if (updates.slug) updateData.slug = updates.slug.toLowerCase().replace(/\s+/g, '-');
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.duration) updateData.duration = updates.duration;
      if (updates.availabilitySlots) updateData.availability_slots = updates.availabilitySlots;
      if (updates.timezone) updateData.timezone = updates.timezone;

      const { data, error } = await supabase
        .from('booking_links')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return {
        ...data,
        userId: data.user_id,
        availabilitySlots: data.availability_slots,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error('Failed to update booking link:', error);
      throw error;
    }
  }

  // Delete an availability slot
  public async deleteAvailabilitySlot(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete availability slot:', error);
      throw error;
    }
  }

  // Delete a booking link
  public async deleteBookingLink(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('booking_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete booking link:', error);
      throw error;
    }
  }
}

// Export the singleton instance
const calendarSyncService = CalendarSyncService.getInstance();
export default calendarSyncService; 