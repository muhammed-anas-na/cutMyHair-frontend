// SalonTabs.jsx
import React from 'react';

const SalonTabs = ({ activeTab, setActiveTab }) => {
  // Define tabs with their labels for better customization
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'services', label: 'Services' },
    { id: 'employees', label: 'Employees' },
    { id: 'photos', label: 'Photos' }
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide mb-4 sm:mb-6">
      <div className="flex whitespace-nowrap border-b border-gray-200 min-w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-colors flex-1 sm:flex-none
              ${activeTab === tab.id
                ? 'text-[#CE145B] border-b-2 border-[#CE145B]'
                : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SalonTabs;