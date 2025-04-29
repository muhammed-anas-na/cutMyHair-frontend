'use client';
import { Facebook, Instagram, Twitter, X, Upload, MapPin, Store, Phone, Home } from "lucide-react";
import { useEffect, useState } from "react";
import StepIndicator from "@/components/Stepper/page";
import { GET_LOCATION_FROM_TEXT_FN } from "@/services/userService";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import uploadImageToCloudinary from '@/services/cloudinary.js';
import { CREATE_SALON_FN } from "@/services/ownerService";
import { useAuth } from "@/context/AuthContext";
import { useSalon } from "@/context/SalonContext";
import LocateMeMap from "@/components/LocateMeMap/page";
import Link from "next/link";

const ImagePreview = ({ image, onRemove }) => (
  <div className="relative w-20 h-20">
    <img 
      src={URL.createObjectURL(image)} 
      alt="Salon preview" 
      className="w-full h-full object-cover rounded-md"
    />
    <button 
      onClick={() => onRemove(image)}
      className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow"
      aria-label="Remove image"
    >
      <X size={14} className="text-[#CE145B]" />
    </button>
  </div>
);

export default function Register() {
  const [currentStep, setCurrentStep] = useState("1");
  const { setLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const {user_id} = useAuth();
  const router = useRouter();
  const {setSalonId} = useSalon();
  
  // Form validation states
  const [errors, setErrors] = useState({
    salonName: "",
    contactNumber: "",
    address: "",
    location: ""
  });
  
  //Screen 01
  const [salonName, setSalonName] = useState("");
  //Screen 02
  const [images, setImages] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  //Screen 03
  const [locationInput, setLocationInput] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  
  // Validate step 1
  const validateStep1 = () => {
    let valid = true;
    let newErrors = {...errors};
    
    if (!salonName.trim()) {
      newErrors.salonName = "Salon name is required";
      valid = false;
    } else if (salonName.length < 3) {
      newErrors.salonName = "Salon name should be at least 3 characters";
      valid = false;
    } else {
      newErrors.salonName = "";
    }
    
    setErrors(newErrors);
    return valid;
  };

  // Validate step 2
  const validateStep2 = () => {
    let valid = true;
    let newErrors = {...errors};
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!contactNumber) {
      newErrors.contactNumber = "Contact number is required";
      valid = false;
    } else if (!phoneRegex.test(contactNumber)) {
      newErrors.contactNumber = "Enter a valid 10-digit number";
      valid = false;
    } else {
      newErrors.contactNumber = "";
    }
    
    if (!address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    } else if (address.length < 10) {
      newErrors.address = "Please enter a more detailed address";
      valid = false;
    } else {
      newErrors.address = "";
    }
    
    setErrors(newErrors);
    return valid;
  };

  // Validate step 3
  const validateStep3 = () => {
    let valid = true;
    let newErrors = {...errors};
    
    if (!latitude || !longitude) {
      newErrors.location = "Please select a location on the map";
      valid = false;
    } else {
      newErrors.location = "";
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleNextStep = (nextStep) => {
    if (nextStep === "2" && !validateStep1()) return;
    if (nextStep === "3" && !validateStep2()) return;
    
    setCurrentStep(nextStep);
    window.scrollTo(0, 0);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
    setLocationText(selectedLocation.text);
    setLocationName(selectedLocation.name);
    
    // Clear location error if it exists
    if (errors.location) {
      setErrors({...errors, location: ""});
    }
  };

  const handleImageUpload = (e) => {
    // Limit to maximum 5 images
    if (images.length >= 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    
    const files = Array.from(e.target.files);
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Filter for valid images
    const validFiles = files.filter(file => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxSize;
      return isValidType && isValidSize;
    });
    
    // Add only up to 5 images total
    const newImages = [...images];
    const remainingSlots = 5 - newImages.length;
    
    for (let i = 0; i < Math.min(validFiles.length, remainingSlots); i++) {
      newImages.push(validFiles[i]);
    }
    
    setImages(newImages);
  };

  const removeImage = (imageToRemove) => {
    setImages(images.filter(image => image !== imageToRemove));
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    
    try {
      setIsLoading(true);
      const imageUrls = [];
      if (images.length > 0) {
        for (const image of images) {
          const imageUrl = await uploadImageToCloudinary(image);
          imageUrls.push(imageUrl);
        }
      }
      
      const response = await CREATE_SALON_FN(
        user_id,
        locationName,
        locationText,
        salonName,
        contactNumber,
        address,
        imageUrls,
        latitude,
        longitude
      );
      
      if(response.status == 201){
        setSalonId(response.data.data.salon_id);
        router.replace(`/owner/success?message=${encodeURIComponent(salonName)}%20Registration%20Successful&redirect=/owner/numberofseats`);
      }
    } catch (err) {
      console.error("Error creating salon:", err);
      alert("There was a problem registering your salon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6D7D3] pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="md:w-1/2 relative">
          <img
            src="../register-image.png"
            alt="CoverImage"
            className="w-full h-auto md:object-cover md:h-screen"
          />
          
          {/* Skip button */}
          {currentStep === "1" && (
            <Link
              href={'/owner/dashboard'} 
              className="absolute top-4 right-4 px-4 py-1 bg-white bg-opacity-80 rounded-full text-sm font-medium hover:bg-opacity-100 transition-colors"
            >
              Skip
            </Link>
          )}
        </div>

        {/* Step 1 - Salon Name */}
        {currentStep === "1" && (
          <div className="flex flex-col gap-3 mx-4 sm:mx-10 md:w-1/2 md:px-20 md:justify-center">
            <StepIndicator totalSteps={3} currentStep={1} />
            <h1 className="font-bold text-4xl md:text-5xl">Salon Name</h1>
            <p className="text-gray-600">This is how customers will find your business</p>
            
            <div className="flex flex-col gap-1 mt-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Store className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="eg: Elevate Salon"
                  value={salonName}
                  onChange={(e) => {
                    setSalonName(e.target.value);
                    if (errors.salonName) setErrors({...errors, salonName: ""});
                  }}
                  maxLength={40}
                  className={`pl-10 pr-4 py-3 rounded-md md:text-lg w-full ${
                    errors.salonName ? 'border-2 border-red-500' : 'border-2 border-gray-300 focus:border-[#CE145B]'
                  } transition-colors`}
                />
              </div>
              {errors.salonName && (
                <p className="text-red-500 text-sm mt-1">{errors.salonName}</p>
              )}
            </div>
            
            <button
              className="p-3 mt-2 rounded-md bg-[#CE145B] text-white font-bold md:text-lg hover:bg-opacity-90 transition-colors"
              onClick={() => handleNextStep("2")}
            >
              Continue
            </button>
            
            <p className="text-center text-gray-500 text-sm mt-2">
              This is step 1 of 3 in setting up your salon profile
            </p>
          </div>
        )}

        {/* Step 2 - Salon Details */}
        {currentStep === "2" && (
          <div className="flex flex-col gap-3 mx-4 sm:mx-10 md:w-1/2 md:px-20 md:justify-center">
            <StepIndicator totalSteps={3} currentStep={2} />
            <h1 className="font-bold text-4xl md:text-5xl">Details</h1>
            <p className="text-gray-600 mb-2">Tell us more about your salon</p>
            
            <div className="flex flex-col gap-4">
              {/* Contact Number */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-sm font-medium">Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="eg: 1234567890"
                    value={contactNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setContactNumber(value);
                      if (errors.contactNumber) setErrors({...errors, contactNumber: ""});
                    }}
                    maxLength={10}
                    className={`pl-10 pr-4 py-3 rounded-md md:text-lg w-full ${
                      errors.contactNumber ? 'border-2 border-red-500' : 'border-2 border-gray-300 focus:border-[#CE145B]'
                    } transition-colors`}
                  />
                </div>
                {errors.contactNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                )}
              </div>

              {/* Address */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-sm font-medium">Address</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Home className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    placeholder="eg: HSR Layout Bangalore, 7 Street"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors({...errors, address: ""});
                    }}
                    rows={3}
                    className={`pl-10 pr-4 py-3 rounded-md md:text-lg w-full ${
                      errors.address ? 'border-2 border-red-500' : 'border-2 border-gray-300 focus:border-[#CE145B]'
                    } transition-colors`}
                  />
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Salon Images */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-600 text-sm font-medium">Images (optional, max 5)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-[#CE145B] transition-colors">
                  <input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="w-full flex flex-col items-center justify-center gap-2 py-2 text-gray-500 hover:text-[#CE145B] transition-colors focus:outline-none"
                    type="button"
                  >
                    <Upload size={24} />
                    <span className="text-sm font-medium">
                      {images.length === 0 
                        ? 'Upload salon photos' 
                        : `${images.length} image${images.length > 1 ? 's' : ''} selected (${5-images.length} remaining)`}
                    </span>
                  </button>
                </div>
                
                {images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto py-3">
                    {images.map((image, index) => (
                      <ImagePreview 
                        key={index} 
                        image={image} 
                        onRemove={removeImage}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3 mt-3">
              <button
                className="flex-1 p-3 rounded-md border-2 border-[#CE145B] text-[#CE145B] font-bold md:text-lg hover:bg-[#CE145B]/5 transition-colors"
                onClick={() => setCurrentStep("1")}
              >
                Back
              </button>
              <button
                className="flex-1 p-3 rounded-md bg-[#CE145B] text-white font-bold md:text-lg hover:bg-opacity-90 transition-colors"
                onClick={() => handleNextStep("3")}
              >
                Continue
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-2">
              Step 2 of 3 - Almost there!
            </p>
          </div>
        )}

        {/* Step 3 - Salon Location */}
        {currentStep === "3" && (
          <div className="flex flex-col mx-4 sm:mx-10 md:w-1/2 md:px-20 md:justify-center">
            <StepIndicator totalSteps={3} currentStep={3} />
            <h1 className="font-bold text-4xl md:text-5xl">Locate Salon</h1>
            <p className="text-gray-600 mb-3">Pin your salon's exact location on the map</p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-3">
              <div className="relative w-full rounded-md overflow-hidden">
                <LocateMeMap onLocationSelect={handleLocationSelect} />
              </div>
              
              {locationName && (
                <div className="mt-3 flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                  <MapPin size={18} className="text-[#CE145B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">{locationName}</p>
                    <p className="text-sm text-gray-600">{locationText}</p>
                  </div>
                </div>
              )}
            </div>
            
            {errors.location && (
              <p className="text-red-500 text-sm mb-3">{errors.location}</p>
            )}
            
            <div className="bg-[#CE145B]/10 p-3 rounded-md mb-4">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Place the pin exactly where your salon is located to help customers find you easily.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                className="flex-1 p-3 rounded-md border-2 border-[#CE145B] text-[#CE145B] font-bold md:text-lg hover:bg-[#CE145B]/5 transition-colors"
                onClick={() => setCurrentStep("2")}
                disabled={isLoading}
              >
                Back
              </button>
              <button
                className="flex-1 p-3 rounded-md bg-[#CE145B] text-white font-bold md:text-lg hover:bg-opacity-90 transition-colors flex justify-center items-center"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-3">
              Final step - Your salon will be live after this!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}