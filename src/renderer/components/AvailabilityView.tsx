import React, { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import calendarSyncService from '../services/CalendarSyncService';

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  isAvailable: boolean;
  workingHours: TimeSlot[];
  lunchBreak: {
    startTime: string;
    endTime: string;
  };
}

interface SyncState {
  lastSynced: string | null;
  hasValidToken: boolean;
  error: string | null;
}

interface Notification {
  type: 'success' | 'error';
  message: string;
}

const AvailabilityView: React.FC = () => {
  const [syncState, setSyncState] = useState<SyncState>({
    lastSynced: null,
    hasValidToken: true,
    error: null
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const [schedule, setSchedule] = useState<{ [key: string]: DaySchedule }>({
    Monday: {
      isAvailable: true,
      workingHours: [{ startTime: '08:00', endTime: '17:00' }],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    },
    Tuesday: {
      isAvailable: true,
      workingHours: [{ startTime: '08:00', endTime: '17:00' }],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    },
    Wednesday: {
      isAvailable: true,
      workingHours: [{ startTime: '08:00', endTime: '17:00' }],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    },
    Thursday: {
      isAvailable: true,
      workingHours: [{ startTime: '08:00', endTime: '17:00' }],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    },
    Friday: {
      isAvailable: true,
      workingHours: [{ startTime: '08:00', endTime: '17:00' }],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    },
    Saturday: {
      isAvailable: false,
      workingHours: [],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    },
    Sunday: {
      isAvailable: false,
      workingHours: [],
      lunchBreak: { startTime: '12:00', endTime: '13:00' }
    }
  });

  useEffect(() => {
    // Fetch initial sync state
    const fetchSyncState = async () => {
      const state = await calendarSyncService.getSyncState();
      setSyncState(state);
    };
    fetchSyncState();
  }, []);

  const handleSyncCalendar = async () => {
    try {
      setSyncState(prev => ({ ...prev, error: null }));
      const result = await calendarSyncService.syncCalendar();
      
      if (result.error) {
        if (result.error.includes('No active session')) {
          // If no session, try to request calendar access
          const success = await calendarSyncService.requestCalendarAccess();
          if (success) {
            setNotification({
              type: 'success',
              message: 'Please complete the authentication process in the opened window.'
            });
          } else {
            setNotification({
              type: 'error',
              message: 'Failed to start authentication process.'
            });
          }
        } else {
          setNotification({
            type: 'error',
            message: result.error
          });
        }
      } else {
        setSyncState(result);
        setNotification({
          type: 'success',
          message: 'Calendar synced successfully!'
        });
      }
    } catch (error: any) {
      console.error('Error syncing calendar:', error);
      setSyncState(prev => ({ ...prev, error: error.message }));
      setNotification({
        type: 'error',
        message: error.message || 'Failed to sync calendar'
      });
    }
  };

  const handleRequestAccess = async () => {
    const success = await calendarSyncService.requestCalendarAccess();
    if (!success) {
      setSyncState(prev => ({
        ...prev,
        error: 'Failed to request calendar access'
      }));
    }
  };

  const formatLastSynced = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleToggleAvailability = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        workingHours: !prev[day].isAvailable ? [{ startTime: '08:00', endTime: '17:00' }] : []
      }
    }));
  };

  const handleTimeChange = (
    day: string,
    slotIndex: number,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        workingHours: prev[day].workingHours.map((slot, index) =>
          index === slotIndex ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleLunchBreakChange = (
    day: string,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        lunchBreak: {
          ...prev[day].lunchBreak,
          [field]: value
        }
      }
    }));
  };

  const addTimeSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        workingHours: [
          ...prev[day].workingHours,
          { startTime: '09:00', endTime: '17:00' }
        ]
      }
    }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Your Availability</h1>
        <p className="text-gray-600">Set your available hours and sync with your calendar to avoid booking conflicts.</p>
      </div>

      {/* Calendar Sync Section */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Calendar Sync</h2>
            <p className="text-gray-600 mt-1">Sync with your calendar to avoid scheduling conflicts with existing events.</p>
            <p className="text-sm text-gray-500 mt-2">
              Last synced: {formatLastSynced(syncState.lastSynced)}
            </p>
          </div>
          <button
            onClick={handleSyncCalendar}
            disabled={isSyncing || !syncState.hasValidToken}
            className={`inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg ${
              isSyncing || !syncState.hasValidToken ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
          >
            <ArrowPathIcon className={`w-5 h-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Calendar'}
          </button>
        </div>
        {!syncState.hasValidToken && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex justify-between items-center">
            <span>Missing calendar access token. Please sign in again.</span>
            <button
              onClick={handleRequestAccess}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Grant Access
            </button>
          </div>
        )}
        {syncState.error && syncState.hasValidToken && (
          <div className="mt-4 p-4 bg-[#FFDE21]/10 text-[#FFDE21] rounded-lg">
            {syncState.error}
          </div>
        )}
      </div>

      {/* Availability Table */}
      <div className="bg-white rounded-lg border">
        <div className="grid grid-cols-[150px_100px_1fr_200px_100px] gap-4 p-4 border-b bg-gray-50">
          <div className="font-medium text-gray-700">Day</div>
          <div className="font-medium text-gray-700">Available</div>
          <div className="font-medium text-gray-700">Working Hours</div>
          <div className="font-medium text-gray-700">Lunch Break</div>
          <div className="font-medium text-gray-700">Actions</div>
        </div>

        {Object.entries(schedule).map(([day, daySchedule]) => (
          <div key={day} className="grid grid-cols-[150px_100px_1fr_200px_100px] gap-4 p-4 border-b items-center">
            <div className="font-medium text-gray-900">{day}</div>
            <div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={daySchedule.isAvailable}
                  onChange={() => handleToggleAvailability(day)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sunshine-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sunshine-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {daySchedule.isAvailable ? 'Yes' : 'No'}
                </span>
              </label>
            </div>
            <div>
              {daySchedule.isAvailable ? (
                <div className="space-y-2">
                  {daySchedule.workingHours.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <select
                        value={slot.startTime}
                        onChange={(e) => handleTimeChange(day, index, 'startTime', e.target.value)}
                        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-sunshine-500 focus:ring-sunshine-500 sm:text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => 
                          `${String(i).padStart(2, '0')}:00`
                        ).map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <span>to</span>
                      <select
                        value={slot.endTime}
                        onChange={(e) => handleTimeChange(day, index, 'endTime', e.target.value)}
                        className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-sunshine-500 focus:ring-sunshine-500 sm:text-sm"
                      >
                        {Array.from({ length: 24 }, (_, i) => 
                          `${String(i).padStart(2, '0')}:00`
                        ).map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <button
                    onClick={() => addTimeSlot(day)}
                    className="inline-flex items-center text-sm text-sunshine-600 hover:text-sunshine-700"
                  >
                    <span className="text-lg mr-1">+</span> Add Time Slot
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 italic">Not available</span>
              )}
            </div>
            <div>
              {daySchedule.isAvailable ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={daySchedule.lunchBreak.startTime}
                    onChange={(e) => handleLunchBreakChange(day, 'startTime', e.target.value)}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-sunshine-500 focus:ring-sunshine-500 sm:text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => 
                      `${String(i).padStart(2, '0')}:00`
                    ).map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <span>to</span>
                  <select
                    value={daySchedule.lunchBreak.endTime}
                    onChange={(e) => handleLunchBreakChange(day, 'endTime', e.target.value)}
                    className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-sunshine-500 focus:ring-sunshine-500 sm:text-sm"
                  >
                    {Array.from({ length: 24 }, (_, i) => 
                      `${String(i).padStart(2, '0')}:00`
                    ).map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <span className="text-gray-500 italic">N/A</span>
              )}
            </div>
            <div>
              <button
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        ))}
        <div className="p-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Save All Days
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityView; 