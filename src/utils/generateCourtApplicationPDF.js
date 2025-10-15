import html2pdf from "html2pdf.js";

/**
 * Generate Court Application PDF with dynamic exhibits.
 * @param {Object} formData - Application form data
 * @param {Object} paymentDetails - Payment details
 * @param {Array} exhibits - Array of exhibits [{ title: "Exhibit A", description: "Copy of deposit slip", content: "optional content" }, ...]
 * @returns {Promise<ArrayBuffer>}
 */
export const generateCourtApplicationPDF = async (formData = {}, paymentDetails = {}, exhibits = []) => {
  // Create hidden container
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);

  // ----------------------
  // PAGE 1: Cover + Index
  // ----------------------
  const page1 = `
    <div style="padding:3rem; font-family:'Times New Roman'; font-size:13px;">
      <div style="text-align:center; font-weight:bold;">
        <p>IN THE COURT OF HON'BLE SESSION FOR GREATER BOMBAY AT, MUMBAI</p>
        <p>SPECIAL COURT FOR PMLA CASES</p>
        <p>CRIMINAL APPLICATION/EXHIBIT NO. ____ OF 2025</p>
      </div>

      <div style="margin:2rem 0;">
        <p><b>${formData.name || ""}</b> ….. Applicant</p>
        <p>VERSUS</p>
        <p>DYANDHARA MULTISTATE CO-OPERATIVE CREDIT SOCIETY ….. <b>Accused</b></p>
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
          <tr>
            <td style="border:1px solid black; text-align:center;">1</td>
            <td style="border:1px solid black;">Application</td>
            <td style="border:1px solid black;"></td>
            <td style="border:1px solid black; text-align:center;">1</td>
          </tr>
          <tr>
            <td style="border:1px solid black; text-align:center;">2</td>
            <td style="border:1px solid black;">List of Documents</td>
            <td style="border:1px solid black;"></td>
            <td style="border:1px solid black; text-align:center;">2–5</td>
          </tr>
          ${exhibits.map((ex, i) => `
            <tr>
              <td style="border:1px solid black; text-align:center;">${i + 3}</td>
              <td style="border:1px solid black;">${ex.description}</td>
              <td style="border:1px solid black; text-align:center;">${ex.title}</td>
              <td style="border:1px solid black; text-align:center;"></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // ----------------------
  // PAGE 2: Application Details
  // ----------------------
  const page2 = `
    <div style="page-break-before: always; padding:2rem; font-family:'Times New Roman'; font-size:12px;">
      <h3 style="text-align:center; text-decoration:underline;">APPLICATION</h3>
      <p>TO, THE HON’BLE SPECIAL JUDGE FOR PMLA CASES, MUMBAI.</p>
      <p>Most Respectfully Sheweth,</p>
      <ol>
        <li>That the applicant submits this application regarding ECIR/MBZO-1//2025.</li>
        <li>That the applicant prays for submission of supporting documents and affidavit.</li>
      </ol>
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
      <h3 style="text-align:center; text-decoration:underline;">${ex.title}</h3>
      <p>${ex.description}</p>
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
        <tr>
          <td style="border:1px solid black; padding:8px;">Payment ID</td>
          <td style="border:1px solid black; padding:8px;">${paymentDetails.payment_id || "N/A"}</td>
        </tr>
        <tr>
          <td style="border:1px solid black; padding:8px;">Order ID</td>
          <td style="border:1px solid black; padding:8px;">${paymentDetails.order_id || "N/A"}</td>
        </tr>
        <tr>
          <td style="border:1px solid black; padding:8px;">Amount</td>
          <td style="border:1px solid black; padding:8px;">₹${(paymentDetails.amount || 0)/100}</td>
        </tr>
        <tr>
          <td style="border:1px solid black; padding:8px;">Date</td>
          <td style="border:1px solid black; padding:8px;">${paymentDetails.date || new Date().toLocaleDateString()}</td>
        </tr>
      </table>
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
