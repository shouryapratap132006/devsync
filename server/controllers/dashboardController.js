import Goal from "../models/Goal.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Counts
        const totalGoals = await Goal.countDocuments({ userId });
        const completedGoals = await Goal.countDocuments({ userId, status: "Completed" });
        const totalTasks = await Task.countDocuments({ userId });
        const completedTasks = await Task.countDocuments({ userId, status: true });
        const totalRoadmaps = await Roadmap.countDocuments({ userId });

        // 1.1 Extended Counts
        const user = await User.findById(userId);
        const skillsCount = user ? user.skills.length : 0;
        const communityPosts = await Post.countDocuments({ userId });

        // 1.2 Streak Calculation
        const allActivities = await Activity.find({ userId }).select('createdAt').sort({ createdAt: -1 });
        let streak = 0;
        const uniqueDays = new Set();
        allActivities.forEach(a => uniqueDays.add(new Date(a.createdAt).toDateString()));

        let checkDate = new Date();
        // Check up to 365 days
        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toDateString();
            if (uniqueDays.has(dateStr)) {
                streak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // If it's today and no activity, check yesterday before breaking
                if (i === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        // 1.3 Next Task
        const nextTask = await Task.findOne({
            userId,
            status: false,
            deadline: { $gte: new Date() }
        }).sort({ deadline: 1 });

        // 1.4 Daily Quote
        const quotes = [
            "The only way to do great work is to love what you do.",
            "Code is like humor. When you have to explain it, it’s bad.",
            "First, solve the problem. Then, write the code.",
            "Experience is the name everyone gives to their mistakes.",
            "Simplicity is the soul of efficiency.",
            "Make it work, make it right, make it fast."
        ];
        const quote = quotes[Math.floor(Math.random() * quotes.length)];

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
                totalTasks,
                completedTasks,
                totalRoadmaps,
                skillsCount,
                communityPosts,
                streak
            },
            nextTask,
            quote,
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
