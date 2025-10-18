import React, { useState, useEffect } from "react";
import { showSuccessToast, showWarningToast } from "../utils/Toastify";

const DepositDetailsForm = ({ formData, handleInputChange, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Field validation
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'deposit_duration_years':
        if (value < 0) {
          newErrors.deposit_duration_years = 'Duration cannot be negative';
        } else if (value > 50) {
          newErrors.deposit_duration_years = 'Duration seems too long';
        } else {
          delete newErrors.deposit_duration_years;
        }
        break;
      case 'interest_rate_fd':
      case 'interest_rate_saving':
      case 'interest_rate_recurring':
      case 'dynadhara_rate':
        if (value < 0) {
          newErrors[name] = 'Interest rate cannot be negative';
        } else if (value > 100) {
          newErrors[name] = 'Interest rate seems too high';
        } else {
          delete newErrors[name];
        }
        break;
      case 'fixed_deposit_total_amount':
      case 'saving_account_total_amount':
      case 'recurring_deposit_total_amount':
      case 'dnyanrudha_investment_total_amount':
        if (value < 0) {
          newErrors[name] = 'Amount cannot be negative';
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced input change handler
  const handleEnhancedInputChange = (e) => {
    const { name, value } = e.target;
    
    // Convert to number for numeric fields
    const numericFields = [
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
    
    const processedValue = numericFields.includes(name) ? 
      (value === '' ? '' : parseFloat(value)) : value;

    handleInputChange({ 
      target: { 
        name, 
        value: processedValue 
      } 
    });
    
    validateField(name, processedValue);
  };

  // Conditional field requirements based on deposit type
  const getRequiredFields = () => {
    const baseFields = ['saving_account_start_date', 'deposit_type', 'deposit_duration_years'];
    
    switch (formData.deposit_type) {
      case 'Fixed Deposit':
        return [...baseFields, 'fixed_deposit_total_amount', 'interest_rate_fd'];
      case 'Savings Account Deposit':
        return [...baseFields, 'saving_account_total_amount', 'interest_rate_saving'];
      case 'Recurring Deposit':
        return [...baseFields, 'recurring_deposit_total_amount', 'interest_rate_recurring'];
      case 'Investment Scheme (Exhibit A)':
        return [...baseFields, 'dnyanrudha_investment_total_amount', 'dynadhara_rate'];
      default:
        return baseFields;
    }
  };

  const handleNextClick = async (e) => {
    e.preventDefault();
    
    // Validate all required fields based on deposit type
    const requiredFields = getRequiredFields();
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      return value === undefined || value === null || value === '' || 
             (typeof value === 'number' && isNaN(value));
    });
    
    if (missingFields.length > 0) {
      showWarningToast(`Please fill all required fields for ${formData.deposit_type || 'selected deposit type'}`);
      return;
    }

    // Validate field formats
    if (!validateField('deposit_duration_years', formData.deposit_duration_years)) {
      showWarningToast("Please fix validation errors before proceeding.");
      return;
    }

    setLoading(true);
    try {
      // Simulate validation process
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

  // Format currency for display
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
  };

  // Error message component
  const ErrorMessage = ({ message }) => (
    message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null
  );

  const mandatoryLabel = (label) => (
    <>
      {label} <span className="text-red-500">*</span>
    </>
  );

  // Helper to check if field should be required based on deposit type
  const isFieldRequired = (fieldName) => {
    const requiredFields = getRequiredFields();
    return requiredFields.includes(fieldName);
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
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            {mandatoryLabel("Deposit Type")}
          </label>
          <select
            name="deposit_type"
            value={formData.deposit_type || ""}
            onChange={handleEnhancedInputChange}
            className="p-1 border rounded text-[10px]"
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
            className={`p-1 border rounded text-[10px] ${
              errors.deposit_duration_years ? 'border-red-500' : ''
            }`}
            min="0"
            max="50"
            step="0.5"
            required
          />
          <ErrorMessage message={errors.deposit_duration_years} />
        </div>

        {/* Column 2 - FD and Savings Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {isFieldRequired('fixed_deposit_total_amount') ? mandatoryLabel("Fixed Deposit Total Amount") : "Fixed Deposit Total Amount"}
          </label>
          <input
            type="number"
            name="fixed_deposit_total_amount"
            placeholder="₹ FD Total Amount"
            value={formData.fixed_deposit_total_amount || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.fixed_deposit_total_amount ? 'border-red-500' : ''
            }`}
            min="0"
            step="0.01"
            required={isFieldRequired('fixed_deposit_total_amount')}
          />
          <ErrorMessage message={errors.fixed_deposit_total_amount} />

          <label className="font-semibold">
            {isFieldRequired('interest_rate_fd') ? mandatoryLabel("Interest Rate (FD %)") : "Interest Rate (FD %)"}
          </label>
          <input
            type="number"
            name="interest_rate_fd"
            placeholder="FD Interest Rate %"
            value={formData.interest_rate_fd || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.interest_rate_fd ? 'border-red-500' : ''
            }`}
            min="0"
            max="100"
            step="0.01"
            required={isFieldRequired('interest_rate_fd')}
          />
          <ErrorMessage message={errors.interest_rate_fd} />

          <label className="font-semibold">
            {isFieldRequired('saving_account_total_amount') ? mandatoryLabel("Savings Account Total Amount") : "Savings Account Total Amount"}
          </label>
          <input
            type="number"
            name="saving_account_total_amount"
            placeholder="₹ Savings Total Amount"
            value={formData.saving_account_total_amount || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.saving_account_total_amount ? 'border-red-500' : ''
            }`}
            min="0"
            step="0.01"
            required={isFieldRequired('saving_account_total_amount')}
          />
          <ErrorMessage message={errors.saving_account_total_amount} />

          <label className="font-semibold">
            {isFieldRequired('interest_rate_saving') ? mandatoryLabel("Interest Rate (Savings %)") : "Interest Rate (Savings %)"}
          </label>
          <input
            type="number"
            name="interest_rate_saving"
            placeholder="Savings Interest Rate %"
            value={formData.interest_rate_saving || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.interest_rate_saving ? 'border-red-500' : ''
            }`}
            min="0"
            max="100"
            step="0.01"
            required={isFieldRequired('interest_rate_saving')}
          />
          <ErrorMessage message={errors.interest_rate_saving} />
        </div>

        {/* Column 3 - RD and Investment Details */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            {isFieldRequired('recurring_deposit_total_amount') ? mandatoryLabel("Recurring Deposit Total Amount") : "Recurring Deposit Total Amount"}
          </label>
          <input
            type="number"
            name="recurring_deposit_total_amount"
            placeholder="₹ RD Total Amount"
            value={formData.recurring_deposit_total_amount || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.recurring_deposit_total_amount ? 'border-red-500' : ''
            }`}
            min="0"
            step="0.01"
            required={isFieldRequired('recurring_deposit_total_amount')}
          />
          <ErrorMessage message={errors.recurring_deposit_total_amount} />

          <label className="font-semibold">
            {isFieldRequired('interest_rate_recurring') ? mandatoryLabel("Interest Rate (RD %)") : "Interest Rate (RD %)"}
          </label>
          <input
            type="number"
            name="interest_rate_recurring"
            placeholder="RD Interest Rate %"
            value={formData.interest_rate_recurring || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.interest_rate_recurring ? 'border-red-500' : ''
            }`}
            min="0"
            max="100"
            step="0.01"
            required={isFieldRequired('interest_rate_recurring')}
          />
          <ErrorMessage message={errors.interest_rate_recurring} />

          <label className="font-semibold">
            {isFieldRequired('dnyanrudha_investment_total_amount') ? mandatoryLabel("Dnyanrudha Investment Total Amount") : "Dnyanrudha Investment Total Amount"}
          </label>
          <input
            type="number"
            name="dnyanrudha_investment_total_amount"
            placeholder="₹ Investment Total Amount"
            value={formData.dnyanrudha_investment_total_amount || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.dnyanrudha_investment_total_amount ? 'border-red-500' : ''
            }`}
            min="0"
            step="0.01"
            required={isFieldRequired('dnyanrudha_investment_total_amount')}
          />
          <ErrorMessage message={errors.dnyanrudha_investment_total_amount} />

          <label className="font-semibold">
            {isFieldRequired('dynadhara_rate') ? mandatoryLabel("Dynadhara Rate (%)") : "Dynadhara Rate (%)"}
          </label>
          <input
            type="number"
            name="dynadhara_rate"
            placeholder="Dynadhara Rate %"
            value={formData.dynadhara_rate || ""}
            onChange={handleEnhancedInputChange}
            className={`p-1 border rounded text-[10px] ${
              errors.dynadhara_rate ? 'border-red-500' : ''
            }`}
            min="0"
            max="100"
            step="0.01"
            required={isFieldRequired('dynadhara_rate')}
          />
          <ErrorMessage message={errors.dynadhara_rate} />
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
          disabled={loading}
          className={`px-3 py-1 bg-green-600 text-white rounded text-[10px] flex items-center gap-2 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
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