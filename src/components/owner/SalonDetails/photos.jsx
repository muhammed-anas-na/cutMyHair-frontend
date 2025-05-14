import React, { useState, useRef } from 'react';
import { Camera, Plus, Trash2, Upload, X, Loader } from 'lucide-react';
import uploadImageToCloudinary from '@/services/cloudinary.js';
import { DELETE_IMAGE_BACKEND_FN, UPLOAD_IMAGE_BACKEND_FN } from '@/services/ownerService';

const PhotosTab = ({ salonData, setSalonData, isEditing, onSave }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
console.log(salonData.salon_id)
  // Trigger file input click
  const handleAddPhotoClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Validate files (only images allowed, max size 5MB)
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnderSizeLimit = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isImage) {
        setUploadError('Only image files are allowed.');
        return false;
      }
      
      if (!isUnderSizeLimit) {
        setUploadError('Image size should be under 5MB.');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      const newImageUrls = [];
      
      // Upload each file and track progress
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        // Calculate and update progress
        const progressPerFile = 100 / validFiles.length;
        setUploadProgress(i * progressPerFile);
        
        try {
          const imageUrl = await uploadImageToCloudinary(file);
          newImageUrls.push(imageUrl);
          const response = await UPLOAD_IMAGE_BACKEND_FN(salonData.salon_id,newImageUrls);
          console.log(response);
        } catch (error) {
          console.error('Error uploading file:', error);
          setUploadError(`Failed to upload ${file.name}: ${error.message}`);
        }
      }
      
      // Update salon data with new images
      if (newImageUrls.length > 0) {
        const updatedPhotos = [...salonData.photos, ...newImageUrls];
        setSalonData({
          ...salonData,
          photos: updatedPhotos
        });
        
        // If we have an onSave callback, call it with the updated photos
        if (onSave) {
          onSave({
            ...salonData,
            photos: updatedPhotos
          });
        }
      }
      
      setUploadProgress(100);
    } catch (error) {
      console.error('Error in upload process:', error);
      setUploadError('Failed to upload images. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  // Handle image removal
  const handleRemovePhoto = async(indexToRemove,photo) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to remove this photo?')) {
      const updatedPhotos = salonData.photos.filter((_, index) => index !== indexToRemove);
        const respose = await DELETE_IMAGE_BACKEND_FN(salonData.salon_id, photo)
        console.log(respose);
      setSalonData({
        ...salonData,
        photos: updatedPhotos
      });
      if (onSave) {
        onSave({
          ...salonData,
          photos: updatedPhotos
        });
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Salon Photos</h2>
        {isEditing && (
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
            onClick={handleAddPhotoClick}
            disabled={isUploading}
          >
            {isUploading ? <Loader className="animate-spin" size={16} /> : <Camera size={16} />}
            {isUploading ? 'Uploading...' : 'Add Photos'}
          </button>
        )}
        
        {/* Hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          multiple
          onChange={handleFileChange}
        />
      </div>
      
      {/* Upload error message */}
      {uploadError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center justify-between">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Upload progress bar */}
      {isUploading && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#CE145B] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(uploadProgress)}% Complete</p>
        </div>
      )}
      
      {/* Photo grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {salonData.photos && salonData.photos.length > 0 ? (
          salonData.photos.map((photo, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200">
              <img 
                src={photo} 
                alt={`Salon photo ${index + 1}`} 
                className="w-full h-48 object-cover rounded-lg" 
              />
              
              {isEditing && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="p-2 bg-white rounded-full text-gray-700 hover:text-red-500 transition-colors shadow-md"
                    onClick={() => handleRemovePhoto(index, photo)}
                    title="Remove photo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8 text-center">
            <Camera size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Images Added Yet</h3>
            <p className="text-gray-500 mb-4">Add Images to your salon to manage services and appointments.</p>
            {isEditing && (
              <button 
                className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"
                onClick={handleAddPhotoClick}
                disabled={isUploading}
              >
                <Plus size={16} />
                Add First Image
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Add photo drop area (only shown when editing and some photos already exist) */}
      {isEditing && salonData.photos && salonData.photos.length > 0 && (
        <div 
          className="mt-6 border-2 border-dashed border-gray-300 rounded-lg h-48 flex items-center justify-center cursor-pointer hover:border-[#CE145B] hover:bg-pink-50 transition-colors"
          onClick={handleAddPhotoClick}
        >
          <div className="flex flex-col items-center text-gray-500 hover:text-[#CE145B]">
            <Upload size={24} />
            <span className="text-sm mt-2">Drop photos here or click to upload</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;