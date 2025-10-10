import axiosInstance from "./axiosInstance";

export const createPaymentOrder = (data) => axiosInstance.post("/payments/create-order", data);

export const verifyPayment = (data) => axiosInstance.post("/payments/verify", data);
