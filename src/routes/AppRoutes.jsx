import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ClientDashboard from "../pages/dashboard/ClientDashboard";
import AdvocateDashboard from "../pages/dashboard/AdvocateDashboard";
import Cases from "../pages/Cases";
import Clients from "../pages/Clients";
import Calendar from "../pages/Calendar";
import Documents from "../pages/Documents";
import Payments from "../pages/Payments";
import { useAuth } from "../hooks/useAuth";

// Public Landing page
import LandingPage from "../pages/LandingPage";
import Application from "../pages/Application";
import ApplicantUserForm from "../pages/ApplicantUserForm";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import TermsOfService from "../pages/TermsOfService";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import NotificationsPage from "../pages/Notifications";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import VerifyEmail from "../pages/auth/verifyEmail";
import Support from "../pages/Support";
import About from "../pages/About";

// Dashboard route mapping - faster than switch
const DASHBOARD_ROUTES = {
  admin: "/admin",
  advocate: "/advocate",
  client: "/client"
};

// Role-based access configuration
const ROLE_ACCESS = {
  clients: ["admin", "advocate"],
  payments: ["admin", "client"],
  all: ["admin", "advocate", "client"]
};

const AppRoutes = () => {
  const { user } = useAuth();

  // Fast dashboard route lookup
  const getDashboardRoute = (role) => DASHBOARD_ROUTES[role] || "/login";

  // Check if user has required role access
  const hasRoleAccess = (requiredRoles) =>
    user && requiredRoles.includes(user.role);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={user ? <Navigate to={getDashboardRoute(user.role)} /> : <LandingPage />}
        />
        <Route path="/apply" element={<Application />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/support" element={<Support />} />
        <Route path="/verify-email/:userId/:otp" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/applicant/:userId" element={<ApplicantUserForm />} />

        {/* Dashboard Routes */}
        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/advocate"
          element={user?.role === "advocate" ? <AdvocateDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/client"
          element={user?.role === "client" ? <ClientDashboard /> : <Navigate to="/login" />}
        />

        {/* Shared Protected Routes */}

        {/* Accessible to all authenticated users */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={user ? <NotificationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/cases"
          element={user ? <Cases /> : <Navigate to="/login" />}
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
          path="/support-tickets"
          element={user ? <Support /> : <Navigate to="/login" />}
        />

        {/* Role-specific routes */}
        <Route
          path="/clients"
          element={hasRoleAccess(ROLE_ACCESS.clients) ? <Clients /> : <Navigate to="/login" />}
        />
        <Route
          path="/payments"
          element={hasRoleAccess(ROLE_ACCESS.payments) ? <Payments /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
