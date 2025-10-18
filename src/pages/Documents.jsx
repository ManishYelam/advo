import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";
import { useState } from "react";

const Documents = () => {
  const [documents, setDocuments] = useState([
    { 
      id: 1, 
      name: "Contract Agreement", 
      type: "PDF", 
      size: "2.4 MB",
      uploadDate: "2024-10-15",
      category: "Contracts",
      status: "Verified"
    },
    { 
      id: 2, 
      name: "Legal Notice Draft", 
      type: "DOCX", 
      size: "1.1 MB",
      uploadDate: "2024-10-14",
      category: "Legal",
      status: "Pending"
    },
    { 
      id: 3, 
      name: "Evidence Photos", 
      type: "ZIP", 
      size: "15.7 MB",
      uploadDate: "2024-10-10",
      category: "Evidence",
      status: "Verified"
    },
    { 
      id: 4, 
      name: "Court Order Copy", 
      type: "PDF", 
      size: "3.2 MB",
      uploadDate: "2024-10-08",
      category: "Court Documents",
      status: "Verified"
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  const categories = ["All", "Contracts", "Legal", "Evidence", "Court Documents", "Financial"];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "PDF":
        return (
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="text-red-600 font-bold text-sm">PDF</span>
          </div>
        );
      case "DOCX":
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">DOC</span>
          </div>
        );
      case "ZIP":
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">ZIP</span>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">FILE</span>
          </div>
        );
    }
  };

  const handleUpload = () => {
    // Simulate file upload
    const newDocument = {
      id: documents.length + 1,
      name: `New Document ${documents.length + 1}`,
      type: "PDF",
      size: "1.5 MB",
      uploadDate: new Date().toISOString().split('T')[0],
      category: "Legal",
      status: "Pending"
    };
    setDocuments([newDocument, ...documents]);
  };

  const handleDelete = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDownload = (doc) => {
    // Simulate download
    console.log("Downloading:", doc.name);
    // In real implementation, this would trigger actual download
  };

  return (
    <DashboardLayout>
      <div className="m-3">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Documents</h1>
            <p className="text-gray-600 mt-1">Manage your legal documents and files</p>
          </div>
          <Button onClick={handleUpload} className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start justify-between mb-3">
                  {getFileIcon(doc.type)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                    {doc.status}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-1 truncate">{doc.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{doc.category}</p>
                
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{doc.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uploaded:</span>
                    <span>{doc.uploadDate}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Documents List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getFileIcon(doc.type)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                            <div className="text-sm text-gray-500">{doc.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.uploadDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Download
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id)}
                            className="text-red-600 hover:text-red-900 ml-4"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCategory !== "All" 
                ? "Try adjusting your search or filter criteria."
                : "Get started by uploading your first document."
              }
            </p>
            <Button onClick={handleUpload}>
              Upload Document
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Documents;