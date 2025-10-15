import React, { useState } from "react";
import CaseDocumentUploader from "../components/CaseDocumentUploader"; // Step 4
import CaseFormBasic from "../components/CaseFormBasic"; // Step 1
import CaseFormDetails from "../components/CaseFormDetails"; // Step 2
import CaseReview from "../components/CaseReview"; // Step 3
import Payment from "../components/Payment"; // Step 5
import Toast from "../components/Toast";
import { showErrorToast, showSuccessToast, showWarningToast } from "../utils/Toastify";
import { generateCourtApplicationPDF } from "../utils/generateCourtApplicationPDF";
import { saveApplicationData } from "../services/applicationService";

const Application = () => {
  const [formData, setFormData] = useState({
    caseName: "",
    age: "",
    status: "Not Started",
    nextDate: "",
    advocate: "",
    caseType: "",
    documents: {}, // { "Exhibit A": [], "Exhibit B": [], ... }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExhibit, setSelectedExhibit] = useState("Exhibit A");

  const steps = ["Basic Info", "Case Details", "Review Case", "Documents", "Payment"];
  const exhibits = ["Exhibit A", "Exhibit B", "Exhibit C", "Exhibit D"];
  const requiredDocuments = {
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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentsChange = (updatedFiles) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [selectedExhibit]: updatedFiles,
      },
    }));
  };

  const goToNextStep = () => {
    if (currentStep === 4) {
      // ✅ Validate all exhibits have at least one file
      const missingExhibits = exhibits.filter(
        (exhibit) => !formData.documents[exhibit] || formData.documents[exhibit].length === 0
      );
      if (missingExhibits.length > 0) {
        showWarningToast(
          `Please upload documents for all exhibits: ${missingExhibits.join(", ")}`
        );
        return; // do not proceed
      }
    }

    // ✅ Normal step progression
    if (currentStep === 1) setFormData((prev) => ({ ...prev, status: "Basic Info Completed" }), setCurrentStep(2));
    else if (currentStep === 2) setFormData((prev) => ({ ...prev, status: "Case Details Completed" }), setCurrentStep(3));
    else if (currentStep === 3) setFormData((prev) => ({ ...prev, status: "Case Reviewed" }), setCurrentStep(4));
    else if (currentStep === 4) setFormData((prev) => ({ ...prev, status: "Documents Uploaded" }), setCurrentStep(5));
  };

  const goToPrevStep = () => {
    if (currentStep === 2) setFormData((prev) => ({ ...prev, status: "Not Started" }), setCurrentStep(1));
    else if (currentStep === 3) setFormData((prev) => ({ ...prev, status: "Basic Info Completed" }), setCurrentStep(2));
    else if (currentStep === 4) setFormData((prev) => ({ ...prev, status: "Case Details Completed" }), setCurrentStep(3));
    else if (currentStep === 5) setFormData((prev) => ({ ...prev, status: "Documents Uploaded" }), setCurrentStep(4));
  };

  // const handlePaymentSuccess = (paymentResponse) => {
  //   setFormData((prev) => ({ ...prev, paymentResponse, status: "Payment Completed" }));
  //   console.log(formData, paymentResponse,);

  //   // onSubmit({ ...formData, paymentResponse });

  //   // Reset
  //   setFormData({
  //     // caseName: "",
  //     // age: "",
  //     // status: "Not Started",
  //     // nextDate: "",
  //     // advocate: "",
  //     // caseType: "",
  //     // documents: {},
  //   });
  //   setCurrentStep(1);
  //   setSelectedExhibit("Exhibit A");
  // };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // 1️⃣ Update form data
      const updatedFormData = { ...formData, status: "Payment Completed" };
      setFormData(updatedFormData);

      // 2️⃣ Generate PDF ArrayBuffer
      const pdfArrayBuffer = await generateCourtApplicationPDF(updatedFormData, paymentResponse);

      // 3️⃣ Save data to backend
      const res = await saveApplicationData(updatedFormData, pdfArrayBuffer, paymentResponse);

      if (!res.success) {
        showErrorToast("❌ Failed to save application data!");
        return;
      }

      // 4️⃣ Trigger PDF download
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Court_Application.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);

      showSuccessToast("✅ Payment successful and PDF generated!");
    } catch (error) {
      console.error("Payment success handling error:", error);
      showErrorToast("❌ Something went wrong after payment!");
    } finally {
      // 5️⃣ Reset form
      setFormData({
        caseName: "",
        age: "",
        status: "Not Started",
        nextDate: "",
        advocate: "",
        caseType: "",
        documents: [],
      });
      // setCurrentStep(1);
      setSelectedExhibit("Exhibit A");
    }
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
              ${isActive
                ? "bg-green-700 text-white shadow-lg"
                : isCompleted
                  ? "bg-green-300 text-green-800 hover:bg-green-400"
                  : "bg-gray-200 text-gray-600"
              }`}
            onClick={() => {
              if (stepNumber < currentStep) setCurrentStep(stepNumber);
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
        <h2 className="font-bold text-green-800 mb-8">Application Form</h2>
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
            setFormData={setFormData}
            onNext={goToNextStep}
            onBack={goToPrevStep}
          />
        )}

        {currentStep === 4 && (
          <div>
            <div>
              <label className="block mb-1 text-[10px] font-medium">Select Exhibit</label>
              <select
                value={selectedExhibit}
                onChange={(e) => setSelectedExhibit(e.target.value)}
                className="border p-1 text-[8px] rounded w-full"
              >
                <option value="Exhibit A">
                  Exhibit A - Copy of the slip of Account Started on date mentioned: 1. Dnyanradha Multistate Society Bank Passbook Copy, 2. Other Bank Passbook Copy for Payment
                </option>
                <option value="Exhibit B">
                  Exhibit B - Fixed Deposit (FD Amount Details), Saving Bank Account Total Amount Details & Recurring Deposits (RD) Total Amount in Excel Sheet Chart & Copy of the Statement by Applicant to The Liquidator, Dnyanradha Multistate Cooperative Credit Society
                </option>
                <option value="Exhibit C">
                  Exhibit C - Copy of the Deposits amount by Applicant to the "said bank"
                </option>
                <option value="Exhibit D">
                  Exhibit D - Copy of the Statement by Applicant to Shrirampur Police Station
                </option>
              </select>
            </div>

            <CaseDocumentUploader
              documents={formData.documents[selectedExhibit] || []}
              onDocumentsChange={handleDocumentsChange}
              onNext={goToNextStep}
              onBack={goToPrevStep}
              requiredDocs={requiredDocuments[selectedExhibit]} // ✅ New prop
            />

            {/* ✅ Summary Section */}
            <div className="mt-6 border-t pt-3">
              <h3 className="font-semibold text-[9px] text-green-800 mb-2">Uploaded Documents Summary</h3>
              {Object.keys(formData.documents).length === 0 ? (
                <p className="text-[8px] text-gray-500">No documents uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(formData.documents).map(([exhibit, files]) => (
                    <div key={exhibit} className="bg-gray-50 p-2 rounded border">
                      <p className="font-medium text-[8px] text-green-700 mb-1">
                        {exhibit} — {files.length} document{files.length !== 1 ? "s" : ""}
                      </p>
                      <ul className="list-disc pl-4 text-[8px] text-gray-600">
                        {files.map((file, i) => (
                          <li key={i}>{file.name}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[9px] text-red-600 mt-2">
              *Please upload all relevant documents for the selected exhibit. Only PDF files are accepted.
            </p>
          </div>
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
      <Toast />
    </div>
  );
};

export default Application;
