"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    TbTargetArrow,
    TbChecklist,
    TbTrendingUp,
    TbActivity,
    TbCalendarStats,
    TbLoader2,
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
            const res = await fetch("http://localhost:8080/api/dashboard/stats", {
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
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
                <TbLoader2 className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (!data) return null;

    const { counts, charts, activities, activeGoals } = data;

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

    return (
        <div className="min-h-screen bg-[#f8f9fc] p-6 md:p-10">
            <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Progress Dashboard
                </h1>
                <p className="text-gray-500">Track your productivity and growth.</p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    icon={<TbTargetArrow className="text-blue-600" size={24} />}
                    label="Total Goals"
                    value={counts.totalGoals}
                    subValue={`${counts.completedGoals} Completed`}
                />
                <StatCard
                    icon={<TbChecklist className="text-green-600" size={24} />}
                    label="Tasks Completed"
                    value={counts.completedTasks}
                    subValue={`of ${counts.totalTasks} Total`}
                />
                <StatCard
                    icon={<TbTrendingUp className="text-purple-600" size={24} />}
                    label="Active Roadmaps"
                    value={counts.totalRoadmaps}
                    subValue="Learning Paths"
                />
                <StatCard
                    icon={<TbCalendarStats className="text-orange-600" size={24} />}
                    label="Weekly Streak"
                    value="Active"
                    subValue="Keep it up!"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Weekly Productivity Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Weekly Productivity
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.productivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: "#f3f4f6" }}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                />
                                <Bar dataKey="tasks" fill="#2563eb" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Goal Categories Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Goal Distribution
                    </h3>
                    <div className="h-64">
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
                                >
                                    {charts.categories.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center">
                        {charts.categories.map((entry, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-gray-600">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Goals Progress */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Active Goals</h3>
                    <div className="space-y-6">
                        {activeGoals.map((goal) => (
                            <div key={goal._id}>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="font-medium text-gray-900">
                                        {goal.title}
                                    </span>
                                    <span className="text-gray-500">{goal.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${goal.progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                    <span>{goal.category}</span>
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
                            <p className="text-gray-500 text-center py-4">
                                No active goals. Time to set some!
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Recent Activity
                    </h3>
                    <div className="space-y-6">
                        {activities.map((activity) => (
                            <div key={activity._id} className="flex gap-4">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <TbActivity size={16} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-900 font-medium">
                                        {activity.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {activities.length === 0 && (
                            <p className="text-gray-500 text-center py-4">
                                No recent activity.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, subValue }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <h4 className="text-2xl font-bold text-gray-900 mb-1">{value}</h4>
                <p className="text-xs text-gray-400">{subValue}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
        </div>
    );
}
