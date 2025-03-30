import React, { useState } from 'react';
import { format } from 'date-fns';

interface MeetingDetailsProps {
  meeting: {
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    labels?: string[];
    executiveSummary?: string;
    transcript?: string;
    decisions?: string[];
    tasks?: {
      id: string;
      text: string;
      completed: boolean;
    }[];
    participants?: string[];
  };
}

const MeetingDetails: React.FC<MeetingDetailsProps> = ({ meeting }) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'transcript'>('notes');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-semibold mb-2">{meeting.title}</h1>
            <div className="flex items-center text-gray-500">
              <span>{format(meeting.date, 'EEEE dd MMM')}</span>
              <span className="mx-2">•</span>
              <span>{meeting.startTime} - {meeting.endTime}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <span className="text-xl">⋯</span>
          </button>
        </div>
        {meeting.labels && (
          <div className="flex gap-2 mt-4">
            {meeting.labels.map((label, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-gray-100"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'notes'
                ? 'text-sunshine-500 border-b-2 border-sunshine-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notes')}
          >
            Meeting notes
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === 'transcript'
                ? 'text-sunshine-500 border-b-2 border-sunshine-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('transcript')}
          >
            Transcript
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'notes' ? (
          <div className="p-6">
            {/* Executive Summary */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Executive Summary:</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {meeting.executiveSummary}
              </p>
            </section>

            {/* Decisions */}
            {meeting.decisions && meeting.decisions.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Decisions</h2>
                <ul className="space-y-2">
                  {meeting.decisions.map((decision, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span className="text-gray-700">{decision}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Tasks */}
            {meeting.tasks && meeting.tasks.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Tasks</h2>
                <ul className="space-y-2">
                  {meeting.tasks.map(task => (
                    <li key={task.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="h-4 w-4 text-sunshine-500 rounded border-gray-300 focus:ring-sunshine-500"
                        onChange={() => {}}
                      />
                      <span className="ml-3 text-gray-700">{task.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Participants */}
            {meeting.participants && meeting.participants.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4">Participants</h2>
                <div className="flex flex-wrap gap-2">
                  {meeting.participants.map((participant, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                    >
                      {participant}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-700 whitespace-pre-line">
              {meeting.transcript}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetails; 