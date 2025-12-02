"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    TbTargetArrow,
    TbChecklist,
    TbTrendingUp,
    TbActivity,
    TbCalendarStats,
    TbLoader2,
    TbChartBar,
    TbChartPie,
    TbArrowUpRight
} from "react-icons/tb";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { format } from "date-fns";

export default function ProgressPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/api/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch data");
            const jsonData = await res.json();
            setData(jsonData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <TbLoader2 className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (!data) return null;

    const { counts, charts, activities, activeGoals } = data;

    const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 pt-24 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Progress Dashboard
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400">Track your productivity and growth.</p>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard
                        icon={<TbTargetArrow className="text-blue-600" size={24} />}
                        label="Total Goals"
                        value={counts.totalGoals}
                        subValue={`${counts.completedGoals} Completed`}
                        bg="bg-blue-50 dark:bg-blue-900/20"
                        border="border-blue-100 dark:border-blue-900/30"
                    />
                    <StatCard
                        icon={<TbChecklist className="text-green-600" size={24} />}
                        label="Tasks Completed"
                        value={counts.completedTasks}
                        subValue={`of ${counts.totalTasks} Total`}
                        bg="bg-green-50 dark:bg-green-900/20"
                        border="border-green-100 dark:border-green-900/30"
                    />
                    <StatCard
                        icon={<TbTrendingUp className="text-purple-600" size={24} />}
                        label="Active Roadmaps"
                        value={counts.totalRoadmaps}
                        subValue="Learning Paths"
                        bg="bg-purple-50 dark:bg-purple-900/20"
                        border="border-purple-100 dark:border-purple-900/30"
                    />
                    <StatCard
                        icon={<TbCalendarStats className="text-orange-600" size={24} />}
                        label="Weekly Streak"
                        value={`${counts.streak} Days`}
                        subValue="Keep it up!"
                        bg="bg-orange-50 dark:bg-orange-900/20"
                        border="border-orange-100 dark:border-orange-900/30"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Weekly Productivity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 card-premium p-8"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <TbChartBar className="text-blue-500" /> Weekly Productivity
                            </h3>
                            <select className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
                                <option>This Week</option>
                                <option>Last Week</option>
                            </select>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={charts.productivity}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "#f8fafc" }}
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                            padding: "12px"
                                        }}
                                    />
                                    <Bar
                                        dataKey="tasks"
                                        fill="#3b82f6"
                                        radius={[6, 6, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Goal Categories Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card-premium p-8"
                    >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TbChartPie className="text-purple-500" /> Goal Distribution
                        </h3>
                        <div className="h-64 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.categories}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {charts.categories.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: "12px",
                                            border: "none",
                                            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-center">
                                    <span className="block text-2xl font-bold text-slate-900 dark:text-white">{counts.totalGoals}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Goals</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-6 justify-center">
                            {charts.categories.map((entry, index) => (
                                <div key={index} className="flex items-center gap-1.5 text-xs font-medium">
                                    <div
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-slate-600 dark:text-slate-400">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Active Goals Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card-premium p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <TbTargetArrow className="text-red-500" /> Active Goals
                            </h3>
                            <button onClick={() => router.push('/goals')} className="text-blue-600 dark:text-blue-400 text-sm font-bold flex items-center gap-1 hover:underline">
                                View All <TbArrowUpRight />
                            </button>
                        </div>
                        <div className="space-y-6">
                            {activeGoals.map((goal) => (
                                <div key={goal._id} className="group">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {goal.title}
                                        </span>
                                        <span className="font-bold text-blue-600 dark:text-blue-400">{goal.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                                            style={{ width: `${goal.progress}%` }}
                                        >
                                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500 dark:text-slate-400">{goal.category}</span>
                                        <span>
                                            Due:{" "}
                                            {goal.deadline
                                                ? format(new Date(goal.deadline), "MMM d, yyyy")
                                                : "No Date"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {activeGoals.length === 0 && (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <p className="text-slate-500 dark:text-slate-400">No active goals. Time to set some!</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Activity Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card-premium p-8"
                    >
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TbActivity className="text-green-500" /> Recent Activity
                        </h3>
                        <div className="space-y-6 relative">
                            <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-slate-700"></div>
                            {activities.map((activity) => (
                                <div key={activity._id} className="flex gap-4 relative z-10">
                                    <div className="mt-1 shrink-0">
                                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-600 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                                            <TbActivity size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-900 dark:text-white font-medium leading-snug">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1 font-medium">
                                            {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <p className="text-slate-500 dark:text-slate-400 text-center py-4 pl-8">
                                    No recent activity.
                                </p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, subValue, bg, border }) {
    return (
        <div className={`p-6 rounded-2xl border ${border} ${bg} hover:shadow-md transition-all duration-300`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                    <h4 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h4>
                </div>
                <div className="p-2.5 bg-white dark:bg-white/90 rounded-xl shadow-sm">
                    {icon}
                </div>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-white/10 inline-block px-2 py-1 rounded-lg">
                {subValue}
            </p>
        </div>
    );
}
