import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFolderOpen, 
  FaPlus, 
  FaUser, 
  FaArrowLeft, 
  FaCalendarAlt,
  FaFileAlt,
  FaBell,
  FaMoneyBillWave,
  FaClock,
  FaDownload
} from "react-icons/fa";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Application from "../Application";
import Profile from "../Profile";

const ClientDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [myCases, setMyCases] = useState([
    {
      id: 1,
      caseName: "Financial Dispute - Dnyanradha Society",
      caseNumber: "CR123/2024",
      status: "Running",
      priority: "High",
      nextDate: "2025-10-10",
      advocate: "Adv. John Doe",
      caseType: "Financial",
      deposit_type: "Fixed Deposit",
      verified: true,
      fixed_deposit_total_amount: 500000,
      saving_account_total_amount: 150000,
      saving_account_start_date: "2023-01-15",
      deposit_duration_years: 5,
      documents: [
        { name: "FIR.pdf", url: "/documents/fir.pdf" },
        { name: "Bank_Statement.pdf", url: "/documents/statement.pdf" },
      ],
      payments: [
        { id: 1, amount: 25000, status: "paid", method: "Bank Transfer", createdAt: "2024-01-15" },
        { id: 2, amount: 25000, status: "pending", method: "UPI", createdAt: "2024-02-01" }
      ],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-20"
    },
    {
      id: 2,
      caseName: "Savings Account Recovery",
      caseNumber: "CV456/2024",
      status: "Closed",
      priority: "Medium",
      advocate: "Adv. Jane Smith",
      caseType: "Civil",
      deposit_type: "Savings Account",
      verified: false,
      fixed_deposit_total_amount: 0,
      saving_account_total_amount: 75000,
      saving_account_start_date: "2022-08-20",
      deposit_duration_years: 3,
      documents: [
        { name: "Agreement.pdf", url: "/documents/agreement.pdf" },
        { name: "Payment_Proof.pdf", url: "/documents/payment.pdf" },
      ],
      payments: [
        { id: 3, amount: 15000, status: "paid", method: "Cash", createdAt: "2024-01-20" }
      ],
      createdAt: "2024-01-05",
      updatedAt: "2024-02-15"
    },
    {
      id: 3,
      caseName: "Recurring Deposit Claim",
      caseNumber: "RD789/2024",
      status: "Pending",
      priority: "Low",
      nextDate: "2025-11-15",
      advocate: "Adv. Mike Johnson",
      caseType: "Financial",
      deposit_type: "Recurring Deposit",
      verified: true,
      recurring_deposit_total_amount: 300000,
      saving_account_start_date: "2023-03-10",
      deposit_duration_years: 7,
      documents: [
        { name: "Application_Form.pdf", url: "/documents/application.pdf" },
      ],
      payments: [
        { id: 4, amount: 10000, status: "failed", method: "Card", createdAt: "2024-02-01" }
      ],
      createdAt: "2024-02-01",
      updatedAt: "2024-02-10"
    }
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "case_update",
      message: "Your case CR123/2024 has been updated",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      type: "payment",
      message: "Payment of ₹25,000 received for case CR123/2024",
      time: "1 day ago",
      read: true
    },
    {
      id: 3,
      type: "document",
      message: "New document uploaded for case RD789/2024",
      time: "2 days ago",
      read: true
    }
  ]);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  // Memoized computed values
  const dashboardStats = useMemo(() => ({
    totalCases: myCases.length,
    runningCases: myCases.filter(c => c.status === "Running").length,
    pendingCases: myCases.filter(c => c.status === "Pending").length,
    closedCases: myCases.filter(c => c.status === "Closed").length,
    totalAmount: myCases.reduce((sum, c) => sum + (c.fixed_deposit_total_amount || 0) + (c.saving_account_total_amount || 0) + (c.recurring_deposit_total_amount || 0), 0),
    verifiedCases: myCases.filter(c => c.verified).length,
    upcomingHearings: myCases.filter(c => c.nextDate && new Date(c.nextDate) > new Date()).length
  }), [myCases]);

  const recentDocuments = useMemo(() => 
    myCases.flatMap(caseItem => 
      caseItem.documents?.map(doc => ({
        ...doc,
        caseName: caseItem.caseName,
        caseNumber: caseItem.caseNumber,
        uploadedAt: caseItem.updatedAt
      })) || []
    ).slice(0, 6), [myCases]
  );

  const upcomingCases = useMemo(() => 
    myCases
      .filter(c => c.nextDate && new Date(c.nextDate) > new Date())
      .sort((a, b) => new Date(a.nextDate) - new Date(b.nextDate))
      .slice(0, 3)
  , [myCases]);

  const addNewCase = (caseData) => {
    const newCase = {
      ...caseData,
      id: Math.max(...myCases.map(c => c.id), 0) + 1,
      caseNumber: `CL${Date.now()}`,
      status: "Pending",
      priority: "Medium",
      advocate: "To be assigned",
      documents: [],
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setMyCases(prev => [...prev, newCase]);
    
    // Add notification for new case
    setNotifications(prev => [{
      id: Date.now(),
      type: "case_created",
      message: `New case ${newCase.caseNumber} has been created`,
      time: "Just now",
      read: false
    }, ...prev]);
    
    setView("dashboard");
  };

  const handleDeleteCases = (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} case(s)? This action cannot be undone.`)) {
      setMyCases(prev => prev.filter(c => !ids.includes(c.id)));
      
      // Add notification for deletion
      if (ids.length > 0) {
        setNotifications(prev => [{
          id: Date.now(),
          type: "case_deleted",
          message: `${ids.length} case(s) have been deleted`,
          time: "Just now",
          read: false
        }, ...prev]);
      }
    }
  };

  const handleSaveCase = (updatedCase) => {
    setMyCases(prev => prev.map(c => 
      c.id === updatedCase.id ? { ...c, ...updatedCase, updatedAt: new Date().toISOString() } : c
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
            Welcome back, {user?.full_name || "Client"}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your legal case management overview. Stay updated with your cases and documents.
          </p>
        </div>
        
        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setView("notifications")}
            className="relative p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all"
          >
            <FaBell className="text-gray-600 text-xl" />
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
              <p className="text-sm font-medium text-gray-600">Total Cases</p>
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
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{(dashboardStats.totalAmount / 100000).toFixed(1)}L
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {dashboardStats.verifiedCases} verified cases
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Hearings</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.upcomingHearings}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaCalendarAlt className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Next 30 days
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-800">{dashboardStats.pendingCases}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaClock className="text-orange-600 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Requires attention
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setView("addCase")}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
        >
          <FaPlus />
          <span>New Case Application</span>
        </button>

        <button
          onClick={() => setView("cases")}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          <FaFolderOpen />
          <span>View All Cases</span>
        </button>

        <button
          onClick={() => setView("profile")}
          className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
        >
          <FaUser />
          <span>My Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Hearings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-green-600" />
              Upcoming Hearings
            </h2>
            <span className="text-sm text-gray-500">{upcomingCases.length} scheduled</span>
          </div>
          
          {upcomingCases.length > 0 ? (
            <div className="space-y-3">
              {upcomingCases.map((caseItem) => (
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
                    <p>Advocate: {caseItem.advocate}</p>
                    <p className="flex items-center gap-1 text-green-600 font-semibold">
                      <FaClock size={10} />
                      Next hearing: {new Date(caseItem.nextDate).toLocaleDateString()}
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
                  <FaDownload className="text-gray-400 group-hover:text-blue-600 text-sm" />
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

      {/* Quick Notifications Preview */}
      {notifications.slice(0, 3).length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaBell className="text-purple-600" />
            Recent Notifications
          </h2>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  notif.read ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
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
      )}
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
              onView={(caseData) => console.log('View case:', caseData)}
              onPrint={(caseData) => console.log('Print case:', caseData)}
              onMore={(caseData) => console.log('More options:', caseData)}
            />
          </div>
        )}

        {view === "addCase" && (
          <div className="w-full h-full px-6 py-8 bg-gray-50">
            {renderBackButton()}
            <Application onAdd={addNewCase} />
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

export default ClientDashboard;