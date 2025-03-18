// PhotosTab.jsx
import React from 'react';
import { Camera, Plus, Pencil, Trash2 } from 'lucide-react';

const PhotosTab = ({ salonData, isEditing }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-semibold text-gray-900">Salon Photos</h2>
      <button className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"><Camera size={16} />Add Photos</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {salonData.photos.length > 0 ? (
        salonData.photos.map((photo, index) => (
          <div key={index} className="relative group"><img src={photo} alt={`Salon photo ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />{isEditing && <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg"><button className="p-2 bg-white rounded-full text-gray-700 hover:text-[#CE145B]"><Pencil size={16} /></button><button className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500"><Trash2 size={16} /></button></div>}</div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 text-center"><Camera size={48} className="mx-auto text-gray-300 mb-4" /><h3 className="text-lg font-medium text-gray-700 mb-2">No Images Added Yet</h3><p className="text-gray-500 mb-4">Add Images to your salon to manage services and appointments.</p><button className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"><Plus size={16} />Add First Image</button></div>
      )}
    </div>
    {isEditing && <div className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-[#CE145B] hover:bg-pink-50 transition-colors"><div className="flex flex-col items-center text-gray-500 hover:text-[#CE145B]"><Camera size={24} /><span className="text-sm mt-2">Add Photo</span></div></div>}
  </div>
);

export default PhotosTab;