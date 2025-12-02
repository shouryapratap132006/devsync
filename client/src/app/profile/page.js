"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    TbUserCircle,
    TbMapPin,
    TbCalendar,
    TbEdit,
    TbTrophy,
    TbTarget,
    TbChecklist,
    TbActivity,
    TbLoader2,
    TbSettings,
    TbCamera,
    TbMail
} from "react-icons/tb";
import { format } from "date-fns";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setEditForm({
                    name: data.user.name,
                    bio: data.user.bio,
                    location: data.user.location,
                    skills: data.user.skills.join(", "),
                    interests: data.user.interests.join(", "),
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateProfile() {
        const token = localStorage.getItem("token");
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/api/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...editForm,
                    skills: editForm.skills.split(",").map((s) => s.trim()),
                    interests: editForm.interests.split(",").map((s) => s.trim()),
                }),
            });

            if (res.ok) {
                setIsEditing(false);
                fetchProfile();
            }
        } catch (err) {
            alert("Failed to update profile");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <TbLoader2 className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (!profile) return null;

    const { user, stats, recentActivity } = profile;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20 transition-colors duration-300">
            {/* Header / Cover */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 relative">
                <div className="h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-10 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 -mt-20 relative z-10">
                        <div className="flex items-end gap-6">
                            <div className="w-40 h-40 rounded-full bg-white dark:bg-slate-800 p-1.5 shadow-xl relative group">
                                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-500 overflow-hidden relative">
                                    <TbUserCircle size={160} className="absolute -bottom-2" />
                                </div>
                                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-700">
                                    <TbCamera size={18} />
                                </button>
                            </div>
                            <div className="mb-4">
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{user.name}</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
                                    <TbMail size={16} /> @{user.email.split("@")[0]}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-4 w-full md:w-auto">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 md:flex-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2.5 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 shadow-sm transition-all"
                            >
                                <TbEdit size={18} /> Edit Profile
                            </button>
                            <button className="flex-1 md:flex-none btn-primary shadow-blue-500/20">
                                Share Profile
                            </button>
                        </div>
                    </div>

                    <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Bio & Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card-premium p-8"
                            >
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">About Me</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                                    {user.bio || "No bio yet. Tell us about yourself!"}
                                </p>
                                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {user.location && (
                                        <div className="flex items-center gap-2">
                                            <TbMapPin size={18} className="text-slate-400" /> {user.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <TbCalendar size={18} className="text-slate-400" /> Joined {format(new Date(user.joinedAt), "MMMM yyyy")}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <StatBox
                                    icon={<TbTrophy className="text-yellow-600" />}
                                    label="Goals Completed"
                                    value={stats.completedGoals}
                                    total={stats.totalGoals}
                                    bg="bg-yellow-50 dark:bg-yellow-900/20"
                                    border="border-yellow-100 dark:border-yellow-900/30"
                                />
                                <StatBox
                                    icon={<TbChecklist className="text-green-600" />}
                                    label="Tasks Done"
                                    value={stats.completedTasks}
                                    total={stats.totalTasks}
                                    bg="bg-green-50 dark:bg-green-900/20"
                                    border="border-green-100 dark:border-green-900/30"
                                />
                                <StatBox
                                    icon={<TbTarget className="text-red-600" />}
                                    label="Community Posts"
                                    value={stats.communityPosts}
                                    bg="bg-red-50 dark:bg-red-900/20"
                                    border="border-red-100 dark:border-red-900/30"
                                />
                                <StatBox
                                    icon={<TbActivity className="text-purple-600" />}
                                    label="Current Streak"
                                    value="Active"
                                    bg="bg-purple-50 dark:bg-purple-900/20"
                                    border="border-purple-100 dark:border-purple-900/30"
                                />
                            </div>

                            {/* Recent Activity */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="card-premium p-8"
                            >
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    <TbActivity className="text-blue-600" /> Recent Activity
                                </h3>
                                <div className="space-y-8 relative">
                                    <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-slate-100 dark:bg-slate-700"></div>
                                    {recentActivity.map((activity, index) => (
                                        <div key={activity._id} className="relative pl-8 group">
                                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border-2 border-blue-100 dark:border-blue-900 group-hover:border-blue-500 transition-colors z-10 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            </div>
                                            <div>
                                                <p className="text-slate-800 dark:text-slate-200 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{activity.description}</p>
                                                <p className="text-xs text-slate-400 mt-1 font-medium">
                                                    {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {recentActivity.length === 0 && (
                                        <p className="text-slate-500 dark:text-slate-400 pl-8">No recent activity.</p>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Skills */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="card-premium p-6"
                            >
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                                    Skills
                                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">{user.skills.length}</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.length > 0 ? (
                                        user.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 rounded-lg text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 italic text-sm">No skills added</span>
                                    )}
                                </div>
                            </motion.div>

                            {/* Interests */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="card-premium p-6"
                            >
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.length > 0 ? (
                                        user.interests.map((interest) => (
                                            <span
                                                key={interest}
                                                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-lg text-sm font-medium"
                                            >
                                                {interest}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-slate-400 italic text-sm">No interests added</span>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Profile</h3>
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Bio</label>
                                    <textarea
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all resize-none h-28 text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
                                    <input
                                        type="text"
                                        value={editForm.location}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Skills (comma separated)</label>
                                    <input
                                        type="text"
                                        value={editForm.skills}
                                        onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Interests (comma separated)</label>
                                    <input
                                        type="text"
                                        value={editForm.interests}
                                        onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateProfile}
                                    className="btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatBox({ icon, label, value, total, bg, border }) {
    return (
        <div className={`p-4 rounded-2xl border ${border} ${bg} hover:shadow-md transition-all`}>
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/90 shadow-sm flex items-center justify-center text-xl mb-3">
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-800">
                    {value}
                    {total !== undefined && <span className="text-slate-400 dark:text-slate-500 text-sm font-medium ml-1">/{total}</span>}
                </p>
            </div>
        </div>
    );
}
