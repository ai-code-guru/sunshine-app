import React, { useState } from 'react';

interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  recurrence: 'weekly' | 'daily' | 'none';
  bufferBefore: number;
  bufferAfter: number;
}

const AvailabilityView: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([
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

  const [newSlot, setNewSlot] = useState<Omit<AvailabilitySlot, 'id'>>({
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    recurrence: 'weekly',
    bufferBefore: 15,
    bufferAfter: 15
  });

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSlot(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newAvailabilitySlot: AvailabilitySlot = {
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

  const handleDeleteSlot = (id: string) => {
    setSlots(prev => prev.filter(slot => slot.id !== id));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Availability Management</h1>
        <p className="text-gray-600">Set your regular availability for meetings.</p>
      </div>

      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Add New Availability</h2>
        <form onSubmit={handleCreateSlot} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select
                name="dayOfWeek"
                value={newSlot.dayOfWeek}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
              <select
                name="recurrence"
                value={newSlot.recurrence}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="none">One-time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                name="startTime"
                value={newSlot.startTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                name="endTime"
                value={newSlot.endTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Before (minutes)</label>
              <input
                type="number"
                name="bufferBefore"
                value={newSlot.bufferBefore}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
                min="0"
                max="60"
                step="5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Buffer After (minutes)</label>
              <input
                type="number"
                name="bufferAfter"
                value={newSlot.bufferAfter}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-sunshine-500 focus:border-sunshine-500"
                min="0"
                max="60"
                step="5"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-sunshine-500 text-white rounded-lg hover:bg-sunshine-600"
          >
            <span className="text-lg mr-2">+</span>
            Add Availability
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Your Availability</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {slots.map(slot => (
            <div key={slot.id} className="bg-white rounded-lg border p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{slot.dayOfWeek}</h3>
                  <div className="text-gray-600 text-sm mt-1">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <div className="text-gray-500 text-sm mt-2">
                    <span className="capitalize">{slot.recurrence}</span> recurrence
                  </div>
                  <div className="text-gray-500 text-sm mt-1">
                    Buffer: {slot.bufferBefore}min before, {slot.bufferAfter}min after
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSlot(slot.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
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

export default AvailabilityView; 