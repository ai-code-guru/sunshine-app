"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const date_fns_1 = require("date-fns");
const MeetingList = ({ meetings }) => {
    const upcomingMeetings = meetings.filter(meeting => meeting.type === 'upcoming');
    const pastMeetings = meetings.filter(meeting => meeting.type === 'past');
    const MeetingItem = ({ meeting }) => (react_1.default.createElement("div", { className: "p-4 hover:bg-gray-50 cursor-pointer" },
        react_1.default.createElement("div", { className: "flex justify-between items-start mb-2" },
            react_1.default.createElement("h3", { className: "font-medium text-gray-900" }, meeting.title),
            react_1.default.createElement("span", { className: "text-sm text-gray-500" }, (0, date_fns_1.format)(meeting.date, 'MMM, d'))),
        react_1.default.createElement("p", { className: "text-sm text-gray-500 truncate" }, meeting.participants.join(', ')),
        meeting.labels && meeting.labels.length > 0 && (react_1.default.createElement("div", { className: "mt-2 flex gap-2" }, meeting.labels.map((label, index) => (react_1.default.createElement("span", { key: index, className: "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800" }, label)))))));
    return (react_1.default.createElement("div", { className: "h-full overflow-auto" },
        react_1.default.createElement("div", { className: "mb-6" },
            react_1.default.createElement("h2", { className: "px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider" }, "Upcoming"),
            react_1.default.createElement("div", { className: "divide-y divide-gray-200" }, upcomingMeetings.map(meeting => (react_1.default.createElement(MeetingItem, { key: meeting.id, meeting: meeting }))))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("h2", { className: "px-4 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider" }, "Past"),
            react_1.default.createElement("div", { className: "divide-y divide-gray-200" }, pastMeetings.map(meeting => (react_1.default.createElement(MeetingItem, { key: meeting.id, meeting: meeting })))))));
};
exports.default = MeetingList;
