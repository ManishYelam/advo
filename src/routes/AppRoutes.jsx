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

const AppRoutes = () => {
  const { user } = useAuth(); // user context

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/client"} /> : <LandingPage />} />
        <Route path="/apply" element={<Application />} />
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
          path="/profile"
          element={user?.role === "client" ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={user?.role === "client" ? <NotificationsPage /> : <Navigate to="/login" />}
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
      </Routes>
    </Router>
  );
};

export default AppRoutes;
