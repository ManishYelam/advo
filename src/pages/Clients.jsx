import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { FaPlus, FaCheck, FaTimes, FaArrowLeft, FaDownload, FaSearch } from "react-icons/fa";
import { FiTrash2, FiEdit, FiRefreshCcw, FiEye, FiPrinter, FiMoreVertical, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// Debounce utility for search
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const Clients = ({ 
  fetchClientsApi, 
  onDeleteClient, 
  onEditClient, 
  onView, 
  onPrint, 
  onMore, 
  onAddClient,
  userRole = "admin"
}) => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ 
    globalSearch: "", 
    status: "", 
    verified: "",
    searchField: "",
    searchValue: ""
  });
  const [selectedclient_ids, setSelectedclient_ids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState("");

  const navigate = useNavigate();
  const debouncedSearchRef = React.useRef();

  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      setFilters(prev => ({ ...prev, globalSearch: value }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300);
  }, []);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (fetchClientsApi) {
        const response = await fetchClientsApi({ filters, pagination });
        data = response?.data || [];
        setTotalRecords(response?.totalRecords || data.length);
      } else {
        data = [
          { 
            id: 1, 
            name: "John Doe", 
            email: "john@example.com", 
            phone: "+1 (555) 123-4567", 
            address: "123 Main Street, New York, NY 10001", 
            company: "ABC Corp", 
            createdAt: "2025-01-15T10:30:00Z", 
            status: "Active", 
            verified: true,
            clientSince: "2024-01-15",
            lastActive: "2025-01-10",
            totalCases: 5,
            activeCases: 2
          },
          { 
            id: 2, 
            name: "Jane Smith", 
            email: "jane@example.com", 
            phone: "+1 (555) 987-6543", 
            address: "456 Oak Avenue, Los Angeles, CA 90210", 
            company: "XYZ Ltd", 
            createdAt: "2025-01-10T14:20:00Z", 
            status: "Inactive", 
            verified: false,
            clientSince: "2024-03-20",
            lastActive: "2024-12-15",
            totalCases: 3,
            activeCases: 0
          }
        ];
        setTotalRecords(data.length);
      }
      setClients(data);
    } catch (err) {
      setError(`Failed to fetch clients: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, fetchClientsApi]);

  useEffect(() => { 
    fetchClients(); 
  }, [fetchClients]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "globalSearch") {
      debouncedSearchRef.current(value);
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
      setPagination(prev => ({ ...prev, page: 1 }));
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesGlobalSearch = !filters.globalSearch || 
        Object.values(client).some(val => 
          val?.toString().toLowerCase().includes(filters.globalSearch.toLowerCase())
        );
      const matchesStatus = !filters.status || client.status === filters.status;
      const matchesVerified = filters.verified === "" || 
        (filters.verified === "true" && client.verified) || 
        (filters.verified === "false" && !client.verified);
      const matchesFieldSearch = !filters.searchField || !filters.searchValue ||
        client[filters.searchField]?.toString().toLowerCase().includes(filters.searchValue.toLowerCase());

      return matchesGlobalSearch && matchesStatus && matchesVerified && matchesFieldSearch;
    });
  }, [clients, filters]);

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedclient_ids(filteredClients.map(c => c.id));
    } else {
      setSelectedclient_ids([]);
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedclient_ids(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleBulkAction = () => {
    if (bulkAction && selectedclient_ids.length > 0) {
      switch (bulkAction) {
        case "delete":
          if (window.confirm(`Delete ${selectedclient_ids.length} client(s)?`)) {
            onDeleteClient?.(selectedclient_ids);
            setSelectedclient_ids([]);
          }
          break;
        case "export":
          handleExport();
          break;
        default:
          break;
      }
      setBulkAction("");
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const csvHeaders = ['ID', 'Name', 'Email', 'Phone', 'Company', 'Status', 'Verified', 'Client Since', 'Total Cases', 'Active Cases'].join(',');
      const csvRows = filteredClients.map(client => [
        client.id,
        `"${client.name}"`,
        client.email,
        client.phone,
        `"${client.company}"`,
        client.status,
        client.verified ? 'Yes' : 'No',
        client.clientSince ? new Date(client.clientSince).toLocaleDateString() : '-',
        client.totalCases || 0,
        client.activeCases || 0
      ].join(','));
      const csvContent = [csvHeaders, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `clients-${new Date().toISOString().split('T')[0]}.csv`);
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

  const handleResetFilters = () => {
    setFilters({ globalSearch: "", status: "", verified: "", searchField: "", searchValue: "" });
    setPagination({ page: 1, limit: 10 });
    setSelectedclient_ids([]);
  };

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

  const canEditDelete = userRole === "admin";
  const canAddClients = userRole === "admin" || userRole === "advocate";

  return (
    <DashboardLayout>
      <div className="m-3 min-h-screen bg-gray-50 rounded-lg p-3">
        {/* Header - Compact */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 rounded hover:bg-gray-200 transition-colors duration-200 text-gray-600"
              title="Go back"
            >
              <FaArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">Clients</h1>
              <p className="text-gray-600 text-xs">
                Manage client relationships
              </p>
            </div>
          </div>
          
          {canAddClients && (
            <button
              onClick={onAddClient}
              className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200 flex items-center gap-1 font-medium"
            >
              <FiUserPlus size={12} />
              Add Client
            </button>
          )}
        </div>

        {/* Stats Overview - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-gray-800">{totalRecords}</div>
            <div className="text-gray-600 text-xs">Total</div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-green-600">
              {clients.filter(c => c.status === "Active").length}
            </div>
            <div className="text-gray-600 text-xs">Active</div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-blue-600">
              {clients.filter(c => c.verified).length}
            </div>
            <div className="text-gray-600 text-xs">Verified</div>
          </div>
          <div className="bg-white p-2 rounded shadow-sm border text-center">
            <div className="text-lg font-bold text-orange-600">
              {clients.reduce((sum, client) => sum + (client.activeCases || 0), 0)}
            </div>
            <div className="text-gray-600 text-xs">Active Cases</div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs mb-3 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <FaTimes size={12} />
            </button>
          </div>
        )}

        {/* Filters and Actions - Left & Right Aligned */}
        <div className="bg-white p-3 rounded shadow-sm border mb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Filters - Left Side */}
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Global Search */}
              <div className="relative">
                <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={12} />
                <input
                  type="text"
                  name="globalSearch"
                  value={filters.globalSearch}
                  onChange={handleFilterChange}
                  placeholder="Search clients..."
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-48"
                />
              </div>

              {/* Field Search */}
              <select
                name="searchField"
                value={filters.searchField}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
              >
                <option value="">Search Field</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="company">Company</option>
                <option value="phone">Phone</option>
              </select>

              <input
                type="text"
                name="searchValue"
                value={filters.searchValue}
                onChange={handleFilterChange}
                placeholder="Search value..."
                disabled={!filters.searchField}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32 disabled:bg-gray-100"
              />

              {/* Status & Verified */}
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-28"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <select
                name="verified"
                value={filters.verified}
                onChange={handleFilterChange}
                className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-32"
              >
                <option value="">All Clients</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>

              {/* Bulk Actions */}
              {canEditDelete && selectedclient_ids.length > 0 && (
                <div className="flex items-center gap-1">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500 w-28"
                  >
                    <option value="">Bulk Actions</option>
                    <option value="delete">Delete</option>
                    <option value="export">Export</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="px-2 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Apply
                  </button>
                  <span className="text-xs text-gray-600 ml-1">
                    ({selectedclient_ids.length})
                  </span>
                </div>
              )}
            </div>

            {/* Actions - Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors duration-200 flex items-center gap-1"
              >
                <FiRefreshCcw size={12} />
                Reset
              </button>

              <button
                onClick={handleExport}
                disabled={exportLoading || filteredClients.length === 0}
                className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-1"
              >
                {exportLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  <FaDownload size={12} />
                )}
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table - Compact */}
        <div className="bg-white rounded shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-green-700 text-white">
                <tr>
                  {canEditDelete && (
                    <th className="px-2 py-2 text-left w-8">
                      <input
                        type="checkbox"
                        checked={selectedclient_ids.length === filteredClients.length && filteredClients.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500 scale-90"
                      />
                    </th>
                  )}
                  <th className="px-2 py-2 text-left">Client</th>
                  <th className="px-2 py-2 text-left">Contact</th>
                  <th className="px-2 py-2 text-center">Cases</th>
                  <th className="px-2 py-2 text-center">Status</th>
                  <th className="px-2 py-2 text-center">Verified</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={canEditDelete ? 7 : 6} className="px-2 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                        <span className="text-gray-600 text-xs">Loading clients...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={canEditDelete ? 7 : 6} className="px-2 py-6 text-center">
                      <div className="text-gray-400 text-2xl mb-1">👥</div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No clients found</h3>
                      <p className="text-gray-500 text-xs">
                        {Object.values(filters).some(f => f) 
                          ? "Adjust filters to see results" 
                          : "Add your first client"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      {canEditDelete && (
                        <td className="px-2 py-2">
                          <input
                            type="checkbox"
                            checked={selectedclient_ids.includes(client.id)}
                            onChange={() => toggleSelectOne(client.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500 scale-90"
                          />
                        </td>
                      )}
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-800 font-semibold text-xs">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 text-xs truncate">{client.name}</div>
                            <div className="text-gray-500 text-xs truncate">{client.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="space-y-0.5">
                          <div className="text-gray-900 text-xs truncate">{client.email}</div>
                          <div className="text-gray-600 text-xs">{client.phone}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div>
                          <div className="text-sm font-bold text-gray-900">{client.totalCases || 0}</div>
                          <div className="text-xs">
                            <span className={`px-1.5 py-0.5 rounded-full ${
                              (client.activeCases || 0) > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {client.activeCases || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          client.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        {client.verified ? (
                          <FaCheck className="text-green-600 mx-auto" size={12} />
                        ) : (
                          <FaTimes className="text-red-600 mx-auto" size={12} />
                        )}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => onView?.(client)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                            title="View"
                          >
                            <FiEye size={12} />
                          </button>
                          {canEditDelete && (
                            <button
                              onClick={() => onEditClient?.(client)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                              title="Edit"
                            >
                              <FiEdit size={12} />
                            </button>
                          )}
                          <button
                            onClick={() => onPrint?.(client)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                            title="Print"
                          >
                            <FiPrinter size={12} />
                          </button>
                          <button
                            onClick={() => onMore?.(client)}
                            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                            title="More"
                          >
                            <FiMoreVertical size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact Pagination */}
        {filteredClients.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2">
            <div className="text-xs text-gray-600">
              Showing <span className="font-semibold">{paginationInfo.startIndex}</span> to{" "}
              <span className="font-semibold">{paginationInfo.endIndex}</span> of{" "}
              <span className="font-semibold">{totalRecords}</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1 text-xs">
                <span>Show</span>
                <select
                  value={pagination.limit}
                  onChange={(e) =>
                    setPagination(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))
                  }
                  className="px-1 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-green-500 focus:border-green-500"
                >
                  {[5, 10, 20, 50].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
                  disabled={pagination.page === 1}
                  className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                >
                  First
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                >
                  Prev
                </button>

                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="px-1 py-1 text-gray-500 text-xs">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setPagination(prev => ({ ...prev, page }))}
                      className={`px-2 py-1 border rounded text-xs ${
                        pagination.page === page
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === paginationInfo.totalPages}
                  className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: paginationInfo.totalPages }))}
                  disabled={pagination.page === paginationInfo.totalPages}
                  className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-50 hover:bg-gray-50"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compact Help Section */}
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs">
          <h3 className="font-semibold text-blue-800 mb-1">💡 Quick Tips</h3>
          <ul className="text-blue-700 space-y-0.5 list-disc list-inside">
            <li>Use search and filters to find clients</li>
            <li>Select multiple clients for bulk actions</li>
            {canAddClients && <li>Add new clients with the Add Client button</li>}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;