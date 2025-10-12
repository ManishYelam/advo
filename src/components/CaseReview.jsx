import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";
import { showWarningToast, showSuccessToast } from "../utils/Toastify";

const CaseReview = ({ formData, setFormData, onNext, onBack }) => {
  const [check, setCheck] = useState(formData.verified || false);

  // ✅ Handle checkbox verification
  const handleCheckboxChange = (e) => {
    const verified = e.target.checked;

    setCheck(verified); // Update local state
    setFormData((prev) => ({ ...prev, verified })); // Update formData correctly

    if (verified) {
      showSuccessToast("Declaration verified successfully!");
    } else {
      showWarningToast("Declaration unchecked!");
    }
  };

  // ✅ Handle printing
  const handlePrint = () => {
    const printContents = document.getElementById("printableArea").innerHTML;
    const newWindow = window.open("", "_blank", "width=900,height=700");
    newWindow.document.write(`
      <html>
        <head>
          <title>Application Review - Legal Format</title>
          <style>
            @page { size: A4; margin: 1in 1in 1in 1.25in; }
            body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.5; color: #000; text-align: justify; background-color: #fff; }
            header { text-align: center; margin-bottom: 20px; font-size: 14pt; font-weight: bold; text-transform: uppercase; border-bottom: 2px solid #000; padding-bottom: 6px; }
            h3 { font-size: 13pt; text-align: center; text-transform: uppercase; font-weight: bold; text-decoration: underline; margin-bottom: 20px; }
            h4 { font-size: 12pt; font-weight: bold; text-decoration: underline; margin-top: 16px; margin-bottom: 8px; }
            p { margin: 4px 0; font-size: 11pt; text-align: justify; }
            .section { margin-bottom: 18px; }
            .signature-block { margin-top: 40px; text-align: right; font-size: 11pt; }
            .signature-block p { margin: 2px 0; }
            footer { position: fixed; bottom: 20px; left: 0; right: 0; text-align: center; font-size: 10pt; color: #555; }
            .verification { margin-top: 20px; padding: 10px; border: 1px solid #000; font-style: italic; }
            .border-box { border: 1px solid #000; padding: 15px; border-radius: 4px; background-color: #fafafa; }
          </style>
        </head>
        <body>
          <header>IN THE HONOURABLE COURT OF JUSTICE</header>
          <h3>APPLICATION REVIEW</h3>
          <div class="border-box">${printContents}</div>
          <div class="signature-block">
            <p>Place: _______________________</p>
            <p>Date: ____ / ____ / ______</p>
            <br/><br/>
            <p><strong>Signature of Applicant</strong></p>
            <p>(Authorized Signatory)</p>
          </div>
          <footer>*This document is electronically generated for court submission purposes*</footer>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    // newWindow.print();
    // newWindow.close();

    showSuccessToast("Legal copy sent to printer successfully!");
  };

  // ✅ Validation before proceeding
  const handleNext = () => {
    if (check) {
      showSuccessToast("Declaration verified successfully!");
      onNext(); // Proceed automatically
    } else {
      showWarningToast("Please verify the declaration before proceeding.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded text-[11px] leading-5 print:p-0 print:shadow-none print:border-none print:max-w-full print:mx-0 print:rounded-none">
      <div id="printableArea">
        <section className="section">
          <h4>1. BASIC INFORMATION</h4>
          <p><strong>Full Name:</strong> {formData.name}</p>
          <p><strong>Surname / Ape:</strong> {formData.surname}</p>
          <p><strong>Occupation:</strong> {formData.occupation}</p>
          <p><strong>Address:</strong> {formData.address}</p>
        </section>

        <section className="section">
          <h4>2. DEPOSIT DETAILS</h4>
          <p><strong>Saving Account Starting Date:</strong> {formData.savingAccountStartDate}</p>
          <p><strong>Deposit Type:</strong> {formData.depositType}</p>
          <p><strong>Deposit Duration (Years):</strong> {formData.depositDurationYears}</p>
          <p><strong>Fixed Deposit Total Amount:</strong> {formData.fixedDepositTotalAmount}</p>
          <p><strong>Interest Rate (FD %):</strong> {formData.interestRateFD}</p>
          <p><strong>Savings Account Total Amount:</strong> {formData.savingAccountTotalAmount}</p>
          <p><strong>Interest Rate (Savings %):</strong> {formData.interestRateSaving}</p>
          <p><strong>Recurring Deposit Total Amount:</strong> {formData.recurringDepositTotalAmount}</p>
          <p><strong>Interest Rate (RD %):</strong> {formData.interestRateRecurring}</p>
          <p><strong>Dnyanrudha Investment Total Amount:</strong> {formData.dnyanrudhaInvestmentTotalAmount}</p>
          <p><strong>Dynadhara Rate (%):</strong> {formData.dynadharaRate}</p>
        </section>

        <section className="section verification">
          <p>
            I hereby solemnly affirm that the information provided above is true and
            correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.
          </p>
          <label className="flex items-center space-x-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={check}
              onChange={handleCheckboxChange}
              className="cursor-pointer"
            />
            <span>I verify and confirm the above declaration.</span>
          </label>
        </section>
      </div>

      <div className="flex justify-between mt-8 print:hidden">
        <button
          onClick={onBack}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-[10px] transition"
        >
          Back
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 text-[10px] flex items-center gap-1 transition"
        >
          <FaPrint size={12} />
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
