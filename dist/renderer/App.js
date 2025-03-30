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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Layout_1 = __importDefault(require("./components/Layout"));
const CalendarView_1 = __importDefault(require("./components/CalendarView"));
const NoteTakerView_1 = __importDefault(require("./components/NoteTakerView"));
const AvailabilityView_1 = __importDefault(require("./components/AvailabilityView"));
const MeetingPrompt_1 = __importDefault(require("./components/MeetingPrompt"));
const BookingLinksView_1 = __importDefault(require("./components/BookingLinksView"));
const SAMPLE_MEETINGS = [
    {
        id: '1',
        title: 'Sales chat',
        date: new Date(),
        startTime: '08:26',
        endTime: '09:04',
        participants: ['Stefano Verkooij', 'Simon Werner-Zankl'],
        type: 'past',
        labels: ['Other'],
        executiveSummary: 'Simon Werner-Zankl and team identified significant challenges in the Nordic market, including recent losses to competitors like Team Tailor. The team agreed to develop a new "attack plan" for Nordic sales, focusing on improving user experience and product demonstration techniques.',
        decisions: [
            'Develop new "attack plan" for Nordic sales',
            'Create specialized demo account',
            'Implement guided demos with recruiters'
        ],
        tasks: [
            {
                id: '1',
                text: 'Put \'how to win more deals\' on the agenda for the upcoming meeting',
                completed: false
            },
            {
                id: '2',
                text: 'Start reaching out to potential clients in the Netherlands',
                completed: false
            }
        ]
    },
    {
        id: '2',
        title: 'Sprint review 20250325',
        date: new Date(Date.now() - 86400000),
        startTime: '10:00',
        endTime: '11:00',
        participants: ['Tommy Karlsson', 'Simon Werner-Zankl'],
        type: 'past',
        labels: ['Other']
    }
];
const App = () => {
    const [currentView, setCurrentView] = (0, react_1.useState)('calendar');
    const [showMeetingPrompt, setShowMeetingPrompt] = (0, react_1.useState)(false);
    const [isRecording, setIsRecording] = (0, react_1.useState)(false);
    const [notification, setNotification] = (0, react_1.useState)(null);
    // Set up meeting detection listeners
    react_1.default.useEffect(() => {
        // Listen for meeting detection
        window.electron.onMeetingDetected(() => {
            setShowMeetingPrompt(true);
        });
        // Listen for meeting end
        window.electron.onMeetingEnded(() => {
            setIsRecording(false);
            setShowMeetingPrompt(false);
        });
        // Listen for recording saved
        window.electron.onRecordingSaved((data) => {
            setNotification({
                type: 'success',
                message: `Recording saved: ${data.filePath}`
            });
            setTimeout(() => setNotification(null), 5000);
        });
        // Listen for recording save failed
        window.electron.onRecordingSaveFailed((error) => {
            setNotification({
                type: 'error',
                message: `Failed to save recording: ${error.message}`
            });
            setTimeout(() => setNotification(null), 5000);
        });
    }, []);
    const handleStartMeeting = async () => {
        try {
            await window.electron.startMeeting();
            setIsRecording(true);
            setShowMeetingPrompt(false);
        }
        catch (error) {
            console.error('Failed to start meeting:', error);
            setNotification({
                type: 'error',
                message: 'Failed to start recording'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    };
    const handleStopMeeting = async () => {
        try {
            await window.electron.stopMeeting();
            setIsRecording(false);
        }
        catch (error) {
            console.error('Failed to stop meeting:', error);
            setNotification({
                type: 'error',
                message: 'Failed to stop recording'
            });
            setTimeout(() => setNotification(null), 5000);
        }
    };
    const renderContent = () => {
        switch (currentView) {
            case 'calendar':
                return react_1.default.createElement(CalendarView_1.default, null);
            case 'notes':
                return react_1.default.createElement(NoteTakerView_1.default, null);
            case 'availability':
                return react_1.default.createElement(AvailabilityView_1.default, null);
            case 'bookings':
                return react_1.default.createElement(BookingLinksView_1.default, null);
            case 'chat':
                return (react_1.default.createElement("div", { className: "p-6" },
                    react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Chat"),
                    react_1.default.createElement("p", { className: "mt-4 text-gray-600" }, "Chat feature coming soon...")));
            case 'templates':
                return (react_1.default.createElement("div", { className: "p-6" },
                    react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Templates"),
                    react_1.default.createElement("p", { className: "mt-4 text-gray-600" }, "Manage your note templates here.")));
            case 'team':
                return (react_1.default.createElement("div", { className: "p-6" },
                    react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Team"),
                    react_1.default.createElement("p", { className: "mt-4 text-gray-600" }, "Manage your team settings here.")));
            case 'settings':
                return (react_1.default.createElement("div", { className: "p-6" },
                    react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Settings"),
                    react_1.default.createElement("p", { className: "mt-4 text-gray-600" }, "Configure your app settings here.")));
            default:
                return null;
        }
    };
    return (react_1.default.createElement("div", { className: "h-screen bg-gray-50" },
        react_1.default.createElement(Layout_1.default, { onNavigate: setCurrentView, currentView: currentView }, renderContent()),
        showMeetingPrompt && (react_1.default.createElement(MeetingPrompt_1.default, { onClose: () => setShowMeetingPrompt(false), onStartMeeting: handleStartMeeting })),
        isRecording && (react_1.default.createElement("div", { className: "fixed bottom-4 right-4 bg-black text-white rounded-lg shadow-lg p-4" },
            react_1.default.createElement("div", { className: "flex items-center space-x-3" },
                react_1.default.createElement("div", { className: "flex items-center" },
                    react_1.default.createElement("div", { className: "w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" }),
                    react_1.default.createElement("span", null, "Recording")),
                react_1.default.createElement("button", { onClick: handleStopMeeting, className: "px-3 py-1 bg-white text-black rounded hover:bg-gray-100" }, "Stop")))),
        notification && (react_1.default.createElement("div", { className: `fixed bottom-4 left-4 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white` }, notification.message))));
};
exports.default = App;
