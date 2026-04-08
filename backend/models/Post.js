const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: Number,
    id: { type: Number, unique: true },
    title: String,
    body: String
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
