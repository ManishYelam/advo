import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Button from "../components/Button";

const Documents = () => {
  const sampleDocs = [
    { name: "Contract A", type: "PDF" },
    { name: "Legal Notice B", type: "DOCX" },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <div className="mb-4">
        <Button>Upload Document</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleDocs.map((doc, idx) => (
          <Card key={idx} title={doc.name}>
            <p>Type: {doc.type}</p>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Documents;
