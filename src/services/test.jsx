import React, { useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { showWarningToast, showSuccessToast } from "../utils/Toastify";

const CaseReview = ({ formData, setFormData, onNext, onBack }) => {
  const [check, setCheck] = useState(formData.verified || false);

  // ✅ Handle checkbox verification
  const handleCheckboxChange = (e) => {
    const verified = e.target.checked;
    setCheck(verified);
    setFormData((prev) => ({ ...prev, verified }));

    if (verified) showSuccessToast("Declaration verified successfully!");
    else showWarningToast("Declaration unchecked!");
  };

  // ✅ Handle PDF Generation
  const handleGeneratePDF = () => {
    const element = document.getElementById("printableArea");

    const opt = {
      margin: 10,
      filename: `Application_${formData.name || "Applicant"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => showSuccessToast("PDF generated successfully!"))
      .catch(() => showWarningToast("Failed to generate PDF!"));
  };

  // ✅ Validation before proceeding
  const handleNext = () => {
    if (check) {
      showSuccessToast("Declaration verified successfully!");
      onNext();
    } else {
      showWarningToast("Please verify the declaration before proceeding.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded text-[11px] leading-5 print:p-0 print:shadow-none print:border-none print:max-w-full print:mx-0 print:rounded-none">
      {/* Printable Section */}
      <div id="printableArea">
        <header className="text-center font-bold text-[14px] mb-3">
          APPLICATION DETAILS
        </header>

        {/* Partition 1: Basic Information */}
        <section className="border border-gray-400 bg-gray-50 p-3 rounded mb-4">
          <h4 className="font-bold underline mb-2 text-[12px]">
            1. BASIC INFORMATION
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><strong>Full Name:</strong> {formData.name}</p>
              <p><strong>Date of Birth:</strong> {formData.dob}</p>
              <p><strong>Gender:</strong> {formData.gender}</p>
            </div>
            <div>
              <p><strong>Phone No.:</strong> {formData.phone_number}</p>
              <p><strong>Age:</strong> {formData.age}</p>
              <p><strong>Occupation:</strong> {formData.occupation}</p>
            </div>
            <div>
              <p><strong>Aadhar No.:</strong> {formData.adhar_number}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Address:</strong> {formData.address}</p>
              <p><strong>Notes:</strong> {formData.notes}</p>
            </div>
          </div>
        </section>

        {/* Partition 2: Deposit Details */}
        <section className="border border-gray-400 bg-gray-50 p-3 rounded mb-4">
          <h4 className="font-bold underline mb-2 text-[12px]">
            2. DEPOSIT DETAILS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><strong>Saving Account Start Date:</strong> {formData.savingAccountStartDate}</p>
              <p><strong>Deposit Type:</strong> {formData.depositType}</p>
              <p><strong>Deposit Duration (Years):</strong> {formData.depositDurationYears}</p>
            </div>
            <div>
              <p><strong>Fixed Deposit Total Amount:</strong> {formData.fixedDepositTotalAmount}</p>
              <p><strong>Interest Rate (FD %):</strong> {formData.interestRateFD}</p>
              <p><strong>Savings Account Total Amount:</strong> {formData.savingAccountTotalAmount}</p>
              <p><strong>Interest Rate (Savings %):</strong> {formData.interestRateSaving}</p>
            </div>
            <div>
              <p><strong>Recurring Deposit Total Amount:</strong> {formData.recurringDepositTotalAmount}</p>
              <p><strong>Interest Rate (RD %):</strong> {formData.interestRateRecurring}</p>
              <p><strong>Dnyanrudha Investment Total Amount:</strong> {formData.dnyanrudhaInvestmentTotalAmount}</p>
              <p><strong>Dynadhara Rate (%):</strong> {formData.dynadharaRate}</p>
            </div>
          </div>
        </section>

        {/* Declaration */}
        <section className="border border-gray-400 p-3 rounded mb-4 bg-gray-50">
          <p className="italic">
            I hereby solemnly affirm that the information provided above is true and
            correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.
          </p>
          <label className="flex items-center space-x-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={check}
              onChange={handleCheckboxChange}
              className="cursor-pointer accent-green-600"
            />
            <span>I verify and confirm the above declaration.</span>
          </label>
        </section>

        {/* Signature Block */}
        <section className="text-right mt-6 text-[11px]">
          <p>Place: _______________________</p>
          <p>Date: ____ / ____ / ______</p>
          <p><strong>Signature of Applicant</strong></p>
          <p>(Authorized Signatory)</p>
        </section>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8 print:hidden">
        <button
          onClick={onBack}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-[10px] transition"
        >
          Back
        </button>

        <button
          onClick={handleGeneratePDF}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-[10px] flex items-center gap-1 transition"
        >
          <FaFilePdf size={12} /> Generate PDF
        </button>

        <button
          onClick={handleNext}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CaseReview;
