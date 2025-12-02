import React from "react";
import { motion } from "framer-motion";
import { TbTrash, TbEdit, TbCalendar, TbTarget } from "react-icons/tb";

export default function GoalCard({ goal, onEdit, onDelete }) {
    const priorityColors = {
        High: "bg-red-100 text-red-700 border-red-200",
        Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
        Low: "bg-green-100 text-green-700 border-green-200",
    };

    const statusColors = {
        "Not Started": "bg-gray-100 text-gray-600",
        "In Progress": "bg-blue-100 text-blue-600",
        "Completed": "bg-green-100 text-green-600",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group"
        >
            <div className="flex justify-between items-start mb-3">
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${priorityColors[goal.priority] || priorityColors.Medium
                        }`}
                >
                    {goal.priority}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(goal)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                    >
                        <TbEdit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(goal._id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                        <TbTrash size={16} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{goal.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {goal.description || "No description provided."}
            </p>

            <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        <TbCalendar size={14} />
                        {goal.deadline
                            ? new Date(goal.deadline).toLocaleDateString()
                            : "No Deadline"}
                    </div>
                    <span
                        className={`px-2 py-0.5 rounded-md ${statusColors[goal.status] || statusColors["Not Started"]
                            }`}
                    >
                        {goal.status}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
