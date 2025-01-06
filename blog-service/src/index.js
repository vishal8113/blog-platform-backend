const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const paginate = require('express-paginate');
require('dotenv').config();

const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Pagination middleware
app.use(paginate.middleware(10, 50)); // default limit is 10, max limit is 50

// Routes
app.use('/api', blogRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Blog service running on port ${PORT}`);
});