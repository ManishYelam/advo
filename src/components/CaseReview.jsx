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
      filename: `Application_${formData.full_name || "Applicant"}.pdf`,
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
    if (!check) {
      showWarningToast("Please verify the declaration before proceeding.");
      return;
    }

    const element = document.getElementById("printableArea");

    // Configure html2pdf to return PDF as a Blob
    const opt = {
      margin: 10,
      filename: `Application_${formData.full_name || "Applicant"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      returnPromise: true, // ✅ important for getting Blob
    };

    html2pdf()
      .set(opt)
      .from(element)
      .outputPdf('blob') // ✅ generate PDF as Blob
      .then((pdfBlob) => {
        // Store the actual PDF Blob in formData
        const updatedData = {
          ...formData,
          verified: check,
          application_form: pdfBlob, // store PDF directly
        };

        setFormData(updatedData); // update parent
        showSuccessToast("PDF generated and stored successfully!");
        onNext(updatedData); // pass updated data to next step
      })
      .catch(() => showWarningToast("Failed to generate PDF!"));
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded text-[11px] leading-5 print:p-0 print:shadow-none print:border-none print:max-w-full print:mx-0 print:rounded-none">
      {/* Printable Section */}
      <div id="printableArea">
        <header className="text-center font-bold text-[14px] mb-3">
          APPLICATION DETAILS
        </header>
        {/* Top Right Date */}
        <div className="flex justify-between items-center mb-2">
          <div></div> {/* Empty left space for balance */}
          <div className="text-right text-[11px] text-gray-700 italic">
            Date: {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>


        {/* Partition 1: Basic Information */}
        <section className="border border-gray-400 p-3 rounded mb-4">
          <h4 className="font-bold underline mb-2 text-[12px]">
            1. BASIC INFORMATION
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><strong>Full Name:</strong> {formData.full_name}</p>
              <p><strong>Date of Birth:</strong> {formData.date_of_birth}</p>
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
              <p><strong>Notes:</strong> {formData.additional_notes}</p>
            </div>
          </div>
        </section>

        {/* Partition 2: Deposit Details */}
        <section className="border border-gray-400 p-3 rounded mb-4">
          <h4 className="font-bold underline mb-2 text-[12px]">
            2. DEPOSIT DETAILS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><strong>Saving Account Start Date:</strong> {formData.saving_account_start_date}</p>
              <p><strong>Deposit Type:</strong> {formData.deposit_type}</p>
              <p><strong>Deposit Duration (Years):</strong> {formData.deposit_duration_years}</p>
            </div>
            <div>
              <p><strong>Fixed Deposit Total Amount:</strong> {formData.fixed_deposit_total_amount}</p>
              <p><strong>Interest Rate (FD %):</strong> {formData.interest_rate_fd}</p>
              <p><strong>Savings Account Total Amount:</strong> {formData.saving_account_total_amount}</p>
              <p><strong>Interest Rate (Savings %):</strong> {formData.interest_rate_saving}</p>
            </div>
            <div>
              <p><strong>Recurring Deposit Total Amount:</strong> {formData.recurring_deposit_total_amount}</p>
              <p><strong>Interest Rate (RD %):</strong> {formData.interest_rate_recurring}</p>
              <p><strong>Dnyanrudha Investment Total Amount:</strong> {formData.dnyanrudha_investment_total_amount}</p>
              <p><strong>Dynadhara Rate (%):</strong> {formData.dynadhara_rate}</p>
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

        {/* Footer Section */}
        <footer className="mt-6 border-t border-gray-400 pt-2 text-center text-[10px] text-gray-600 italic">
          <p>This is a system-generated document. No manual signature is required.</p>
          <p>
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </footer>

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
          disabled={!formData.isAdmin} // ✅ Disable if not admin
          className={`px-3 py-1 text-white rounded text-[10px] flex items-center gap-1 transition 
              ${formData.isAdmin
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 cursor-not-allowed"
            }`}
        >
          <FaFilePdf size={12} />
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
