"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TbPlus,
    TbSearch,
    TbFilter,
    TbTarget,
    TbChecklist,
    TbLoader2,
} from "react-icons/tb";
import GoalCard from "./components/GoalCard";
import TaskItem from "./components/TaskItem";
import { useRouter } from "next/navigation";
import { useTheme } from "../context/ThemeContext";

export default function GoalsPage() {
    const router = useRouter();
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState("goals"); // goals | tasks
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPageGoals, setCurrentPageGoals] = useState(1);
    const [currentPageTasks, setCurrentPageTasks] = useState(1);
    const [pageSize] = useState(6);
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    // Form States
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        category: "Learning",
        priority: "Medium",
        deadline: "",
        status: "Not Started",
        progress: 0,
    });

    const [newTask, setNewTask] = useState({
        title: "",
        goalId: "",
        priority: "Medium",
        deadline: "",
    });

    const backendURL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : "http://localhost:8080/api";

    // Helper: Safe Fetch with Auth
    async function safeFetch(url, options = {}) {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            return null;
        }
        const res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            router.push("/auth/login");
            return null;
        }
        return res;
    }

    // Load Data
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [goalsRes, tasksRes] = await Promise.all([
                safeFetch(`${backendURL}/goals`),
                safeFetch(`${backendURL}/tasks`),
            ]);

            if (goalsRes && goalsRes.ok) setGoals(await goalsRes.json());
            if (tasksRes && tasksRes.ok) setTasks(await tasksRes.json());
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    }

    // --- CRUD Operations (Same as before, omitted for brevity but assumed functional) ---
    // Re-implementing CRUD for completeness since I'm overwriting the file
    async function handleSaveGoal() {
        if (!newGoal.title) return alert("Title is required");
        try {
            const method = editingGoal ? "PUT" : "POST";
            const url = editingGoal
                ? `${backendURL}/goals/${editingGoal._id}`
                : `${backendURL}/goals`;

            const res = await safeFetch(url, {
                method,
                body: JSON.stringify(newGoal),
            });

            if (res && res.ok) {
                const savedGoal = await res.json();
                if (editingGoal) {
                    setGoals(goals.map((g) => (g._id === savedGoal._id ? savedGoal : g)));
                } else {
                    setGoals([savedGoal, ...goals]);
                }
                closeGoalModal();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteGoal(id) {
        if (!confirm("Delete this goal?")) return;
        try {
            const res = await safeFetch(`${backendURL}/goals/${id}`, { method: "DELETE" });
            if (res && res.ok) {
                setGoals(goals.filter((g) => g._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleSaveTask() {
        if (!newTask.title) return alert("Title is required");
        try {
            const res = await safeFetch(`${backendURL}/tasks`, {
                method: "POST",
                body: JSON.stringify(newTask),
            });

            if (res && res.ok) {
                const savedTask = await res.json();
                setTasks([savedTask, ...tasks]);
                closeTaskModal();
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleToggleTask(task) {
        try {
            const res = await safeFetch(`${backendURL}/tasks/${task._id}`, {
                method: "PUT",
                body: JSON.stringify({ status: !task.status }),
            });
            if (res && res.ok) {
                const updated = await res.json();
                setTasks(tasks.map((t) => (t._id === updated._id ? updated : t)));
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteTask(id) {
        if (!confirm("Delete this task?")) return;
        try {
            const res = await safeFetch(`${backendURL}/tasks/${id}`, { method: "DELETE" });
            if (res && res.ok) {
                setTasks(tasks.filter((t) => t._id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Modals
    function openGoalModal(goal = null) {
        if (goal) {
            setEditingGoal(goal);
            setNewGoal({
                title: goal.title,
                description: goal.description,
                category: goal.category,
                priority: goal.priority,
                deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
                status: goal.status,
                progress: goal.progress || 0,
            });
        } else {
            setEditingGoal(null);
            setNewGoal({
                title: "",
                description: "",
                category: "Learning",
                priority: "Medium",
                deadline: "",
                status: "Not Started",
                progress: 0,
            });
        }
        setShowGoalModal(true);
    }

    function closeGoalModal() {
        setShowGoalModal(false);
        setEditingGoal(null);
    }

    function openTaskModal() {
        setNewTask({
            title: "",
            goalId: "",
            priority: "Medium",
            deadline: "",
        });
        setShowTaskModal(true);
    }

    function closeTaskModal() {
        setShowTaskModal(false);
    }

    // Filtering
    const filteredGoals = goals.filter((g) => {
        if (!g.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (statusFilter !== "All" && g.status !== statusFilter) return false;
        if (priorityFilter !== "All" && g.priority !== priorityFilter) return false;
        if (categoryFilter !== "All" && g.category !== categoryFilter) return false;
        return true;
    });

    const filteredTasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const totalGoalPages = Math.max(1, Math.ceil(filteredGoals.length / pageSize));
    const totalTaskPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));

    useEffect(() => {
        if (currentPageGoals > totalGoalPages) setCurrentPageGoals(1);
    }, [filteredGoals.length, totalGoalPages]);

    useEffect(() => {
        if (currentPageTasks > totalTaskPages) setCurrentPageTasks(1);
    }, [filteredTasks.length, totalTaskPages]);

    const paginatedGoals = filteredGoals.slice((currentPageGoals - 1) * pageSize, currentPageGoals * pageSize);
    const paginatedTasks = filteredTasks.slice((currentPageTasks - 1) * pageSize, currentPageTasks * pageSize);

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Sidebar Navigation (Desktop) */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 hidden lg:block fixed h-full pt-24 pb-10 px-6">
                <div className="space-y-2">
                    <button
                        onClick={() => setActiveTab("goals")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "goals"
                            ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                    >
                        <TbTarget size={20} />
                        Goals
                    </button>
                    <button
                        onClick={() => setActiveTab("tasks")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "tasks"
                            ? "bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-sm"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                    >
                        <TbChecklist size={20} />
                        Tasks
                    </button>
                </div>

                <div className="mt-10">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
                        Quick Stats
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Goals</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{goals.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Tasks</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{tasks.length}</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 md:p-10 pt-24 pb-32">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {activeTab === "goals" ? "My Goals" : "Daily Tasks"}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {activeTab === "goals"
                                ? "Track your long-term objectives."
                                : "Manage your daily to-dos."}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>
                        <button
                            onClick={() => activeTab === "goals" ? openGoalModal() : openTaskModal()}
                            className="btn-primary flex items-center gap-2 whitespace-nowrap"
                        >
                            <TbPlus size={20} />
                            Add {activeTab === "goals" ? "Goal" : "Task"}
                        </button>
                        <button
                            onClick={() => setShowFilters((s) => !s)}
                            className={`p-2.5 rounded-xl border transition-colors ${showFilters ? 'bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                        >
                            <TbFilter size={20} />
                        </button>
                    </div>
                </header>

                {/* Filters */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-sm">
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
                                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500">
                                        <option value="All">All</option>
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Priority</label>
                                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500">
                                        <option value="All">All</option>
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</label>
                                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500">
                                        <option value="All">All</option>
                                        {Array.from(new Set(goals.map((g) => g.category))).map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={() => { setStatusFilter("All"); setPriorityFilter("All"); setCategoryFilter("All"); }} className="ml-auto text-sm text-red-600 hover:text-red-700 font-medium">
                                    Clear Filters
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <TbLoader2 className="animate-spin text-4xl text-blue-600" />
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === "goals" ? (
                            <motion.div
                                key="goals"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedGoals.map((goal) => (
                                        <GoalCard
                                            key={goal._id}
                                            goal={goal}
                                            onEdit={openGoalModal}
                                            onDelete={handleDeleteGoal}
                                        />
                                    ))}
                                </div>
                                {filteredGoals.length === 0 && (
                                    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-slate-500 dark:text-slate-400">No goals found. Start by adding one!</p>
                                    </div>
                                )}
                                {/* Pagination */}
                                {totalGoalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPageGoals((p) => Math.max(1, p - 1))}
                                            disabled={currentPageGoals === 1}
                                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                            {currentPageGoals} / {totalGoalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPageGoals((p) => Math.min(totalGoalPages, p + 1))}
                                            disabled={currentPageGoals === totalGoalPages}
                                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="tasks"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-3xl mx-auto"
                            >
                                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    {paginatedTasks.map((task) => (
                                        <TaskItem
                                            key={task._id}
                                            task={task}
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                        />
                                    ))}
                                    {filteredTasks.length === 0 && (
                                        <div className="text-center py-12">
                                            <p className="text-slate-500 dark:text-slate-400">No tasks found. Time to get productive!</p>
                                        </div>
                                    )}
                                </div>
                                {/* Pagination */}
                                {totalTaskPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        <button
                                            onClick={() => setCurrentPageTasks((p) => Math.max(1, p - 1))}
                                            disabled={currentPageTasks === 1}
                                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                            {currentPageTasks} / {totalTaskPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPageTasks((p) => Math.min(totalTaskPages, p + 1))}
                                            disabled={currentPageTasks === totalTaskPages}
                                            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>

            {/* Modals - Simplified for brevity but using premium styles */}
            {showGoalModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                            {editingGoal ? "Edit Goal" : "New Goal"}
                        </h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Goal Title"
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                            <textarea
                                placeholder="Description"
                                value={newGoal.description}
                                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-32 transition-all"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <select
                                    value={newGoal.priority}
                                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                                >
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                                <select
                                    value={newGoal.status}
                                    onChange={(e) => setNewGoal({ ...newGoal, status: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                                >
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                                />
                            </div>

                            {/* Progress Input */}
                            <div className="mt-4">
                                <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    <label>Progress</label>
                                    <span>{newGoal.progress}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={newGoal.progress}
                                    onChange={(e) => setNewGoal({ ...newGoal, progress: parseInt(e.target.value) })}
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                    style={{
                                        background: `linear-gradient(to right, #2563eb ${newGoal.progress}%, ${theme === "dark" ? "#334155" : "#e2e8f0"} ${newGoal.progress}%)`
                                    }}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button onClick={closeGoalModal} className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSaveGoal} className="btn-primary">
                                    Save Goal
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {showTaskModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">New Task</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                            <select
                                value={newTask.goalId}
                                onChange={(e) => setNewTask({ ...newTask, goalId: e.target.value })}
                                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                            >
                                <option value="">Link to Goal (Optional)</option>
                                {goals.map((g) => (
                                    <option key={g._id} value={g._id}>{g.title}</option>
                                ))}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                                >
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                                <input
                                    type="date"
                                    value={newTask.deadline}
                                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button onClick={closeTaskModal} className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleSaveTask} className="btn-primary">
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
