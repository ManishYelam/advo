import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const ExhibitBMultiPage1PDF = () => {
  const pdfRef = useRef();
  const [uploadedDocs, setUploadedDocs] = useState([]); // store uploaded files

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedDocs(files);
  };

  const handleGeneratePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: [0.8, 1, 0.8, 1],
      filename: "Exhibit_B_Multi_Page.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-6">
      {/* File Upload */}
      <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <div
        ref={pdfRef}
        className="bg-white border border-gray-400 w-[8.27in] text-[13px] leading-relaxed"
        style={{
          fontFamily: "Times New Roman",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        {/* Page 1 - Summary Table */}
        <div style={{ pageBreakAfter: "always" }}>
          <h2 className="text-center font-semibold underline mb-4">EXHIBIT - B</h2>
          <p className="text-center mb-4">
            Fix Deposits (FD), Saving Account Details
          </p>

          <table className="w-full border border-black border-collapse text-[12px] mb-6">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-black p-2">No.</th>
                <th className="border border-black p-2">FD Pavati No</th>
                <th className="border border-black p-2">FD Receipt No.</th>
                <th className="border border-black p-2">FD Number</th>
                <th className="border border-black p-2">Deposited Amount</th>
                <th className="border border-black p-2">Tenure (Days)</th>
                <th className="border border-black p-2">Deposit Date</th>
                <th className="border border-black p-2">Maturity Date</th>
                <th className="border border-black p-2">Maturity Amount</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows */}
              <tr>
                <td className="border p-2 text-center">1</td>
                <td className="border p-2 text-center">532432</td>
                <td className="border p-2 text-center">33006231</td>
                <td className="border p-2 text-center">A</td>
                <td className="border p-2 text-center">200000</td>
                <td className="border p-2 text-center">956</td>
                <td className="border p-2 text-center">17/11/2022</td>
                <td className="border p-2 text-center">30/06/2025</td>
                <td className="border p-2 text-center">268099</td>
              </tr>
              {/* Add more rows as needed */}
              <tr>
                <td className="border p-2 text-center" colSpan="8">Total Amount</td>
                <td className="border p-2 text-center">938345</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pages for uploaded documents */}
        {uploadedDocs.map((doc, index) => (
          <div
            key={index}
            style={{
              pageBreakBefore: "always",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "11.69in",
            }}
          >
            <h3 className="text-center font-semibold mb-4">Document {index + 1}</h3>
            {doc.type.startsWith("image") ? (
              <img
                src={URL.createObjectURL(doc)}
                alt={`Document ${index + 1}`}
                style={{ maxWidth: "100%", maxHeight: "90%" }}
              />
            ) : (
              <p className="text-center text-red-600">
                PDF files cannot be previewed in PDF. They will be attached as separate pages.
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleGeneratePDF}
        className="mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
      >
      
      </button>
    </div>
  );
};

export default ExhibitBMultiPage1PDF;
