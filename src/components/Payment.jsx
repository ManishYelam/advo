import React, { useState, useEffect } from "react";
import UPIPayment from "./UPIPayment";
import { createPaymentOrder, verifyPayment } from "../services/paymentsService";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast
} from "../utils/Toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faShieldAlt,
  faMobileAlt,
  faCheckCircle,
  faArrowRight,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { FaArrowLeft } from "react-icons/fa";

const Payment = ({ amount, onPaymentSuccess, onBack, userData = {} }) => {
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [txnId, setTxnId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayError, setRazorpayError] = useState(false);

  // Razorpay payment instructions
  const razorpayInstructions = [
    {
      icon: faCreditCard,
      text: "Click 'Pay with Razorpay' button",
      description: "You'll be redirected to secure payment page"
    },
    {
      icon: faShieldAlt,
      text: "Complete payment on Razorpay",
      description: "Use credit/debit card, UPI, net banking, or wallets"
    },
    {
      icon: faCheckCircle,
      text: "Automatic verification",
      description: "Payment is verified automatically - no manual steps needed"
    }
  ];

  // UPI payment instructions
  const upiInstructions = [
    {
      icon: faMobileAlt,
      text: "Scan QR code with UPI app",
      description: "Use Google Pay, PhonePe, Paytm, or any UPI app"
    },
    {
      icon: faCreditCard,
      text: "Complete payment in your app",
      description: "Enter amount and complete the transaction"
    },
    {
      icon: faExclamationTriangle,
      text: "Save transaction details",
      description: "Take screenshot and note Transaction ID for verification"
    }
  ];

  // Preload Razorpay script
  useEffect(() => {
    initializeRazorpay();
  }, []);

  const initializeRazorpay = async () => {
    try {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
      if (!loaded) {
        setRazorpayError(true);
        showInfoToast("Using UPI payment method as backup");
      }
    } catch (error) {
      console.error("Razorpay initialization failed:", error);
      setRazorpayError(true);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      if (document.getElementById("razorpay-script")) {
        const checkLoaded = setInterval(() => {
          if (window.Razorpay) {
            clearInterval(checkLoaded);
            resolve(true);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkLoaded);
          resolve(false);
        }, 5000);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      let scriptLoaded = false;

      script.onload = () => {
        scriptLoaded = true;
        if (window.Razorpay) {
          resolve(true);
        } else {
          resolve(false);
        }
      };

      script.onerror = () => {
        scriptLoaded = true;
        resolve(false);
      };

      document.body.appendChild(script);

      setTimeout(() => {
        if (!scriptLoaded) {
          resolve(false);
        }
      }, 10000);
    });
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();

      if (!isLoaded || !window.Razorpay) {
        showWarningToast("Razorpay not available. Switching to UPI payment.");
        setRazorpayError(true);
        setPaymentMethod("upi");
        setLoading(false);
        return;
      }

      const { data: order } = await createPaymentOrder({ amount });

      if (!order.order?.id) {
        showErrorToast("Failed to create payment order. Please try UPI payment instead.");
        setLoading(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.order.amount,
        currency: order.order.currency,
        name: "Satyamev Jayate",
        description: "Case Application Fee",
        order_id: order.order.id,
        handler: async (response) => {
          const verification_data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            const verifyRes = await verifyPayment(verification_data);
            if (verifyRes.data.success) {
              showSuccessToast("✅ Payment Successful!");
              onPaymentSuccess({
                method: "razorpay",
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: amount,
                status: "completed",
                order: order.order,
                timestamp: new Date().toISOString(),
              });
            } else {
              throw new Error("Verification failed");
            }
          } catch (err) {
            console.error("Verification error:", err);
            showErrorToast("Payment verification failed! Please contact support.");
          }
        },
        prefill: {
          name: userData.full_name || "",
          email: userData.email || "",
          contact: userData.phone_number || ""
        },
        notes: {
          case_type: "Application Fee",
          user_id: userData.id || "unknown"
        },
        theme: {
          color: "#22c55e",
        },
        modal: {
          ondismiss: () => {
            showInfoToast("Payment cancelled. You can retry or use UPI payment.");
          },
        },
        retry: {
          enabled: true,
          max_count: 2
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        showErrorToast(`Payment failed: ${response.error.description}. Please try UPI payment.`);
      });

      rzp.open();

    } catch (error) {
      console.error("Razorpay payment error:", error);

      if (error.response?.status === 500 || error.message?.includes('network') || !navigator.onLine) {
        showWarningToast("Payment service unavailable. Switching to UPI payment.");
        setRazorpayError(true);
        setPaymentMethod("upi");
      } else {
        showErrorToast("Payment failed. Please try UPI payment method.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUPISubmit = async () => {
    if (!txnId.trim()) {
      showWarningToast("Please enter transaction ID.");
      return;
    }

    if (!screenshot) {
      showWarningToast("Please upload payment proof screenshot.");
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccessToast("✅ UPI payment proof submitted successfully!");
      onPaymentSuccess({
        method: "upi_manual",
        txnId: txnId.trim(),
        screenshot: screenshot,
        amount: amount,
        status: "pending_verification",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      showErrorToast("Failed to submit payment proof. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showWarningToast("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showWarningToast("File size must be less than 5MB");
      return;
    }

    setScreenshot(file);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Instruction Step Component
  const InstructionStep = ({ icon, text, description, isLast = false }) => (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={icon} className="text-green-600 text-lg" />
        </div>
        {!isLast && <div className="w-0.5 h-12 bg-green-200 mt-2"></div>}
      </div>
      <div className="flex-1 pb-6">
        <h4 className="font-semibold text-gray-800 text-sm">{text}</h4>
        <p className="text-gray-600 text-xs mt-1">{description}</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (razorpayError && paymentMethod === "razorpay") {
      setPaymentMethod("upi");
    }
  }, [razorpayError, paymentMethod]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h3>
        <div className="text-3xl font-bold text-green-600">
          {formatAmount(amount)}
        </div>
        <p className="text-sm text-gray-600 mt-1">Case Application Fee</p>

        {razorpayError && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700 flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Using UPI payment (Razorpay unavailable)
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Payment Method & Instructions */}
        <div className="space-y-6">
          {/* Payment Method Selection */}
          {!razorpayError && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-800 mb-4 text-lg">Choose Payment Method</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${paymentMethod === "razorpay"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "razorpay" ? "bg-green-100" : "bg-gray-100"
                      }`}>
                      <FontAwesomeIcon
                        icon={faCreditCard}
                        className={paymentMethod === "razorpay" ? "text-green-600" : "text-gray-600"}
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">Razorpay</h5>
                      <p className="text-sm text-gray-600">Recommended - Fast & Secure</p>
                    </div>
                    {paymentMethod === "razorpay" && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 ml-auto" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("upi")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${paymentMethod === "upi"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-white hover:bg-gray-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === "upi" ? "bg-blue-100" : "bg-gray-100"
                      }`}>
                      <FontAwesomeIcon
                        icon={faMobileAlt}
                        className={paymentMethod === "upi" ? "text-blue-600" : "text-gray-600"}
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">UPI Payment</h5>
                      <p className="text-sm text-gray-600">Scan QR Code & Pay</p>
                    </div>
                    {paymentMethod === "upi" && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Payment Instructions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
              How to Pay - {paymentMethod === "razorpay" ? "Razorpay" : "UPI"}
            </h4>
            <div className="space-y-2">
              {(paymentMethod === "razorpay" ? razorpayInstructions : upiInstructions).map(
                (instruction, index, array) => (
                  <InstructionStep
                    key={index}
                    icon={instruction.icon}
                    text={instruction.text}
                    description={instruction.description}
                    isLast={index === array.length - 1}
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Payment Action */}
        <div className="space-y-6">
          {/* Razorpay Payment Section */}
          {paymentMethod === "razorpay" && !razorpayError && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-4 text-lg">Pay with Razorpay</h4>
              <p className="text-green-700 text-sm mb-6">
                You'll be redirected to Razorpay's secure payment gateway to complete your payment safely.
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay with Razorpay
                      <FontAwesomeIcon icon={faArrowRight} />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setPaymentMethod("upi")}
                    className="text-blue-600 text-sm hover:text-blue-700 underline"
                  >
                    Having issues? Use UPI payment instead
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* UPI Payment Section */}
          {paymentMethod === "upi" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              {razorpayError && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-700 text-sm text-center">
                    Razorpay is currently unavailable. Please use UPI payment method.
                  </p>
                </div>
              )}

              <UPIPayment />

              {/* UPI Transaction Details */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter UPI Transaction ID from your payment app"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Proof Screenshot *
                  </label>
                  <div className="space-y-3">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                      <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors text-center">
                        {screenshot ? 'Change Screenshot' : 'Upload Payment Confirmation Screenshot'}
                      </div>
                    </label>

                    {screenshot && (
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            📷
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {screenshot.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(screenshot.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={removeScreenshot}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {screenshot && (
                  <div className="border rounded-lg p-3 bg-white">
                    <p className="text-xs text-gray-600 mb-2">Screenshot Preview:</p>
                    <img
                      src={URL.createObjectURL(screenshot)}
                      alt="Payment proof preview"
                      className="max-h-40 mx-auto rounded border"
                    />
                  </div>
                )}
              </div>

              {/* UPI Action Buttons */}
              <div className="flex gap-3 mt-6">
                {!razorpayError && (
                  <button
                    onClick={() => setPaymentMethod("razorpay")}
                    className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                    Try Razorpay
                  </button>
                )}

                <button
                  onClick={handleUPISubmit}
                  disabled={loading || !txnId.trim() || !screenshot}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Payment Proof
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="text-center  flex items-center justify-center">
            <button
              onClick={onBack}
              disabled={loading}
              className="px-8 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaArrowLeft /> Back to Previous Step
            </button>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
        <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faShieldAlt} className="text-green-600" />
          Your payment is 100% secure and encrypted. We do not store your payment details.
        </p>
      </div>
    </div>
  );
};

export default Payment;