import { useState } from "react";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      alert("Account successfully registered!");
      navigate("/"); // redirect to login after registration
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-bfrom-blue-800 via-gray-400 to-gray-200 px-4 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md relative">
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-700">
            COLLEGE OF COMPUTER STUDIES
          </h1>
          <p className="text-gray-500">Create a new account</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/")}
              className="text-green-600 hover:underline font-medium"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
