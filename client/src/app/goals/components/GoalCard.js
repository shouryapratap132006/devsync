import React from "react";
import { motion } from "framer-motion";
import { TbTrash, TbEdit, TbCalendar } from "react-icons/tb";

export default function GoalCard({ goal, onEdit, onDelete }) {
    const priorityColors = {
        High: "bg-red-100 text-red-700 border-red-300",
        Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
        Low: "bg-green-100 text-green-700 border-green-300",
    };

    const statusColors = {
        "Not Started": "bg-gray-200 text-gray-800",
        "In Progress": "bg-blue-100 text-blue-700",
        Completed: "bg-green-100 text-green-700",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all"
        >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
                <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full border ${priorityColors[goal.priority]
                        }`}
                >
                    {goal.priority}
                </span>

                <div className="flex gap-3 opacity-70 hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(goal)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <TbEdit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(goal._id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    >
                        <TbTrash size={18} />
                    </button>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
                {goal.title}
            </h3>

            {/* Description */}
            <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                {goal.description || "No description provided."}
            </p>

            {/* Progress Section */}
            <div className="mb-5">
                <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <span>Progress</span>
                    <span className="font-semibold">{goal.progress}%</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                    />
                </div>
            </div>

            {/* Bottom Info */}
            <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <TbCalendar size={16} className="text-gray-500" />
                    {goal.deadline
                        ? new Date(goal.deadline).toLocaleDateString()
                        : "No Deadline"}
                </div>

                <span
                    className={`px-3 py-1 rounded-lg font-medium ${statusColors[goal.status]
                        }`}
                >
                    {goal.status}
                </span>
            </div>
        </motion.div>
    );
}
