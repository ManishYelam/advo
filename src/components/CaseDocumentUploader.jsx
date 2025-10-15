import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTimesCircle, faUpload } from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";

const CaseDocumentUploader = ({
  documents: initialDocuments = [],
  onDocumentsChange,
  onNext,
  onBack,
  requiredDocs = [],
}) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [fileInputs, setFileInputs] = useState({});
  const fileRefs = useRef({});

  useEffect(() => {
    setDocuments(initialDocuments);
    setSelectedDoc(initialDocuments[0] || null);
  }, [initialDocuments]);

  const handleFileChange = (docKey, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("pdf") && !file.type.startsWith("image/")) {
      showWarningToast("Only PDF or image files are allowed!");
      return;
    }

    const newFile = {
      name: `${docKey} - ${file.name}`,
      url: URL.createObjectURL(file),
      type: file.type,
      exhibit: docKey,
    };

    // Replace if document for this exhibit already exists
    const updatedDocs = [
      ...documents.filter((d) => d.exhibit !== docKey),
      newFile,
    ];

    setDocuments(updatedDocs);
    if (onDocumentsChange) onDocumentsChange(updatedDocs);

    showSuccessToast(`${docKey} uploaded successfully!`);
    setSelectedDoc(newFile);
    e.target.value = "";
  };

  const removeDocument = (docKey) => {
    setDocuments((prev) => {
      const filtered = prev.filter((doc) => doc.exhibit !== docKey);
      if (onDocumentsChange) onDocumentsChange(filtered);
      return filtered;
    });
    if (selectedDoc?.exhibit === docKey) setSelectedDoc(null);
  };

  const handleNextClick = () => {
    const uploadedExhibits = documents.map((d) => d.exhibit);
    const missingDocs = requiredDocs.filter((doc) => !uploadedExhibits.includes(doc));

    if (missingDocs.length > 0) {
      showWarningToast(`Please upload all required documents: ${missingDocs.join(", ")}`);
      return;
    }

    if (onNext) onNext();
  };

  return (
    <div className="max-w-8xl mx-full p-6 bg-white rounded-lg shadow-md text-[10px]">
      <h2 className="font-semibold mb-2 flex items-center space-x-2 text-[10px]">
        <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />
        <span>Upload Required Documents</span>
      </h2>

      {/* ✅ Required Documents with Separate Upload Buttons */}
      {requiredDocs.map((docKey, i) => {
        const uploadedDoc = documents.find((d) => d.exhibit === docKey);
        return (
          <div
            key={i}
            className="flex items-center justify-between border p-2 mb-2 rounded bg-gray-50 shadow-sm"
          >
            <div className="text-[9px] font-medium text-gray-800 w-1/2">{docKey}</div>

            <div className="flex items-center gap-2">
              {uploadedDoc ? (
                <span className="text-green-600 text-[9px]">✅ Uploaded</span>
              ) : (
                <span className="text-red-500 text-[9px]">❌ Pending</span>
              )}

              <label className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-2 py-[2px] rounded text-[9px] flex items-center gap-1">
                <FontAwesomeIcon icon={faUpload} />
                Upload
                <input
                  type="file"
                  accept=".pdf,image/*"
                  ref={(el) => (fileRefs.current[docKey] = el)}
                  onChange={(e) => handleFileChange(docKey, e)}
                  className="hidden"
                />
              </label>

              {uploadedDoc && (
                <button
                  onClick={() => removeDocument(docKey)}
                  className="text-red-600 hover:text-red-800 text-[10px]"
                  title={`Remove ${docKey}`}
                >
                  <FontAwesomeIcon icon={faTimesCircle} />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* ✅ Uploaded Files List */}
      {documents.length > 0 && (
        <div className="mb-3">
          <p className="font-semibold text-[8px] mb-2">Uploaded Files:</p>
          <div className="flex flex-wrap gap-2">
            {documents.map((doc) => (
              <button
                key={doc.name}
                onClick={() => setSelectedDoc(doc)}
                className={`px-2 py-[2px] rounded text-[8px] border ${selectedDoc?.name === doc.name
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-700 hover:bg-green-50"
                  }`}
              >
                {doc.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Preview Area */}
      <div className="border rounded-lg overflow-hidden h-[400px] text-[10px] bg-gray-50">
        {selectedDoc ? (
          selectedDoc.type === "application/pdf" ? (
            <iframe src={selectedDoc.url} title={selectedDoc.name} className="w-full h-full" />
          ) : selectedDoc.type.startsWith("image/") ? (
            <img src={selectedDoc.url} alt={selectedDoc.name} className="object-contain w-full h-full" />
          ) : (
            <p className="p-4 text-center text-gray-600">Preview not available.</p>
          )
        ) : (
          <p className="p-4 text-center text-gray-500">
            No document selected. Click a document name to preview.
          </p>
        )}
      </div>

      {/* ✅ Buttons */}
      <div className="flex justify-between mt-3">
        <button
          type="button"
          onClick={onBack}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-[10px]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CaseDocumentUploader;
