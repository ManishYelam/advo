import axiosInstance from "./axiosInstance";

export const saveApplicationData = async (formData, pdfBlob) => {
  try {
    const form = new FormData();
    form.append("data", JSON.stringify(formData));

    if (pdfBlob) {
      form.append("pdfFile", pdfBlob, "Court_Application.pdf");
    }

    const response = await axiosInstance.post("/save-application", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error saving application data:", error);
    return { success: false, message: "Failed to save application data" };
  }
};
