import axiosInstance from "./axiosInstance";

export const getAllCases = (data) => axiosInstance.post(`/case/`, data);

export const getCaseById = (id) => axios.get(`/cases/${id}`);

export const createCase = (data) => axios.post("/cases", data);

export const updateCase = (id, data) => axios.put(`/cases/${id}`, data);

export const deleteCase = (id) => axios.delete(`/cases/${id}`);
