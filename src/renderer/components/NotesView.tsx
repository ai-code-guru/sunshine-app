import React, { useState } from 'react';
import MeetingDetailsView from './MeetingDetailsView';

interface Meeting {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  executiveSummary: string;
  meetingNotes: string;
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
    assignedTo: string;
  }>;
  participants: Array<{
    id: string;
    name: string;
    initial: string;
  }>;
  labels: string[];
}

const NotesView: React.FC = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Sample data
  const meetings: Meeting[] = [
    {
      id: '1',
      date: 'Friday 28 Mar',
      startTime: '17:03',
      endTime: '17:04',
      executiveSummary: 'Simon has agreed to cook dinner tonight, which will consist of entrecôte and his homemade fries. Sandra will call her father at 5 PM to invite him over.',
      meetingNotes: 'During the meeting, Simon confirmed that he would prepare dinner for the evening, specifically entrecôte served with his signature homemade fries. Additionally, Sandra mentioned she would contact her father at 5 PM to inform him to come over.',
      tasks: [
        {
          id: '1',
          text: 'Prepare entrecôte and homemade fries',
          completed: false,
          assignedTo: 'Simon'
        },
        {
          id: '2',
          text: 'Call father to invite him over at 5 PM',
          completed: false,
          assignedTo: 'Sandra'
        }
      ],
      participants: [
        {
          id: '1',
          name: 'Simon Werner-Zankl',
          initial: 'S'
        },
        {
          id: '2',
          name: 'Speaker 2',
          initial: 'S'
        }
      ],
      labels: ['Other']
    }
  ];

  if (selectedMeeting) {
    return (
      <MeetingDetailsView
        meeting={selectedMeeting}
        onBack={() => setSelectedMeeting(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Meeting Notes</h1>
        <p className="text-gray-600">View and manage your meeting transcripts and notes.</p>
      </div>

      <div className="space-y-4">
        {meetings.map(meeting => (
          <button
            key={meeting.id}
            onClick={() => setSelectedMeeting(meeting)}
            className="w-full text-left bg-white rounded-lg border p-4 hover:border-sunshine-500 transition-colors duration-150"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">
                  Meeting ({meeting.date}, {meeting.startTime})
                </h3>
                <p className="text-gray-600 mt-1 line-clamp-2">{meeting.executiveSummary}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>{meeting.date}</span>
                  <span>•</span>
                  <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {meeting.labels.map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-sunshine-100 text-sunshine-800 rounded text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotesView; 