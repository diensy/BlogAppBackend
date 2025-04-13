// postRoutes.js
const express = require('express');
const router = express.Router();
const postController = require('../controller/blogController');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new post
router.post('/posts', authMiddleware, postController.createPost);

// Get all posts
router.get('/posts', postController.getAllPosts);

router.get('/user-post/:userId', postController.getUserAllPosts);

// Get a specific post by ID
router.get('/posts/:postId', postController.getPostById);

// Edit a post
router.put('/posts/:postId', authMiddleware, postController.editPost);

// Delete a post
router.delete('/posts/:postId', authMiddleware, postController.deletePost);
// Like a post
router.post('/posts/:postId/like', authMiddleware, postController.likePost);

// Dislike a post
router.post('/posts/:postId/dislike', authMiddleware, postController.dislikePost);

// Add comment
router.post('/posts/:postId/comment', authMiddleware, postController.addComment);


module.exports = router;
