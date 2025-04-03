'use client';
import { SEND_OTP_FN, VERIFY_OTP_FN } from "@/services/userService";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from "next/link";

export default function Login() {
    const [isOtpView, setIsOtpView] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [phoneError, setPhoneError] = useState("");
    const [otpError, setOtpError] = useState("");
    const [nameError, setNameError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef([]);
    const router = useRouter();
    const { login } = useAuth();
    
    // Timer for resend OTP
    useEffect(() => {
        let interval;
        if (resendDisabled && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setResendDisabled(false);
            setTimer(30);
        }
        return () => clearInterval(interval);
    }, [resendDisabled, timer]);


    // Validate phone number
    const validatePhone = () => {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneNumber) {
            setPhoneError("Phone number is required");
            return false;
        }
        if (!phoneRegex.test(phoneNumber)) {
            setPhoneError("Please enter a valid 10-digit phone number");
            return false;
        }
        setPhoneError("");
        return true;
    };

    // Validate OTP
    const validateOtp = () => {
        if (otp.some(digit => digit === "")) {
            setOtpError("Please enter the complete OTP");
            return false;
        }
        if (otp.some(digit => isNaN(digit))) {
            setOtpError("OTP must contain only numbers");
            return false;
        }
        setOtpError("");
        return true;
    };

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        setOtpError("");
        if (value.length > 1) {
            // Handle paste
            const pastedData = value.slice(0, 4).split("");
            const newOtp = [...otp];
            pastedData.forEach((char, idx) => {
                if (idx < 4) newOtp[idx] = char;
            });
            setOtp(newOtp);
            // Focus last input if paste fills all fields
            if (inputRefs.current[3]) {
                inputRefs.current[3].focus();
            }
            return;
        }

        // Allow only numbers
        if (value && !/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
            setOtpError("");
        }
    };

    // Handle send OTP button click
    const handleSendOtp = async () => {
        if (isOtpView) {
            if (validateOtp()) {
                setIsLoading(true);
                try {
                    const response = await VERIFY_OTP_FN(name, otp.join(""), 'login');
                    if (response.status === 200) {
                        console.log("Loign User id =>",response);
                        login({
                            user_id:response.data.data.user_id,
                            access_token: response.data.data.access_token
                        });
                        router.replace('/home');
                    } else {
                        // Handle other response statuses
                        const errorMsg = response.data?.message || "Failed to verify OTP. Please try again.";
                        setOtpError(errorMsg);
                    }
                } catch (error) {
                    console.error("OTP verification failed:", error);
                    setOtpError(error.response?.data?.message || "Invalid OTP. Please try again.");
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            if (validatePhone()) {
                setIsLoading(true);
                try {
                    const response = await SEND_OTP_FN(phoneNumber , 'login');
                    if (response.status === 200) {
                        setIsOtpView(true);
                        setResendDisabled(true);
                        setTimeout(() => {
                            if (inputRefs.current[0]) {
                                inputRefs.current[0].focus();
                            }
                        }, 100);
                    } else if (response.status === 400) {
                        setPhoneError('Phone number already exists. Please login instead.');
                    } else {
                        setPhoneError(response?.message || "Something went wrong. Please try again.");
                    }
                } catch (error) {
                    console.error("Failed to send OTP:", error);
                    setPhoneError(error.response?.data?.message || "Failed to send OTP. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    // Handle phone number change
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (value === "" || /^\d*$/.test(value)) {
            setPhoneNumber(value);
            setPhoneError("");
        }
    };

    // Handle name change
    const handleNameChange = (e) => {
        setName(e.target.value);
        setNameError("");
    };

    // Handle resend OTP
    const handleResendOtp = async () => {
        if (!resendDisabled) {
            setIsLoading(true);
            try {
                const response = await SEND_OTP_FN(phoneNumber);
                if (response.status === 200) {
                    setResendDisabled(true);
                    setTimer(30);
                    setOtp(["", "", "", ""]);
                    setOtpError("");
                    if (inputRefs.current[0]) {
                        inputRefs.current[0].focus();
                    }
                } else {
                    setOtpError(response.data?.message || "Failed to resend OTP. Please try again.");
                }
            } catch (error) {
                console.error("Failed to resend OTP:", error);
                setOtpError(error.response?.data?.message || "Failed to resend OTP. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Handle edit phone number
    const handleEditPhone = () => {
        setIsEditingPhone(true);
        setIsOtpView(false);
        setOtp(["", "", "", ""]);
        setOtpError("");
        setResendDisabled(false);
        setTimer(30);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-[#F6D7D3]">
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Left side - Image */}
                <div className="md:w-1/2 relative hidden md:block">
                    <img
                        src="register-image.png"
                        alt="Salon Services"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#CE145B]/30 to-transparent"></div>
                    
                    {/* Brand Overlay */}
                    <div className="absolute left-8 bottom-8 text-white">
                        <h2 className="text-3xl font-bold mb-2">Cut My Hair</h2>
                        <p className="text-sm md:text-base max-w-xs">Your premier destination for salon services and haircare</p>
                    </div>
                </div>
                
                {/* Mobile Image */}
                <div className="h-48 relative md:hidden">
                    <img
                        src="register-image.png"
                        alt="Salon Services"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#CE145B]/20 to-transparent"></div>
                    
                    {/* Logo on mobile */}
                    <div className="absolute top-4 left-4">
                        <h2 className="text-2xl font-bold text-white">Cut My Hair</h2>
                    </div>
                </div>
                
                {/* Right side - Form */}
                <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-0">
                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-10">
                            <h1 className="font-bold text-3xl sm:text-4xl mb-3 text-gray-900">
                                {isOtpView ? "Verify your number" : "Login"}
                            </h1>
                            <p className="text-gray-600">
                                {isOtpView 
                                    ? "Enter the 4-digit code sent to your mobile number."
                                    : "Login using your mobile number to continue."}
                            </p>
                        </div>
                        
                        {/* Phone Number Input */}
                        {!isOtpView ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-500">+91</span>
                                        </div>
                                        <input
                                            id="phone"
                                            type="text"
                                            placeholder="Enter 10-digit number"
                                            value={phoneNumber}
                                            onChange={handlePhoneChange}
                                            maxLength={10}
                                            className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                                                phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-[#CE145B]'
                                            } focus:border-[#CE145B] focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors`}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {phoneError && (
                                        <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg ${
                                        isLoading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-[#CE145B] hover:bg-[#B0124F] active:bg-[#9E1046]'
                                    } text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-opacity-50`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : "Send OTP"}
                                </button>
                                
                                <div className="text-center">
                                    <p className="text-gray-600">
                                        New to our platform?{" "}
                                        <Link href="/register" className="text-[#CE145B] hover:underline font-medium">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* OTP Verification View */
                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                                    <span className="text-gray-700">
                                        <span className="font-medium">OTP sent to:</span> +91 {phoneNumber}
                                    </span>
                                    <button 
                                        onClick={handleEditPhone}
                                        className="text-[#CE145B] hover:text-[#B0124F] font-medium hover:underline"
                                        disabled={isLoading}
                                    >
                                        Edit
                                    </button>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Enter 4-digit OTP
                                    </label>
                                    <div className="flex gap-2 sm:gap-3">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={4}
                                                value={digit}
                                                ref={(el) => (inputRefs.current[index] = el)}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pastedText = e.clipboardData.getData("text");
                                                    handleOtpChange(index, pastedText);
                                                }}
                                                className={`w-full h-12 sm:h-14 text-center rounded-lg border-2 
                                                    ${otpError ? 'border-red-500' : 'border-gray-300'} 
                                                    focus:border-[#CE145B] focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-opacity-20 text-lg font-medium transition-colors`}
                                                disabled={isLoading}
                                            />
                                        ))}
                                    </div>
                                    {otpError && (
                                        <p className="text-red-500 text-sm mt-1">{otpError}</p>
                                    )}
                                </div>
                                
                                <div className="flex justify-center">
                                    <button 
                                        onClick={handleResendOtp}
                                        className={`text-sm ${
                                            resendDisabled || isLoading
                                                ? 'text-gray-400 cursor-not-allowed' 
                                                : 'text-[#CE145B] hover:text-[#B0124F] hover:underline'
                                        } font-medium`}
                                        disabled={resendDisabled || isLoading}
                                    >
                                        {resendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
                                    </button>
                                </div>
                                
                                <button 
                                    onClick={handleSendOtp}
                                    disabled={isLoading}
                                    className={`w-full py-3 px-4 rounded-lg ${
                                        isLoading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-[#CE145B] hover:bg-[#B0124F] active:bg-[#9E1046]'
                                    } text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CE145B] focus:ring-opacity-50`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Verifying...
                                        </span>
                                    ) : "Verify OTP"}
                                </button>
                            </div>
                        )}
                        
                        {/* Social Links */}
                        <div className="mt-12">
                            <div className="flex justify-center space-x-6">
                                <a href="#" className="text-gray-500 hover:text-[#CE145B] transition-colors">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-[#CE145B] transition-colors">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-500 hover:text-[#CE145B] transition-colors">
                                    <Twitter size={20} />
                                </a>
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-4">
                                &copy; {new Date().getFullYear()} Cut My Hair. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}