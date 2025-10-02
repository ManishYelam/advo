import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add token if exists
axiosInstance.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const token = JSON.parse(user).token;
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
