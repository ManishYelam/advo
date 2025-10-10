import React from "react";

const DepositDetailsForm = ({ formData, handleInputChange, onNext, onBack }) => {
  const handleNextClick = (e) => {
    e.preventDefault();
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
          <label className="font-semibold">Saving Account Starting Date</label>
          <input
            type="date"
            name="savingAccountStartDate"
            value={formData.savingAccountStartDate || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            required
          />

          <label className="font-semibold">Deposit Type</label>
          <select
            name="depositType"
            value={formData.depositType || ""}
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

          <label className="font-semibold">Deposit Duration (Years)</label>
          <input
            type="number"
            name="depositDurationYears"
            placeholder="Duration in Years"
            value={formData.depositDurationYears || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            min={0}
            required
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Fixed Deposit Total Amount</label>
          <input
            type="number"
            name="fixedDepositTotalAmount"
            placeholder="FD Total Amount"
            value={formData.fixedDepositTotalAmount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
          />

          <label className="font-semibold">Interest Rate (FD %)</label>
          <input
            type="number"
            name="interestRateFD"
            placeholder="FD Interest Rate"
            value={formData.interestRateFD || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
          />

          <label className="font-semibold">Savings Account Total Amount</label>
          <input
            type="number"
            name="savingAccountTotalAmount"
            placeholder="Savings Total Amount"
            value={formData.savingAccountTotalAmount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
          />

          <label className="font-semibold">Interest Rate (Savings %)</label>
          <input
            type="number"
            name="interestRateSaving"
            placeholder="Savings Interest Rate"
            value={formData.interestRateSaving || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
          />
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Recurring Deposit Total Amount</label>
          <input
            type="number"
            name="recurringDepositTotalAmount"
            placeholder="RD Total Amount"
            value={formData.recurringDepositTotalAmount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
          />

          <label className="font-semibold">Interest Rate (RD %)</label>
          <input
            type="number"
            name="interestRateRecurring"
            placeholder="RD Interest Rate"
            value={formData.interestRateRecurring || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
          />

          <label className="font-semibold">Dnyanrudha Investment Total Amount</label>
          <input
            type="number"
            name="dnyanrudhaInvestmentTotalAmount"
            placeholder="Investment Total Amount"
            value={formData.dnyanrudhaInvestmentTotalAmount || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
          />

          <label className="font-semibold">Dynadhara Rate (%)</label>
          <input
            type="number"
            name="dynadharaRate"
            placeholder="Dynadhara Rate"
            value={formData.dynadharaRate || ""}
            onChange={handleInputChange}
            className="p-1 border rounded text-[10px]"
            step="0.01"
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
