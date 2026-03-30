import React, { useState, useRef, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFilePdf, 
  faTimesCircle, 
  faUpload, 
  faFileImage,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
  faCompressAlt,
  faSave
} from "@fortawesome/free-solid-svg-icons";
import { showSuccessToast, showWarningToast, showErrorToast } from "../utils/Toastify";

const CaseDocumentUploader = ({
  documents: initialDocuments = [],
  onDocumentsChange,
  onNext,
  onBack,
  onSave,
  requiredDocs = [],
  exhibit,
  maxFileSize = 10 * 1024 * 1024,
  mode,
  isLoading,
  isSubmitting = false,
  isLastStep = false
}) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [compressionProgress, setCompressionProgress] = useState({});
  const [saving, setSaving] = useState(false);
  const fileRefs = useRef({});

  useEffect(() => {
    setDocuments(initialDocuments);
    setSelectedDoc(initialDocuments[0] || null);
  }, [initialDocuments]);

  const validateFile = useCallback((file) => {
    if (!file.type.includes("pdf") && !file.type.startsWith("image/")) {
      showWarningToast("Only PDF or image files are allowed!");
      return false;
    }

    if (file.size > maxFileSize) {
      showWarningToast(`File size must be less than ${maxFileSize / (1024 * 1024)}MB`);
      return false;
    }

    return true;
  }, [maxFileSize]);

  // Advanced image compression with progress tracking
  const compressImage = useCallback((file, docKey) => {
    return new Promise((resolve, reject) => {
      if (file.type.includes('pdf')) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          const MAX_DIMENSION = 1200;
          let { width, height } = img;
          
          if (width > height && width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          setCompressionProgress(prev => ({
            ...prev, 
            [docKey]: 50
          }));
          
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.8;
          if (file.size > 2000000) {
            quality = 0.6;
          } else if (file.size > 5000000) {
            quality = 0.5;
          }
          
          canvas.toBlob(
            (blob) => {
              setCompressionProgress(prev => ({
                ...prev, 
                [docKey]: 100
              }));
              
              setTimeout(() => {
                setCompressionProgress(prev => {
                  const newState = { ...prev };
                  delete newState[docKey];
                  return newState;
                });
              }, 500);
              
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Optimized file processing
  const processFile = useCallback(async (file, docKey) => {
    return new Promise((resolve) => {
      let processedFile = file;
      let compressionInfo = '';
      
      const process = async () => {
        try {
          if (file.type.startsWith('image/') && file.size > 300000) {
            setCompressionProgress(prev => ({ ...prev, [docKey]: 10 }));
            processedFile = await compressImage(file, docKey);
            compressionInfo = ` (compressed from ${formatFileSize(file.size)})`;
          }
          
          const fileData = {
            id: `${docKey}-${Date.now()}`,
            name: `${docKey} - ${file.name}`,
            originalName: file.name,
            file: processedFile,
            url: URL.createObjectURL(processedFile),
            type: processedFile.type,
            exhibit: docKey,
            size: processedFile.size,
            uploadedAt: new Date().toISOString(),
            compressionInfo,
          };
          
          resolve(fileData);
        } catch (error) {
          console.error("File processing error:", error);
          const fileData = {
            id: `${docKey}-${Date.now()}`,
            name: `${docKey} - ${file.name}`,
            originalName: file.name,
            file: file,
            url: URL.createObjectURL(file),
            type: file.type,
            exhibit: docKey,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          };
          resolve(fileData);
        }
      };
      
      process();
    });
  }, [compressImage]);

  // Batch file processing
  const handleFilesChange = async (docKey, files) => {
    if (mode === 'view') return;

    const validFiles = Array.from(files).filter(file => validateFile(file));
    
    if (validFiles.length === 0) return;

    setUploadingFiles(prev => ({ ...prev, [docKey]: true }));

    try {
      const processingPromises = validFiles.map(file => processFile(file, docKey));
      const processedFiles = await Promise.all(processingPromises);

      const updatedDocs = [
        ...documents.filter((d) => d.exhibit !== docKey),
        ...processedFiles,
      ];

      setDocuments(updatedDocs);
      if (onDocumentsChange) onDocumentsChange(updatedDocs);

      showSuccessToast(`${docKey} - ${processedFiles.length} file(s) uploaded successfully!`);
      
      if (processedFiles.length > 0) {
        setSelectedDoc(processedFiles[0]);
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      showErrorToast("Failed to upload documents. Please try again.");
    } finally {
      setUploadingFiles(prev => ({ ...prev, [docKey]: false }));
    }
  };

  const handleFileChange = async (docKey, e) => {
    if (mode === 'view') return;

    const files = e.target.files;
    if (!files || files.length === 0) return;

    await handleFilesChange(docKey, files);
    e.target.value = "";
  };

  // Drag and drop support
  const handleDrop = useCallback((docKey, e) => {
    if (mode === 'view') return;

    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFilesChange(docKey, files);
    }
  }, [handleFilesChange, mode]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeDocument = useCallback((docKey) => {
    if (mode === 'view') return;

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
  }, [documents, selectedDoc, onDocumentsChange, mode]);

  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  const getFileIcon = useCallback((fileType) => {
    if (fileType === 'application/pdf') return faFilePdf;
    if (fileType.startsWith('image/')) return faFileImage;
    return faFilePdf;
  }, []);

  const handleSaveChanges = async () => {
    if (mode !== 'edit') return;

    setSaving(true);
    try {
      if (onSave) {
        await onSave(documents);
        showSuccessToast("Case updated successfully!");
      }
    } catch (error) {
      console.error("❌ Save error:", error);
      showErrorToast("Failed to update case. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleNextClick = () => {
    if (mode === 'view') {
      onNext();
      return;
    }

    // For create mode, validate and proceed (documents are mandatory)
    if (mode === 'create') {
      const uploadedExhibits = documents.map((d) => d.exhibit);
      const missingDocs = requiredDocs.filter((doc) => !uploadedExhibits.includes(doc));

      if (missingDocs.length > 0) {
        showWarningToast(
          `Please upload all required documents: ${missingDocs.join(", ")}`
        );
        return;
      }
    }

    // For edit mode, no validation - user can proceed with any number of documents
    if (onNext) onNext();
  };

  const getUploadStatus = useCallback(() => {
    const uploadedCount = documents.length;
    const totalCount = requiredDocs.length;
    const progress = totalCount > 0 ? (uploadedCount / totalCount) * 100 : 0;

    return {
      uploadedCount,
      totalCount,
      progress,
      isComplete: mode === 'edit' ? true : uploadedCount >= totalCount
    };
  }, [documents.length, requiredDocs.length, mode]);

  const status = getUploadStatus();
  const isAnyFileUploading = Object.values(uploadingFiles).some(status => status);
  const isAnyFileCompressing = Object.keys(compressionProgress).length > 0;

  const shouldShowSaveButton = mode === 'edit' && isLastStep;
  const shouldShowNextButton = mode === 'create' || (mode === 'edit' && !isLastStep);

  if (isLoading && mode !== 'create') {
    return (
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-xs text-gray-600">Loading documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md">
      {/* Header with Progress - Compact */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-xs flex items-center gap-2 text-gray-800">
            <FontAwesomeIcon icon={faFilePdf} className="text-red-600 text-xs" />
            {mode === 'view' ? 'View Documents' : 
             mode === 'edit' ? 'Update Documents (Optional)' : 'Upload Required Documents'}
            {(isAnyFileUploading || isAnyFileCompressing) && (
              <FontAwesomeIcon icon={faSpinner} className="text-blue-600 animate-spin text-xs" />
            )}
          </h2>
          <div className="text-[10px] text-gray-600">
            {status.uploadedCount} of {status.totalCount} documents {mode === 'edit' ? 'available' : 'uploaded'}
            {mode === 'edit' && " (optional)"}
          </div>
        </div>

        {/* Progress Bar - Slim */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${
              mode === 'edit' ? 'bg-blue-400' :
              status.isComplete ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${status.progress}%` }}
          ></div>
        </div>
        
        {status.isComplete && mode === 'create' && (
          <div className="text-green-600 text-[10px] font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
            All required documents uploaded successfully!
          </div>
        )}

        {mode === 'edit' && (
          <div className="text-blue-600 text-[10px] font-medium flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
            Document upload is optional in edit mode
          </div>
        )}

        {/* Compression Info */}
        {isAnyFileCompressing && (
          <div className="text-blue-600 text-[10px] font-medium flex items-center gap-2 mt-1">
            <FontAwesomeIcon icon={faCompressAlt} className="animate-pulse text-xs" />
            Optimizing images for faster upload...
          </div>
        )}
      </div>

      {/* ===== SECTION 1: Upload Required Documents (Select Exhibit) ===== */}
      {/* Three‑column max grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        {requiredDocs.map((docKey, index) => {
          const uploadedDoc = documents.find((d) => d.exhibit === docKey);
          const isUploading = uploadingFiles[docKey];
          const compressionProgressValue = compressionProgress[docKey];
          
          return (
            <div
              key={docKey}
              className={`flex items-center justify-between p-2 border border-gray-200 rounded-md transition-colors ${
                mode === 'view' ? 'bg-gray-50 cursor-default' : 'bg-white hover:bg-gray-50'
              }`}
              onDrop={(e) => handleDrop(docKey, e)}
              onDragOver={handleDragOver}
            >
              <div className="flex items-center gap-2 flex-1">
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-md">
                  {isUploading ? (
                    <FontAwesomeIcon icon={faSpinner} className="text-blue-600 animate-spin text-xs" />
                  ) : (
                    <FontAwesomeIcon 
                      icon={uploadedDoc ? getFileIcon(uploadedDoc.type) : faFilePdf} 
                      className={`text-xs ${uploadedDoc ? "text-blue-600" : "text-gray-400"}`} 
                    />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-xs text-gray-800">{docKey}</div>
                  {uploadedDoc && (
                    <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <span>{uploadedDoc.originalName}</span>
                      <span>•</span>
                      <span>{formatFileSize(uploadedDoc.size)}</span>
                      {uploadedDoc.compressionInfo && (
                        <span className="text-green-600 text-[10px]">{uploadedDoc.compressionInfo}</span>
                      )}
                    </div>
                  )}
                  {isUploading && (
                    <div className="text-[10px] text-blue-600 mt-0.5 flex items-center gap-2">
                      <span>Processing file...</span>
                      {compressionProgressValue && (
                        <span className="text-[10px] bg-blue-100 px-1 py-0.5 rounded">
                          {compressionProgressValue}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {uploadedDoc ? (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-[10px] font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-xs" />
                      Uploaded
                    </span>
                    {mode !== 'view' && (
                      <button
                        onClick={() => removeDocument(docKey)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                        title="Remove document"
                        disabled={isUploading}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} className="text-xs" />
                      </button>
                    )}
                  </div>
                ) : (
                  <span className={`text-[10px] flex items-center gap-1 ${
                    mode === 'edit' ? 'text-gray-500' : 'text-orange-500'
                  }`}>
                    <FontAwesomeIcon icon={mode === 'edit' ? faFilePdf : faExclamationTriangle} className="text-xs" />
                    {mode === 'edit' ? 'Optional' : 'Required'}
                  </span>
                )}

                {mode !== 'view' && (
                  <label 
                    className={`cursor-pointer px-2 py-1 rounded-md text-[10px] font-medium transition-colors flex items-center gap-1 ${
                      isUploading 
                        ? 'bg-gray-400 cursor-not-allowed text-white' 
                        : uploadedDoc
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : mode === 'edit'
                        ? 'bg-gray-600 hover:bg-gray-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                    title="Click to upload or drag & drop files"
                  >
                    {isUploading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                    ) : (
                      <FontAwesomeIcon icon={faUpload} className="text-xs" />
                    )}
                    {isUploading ? 'Processing...' : uploadedDoc ? 'Replace' : 'Upload'}
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      ref={(el) => (fileRefs.current[docKey] = el)}
                      onChange={(e) => handleFileChange(docKey, e)}
                      className="hidden"
                      disabled={isUploading}
                      multiple
                    />
                  </label>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== SECTION 2: Uploaded Documents Summary (Preview Buttons) ===== */}
      {documents.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-xs text-gray-800 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faFilePdf} className="text-blue-600 text-xs" />
            Uploaded Documents Preview ({documents.length} files)
          </h3>
          {/* Three‑column max grid for preview buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 mb-3">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`px-2 py-1 rounded-md text-[10px] border transition-all flex items-center gap-1 justify-center ${
                  selectedDoc?.id === doc.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FontAwesomeIcon icon={getFileIcon(doc.type)} className="text-xs" />
                <span className="truncate max-w-[100px]">{doc.exhibit}</span>
                {doc.compressionInfo && (
                  <FontAwesomeIcon icon={faCompressAlt} className="text-green-600 text-[10px]" />
                )}
              </button>
            ))}
          </div>

          {/* Preview Area - unchanged */}
          <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 h-[500px]">
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
                    className="max-w-full max-h-full object-contain rounded shadow-sm" 
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-xs">
                  Preview not available for this file type.
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <FontAwesomeIcon icon={faFilePdf} className="text-2xl mb-1" />
                  <p className="text-xs">Select a document to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons - Compact */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          disabled={isAnyFileUploading || isAnyFileCompressing || saving || isSubmitting}
          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-[10px] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Back
        </button>
        
        <div className="flex gap-2">
          {/* Save Changes button for edit mode (last step) */}
          {shouldShowSaveButton && (
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isAnyFileUploading || isAnyFileCompressing || saving || isSubmitting}
              className={`px-2 py-1 text-white rounded text-[10px] transition-colors flex items-center gap-1 ${
                isAnyFileUploading || isAnyFileCompressing || saving || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {saving || isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin text-xs" />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} className="text-xs" />
                  Save Changes
                </>
              )}
            </button>
          )}

          {/* Next button for create mode OR edit mode (not last step) */}
          {shouldShowNextButton && (
            <button
              type="button"
              onClick={handleNextClick}
              disabled={isAnyFileUploading || isAnyFileCompressing || isSubmitting || (mode === 'create' && !status.isComplete)}
              className={`px-2 py-1 text-white rounded text-[10px] transition-colors ${
                isAnyFileUploading || isAnyFileCompressing || isSubmitting || (mode === 'create' && !status.isComplete)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAnyFileUploading || isAnyFileCompressing ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-1 text-xs" />
                  Processing...
                </>
              ) : (
                'Next'
              )}
            </button>
          )}

          {/* Continue button for view mode */}
          {mode === 'view' && (
            <button
              type="button"
              onClick={onNext}
              className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px] transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDocumentUploader;