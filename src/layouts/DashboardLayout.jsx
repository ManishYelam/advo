import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Main Content */}
      <div className="flex-grow ">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
