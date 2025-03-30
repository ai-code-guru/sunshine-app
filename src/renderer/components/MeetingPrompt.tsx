import React from 'react';

interface MeetingPromptProps {
  onClose: () => void;
  onStartMeeting: () => void;
}

const MeetingPrompt: React.FC<MeetingPromptProps> = ({ onClose, onStartMeeting }) => {
  return (
    <div className="fixed top-4 right-4 bg-black text-white rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Are you in a meeting?</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm mb-4">Start meeting to create meeting notes</p>
      <button
        onClick={onStartMeeting}
        className="w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
      >
        Start Meeting
      </button>
    </div>
  );
};

export default MeetingPrompt; 