import axios from "./axiosInstance";

const base_url = 'http://localhost:5000/api'

export const createPaymentOrder = (data) => axios.post("/payments/create-order", data);

export const verifyPayment = (data) => axios.post("/payments/verify", data);
