const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api', commentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Comment service running on port ${PORT}`);
});