import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderOpen, FaPlus, FaUser, FaArrowLeft } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Application from "../Application";
import Profile from "../Profile";

const ClientDashboard = () => {
  const [view, setView] = useState("dashboard"); // dashboard / cases / addCase / profile
  const [myCases, setMyCases] = useState([
    {
      id: 1,
      caseName: "Case A",
      caseNumber: "CR123",
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
      id: 2,
      caseName: "Case B",
      caseNumber: "CV456",
      status: "Closed",
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
  }, [user, navigate]);

  const addNewCase = (caseData) => {
    const newCase = { ...caseData, id: myCases.length + 1, title: caseData.caseName || "Untitled Case" };
    setMyCases((prev) => [...prev, newCase]);
    setView("dashboard");
  };

  const handleDeleteCases = (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} case(s)?`)) {
      setMyCases((prev) => prev.filter((c) => !ids.includes(c.id)));
    }
  };

  const renderDashboard = () => (
    <div className="px-6 py-10 w-full h-full">
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
          onClick={() => setView("profile")}
          title="Profile"
          className="flex items-center justify-center w-6 h-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          <FaUser size={10}/>
        </button>

        <button
          onClick={() => setView("cases")}
          title="View Cases"
          className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FaFolderOpen size={10}/>
        </button>

        <button
          onClick={() => setView("addCase")}
          title="Add Case"
          className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus size={10}/>
        </button>
      </div>

      {/* Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Appointments</h2>
          <p className="text-sm text-gray-500">
            {myCases.filter((c) => c.status === "Running").length > 0
              ? "You have upcoming court appearances."
              : "No upcoming court dates."}
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

  const renderBackButton = () => (
    <button
      onClick={() => setView("dashboard")}
      className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition"
    >
      <FaArrowLeft size={15} />
    </button>
  );

  return (
    <div className="min-h-screen w-full">
      <DashboardLayout>
        {view === "dashboard" && renderDashboard()}

        {view === "cases" && (
          <div className="w-full h-full px-6 py-8">
            {renderBackButton()}
            <CaseTable cases={myCases} onDelete={handleDeleteCases} />
          </div>
        )}

        {view === "addCase" && (
          <div className="w-full h-full px-6 py-8">
            {renderBackButton()}
            <Application onAdd={addNewCase} />
          </div>
        )}

        {view === "profile" && (
          <div className="w-full h-full px-6 py-8">
            {renderBackButton()}
            <Profile />
          </div>
        )}
      </DashboardLayout>
    </div>
  );
};

export default ClientDashboard;
