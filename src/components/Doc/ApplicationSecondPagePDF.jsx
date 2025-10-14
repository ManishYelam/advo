import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const ApplicationFirstPagePDF = () => {
  const pdfRef = useRef();

  const handleGeneratePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: [0.8, 1, 0.8, 1], // top, right, bottom, left in inches
      filename: "Court_Application_Index.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-6">
      <div
        ref={pdfRef}
        className="bg-white shadow-lg rounded-md border border-gray-400 max-w-3xl w-full text-[13px] leading-relaxed"
        style={{
          paddingLeft: "5rem",
          paddingRight: "5rem",
          paddingTop: "5rem",
          paddingBottom: "5rem",
          fontFamily: "Times New Roman",
        }}
      >
        {/* Header Section */}
        <div className="text-center font-semibold mb-6 leading-6">
          <p className="font-semibold">
            IN THE COURT OF HON'BLE SESSION FOR GREATER
          </p>
          <p>BOMBAY AT, MUMBAI</p>
          <p>SPECIAL COURT FOR PMLA CASES</p>
          <p>CRIMINAL APPLICATION/EXHIBIT NO. ____ OF 2025</p>
          <p>IN SPECIAL CASE NO. ____ OF 2025</p>
          <p>IN</p>
          <p>ECIR/MBZO-1//2025</p>
        </div>

        {/* Parties Section */}
        <div className="my-6 text-left leading-6">
          <p>
            <b>Manish Yelam</b> ….. <span className="ml-1">Applicant</span>
          </p>
          <p className="mt-1">VERSUS</p>
          <p className="mt-1">
            DYANDHARA MULTISTATE CO-OPERATIVE CREDIT SOCIETY ….. <b>Accused</b>
          </p>
          <p className="mt-1">
            DIRECTORATE OF ENFORCEMENT ….. <b>Complainant</b>
          </p>
        </div>
      </div>

      <button
        onClick={handleGeneratePDF}
        className="mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
      >
      
      </button>
    </div>
  );
};

export default ApplicationFirstPagePDF;
