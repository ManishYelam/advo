import React, { useState, useEffect } from "react";
import { getAllCases } from "../services/casesService";
import { FiEdit, FiEye, FiPrinter, FiMoreVertical, FiTrash2, FiFileText, FiFile, FiSave } from "react-icons/fi";
import EditCaseModal from "../components/EditCaseModal";

const CaseTable = ({ onDelete, onEdit, onView, onPrint, onSave, onMore }) => {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({
    case_name: "",
    client_name: "",
    status: "",
    priority: "",
  });
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caseToEdit, setCaseToEdit] = useState(null);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    const currentTime = Math.floor(Date.now() / 1000); // Current timestamp in seconds
    return decodedToken.exp < currentTime;
  };

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const user = localStorage.getItem("user");
        if (!user) throw new Error("User is not logged in.");

        const parsedUser = JSON.parse(user);
        const token = parsedUser?.token;
        if (!token || isTokenExpired(token)) {
          throw new Error("Token is expired or missing. Please log in again.");
        }

        const payload = {
          page: pagination.page,
          limit: pagination.limit,
          searchFields: "case_name, client_name",
          search: filters.case_name || filters.client_name,
          filters: {
            status: filters.status || undefined,
            priority: filters.priority || undefined,
          }
        };

        const response = await getAllCases(payload);
        setCases(response.data.data || []);
        setTotalRecords(response.data.totalRecords || 0);
      } catch (err) {
        setError(`Failed to fetch cases: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [filters, pagination]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaginationChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCases = cases.filter((c) => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (!filterValue) return true;
      const caseValue = c[key];
      if (!caseValue) return false;
      return caseValue.toString().toLowerCase().includes(filterValue.toLowerCase());
    });
  });

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCaseIds(filteredCases.map((c) => c.id));
    } else {
      setSelectedCaseIds([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

   // Handle Edit Button click
  const handleEditClick = (caseData) => {
    setCaseToEdit(caseData); // Store the case data to be edited
    setIsModalOpen(true); // Open the modal
  };

  // Handle Save Action
  const handleSaveEdit = (updatedCase) => {
    // Perform the save action (could be API call)
    onSave && onSave(updatedCase); // Pass the updated case to the parent
  };

  return (
    <div className="mx-6 mt-2">
      {/* Loading/Error Handling */}
      {loading && <div>Loading cases...</div>}
      {error && <div>{error}</div>}

      {/* Filters and Search */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-800 mt-2">Cases</h4>

        <div className="flex gap-4 items-center text-[8px]">
          {/* Search Inputs */}
          <input
            type="text"
            name="case_name"
            value={filters.case_name}
            onChange={handleSearchChange}
            placeholder="Search Case Name"
            className="px-3 py-1 border rounded"
          />
          <input
            type="text"
            name="client_name"
            value={filters.client_name}
            onChange={handleSearchChange}
            placeholder="Search Client Name"
            className="px-3 py-1 border rounded"
          />
          {/* Filter Inputs */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-3 py-1 border rounded"
          >
            <option value="">Select Status</option>
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="px-3 py-1 border rounded"
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button
            onClick={() => onDelete && onDelete(selectedCaseIds)}
            disabled={selectedCaseIds.length === 0}
            className="px-2 py-1 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 disabled:opacity-50"
          >
            <FiTrash2 size={8} />
          </button>
          <button
            // onClick={() => onSave && onSave(selectedCaseIds)}
            // disabled={editselectedCaseIds.length === 0}
            className="px-2 py-1 bg-green-600 text-white rounded-lg flex items-center gap-2 hover:bg-green-700 disabled:opacity-50"
          > 
            <FiSave size={8} />
          </button>   
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full w-full border-collapse text-[8px] table-fixed" style={{ tableLayout: "fixed" }}>
          <thead>
            <tr className="bg-gradient-to-r from-green-700 to-green-500 text-white sticky top-0 z-10" style={{ fontSize: "8px" }}>
              <th className="px-2 py-2 w-[2%]">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectedCaseIds.length === filteredCases.length}
                  aria-label="Select All Cases"
                  className="scale-75 cursor-pointer"
                />
              </th>
              <th className="px-2 py-2 w-[4%] text-center">ID</th>
              <th className="px-2 py-2 w-[6%] text-center">Actions</th>
              <th className="px-2 py-2 w-[8%] text-center">Case Number</th>
              <th className="px-2 py-2 w-[15%] text-center">Case Name</th>
              <th className="px-2 py-2 w-[10%] text-center">Case Type</th>
              <th className="px-2 py-2 w-[7%] text-center">Status</th>
              <th className="px-2 py-2 w-[12%] text-center">Court</th>
              <th className="px-2 py-2 w-[8%] text-center">Next Hearing</th>
              <th className="px-2 py-2 w-[8%] text-center">Filing Date</th>
              <th className="px-2 py-2 w-[5%] text-center">Fees</th>
              <th className="px-2 py-2 w-[8%] text-center">Payment Status</th>
              <th className="px-2 py-2 w-[8%] text-center">Outcome</th>
              <th className="px-2 py-2 w-[12%] text-center">Court Address</th>
              <th className="px-2 py-2 w-[6%] text-center">Documents</th>
              <th className="px-2 py-2 w-[6%] text-center">Shared Docs</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-700" style={{ fontSize: "8px" }}>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="16" className="text-center py-6 text-gray-500">
                  No cases found.
                </td>
              </tr>
            ) : (
              filteredCases.map((c, idx) => (
                <tr key={c.id ?? idx} className="hover:bg-gray-50 transition" style={{ height: "20px" }}>
                  <td className="w-[2%] px-2 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCaseIds.includes(c.id)}
                      onChange={() => toggleSelectOne(c.id)}
                      className="scale-75 cursor-pointer"
                    />
                  </td>
                  <td className="px-2 py-1 text-center">{c.id}</td>
                  <td className="px-2 py-1 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button className="text-green-600 hover:text-green-700" onClick={() => onView && onView(c)} title="View">
                        <FiEye size={10} />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700" onClick={() => handleEditClick(c)} title="Edit">
                        <FiEdit size={10} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700" onClick={() => onPrint && onPrint(c)} title="Print">
                        <FiPrinter size={10} />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700" onClick={() => onMore && onMore(c)} title="More Options">
                        <FiMoreVertical size={10} />
                      </button>
                    </div>
                  </td>
                  <td className="w-[8%] px-2 py-1 text-center">{c.case_number}</td>
                  <td className="w-[15%] px-2 py-1 text-center">{c.case_name}</td>
                  <td className="w-[10%] px-2 py-1 text-center">{c.case_type}</td>
                  <td className="w-[7%] px-2 py-1 text-center">{c.status}</td>
                  <td className="w-[12%] px-2 py-1 text-center">{c.court}</td>
                  <td className="w-[8%] px-2 py-1 text-center">{c.next_hearing}</td>
                  <td className="w-[8%] px-2 py-1 text-center">{c.filing_date}</td>
                  <td className="w-[5%] px-2 py-1 text-center">{c.fees}</td>
                  <td className="w-[8%] px-2 py-1 text-center">{c.payment_status}</td>
                  <td className="w-[8%] px-2 py-1 text-center">{c.outcome}</td>
                  <td className="w-[12%] px-2 py-1 text-center">{c.court_address}</td>
                  <td className="w-[6%] px-2 py-1 text-center">
                    {/* Document Icons with Tooltip */}
                    {c.documents && c.documents.length > 0 ? (
                      c.documents.map((document, index) => (
                        <span key={index} className="relative group inline-block mx-1">
                          <FiFile size={10} className="cursor-pointer text-red-700 hover:text-blue-600 cursor-pointer" />
                          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {document}
                          </span>
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="w-[6%] px-2 py-1 text-center">
                    {/* Shared Documents (if any) */}
                    {c.shared_documents && c.shared_documents.length > 0 ? (
                      c.shared_documents.map((document, index) => (
                        <span key={index} className="relative group inline-block mx-1">
                          <FiFileText size={16} className="cursor-pointer text-gray-700 hover:text-blue-600" />
                          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-black text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-300">
                            {document}
                          </span>
                        </span>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination and Total/Selected Records */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-3">
          {/* Total Records Button */}
          <button className="px-2 py-1 text-white text-[8px] bg-green-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Total Records: {totalRecords} &nbsp; | &nbsp; Selected: {selectedCaseIds.length}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* First Button */}
          <button
            onClick={() => handlePaginationChange(1)}
            disabled={pagination.page === 1}
            className="px-2 py-1 text-white text-[8px] bg-green-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>

          {/* Prev Button */}
          <button
            onClick={() => handlePaginationChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-2 py-1 text-white text-[8px] bg-green-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {/* Page Info */}
          <span className="text-[8px] text-gray-700">
            Page {pagination.page} of {Math.ceil(totalRecords / pagination.limit)}
          </span>

          {/* Next Button */}
          <button
            onClick={() => handlePaginationChange(pagination.page + 1)}
            disabled={pagination.page === Math.ceil(totalRecords / pagination.limit)}
            className="px-2 py-1 text-white text-[8px] bg-green-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>

          {/* Last Button */}
          <button
            onClick={() => handlePaginationChange(Math.ceil(totalRecords / pagination.limit))}
            disabled={pagination.page === Math.ceil(totalRecords / pagination.limit)}
            className="px-2 py-1 text-white text-[8px] bg-green-600 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <EditCaseModal
          caseData={caseToEdit}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default CaseTable;
