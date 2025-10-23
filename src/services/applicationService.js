import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

export const saveApplicationData = async (applicationData) => {
  try {
    const formData = new FormData();

    // 1. Add all form data as JSON string
    const { application_form, documents, ...otherData } = applicationData;
    formData.append('applicationData', JSON.stringify(otherData));

    // 2. Add application form PDF
    if (application_form && application_form instanceof File) {
      formData.append('applicationForm', application_form);
    }

    // 3. Add all exhibit documents
    if (documents && typeof documents === 'object') {
      Object.entries(documents).forEach(([exhibit, files]) => {
        if (Array.isArray(files)) {
          files.forEach((docObject, index) => {
            if (docObject && docObject.file && docObject.file instanceof File) {
              formData.append('documents', docObject.file);
              formData.append(
                'documentMetadata',
                JSON.stringify({
                  exhibit,
                  fileName: docObject.file.name,
                  fileType: docObject.file.type,
                  originalName: docObject.originalName,
                  documentId: docObject.id,
                  index,
                })
              );
            }
          });
        }
      });
    }

    const response = await api.post('/users/save-application', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
      },
    });

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to save application');
    } else if (error.request) {
      throw new Error('Network error: Could not connect to server');
    } else {
      throw new Error('Failed to save application');
    }
  }
};

export const updateApplicationData = async (applicationId, applicationData) => {
  try {
    const formData = new FormData();

    // 1️⃣ Extract fields
    const { application_form, documents, ...otherData } = applicationData;
    formData.append('applicationData', JSON.stringify(otherData));

    // 2️⃣ Include updated application form (if a new file is uploaded)
    if (application_form && application_form instanceof File) {
      formData.append('applicationForm', application_form);
    }

    // 3️⃣ Include updated or new exhibit documents
    if (documents && typeof documents === 'object') {
      Object.entries(documents).forEach(([exhibit, files]) => {
        if (Array.isArray(files)) {
          files.forEach((docObject, index) => {
            if (docObject && docObject.file && docObject.file instanceof File) {
              formData.append('documents', docObject.file);
              formData.append(
                'documentMetadata',
                JSON.stringify({
                  exhibit,
                  fileName: docObject.file.name,
                  fileType: docObject.file.type,
                  originalName: docObject.originalName,
                  documentId: docObject.id,
                  index,
                })
              );
            }
          });
        }
      });
    }

    // 4️⃣ Send update request
    const response = await api.put(`/users/update-application/${applicationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload Progress: ${progress}%`);
      },
    });

    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to update application');
    } else if (error.request) {
      throw new Error('Network error: Could not connect to server');
    } else {
      throw new Error('Failed to update application');
    }
  }
};

// import axios from "axios";

// const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// export const saveApplicationData = async (applicationData) => {
//   try {
//     const response = await axios.post(`${baseURL}/users/save-application`, applicationData);
//     return response;
//   } catch (error) {
//     console.error("Error saving application:", error);
//     throw error;
//   }
// };

export const checkExistsEmail = (email) => axios.post(`${baseURL}/users/email`, { email });

export const userApplicant = (id) => axios.get(`${baseURL}/users/${id}`);

export const updateUserApplicant = (id, data) => axios.put(`${baseURL}/users/${id}`, data);

