import axios from "./axiosInstance";

export const loginService = (data) => axios.post("http://localhost:5000/api/login", data);

export const signupService = (data) => axios.post("http://localhost:5000/api/users", data);

export const logoutService = () => {
  localStorage.removeItem("user");
  return Promise.resolve();
};
