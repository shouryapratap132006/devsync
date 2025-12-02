"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Brain, Target, BookOpen, Users, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  // 🔒 Redirect if NOT logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/auth/login");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
            Welcome back, Developer! <span>👋</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Let's continue your growth journey
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<TrendingUp className="text-blue-600 w-6 h-6" />}
            title="Learning Streak"
            value="12 days"
          />
          <StatCard
            icon={<Target className="text-blue-600 w-6 h-6" />}
            title="Goals Completed"
            value="8/15"
          />
          <StatCard
            icon={<BookOpen className="text-blue-600 w-6 h-6" />}
            title="Skills Assessed"
            value="24"
          />
          <StatCard
            icon={<Users className="text-blue-600 w-6 h-6" />}
            title="Community Posts"
            value="16"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Active Goals</h3>
              <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-700 transition">
                <Plus className="w-4 h-4" /> New Goal
              </button>
            </div>

            <GoalCard title="Master React Hooks" progress={75} />
            <GoalCard title="Learn TypeScript Advanced Features" progress={40} />
            <GoalCard title="Build 3 Full-Stack Projects" progress={33} />
          </motion.div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h4 className="text-lg font-semibold mb-2">Learning Streak</h4>
              <p className="text-gray-500 text-sm mb-4">Keep it going!</p>
              <p className="text-blue-600 text-4xl font-bold">12</p>
              <p className="text-gray-500 text-sm">Days in a row</p>

              <div className="flex gap-1 mt-4">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded-md ${i < 5 ? "bg-cyan-400" : "bg-gray-200"
                      }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex justify-between">
                  <span>✅ Completed assessment</span>
                  <span className="text-gray-500">2 hours ago</span>
                </li>
                <li className="flex justify-between">
                  <span>📈 Updated goal progress</span>
                  <span className="text-gray-500">Yesterday</span>
                </li>
                <li className="flex justify-between">
                  <span>💬 Posted in community</span>
                  <span className="text-gray-500">2 days ago</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">

          <FeatureCard
            icon={<BookOpen className="w-8 h-8 text-blue-600" />}
            title="Skill Assessment"
            desc="Take an AI-powered skill test"
          />

          <FeatureCard
            icon={<Brain className="w-8 h-8 text-blue-600" />}
            title="Learning Roadmap"
            desc="View your personalized path"
          />

          <FeatureCard
            icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
            title="Progress Tracker"
            desc="Track your growth metrics"
          />

          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Community"
            desc="Connect with developers"
          />

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-lg transition">
      <div className="mb-2">{icon}</div>
      <p className="text-gray-600 text-sm">{title}</p>
      <p className="text-blue-600 text-2xl font-bold">{value}</p>
    </div>
  );
}

function GoalCard({ title, progress }) {
  return (
    <div className="mb-5">
      <p className="font-medium mb-2">{title}</p>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-2 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-1">{progress}% complete</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 
                 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-600 text-sm">{desc}</p>

      <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
        Get Started →
      </button>
    </motion.div>
  );
}
