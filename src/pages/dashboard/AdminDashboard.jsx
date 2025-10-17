import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Profile from "../Profile";
import AddCaseForm from "../AddCaseForm";
import { FaFolderOpen, FaPlus, FaUser, FaArrowLeft, FaBell } from "react-icons/fa";

// Charts
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend, LineChart, Line } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");

  // Sample Data (replace with API later)
  const cases = [
    { id: 1, caseName: "Case A", client: "John Doe", status: "Running", nextDate: "2025-10-10", advocate: "Jane Smith", caseType: "Criminal", documents: [{ name: "FIR.pdf", url: "/documents/fir.pdf" }] },
    { id: 2, caseName: "Case B", client: "Alice Johnson", status: "Closed", nextDate: "2025-10-12", advocate: "Mike Brown", caseType: "Civil", documents: [{ name: "Contract.pdf", url: "/documents/contract.pdf" }] },
    { id: 3, caseName: "Case C", client: "Bob Lee", status: "Running", nextDate: "2025-10-18", advocate: "Jane Smith", caseType: "Family", documents: [] },
  ];

  const clients = [...new Set(cases.map(c => c.client))];
  const advocates = [...new Set(cases.map(c => c.advocate))];

  // Sample Financials
  const payments = [
    { month: "Jan", received: 1200, pending: 300 },
    { month: "Feb", received: 1500, pending: 200 },
    { month: "Mar", received: 1000, pending: 400 },
    { month: "Apr", received: 1800, pending: 100 },
  ];

  // Pie chart for Case Status
  const caseStatusData = [
    { name: "Running", value: cases.filter(c => c.status === "Running").length },
    { name: "Closed", value: cases.filter(c => c.status === "Closed").length },
    { name: "Pending", value: cases.filter(c => c.status === "Pending").length },
  ];

  // Pie chart for Case Type
  const caseTypeData = [
    { name: "Criminal", value: cases.filter(c => c.caseType === "Criminal").length },
    { name: "Civil", value: cases.filter(c => c.caseType === "Civil").length },
    { name: "Family", value: cases.filter(c => c.caseType === "Family").length },
  ];

  // Bar chart: Cases per advocate
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
      <div className="flex justify-between items-center mb-6">
        <div className="bg-gradient-to-br from-green-700 to-green-400 text-white rounded-lg shadow-lg p-6 flex-1 mr-4">
          <h1 className="text-2xl font-bold mb-1">Welcome back, Admin!</h1>
          <p className="text-sm">Manage cases, clients, advocates, payments, and court schedules efficiently.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
          <FaBell size={20} />
          <div>
            <p className="font-semibold">Notifications</p>
            <ul className="text-sm text-gray-600">
              <li>New client registered: Alice Johnson</li>
              <li>Upcoming court date: Case C (2025-10-18)</li>
              <li>Pending payment: Case B ($200)</li>
            </ul>
          </div>
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5 h-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Case Status</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={caseStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {caseStatusData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-5 h-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Case Type Distribution</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie data={caseTypeData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {caseTypeData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-5 h-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Advocate Workload</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={advocateWorkloadData}>
              <XAxis dataKey="advocate" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cases" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-5 h-80">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Payments (Received vs Pending)</h2>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={payments}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="received" stroke="#0088FE" />
              <Line type="monotone" dataKey="pending" stroke="#FF8042" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

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
          {renderBackButton()}
          <CaseTable cases={cases} onDelete={(ids) => { }} />
        </div>
      )}
      {view === "addCase" && (
        <div className="w-full h-full px-6 py-8">
          {renderBackButton()}
          <AddCaseForm onAdd={(c) => { }} />
        </div>
      )}
      {view === "profile" && (
        <div className="w-full h-full px-6 py-8">
          {renderBackButton()}
          <Profile />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
