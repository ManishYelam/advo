import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import CaseTable from "../CaseTable";
import Profile from "../Profile";
import Application from "../Application";
import { 
  FaFolderOpen, 
  FaUser, 
  FaArrowLeft
} from "react-icons/fa";

const AdvocateDashboard = () => {
  const [view, setView] = useState("dashboard");
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

  useEffect(() => {
    if (!user || user.role !== "advocate") {
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

  const handleDeleteCases = (caseIds) => {
    setAssignedCases(prev => prev.filter(c => !caseIds.includes(c.id)));
  };

  const handleSaveCase = (updatedCase) => {
    setAssignedCases(prev => prev.map(c => 
      c.id === updatedCase.id ? { ...c, ...updatedCase, lastUpdated: new Date().toISOString() } : c
    ));
  };

  const renderBackButton = () => (
    <button
      onClick={() => setView("dashboard")}
      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md mb-4 text-sm"
    >
      <FaArrowLeft size={14} />
      <span>Back to Dashboard</span>
    </button>
  );

  const renderDashboard = () => (
    <div className="px-6 py-8 w-full h-full bg-gray-50">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome, {user?.full_name || "Advocate"}! ⚖️
          </h1>
          <p className="text-gray-600">
            Manage your assigned cases and stay updated with hearings and documents.
          </p>
        </div>
      </div>

      {/* Connected Button Group - Same as other dashboards */}
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
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors px-3 py-1.5 bg-white rounded-lg shadow-sm hover:shadow-md mb-4 text-sm"
            >
              <FaArrowLeft size={14} />
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
      </DashboardLayout>
    </div>
  );
};

export default AdvocateDashboard;