"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    TbMessageCircle,
    TbHeart,
    TbSend,
    TbTrophy,
    TbTrendingUp,
    TbHash,
    TbLoader2,
    TbUserCircle,
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
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc]">
                <TbLoader2 className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fc] pt-6 pb-10 px-4 md:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Sidebar: Categories */}
                <aside className="hidden lg:block space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TbHash className="text-blue-600" /> Categories
                        </h3>
                        <nav className="space-y-1">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-gray-600 hover:bg-gray-50"
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
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <TbUserCircle size={24} />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={newPostContent}
                                    onChange={(e) => setNewPostContent(e.target.value)}
                                    placeholder="Share your progress or ask a question..."
                                    className="w-full bg-gray-50 border-0 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-24 text-gray-600"
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-gray-400">
                                        Posting in: <span className="font-medium text-gray-600">{activeCategory}</span>
                                    </span>
                                    <button
                                        onClick={handleCreatePost}
                                        disabled={!newPostContent.trim()}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <TbSend size={16} /> Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Feed */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Showing <span className="font-medium text-gray-900">{posts.length}</span> posts</div>
                            <div className="flex items-center gap-3">
                                <label className="text-xs text-gray-500">Sort:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm bg-white border rounded-md px-2 py-1 text-gray-700"
                                >
                                    <option value="date">Date (Newest)</option>
                                    <option value="popularity">Popularity (Likes)</option>
                                    <option value="engagement">Engagement (Likes + Comments)</option>
                                </select>
                            </div>
                        </div>

                        {/* Sort posts client-side before rendering */}
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
                        
                        {posts.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No posts yet. Be the first to share!
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar: Leaderboard & Trending */}
                <aside className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TbTrophy className="text-yellow-500" /> Top Contributors
                        </h3>
                        <div className="space-y-4">
                            {leaderboard.map((user, index) => (
                                <div key={user._id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${index === 0
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : index === 1
                                                        ? "bg-gray-100 text-gray-700"
                                                        : index === 2
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "text-gray-400"
                                                }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                                                {user.name ? user.name.substring(0, 1).toUpperCase() : user._id.substring(0, 1).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {user.name || `User ${user._id.substring(0, 4)}`}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">
                                        {user.count} posts
                                    </span>
                                </div>
                            ))}
                            {leaderboard.length === 0 && (
                                <p className="text-sm text-gray-500">No data yet.</p>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TbTrendingUp className="text-red-500" /> Trending
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {["#React", "#WebDev", "#Career", "#Help"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md font-medium"
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
    const isLiked = false; // TODO: Check if current user liked (needs user context)
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");

    async function submitComment() {
        if (!commentText.trim()) return;
        await onAddComment(post._id, commentText.trim());
        setCommentText("");
        setShowComments(true);
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                        {post.authorName ? post.authorName.substring(0, 1).toUpperCase() : post.userId.substring(0, 1).toUpperCase()}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                            {post.authorName || `User ${post.userId.substring(0, 6)}`}
                        </h4>
                        <p className="text-xs text-gray-500">
                            {format(new Date(post.createdAt), "MMM d, h:mm a")} •{" "}
                            <span className="text-blue-600">{post.category}</span>
                        </p>
                    </div>
                </div>
            </div>

            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

            {post.image && (
                <img
                    src={post.image}
                    alt="Post attachment"
                    className="rounded-xl w-full object-cover max-h-96 mb-4"
                />
            )}

            <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                <button
                    onClick={() => onLike(post._id)}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors ${post.likes.length > 0 ? "text-red-500" : "text-gray-500 hover:text-red-500"
                        }`}
                >
                    <TbHeart
                        size={20}
                        className={post.likes.length > 0 ? "fill-current" : ""}
                    />
                    {post.likes.length}
                </button>
                <button onClick={() => setShowComments((s) => !s)} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                    <TbMessageCircle size={20} />
                    {post.comments.length}
                </button>
            </div>
            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="space-y-3">
                        {(post.comments || []).map((c) => (
                            <div key={c._id || c.id} className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold">
                                    {c.authorName ? c.authorName.substring(0,1).toUpperCase() : String(c.userId).substring(0,1).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">{c.authorName || `User ${String(c.userId).substring(0,6)}`}</div>
                                    <div className="text-sm text-gray-700">{c.text}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-start gap-3">
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 border rounded-lg px-3 py-2 text-sm bg-white text-gray-900 placeholder:text-gray-500"
                        />
                        <button onClick={submitComment} className="px-3 py-2 bg-blue-600 text-white rounded-lg">Reply</button>
                    </div>
                </div>
            )}
        </div>
    );
}
