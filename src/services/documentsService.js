import axios from "./axiosInstance";

export const getAllDocuments = () => axios.get("/documents");

export const uploadDocument = (formData) =>
  axios.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocument = (id) => axios.delete(`/documents/${id}`);
