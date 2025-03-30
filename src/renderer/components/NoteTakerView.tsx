import React, { useState } from 'react';

interface Meeting {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  participants: string[];
  title?: string;
}

const NoteTakerView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Customer' | 'Internal' | 'Unidentified'>('All');

  const meetings: Meeting[] = [
    {
      id: '1',
      date: '28 Mar',
      startTime: '17:03',
      endTime: '17:04',
      participants: ['Simon Werner-Zankl', 'Speaker 2'],
      title: 'Meeting (2025-03-28, 17:03)'
    },
    {
      id: '2',
      date: '26 Mar',
      startTime: '17:03',
      endTime: '17:03',
      participants: ['Simon Werner-Zankl'],
      title: 'Meeting (2025-03-26, 17:03)'
    },
    {
      id: '3',
      date: '26 Mar',
      startTime: '16:49',
      endTime: '16:50',
      participants: ['Simon Werner-Zankl', 'Alexander Wik'],
      title: 'Meeting (2025-03-26, 16:49)'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transcribed Meetings</h1>
          <p className="text-gray-600">Review and manage your AI-transcribed meetings</p>
        </div>
        <button className="px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600 flex items-center space-x-2">
          <span className="text-lg">+</span>
          <span>Start Meeting</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex-1 max-w-3xl relative">
          <input
            type="text"
            placeholder="Search meetings..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>
        <div className="flex space-x-2 ml-4">
          {(['All', 'Customer', 'Internal', 'Unidentified'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg ${
                filter === type
                  ? 'bg-sunshine-50 text-sunshine-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                <div className="text-gray-500 mt-1">
                  {meeting.date} • {meeting.startTime} - {meeting.endTime}
                </div>
                <div className="text-gray-600 mt-2">
                  {meeting.participants.join(', ')}
                </div>
              </div>
              <button className="text-sunshine-500 hover:text-sunshine-600">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteTakerView; 