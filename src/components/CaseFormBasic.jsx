import React from "react";

const CaseFormBasic = ({ formData, handleInputChange, onNext }) => {
  const handleNextClick = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNextClick} className="flex flex-col gap-3">
      <input
        type="text"
        name="caseName"
        placeholder="Case Name"
        value={formData.caseName}
        onChange={handleInputChange}
        className="p-2 border rounded text-[10px] placeholder:text-[10px]"
        required
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={formData.age}
        onChange={handleInputChange}
        className="p-2 border rounded text-[10px] placeholder:text-[10px]"
        required
        min={0}
      />
      <button
        type="submit"
        className="mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-[10px]"
      >
        Next
      </button>
    </form>
  );
};

export default CaseFormBasic;
