import React, { useState } from 'react';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  participants: Array<{
    initials: string;
    name: string;
    color: string;
  }>;
  type: 'upcoming' | 'pending' | 'recurring' | 'past' | 'cancelled';
}

const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: '1',
    title: 'Meja Träning redskap+löpning',
    date: new Date('2025-04-01'),
    startTime: '17:15',
    endTime: '19:30',
    location: 'Jönköpings Idrottshus Lagermansgatan 4, 553 18 Jönköping, Sverige',
    participants: [
      { initials: 'EK', name: 'Erik Karlsson', color: 'bg-green-600' },
      { initials: 'SJ', name: 'Sara Johnson', color: 'bg-purple-600' }
    ],
    type: 'upcoming'
  },
  {
    id: '2',
    title: 'Meja träning fristående',
    date: new Date('2025-04-03'),
    startTime: '16:00',
    endTime: '18:15',
    location: 'Jönköpings Idrottshus Lagermansgatan 4, 553 18 Jönköping, Sverige',
    participants: [
      { initials: 'EK', name: 'Erik Karlsson', color: 'bg-green-600' },
      { initials: 'SJ', name: 'Sara Johnson', color: 'bg-purple-600' }
    ],
    type: 'upcoming'
  },
  {
    id: '3',
    title: 'Meja träning redskap Huskvarna Trupphall',
    date: new Date('2025-04-04'),
    startTime: '17:30',
    endTime: '19:30',
    location: 'Huskvarna Sporthall Idrottshall Jönköpingsvägen 19, 561 31 Huskvarna, Sverige',
    participants: [
      { initials: 'EK', name: 'Erik Karlsson', color: 'bg-green-600' },
      { initials: 'SJ', name: 'Sara Johnson', color: 'bg-purple-600' }
    ],
    type: 'upcoming'
  }
];

const CalendarView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'upcoming' | 'pending' | 'recurring' | 'past' | 'cancelled'>('upcoming');
  const [lastSync, setLastSync] = useState('just now');

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      day: days[date.getDay()],
      date: date.getDate().toString().padStart(2, '0'),
      month: months[date.getMonth()]
    };
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Meetings</h1>
          <p className="text-gray-600">View and manage all your scheduled meetings.</p>
        </div>
        <button 
          className="flex items-center space-x-2 px-4 py-2 rounded-lg border hover:bg-gray-50"
          onClick={() => setLastSync('just now')}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <span>Sync Google Calendar (Last: {lastSync})</span>
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setSelectedFilter('upcoming')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            selectedFilter === 'upcoming' ? 'bg-sunshine-50 text-sunshine-900' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Upcoming</span>
        </button>
        {['pending', 'recurring', 'past', 'cancelled'].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              selectedFilter === filter ? 'bg-sunshine-50 text-sunshine-900' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="capitalize">{filter}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {SAMPLE_MEETINGS.map((meeting) => {
          const { day, date, month } = formatDate(meeting.date);
          return (
            <div key={meeting.id} className="flex space-x-4 bg-white rounded-lg border p-4">
              <div className="text-center w-20">
                <div className="text-sunshine-500">{day}</div>
                <div className="text-3xl font-bold text-gray-900">{date}</div>
                <div className="text-gray-500">{month}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                    <div className="text-gray-500 mt-1">
                      {meeting.startTime} - {meeting.endTime}
                    </div>
                    <div className="flex items-center text-gray-500 mt-2">
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{meeting.location}</span>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    {meeting.participants.map((participant, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full ${participant.color} text-white flex items-center justify-center text-sm font-medium ring-2 ring-white`}
                        title={participant.name}
                      >
                        {participant.initials}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView; 