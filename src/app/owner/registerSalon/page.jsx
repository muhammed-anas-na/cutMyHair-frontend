'use client';
import { Facebook, Instagram, Twitter, X } from "lucide-react";
import { useEffect, useState } from "react";
import StepIndicator from "@/components/Stepper/page";
import { GET_LOCATION_FROM_TEXT_FN } from "@/services/userService";
import { useLocation } from "@/context/LocationContext";
import { useRouter } from "next/navigation";
import uploadImageToCloudinary from '@/services/cloudinary.js';
import { CREATE_SALON_FN } from "@/services/ownerService";
import { useAuth } from "@/context/AuthContext";
import { useSalon } from "@/context/SalonContext";
import LocatemeMap from "@/components/LocateMeMap/page";
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
    >
      <X size={14} className="text-[#CE145B]" />
    </button>
  </div>
);


export default function Register() {
  const [currentStep, setCurrentStep] = useState("1");
  const { setLocation } = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const {user_id} = useAuth()
  const router = useRouter();
  const {setSalonId} = useSalon();
  //Screen 01
  const [salonName, setSalonName] = useState("");
  //Screen 02
  const [images, setImages] = useState([]);
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  //Screen 02
  const [locationInput, setLocationInput] = useState('');
  const [suggestedLocations, setSuggestedLocations] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [locationText, setLocationText] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();



  const handleLocationSelect = (selectedLocation) => {
    setLatitude(selectedLocation.latitude);
    setLongitude(selectedLocation.longitude);
    setLocationText(selectedLocation.text);
    setLocationName(selectedLocation.name);
  };

  const handleImageUpload = (e) => {
    const newImages = [...images];
    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push(e.target.files[i]);
    }
    setImages(newImages);
  };

  const removeImage = (imageToRemove) => {
    setImages(images.filter(image => image !== imageToRemove));
  };

  const handleSubmit = async () => {
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
        router.replace(`/owner/success?message=${salonName}%20Registration%20Successful&redirect=/owner/numberofseats`);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F6D7D3]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="md:w-1/2 relative">
          <img
            src="../register-image.png"
            alt="CoverImage"
            className="w-full h-auto md:object-cover md:h-screen"
          />
          {currentStep === "1" && (
            <Link
            href={'/owner/dashboard'} 
              className="absolute top-4 right-4 px-4 py-1 bg-white bg-opacity-80 rounded-full text-sm cursor-pointer"
              
            >
              Skip
            </Link>
          )}
        </div>

        {currentStep === "1" && (
          <div className="flex flex-col gap-3 mx-10 md:w-1/2 md:px-20 md:justify-center">
            <StepIndicator totalSteps={3} currentStep={1} />
            <h1 className="font-bold text-4xl md:text-5xl">Salon Name</h1>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                placeholder="eg: Elevate Salon"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                maxLength={40}
                className="p-3 rounded-md md:text-lg border-2"
              />
            </div>
            <button
              className="p-3 rounded-md bg-[#CE145B] text-white font-bold md:text-lg hover:bg-opacity-90 transition-colors"
              onClick={() => setCurrentStep("2")}
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "2" && (
          <div className="flex flex-col gap-3 mx-10 md:w-1/2 md:px-20 md:justify-center">
            <StepIndicator totalSteps={3} currentStep={2} />
            <h1 className="font-bold text-4xl md:text-5xl">Details</h1>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-gray-600">Contact Number</label>
                <input
                  type="text"
                  placeholder="eg: 1234567890"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  maxLength={10}
                  className="p-3 rounded-md md:text-lg border-2"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-600">Address</label>
                <input
                  type="text"
                  placeholder="eg: HSR Layout Bangalore, 7 Street"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="p-3 rounded-md md:text-lg border-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-gray-600">Images</p>
                <div className="relative">
                  <input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('imageUpload').click()}
                    className="w-full py-2 px-4 bg-white rounded-lg border-2 text-[#CE145B] text-right"
                  >
                    Insert
                  </button>
                </div>
                
                {images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto py-3 scrollbar-hide">
                    {images.map((image, index) => (
                      <ImagePreview 
                        key={index} 
                        image={image} 
                        onRemove={() => removeImage(image)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                className="flex-1 p-3 rounded-md border-2 border-[#CE145B] text-[#CE145B] font-bold md:text-lg hover:bg-[#CE145B] hover:text-white transition-colors"
                onClick={() => setCurrentStep("1")}
              >
                Back
              </button>
              <button
                className="flex-1 p-3 rounded-md bg-[#CE145B] text-white font-bold md:text-lg hover:bg-opacity-90 transition-colors"
                onClick={() => setCurrentStep("3")}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === "3" && (
          <div className="flex flex-col mx-10 md:w-1/2 md:px-20 md:justify-center">
          <StepIndicator totalSteps={3} currentStep={3} />
          <h1 className="font-bold text-4xl md:text-5xl">Locate Salon</h1>
          <div className="relative flex flex-col">
            {/* <input
              type="text"
              placeholder="Enter Location"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="p-3 rounded-md md:text-lg border-2"
            /> */}
            {/* {suggestedLocations.length > 0 && (
              <ul className="absolute top-full left-0 w-full max-h-24 overflow-y-auto divide-y rounded-lg border bg-white z-10">
                {suggestedLocations.map((location, index) => (
                  <li key={index} onClick={() => handleSelectLocation(location)} className="py-2 px-4 cursor-pointer hover:bg-[#FCE4EC]">
                    {location.text}<br/>
                    <small>{location.name}</small>
                  </li>
                ))}
              </ul>
            )} */}
          <LocateMeMap onLocationSelect={handleLocationSelect} />
          </div>
          <div className="flex gap-3 mt-3">
            <button
              className="flex-1 p-3 rounded-md border-2 border-[#CE145B] text-[#CE145B] font-bold md:text-lg hover:bg-[#CE145B] hover:text-white transition-colors"
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
                "Finish"
              )}
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}