import html2pdf from "html2pdf.js";

export const generateCourtApplicationPDF = async () => {
  const formData = {
    applicantName: "Manish Yelam",
    name: "Manish Yelam",
    dob: "01/01/1995",
    gender: "Male",
    phone_number: "9876543210",
    age: "30",
    occupation: "Software Engineer",
    adhar_number: "1234-5678-9012",
    email: "manish@example.com",
    address: "123, ABC Street, Mumbai, India",
    notes: "No additional notes",
    savingAccountStartDate: "17/11/2022",
    depositType: "Fixed Deposit",
    depositDurationYears: "3",
    fixedDepositTotalAmount: "500000",
    interestRateFD: "6%",
    savingAccountTotalAmount: "100000",
    interestRateSaving: "3%",
    recurringDepositTotalAmount: "200000",
    interestRateRecurring: "5%",
    dnyanrudhaInvestmentTotalAmount: "150000",
    dynadharaRate: "4.5%",
  };

  const paymentDetails = {
    receipt: "RCPT123456",
    payment_id: "PAY123456",
    order_id: "ORD123456",
    amount: 120000, // in paise
    method: "UPI",
    date: "14/10/2025",
  };

  const exhibits = [
    {
      label: "A",
      title: "Account Slip 17.11.2022",
      images: ["https://via.placeholder.com/500x700?text=Exhibit+A+Page+1"],
    },
    {
      label: "B",
      title: "Deposits Statement",
      images: [
        "https://via.placeholder.com/500x700?text=Exhibit+B+Page+1",
        "https://via.placeholder.com/500x700?text=Exhibit+B+Page+2",
      ],
    },
  ];

  // ✅ Create hidden container for all pages
  const container = document.createElement("div");
  container.style.display = "none";
  document.body.appendChild(container);

  container.innerHTML = `
    <!-- ================= PAGE 1 ================= -->
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
        <p><b>${formData.applicantName}</b> ….. Applicant</p>
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
        </tbody>
      </table>
      <div style="display:flex; justify-content:space-between; font-size:12px;">
        <div>
          <p><b>Place:</b> Mumbai</p>
          <p><b>Date:</b> ${new Date().toLocaleDateString("en-IN")}</p>
        </div>
        <div style="text-align:right;">
          <p>___________________________</p>
          <p>Advocate for the Applicant</p>
        </div>
      </div>
    </div>

    <!-- ================= PAGE 2 ================= -->
    <div style="page-break-before: always; padding: 3rem; font-family: 'Times New Roman'; font-size: 13px;">
      <h3 style="text-align:center; text-decoration:underline;">APPLICATION</h3>
      <p>TO,</p>
      <p>THE HON’BLE SPECIAL JUDGE FOR PMLA CASES, MUMBAI.</p>
      <br/>
      <p>Most Respectfully Sheweth,</p>
      <p>1. That the applicant submits that he is filing this application in respect to the ongoing matter concerning ECIR/MBZO-1//2025.</p>
      <p>2. That the applicant prays that the Hon’ble Court may kindly consider his request for submission of the supporting documents and affidavit.</p>
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

    <!-- ================= PAGE 3 – APPLICATION DETAILS ================= -->
    <div style="page-break-before: always; padding: 2rem; font-family:'Times New Roman'; font-size:12px;">
      <header style="text-align:center; font-weight:bold; font-size:14px; margin-bottom:1rem;">APPLICATION DETAILS</header>
      <div style="display:flex; justify-content:flex-end; font-size:11px; font-style:italic; margin-bottom:1rem;">
        Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
      </div>
      <section style="border:1px solid #ccc; padding:0.5rem; margin-bottom:1rem;">
        <h4 style="font-weight:bold; text-decoration:underline; margin-bottom:0.5rem; font-size:12px;">1. BASIC INFORMATION</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem;">
          <div>
            <p><strong>Full Name:</strong> ${formData.name}</p>
            <p><strong>DOB:</strong> ${formData.dob}</p>
            <p><strong>Gender:</strong> ${formData.gender}</p>
          </div>
          <div>
            <p><strong>Phone:</strong> ${formData.phone_number}</p>
            <p><strong>Age:</strong> ${formData.age}</p>
            <p><strong>Occupation:</strong> ${formData.occupation}</p>
          </div>
          <div>
            <p><strong>Aadhar:</strong> ${formData.adhar_number}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Address:</strong> ${formData.address}</p>
            <p><strong>Notes:</strong> ${formData.notes}</p>
          </div>
        </div>
      </section>

      <section style="border:1px solid #ccc; padding:0.5rem; margin-bottom:1rem;">
        <h4 style="font-weight:bold; text-decoration:underline; margin-bottom:0.5rem; font-size:12px;">2. DEPOSIT DETAILS</h4>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem;">
          <div>
            <p><strong>Saving Account Start Date:</strong> ${formData.savingAccountStartDate}</p>
            <p><strong>Deposit Type:</strong> ${formData.depositType}</p>
            <p><strong>Deposit Duration (Years):</strong> ${formData.depositDurationYears}</p>
          </div>
          <div>
            <p><strong>Fixed Deposit Total:</strong> ${formData.fixedDepositTotalAmount}</p>
            <p><strong>Interest Rate (FD %):</strong> ${formData.interestRateFD}</p>
            <p><strong>Savings Total:</strong> ${formData.savingAccountTotalAmount}</p>
            <p><strong>Interest Rate (Savings %):</strong> ${formData.interestRateSaving}</p>
          </div>
          <div>
            <p><strong>Recurring Total:</strong> ${formData.recurringDepositTotalAmount}</p>
            <p><strong>Interest Rate (RD %):</strong> ${formData.interestRateRecurring}</p>
            <p><strong>Dnyanrudha Investment:</strong> ${formData.dnyanrudhaInvestmentTotalAmount}</p>
            <p><strong>Dynadhara Rate (%):</strong> ${formData.dynadharaRate}</p>
          </div>
        </div>
      </section>

      <section style="border:1px solid #ccc; padding:0.5rem; background-color:#f7f7f7; margin-bottom:1rem; font-style:italic;">
        I hereby affirm that the above information is true and correct to the best of my knowledge.
      </section>

      <div style="text-align:right; margin-top:2rem;">
        <p>_________________________</p>
        <p><strong>Signature of Applicant</strong></p>
      </div>
    </div>

    <!-- ================= PAYMENT RECEIPT ================= -->
    <div style="page-break-before: always; padding: 3rem; font-family: 'Times New Roman'; font-size: 13px;">
      <h2 style="text-align:center; text-decoration:underline; font-size:18px; margin-bottom:1rem;">PAYMENT RECEIPT</h2>
      <p style="text-align:center;">This receipt acknowledges payment for the court application.</p>
      <table style="width:100%; border-collapse:collapse; margin-top:2rem; font-size:12px; border:1px solid black;">
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Receipt No.</td><td style="border:1px solid black; padding:8px;">${paymentDetails.receipt}</td></tr>
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Payment ID</td><td style="border:1px solid black; padding:8px;">${paymentDetails.payment_id}</td></tr>
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Order ID</td><td style="border:1px solid black; padding:8px;">${paymentDetails.order_id}</td></tr>
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Amount</td><td style="border:1px solid black; padding:8px;">₹${(paymentDetails.amount / 100).toFixed(2)}</td></tr>
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Payment Mode</td><td style="border:1px solid black; padding:8px;">${paymentDetails.method}</td></tr>
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Date</td><td style="border:1px solid black; padding:8px;">${paymentDetails.date}</td></tr>
        <tr><td style="border:1px solid black; padding:8px; font-weight:bold;">Payer Name</td><td style="border:1px solid black; padding:8px;">${formData.applicantName}</td></tr>
      </table>
      <div style="margin-top:4rem; text-align:right;">
        <p>___________________________</p>
        <p><b>Authorized Signatory</b></p>
      </div>
    </div>

    <!-- ================= EXHIBITS ================= -->
    ${exhibits
      .map(
        (exhibit) => `
      <div style="page-break-before: always; width: 100%; text-align:center; font-family:'Times New Roman';">
        <h1 style="font-size:28px; font-weight:bold; text-decoration:underline;">EXHIBIT ${exhibit.label}</h1>
        <p style="font-size:14px; margin-top:1rem;">(${exhibit.title})</p>
      </div>
      ${exhibit.images
        .map(
          (img) => `
        <div style="page-break-before: always; width:100%; height:11.69in; display:flex; justify-content:center; align-items:flex-start; padding-top:1in; font-family:'Times New Roman';">
          <img src="${img}" style="max-width:100%; max-height:90%;" />
        </div>
      `
        )
        .join("")}
    `
      )
      .join("")}
  `;

  // ✅ Generate PDF in one go
  const opt = {
    margin: [0.8, 1, 0.8, 1],
    filename: "Court_Application_Complete.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };

  await html2pdf().set(opt).from(container).save();
  document.body.removeChild(container);
};

generateCourtApplicationPDF()