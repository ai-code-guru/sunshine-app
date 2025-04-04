import React from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface CalendarIntegrationProps {
  connectedCalendars: {
    google?: {
      email: string;
      connected: boolean;
    };
    microsoft?: {
      email: string;
      connected: boolean;
    };
  };
  onConnectGoogle: () => Promise<void>;
  onDisconnectGoogle: () => Promise<void>;
  onConnectMicrosoft: () => Promise<void>;
  onDisconnectMicrosoft: () => Promise<void>;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  connectedCalendars,
  onConnectGoogle,
  onDisconnectGoogle,
  onConnectMicrosoft,
  onDisconnectMicrosoft,
}) => {
  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Calendar Integrations</h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect your calendar to automatically sync events and manage your schedule.
        </p>
      </div>

      <div className="space-y-6">
        {/* Google Calendar */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Google Calendar</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {connectedCalendars.google?.connected
                    ? `Connected as ${connectedCalendars.google.email}`
                    : 'Connect your Google Calendar to sync events'}
                </p>
              </div>
            </div>
            <div>
              {connectedCalendars.google?.connected ? (
                <button
                  onClick={onDisconnectGoogle}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={onConnectGoogle}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sunshine-500 hover:bg-sunshine-600"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Microsoft Calendar */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8" viewBox="0 0 24 24">
                  <path
                    fill="#00A4EF"
                    d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Microsoft Calendar</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {connectedCalendars.microsoft?.connected
                    ? `Connected as ${connectedCalendars.microsoft.email}`
                    : 'Connect your Microsoft 365/Outlook Calendar'}
                </p>
              </div>
            </div>
            <div>
              {connectedCalendars.microsoft?.connected ? (
                <button
                  onClick={onDisconnectMicrosoft}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={onConnectMicrosoft}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sunshine-500 hover:bg-sunshine-600"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Currently, you can only have one calendar connected at a time. Connecting a different
                  calendar will automatically disconnect the current one.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarIntegration; 