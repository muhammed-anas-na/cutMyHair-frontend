'use client';
import React, { useState } from 'react';
import { 
  Store, MapPin, Phone, Mail, Users, Camera, Plus, Pencil, 
  Trash2, Clock, ChevronDown, Save, X
} from 'lucide-react';

const SalonDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);

  // Sample salon data
  const [salonData, setSalonData] = useState({
    name: "Elegant Cuts Downtown",
    location: "123 Style Street, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "downtown@elegantcuts.com",
    seats: 8,
    openingHours: {
      mon: { open: "09:00", close: "20:00" },
      tue: { open: "09:00", close: "20:00" },
      wed: { open: "09:00", close: "20:00" },
      thu: { open: "09:00", close: "20:00" },
      fri: { open: "09:00", close: "21:00" },
      sat: { open: "10:00", close: "18:00" },
      sun: { open: "closed", close: "closed" }
    },
    photos: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200"
    ],
    employees: [
      { id: 1, name: "Sarah Johnson", role: "Senior Stylist", photo: "/api/placeholder/64/64", services: ["Haircut", "Color", "Styling"] },
      { id: 2, name: "Mike Wilson", role: "Stylist", photo: "/api/placeholder/64/64", services: ["Haircut", "Beard Trim"] },
      { id: 3, name: "Emma Davis", role: "Junior Stylist", photo: "/api/placeholder/64/64", services: ["Haircut", "Styling"] }
    ]
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    // Delete logic here
    setShowDeleteConfirm(false);
  };

  const handleAddEmployee = () => {
    setIsAddingEmployee(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-5">
      {/* Header */}
      <div className="bg-[#CE145B] rounded-xl p-6 text-white mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Store size={24} />
              {isEditing ? (
                <input 
                  type="text"
                  value={salonData.name}
                  onChange={(e) => setSalonData({...salonData, name: e.target.value})}
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
                  onChange={(e) => setSalonData({...salonData, location: e.target.value})}
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
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-[#CE145B] rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <Pencil size={16} />
                  Edit Salon
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="text-2xl font-semibold">{salonData.employees.length}</div>
            <div className="text-sm opacity-90">Total Employees</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="text-2xl font-semibold">{salonData.seats}</div>
            <div className="text-sm opacity-90">Styling Seats</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <div className="text-2xl font-semibold">4.8</div>
            <div className="text-sm opacity-90">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'details'
              ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Salon Details
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'employees'
              ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Employees
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'photos'
              ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Photos
        </button>
      </div>

      {/* Content Sections */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={salonData.phone}
                    onChange={(e) => setSalonData({...salonData, phone: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone size={16} />
                    <span>{salonData.phone}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={salonData.email}
                    onChange={(e) => setSalonData({...salonData, email: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={16} />
                    <span>{salonData.email}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Number of Seats</label>
                {isEditing ? (
                  <input
                    type="number"
                    value={salonData.seats}
                    onChange={(e) => setSalonData({...salonData, seats: parseInt(e.target.value)})}
                    className="w-full p-2 border rounded-lg"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={16} />
                    <span>{salonData.seats} Styling Seats</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h2>
            <div className="space-y-3">
              {Object.entries(salonData.openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center">
                  <span className="capitalize text-gray-700">{day}</span>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={hours.open}
                        onChange={(e) => setSalonData({
                          ...salonData,
                          openingHours: {
                            ...salonData.openingHours,
                            [day]: { ...hours, open: e.target.value }
                          }
                        })}
                        className="w-24 p-1 border rounded"
                      />
                      <span>-</span>
                      <input
                        type="text"
                        value={hours.close}
                        onChange={(e) => setSalonData({
                          ...salonData,
                          openingHours: {
                            ...salonData.openingHours,
                            [day]: { ...hours, close: e.target.value }
                          }
                        })}
                        className="w-24 p-1 border rounded"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-600">
                      {hours.open === 'closed' ? 'Closed' : `${hours.open} - ${hours.close}`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'employees' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Salon Employees</h2>
            <button
              onClick={handleAddEmployee}
              className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
            >
              <Plus size={16} />
              Add Employee
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salonData.employees.map((employee) => (
              <div key={employee.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={employee.photo}
                    alt={employee.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {employee.services.map((service, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  {isEditing && (
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Pencil size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'photos' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Salon Photos</h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
            >
              <Camera size={16} />
              Add Photos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {salonData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo}
                  alt={`Salon photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-[#CE145B]">
                      <Pencil size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {/* Add Photo Placeholder */}
            {isEditing && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-[#CE145B] hover:bg-pink-50 transition-colors">
                <div className="flex flex-col items-center text-gray-500 hover:text-[#CE145B]">
                  <Camera size={24} />
                  <span className="text-sm mt-2">Add Photo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Salon</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{salonData.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Employee</h3>
              <button 
                onClick={() => setIsAddingEmployee(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input type="text" className="w-full p-2 border rounded-lg" placeholder="Employee name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="senior">Senior Stylist</option>
                  <option value="stylist">Stylist</option>
                  <option value="junior">Junior Stylist</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Services</label>
                <div className="space-y-2">
                  {["Haircut", "Color", "Styling", "Beard Trim", "Hair Treatment"].map((service) => (
                    <label key={service} className="flex items-center gap-2">
                      <input type="checkbox" className="rounded text-[#CE145B]" />
                      <span className="text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Profile Photo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Camera size={24} className="mx-auto text-gray-400 mb-2" />
                  <div className="text-sm text-gray-500">
                    Drop an image here or click to upload
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
                Add Employee
              </button>
              <button 
                onClick={() => setIsAddingEmployee(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalonDetails;