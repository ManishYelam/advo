// usePrint.js
import { useCallback } from "react";

const usePrint = (elementId) => {
  const handlePrint = useCallback(() => {
    const printContents = document.getElementById(elementId)?.innerHTML;
    if (!printContents) {
      console.warn(`No element found with id "${elementId}"`);
      return;
    }

    const printWindow = window.open("", "_blank", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Preview</title>
          <style>
            @page {
              margin: 1in;
            }
            body {
              font-family: "Times New Roman", Times, serif;
              font-size: 12pt;
              line-height: 1.6;
              margin: 0;
              padding: 1in;
              color: #000;
            }
            h3 {
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 24px;
              text-align: center;
              text-decoration: underline;
            }
            h4 {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 12px;
              border-bottom: 1px solid #000;
              padding-bottom: 4px;
            }
            p, ul, li {
              margin: 8px 0;
            }
            ul {
              list-style-type: disc;
              margin-left: 20px;
              margin-bottom: 16px;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }, [elementId]);

  return handlePrint;
};

export default usePrint;
