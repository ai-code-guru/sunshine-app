"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const MeetingPrompt = ({ onClose, onStartMeeting }) => {
    return (react_1.default.createElement("div", { className: "fixed top-4 right-4 bg-black text-white rounded-lg shadow-lg p-4 w-80" },
        react_1.default.createElement("div", { className: "flex justify-between items-center mb-2" },
            react_1.default.createElement("h3", { className: "text-lg font-semibold" }, "Are you in a meeting?"),
            react_1.default.createElement("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-300" },
                react_1.default.createElement("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    react_1.default.createElement("path", { fillRule: "evenodd", d: "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z", clipRule: "evenodd" })))),
        react_1.default.createElement("p", { className: "text-gray-400 text-sm mb-4" }, "Start meeting to create meeting notes"),
        react_1.default.createElement("button", { onClick: onStartMeeting, className: "w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors" }, "Start Meeting")));
};
exports.default = MeetingPrompt;
