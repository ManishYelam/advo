import React, { useState } from "react";

const AddCaseForm = ({ onAdd }) => {
  const [newCase, setNewCase] = useState({
    caseName: "",
    status: "Running",
    nextDate: "",
    advocate: "",
    caseType: "",
    documents: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCase({ ...newCase, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));
    setNewCase({ ...newCase, documents: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newCase);
    setNewCase({
      caseName: "",
      status: "Running",
      nextDate: "",
      advocate: "",
      caseType: "",
      documents: [],
    });
  };

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md max-w-4xl">
      <h2 className="text-lg font-semibold mb-3">Add New Case</h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form Left */}
        <form className="flex-1 grid grid-cols-1 gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="caseName"
            placeholder="Case Name"
            value={newCase.caseName}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="advocate"
            placeholder="Advocate Name"
            value={newCase.advocate}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="caseType"
            placeholder="Case Type"
            value={newCase.caseType}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="date"
            name="nextDate"
            value={newCase.nextDate}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="status"
            value={newCase.status}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
            <option value="Adjourned">Adjourned</option>
          </select>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors mt-2"
          >
            Save Case
          </button>
        </form>

        {/* Preview Right */}
        <div className="flex-1 p-2 bg-white border rounded-lg shadow-sm max-h-[400px] overflow-y-auto">
          <h3 className="text-md font-semibold mb-2">Document Preview</h3>
          {newCase.documents.length === 0 && (
            <p className="text-gray-500">No documents uploaded yet.</p>
          )}
          {newCase.documents.map((doc, idx) => (
            <div key={idx} className="mb-3">
              <p className="font-medium">{doc.name}</p>
              {doc.type.startsWith("image/") ? (
                <img src={doc.url} alt={doc.name} className="max-h-32 rounded" />
              ) : doc.type === "application/pdf" ? (
                <embed src={doc.url} type="application/pdf" className="w-full h-40" />
              ) : (
                <p className="text-sm text-gray-600">Preview not available</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddCaseForm;
