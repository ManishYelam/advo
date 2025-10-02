import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";

const AdminDashboard = () => {
  // Sample data (replace with API later)
  const stats = [
    { title: "Total Cases", value: 120 },
    { title: "Closed Cases", value: 80 },
    { title: "Running Cases", value: 30 },
    { title: "Clients", value: 50 },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <Card key={idx} title={item.title}>
            <p className="text-2xl font-bold">{item.value}</p>
          </Card>
        ))}
      </div>

      {/* Upcoming Court Dates (Sample Table) */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Court Dates</h2>
        <table className="w-full border border-gray-300 rounded">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2">Case</th>
              <th className="px-4 py-2">Client</th>
              <th className="px-4 py-2">Court Date</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2">Case A</td>
              <td className="px-4 py-2">John Doe</td>
              <td className="px-4 py-2">2025-10-10</td>
              <td className="px-4 py-2">Running</td>
            </tr>
            <tr className="border-t">
              <td className="px-4 py-2">Case B</td>
              <td className="px-4 py-2">Jane Smith</td>
              <td className="px-4 py-2">2025-10-12</td>
              <td className="px-4 py-2">Closed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
