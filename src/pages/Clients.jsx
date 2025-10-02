import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";

const Clients = () => {
  const sampleClients = [
    { name: "John Doe", email: "john@example.com", phone: "1234567890" },
    { name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Clients</h1>
      <div className="mb-4">
        <Button>Add New Client</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleClients.map((c, idx) => (
          <Card key={idx} title={c.name}>
            <p>Email: {c.email}</p>
            <p>Phone: {c.phone}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Clients;
