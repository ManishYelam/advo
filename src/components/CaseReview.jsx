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
  const { name, dob, gender, phone_number, age, occupation, adhar_number, email, address, notes,
          savingAccountStartDate, depositType, depositDurationYears,
          fixedDepositTotalAmount, interestRateFD, savingAccountTotalAmount, interestRateSaving,
          recurringDepositTotalAmount, interestRateRecurring, dnyanrudhaInvestmentTotalAmount, dynadharaRate } = formData;

  const newWindow = window.open("", "_blank", "width=900,height=700");

  newWindow.document.write(`
    <html>
      <head>
        <title>Application Review - Legal Format</title>
        <style>
          @page { size: A4; margin: 10mm; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; line-height: 1.2; color: #000; text-align: justify; margin:0; padding:0; }
          header { text-align: center; font-size: 14pt; font-weight: bold; margin-bottom: 10px; }
          .partition { border: 1px solid #000; padding: 10px; margin-bottom: 10px; background-color: #fafafa; }
          .partition-title { font-weight: bold; margin-bottom: 5px; text-decoration: underline; }
          .info-line { margin-bottom: 4px; }
          .signature-block { margin-top: 15px; text-align: right; }
          .signature-block div { margin: 2px 0; }
          .verification { margin-top: 10px; padding: 10px; border: 1px solid #000; font-style: italic; }
          .columns { display: flex; gap: 10px; }
          .column { flex: 1; }
        </style>
      </head>
      <body>
        <header>APPLICATION DETAILS</header>

        <!-- Partition 1: Basic Information -->
        <div class="partition">
          <div class="partition-title">1. BASIC INFORMATION</div>
          <div class="columns">
            <div class="column">
              <div class="info-line"><strong>Full Name:</strong> ${name}</div>
              <div class="info-line"><strong>Date of Birth:</strong> ${dob}</div>
              <div class="info-line"><strong>Gender:</strong> ${gender}</div>
            </div>
            <div class="column">
              <div class="info-line"><strong>Phone No.:</strong> ${phone_number}</div>
              <div class="info-line"><strong>Age:</strong> ${age}</div>
              <div class="info-line"><strong>Occupation:</strong> ${occupation}</div>
            </div>
            <div class="column">
              <div class="info-line"><strong>Aadhar No.:</strong> ${adhar_number}</div>
              <div class="info-line"><strong>Email:</strong> ${email}</div>
              <div class="info-line"><strong>Address:</strong> ${address}</div>
              <div class="info-line"><strong>Notes:</strong> ${notes}</div>
            </div>
          </div>
        </div>

        <!-- Partition 2: Deposit Details -->
        <div class="partition">
          <div class="partition-title">2. DEPOSIT DETAILS</div>
          <div class="columns">
            <div class="column">
              <div class="info-line"><strong>Saving Account Starting Date:</strong> ${savingAccountStartDate}</div>
              <div class="info-line"><strong>Deposit Type:</strong> ${depositType}</div>
              <div class="info-line"><strong>Deposit Duration (Years):</strong> ${depositDurationYears}</div>
            </div>
            <div class="column">
              <div class="info-line"><strong>Fixed Deposit Total Amount:</strong> ${fixedDepositTotalAmount}</div>
              <div class="info-line"><strong>Interest Rate (FD %):</strong> ${interestRateFD}</div>
              <div class="info-line"><strong>Savings Account Total Amount:</strong> ${savingAccountTotalAmount}</div>
              <div class="info-line"><strong>Interest Rate (Savings %):</strong> ${interestRateSaving}</div>
            </div>
            <div class="column">
              <div class="info-line"><strong>Recurring Deposit Total Amount:</strong> ${recurringDepositTotalAmount}</div>
              <div class="info-line"><strong>Interest Rate (RD %):</strong> ${interestRateRecurring}</div>
              <div class="info-line"><strong>Dnyanrudha Investment Total Amount:</strong> ${dnyanrudhaInvestmentTotalAmount}</div>
              <div class="info-line"><strong>Dynadhara Rate (%):</strong> ${dynadharaRate}</div>
            </div>
          </div>
        </div>

        <!-- Verification Section -->
        <div class="verification">
          I hereby solemnly affirm that the information provided above is true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.
          <div style="margin-top:6px;"><strong>Declaration Verified ✔</strong></div>
        </div>

        <!-- Signature Block -->
        <div class="signature-block">
          <div>Place: _______________________</div>
          <div>Date: ____ / ____ / ______</div>
          <div><strong>Signature of Applicant</strong></div>
          <div>(Authorized Signatory)</div>
        </div>
      </body>
    </html>
  `);

  newWindow.document.close();
  // newWindow.focus();
  newWindow.print();
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
        <section className="section grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div>
            <h4>1. BASIC INFORMATION</h4>
            <p><strong>Full Name:</strong> {formData.name}</p>
            <p><strong>Date of Birth:</strong> {formData.dob}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>

          </div>

          {/* Column 2 */}
          <div>
            <h4>&nbsp;</h4>
            <p><strong>Phone No.:</strong> {formData.phone_number}</p>
            <p><strong>Age:</strong> {formData.age}</p>

            <p><strong>Occupation:</strong> {formData.occupation}</p>

          </div>

          {/* Column 3 */}
          <div>
            <h4>&nbsp;</h4>
            <p><strong>Aadhar No.:</strong> {formData.adhar_number}</p>
            <p><strong>Email:</strong> {formData.email}</p>

            <p><strong>Address:</strong> {formData.address}</p>
            <p><strong>Additional Notes:</strong> {formData.notes}</p>
          </div>
        </section>

        <section className="section grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div>
            <h4>2. DEPOSIT DETAILS</h4>
            <p><strong>Saving Account Starting Date:</strong> {formData.savingAccountStartDate}</p>
            <p><strong>Deposit Type:</strong> {formData.depositType}</p>
            <p><strong>Deposit Duration (Years):</strong> {formData.depositDurationYears}</p>
          </div>

          {/* Column 2 */}
          <div>
            <h4>&nbsp;</h4>
            <p><strong>Fixed Deposit Total Amount:</strong> {formData.fixedDepositTotalAmount}</p>
            <p><strong>Interest Rate (FD %):</strong> {formData.interestRateFD}</p>
            <p><strong>Savings Account Total Amount:</strong> {formData.savingAccountTotalAmount}</p>
            <p><strong>Interest Rate (Savings %):</strong> {formData.interestRateSaving}</p>
          </div>

          {/* Column 3 */}
          <div>
            <h4>&nbsp;</h4>
            <p><strong>Recurring Deposit Total Amount:</strong> {formData.recurringDepositTotalAmount}</p>
            <p><strong>Interest Rate (RD %):</strong> {formData.interestRateRecurring}</p>
            <p><strong>Dnyanrudha Investment Total Amount:</strong> {formData.dnyanrudhaInvestmentTotalAmount}</p>
            <p><strong>Dynadhara Rate (%):</strong> {formData.dynadharaRate}</p>
          </div>
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
