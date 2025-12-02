import express from "express";
import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} from "../controllers/goalController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken); // Protect all routes

router.get("/", getGoals);
router.post("/", createGoal);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
