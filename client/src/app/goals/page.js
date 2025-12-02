"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    TbPlus,
    TbTargetArrow,
    TbChecklist,
    TbFilter,
    TbLoader2,
    TbSearch,
} from "react-icons/tb";
import GoalCard from "./components/GoalCard";
import TaskItem from "./components/TaskItem";

export default function GoalsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("goals"); // "goals" or "todos"
    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPageGoals, setCurrentPageGoals] = useState(1);
    const [currentPageTasks, setCurrentPageTasks] = useState(1);
    const [pageSize] = useState(6);

    // Form States
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    // New Goal State
    const [newGoal, setNewGoal] = useState({
        title: "",
        description: "",
        category: "Personal",
        priority: "Medium",
        deadline: "",
        status: "Not Started",
        progress: 0,
    });

    // New Task State
    const [newTask, setNewTask] = useState({
        title: "",
        goalId: "",
        priority: "Medium",
        deadline: "",
    });

    const backendURL = "http://localhost:8080/api";

    // Helper: Safe Fetch with Auth
    async function safeFetch(url, options = {}) {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/login");
            throw new Error("No token");
        }

        const headers = {
            ...options.headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };

        const res = await fetch(url, { ...options, headers });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Request failed");
        }
        return res.json();
    }

    // Initial Data Load
    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [goalsData, tasksData] = await Promise.all([
                safeFetch(`${backendURL}/goals`),
                safeFetch(`${backendURL}/tasks`),
            ]);
            setGoals(goalsData);
            setTasks(tasksData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // --- Goal Operations ---
    async function handleSaveGoal() {
        try {
            if (editingGoal) {
                const updated = await safeFetch(`${backendURL}/goals/${editingGoal._id}`, {
                    method: "PUT",
                    body: JSON.stringify(newGoal),
                });
                setGoals((prev) => prev.map((g) => (g._id === updated._id ? updated : g)));
            } else {
                const created = await safeFetch(`${backendURL}/goals`, {
                    method: "POST",
                    body: JSON.stringify(newGoal),
                });
                setGoals((prev) => [created, ...prev]);
            }
            closeGoalModal();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleDeleteGoal(id) {
        if (!confirm("Delete this goal?")) return;
        try {
            await safeFetch(`${backendURL}/goals/${id}`, { method: "DELETE" });
            setGoals((prev) => prev.filter((g) => g._id !== id));
            // Also remove linked tasks locally for immediate UI update
            setTasks((prev) => prev.filter((t) => t.goalId !== id));
        } catch (err) {
            alert(err.message);
        }
    }

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
                progress: goal.progress,
            });
        } else {
            setEditingGoal(null);
            setNewGoal({
                title: "",
                description: "",
                category: "Personal",
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

    // --- Task Operations ---
    async function handleSaveTask() {
        try {
            const created = await safeFetch(`${backendURL}/tasks`, {
                method: "POST",
                body: JSON.stringify(newTask),
            });
            setTasks((prev) => [created, ...prev]);
            closeTaskModal();
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleToggleTask(task) {
        try {
            const updated = await safeFetch(`${backendURL}/tasks/${task._id}`, {
                method: "PUT",
                body: JSON.stringify({ status: !task.status }),
            });
            setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeleteTask(id) {
        if (!confirm("Delete this task?")) return;
        try {
            await safeFetch(`${backendURL}/tasks/${id}`, { method: "DELETE" });
            setTasks((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            alert(err.message);
        }
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

    // Filtered Data
    const filteredGoals = goals.filter((g) =>
        g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredTasks = tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination helpers (client-side)
    const totalGoalPages = Math.max(1, Math.ceil(filteredGoals.length / pageSize));
    const totalTaskPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));

    // Ensure current page is within bounds when filters change
    useEffect(() => {
        if (currentPageGoals > totalGoalPages) setCurrentPageGoals(1);
    }, [filteredGoals.length, totalGoalPages]);

    useEffect(() => {
        if (currentPageTasks > totalTaskPages) setCurrentPageTasks(1);
    }, [filteredTasks.length, totalTaskPages]);

    const paginatedGoals = filteredGoals.slice((currentPageGoals - 1) * pageSize, currentPageGoals * pageSize);
    const paginatedTasks = filteredTasks.slice((currentPageTasks - 1) * pageSize, currentPageTasks * pageSize);

    return (
        <div className="flex min-h-screen bg-[#f8f9fc]">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6 sticky top-0 h-screen">
                <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                    <TbTargetArrow className="text-blue-600" />
                    Focus
                </h1>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => setActiveTab("goals")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "goals"
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <TbTargetArrow size={20} />
                        Goals
                    </button>
                    <button
                        onClick={() => setActiveTab("todos")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === "todos"
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        <TbChecklist size={20} />
                        To-Dos
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-100">
                    <div className="text-xs text-gray-500 font-medium mb-2 uppercase tracking-wider">
                        Quick Stats
                    </div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Goals Active</span>
                        <span className="font-bold text-gray-900">{goals.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tasks Pending</span>
                        <span className="font-bold text-gray-900">
                            {tasks.filter((t) => !t.status).length}
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-10 overflow-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                            {activeTab === "goals" ? "My Goals" : "My Tasks"}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {activeTab === "goals"
                                ? "Track your long-term objectives."
                                : "Manage your daily tasks."}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto min-w-0">
                        <div className="relative flex-1 md:w-64 min-w-0 z-20">
                                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 z-40 pointer-events-none" />
                                <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all relative z-30  text-gray-900"
                            />
                        </div>
                        <button
                            onClick={() =>
                                activeTab === "goals" ? openGoalModal() : openTaskModal()
                            }
                            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                        >
                            <TbPlus size={20} />
                            Add {activeTab === "goals" ? "Goal" : "Task"}
                        </button>
                    </div>
                </header>

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
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {paginatedGoals.map((goal) => (
                                    <GoalCard
                                        key={goal._id}
                                        goal={goal}
                                        onEdit={openGoalModal}
                                        onDelete={handleDeleteGoal}
                                    />
                                ))}
                                {filteredGoals.length === 0 && (
                                    <div className="col-span-full text-center py-20 text-gray-500">
                                        No goals found. Start by adding one!
                                    </div>
                                )}
                                {/* Pagination controls for goals */}
                                {totalGoalPages > 1 && (
                                    <div className="col-span-full flex items-center justify-center mt-4">
                                        <button
                                            onClick={() => setCurrentPageGoals((p) => Math.max(1, p - 1))}
                                            className="px-3 py-1 bg-gray-100 rounded-l-md border border-r-0"
                                        >
                                            Prev
                                        </button>
                                        <div className="px-4 py-1 border-t border-b">
                                            Page {currentPageGoals} / {totalGoalPages}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPageGoals((p) => Math.min(totalGoalPages, p + 1))}
                                            className="px-3 py-1 bg-gray-100 rounded-r-md border border-l-0"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="todos"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-3xl mx-auto"
                            >
                                {paginatedTasks.map((task) => (
                                    <TaskItem
                                        key={task._id}
                                        task={task}
                                        onToggle={handleToggleTask}
                                        onDelete={handleDeleteTask}
                                    />
                                ))}
                                {filteredTasks.length === 0 && (
                                    <div className="text-center py-20 text-gray-500">
                                        No tasks found. Time to get productive!
                                    </div>
                                )}
                                {/* Pagination controls for tasks */}
                                {totalTaskPages > 1 && (
                                    <div className="mt-6 flex justify-center items-center gap-3">
                                        <button
                                            onClick={() => setCurrentPageTasks((p) => Math.max(1, p - 1))}
                                            className="px-3 py-1 bg-gray-100 rounded-l-md border border-r-0"
                                        >
                                            Prev
                                        </button>
                                        <div className="px-4 py-1 border-t border-b">
                                            Page {currentPageTasks} / {totalTaskPages}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPageTasks((p) => Math.min(totalTaskPages, p + 1))}
                                            className="px-3 py-1 bg-gray-100 rounded-r-md border border-l-0"
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

            {/* Goal Modal */}
                {showGoalModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-visible mx-4 my-8"
                    >
                        <div className="max-h-[90vh] overflow-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {editingGoal ? "Edit Goal" : "New Goal"}
                        </h3>
                        <div className="space-y-4">
                            <input
                                placeholder="Goal Title"
                                value={newGoal.title}
                                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                className="w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none placeholder-gray-500"
                            />
                            <textarea
                                placeholder="Description"
                                value={newGoal.description}
                                onChange={(e) =>
                                    setNewGoal({ ...newGoal, description: e.target.value })
                                }
                                className="w-full border rounded-lg px-4 py-2.5 h-24 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none placeholder-gray-500"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={newGoal.priority}
                                    onChange={(e) =>
                                        setNewGoal({ ...newGoal, priority: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-4 py-2.5 bg-white relative z-50  text-gray-900"
                                >
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                                <input
                                    type="date"
                                    value={newGoal.deadline}
                                    onChange={(e) =>
                                        setNewGoal({ ...newGoal, deadline: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900"
                                />
                            </div>

                            {editingGoal && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Progress</span>
                                        <span>{newGoal.progress}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={newGoal.progress}
                                        onChange={(e) =>
                                            setNewGoal({ ...newGoal, progress: Number(e.target.value) })
                                        }
                                        className="w-full accent-blue-600"
                                    />
                                    <select
                                        value={newGoal.status}
                                        onChange={(e) =>
                                            setNewGoal({ ...newGoal, status: e.target.value })
                                        }
                                        className="w-full border rounded-lg px-4 py-2.5 bg-white mt-2 relative z-50"
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeGoalModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveGoal}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
                                Save Goal
                            </button>
                        </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Task Modal */}
                {showTaskModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 p-4 overflow-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl overflow-visible mx-4 my-8"
                    >
                        <div className="max-h-[85vh] overflow-auto">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">New Task</h3>
                        <div className="space-y-4">
                            <input
                                placeholder="Task Title"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                className="w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500/20 outline-none placeholder-gray-500"
                            />
                            <select
                                    value={newTask.goalId}
                                    onChange={(e) => setNewTask({ ...newTask, goalId: e.target.value })}
                                    className="w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 relative z-50"
                                >
                                <option value="">Link to Goal (Optional)</option>
                                {goals.map((g) => (
                                    <option key={g._id} value={g._id}>
                                        {g.title}
                                    </option>
                                ))}
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={newTask.priority}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, priority: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900"
                                >
                                    <option value="High">High Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="Low">Low Priority</option>
                                </select>
                                <input
                                    type="date"
                                    value={newTask.deadline}
                                    onChange={(e) =>
                                        setNewTask({ ...newTask, deadline: e.target.value })
                                    }
                                    className="w-full border rounded-lg px-4 py-2.5 bg-white text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={closeTaskModal}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTask}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                            >
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
