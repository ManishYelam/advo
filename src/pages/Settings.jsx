import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { changePasswordWithOtp, oldChangePasswordService } from "../services/authService";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [passwordChangeMethod, setPasswordChangeMethod] = useState("current"); // "current" or "otp"
  const [otpData, setOtpData] = useState({
    otp: "",
    sent: false,
    verified: false,
    countdown: 0,
    attempts: 0
  });

  // User data from localStorage with safe parsing
  const [user, setUser] = useState({});
  
  useEffect(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setProfileData({
          full_name: parsedUser.full_name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone_number || "",
          address: parsedUser.address || "",
          occupation: parsedUser.occupation || "",
          bio: parsedUser.bio || ""
        });
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      setUser({});
    }
  }, []);

  // Form states
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    bio: ""
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [preferences, setPreferences] = useState({
    language: "english",
    theme: "light",
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    autoSave: true,
    twoFactorAuth: false
  });

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpData.countdown > 0) {
      interval = setInterval(() => {
        setOtpData(prev => ({
          ...prev,
          countdown: prev.countdown - 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpData.countdown]);

  // Password strength validation function
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  };

  // Send OTP function
  const handleSendOtp = async () => {
    if (otpData.countdown > 0) {
      alert(`Please wait ${otpData.countdown} seconds before requesting a new OTP`);
      return;
    }

    if (otpData.attempts >= 5) {
      alert("Too many OTP attempts. Please try again after 30 minutes.");
      return;
    }

    setOtpLoading(true);

    try {
      // Simulate API call to send OTP
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOtpData(prev => ({
        ...prev,
        sent: true,
        countdown: 60, // 60 seconds countdown
        attempts: prev.attempts + 1,
        verified: false,
        otp: "" // Clear previous OTP
      }));

      alert(`OTP sent successfully to your registered email/phone!`);
    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP function
  const handleVerifyOtp = async () => {
    if (!otpData.otp || otpData.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyOtpLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo OTP for testing - in real app, verify with backend
      const isValid = otpData.otp === "123456";

      if (isValid) {
        setOtpData(prev => ({
          ...prev,
          verified: true
        }));
        alert("OTP verified successfully! You can now set your new password.");
      } else {
        alert("Invalid OTP. Please try again.");
        setOtpData(prev => ({
          ...prev,
          otp: ""
        }));
      }
    } catch (error) {
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  // Reset OTP state
  const resetOtpState = () => {
    setOtpData({
      otp: "",
      sent: false,
      verified: false,
      countdown: 0,
      attempts: 0
    });
  };

  // Reset security form
  const resetSecurityForm = () => {
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!profileData.full_name.trim()) {
      alert("Full name is required!");
      return;
    }

    if (!profileData.email.trim()) {
      alert("Email is required!");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();

    // Method-specific validation
    if (passwordChangeMethod === "current") {
      if (!securityData.currentPassword) {
        alert("Please enter your current password!");
        return;
      }
    } else {
      if (!otpData.verified) {
        alert("Please verify OTP first!");
        return;
      }
    }

    // Password confirmation validation
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    // Password strength validation
    const passwordValidation = validatePassword(securityData.newPassword);
    if (!passwordValidation.isValid) {
      alert("Password does not meet the strength requirements!");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real app, you would call:
      if (passwordChangeMethod === "current") {
        // Fixed: Use actual variable names from securityData state
        await oldChangePasswordService(
          securityData.currentPassword, 
          securityData.newPassword
        );
      } else {
        // Fixed: Use actual variable names
        await changePasswordWithOtp({ 
          otp: otpData.otp, 
          new_password: securityData.newPassword 
        });
      }

      // Reset all forms
      resetSecurityForm();
      resetOtpState();
      
      alert("Password updated successfully!");
    } catch (error) {
      alert(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (type, value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value
      }
    }));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
  ];

  // Get password requirements status
  const passwordValidation = securityData.newPassword ? validatePassword(securityData.newPassword) : null;

  return (
    <DashboardLayout>
      <div className="m-3">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={profileData.occupation}
                        onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter your occupation"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>

                {/* Password Change Method Toggle */}
                <div className="mb-6">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        setPasswordChangeMethod("current");
                        resetOtpState();
                        resetSecurityForm();
                      }}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        passwordChangeMethod === "current"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Use Current Password
                    </button>
                    <button
                      onClick={() => {
                        setPasswordChangeMethod("otp");
                        resetSecurityForm();
                      }}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        passwordChangeMethod === "otp"
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Use OTP Verification
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSecurityUpdate} className="space-y-6">
                  {/* Current Password Method */}
                  {passwordChangeMethod === "current" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                  )}

                  {/* OTP Method */}
                  {passwordChangeMethod === "otp" && (
                    <div className="space-y-4">
                      {/* OTP Send Section */}
                      {!otpData.sent && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-800">
                                Verify your identity with OTP
                              </p>
                              <p className="text-sm text-blue-600 mt-1">
                                We'll send a 6-digit code to your registered email/phone
                              </p>
                            </div>
                            <Button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpLoading || otpData.countdown > 0}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              {otpLoading ? "Sending..." : otpData.countdown > 0 ? `Resend in ${otpData.countdown}s` : "Send OTP"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* OTP Input Section */}
                      {otpData.sent && !otpData.verified && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <label className="block text-sm font-medium text-yellow-800 mb-2">
                            Enter OTP
                          </label>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              maxLength={6}
                              value={otpData.otp}
                              onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                              className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-center text-lg font-mono"
                              placeholder="123456"
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={verifyOtpLoading || otpData.otp.length !== 6}
                              className="bg-yellow-600 hover:bg-yellow-700"
                            >
                              {verifyOtpLoading ? "Verifying..." : "Verify OTP"}
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-yellow-700">
                              OTP sent to your registered contact
                            </p>
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpData.countdown > 0}
                              className="text-xs text-yellow-700 hover:text-yellow-800 underline disabled:opacity-50"
                            >
                              {otpData.countdown > 0 ? `Resend in ${otpData.countdown}s` : "Resend OTP"}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* OTP Verified Section */}
                      {otpData.verified && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium text-green-800">
                              OTP verified successfully
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter new password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">Password Requirements</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li className={`flex items-center gap-2 ${passwordValidation?.requirements.minLength ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.minLength ? '✓' : '•'}</span>
                        Minimum 8 characters
                      </li>
                      <li className={`flex items-center gap-2 ${passwordValidation?.requirements.hasUpperCase ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasUpperCase ? '✓' : '•'}</span>
                        At least one uppercase letter
                      </li>
                      <li className={`flex items-center gap-2 ${passwordValidation?.requirements.hasLowerCase ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasLowerCase ? '✓' : '•'}</span>
                        At least one lowercase letter
                      </li>
                      <li className={`flex items-center gap-2 ${passwordValidation?.requirements.hasNumbers ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasNumbers ? '✓' : '•'}</span>
                        At least one number
                      </li>
                      <li className={`flex items-center gap-2 ${passwordValidation?.requirements.hasSpecialChar ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasSpecialChar ? '✓' : '•'}</span>
                        At least one special character
                      </li>
                    </ul>
                  </div>

                  {/* Demo Note for OTP */}
                  {passwordChangeMethod === "otp" && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-sm text-purple-700">
                        <strong>Demo Note:</strong> Use "123456" as OTP for testing purposes.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading || (passwordChangeMethod === "otp" && !otpData.verified)}
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>

                {/* Two-Factor Authentication */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.twoFactorAuth}
                        onChange={(e) => handlePreferenceChange("twoFactorAuth", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {/* Preferences */}
            {activeTab === "preferences" && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Application Preferences</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) => handlePreferenceChange("language", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="marathi">Marathi</option>
                        <option value="gujarati">Gujarati</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => handlePreferenceChange("theme", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Auto-save Documents</p>
                      <p className="text-sm text-gray-600">Automatically save document changes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={(e) => handlePreferenceChange("autoSave", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.email}
                        onChange={(e) => handleNotificationChange("email", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                      <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.push}
                        onChange={(e) => handleNotificationChange("push", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">SMS Notifications</p>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.notifications.sms}
                        onChange={(e) => handleNotificationChange("sms", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                </div>

                {/* Notification Types */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="case-updates" defaultChecked className="rounded text-green-600" />
                      <label htmlFor="case-updates" className="text-sm text-gray-700">Case updates and hearings</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="document-changes" defaultChecked className="rounded text-green-600" />
                      <label htmlFor="document-changes" className="text-sm text-gray-700">Document changes and approvals</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="payment-updates" defaultChecked className="rounded text-green-600" />
                      <label htmlFor="payment-updates" className="text-sm text-gray-700">Payment updates and receipts</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="system-alerts" className="rounded text-green-600" />
                      <label htmlFor="system-alerts" className="text-sm text-gray-700">System alerts and maintenance</label>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;