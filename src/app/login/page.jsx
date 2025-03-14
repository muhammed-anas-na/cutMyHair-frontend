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
        <div className="min-h-screen bg-[#F6D7D3]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="md:w-1/2">
                    <img
                        src="register-image.png"
                        alt="CoverImage"
                        className="w-full h-auto md:object-cover md:h-screen"
                    />
                </div>
                <div className="flex flex-col gap-3 mx-10 md:w-1/2 md:px-20 md:justify-center">
                    <h1 className="font-bold text-4xl md:text-5xl">Login</h1>
                    <p className="font-extralight md:text-lg">
                        {isOtpView 
                            ? "Enter the OTP sent to your mobile number."
                            : "Login using your mobile number to continue."}
                    </p>
                    
                    {!isOtpView ? (
                        <div className="flex flex-col gap-3">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter mobile Number"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    maxLength={10}
                                    className={`p-3 rounded-md md:text-lg w-full ${
                                        phoneError ? 'border-2 border-red-500' : ''
                                    }`}
                                />
                                {phoneError && (
                                    <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <span>OTP sent to: {phoneNumber}</span>
                                <button 
                                    onClick={handleEditPhone}
                                    className="text-[#CE145B] font-medium hover:underline"
                                    disabled={isLoading}
                                >
                                    Edit
                                </button>
                            </div>
                            <div className="flex gap-2 justify-center">
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
                                        className={`w-14 h-14 text-center rounded-md border-2 
                                            ${otpError ? 'border-red-500' : 'border-gray-300'} 
                                            focus:border-[#CE145B] focus:outline-none text-lg`}
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>
                            {otpError && (
                                <p className="text-red-500 text-sm text-center mt-1">{otpError}</p>
                            )}
                            <div className="flex justify-center gap-1 text-sm">
                                <span>Didn't receive OTP?</span>
                                <button 
                                    onClick={handleResendOtp}
                                    className={`${
                                        resendDisabled || isLoading
                                            ? 'text-gray-400 cursor-not-allowed' 
                                            : 'text-[#CE145B] hover:underline'
                                    } font-medium`}
                                    disabled={resendDisabled || isLoading}
                                >
                                    {resendDisabled ? `Resend in ${timer}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className={`p-3 rounded-md bg-[#CE145B] text-white font-bold md:text-lg hover:bg-opacity-90 transition-colors ${
                            isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? "Please wait..." : (isOtpView ? "Verify OTP" : "Send OTP")}
                    </button>
                    {
                        !isOtpView && (
                            <div className="text-center mb-5">
                                <Link href={'/register'} className="">New to our platform ?</Link>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}