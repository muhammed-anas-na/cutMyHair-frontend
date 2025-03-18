// SalonTabs.jsx
import React from 'react';

const SalonTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex gap-4 border-b border-gray-200 mb-6">
    {['details', 'services', 'employees', 'photos'].map(tab => (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 font-medium ${activeTab === tab
          ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    ))}
  </div>
);

export default SalonTabs;