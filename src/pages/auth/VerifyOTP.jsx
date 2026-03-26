// VerifyOTP.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaShieldAlt, FaArrowLeft, FaCheck, FaClock, FaTimes, FaLock, FaEye, FaEyeSlash
} from "react-icons/fa";
import { changePasswordWithOtp } from "../../services/authService";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const email = localStorage.getItem('resetEmail');

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clear error when OTP or password fields change
  const clearError = () => setError("");

  const handleChange = (index, value) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1].focus();
    clearError(); // Clear any previous error when OTP changes
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const alnumChars = pastedData.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6);
    if (alnumChars.length === 6) {
      setOtp(alnumChars.split(''));
      inputRefs.current[5].focus();
    } else if (alnumChars.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < alnumChars.length; i++) newOtp[i] = alnumChars[i];
      setOtp(newOtp);
      const nextIndex = Math.min(alnumChars.length, 5);
      if (nextIndex <= 5) inputRefs.current[nextIndex].focus();
    }
    clearError();
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    clearError(); // Clear error when user types new password
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    clearError(); // Clear error when user types confirm password
  };

  const validatePassword = () => {
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();
    // console.log(trimmedNew,trimmedConfirm);
    
    if (trimmedNew.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (trimmedNew !== trimmedConfirm) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 characters of the OTP");
      return;
    }
    if (!validatePassword()) return;

    setLoading(true);
    setError("");

    try {
      await changePasswordWithOtp(email, {
        otp: otpString,
        new_password: newPassword.trim() // Send trimmed password
      });

      setSuccess(true);
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetOTP");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const message = err.response?.data?.error ||
                      err.response?.data?.message ||
                      "Invalid OTP or password. Please try again.";
      setError(message);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError("");
    try {
      // await requestPasswordResetOTP({ email }); // your resend service
      setTimer(600);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0].focus();
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheck className="text-green-600 text-4xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Password Reset Successful!</h2>
          <p className="text-gray-600">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600 mb-2">We sent a 6‑character code to:</p>
          <p className="text-green-600 font-semibold">{email}</p>
        </div>

        <div className="text-center mb-6">
          <div className={`text-sm font-medium ${timer > 60 ? 'text-green-600' : 'text-red-600'}`}>
            <FaClock className="inline mr-1" />
            OTP expires in: {formatTime(timer)}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
            Enter the 6‑character verification code
          </label>
          <div className="flex justify-center space-x-2 mb-4">
            {otp.map((char, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={char}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={idx === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                disabled={loading}
              />
            ))}
          </div>
        </div>

        {/* New Password Field */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter new password (min. 6 characters)"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Confirm new password"
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || otp.some(ch => ch === "") || !newPassword || !confirmPassword}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 mb-4"
        >
          {loading ? "Resetting Password..." : "Reset Password"}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={handleResendOTP}
            disabled={loading || !canResend}
            className={`text-green-600 font-semibold text-sm ${canResend ? "hover:text-green-800" : "opacity-50 cursor-not-allowed"}`}
          >
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        </div>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate("/forgot-password")}
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800"
          >
            <FaArrowLeft size={14} />
            <span>Use Different Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;