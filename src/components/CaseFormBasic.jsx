import React, { useState, useCallback, useMemo } from "react";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";
import { calculateAgeFromDOB, calculateDOBFromAge } from "../utils/Age";
import { checkExistsEmail } from "../services/applicationService";
import { getUserData } from "../utils/getUserId";

// Validation configuration - FASTEST APPROACH
const VALIDATION_RULES = {
  full_name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    message: "Full name must be 2-100 characters"
  },
  date_of_birth: {
    required: true,
    isFuture: false,
    message: "Date of birth cannot be in future"
  },
  age: {
    required: true,
    min: 1,
    max: 120,
    message: "Age must be between 1-120"
  },
  phone_number: {
    required: true,
    pattern: /^[0-9]{10}$/,
    message: "Phone number must be 10 digits"
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter valid email"
  },
  gender: {
    required: true,
    message: "Gender is required"
  },
  occupation: {
    required: true,
    minLength: 2,
    maxLength: 50,
    message: "Occupation must be 2-50 characters"
  },
  adhar_number: {
    required: true,
    pattern: /^[0-9]{12}$/,
    message: "Aadhar number must be 12 digits"
  },
  address: {
    required: true,
    minLength: 10,
    maxLength: 500,
    message: "Address must be 10-500 characters"
  },
  additional_notes: {
    required: false,
    maxLength: 1000,
    message: "Notes must be under 1000 characters"
  }
};

const BasicInfoForm = ({ formData, handleInputChange, onNext }) => {
  const user = getUserData();
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Memoized user data
  const userEmail = useMemo(() => user?.email?.toLowerCase(), [user]);

  // Ultra-fast field validation
  const validateField = useCallback((name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return null;

    const { required, minLength, maxLength, min, max, pattern, isFuture } = rule;

    if (required && (!value || value.toString().trim() === '')) {
      return rule.message;
    }

    if (value) {
      const strValue = value.toString().trim();

      if (minLength && strValue.length < minLength) return rule.message;
      if (maxLength && strValue.length > maxLength) return rule.message;
      if (min !== undefined && Number(value) < min) return rule.message;
      if (max !== undefined && Number(value) > max) return rule.message;
      if (pattern && !pattern.test(strValue)) return rule.message;
      if (isFuture === false && new Date(value) > new Date()) return rule.message;
    }

    return null;
  }, []);

  // Check if form is completely valid
  const isFormValid = useMemo(() => {
    return Object.keys(VALIDATION_RULES).every(fieldName => {
      const error = validateField(fieldName, formData[fieldName]);
      return !error;
    });
  }, [formData, validateField]);

  // Mark field as touched
  const handleFieldTouch = useCallback((fieldName) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  }, []);

  // Fast field change handler with real-time validation
  const handleFieldChange = useCallback((e) => {
    const { name, value } = e.target;

    handleInputChange(e);

    // Mark field as touched
    handleFieldTouch(name);

    // Validate field in real-time
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [handleInputChange, validateField, handleFieldTouch]);

  // Handle field blur - validate when user leaves field
  const handleFieldBlur = useCallback((e) => {
    const { name, value } = e.target;
    handleFieldTouch(name);

    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField, handleFieldTouch]);

  // Handle DOB change - EXACT ORIGINAL LOGIC with real-time validation
  const handleDOBChange = (e) => {
    const date_of_birth = e.target.value;
    const age = calculateAgeFromDOB(date_of_birth);

    handleInputChange({ target: { name: "date_of_birth", value: date_of_birth } });
    handleInputChange({ target: { name: "age", value: age } });

    // Mark fields as touched
    handleFieldTouch("date_of_birth");
    handleFieldTouch("age");

    // Validate both fields in real-time
    const dobError = validateField("date_of_birth", date_of_birth);
    const ageError = validateField("age", age);

    setFieldErrors(prev => ({
      ...prev,
      date_of_birth: dobError,
      age: ageError
    }));
  };

  // Handle Age change - EXACT ORIGINAL LOGIC with real-time validation
  const handleAgeChange = (e) => {
    const age = e.target.value;
    const date_of_birth = calculateDOBFromAge(age);

    handleInputChange({ target: { name: "age", value: age } });
    handleInputChange({ target: { name: "date_of_birth", value: date_of_birth } });

    // Mark fields as touched
    handleFieldTouch("age");
    handleFieldTouch("date_of_birth");

    // Validate both fields in real-time
    const ageError = validateField("age", age);
    const dobError = validateField("date_of_birth", date_of_birth);

    setFieldErrors(prev => ({
      ...prev,
      age: ageError,
      date_of_birth: dobError
    }));
  };

  // Fast border class calculator - show red border if field is touched and has error
  const getFieldBorderClass = useCallback((fieldName) => {
    return touchedFields[fieldName] && fieldErrors[fieldName] ? 'border-red-500' : 'border-gray-300';
  }, [fieldErrors, touchedFields]);

  // Optimized form submission
  const handleNextClick = async (e) => {
    e.preventDefault();

    // Mark all fields as touched to show all errors
    const allTouched = {};
    Object.keys(VALIDATION_RULES).forEach(fieldName => {
      allTouched[fieldName] = true;
    });
    setTouchedFields(allTouched);

    // Check if form is valid
    if (!isFormValid) {
      // Validate all fields to show errors
      const errors = {};
      Object.keys(VALIDATION_RULES).forEach(fieldName => {
        const error = validateField(fieldName, formData[fieldName]);
        if (error) errors[fieldName] = error;
      });
      setFieldErrors(errors);

      const firstError = Object.values(errors)[0];
      showWarningToast(firstError || "Please fill all required fields correctly");
      return;
    }

    const { email } = formData;

    if (user) formData.isLogin = true;

    setIsCheckingEmail(true);

    try {
      // Skip check if user is editing their own email
      if (user && user.email && user.email.toLowerCase() === email.toLowerCase()) {
        showSuccessToast("Basic information filled successfully!");
        onNext();
        return;
      }

      // Check email existence
      const res = await checkExistsEmail(email);

      if (res.data.exists) {
        showWarningToast("This email is already registered. Please use another one.");
        return;
      }

      showSuccessToast("Basic information filled successfully!");
      onNext();
    } catch (error) {
      console.error("Error checking email:", error);
      showWarningToast("Something went wrong while checking the email.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  return (
    <form
      onSubmit={handleNextClick}
      className="p-4 bg-white rounded shadow-md space-y-4 text-[10px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 - EXACT ORIGINAL DESIGN */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('full_name')}`}
            required
          />

          <label className="font-semibold">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth || ""}
            onChange={handleDOBChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('date_of_birth')}`}
            required
          />

          <label className="font-semibold">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age || ""}
            onChange={handleAgeChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('age')}`}
            min="1"
            max="120"
            required
          />
        </div>

        {/* Column 2 - EXACT ORIGINAL DESIGN */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('phone_number')}`}
            pattern="[0-9]{10}"
            required
          />

          <label className="font-semibold">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('email')}`}
            required
          />

          <label className="font-semibold">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('gender')}`}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Column 3 - EXACT ORIGINAL DESIGN */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Occupation <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="occupation"
            placeholder="Occupation"
            value={formData.occupation || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('occupation')}`}
            required
          />

          <label className="font-semibold">Aadhar Number</label>
          <input
            type="text"
            name="adhar_number"
            placeholder="Aadhar Number"
            value={formData.adhar_number || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('adhar_number')}`}
            pattern="[0-9]{12}"
            required
          />

          <label className="font-semibold">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="address"
            placeholder="Full Address with Pin Code"
            value={formData.address || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] resize-none ${getFieldBorderClass('address')}`}
            rows={1}
            required
          />
        </div>

        {/* Full-width field - EXACT ORIGINAL DESIGN */}
        <div className="md:col-span-3 flex flex-col">
          <label className="font-semibold">Additional Notes</label>
          <textarea
            name="additional_notes"
            placeholder="Any additional information"
            value={formData.additional_notes || ""}
            onChange={handleFieldChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] resize-none ${getFieldBorderClass('additional_notes')}`}
            rows={1}
          />
        </div>
      </div>

      {/* Next button - EXACT ORIGINAL DESIGN with enabled/disabled state */}
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={!isFormValid || isCheckingEmail}
          className={`px-3 py-1 text-white rounded text-[10px] transition-colors ${!isFormValid || isCheckingEmail
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isCheckingEmail ? "Checking..." : "Next"}
        </button>
      </div>
    </form>
  );
};

export default BasicInfoForm;