import React from 'react';
import { ArrowLeftIcon, ShareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  assignedTo: string;
}

interface Participant {
  id: string;
  name: string;
  initial: string;
}

interface MeetingDetailsProps {
  meeting: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    executiveSummary: string;
    meetingNotes: string;
    tasks: Task[];
    participants: Participant[];
    labels: string[];
  };
  onBack: () => void;
}

const MeetingDetailsView: React.FC<MeetingDetailsProps> = ({ meeting, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to meetings</span>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900">
              <ShareIcon className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Meeting Title and Time */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meeting ({meeting.date}, {meeting.startTime})</h1>
          <div className="flex items-center space-x-4 mt-2 text-gray-600">
            <span>{meeting.date}</span>
            <span>•</span>
            <span>{meeting.startTime} - {meeting.endTime}</span>
          </div>
        </div>

        {/* Labels */}
        <div className="flex items-center space-x-2 mb-6">
          {meeting.labels.map((label, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-sunshine-100 text-sunshine-800 rounded text-sm"
            >
              {label}
            </span>
          ))}
          <button className="text-gray-600 hover:text-gray-900 text-sm">+ Add label</button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            {/* Executive Summary */}
            <div className="bg-white rounded-lg border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Executive Summary:</h2>
              <p className="text-gray-600">{meeting.executiveSummary}</p>
            </div>

            {/* Meeting Notes */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Meeting Notes:</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{meeting.meetingNotes}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Tasks */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold mb-4">Tasks</h2>
              <div className="space-y-3">
                {meeting.tasks.map(task => (
                  <div key={task.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-1 rounded border-gray-300 text-sunshine-600 focus:ring-sunshine-500"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">{task.text}</p>
                      <p className="text-sm text-gray-500">Assigned to: {task.assignedTo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Participants</h2>
                <button className="text-gray-600 hover:text-gray-900">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {meeting.participants.map(participant => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-sunshine-100 text-sunshine-800 flex items-center justify-center text-sm font-medium">
                      {participant.initial}
                    </div>
                    <span className="text-gray-900">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailsView; 