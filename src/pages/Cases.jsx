import DashboardLayout from "../layouts/DashboardLayout";
// import Card from "../components/Card";
import Button from "../components/Button";

const Cases = () => {
  const sampleCases = [
    { name: "Case A", client: "John Doe", status: "Running", nextDate: "2025-10-10" },
    { name: "Case B", client: "Jane Smith", status: "Closed", nextDate: "2025-09-15" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Cases</h1>
      <div className="mb-4">
        <Button>Add New Case</Button>
      </div>
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2">Case Name</th>
            <th className="px-4 py-2">Client</th>
            <th className="px-4 py-2">Next Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sampleCases.map((c, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.client}</td>
              <td className="px-4 py-2">{c.nextDate}</td>
              <td className="px-4 py-2">{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

export default Cases;
