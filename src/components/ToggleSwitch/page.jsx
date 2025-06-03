import { useLocation } from "@/context/LocationContext";

const ToggleSwitch = ({ isOn, setIsOn }) => {
  const {isLocationSet,setShowLocationModal} = useLocation();
  const toggleSwitch = () => {
    if(isLocationSet) setIsOn(prev => !prev)
    else setShowLocationModal(true);
    
  }
  

  return (
    <div
      onClick={toggleSwitch}
      className={`w-8 h-4 flex items-center rounded-full px-0.5 cursor-pointer transition-colors duration-300 ${isOn ? "bg-[#CE145B]" : "bg-gray-300"}`}
    >
      <div
        className={`bg-black w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isOn ? "translate-x-4" : ""}`}
      />
    </div>
  );
};

export default ToggleSwitch;