// EmployeesTab.jsx
import React from 'react';
import { Plus, Users, Pencil, X, Camera } from 'lucide-react';

const EmployeesTab = ({ salonData, isEditing }) => {
  const [isAddingEmployee, setIsAddingEmployee] = React.useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Salon Employees</h2>
        <button onClick={() => setIsAddingEmployee(true)} className="flex items-center gap-2 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors"><Plus size={16} />Add Employee</button>
      </div>
      {salonData.employees && salonData.employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salonData.employees.map((employee) => (
            <div key={employee.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start gap-4"><img src={employee.photo || "/api/placeholder/64/64"} alt={employee.name} className="w-16 h-16 rounded-full object-cover" /><div className="flex-1"><h3 className="font-semibold text-gray-900">{employee.name}</h3><p className="text-sm text-gray-600">{employee.role}</p><div className="flex flex-wrap gap-2 mt-2">{employee.services && employee.services.map((service, index) => <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">{service}</span>)}</div></div>{isEditing && <button className="p-2 text-gray-400 hover:text-gray-600"><Pencil size={16} /></button>}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-8 text-center"><Users size={48} className="mx-auto text-gray-300 mb-4" /><h3 className="text-lg font-medium text-gray-700 mb-2">No Employees Added Yet</h3><p className="text-gray-500 mb-4">Add employees to your salon to manage services and appointments.</p><button onClick={() => setIsAddingEmployee(true)} className="px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors inline-flex items-center gap-2"><Plus size={16} />Add First Employee</button></div>
      )}
      {isAddingEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4"><div className="flex justify-between items-start mb-4"><h3 className="text-xl font-semibold text-gray-900">Add New Employee</h3><button onClick={() => setIsAddingEmployee(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button></div><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-600 mb-1">Name</label><input type="text" className="w-full p-2 border rounded-lg" placeholder="Employee name" /></div><div><label className="block text-sm font-medium text-gray-600 mb-1">Role</label><select className="w-full p-2 border rounded-lg"><option value="senior">Senior Stylist</option><option value="stylist">Stylist</option><option value="junior">Junior Stylist</option></select></div><div><label className="block text-sm font-medium text-gray-600 mb-1">Services</label><div className="space-y-2">{["Haircut", "Color", "Styling", "Beard Trim", "Hair Treatment"].map((service) => <label key={service} className="flex items-center gap-2"><input type="checkbox" className="rounded text-[#CE145B]" /><span className="text-gray-700">{service}</span></label>)}</div></div><div><label className="block text-sm font-medium text-gray-600 mb-1">Profile Photo</label><div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"><Camera size={24} className="mx-auto text-gray-400 mb-2" /><div className="text-sm text-gray-500">Drop an image here or click to upload</div></div></div></div><div className="mt-6 flex gap-3"><button className="flex-1 px-4 py-2 bg-[#CE145B] text-white rounded-lg hover:bg-[#CE145B]/90 transition-colors">Add Employee</button><button onClick={() => setIsAddingEmployee(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button></div></div>
        </div>
      )}
    </div>
  );
};

export default EmployeesTab;