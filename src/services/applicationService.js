import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const saveApplicationData = async (applicationData) => {
  try {
    const response = await axios.post(`${baseURL}/users/save-application`, applicationData);
    console.log("-------------------------------------------------", applicationData);
    console.log("-------------------------------------------------", response);

    return response;
  } catch (error) {
    console.error("Error saving application:", error);
    throw error;
  }
};


export const checkExistsEmail = (email) => axios.post(`${baseURL}/users/email`, { email });

export const userApplicant = (id) => axiosInstance.get(`${baseURL}/users/${id}`);

export const updateUserApplicant = (id, data) => axios.put(`${baseURL}/users/${id}`, data);

