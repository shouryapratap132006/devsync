"use client";
import Link from "next/link";
import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <nav className="flex justify-between items-center py-5 px-8 md:px-20 bg-white backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center">
          <Brain className="text-blue-600 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Dev<span className="text-blue-600">Sync</span>
        </h1>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-8 text-gray-700 font-medium">
          <Link
            href="/dashboard"
            className="text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            Dashboard
          </Link>
          <Link href="#">Assessment</Link>
          <Link href="#">Roadmap</Link>
          <Link href="#">Progress</Link>
          <Link href="#">Community</Link>
          <Link href="#">Profile</Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            href="/auth/login"
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
          >
            Get Started →
          </Link>
        </div>
      )}
    </nav>
  );
}
