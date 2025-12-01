import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, default: "Personal" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
    deadline: { type: Date },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
    tags: { type: [String], default: [] },
}, { timestamps: true });

const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
