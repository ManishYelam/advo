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
  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile
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

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  // Input change
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
    let age = e.target.value;
    if (age < 1) age = 1;
    if (age > 120) age = 120;
    const dob = calculateDOBFromAge(age);
    setFormData((prev) => ({ ...prev, age, date_of_birth: dob }));
  };

  // Edit toggle
  const handleEditClick = () => setIsEditing(true);

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile();
  };

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone_number || !formData.email) {
      showErrorToast("Please fill all required fields!");
      return;
    }

    try {
      const res = await updateUserApplicant(userId, formData);
      if (res.data.message) {
        showSuccessToast("Profile updated successfully!");
        setIsEditing(false);
        if (res.data.user) setFormData(res.data.user);
      } else {
        showErrorToast("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error updating profile.");
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
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-green-50 py-10 px-4">
      <Toast />
      <div className="max-w-4xl mx-auto bg-white rounded shadow-md p-4 relative">
        <h2 className="text-xl md:text-2xl font-bold text-center text-green-900 mb-4">
          User Profile
        </h2>

        {/* Edit Icon */}
        {!isEditing && (
          <button
            onClick={handleEditClick}
            className="absolute top-4 right-4"
            title="Edit Profile"
          >
            <FiEdit size={20} />
          </button>
        )}

        <form className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px]" onSubmit={handleUpdate}>
          {/* Column 1 */}
          <div className="flex flex-col gap-2">
            <label>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="p-1 border rounded"
              disabled={!isEditing}
              required
            />

            <label>Date of Birth *</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleDOBChange}
              className="p-1 border rounded"
              disabled={!isEditing}
              required
            />

            <label>Age *</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleAgeChange}
              min="1"
              max="120"
              className="p-1 border rounded"
              disabled={!isEditing}
              required
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-2">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="p-1 border rounded"
              pattern="[0-9]{10}"
              disabled={!isEditing}
              required
            />

            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="p-1 border rounded bg-gray-100 text-gray-600 cursor-not-allowed"
              disabled
              required
            />

            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="p-1 border rounded"
              disabled={!isEditing}
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
            <label>Occupation *</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="p-1 border rounded"
              disabled={!isEditing}
              required
            />

            <label>Aadhar Number</label>
            <input
              type="text"
              name="adhar_number"
              value={formData.adhar_number}
              onChange={handleInputChange}
              className="p-1 border rounded"
              pattern="[0-9]{12}"
              disabled={!isEditing}
            />

            <label>Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={1}
              className="p-1 border rounded resize-none"
              disabled={!isEditing}
              required
            />
          </div>

          {/* Full-width field */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <label>Additional Notes</label>
            <textarea
              name="additional_notes"
              value={formData.additional_notes}
              onChange={handleInputChange}
              rows={1}
              className="p-1 border rounded resize-none"
              disabled={!isEditing}
            />
          </div>

          {/* Buttons */}
          {isEditing && (
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-yellow-400 text-green-900 rounded hover:bg-yellow-300"
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
