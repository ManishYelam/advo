// src/utils/generateCourtApplicationPDF.js
import html2pdf from "html2pdf.js";

export const generateCourtApplicationPDF = async (formData = {}, exhibits = [], paymentDetails = {}) => {
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);

  // ✅ PAGE 1 + PAGE 2 (Core Application)
  container.innerHTML = `
    <!-- PAGE 1 -->
    <div style="padding: 5rem; font-family: 'Times New Roman'; font-size: 13px; line-height: 1.5;">
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
        <p><b>${formData.applicantName || "Manish Yelam"}</b> ….. Applicant</p>
        <p>VERSUS</p>
        <p>DYANDHARA MULTISTATE CO-OPERATIVE CREDIT SOCIETY ….. <b>Accused</b></p>
        <p>DIRECTORATE OF ENFORCEMENT ….. <b>Complainant</b></p>
      </div>

      <h3 style="text-align:center; text-decoration:underline;">INDEX</h3>

      <table style="width:100%; border-collapse:collapse; border:1px solid black; margin-bottom:1.5rem; font-size:12px;">
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
          <tr><td style="border:1px solid black; text-align:center;">3</td><td style="border:1px solid black;">Copy of the slip of Account started on 17.11.2022</td><td style="border:1px solid black; text-align:center;">A</td><td style="border:1px solid black; text-align:center;"></td></tr>
          <tr><td style="border:1px solid black; text-align:center;">4</td><td style="border:1px solid black;">Copy of the Deposits Amount by Applicant to the said bank</td><td style="border:1px solid black; text-align:center;">B</td><td style="border:1px solid black; text-align:center;"></td></tr>
          <tr><td style="border:1px solid black; text-align:center;">5</td><td style="border:1px solid black;">Copy of the statement by Applicant to Shrirampur Police Station</td><td style="border:1px solid black; text-align:center;">C</td><td style="border:1px solid black; text-align:center;"></td></tr>
          <tr><td style="border:1px solid black; text-align:center;">6</td><td style="border:1px solid black;">Memorandum of Address</td><td style="border:1px solid black; text-align:center;"></td><td style="border:1px solid black; text-align:center;"></td></tr>
          <tr><td style="border:1px solid black; text-align:center;">7</td><td style="border:1px solid black;">Affidavit-in-Support of the Application</td><td style="border:1px solid black; text-align:center;"></td><td style="border:1px solid black; text-align:center;"></td></tr>
          <tr><td style="border:1px solid black; text-align:center;">8</td><td style="border:1px solid black;">Vakalatnama</td><td style="border:1px solid black; text-align:center;"></td><td style="border:1px solid black; text-align:center;"></td></tr>
        </tbody>
      </table>

      <div style="display:flex; justify-content:space-between; font-size:12px;">
        <div>
          <p><b>Place:</b> Mumbai</p>
          <p><b>Date:</b> 13/10/2025</p>
        </div>
        <div style="text-align:right;">
          <p>___________________________</p>
          <p>Advocate for the Applicant</p>
        </div>
      </div>
    </div>

    <!-- PAGE 2 -->
    <div style="page-break-before: always; padding: 5rem; font-family: 'Times New Roman'; font-size: 13px;">
      <h3 style="text-align:center; text-decoration:underline;">APPLICATION</h3>
      <p>TO,</p>
      <p>THE HON’BLE SPECIAL JUDGE FOR PMLA CASES, MUMBAI.</p>
      <br/>
      <p>Most Respectfully Sheweth,</p>
      <p>
        1. That the applicant submits that he is filing this application in respect to the ongoing matter
        concerning ECIR/MBZO-1//2025.
      </p>
      <p>
        2. That the applicant prays that the Hon’ble Court may kindly consider his request for submission
        of the supporting documents and affidavit.
      </p>
      <br/>
      <p><b>PRAYER:</b></p>
      <p>In view of the above, the Applicant humbly prays that this Hon’ble Court may be pleased to:</p>
      <ol>
        <li>Take the accompanying documents on record.</li>
        <li>Grant any other relief as deemed fit and proper in the interest of justice.</li>
      </ol>

      <div style="margin-top: 4rem; text-align:right;">
        <p>___________________________</p>
        <p><b>Advocate for the Applicant</b></p>
      </div>
    </div>
  `;

  // ✅ Create base PDF
  const opt = {
    margin: [0.8, 1, 0.8, 1],
    filename: "Court_Application_Combined.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  const pdf = html2pdf().set(opt).from(container);
  await pdf.toPdf().get("pdf");

  document.body.removeChild(container);

  // ✅ PAGE 3 – APPLICATION DETAILS (Direct HTML, no React)
  const appDetailsPage = document.createElement("div");
  appDetailsPage.style.width = "8.27in";
  appDetailsPage.style.height = "11.69in";
  appDetailsPage.style.padding = "2rem";
  appDetailsPage.style.fontFamily = "Times New Roman";
  appDetailsPage.style.fontSize = "12px";
  appDetailsPage.style.pageBreakBefore = "always";

  appDetailsPage.innerHTML = `
  <header style="text-align:center; font-weight:bold; font-size:14px; margin-bottom:1rem;">
    APPLICATION DETAILS
  </header>

  <!-- Top Right Date -->
  <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
    <div></div>
    <div style="text-align:right; font-style:italic; font-size:11px;">
      Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
    </div>
  </div>

  <!-- Basic Information -->
  <section style="border:1px solid #ccc; padding:0.5rem; margin-bottom:1rem;">
    <h4 style="font-weight:bold; text-decoration:underline; margin-bottom:0.5rem; font-size:12px;">1. BASIC INFORMATION</h4>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem;">
      <div>
        <p><strong>Full Name:</strong> ${formData.name || ""}</p>
        <p><strong>DOB:</strong> ${formData.dob || ""}</p>
        <p><strong>Gender:</strong> ${formData.gender || ""}</p>
      </div>
      <div>
        <p><strong>Phone:</strong> ${formData.phone_number || ""}</p>
        <p><strong>Age:</strong> ${formData.age || ""}</p>
        <p><strong>Occupation:</strong> ${formData.occupation || ""}</p>
      </div>
      <div>
        <p><strong>Aadhar:</strong> ${formData.adhar_number || ""}</p>
        <p><strong>Email:</strong> ${formData.email || ""}</p>
        <p><strong>Address:</strong> ${formData.address || ""}</p>
        <p><strong>Notes:</strong> ${formData.notes || ""}</p>
      </div>
    </div>
  </section>

  <!-- Deposit Details -->
  <section style="border:1px solid #ccc; padding:0.5rem; margin-bottom:1rem;">
    <h4 style="font-weight:bold; text-decoration:underline; margin-bottom:0.5rem; font-size:12px;">2. DEPOSIT DETAILS</h4>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem;">
      <div>
        <p><strong>Saving Account Start Date:</strong> ${formData.savingAccountStartDate || ""}</p>
        <p><strong>Deposit Type:</strong> ${formData.depositType || ""}</p>
        <p><strong>Deposit Duration (Years):</strong> ${formData.depositDurationYears || ""}</p>
      </div>
      <div>
        <p><strong>Fixed Deposit Total:</strong> ${formData.fixedDepositTotalAmount || ""}</p>
        <p><strong>Interest Rate (FD %):</strong> ${formData.interestRateFD || ""}</p>
        <p><strong>Savings Total:</strong> ${formData.savingAccountTotalAmount || ""}</p>
        <p><strong>Interest Rate (Savings %):</strong> ${formData.interestRateSaving || ""}</p>
      </div>
      <div>
        <p><strong>Recurring Total:</strong> ${formData.recurringDepositTotalAmount || ""}</p>
        <p><strong>Interest Rate (RD %):</strong> ${formData.interestRateRecurring || ""}</p>
        <p><strong>Dnyanrudha Investment:</strong> ${formData.dnyanrudhaInvestmentTotalAmount || ""}</p>
        <p><strong>Dynadhara Rate (%):</strong> ${formData.dynadharaRate || ""}</p>
      </div>
    </div>
  </section>

  <!-- Declaration -->
  <section style="border:1px solid #ccc; padding:0.5rem; background-color:#f7f7f7; margin-bottom:1rem; font-style:italic;">
    I hereby affirm that the above information is true and correct to the best of my knowledge.
  </section>

  <!-- Signature -->
  <div style="text-align:right; margin-top:2rem;">
    <p>_________________________</p>
    <p><strong>Signature of Applicant</strong></p>
  </div>
`;

  document.body.appendChild(appDetailsPage);
  await pdf.from(appDetailsPage).toContainer().toCanvas().toPdf().get("pdf");
  document.body.removeChild(appDetailsPage);

  // ✅ PAYMENT RECEIPT PAGE
  const receiptPage = document.createElement("div");
  receiptPage.style.width = "8.27in";
  receiptPage.style.height = "11.69in";
  receiptPage.style.padding = "4rem";
  receiptPage.style.fontFamily = "Times New Roman";
  receiptPage.style.fontSize = "13px";
  receiptPage.style.pageBreakBefore = "always";

  const details = paymentDetails || {};
  receiptPage.innerHTML = `
    <h2 style="text-align:center; text-decoration:underline; font-size:18px; margin-bottom:1rem;">
      PAYMENT RECEIPT
    </h2>
    <p style="text-align:center;">This receipt acknowledges payment for the court application.</p>

    <table style="width:100%; border-collapse:collapse; margin-top:2rem; font-size:12px; border:1px solid black;">
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Receipt No.</td>
        <td style="border:1px solid black; padding:8px;">${details.receipt || "N/A"}</td>
      </tr>
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Payment ID</td>
        <td style="border:1px solid black; padding:8px;">${details.payment_id || "N/A"}</td>
      </tr>
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Order ID</td>
        <td style="border:1px solid black; padding:8px;">${details.order_id || "N/A"}</td>
      </tr>
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Amount</td>
        <td style="border:1px solid black; padding:8px;">₹${(details.amount / 100 || 0).toFixed(2)}</td>
      </tr>
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Payment Mode</td>
        <td style="border:1px solid black; padding:8px;">${details.method || "UPI / Card / Netbanking"}</td>
      </tr>
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Date</td>
        <td style="border:1px solid black; padding:8px;">${details.date || new Date().toLocaleDateString()}</td>
      </tr>
      <tr>
        <td style="border:1px solid black; padding:8px; font-weight:bold;">Payer Name</td>
        <td style="border:1px solid black; padding:8px;">${formData.applicantName || "N/A"}</td>
      </tr>
    </table>

    <p style="margin-top:3rem;">Thank you for your payment.</p>

    <div style="margin-top:4rem; text-align:right;">
      <p>___________________________</p>
      <p><b>Authorized Signatory</b></p>
    </div>
  `;

  document.body.appendChild(receiptPage);
  await pdf.from(receiptPage).toContainer().toCanvas().toPdf().get("pdf");
  document.body.removeChild(receiptPage);

  // ✅ EXHIBITS
  for (const exhibit of exhibits) {
    const exhibitTitlePage = document.createElement("div");
    exhibitTitlePage.style.width = "8.27in";
    exhibitTitlePage.style.height = "11.69in";
    exhibitTitlePage.style.display = "flex";
    exhibitTitlePage.style.flexDirection = "column";
    exhibitTitlePage.style.alignItems = "center";
    exhibitTitlePage.style.justifyContent = "center";
    exhibitTitlePage.style.fontFamily = "Times New Roman";
    exhibitTitlePage.style.pageBreakBefore = "always";
    exhibitTitlePage.innerHTML = `
      <h1 style="font-size:28px; font-weight:bold; text-align:center; text-decoration:underline;">
        EXHIBIT ${exhibit.label}
      </h1>
      <p style="font-size:14px; text-align:center; margin-top:1rem;">
        (${exhibit.title || ""})
      </p>
    `;

    document.body.appendChild(exhibitTitlePage);
    await pdf.from(exhibitTitlePage).toContainer().toCanvas().toPdf().get("pdf");
    document.body.removeChild(exhibitTitlePage);

    for (let i = 0; i < exhibit.images.length; i++) {
      const pageDiv = document.createElement("div");
      pageDiv.style.width = "8.27in";
      pageDiv.style.height = "11.69in";
      pageDiv.style.display = "flex";
      pageDiv.style.flexDirection = "column";
      pageDiv.style.alignItems = "center";
      pageDiv.style.justifyContent = "flex-start";
      pageDiv.style.paddingTop = "1in";
      pageDiv.style.fontFamily = "Times New Roman";
      pageDiv.style.pageBreakBefore = "always";

      const imgEl = document.createElement("img");
      imgEl.src = exhibit.images[i];
      imgEl.style.maxWidth = "100%";
      imgEl.style.maxHeight = "90%";
      imgEl.style.marginTop = "0.5in";
      pageDiv.appendChild(imgEl);

      document.body.appendChild(pageDiv);
      await pdf.from(pageDiv).toContainer().toCanvas().toPdf().get("pdf");
      document.body.removeChild(pageDiv);
    }
  }

  // ✅ Final save
  pdf.save();
};
