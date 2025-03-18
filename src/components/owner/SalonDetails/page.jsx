// 'use client';
// import React, { useEffect, useState } from 'react';
// import {
//   Store, MapPin, Phone, Mail, Users, Camera, Plus, Pencil,
//   Trash2, Clock, ChevronDown, Save, X
// } from 'lucide-react';
// import { ADD_SERVICE_FOR_SALON_FN, FETCH_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';
// import { formatTo12HourIST } from '@/helpers';
// const SalonDetails = ({ salon_id }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [activeTab, setActiveTab] = useState('details');
//   const [isAddingEmployee, setIsAddingEmployee] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [salonData, setSalonData] = useState(null);
//   const [error, setError] = useState(null);
//   const [showAddServiceModal, setShowAddServiceModal] = useState(false);
//   const [newService, setNewService] = useState({
//     name: '',
//     description: '',
//     price: '',
//     duration: '',
//     category: '',
//     status: 'available'
//   });
//   // Add this function to handle form input changes
//   const handleServiceInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewService(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };
//   const handleAddService = async (e) => {
//     e.preventDefault();
//     try{
//       const response = await ADD_SERVICE_FOR_SALON_FN(
//         salonData.salon_id,
//         newService.name,
//         newService.description,
//         newService.price,
//         newService.duration,
//         newService.category,
//         newService.status
//       );
//       if(response.status == 200){
//         setShowAddServiceModal(false);
//         setSalonData(prevData => ({
//           ...prevData,
//           services: [...(prevData.services || []), response.data.data]
//         }));
//         setNewService({
//           name: '',
//           description: '',
//           price: '',
//           duration: '',
//           category: '',
//           status: 'available'
//         });
//       }
//     }catch(err){
//       console.log(err);
//     }
//   }



//   useEffect(() => {
//     const fetchData = async (salon_id) => {
//       setIsLoading(true);
//       try {
//         const response = await FETCH_SALON_DETAILS_BY_ID_FN(salon_id);
//         if (response?.data?.data) {
//           // Format the data correctly
//           const salon = response.data.data;
// console.log(salon);
//           // Convert working hours to the format the UI expects
//           const formattedHours = {};
//           const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

//           days.forEach(day => {
//             const dayData = salon.working_hours[day];
//             if (dayData.isOpen) {
//               // Extract just the time part (HH:MM) from the ISO string
//               const startTime = dayData.start ? dayData.start.split('T')[1].slice(0, 5) : 'closed';
//               const endTime = dayData.end ? dayData.end.split('T')[1].slice(0, 5) : 'closed';

//               formattedHours[day.substring(0, 3)] = { open: startTime, close: endTime };
//             } else {
//               formattedHours[day.substring(0, 3)] = { open: 'closed', close: 'closed' };
//             }
//           });

//           // Create a formatted salon data object
//           const formattedSalon = {
//             salon_id: salon.salon_id,
//             name: salon.name,
//             location: salon.location_text || salon.address || '',
//             phone: salon.contact_phone || '',
//             email: salon.email || '',
//             seats: salon.number_of_seats || 0,
//             openingHours: formattedHours,
//             photos: salon.images,
//             employees: salon.employees || [],
//             rating: salon.rating || 0,
//             services: salon.services
//           };
// console.log("formattedHours==>",formattedHours)
//           setSalonData(formattedSalon);
//         } else {
//           setError('Failed to load salon data');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Error fetching salon data');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (salon_id) {
//       fetchData(salon_id);
//     }
//   }, [salon_id]);

//   const handleSave = async () => {
//     // Here you would implement an API call to save the updated data
//     // For example:
//     // try {
//     //   await UPDATE_SALON_DETAILS_FN(salon_id, transformedSalonData);
//     //   setIsEditing(false);
//     // } catch (err) {
//     //   console.error(err);
//     //   // Show error notification
//     // }

//     setIsEditing(false);
//   };

//   const handleDelete = () => {
//     setShowDeleteConfirm(true);
//   };

//   const handleDeleteConfirm = async () => {

//     setShowDeleteConfirm(false);
//   };

//   const handleAddEmployee = () => {
//     setIsAddingEmployee(true);
//   };

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="max-w-6xl mx-auto p-5 text-center">
//         <div className="py-10">Loading salon details...</div>
//       </div>
//     );
//   }

//   // Show error message
//   if (error || !salonData) {
//     return (
//       <div className="max-w-6xl mx-auto p-5">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error || 'Could not load salon details'}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-5">
//       {/* Header */}
//       <div className="bg-[#CE145B] rounded-xl p-6 text-white mb-8">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <div className="flex items-center gap-3 mb-2">
//               <Store size={24} />
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={salonData.name}
//                   onChange={(e) => setSalonData({ ...salonData, name: e.target.value })}
//                   className="bg-white bg-opacity-10 rounded px-2 py-1 text-2xl font-semibold"
//                 />
//               ) : (
//                 <h1 className="text-2xl font-semibold">{salonData.name}</h1>
//               )}
//             </div>
//             <div className="flex items-center gap-2 text-sm opacity-90">
//               <MapPin size={16} />
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={salonData.location}
//                   onChange={(e) => setSalonData({ ...salonData, location: e.target.value })}
//                   className="bg-white bg-opacity-10 rounded px-2 py-1"
//                 />
//               ) : (
//                 <span>{salonData.location}</span>
//               )}
//             </div>
//           </div>
//           <div className="flex gap-2">
//             {isEditing ? (
//               <>
//                 <button
//                   onClick={handleSave}
//                   className="flex items-center gap-2 px-4 py-2 bg-white text-[#CE145B] rounded-lg hover:bg-opacity-90 transition-colors"
//                 >
//                   <Save size={16} />
//                   Save Changes
//                 </button>
//                 <button
//                   onClick={() => setIsEditing(false)}
//                   className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
//                 >
//                   <X size={16} />
//                   Cancel
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
//                 >
//                   <Pencil size={16} />
//                   Edit Salon
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
//                 >
//                   <Trash2 size={16} />
//                   Delete
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
//           <div className="bg-white bg-opacity-10 rounded-lg p-4">
//             <div className="text-2xl font-semibold">{salonData.employees?.length || 0}</div>
//             <div className="text-sm opacity-90">Total Employees</div>
//           </div>
//           <div className="bg-white bg-opacity-10 rounded-lg p-4">
//             <div className="text-2xl font-semibold">{salonData.seats}</div>
//             <div className="text-sm opacity-90">Styling Seats</div>
//           </div>
//           <div className="bg-white bg-opacity-10 rounded-lg p-4">
//             <div className="text-2xl font-semibold">{salonData.rating.toFixed(1)}</div>
//             <div className="text-sm opacity-90">Average Rating</div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="flex gap-4 border-b border-gray-200 mb-6">
//         <button
//           onClick={() => setActiveTab('details')}
//           className={`px-4 py-2 font-medium ${activeTab === 'details'
//             ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
//             : 'text-gray-600 hover:text-gray-900'
//             }`}
//         >
//           Salon Details
//         </button>
//         <button
//           onClick={() => setActiveTab('services')}
//           className={`px-4 py-2 font-medium ${activeTab === 'services'
//             ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
//             : 'text-gray-600 hover:text-gray-900'
//             }`}
//         >
//           Services
//         </button>
//         <button
//           onClick={() => setActiveTab('employees')}
//           className={`px-4 py-2 font-medium ${activeTab === 'employees'
//             ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
//             : 'text-gray-600 hover:text-gray-900'
//             }`}
//         >
//           Employees
//         </button>
//         <button
//           onClick={() => setActiveTab('photos')}
//           className={`px-4 py-2 font-medium ${activeTab === 'photos'
//             ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
//             : 'text-gray-600 hover:text-gray-900'
//             }`}
//         >
//           Photos
//         </button>
//       </div>

//       {/* Content Sections */}
//       {activeTab === 'details' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Contact Information */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     value={salonData.phone}
//                     onChange={(e) => setSalonData({ ...salonData, phone: e.target.value })}
//                     className="w-full p-2 border rounded-lg"
//                   />
//                 ) : (
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <Phone size={16} />
//                     <span>{salonData.phone}</span>
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
//                 {isEditing ? (
//                   <input
//                     type="email"
//                     value={salonData.email || ''}
//                     onChange={(e) => setSalonData({ ...salonData, email: e.target.value })}
//                     className="w-full p-2 border rounded-lg"
//                   />
//                 ) : (
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <Mail size={16} />
//                     <span>{salonData.email || 'Not provided'}</span>
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Number of Seats</label>
//                 {isEditing ? (
//                   <input
//                     type="number"
//                     value={salonData.seats}
//                     onChange={(e) => setSalonData({ ...salonData, seats: parseInt(e.target.value) })}
//                     className="w-full p-2 border rounded-lg"
//                   />
//                 ) : (
//                   <div className="flex items-center gap-2 text-gray-700">
//                     <Users size={16} />
//                     <span>{salonData.seats} Styling Seats</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Opening Hours */}
//           <div className="bg-white rounded-xl shadow-sm p-6">
//   <h2 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h2>
//   <div className="space-y-3">
//     {Object.entries(salonData.openingHours).map(([day, hours]) => (
//       <div key={day} className="flex justify-between items-center">
//         <span className="capitalize text-gray-700">
//           {day === "mon"
//             ? "Monday"
//             : day === "tue"
//             ? "Tuesday"
//             : day === "wed"
//             ? "Wednesday"
//             : day === "thu"
//             ? "Thursday"
//             : day === "fri"
//             ? "Friday"
//             : day === "sat"
//             ? "Saturday"
//             : "Sunday"}
//         </span>
//         {isEditing ? (
//           <div className="flex gap-2">
//             <select
//               value={hours.open === "closed" ? "closed" : hours.open}
//               onChange={(e) =>
//                 setSalonData({
//                   ...salonData,
//                   openingHours: {
//                     ...salonData.openingHours,
//                     [day]: {
//                       ...hours,
//                       open: e.target.value,
//                       close: e.target.value === "closed" ? "closed" : hours.close,
//                     },
//                   },
//                 })
//               }
//               className="w-24 p-1 border rounded"
//             >
//               <option value="closed">Closed</option>
//               {Array.from({ length: 24 }).map((_, i) => {
//                 const hour = i.toString().padStart(2, "0");
//                 return (
//                   <option key={hour} value={`${hour}:00`}>
//                     {formatTo12HourIST(`${hour}:00`)}
//                   </option>
//                 );
//               })}
//             </select>
//             <span>-</span>
//             <select
//               value={hours.close === "closed" ? "closed" : hours.close}
//               onChange={(e) =>
//                 setSalonData({
//                   ...salonData,
//                   openingHours: {
//                     ...salonData.openingHours,
//                     [day]: { ...hours, close: e.target.value },
//                   },
//                 })
//               }
//               className="w-24 p-1 border rounded"
//               disabled={hours.open === "closed"}
//             >
//               <option value="closed">Closed</option>
//               {Array.from({ length: 24 }).map((_, i) => {
//                 const hour = i.toString().padStart(2, "0");
//                 return (
//                   <option key={hour} value={`${hour}:00`}>
//                     {formatTo12HourIST(`${hour}:00`)}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//         ) : (
//           <span className="text-gray-600">
//             {hours.open === "closed"
//               ? "Closed"
//               : `${formatTo12HourIST(hours.open)} - ${formatTo12HourIST(hours.close)}`}
//           </span>
//         )}
//       </div>
//     ))}
//   </div>
// </div>
//         </div>
//       )}

//       {activeTab === 'services' && (
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Salon Services</h2>
//             <button
//               onClick={() => setShowAddServiceModal(true)}
//               className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
//             >
//               <Plus size={16} />
//               Add Service
//             </button>
//           </div>

//           {/* Services List */}
//           {salonData.services && salonData.services.length > 0 ? (
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     {isEditing && (
//                       <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                     )}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {salonData.services.map((service) => (
//                     <tr key={service.service_id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">{service.name}</div>
//                         {service.description && (
//                           <div className="text-xs text-gray-500 mt-1">{service.description}</div>
//                         )}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.category === 'Female' ? 'bg-pink-100 text-pink-800' :
//                             service.category === 'Male' ? 'bg-blue-100 text-blue-800' :
//                               'bg-purple-100 text-purple-800'
//                           }`}>
//                           {service.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {service.duration}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       ₹{service.price}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                           }`}>
//                           {service.status === 'available' ? 'Available' : 'Unavailable'}
//                         </span>
//                       </td>
//                       {isEditing && (
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button className="text-[#CE145B] hover:text-[#CE145B]/80 mr-3">
//                             <Pencil size={16} />
//                           </button>
//                           <button className="text-red-600 hover:text-red-800">
//                             <Trash2 size={16} />
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="bg-gray-50 rounded-xl p-8 text-center">
//               <Store size={48} className="mx-auto text-gray-300 mb-4" />
//               <h3 className="text-lg font-medium text-gray-700 mb-2">No Services Added Yet</h3>
//               <p className="text-gray-500 mb-4">Add services to your salon for your customers to book.</p>
//               <button
//                 onClick={() => setShowAddServiceModal(true)}
//                 className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add First Service
//               </button>
//             </div>
//           )}

//           {/* Add Service Modal */}
//           {showAddServiceModal && (
//             <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
//               <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-semibold text-gray-900">Add New Service</h3>
//                   <button
//                     onClick={() => setShowAddServiceModal(false)}
//                     className="p-2 hover:bg-gray-100 rounded-full"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <form onSubmit={handleAddService} className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Service Name*</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={newService.name}
//                       onChange={handleServiceInputChange}
//                       className="w-full p-2 border rounded-lg"
//                       placeholder="e.g. Haircut & Styling"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
//                     <textarea
//                       name="description"
//                       value={newService.description}
//                       onChange={handleServiceInputChange}
//                       className="w-full p-2 border rounded-lg"
//                       placeholder="Brief description of the service"
//                       rows="3"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)*</label>
//                       <input
//                         type="text"
//                         name="price"
//                         value={newService.price}
//                         onChange={handleServiceInputChange}
//                         className="w-full p-2 border rounded-lg"
//                         placeholder="e.g. 25.00"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Duration*</label>
//                       <input
//                         type="text"
//                         name="duration"
//                         value={newService.duration}
//                         onChange={handleServiceInputChange}
//                         className="w-full p-2 border rounded-lg"
//                         placeholder="e.g. 30min"
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Category*</label>
//                     <select
//                       name="category"
//                       value={newService.category}
//                       onChange={handleServiceInputChange}
//                       className="w-full p-2 border rounded-lg"
//                       required
//                     >
//                       <option value="">Select category</option>
//                       <option value="Female">Female</option>
//                       <option value="Male">Male</option>
//                       <option value="Unisex">Unisex</option>
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Status*</label>
//                     <div className="flex gap-4">
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="available"
//                           checked={newService.status === 'available'}
//                           onChange={handleServiceInputChange}
//                           className="text-[#CE145B]"
//                         />
//                         <span>Available</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <input
//                           type="radio"
//                           name="status"
//                           value="unavailable"
//                           checked={newService.status === 'unavailable'}
//                           onChange={handleServiceInputChange}
//                           className="text-[#CE145B]"
//                         />
//                         <span>Unavailable</span>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="mt-6 flex gap-3">
//                     <button
//                     onClick={handleAddService}
//                       type="submit"
//                       className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
//                     >
//                       Add Service
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => setShowAddServiceModal(false)}
//                       className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'employees' && (
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Salon Employees</h2>
//             <button
//               onClick={handleAddEmployee}
//               className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
//             >
//               <Plus size={16} />
//               Add Employee
//             </button>
//           </div>

//           {salonData.employees && salonData.employees.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {salonData.employees.map((employee) => (
//                 <div key={employee.id} className="bg-white rounded-xl shadow-sm p-4">
//                   <div className="flex items-start gap-4">
//                     <img
//                       src={employee.photo || "/api/placeholder/64/64"}
//                       alt={employee.name}
//                       className="w-16 h-16 rounded-full object-cover"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-semibold text-gray-900">{employee.name}</h3>
//                       <p className="text-sm text-gray-600">{employee.role}</p>
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {employee.services && employee.services.map((service, index) => (
//                           <span
//                             key={index}
//                             className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
//                           >
//                             {service}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                     {isEditing && (
//                       <button className="p-2 text-gray-400 hover:text-gray-600">
//                         <Pencil size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-gray-50 rounded-xl p-8 text-center">
//               <Users size={48} className="mx-auto text-gray-300 mb-4" />
//               <h3 className="text-lg font-medium text-gray-700 mb-2">No Employees Added Yet</h3>
//               <p className="text-gray-500 mb-4">Add employees to your salon to manage services and appointments.</p>
//               <button
//                 onClick={handleAddEmployee}
//                 className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add First Employee
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'photos' && (
//         <div>
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-semibold text-gray-900">Salon Photos</h2>
//             <button className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
//               <Camera size={16} />
//               Add Photos
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {salonData.photos.length > 0 ? (
//               salonData.photos.map((photo, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={photo}
//                     alt={`Salon photo ${index + 1}`}
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                   {isEditing && (
//                     <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
//                       <button className="p-2 bg-white rounded-full text-gray-700 hover:text-[#CE145B]">
//                         <Pencil size={16} />
//                       </button>
//                       <button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500">
//                         <Trash2 size={16} />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               // Center Empty State
//               <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 text-center">
//                 <Camera size={48} className="mx-auto text-gray-300 mb-4" />
//                 <h3 className="text-lg font-medium text-gray-700 mb-2">No Images Added Yet</h3>
//                 <p className="text-gray-500 mb-4">Add Images to your salon to manage services and appointments.</p>
//                 <button
//                   onClick={handleAddEmployee}
//                   className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"
//                 >
//                   <Plus size={16} />
//                   Add First Image
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Add Photo Placeholder */}
//           {isEditing && (
//             <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-[#CE145B] hover:bg-pink-50 transition-colors">
//               <div className="flex flex-col items-center text-gray-500 hover:text-[#CE145B]">
//                 <Camera size={24} />
//                 <span className="text-sm mt-2">Add Photo</span>
//               </div>
//             </div>
//           )}
//         </div>

//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Salon</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete "{salonData.name}"? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={handleDeleteConfirm}
//                 className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Employee Modal */}
//       {isAddingEmployee && (
//         <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
//             <div className="flex justify-between items-start mb-4">
//               <h3 className="text-xl font-semibold text-gray-900">Add New Employee</h3>
//               <button
//                 onClick={() => setIsAddingEmployee(false)}
//                 className="p-2 hover:bg-gray-100 rounded-full"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
//                 <input type="text" className="w-full p-2 border rounded-lg" placeholder="Employee name" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
//                 <select className="w-full p-2 border rounded-lg">
//                   <option value="senior">Senior Stylist</option>
//                   <option value="stylist">Stylist</option>
//                   <option value="junior">Junior Stylist</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Services</label>
//                 <div className="space-y-2">
//                   {["Haircut", "Color", "Styling", "Beard Trim", "Hair Treatment"].map((service) => (
//                     <label key={service} className="flex items-center gap-2">
//                       <input type="checkbox" className="rounded text-[#CE145B]" />
//                       <span className="text-gray-700">{service}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Profile Photo</label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
//                   <Camera size={24} className="mx-auto text-gray-400 mb-2" />
//                   <div className="text-sm text-gray-500">
//                     Drop an image here or click to upload
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 flex gap-3">
//               <button className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">
//                 Add Employee
//               </button>
//               <button
//                 onClick={() => setIsAddingEmployee(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SalonDetails;




// SalonDetails.jsx (Main Component)
'use client';
import React, { useEffect, useState } from 'react';import { FETCH_SALON_DETAILS_BY_ID_FN } from '@/services/ownerService';

import SalonHeader from './SalonHeader';
import ServicesTab from './ServiceTabs';
import SalonDetailsTab from './SalonDetailsTab';
import PhotosTab from './photos';
import EmployeesTab from './employees';
import DeleteConfirmModal from './DeleteModal';
import SalonTabs from './SalonTabs';


const SalonDetails = ({ salon_id }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(true);
  const [salonData, setSalonData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (salon_id) => {
      setIsLoading(true);
      try {
        const response = await FETCH_SALON_DETAILS_BY_ID_FN(salon_id);
        if (response?.data?.data) {
          const salon = response.data.data;
          const formattedHours = {};
          const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
          days.forEach(day => {
            const dayData = salon.working_hours[day];
            if (dayData.isOpen) {
              const startTime = dayData.start ? dayData.start.split('T')[1].slice(0, 5) : 'closed';
              const endTime = dayData.end ? dayData.end.split('T')[1].slice(0, 5) : 'closed';
              formattedHours[day.substring(0, 3)] = { open: startTime, close: endTime };
            } else {
              formattedHours[day.substring(0, 3)] = { open: 'closed', close: 'closed' };
            }
          });
          const formattedSalon = {
            salon_id: salon.salon_id,
            name: salon.name,
            location: salon.location_text || salon.address || '',
            phone: salon.contact_phone || '',
            email: salon.email || '',
            seats: salon.number_of_seats || 0,
            openingHours: formattedHours,
            photos: salon.images,
            employees: salon.employees || [],
            rating: salon.rating || 0,
            services: salon.services,
            categories: salon.categories || [],
          };
          setSalonData(formattedSalon);
        } else {
          setError('Failed to load salon data');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching salon data');
      } finally {
        setIsLoading(false);
      }
    };
    if (salon_id) fetchData(salon_id);
  }, [salon_id]);

  const handleSave = async () => {
    setIsEditing(false);
  };

  const handleDelete = () => setShowDeleteConfirm(true);
  const handleDeleteConfirm = async () => setShowDeleteConfirm(false);

  if (isLoading) return <div className="max-w-6xl mx-auto p-5 text-center"><div className="py-10">Loading salon details...</div></div>;
  if (error || !salonData) return <div className="max-w-6xl mx-auto p-5"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error || 'Could not load salon details'}</span></div></div>;

  return (
    <div className="max-w-6xl mx-auto p-5">
      <SalonHeader salonData={salonData} isEditing={isEditing} setIsEditing={setIsEditing} handleSave={handleSave} handleDelete={handleDelete} setSalonData={setSalonData} />
      <SalonTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'details' && <SalonDetailsTab salonData={salonData} isEditing={isEditing} setSalonData={setSalonData} />}
      {activeTab === 'services' && <ServicesTab salonData={salonData} setSalonData={setSalonData} isEditing={isEditing} />}
      {activeTab === 'employees' && <EmployeesTab salonData={salonData} isEditing={isEditing} />}
      {activeTab === 'photos' && <PhotosTab salonData={salonData} isEditing={isEditing} />}
      <DeleteConfirmModal salonData={salonData} showDeleteConfirm={showDeleteConfirm} setShowDeleteConfirm={setShowDeleteConfirm} handleDeleteConfirm={handleDeleteConfirm} />
    </div>
  );
};

export default SalonDetails;