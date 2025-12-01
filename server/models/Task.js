import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" }, // Optional link to a goal
    title: { type: String, required: true },
    deadline: { type: Date },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    status: { type: Boolean, default: false }, // false = Pending, true = Completed
}, { timestamps: true });

const Task = mongoose.model("Task", TaskSchema);
export default Task;
