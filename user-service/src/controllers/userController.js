const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const userController = {
    // Register new user
    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert user into database
            const result = await pool.query(
                'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
                [username, email, hashedPassword]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Login user
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Check if user exists
            const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
            const user = result.rows[0];

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get user details
    async getUser(req, res) {
        try {
            const result = await pool.query(
                'SELECT id, username, email FROM users WHERE id = $1',
                [req.params.id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Update user
    async updateUser(req, res) {
        try {
            const { username, email } = req.body;
            const userId = req.params.id;

            const result = await pool.query(
                'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
                [username, email, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Delete user
    async deleteUser(req, res) {
        try {
            const result = await pool.query(
                'DELETE FROM users WHERE id = $1 RETURNING id',
                [req.params.id]
            );
    
            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            // Could add the token to a blacklist in Redis or similar
            // await redisClient.sadd('invalidated_tokens', req.token);
    
            res.json({ 
                message: 'User deleted successfully',
                note: 'All associated blogs and comments will be deleted'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;