"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const outline_1 = require("@heroicons/react/24/outline");
const SunIcon_1 = __importDefault(require("./SunIcon"));
const Layout = ({ children, onNavigate, currentView }) => {
    const navLinkClasses = (view) => {
        const isActive = currentView === view;
        return `flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-sunshine-50 hover:text-sunshine-900 rounded-lg transition-colors duration-150 ${isActive ? 'bg-sunshine-50 text-sunshine-900' : ''}`;
    };
    return (react_1.default.createElement("div", { className: "flex h-full" },
        react_1.default.createElement("div", { className: "w-64 bg-white border-r" },
            react_1.default.createElement("div", { className: "p-4 border-b bg-sunshine-50" },
                react_1.default.createElement("div", { className: "flex items-center space-x-2" },
                    react_1.default.createElement(SunIcon_1.default, { className: "w-8 h-8 text-sunshine-500" }),
                    react_1.default.createElement("span", { className: "text-xl font-bold text-sunshine-900" }, "Sunshine"))),
            react_1.default.createElement("nav", { className: "p-4 space-y-1" },
                react_1.default.createElement("div", { className: "mb-2" },
                    react_1.default.createElement("h3", { className: "px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" }, "Meetings")),
                react_1.default.createElement("button", { onClick: () => onNavigate('calendar'), className: navLinkClasses('calendar') },
                    react_1.default.createElement(outline_1.CalendarIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Calendar")),
                react_1.default.createElement("button", { onClick: () => onNavigate('availability'), className: navLinkClasses('availability') },
                    react_1.default.createElement(outline_1.ClockIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Availability")),
                react_1.default.createElement("button", { onClick: () => onNavigate('bookings'), className: navLinkClasses('bookings') },
                    react_1.default.createElement(outline_1.CalendarIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Booking Links")),
                react_1.default.createElement("button", { onClick: () => onNavigate('chat'), className: navLinkClasses('chat') },
                    react_1.default.createElement(outline_1.ChatBubbleLeftRightIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Chat")),
                react_1.default.createElement("div", { className: "mt-6 mb-2" },
                    react_1.default.createElement("h3", { className: "px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" }, "Notetaker")),
                react_1.default.createElement("button", { onClick: () => onNavigate('notes'), className: navLinkClasses('notes') },
                    react_1.default.createElement(outline_1.DocumentTextIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Notes")),
                react_1.default.createElement("button", { onClick: () => onNavigate('templates'), className: navLinkClasses('templates') },
                    react_1.default.createElement(outline_1.DocumentDuplicateIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Templates")),
                react_1.default.createElement("div", { className: "mt-6 mb-2" },
                    react_1.default.createElement("h3", { className: "px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" }, "Team")),
                react_1.default.createElement("button", { onClick: () => onNavigate('team'), className: navLinkClasses('team') },
                    react_1.default.createElement(outline_1.UserGroupIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Team")),
                react_1.default.createElement("div", { className: "mt-6 mb-2" },
                    react_1.default.createElement("h3", { className: "px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider" }, "Settings")),
                react_1.default.createElement("button", { onClick: () => onNavigate('settings'), className: navLinkClasses('settings') },
                    react_1.default.createElement(outline_1.Cog6ToothIcon, { className: "w-5 h-5" }),
                    react_1.default.createElement("span", null, "Settings")))),
        react_1.default.createElement("div", { className: "flex-1 overflow-auto bg-gray-50" }, children)));
};
exports.default = Layout;
