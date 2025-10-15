import html2pdf from "html2pdf.js";

export const generateCourtApplicationPDF = async (formData = {}, paymentDetails = {}, exhibits = []) => {
  // Create hidden container
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);

  // ----------------------
  // PAGE 1: Cover + Index
  // ----------------------
  const page1 = `
    <div style="padding:5rem; font-family:'Times New Roman'; font-size:13px; line-height:1.5;">
      <div style="text-align:center; font-weight:bold;">
        <p>IN THE COURT OF HON'BLE SESSION FOR GREATER BOMBAY AT, MUMBAI</p>
        <p>SPECIAL COURT FOR PMLA CASES</p>
        <p>CRIMINAL APPLICATION/EXHIBIT NO. ____ OF 2025</p>
        <p>IN SPECIAL CASE NO. ____ OF 2025</p>
        <p>IN</p>
        <p>ECIR/MBZO-1//2025</p>
      </div>

      <div style="margin: 2rem 0;">
        <p><b>${formData.applicantName || ""}</b> ….. Applicant</p>
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
          <tr><td style="border:1px solid black; text-align:center;">1</td><td style="border:1px solid black;">Application</td><td style="border:1px solid black;"></td><td style="border:1px solid black; text-align:center;">1</td></tr>
          <tr><td style="border:1px solid black; text-align:center;">2</td><td style="border:1px solid black;">List of Documents</td><td style="border:1px solid black;"></td><td style="border:1px solid black; text-align:center;">2–5</td></tr>
          ${exhibits.map((ex, i) => `
            <tr>
              <td style="border:1px solid black; text-align:center;">${i + 3}</td>
              <td style="border:1px solid black;">${ex.description || ""}</td>
              <td style="border:1px solid black; text-align:center;">${ex.title || ""}</td>
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
  `;

  // ----------------------
  // PAGE 2: Application Details
  // ----------------------
  const page2 = `
    <div style="page-break-before: always; padding:3rem; font-family:'Times New Roman'; font-size:12px;">
      <h3 style="text-align:center; text-decoration:underline;">APPLICATION</h3>
      <p>TO, THE HON’BLE SPECIAL JUDGE FOR PMLA CASES, MUMBAI.</p>
      <p>Most Respectfully Sheweth,</p>
      <p>1. That the applicant submits that he is filing this application regarding ECIR/MBZO-1//2025.</p>
      <p>2. That the applicant prays that the Hon’ble Court may kindly consider his request for submission of supporting documents and affidavit.</p>

      <div style="margin-top:2rem;">
        <h4 style="text-decoration:underline;">BASIC INFORMATION</h4>
        <p><b>Full Name:</b> ${formData.name || ""}</p>
        <p><b>DOB:</b> ${formData.dob || ""}</p>
        <p><b>Gender:</b> ${formData.gender || ""}</p>
        <p><b>Phone:</b> ${formData.phone_number || ""}</p>
        <p><b>Age:</b> ${formData.age || ""}</p>
        <p><b>Occupation:</b> ${formData.occupation || ""}</p>
        <p><b>Aadhar:</b> ${formData.adhar_number || ""}</p>
        <p><b>Email:</b> ${formData.email || ""}</p>
        <p><b>Address:</b> ${formData.address || ""}</p>
        <p><b>Notes:</b> ${formData.notes || ""}</p>
      </div>

      <div style="margin-top:1rem;">
        <h4 style="text-decoration:underline;">DEPOSIT DETAILS</h4>
        <p><b>Saving Account Start Date:</b> ${formData.savingAccountStartDate || ""}</p>
        <p><b>Deposit Type:</b> ${formData.depositType || ""}</p>
        <p><b>Deposit Duration (Years):</b> ${formData.depositDurationYears || ""}</p>
        <p><b>Fixed Deposit Total:</b> ${formData.fixedDepositTotalAmount || ""}</p>
        <p><b>Interest Rate (FD %):</b> ${formData.interestRateFD || ""}</p>
        <p><b>Savings Total:</b> ${formData.savingAccountTotalAmount || ""}</p>
        <p><b>Interest Rate (Savings %):</b> ${formData.interestRateSaving || ""}</p>
        <p><b>Recurring Total:</b> ${formData.recurringDepositTotalAmount || ""}</p>
        <p><b>Interest Rate (RD %):</b> ${formData.interestRateRecurring || ""}</p>
        <p><b>Dnyanrudha Investment:</b> ${formData.dnyanrudhaInvestmentTotalAmount || ""}</p>
        <p><b>Dynadhara Rate (%):</b> ${formData.dynadharaRate || ""}</p>
      </div>

      <p style="margin-top:1rem; font-style:italic;">I hereby affirm that the above information is true and correct to the best of my knowledge.</p>

      <div style="text-align:right; margin-top:2rem;">
        <p>_________________________</p>
        <p><b>Signature of Applicant</b></p>
      </div>

      <div style="text-align:right; margin-top:2rem;">
        <p>_________________________</p>
        <p><b>Advocate for the Applicant</b></p>
      </div>
    </div>
  `;

  // ----------------------
  // PAGES 3+: Dynamic Exhibits
  // ----------------------
  const exhibitPages = exhibits.map(ex => `
    <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
      <h3 style="text-align:center; text-decoration:underline;">${ex.title || ""}</h3>
      <p>${ex.description || ""}</p>
      ${ex.content || ""}
    </div>
  `).join('');

  // ----------------------
  // LAST PAGE: Payment Receipt
  // ----------------------
  const paymentPage = `
    <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
      <h2 style="text-align:center; text-decoration:underline;">PAYMENT RECEIPT</h2>
      <table style="width:100%; border-collapse:collapse; margin-top:1rem; font-size:12px; border:1px solid black;">
        <tr><td style="border:1px solid black; padding:8px;">Receipt No.</td><td style="border:1px solid black; padding:8px;">${paymentDetails.receipt || "N/A"}</td></tr>
        <tr><td style="border:1px solid black; padding:8px;">Payment ID</td><td style="border:1px solid black; padding:8px;">${paymentDetails.payment_id || "N/A"}</td></tr>
        <tr><td style="border:1px solid black; padding:8px;">Order ID</td><td style="border:1px solid black; padding:8px;">${paymentDetails.order_id || "N/A"}</td></tr>
        <tr><td style="border:1px solid black; padding:8px;">Amount</td><td style="border:1px solid black; padding:8px;">₹${(paymentDetails.amount || 0)/100}</td></tr>
        <tr><td style="border:1px solid black; padding:8px;">Payment Mode</td><td style="border:1px solid black; padding:8px;">${paymentDetails.method || "UPI / Card / Netbanking"}</td></tr>
        <tr><td style="border:1px solid black; padding:8px;">Date</td><td style="border:1px solid black; padding:8px;">${paymentDetails.date || new Date().toLocaleDateString()}</td></tr>
        <tr><td style="border:1px solid black; padding:8px;">Payer Name</td><td style="border:1px solid black; padding:8px;">${formData.applicantName || "N/A"}</td></tr>
      </table>
      <p style="margin-top:3rem;">Thank you for your payment.</p>
      <div style="margin-top:4rem; text-align:right;">
        <p>___________________________</p>
        <p><b>Authorized Signatory</b></p>
      </div>
    </div>
  `;

  // ----------------------
  // Combine all pages
  // ----------------------
  container.innerHTML = page1 + page2 + exhibitPages + paymentPage;

  // ----------------------
  // PDF Options
  // ----------------------
  const options = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: "Court_Application.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  // Generate PDF and get ArrayBuffer
  const pdfInstance = await html2pdf().set(options).from(container).toPdf().get("pdf");
  const arrayBuffer = pdfInstance.output("arraybuffer");

  // Remove temporary container
  document.body.removeChild(container);

  return arrayBuffer;
};
