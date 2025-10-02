import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { signupService } from "../../services/authService";
import lawyer from "../../assets/lawyer-login.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("Form Data:", formData);

      await signupService(formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-11/12 max-w-4xl shadow-2xl rounded-lg overflow-hidden bg-white">

        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-green-700 to-green-400 p-10 flex items-center justify-center">
          <img
            src={lawyer}
            alt="Advocate Portal"
            className="w-full h-[28rem] object-contain rounded-xl"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
            Advocate Portal
          </h1>
          <h2 className="text-xl font-medium text-gray-700 mb-6 text-center">
            Sign Up for your account
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
              required
            />
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
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            >
              <option value="client">Client</option>
              <option value="admin">Admin</option>
              {/* <option value="advocate">Advocate</option> */}
            </select>
            <Button type="submit" className="w-full py-3 text-lg">
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-green-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
