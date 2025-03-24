'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, Shield, Star, MapPin, Clock, Award, UserCheck } from 'lucide-react';

const VerificationPopup = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const verificationSteps = [
    {
      icon: <Shield className="w-12 h-12 text-[#CE145B]" />,
      title: "Verified by Cut My Hair",
      description: "Our seal of quality assurance guarantees an exceptional salon experience.",
      details: "When you see this badge, you can trust that our team has personally visited and verified the salon's quality."
    },
    {
      icon: <MapPin className="w-12 h-12 text-[#CE145B]" />,
      title: "Location Verified",
      description: "We confirm the salon's address and accessibility information.",
      details: "Our team has physically visited the location, verified parking options, accessibility features, and the overall ambiance of the salon."
    },
    {
      icon: <UserCheck className="w-12 h-12 text-[#CE145B]" />,
      title: "Stylist Credentials",
      description: "All stylist qualifications and experiences are authenticated.",
      details: "We verify professional credentials, training certificates, and experience claims to ensure you're in skilled hands."
    },
    {
      icon: <Clock className="w-12 h-12 text-[#CE145B]" />,
      title: "Service Accuracy",
      description: "We confirm service offerings, duration, and pricing.",
      details: "Pricing is transparent with no hidden costs, and service times are accurately represented based on actual observations."
    },
    {
      icon: <Star className="w-12 h-12 text-[#CE145B]" />,
      title: "Quality Standards",
      description: "Salons are evaluated against our strict quality criteria.",
      details: "We assess cleanliness, equipment condition, product quality, customer service, and adherence to health and safety protocols."
    }
  ];
  
  const nextStep = () => {
    if (currentStep < verificationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
      setCurrentStep(0)
    }
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button 
              className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Content */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex flex-col items-center text-center mb-6">
                {/* Progress indicator */}
                <div className="flex space-x-1 mb-6">
                  {verificationSteps.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentStep 
                          ? 'w-6 bg-[#CE145B]' 
                          : index < currentStep 
                            ? 'w-6 bg-pink-200' 
                            : 'w-2.5 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Icon */}
                <motion.div
                  key={`icon-${currentStep}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  {verificationSteps[currentStep].icon}
                </motion.div>
                
                {/* Title */}
                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="text-xl font-bold text-gray-900 mb-2"
                >
                  {verificationSteps[currentStep].title}
                </motion.h2>
                
                {/* Description */}
                <motion.p
                  key={`desc-${currentStep}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="text-gray-600 mb-4"
                >
                  {verificationSteps[currentStep].description}
                </motion.p>
                
                {/* Details */}
                <motion.div
                  key={`details-${currentStep}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-[#FEF0F5] p-4 rounded-lg text-sm text-gray-700 mb-6"
                >
                  {verificationSteps[currentStep].details}
                </motion.div>
                
                {/* Visual examples */}
                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center bg-gray-50 p-3 rounded-lg w-full mb-4"
                  >
                    <div className="flex items-center space-x-1 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-gray-900">
                        Verified by 
                        <span className="text-[#CE145B]"> Cut My Hair</span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Navigation buttons */}
              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button
                    className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={prevStep}
                  >
                    Back
                  </button>
                )}
                
                <button
                  className="flex-1 py-3 bg-[#CE145B] text-white rounded-lg font-medium hover:bg-[#B01050] transition-colors"
                  onClick={nextStep}
                >
                  {currentStep < verificationSteps.length - 1 ? 'Next' : 'Got it'}
                </button>
              </div>
            </div>
            
            {/* Trust indicator */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-center border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Award className="w-4 h-4 text-[#CE145B]" />
                <span>Our verification process is updated every 90 days</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerificationPopup;