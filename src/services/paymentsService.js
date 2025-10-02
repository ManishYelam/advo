import axios from "./axiosInstance";

export const createPaymentOrder = (data) => axios.post("/payments/create-order", data);

export const verifyPayment = (data) => axios.post("/payments/verify", data);
