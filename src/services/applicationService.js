import axiosInstance from "./axiosInstance";

export const saveApplicationData = async (formData, pdfArrayBuffer, paymentResponse) => {
  try {
    const updatedformdata = { ...formData, ...paymentResponse }
    console.log(updatedformdata);
    console.log(pdfArrayBuffer);
    
    
    const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });

    const formDataObj = new FormData();
    formDataObj.append("pdf", pdfBlob, "Court_Application.pdf");
    formDataObj.append("data", JSON.stringify(updatedformdata));

    const response = await axiosInstance.post("/users/save-application", formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
        "upload-type": "single",
        "upload-category": "documents",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving application data:", error);
    return { success: false, message: "Failed to save application data" };
  }
};
