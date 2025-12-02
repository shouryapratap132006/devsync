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
            className={`flex items-center justify-between p-4 rounded-xl border mb-3 transition-colors ${task.status
                    ? "bg-gray-50 border-gray-100"
                    : "bg-white border-gray-200 hover:border-blue-300"
                }`}
        >
            <div className="flex items-center gap-3 flex-1">
                <button
                    onClick={() => onToggle(task)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.status
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-300 hover:border-blue-500"
                        }`}
                >
                    {task.status && <TbCheck size={14} />}
                </button>

                <div className={task.status ? "opacity-50" : ""}>
                    <h4
                        className={`font-medium text-gray-900 ${task.status ? "line-through text-gray-500" : ""
                            }`}
                    >
                        {task.title}
                    </h4>
                    {task.deadline && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <TbClock size={12} />
                            {new Date(task.deadline).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${task.priority === "High"
                            ? "bg-red-50 text-red-600"
                            : task.priority === "Medium"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-green-50 text-green-600"
                        }`}
                >
                    {task.priority}
                </span>
                <button
                    onClick={() => onDelete(task._id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                >
                    <TbTrash size={16} />
                </button>
            </div>
        </motion.div>
    );
}
