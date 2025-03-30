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
const BookingLinksView = () => {
    const [newLink, setNewLink] = (0, react_1.useState)({
        title: '',
        slug: '',
        description: '',
        duration: 60
    });
    const [bookingLinks, setBookingLinks] = (0, react_1.useState)([
        {
            id: '1',
            title: 'Simon kortare möte',
            slug: '/book/simon30minuter',
            description: 'Hej, boka ett 30 minuters möte med mig.',
            duration: 30,
            createdAt: 'Mar 28, 2025'
        },
        {
            id: '2',
            title: 'Meeting with Simon',
            slug: '/book/simonwernerzankl',
            description: 'Hej, boka gärna ett möte med mig på 60 minuter',
            duration: 60,
            createdAt: 'Mar 21, 2025'
        }
    ]);
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLink(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'title') {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
    };
    const handleCreateLink = (e) => {
        e.preventDefault();
        const newBookingLink = {
            id: Math.random().toString(36).substr(2, 9),
            ...newLink,
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setBookingLinks(prev => [...prev, newBookingLink]);
        setNewLink({ title: '', slug: '', description: '', duration: 60 });
    };
    const handleCopyLink = (slug) => {
        const baseUrl = 'https://preview--sunshine-web.lovable.app/book/';
        navigator.clipboard.writeText(baseUrl + slug.replace('/book/', ''));
    };
    const handleDeleteLink = (id) => {
        setBookingLinks(prev => prev.filter(link => link.id !== id));
    };
    return (react_1.default.createElement("div", { className: "p-6 max-w-4xl mx-auto" },
        react_1.default.createElement("div", { className: "mb-8" },
            react_1.default.createElement("h1", { className: "text-2xl font-bold text-gray-900" }, "Booking Links"),
            react_1.default.createElement("p", { className: "text-gray-600" }, "Create and manage your shareable booking links.")),
        react_1.default.createElement("div", { className: "bg-white rounded-lg border p-6 mb-8" },
            react_1.default.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Create New Booking Link"),
            react_1.default.createElement("form", { onSubmit: handleCreateLink, className: "space-y-4" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Link Title"),
                    react_1.default.createElement("input", { type: "text", name: "title", value: newLink.title, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", placeholder: "Meeting with John Doe", required: true })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "URL Slug"),
                    react_1.default.createElement("div", { className: "flex items-center" },
                        react_1.default.createElement("span", { className: "text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 rounded-l-lg" }, "https://preview--sunshine-web.lovable.app/book/"),
                        react_1.default.createElement("input", { type: "text", name: "slug", value: newLink.slug, onChange: handleInputChange, className: "flex-1 px-3 py-2 border border-l-0 rounded-r-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", placeholder: "john-doe", required: true }))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Description (Optional)"),
                    react_1.default.createElement("textarea", { name: "description", value: newLink.description, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", placeholder: "Book a meeting with me", rows: 3 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Meeting Duration (minutes)"),
                    react_1.default.createElement("input", { type: "number", name: "duration", value: newLink.duration, onChange: handleInputChange, className: "w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500", min: "15", max: "240", step: "15", required: true })),
                react_1.default.createElement("button", { type: "submit", className: "inline-flex items-center px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600" },
                    react_1.default.createElement("span", { className: "text-lg mr-2" }, "+"),
                    "Create Booking Link"))),
        react_1.default.createElement("div", null,
            react_1.default.createElement("h2", { className: "text-lg font-semibold mb-4" }, "Your Booking Links"),
            react_1.default.createElement("div", { className: "grid gap-4 md:grid-cols-2" }, bookingLinks.map(link => (react_1.default.createElement("div", { key: link.id, className: "bg-white rounded-lg border p-4" },
                react_1.default.createElement("div", { className: "flex justify-between items-start" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h3", { className: "font-medium text-gray-900" }, link.title),
                        react_1.default.createElement("p", { className: "text-gray-600 text-sm mt-1" }, link.description),
                        react_1.default.createElement("div", { className: "flex items-center text-gray-500 text-sm mt-2" },
                            react_1.default.createElement("span", { className: "mr-4" }, link.slug),
                            react_1.default.createElement("span", null,
                                link.duration,
                                " min")),
                        react_1.default.createElement("div", { className: "text-gray-400 text-sm mt-1" },
                            "Created ",
                            link.createdAt))),
                react_1.default.createElement("div", { className: "flex items-center mt-4 space-x-4" },
                    react_1.default.createElement("button", { onClick: () => handleCopyLink(link.slug), className: "text-sunshine-600 hover:text-sunshine-700 text-sm font-medium" }, "Copy"),
                    react_1.default.createElement("button", { className: "text-sunshine-600 hover:text-sunshine-700 text-sm font-medium" }, "Edit"),
                    react_1.default.createElement("button", { onClick: () => handleDeleteLink(link.id), className: "text-red-600 hover:text-red-700 text-sm font-medium ml-auto" }, "Delete")))))))));
};
exports.default = BookingLinksView;
