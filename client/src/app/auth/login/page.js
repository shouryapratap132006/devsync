"use client";
import { useState, useEffect } from "react";
import api from "../../../lib/axios";
import { useRouter } from "next/navigation";
import { Brain, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.replace("/dashboard");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0F1F] relative overflow-hidden">

      {/* LEFT SECTION */}
      <div className="w-[55%] flex flex-col justify-center pl-28 pr-10 text-white relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md">
            <Brain className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight">
            Dev<span className="text-blue-500">Sync</span>
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl font-bold leading-tight"
        >
          Welcome Back to <br /> Your AI Partner
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 text-gray-300 text-xl w-[85%] leading-relaxed"
        >
          Sign in to access personalized developer insights and AI-guided learning paths.
        </motion.p>
      </div>

      {/* RIGHT SECTION */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-[45%] flex items-center justify-center p-12"
      >
        <div className="w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-14 shadow-2xl">

          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Welcome Back!
          </h2>

          <p className="text-gray-400 text-center mb-10 text-lg">
            Continue your journey with DevSync
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="text-gray-300 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-12 py-4 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-12 py-4 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {error && <p className="text-red-400 text-center text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-gray-400 text-center mt-8 text-sm">
            Do not have an account?{" "}
            <Link href="/auth/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>

          <p className="text-center mt-8 text-gray-400 text-xs">
            By continuing, you agree to DevSync's{" "}
            <Link href="/terms" className="text-blue-400 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-400 hover:underline">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
