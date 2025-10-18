import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupService } from "../../services/authService";
import lawyer from "../../assets/lawyer-login.png";
import { 
  FaEye, 
  FaEyeSlash, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaUserShield,
  FaBalanceScale,
  FaCheck,
  FaTimes,
  FaGoogle,
  FaGithub
} from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "client",
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check password strength in real-time
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      return "Full name is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (!formData.password) {
      return "Password is required";
    }

    if (passwordStrength.score < 3) {
      return "Please choose a stronger password";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      return "Please agree to the terms and conditions";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword from submission data
      const { confirmPassword, agreeToTerms, ...submitData } = formData;
      
      console.log("Signup Data:", submitData);
      await signupService(submitData);
      
      // Show success message and redirect
      navigate("/login", { 
        state: { 
          message: "Account created successfully! Please login to continue.",
          type: "success"
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Signup failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSocialSignup = (provider) => {
    console.log(`Social signup with ${provider}`);
    setError(`${provider} signup will be implemented soon`);
  };

  const getPasswordStrengthColor = (score) => {
    if (score === 0) return "bg-gray-200";
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (score) => {
    if (score === 0) return "Very Weak";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Good";
    if (score <= 4) return "Strong";
    return "Very Strong";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-2xl rounded-2xl overflow-hidden bg-white">
        
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 p-8 flex-col items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="mb-6 flex justify-center">
              <div className="bg-white bg-opacity-20 p-4 rounded-2xl">
                <FaBalanceScale size={48} className="text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 font-serif">
              Satyamev Jayate
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Join Our Legal Community
            </p>
            
            <img
              src={lawyer}
              alt="Legal Professionals"
              className="w-80 h-64 object-contain rounded-lg shadow-2xl"
            />
            
            <div className="mt-8 text-left bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Benefits of joining:</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Secure case management</li>
                <li>• Client communication portal</li>
                <li>• Document storage and sharing</li>
                <li>• Real-time updates</li>
                <li>• Professional network</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <FaUserShield size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 mb-8">
              Join our legal practice management platform
            </p>
          </div>

          {/* Social Signup Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              <FaGoogle className="text-red-500" />
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup("github")}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              <FaGithub className="text-gray-800" />
              <span className="text-sm">GitHub</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700 text-sm">
                <FaTimes className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name Field */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                required
                disabled={loading}
              />
            </div>

            {/* Role Selection */}
            <div className="relative">
              <FaUserShield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm appearance-none bg-white"
                disabled={loading}
              >
                <option value="client">Client</option>
                <option value="admin">Administrator</option>
                <option value="advocate">Legal Advocate</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.score <= 2 ? 'text-red-600' :
                      passwordStrength.score <= 3 ? 'text-yellow-600' :
                      passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Requirements:</p>
                      <ul className="space-y-1">
                        {passwordStrength.feedback.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <FaTimes className="text-red-400 text-xs" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all shadow-sm"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <div className={`flex items-center space-x-2 text-sm ${
                formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'
              }`}>
                {formData.password === formData.confirmPassword ? (
                  <FaCheck className="flex-shrink-0" />
                ) : (
                  <FaTimes className="flex-shrink-0" />
                )}
                <span>
                  {formData.password === formData.confirmPassword 
                    ? "Passwords match" 
                    : "Passwords do not match"
                  }
                </span>
              </div>
            )}

            {/* Terms and Conditions */}
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-green-600 hover:text-green-800 font-medium">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-green-600 hover:text-green-800 font-medium">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:from-green-700 hover:to-green-800"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-green-600 hover:text-green-800 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;