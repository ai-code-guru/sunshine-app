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
const AvailabilityManager = ({ onCreateBookingLink, onUpdateBookingLink, onDeleteBookingLink, }) => {
    const [bookingLinks, setBookingLinks] = (0, react_1.useState)([]);
    const [availabilitySlots, setAvailabilitySlots] = (0, react_1.useState)([]);
    const [isCreatingLink, setIsCreatingLink] = (0, react_1.useState)(false);
    const [newLink, setNewLink] = (0, react_1.useState)({
        title: '',
        description: '',
        duration: 30,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    (0, react_1.useEffect)(() => {
        // TODO: Fetch booking links and availability slots from Supabase
        // This will be implemented when we integrate with the backend
    }, []);
    const handleCreateLink = async (e) => {
        e.preventDefault();
        try {
            await onCreateBookingLink(newLink);
            setIsCreatingLink(false);
            setNewLink({
                title: '',
                description: '',
                duration: 30,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            });
        }
        catch (error) {
            console.error('Error creating booking link:', error);
        }
    };
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };
    return (react_1.default.createElement("div", { className: "max-w-4xl mx-auto" },
        react_1.default.createElement("div", { className: "mb-8" },
            react_1.default.createElement("h2", { className: "text-2xl font-bold mb-4" }, "Availability Slots"),
            react_1.default.createElement("div", { className: "space-y-4" }, availabilitySlots.map((slot) => (react_1.default.createElement("div", { key: slot.id, className: "bg-white p-4 rounded-lg shadow border hover:border-sunshine-500 transition-colors" },
                react_1.default.createElement("div", { className: "flex items-center justify-between" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("p", { className: "font-medium text-gray-900" },
                            (0, date_fns_1.format)(new Date(slot.start_time), 'MMM d, yyyy h:mm a'),
                            " -",
                            ' ',
                            (0, date_fns_1.format)(new Date(slot.end_time), 'h:mm a')),
                        slot.recurrence && (react_1.default.createElement("p", { className: "text-sm text-gray-500" },
                            "Repeats ",
                            slot.recurrence)),
                        (slot.buffer_before || slot.buffer_after) && (react_1.default.createElement("p", { className: "text-sm text-gray-500" },
                            "Buffer: ",
                            slot.buffer_before && `${slot.buffer_before}min before`,
                            ' ',
                            slot.buffer_before && slot.buffer_after && '/',
                            ' ',
                            slot.buffer_after && `${slot.buffer_after}min after`))))))))),
        react_1.default.createElement("div", { className: "mb-8" },
            react_1.default.createElement("h2", { className: "text-2xl font-bold mb-4" }, "Booking Links"),
            react_1.default.createElement("div", { className: "space-y-4" }, bookingLinks.map((link) => (react_1.default.createElement("div", { key: link.id, className: "bg-white p-4 rounded-lg shadow border hover:border-sunshine-500 transition-colors" },
                react_1.default.createElement("div", { className: "flex items-center justify-between" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h3", { className: "text-lg font-semibold" }, link.title),
                        react_1.default.createElement("p", { className: "text-gray-500 text-sm" }, link.description),
                        react_1.default.createElement("p", { className: "text-sm text-sunshine-600" },
                            "sunshine.app/",
                            link.slug,
                            " \u2022 ",
                            link.duration,
                            " minutes")),
                    react_1.default.createElement("div", { className: "flex space-x-2" },
                        react_1.default.createElement("button", { onClick: () => onDeleteBookingLink(link.id), className: "text-red-600 hover:text-red-700" }, "Delete")))))))),
        isCreatingLink ? (react_1.default.createElement("form", { onSubmit: handleCreateLink, className: "bg-white p-6 rounded-lg shadow" },
            react_1.default.createElement("h3", { className: "text-lg font-semibold mb-4" }, "Create New Booking Link"),
            react_1.default.createElement("div", { className: "space-y-4" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Title"),
                    react_1.default.createElement("input", { type: "text", value: newLink.title, onChange: (e) => {
                            const title = e.target.value;
                            setNewLink({
                                ...newLink,
                                title,
                                slug: generateSlug(title),
                            });
                        }, className: "w-full px-3 py-2 border rounded-lg focus:ring-sunshine-500 focus:border-sunshine-500", required: true })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Description"),
                    react_1.default.createElement("textarea", { value: newLink.description, onChange: (e) => setNewLink({ ...newLink, description: e.target.value }), className: "w-full px-3 py-2 border rounded-lg focus:ring-sunshine-500 focus:border-sunshine-500", rows: 3 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Duration (minutes)"),
                    react_1.default.createElement("input", { type: "number", value: newLink.duration, onChange: (e) => setNewLink({ ...newLink, duration: parseInt(e.target.value, 10) }), className: "w-full px-3 py-2 border rounded-lg focus:ring-sunshine-500 focus:border-sunshine-500", min: 15, step: 15, required: true })),
                react_1.default.createElement("div", { className: "flex justify-end space-x-3" },
                    react_1.default.createElement("button", { type: "button", onClick: () => setIsCreatingLink(false), className: "px-4 py-2 text-gray-700 hover:text-gray-900" }, "Cancel"),
                    react_1.default.createElement("button", { type: "submit", className: "px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600" }, "Create Link"))))) : (react_1.default.createElement("button", { onClick: () => setIsCreatingLink(true), className: "w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-sunshine-500 hover:border-sunshine-500 transition-colors" }, "+ Create New Booking Link"))));
};
exports.default = AvailabilityManager;
