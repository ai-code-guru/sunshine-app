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
const AvailabilityView = () => {
    const [slots, setSlots] = (0, react_1.useState)([
        {
            id: '1',
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '17:00',
            recurrence: 'weekly',
            bufferBefore: 15,
            bufferAfter: 15
        },
        {
            id: '2',
            dayOfWeek: 'Tuesday',
            startTime: '09:00',
            endTime: '17:00',
            recurrence: 'weekly',
            bufferBefore: 15,
            bufferAfter: 15
        }
    ]);
    const [newSlot, setNewSlot] = (0, react_1.useState)({
        dayOfWeek: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        recurrence: 'weekly',
        bufferBefore: 15,
        bufferAfter: 15
    });
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSlot(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleCreateSlot = (e) => {
        e.preventDefault();
        const newAvailabilitySlot = {
            id: Math.random().toString(36).substr(2, 9),
            ...newSlot
        };
        setSlots(prev => [...prev, newAvailabilitySlot]);
        setNewSlot({
            dayOfWeek: 'Monday',
            startTime: '09:00',
            endTime: '17:00',
            recurrence: 'weekly',
            bufferBefore: 15,
            bufferAfter: 15
        });
    };
    const handleDeleteSlot = (id) => {
        setSlots(prev => prev.filter(slot => slot.id !== id));
    };
    return (react_1.default.createElement("div", { className: "p-6 max-w-4xl mx-auto" },
        react_1.default.createElement("div", { className: "mb-8" },
            react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Availability Management"),
            react_1.default.createElement("p", { className: "text-gray-600" }, "Set your regular availability for meetings.")),
        react_1.default.createElement("div", { className: "bg-white rounded-lg border p-6 mb-8" },
            react_1.default.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Add New Availability"),
            react_1.default.createElement("form", { onSubmit: handleCreateSlot, className: "space-y-4" },
                react_1.default.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Day of Week"),
                        react_1.default.createElement("select", { name: "dayOfWeek", value: newSlot.dayOfWeek, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500" }, daysOfWeek.map(day => (react_1.default.createElement("option", { key: day, value: day }, day))))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Recurrence"),
                        react_1.default.createElement("select", { name: "recurrence", value: newSlot.recurrence, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500" },
                            react_1.default.createElement("option", { value: "weekly" }, "Weekly"),
                            react_1.default.createElement("option", { value: "daily" }, "Daily"),
                            react_1.default.createElement("option", { value: "none" }, "One-time"))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Start Time"),
                        react_1.default.createElement("input", { type: "time", name: "startTime", value: newSlot.startTime, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", required: true })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "End Time"),
                        react_1.default.createElement("input", { type: "time", name: "endTime", value: newSlot.endTime, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", required: true })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Buffer Before (minutes)"),
                        react_1.default.createElement("input", { type: "number", name: "bufferBefore", value: newSlot.bufferBefore, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", min: "0", max: "60", step: "5", required: true })),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Buffer After (minutes)"),
                        react_1.default.createElement("input", { type: "number", name: "bufferAfter", value: newSlot.bufferAfter, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", min: "0", max: "60", step: "5", required: true }))),
                react_1.default.createElement("button", { type: "submit", className: "inline-flex items-center px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600" },
                    react_1.default.createElement("span", { className: "text-lg mr-2" }, "+"),
                    "Add Availability"))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Your Availability"),
            react_1.default.createElement("div", { className: "grid gap-4 md:grid-cols-2" }, slots.map(slot => (react_1.default.createElement("div", { key: slot.id, className: "bg-white rounded-lg border p-4" },
                react_1.default.createElement("div", { className: "flex justify-between items-start" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h3", { className: "font-medium text-gray-900" }, slot.dayOfWeek),
                        react_1.default.createElement("div", { className: "text-gray-600 text-sm mt-1" },
                            slot.startTime,
                            " - ",
                            slot.endTime),
                        react_1.default.createElement("div", { className: "text-gray-500 text-sm mt-2" },
                            react_1.default.createElement("span", { className: "capitalize" }, slot.recurrence),
                            " recurrence"),
                        react_1.default.createElement("div", { className: "text-gray-500 text-sm mt-1" },
                            "Buffer: ",
                            slot.bufferBefore,
                            "min before, ",
                            slot.bufferAfter,
                            "min after")),
                    react_1.default.createElement("button", { onClick: () => handleDeleteSlot(slot.id), className: "text-red-600 hover:text-red-700 text-sm font-medium" }, "Delete")))))))));
};
exports.default = AvailabilityView;
