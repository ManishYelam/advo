import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Profile from "../Profile";
import Application from "../Application";
import { 
  FaFolderOpen, 
  FaPlus, 
  FaUser, 
  FaArrowLeft, 
  FaBell, 
  FaChartLine,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUsers,
  FaFileContract,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import Graphs from "../../components/Graphs";

const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // New state for edit/view mode
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [applicationMode, setApplicationMode] = useState('create'); // 'create', 'edit', 'view'

  // Enhanced Sample Data
  const [cases, setCases] = useState([
    { 
      id: 1, 
      caseName: "Case A", 
      client: "John Doe", 
      status: "Running", 
      priority: "High",
      nextDate: "2025-10-10", 
      advocate: "Jane Smith", 
      caseType: "Criminal",
      deposit_type: "Fixed Deposit",
      verified: true,
      fixed_deposit_total_amount: 500000,
      saving_account_total_amount: 150000,
      documents: [{ name: "FIR.pdf", url: "/documents/fir.pdf" }],
      payments: [
        { id: 1, amount: 50000, status: "paid", method: "Bank Transfer", createdAt: "2024-01-15" },
        { id: 2, amount: 45000, status: "pending", method: "UPI", createdAt: "2024-02-01" }
      ],
      createdAt: "2024-01-10"
    },
    { 
      id: 2, 
      caseName: "Case B", 
      client: "Alice Johnson", 
      status: "Closed", 
      priority: "Medium",
      nextDate: "2025-10-12", 
      advocate: "Mike Brown", 
      caseType: "Civil",
      deposit_type: "Savings Account",
      verified: false,
      fixed_deposit_total_amount: 300000,
      saving_account_total_amount: 200000,
      documents: [{ name: "Contract.pdf", url: "/documents/contract.pdf" }],
      payments: [
        { id: 3, amount: 30000, status: "paid", method: "Cash", createdAt: "2024-01-20" }
      ],
      createdAt: "2024-01-05"
    },
    { 
      id: 3, 
      caseName: "Case C", 
      client: "Bob Lee", 
      status: "Running", 
      priority: "Low",
      nextDate: "2025-10-18", 
      advocate: "Jane Smith", 
      caseType: "Family",
      deposit_type: "Recurring Deposit",
      verified: true,
      fixed_deposit_total_amount: 750000,
      saving_account_total_amount: 100000,
      documents: [],
      payments: [
        { id: 4, amount: 75000, status: "failed", method: "Card", createdAt: "2024-02-01" },
        { id: 5, amount: 70000, status: "paid", method: "Bank Transfer", createdAt: "2024-02-15" }
      ],
      createdAt: "2024-01-25"
    },
    { 
      id: 4, 
      caseName: "Case D", 
      client: "Sarah Wilson", 
      status: "Pending", 
      priority: "High",
      nextDate: "2025-11-01", 
      advocate: "Mike Brown", 
      caseType: "Corporate",
      deposit_type: "Fixed Deposit",
      verified: true,
      fixed_deposit_total_amount: 1000000,
      saving_account_total_amount: 500000,
      documents: [{ name: "Agreement.pdf", url: "/documents/agreement.pdf" }],
      payments: [
        { id: 6, amount: 100000, status: "pending", method: "UPI", createdAt: "2024-02-10" }
      ],
      createdAt: "2024-02-01"
    }
  ]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Memoized computed data
  const clients = useMemo(() => [...new Set(cases.map(c => c.client))], [cases]);
  const advocates = useMemo(() => [...new Set(cases.map(c => c.advocate))], [cases]);

  const payments = [
    { month: "Jan", amount: 1500000 },
    { month: "Feb", amount: 1700000 },
    { month: "Mar", amount: 1200000 },
    { month: "Apr", amount: 2000000 },
    { month: "May", amount: 1800000 },
    { month: "Jun", amount: 2200000 },
  ];

  const casesPerMonth = [
    { month: "Jan", cases: 5 },
    { month: "Feb", cases: 8 },
    { month: "Mar", cases: 6 },
    { month: "Apr", cases: 9 },
    { month: "May", cases: 7 },
    { month: "Jun", cases: 11 },
  ];

  // Chart Data
  const caseStatusData = useMemo(() => [
    { name: "Running", value: cases.filter(c => c.status === "Running").length },
    { name: "Closed", value: cases.filter(c => c.status === "Closed").length },
    { name: "Pending", value: cases.filter(c => c.status === "Pending").length },
  ], [cases]);

  const caseTypeData = useMemo(() => [
    { name: "Criminal", value: cases.filter(c => c.caseType === "Criminal").length },
    { name: "Civil", value: cases.filter(c => c.caseType === "Civil").length },
    { name: "Family", value: cases.filter(c => c.caseType === "Family").length },
    { name: "Corporate", value: cases.filter(c => c.caseType === "Corporate").length },
  ], [cases]);

  const advocateWorkloadData = useMemo(() => 
    advocates.map(a => ({
      advocate: a,
      cases: cases.filter(c => c.advocate === a).length
    })), [advocates, cases]);

  // Filtered cases for dashboard
  const filteredCases = useMemo(() => {
    return cases.filter(caseItem => {
      const matchesSearch = searchTerm === "" || 
        caseItem.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.client.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || caseItem.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [cases, searchTerm, filterStatus]);

  // Statistics
  const stats = useMemo(() => ({
    totalCases: cases.length,
    runningCases: cases.filter(c => c.status === "Running").length,
    closedCases: cases.filter(c => c.status === "Closed").length,
    pendingCases: cases.filter(c => c.status === "Pending").length,
    totalClients: clients.length,
    totalAdvocates: advocates.length,
    totalRevenue: cases.reduce((sum, c) => sum + c.fixed_deposit_total_amount + c.saving_account_total_amount, 0),
    verifiedCases: cases.filter(c => c.verified).length
  }), [cases, clients, advocates]);

  const upcomingCases = useMemo(() => {
    const today = new Date();
    return cases
      .filter(c => new Date(c.nextDate) > today)
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
      .slice(0, 5);
  }, [cases]);

  const recentActivities = [
    { type: "new_case", message: "New case 'Corporate Dispute' added", time: "2 hours ago" },
    { type: "payment", message: "Payment received for Case A", time: "5 hours ago" },
    { type: "update", message: "Case C status updated to Running", time: "1 day ago" },
    { type: "document", message: "New document uploaded for Case B", time: "2 days ago" }
  ];

  // ✅ Handle Edit Case
  const handleEditCase = (caseData) => {
    setSelectedCase(caseData);
    setSelectedCaseId(caseData.id);
    setApplicationMode('edit');
    setView("application");
  };

  // ✅ Handle View Case
  const handleViewCase = (caseData) => {
    setSelectedCase(caseData);
    setSelectedCaseId(caseData.id);
    setApplicationMode('view');
    setView("application");
  };

  // ✅ Handle Back from Application Form
  const handleBackFromForm = () => {
    setView("cases");
    setSelectedCase(null);
    setSelectedCaseId(null);
  };

  // ✅ Handle Save from Application Form
  const handleSaveFromForm = (updatedCase) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
    setView("cases");
    setSelectedCase(null);
    setSelectedCaseId(null);
  };

  const renderBackButton = () => (
    <button 
      onClick={() => setView("dashboard")} 
      className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md"
    >
      <FaArrowLeft size={16} /> Back to Dashboard
    </button>
  );

  const handleDeleteCases = (caseIds) => {
    setCases(prev => prev.filter(c => !caseIds.includes(c.id)));
    alert(`Deleted ${caseIds.length} case(s)`);
  };

  const handleSaveCase = (updatedCase) => {
    setCases(prev => prev.map(c => c.id === updatedCase.id ? updatedCase : c));
  };

  const handleAddCase = (newCase) => {
    const caseWithId = {
      ...newCase,
      id: Math.max(...cases.map(c => c.id)) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCases(prev => [...prev, caseWithId]);
    setView("cases");
  };

  const renderDashboard = () => (
    <div className="px-6 py-8 w-full h-full bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your cases today.</p>
        </div>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full lg:w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFolderOpen className="text-blue-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`font-semibold ${stats.runningCases > 0 ? 'text-green-600' : 'text-gray-600'}`}>
              {stats.runningCases} running
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalClients}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUsers className="text-green-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Across {stats.totalAdvocates} advocates
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-purple-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.verifiedCases} verified cases
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Dates</p>
              <p className="text-2xl font-bold text-gray-800">{upcomingCases.length}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaCalendarAlt className="text-orange-600" size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Next: {upcomingCases[0]?.nextDate || 'None'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => setView("cases")}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm"
        >
          <FaFolderOpen size={14} />
          View All Cases
        </button>
        <button 
          onClick={() => {
            setApplicationMode('create');
            setView("application");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <FaPlus size={14} />
          Add New Case
        </button>
        <button 
          onClick={() => setView("profile")}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-sm"
        >
          <FaUser size={14} />
          My Profile
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Graphs Section */}
        <div className="xl:col-span-2">
          <Graphs 
            caseStatusData={caseStatusData}
            caseTypeData={caseTypeData}
            paymentsData={payments}
            casesPerMonthData={casesPerMonth}
            loading={loading}
          />
        </div>

        {/* Sidebar - Recent Activity & Quick Stats */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaBell className="text-green-600" size={18} />
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                  <div className={`w-2 h-2 mt-2 rounded-full ${
                    activity.type === 'new_case' ? 'bg-green-500' :
                    activity.type === 'payment' ? 'bg-blue-500' :
                    activity.type === 'update' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advocate Performance */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Advocate Workload</h3>
            <div className="space-y-3">
              {advocateWorkloadData.map((advocate, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{advocate.advocate}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {advocate.cases} cases
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Court Dates */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Upcoming Court Dates</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Next 5 dates
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Advocate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Court Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingCases.map(caseItem => (
                <tr key={caseItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{caseItem.caseName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{caseItem.client}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{caseItem.advocate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt size={12} className="text-gray-400" />
                      {caseItem.nextDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      caseItem.status === 'Running' ? 'bg-green-100 text-green-800' :
                      caseItem.status === 'Closed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {caseItem.status}
                    </span>
                  </td>
                </tr>
              ))}
              {upcomingCases.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-sm text-gray-500 text-center">
                    No upcoming court dates
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {view === "dashboard" && renderDashboard()}
      
      {view === "cases" && (
        <div className="w-full h-full px-6 py-8 bg-gray-50">
          {renderBackButton()}
          <CaseTable 
            onDelete={handleDeleteCases}
            onSave={handleSaveCase}
            onBack={() => setView("dashboard")}
            onView={handleViewCase}
            onEdit={handleEditCase}
            onPrint={(caseData) => console.log('Print case:', caseData)}
            onMore={(caseData) => console.log('More options:', caseData)}
          />
        </div>
      )}
      
      {view === "application" && (
        <div className="w-full h-full px-6 py-8 bg-gray-50">
          <button 
            onClick={handleBackFromForm} 
            className="mb-4 flex items-center gap-2 text-gray-800 hover:text-gray-600 transition px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md"
          >
            <FaArrowLeft size={16} /> Back to Cases
          </button>
          <Application
            mode={applicationMode}
            initialData={selectedCase}
            caseId={selectedCaseId}
            onBack={handleBackFromForm}
            onSave={handleSaveFromForm}
            onAdd={handleAddCase}
          />
        </div>
      )}
      
      {view === "profile" && (
        <div className="w-full h-full px-6 py-8 bg-gray-50">
          {renderBackButton()}
          <Profile />
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;