// SalonHeader.jsx
import React from 'react';
import { Store, MapPin, Save, X, Pencil, Trash2 } from 'lucide-react';

const SalonHeader = ({ salonData, isEditing, setIsEditing, handleSave, handleDelete, setSalonData }) => (
  <div className="bg-[#CE145B] rounded-xl p-6 text-white mb-8">
    <div className="flex justify-between items-start mb-4">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Store size={24} />
          {isEditing ? (
            <input
              type="text"
              value={salonData.name}
              onChange={(e) => setSalonData({ ...salonData, name: e.target.value })}
              className="bg-white bg-opacity-10 rounded px-2 py-1 text-2xl font-semibold"
            />
          ) : (
            <h1 className="text-2xl font-semibold">{salonData.name}</h1>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <MapPin size={16} />
          {isEditing ? (
            <input
              type="text"
              value={salonData.location}
              onChange={(e) => setSalonData({ ...salonData, location: e.target.value })}
              className="bg-white bg-opacity-10 rounded px-2 py-1"
            />
          ) : (
            <span>{salonData.location}</span>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white text-[#CE145B] rounded-lg hover:bg-opacity-90 transition-colors">
              <Save size={16} /> Save Changes
            </button>
            <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
              <X size={16} /> Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
              <Pencil size={16} /> Edit Salon
            </button>
            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors">
              <Trash2 size={16} /> Delete
            </button>
          </>
        )}
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-white bg-opacity-10 rounded-lg p-4">
        <div className="text-2xl font-semibold">{salonData.employees?.length || 0}</div>
        <div className="text-sm opacity-90">Total Employees</div>
      </div>
      <div className="bg-white bg-opacity-10 rounded-lg p-4">
        <div className="text-2xl font-semibold">{salonData.seats}</div>
        <div className="text-sm opacity-90">Styling Seats</div>
      </div>
      <div className="bg-white bg-opacity-10 rounded-lg p-4">
        <div className="text-2xl font-semibold">{salonData.rating.toFixed(1)}</div>
        <div className="text-sm opacity-90">Average Rating</div>
      </div>
    </div>
  </div>
);

export default SalonHeader