import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import Toast from "../components/Toast";
import { showErrorToast, showSuccessToast, showWarningToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";
import { updateUserApplicant, userApplicant } from "../services/applicationService";
import { getUserId } from "../utils/getUserId";

const Profile = () => {
  const userId = getUserId();

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    age: "",
    gender: "",
    phone_number: "",
    email: "",
    occupation: "",
    adhar_number: "",
    address: "",
    additional_notes: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // toggle edit/view
  const [formDisabled, setFormDisabled] = useState(true); // disable fields initially

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          showErrorToast("User not logged in!");
          return;
        }

        const res = await userApplicant(userId);
        const data = res?.data?.user || res?.data || {};

        if (!data || Object.keys(data).length === 0) {
          showWarningToast("Profile not found.");
          return;
        }

        setFormData({
          full_name: data.full_name || "",
          date_of_birth: data.date_of_birth || "",
          age: data.age || "",
          gender: data.gender || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          occupation: data.occupation || "",
          adhar_number: data.adhar_number || "",
          address: data.address || "",
          additional_notes: data.additional_notes || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        showWarningToast("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchProfile();
  }, [userId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // DOB → Age
  const handleDOBChange = (e) => {
    const dob = e.target.value;
    const age = calculateAgeFromDOB(dob);
    setFormData((prev) => ({ ...prev, date_of_birth: dob, age }));
  };

  // Age → DOB
  const handleAgeChange = (e) => {
    const age = e.target.value;
    const dob = calculateDOBFromAge(age);
    setFormData((prev) => ({ ...prev, age, date_of_birth: dob }));
  };

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(true);
    setFormDisabled(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setFormDisabled(true);
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone_number || !formData.email) {
      showErrorToast("Please fill all required fields!");
      return;
    }

    try {
      setFormDisabled(true);
      const res = await updateUserApplicant(userId, formData);
      if (res.data.message) {
        showSuccessToast("Profile updated successfully!");
        setIsEditing(false);
      } else {
        showErrorToast("Failed to update profile.");
        setFormDisabled(false);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error updating profile.");
      setFormDisabled(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-900 text-xl font-semibold">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-800 via-green-700 to-green-500 px-4">
      <Toast />
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 my-4 relative">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-green-900 mb-6">
          User Profile
        </h2>

        {/* Edit Icon */}
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="absolute top-6 right-6 text-green-700 hover:text-green-900 transition-all"
            title="Edit Profile"
          >
            <FiEdit size={24} />
          </button>
        )}

        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm" onSubmit={handleUpdate}>
          {/* Column 1 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-green-800">Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              disabled={formDisabled}
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            />

            <label className="font-semibold text-green-800">Date of Birth *</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleDOBChange}
              disabled={formDisabled}
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            />

            <label className="font-semibold text-green-800">Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleAgeChange}
              disabled={formDisabled}
              min="1"
              max="120"
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-green-800">Phone Number *</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              disabled={formDisabled}
              pattern="[0-9]{10}"
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            />

            <label className="font-semibold text-green-800">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="p-2 rounded-md border border-green-300 bg-gray-100 text-gray-600 cursor-not-allowed"
            />

            <label className="font-semibold text-green-800">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={formDisabled}
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-green-800">Occupation *</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              disabled={formDisabled}
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            />

            <label className="font-semibold text-green-800">Aadhar Number</label>
            <input
              type="text"
              name="adhar_number"
              value={formData.adhar_number}
              onChange={handleInputChange}
              disabled={formDisabled}
              pattern="[0-9]{12}"
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
            />

            <label className="font-semibold text-green-800">Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={formDisabled}
              rows={2}
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
              required
            />
          </div>

          {/* Additional Notes */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <label className="font-semibold text-green-800">Additional Notes</label>
            <textarea
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleInputChange}
              disabled={formDisabled}
              rows={2}
              className={`p-2 rounded-md border focus:outline-none focus:ring-2 text-gray-800 ${
                formDisabled
                  ? "border-green-300 bg-gray-100 cursor-not-allowed"
                  : "border-green-300 focus:ring-green-500"
              }`}
            />
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="md:col-span-3 flex justify-center mt-4 gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-400 text-white font-bold rounded-full hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-400 text-green-900 font-bold rounded-full hover:bg-yellow-300 transition-all"
              >
                Update
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
