"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    TbMessageCircle,
    TbHeart,
    TbSend,
    TbTrophy,
    TbTrendingUp,
    TbHash,
    TbLoader2,
    TbUserCircle,
    TbFilter,
    TbSearch
} from "react-icons/tb";
import { format } from "date-fns";

export default function CommunityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState("date");
    const [leaderboard, setLeaderboard] = useState([]);
    const [newPostContent, setNewPostContent] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = [
        "All",
        "Learning",
        "React / Next.js",
        "AI / ML",
        "DSA",
        "Productivity",
    ];

    useEffect(() => {
        fetchData();
    }, [activeCategory]);

    async function fetchData() {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        try {
            const query = activeCategory !== "All" ? `?category=${activeCategory}` : "";
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const [postsRes, leaderboardRes] = await Promise.all([
                fetch(`${base}/api/community/posts${query}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${base}/api/community/leaderboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (postsRes.ok) setPosts(await postsRes.json());
            if (leaderboardRes.ok) setLeaderboard(await leaderboardRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreatePost() {
        if (!newPostContent.trim()) return;
        const token = localStorage.getItem("token");

        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/api/community/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    content: newPostContent,
                    category: activeCategory === "All" ? "General" : activeCategory,
                }),
            });

            if (res.ok) {
                const newPost = await res.json();
                setPosts([newPost, ...posts]);
                setNewPostContent("");
            }
        } catch (err) {
            alert("Failed to post");
        }
    }

    async function handleLike(postId) {
        const token = localStorage.getItem("token");
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/api/community/posts/${postId}/like`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const updatedPost = await res.json();
                setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleAddComment(postId, text) {
        if (!text || !text.trim()) return;
        const token = localStorage.getItem("token");
        try {
            const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            const res = await fetch(`${base}/api/community/posts/${postId}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text }),
            });
            if (res.ok) {
                const updated = await res.json();
                setPosts((prev) => prev.map((p) => (p._id === postId ? updated : p)));
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <TbLoader2 className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-32 px-4 md:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar: Categories */}
                <aside className="hidden lg:block space-y-6">
                    <div className="card-premium p-6 sticky top-24">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <TbHash className="text-blue-600" /> Categories
                        </h3>
                        <nav className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === cat
                                        ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Main Feed */}
                <main className="lg:col-span-2 space-y-6">
                    {/* Create Post */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card-premium p-6"
                    >
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <TbUserCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your progress or ask a question..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-0 rounded-xl p-4 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-24 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 transition-all"
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-slate-400">
                                        Posting in: <span className="font-bold text-blue-600">{activeCategory}</span>
                                    </span>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={!newPostContent.trim()}
                                        className="btn-primary py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <TbSend size={16} /> Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="text-sm text-slate-500 dark:text-slate-400">Showing <span className="font-bold text-slate-900 dark:text-white">{posts.length}</span> posts</div>
                            <div className="flex items-center gap-3">
                                <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sort by</label>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-slate-900 dark:text-white outline-none focus:border-blue-500 appearance-none cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <option value="date">Newest First</option>
                                        <option value="popularity">Most Liked</option>
                                        <option value="engagement">Most Active</option>
                                    </select>
                                    <TbFilter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                                </div>
                            </div>
                        </div>

                        <AnimatePresence mode="popLayout">
                            {(() => {
                                const sorted = posts.slice();
                                if (sortBy === "date") {
                                    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                                } else if (sortBy === "popularity") {
                                    sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
                                } else if (sortBy === "engagement") {
                                    const engagement = (p) => (p.likes?.length || 0) + (p.comments?.length || 0);
                                    sorted.sort((a, b) => engagement(b) - engagement(a));
                                }
                                return sorted.map((post) => (
                                    <PostCard key={post._id} post={post} onLike={handleLike} onAddComment={handleAddComment} />
                                ));
                            })()}
                        </AnimatePresence>

                        {posts.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400">No posts yet. Be the first to share!</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar: Leaderboard & Trending */}
                <aside className="space-y-6">
                    <div className="card-premium p-6 sticky top-24">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <TbTrophy className="text-yellow-500" /> Top Contributors
                        </h3>
                        <div className="space-y-4">
                            {leaderboard.map((user, index) => (
                                <div key={user._id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0
                                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-4 ring-yellow-50 dark:ring-yellow-900/10"
                                                : index === 1
                                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-4 ring-slate-50 dark:ring-slate-800/50"
                                                    : index === 2
                                                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 ring-4 ring-orange-50 dark:ring-orange-900/10"
                                                        : "text-slate-400"
                                                }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                                                {user.name ? user.name.substring(0, 1).toUpperCase() : user._id.substring(0, 1).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {user.name || `User ${user._id.substring(0, 4)}`}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">
                                        {user.count} posts
                                    </span>
                                </div>
                            ))}
                            {leaderboard.length === 0 && (
                                <p className="text-sm text-slate-500 italic">No data yet.</p>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <TbTrendingUp className="text-red-500" /> Trending
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["#React", "#WebDev", "#Career", "#Help", "#Showcase"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-400 text-xs rounded-lg font-medium transition-colors cursor-pointer border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

function PostCard({ post, onLike, onAddComment }) {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");

    async function submitComment() {
        if (!commentText.trim()) return;
        await onAddComment(post._id, commentText.trim());
        setCommentText("");
        setShowComments(true);
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-6"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
                        {post.authorName ? post.authorName.substring(0, 1).toUpperCase() : post.userId.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                            {post.authorName || `User ${post.userId.substring(0, 6)}`}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            {format(new Date(post.createdAt), "MMM d, h:mm a")} •{" "}
                            <span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded-md">{post.category}</span>
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-slate-800 dark:text-slate-200 mb-4 whitespace-pre-wrap leading-relaxed text-[15px]">{post.content}</p>

            {post.image && (
                <img
                    src={post.image}
                    alt="Post attachment"
                    className="rounded-xl w-full object-cover max-h-96 mb-4 border border-slate-100 dark:border-slate-700"
                />
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-700">
                <button
                    onClick={() => onLike(post._id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-all ${post.likes.length > 0 ? "text-red-500" : "text-slate-500 dark:text-slate-400 hover:text-red-500"
                        }`}
                >
                    <TbHeart
                        size={20}
                        className={`transition-transform active:scale-75 ${post.likes.length > 0 ? "fill-current" : ""}`}
                    />
                    {post.likes.length || "Like"}
                </button>
                <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    <TbMessageCircle size={20} />
                    {post.comments.length || "Comment"}
                </button>
            </div>

            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl p-4">
                            <div className="space-y-4 mb-4">
                                {(post.comments || []).map((c) => (
                                    <div key={c._id || c.id} className="flex items-start gap-3">
                                        <div className="w-7 h-7 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0">
                                            {c.authorName ? c.authorName.substring(0, 1).toUpperCase() : String(c.userId).substring(0, 1).toUpperCase()}
                                        </div>
                                        <div className="bg-white dark:bg-slate-700 p-3 rounded-r-xl rounded-bl-xl border border-slate-100 dark:border-slate-600 shadow-sm flex-1">
                                            <div className="text-xs font-bold text-slate-900 dark:text-white mb-1">{c.authorName || `User ${String(c.userId).substring(0, 6)}`}</div>
                                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{c.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                                />
                                <button
                                    onClick={submitComment}
                                    disabled={!commentText.trim()}
                                    className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <TbSend size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
