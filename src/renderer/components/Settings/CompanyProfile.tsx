import React, { useState } from 'react';

interface CompanyProfileProps {
  initialData?: {
    name: string;
    username: string;
    logo?: string;
    brandColor?: string;
  };
  onSave: (data: {
    name: string;
    username: string;
    logo?: File;
    brandColor: string;
  }) => Promise<void>;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ initialData, onSave }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [username, setUsername] = useState(initialData?.username || '');
  const [brandColor, setBrandColor] = useState(initialData?.brandColor || '#FFC51E');
  const [logo, setLogo] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState(initialData?.logo);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave({
        name,
        username,
        logo: logo || undefined,
        brandColor,
      });
    } catch (error) {
      console.error('Error saving company profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Company Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Logo
          </label>
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 rounded-lg border-2 border-gray-300 flex items-center justify-center overflow-hidden">
              {previewLogo ? (
                <img
                  src={previewLogo}
                  alt="Company logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No logo</span>
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Change Logo
              </label>
            </div>
          </div>
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sunshine-500 focus:border-sunshine-500"
            required
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              sunshine.app/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-sunshine-500 focus:border-sunshine-500"
              required
            />
          </div>
        </div>

        {/* Brand Color */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-10 w-20 p-1 rounded border border-gray-300"
            />
            <input
              type="text"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sunshine-500 focus:border-sunshine-500"
              pattern="^#[0-9A-Fa-f]{6}$"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sunshine-500 hover:bg-sunshine-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sunshine-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile; 