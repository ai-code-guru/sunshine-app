import React, { useState } from 'react';
import Layout from './components/Layout';
import CalendarView from './components/CalendarView';
import NoteTakerView from './components/NoteTakerView';
import AvailabilityView from './components/AvailabilityView';
import BookingLinksView from './components/BookingLinksView';
import MeetingPrompt from './components/MeetingPrompt';

type View = 'calendar' | 'availability' | 'chat' | 'notes' | 'templates' | 'team' | 'settings' | 'bookings';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  participants: string[];
  type: 'upcoming' | 'pending' | 'recurring' | 'past' | 'cancelled';
  labels: string[];
  executiveSummary?: string;
  decisions?: string[];
  tasks?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
}

// Add interface for window to include electron API
declare global {
  interface Window {
    electron: {
      startMeeting: () => Promise<void>;
      stopMeeting: () => Promise<void>;
      onMeetingDetected: (callback: () => void) => () => void;
      onMeetingEnded: (callback: () => void) => () => void;
      onRecordingSaved: (callback: (data: { filePath: string; timestamp: string; size: number }) => void) => () => void;
      onRecordingSaveFailed: (callback: (error: Error) => void) => () => void;
      openExternal: (url: string) => Promise<void>;
      closeWindow: () => void;
    };
  }
}

const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: 'Sales chat',
    date: new Date(),
    startTime: '08:26',
    endTime: '09:04',
    participants: ['Stefano Verkooij', 'Simon Werner-Zankl'],
    type: 'past',
    labels: ['Other'],
    executiveSummary: 'Simon Werner-Zankl and team identified significant challenges in the Nordic market, including recent losses to competitors like Team Tailor. The team agreed to develop a new "attack plan" for Nordic sales, focusing on improving user experience and product demonstration techniques.',
    decisions: [
      'Develop new "attack plan" for Nordic sales',
      'Create specialized demo account',
      'Implement guided demos with recruiters'
    ],
    tasks: [
      {
        id: '1',
        text: 'Put \'how to win more deals\' on the agenda for the upcoming meeting',
        completed: false
      },
      {
        id: '2',
        text: 'Start reaching out to potential clients in the Netherlands',
        completed: false
      }
    ]
  },
  {
    id: '2',
    title: 'Sprint review 20250325',
    date: new Date(Date.now() - 86400000),
    startTime: '10:00',
    endTime: '11:00',
    participants: ['Tommy Karlsson', 'Simon Werner-Zankl'],
    type: 'past',
    labels: ['Other']
  }
];

const App: React.FC = () => {
  console.log('App component rendering...');

  const [currentView, setCurrentView] = useState<View>('calendar');
  const [showMeetingPrompt, setShowMeetingPrompt] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Set up meeting detection listeners
  React.useEffect(() => {
    console.log('Setting up event listeners...');
    
    // Listen for meeting detection
    const cleanupMeetingDetected = window.electron?.onMeetingDetected(() => {
      console.log('Meeting detected');
      setShowMeetingPrompt(true);
    });

    // Listen for meeting end
    const cleanupMeetingEnded = window.electron?.onMeetingEnded(() => {
      console.log('Meeting ended');
      setIsRecording(false);
      setShowMeetingPrompt(false);
    });

    // Listen for recording saved
    const cleanupRecordingSaved = window.electron?.onRecordingSaved((data) => {
      console.log('Recording saved:', data);
      setNotification({
        type: 'success',
        message: `Recording saved: ${data.filePath}`
      });
      setTimeout(() => setNotification(null), 5000);
    });

    // Listen for recording save failed
    const cleanupRecordingSaveFailed = window.electron?.onRecordingSaveFailed((error) => {
      console.error('Recording save failed:', error);
      setNotification({
        type: 'error',
        message: `Failed to save recording: ${error.message}`
      });
      setTimeout(() => setNotification(null), 5000);
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up event listeners...');
      cleanupMeetingDetected?.();
      cleanupMeetingEnded?.();
      cleanupRecordingSaved?.();
      cleanupRecordingSaveFailed?.();
    };
  }, []);

  const handleStartMeeting = async () => {
    try {
      await window.electron.startMeeting();
      setIsRecording(true);
      setShowMeetingPrompt(false);
    } catch (error) {
      console.error('Failed to start meeting:', error);
      setNotification({
        type: 'error',
        message: 'Failed to start recording'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleStopMeeting = async () => {
    try {
      await window.electron.stopMeeting();
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to stop meeting:', error);
      setNotification({
        type: 'error',
        message: 'Failed to stop recording'
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'notes':
        return <NoteTakerView />;
      case 'bookings':
        return <BookingLinksView />;
      case 'availability':
        return <AvailabilityView />;
      case 'chat':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
            <p className="mt-4 text-gray-600">Chat feature coming soon...</p>
          </div>
        );
      case 'templates':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            <p className="mt-4 text-gray-600">Manage your note templates here.</p>
          </div>
        );
      case 'team':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="mt-4 text-gray-600">Manage your team settings here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-4 text-gray-600">Configure your app settings here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-gray-50">
      <Layout onNavigate={setCurrentView} currentView={currentView}>
        {renderContent()}
      </Layout>
      {showMeetingPrompt && (
        <MeetingPrompt
          onClose={() => setShowMeetingPrompt(false)}
          onStartMeeting={handleStartMeeting}
        />
      )}
      {isRecording && (
        <div className="fixed bottom-4 right-4 bg-black text-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
              <span>Recording</span>
            </div>
            <button
              onClick={handleStopMeeting}
              className="px-3 py-1 bg-white text-black rounded hover:bg-gray-100"
            >
              Stop
            </button>
          </div>
        </div>
      )}
      {notification && (
        <div
          className={`fixed bottom-4 left-4 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default App; 