import React from 'react';
import { Transition } from '@headlessui/react';

interface RecordingPromptProps {
  isOpen: boolean;
  onStart: () => void;
  onDismiss: () => void;
}

const RecordingPrompt: React.FC<RecordingPromptProps> = ({ isOpen, onStart, onDismiss }) => {
  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg p-4 w-80 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Are you in a meeting?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Audio detected. Would you like to start recording?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onStart}
                className="flex-1 bg-sunshine-500 text-white px-4 py-2 rounded-lg hover:bg-sunshine-600 font-medium"
              >
                START
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  );
};

export default RecordingPrompt; 