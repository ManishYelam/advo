import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import CaseDocumentUploader from "../components/CaseDocumentUploader";
import CaseFormBasic from "../components/CaseFormBasic";
import CaseFormDetails from "../components/CaseFormDetails";
import CaseReview from "../components/CaseReview";
import Payment from "../components/Payment";
import Toast from "../components/Toast";
import { showErrorToast, showSuccessToast, showWarningToast } from "../utils/Toastify";
import { saveApplicationData, updateApplicationData, userApplicant } from "../services/applicationService";
import {
  FaFileUpload,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowLeft,
  FaArrowRight,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaUser,
  FaFileAlt,
  FaSearch,
  FaEdit,
  FaEye,
  FaSave
} from "react-icons/fa";

// Static data moved outside component to prevent recreation
const EXHIBITS = [
  {
    value: "Exhibit A",
    label: "Exhibit A - Account Opening Documents",
    description: "Bank passbook copies and account opening slip"
  },
  {
    value: "Exhibit B",
    label: "Exhibit B - Deposit Details",
    description: "FD, Savings, and RD amount details with statements"
  },
  {
    value: "Exhibit C",
    label: "Exhibit C - Deposit Proof",
    description: "Copies of deposit transactions to the bank"
  },
  {
    value: "Exhibit D",
    label: "Exhibit D - Police Statement",
    description: "Statement copy submitted to Shrirampur Police Station"
  }
];

const REQUIRED_DOCUMENTS = {
  "Exhibit A": [
    "Dnyanradha Multistate Society Bank Passbook Copy",
    "Other Bank Passbook Copy for Payment",
    "Copy of the Slip of Account Started (Date mentioned)",
  ],
  "Exhibit B": [
    "Fixed Deposit (FD Amount Details)",
    "Saving Bank Account Total Amount Details",
    "Recurring Deposits (RD) Total Amount Sheet",
  ],
  "Exhibit C": ["Copy of Deposits made by Applicant to the said bank"],
  "Exhibit D": ["Statement Copy submitted to Shrirampur Police Station"],
};

// Different steps for different modes
const CREATE_STEPS = [
  { number: 1, title: "Basic Info", icon: FaUser },
  { number: 2, title: "Case Details", icon: FaFileAlt },
  { number: 3, title: "Review Case", icon: FaClipboardCheck },
  { number: 4, title: "Documents", icon: FaFileUpload },
  { number: 5, title: "Payment", icon: FaMoneyBillWave }
];

const EDIT_VIEW_STEPS = [
  { number: 1, title: "Basic Info", icon: FaUser },
  { number: 2, title: "Case Details", icon: FaFileAlt },
  { number: 3, title: "Review Case", icon: FaClipboardCheck },
  { number: 4, title: "Documents", icon: FaFileUpload }
];

const INITIAL_FORM_DATA = {
  status: "Not Started",
  full_name: "",
  date_of_birth: "",
  age: "",
  phone_number: "",
  email: "",
  gender: "",
  occupation: "",
  adhar_number: "",
  address: "",
  additional_notes: "",
  saving_account_start_date: "",
  deposit_type: "",
  deposit_duration_years: "",
  fixed_deposit_total_amount: "",
  interest_rate_fd: "",
  saving_account_total_amount: "",
  interest_rate_saving: "",
  recurring_deposit_total_amount: "",
  interest_rate_recurring: "",
  dnyanrudha_investment_total_amount: "",
  dynadhara_rate: "",
  documents: {
    "Exhibit A": [],
    "Exhibit B": [],
    "Exhibit C": [],
    "Exhibit D": [],
  },
};

// Memoized components to prevent unnecessary re-renders
const StepProgress = React.memo(({ steps, currentStep, mode }) => {
  // Desktop Step Progress
  const desktopProgress = (
    <div className="hidden md:flex justify-between items-center relative">
      {steps.map((step, index) => {
        const StepIcon = step.icon;
        const isActive = step.number === currentStep;
        const isCompleted = step.number < currentStep;

        return (
          <div key={step.number} className="flex flex-col items-center flex-1 relative">
            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-4 left-1/2 w-full h-0.5 z-0 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
            )}

            {/* Step Circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${isActive
                ? "bg-green-600 text-white shadow-lg scale-110"
                : isCompleted
                  ? "bg-green-500 text-white shadow-md"
                  : "bg-gray-200 text-gray-500"
                }`}
            >
              {isCompleted ? (
                <FaCheckCircle className="text-sm" />
              ) : (
                <StepIcon className="text-sm" />
              )}
            </div>

            {/* Step Label */}
            <div className="mt-2 text-center">
              <div className={`text-xs font-medium ${isActive ? "text-green-700" :
                isCompleted ? "text-green-600" : "text-gray-500"
                }`}>
                Step {step.number}
              </div>
              <div className={`text-[10px] ${isActive ? "text-green-800 font-semibold" : "text-gray-600"
                }`}>
                {step.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Mobile Step Progress
  const mobileProgress = (
    <div className="md:hidden bg-gray-100 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-700">
          Step {currentStep} of {steps.length}
        </span>
        <span className="text-xs text-green-600 font-semibold">
          {steps[currentStep - 1]?.title}
        </span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-2">
        <div
          className="bg-green-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="mt-8 mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="ml-8 text-xl font-bold text-green-800">
          {mode === 'edit' ? 'Edit Case' : mode === 'view' ? 'View Case' : 'Legal Case Application'}
        </h2>
        {mode === 'view' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-8">
            <FaEye className="text-sm" />
            View Only Mode
          </div>
        )}

        {mode === 'edit' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm mr-8">
            <FaEdit className="text-sm" />
            Edit Mode
          </div>
        )}

      </div>
      {desktopProgress}
      {mobileProgress}
    </div>
  );
});

const ExhibitSelector = React.memo(({ selectedExhibit, onExhibitChange, documents, mode }) => {
  return (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-semibold text-green-800 flex items-center">
        <FaSearch className="mr-2" />
        Select Exhibit to {mode === 'view' ? 'View' : 'Upload'} Documents
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXHIBITS.map((exhibit) => (
          <div
            key={exhibit.value}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${selectedExhibit === exhibit.value
              ? "border-green-500 bg-green-50 shadow-md"
              : "border-gray-300 bg-white hover:border-green-300 hover:bg-green-25"
              } ${mode === 'view' ? 'cursor-default' : ''}`}
            onClick={() => mode !== 'view' && onExhibitChange(exhibit.value)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-green-900 text-sm mb-1">
                  {exhibit.value}
                </h3>
                <p className="text-gray-600 text-xs mb-2">
                  {exhibit.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <FaFileUpload className="mr-1" size={10} />
                  <span>
                    {documents[exhibit.value]?.length || 0} files uploaded
                  </span>
                </div>
              </div>

              {selectedExhibit === exhibit.value && (
                <FaCheckCircle className="text-green-500 ml-2 flex-shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Required Documents List */}
      {selectedExhibit && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Required Documents for {selectedExhibit}
          </h4>
          <ul className="text-xs text-blue-700 space-y-1">
            {REQUIRED_DOCUMENTS[selectedExhibit]?.map((doc, index) => (
              <li key={index} className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" size={10} />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

const DocumentsSummary = React.memo(({ documents }) => {
  const hasDocuments = useMemo(() =>
    Object.values(documents).some(files => files.length > 0),
    [documents]
  );

  if (!hasDocuments) {
    return (
      <div className="mt-6 border-t pt-6">
        <h3 className="font-semibold text-green-800 text-sm mb-3 flex items-center">
          <FaClipboardCheck className="mr-2" />
          Uploaded Documents Summary
        </h3>
        <div className="text-center py-4 text-gray-500 text-sm">
          <FaFileUpload className="mx-auto text-2xl mb-2 text-gray-400" />
          No documents uploaded yet
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="font-semibold text-green-800 text-sm mb-3 flex items-center">
        <FaClipboardCheck className="mr-2" />
        Uploaded Documents Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {EXHIBITS.map((exhibit) => {
          const files = documents[exhibit.value] || [];
          if (files.length === 0) return null;

          return (
            <div key={exhibit.value} className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-green-800 text-xs">
                  {exhibit.value}
                </span>
                <span className="bg-green-500 text-white text-[10px] px-2 py-1 rounded-full">
                  {files.length} file{files.length !== 1 ? 's' : ''}
                </span>
              </div>
              <ul className="text-[10px] text-green-700 space-y-1">
                {files.map((file, index) => (
                  <li key={index} className="truncate">
                    📄 {file.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const ValidationErrors = React.memo(({ errors }) => {
  if (Object.keys(errors).length === 0) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <h3 className="font-semibold text-red-800 text-sm mb-2 flex items-center">
        <FaExclamationTriangle className="mr-2" />
        Please fix the following errors:
      </h3>
      <ul className="text-red-700 text-sm space-y-1">
        {Object.entries(errors).map(([field, error]) => (
          error && <li key={field}>• {error}</li>
        ))}
      </ul>
    </div>
  );
});

const DocumentStep = React.memo(({
  selectedExhibit,
  onExhibitChange,
  documents,
  onDocumentsChange,
  onNext,
  onBack,
  onSave,
  mode
}) => (
  <div>
    <ExhibitSelector
      selectedExhibit={selectedExhibit}
      onExhibitChange={onExhibitChange}
      documents={documents}
      mode={mode}
    />

    <CaseDocumentUploader
      documents={documents[selectedExhibit] || []}
      onDocumentsChange={onDocumentsChange}
      onNext={onNext}
      onBack={onBack}
      onSave={onSave}
      requiredDocs={REQUIRED_DOCUMENTS[selectedExhibit]}
      exhibit={selectedExhibit}
      mode={mode}
    />

    <DocumentsSummary documents={documents} />
  </div>
));

// Component map for faster lookup (replaces switch statement)
const CREATE_STEP_COMPONENTS = {
  1: CaseFormBasic,
  2: CaseFormDetails,
  3: CaseReview,
  4: DocumentStep,
  5: Payment
};

const EDIT_VIEW_STEP_COMPONENTS = {
  1: CaseFormBasic,
  2: CaseFormDetails,
  3: CaseReview,
  4: DocumentStep
};

const Application = ({
  mode = 'create',
  initialData = null,
  caseId = null,
  onBack = null,
  onSave = null,
  onAdd = null
}) => {
  const [formData, setFormData] = useState(initialData || INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExhibit, setSelectedExhibit] = useState("Exhibit A");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Determine steps based on mode
  const STEPS = mode === 'create' ? CREATE_STEPS : EDIT_VIEW_STEPS;
  const STEP_COMPONENTS = mode === 'create' ? CREATE_STEP_COMPONENTS : EDIT_VIEW_STEP_COMPONENTS;
  const totalSteps = STEPS.length;

  // Refs for frequently accessed values
  const formDataRef = useRef(formData);
  const currentStepRef = useRef(currentStep);

  // const DepositDetailsForm = getCaseById(caseId);
  // const userid = DepositDetailsForm.data.client_id
  // const BasicInfoFormData = userApplicant(userid);

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Keep refs updated
  useEffect(() => {
    formDataRef.current = formData;
    currentStepRef.current = currentStep;
  }, [formData, currentStep]);

  // Memoized validation function
  const validateStep = useCallback((step) => {
    if (mode === 'view') return true; // Skip validation in view mode

    const currentFormData = formDataRef.current;
    const errors = {};

    if (step === 1) {
      if (!currentFormData.full_name?.trim()) errors.full_name = "Full name is required";
      if (!currentFormData.date_of_birth) errors.date_of_birth = "Date of birth is required";
      if (!currentFormData.phone_number?.trim()) errors.phone_number = "Phone number is required";
      if (!currentFormData.email?.trim()) errors.email = "Email is required";
      if (!currentFormData.adhar_number?.trim()) errors.adhar_number = "Aadhar number is required";
    }

    if (step === 2) {
      if (!currentFormData.deposit_type) errors.deposit_type = "Deposit type is required";
      if (!currentFormData.saving_account_start_date) errors.saving_account_start_date = "Start date is required";
    }

    if (step === 4 && mode === 'create') {
      const missingExhibits = EXHIBITS.filter(
        exhibit => !currentFormData.documents[exhibit.value] || currentFormData.documents[exhibit.value].length === 0
      );
      if (missingExhibits.length > 0) {
        errors.documents = `Please upload documents for: ${missingExhibits.map(e => e.value).join(", ")}`;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [mode]);

  // Optimized input change handler
  const handleInputChange = useCallback((e) => {
    if (mode === 'view') return; // Prevent changes in view mode

    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Debounced validation error clearing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }, [validationErrors, mode]);

  // Optimized documents change handler
  const handleDocumentsChange = useCallback((updatedFiles) => {
    if (mode === 'view') return; // Prevent changes in view mode

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [selectedExhibit]: updatedFiles,
      },
    }));

    if (validationErrors.documents) {
      setValidationErrors(prev => ({
        ...prev,
        documents: ""
      }));
    }
  }, [selectedExhibit, validationErrors, mode]);

  // Optimized navigation handlers
  const goToNextStep = useCallback(() => {
    if (mode === 'view') {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      return;
    }

    const step = currentStepRef.current;
    if (!validateStep(step)) {
      showWarningToast("Please fix the validation errors before proceeding.");
      return;
    }

    const statusUpdates = {
      1: "Basic Info Completed",
      2: "Case Details Completed",
      3: "Case Reviewed",
      4: mode === 'create' ? "Documents Uploaded" : "Case Updated"
    };

    if (statusUpdates[step]) {
      setFormData(prev => ({
        ...prev,
        status: statusUpdates[step]
      }));
    }

    // If this is the last step in edit mode, save and exit
    if (mode === 'edit' && step === totalSteps) {
      handleSaveCase();
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  }, [validateStep, mode, totalSteps]);

  const goToPrevStep = useCallback(() => {
    if (mode === 'view') {
      setCurrentStep(prev => Math.max(prev - 1, 1));
      return;
    }

    const step = currentStepRef.current;
    const statusUpdates = {
      2: "Not Started",
      3: "Basic Info Completed",
      4: "Case Details Completed",
      5: "Documents Uploaded"
    };

    if (statusUpdates[step]) {
      setFormData(prev => ({
        ...prev,
        status: statusUpdates[step]
      }));
    }

    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, [mode]);

  // Handle custom back action
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      goToPrevStep();
    }
  }, [onBack, goToPrevStep]);

  // Handle save case (for edit mode)
  const handleSaveCase = useCallback(async () => {
    if (mode !== 'edit') return;

    setIsSubmitting(true);
    try {
      const currentFormData = formDataRef.current;

      if (!validateStep(currentStepRef.current)) {
        showWarningToast("Please fix the validation errors before saving.");
        return;
      }

      const updatedFormData = {
        ...currentFormData,
        status: "Updated",
        updated_at: new Date().toISOString()
      };

      setFormData(updatedFormData);

      if (onSave) {
        onSave(updatedFormData);
        showSuccessToast("✅ Case updated successfully!");
      }

    } catch (error) {
      console.error("Error saving case:", error);
      showErrorToast("❌ Failed to update case. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [mode, validateStep, onSave]);

  // Optimized payment success handler (only for create mode)
  const handlePaymentSuccess = useCallback(async (paymentResponse) => {
    if (mode !== 'create') return;

    setIsSubmitting(true);
    try {
      const currentFormData = formDataRef.current;
      const updatedFormData = {
        ...currentFormData,
        ...paymentResponse,
        status: "Paid",
        submitted_at: new Date().toISOString()
      };

      setFormData(updatedFormData);

      let response;
      if (mode === 'edit' && caseId) {
        // Update existing case
        response = await updateApplicationData(caseId, updatedFormData);
      } else {
        // Create new case
        response = await saveApplicationData(updatedFormData);
      }

      if (!response.data.data?.success) {
        throw new Error("Failed to save application data");
      }

      const { user, case: savedCase, payment: savedPayment } = response.data.data;

      showSuccessToast(
        `✅ ${mode === 'edit' ? 'Case updated' : 'Application submitted'} successfully!\n` +
        `Name: ${user.full_name}\n` +
        `Case ID: ${savedCase.id}\n` +
        `Payment: ${savedPayment.amount} (${savedPayment.status})`
      );

      // Call onSave or onAdd callback if provided
      if (onSave) {
        onSave(savedCase);
      } else if (onAdd) {
        onAdd(savedCase);
      } else {
        resetForm();
      }

    } catch (error) {
      console.error("Payment success handling error:", error);
      showErrorToast(`❌ Failed to ${mode === 'edit' ? 'update case' : 'process application'}. Please contact support.`);
    } finally {
      setIsSubmitting(false);
    }
  }, [mode, caseId, onSave, onAdd]);

  // Optimized reset function
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setSelectedExhibit("Exhibit A");
    setCurrentStep(1);
    setValidationErrors({});
  }, []);

  // Fast component lookup using object map (replaces switch statement)
  const stepContent = useMemo(() => {
    const StepComponent = STEP_COMPONENTS[currentStep];
    if (!StepComponent) return null;

    const stepProps = {
      1: {
        formData,
        handleInputChange,
        onNext: goToNextStep,
        errors: validationErrors,
        mode
      },
      2: {
        formData,
        handleInputChange,
        onNext: goToNextStep,
        onBack: handleBack,
        errors: validationErrors,
        mode
      },
      3: {
        formData,
        setFormData,
        onNext: goToNextStep,
        onBack: handleBack,
        onSave: mode === 'edit' ? handleSaveCase : undefined,
        mode
      },
      4: {
        selectedExhibit,
        onExhibitChange: setSelectedExhibit,
        documents: formData.documents,
        onDocumentsChange: handleDocumentsChange,
        onNext: goToNextStep,
        onBack: handleBack,
        onSave: mode === 'edit' ? handleSaveCase : undefined,
        mode
      },
      5: {
        amount: 500,
        onPaymentSuccess: handlePaymentSuccess,
        onBack: handleBack,
        isSubmitting,
        mode
      }
    };

    return React.createElement(StepComponent, stepProps[currentStep]);
  }, [
    currentStep,
    formData,
    selectedExhibit,
    validationErrors,
    isSubmitting,
    mode,
    handleInputChange,
    handleDocumentsChange,
    goToNextStep,
    handleBack,
    handlePaymentSuccess,
    handleSaveCase,
    STEP_COMPONENTS
  ]);

  // Render action buttons based on mode and current step
  const renderActionButtons = useCallback(() => {
    if (mode === 'view') {
      return (
        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1 bg-gray-400 text-white text-[12px] rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaArrowLeft />
            Back to Cases
          </button>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps} - View Mode
          </div>
        </div>
      );
    }

    if (mode === 'edit' && currentStep === totalSteps) {
      return (
        <div className="flex justify-between items-center mt-6 pt-6 border-t">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1 bg-gray-400 text-white text-[12px] rounded-lg hover:bg-gray-700 transition-all"
          >
            <FaArrowLeft />
            Back to Cases
          </button>
          <button
            onClick={handleSaveCase}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
          >
            <FaSave />
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center mt-6 pt-6 border-t">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-1 bg-gray-400 text-white text-[12px] rounded-lg hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          <FaArrowLeft />
          {'Back to Cases'}
        </button>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>
    );
  }, [mode, currentStep, totalSteps, handleBack, goToNextStep, handleSaveCase, isSubmitting]);

  // Determine container classes based on mode
  const containerClasses = useMemo(() => {
    const baseClasses = "min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8";

    if (mode === 'view' || mode === 'edit') {
      return `${baseClasses} px-4 md:px-8 lg:px-16 xl:px-24`; // Added horizontal margins for view/edit modes
    }

    return `${baseClasses} px-4`; // Default padding for create mode
  }, [mode]);

  return (
    <div className={containerClasses}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            {mode === 'edit' ? 'Edit Case' : mode === 'view' ? 'View Case' : 'Legal Case Application'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {mode === 'view'
              ? 'View case details and documents. This is a read-only view.'
              : mode === 'edit'
                ? 'Update case information and documents.'
                : 'Complete your application in 5 simple steps. Ensure all information is accurate and documents are properly uploaded.'
            }
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <StepProgress steps={STEPS} currentStep={currentStep} mode={mode} />

          {/* Main Content */}
          <div className="px-6 pb-8">
            <ValidationErrors errors={validationErrors} />
            {stepContent}
            {renderActionButtons()}
          </div>

          {/* Status Footer */}
          <div className="bg-gray-50 border-t px-6 py-4">
            <div className="flex justify-between items-center text-sm">
              <div className="text-gray-600">
                <span className="font-medium">Current Status:</span>{" "}
                <span className={`font-semibold ${formData.status === "Paid" ? "text-green-600" :
                  formData.status === "Not Started" ? "text-red-600" :
                    "text-blue-600"
                  }`}>
                  {formData.status}
                </span>
                {caseId && (
                  <span className="ml-4 text-gray-500">
                    Case ID: {caseId}
                  </span>
                )}
              </div>

              {currentStep > 1 && currentStep < totalSteps && mode === 'create' && (
                <button
                  onClick={resetForm}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Start Over
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
};

export default React.memo(Application);