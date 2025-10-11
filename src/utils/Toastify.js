import { toast } from "react-toastify";

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, {
    ...options,
  });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, {
    ...options,
  });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, {
    ...options,
  });
};

export const showWarningToast = (message, options = {}) => {
  toast.warning(message, {
    ...options,
  });
};

export const showDefaultToast = (message, options = {}) => {
  toast(message, {
    ...options,
  });
};
