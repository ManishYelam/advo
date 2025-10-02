import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import { loginService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import lawyer from "../../assets/lawyer-login.png";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginService(formData);
      login(res.data.user); // store user in context
      if (res.data.user.role === "admin") navigate("/admin");
      else navigate("/client");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-11/12 max-w-4xl shadow-2xl rounded-lg overflow-hidden bg-white">

        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-700 to-green-400 p-10 flex items-center justify-center">
          <img
            src={lawyer}
            alt="Advocate Portal"
            className="w-full h-96 object-contain rounded-xl"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Advocate Portal
          </h1>
          <h2 className="text-xl font-medium text-gray-700 mb-6 text-center">
            Login to your account
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              required
            />
            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <a
                href="/forgot-password"
                className="text-green-600 hover:underline text-sm"
              >
                Forgot Password?
              </a>
            </div>
            <Button type="submit" className="w-full py-3 text-lg">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="text-green-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
