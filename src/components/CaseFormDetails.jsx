import React, { useState, useCallback, useMemo } from "react";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";

// Validation configuration - ALL FIELDS MANDATORY
const VALIDATION_RULES = {
  saving_account_start_date: {
    required: true,
    message: "Saving account start date is required"
  },
  deposit_type: {
    required: true,
    message: "Deposit type is required"
  },
  deposit_duration_years: {
    required: true,
    min: 0,
    max: 50,
    message: "Duration must be between 0-50 years"
  },
  fixed_deposit_total_amount: {
    required: true,
    min: 0,
    message: "Fixed deposit amount is required and cannot be negative"
  },
  interest_rate_fd: {
    required: true,
    min: 0,
    max: 100,
    message: "FD interest rate is required and must be between 0-100%"
  },
  saving_account_total_amount: {
    required: true,
    min: 0,
    message: "Savings account amount is required and cannot be negative"
  },
  interest_rate_saving: {
    required: true,
    min: 0,
    max: 100,
    message: "Savings interest rate is required and must be between 0-100%"
  },
  recurring_deposit_total_amount: {
    required: true,
    min: 0,
    message: "Recurring deposit amount is required and cannot be negative"
  },
  interest_rate_recurring: {
    required: true,
    min: 0,
    max: 100,
    message: "RD interest rate is required and must be between 0-100%"
  },
  dnyanrudha_investment_total_amount: {
    required: true,
    min: 0,
    message: "Dnyanrudha investment amount is required and cannot be negative"
  },
  dynadhara_rate: {
    required: true,
    min: 0,
    max: 100,
    message: "Dynadhara rate is required and must be between 0-100%"
  }
};

const NUMERIC_FIELDS = [
  'deposit_duration_years',
  'fixed_deposit_total_amount',
  'interest_rate_fd',
  'saving_account_total_amount',
  'interest_rate_saving',
  'recurring_deposit_total_amount',
  'interest_rate_recurring',
  'dnyanrudha_investment_total_amount',
  'dynadhara_rate'
];

const DepositDetailsForm = ({ formData, handleInputChange, onNext, onBack }) => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);

  // Field validation
  const validateField = useCallback((name, value) => {
    const rule = VALIDATION_RULES[name];
    if (!rule) return null;

    const { required, min, max } = rule;

    if (required && (value === undefined || value === null || value === '')) {
      return rule.message;
    }

    if (value !== undefined && value !== null && value !== '') {
      const numValue = Number(value);
      
      if (min !== undefined && numValue < min) return rule.message;
      if (max !== undefined && numValue > max) return rule.message;
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

  // Input change handler
  const handleEnhancedInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Update form data
    handleInputChange({ 
      target: { 
        name, 
        value: NUMERIC_FIELDS.includes(name) ? value : value
      } 
    });

    // Mark field as touched
    handleFieldTouch(name);

    // Validate field in real-time
    const error = validateField(name, value);
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [handleInputChange, handleFieldTouch, validateField]);

  // Handle field blur
  const handleFieldBlur = useCallback((e) => {
    const { name, value } = e.target;
    handleFieldTouch(name);
    
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [handleFieldTouch, validateField]);

  // Border class calculator - red border for invalid touched fields
  const getFieldBorderClass = useCallback((fieldName) => {
    return touchedFields[fieldName] && fieldErrors[fieldName] ? 'border-red-500' : 'border-gray-300';
  }, [fieldErrors, touchedFields]);

  const mandatoryLabel = (label) => (
    <>
      {label} <span className="text-red-500">*</span>
    </>
  );

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

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccessToast("Deposit details filled successfully!");
      onNext();
    } catch (error) {
      console.error("Error processing deposit details:", error);
      showWarningToast("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    onBack();
  };

  return (
    <form
      onSubmit={handleNextClick}
      className="p-4 bg-white rounded shadow-md space-y-4 text-[10px]"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 - Basic Deposit Info */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {mandatoryLabel("Saving Account Starting Date")}
          </label>
          <input
            type="date"
            name="saving_account_start_date"
            value={formData.saving_account_start_date || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('saving_account_start_date')}`}
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Deposit Type")}
          </label>
          <select
            name="deposit_type"
            value={formData.deposit_type || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('deposit_type')}`}
            required
          >
            <option value="">Select Deposit Type</option>
            <option value="Fixed Deposit">Fixed Deposit</option>
            <option value="Savings Account Deposit">Savings Account Deposit</option>
            <option value="Recurring Deposit">Recurring Deposit</option>
            <option value="Investment Scheme (Exhibit A)">
              Investment Scheme (Exhibit A)
            </option>
          </select>

          <label className="font-semibold">
            {mandatoryLabel("Deposit Duration (Years)")}
          </label>
          <input
            type="number"
            name="deposit_duration_years"
            placeholder="Duration in Years"
            value={formData.deposit_duration_years || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('deposit_duration_years')}`}
            min="0"
            max="50"
            step="1"
            required
          />
        </div>

        {/* Column 2 - FD and Savings Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {mandatoryLabel("Fixed Deposit Total Amount")}
          </label>
          <input
            type="number"
            name="fixed_deposit_total_amount"
            placeholder="₹ FD Total Amount"
            value={formData.fixed_deposit_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('fixed_deposit_total_amount')}`}
            min="0"
            step="1"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Interest Rate (FD %)")}
          </label>
          <input
            type="number"
            name="interest_rate_fd"
            placeholder="FD Interest Rate %"
            value={formData.interest_rate_fd || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('interest_rate_fd')}`}
            min="0"
            max="100"
            step="0.01"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Savings Account Total Amount")}
          </label>
          <input
            type="number"
            name="saving_account_total_amount"
            placeholder="₹ Savings Total Amount"
            value={formData.saving_account_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('saving_account_total_amount')}`}
            min="0"
            step="1"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Interest Rate (Savings %)")}
          </label>
          <input
            type="number"
            name="interest_rate_saving"
            placeholder="Savings Interest Rate %"
            value={formData.interest_rate_saving || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('interest_rate_saving')}`}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>

        {/* Column 3 - RD and Investment Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {mandatoryLabel("Recurring Deposit Total Amount")}
          </label>
          <input
            type="number"
            name="recurring_deposit_total_amount"
            placeholder="₹ RD Total Amount"
            value={formData.recurring_deposit_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('recurring_deposit_total_amount')}`}
            min="0"
            step="1"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Interest Rate (RD %)")}
          </label>
          <input
            type="number"
            name="interest_rate_recurring"
            placeholder="RD Interest Rate %"
            value={formData.interest_rate_recurring || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('interest_rate_recurring')}`}
            min="0"
            max="100"
            step="0.01"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Dnyanrudha Investment Total Amount")}
          </label>
          <input
            type="number"
            name="dnyanrudha_investment_total_amount"
            placeholder="₹ Investment Total Amount"
            value={formData.dnyanrudha_investment_total_amount || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('dnyanrudha_investment_total_amount')}`}
            min="0"
            step="1"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Dynadhara Rate (%)")}
          </label>
          <input
            type="number"
            name="dynadhara_rate"
            placeholder="Dynadhara Rate %"
            value={formData.dynadhara_rate || ""}
            onChange={handleEnhancedInputChange}
            onBlur={handleFieldBlur}
            className={`p-1 border rounded text-[10px] ${getFieldBorderClass('dynadhara_rate')}`}
            min="0"
            max="100"
            step="0.01"
            required
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-3">
        <button
          onClick={handleBackClick}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-[10px] flex items-center gap-1 transition-colors"
          disabled={loading}
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`px-3 py-1 text-white rounded text-[10px] flex items-center gap-2 transition-colors ${
            !isFormValid || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              Validating...
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </form>
  );
};

export default DepositDetailsForm;