import Goal from "../models/Goal.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

// GET all goals for user
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE a new goal
export const createGoal = async (req, res) => {
    try {
        const { title, description, category, priority, deadline, tags } = req.body;

        if (!title) return res.status(400).json({ error: "Title is required" });

        const goal = await Goal.create({
            userId: req.user.id,
            title,
            description,
            category,
            priority,
            deadline,
            tags
        });

        await Activity.create({
            userId: req.user.id,
            type: "GOAL_CREATED",
            description: `Created goal: ${title}`
        });

        res.status(201).json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE a goal
export const updateGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!goal) return res.status(404).json({ error: "Goal not found" });

        await Activity.create({
            userId: req.user.id,
            type: "GOAL_UPDATED",
            description: `Updated goal: ${goal.title}`
        });

        res.json(goal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE a goal
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!goal) return res.status(404).json({ error: "Goal not found" });

        // Optional: Delete associated tasks
        await Task.deleteMany({ goalId: goal._id });

        res.json({ message: "Goal deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
