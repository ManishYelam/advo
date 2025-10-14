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

        {/* Title */}
        <h2 className="text-center font-bold underline mb-4">INDEX</h2>

        {/* Table Section */}
        <table className="w-full border border-black border-collapse text-[12px] mb-6">
          <thead>
            <tr>
              <th className="border border-black p-2 text-center w-16">SR. No.</th>
              <th className="border border-black p-2 text-center">PARTICULARS</th>
              <th className="border border-black p-2 text-center w-24">EXHIBIT No.</th>
              <th className="border border-black p-2 text-center w-24">PAGE No.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 text-center">1</td>
              <td className="border border-black p-2">Application</td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center">1</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">2</td>
              <td className="border border-black p-2">List of Documents</td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center">1–6</td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">3</td>
              <td className="border border-black p-2">
                Copy of the slip of Account started on 17.11.2022
              </td>
              <td className="border border-black p-2 text-center">A</td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">4</td>
              <td className="border border-black p-2">
                Copy of the Deposits Amount by Applicant to the said bank
              </td>
              <td className="border border-black p-2 text-center">B</td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">5</td>
              <td className="border border-black p-2">
                Copy of the statement by Applicant to Shrirampur Police Station
              </td>
              <td className="border border-black p-2 text-center">C</td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">6</td>
              <td className="border border-black p-2">Memorandum of Address</td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">7</td>
              <td className="border border-black p-2">
                Affidavit-in-Support of the Application
              </td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
            <tr>
              <td className="border border-black p-2 text-center">8</td>
              <td className="border border-black p-2">Vakalatnama</td>
              <td className="border border-black p-2 text-center"></td>
              <td className="border border-black p-2 text-center"></td>
            </tr>
          </tbody>
        </table>

        {/* Footer Section */}
        <div className="flex justify-between text-[12px] mt-6">
          <div>
            <p><b>Place:</b> Mumbai</p>
            <p><b>Date:</b> 13/10/2025</p>
          </div>
          <div className="text-right">
            <p>___________________________</p>
            <p>Advocate for the Applicant</p>
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

export default ApplicationFirstPagePDF;
