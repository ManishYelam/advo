import React from "react";

const CaseReview = ({ formData, onNext, onBack }) => {
  const handlePrint = () => {
    const printContents = document.getElementById("printableArea").innerHTML;
    const newWindow = window.open("", "_blank", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Case Review</title>
          <style>
            @page {
              margin: 1in;
            }
            body {
              font-family: "Times New Roman", Times, serif;
              font-size: 7.5pt; /* approx 10px */
              color: #000;
              line-height: 1.4;
              margin: 0;
              padding: 1in;
            }
            h3 {
              font-size: 12pt; /* approx 16px */
              font-weight: bold;
              margin-bottom: 16px;
              text-align: center;
              text-decoration: underline;
            }
            h4 {
              font-size: 10pt; /* approx 13px */
              font-weight: bold;
              margin-bottom: 8px;
              border-bottom: 1px solid #000;
              padding-bottom: 2px;
            }
            p, ul, li {
              margin: 4px 0;
              font-size: 7.5pt; /* approx 10px */
            }
            ul {
              list-style-type: disc;
              margin-left: 20px;
              margin-bottom: 8px;
            }
            li {
              margin-bottom: 4px;
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
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded print:p-0 print:shadow-none print:border-none print:max-w-full print:mx-0 print:rounded-none" style={{ fontSize: "10px", lineHeight: 1.4, fontFamily: '"Times New Roman", Times, serif' }}>
      <div id="printableArea">
        <h3 className="text-2xl font-semibold mb-6 text-center border-b pb-2 print:text-3xl print:mb-8" style={{ fontSize: "16px", fontWeight: "bold", textDecoration: "underline", marginBottom: "16px", textAlign: "center" }}>
          Case Review
        </h3>

        <div className="mb-4 print:mb-6" style={{ marginBottom: "12px" }}>
          <h4 className="font-semibold text-lg mb-1 print:text-xl" style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "8px" }}>
            Basic Information
          </h4>
          <p><strong>Case Name:</strong> {formData.caseName}</p>
          <p><strong>Age:</strong> {formData.age}</p>
        </div>

        <div className="mb-4 print:mb-6" style={{ marginBottom: "12px" }}>
          <h4 className="font-semibold text-lg mb-1 print:text-xl" style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "8px" }}>
            Case Details
          </h4>
          <p><strong>Next Hearing Date:</strong> {formData.nextDate}</p>
          <p><strong>Advocate:</strong> {formData.advocate}</p>
          <p><strong>Case Type:</strong> {formData.caseType}</p>
        </div>

        <div className="mb-4 print:mb-6" style={{ marginBottom: "12px" }}>
          <h4 className="font-semibold text-lg mb-1 print:text-xl" style={{ fontSize: "13px", fontWeight: "bold", borderBottom: "1px solid #000", paddingBottom: "2px", marginBottom: "8px" }}>
            Documents Uploaded
          </h4>
          {formData.documents.length > 0 ? (
            <ul className="list-disc list-inside" style={{ marginLeft: "20px", marginBottom: "8px" }}>
              {formData.documents.map((doc, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>{doc.name || doc.fileName || `Document ${idx + 1}`}</li>
              ))}
            </ul>
          ) : (
            <p>No documents uploaded</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-8 print:hidden" style={{ marginTop: "16px" }}>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          style={{ fontSize: "10px" }}
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          style={{ fontSize: "10px" }}
        >
          Next
        </button>
      </div>

      <div className="mt-6 text-center print:hidden" style={{ marginTop: "24px" }}>
        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-gray-700 rounded hover:bg-gray-200"
          style={{ fontSize: "10px" }}
        >
          Print this Review
        </button>
      </div>
    </div>
  );
};

export default CaseReview;
