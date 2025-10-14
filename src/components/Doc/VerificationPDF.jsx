import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const VerificationPDF = () => {
  const pdfRef = useRef();

  const handleGeneratePDF = () => {
    const element = pdfRef.current;
    const opt = {
      margin: [0.8, 1, 0.8, 1], // top, right, bottom, left (in inches)
      filename: "Court_Application_Verification.pdf",
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
        className="bg-white border border-gray-400 w-[8.27in] h-[11.69in] text-[13px] leading-relaxed"
        style={{
          fontFamily: "Times New Roman",
          display: "flex",
          flexDirection: "column",
          padding: "2in 1in",
          boxSizing: "border-box",
        }}
      >
        {/* Verification Section */}
        <div className="text-left leading-7">
          <h2 className="text-center font-semibold underline mb-6">Verification</h2>

          <p>
            I, <b>Saraswati Ashok Sagar</b>, aged about 58 years, Indian Inhabitant, 
            Occ: Residing at - Type 3, IITM Colony, Pashan Panchvati Road, near NCL, 
            Panchvati Pashan, Pune city, N.C.L Pune, PUNE MAHARASHTRA, 411008, the application 
            abovenamed, do hereby solemnly declare, that what is stated in paragraph nos of the 
            foregoing application are true to my own knowledge and I believe the same to be true.
          </p>

          <p className="mt-8">
            In witness whereof, I have set my hands to this writing on this day of July 2025.
          </p>

          <div className="mt-16 text-left">
            <p>BOMBAY, dated 18 DAY OF MAY 2025</p>
          </div>
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

export default VerificationPDF;
