import React from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import SunIcon from './SunIcon';

type View = 'calendar' | 'availability' | 'chat' | 'notes' | 'templates' | 'team' | 'settings' | 'bookings';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (view: View) => void;
  currentView: View;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentView }) => {
  const navLinkClasses = (view: View) => {
    const isActive = currentView === view;
    return `flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-sunshine-50 hover:text-sunshine-900 rounded-lg transition-colors duration-150 ${
      isActive ? 'bg-sunshine-50 text-sunshine-900' : ''
    }`;
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4 border-b bg-sunshine-50">
          <div className="flex items-center space-x-2">
            <SunIcon className="w-8 h-8 text-sunshine-500" />
            <span className="text-xl font-bold text-sunshine-900">Sunshine</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {/* Meetings Section */}
          <div className="mb-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Meetings</h3>
          </div>
          <button onClick={() => onNavigate('calendar')} className={navLinkClasses('calendar')}>
            <CalendarIcon className="w-5 h-5" />
            <span>Calendar</span>
          </button>
          <button onClick={() => onNavigate('bookings')} className={navLinkClasses('bookings')}>
            <LinkIcon className="w-5 h-5" />
            <span>Booking Links</span>
          </button>
          <button onClick={() => onNavigate('availability')} className={navLinkClasses('availability')}>
            <ClockIcon className="w-5 h-5" />
            <span>Availability</span>
          </button>
          <button onClick={() => onNavigate('chat')} className={navLinkClasses('chat')}>
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            <span>Chat</span>
          </button>

          {/* Notetaker Section */}
          <div className="mt-6 mb-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Notetaker</h3>
          </div>
          <button onClick={() => onNavigate('notes')} className={navLinkClasses('notes')}>
            <DocumentTextIcon className="w-5 h-5" />
            <span>Notes</span>
          </button>
          <button onClick={() => onNavigate('templates')} className={navLinkClasses('templates')}>
            <DocumentDuplicateIcon className="w-5 h-5" />
            <span>Templates</span>
          </button>

          {/* Team Section */}
          <div className="mt-6 mb-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Team</h3>
          </div>
          <button onClick={() => onNavigate('team')} className={navLinkClasses('team')}>
            <UserGroupIcon className="w-5 h-5" />
            <span>Team</span>
          </button>

          {/* Settings Section */}
          <div className="mt-6 mb-2">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
          </div>
          <button onClick={() => onNavigate('settings')} className={navLinkClasses('settings')}>
            <Cog6ToothIcon className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default Layout; 