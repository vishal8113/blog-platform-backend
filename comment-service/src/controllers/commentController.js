const pool = require('../config/database');
// For future nested comments implementation
// const nestedRouter = require('express-nested-router');

const commentController = {
    // Add a comment to a blog post
    async addComment(req, res) {
        try {
            const { content, post_id } = req.body;
            const userId = req.user.userId;

            console.log('Attempting to add comment:', { post_id, userId });

            // Check if user exists
            const userCheck = await pool.query(
                'SELECT EXISTS(SELECT 1 FROM users_reference WHERE id = $1)',
                [userId]
            );

            if (!userCheck.rows[0].exists) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            // Check if blog exists and get its details
            const blogCheck = await pool.query(
                `SELECT b.*, 
                    EXISTS(SELECT 1 FROM users_reference u WHERE u.id = b.user_id) as author_exists 
                FROM blogs_reference b 
                WHERE b.id = $1`,
                [post_id]
            );

            console.log('Blog check detailed result:', blogCheck.rows[0]);

            if (blogCheck.rows.length === 0 || !blogCheck.rows[0].author_exists) {
                return res.status(404).json({ error: 'Blog post no longer exists or author was deleted' });
            }

            const result = await pool.query(
                'INSERT INTO comments (content, user_id, blog_id) VALUES ($1, $2, $3) RETURNING *',
                [content, userId, post_id]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Error in addComment:', error);
            res.status(500).json({ error: error.message });
        }
    },

    // GET /comments?post_id=<id>: List comments for a specific blog post
    async getComments(req, res) {
        try {
            const { post_id } = req.query;

            if (!post_id) {
                return res.status(400).json({ error: 'post_id is required' });
            }

            const result = await pool.query(
                'SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at DESC',
                [post_id]
            );

            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    /* Future nested comments implementation
    async addNestedComment(req, res) {
        try {
            const { content, post_id, parent_id } = req.body;
            const userId = req.user.userId;

            // First, verify parent comment exists and belongs to the same post
            const parentCheck = await pool.query(
                'SELECT * FROM comments WHERE id = $1 AND blog_id = $2',
                [parent_id, post_id]
            );

            if (parent_id && parentCheck.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid parent comment' });
            }

            const result = await pool.query(
                'INSERT INTO comments (content, user_id, blog_id, parent_id) VALUES ($1, $2, $3, $4) RETURNING *',
                [content, userId, post_id, parent_id]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getNestedComments(req, res) {
        try {
            const { post_id } = req.query;

            if (!post_id) {
                return res.status(400).json({ error: 'post_id is required' });
            }

            // Get all comments for the post with their parent relationships
            const result = await pool.query(`
                WITH RECURSIVE comment_tree AS (
                    -- Base case: get all top-level comments
                    SELECT 
                        id, content, user_id, blog_id, parent_id, created_at,
                        0 as level,
                        ARRAY[id] as path
                    FROM comments
                    WHERE blog_id = $1 AND parent_id IS NULL

                    UNION ALL

                    -- Recursive case: get replies
                    SELECT 
                        c.id, c.content, c.user_id, c.blog_id, c.parent_id, c.created_at,
                        ct.level + 1,
                        ct.path || c.id
                    FROM comments c
                    INNER JOIN comment_tree ct ON c.parent_id = ct.id
                )
                SELECT * FROM comment_tree
                ORDER BY path, created_at DESC
            `, [post_id]);

            // Transform flat results into nested structure
            const nested = result.rows.reduce((acc, comment) => {
                if (!comment.parent_id) {
                    comment.replies = [];
                    acc[comment.id] = comment;
                } else {
                    const parent = acc[comment.parent_id];
                    if (parent) {
                        parent.replies = parent.replies || [];
                        parent.replies.push(comment);
                    }
                }
                return acc;
            }, {});

            res.json(Object.values(nested));
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    */
};

module.exports = commentController;