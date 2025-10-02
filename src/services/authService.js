import axios from "./axiosInstance";

const base_url = 'http://localhost:5000/api'

export const loginService = (data) => axios.post(`${base_url}/login`, data);

export const signupService = (data) => axios.post(`${base_url}/users`, data);

export const forgetPasswordService = (email) => axios.post(`${base_url}/forget-password/${email}`);

export const oldChangePasswordService = (data) => axios.post(`${base_url}/change-password`, data);

export const otpChangePasswordService = (email) => axios.post(`${base_url}/reset-password/${email}`);

export const logoutService = async () => {
  try {
    // Get token from localStorage (or wherever you store it)
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token; // adjust if your token field is different

    await axios.post(
      `${base_url}/logout`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Logout API failed:", error.response?.data || error.message);
    // Optional: rethrow error if you want to handle it in UI
  } finally {
    localStorage.removeItem("user");
  }

  return Promise.resolve();
};
