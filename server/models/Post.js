import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // URL to image
    category: { type: String, default: "General" },
    tags: { type: [String], default: [] },
    likes: { type: [String], default: [] }, // Array of userIds who liked
    comments: [{
        userId: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
export default Post;
