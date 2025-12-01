import Roadmap from "../models/Roadmap.js";
import { generateRoadmapWithGemini } from "../services/geminiService.js";

// GET all roadmaps
export const getAllRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    console.error("Get Roadmaps Error:", err);
    res.status(500).json({ error: "Failed to fetch roadmaps" });
  }
};

// GET roadmap by ID
export const getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });
    res.json(roadmap);
  } catch (err) {
    console.error("Get Roadmap Error:", err);
    res.status(500).json({ error: "Failed to fetch roadmap" });
  }
};

// CREATE roadmap
export const createRoadmap = async (req, res) => {
  try {
    const { skills = [], wantToLearn = [], level, goal, time, extraDetails } = req.body;

    // Required field checks
    if (!goal || skills.length === 0 || wantToLearn.length === 0) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Generate roadmap content from Gemini
    const weeks = await generateRoadmapWithGemini({
      skills,
      wantToLearn,
      level,
      goal,
      time,
      extraDetails
    });

    const roadmap = await Roadmap.create({
      userId: req.user.id,
      skills,
      wantToLearn,
      level,
      goal,
      time,
      extraDetails,
      weeks
    });

    res.status(201).json(roadmap);

  } catch (err) {
    console.error("Create Roadmap Error:", err);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};

// DELETE roadmap
export const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });

    res.json({ message: "Roadmap deleted" });
  } catch (err) {
    console.error("Delete Roadmap Error:", err);
    res.status(500).json({ error: "Failed to delete roadmap" });
  }
};
