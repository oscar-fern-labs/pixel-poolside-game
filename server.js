const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Import routes
const gameRoutes = require('./backend/gameRoutes');
const npcRoutes = require('./backend/npcRoutes');

// Use routes
app.use('/api/game', gameRoutes);
app.use('/api/npcs', npcRoutes);

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎮 Pixel Poolside Game server running on port ${PORT}`);
    console.log(`🌐 Access the game at: http://localhost:${PORT}`);
});
