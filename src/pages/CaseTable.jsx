import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { getAllCases, deleteCase } from "../services/casesService";
import { FaArrowLeft, FaFilePdf, FaPlus, FaCheck, FaTimes, FaDownload } from "react-icons/fa";
import { FiTrash2, FiEdit, FiEye, FiPrinter, FiMoreVertical, FiRefreshCcw } from "react-icons/fi";

// Custom hook for debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Token validation utility
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// Filter configurations
const filterConfigs = {
  globalSearch: (caseItem, value) => {
    if (!value) return true;
    const searchTerm = value.toLowerCase();
    return Object.values(caseItem).some(val =>
      val?.toString().toLowerCase().includes(searchTerm)
    );
  },
  searchField: (caseItem, value, filters) => {
    if (!filters.searchField || !filters.searchValue) return true;
    return caseItem[filters.searchField]?.toString()
      .toLowerCase()
      .includes(filters.searchValue.toLowerCase());
  },
  status: (caseItem, value) =>
    !value || caseItem.status?.toLowerCase() === value.toLowerCase(),
  priority: (caseItem, value) =>
    !value || caseItem.priority?.toLowerCase() === value.toLowerCase(),
  verified: (caseItem, value) => {
    if (value === "") return true;
    if (value === "true") return caseItem.verified === true;
    if (value === "false") return caseItem.verified === false;
    return true;
  }
};

// Custom Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const CaseTable = ({ onSave, onBack, onView, onPrint, onMore }) => {
  const [cases, setCases] = useState([]);
  const [expandedCaseIds, setExpandedCaseIds] = useState([]);
  const [filters, setFilters] = useState({
    globalSearch: "",
    searchField: "",
    searchValue: "",
    status: "",
    priority: "",
    verified: "",
  });
  const [selectedCaseIds, setSelectedCaseIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Delete confirmation modal state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [casesToDelete, setCasesToDelete] = useState([]);
  const [deleteConfirmMessage, setDeleteConfirmMessage] = useState("");

  // Use debounce for global search
  const debouncedGlobalSearch = useDebounce(filters.globalSearch, 500); // 500ms delay

  // Initialize user data from localStorage
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserRole(parsedUser?.role || 'client');
        setUserId(parsedUser?.id);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserRole('client');
      }
    }
  }, []);

  // ✅ Compute Payment Status from hierarchical payments
  const getCasePaymentStatus = useCallback((caseItem) => {
    if (!caseItem.payments || caseItem.payments.length === 0) return "Pending";
    const statuses = caseItem.payments.map(p => p.status?.toLowerCase());
    if (statuses.every(s => s === "paid")) return "Paid";
    if (statuses.every(s => s === "failed")) return "Failed";
    if (statuses.includes("pending")) return "Pending";
    return "Partial";
  }, []);

  // ✅ Enhanced Fetch Cases with Role-Based Access
  const fetchCases = async (retryCount = 0) => {
    setLoading(true);
    setError(null);
    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("User not logged in");

      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;
      const currentUserRole = parsedUser?.role || 'client';
      const currentUserId = parsedUser?.id;

      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired. Please login again.");
      }

      // Prepare payload based on user role
      const payload = {
        page: pagination.page,
        limit: pagination.limit,
        searchFields: "",
        search: debouncedGlobalSearch || "", // Use debounced value here
        filters: {
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          verified: filters.verified === "true" ? true :
            filters.verified === "false" ? false : undefined,
          // Add role-based filters
          ...(currentUserRole === 'client' && currentUserId && { client_id: currentUserId }),
          ...(currentUserRole === 'advocate' && currentUserId && { advocate_id: currentUserId })
        },
      };

      const response = await getAllCases(payload);

      // Transform the response data to ensure consistent structure
      const transformedCases = (response.data.data || []).map(caseItem => {
        // Ensure payments is always an array
        let payments = [];

        if (Array.isArray(caseItem.payments)) {
          payments = caseItem.payments;
        } else if (caseItem.payment) {
          payments = [caseItem.payment];
        }

        return {
          ...caseItem,
          payments: payments
        };
      });

      setCases(transformedCases);
      setTotalRecords(response.data.totalRecords || 0);

      // Update user role and ID if not already set
      if (!userRole) {
        setUserRole(currentUserRole);
        setUserId(currentUserId);
      }
    } catch (err) {
      if (err.message.includes('Token expired') && retryCount < 2) {
        setTimeout(() => fetchCases(retryCount + 1), 1000);
      } else {
        setError(`Failed to fetch cases: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Automatically fetch whenever debounced search, filters or pagination changes
  useEffect(() => {
    fetchCases();
  }, [debouncedGlobalSearch, filters.status, filters.priority, filters.verified, pagination.page, pagination.limit]);

  // ✅ Apply filters to cases (only for frontend filters like searchField)
  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      return Object.entries(filters).every(([key, value]) => {
        if (key === "searchField") {
          return filterConfigs.searchField(caseItem, value, filters);
        }
        // Skip globalSearch as it's handled by backend
        if (key === "globalSearch") return true;
        return filterConfigs[key] ? filterConfigs[key](caseItem, value) : true;
      });
    });
  }, [cases, filters]);

  // ✅ Show Delete Confirmation
  const showDeleteConfirmation = (caseIds) => {
    if (!caseIds || caseIds.length === 0) {
      setError("No cases selected for deletion");
      return;
    }

    setCasesToDelete(caseIds);

    const message = caseIds.length === 1
      ? `Are you sure you want to delete case #${caseIds[0]}? This action cannot be undone.`
      : `Are you sure you want to delete ${caseIds.length} selected cases? This action cannot be undone.`;

    setDeleteConfirmMessage(message);
    setShowDeleteConfirm(true);
  };

  // ✅ DELETE CASE FUNCTIONALITY
  const handleDeleteCase = async () => {
    setDeleteLoading(true);
    setError(null);

    try {
      const user = localStorage.getItem("user");
      if (!user) throw new Error("User not logged in");

      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;

      if (!token || isTokenExpired(token)) {
        throw new Error("Token expired. Please login again.");
      }

      // Delete cases one by one
      const deletePromises = casesToDelete.map(id => deleteCase(id));
      await Promise.all(deletePromises);

      // Show success message
      const successMessage = casesToDelete.length === 1
        ? `Case #${casesToDelete[0]} deleted successfully`
        : `${casesToDelete.length} cases deleted successfully`;

      // Close confirmation modal
      setShowDeleteConfirm(false);
      setCasesToDelete([]);

      // Refresh the cases list
      await fetchCases();

      // Clear selections
      setSelectedCaseIds([]);
      setSelectedRowId(null);

      // Show success message
      setError(successMessage);

    } catch (err) {
      setError(`Failed to delete cases: ${err.message}`);
      setShowDeleteConfirm(false);
      setCasesToDelete([]);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ✅ DELETE SINGLE CASE (from action buttons)
  const handleDeleteSingleCase = (caseItem, e) => {
    e.stopPropagation();
    showDeleteConfirmation([caseItem.id]);
  };

  // ✅ Cancel Delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setCasesToDelete([]);
    setDeleteConfirmMessage("");
  };

  // ✅ Enhanced Payment Details Component
  const PaymentDetailsRow = ({ caseItem }) => {
    const payments = caseItem.payments || [];

    if (payments.length === 0) {
      return (
        <tr className="bg-gray-50 text-[8px]">
          <td colSpan="20" className="p-2">
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-center">
              <span className="text-yellow-700">No payment records found for this case</span>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr className="bg-gray-50 text-[8px]">
        <td colSpan="20" >
          <div className="bg-white rounded p-2">
            <div className="flex justify-between items-center ">
              <h4 className="font-semibold text-gray-700">
                Payment Details ({payments.length} payment{payments.length !== 1 ? 's' : ''})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto border border-gray-300 text-center text-[8px]">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-1 py-1">#</th>
                    <th className="border px-1 py-1">Payment ID</th>
                    <th className="border px-1 py-1">Amount</th>
                    <th className="border px-1 py-1">Amount Paid</th>
                    <th className="border px-1 py-1">Amount Due</th>
                    <th className="border px-1 py-1">Currency</th>
                    <th className="border px-1 py-1">Status</th>
                    <th className="border px-1 py-1">Method</th>
                    <th className="border px-1 py-1">Receipt</th>
                    <th className="border px-1 py-1">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr key={payment.id || index} className="hover:bg-pink-100">
                      <td className="border px-1 py-1 font-medium">{index + 1}</td>
                      <td className="border px-1 py-1 font-mono text-[7px]">
                        {payment.payment_id || payment.id || 'N/A'}
                      </td>
                      <td className="border px-1 py-1">
                        {payment.amount ? `₹${payment.amount}` : 'N/A'}
                      </td>
                      <td className="border px-1 py-1">
                        {payment.amount_paid ? `₹${payment.amount_paid}` : '₹0'}
                      </td>
                      <td className="border px-1 py-1">
                        {payment.amount_due ? `₹${payment.amount_due}` : 'N/A'}
                      </td>
                      <td className="border px-1 py-1">{payment.currency || 'INR'}</td>
                      <td className="border px-1 py-1">
                        <span className={`px-1 py-0.5 rounded text-white ${payment.status === 'paid' || payment.status === 'Paid' ? 'bg-green-500' :
                          payment.status === 'failed' || payment.status === 'Failed' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}>
                          {payment.status || 'Pending'}
                        </span>
                      </td>
                      <td className="border px-1 py-1 capitalize">
                        {payment.method || 'N/A'}
                      </td>
                      <td className="border px-1 py-1">
                        {payment.receipt || 'N/A'}
                      </td>
                      <td className="border px-1 py-1">
                        {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </tr>
    );
  };

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
    // Only reset pagination for non-global search fields
    if (name !== "globalSearch") {
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  // ✅ Toggle hierarchical payment row
  const toggleExpandCase = (id, e) => {
    if (e) e.stopPropagation(); // Prevent row click when clicking expand button
    setExpandedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  // ✅ Handle row selection with highlighting
  const handleRowClick = (caseId, e) => {
    // Don't trigger row selection when clicking on action buttons or checkboxes
    if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.closest('button') || e.target.closest('input')) {
      return;
    }

    setSelectedRowId(caseId === selectedRowId ? null : caseId);
  };

  // ✅ Get row background color based on selection state
  const getRowBackgroundColor = (caseId) => {
    if (caseId === selectedRowId) {
      return 'bg-blue-200 border-l-4 border-blue-500'; // Selected row with blue accent
    }
    return 'bg-white hover:bg-pink-100'; // Default state
  };

  // ✅ Pagination calculations
  const paginationInfo = useMemo(() => ({
    totalPages: Math.ceil(totalRecords / pagination.limit),
    startIndex: (pagination.page - 1) * pagination.limit + 1,
    endIndex: Math.min(pagination.page * pagination.limit, totalRecords)
  }), [pagination, totalRecords]);

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const { totalPages } = paginationInfo;

    for (let i = Math.max(1, pagination.page - delta); i <= Math.min(totalPages, pagination.page + delta); i++) {
      range.push(i);
    }

    if (range[0] > 2) range.unshift("...");
    if (range[0] !== 1) range.unshift(1);
    if (range[range.length - 1] < totalPages - 1) range.push("...");
    if (range[range.length - 1] !== totalPages) range.push(totalPages);

    return range;
  };

  // ✅ Selection handlers
  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCaseIds(cases.map((c) => c.id));
    } else {
      setSelectedCaseIds([]);
    }
  };

  const toggleSelectOne = (id, e) => {
    if (e) e.stopPropagation(); // Prevent row click when clicking checkbox
    setSelectedCaseIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // ✅ Export functionality
  const handleExport = async () => {
    setExportLoading(true);
    try {
      const csvHeaders = [
        'ID', 'Deposit Type', 'Status', 'Priority', 'Verified',
        'Payment Status', 'FD Total', 'Savings Total', 'Created At'
      ].join(',');

      const csvRows = filteredCases.map(caseItem => [
        caseItem.id,
        `"${caseItem.deposit_type}"`,
        caseItem.status,
        caseItem.priority,
        caseItem.verified ? 'Yes' : 'No',
        getCasePaymentStatus(caseItem),
        caseItem.fixed_deposit_total_amount,
        caseItem.saving_account_total_amount,
        caseItem.createdAt ? new Date(caseItem.createdAt).toLocaleDateString() : '-'
      ].join(','));

      const csvContent = [csvHeaders, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `cases-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(`Export failed: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  // ✅ Reset filters
  const handleResetFilters = () => {
    setFilters({
      globalSearch: "",
      searchField: "",
      searchValue: "",
      status: "",
      priority: "",
      verified: "",
    });
    setPagination({ page: 1, limit: 10 });
    setSelectedRowId(null); // Clear row selection
    fetchCases();
  };

  // ✅ Action button handlers with event propagation prevention
  const handleActionButtonClick = (action, caseItem, e) => {
    e.stopPropagation(); // Prevent row click when clicking action buttons

    switch (action) {
      case 'view':
        onView && onView(caseItem);
        break;
      case 'edit':
        onView && onView(caseItem, 'edit');
        break;
      case 'print':
        onPrint && onPrint(caseItem);
        break;
      case 'delete':
        handleDeleteSingleCase(caseItem, e);
        break;
      case 'more':
        onMore && onMore(caseItem);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-screen p-4 bg-gray-100 overflow-auto text-[9px]">
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleDeleteCase}
        title="Confirm Deletion"
        message={deleteConfirmMessage}
        confirmText={deleteLoading ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />

      {/* User Role Indicator */}
      <div className="mb-3 flex justify-between items-center">
        <div className="text-xs font-semibold text-gray-700">
          Viewing cases for: <span className="capitalize text-green-700">{userRole}</span>
          {userRole !== 'admin' && (
            <span className="text-gray-600 ml-2">(Your cases only)</span>
          )}
        </div>
        {/* Selected Row Info */}
        {selectedRowId && (
          <div className="text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            📍 Row Selected: Case #{selectedRowId}
          </div>
        )}
      </div>

      {/* Loading State */}
      {(loading || deleteLoading) && (
        <div className="flex items-center justify-center py-4" aria-live="polite">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2">{deleteLoading ? "Deleting cases..." : "Loading cases..."}</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className={`px-3 py-2 rounded mb-3 ${error.includes('successfully') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`} role="alert">
          {error}
        </div>
      )}

      {/* Filters Section */}
      <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
        <div className="flex gap-2 flex-wrap items-center">
          {/* Global Search */}
          <input
            type="text"
            name="globalSearch"
            value={filters.globalSearch}
            onChange={handleSearchChange}
            placeholder="Global Search..."
            className="px-2 py-1 border rounded text-[9px] hover:border-green-500 focus:border-green-500 focus:outline-none"
            aria-label="Global search across all fields"
          />

          {/* Field Selector */}
          <select
            name="searchField"
            value={filters.searchField}
            onChange={handleFilterChange}
            className="px-2 py-1 border rounded text-[9px] bg-white hover:border-green-500 focus:border-green-500 focus:outline-none"
            aria-label="Select field to search"
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
            className="px-2 py-1 border rounded text-[9px] hover:border-green-500 focus:border-green-500 focus:outline-none"
            aria-label="Search value for selected field"
          />

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="px-2 py-1 border rounded text-[9px] bg-white hover:border-green-500 focus:border-green-500 focus:outline-none"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>

          {/* Priority Filter */}
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="px-2 py-1 border rounded text-[9px] bg-white hover:border-green-500 focus:border-green-500 focus:outline-none"
            aria-label="Filter by priority"
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Verified / Unverified checkboxes */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                name="verified"
                checked={filters.verified === "true"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    verified: prev.verified === "true" ? "" : "true",
                  }))
                }
                className="scale-75 cursor-pointer"
                aria-label="Show verified cases only"
              />
              Verified
            </label>

            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                name="unverified"
                checked={filters.verified === "false"}
                onChange={() =>
                  setFilters((prev) => ({
                    ...prev,
                    verified: prev.verified === "false" ? "" : "false",
                  }))
                }
                className="scale-75 cursor-pointer"
                aria-label="Show unverified cases only"
              />
              Unverified
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-auto">
          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={exportLoading || filteredCases.length === 0}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700 flex items-center gap-1"
            title="Export to CSV"
          >
            {exportLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white"></div>
            ) : (
              <FaDownload size={12} />
            )}
          </button>

          {/* Reset Filters */}
          <button
            onClick={handleResetFilters}
            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center gap-1"
            title="Reset Filters"
            aria-label="Reset all filters"
          >
            <FiRefreshCcw size={12} />
          </button>

          {/* Delete Selected - Only show for admin */}
          {userRole === 'admin' && (
            <button
              onClick={() => showDeleteConfirmation(selectedCaseIds)}
              disabled={selectedCaseIds.length === 0 || deleteLoading}
              className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50 hover:bg-red-700 flex items-center gap-1"
              title="Delete Selected Cases"
              aria-label={`Delete ${selectedCaseIds.length} selected cases`}
            >
              {deleteLoading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-1 border-white"></div>
              ) : (
                <FiTrash2 size={12} />
              )}
              {selectedCaseIds.length > 0 && `(${selectedCaseIds.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto border border-gray-200 rounded shadow">
        <table className="min-w-full table-fixed border-collapse text-[9px]" aria-label="Cases table">
          <thead>
            <tr className="bg-green-700 text-white sticky top-0">
              {/* Hide select all checkbox for non-admin users */}
              {userRole === 'admin' && (
                <th className="px-1 py-1 w-[2%]">
                  <input
                    type="checkbox"
                    aria-label="Select all cases"
                    checked={selectedCaseIds.length === cases.length && cases.length > 0}
                    onChange={toggleSelectAll}
                    className="scale-75 cursor-pointer"
                  />
                </th>
              )}
              <th className="px-1 py-1 w-[3%]">ID</th>
              <th className="px-2 py-1 w-[8%] text-center">Actions</th>
              <th className="px-1 py-1 w-[5%]">Deposit Type</th>
              <th className="px-1 py-1 w-[6%]">Start Date</th>
              <th className="px-1 py-1 w-[5%]">Duration</th>
              <th className="px-1 py-1 w-[4%]">FD Total</th>
              <th className="px-1 py-1 w-[4%]">FD Rate</th>
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
                <FaFilePdf className="mx-auto text-red-600" aria-label="PDF documents" />
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredCases.length === 0 && !loading ? (
              <tr>
                <td colSpan={userRole === 'admin' ? "20" : "19"} className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">📊</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No cases found</h3>
                  <p className="text-gray-500 text-sm">
                    {Object.values(filters).some(f => f)
                      ? "Try adjusting your filters to see more results."
                      : userRole !== 'admin'
                        ? "You don't have any cases yet."
                        : "Get started by creating your first case."
                    }
                  </p>
                </td>
              </tr>
            ) : (
              filteredCases.map((c, idx) => (
                <React.Fragment key={c.id ?? idx}>
                  <tr
                    className={`cursor-pointer transition-all duration-200 ${getRowBackgroundColor(c.id)}`}
                    onClick={(e) => handleRowClick(c.id, e)}
                  >
                    {/* Hide select checkbox for non-admin users */}
                    {userRole === 'admin' && (
                      <td className="px-1 py-1 text-center">
                        <input
                          type="checkbox"
                          aria-label={`Select case ${c.id}`}
                          checked={selectedCaseIds.includes(c.id)}
                          onChange={(e) => toggleSelectOne(c.id, e)}
                          className="scale-75 cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="px-1 py-1 text-center font-medium">{c.id}</td>
                    <td className="px-2 py-1 text-center">
                      <div className="flex gap-2 justify-center items-center">
                        <button
                          className={`text-green-600 hover:text-green-700 ${(c.payments && c.payments.length > 0) ? '' : 'opacity-30 cursor-not-allowed'
                            }`}
                          onClick={(e) => (c.payments && c.payments.length > 0) && toggleExpandCase(c.id, e)}
                          disabled={!c.payments || c.payments.length === 0}
                          title={
                            (c.payments && c.payments.length > 0)
                              ? `Toggle ${expandedCaseIds.includes(c.id) ? 'Collapse' : 'Expand'} Payments`
                              : 'No payments available'
                          }
                        >
                          <FaPlus
                            size={12}
                            className={expandedCaseIds.includes(c.id) ? 'transform rotate-45 transition-transform' : ''}
                          />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-700"
                          onClick={(e) => handleActionButtonClick('view', c, e)}
                          title="View"
                          aria-label={`View case ${c.id}`}
                        >
                          <FiEye size={12} />
                        </button>
                        {/* Hide edit and delete buttons for non-admin users */}
                        {userRole === 'admin' && (
                          <>
                            <button
                              className="text-blue-600 hover:text-blue-700"
                              onClick={(e) => handleActionButtonClick('edit', c, e)}
                              title="Edit"
                              aria-label={`Edit case ${c.id}`}
                            >
                              <FiEdit size={12} />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-700"
                              onClick={(e) => handleActionButtonClick('delete', c, e)}
                              title="Delete"
                              aria-label={`Delete case ${c.id}`}
                              disabled={deleteLoading}
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-700"
                          onClick={(e) => handleActionButtonClick('print', c, e)}
                          title="Print"
                          aria-label={`Print case ${c.id}`}
                        >
                          <FiPrinter size={12} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-700"
                          onClick={(e) => handleActionButtonClick('more', c, e)}
                          title="More Options"
                          aria-label={`More options for case ${c.id}`}
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
                      {c.verified ?
                        <FaCheck className="text-green-600 mx-auto" size={10} aria-label="Verified" /> :
                        <FaTimes className="text-red-600 mx-auto" size={10} aria-label="Not verified" />
                      }
                    </td>
                    <td className="px-1 py-1 text-center">
                      <span className={`px-1 py-0.5 rounded text-white text-[8px] ${c.status === 'Running' ? 'bg-green-500' :
                        c.status === 'Closed' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-1 py-1 text-center font-semibold">
                      <span className={`px-1 py-0.5 rounded text-white text-[8px] ${getCasePaymentStatus(c) === 'Paid' ? 'bg-green-500' :
                        getCasePaymentStatus(c) === 'Failed' ? 'bg-red-500' :
                          getCasePaymentStatus(c) === 'Partial' ? 'bg-blue-500' :
                            'bg-yellow-500'
                        }`}>
                        {getCasePaymentStatus(c)}
                      </span>
                    </td>
                    <td className="px-1 py-1 text-center">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="px-1 py-1 text-center">{c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : "-"}</td>
                    <td className="px-1 py-1 text-center">
                      {c.documents?.length > 0 ? c.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url || doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mx-0.5 text-red-600 hover:text-blue-800"
                          title={doc.filename || doc.originalname}
                          aria-label={`View document ${doc.filename || doc.originalname}`}
                          onClick={(e) => e.stopPropagation()} // Prevent row click
                        >
                          <FaFilePdf className="inline-block mr-1" size={12} />
                        </a>
                      )) : "N/A"}
                    </td>
                  </tr>

                  {/* Hierarchical payment row */}
                  {expandedCaseIds.includes(c.id) && (
                    <PaymentDetailsRow caseItem={c} />
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredCases.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-[9px]">
          <div>
            Showing{" "}
            <span className="font-medium">{paginationInfo.startIndex}</span>{" "}
            to{" "}
            <span className="font-medium">{paginationInfo.endIndex}</span>{" "}
            of <span className="font-medium">{totalRecords}</span> cases
            {userRole !== 'admin' && (
              <span className="text-gray-600 ml-2">(Your cases)</span>
            )}
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
                className="px-2 py-1 border rounded text-[9px] focus:outline-none focus:border-green-500"
                aria-label="Items per page"
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
              className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Go to first page"
            >
              First
            </button>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Go to previous page"
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
                  className={`px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${pagination.page === p
                    ? "bg-green-800 text-white"
                    : "bg-white border border-gray-300 hover:bg-green-100"
                    }`}
                  aria-label={`Go to page ${p}`}
                  aria-current={pagination.page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === paginationInfo.totalPages}
              className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Go to next page"
            >
              Next
            </button>
            <button
              onClick={() => setPagination({ ...pagination, page: paginationInfo.totalPages })}
              disabled={pagination.page === paginationInfo.totalPages}
              className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Go to last page"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* Notes Section */}
      <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded text-[9px] text-gray-700">
        <h3 className="font-semibold text-green-800 mb-1">Notes:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            You are viewing cases as: <span className="font-medium text-green-700 capitalize">{userRole}</span>
            {userRole !== 'admin' && ' (only your cases)'}
          </li>
          <li>Click anywhere on a row to <span className="font-medium text-blue-700">highlight and select</span> it.</li>
          <li>Use <span className="font-medium text-green-700">Global Search</span> for quick keyword search across all fields.</li>
          <li>Apply specific filters using the dropdowns and checkboxes above.</li>
          <li>Click the <span className="font-medium text-green-700">+ button</span> to view payment details for each case.</li>
          <li>Use the <span className="font-medium text-green-700">Export button</span> to download cases as CSV.</li>
          {userRole === 'admin' && (
            <>
              <li>Select multiple cases using checkboxes for bulk actions.</li>
              <li>Use the <span className="font-medium text-red-700">Delete button</span> to remove individual cases or bulk delete selected cases.</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CaseTable;