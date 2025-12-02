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
  Quote,
  ArrowRight
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
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const statsRes = await fetch(`${base}/api/dashboard/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileRes = await fetch(`${base}/api/profile`, {
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || !user) return null;

  const { counts, activeGoals, nextTask, quote, activities } = data;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 pb-32 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* 👋 Welcome Section */}
        <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {user.name.split(" ")[0]}!
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl italic opacity-90">
                "{quote}"
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/goals" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-white/20 transition-all">
                View Goals
              </Link>
              <Link href="/roadmap" className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-lg">
                + New Roadmap
              </Link>
            </div>
          </div>
        </div>

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<TrendingUp className="text-orange-600 w-6 h-6" />}
            title="Day Streak"
            value={`${counts.streak} days`}
            bg="bg-orange-50"
            border="border-orange-100"
          />
          <StatCard
            icon={<Target className="text-blue-600 w-6 h-6" />}
            title="Active Goals"
            value={`${counts.totalGoals - counts.completedGoals}`}
            subValue={`/ ${counts.totalGoals} Total`}
            bg="bg-blue-50"
            border="border-blue-100"
          />
          <StatCard
            icon={<BookOpen className="text-purple-600 w-6 h-6" />}
            title="Skills Tracked"
            value={counts.skillsCount}
            bg="bg-purple-50"
            border="border-purple-100"
          />
          <StatCard
            icon={<Users className="text-green-600 w-6 h-6" />}
            title="Community"
            value={counts.communityPosts}
            subValue="Posts"
            bg="bg-green-50"
            border="border-green-100"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Main Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* 🎯 Active Goals */}
            <div className="card-premium p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" /> Active Goals
                </h3>
                <Link href="/goals" className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              </div>

              {activeGoals.length > 0 ? (
                <div className="space-y-4">
                  {activeGoals.map(goal => (
                    <GoalCard key={goal._id} goal={goal} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-500 dark:text-slate-400 mb-2">No active goals yet.</p>
                  <Link href="/goals" className="text-blue-600 font-bold hover:underline">
                    Create your first goal
                  </Link>
                </div>
              )}
            </div>

            {/* ⚡ Next Task Widget */}
            {nextTask ? (
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-950 text-white p-8 shadow-lg border border-slate-800 dark:border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-3 text-blue-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Up Next</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{nextTask.title}</h3>
                    <p className="text-slate-400 mb-6">
                      Due: {format(new Date(nextTask.deadline), "EEEE, MMM d, h:mm a")}
                    </p>
                    <Link href="/goals" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-500 transition-all inline-flex items-center gap-2">
                      <CheckCircle2 size={16} /> Mark Complete
                    </Link>
                  </div>
                  <div className="hidden sm:block opacity-20">
                    <CheckCircle2 size={120} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-500 dark:text-slate-400">No upcoming tasks. You're all caught up! 🎉</p>
              </div>
            )}
          </motion.div>

          {/* Sidebar Column */}
          <div className="space-y-8">

            {/* 🕒 Recent Activity */}
            <div className="card-premium p-6">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" /> Recent Activity
              </h4>
              <div className="space-y-6 relative">
                {/* Vertical Line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-slate-700"></div>

                {activities.slice(0, 5).map((activity) => (
                  <div key={activity._id} className="relative pl-8">
                    <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900 flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{activity.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-slate-500 text-sm pl-8">No recent activity.</p>
                )}
              </div>
            </div>

            {/* 🔗 Quick Links */}
            <div className="card-premium p-6">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Access</h4>
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

function StatCard({ icon, title, value, subValue, bg, border }) {
  return (
    <div className={`p-6 rounded-2xl border ${border} ${bg} dark:bg-slate-800 dark:border-slate-700 hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
          {icon}
        </div>
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{title}</span>
      </div>
      <div>
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{value}</span>
        {subValue && <span className="text-sm text-slate-500 dark:text-slate-400 ml-1 font-medium">{subValue}</span>}
      </div>
    </div>
  );
}

function GoalCard({ goal }) {
  return (
    <div className="group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h5 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{goal.title}</h5>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mt-1 inline-block">
            {goal.category}
          </span>
        </div>
        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{goal.progress}%</span>
      </div>
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500"
          style={{ width: `${goal.progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon, label }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors group">
      <span className="text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{icon}</span>
      <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
      <ArrowRight className="ml-auto w-4 h-4 text-slate-300 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all" />
    </Link>
  );
}
