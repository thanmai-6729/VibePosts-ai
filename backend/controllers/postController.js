const axios = require('axios');
const Post = require('../models/Post');

exports.fetchPosts = async (req, res) => {
    try {
        const response = await axios.get('https://dummyjson.com/posts?limit=100');
        const externalPosts = response.data.posts;

        // Clear existing posts that are not seeded ones (optional, but requested for cleanup)
        // We'll just handle them via upsert or clearing Latin ones
        
        for (const post of externalPosts) {
            await Post.updateOne(
                { id: post.id },
                { 
                    $set: { 
                        userId: post.userId, 
                        title: post.title, 
                        body: post.body 
                    } 
                },
                { upsert: true }
            );
        }

        res.status(200).json({ message: "English posts synced successfully", count: externalPosts.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.clearPosts = async (req, res) => {
    try {
        // Clear all posts to remove Latin ones
        await Post.deleteMany({});
        // Re-seed English posts
        await exports.seedEnglishPosts();
        res.status(200).json({ message: "Database cleared and re-seeded with English posts" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findOne({ id: req.params.id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { userId, title, body } = req.body;
        // Get max id to increment
        const lastPost = await Post.findOne().sort({ id: -1 });
        const nextId = lastPost ? lastPost.id + 1 : 1;

        const newPost = new Post({
            userId: userId || 1,
            id: nextId,
            title,
            body
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.seedEnglishPosts = async () => {
    const englishPosts = [
        { userId: 1, id: 1001, title: "How to stay happy every day", body: "Focus on the great things in life. Love yourself and be good to others. Amazing things will happen." },
        { userId: 1, id: 1002, title: "Managing stress at work", body: "If you encounter an error or fail at a task, don't worry. Solving problems and issues is part of the job." },
        { userId: 1, id: 1003, title: "Tips for deep focus", body: "Set a clear goal for each work task. Plan your day and focus on one thing at a time." },
        { userId: 1, id: 1004, title: "Good vibes only", body: "Amazing energy brings great results. Spread love and be happy." },
    ];

    for (const post of englishPosts) {
        await Post.updateOne({ id: post.id }, { $set: post }, { upsert: true });
    }
    console.log("English sample posts seeded.");
};
