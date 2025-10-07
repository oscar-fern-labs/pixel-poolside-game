const express = require('express');
const router = express.Router();

// In-memory game state storage (for demo purposes)
// In a real game, this would be stored in a database
let gameState = {
    players: {},
    interactiveObjects: [
        {
            id: 'pool_ball',
            type: 'kickable',
            x: 300,
            y: 200,
            sprite: 'ball.png',
            name: 'Pool Ball',
            description: 'A colorful beach ball floating by the pool'
        },
        {
            id: 'pool_chair1',
            type: 'sittable',
            x: 150,
            y: 250,
            sprite: 'chair.png',
            name: 'Pool Chair',
            description: 'A comfortable lounge chair perfect for sunbathing'
        },
        {
            id: 'umbrella1',
            type: 'interactive',
            x: 180,
            y: 220,
            sprite: 'umbrella.png',
            name: 'Beach Umbrella',
            description: 'A large umbrella providing shade from the sun'
        }
    ]
};

// Get current game state
router.get('/state', (req, res) => {
    res.json(gameState);
});

// Update player position
router.post('/player/position', (req, res) => {
    const { playerId, x, y } = req.body;
    
    if (!playerId) {
        return res.status(400).json({ error: 'Player ID is required' });
    }
    
    if (!gameState.players[playerId]) {
        gameState.players[playerId] = {
            id: playerId,
            x: x || 100,
            y: y || 300,
            facing: 'down',
            sprite: 'player.png'
        };
    }
    
    gameState.players[playerId].x = x;
    gameState.players[playerId].y = y;
    
    res.json({ success: true, player: gameState.players[playerId] });
});

// Get player data
router.get('/player/:playerId', (req, res) => {
    const { playerId } = req.params;
    const player = gameState.players[playerId];
    
    if (!player) {
        return res.status(404).json({ error: 'Player not found' });
    }
    
    res.json(player);
});

// Interact with object
router.post('/interact/:objectId', (req, res) => {
    const { objectId } = req.params;
    const { playerId, action } = req.body;
    
    const object = gameState.interactiveObjects.find(obj => obj.id === objectId);
    
    if (!object) {
        return res.status(404).json({ error: 'Object not found' });
    }
    
    let result = {
        success: true,
        message: `You ${action || 'interact with'} the ${object.name}`,
        object: object
    };
    
    // Handle different object types
    switch (object.type) {
        case 'kickable':
            if (action === 'kick') {
                // Move the ball to a new position
                object.x += Math.random() * 100 - 50;
                object.y += Math.random() * 100 - 50;
                result.message = `You kick the ${object.name}! It rolls to a new spot.`;
            }
            break;
        case 'sittable':
            if (action === 'sit') {
                result.message = `You sit on the ${object.name} and enjoy the poolside view.`;
            }
            break;
        case 'interactive':
            result.message = `You examine the ${object.name}. ${object.description}`;
            break;
    }
    
    res.json(result);
});

// Get all interactive objects
router.get('/objects', (req, res) => {
    res.json(gameState.interactiveObjects);
});

module.exports = router;
