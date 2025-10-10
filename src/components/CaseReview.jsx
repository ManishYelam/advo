import React from "react";

const CaseReview = ({ formData, onNext, onBack }) => {
  const handlePrint = () => {
    const printContents = document.getElementById("printableArea").innerHTML;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Application Review</title>
          <style>
            body {
              font-family: "Times New Roman", Times, serif;
              font-size: 10px;
              line-height: 1.4;
              color: #000;
              margin: 1in;
            }
            h3 {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              text-decoration: underline;
              margin-bottom: 16px;
            }
            h4 {
              font-size: 13px;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
              margin-bottom: 8px;
            }
            p, ul, li {
              margin: 4px 0;
              font-size: 10px;
            }
            ul {
              list-style-type: disc;
              margin-left: 20px;
              margin-bottom: 8px;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded print:p-0 print:shadow-none print:border-none print:max-w-full print:mx-0 print:rounded-none text-[10px] leading-4">
      <div id="printableArea">
        <h3 className="text-center">Application Review</h3>

        {/* Basic Information */}
        <section className="mb-4">
          <h4>Basic Information</h4>
          <p><strong>Full Name:</strong> {formData.name}</p>
          <p><strong>Surname / Ape:</strong> {formData.surname}</p>
          <p><strong>Occupation:</strong> {formData.occupation}</p>
          <p><strong>Address:</strong> {formData.address}</p>
        </section>

        {/* Deposit Details */}
        <section className="mb-4">
          <h4>Deposit Details</h4>
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

        {/* Verification */}
        <section className="mb-4">
          <h4>Verification</h4>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.verified || false}
              onChange={(e) => formData.setVerified(e.target.checked)}
            />
            <span>I verify that all the above details are correct</span>
          </label>
        </section>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 print:hidden space-x-2">
        <button
          onClick={onBack}
          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-[10px] transition"
        >
          Back
        </button>
        <button
          onClick={handlePrint}
          className="px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900 text-[10px] transition"
        >
          Print
        </button>
        <button
          onClick={onNext}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px] transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CaseReview;
