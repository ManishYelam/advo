import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFolderOpen, 
  FaPlus, 
  FaUser, 
  FaArrowLeft
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

  // New state for edit/view mode
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [applicationMode, setApplicationMode] = useState('create'); // 'create', 'view'

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "client") {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

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
    setView("dashboard");
  };

  const handleDeleteCases = (ids) => {
    if (window.confirm(`Are you sure you want to delete ${ids.length} case(s)? This action cannot be undone.`)) {
      setMyCases(prev => prev.filter(c => !ids.includes(c.id)));
    }
  };

  const handleSaveCase = (updatedCase) => {
    setMyCases(prev => prev.map(c => 
      c.id === updatedCase.id ? { ...c, ...updatedCase, updatedAt: new Date().toISOString() } : c
    ));
  };

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
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end mb-8">
  <div className="inline-flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
    <button
      onClick={() => {
        setApplicationMode('create');
        setView("application");
      }}
      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 transition-all text-sm border-r border-green-700"
    >
      <FaPlus size={12} />
      <span>New Case</span>
    </button>

    <button
      onClick={() => setView("cases")}
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm border-r border-blue-700"
    >
      <FaFolderOpen size={12} />
      <span>View Cases</span>
    </button>

    <button
      onClick={() => setView("profile")}
      className="flex items-center gap-2 px-3 py-1.5 bg-gray-600 text-white hover:bg-gray-700 transition-all text-sm"
    >
      <FaUser size={12} />
      <span>Profile</span>
    </button>
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
              onEdit={handleViewCase} // Clients can only view, not edit
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
              <span>Back to {applicationMode === 'create' ? 'Dashboard' : 'Cases'}</span>
            </button>
            <Application
              mode={applicationMode}
              initialData={selectedCase}
              caseId={selectedCaseId}
              onBack={handleBackFromForm}
              onSave={handleSaveCase}
              onAdd={addNewCase}
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
    </div>
  );
};

export default ClientDashboard;