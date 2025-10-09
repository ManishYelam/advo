import React from "react";
import upiimg from "../assets/upi-qr.png"; // Adjust the path if needed

const UPIPayment = () => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Pay Using UPI</h3>
      <p className="text-sm mb-4">Scan the QR code using any UPI app</p>

      <img
        src={upiimg} // ✅ use imported image
        alt="UPI QR Code"
        className="mx-auto w-64 h-auto border border-gray-300 rounded shadow-md"
      />

      <p className="mt-4 text-sm text-gray-600">UPI ID: yourname@bank</p>
    </div>
  );
};

export default UPIPayment;
