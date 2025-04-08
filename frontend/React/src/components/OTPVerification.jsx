import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/auth.store.js";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const OTPVerification = () => {
  const { resendOTP, postUserOTP, authUser, isOtpPending } = useAuthStore();
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef(Array(6).fill(null));

  const navigate = useNavigate();
  const location = useLocation();

  // Ensure location.state exists to avoid undefined errors
  const { email, username, password } = location.state || {};

  // Redirect if user is authenticated and OTP is not pending
  useEffect(() => {
    if (authUser && !isOtpPending) {
      navigate("/home");
    }
  }, [authUser, isOtpPending, navigate]);

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const handleResend = async () => {
    if (!email || !username) {
      toast.error("Missing email or username. Please retry.");
      return;
    }

    try {
      await resendOTP(email, username);
      setIsResendDisabled(true);
    } catch (error) {
      toast.error("Failed to resend OTP. Try again.");
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleClick = async () => {
    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter all 6 digits.");
      return;
    }

    const otpString = otp.join("");

    try {
      await postUserOTP(otpString, email, username, password);
    } catch (error) {
      toast.error("OTP Verification failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-4">
          Verify Your OTP
        </h2>
        <p className="text-gray-600 text-sm sm:text-base text-center mb-6 sm:mb-8">
          We’ve sent a 6-digit OTP to your email. Please enter it below.
        </p>

        {/* OTP Input Form */}
        <form className="space-y-6">
          <div className="flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                type="text"
                maxLength="1"
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                autoFocus={i === 0}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                ref={(el) => (inputRefs.current[i] = el)}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleClick}
            type="button"
            className="w-full cursor-pointer bg-indigo-600 text-white py-2.5 sm:py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm sm:text-base font-medium"
          >
            Verify OTP
          </button>
        </form>

        {/* Resend Section */}
        <p className="text-gray-600 text-sm sm:text-base text-center mt-6">
          Didn’t receive the OTP?{" "}
          <button
            onClick={handleResend}
            className={`text-indigo-600 cursor-pointer hover:text-indigo-800 font-medium transition-colors ${
              isResendDisabled ? "opacity-50 cursor-not-allowed" : "hover:underline"
            }`}
            disabled={isResendDisabled}
          >
            {isResendDisabled ? `Resend in ${timer}s` : "Resend OTP"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;