import React, { useState } from "react";
import CaseDocumentUploader from "../components/CaseDocumentUploader";
import CaseFormBasic from "../components/CaseFormBasic"; // Step 1
import CaseFormDetails from "../components/CaseFormDetails"; // Step 2
import CaseReview from "../components/CaseReview"; // Step 3
import Payment from "../components/Payment"; // Step 5

const Application = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    caseName: "",
    age: "",
    status: "Not Started",
    nextDate: "",
    advocate: "",
    caseType: "",
    documents: [],
  });

  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    "Basic Info",
    "Case Details",
    "Review Case",
    "Documents",
    "Payment",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentsChange = (updatedDocuments) => {
    setFormData((prev) => ({ ...prev, documents: updatedDocuments }));
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      setFormData((prev) => ({ ...prev, status: "Basic Info Completed" }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setFormData((prev) => ({ ...prev, status: "Case Details Completed" }));
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setFormData((prev) => ({ ...prev, status: "Case Reviewed" }));
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setFormData((prev) => ({ ...prev, status: "Documents Uploaded" }));
      setCurrentStep(5);
    }
  };

  const goToPrevStep = () => {
    if (currentStep === 2) {
      setFormData((prev) => ({ ...prev, status: "Not Started" }));
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setFormData((prev) => ({ ...prev, status: "Basic Info Completed" }));
      setCurrentStep(2);
    } else if (currentStep === 4) {
      setFormData((prev) => ({ ...prev, status: "Case Details Completed" }));
      setCurrentStep(3);
    } else if (currentStep === 5) {
      setFormData((prev) => ({ ...prev, status: "Documents Uploaded" }));
      setCurrentStep(4);
    }
  };

  const handlePaymentSuccess = (paymentResponse) => {
    setFormData((prev) => ({
      ...prev,
      paymentResponse,
      status: "Payment Completed",
    }));

    onSubmit({
      ...formData,
      paymentResponse,
    });

    setFormData({
      caseName: "",
      age: "",
      status: "Not Started",
      nextDate: "",
      advocate: "",
      caseType: "",
      documents: [],
    });

    setCurrentStep(1);
  };

  const renderSteps = () => (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-10">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div
            key={step}
            className={`text-center py-2 rounded-full text-[10px] font-medium cursor-pointer transition-all duration-300
              ${
                isActive
                  ? "bg-green-700 text-white shadow-lg"
                  : isCompleted
                  ? "bg-green-300 text-green-800 hover:bg-green-400"
                  : "bg-gray-200 text-gray-600"
              }`}
            onClick={() => {
              if (stepNumber < currentStep) {
                setCurrentStep(stepNumber);
                if (stepNumber === 1)
                  setFormData((prev) => ({ ...prev, status: "Not Started" }));
                else if (stepNumber === 2)
                  setFormData((prev) => ({
                    ...prev,
                    status: "Basic Info Completed",
                  }));
                else if (stepNumber === 3)
                  setFormData((prev) => ({
                    ...prev,
                    status: "Case Details Completed",
                  }));
                else if (stepNumber === 4)
                  setFormData((prev) => ({
                    ...prev,
                    status: "Case Reviewed",
                  }));
              }
            }}
          >
            {step}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-white to-green-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-6 sm:p-10">
        <h2 className="font-bold text-green-800 mb-8">
          Application Form
        </h2>

        {renderSteps()}

        {currentStep === 1 && (
          <CaseFormBasic
            formData={formData}
            handleInputChange={handleInputChange}
            onNext={goToNextStep}
          />
        )}

        {currentStep === 2 && (
          <CaseFormDetails
            formData={formData}
            handleInputChange={handleInputChange}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 3 && (
          <CaseReview
            formData={formData}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 4 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToNextStep();
            }}
          >
            <CaseDocumentUploader
              documents={formData.documents}
              onDocumentsChange={handleDocumentsChange}
            />
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={goToPrevStep}
                className="px-5 py-2 bg-gray-300 rounded-md text-[10px] hover:bg-gray-400 transition-all"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-green-600 text-white rounded-md text-[10px] hover:bg-green-700 transition-all transform hover:scale-105 shadow"
              >
                Next
              </button>
            </div>
          </form>
        )}

        {currentStep === 5 && (
          <Payment
            amount={500}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={goToPrevStep}
          />
        )}

        <p className="mt-8 text-[10px] text-gray-600 text-center">
          Current Status: <span className="font-medium">{formData.status}</span>
        </p>
      </div>
    </div>
  );
};

export default Application;
