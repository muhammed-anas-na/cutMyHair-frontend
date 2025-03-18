// DeleteConfirmModal.jsx
import React from 'react';

const DeleteConfirmModal = ({ salonData, showDeleteConfirm, setShowDeleteConfirm, handleDeleteConfirm }) => (
  showDeleteConfirm && (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Salon</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to delete "{salonData.name}"? This action cannot be undone.</p>
        <div className="flex gap-3"><button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">Delete</button><button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button></div>
      </div>
    </div>
  )
);

export default DeleteConfirmModal;