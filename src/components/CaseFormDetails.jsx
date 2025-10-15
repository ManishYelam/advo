import React from "react";
import { showSuccessToast } from "../utils/Toastify";

const DepositDetailsForm = ({ formData, handleInputChange, onNext, onBack }) => {
  const handleNextClick = (e) => {
    e.preventDefault();
    showSuccessToast("Deposit details filled successfully!");
    onNext();
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
        {/* Column 1 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Saving Account Starting Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="saving_account_start_date"
            value={formData.saving_account_start_date || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Deposit Type <span className="text-red-500">*</span>
          </label>
          <select
            name="deposit_type"
            value={formData.deposit_type || ""}
            onChange={handleInputChange}
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
            Deposit Duration (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="deposit_duration_years"
            placeholder="Duration in Years"
            value={formData.deposit_duration_years || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            min={0}
            required
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Fixed Deposit Total Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="fixed_deposit_total_amount"
            placeholder="FD Total Amount"
            value={formData.fixed_deposit_total_amount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Interest Rate (FD %) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="interest_rate_fd"
            placeholder="FD Interest Rate"
            value={formData.interest_rate_fd || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
            required
          />

          <label className="font-semibold">
            Savings Account Total Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="saving_account_total_amount"
            placeholder="Savings Total Amount"
            value={formData.saving_account_total_amount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Interest Rate (Savings %) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="interest_rate_saving"
            placeholder="Savings Interest Rate"
            value={formData.interest_rate_saving || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
            required
          />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">
            Recurring Deposit Total Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="recurring_deposit_total_amount"
            placeholder="RD Total Amount"
            value={formData.recurring_deposit_total_amount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Interest Rate (RD %) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="interest_rate_recurring"
            placeholder="RD Interest Rate"
            value={formData.interest_rate_recurring || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
            required
          />

          <label className="font-semibold">
            Dnyanrudha Investment Total Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="dnyanrudha_investment_total_amount"
            placeholder="Investment Total Amount"
            value={formData.dnyanrudha_investment_total_amount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">
            Dynadhara Rate (%) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="dynadhara_rate"
            placeholder="Dynadhara Rate"
            value={formData.dynadhara_rate || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
            required
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-3">
        <button
          onClick={handleBackClick}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-[10px]"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-[10px]"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default DepositDetailsForm;
