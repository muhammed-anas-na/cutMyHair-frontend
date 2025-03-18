import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Store, X, FolderPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { ADD_NEW_CATEGORY_FN, ADD_SERVICE_FOR_SALON_FN } from '@/services/ownerService';

const ServicesTab = ({ salonData, setSalonData, isEditing }) => {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    status: 'available',
    category_id: ''
  });
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (!salonData.categories) {
      setSalonData(prev => ({ ...prev, categories: [] }));
    }
    if (!salonData.services) {
      setSalonData(prev => ({ ...prev, services: [] }));
    }
    
    // Initialize expanded state for existing categories
    if (salonData.categories?.length > 0) {
      const initialExpandedState = {};
      salonData.categories.forEach(category => {
        initialExpandedState[category.category_id || category._id] = true;
      });
      setExpandedCategories(initialExpandedState);
    }
  }, [salonData, setSalonData]);

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const categoryId = selectedCategory?.category_id || selectedCategory?._id || null;
      
      const response = await ADD_SERVICE_FOR_SALON_FN(
        salonData.salon_id,
        newService.name,
        newService.description,
        Number(newService.price),
        newService.duration,
        newService.category, // This is the service type (Female/Male/Unisex)
        newService.status,
        categoryId // Pass the category_id explicitly
      );
  
      if (response.status === 200) {
        const serviceToAdd = {
          ...response.data.data,
          category_id: categoryId // Ensure category_id is included in the new service
        };
  
        setShowAddServiceModal(false);
        setSalonData(prevData => ({
          ...prevData,
          services: [...(prevData.services || []), serviceToAdd]
        }));
  
        setNewService({
          name: '',
          description: '',
          price: '',
          duration: '',
          category: '',
          status: 'available',
          category_id: ''
        });
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error('Error adding service:', err.response?.data || err.message);
      alert('Failed to add service: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const categoryId = `cat_${Date.now()}`;
      const categoryToAdd = {
        salon_id: salonData.salon_id,
        category_id: categoryId,
        name: newCategory.name,
        description: newCategory.description || ''
      };
      
      const response = await ADD_NEW_CATEGORY_FN(categoryToAdd);
      
      if (response.status === 200) {
        setSalonData(prev => ({
          ...prev,
          categories: [...(prev.categories || []), {
            ...categoryToAdd,
            _id: response.data.data?._id || categoryId
          }]
        }));
        
        setNewCategory({ name: '', description: '' });
        setShowAddCategoryModal(false);
        
        setExpandedCategories(prev => ({
          ...prev,
          [categoryId]: true
        }));
      }
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };
  
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  const handleDeleteCategory = (categoryId, e) => {
    e.stopPropagation();
    const updatedCategories = salonData.categories.filter(
      cat => (cat.category_id || cat._id) !== categoryId
    );
    const updatedServices = salonData.services.filter(
      service => service.category_id !== categoryId
    );
    
    setSalonData(prev => ({
      ...prev,
      categories: updatedCategories,
      services: updatedServices
    }));
  };
  
  const handleDeleteService = (serviceId) => {
    const updatedServices = salonData.services.filter(
      service => service.service_id !== serviceId
    );
    setSalonData(prev => ({
      ...prev,
      services: updatedServices
    }));
  };
  
  const openAddServiceModal = (category, e) => {
    if (e) e.stopPropagation();
    setSelectedCategory(category);
    setNewService(prev => ({
      ...prev,
      category_id: category?.category_id || category?._id || ''
    }));
    setShowAddServiceModal(true);
  };
  
  const getServicesByCategory = (categoryId) => {
    return salonData.services.filter(service => 
      service.category_id === categoryId
    );
  };
  
  const getUncategorizedServices = () => {
    return salonData.services.filter(service => 
      !service.category_id || !salonData.categories.some(cat => 
        (cat.category_id || cat._id) === service.category_id
      )
    );
  };

  const hasCategoriesWithServices = salonData.categories?.length > 0;
  const hasUncategorizedServices = getUncategorizedServices().length > 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Salon Services</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddCategoryModal(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-[#CE145B]/90 text-white rounded-lg hover:bg-[#CE145B]"
          >
            <FolderPlus size={16} />
            Add Category
          </button>
          <button 
            onClick={() => openAddServiceModal(null)}
            className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90"
          >
            <Plus size={16} />
            Add Service
          </button>
        </div>
      </div>

      {hasCategoriesWithServices && (
        <div className="space-y-4 mb-6">
          {salonData.categories.map((category) => {
            const categoryId = category.category_id || category._id;
            return (
              <div key={categoryId} className="bg-white rounded-xl shadow-sm">
                <div 
                  className="flex items-center justify-between px-6 py-4 bg-gray-50 cursor-pointer"
                  onClick={() => toggleCategoryExpansion(categoryId)}
                >
                  <div className="flex items-center gap-3">
                    {expandedCategories[categoryId] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => openAddServiceModal(category, e)}
                      className="text-sm text-[#CE145B] hover:text-[#CE145B]/80 flex items-center gap-1"
                    >
                      <Plus size={14} />
                      Add Service
                    </button>
                    {isEditing && (
                      <button 
                        onClick={(e) => handleDeleteCategory(categoryId, e)}
                        className="text-red-600 hover:text-red-800 ml-3"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                
                {expandedCategories[categoryId] && (
                  <div>
                    {getServicesByCategory(categoryId).length > 0 ? (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            {isEditing && (
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getServicesByCategory(categoryId).map((service) => (
                            <tr key={service.service_id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                {service.description && (
                                  <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{service.duration}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">₹{service.price}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {service.status === 'available' ? 'Available' : 'Unavailable'}
                                </span>
                              </td>
                              {isEditing && (
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                  <button className="text-[#CE145B] hover:text-[#CE145B]/80 mr-3">
                                    <Pencil size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteService(service.service_id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="py-8 text-center text-gray-500">
                        <p className="mb-3">No services in this category yet</p>
                        <button
                          onClick={(e) => openAddServiceModal(category, e)}
                          className="px-4 py-2 bg-[#CE145B]/90 text-white rounded-lg hover:bg-[#CE145B] inline-flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Add Service
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {hasUncategorizedServices && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-medium text-gray-700">Uncategorized Services</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  {isEditing && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getUncategorizedServices().map((service) => (
                  <tr key={service.service_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      {service.description && <div className="text-xs text-gray-500 mt-1">{service.description}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${service.category === 'Female' ? 'bg-pink-100 text-pink-800' : service.category === 'Male' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {service.category || 'Unspecified'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{service.duration}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₹{service.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {service.status === 'available' ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    {isEditing && (
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button className="text-[#CE145B] hover:text-[#CE145B]/80 mr-3">
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteService(service.service_id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {!hasCategoriesWithServices && !hasUncategorizedServices && (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Store size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Services Added Yet</h3>
          <p className="text-gray-500 mb-4">Start by adding a category or service.</p>
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 inline-flex items-center gap-2"
            >
              <FolderPlus size={16} />
              Add Category
            </button>
            <button
              onClick={() => openAddServiceModal(null)}
              className="px-4 py-2 border border-[#CE145B] text-[#CE145B] rounded-lg hover:bg-[#CE145B]/5 inline-flex items-center gap-2"
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>
        </div>
      )}

{showAddServiceModal && (
  <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleAddService} className="space-y-4">
        {salonData.categories?.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select
              value={selectedCategory?.category_id || selectedCategory?._id || ''}
              onChange={(e) => {
                const catId = e.target.value;
                const category = salonData.categories.find(c => (c.category_id || c._id) === catId);
                setSelectedCategory(category);
                setNewService(prev => ({ ...prev, category_id: catId }));
              }}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">No Category</option>
              {salonData.categories.map(cat => (
                <option key={cat.category_id || cat._id} value={cat.category_id || cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Service Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newService.name}
                  onChange={handleServiceInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={handleServiceInputChange}
                  className="w-full p-2 border rounded-lg"
                  rows="2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Price (₹)*</label>
                  <input
                    type="number"
                    name="price"
                    value={newService.price}
                    onChange={handleServiceInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Duration*</label>
                  <input
                    type="text"
                    name="duration"
                    value={newService.duration}
                    onChange={handleServiceInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Service Type*</label>
                <select
                  name="category"
                  value={newService.category}
                  onChange={handleServiceInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Select type</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status*</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="available"
                      checked={newService.status === 'available'}
                      onChange={handleServiceInputChange}
                    />
                    Available
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value="unavailable"
                      checked={newService.status === 'unavailable'}
                      onChange={handleServiceInputChange}
                    />
                    Unavailable
                  </label>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90"
                >
                  Add Service
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Category Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newCategory.name}
                  onChange={handleCategoryInputChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newCategory.description}
                  onChange={handleCategoryInputChange}
                  className="w-full p-2 border rounded-lg"
                  rows="2"
                />
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90"
                >
                  Add Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;