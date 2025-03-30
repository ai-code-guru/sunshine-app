import React from 'react';
import { format } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  date: Date;
  participants: string[];
  type: 'upcoming' | 'past';
  labels?: string[];
}

interface MeetingListProps {
  meetings: Meeting[];
}

const MeetingList: React.FC<MeetingListProps> = ({ meetings }) => {
  const upcomingMeetings = meetings.filter(meeting => meeting.type === 'upcoming');
  const pastMeetings = meetings.filter(meeting => meeting.type === 'past');

  const MeetingItem = ({ meeting }: { meeting: Meeting }) => (
    <div className="p-4 hover:bg-gray-50 cursor-pointer">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-900">{meeting.title}</h3>
        <span className="text-sm text-gray-500">
          {format(meeting.date, 'MMM, d')}
        </span>
      </div>
      <p className="text-sm text-gray-500 truncate">
        {meeting.participants.join(', ')}
      </p>
      {meeting.labels && meeting.labels.length > 0 && (
        <div className="mt-2 flex gap-2">
          {meeting.labels.map((label, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-auto">
      {/* Upcoming Meetings */}
      <div className="mb-6">
        <h2 className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
          Upcoming
        </h2>
        <div className="divide-y divide-gray-200">
          {upcomingMeetings.map(meeting => (
            <MeetingItem key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>

      {/* Past Meetings */}
      <div>
        <h2 className="px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">
          Past
        </h2>
        <div className="divide-y divide-gray-200">
          {pastMeetings.map(meeting => (
            <MeetingItem key={meeting.id} meeting={meeting} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingList; 