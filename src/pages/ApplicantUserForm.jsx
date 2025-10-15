import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";
import { userApplicant, updateUserApplicant } from "../services/applicationService";

const ApplicantUserForm = () => {
  const { userId } = useParams(); 
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
    password: "",
    confirm_password: "",
    additional_notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [linkExpired, setLinkExpired] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const response = await userApplicant(userId); 
        const data = response.data.user;

        if (!data || Object.keys(data).length === 0) {
          setLinkExpired(true);
        } else {
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
            password: "", 
            confirm_password: "",
            additional_notes: data.additional_notes || "",
          });
        }
      } catch (error) {
        console.error(error);
        setLinkExpired(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDOBChange = (e) => {
    const date_of_birth = e.target.value;
    const age = calculateAgeFromDOB(date_of_birth);
    setFormData((prev) => ({ ...prev, date_of_birth, age }));
  };

  const handleAgeChange = (e) => {
    const age = e.target.value;
    const date_of_birth = calculateDOBFromAge(age);
    setFormData((prev) => ({ ...prev, age, date_of_birth }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.phone_number) {
      showErrorToast("Please fill all required fields!");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      showErrorToast("Passwords do not match!");
      return;
    }

    try {
      const response = await updateUserApplicant(userId, formData);
      if (response.data.success) {
        showSuccessToast("User data updated successfully!");
      } else {
        showErrorToast("Failed to update user data.");
      }
    } catch (error) {
      console.error("Update error:", error);
      showErrorToast("An error occurred while updating user data.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-900 text-xl font-semibold">Loading...</p>
      </div>
    );
  }

  if (linkExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Link Expired</h2>
          <p className="text-gray-700">Sorry, the link is invalid or the data is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-800 via-green-700 to-green-500 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl p-8 md:p-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-green-900 mb-8">
          Applicant Registration Form
        </h2>

        <form className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm" onSubmit={handleSubmit}>
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-green-800">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />

            <label className="font-semibold text-green-800">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date_of_birth"
              placeholder="Select date of birth"
              value={formData.date_of_birth}
              onChange={handleDOBChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />

            <label className="font-semibold text-green-800">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formData.age}
              onChange={handleAgeChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              min="1"
              max="120"
              required
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-green-800">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone_number"
              placeholder="Enter phone number"
              value={formData.phone_number}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              pattern="[0-9]{10}"
              required
            />

            <label className="font-semibold text-green-800">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />

            <label className="font-semibold text-green-800">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-green-800">
              Occupation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="occupation"
              placeholder="Enter occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />

            <label className="font-semibold text-green-800">
              Aadhar Number
            </label>
            <input
              type="text"
              name="adhar_number"
              placeholder="Enter Aadhar Number"
              value={formData.adhar_number}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              pattern="[0-9]{12}"
            />

            <label className="font-semibold text-green-800">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="address"
              placeholder="Enter full address with pin code"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 resize-none"
              rows={2}
              required
            />
          </div>

          {/* Passwords & Notes */}
          <div className="flex flex-col gap-3">
            <label className="font-semibold text-green-800">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-semibold text-green-800">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm password"
              value={formData.confirm_password}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="font-semibold text-green-800">Additional Notes</label>
            <textarea
              name="additional_notes"
              placeholder="Any extra information..."
              value={formData.additional_notes}
              onChange={handleInputChange}
              className="p-2 rounded-md border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 resize-none"
              rows={2}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-3 flex justify-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-yellow-400 text-green-900 font-bold rounded-full shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicantUserForm;
