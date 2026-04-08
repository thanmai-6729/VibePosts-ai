const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/fetch-posts', postController.fetchPosts);
router.get('/clear-posts', postController.clearPosts);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/posts', postController.createPost);

module.exports = router;
