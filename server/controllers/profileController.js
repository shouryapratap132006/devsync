import User from "../models/User.js";
import Goal from "../models/Goal.js";
import Task from "../models/Task.js";
import Post from "../models/Post.js";
import Activity from "../models/Activity.js";

// GET Profile (User Info + Stats + Activity)
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        // Aggregate Stats
        const totalGoals = await Goal.countDocuments({ userId });
        const completedGoals = await Goal.countDocuments({ userId, status: "Completed" });
        const totalTasks = await Task.countDocuments({ userId });
        const completedTasks = await Task.countDocuments({ userId, status: true });
        const communityPosts = await Post.countDocuments({ userId });

        // Recent Activity
        const recentActivity = await Activity.find({ userId }).sort({ createdAt: -1 }).limit(10);

        res.json({
            user,
            stats: {
                totalGoals,
                completedGoals,
                totalTasks,
                completedTasks,
                communityPosts
            },
            recentActivity
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE Profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, bio, location, skills, interests } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (skills) user.skills = skills;
        if (interests) user.interests = interests;

        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
