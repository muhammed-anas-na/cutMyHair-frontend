const CustomMarker = ({ name, photo }) => {
  return (
    <div className="relative group scale-75"> {/* Added scale-75 to make everything 75% of original size */}
      <div className="flex items-center bg-gray-800 text-white rounded-full px-2 py-1 shadow-lg cursor-pointer transform transition-transform hover:scale-105">
        <div className="w-6 h-6 rounded-full overflow-hidden mr-1"> {/* Reduced from w-8/h-8 to w-6/h-6 */}
          <img 
            src={photo || "/api/placeholder/24/24"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs font-medium whitespace-nowrap">{name}</span> {/* Changed from text-sm to text-xs */}
      </div>
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gray-800 rotate-45"></div> {/* Reduced from w-2/h-2 to w-1.5/h-1.5 */}
    </div>
  );
};

export default CustomMarker;