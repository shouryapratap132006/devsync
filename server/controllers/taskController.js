import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

// GET all tasks for user
export const getTasks = async (req, res) => {
    try {
        const { goalId } = req.query;
        const query = { userId: req.user.id };
        if (goalId) query.goalId = goalId;

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE a new task
export const createTask = async (req, res) => {
    try {
        const { title, goalId, deadline, priority } = req.body;

        if (!title) return res.status(400).json({ error: "Title is required" });

        const task = await Task.create({
            userId: req.user.id,
            goalId: goalId || null,
            title,
            deadline,
            priority
        });

        await Activity.create({
            userId: req.user.id,
            type: "TASK_CREATED",
            description: `Added task: ${title}`
        });

        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE a task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );

        if (!task) return res.status(404).json({ error: "Task not found" });

        if (req.body.status !== undefined) {
            const action = req.body.status ? "completed" : "unmarked";
            await Activity.create({
                userId: req.user.id,
                type: req.body.status ? "TASK_COMPLETED" : "TASK_UPDATED",
                description: `Task ${action}: ${task.title}`
            });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE a task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ error: "Task not found" });

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
