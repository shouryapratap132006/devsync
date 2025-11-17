"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      {/* 🌅 Hero Section */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-20 py-16 relative overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <span className="text-sm md:text-base font-semibold text-blue-700 bg-blue-100 px-4 py-1 rounded-full shadow-sm">
            # AI-Powered Career Growth
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6"
          >
            Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-cyan-600">
              Career Growth Partner
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-gray-700 max-w-xl mx-auto mb-10 md:text-lg"
          >
            Build your dream developer career with personalized learning
            paths, AI mentorship, and real progress tracking — all in one
            platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Start Your Journey →
            </Link>
            <button className="border-2 border-blue-600 bg-white/80 text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 hover:shadow-md transition-all duration-200">
              Watch Demo
            </button>
          </motion.div>
        </div>
      </main>

      {/* 💡 Info Section */}
      <section className="px-6 md:px-20 py-16 bg-white shadow-inner rounded-t-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Everything you need to grow as a developer
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
          DevSync combines AI mentoring, roadmap generation, skill analytics,
          and a vibrant developer community — guiding you every step of your
          growth journey.
        </p>
      </section>

      {/* ⚙️ Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} DevSync. Made with ❤️ for developers.
      </footer>
    </div>
  );
}
