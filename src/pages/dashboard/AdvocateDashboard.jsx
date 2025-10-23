import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Profile from "../Profile";
import Application from "../Application";
import { 
  FaFolderOpen, 
  FaUser, 
  FaArrowLeft, 
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaMoneyBillWave,
  FaClock,
  FaUsers,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const AdvocateDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // New state for edit/view mode
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [applicationMode, setApplicationMode] = useState('view'); // 'view' only for advocates
  
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Advocate's assigned cases
  const [assignedCases, setAssignedCases] = useState([
    {
      id: 1,
      caseName: "Financial Dispute - Dnyanradha Society",
      caseNumber: "CR123/2024",
      client: "Rajesh Kumar",
      status: "Running",
      priority: "High",
      nextDate: "2025-10-10",
      nextHearing: "Bail Hearing",
      court: "District Court, Pune",
      caseType: "Financial",
      deposit_type: "Fixed Deposit",
      verified: true,
      fixed_deposit_total_amount: 500000,
      saving_account_total_amount: 150000,
      documents: [
        { name: "FIR.pdf", url: "/documents/fir.pdf" },
        { name: "Bank_Statement.pdf", url: "/documents/statement.pdf" },
      ],
      payments: [
        { id: 1, amount: 50000, status: "paid", method: "Bank Transfer", createdAt: "2024-01-15" },
        { id: 2, amount: 45000, status: "pending", method: "UPI", createdAt: "2024-02-01" }
      ],
      createdAt: "2024-01-10",
      lastUpdated: "2024-01-20",
      clientContact: "+91 9876543210",
      clientEmail: "rajesh@email.com"
    },
    {
      id: 2,
      caseName: "Property Dispute - Sharma Family",
      caseNumber: "CV456/2024",
      client: "Priya Sharma",
      status: "Running",
      priority: "Medium",
      nextDate: "2025-10-12",
      nextHearing: "Evidence Submission",
      court: "High Court, Mumbai",
      caseType: "Civil",
      deposit_type: "Savings Account",
      verified: false,
      fixed_deposit_total_amount: 300000,
      saving_account_total_amount: 200000,
      documents: [
        { name: "Property_Deed.pdf", url: "/documents/deed.pdf" },
        { name: "Agreement.pdf", url: "/documents/agreement.pdf" },
      ],
      payments: [
        { id: 3, amount: 30000, status: "paid", method: "Cash", createdAt: "2024-01-20" }
      ],
      createdAt: "2024-01-05",
      lastUpdated: "2024-02-15",
      clientContact: "+91 9876543211",
      clientEmail: "priya@email.com"
    },
    {
      id: 3,
      caseName: "Marital Dispute - Verma Case",
      caseNumber: "FM789/2024",
      client: "Amit Verma",
      status: "Pending",
      priority: "High",
      nextDate: "2025-10-18",
      nextHearing: "Mediation Session",
      court: "Family Court, Delhi",
      caseType: "Family",
      deposit_type: "Recurring Deposit",
      verified: true,
      recurring_deposit_total_amount: 750000,
      saving_account_total_amount: 100000,
      documents: [
        { name: "Marriage_Certificate.pdf", url: "/documents/marriage.pdf" },
      ],
      payments: [
        { id: 4, amount: 75000, status: "failed", method: "Card", createdAt: "2024-02-01" },
        { id: 5, amount: 70000, status: "paid", method: "Bank Transfer", createdAt: "2024-02-15" }
      ],
      createdAt: "2024-01-25",
      lastUpdated: "2024-02-10",
      clientContact: "+91 9876543212",
      clientEmail: "amit@email.com"
    },
    {
      id: 4,
      caseName: "Corporate Contract Breach",
      caseNumber: "CO101/2024",
      client: "Tech Solutions Ltd.",
      status: "Closed",
      priority: "Medium",
      nextDate: "2025-11-01",
      nextHearing: "Final Judgment",
      court: "Commercial Court, Bangalore",
      caseType: "Corporate",
      deposit_type: "Fixed Deposit",
      verified: true,
      fixed_deposit_total_amount: 1000000,
      saving_account_total_amount: 500000,
      documents: [
        { name: "Contract.pdf", url: "/documents/contract.pdf" },
        { name: "Breach_Notice.pdf", url: "/documents/notice.pdf" },
      ],
      payments: [
        { id: 6, amount: 100000, status: "pending", method: "UPI", createdAt: "2024-02-10" }
      ],
      createdAt: "2024-02-01",
      lastUpdated: "2024-02-20",
      clientContact: "+91 9876543213",
      clientEmail: "legal@techsolutions.com"
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "hearing_reminder",
      message: "Upcoming hearing for Case CR123/2024 tomorrow",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "document_upload",
      message: "New document uploaded for Case CV456/2024",
      time: "1 day ago",
      read: false
    },
    {
      id: 3,
      type: "payment_received",
      message: "Payment received for Case FM789/2024",
      time: "2 days ago",
      read: true
    },
    {
      id: 4,
      type: "case_update",
      message: "Case CO101/2024 status changed to Closed",
      time: "3 days ago",
      read: true
    }
  ]);

  useEffect(() => {
    if (!user || user.role !== "advocate") {
      navigate("/login");
      return;
    }
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Memoized computed values
  const dashboardStats = useMemo(() => ({
    totalCases: assignedCases.length,
    runningCases: assignedCases.filter(c => c.status === "Running").length,
    pendingCases: assignedCases.filter(c => c.status === "Pending").length,
    closedCases: assignedCases.filter(c => c.status === "Closed").length,
    highPriorityCases: assignedCases.filter(c => c.priority === "High").length,
    upcomingHearings: assignedCases.filter(c => c.nextDate && new Date(c.nextDate) > new Date()).length,
    totalClients: new Set(assignedCases.map(c => c.client)).size,
    verifiedCases: assignedCases.filter(c => c.verified).length
  }), [assignedCases]);

  const upcomingHearings = useMemo(() => 
    assignedCases
      .filter(c => c.nextDate && new Date(c.nextDate) > new Date())
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
      .slice(0, 5)
  , [assignedCases]);

  const recentDocuments = useMemo(() => 
    assignedCases.flatMap(caseItem => 
      caseItem.documents?.map(doc => ({
        ...doc,
        caseName: caseItem.caseName,
        caseNumber: caseItem.caseNumber,
        uploadedAt: caseItem.lastUpdated
      })) || []
    ).slice(0, 5)
  , [assignedCases]);

  const caseStatusData = useMemo(() => [
    { name: "Running", value: assignedCases.filter(c => c.status === "Running").length },
    { name: "Pending", value: assignedCases.filter(c => c.status === "Pending").length },
    { name: "Closed", value: assignedCases.filter(c => c.status === "Closed").length },
  ], [assignedCases]);

  const caseTypeData = useMemo(() => [
    { name: "Financial", value: assignedCases.filter(c => c.caseType === "Financial").length },
    { name: "Civil", value: assignedCases.filter(c => c.caseType === "Civil").length },
    { name: "Family", value: assignedCases.filter(c => c.caseType === "Family").length },
    { name: "Corporate", value: assignedCases.filter(c => c.caseType === "Corporate").length },
  ], [assignedCases]);

  // Filtered cases for dashboard
  const filteredCases = useMemo(() => {
    return assignedCases.filter(caseItem => {
      const matchesSearch = searchTerm === "" || 
        caseItem.caseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || caseItem.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [assignedCases, searchTerm, filterStatus]);

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

  const handleDeleteCases = (caseIds) => {
    setAssignedCases(prev => prev.filter(c => !caseIds.includes(c.id)));
  };

  const handleSaveCase = (updatedCase) => {
    setAssignedCases(prev => prev.map(c => 
      c.id === updatedCase.id ? { ...c, ...updatedCase, lastUpdated: new Date().toISOString() } : c
    ));
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const renderDashboard = () => (
    <div className="px-6 py-8 w-full h-full bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.full_name || "Advocate"}! ⚖️
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your assigned cases and stay updated with hearings and documents.
          </p>
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
            <option value="Pending">Pending</option>
            <option value="Closed">Closed</option>
          </select>
          
          {/* Notifications Bell */}
          <button
            onClick={() => setView("notifications")}
            className="relative p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
          >
            <FaBell className="text-gray-600" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned Cases</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalCases}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaFolderOpen className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-600 font-semibold">{dashboardStats.runningCases} active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Hearings</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.upcomingHearings}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCalendarAlt className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Next 30 days
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.highPriorityCases}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaExclamationTriangle className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Requires attention
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.totalClients}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaUsers className="text-orange-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {dashboardStats.verifiedCases} verified
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setView("cases")}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          <FaFolderOpen />
          <span>View All Cases</span>
        </button>

        <button
          onClick={() => setView("profile")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <FaUser />
          <span>My Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-8">
          {/* Upcoming Hearings */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaCalendarAlt className="text-green-600" />
                Upcoming Hearings
              </h2>
              <span className="text-sm text-gray-500">{upcomingHearings.length} scheduled</span>
            </div>
            
            {upcomingHearings.length > 0 ? (
              <div className="space-y-3">
                {upcomingHearings.map((caseItem) => (
                  <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800 text-sm">{caseItem.caseName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        caseItem.priority === 'High' ? 'bg-red-100 text-red-800' :
                        caseItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {caseItem.priority}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Case No: {caseItem.caseNumber}</p>
                      <p>Client: {caseItem.client}</p>
                      <p>Court: {caseItem.court}</p>
                      <p>Hearing: {caseItem.nextHearing}</p>
                      <p className="flex items-center gap-1 text-green-600 font-semibold">
                        <FaClock size={10} />
                        Date: {new Date(caseItem.nextDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p>No upcoming hearings scheduled</p>
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FaFileAlt className="text-blue-600" />
                Recent Documents
              </h2>
              <span className="text-sm text-gray-500">{recentDocuments.length} files</span>
            </div>
            
            {recentDocuments.length > 0 ? (
              <div className="space-y-3">
                {recentDocuments.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all group"
                  >
                    <div className="bg-blue-100 p-2 rounded">
                      <FaFileAlt className="text-blue-600 text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate group-hover:text-blue-600">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{doc.caseNumber} • {doc.caseName}</p>
                    </div>
                    <FaCheckCircle className="text-green-500 text-sm" />
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FaFileAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                <p>No documents available</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Status Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Status</h3>
            <div className="space-y-3">
              {caseStatusData.map((status, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{status.name}</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
                    {status.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Case Type Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Case Types</h3>
            <div className="space-y-2">
              {caseTypeData.map((type, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{type.name}</span>
                    <span className="text-gray-800 font-medium">{type.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(type.value / Math.max(...caseTypeData.map(t => t.value))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notifications Preview */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaBell className="text-purple-600" />
              Notifications
            </h3>
            <div className="space-y-2">
              {notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    notif.read ? 'bg-gray-50' : 'bg-blue-50'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    notif.read ? 'bg-gray-400' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{notif.message}</p>
                    <p className="text-xs text-gray-500">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
            {notifications.length > 3 && (
              <button
                onClick={() => setView("notifications")}
                className="w-full mt-3 text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all notifications
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackButton = () => (
    <button
      onClick={() => setView("dashboard")}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md mb-4"
    >
      <FaArrowLeft size={16} />
      <span>Back to Dashboard</span>
    </button>
  );

  const renderNotificationsView = () => (
    <div className="px-6 py-8 w-full h-full bg-gray-50">
      {renderBackButton()}
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <FaBell className="text-purple-600" />
          Notifications
        </h1>
        
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                  notif.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => markNotificationAsRead(notif.id)}
              >
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  notif.read ? 'bg-gray-400' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800">{notif.message}</p>
                  <p className="text-sm text-gray-500 mt-1">{notif.time}</p>
                </div>
                {!notif.read && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaBell className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-lg">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
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
              onEdit={handleViewCase} // Advocates can only view, not edit
              onPrint={(caseData) => console.log('Print case:', caseData)}
              onMore={(caseData) => console.log('More options:', caseData)}
            />
          </div>
        )}

        {view === "application" && (
          <div className="w-full h-full px-6 py-8 bg-gray-50">
            <button
              onClick={handleBackFromForm}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md mb-4"
            >
              <FaArrowLeft size={16} />
              <span>Back to Cases</span>
            </button>
            <Application
              mode={applicationMode}
              initialData={selectedCase}
              caseId={selectedCaseId}
              onBack={handleBackFromForm}
              onSave={handleSaveCase}
            />
          </div>
        )}

        {view === "profile" && (
          <div className="w-full h-full px-6 py-8 bg-gray-50">
            {renderBackButton()}
            <Profile />
          </div>
        )}

        {view === "notifications" && renderNotificationsView()}
      </DashboardLayout>
    </div>
  );
};

export default AdvocateDashboard;