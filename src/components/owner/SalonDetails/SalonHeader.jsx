// SalonHeader.jsx
import React from 'react';
import { Store, MapPin, Save, X, Pencil, Trash2 } from 'lucide-react';

const SalonHeader = ({ salonData, isEditing, setIsEditing, handleSave, handleDelete, setSalonData }) => (
  <div className="bg-[#CE145B] rounded-lg sm:rounded-xl p-4 sm:p-6 text-white mb-4 sm:mb-6 md:mb-8 shadow-md">
    {/* Header Content */}
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 sm:gap-0 mb-4">
      {/* Salon Name and Location */}
      <div className="w-full sm:w-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Store size={20} className="flex-shrink-0" />
          {isEditing ? (
            <input
              type="text"
              value={salonData.name}
              onChange={(e) => setSalonData({ ...salonData, name: e.target.value })}
              className="bg-white bg-opacity-10 rounded px-2 py-1 text-xl sm:text-2xl font-semibold w-full"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-semibold break-words">{salonData.name}</h1>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm opacity-90">
          <MapPin size={14} className="flex-shrink-0" />
          {isEditing ? (
            <input
              type="text"
              value={salonData.location}
              onChange={(e) => setSalonData({ ...salonData, location: e.target.value })}
              className="bg-white bg-opacity-10 rounded px-2 py-1 w-full"
            />
          ) : (
            <span className="break-words">{salonData.location}</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0">
        {isEditing ? (
          <>
            <button 
              onClick={handleSave} 
              className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white text-[#CE145B] rounded-lg hover:bg-opacity-90 transition-colors text-sm sm:text-base font-medium flex-1 sm:flex-auto"
            >
              <Save size={16} className="flex-shrink-0" /> <span>Save</span>
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors text-sm sm:text-base flex-1 sm:flex-auto"
            >
              <X size={16} className="flex-shrink-0" /> <span>Cancel</span>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors text-sm sm:text-base flex-1 sm:flex-auto"
            >
              <Pencil size={16} className="flex-shrink-0" /> <span>Edit</span>
            </button>
            <button 
              onClick={handleDelete} 
              className="flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors text-sm sm:text-base flex-1 sm:flex-auto"
            >
              <Trash2 size={16} className="flex-shrink-0" /> <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
      <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-lg sm:text-xl md:text-2xl font-semibold">{salonData.employees?.length || 0}</div>
        <div className="text-xs sm:text-sm opacity-90 truncate">Employees</div>
      </div>
      <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-lg sm:text-xl md:text-2xl font-semibold">{salonData.seats}</div>
        <div className="text-xs sm:text-sm opacity-90 truncate">Seats</div>
      </div>
      <div className="bg-white bg-opacity-10 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-lg sm:text-xl md:text-2xl font-semibold">{salonData.rating.toFixed(1)}</div>
        <div className="text-xs sm:text-sm opacity-90 truncate">Rating</div>
      </div>
    </div>
  </div>
);

export default SalonHeader;