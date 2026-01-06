const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes'); // Imports index.js from routes folder
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow Cross-Origin requests
app.use(express.json()); // Parse JSON request bodies

// API Routes Prefix
app.use('/api', apiRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ 
            running: true,
            message: 'Simple Orders API is running'
        });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});