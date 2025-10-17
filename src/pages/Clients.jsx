import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/Button";
import { FaPlus, FaCheck, FaTimes, FaArrowLeft } from "react-icons/fa";
import { FiTrash2, FiEdit, FiRefreshCcw, FiEye, FiPrinter, FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // optional if using react-router

const Clients = ({ fetchClientsApi, onDeleteClient, onEditClient, onView, onPrint, onMore }) => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ globalSearch: "", status: "", verified: "" });
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });
  const [totalRecords, setTotalRecords] = useState(0);

  const navigate = useNavigate(); // optional: for back navigation

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = fetchClientsApi ? await fetchClientsApi({ filters, pagination }) : null;
      const data = response?.data || [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", address: "123 Street", company: "ABC Corp", createdAt: "2025-10-17", status: "Active", verified: true },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321", address: "456 Avenue", company: "XYZ Ltd", createdAt: "2025-10-15", status: "Inactive", verified: false },
      ];
      setClients(data);
      setTotalRecords(response?.totalRecords || data.length);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, [filters, pagination]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const toggleSelectAll = (e) => {
    e.target.checked ? setSelectedClientIds(clients.map(c => c.id)) : setSelectedClientIds([]);
  };

  const toggleSelectOne = (id) => {
    setSelectedClientIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const filteredClients = clients.filter(c => {
    const matchesSearch = !filters.globalSearch || c.name.toLowerCase().includes(filters.globalSearch.toLowerCase());
    const matchesStatus = !filters.status || c.status === filters.status;
    const matchesVerified = filters.verified === "" || (filters.verified === "true" && c.verified) || (filters.verified === "false" && !c.verified);
    return matchesSearch && matchesStatus && matchesVerified;
  });

  const totalPages = Math.ceil(totalRecords / pagination.limit);

  return (
    <DashboardLayout>
      <div className="m-[10px]">
        {/* Header with Back button */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)} // go back in history
              className="px-2 py-1 rounded hover:bg-gray-300 flex items-center gap-1"
            >
              <FaArrowLeft size={12} />
            </button>
            <h1 className="font-bold">Clients</h1>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
          <div className="flex flex-wrap gap-2">
            <input type="text" name="globalSearch" value={filters.globalSearch} onChange={handleFilterChange} placeholder="Global Search..." className="px-2 py-1 border rounded text-sm" />
            <select name="status" value={filters.status} onChange={handleFilterChange} className="px-2 py-1 border rounded text-sm">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select name="verified" value={filters.verified} onChange={handleFilterChange} className="px-2 py-1 border rounded text-sm">
              <option value="">All</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setFilters({ globalSearch: "", status: "", verified: "" }); setPagination({ page: 1, limit: 10 }); }} className="px-3 py-1 bg-yellow-500 text-white rounded flex items-center gap-1">
              <FiRefreshCcw size={14} />
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded flex items-center gap-1"><FaPlus size={14} /></button>
            <button onClick={() => onDeleteClient && onDeleteClient(selectedClientIds)} disabled={selectedClientIds.length === 0} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50 flex items-center gap-1">
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded shadow">
          <table className="min-w-full text-[12px]">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-2 py-1 text-center w-4">
                  <input type="checkbox" checked={selectedClientIds.length === filteredClients.length && filteredClients.length > 0} onChange={toggleSelectAll} className="scale-75" />
                </th>
                <th className="px-2 py-1 text-center w-[10%]">Actions</th>
                <th className="px-2 py-1 text-center">Name</th>
                <th className="px-2 py-1 text-center">Email</th>
                <th className="px-2 py-1 text-center">Phone</th>
                <th className="px-2 py-1 text-center">Address</th>
                <th className="px-2 py-1 text-center">Company</th>
                <th className="px-2 py-1 text-center">Created At</th>
                <th className="px-2 py-1 text-center">Verified</th>
                <th className="px-2 py-1 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              {loading ? (
                <tr><td colSpan="10" className="py-4">Loading...</td></tr>
              ) : filteredClients.length === 0 ? (
                <tr><td colSpan="10" className="py-4 text-gray-500">No clients found.</td></tr>
              ) : (
                filteredClients.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-2 py-1"><input type="checkbox" checked={selectedClientIds.includes(c.id)} onChange={() => toggleSelectOne(c.id)} className="scale-75" /></td>
                    <td className="px-2 py-1">
                      <div className="flex gap-2 justify-center items-center">
                        <button className="text-green-600 hover:text-green-700" onClick={() => onView && onView(c)} title="View"><FiEye size={14} /></button>
                        <button className="text-blue-600 hover:text-blue-700" onClick={() => onEditClient && onEditClient(c)} title="Edit"><FiEdit size={14} /></button>
                        <button className="text-gray-600 hover:text-gray-700" onClick={() => onPrint && onPrint(c)} title="Print"><FiPrinter size={14} /></button>
                        <button className="text-gray-600 hover:text-gray-700" onClick={() => onMore && onMore(c)} title="More Options"><FiMoreVertical size={14} /></button>
                      </div>
                    </td>
                    <td className="px-2 py-1">{c.name}</td>
                    <td className="px-2 py-1">{c.email}</td>
                    <td className="px-2 py-1">{c.phone}</td>
                    <td className="px-2 py-1">{c.address || "-"}</td>
                    <td className="px-2 py-1">{c.company || "-"}</td>
                    <td className="px-2 py-1">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="px-2 py-1">{c.verified ? <FaCheck className="text-green-600 mx-auto" /> : <FaTimes className="text-red-600 mx-auto" />}</td>
                    <td className="px-2 py-1">{c.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-3 gap-2 text-[10px]">
          <div>
            Showing{" "}
            <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>{" "}
            to <span className="font-medium">{Math.min(pagination.page * pagination.limit, totalRecords)}</span>{" "}
            of <span className="font-medium">{totalRecords}</span> clients
          </div>

          <div className="flex items-center gap-1 flex-wrap">
            <div className="flex items-center gap-1 ml-2">
              <span>Show</span>
              <select
                value={pagination.limit}
                onChange={(e) =>
                  setPagination((prev) => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))
                }
                className="px-2 py-1 border rounded text-[10px]"
              >
                {[5, 10, 20, 50].map((num) => <option key={num} value={num}>{num}</option>)}
              </select>
              <span>per page</span>
            </div>

            <button onClick={() => setPagination({ ...pagination, page: 1 })} disabled={pagination.page === 1} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700">First</button>
            <button onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })} disabled={pagination.page === 1} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700">Prev</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              if (p === 1 || p === totalPages || Math.abs(p - pagination.page) <= 1) {
                return (
                  <button key={p} onClick={() => setPagination({ ...pagination, page: p })} className={`px-2 py-1 rounded ${pagination.page === p ? "bg-green-800 text-white" : "bg-white border border-gray-300 hover:bg-green-100"}`}>
                    {p}
                  </button>
                );
              } else if ((p === 2 && pagination.page > 3) || (p === totalPages - 1 && pagination.page < totalPages - 2)) {
                return <span key={p} className="px-2 py-1 text-gray-500">...</span>;
              } else {
                return null;
              }
            })}

            <button onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })} disabled={pagination.page === totalPages} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700">Next</button>
            <button onClick={() => setPagination({ ...pagination, page: totalPages })} disabled={pagination.page === totalPages} className="px-2 py-1 bg-green-600 text-white rounded disabled:opacity-50 hover:bg-green-700">Last</button>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-4 bg-green-50 border border-green-200 p-3 rounded text-sm text-gray-700">
          <h3 className="font-semibold text-green-800 mb-1">Notes:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Use Global Search to quickly find clients.</li>
            <li>Filters allow narrowing by Status or Verified.</li>
            <li>Reset clears filters and pagination.</li>
            <li>Verified and Unverified selections are mutually exclusive.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
