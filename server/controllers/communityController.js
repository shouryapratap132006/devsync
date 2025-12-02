import Post from "../models/Post.js";
import Activity from "../models/Activity.js";
import User from "../models/User.js"; // Assuming User model exists for leaderboard

// GET all posts (with pagination & filtering)
export const getPosts = async (req, res) => {
    try {
        const { category, tag, page = 1, limit = 10 } = req.query;
        const query = {};
        if (category && category !== "All") query.category = category;
        if (tag) query.tags = tag;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const totalPosts = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        // Fetch user names for posts and comments
        const userIds = new Set();
        posts.forEach(p => {
            userIds.add(p.userId);
            (p.comments || []).forEach(c => userIds.add(c.userId));
            (p.likes || []).forEach(l => userIds.add(l));
        });

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name');
        const userMap = {};
        users.forEach(u => { userMap[u._id] = u.name; });

        // Attach authorName and commenter names
        const enriched = posts.map(p => ({
            ...p.toObject(),
            authorName: userMap[p.userId] || `User ${String(p.userId).substring(0, 6)}`,
            comments: (p.comments || []).map(c => ({
                ...c.toObject(),
                authorName: userMap[c.userId] || `User ${String(c.userId).substring(0, 6)}`
            }))
        }));

        res.json({
            posts: enriched,
            currentPage: pageNum,
            totalPages: Math.ceil(totalPosts / limitNum),
            totalPosts
        });
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
        // Enrich the returned post with author names for frontend convenience
        const userIds = new Set();
        userIds.add(post.userId);
        (post.comments || []).forEach(c => userIds.add(c.userId));

        const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('name');
        const userMap = {};
        users.forEach(u => { userMap[u._id] = u.name; });

        const enriched = {
            ...post.toObject(),
            authorName: userMap[post.userId] || `User ${String(post.userId).substring(0, 6)}`,
            comments: (post.comments || []).map(c => ({
                ...c.toObject(),
                authorName: userMap[c.userId] || `User ${String(c.userId).substring(0, 6)}`
            }))
        };

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const topPosters = await Post.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const userIds = topPosters.map(p => p._id);
        const users = await User.find({ _id: { $in: userIds } }).select('name');
        const userMap = {};
        users.forEach(u => { userMap[u._id] = u.name; });

        const enriched = topPosters.map(p => ({
            _id: p._id,
            name: userMap[p._id] || `User ${String(p._id).substring(0, 6)}`,
            count: p.count
        }));

        res.json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
