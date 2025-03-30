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
const CompanyProfile = ({ initialData, onSave }) => {
    const [name, setName] = (0, react_1.useState)(initialData?.name || '');
    const [username, setUsername] = (0, react_1.useState)(initialData?.username || '');
    const [brandColor, setBrandColor] = (0, react_1.useState)(initialData?.brandColor || '#FFC51E');
    const [logo, setLogo] = (0, react_1.useState)(null);
    const [previewLogo, setPreviewLogo] = (0, react_1.useState)(initialData?.logo);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSave({
                name,
                username,
                logo: logo || undefined,
                brandColor,
            });
        }
        catch (error) {
            console.error('Error saving company profile:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (react_1.default.createElement("div", { className: "max-w-2xl mx-auto py-6 px-4" },
        react_1.default.createElement("h2", { className: "text-2xl font-bold text-gray-900 mb-6" }, "Company Profile"),
        react_1.default.createElement("form", { onSubmit: handleSubmit, className: "space-y-6" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Company Logo"),
                react_1.default.createElement("div", { className: "flex items-center space-x-6" },
                    react_1.default.createElement("div", { className: "w-24 h-24 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden" }, previewLogo ? (react_1.default.createElement("img", { src: previewLogo, alt: "Company logo", className: "w-full h-full object-cover" })) : (react_1.default.createElement("span", { className: "text-gray-400" }, "No logo"))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("input", { type: "file", accept: "image/*", onChange: handleLogoChange, className: "hidden", id: "logo-upload" }),
                        react_1.default.createElement("label", { htmlFor: "logo-upload", className: "cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50" }, "Change Logo")))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Company Name"),
                react_1.default.createElement("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sunshine-500 focus:border-sunshine-500", required: true })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Username"),
                react_1.default.createElement("div", { className: "flex rounded-md shadow-sm" },
                    react_1.default.createElement("span", { className: "inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm" }, "sunshine.app/"),
                    react_1.default.createElement("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), className: "flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-sunshine-500 focus:border-sunshine-500", required: true }))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Brand Color"),
                react_1.default.createElement("div", { className: "flex items-center space-x-4" },
                    react_1.default.createElement("input", { type: "color", value: brandColor, onChange: (e) => setBrandColor(e.target.value), className: "h-10 w-20 p-1 rounded border border-gray-300" }),
                    react_1.default.createElement("input", { type: "text", value: brandColor, onChange: (e) => setBrandColor(e.target.value), className: "w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sunshine-500 focus:border-sunshine-500", pattern: "^#[0-9A-Fa-f]{6}$", placeholder: "#000000" }))),
            react_1.default.createElement("div", { className: "flex justify-end" },
                react_1.default.createElement("button", { type: "submit", disabled: isLoading, className: `px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sunshine-500 hover:bg-sunshine-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunshine-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}` }, isLoading ? 'Saving...' : 'Save Changes')))));
};
exports.default = CompanyProfile;
