import express from "express";
import {
  getAllRoadmaps,
  getRoadmapById,
  createRoadmap,
  deleteRoadmap
} from "../controllers/roadmapController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllRoadmaps);
router.get("/:id", verifyToken, getRoadmapById);
router.post("/", verifyToken, createRoadmap);
router.delete("/:id", verifyToken, deleteRoadmap);

export default router;

