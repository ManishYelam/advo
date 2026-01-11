import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { changePasswordWithOtp, oldChangePasswordService, resendVerification } from "../services/authService";
import Application from "./Application";
import AdminFeedbackManagement from "../components/AdminFeedbackManagement";
import FeedbackHistory from "../components/FeedbackHistory";
import ContactManagement from "../components/ContactManagement";
import UserContacts from "../components/UserContacts";
import {
  FaFolderOpen,
  FaPlus,
  FaUser,
  FaComments,
  FaHistory,
  FaChartBar,
  FaUsers,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaPalette,
  FaSave,
  FaTimes,
  FaArrowLeft,
  FaAddressBook,
  FaUserPlus
} from "react-icons/fa";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [resendVerificationLoading, setResendVerificationLoading] = useState(false);
  const [passwordChangeMethod, setPasswordChangeMethod] = useState("current");
  const [otpData, setOtpData] = useState({
    otp: "",
    sent: false,
    verified: false,
    countdown: 0,
    attempts: 0
  });

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

  const isAdmin = user.role === 'admin' || user.role === 'Admin';

  const userTabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "my-contacts", label: "My Contacts", icon: FaAddressBook },
    { id: "feedback-history", label: "My Feedback", icon: FaHistory },
  ];

  const adminTabs = [
    { id: "profile", label: "Profile", icon: FaUser },
    { id: "security", label: "Security", icon: FaShieldAlt },
    { id: "contact-management", label: "Contacts", icon: FaAddressBook },
    { id: "feedback-history", label: "My Feedback", icon: FaHistory },
    { id: "cases", label: "Cases", icon: FaFolderOpen },
    { id: "add-case", label: "Add Case", icon: FaPlus },
    { id: "feedback-management", label: "Feedback", icon: FaComments },
  ];

  const tabs = isAdmin ? adminTabs : userTabs;

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
      const response = await changePasswordWithOtp({ action: 'send_otp' });
      
      if (response.success) {
        setOtpData(prev => ({
          ...prev,
          sent: true,
          countdown: 60,
          attempts: prev.attempts + 1,
          verified: false,
          otp: ""
        }));

        alert(`OTP sent successfully!`);
      } else {
        alert(response.message || "Failed to send OTP.");
      }
    } catch (error) {
      alert("Failed to send OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpData.otp || otpData.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setVerifyOtpLoading(true);

    try {
      const response = await changePasswordWithOtp({ 
        otp: otpData.otp,
        action: 'verify_otp'
      });

      if (response.success) {
        setOtpData(prev => ({
          ...prev,
          verified: true
        }));
        alert("OTP verified!");
      } else {
        alert("Invalid OTP.");
        setOtpData(prev => ({
          ...prev,
          otp: ""
        }));
      }
    } catch (error) {
      alert("Failed to verify OTP.");
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  const resetOtpState = () => {
    setOtpData({
      otp: "",
      sent: false,
      verified: false,
      countdown: 0,
      attempts: 0
    });
  };

  const resetSecurityForm = () => {
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleResendVerification = async () => {
    if (!user.id) {
      alert("User not found.");
      return;
    }

    setResendVerificationLoading(true);

    try {
      const response = await resendVerification(user.id);

      if (response.data?.success) {
        alert("Verification email sent!");
      } else {
        alert(response.data?.message || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Resend verification failed:", error);
      alert(error.response?.data?.message || "Network error.");
    } finally {
      setResendVerificationLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileData.full_name.trim()) {
      alert("Full name is required!");
      return;
    }

    if (!profileData.email.trim()) {
      alert("Email is required!");
      return;
    }

    const emailChanged = profileData.email !== user.email;
    if (emailChanged) {
      const updatedUser = {
        ...user,
        ...profileData,
        email_verified: false
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Profile updated! Please verify your new email.");
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Profile updated!");
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();

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

    if (securityData.newPassword !== securityData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    const passwordValidation = validatePassword(securityData.newPassword);
    if (!passwordValidation.isValid) {
      alert("Password requirements not met!");
      return;
    }

    setIsLoading(true);

    try {
      if (passwordChangeMethod === "current") {
        await oldChangePasswordService(
          securityData.currentPassword,
          securityData.newPassword
        );
      } else {
        await changePasswordWithOtp({
          otp: otpData.otp,
          new_password: securityData.newPassword
        });
      }

      resetSecurityForm();
      resetOtpState();

      alert("Password updated!");
    } catch (error) {
      alert(error.message || "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordValidation = securityData.newPassword ? validatePassword(securityData.newPassword) : null;

  const renderBackButton = () => (
    <button
      onClick={() => setActiveTab("profile")}
      className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition px-3 py-1.5 bg-gray-50 rounded-md hover:bg-gray-100"
    >
      <FaArrowLeft size={14} /> Back
    </button>
  );

  return (
    <DashboardLayout>
      <div className="p-2 md:p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Sidebar Navigation - Compact */}
          <div className="lg:w-52">
            <Card className="p-3">
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <h1 className="text-base font-bold text-gray-800">Settings</h1>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-xs">
                  {isAdmin ? "Admin panel" : "Account settings"}
                </p>
              </div>

              <nav className="space-y-0.5">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors text-sm ${activeTab === tab.id
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      <Icon size={14} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {isAdmin && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Stats</h4>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cases</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Feedback</span>
                      <span className="font-medium text-yellow-600">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contacts</span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Users</span>
                      <span className="font-medium text-green-600">142</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h2>

                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-800">
                        Email Verification
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        {user.email_verified ? (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Email verified
                          </span>
                        ) : (
                          'Email not verified'
                        )}
                      </p>
                    </div>
                    {!user.email_verified && (
                      <Button
                        onClick={handleResendVerification}
                        disabled={resendVerificationLoading}
                        className="text-sm py-1.5 px-3 bg-blue-600 hover:bg-blue-700"
                      >
                        {resendVerificationLoading ? 'Sending...' : 'Resend'}
                      </Button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Full name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Email"
                        required
                      />
                      {profileData.email !== user.email && (
                        <p className="text-xs text-yellow-600 mt-0.5">
                          Verify new email after update
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={profileData.occupation}
                        onChange={(e) => setProfileData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Occupation"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="Address"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={2}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="Short bio..."
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading} className="text-sm py-1.5 px-4">
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Security</h2>

                <div className="mb-4">
                  <div className="flex border border-gray-300 rounded-md overflow-hidden text-sm">
                    <button
                      onClick={() => {
                        setPasswordChangeMethod("current");
                        resetOtpState();
                        resetSecurityForm();
                      }}
                      className={`flex-1 py-1.5 font-medium transition-colors ${passwordChangeMethod === "current"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      Current Password
                    </button>
                    <button
                      onClick={() => {
                        setPasswordChangeMethod("otp");
                        resetSecurityForm();
                      }}
                      className={`flex-1 py-1.5 font-medium transition-colors ${passwordChangeMethod === "otp"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                      OTP Verification
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSecurityUpdate} className="space-y-4">
                  {passwordChangeMethod === "current" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Current password"
                        required
                      />
                    </div>
                  )}

                  {passwordChangeMethod === "otp" && (
                    <div className="space-y-3">
                      {!otpData.sent && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-blue-800">
                                Verify with OTP
                              </p>
                              <p className="text-xs text-blue-600 mt-0.5">
                                Code sent to email/phone
                              </p>
                            </div>
                            <Button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpLoading || otpData.countdown > 0}
                              className="text-sm py-1.5 px-3 bg-blue-600 hover:bg-blue-700"
                            >
                              {otpLoading ? "Sending..." : otpData.countdown > 0 ? `${otpData.countdown}s` : "Send OTP"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {otpData.sent && !otpData.verified && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                          <label className="block text-xs font-medium text-yellow-800 mb-1">
                            Enter OTP
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={otpData.otp}
                              onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                              className="flex-1 px-2.5 py-1.5 border border-yellow-300 rounded-md focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 text-center text-base font-mono"
                              placeholder="6-digit OTP"
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={verifyOtpLoading || otpData.otp.length !== 6}
                              className="text-sm py-1.5 px-3 bg-yellow-600 hover:bg-yellow-700"
                            >
                              {verifyOtpLoading ? "Verifying..." : "Verify"}
                            </Button>
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <p className="text-xs text-yellow-700">
                              Code sent
                            </p>
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              disabled={otpData.countdown > 0}
                              className="text-xs text-yellow-700 hover:text-yellow-800 underline disabled:opacity-50"
                            >
                              {otpData.countdown > 0 ? `Wait ${otpData.countdown}s` : "Resend"}
                            </button>
                          </div>
                        </div>
                      )}

                      {otpData.verified && (
                        <div className="bg-green-50 border border-green-200 rounded-md p-2">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs font-medium text-green-800">
                              OTP verified
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="New password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Confirm password"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <h3 className="text-xs font-medium text-yellow-800 mb-1">Password Requirements</h3>
                    <ul className="text-xs text-yellow-700 space-y-0.5">
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.minLength ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.minLength ? '✓' : '•'}</span>
                        8+ characters
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasUpperCase ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasUpperCase ? '✓' : '•'}</span>
                        Uppercase letter
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasLowerCase ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasLowerCase ? '✓' : '•'}</span>
                        Lowercase letter
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasNumbers ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasNumbers ? '✓' : '•'}</span>
                        Number
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasSpecialChar ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasSpecialChar ? '✓' : '•'}</span>
                        Special character
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button
                      type="submit"
                      disabled={isLoading || (passwordChangeMethod === "otp" && !otpData.verified)}
                      className="text-sm py-1.5 px-4"
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* My Contacts */}
            {activeTab === "my-contacts" && (
              <Card className="p-3">
                <div className="p-1">
                  {renderBackButton()}
                  <UserContacts />
                </div>
              </Card>
            )}

            {/* Contact Management - Admin */}
            {activeTab === "contact-management" && isAdmin && (
              <Card className="p-3">
                <div className="p-1">
                  {renderBackButton()}
                  <ContactManagement />
                </div>
              </Card>
            )}

            {/* Feedback History */}
            {activeTab === "feedback-history" && (
              <Card className="p-3">
                <div className="p-1">
                  {renderBackButton()}
                  <FeedbackHistory />
                </div>
              </Card>
            )}

            {/* Case Management */}
            {activeTab === "cases" && isAdmin && (
              <Card className="p-3">
                <div className="p-1">
                  {renderBackButton()}
                </div>
              </Card>
            )}

            {/* Add New Case */}
            {activeTab === "add-case" && isAdmin && (
              <Card className="p-3">
                <div className="p-1">
                  {renderBackButton()}
                  <Application onAdd={(newCase) => console.log('Add case:', newCase)} />
                </div>
              </Card>
            )}

            {/* Feedback Management */}
            {activeTab === "feedback-management" && isAdmin && (
              <Card className="p-3">
                <div className="p-1">
                  {renderBackButton()}
                  <AdminFeedbackManagement />
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