import Post from "../models/Post.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js"; // Assuming User model exists for leaderboard

// GET all posts (with pagination & filtering)
export const getPosts = async (req, res) => {
    try {
        const { category, tag } = req.query;
        const query = {};
        if (category && category !== "All") query.category = category;
        if (tag) query.tags = tag;

        const posts = await Post.find(query).sort({ createdAt: -1 }).limit(50);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE a post
export const createPost = async (req, res) => {
    try {
        const { content, image, category, tags } = req.body;

        if (!content) return res.status(400).json({ error: "Content is required" });

        const post = await Post.create({
            userId: req.user.id,
            content,
            image,
            category,
            tags
        });

        await Activity.create({
            userId: req.user.id,
            type: "POST_CREATED",
            description: "Shared a new post in community"
        });

        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LIKE a post
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const userId = req.user.id;
        const index = post.likes.indexOf(userId);

        if (index === -1) {
            post.likes.push(userId); // Like
        } else {
            post.likes.splice(index, 1); // Unlike
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// COMMENT on a post
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Comment text is required" });

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: "Post not found" });

        post.comments.push({
            userId: req.user.id,
            text
        });

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET Leaderboard (Mocked for now, or simple aggregation)
export const getLeaderboard = async (req, res) => {
    try {
        // In a real app, we'd aggregate posts/likes/tasks.
        // For now, let's just return some dummy data or simple counts if possible.
        // We'll try to get top posters.

        const topPosters = await Post.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // We need to fetch user details (names) for these IDs. 
        // Assuming we don't have a robust User profile system yet, we might send back IDs.
        // Or if User model exists, populate it.

        // Let's just return the aggregation for now.
        res.json(topPosters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
