import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    type: { type: String, required: true }, // e.g., "TASK_COMPLETED", "GOAL_CREATED"
    description: { type: String, required: true },
    metadata: { type: Object }, // Optional extra data
}, { timestamps: true });

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
