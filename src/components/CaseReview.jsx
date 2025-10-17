import React, { useState, useEffect } from "react";
import { FaFilePdf, FaPrint, FaCheckCircle } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { showWarningToast, showSuccessToast, showErrorToast } from "../utils/Toastify";

const CaseReview = ({ formData, setFormData, onNext, onBack }) => {
  const [check, setCheck] = useState(formData.verified || false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sync checkbox with formData
  useEffect(() => {
    setCheck(formData.verified || false);
  }, [formData.verified]);

  // ✅ Handle checkbox verification
  const handleCheckboxChange = (e) => {
    const verified = e.target.checked;
    setCheck(verified);
    setFormData((prev) => ({ ...prev, verified }));

    if (verified) {
      showSuccessToast("Declaration verified successfully!");
    } else {
      showWarningToast("Please verify the declaration to proceed.");
    }
  };

  // ✅ Format currency for display
  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // ✅ Format percentage for display
  const formatPercentage = (value) => {
    if (!value && value !== 0) return 'N/A';
    return `${parseFloat(value).toFixed(2)}%`;
  };

  // ✅ Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // ✅ Handle PDF Generation (Download)
  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      const element = document.getElementById("printableArea");

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Application_${formData.full_name || "Applicant"}_${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait" 
        },
      };

      await html2pdf().set(opt).from(element).save();
      showSuccessToast("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      showErrorToast("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // ✅ Handle Print - Simple and clean
  const handlePrint = () => {
    const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
    const printWindow = window.open('', '_blank');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Application Form - ${formData.full_name || 'Applicant'}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              font-size: 12px;
              line-height: 1.4;
              margin: 15px;
              color: #000;
              background: white;
            }
            .print-container {
              max-width: 100%;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #333;
            }
            .header h1 {
              font-size: 18px;
              font-weight: bold;
              margin: 0 0 5px 0;
              color: #000;
            }
            .header-info {
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #666;
            }
            .section {
              border: 1px solid #333;
              padding: 10px;
              margin-bottom: 12px;
              border-radius: 4px;
              page-break-inside: avoid;
            }
            .section h4 {
              font-size: 13px;
              font-weight: bold;
              margin: 0 0 8px 0;
              padding-bottom: 4px;
              border-bottom: 1px solid #ccc;
            }
            .grid-3 {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 10px;
            }
            .info-line {
              margin: 4px 0;
            }
            .info-line strong {
              color: #333;
            }
            .declaration {
              background-color: #f8f8f8;
              font-style: italic;
              padding: 12px;
            }
            .signature-area {
              text-align: right;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #333;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              color: #666;
              margin-top: 15px;
              padding-top: 10px;
              border-top: 1px solid #ccc;
            }
            @media print {
              body { margin: 15px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <!-- Header -->
            <div class="header">
              <h1>INVESTMENT APPLICATION FORM</h1>
              <div class="header-info">
                <div>Ref: ${formData.reference_number || 'N/A'}</div>
                <div>Date: ${formatDate(new Date().toISOString())}</div>
              </div>
            </div>

            <!-- Basic Information -->
            <div class="section">
              <h4>1. BASIC INFORMATION</h4>
              <div class="grid-3">
                <div>
                  <div class="info-line"><strong>Full Name:</strong> ${formData.full_name || 'N/A'}</div>
                  <div class="info-line"><strong>Date of Birth:</strong> ${formatDate(formData.date_of_birth)}</div>
                  <div class="info-line"><strong>Gender:</strong> ${formData.gender || 'N/A'}</div>
                </div>
                <div>
                  <div class="info-line"><strong>Phone No.:</strong> ${formData.phone_number || 'N/A'}</div>
                  <div class="info-line"><strong>Age:</strong> ${formData.age || 'N/A'} years</div>
                  <div class="info-line"><strong>Occupation:</strong> ${formData.occupation || 'N/A'}</div>
                </div>
                <div>
                  <div class="info-line"><strong>Aadhar No.:</strong> ${formData.adhar_number || 'N/A'}</div>
                  <div class="info-line"><strong>Email:</strong> ${formData.email || 'N/A'}</div>
                  <div class="info-line"><strong>Address:</strong> ${formData.address || 'N/A'}</div>
                </div>
              </div>
              ${formData.additional_notes ? `
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee;">
                  <div class="info-line"><strong>Notes:</strong> ${formData.additional_notes}</div>
                </div>
              ` : ''}
            </div>

            <!-- Deposit Details -->
            <div class="section">
              <h4>2. DEPOSIT DETAILS</h4>
              <div class="grid-3">
                <div>
                  <div class="info-line"><strong>Account Start:</strong> ${formatDate(formData.saving_account_start_date)}</div>
                  <div class="info-line"><strong>Deposit Type:</strong> ${formData.deposit_type || 'N/A'}</div>
                  <div class="info-line"><strong>Duration:</strong> ${formData.deposit_duration_years || 'N/A'} years</div>
                </div>
                <div>
                  <div class="info-line"><strong>FD Amount:</strong> ${formatCurrency(formData.fixed_deposit_total_amount)}</div>
                  <div class="info-line"><strong>FD Rate:</strong> ${formatPercentage(formData.interest_rate_fd)}</div>
                  <div class="info-line"><strong>Savings Amount:</strong> ${formatCurrency(formData.saving_account_total_amount)}</div>
                  <div class="info-line"><strong>Savings Rate:</strong> ${formatPercentage(formData.interest_rate_saving)}</div>
                </div>
                <div>
                  <div class="info-line"><strong>RD Amount:</strong> ${formatCurrency(formData.recurring_deposit_total_amount)}</div>
                  <div class="info-line"><strong>RD Rate:</strong> ${formatPercentage(formData.interest_rate_recurring)}</div>
                  <div class="info-line"><strong>Investment Amount:</strong> ${formatCurrency(formData.dnyanrudha_investment_total_amount)}</div>
                  <div class="info-line"><strong>Dynadhara Rate:</strong> ${formatPercentage(formData.dynadhara_rate)}</div>
                </div>
              </div>
            </div>

            <!-- Declaration -->
            <div class="section declaration">
              <div style="margin-bottom: 10px;">
                I hereby solemnly affirm that the information provided above is true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom. I understand that any false information may lead to rejection of my application.
              </div>
              <div style="border-top: 1px solid #ccc; padding-top: 8px; font-weight: bold;">
                ${check ? "✓ VERIFIED AND CONFIRMED BY APPLICANT" : "□ DECLARATION PENDING VERIFICATION"}
              </div>
            </div>

            <!-- Signature -->
            <div class="signature-area">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="text-align: left;">
                  <div style="margin-bottom: 5px;">System Generated Document</div>
                  <div style="color: #666; font-size: 10px;">No manual signature required</div>
                </div>
                <div style="text-align: right;">
                  <div style="margin-bottom: 8px;">Place: _______________________</div>
                  <div style="margin-bottom: 8px;">Date: ____/____/________</div>
                  <div style="font-weight: bold;">Signature of Applicant</div>
                  <div style="color: #666; font-size: 10px;">(Authorized Signatory)</div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              Generated on: ${formatDate(new Date().toISOString())} • This is a system-generated document
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      // Don't auto-close to allow user to check print preview
    };
  };

  // ✅ Validation and submission
  const handleNext = async () => {
    if (!check) {
      showWarningToast("Please verify the declaration before proceeding.");
      return;
    }

    setSubmitting(true);
    try {
      const element = document.getElementById("printableArea");

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Application_${formData.full_name || "Applicant"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait" 
        },
      };

      const pdfBlob = await html2pdf()
        .set(opt)
        .from(element)
        .outputPdf('blob');

      const pdfFile = new File([pdfBlob], `application_${formData.full_name || 'applicant'}.pdf`, {
        type: 'application/pdf'
      });

      const updatedData = {
        ...formData,
        verified: check,
        application_form: pdfFile,
        submitted_at: new Date().toISOString(),
      };

      setFormData(updatedData);
      showSuccessToast("Application submitted successfully!");
      onNext(updatedData);
    } catch (error) {
      console.error("Submission error:", error);
      showErrorToast("Failed to generate application PDF. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Check if all required fields are filled
  const isFormComplete = () => {
    const requiredFields = [
      'full_name', 'date_of_birth', 'age', 'gender', 'phone_number', 
      'email', 'occupation', 'address', 'saving_account_start_date',
      'deposit_type', 'deposit_duration_years'
    ];
    
    return requiredFields.every(field => formData[field]);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border border-gray-300 shadow-lg rounded text-[11px] leading-5">
      
      {/* Status Alert */}
      {!isFormComplete() && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-[10px]">
          ⚠️ Please complete all required fields in previous steps before submitting.
        </div>
      )}

      {/* Printable Section - Original Good Preview */}
      <div id="printableArea" className="space-y-4">
        {/* Header */}
        <header className="text-center mb-4 border-b border-gray-300 pb-3">
          <h1 className="font-bold text-[16px] uppercase tracking-wide text-green-800">
            Investment Application Form
          </h1>
          <div className="flex justify-between items-center mt-2">
            <div className="text-left text-[10px] text-gray-600">
              Ref No: {formData.reference_number || 'N/A'}
            </div>
            <div className="text-right text-[11px] text-gray-700 italic">
              Date: {formatDate(new Date().toISOString())}
            </div>
          </div>
        </header>

        {/* Partition 1: Basic Information */}
        <section className="border border-gray-400 p-4 rounded mb-4">
          <h4 className="font-bold underline mb-3 text-[12px] text-green-700">
            1. BASIC INFORMATION
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p><strong className="text-gray-700">Full Name:</strong> {formData.full_name || 'N/A'}</p>
              <p><strong className="text-gray-700">Date of Birth:</strong> {formatDate(formData.date_of_birth)}</p>
              <p><strong className="text-gray-700">Gender:</strong> {formData.gender || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">Phone No.:</strong> {formData.phone_number || 'N/A'}</p>
              <p><strong className="text-gray-700">Age:</strong> {formData.age || 'N/A'} years</p>
              <p><strong className="text-gray-700">Occupation:</strong> {formData.occupation || 'N/A'}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">Aadhar No.:</strong> {formData.adhar_number || 'N/A'}</p>
              <p><strong className="text-gray-700">Email:</strong> {formData.email || 'N/A'}</p>
              <p><strong className="text-gray-700">Address:</strong> {formData.address || 'N/A'}</p>
            </div>
          </div>
          {formData.additional_notes && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p><strong className="text-gray-700">Notes:</strong> {formData.additional_notes}</p>
            </div>
          )}
        </section>

        {/* Partition 2: Deposit Details */}
        <section className="border border-gray-400 p-4 rounded mb-4">
          <h4 className="font-bold underline mb-3 text-[12px] text-green-700">
            2. DEPOSIT DETAILS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p><strong className="text-gray-700">Account Start Date:</strong> {formatDate(formData.saving_account_start_date)}</p>
              <p><strong className="text-gray-700">Deposit Type:</strong> {formData.deposit_type || 'N/A'}</p>
              <p><strong className="text-gray-700">Duration:</strong> {formData.deposit_duration_years || 'N/A'} years</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">FD Amount:</strong> {formatCurrency(formData.fixed_deposit_total_amount)}</p>
              <p><strong className="text-gray-700">FD Interest Rate:</strong> {formatPercentage(formData.interest_rate_fd)}</p>
              <p><strong className="text-gray-700">Savings Amount:</strong> {formatCurrency(formData.saving_account_total_amount)}</p>
              <p><strong className="text-gray-700">Savings Interest Rate:</strong> {formatPercentage(formData.interest_rate_saving)}</p>
            </div>
            <div className="space-y-2">
              <p><strong className="text-gray-700">RD Amount:</strong> {formatCurrency(formData.recurring_deposit_total_amount)}</p>
              <p><strong className="text-gray-700">RD Interest Rate:</strong> {formatPercentage(formData.interest_rate_recurring)}</p>
              <p><strong className="text-gray-700">Investment Amount:</strong> {formatCurrency(formData.dnyanrudha_investment_total_amount)}</p>
              <p><strong className="text-gray-700">Dynadhara Rate:</strong> {formatPercentage(formData.dynadhara_rate)}</p>
            </div>
          </div>
        </section>

        {/* Declaration */}
        <section className="border border-gray-400 p-4 rounded mb-4 bg-gray-50">
          <p className="italic text-gray-700 mb-3">
            I hereby solemnly affirm that the information provided above is true and
            correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.
            I understand that any false information may lead to rejection of my application.
          </p>
          <label className="flex items-center space-x-3 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={check}
              onChange={handleCheckboxChange}
              className="cursor-pointer accent-green-600 w-4 h-4"
            />
            <span className="font-semibold text-green-700">
              {check ? (
                <span className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-600" />
                  I verify and confirm the above declaration
                </span>
              ) : (
                "I verify and confirm the above declaration"
              )}
            </span>
          </label>
        </section>

        {/* Signature Block */}
        <section className="text-right mt-6 text-[11px] border-t border-gray-300 pt-4">
          <p className="mb-4">Place: _______________________</p>
          <p className="mb-4">Date: ____ / ____ / ______</p>
          <p className="font-bold text-gray-800">Signature of Applicant</p>
          <p className="text-gray-600">(Authorized Signatory)</p>
        </section>

        {/* Footer Section */}
        <footer className="mt-6 border-t border-gray-400 pt-3 text-center text-[10px] text-gray-600 italic">
          <p>This is a system-generated document. No manual signature is required.</p>
          <p>Generated on: {formatDate(new Date().toISOString())}</p>
        </footer>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-3 py-1 bg-gray-400 text-white rounded text-[10px] flex items-center gap-2 transition-colors"
        >
         Back
        </button>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1 bg-green-600 text-white rounded text-[10px] flex items-center gap-2 transition-colors"
          >
            <FaPrint size={12} />
            Print
          </button>
          
          <button
            onClick={handleGeneratePDF}
            disabled={generatingPDF}
            className={`px-3 py-1 bg-green-600 text-white rounded text-[10px] flex items-center gap-2 transition-colors ${
              generatingPDF 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <FaFilePdf size={12} />
            {generatingPDF ? "Generating..." : "Download PDF"}
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={!check || submitting || !isFormComplete()}
          className={`px-3 py-1 bg-green-600 text-white rounded text-[10px] flex items-center gap-2 transition-colors ${
            !check || submitting || !isFormComplete()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            'Next'
          )}
        </button>
      </div>
    </div>
  );
};

export default CaseReview;