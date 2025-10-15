import axios from "axios";
import { generateCourtApplicationPDF } from "../utils/generateCourtApplicationPDF";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const saveApplicationData = async (formData) => {
  try {
    console.log("📦 Application form data:", formData);

    // ✅ Generate the combined application PDF
    const pdfArrayBuffer = await generateCourtApplicationPDF(formData);
    const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });

    console.log(pdfArrayBuffer);
    console.log(pdfBlob);

    // 4️⃣ Trigger PDF download
    if (pdfArrayBuffer) {
      const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Court_Application.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 300); // slightly longer timeout for safety
    }

    // ✅ Prepare multipart form data
    const fd = new FormData();
    fd.append("file", pdfBlob, "Court_Application.pdf"); // main PDF file
    fd.append("data", JSON.stringify(formData)); // stringified data

    // ✅ If image is present, append it
    if (formData.image) {
      fd.append("image", formData.image); // `formData.image` must be a File object
    }

    // ✅ Debug log
    for (let [key, value] of fd.entries()) {
      console.log("🧩", key, value);
    }

    // ✅ Upload to backend with required headers
    const response = await axios.post(`${baseURL}/users/save-application`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
        "upload-type": "single",
        "upload-category": "documents",
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error saving application:", error.response?.data || error.message);
    return { success: false, message: "Failed to save application data" };
  }
};

export const userApplicant = (id) => axios.get(`${baseURL}/users/${id}`);

export const updateUserApplicant = (id, data) => axios.put(`${baseURL}/users/${id}`, data);

