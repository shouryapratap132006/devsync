"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Target,
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Quote
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      // Fetch Dashboard Stats
      const statsRes = await fetch("http://localhost:8080/api/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch User Profile for Name
      const profileRes = await fetch("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (statsRes.ok && profileRes.ok) {
        const statsData = await statsRes.json();
        const profileData = await profileRes.json();
        setData(statsData);
        setUser(profileData.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || !user) return null;

  const { counts, activeGoals, nextTask, quote, activities } = data;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
              Welcome back, {user.name.split(" ")[0]}! <span>👋</span>
            </h2>
            <p className="text-gray-600 text-lg">
              "{quote}"
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/goals" className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition shadow-sm">
              View Goals
            </Link>
            <Link href="/roadmap" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition shadow-md">
              New Roadmap
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<TrendingUp className="text-orange-500 w-6 h-6" />}
            title="Day Streak"
            value={`${counts.streak} days`}
            color="bg-orange-50"
          />
          <StatCard
            icon={<Target className="text-blue-600 w-6 h-6" />}
            title="Goals Active"
            value={`${counts.totalGoals - counts.completedGoals}/${counts.totalGoals}`}
            color="bg-blue-50"
          />
          <StatCard
            icon={<BookOpen className="text-purple-600 w-6 h-6" />}
            title="Skills Tracked"
            value={counts.skillsCount}
            color="bg-purple-50"
          />
          <StatCard
            icon={<Users className="text-green-600 w-6 h-6" />}
            title="Community Posts"
            value={counts.communityPosts}
            color="bg-green-50"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Main Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-8"
          >
            {/* Active Goals */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" /> Active Goals
                </h3>
                <Link href="/goals" className="text-blue-600 text-sm font-medium hover:underline">
                  View All
                </Link>
              </div>

              {activeGoals.length > 0 ? (
                <div className="space-y-6">
                  {activeGoals.map(goal => (
                    <GoalCard key={goal._id} goal={goal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No active goals. Time to set one!</p>
                  <Link href="/goals" className="text-blue-600 font-medium mt-2 inline-block">
                    + Create Goal
                  </Link>
                </div>
              )}
            </div>

            {/* Next Task Widget */}
            {nextTask && (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-md p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 opacity-90">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">Up Next</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{nextTask.title}</h3>
                  <p className="opacity-90 mb-4">
                    Due: {format(new Date(nextTask.deadline), "EEEE, MMM d, h:mm a")}
                  </p>
                  <Link href="/goals" className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-opacity-90 transition inline-block">
                    Mark Complete
                  </Link>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                  <CheckCircle2 size={200} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Sidebar Column */}
          <div className="space-y-6">

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" /> Recent Activity
              </h4>
              <div className="space-y-4">
                {activities.slice(0, 5).map((activity) => (
                  <div key={activity._id} className="flex gap-3 items-start">
                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-gray-500 text-sm">No recent activity.</p>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h4 className="text-lg font-semibold mb-4">Quick Access</h4>
              <div className="space-y-2">
                <QuickLink
                  href="/progress"
                  icon={<TrendingUp size={18} />}
                  label="View Analytics"
                />
                <QuickLink
                  href="/community"
                  icon={<Users size={18} />}
                  label="Community Feed"
                />
                <QuickLink
                  href="/profile"
                  icon={<Users size={18} />}
                  label="My Profile"
                />
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
      <div className={`p-3 rounded-xl mb-3 ${color}`}>{icon}</div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-gray-900 text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

function GoalCard({ goal }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <div>
          <p className="font-semibold text-gray-900">{goal.title}</p>
          <p className="text-xs text-gray-500">{goal.category}</p>
        </div>
        <span className="text-sm font-medium text-blue-600">{goal.progress}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-2 bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${goal.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition">
      <span className="text-gray-400">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
