import axios from "./axiosInstance";

const base_url = 'http://localhost:5000/api'

export const getAllDocuments = () => axios.get("/documents");

export const uploadDocument = (formData) =>
  axios.post("/documents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteDocument = (id) => axios.delete(`/documents/${id}`);
