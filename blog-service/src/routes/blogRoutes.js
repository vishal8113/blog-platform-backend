const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Blog routes
router.post('/blogs', blogController.createPost);
router.get('/blogs', blogController.getPosts);
router.get('/blogs/:id', blogController.getPost);
router.put('/blogs/:id', blogController.updatePost);
router.delete('/blogs/:id', blogController.deletePost);

module.exports = router;