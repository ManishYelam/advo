import axios from "axios";

const axiosInstance = axios.create({ baseURL: "http://localhost:5000/api", headers: { "Content-Type": "application/json", }, });

axiosInstance.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token;
      if (token) { config.headers["Authorization"] = `Bearer ${token}`; }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    }
  }
  return config;
}, (error) => {
  console.error("Error in request interceptor", error);
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("API Error: ", error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem("user"); 
        window.location.href = "/login";
      }
    } else {
      console.error("Error with request or network", error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
