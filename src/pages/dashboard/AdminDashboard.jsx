import { useState, useEffect } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Profile from "../Profile";
import Application from "../Application";
import { 
  FaFolderOpen, 
  FaPlus, 
  FaUser, 
  FaArrowLeft
} from "react-icons/fa";

const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [applicationMode, setApplicationMode] = useState('create'); // 'create', 'edit', 'view'

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
    setView("dashboard");
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
      className="mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md text-sm"
    >
      <FaArrowLeft size={14} />
      <span>Back to Dashboard</span>
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
          <p className="text-gray-600">Welcome back! Manage your cases and clients.</p>
        </div>
      </div>

      {/* Connected Button Group - Same as ClientDashboard */}
      <div className="flex justify-end mb-8">
        <div className="inline-flex rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          <button 
            onClick={() => setView("cases")}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 transition-all text-sm border-r border-green-700"
          >
            <FaFolderOpen size={12} />
            <span>View Cases</span>
          </button>
          <button 
            onClick={() => {
              setApplicationMode('create');
              setView("application");
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-all text-sm border-r border-blue-700"
          >
            <FaPlus size={12} />
            <span>New Case</span>
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
            className="mb-4 flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md text-sm"
          >
            <FaArrowLeft size={14} />
            <span>Back to Dashboard</span>
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