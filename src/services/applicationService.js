import axios from "axios";
import axiosInstance from "./axiosInstance";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const saveApplicationData = async (formData, pdfArrayBuffer, paymentResponse) => {
  try {
    const updatedFormData = { ...formData, ...paymentResponse };
    const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
    // console.log(updatedFormData)
    const formDataObj = new FormData();
    formDataObj.append("file", pdfBlob, "Court_Application.pdf"); // Must match backend key: 'file'
    formDataObj.append("data", JSON.stringify(updatedFormData)); // Must match req.body.data

    // const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const response = await axios.post(`${baseURL}/users/save-application`, formDataObj, {
      headers: {
        "Content-Type": "multipart/form-data",
        "upload-type": "single",
        "upload-category": "documents",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving application data:", error.response?.data || error.message);
    return { success: false, message: "Failed to save application data" };
  }
};

export const userApplicant = (id) => axiosInstance.get(`${baseURL}/users/${id}`);

export const updateUserApplicant = (id, data) => axios.put(`${baseURL}/users/${id}`, data);

