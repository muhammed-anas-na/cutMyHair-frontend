import BookingModal from '@/components/BookingModal/page';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Service({
  salon,
  expandedCategory,
  isServiceSelected,
  addService,
  removeService,
  toggleCategory,
  handleServiceClick
}) {
  const [organizedServices, setOrganizedServices] = useState([]);

  useEffect(() => {
    if (salon && salon.services && salon.categories) {
      organizeServices();
    }
  }, [salon]);

  // Function to organize services by category
  const organizeServices = () => {
    if (!salon || !salon.services) return;

    // Create a map of category IDs to names
    const categoryMap = {};
    if (salon.categories) {
      salon.categories.forEach(category => {
        categoryMap[category.category_id] = category.name;
      });
    }

    // Create an "Other" category for services without a category
    const categoriesWithCount = {};
    const tempServicesByCategory = {};

    // Initialize categories
    if (salon.categories) {
      salon.categories.forEach(category => {
        tempServicesByCategory[category.name] = [];
        categoriesWithCount[category.name] = 0;
      });
    }
    
    // Add "Other" category
    tempServicesByCategory["Other"] = [];
    categoriesWithCount["Other"] = 0;

    // Group services by category
    salon.services.forEach(service => {
      const categoryName = service.category_id && categoryMap[service.category_id] 
        ? categoryMap[service.category_id] 
        : "Other";
      
      // Create a properly formatted service object
      const formattedService = {
        id: service.service_id,
        name: service.name,
        image: service.image || null, // No image in the provided data, set to null
        price: parseInt(service.price) || 0,
        duration: `${service.duration || "30"} min`,
        description: service.description || "No description available",
        category: service.category || "Unisex"
      };
      
      if (tempServicesByCategory[categoryName]) {
        tempServicesByCategory[categoryName].push(formattedService);
        categoriesWithCount[categoryName]++;
      } else {
        tempServicesByCategory["Other"].push(formattedService);
        categoriesWithCount["Other"]++;
      }
    });

    // Convert to array structure
    const result = Object.keys(tempServicesByCategory)
      .filter(category => tempServicesByCategory[category].length > 0) // Only include categories with services
      .map(category => ({
        name: category,
        count: categoriesWithCount[category],
        services: tempServicesByCategory[category]
      }));

    setOrganizedServices(result);
  };

  return (
    <div className="p-4">
      {organizedServices.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Loading services...
        </div>
      ) : (
        organizedServices.map((category) => (
          <div key={category.name} className="mb-4">
            <motion.button
              className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors"
              onClick={() => toggleCategory(category.name)}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.1 }}
            >
              <div className="font-medium text-gray-800">
                {category.name} <span className="text-gray-500">({category.count})</span>
              </div>
              <div className={`w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                expandedCategory === category.name ? 'bg-[#FEE7EF] text-[#CE145B]' : 'bg-gray-200 text-gray-600'
              }`}>
                {expandedCategory === category.name ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </motion.button>

            <AnimatePresence>
              {expandedCategory === category.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-3">
                    {category.services.map((service) => (
                      <motion.div 
                        key={service.id} 
                        className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
                        whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-3 flex items-center">
                          <div 
                            className="flex-1 flex items-start cursor-pointer" 
                            onClick={() => handleServiceClick(service)}
                          >
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                              {service.images && service.images.length > 0 ? (
                                <img
                                  src={service.images[0]}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-medium">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{service.name}</h3>
                              {/* <div className="flex items-center text-sm">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="ml-1 font-medium">{service.rating}</span>
                                <span className="text-gray-500 ml-1 text-xs">(reviews {service.reviews})</span>
                              </div> */}
                              <div className="flex items-center mt-1 text-sm">
                                <span className="font-medium text-gray-900">₹ {service.price}</span>
                                <span className="mx-2 text-gray-300">•</span>
                                <span className="flex items-center text-gray-500 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {service.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            className={`px-4 py-1.5 rounded-md text-sm font-medium ml-2 flex-shrink-0 ${
                              isServiceSelected(service.id)
                                ? "bg-[#FEE7EF] text-[#CE145B]"
                                : "bg-[#CE145B] text-white hover:bg-[#B01050]"
                            }`}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              if (isServiceSelected(service.id)) {
                                removeService(service.id);
                              } else {
                                addService(service);
                              }
                            }}
                          >
                            {isServiceSelected(service.id) ? "Added" : "Add"}
                          </motion.button>
                        </div>
                        <div 
                          className="px-3 py-2 border-t border-gray-100 text-xs text-[#CE145B] font-medium cursor-pointer hover:bg-[#FEF0F5] transition-colors"
                          onClick={() => handleServiceClick(service)}
                        >
                          view details &gt;
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))
      )}

    </div>

    
  );
}