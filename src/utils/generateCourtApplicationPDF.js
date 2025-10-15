import html2pdf from "html2pdf.js";

/**
 * Generate Court Application PDF with dynamic exhibits.
 * @param {Object} formData - Application form data
 * @param {Object} paymentDetails - Payment details
 * @param {Array} exhibits - Array of exhibits [{ title: "Exhibit A", description: "Copy of deposit slip" }, ...]
 * @returns {Promise<ArrayBuffer>}
 */
export const generateCourtApplicationPDF = async (formData = {}, paymentDetails = {}, exhibits = []) => {
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);

  // =======================
  // PAGE 1 + PAGE 2: Application Core
  // =======================
  container.innerHTML = `
    <div style="padding: 3rem; font-family: 'Times New Roman'; font-size: 13px;">
      <div style="text-align:center; font-weight:bold;">
        <p>IN THE COURT OF HON'BLE SESSION FOR GREATER</p>
        <p>BOMBAY AT, MUMBAI</p>
        <p>SPECIAL COURT FOR PMLA CASES</p>
        <p>CRIMINAL APPLICATION/EXHIBIT NO. ____ OF 2025</p>
        <p>IN SPECIAL CASE NO. ____ OF 2025</p>
        <p>IN</p>
        <p>ECIR/MBZO-1//2025</p>
      </div>

      <div style="margin: 2rem 0;">
        <p><b>${formData.name}</b> ….. Applicant</p>
        <p>VERSUS</p>
        <p>DYANDHARA MULTISTATE CO-OPERATIVE CREDIT SOCIETY ….. <b>Accused</b></p>
        <p>DIRECTORATE OF ENFORCEMENT ….. <b>Complainant</b></p>
      </div>

      <h3 style="text-align:center; text-decoration:underline;">INDEX</h3>
      <table style="width:100%; border-collapse:collapse; border:1px solid black; font-size:12px;">
        <thead>
          <tr>
            <th style="border:1px solid black; padding:6px;">SR. No.</th>
            <th style="border:1px solid black; padding:6px;">PARTICULARS</th>
            <th style="border:1px solid black; padding:6px;">EXHIBIT No.</th>
            <th style="border:1px solid black; padding:6px;">PAGE No.</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style="border:1px solid black; text-align:center;">1</td><td style="border:1px solid black;">Application</td><td style="border:1px solid black; text-align:center;"></td><td style="border:1px solid black; text-align:center;">1</td></tr>
          <tr><td style="border:1px solid black; text-align:center;">2</td><td style="border:1px solid black;">List of Documents</td><td style="border:1px solid black; text-align:center;"></td><td style="border:1px solid black; text-align:center;">1–6</td></tr>
          ${exhibits.map((ex, i) => `
            <tr>
              <td style="border:1px solid black; text-align:center;">${i+3}</td>
              <td style="border:1px solid black;">${ex.description}</td>
              <td style="border:1px solid black; text-align:center;">${ex.title}</td>
              <td style="border:1px solid black; text-align:center;"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; font-size:12px; margin-top:2rem;">
        <div>
          <p><b>Place:</b> Mumbai</p>
          <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="text-align:right;">
          <p>___________________________</p>
          <p>Advocate for the Applicant</p>
        </div>
      </div>
    </div>

    <!-- PAGE 2: Application Details -->
    <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
      <h3 style="text-align:center; text-decoration:underline;">APPLICATION</h3>
      <p>TO, THE HON’BLE SPECIAL JUDGE FOR PMLA CASES, MUMBAI.</p>
      <p>Most Respectfully Sheweth,</p>
      <p>1. That the applicant submits that he is filing this application in respect to the ongoing matter concerning ECIR/MBZO-1//2025.</p>
      <p>2. That the applicant prays that the Hon’ble Court may kindly consider his request for submission of the supporting documents and affidavit.</p>
      <p><b>PRAYER:</b></p>
      <ol>
        <li>Take the accompanying documents on record.</li>
        <li>Grant any other relief as deemed fit and proper in the interest of justice.</li>
      </ol>
      <div style="margin-top: 4rem; text-align:right;">
        <p>___________________________</p>
        <p><b>Advocate for the Applicant</b></p>
      </div>
    </div>

    <!-- PAGE 3: Applicant Info + Deposit Details -->
    <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
      <h3 style="text-align:center; text-decoration:underline;">APPLICATION DETAILS</h3>
      <p><b>Full Name:</b> ${formData.name}</p>
      <p><b>Email:</b> ${formData.email}</p>
      <p><b>Phone:</b> ${formData.phone_number || ""}</p>
      <p><b>Case Type:</b> ${formData.caseType || ""}</p>

      <h4>Deposit Details</h4>
      <p><b>Saving Account Start Date:</b> ${formData.savingAccountStartDate || ""}</p>
      <p><b>Deposit Type:</b> ${formData.depositType || ""}</p>
      <p><b>Fixed Deposit Total:</b> ${formData.fixedDepositTotalAmount || ""}</p>
      <p><b>Recurring Deposit Total:</b> ${formData.recurringDepositTotalAmount || ""}</p>
      <p style="font-style:italic;">I hereby affirm that the above information is true and correct to the best of my knowledge.</p>
      <div style="text-align:right; margin-top:2rem;">
        <p>_________________________</p>
        <p><b>Signature of Applicant</b></p>
      </div>
    </div>

    <!-- DYNAMIC EXHIBITS -->
    ${exhibits.map(ex => `
      <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
        <h3 style="text-align:center; text-decoration:underline;">${ex.title}</h3>
        <p>${ex.description}</p>
        ${ex.content || ""} <!-- optional detailed content -->
      </div>
    `).join('')}

    <!-- PAGE LAST: Payment Receipt -->
    <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
      <h2 style="text-align:center; text-decoration:underline;">PAYMENT RECEIPT</h2>
      <p style="text-align:center;">This receipt acknowledges payment for the court application.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:1rem; font-size:12px; border:1px solid black;">
        <tr>
          <td style="border:1px solid black; padding:8px; font-weight:bold;">Payment ID</td>
          <td style="border:1px solid black; padding:8px;">${paymentDetails.payment_id || "N/A"}</td>
        </tr>
        <tr>
          <td style="border:1px solid black; padding:8px; font-weight:bold;">Order ID</td>
          <td style="border:1px solid black; padding:8px;">${paymentDetails.order_id || "N/A"}</td>
        </tr>
        <tr>
          <td style="border:1px solid black; padding:8px; font-weight:bold;">Amount</td>
          <td style="border:1px solid black; padding:8px;">₹${(paymentDetails.amount || 0)/100}</td>
        </tr>
        <tr>
          <td style="border:1px solid black; padding:8px; font-weight:bold;">Date</td>
          <td style="border:1px solid black; padding:8px;">${paymentDetails.date || new Date().toLocaleDateString()}</td>
        </tr>
      </table>
      <div style="text-align:right; margin-top:2rem;">
        <p>___________________________</p>
        <p><b>Authorized Signatory</b></p>
      </div>
    </div>
  `;

  // PDF Options
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: "Court_Application.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  const pdfInstance = await html2pdf().set(opt).from(container).toPdf().get("pdf");
  const arrayBuffer = pdfInstance.output("arraybuffer");

  document.body.removeChild(container);

  return arrayBuffer; // ✅ return ArrayBuffer
};
