import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white p-6">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li><a href="/dashboard" className="hover:text-gray-200">Overview</a></li>
          <li><a href="/cases" className="hover:text-gray-200">Cases</a></li>
          <li><a href="/clients" className="hover:text-gray-200">Clients</a></li>
          <li><a href="/calendar" className="hover:text-gray-200">Calendar</a></li>
          <li><a href="/documents" className="hover:text-gray-200">Documents</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
