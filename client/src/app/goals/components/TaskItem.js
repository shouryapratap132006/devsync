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
            className={`flex items-center justify-between p-5 rounded-xl border shadow-sm mb-4 transition-colors 
                ${task.status ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300 hover:border-blue-400"}
            `}
        >
            {/* LEFT SECTION */}
            <div className="flex items-start gap-4 flex-1">
                {/* Toggle Button */}
                <button
                    onClick={() => onToggle(task)}
                    className={`min-w-7 min-h-7 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors mt-1 
                        ${task.status
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-gray-400 hover:border-blue-600"
                        }`}
                >
                    {task.status && <TbCheck size={16} />}
                </button>

                {/* Task Details */}
                <div className={`${task.status ? "opacity-60" : ""} flex flex-col`}>
                    <h4
                        className={`font-semibold text-gray-900 text-lg leading-tight 
                            ${task.status ? "line-through text-gray-600" : ""}
                        `}
                    >
                        {task.title}
                    </h4>

                    {task.deadline && (
                        <div className="flex items-center gap-1 text-sm text-gray-800 mt-1">
                            <TbClock size={14} className="text-gray-600" />
                            <span className="text-sm text-gray-800">{new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-4 ml-4">
                {/* Priority Badge */}
                <span
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold tracking-wide 
                        ${task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                >
                    {task.priority}
                </span>

                {/* Delete Button */}
                <button
                    onClick={() => onDelete(task._id)}
                    className="text-gray-500 hover:text-red-600 p-2 rounded-md hover:bg-red-50 transition-colors"
                >
                    <TbTrash size={18} />
                </button>
            </div>
        </motion.div>
    );
}
