import React from 'react';
import { Transition } from '@headlessui/react';

interface RecordingStopPromptProps {
  isOpen: boolean;
  onStop: () => void;
  onContinue: () => void;
}

const RecordingStopPrompt: React.FC<RecordingStopPromptProps> = ({ isOpen, onStop, onContinue }) => {
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
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-96 border border-gray-200">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Meeting Ended
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Would you like to stop recording? The recording will be automatically processed and transcribed.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={onStop}
              className="flex-1 bg-sunshine-500 text-white px-4 py-2 rounded-lg hover:bg-sunshine-600 font-medium"
            >
              Stop Recording
            </button>
            <button
              onClick={onContinue}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium"
            >
              Continue Recording
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default RecordingStopPrompt; 