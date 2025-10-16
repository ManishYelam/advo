import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import CaseTable from "./CaseTable";
import { getAllCases, deleteCases } from "../services/casesService"; // your API service
import { showSuccessToast, showErrorToast } from "../utils/Toastify";

const Cases = () => {
  const [myCases, setMyCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cases from API
  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await getAllCases({ page: 1, limit: 50 }); // fetch first 50 cases
      setMyCases(response.data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Delete selected cases
  const handleDeleteCases = async (selectedIds) => {
    if (!window.confirm("Are you sure you want to delete selected cases?")) return;
    try {
      await deleteCases(selectedIds);
      showSuccessToast("Cases deleted successfully!");
      fetchCases(); // refresh list
    } catch (err) {
      showErrorToast("Failed to delete cases: " + err.message);
    }
  };

  return (
    <DashboardLayout>
      {loading && <p className="text-gray-500">Loading cases...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <CaseTable
        cases={myCases}
        onDelete={handleDeleteCases}
        // You can implement these if needed
        // onEdit={handleEdit} 
        // onView={handleView} 
        // onPrint={handlePrint} 
        // onMore={handleMore} 
      />
    </DashboardLayout>
  );
};

export default Cases;
