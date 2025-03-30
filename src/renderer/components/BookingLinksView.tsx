import React, { useState } from 'react';

interface BookingLink {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  createdAt: string;
}

const BookingLinksView: React.FC = () => {
  const [newLink, setNewLink] = useState({
    title: '',
    slug: '',
    description: '',
    duration: 60
  });

  const [bookingLinks, setBookingLinks] = useState<BookingLink[]>([
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLink(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const newBookingLink: BookingLink = {
      id: Math.random().toString(36).substr(2, 9),
      ...newLink,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setBookingLinks(prev => [...prev, newBookingLink]);
    setNewLink({ title: '', slug: '', description: '', duration: 60 });
  };

  const handleCopyLink = (slug: string) => {
    const baseUrl = 'https://preview--sunshine-web.lovable.app/book/';
    navigator.clipboard.writeText(baseUrl + slug.replace('/book/', ''));
  };

  const handleDeleteLink = (id: string) => {
    setBookingLinks(prev => prev.filter(link => link.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Booking Links</h1>
        <p className="text-gray-600">Create and manage your shareable booking links.</p>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Booking Link</h2>
        <form onSubmit={handleCreateLink} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Title</label>
            <input
              type="text"
              name="title"
              value={newLink.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
              placeholder="Meeting with John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug</label>
            <div className="flex items-center">
              <span className="text-gray-500 bg-gray-50 px-3 py-2 border border-r-0 rounded-l-lg">
                https://preview--sunshine-web.lovable.app/book/
              </span>
              <input
                type="text"
                name="slug"
                value={newLink.slug}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-l-0 rounded-r-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
                placeholder="john-doe"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              name="description"
              value={newLink.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
              placeholder="Book a meeting with me"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={newLink.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
              min="15"
              max="240"
              step="15"
              required
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600"
          >
            <span className="text-lg mr-2">+</span>
            Create Booking Link
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Your Booking Links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {bookingLinks.map(link => (
            <div key={link.id} className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{link.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{link.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <span className="mr-4">{link.slug}</span>
                    <span>{link.duration} min</span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">
                    Created {link.createdAt}
                  </div>
                </div>
              </div>
              <div className="flex items-center mt-4 space-x-4">
                <button
                  onClick={() => handleCopyLink(link.slug)}
                  className="text-sunshine-600 hover:text-sunshine-700 text-sm font-medium"
                >
                  Copy
                </button>
                <button
                  className="text-sunshine-600 hover:text-sunshine-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteLink(link.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingLinksView; 