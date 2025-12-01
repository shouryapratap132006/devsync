"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "./components/Navbar";

// React Icons - Keep as you asked
import {
  TbBrain,
  TbTargetArrow,
  TbChartLine,
  TbUsers,
  TbCode,
  TbSparkles,
  TbRocket,
  TbBadge,
} from "react-icons/tb";
import Footer from "./components/Footer";

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
            paths, AI mentorship, and real progress tracking — all in one platform.
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
          and a vibrant developer community — guiding you every step of your growth journey.
        </p>
      </section>

      {/* 🚀 FEATURE CARDS */}
      <section className="px-6 md:px-20 py-16 bg-gradient-to-b from-blue-50 to-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Accelerate Your Growth
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-12">
          Everything you need to level up your developer career
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              title: "AI-Powered Assessment",
              desc: "Get personalized skill evaluations powered by advanced AI.",
              icon: <TbBrain className="text-blue-600 text-6xl mb-5" />,
            },
            {
              title: "Custom Roadmaps",
              desc: "Receive tailored learning paths based on your goals.",
              icon: <TbTargetArrow className="text-blue-600 text-6xl mb-5" />,
            },
            {
              title: "Track Progress",
              desc: "Visualize your growth with detailed analytics.",
              icon: <TbChartLine className="text-blue-600 text-6xl mb-5" />,
            },
            {
              title: "Community Support",
              desc: "Connect with mentors and fellow developers.",
              icon: <TbUsers className="text-blue-600 text-6xl mb-5" />,
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-100 flex flex-col items-center"
            >
              {item.icon}
              <h3 className="font-semibold text-xl text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🔄 HOW IT WORKS */}
      <section className="px-6 md:px-20 py-20 bg-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          How It Works
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-16">
          Four simple steps to career growth
        </p>

        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {[
            { step: "Step 1", title: "Complete skill assessment", icon: <TbCode className="text-blue-600 text-6xl mb-4" /> },
            { step: "Step 2", title: "AI generates your roadmap", icon: <TbSparkles className="text-blue-600 text-6xl mb-4" /> },
            { step: "Step 3", title: "Learn and grow daily", icon: <TbRocket className="text-blue-600 text-6xl mb-4" /> },
            { step: "Step 4", title: "Achieve your career goals", icon: <TbBadge className="text-blue-600 text-6xl mb-4" /> },
          ].map((item, i, arr) => (
            <div key={i} className="flex flex-col items-center relative">

              {item.icon}
              <p className="text-blue-600 font-medium mb-1">{item.step}</p>
              <p className="text-gray-800 font-semibold">{item.title}</p>

              {/* Arrow (show except for last item) */}
              {i < arr.length - 1 && (
                <div className="hidden md:block absolute right-[-70px] top-[40%] text-gray-400 text-4xl">
                  →
                </div>
              )}
            </div>
          ))}

        </div>
      </section>

      {/* 🌟 CTA BOX */}
      <section className="px-6 md:px-20 pb-20" >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white p-10 rounded-3xl shadow-xl text-center mt-20">
          <h2 className="text-3xl font-bold mb-3">Ready to Transform Your Career?</h2>
          <p className="mb-6 opacity-90">
            Join thousands of developers already growing with DevSync.
          </p>

          <Link
            href="/auth/signup"
            className="bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all"
          >
            Start Your Journey →
          </Link>
        </div>
      </section>

      {/* ⚙️ Footer */}
      <Footer/>
    </div>
  );
}
