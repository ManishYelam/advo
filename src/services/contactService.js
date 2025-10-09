import axiosInstance from "./axiosInstance";

export const submitContactForm = (data) => axiosInstance.post("/contact/", data);

export const getAllContacts = () => axiosInstance.get("/contact/");

export const getContactById = (id) => axiosInstance.get(`/contact/${id}`);

export const deleteContact = (id) => axiosInstance.delete(`/contact/${id}`);
