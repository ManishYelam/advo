import React, { useState } from "react";
import UPIPayment from "./UPIPayment"; // Optional UPI component

const Payment = ({ amount, onPaymentSuccess, onBack }) => {
  const [showUPI, setShowUPI] = useState(false);
  const [txnId, setTxnId] = useState("");
  const [screenshot, setScreenshot] = useState(null);

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("⚠️ Razorpay SDK failed to load. Switching to UPI payment.");
      setShowUPI(true);
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_yourkey",
      amount: amount * 100,
      currency: "INR",
      name: "Satyamev Jayate",
      description: "Case Application Fee",
      handler: function (response) {
        onPaymentSuccess({
          method: "razorpay",
          paymentId: response.razorpay_payment_id,
        });
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#22c55e" },
      modal: {
        ondismiss: function () {
          alert("Payment cancelled. You can retry or choose UPI/QR payment.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Handle manual UPI/QR payment submission
  const handleUPISubmit = () => {
    if (!txnId || !screenshot) {
      alert("Please enter transaction ID and upload payment proof.");
      return;
    }
    onPaymentSuccess({ method: "upi_manual", txnId, screenshot });
  };

  return (
    <div className="text-xs font-serif space-y-4">
      <h3 className="text-sm font-bold">Payment</h3>

      {!showUPI ? (
        // Razorpay Section
        <>
          <p>Amount to pay: ₹{amount}</p>
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handleRazorpayPayment}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Pay with Razorpay
            </button>
          </div>
          <p className="text-center text-gray-500 text-[10px] mt-2">
            Having trouble?{" "}
            <button
              onClick={() => setShowUPI(true)}
              className="underline text-blue-500"
            >
              Use UPI/QR instead
            </button>
          </p>
        </>
      ) : (
        // UPI/QR Section
        <>
          <UPIPayment />

          <div className="flex flex-col items-center space-y-2 mt-4">
            <input
              type="text"
              placeholder="Transaction ID"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              className="w-60 border px-3 text-center py-1 rounded text-xs"
            />

            {/* File input with remove button */}
            <div className="flex items-center space-x-2">
              <label className="text-[10px] bg-blue-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-600">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setScreenshot(e.target.files[0])}
                  className="hidden"
                />
              </label>

              {screenshot ? (
                <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                  <span className="text-[10px] text-gray-600 truncate max-w-[160px]">
                    {screenshot.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setScreenshot(null)}
                    className="text-red-500 text-xs font-bold hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="text-[10px] text-gray-600 truncate max-w-[200px] text-center">
                  No file chosen
                </span>
              )}
            </div>

            {screenshot && (
              <img
                src={URL.createObjectURL(screenshot)}
                alt="Payment proof preview"
                className="mt-2 max-h-24 rounded border"
              />
            )}
          </div>

          <div className="relative flex items-center mt-3">
            {/* Back Button (left) */}
            <button
              onClick={onBack}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>

            {/* Switch to Razorpay Button (center) */}
            <button
              onClick={() => setShowUPI(false)}
              className="absolute left-1/2 transform -translate-x-1/2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Switch to Razorpay
            </button>

            {/* Submit Payment Proof Button (right) */}
            <button
              onClick={handleUPISubmit}
              className="ml-auto px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Payment Proof
            </button>
          </div>

        </>
      )}
    </div>
  );
};

export default Payment;
