import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const CaseDocumentUploader = ({ onDocumentsChange }) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map((file) => ({
            name: file.name,
            url: URL.createObjectURL(file),
            type: file.type,
        }));

        setDocuments((prevDocs) => {
            const existingNames = new Set(prevDocs.map((d) => d.name));
            const filteredNewFiles = newFiles.filter((f) => !existingNames.has(f.name));
            const updatedDocs = [...prevDocs, ...filteredNewFiles];

            if (onDocumentsChange) onDocumentsChange(updatedDocs);

            return updatedDocs;
        });

        setSelectedDoc(newFiles[0] || null);

        e.target.value = ""; // reset input
    };

    const removeDocument = (name) => {
        setDocuments((prev) => {
            const filtered = prev.filter((doc) => doc.name !== name);
            if (onDocumentsChange) onDocumentsChange(filtered);
            return filtered;
        });

        if (selectedDoc?.name === name) {
            setSelectedDoc(null);
        }
    };

    return (
        <div className="mt-4 max-w-8xl mx-full aligncenter p-6 bg-white rounded-lg shadow-md text-[10px]">
            <h2 className="font-semibold mb-4 flex items-center space-x-2 text-[10px]">
                <FontAwesomeIcon icon={faFilePdf} className="text-red-600" />
                <span>Upload Case Documents</span>
            </h2>

            {/* Hidden native input */}
            <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept=".pdf,image/*"
                ref={fileInputRef}
                className="hidden"
            />

            {/* Custom file upload button */}
            <div className="flex items-center space-x-4 mb-4">
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-1 py-[2px] bg-green-600 hover:bg-green-700 text-white rounded shadow text-[8px]"
                >
                    Choose Files
                </button>

                <div className="text-gray-600 text-[8px]">
                    {documents.length > 0
                        ? `${documents.length} file${documents.length > 1 ? "s" : ""} selected`
                        : "No files chosen"}
                </div>
            </div>

            {documents.length > 0 && (
                <div className="mb-4">
                    <p className="font-semibold text-[8px] mb-2">Uploaded Documents:</p>
                    <div className="flex flex-wrap gap-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.name}
                                className="flex items-center space-x-1 border rounded px-2 py-0.5 cursor-pointer select-none"
                            >
                                <button
                                    onClick={() => setSelectedDoc(doc)}
                                    className={`focus:outline-none ${selectedDoc?.name === doc.name
                                            ? "text-white bg-green-600 rounded px-2 py-0.5 text-[6px]"
                                            : "text-green-600 hover:bg-green-100 rounded px-2 py-0.5 text-[6px]"
                                        }`}
                                >
                                    {doc.name}
                                </button>
                                <button
                                    onClick={() => removeDocument(doc.name)}
                                    title={`Remove ${doc.name}`}
                                    className="text-red-600 hover:text-red-800 focus:outline-none text-[10px]"
                                    aria-label={`Remove ${doc.name}`}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="border rounded-lg overflow-hidden h-[600px] text-[10px]">
                {selectedDoc ? (
                    selectedDoc.type === "application/pdf" ? (
                        <iframe
                            src={selectedDoc.url}
                            title={selectedDoc.name}
                            className="w-full h-full"
                        />
                    ) : selectedDoc.type.startsWith("image/") ? (
                        <img
                            src={selectedDoc.url}
                            alt={selectedDoc.name}
                            className="object-contain w-full h-full"
                        />
                    ) : (
                        <p className="p-4 text-center text-gray-600">
                            Preview not available for this file type.
                        </p>
                    )
                ) : (
                    <p className="p-4 text-center text-gray-500">
                        No document selected. Click on a document name above to preview.
                    </p>
                )}
            </div>
        </div>
    );
};

export default CaseDocumentUploader;
