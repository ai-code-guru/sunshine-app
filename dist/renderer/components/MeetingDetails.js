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
const date_fns_1 = require("date-fns");
const MeetingDetails = ({ meeting }) => {
    const [activeTab, setActiveTab] = (0, react_1.useState)('notes');
    return (react_1.default.createElement("div", { className: "h-full flex flex-col" },
        react_1.default.createElement("div", { className: "p-6 border-b" },
            react_1.default.createElement("div", { className: "flex justify-between items-start mb-4" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("h1", { className: "text-2xl font-semibold mb-2" }, meeting.title),
                    react_1.default.createElement("div", { className: "flex items-center text-gray-500" },
                        react_1.default.createElement("span", null, (0, date_fns_1.format)(meeting.date, 'EEEE dd MMM')),
                        react_1.default.createElement("span", { className: "mx-2" }, "\u2022"),
                        react_1.default.createElement("span", null,
                            meeting.startTime,
                            " - ",
                            meeting.endTime))),
                react_1.default.createElement("button", { className: "text-gray-400 hover:text-gray-600" },
                    react_1.default.createElement("span", { className: "text-xl" }, "\u22EF"))),
            meeting.labels && (react_1.default.createElement("div", { className: "flex gap-2 mt-4" }, meeting.labels.map((label, index) => (react_1.default.createElement("span", { key: index, className: "px-3 py-1 rounded-full text-sm bg-gray-100" }, label)))))),
        react_1.default.createElement("div", { className: "border-b" },
            react_1.default.createElement("div", { className: "flex" },
                react_1.default.createElement("button", { className: `px-6 py-3 font-medium ${activeTab === 'notes'
                        ? 'text-sunshine-500 border-b-2 border-sunshine-500'
                        : 'text-gray-500 hover:text-gray-700'}`, onClick: () => setActiveTab('notes') }, "Meeting notes"),
                react_1.default.createElement("button", { className: `px-6 py-3 font-medium ${activeTab === 'transcript'
                        ? 'text-sunshine-500 border-b-2 border-sunshine-500'
                        : 'text-gray-500 hover:text-gray-700'}`, onClick: () => setActiveTab('transcript') }, "Transcript"))),
        react_1.default.createElement("div", { className: "flex-1 overflow-auto" }, activeTab === 'notes' ? (react_1.default.createElement("div", { className: "p-6" },
            react_1.default.createElement("section", { className: "mb-8" },
                react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Executive Summary:"),
                react_1.default.createElement("p", { className: "text-gray-700 whitespace-pre-line" }, meeting.executiveSummary)),
            meeting.decisions && meeting.decisions.length > 0 && (react_1.default.createElement("section", { className: "mb-8" },
                react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Decisions"),
                react_1.default.createElement("ul", { className: "space-y-2" }, meeting.decisions.map((decision, index) => (react_1.default.createElement("li", { key: index, className: "flex items-start" },
                    react_1.default.createElement("span", { className: "mr-2" }, "\u2022"),
                    react_1.default.createElement("span", { className: "text-gray-700" }, decision))))))),
            meeting.tasks && meeting.tasks.length > 0 && (react_1.default.createElement("section", { className: "mb-8" },
                react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Tasks"),
                react_1.default.createElement("ul", { className: "space-y-2" }, meeting.tasks.map(task => (react_1.default.createElement("li", { key: task.id, className: "flex items-center" },
                    react_1.default.createElement("input", { type: "checkbox", checked: task.completed, className: "h-4 w-4 text-sunshine-500 rounded border-gray-300 focus:ring-sunshine-500", onChange: () => { } }),
                    react_1.default.createElement("span", { className: "ml-3 text-gray-700" }, task.text))))))),
            meeting.participants && meeting.participants.length > 0 && (react_1.default.createElement("section", null,
                react_1.default.createElement("h2", { className: "text-xl font-semibold mb-4" }, "Participants"),
                react_1.default.createElement("div", { className: "flex flex-wrap gap-2" }, meeting.participants.map((participant, index) => (react_1.default.createElement("span", { key: index, className: "inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100" }, participant)))))))) : (react_1.default.createElement("div", { className: "p-6" },
            react_1.default.createElement("p", { className: "text-gray-700 whitespace-pre-line" }, meeting.transcript))))));
};
exports.default = MeetingDetails;
