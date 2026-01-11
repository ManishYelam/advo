import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import lawyer from "../../assets/lawyer-login.png";
import { 
  FaEye, 
  FaEyeSlash, 
  FaEnvelope, 
  FaLock, 
  FaUserShield, 
  FaBalanceScale,
  FaGoogle,
  FaGithub
} from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ 
    email: "", 
    password: "Pass@123" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  // Demo credentials for testing
  const demoCredentials = [
    { role: "Admin", email: "admin@lawfirm.com", password: "Admin@123" },
    { role: "Advocate", email: "advocate@lawfirm.com", password: "Advocate@123" },
    { role: "Client", email: "client@example.com", password: "Client@123" }
  ];

  // Role-based redirect paths (faster than switch)
  const roleRedirects = {
    admin: "/admin",
    advocate: "/advocate", 
    client: "/client"
  };

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const res = await loginService(formData);
      
      // Remember email if checkbox is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      login(res.data.user, res.data.token);
      
      // Redirect based on role
      const userRole = res.data.user.role;
      const redirectPath = roleRedirects[userRole] || "/client";
      navigate(redirectPath, { 
        replace: true,
        state: { message: `Welcome back, ${res.data.user.full_name || res.data.user.email}!` }
      });
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Login failed. Please check your credentials.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (credential) => {
    setFormData({
      email: credential.email,
      password: credential.password
    });
    setShowDemoInfo(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider) => {
    // Implement social login logic here
    console.log(`Social login with ${provider}`);
    setError(`${provider} login will be implemented soon`);
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
              Justice Management System
            </p>
            
            <img
              src={lawyer}
              alt="Legal Professionals"
              className="w-80 h-64 object-contain rounded-lg shadow-2xl"
            />
            
            <div className="mt-8 text-left bg-white bg-opacity-10 p-4 rounded-xl backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Platform Access</h3>
              <ul className="text-sm space-y-1 opacity-90">
                <li>• Admin: Full system control</li>
                <li>• Advocate: Case management</li>
                <li>• Client: Case tracking & documents</li>
                <li>• Secure role-based access</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-2">
            <div className="lg:hidden flex justify-center mb-4">
              <div className="bg-green-600 p-3 rounded-full">
                <FaUserShield size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in to your legal practice management account
            </p>
          </div>

          {/* Demo Credentials Toggle */}
          {/* <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowDemoInfo(!showDemoInfo)}
              className="w-full text-center text-sm text-green-600 hover:text-green-800 font-medium py-2 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              {showDemoInfo ? "Hide Demo Credentials" : "Show Demo Credentials"}
            </button>
            
            {showDemoInfo && (
              <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Demo Accounts:</h4>
                <div className="space-y-2">
                  {demoCredentials.map((cred, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fillDemoCredentials(cred)}
                      className="w-full text-left p-2 bg-white border border-yellow-300 rounded text-xs text-yellow-700 hover:bg-yellow-100 transition-colors"
                    >
                      <strong>{cred.role}:</strong> {cred.email} / {cred.password}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Each role has different permissions and dashboard access.
                </p>
              </div>
            )}
          </div> */}

          {/* Social Login Buttons */}
          {/* <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              <FaGoogle className="text-red-500" />
              <span className="text-sm">Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              <FaGithub className="text-gray-800" />
              <span className="text-sm">GitHub</span>
            </button>
          </div> */}

          {/* <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div> */}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password Field */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  disabled={loading}
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

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
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-green-600 hover:text-green-800 font-semibold transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your data is securely encrypted and protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;