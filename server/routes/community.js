import express from "express";
import {
    getPosts,
    createPost,
    likePost,
    addComment,
    getLeaderboard
} from "../controllers/communityController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/posts", getPosts);
router.post("/posts", createPost);
router.post("/posts/:id/like", likePost);
router.post("/posts/:id/comment", addComment);
router.get("/leaderboard", getLeaderboard);

export default router;
