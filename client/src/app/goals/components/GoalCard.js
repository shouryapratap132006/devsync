import React from "react";
import { motion } from "framer-motion";
import { TbTrash, TbEdit, TbCalendar, TbTarget } from "react-icons/tb";

export default function GoalCard({ goal, onEdit, onDelete }) {
    const priorityColors = {
        High: "bg-red-50 text-red-700 border-red-100",
        Medium: "bg-orange-50 text-orange-700 border-orange-100",
        Low: "bg-green-50 text-green-700 border-green-100",
    };

    const statusColors = {
        "Not Started": "bg-slate-100 text-slate-600",
        "In Progress": "bg-blue-50 text-blue-700",
        "Completed": "bg-green-50 text-green-700",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card-premium p-6 group relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-4">
                <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityColors[goal.priority] || priorityColors.Medium}`}
                >
                    {goal.priority}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(goal)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <TbEdit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(goal._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <TbTrash size={18} />
                    </button>
                </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight">{goal.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
                {goal.description || "No description provided."}
            </p>

            <div className="space-y-4">
                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                        <span>Progress</span>
                        <span className="text-slate-900 dark:text-white">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                            style={{ width: `${goal.progress}%` }}
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <TbCalendar size={14} className="text-slate-400" />
                        {goal.deadline
                            ? new Date(goal.deadline).toLocaleDateString()
                            : "No Deadline"}
                    </div>
                    <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusColors[goal.status] || statusColors["Not Started"]}`}
                    >
                        {goal.status}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
