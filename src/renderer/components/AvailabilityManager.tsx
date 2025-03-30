import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface BookingLink {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: number;
  availability_slots: string[];
  timezone: string;
  created_at: string;
  updated_at: string;
}

interface AvailabilitySlot {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  recurrence?: string;
  buffer_before?: number;
  buffer_after?: number;
  created_at: string;
  updated_at: string;
}

interface AvailabilityManagerProps {
  onCreateBookingLink: (data: Partial<BookingLink>) => Promise<void>;
  onUpdateBookingLink: (id: string, data: Partial<BookingLink>) => Promise<void>;
  onDeleteBookingLink: (id: string) => Promise<void>;
}

const AvailabilityManager: React.FC<AvailabilityManagerProps> = ({
  onCreateBookingLink,
  onUpdateBookingLink,
  onDeleteBookingLink,
}) => {
  const [bookingLinks, setBookingLinks] = useState<BookingLink[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [newLink, setNewLink] = useState<Partial<BookingLink>>({
    title: '',
    description: '',
    duration: 30,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    // TODO: Fetch booking links and availability slots from Supabase
    // This will be implemented when we integrate with the backend
  }, []);

  const handleCreateLink = async (e: React.FormEvent) => {
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
    } catch (error) {
      console.error('Error creating booking link:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Availability Slots</h2>
        <div className="space-y-4">
          {availabilitySlots.map((slot) => (
            <div
              key={slot.id}
              className="bg-white p-4 rounded-lg shadow border hover:border-sunshine-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {format(new Date(slot.start_time), 'MMM d, yyyy h:mm a')} -{' '}
                    {format(new Date(slot.end_time), 'h:mm a')}
                  </p>
                  {slot.recurrence && (
                    <p className="text-sm text-gray-500">
                      Repeats {slot.recurrence}
                    </p>
                  )}
                  {(slot.buffer_before || slot.buffer_after) && (
                    <p className="text-sm text-gray-500">
                      Buffer: {slot.buffer_before && `${slot.buffer_before}min before`}{' '}
                      {slot.buffer_before && slot.buffer_after && '/'}{' '}
                      {slot.buffer_after && `${slot.buffer_after}min after`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Booking Links</h2>
        <div className="space-y-4">
          {bookingLinks.map((link) => (
            <div
              key={link.id}
              className="bg-white p-4 rounded-lg shadow border hover:border-sunshine-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{link.title}</h3>
                  <p className="text-gray-500 text-sm">{link.description}</p>
                  <p className="text-sm text-sunshine-600">
                    sunshine.app/{link.slug} • {link.duration} minutes
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onDeleteBookingLink(link.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCreatingLink ? (
        <form onSubmit={handleCreateLink} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Create New Booking Link</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newLink.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setNewLink({
                    ...newLink,
                    title,
                    slug: generateSlug(title),
                  });
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-sunshine-500 focus:border-sunshine-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newLink.description}
                onChange={(e) =>
                  setNewLink({ ...newLink, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-sunshine-500 focus:border-sunshine-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newLink.duration}
                onChange={(e) =>
                  setNewLink({ ...newLink, duration: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-sunshine-500 focus:border-sunshine-500"
                min={15}
                step={15}
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsCreatingLink(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600"
              >
                Create Link
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsCreatingLink(true)}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-sunshine-500 hover:border-sunshine-500 transition-colors"
        >
          + Create New Booking Link
        </button>
      )}
    </div>
  );
};

export default AvailabilityManager; 