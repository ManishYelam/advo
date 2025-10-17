import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Profile from "../Profile";
import Application from "../Application";
import { FaFolderOpen, FaPlus, FaUser, FaArrowLeft, FaBell } from "react-icons/fa";
import Graphs from "../../components/Graphs";

// Import Graphs component

const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");

  // Sample Data
  const cases = [
    { id: 1, caseName: "Case A", client: "John Doe", status: "Running", nextDate: "2025-10-10", advocate: "Jane Smith", caseType: "Criminal", documents: [{ name: "FIR.pdf", url: "/documents/fir.pdf" }] },
    { id: 2, caseName: "Case B", client: "Alice Johnson", status: "Closed", nextDate: "2025-10-12", advocate: "Mike Brown", caseType: "Civil", documents: [{ name: "Contract.pdf", url: "/documents/contract.pdf" }] },
    { id: 3, caseName: "Case C", client: "Bob Lee", status: "Running", nextDate: "2025-10-18", advocate: "Jane Smith", caseType: "Family", documents: [] },
  ];

  const clients = [...new Set(cases.map(c => c.client))];
  const advocates = [...new Set(cases.map(c => c.advocate))];

  const payments = [
    { month: "Jan", amount: 1500 },
    { month: "Feb", amount: 1700 },
    { month: "Mar", amount: 1200 },
    { month: "Apr", amount: 2000 },
  ];

  const casesPerMonth = [
    { month: "Jan", cases: 5 },
    { month: "Feb", cases: 8 },
    { month: "Mar", cases: 6 },
    { month: "Apr", cases: 9 },
  ];

  // Chart Data
  const caseStatusData = [
    { name: "Running", value: cases.filter(c => c.status === "Running").length },
    { name: "Closed", value: cases.filter(c => c.status === "Closed").length },
    { name: "Pending", value: cases.filter(c => c.status === "Pending").length },
  ];

  const caseTypeData = [
    { name: "Criminal", value: cases.filter(c => c.caseType === "Criminal").length },
    { name: "Civil", value: cases.filter(c => c.caseType === "Civil").length },
    { name: "Family", value: cases.filter(c => c.caseType === "Family").length },
  ];

  const advocateWorkloadData = advocates.map(a => ({
    advocate: a,
    cases: cases.filter(c => c.advocate === a).length
  }));

  const renderBackButton = () => (
    <button onClick={() => setView("dashboard")} className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition">
      <FaArrowLeft size={15} /> Back
    </button>
  );

  const renderDashboard = () => (
    <div className="px-6 py-10 w-full h-full">
      {/* Welcome + Notifications */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="bg-gradient-to-br from-green-700 to-green-400 text-white rounded-lg shadow-lg p-6 flex-1">
          <h1 className="text-2xl font-bold mb-1">Welcome back, Admin!</h1>
          <p className="text-sm">Manage cases, clients, advocates, payments, and court schedules efficiently.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 w-full md:w-72">
          <div className="flex items-center gap-3 mb-2">
            <FaBell size={20} />
            <p className="font-semibold">Notifications</p>
          </div>
          <ul className="text-sm text-gray-600">
            <li>New client registered: Alice Johnson</li>
            <li>Upcoming court date: Case C (2025-10-18)</li>
            <li>Pending payment: Case B ($200)</li>
          </ul>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        <button onClick={() => setView("profile")} title="Profile" className="flex items-center justify-center w-6 h-6 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"><FaUser size={10} /></button>
        <button onClick={() => setView("cases")} title="View Cases" className="flex items-center justify-center w-6 h-6 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"><FaFolderOpen size={10} /></button>
        <button onClick={() => setView("addCase")} title="Add Case" className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"><FaPlus size={10} /></button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Cases</h2>
          <p className="text-2xl font-bold">{cases.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Running Cases</h2>
          <p className="text-2xl font-bold">{cases.filter(c => c.status === "Running").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Closed Cases</h2>
          <p className="text-2xl font-bold">{cases.filter(c => c.status === "Closed").length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Clients</h2>
          <p className="text-2xl font-bold">{clients.length}</p>
        </div>
      </div>

      {/* Graphs Section */}
      <Graphs 
        caseStatusData={caseStatusData}
        caseTypeData={caseTypeData}
        paymentsData={payments}
        casesPerMonthData={casesPerMonth}
      />

      {/* Upcoming Court Dates */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Court Dates</h2>
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2">Case</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Advocate</th>
              <th className="px-4 py-2">Court Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {cases.map(c => (
              <tr key={c.id} className="border-t">
                <td className="px-4 py-2">{c.caseName}</td>
                <td className="px-4 py-2">{c.client}</td>
                <td className="px-4 py-2">{c.advocate}</td>
                <td className="px-4 py-2">{c.nextDate}</td>
                <td className="px-4 py-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {view === "dashboard" && renderDashboard()}
      {view === "cases" && (
        <div className="w-full h-full px-6 py-8">
          <button onClick={() => setView("dashboard")} className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition">
            <FaArrowLeft size={15} /> Back
          </button>
          <CaseTable cases={cases} onDelete={() => {}} />
        </div>
      )}
      {view === "addCase" && (
        <div className="w-full h-full px-6 py-8">
          <button onClick={() => setView("dashboard")} className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition">
            <FaArrowLeft size={15} /> Back
          </button>
          <Application onAdd={() => {}} />
        </div>
      )}
      {view === "profile" && (
        <div className="w-full h-full px-6 py-8">
          <button onClick={() => setView("dashboard")} className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition">
            <FaArrowLeft size={15} /> Back
          </button>
          <Profile />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
