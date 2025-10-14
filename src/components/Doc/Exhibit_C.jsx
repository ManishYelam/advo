import React, { useRef, useState } from "react";
import html2pdf from "html2pdf.js";

const ApplicationExhibitPDF = () => {
  const [images, setImages] = useState([]);
  const pdfRef = useRef();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileReaders = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );
    Promise.all(fileReaders).then((results) => setImages(results));
  };

  const handleGeneratePDF = () => {
    if (!images.length) return alert("Please upload at least one image.");

    const pdf = html2pdf().set({
      margin: [0.8, 1, 0.8, 1], // top, right, bottom, left in inches
      filename: "Exhibit-C.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    });

    const promises = images.map((img, index) => {
      const div = document.createElement("div");
      div.style.width = "8.27in"; // A4 width
      div.style.height = "11.69in"; // A4 height
      div.style.display = "flex";
      div.style.flexDirection = "column";
      div.style.justifyContent = "flex-start";
      div.style.alignItems = "center";
      div.style.fontFamily = "Times New Roman";
      div.style.boxSizing = "border-box";
      div.style.paddingTop = "1in";

      // Only for the first page, add heading "Exhibit-A"
      if (index === 0) {
        const heading = document.createElement("h1");
        heading.innerText = "Exhibit-C";
        heading.style.textAlign = "center";
        heading.style.fontSize = "20px";
        heading.style.marginBottom = "1rem";
        div.appendChild(heading);
      }

      const imgEl = document.createElement("img");
      imgEl.src = img;
      imgEl.style.maxWidth = "100%";
      imgEl.style.maxHeight = "90%"; // leave space for heading on first page
      div.appendChild(imgEl);

      document.body.appendChild(div);

      return pdf.from(div).toPdf().get("pdf").then(() => {
        document.body.removeChild(div);
        return pdf;
      });
    });

    Promise.all(promises).then(() => pdf.save());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-6">
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={handleGeneratePDF}
        className="mt-6 bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
      >
       
      </button>
    </div>
  );
};

export default ApplicationExhibitPDF;
