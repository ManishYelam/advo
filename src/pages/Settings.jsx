import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { oldChangePasswordService, resendVerification } from "../services/authService";
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
  FaShieldAlt,
  FaArrowLeft,
  FaAddressBook,
} from "react-icons/fa";

// Custom Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
  }[type] || "bg-gray-50 border-gray-500 text-gray-800";

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border-l-4 shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [resendVerificationLoading, setResendVerificationLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });
  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

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
      showToast("Failed to load user data", "error");
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

  const resetSecurityForm = () => {
    setSecurityData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleResendVerification = async () => {
    if (!user.id) {
      showToast("User not found.", "error");
      return;
    }

    setResendVerificationLoading(true);
    showToast("Sending verification email...", "info");

    try {
      const response = await resendVerification(user.id);

      if (response.data?.success) {
        showToast("Verification email sent!", "success");
      } else {
        showToast(response.data?.message || "Failed to send verification email", "error");
      }
    } catch (error) {
      console.error("Resend verification failed:", error);
      const errorMsg = error.response?.data?.message || "Network error.";
      showToast(errorMsg, "error");
    } finally {
      setResendVerificationLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!profileData.full_name.trim()) {
      showToast("Full name is required!", "error");
      return;
    }

    if (!profileData.email.trim()) {
      showToast("Email is required!", "error");
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
      showToast("Profile updated! Please verify your new email.", "info");
    }

    setIsLoading(true);
    showToast("Updating profile...", "info");

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      showToast("Profile updated!", "success");
    } catch (error) {
      showToast("Failed to update profile.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurityUpdate = async (e) => {
    e.preventDefault();

    if (!securityData.currentPassword) {
      showToast("Please enter your current password!", "error");
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast("New passwords don't match!", "error");
      return;
    }

    const passwordValidation = validatePassword(securityData.newPassword);
    if (!passwordValidation.isValid) {
      showToast("Password requirements not met!", "error");
      return;
    }

    setIsLoading(true);
    showToast("Updating password...", "info");

    try {
      const res = await oldChangePasswordService({
        old_password: securityData.currentPassword,
        new_password: securityData.newPassword
      });

      const serverMessage = res.data?.message || "Password updated!";
      showToast(serverMessage, "success");

      resetSecurityForm();
    } catch (error) {
      console.error("Password change error:", error);
      let errorMessage = "Failed to update password.";
      if (error.response?.data) {
        errorMessage = error.response.data.error || error.response.data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, "error");
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
      {/* Custom Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: "", type: "info" })}
        />
      )}

      <div className="p-2 md:p-3">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Sidebar Navigation */}
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
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-left transition-colors text-sm ${
                        activeTab === tab.id
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
                      <p className="text-xs font-medium text-blue-800">Email Verification</p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        {user.email_verified ? (
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Email verified
                          </span>
                        ) : (
                          "Email not verified"
                        )}
                      </p>
                    </div>
                    {!user.email_verified && (
                      <Button
                        onClick={handleResendVerification}
                        disabled={resendVerificationLoading}
                        className="text-sm py-1.5 px-3 bg-blue-600 hover:bg-blue-700"
                      >
                        {resendVerificationLoading ? "Sending..." : "Resend"}
                      </Button>
                    )}
                  </div>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
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
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Email"
                        required
                      />
                      {profileData.email !== user.email && (
                        <p className="text-xs text-yellow-600 mt-0.5">Verify new email after update</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Occupation</label>
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
                    <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      rows={2}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="Address"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bio</label>
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

                <form onSubmit={handleSecurityUpdate} className="space-y-4">
                  {/* Hidden username field for password managers */}
                  <input
                    type="hidden"
                    name="username"
                    autoComplete="username"
                    value={user.email || ""}
                  />

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      autoComplete="current-password"
                      value={securityData.currentPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                      placeholder="Current password"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="New password"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                      <input
                        type="password"
                        autoComplete="new-password"
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
                        <span>{passwordValidation?.requirements.minLength ? '✓' : '•'}</span> 8+ characters
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasUpperCase ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasUpperCase ? '✓' : '•'}</span> Uppercase letter
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasLowerCase ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasLowerCase ? '✓' : '•'}</span> Lowercase letter
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasNumbers ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasNumbers ? '✓' : '•'}</span> Number
                      </li>
                      <li className={`flex items-center gap-1.5 ${passwordValidation?.requirements.hasSpecialChar ? 'text-green-600' : ''}`}>
                        <span>{passwordValidation?.requirements.hasSpecialChar ? '✓' : '•'}</span> Special character
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={isLoading} className="text-sm py-1.5 px-4">
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