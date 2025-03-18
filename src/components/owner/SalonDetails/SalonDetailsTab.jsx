// SalonDetailsTab.jsx
import React from 'react';
import { Phone, Mail, Users } from 'lucide-react';
import { formatTo12HourIST } from '@/helpers';

const SalonDetailsTab = ({ salonData, isEditing, setSalonData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
          {isEditing ? (
            <input type="tel" value={salonData.phone} onChange={(e) => setSalonData({ ...salonData, phone: e.target.value })} className="w-full p-2 border rounded-lg" />
          ) : (
            <div className="flex items-center gap-2 text-gray-700"><Phone size={16} /><span>{salonData.phone}</span></div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          {isEditing ? (
            <input type="email" value={salonData.email || ''} onChange={(e) => setSalonData({ ...salonData, email: e.target.value })} className="w-full p-2 border rounded-lg" />
          ) : (
            <div className="flex items-center gap-2 text-gray-700"><Mail size={16} /><span>{salonData.email || 'Not provided'}</span></div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Number of Seats</label>
          {isEditing ? (
            <input type="number" value={salonData.seats} onChange={(e) => setSalonData({ ...salonData, seats: parseInt(e.target.value) })} className="w-full p-2 border rounded-lg" />
          ) : (
            <div className="flex items-center gap-2 text-gray-700"><Users size={16} /><span>{salonData.seats} Styling Seats</span></div>
          )}
        </div>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h2>
      <div className="space-y-3">
        {Object.entries(salonData.openingHours).map(([day, hours]) => (
          <div key={day} className="flex justify-between items-center">
            <span className="capitalize text-gray-700">{day === "mon" ? "Monday" : day === "tue" ? "Tuesday" : day === "wed" ? "Wednesday" : day === "thu" ? "Thursday" : day === "fri" ? "Friday" : day === "sat" ? "Saturday" : "Sunday"}</span>
            {isEditing ? (
              <div className="flex gap-2">
                <select value={hours.open === "closed" ? "closed" : hours.open} onChange={(e) => setSalonData({ ...salonData, openingHours: { ...salonData.openingHours, [day]: { ...hours, open: e.target.value, close: e.target.value === "closed" ? "closed" : hours.close } } })} className="w-24 p-1 border rounded">
                  <option value="closed">Closed</option>
                  {Array.from({ length: 24 }).map((_, i) => { const hour = i.toString().padStart(2, "0"); return <option key={hour} value={`${hour}:00`}>{formatTo12HourIST(`${hour}:00`)}</option> })}
                </select>
                <span>-</span>
                <select value={hours.close === "closed" ? "closed" : hours.close} onChange={(e) => setSalonData({ ...salonData, openingHours: { ...salonData.openingHours, [day]: { ...hours, close: e.target.value } } })} className="w-24 p-1 border rounded" disabled={hours.open === "closed"}>
                  <option value="closed">Closed</option>
                  {Array.from({ length: 24 }).map((_, i) => { const hour = i.toString().padStart(2, "0"); return <option key={hour} value={`${hour}:00`}>{formatTo12HourIST(`${hour}:00`)}</option> })}
                </select>
              </div>
            ) : (
              <span className="text-gray-600">{hours.open === "closed" ? "Closed" : `${formatTo12HourIST(hours.open)} - ${formatTo12HourIST(hours.close)}`}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SalonDetailsTab;