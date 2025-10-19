import axiosInstance from "./axiosInstance";

export const loginService = (data) => axiosInstance.post(`/login`, data);

export const signupService = (data) => axiosInstance.post(`/users`, data);

export const forgetPasswordService = (email) => axiosInstance.post(`/forget-password/${email}`);

export const oldChangePasswordService = (data) => axiosInstance.post(`/change-password`, data);

export const changePasswordWithOtp = (data) => axiosInstance.post(`/change-password-otp`, data);

export const otpChangePasswordService = (email) => axiosInstance.post(`/reset-password/${email}`);

export const logoutService =  () =>  axiosInstance.post(`/logout`);
