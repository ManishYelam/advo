import React from "react";
import { showSuccessToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";

const BasicInfoForm = ({ formData, handleInputChange, onNext }) => {
  const handleNextClick = (e) => {
    e.preventDefault();

    // ✅ Show success toast
    showSuccessToast("Basic information filled successfully!");

    // ✅ Proceed to next step
    onNext();
  };

  // Handle DOB change
  const handleDOBChange = (e) => {
    const dob = e.target.value;
    handleInputChange({ target: { name: "dob", value: dob } });
    const age = calculateAgeFromDOB(dob);
    handleInputChange({ target: { name: "age", value: age } });
  };

  // Handle Age change
  const handleAgeChange = (e) => {
    const age = e.target.value;
    handleInputChange({ target: { name: "age", value: age } });
    const dob = calculateDOBFromAge(age);
    handleInputChange({ target: { name: "dob", value: dob } });
  };

  return (
    <form
      onSubmit={handleNextClick}
      className="p-4 bg-white rounded shadow-md space-y-4 text-[10px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={handleDOBChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age || ""}
            onChange={handleAgeChange}
            className="p-1 border rounded text-[10px]"
            min="1"
            max="120"
            required
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            pattern="[0-9]{10}"
            required
          />

          <label className="font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
          />

          <label className="font-semibold">
            Aadhar Number 
          </label>
          <input
            type="text"
            name="adhar_number"
            placeholder="Aadhar Number"
            value={formData.adhar_number || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            pattern="[0-9]{12}" // 12 digits
            required
          />

          <label className="font-semibold">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            placeholder="Full Address with Pin Code"
            value={formData.address || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px] resize-none"
            rows={1}
            required
          />
        </div>

        {/* Full-width field */}
        <div className="md:col-span-3 flex flex-col">
          <label className="font-semibold">Additional Notes</label>
          <textarea
            name="notes"
            placeholder="Any additional information"
            value={formData.notes || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px] resize-none"
            rows={1}
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px]"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default BasicInfoForm;
