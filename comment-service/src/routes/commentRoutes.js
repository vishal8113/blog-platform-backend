const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Current flat structure endpoints
router.post('/comments', commentController.addComment);
router.get('/comments', commentController.getComments); // This will handle ?post_id=<id>

/* Future nested comments endpoints
router.post('/comments/nested', auth, commentController.addNestedComment);
router.get('/comments/nested', auth, commentController.getNestedComments);
*/


module.exports = router;