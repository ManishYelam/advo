import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderOpen, FaPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import CaseTable from "../CaseTable";
import AddCaseForm from "../AddCaseForm";

const ClientDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [myCases, setMyCases] = useState([
    {
      caseName: "Case A",
      status: "Running",
      nextDate: "2025-10-10",
      advocate: "John Doe",
      caseType: "Criminal",
      documents: [
        { name: "FIR.pdf", url: "/documents/fir.pdf" },
        { name: "Evidence.docx", url: "/documents/evidence.docx" },
      ],
    },
    {
      caseName: "Case B",
      status: "Closed",
      nextDate: "2025-09-15",
      advocate: "Jane Smith",
      caseType: "Civil",
      documents: [{ name: "Contract.pdf", url: "/documents/contract.pdf" }],
    },
  ]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/login");
    }
  }, [navigate, user]);

  const addNewCase = (caseData) => {
    setMyCases([...myCases, caseData]);
    setView("dashboard");
  };

  const renderDashboard = () => (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-green-700 to-green-400 text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {user?.full_name || "Client"}!
        </h1>
        <p className="text-sm">
          Here’s your dashboard overview. Use the menu to manage your cases and appointments.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button
          onClick={() => setView("cases")}
          title="View Cases"
          className="flex items-center justify-center w-6 h-6 bg-green-600 text-white text-[10px] rounded-lg
               shadow-[0_8px_15px_rgba(0,100,0,0.5)] hover:shadow-[0_12px_20px_rgba(0,120,0,0.75)]
               transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-inner
               transition-all duration-200"
          style={{
            boxShadow: "0 8px 15px rgba(0,100,0,0.5), inset 3px 3px 6px rgba(0, 70, 0, 0.8), inset -3px -3px 6px rgba(0, 130, 0, 0.5), inset 0 0 8px rgba(0, 90, 0, 0.7)",
          }}
        >
          <FaFolderOpen />
        </button>

        <button
          onClick={() => setView("addCase")}
          title="Add Case"
          className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-[10px] rounded-lg
               shadow-[0_8px_15px_rgba(0,0,120,0.5)] hover:shadow-[0_12px_20px_rgba(0,0,160,0.75)]
               transform hover:-translate-y-1 active:translate-y-0.5 active:shadow-inner
               transition-all duration-200"
          style={{
            boxShadow: "0 8px 15px rgba(0,0,120,0.5), inset 3px 3px 6px rgba(0, 0, 70, 0.8), inset -3px -3px 6px rgba(0, 0, 130, 0.5), inset 0 0 8px rgba(0, 0, 90, 0.7)",
          }}
        >
          <FaPlus />
        </button>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Cases */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">My Cases</h2>
          <p className="text-sm text-gray-500">
            You currently have {myCases.length} active {myCases.length === 1 ? "case" : "cases"}.
          </p>
          <button
            onClick={() => setView("cases")}
            className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
          >
            View All Cases
          </button>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Appointments</h2>
          <p className="text-sm text-gray-500">
            {
              myCases.filter((c) => c.status === "Running").length > 0
                ? "You have upcoming court appearances."
                : "No upcoming court dates."
            }
          </p>
          <button className="mt-3 px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition">
            View Calendar
          </button>
        </div>
      </div>

      {/* Recent Documents */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent Documents</h2>
        <div className="flex flex-wrap gap-3">
          {myCases.flatMap((c) => c.documents).map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition"
            >
              {doc.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardLayout>
        {view === "dashboard" && renderDashboard()}
        {view === "cases" && <CaseTable cases={myCases} />}
        {view === "addCase" && <AddCaseForm onAdd={addNewCase} />}
      </DashboardLayout>
    </div>
  );
};

export default ClientDashboard;
