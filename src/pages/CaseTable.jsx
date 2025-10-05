import React, { useState } from "react";
import { FiEdit, FiEye, FiPrinter, FiMoreVertical, FiTrash2 } from "react-icons/fi";

const CaseTable = ({ cases, onEdit, onView, onPrint, onMore }) => {
  const [filters, setFilters] = useState({
    id: "",
    caseNumber: "",
    title: "",
    caseType: "",
    status: "",
    courtName: "",
    nextHearingDate: "",
    filingDate: "",
    fees: "",
    paymentStatus: "",
    caseOutcome: "",
    courtAddress: "",
  });

  const [selectedCaseIds, setSelectedCaseIds] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCases = cases.filter((c) => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (!filterValue) return true;

      const caseValue = c[key];
      if (!caseValue) return false;

      if (key === "nextHearingDate" || key === "filingDate") {
        const dateStr = caseValue ? new Date(caseValue).toLocaleDateString() : "";
        return dateStr.toLowerCase().includes(filterValue.toLowerCase());
      }

      if (key === "fees") {
        return caseValue.toString().includes(filterValue);
      }

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

  const deleteSelected = () => {
    if (selectedCaseIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedCaseIds.length} case(s)?`)) {
      // Here you can add your delete logic, e.g., call a prop function to delete cases from parent
      // For demo, we'll just clear selection
      alert("Delete action triggered for IDs: " + selectedCaseIds.join(", "));
      setSelectedCaseIds([]);
    }
  };

  return (
    <div className="mx-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800 mt-2">Cases</h4>
        <button
          onClick={deleteSelected}
          disabled={selectedCaseIds.length === 0}
          title="Delete Selected Cases"
          className={`flex items-center gap-1 px-3 py-1 text-sm rounded
    ${selectedCaseIds.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            }`}
          style={{
            boxShadow: selectedCaseIds.length === 0
              ? 'none'
              : '0 4px 6px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
            transition: 'all 0.2s ease-in-out',
          }}
          type="button"
        >
          <FiTrash2 size={10} />
        </button>

      </div>

      <div className="border border-gray-200 rounded-lg shadow-md overflow-x-auto">
        <table
          className="min-w-full w-full border-collapse text-[8px] table-fixed"
          style={{ tableLayout: "fixed" }}
        >
          <thead>
            <tr
              className="bg-gradient-to-r from-green-700 to-green-500 text-white sticky top-0 z-10"
              style={{ fontSize: "8px" }}
            >
              <th className="px-2 py-2 w-[2%]">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={
                    filteredCases.length > 0 &&
                    selectedCaseIds.length === filteredCases.length
                  }
                  aria-label="Select All Cases"
                  className="scale-75 cursor-pointer"
                />
              </th>
              <th className="px-2 py-2 w-[4%]">ID</th>
              <th className="px-2 py-2 w-[6%]">Actions</th>
              <th className="px-2 py-2 w-[8%]">Case Number</th>
              <th className="px-2 py-2 w-[15%]">Case Name</th>
              <th className="px-2 py-2 w-[10%]">Case Type</th>
              <th className="px-2 py-2 w-[7%]">Status</th>
              <th className="px-2 py-2 w-[12%]">Court</th>
              <th className="px-2 py-2 w-[8%]">Next Hearing</th>
              <th className="px-2 py-2 w-[8%]">Filing Date</th>
              <th className="px-2 py-2 w-[5%]">Fees</th>
              <th className="px-2 py-2 w-[8%]">Payment Status</th>
              <th className="px-2 py-2 w-[8%]">Outcome</th>
              <th className="px-2 py-2 w-[12%]">Court Address</th>
              <th className="px-2 py-2 w-[6%]">Documents</th>
              <th className="px-2 py-2 w-[6%]">Shared Docs</th>
            </tr>

            {/* Filter Inputs */}
            <tr
              className="bg-gray-100 sticky top-[37px] z-10"
              style={{ fontSize: "8px" }}
            >
              <th className="px-1 py-1 w-[3%]"></th>
              <th className="px-1 py-1 w-[4%]">
                <input
                  type="text"
                  name="id"
                  value={filters.id}
                  onChange={handleFilterChange}
                  placeholder="ID"
                  className="w-full text-[8px] px-1 border rounded"
                />
              </th>
              <th className="px-1 py-1 w-[6%]"></th>
              {[
                "caseNumber",
                "title",
                "caseType",
                "status",
                "courtName",
                "nextHearingDate",
                "filingDate",
                "fees",
                "paymentStatus",
                "caseOutcome",
                "courtAddress",
                "",
                "",
              ].map((field, index) => (
                <th key={index} className={`px-1 py-1`}>
                  {field ? (
                    <input
                      type="text"
                      name={field}
                      value={filters[field]}
                      onChange={handleFilterChange}
                      placeholder={
                        field === "caseNumber"
                          ? "Case #"
                          : field === "title"
                            ? "Case Name"
                            : field === "courtName"
                              ? "Court"
                              : field === "nextHearingDate"
                                ? "Next Hearing"
                                : field === "filingDate"
                                  ? "Filing Date"
                                  : field === "paymentStatus"
                                    ? "Payment Status"
                                    : field === "caseOutcome"
                                      ? "Outcome"
                                      : field === "courtAddress"
                                        ? "Court Address"
                                        : field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      className="w-full text-[8px] px-1 border rounded"
                    />
                  ) : null}
                </th>
              ))}
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
                <tr
                  key={c.id ?? idx}
                  className="hover:bg-gray-50 transition"
                  style={{ height: "36px" }}
                >
                  <td className="py-2 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedCaseIds.includes(c.id)}
                      onChange={() => toggleSelectOne(c.id)}
                      aria-label={`Select case ${c.id}`}
                      className="scale-75 cursor-pointer"
                    />
                  </td>

                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.id}
                  </td>

                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onEdit && onEdit(c)}
                        title="Edit Case"
                        className="text-blue-600 hover:text-blue-800 rounded-md transition-all duration-200"
                        type="button"
                      >
                        <FiEdit size={8} />
                      </button>
                      <button
                        onClick={() => onView && onView(c)}
                        title="View Case"
                        className="text-green-600 hover:text-green-800 rounded-md transition-all duration-200"
                        type="button"
                      >
                        <FiEye size={8} />
                      </button>
                      <button
                        onClick={() => onPrint && onPrint(c)}
                        title="Print Case"
                        className="text-gray-700 hover:text-gray-900 rounded-md transition-all duration-200"
                        type="button"
                      >
                        <FiPrinter size={8} />
                      </button>
                      <button
                        onClick={() => onMore && onMore(c)}
                        title="More Options"
                        className="text-gray-400 hover:text-gray-600 rounded-md transition-all duration-200"
                        type="button"
                      >
                        <FiMoreVertical size={8} />
                      </button>
                    </div>
                  </td>


                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.caseNumber}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.title}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.caseType}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.status}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.courtName}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.nextHearingDate
                      ? new Date(c.nextHearingDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.filingDate
                      ? new Date(c.filingDate).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.fees}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.paymentStatus}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.caseOutcome}
                  </td>
                  <td className="py-2 px-2 overflow-hidden whitespace-nowrap text-ellipsis">
                    {c.courtAddress}
                  </td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-2"></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CaseTable;
