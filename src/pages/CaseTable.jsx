import React from "react";

const CaseTable = ({ cases }) => {
  return (
    <div className="overflow-x-auto mt-4 p-2">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-4 border-b">Case Name</th>
            <th className="text-left py-2 px-4 border-b">Status</th>
            <th className="text-left py-2 px-4 border-b">Next Date</th>
            <th className="text-left py-2 px-4 border-b">Advocate</th>
            <th className="text-left py-2 px-4 border-b">Case Type</th>
            <th className="text-left py-2 px-4 border-b">Documents</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{c.caseName}</td>
              <td
                className={`py-2 px-4 border-b font-semibold ${
                  c.status === "Running" ? "text-green-600" : "text-gray-500"
                }`}
              >
                {c.status}
              </td>
              <td className="py-2 px-4 border-b">{c.nextDate}</td>
              <td className="py-2 px-4 border-b">{c.advocate}</td>
              <td className="py-2 px-4 border-b">{c.caseType}</td>
              <td className="py-2 px-4 border-b space-y-1">
                {c.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block"
                  >
                    {doc.name}
                  </a>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseTable;
