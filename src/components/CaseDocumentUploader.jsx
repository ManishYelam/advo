import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilePdf, 
  faTimesCircle, 
  faUpload, 
  faFileImage,
  faCheckCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showWarningToast, showErrorToast } from "../utils/Toastify";

const CaseDocumentUploader = ({
  documents: initialDocuments = [],
  onDocumentsChange,
  onNext,
  onBack,
  requiredDocs = [],
  maxFileSize = 10 * 1024 * 1024, // 10MB default
}) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRefs = useRef({});

  useEffect(() => {
    setDocuments(initialDocuments);
    setSelectedDoc(initialDocuments[0] || null);
  }, [initialDocuments]);

  const validateFile = (file) => {
    // Check file type
    if (!file.type.includes("pdf") && !file.type.startsWith("image/")) {
      showWarningToast("Only PDF or image files are allowed!");
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      showWarningToast(`File size must be less than ${maxFileSize / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange = async (docKey, e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newFile = {
        id: `${docKey}-${Date.now()}`,
        name: `${docKey} - ${file.name}`,
        originalName: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        exhibit: docKey,
        size: file.size,
        uploadedAt: new Date().toISOString(),
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
    } catch (error) {
      console.error("Upload error:", error);
      showErrorToast("Failed to upload document. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeDocument = (docKey) => {
    // Revoke object URL to prevent memory leaks
    const docToRemove = documents.find(doc => doc.exhibit === docKey);
    if (docToRemove?.url) {
      URL.revokeObjectURL(docToRemove.url);
    }

    setDocuments((prev) => {
      const filtered = prev.filter((doc) => doc.exhibit !== docKey);
      if (onDocumentsChange) onDocumentsChange(filtered);
      return filtered;
    });
    
    if (selectedDoc?.exhibit === docKey) {
      setSelectedDoc(documents.find(doc => doc.exhibit !== docKey) || null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'application/pdf') return faFilePdf;
    if (fileType.startsWith('image/')) return faFileImage;
    return faFilePdf;
  };

  const handleNextClick = () => {
    const uploadedExhibits = documents.map((d) => d.exhibit);
    const missingDocs = requiredDocs.filter((doc) => !uploadedExhibits.includes(doc));

    if (missingDocs.length > 0) {
      showWarningToast(
        `Please upload all required documents: ${missingDocs.join(", ")}`
      );
      return;
    }

    if (onNext) onNext(documents);
  };

  const getUploadStatus = () => {
    const uploadedCount = documents.length;
    const totalCount = requiredDocs.length;
    const progress = (uploadedCount / totalCount) * 100;

    return {
      uploadedCount,
      totalCount,
      progress,
      isComplete: uploadedCount === totalCount
    };
  };

  const status = getUploadStatus();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header with Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />
            Upload Required Documents
          </h2>
          <div className="text-sm text-gray-600">
            {status.uploadedCount} of {status.totalCount} documents uploaded
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              status.isComplete ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${status.progress}%` }}
          ></div>
        </div>
        
        {status.isComplete && (
          <div className="text-green-600 text-sm font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} />
            All required documents uploaded successfully!
          </div>
        )}
      </div>

      {/* Required Documents List */}
      <div className="space-y-3 mb-6">
        {requiredDocs.map((docKey, index) => {
          const uploadedDoc = documents.find((d) => d.exhibit === docKey);
          return (
            <div
              key={docKey}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                  <FontAwesomeIcon 
                    icon={uploadedDoc ? getFileIcon(uploadedDoc.type) : faFilePdf} 
                    className={uploadedDoc ? "text-blue-600" : "text-gray-400"} 
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{docKey}</div>
                  {uploadedDoc && (
                    <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                      <span>{uploadedDoc.originalName}</span>
                      <span>•</span>
                      <span>{formatFileSize(uploadedDoc.size)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {uploadedDoc ? (
                  <div className="flex items-center gap-3">
                    <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Uploaded
                    </span>
                    <button
                      onClick={() => removeDocument(docKey)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                      title="Remove document"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </button>
                  </div>
                ) : (
                  <span className="text-orange-500 text-sm flex items-center gap-1">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Required
                  </span>
                )}

                <label className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  uploading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : uploadedDoc
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}>
                  <FontAwesomeIcon icon={faUpload} />
                  {uploadedDoc ? 'Replace' : 'Upload'}
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    ref={(el) => (fileRefs.current[docKey] = el)}
                    onChange={(e) => handleFileChange(docKey, e)}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

      {/* Uploaded Files Preview Section */}
      {documents.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FontAwesomeIcon icon={faFilePdf} className="text-blue-600" />
            Uploaded Documents Preview
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all flex items-center gap-2 ${
                  selectedDoc?.id === doc.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon icon={getFileIcon(doc.type)} />
                <span className="max-w-[150px] truncate">{doc.exhibit}</span>
              </button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 h-[500px]">
            {selectedDoc ? (
              selectedDoc.type === "application/pdf" ? (
                <iframe 
                  src={selectedDoc.url} 
                  title={selectedDoc.name} 
                  className="w-full h-full" 
                />
              ) : selectedDoc.type.startsWith("image/") ? (
                <div className="flex items-center justify-center h-full p-4">
                  <img 
                    src={selectedDoc.url} 
                    alt={selectedDoc.name} 
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm" 
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Preview not available for this file type.
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <FontAwesomeIcon icon={faFilePdf} className="text-4xl mb-2" />
                  <p>Select a document to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          disabled={uploading}
          className="px-3 py-1 bg-gray-400 text-white rounded text-[10px] flex items-center gap-2 transition-colors"
        >
          Back
        </button>
        
        <button
          type="button"
          onClick={handleNextClick}
          disabled={uploading || !status.isComplete}
          className={`px-3 py-1 bg-green-600 text-white rounded text-[10px] flex items-center gap-2 transition-colors ${
            uploading || !status.isComplete
              ? 'bg-gray-400 cursor-not-allowed text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Uploading...
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
};

export default CaseDocumentUploader;