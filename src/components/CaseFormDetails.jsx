import React from "react";

const CaseFormDetails = ({ formData, handleInputChange, onNext, onBack }) => {
  const handleNextClick = (e) => {
    e.preventDefault();
    onNext();
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    onBack();
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleNextClick}>
      <input
        type="date"
        name="nextDate"
        placeholder="Next Hearing Date"
        value={formData.nextDate}
        onChange={handleInputChange}
        className="p-2 border rounded text-[10px] placeholder:text-[10px]"
        required
      />
      <input
        type="text"
        name="advocate"
        placeholder="Advocate Name"
        value={formData.advocate}
        onChange={handleInputChange}
        className="p-2 border rounded text-[10px] placeholder:text-[10px]"
        required
      />
      <input
        type="text"
        name="caseType"
        placeholder="Case Type"
        value={formData.caseType}
        onChange={handleInputChange}
        className="p-2 border rounded text-[10px] placeholder:text-[10px]"
        required
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={handleBackClick}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-[10px]"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-[10px]"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default CaseFormDetails;
