import React from "react";

const Payment = ({ amount, onPaymentSuccess, onBack }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK. Are you online?");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay API key
      amount: amount * 100, // Amount in paise (₹1 = 100 paise)
      currency: "INR",
      name: "Your Company Name",
      description: "Case Application Payment",
      handler: function (response) {
        // Payment success callback
        onPaymentSuccess(response);
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div style={{ fontSize: "10px", fontFamily: '"Times New Roman", Times, serif', lineHeight: 1.4 }}>
      <h3 className="mb-4 font-semibold" style={{ fontSize: "12px" /* slightly larger for heading */, fontWeight: "bold" }}>
        Payment Step
      </h3>
      <p className="mb-4">Amount to pay: ₹{amount}</p>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          style={{ fontSize: "10px" }}
        >
          Back
        </button>

        <button
          onClick={handlePayment}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          style={{ fontSize: "10px" }}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;
