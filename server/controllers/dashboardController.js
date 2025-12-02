import Goal from "../models/Goal.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import Roadmap from "../models/Roadmap.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Counts
        const totalGoals = await Goal.countDocuments({ userId });
        const completedGoals = await Goal.countDocuments({ userId, status: "Completed" });
        const totalTasks = await Task.countDocuments({ userId });
        const completedTasks = await Task.countDocuments({ userId, status: true });
        const totalRoadmaps = await Roadmap.countDocuments({ userId });

        // 2. Weekly Productivity (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentTasks = await Task.find({
            userId,
            status: true,
            updatedAt: { $gte: sevenDaysAgo }
        });

        // Group by day
        const weeklyProductivity = {};
        // Initialize last 7 days with 0
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            weeklyProductivity[dayName] = 0;
        }

        recentTasks.forEach(task => {
            const dayName = new Date(task.updatedAt).toLocaleDateString('en-US', { weekday: 'short' });
            if (weeklyProductivity[dayName] !== undefined) {
                weeklyProductivity[dayName]++;
            }
        });

        const productivityChart = Object.keys(weeklyProductivity).reverse().map(day => ({
            name: day,
            tasks: weeklyProductivity[day]
        }));

        // 3. Goal Categories
        const goals = await Goal.find({ userId });
        const categoryMap = {};
        goals.forEach(g => {
            categoryMap[g.category] = (categoryMap[g.category] || 0) + 1;
        });
        const categoryChart = Object.keys(categoryMap).map(cat => ({
            name: cat,
            value: categoryMap[cat]
        }));

        // 4. Recent Activity
        const activities = await Activity.find({ userId })
            .sort({ createdAt: -1 })
            .limit(10);

        // 5. Active Goals (Top 3)
        const activeGoals = await Goal.find({ userId, status: { $ne: "Completed" } })
            .sort({ updatedAt: -1 })
            .limit(3);

        res.json({
            counts: {
                totalGoals,
                completedGoals,
                totalTasks,
                completedTasks,
                totalRoadmaps
            },
            charts: {
                productivity: productivityChart,
                categories: categoryChart
            },
            activities,
            activeGoals
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ error: err.message });
    }
};
