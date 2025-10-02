import axios from "./axiosInstance";

const base_url = 'http://localhost:5000/api'

export const getAllClients = () => axios.get("/clients");

export const getClientById = (id) => axios.get(`/clients/${id}`);

export const createClient = (data) => axios.post("/clients", data);

export const updateClient = (id, data) => axios.put(`/clients/${id}`, data);

export const deleteClient = (id) => axios.delete(`/clients/${id}`);
