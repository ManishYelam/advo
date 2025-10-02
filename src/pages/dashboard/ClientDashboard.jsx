import { useState } from "react";
import { FaFolderOpen, FaPlus } from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";
import CaseTable from "../CaseTable";
import AddCaseForm from "../AddCaseForm";

const ClientDashboard = () => {
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

  const [view, setView] = useState("dashboard"); // "dashboard", "cases", "addCase"

  const addNewCase = (caseData) => {
    setMyCases([...myCases, caseData]);
    setView("dashboard");
  };

  // Dashboard Cards
  const renderDashboard = () => (
    <>
      {/* Header with title and icon buttons */}
      <div className="flex justify-between items-center mb-6 p-2 border-b border-gray-200">
        <h1 className="text-1xl font-bold text-gray-800">Client Dashboard</h1>
        <div className="flex gap-2">
          <button
            className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors duration-300"
            onClick={() => setView("cases")}
            title="View Cases"
          >
            <FaFolderOpen />
          </button>
          <button
            className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors duration-300"
            onClick={() => setView("addCase")}
            title="Add Case"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {/* My Cases Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">My Cases</h2>
            <span className="text-sm text-gray-500">{myCases.length} Cases</span>
          </div>
          {myCases.map((c, idx) => (
            <p key={idx} className="text-gray-600 text-sm mb-1">
              {c.caseName} - <span className="font-medium">{c.status}</span>
            </p>
          ))}
        </Card>

        {/* Next Court Date Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Next Court Date</h2>
          <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-inner">
            {myCases.filter((c) => c.status === "Running").length > 0 ? (
              myCases
                .filter((c) => c.status === "Running")
                .map((c, idx) => (
                  <p key={idx} className="text-gray-800 font-medium mb-2">
                    {c.caseName} - <span className="font-normal">{c.nextDate}</span>
                  </p>
                ))
            ) : (
              <p className="text-gray-500">No upcoming court dates</p>
            )}
          </div>
        </Card>

        {/* Payment Status Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Payment Status</h2>
          <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-inner">
            <p className="text-blue-800 font-medium">No pending payments</p>
          </div>
        </Card>
      </div>

      {/* Recent Documents */}
      <div className="mt-8 p-2">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Documents</h2>
        <div className="flex flex-wrap gap-3">
          {myCases.flatMap((c) => c.documents).map((doc, idx) => (
            <a
              key={idx}
              href={doc.url}
              target="_blank"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition-colors duration-300"
            >
              {doc.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );

  // Render based on current view
  return (
    <DashboardLayout>
      {view === "dashboard" && renderDashboard()}
      {view === "cases" && <CaseTable cases={myCases} />}
      {view === "addCase" && <AddCaseForm onAdd={addNewCase} />}
    </DashboardLayout>
  );
};

export default ClientDashboard;
