// ForgotPassword.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaShieldAlt, FaCheckCircle } from "react-icons/fa";
import { forgetPasswordService } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      await forgetPasswordService(email); // sends OTP to email
      setSuccess(true);
      localStorage.setItem('resetEmail', email);
      // Navigate to OTP verification after a short delay
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
                           err.response?.data?.error ||
                           "Failed to send OTP. Please try again.";
      setError(errorMessage);
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
              <FaCheckCircle className="text-green-600 text-4xl" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            OTP Sent!
          </h2>
          <p className="text-gray-600">
            We've sent a 6‑character OTP to <strong>{email}</strong>. 
            You will be redirected to enter it.
          </p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive an OTP
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <Link to="/login" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800">
            <FaArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;