"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const supabase_1 = require("./supabase");
class CalendarSyncService {
    constructor() {
        this.syncInterval = null;
        this.SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
        this.lastSync = null;
        // Initialize last sync from localStorage
        const lastSyncStr = localStorage.getItem('lastSync');
        if (lastSyncStr) {
            this.lastSync = new Date(lastSyncStr);
        }
    }
    static getInstance() {
        if (!CalendarSyncService.instance) {
            CalendarSyncService.instance = new CalendarSyncService();
        }
        return CalendarSyncService.instance;
    }
    async fetchAvailabilitySlots() {
        const { data: user } = await supabase_1.supabase.auth.getUser();
        if (!user?.user) {
            throw new Error('User not authenticated');
        }
        const { data, error } = await supabase_1.supabase
            .from('availability')
            .select('*')
            .eq('user_id', user.user.id);
        if (error) {
            console.error('Error fetching availability slots:', error);
            throw error;
        }
        return data || [];
    }
    async fetchLunchBreaks() {
        const { data: user } = await supabase_1.supabase.auth.getUser();
        if (!user?.user) {
            throw new Error('User not authenticated');
        }
        const { data, error } = await supabase_1.supabase
            .from('lunch_breaks')
            .select('*')
            .eq('user_id', user.user.id);
        if (error) {
            console.error('Error fetching lunch breaks:', error);
            throw error;
        }
        return data || [];
    }
    async saveAvailability(day, slots) {
        const { data: user } = await supabase_1.supabase.auth.getUser();
        if (!user?.user) {
            throw new Error('User not authenticated');
        }
        try {
            // First delete existing slots for this day
            const { error: deleteError } = await supabase_1.supabase
                .from("availability")
                .delete()
                .eq("user_id", user.user.id)
                .eq("day_of_week", day);
            if (deleteError)
                throw deleteError;
            // Then insert new slots if there are any
            if (slots.length > 0) {
                const newSlots = slots.map(slot => ({
                    user_id: user.user.id,
                    day_of_week: day,
                    start_time: slot.start,
                    end_time: slot.end
                }));
                const { error: insertError } = await supabase_1.supabase
                    .from("availability")
                    .insert(newSlots);
                if (insertError)
                    throw insertError;
            }
        }
        catch (error) {
            console.error("Error saving availability:", error);
            throw error;
        }
    }
    async saveLunchBreak(day, start, end) {
        const { data: user } = await supabase_1.supabase.auth.getUser();
        if (!user?.user) {
            throw new Error('User not authenticated');
        }
        try {
            // Get existing lunch break for this day
            const { data: existingBreaks, error: fetchError } = await supabase_1.supabase
                .from("lunch_breaks")
                .select("*")
                .eq("user_id", user.user.id)
                .eq("day_of_week", day);
            if (fetchError)
                throw fetchError;
            if (existingBreaks && existingBreaks.length > 0) {
                // Update existing lunch break
                const { error } = await supabase_1.supabase
                    .from("lunch_breaks")
                    .update({
                    start_time: start,
                    end_time: end
                })
                    .eq("id", existingBreaks[0].id);
                if (error)
                    throw error;
            }
            else {
                // Insert new lunch break
                const { error } = await supabase_1.supabase
                    .from("lunch_breaks")
                    .insert({
                    user_id: user.user.id,
                    day_of_week: day,
                    start_time: start,
                    end_time: end
                });
                if (error)
                    throw error;
            }
        }
        catch (error) {
            console.error("Error saving lunch break:", error);
            throw error;
        }
    }
    async fetchGoogleCalendarEvents(session, options = {}) {
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
            const response = await fetch(`https://koyimcgjaoqxvwyscwaz.supabase.co/functions/v1/fetch-calendar-events?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.provider_token}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch calendar events: ${errorText}`);
            }
            const data = await response.json();
            return data.events;
        }
        catch (error) {
            console.error("Error fetching Google Calendar events:", error);
            throw error;
        }
    }
    async fetchMicrosoftCalendarEvents(session, options = {}) {
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
            const response = await fetch(`https://koyimcgjaoqxvwyscwaz.supabase.co/functions/v1/fetch-microsoft-calendar?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.provider_token}`
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch calendar events: ${errorText}`);
            }
            const data = await response.json();
            return data.events;
        }
        catch (error) {
            console.error("Error fetching Microsoft Calendar events:", error);
            throw error;
        }
    }
    checkForConflicts(availabilitySlots, calendarEvents) {
        const conflicts = [];
        // Map weekday numbers to day names
        const dayMap = {
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
            if (event.status !== 'upcoming')
                return;
            // Create Date objects if they don't exist
            const eventStart = event.start || new Date(`${event.date}T${event.start_time}`);
            const eventEnd = event.end || new Date(`${event.date}T${event.end_time}`);
            // Get the day of week
            const dayOfWeek = dayMap[eventStart.getDay()];
            // Filter availability slots for this day
            const slotsForDay = availabilitySlots.filter(slot => slot.day_of_week === dayOfWeek);
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
                if ((eventStart >= slotStart && eventStart < slotEnd) || // Event starts during slot
                    (eventEnd > slotStart && eventEnd <= slotEnd) || // Event ends during slot
                    (eventStart <= slotStart && eventEnd >= slotEnd) // Event completely contains slot
                ) {
                    conflicts.push({ slot, event });
                }
            });
        });
        return conflicts;
    }
    async updateLastSync() {
        // Store the last sync time in localStorage
        this.lastSync = new Date();
        localStorage.setItem('lastSync', this.lastSync.toISOString());
        // Store in Supabase
        const { data: user } = await supabase_1.supabase.auth.getUser();
        if (user?.user) {
            try {
                const { error } = await supabase_1.supabase
                    .from('calendar_sync_tokens')
                    .upsert({
                    user_id: user.user.id,
                    sync_token: this.lastSync.toISOString(),
                    updated_at: this.lastSync.toISOString()
                }, { onConflict: 'user_id' });
                if (error) {
                    console.error('Error updating last sync:', error);
                }
            }
            catch (error) {
                console.error('Error updating last sync:', error);
            }
        }
    }
    getLastSync() {
        return this.lastSync;
    }
    startSync() {
        if (this.syncInterval) {
            return;
        }
        this.syncInterval = setInterval(async () => {
            try {
                const { data: session } = await supabase_1.supabase.auth.getSession();
                if (!session?.session) {
                    return;
                }
                const { provider_token } = session.session;
                if (!provider_token) {
                    return;
                }
                let events = [];
                const provider = session.session.user.app_metadata.provider;
                if (provider === 'google') {
                    events = await this.fetchGoogleCalendarEvents(session.session);
                }
                else if (provider === 'azure') {
                    events = await this.fetchMicrosoftCalendarEvents(session.session);
                }
                const slots = await this.fetchAvailabilitySlots();
                const conflicts = this.checkForConflicts(slots, events);
                // Emit conflicts to the renderer process
                if (conflicts.length > 0) {
                    electron_1.ipcRenderer.send('calendar-conflicts', conflicts);
                }
                await this.updateLastSync();
            }
            catch (error) {
                console.error('Error during calendar sync:', error);
            }
        }, this.SYNC_INTERVAL);
    }
    stopSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    // Create a new availability slot
    async createAvailabilitySlot(slot) {
        const { data, error } = await supabase_1.supabase
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
    async getAvailabilitySlots(userId) {
        const { data, error } = await supabase_1.supabase
            .from('availability_slots')
            .select('*')
            .eq('user_id', userId);
        if (error) {
            throw new Error(`Failed to fetch availability slots: ${error.message}`);
        }
        return data || [];
    }
    // Create a new booking link
    async createBookingLink(link) {
        try {
            const { data, error } = await supabase_1.supabase
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
            if (error)
                throw error;
            return {
                ...data,
                userId: data.user_id,
                availabilitySlots: data.availability_slots,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };
        }
        catch (error) {
            console.error('Failed to create booking link:', error);
            throw error;
        }
    }
    // Get booking links for a user
    async getBookingLinks(userId) {
        try {
            const { data, error } = await supabase_1.supabase
                .from('booking_links')
                .select('*')
                .eq('user_id', userId);
            if (error)
                throw error;
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
        }
        catch (error) {
            console.error('Failed to get booking links:', error);
            throw error;
        }
    }
    // Update a booking link
    async updateBookingLink(id, updates) {
        try {
            const updateData = {
                updated_at: new Date().toISOString(),
            };
            if (updates.title)
                updateData.title = updates.title;
            if (updates.slug)
                updateData.slug = updates.slug.toLowerCase().replace(/\s+/g, '-');
            if (updates.description !== undefined)
                updateData.description = updates.description;
            if (updates.duration)
                updateData.duration = updates.duration;
            if (updates.availabilitySlots)
                updateData.availability_slots = updates.availabilitySlots;
            if (updates.timezone)
                updateData.timezone = updates.timezone;
            const { data, error } = await supabase_1.supabase
                .from('booking_links')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();
            if (error)
                throw error;
            return {
                ...data,
                userId: data.user_id,
                availabilitySlots: data.availability_slots,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };
        }
        catch (error) {
            console.error('Failed to update booking link:', error);
            throw error;
        }
    }
    // Delete an availability slot
    async deleteAvailabilitySlot(id) {
        try {
            const { error } = await supabase_1.supabase
                .from('availability_slots')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Failed to delete availability slot:', error);
            throw error;
        }
    }
    // Delete a booking link
    async deleteBookingLink(id) {
        try {
            const { error } = await supabase_1.supabase
                .from('booking_links')
                .delete()
                .eq('id', id);
            if (error)
                throw error;
        }
        catch (error) {
            console.error('Failed to delete booking link:', error);
            throw error;
        }
    }
}
exports.default = CalendarSyncService;
