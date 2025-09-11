import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { ArrowLeft } from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (role === "admin") {
        // ⭐ Fake admin login (no backend yet)
        const fakeAdmin = {
          email,
          token: "dummy-admin-token",
          role: "admin",
        };

        // simulate delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        login(fakeAdmin);
        navigate("/admin/dashboard");
      } else {
        // ⭐ Real user login via backend
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        login(data);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen relative overflow-hidden 
        ${
          role === "admin"
            ? "bg-gradient-to-br from-black via-gray-900 to-red-900"
            : "bg-gradient-to-br from-black via-gray-900 to-blue-900"
        }`}
    >
      {/* Blurred gradient circles */}
      <div
        className={`absolute top-32 left-20 w-72 h-72 rounded-full blur-[120px] opacity-30
          ${role === "admin" ? "bg-red-600" : "bg-blue-600"}`}
      ></div>
      <div
        className={`absolute bottom-32 right-20 w-72 h-72 rounded-full blur-[120px] opacity-30
          ${role === "admin" ? "bg-red-400" : "bg-blue-400"}`}
      ></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          {role === "admin" ? "Admin Login" : "User Login"}
        </h2>

        {/* Tabs */}
        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setRole("user")}
            className={`flex-1 py-2 text-center font-medium transition 
              ${
                role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`flex-1 py-2 text-center font-medium transition 
              ${
                role === "admin"
                  ? "bg-red-600 text-white"
                  : "bg-transparent text-gray-400 hover:text-white"
              }`}
          >
            Admin
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mb-4 text-center font-medium">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {role === "admin" ? "Admin Email" : "User Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-blue-500/60 outline-none transition"
              placeholder={`Enter your ${role} email`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg px-4 py-3 bg-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-red-500/60 outline-none transition"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-lg font-semibold tracking-wide shadow-md transition-all 
              ${
                loading
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : role === "admin"
                  ? "bg-gradient-to-r from-red-600 to-red-700 text-white hover:scale-[1.02]"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-[1.02]"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link only for users */}
        {role === "user" && (
          <p className="text-sm text-gray-400 mt-8 text-center">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-400 hover:underline"
            >
              Register
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
