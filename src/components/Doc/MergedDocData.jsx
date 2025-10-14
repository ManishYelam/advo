import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

// Import your content components
import ApplicationFirstPagePDF from "./ApplicationFirstPagePDF";
import ApplicationSecondPagePDF from "./ApplicationSecondPagePDF";
import VerificationPDF from "./VerificationPDF";
import ListOfDoc from "./ListOfDoc";
import Exhibit_A from "./Exhibit_A";
import ExhibitBMultiPage2PDF from "./Exhibit_B";
import Exhibit_C from "./Exhibit_C";

const MergedDocData = () => {
  const pdfRef = useRef();

  const handleGeneratePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: [0.8, 0.8, 0.8, 0.8], // top, right, bottom, left in inches
      filename: "Complete_Application.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10 px-6 overflow-y-auto">
      <div
        ref={pdfRef}
        className="bg-white w-full max-w-5xl text-[13px] leading-relaxed"
        style={{
          fontFamily: "Times New Roman",
          boxSizing: "border-box",
        }}
      >
        {/* All sections in order with page breaks for PDF */}
        <ApplicationFirstPagePDF />
        <div style={{ pageBreakAfter: "always" }} />

        <ApplicationSecondPagePDF />
        <div style={{ pageBreakAfter: "always" }} />

        <VerificationPDF />
        <div style={{ pageBreakAfter: "always" }} />

        <ListOfDoc />
        <div style={{ pageBreakAfter: "always" }} />

        <Exhibit_A />
        <div style={{ pageBreakAfter: "always" }} />

        <ExhibitBMultiPage2PDF />
        <div style={{ pageBreakAfter: "always" }} />

        <Exhibit_C />
      </div>

      <button
        onClick={handleGeneratePDF}
        className="mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
      >
        Download Complete PDF
      </button>
    </div>
  );
};

export default MergedDocData;
