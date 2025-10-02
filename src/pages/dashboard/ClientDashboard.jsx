import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/Card";

const ClientDashboard = () => {
  // Sample data (replace with API later)
  const myCases = [
    { caseName: "Case A", status: "Running", nextDate: "2025-10-10" },
    { caseName: "Case B", status: "Closed", nextDate: "2025-09-15" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="My Cases">
          <ul className="space-y-2">
            {myCases.map((item, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{item.caseName}</span>
                <span className={`font-semibold ${item.status === 'Running' ? 'text-green-600' : 'text-gray-500'}`}>{item.status}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Next Court Date">
          <p className="text-lg">Case A - 2025-10-10</p>
        </Card>

        <Card title="Payment Status">
          <p className="text-lg text-green-600">No pending payments</p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
