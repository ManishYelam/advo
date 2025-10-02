import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import Cases from "../pages/Cases";
import Clients from "../pages/Clients";
import Calendar from "../pages/Calendar";
import Documents from "../pages/Documents";
import Payments from "../pages/Payments";
import { useAuth } from "../hooks/useAuth";

const AppRoutes = () => {
  const { user } = useAuth(); // user context

  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/client"
          element={user?.role === "client" ? <ClientDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/cases"
          element={user ? <Cases /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients"
          element={user ? <Clients /> : <Navigate to="/login" />}
        />
        <Route
          path="/calendar"
          element={user ? <Calendar /> : <Navigate to="/login" />}
        />
        <Route
          path="/documents"
          element={user ? <Documents /> : <Navigate to="/login" />}
        />
        <Route
          path="/payments"
          element={user ? <Payments /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to={user ? (user.role === "admin" ? "/admin" : "/client") : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
