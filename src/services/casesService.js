import axios from "./axiosInstance";

const base_url = 'http://localhost:5000/api'

export const getAllCases = () => axios.get("/cases");

export const getCaseById = (id) => axios.get(`/cases/${id}`);

export const createCase = (data) => axios.post("/cases", data);

export const updateCase = (id, data) => axios.put(`/cases/${id}`, data);

export const deleteCase = (id) => axios.delete(`/cases/${id}`);
