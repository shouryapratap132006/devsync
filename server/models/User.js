import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  skills: { type: [String], default: [] },
  interests: { type: [String], default: [] },
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
