import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FaCheck, FaTimes, FaArrowLeft, FaDownload, FaSearch,
  FaEye, FaPowerOff, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaUser
} from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getAllUser } from "../services/applicationService";
import { getClientById, updateClientstatus } from "../services/clientsService";

// ---------- Debounce utilities ----------
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

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// ---------- Modal Component ----------
const ClientDetailsModal = ({ isOpen, onClose, client, loading }) => {
  if (!isOpen) return null;

  const getField = (field, fallback = "N/A") => {
    if (!client) return fallback;
    const mappings = {
      full_name: ["full_name", "fullName", "name"],
      phone_number: ["phone_number", "phone", "mobile"],
      reg_type: ["reg_type", "regType", "registrationType"],
      isVerified: ["isVerified", "verified", "email_verified"],
    };
    if (mappings[field]) {
      for (let key of mappings[field]) {
        if (client[key] !== undefined && client[key] !== null) return client[key];
      }
      return fallback;
    }
    return client[field] !== undefined ? client[field] : fallback;
  };

  const status = getField("status", "").toLowerCase();
  const isActive = status === "active";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Client Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            </div>
          ) : client ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FaUser className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{getField("full_name")}</h3>
                    <p className="text-sm text-gray-500">Client ID: #{client.id || "N/A"}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-600">{getField("email")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-600">{getField("phone_number")}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <FaMapMarkerAlt className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-600">{getField("address", "No address provided")}</span>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Personal Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Full Name</p><p className="text-sm text-gray-800">{getField("full_name")}</p></div>
                  <div><p className="text-xs text-gray-500">Date of Birth</p><p className="text-sm text-gray-800">{client.date_of_birth ? new Date(client.date_of_birth).toLocaleDateString() : "N/A"}</p></div>
                  <div><p className="text-xs text-gray-500">Gender</p><p className="text-sm text-gray-800">{getField("gender")}</p></div>
                  <div><p className="text-xs text-gray-500">Age</p><p className="text-sm text-gray-800">{client.age || "N/A"}</p></div>
                  <div><p className="text-xs text-gray-500">Aadhar Number</p><p className="text-sm text-gray-800">{client.adhar_number || "N/A"}</p></div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Occupation</p><p className="text-sm text-gray-800">{getField("occupation")}</p></div>
                  <div><p className="text-xs text-gray-500">Registration Type</p><p className="text-sm text-gray-800">{getField("reg_type", "Manual")}</p></div>
                  <div><p className="text-xs text-gray-500">Verified</p><p className="text-sm text-gray-800">{getField("isVerified") ? "Yes" : "No"}</p></div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><p className="text-xs text-gray-500">Account Created</p><p className="text-sm text-gray-800">{client.createdAt ? new Date(client.createdAt).toLocaleDateString() : "N/A"}</p></div>
                  <div><p className="text-xs text-gray-500">Last Login</p><p className="text-sm text-gray-800">{client.last_login_at ? new Date(client.last_login_at).toLocaleString() : "N/A"}</p></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">No client data available</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---------- Main Clients Component ----------
const Clients = ({ userRole = "admin" }) => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    globalSearch: "",
    status: "",
    verified: "",
    regType: "",
    searchField: "",
    searchValue: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalRecords, setTotalRecords] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const navigate = useNavigate();
  const debouncedSearchRef = React.useRef();
  const debouncedGlobalSearch = useDebounce(filters.globalSearch, 500);

  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      setFilters((prev) => ({ ...prev, globalSearch: value }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 300);
  }, []);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const requestData = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedGlobalSearch || "",
        searchFields: filters.searchField ? [filters.searchField] : [],
        ...(filters.status && { status: filters.status.toLowerCase() }),
        ...(filters.verified && { isVerified: filters.verified }),
        ...(filters.regType && { reg_type: filters.regType }),
        role: "client",
      };

      if (filters.searchField && filters.searchValue) {
        requestData.search = filters.searchValue;
        requestData.searchFields = [filters.searchField];
      }

      const response = await getAllUser(requestData);
      const users = response.data?.data || [];
      const transformedData = users.map((user) => ({
        id: user.id,
        name: user.full_name,
        email: user.email,
        phone: user.phone_number,
        address: user.address,
        company: user.occupation || "N/A",
        createdAt: user.createdAt,
        status: user.status === "active" ? "Active" : "Inactive",
        verified: user.isVerified,
        regType: user.reg_type || "Manual",
        clientSince: user.createdAt,
        lastActive: user.last_login_at || user.createdAt,
        totalCases: 0,
        activeCases: 0,
        role: user.role,
        dateOfBirth: user.date_of_birth,
        gender: user.gender,
        age: user.age,
        adharNumber: user.adhar_number,
        isVerified: user.isVerified,
        lastLoginAt: user.last_login_at,
      }));

      setClients(transformedData);
      setTotalRecords(response.data?.totalRecords || transformedData.length);
    } catch (err) {
      setError(`Failed to fetch clients: ${err.message}`);
      // Fallback mock data for development
      const fallbackData = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main Street, New York, NY 10001",
          company: "ABC Corp",
          createdAt: "2024-01-15T10:30:00Z",
          status: "Active",
          verified: true,
          regType: "Manual",
          clientSince: "2024-01-15",
          lastActive: "2024-01-10",
          totalCases: 5,
          activeCases: 2,
        },
      ];
      setClients(fallbackData);
      setTotalRecords(fallbackData.length);
    } finally {
      setLoading(false);
    }
  }, [debouncedGlobalSearch, filters, pagination]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "globalSearch") {
      debouncedSearchRef.current(value);
    } else if (name === "searchField") {
      setFilters((prev) => ({
        ...prev,
        searchField: value,
        searchValue: "",
      }));
    } else {
      setFilters((prev) => ({ ...prev, [name]: value }));
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesGlobalSearch =
        !filters.globalSearch ||
        Object.values(client).some((val) =>
          val?.toString().toLowerCase().includes(filters.globalSearch.toLowerCase())
        );
      const matchesStatus = !filters.status || client.status === filters.status;
      const matchesVerified =
        filters.verified === "" ||
        (filters.verified === "true" && client.verified) ||
        (filters.verified === "false" && !client.verified);
      const matchesRegType = !filters.regType || client.regType === filters.regType;
      const matchesFieldSearch =
        !filters.searchField ||
        !filters.searchValue ||
        client[filters.searchField]?.toString().toLowerCase().includes(filters.searchValue.toLowerCase());

      return (
        matchesGlobalSearch &&
        matchesStatus &&
        matchesVerified &&
        matchesRegType &&
        matchesFieldSearch
      );
    });
  }, [clients, filters]);

  const handleToggleStatus = async (client) => {
    setToggleLoading(client.id);
    try {
      const newStatus = client.status === "Active" ? "inactive" : "active";
      await updateClientstatus(client.id, { status: newStatus });
      await fetchClients();
      setError(`${client.name}'s status updated to ${newStatus}`);
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setToggleLoading(null);
    }
  };

  const handleViewClient = async (client, e) => {
    e.stopPropagation();
    setViewLoading(true);
    try {
      const response = await getClientById(client.id);
      const clientData = response.data?.user || response.data;
      setSelectedClient(clientData);
      setIsModalOpen(true);
    } catch (err) {
      setError(`Failed to load client details: ${err.message}`);
    } finally {
      setViewLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const csvHeaders = [
        "ID", "Name", "Email", "Phone", "Company", "Registration Type",
        "Status", "Verified", "Client Since", "Total Cases", "Active Cases",
      ].join(",");
      const csvRows = filteredClients.map((client) =>
        [
          client.id,
          `"${client.name}"`,
          client.email,
          client.phone,
          `"${client.company}"`,
          client.regType,
          client.status,
          client.verified ? "Yes" : "No",
          client.clientSince ? new Date(client.clientSince).toLocaleDateString() : "-",
          client.totalCases || 0,
          client.activeCases || 0,
        ].join(",")
      );
      const csvContent = [csvHeaders, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `clients-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
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
    setFilters({
      globalSearch: "",
      status: "",
      verified: "",
      regType: "",
      searchField: "",
      searchValue: "",
    });
    setPagination({ page: 1, limit: 10 });
  };

  const handleRowClick = useCallback((clientId, e) => {
    if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT" ||
        e.target.closest("button") || e.target.closest("input")) {
      return;
    }
    setSelectedRowId((prev) => (clientId === prev ? null : clientId));
  }, []);

  const getRowBackgroundColor = useCallback(
    (clientId) =>
      clientId === selectedRowId
        ? "bg-blue-200 border-l-4 border-blue-500"
        : "bg-white hover:bg-pink-100",
    [selectedRowId]
  );

  const paginationInfo = useMemo(
    () => ({
      totalPages: Math.ceil(totalRecords / pagination.limit),
      startIndex: (pagination.page - 1) * pagination.limit + 1,
      endIndex: Math.min(pagination.page * pagination.limit, totalRecords),
    }),
    [pagination, totalRecords]
  );

  const getPageNumbers = useCallback(() => {
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
  }, [paginationInfo, pagination.page]);

  const canToggleStatus = userRole === "admin";

  const searchFieldOptions = [
    { value: "full_name", label: "Name" },
    { value: "email", label: "Email" },
    { value: "occupation", label: "Company" },
    { value: "phone_number", label: "Phone" },
    { value: "reg_type", label: "Registration Type" },
    { value: "adhar_number", label: "Aadhar Number" },
  ];

  return (
    <DashboardLayout>
      <div className="m-3 min-h-screen bg-gray-50 rounded-lg p-3">
        {/* Modal */}
        <ClientDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          client={selectedClient}
          loading={viewLoading}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="p-1.5 rounded hover:bg-gray-200 text-gray-600" title="Go back">
              <FaArrowLeft size={14} />
            </button>
            <h1 className="text-lg font-bold text-gray-800">Clients</h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`px-3 py-2 rounded mb-3 ${error.includes("successfully") ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
            {error}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600" />
            <span className="ml-2">Loading clients...</span>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white p-3 rounded shadow-sm border">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={10} />
                <input
                  type="text"
                  name="globalSearch"
                  value={filters.globalSearch}
                  onChange={handleFilterChange}
                  placeholder="Search clients..."
                  className="pl-7 pr-2 py-1 border rounded text-xs w-44 h-[28px] focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <select
                name="searchField"
                value={filters.searchField}
                onChange={handleFilterChange}
                className="px-2 py-1 border rounded text-xs w-28 h-[28px] focus:ring-1 focus:ring-green-500"
              >
                <option value="">Search Field</option>
                {searchFieldOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <input
                type="text"
                name="searchValue"
                value={filters.searchValue}
                onChange={handleFilterChange}
                placeholder="Search value..."
                disabled={!filters.searchField}
                className="px-2 py-1 border rounded text-xs w-28 h-[28px] disabled:bg-gray-100 focus:ring-1 focus:ring-green-500"
              />
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="px-2 py-1 border rounded text-xs w-24 h-[28px]"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                name="verified"
                value={filters.verified}
                onChange={handleFilterChange}
                className="px-2 py-1 border rounded text-xs w-28 h-[28px]"
              >
                <option value="">All Clients</option>
                <option value="true">Verified Only</option>
                <option value="false">Unverified Only</option>
              </select>
              <select
                name="regType"
                value={filters.regType}
                onChange={handleFilterChange}
                className="px-2 py-1 border rounded text-xs w-28 h-[28px]"
              >
                <option value="">All Types</option>
                <option value="manual">Manual</option>
                <option value="reg_link">Reg Link</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleResetFilters} className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 flex items-center gap-1 h-[28px]">
                <FiRefreshCcw size={10} /> Reset
              </button>
              <button onClick={handleExport} disabled={exportLoading || filteredClients.length === 0}
                className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1 h-[28px]">
                {exportLoading ? <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white" /> : <FaDownload size={10} />}
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="px-2 py-2 text-left">Client</th>
                  <th className="px-2 py-2 text-left">Contact</th>
                  <th className="px-2 py-2 text-center">Cases</th>
                  <th className="px-2 py-2 text-center">Reg Type</th>
                  <th className="px-2 py-2 text-center">Status</th>
                  <th className="px-2 py-2 text-center">Verified</th>
                  <th className="px-2 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-4 text-center">Loading clients...</td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-6 text-center">
                      <div className="text-gray-400 text-2xl mb-1">👥</div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">No clients found</h3>
                      <p className="text-gray-500 text-xs">
                        {Object.values(filters).some((f) => f) ? "Adjust filters to see results" : "Add your first client"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className={`cursor-pointer transition-all ${getRowBackgroundColor(client.id)}`}
                      onClick={(e) => handleRowClick(client.id, e)}
                    >
                      <td className="px-2 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-800 font-semibold text-xs">
                              {client.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 truncate max-w-[120px]">{client.name}</div>
                            <div className="text-gray-500 text-xs truncate max-w-[120px]">{client.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        <div className="space-y-0.5">
                          <div className="text-gray-900 truncate max-w-[150px]">{client.email}</div>
                          <div className="text-gray-600">{client.phone}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <div className="font-bold text-gray-900">{client.totalCases || 0}</div>
                        <div className="text-xs">
                          <span className={`px-1.5 py-0.5 rounded-full ${(client.activeCases || 0) > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {client.activeCases || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${client.regType === "Manual" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
                          {client.regType}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${client.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        {client.verified ? <FaCheck className="text-green-600 mx-auto" size={12} /> : <FaTimes className="text-red-600 mx-auto" size={12} />}
                      </td>
                      <td className="px-2 py-2">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={(e) => handleViewClient(client, e)}
                            disabled={viewLoading}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="View"
                          >
                            {viewLoading ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" /> : <FaEye size={12} />}
                          </button>
                          {canToggleStatus && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleStatus(client); }}
                              disabled={toggleLoading === client.id}
                              className={`p-1 rounded ${client.status === "Active" ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"} disabled:opacity-50`}
                              title={client.status === "Active" ? "Deactivate" : "Activate"}
                            >
                              {toggleLoading === client.id ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" /> : <FaPowerOff size={12} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredClients.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-xs">
            <div>
              Showing {paginationInfo.startIndex} to {paginationInfo.endIndex} of {totalRecords} clients
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <div className="flex items-center gap-1">
                <span>Show</span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setPagination((prev) => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
                  className="px-2 py-1 border rounded text-xs"
                >
                  {[5, 10, 20, 50].map((num) => <option key={num} value={num}>{num}</option>)}
                </select>
                <span>per page</span>
              </div>
              <button onClick={() => setPagination({ ...pagination, page: 1 })} disabled={pagination.page === 1} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50">First</button>
              <button onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50">Prev</button>
              {getPageNumbers().map((p, i) =>
                p === "..." ? <span key={i} className="px-2 py-1 text-gray-500">...</span> : (
                  <button
                    key={i}
                    onClick={() => setPagination({ ...pagination, page: p })}
                    className={`px-2 py-1 rounded ${pagination.page === p ? "bg-green-800 text-white" : "bg-white border border-gray-300 hover:bg-green-100"}`}
                  >
                    {p}
                  </button>
                )
              )}
              <button onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} disabled={pagination.page === paginationInfo.totalPages} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50">Next</button>
              <button onClick={() => setPagination({ ...pagination, page: paginationInfo.totalPages })} disabled={pagination.page === paginationInfo.totalPages} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50">Last</button>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2 text-xs">
          <h3 className="font-semibold text-blue-800 mb-1">💡 Quick Tips</h3>
          <ul className="text-blue-700 space-y-0.5 list-disc list-inside">
            <li>Use search and filters to find clients</li>
            <li>Click <strong>View</strong> to see client details in a modal</li>
            <li>Toggle <strong>Active/Inactive</strong> to manage client status</li>
            <li>Click anywhere on a row to highlight and select it</li>
            <li>Use the <strong>Export</strong> button to download clients as CSV</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;