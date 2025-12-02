"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
                <TbLoader2 className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (!profile) return null;

    const { user, stats, recentActivity } = profile;

    return (
        <div className="min-h-screen bg-[#f8f9fc] pb-10">
            {/* Header / Cover */}
            <div className="bg-white border-b border-gray-100">
                <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-16 pb-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="flex items-end gap-6">
                            <div className="w-32 h-32 rounded-full bg-white p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <TbUserCircle size={64} />
                                </div>
                            </div>
                            <div className="mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-gray-500 font-medium">@{user.email.split("@")[0]}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mb-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm"
                            >
                                <TbEdit size={18} /> Edit Profile
                            </button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md">
                                Share Profile
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            {/* Bio & Details */}
                            <div>
                                <p className="text-gray-700 text-lg leading-relaxed">
                                    {user.bio || "No bio yet. Tell us about yourself!"}
                                </p>
                                <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
                                    {user.location && (
                                        <div className="flex items-center gap-1">
                                            <TbMapPin /> {user.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <TbCalendar /> Joined {format(new Date(user.joinedAt), "MMMM yyyy")}
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <h3 className="font-bold text-gray-900 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills.length > 0 ? (
                                        user.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400 italic">No skills added</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <StatBox
                                icon={<TbTrophy className="text-yellow-500" />}
                                label="Goals Completed"
                                value={stats.completedGoals}
                                total={stats.totalGoals}
                            />
                            <StatBox
                                icon={<TbChecklist className="text-green-500" />}
                                label="Tasks Done"
                                value={stats.completedTasks}
                                total={stats.totalTasks}
                            />
                            <StatBox
                                icon={<TbTarget className="text-red-500" />}
                                label="Community Posts"
                                value={stats.communityPosts}
                            />
                            <StatBox
                                icon={<TbActivity className="text-purple-500" />}
                                label="Streak"
                                value="Active"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TbActivity className="text-blue-600" /> Recent Activity
                    </h3>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
                        {recentActivity.map((activity, index) => (
                            <div key={activity._id} className="relative pl-8 border-l-2 border-gray-100 last:border-0">
                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-white ring-1 ring-blue-500"></div>
                                <div>
                                    <p className="text-gray-900 font-medium">{activity.description}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {recentActivity.length === 0 && (
                            <p className="text-gray-500 text-center">No recent activity.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar: Interests & Settings */}
                <div className="space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                            {user.interests.length > 0 ? (
                                user.interests.map((interest) => (
                                    <span
                                        key={interest}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm"
                                    >
                                        {interest}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 italic">No interests added</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none h-24 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    value={editForm.skills}
                                    onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interests (comma separated)</label>
                                <input
                                    type="text"
                                    value={editForm.interests}
                                    onChange={(e) => setEditForm({ ...editForm, interests: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatBox({ icon, label, value, total }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-xl font-bold text-gray-900">
                    {value}
                    {total !== undefined && <span className="text-gray-400 text-sm font-normal">/{total}</span>}
                </p>
            </div>
        </div>
    );
}
