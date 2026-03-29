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

  const [isLogin, setIsLogin] = useState(false); // default = signup like image
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
        : { name, email, password, role: "Employee" }; // default role

      const res = await axios.post(url, payload);

      // 🔥 Only redirect after LOGIN (not signup)
      if (isLogin) {
        login(res.data);

        const role = res.data.user.role;

        // 🔥 CORRECT REDIRECT
        if (role === "Admin") {
          navigate("/dashboard"); // or "/users"
        } else if (role === "Manager") {
          navigate("/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        // After signup → switch to login
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
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-xl p-8 shadow-2xl">
          {/* Title */}
          <h2 className="text-2xl font-semibold text-white mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h2>

          <p className="text-sm text-gray-400 mb-6">
            {isLogin
              ? "Enter your credentials to login"
              : "Enter your email below to create your account"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (signup only) */}
            {!isLogin && (
              <div>
                <label className="text-sm text-gray-300">Name</label>
                <Input
                  className="mt-2 bg-gray-700/60 border-none text-white placeholder:text-gray-400 rounded-xl h-11"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <Input
                className="mt-2 bg-gray-700/60 border-none text-white placeholder:text-gray-400 rounded-xl h-11"
                placeholder="m@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <Input
                className="mt-2 bg-gray-700/60 border-none text-white placeholder:text-gray-400 rounded-xl h-11"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 text-center">{error}</p>
            )}

            {/* Button */}
            <Button
              className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:opacity-90"
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
          <p className="text-sm text-gray-400 text-center mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-white underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
