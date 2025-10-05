// axiosInstance.js
import axios from "axios";

// Create an instance of Axios with base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include Authorization token if available
axiosInstance.interceptors.request.use((config) => {
  // Try to get the user from localStorage
  const user = localStorage.getItem("user");

  if (user) {
    try {
      const parsedUser = JSON.parse(user);
      const token = parsedUser?.token; 

      // If token exists, add it to the Authorization header
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage", error);
    }
  }

  return config;
}, (error) => {
  // Request error handling
  console.error("Error in request interceptor", error);
  return Promise.reject(error); // Reject the promise with the error
});

// Add a response interceptor to handle API errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // If the response is successful, simply return the response
    return response;
  },
  (error) => {
    // Log any response errors (like 401, 403 for unauthorized access)
    if (error.response) {
      console.error("API Error: ", error.response.data);
      // Handle specific error codes here if needed
      if (error.response.status === 401) {
        // Token expired or unauthorized, logout the user or redirect
        localStorage.removeItem("user"); // Clear invalid user data
        // window.location.href = "/login"; // Redirect to login page
      }
    } else {
      console.error("Error with request or network", error);
    }

    return Promise.reject(error); // Reject with error so it can be handled in the component
  }
);

export default axiosInstance;
