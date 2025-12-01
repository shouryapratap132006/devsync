import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  skills: { type: [String], required: true },
  wantToLearn: { type: [String], required: true },
  level: { type: String },
  goal: { type: String, required: true },
  time: { type: String },
  extraDetails: { type: String },
  weeks: { type: [String], default: [] },
}, { timestamps: true });

const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
export default Roadmap;
