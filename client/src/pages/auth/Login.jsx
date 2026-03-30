import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Context
import { useAuth } from "@/context/AuthContext";

// Utils
import { cn } from "@/lib/utils";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// AuthForm
export default function AuthForm({ className, ...props }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isLogin
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const payload = isLogin
        ? { email, password }
        : { name, email, password, role: "Employee" };

      const res = await axios.post(url, payload);

      if (isLogin) {
        login(res.data);

        const role = res.data.user.role;

        if (role === "Admin") {
          navigate("/dashboard");
        } else if (role === "Manager") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          {/* Title */}
          <h2 className="text-2xl text-center font-semibold text-gray-900 mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>

          <p className="text-sm text-center text-gray-500 mb-6">
            {isLogin
              ? "Enter your credentials to login"
              : "Enter your email below to create your account"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            {!isLogin && (
              <div>
                <label className="text-sm text-gray-700">Name</label>
                <Input
                  className="mt-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm text-gray-700">Email</label>
              <Input
                className="mt-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="m@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <Input
                className="mt-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 rounded-xl h-11 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            {/* Button */}
            <Button
              className="w-full h-11 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Login"
                : "Create account"}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-sm text-gray-600 text-center mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-indigo-600 font-medium hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
