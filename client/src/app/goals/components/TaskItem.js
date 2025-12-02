import React from "react";
import { motion } from "framer-motion";
import { TbTrash, TbCheck, TbClock } from "react-icons/tb";

export default function TaskItem({ task, onToggle, onDelete }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center justify-between p-4 rounded-xl border mb-3 transition-all duration-200 group ${task.status
                    ? "bg-slate-50 border-slate-100"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm"
                }`}
        >
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={() => onToggle(task)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${task.status
                            ? "bg-blue-600 border-blue-600 text-white scale-100"
                            : "border-slate-300 hover:border-blue-500 text-transparent scale-95 hover:scale-100"
                        }`}
                >
                    <TbCheck size={14} strokeWidth={3} />
                </button>

                <div className={task.status ? "opacity-50" : ""}>
                    <h4
                        className={`font-medium text-slate-900 transition-all ${task.status ? "line-through text-slate-500" : ""
                            }`}
                    >
                        {task.title}
                    </h4>
                    {task.deadline && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <TbClock size={12} />
                            {new Date(task.deadline).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-semibold ${task.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "Medium"
                                ? "bg-orange-50 text-orange-600"
                                : "bg-green-50 text-green-600"
                        }`}
                >
                    {task.priority}
                </span>

                <button
                    onClick={() => onDelete(task._id)}
                    className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                    <TbTrash size={18} />
                </button>
            </div>
        </motion.div>
    );
}
