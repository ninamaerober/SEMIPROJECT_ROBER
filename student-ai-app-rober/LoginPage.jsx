import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        navigate("/landing"); // ✅ redirect to landing page after login
      } else {
        alert("Please enter your email and password.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bfrom-blue-800 via-gray-400 to-gray-200 px-6">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 mx-auto mb-2"
          />
          <h1 className="text-2xl font-bold text-blue-700">
            COLLEGE OF COMPUTER STUDIES
          </h1>
          <p className="text-gray-500 mt-1">Login to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          <span className="font-semibold">Niña Mae Rober</span>
        </p>
      </div>
    </div>
  );
}
