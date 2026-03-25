import axiosInstance from "./axiosInstance";

export const getAllClients = () => axiosInstance.get("/clients");

export const getClientById = (id) => axiosInstance.get(`/users/${id}`);

export const createClient = (data) => axiosInstance.post("/clients", data);

export const updateClientstatus = (id, data) => axiosInstance.put(`/users/${id}`, data);

export const deleteClient = (id) => axiosInstance.delete(`/clients/${id}`);
