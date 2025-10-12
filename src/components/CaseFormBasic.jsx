import React from "react";
import { showSuccessToast } from "../utils/Toastify"; // ✅ adjust path if needed

const BasicInfoForm = ({ formData, handleInputChange, onNext }) => {
  const handleNextClick = (e) => {
    e.preventDefault();

    // ✅ Show success toast
    showSuccessToast("Basic information filled successfully!");

    // ✅ Proceed to next step
    onNext();
  };

  return (
    <form
      onSubmit={handleNextClick}
      className="flex flex-col gap-2 p-3 bg-white rounded shadow-md text-[10px]"
    >
      {/* Full Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name || ""}
        onChange={handleInputChange}
        className="p-1 border rounded text-[10px] placeholder:text-[10px]"
        required
      />

      {/* Age */}
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age || ""}
        onChange={handleInputChange}
        className="p-1 border rounded text-[10px] placeholder:text-[10px]"
        min="1"
        max="120"
        required
      />

      {/* Occupation */}
      <input
        type="text"
        name="occupation"
        placeholder="Occupation"
        value={formData.occupation || ""}
        onChange={handleInputChange}
        className="p-1 border rounded text-[10px] placeholder:text-[10px]"
      />

      {/* Address */}
      <textarea
        name="address"
        placeholder="Full Address with Pin Code"
        value={formData.address || ""}
        onChange={handleInputChange}
        className="p-1 border rounded text-[10px] placeholder:text-[10px] resize-none"
        rows={3}
      />

      {/* Next Button aligned right */}
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
