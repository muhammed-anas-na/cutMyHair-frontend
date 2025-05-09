// EmployeesTab.jsx
import React, { useEffect, useState } from 'react';
import { Plus, Users, Pencil, X, Camera, AlertCircle, MoreVertical, Trash2 } from 'lucide-react';
import { useSalon } from '@/context/SalonContext';
import { Add_NEW_EMPLOYEE_FN, DELETE_STYLIST_FN, GET_STYLIST_DATA__FN } from '@/services/ownerService';

const EmployeesTab = ({ salonData, isEditing }) => {
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [name, setName] = useState('');
  const [employees, setEmployees] = useState(salonData?.employees || []);
  const [stylists, setStylists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch stylists data on component mount
  useEffect(() => {
    const fetchStylists = async () => {
      try {
        setIsLoading(true);
        const response = await GET_STYLIST_DATA__FN(salonData.salon_id);
        if (response.data) {
          console.log(response.data[0].stylists);
          setStylists(response.data[0].stylists);
        }
      } catch (err) {
        console.error("Failed to fetch stylists:", err);
        setError("Could not load stylists data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (salonData?.salon_id) {
      fetchStylists();
    }
  }, [salonData?.salon_id]);

  // Validate and handle employee addition
  const handleSubmit = async () => {
    // Form validation
    if (!name.trim()) {
      setError("Employee name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const response = await Add_NEW_EMPLOYEE_FN(salonData.salon_id, name);
      
      if (response && response.data) {
        // Create a new employee object with the response data
        const newEmployee = {
          id: response.data.id || Date.now(), // Use the ID from response or generate a temporary one
          name: name,
          photo: null, // Default photo
          role: "Stylist", // Default role
          services: [] // Default empty services
        };
        
        // Update the local employees state
        setEmployees([...employees, newEmployee]);
        
        // Refresh the stylists list to include the new employee
        try {
          const refreshResponse = await GET_STYLIST_DATA__FN(salonData.salon_id);
          if (refreshResponse.data) {
            setStylists(refreshResponse.data[0].stylists);
          }
        } catch (refreshErr) {
          console.error("Failed to refresh stylists:", refreshErr);
        }
        
        setSuccess("Employee added successfully!");
        setName(''); // Reset form
        setIsAddingEmployee(false); // Close modal
      }
    } catch (err) {
      console.error("Failed to add employee:", err);
      setError("Failed to add employee. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and error state when opening/closing modal
  const toggleAddEmployeeModal = (value) => {
    setIsAddingEmployee(value);
    setError('');
    setName('');
  };

  // Toggle dropdown menu for a specific employee
  const toggleMenu = (id, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId === null) return;
      
      const menuButton = event.target.closest('button[data-menu-toggle]');
      const menuDropdown = event.target.closest('.menu-dropdown');
      
      if (menuButton && menuButton.getAttribute('data-employee-id') === openMenuId) {
        return;
      }
      
      if (menuDropdown && menuDropdown.getAttribute('data-employee-id') === openMenuId) {
        return;
      }
      
      setOpenMenuId(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Handle employee deletion
  const handleDeleteEmployee = async (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    try {
      setDeleteLoading(id);
      setError('');
      
      const response = await DELETE_STYLIST_FN(salonData.salon_id, id);
      
      if (response) {
        // Update the local stylists state
        setStylists(stylists.filter(stylist => stylist._id !== id));
        setSuccess("Employee deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete employee:", err);
      setError("Failed to delete employee. Please try again.");
    } finally {
      setDeleteLoading(null);
      setOpenMenuId(null);
    }
  };

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Salon Employees</h2>
        <button 
          onClick={() => toggleAddEmployeeModal(true)} 
          className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"
          disabled={isLoading}
        >
          <Plus size={16} />Add Employee
        </button>
      </div>

      {/* Success message */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
          <div className="flex-1">{success}</div>
          <button onClick={() => setSuccess('')} className="text-green-700">
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          <div className="flex-1">{error}</div>
          <button onClick={() => setError('')} className="text-red-700">
            <X size={16} />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-pulse text-gray-400">Loading employees...</div>
        </div>
      ) : stylists && stylists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stylists.map((stylist) => (
            <div key={stylist._id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start gap-4">
                <img 
                  src={stylist.photo || "/api/placeholder/64/64"} 
                  alt={stylist.name} 
                  className="w-16 h-16 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{stylist.name}</h3>
                  <p className="text-sm text-gray-600">No Specific Role for now</p>
                </div>
                <div className="relative">
                  <button 
                    data-menu-toggle="true"
                    data-employee-id={stylist._id}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                    onClick={(e) => toggleMenu(stylist._id, e)}
                  >
                    <MoreVertical size={16} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {openMenuId === stylist._id && (
                    <div 
                      className="menu-dropdown absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200" 
                      data-employee-id={stylist._id}
                    >
                      {isEditing && (
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {/* Add edit functionality here */}}
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                      )}
                      <button 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                        onClick={(e) => handleDeleteEmployee(stylist._id, e)}
                        disabled={deleteLoading === stylist._id}
                      >
                        {deleteLoading === stylist._id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            Deleting...
                          </div>
                        ) : (
                          <>
                            <Trash2 size={14} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <Users size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Employees Added Yet</h3>
          <p className="text-gray-500 mb-4">Add employees to your salon to manage services and appointments.</p>
          <button 
            onClick={() => toggleAddEmployeeModal(true)} 
            className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"
            disabled={isLoading}
          >
            <Plus size={16} />Add First Employee
          </button>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Add New Employee</h3>
              <button 
                onClick={() => toggleAddEmployeeModal(false)} 
                className="p-2 hover:bg-gray-100 rounded-full"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Error message in modal */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="employee-name" className="block text-sm font-medium text-gray-600 mb-1">
                  Name
                </label>
                <input
                  id="employee-name"
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Employee name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors disabled:bg-[#CE145B]/50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Adding...' : 'Add Employee'}
              </button>
              <button
                onClick={() => toggleAddEmployeeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
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

export default EmployeesTab;