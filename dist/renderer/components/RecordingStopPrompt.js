"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@headlessui/react");
const RecordingStopPrompt = ({ isOpen, onStop, onContinue }) => {
    return (react_1.default.createElement(react_2.Transition, { show: isOpen, enter: "transition-opacity duration-300", enterFrom: "opacity-0", enterTo: "opacity-100", leave: "transition-opacity duration-200", leaveFrom: "opacity-100", leaveTo: "opacity-0" },
        react_1.default.createElement("div", { className: "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-96 border border-gray-200" },
            react_1.default.createElement("div", { className: "text-center" },
                react_1.default.createElement("h3", { className: "text-lg font-medium text-gray-900 mb-2" }, "Meeting Ended"),
                react_1.default.createElement("p", { className: "text-sm text-gray-500 mb-6" }, "Would you like to stop recording? The recording will be automatically processed and transcribed."),
                react_1.default.createElement("div", { className: "flex space-x-4" },
                    react_1.default.createElement("button", { onClick: onStop, className: "flex-1 bg-sunshine-500 text-white px-4 py-2 rounded-lg hover:bg-sunshine-600 font-medium" }, "Stop Recording"),
                    react_1.default.createElement("button", { onClick: onContinue, className: "flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium" }, "Continue Recording"))))));
};
exports.default = RecordingStopPrompt;
