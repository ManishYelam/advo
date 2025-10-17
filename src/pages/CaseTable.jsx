import React, { useState, useEffect } from "react";
import { getAllCases } from "../services/casesService";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { FiTrash2, FiEdit, FiEye, FiPrinter, FiMoreVertical } from "react-icons/fi";
import { FaCheck, FaTimes } from "react-icons/fa";
import EditCaseModal from "../components/EditCaseModal";

const CaseTable = ({ onDelete, onSave, onBack, onView, onPrint, onMore }) => {
  const [cases, setCases] = useState([]);
  const [filters, setFilters] = useState({
    globalSearch: "",
    searchField: "",
    searchValue: "",
    status: "",
    priority: "",
    verified: false,
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
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  };

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const user = localStorage.getItem("user");
        if (!user) throw new Error("User not logged in");
        const parsedUser = JSON.parse(user);
        const token = parsedUser?.token;
        if (!token || isTokenExpired(token)) throw new Error("Token expired. Please login again.");

        const payload = {
          page: pagination.page,
          limit: pagination.limit,
          searchFields: "case_name, client_name",
          search: filters.globalSearch || "",
          filters: {
            status: filters.status || undefined,
            priority: filters.priority || undefined,
            verified: filters.verified ? true : undefined,
          },
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

  // ✅ Handle filters dynamically
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // ✅ Multi-filter logic
  const filteredCases = cases.filter((c) => {
    const matchesGlobalSearch =
      !filters.globalSearch ||
      Object.values(c).some((val) =>
        val?.toString().toLowerCase().includes(filters.globalSearch.toLowerCase())
      );

    const matchesFieldSearch =
      !filters.searchField ||
      !filters.searchValue ||
      c[filters.searchField]?.toString().toLowerCase().includes(filters.searchValue.toLowerCase());

    const matchesStatus =
      !filters.status || c.status?.toLowerCase() === filters.status.toLowerCase();

    const matchesPriority =
      !filters.priority || c.priority?.toLowerCase() === filters.priority.toLowerCase();

    const matchesVerified =
      filters.verified === false || c.verified === filters.verified;

    return (
      matchesGlobalSearch &&
      matchesFieldSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesVerified
    );
  });

  const toggleSelectAll = (e) => {
    if (e.target.checked) setSelectedCaseIds(filteredCases.map((c) => c.id));
    else setSelectedCaseIds([]);
  };

  const toggleSelectOne = (id) => {
    setSelectedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleEditClick = (caseData) => {
    setCaseToEdit(caseData);
    setIsModalOpen(true);
  };

  const handleSaveEdit = (updatedCase) => {
    onSave && onSave(updatedCase);
  };

  // ✅ Pagination
  const totalPages = Math.ceil(totalRecords / pagination.limit);
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (let i = Math.max(1, pagination.page - delta); i <= Math.min(totalPages, pagination.page + delta); i++) {
      range.push(i);
    }
    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push("...");
    if (range[range.length - 1] !== totalPages) range.push(totalPages);
    return range;
  };

  return (
    <div className="w-full h-screen p-4 bg-gray-100 overflow-auto text-[9px]">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-gray-700 hover:text-gray-900 mb-2"
        >
          <FaArrowLeft size={12} /> Back
        </button>
      )}

      {loading && <div>Loading cases...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* ✅ Filters */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap items-center">
          {/* Global Search */}
          <input
            type="text"
            name="globalSearch"
            value={filters.globalSearch}
            onChange={handleSearchChange}
            placeholder="Global Search..."
            className="px-2 py-1 border rounded text-[9px] hover:border-green-500"
          />

          {/* Field Selector */}
          <select
            name="searchField"
            value={filters.searchField}
            onChange={handleFilterChange}
            className="px-2 py-1 border rounded text-[9px] bg-white hover:border-green-500"
          >
            <option value="">Select Field</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
            <option value="deposit_type">Deposit Type</option>
            <option value="saving_account_start_date">Start Date</option>
            <option value="deposit_duration_years">Duration</option>
            <option value="fixed_deposit_total_amount">FD Total</option>
            <option value="interest_rate_fd">FD Rate</option>
            <option value="saving_account_total_amount">Savings Total</option>
            <option value="interest_rate_saving">Savings Rate</option>
            <option value="recurring_deposit_total_amount">Recurring Total</option>
            <option value="interest_rate_recurring">Recurring Rate</option>
            <option value="dnyanrudha_investment_total_amount">Dnyanrudha Total</option>
            <option value="dynadhara_rate">Dynadhara Rate</option>
            <option value="payment_status">Payment Status</option>
          </select>

          {/* Field Value */}
          <input
            type="text"
            name="searchValue"
            value={filters.searchValue}
            onChange={handleSearchChange}
            placeholder={
              filters.searchField
                ? `${filters.searchField
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}`
                : "Search by Field"
            }
            className="px-2 py-1 border rounded text-[9px] hover:border-green-500"
          />

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-2 py-1 border rounded text-[9px] bg-white hover:border-green-500"
          >
            <option value="">Status</option>
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Priority Filter */}
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="px-2 py-1 border rounded text-[9px] bg-white hover:border-green-500"
          >
            <option value="">Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Verified / Unverified checkboxes */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="verified"
                checked={filters.verified === "true"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    verified: prev.verified === "true" ? "" : "true", // toggle verified
                  }))
                }
                className="scale-75 cursor-pointer"
              />
              Verified
            </label>

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                name="unverified"
                checked={filters.verified === "false"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    verified: prev.verified === "false" ? "" : "false", // toggle unverified
                  }))
                }
                className="scale-75 cursor-pointer"
              />
              Unverified
            </label>
          </div>
        </div>

        {/* Delete Button */}
        <div>
          <button
            onClick={() => onDelete && onDelete(selectedCaseIds)}
            disabled={selectedCaseIds.length === 0}
            className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50 hover:bg-red-700"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow">
        <table className="min-w-full table-fixed border-collapse text-[9px]">
          <thead>
            <tr className="bg-green-700 text-white sticky top-0">
              <th className="px-1 py-1 w-[2%]">
                <input
                  type="checkbox"
                  checked={selectedCaseIds.length === filteredCases.length && filteredCases.length > 0}
                  onChange={toggleSelectAll}
                  className="scale-75 cursor-pointer"
                />
              </th>
              <th className="px-1 py-1 w-[3%]">ID</th>
              <th className="px-2 py-1 w-[8%] text-center">Actions</th>
              <th className="px-1 py-1 w-[6%]">Deposit Type</th>
              <th className="px-1 py-1 w-[6%]">Start Date</th>
              <th className="px-1 py-1 w-[5%]">Duration</th>
              <th className="px-1 py-1 w-[5%]">FD Total</th>
              <th className="px-1 py-1 w-[5%]">FD Rate</th>
              <th className="px-1 py-1 w-[6%]">Savings Total</th>
              <th className="px-1 py-1 w-[6%]">Savings Rate</th>
              <th className="px-1 py-1 w-[6%]">Recurring Total</th>
              <th className="px-1 py-1 w-[6%]">Recurring Rate</th>
              <th className="px-1 py-1 w-[6%]">Dnyanrudha Total</th>
              <th className="px-1 py-1 w-[6%]">Dynadhara Rate</th>
              <th className="px-1 py-1 w-[3%]">Verified</th>
              <th className="px-1 py-1 w-[3%]">Status</th>
              <th className="px-1 py-1 w-[6%]">Payment Status</th>
              <th className="px-1 py-1 w-[6%]">Created At</th>
              <th className="px-1 py-1 w-[6%]">Updated At</th>
              <th className="px-1 py-1 w-[4%] text-center">
                <FaFilePdf className="mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="18" className="text-center py-2 text-gray-500">
                  No cases found.
                </td>
              </tr>
            ) : (
              filteredCases.map((c, idx) => (
                <tr key={c.id ?? idx} className="hover:bg-gray-50">
                  <td className="px-1 py-1 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCaseIds.includes(c.id)}
                      onChange={() => toggleSelectOne(c.id)}
                      className="scale-75 cursor-pointer"
                    />
                  </td>
                  <td className="px-1 py-1 text-center">{c.id}</td>
                  <td className="px-2 py-1 text-center">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        className="text-green-600 hover:text-green-700"
                        onClick={() => onView && onView(c)}
                        title="View"
                      >
                        <FiEye size={12} />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => handleEditClick(c)}
                        title="Edit"
                      >
                        <FiEdit size={12} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-700"
                        onClick={() => onPrint && onPrint(c)}
                        title="Print"
                      >
                        <FiPrinter size={12} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-700"
                        onClick={() => onMore && onMore(c)}
                        title="More Options"
                      >
                        <FiMoreVertical size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-1 py-1 text-center">{c.deposit_type}</td>
                  <td className="px-1 py-1 text-center">{c.saving_account_start_date}</td>
                  <td className="px-1 py-1 text-center">{c.deposit_duration_years}</td>
                  <td className="px-1 py-1 text-center">{c.fixed_deposit_total_amount}</td>
                  <td className="px-1 py-1 text-center">{c.interest_rate_fd}</td>
                  <td className="px-1 py-1 text-center">{c.saving_account_total_amount}</td>
                  <td className="px-1 py-1 text-center">{c.interest_rate_saving}</td>
                  <td className="px-1 py-1 text-center">{c.recurring_deposit_total_amount}</td>
                  <td className="px-1 py-1 text-center">{c.interest_rate_recurring}</td>
                  <td className="px-1 py-1 text-center">{c.dnyanrudha_investment_total_amount}</td>
                  <td className="px-1 py-1 text-center">{c.dynadhara_rate}</td>
                  <td className="px-1 py-1 text-center">
                    {c.verified ? (
                      <FaCheck className="text-green-600 mx-auto" size={10} />
                    ) : (
                      <FaTimes className="text-red-600 mx-auto" size={10} />
                    )}
                  </td>
                  <td className="px-1 py-1 text-center">{c.status}</td>
                  <td className="px-1 py-1 text-center">{c.payment_status || "Pending"}</td>
                  <td className="px-1 py-1 text-center">
                    {c.created_at ? new Date(c.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-1 py-1 text-center">
                    {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-1 py-1 text-center">
                    {c.documents && c.documents.length > 0
                      ? c.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url || doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline mx-0.5 text-[9px] truncate block max-w-[60px]"
                        >
                          {doc.filename || doc.originalname}
                        </a>
                      ))
                      : "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination stays same */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-[9px]">
        <div>
          Showing{" "}
          <span className="font-medium">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {Math.min(pagination.page * pagination.limit, totalRecords)}
          </span>{" "}
          of <span className="font-medium">{totalRecords}</span> cases
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <div className="flex items-center gap-1 ml-2">
            <span>Show</span>
            <select
              value={pagination.limit}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                  page: 1,
                }))
              }
              className="px-2 py-1 border rounded text-[9px]"
            >
              {[5, 10, 20, 50].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span>per page</span>
          </div>

          <button
            onClick={() => setPagination({ ...pagination, page: 1 })}
            disabled={pagination.page === 1}
            className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
          >
            First
          </button>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
          >
            Prev
          </button>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={i} className="px-2 py-1 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setPagination({ ...pagination, page: p })}
                className={`px-2 py-1 rounded ${pagination.page === p
                  ? "bg-green-800 text-white"
                  : "bg-white border border-gray-300 hover:bg-green-100"
                  }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === totalPages}
            className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
          >
            Next
          </button>
          <button
            onClick={() => setPagination({ ...pagination, page: totalPages })}
            disabled={pagination.page === totalPages}
            className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700"
          >
            Last
          </button>
        </div>
      </div>

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
