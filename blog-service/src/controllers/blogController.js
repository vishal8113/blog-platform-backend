const pool = require('../config/database');
const paginate = require('express-paginate');

const blogController = {
    // Create new blog post
    async createPost(req, res) {
        try {
            const { title, content } = req.body;
            const userId = req.user.userId;

            // First check if user exists
            const userCheck = await pool.query(
                'SELECT EXISTS(SELECT 1 FROM users_reference WHERE id = $1)',
                [userId]
            );
            

            if (!userCheck.rows[0].exists) {
                return res.status(401).json({ error: 'User no longer exists' });
            }

            const result = await pool.query(
                'INSERT INTO blogs (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
                [title, content, userId]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    // Get all blog posts with pagination using express-paginate
    async getPosts(req, res) {
        try {
            // Get total count
            const countResult = await pool.query('SELECT COUNT(*) as count FROM blogs');
            const itemCount = parseInt(countResult.rows[0].count);

            // Get paginated results using express-paginate's req.skip and req.query.limit
            const results = await pool.query(
                'SELECT * FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
                [req.query.limit, req.skip]
            );

            const pageCount = Math.ceil(itemCount / req.query.limit);

            res.json({
                blogs: results.rows,
                pageCount,
                itemCount,
                pages: paginate.getArrayPages(req)(
                    3, // number of pages to show in pagination
                    pageCount,
                    req.query.page
                ),
                currentPage: req.query.page,
                hasNextPage: paginate.hasNextPages(req)(pageCount)
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get specific blog post
    async getPost(req, res) {
        try {
            const result = await pool.query(
                'SELECT * FROM blogs WHERE id = $1',
                [req.params.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Blog post not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update blog post
    async updatePost(req, res) {
        try {
            const { title, content } = req.body;
            const userId = req.user.userId;

            const result = await pool.query(
                'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
                [title, content, req.params.id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Blog post not found or unauthorized' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete blog post
    async deletePost(req, res) {
        try {
            const userId = req.user.userId;

            const result = await pool.query(
                'DELETE FROM blogs WHERE id = $1 AND user_id = $2 RETURNING id',
                [req.params.id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Blog post not found or unauthorized' });
            }

            res.json({ message: 'Blog post deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = blogController;