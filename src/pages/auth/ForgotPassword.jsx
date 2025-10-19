import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { requestPasswordReset } from "../../services/authService";
import {
  FaEnvelope,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaLink,
  FaKey
} from "react-icons/fa";
import { forgetPasswordService } from "../../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: email input, 2: options sent
  const [resetMethod, setResetMethod] = useState(null); // 'link' or 'otp'

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await forgetPasswordService( email);
      console.log(res);

      setSuccess(true);
      setStep(2);

      // Store email for the next steps
      localStorage.setItem('resetEmail', email);
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to send reset instructions. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (method) => {
    setResetMethod(method);
    if (method === 'otp') {
      navigate("/verify-otp");
    }
    // For 'link' method, user just needs to check their email
  };

  const handleResendInstructions = async () => {
    setLoading(true);
    setError("");

    try {
      await requestPasswordReset({ email });
      setError(""); // Clear any previous errors
    } catch (err) {
      const errorMessage = err.response?.data?.message ||
        "Failed to resend instructions. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          {/* Success Message */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <FaCheckCircle className="text-green-600 text-4xl" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Check Your Email!
            </h2>

            <p className="text-gray-600 mb-2">
              We've sent password reset instructions to:
            </p>

            <p className="text-green-600 font-semibold mb-6 bg-green-50 py-2 px-4 rounded-lg">
              {email}
            </p>

            <div className="space-y-4 mb-6">
              {/* Reset Link Option */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <FaLink className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-1">
                      Reset Link Method
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Click the secure reset link in your email to set a new password immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Option */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
                <div className="flex items-start space-x-3">
                  <FaKey className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-1">
                      OTP Method
                    </h4>
                    <p className="text-green-700 text-sm">
                      Use the 6-digit OTP from your email to verify and reset your password.
                    </p>
                    <button
                      onClick={() => handleMethodSelect('otp')}
                      className="mt-2 w-full py-2 bg-green-600 text-white rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors"
                    >
                      Enter OTP
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-yellow-800 text-sm mb-2 flex items-center">
                <FaClock className="mr-2" />
                Important Information
              </h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Both reset link and OTP are valid for 1 hour</li>
                <li>• You can use either method to reset your password</li>
                <li>• Can't find the email? Check your spam folder</li>
                <li>• Links and OTPs are for one-time use only</li>
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleResendInstructions}
                disabled={loading}
                className="w-full py-3 border border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                {loading ? "Resending..." : "Resend Instructions"}
              </button>

              <button
                onClick={() => {
                  setStep(1);
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full py-3 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Use Different Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-3 rounded-full">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive reset instructions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 text-sm mb-1">
              🔒 Dual Verification Methods
            </h4>
            <p className="text-blue-700 text-xs">
              We'll send both a secure reset link and a 6-digit OTP to your email.
              You can use either method to reset your password.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-green-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-green-700"
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending instructions...</span>
              </div>
            ) : (
              "Send Reset Instructions"
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 text-green-600 hover:text-green-800 font-semibold transition-colors"
          >
            <FaArrowLeft size={14} />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;