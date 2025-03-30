"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const NoteTakerView = () => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [filter, setFilter] = (0, react_1.useState)('All');
    const meetings = [
        {
            id: '1',
            date: '28 Mar',
            startTime: '17:03',
            endTime: '17:04',
            participants: ['Simon Werner-Zankl', 'Speaker 2'],
            title: 'Meeting (2025-03-28, 17:03)'
        },
        {
            id: '2',
            date: '26 Mar',
            startTime: '17:03',
            endTime: '17:03',
            participants: ['Simon Werner-Zankl'],
            title: 'Meeting (2025-03-26, 17:03)'
        },
        {
            id: '3',
            date: '26 Mar',
            startTime: '16:49',
            endTime: '16:50',
            participants: ['Simon Werner-Zankl', 'Alexander Wik'],
            title: 'Meeting (2025-03-26, 16:49)'
        }
    ];
    return (react_1.default.createElement("div", { className: "p-6" },
        react_1.default.createElement("div", { className: "flex justify-between items-center mb-6" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Transcribed Meetings"),
                react_1.default.createElement("p", { className: "text-gray-600" }, "Review and manage your AI-transcribed meetings")),
            react_1.default.createElement("button", { className: "px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600 flex items-center space-x-2" },
                react_1.default.createElement("span", { className: "text-lg" }, "+"),
                react_1.default.createElement("span", null, "Start Meeting"))),
        react_1.default.createElement("div", { className: "flex items-center justify-between mb-6" },
            react_1.default.createElement("div", { className: "flex-1 max-w-3xl relative" },
                react_1.default.createElement("input", { type: "text", placeholder: "Search meetings...", className: "w-full pl-10 pr-4 py-2 border rounded-lg", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }),
                react_1.default.createElement("span", { className: "absolute left-3 top-2.5 text-gray-400" }, "\uD83D\uDD0D")),
            react_1.default.createElement("div", { className: "flex space-x-2 ml-4" }, ['All', 'Customer', 'Internal', 'Unidentified'].map((type) => (react_1.default.createElement("button", { key: type, onClick: () => setFilter(type), className: `px-4 py-2 rounded-lg ${filter === type
                    ? 'bg-sunshine-50 text-sunshine-900'
                    : 'text-gray-600 hover:bg-gray-50'}` }, type))))),
        react_1.default.createElement("div", { className: "space-y-4" }, meetings.map((meeting) => (react_1.default.createElement("div", { key: meeting.id, className: "bg-white rounded-lg border p-4 hover:shadow-md transition-shadow" },
            react_1.default.createElement("div", { className: "flex justify-between items-start" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h3", { className: "font-medium text-gray-900" }, meeting.title),
                    react_1.default.createElement("div", { className: "text-gray-500 mt-1" },
                        meeting.date,
                        " \u2022 ",
                        meeting.startTime,
                        " - ",
                        meeting.endTime),
                    react_1.default.createElement("div", { className: "text-gray-600 mt-2" }, meeting.participants.join(', '))),
                react_1.default.createElement("button", { className: "text-sunshine-500 hover:text-sunshine-600" },
                    react_1.default.createElement("svg", { className: "w-5 h-5", viewBox: "0 0 20 20", fill: "currentColor" },
                        react_1.default.createElement("path", { d: "M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" }),
                        react_1.default.createElement("path", { fillRule: "evenodd", d: "M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z", clipRule: "evenodd" }))))))))));
};
exports.default = NoteTakerView;
