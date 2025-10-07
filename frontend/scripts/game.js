// Game configuration
const GAME_CONFIG = {
    canvas: null,
    ctx: null,
    width: 800,
    height: 600,
    scale: 2,
    tileSize: 32,
    apiBase: '/api', // Will use relative URLs since frontend is served by same server
    playerId: 'player-' + Math.random().toString(36).substr(2, 9)
};

// Game state
let gameState = {
    player: {
        x: 400,
        y: 300,
        width: 24,
        height: 32,
        speed: 2,
        direction: 'down',
        isMoving: false,
        animFrame: 0,
        animTimer: 0
    },
    npcs: [],
    objects: [],
    camera: { x: 0, y: 0 },
    isLoading: true,
    nearbyInteractable: null
};

// Animation system
const animationSystem = {
    update(deltaTime) {
        // Update player animation
        if (gameState.player.isMoving) {
            gameState.player.animTimer += deltaTime;
            if (gameState.player.animTimer > 200) {
                gameState.player.animFrame = (gameState.player.animFrame + 1) % 4;
                gameState.player.animTimer = 0;
            }
        } else {
            gameState.player.animFrame = 0;
        }
    }
};

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function isValidPosition(x, y, width = 24, height = 32) {
    // Boundary checks
    if (x < 50 || y < 50 || x + width > GAME_CONFIG.width - 50 || y + height > GAME_CONFIG.height - 50) {
        return false;
    }
    
    // Pool water collision (approximate pool area)
    const poolArea = {
        x: 300,
        y: 200,
        width: 400,
        height: 200
    };
    
    const playerRect = { x, y, width, height };
    if (checkCollision(playerRect, poolArea)) {
        return false;
    }
    
    // Check collision with other objects
    for (let obj of gameState.objects) {
        if (obj.solid) {
            const objRect = {
                x: obj.x - 16,
                y: obj.y - 16,
                width: 32,
                height: 32
            };
            if (checkCollision(playerRect, objRect)) {
                return false;
            }
        }
    }
    
    return true;
}

// API communication
async function apiCall(endpoint, method = 'GET', body = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(GAME_CONFIG.apiBase + endpoint, options);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// Initialize game
async function initializeGame() {
    console.log('Initializing Pixel Poolside Game...');
    
    // Setup canvas
    GAME_CONFIG.canvas = document.getElementById('gameCanvas');
    GAME_CONFIG.ctx = GAME_CONFIG.canvas.getContext('2d');
    GAME_CONFIG.ctx.imageSmoothingEnabled = false;
    
    try {
        // Load game data
        await loadGameData();
        
        // Initialize sprites
        await initializeSprites();
        
        // Setup input handlers
        setupInputHandlers();
        
        // Hide loading and show game
        document.getElementById('loading').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'block';
        
        gameState.isLoading = false;
        
        // Start game loop
        requestAnimationFrame(gameLoop);
        
        console.log('Game initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize game:', error);
        document.getElementById('loading').innerHTML = 'Failed to load game. Please refresh the page.';
    }
}

async function loadGameData() {
    console.log('Loading game data...');
    
    // Load NPCs
    const npcsData = await apiCall('/npcs');
    if (npcsData) {
        gameState.npcs = npcsData.map(npc => ({
            ...npc,
            width: 24,
            height: 32,
            interactionRadius: 40
        }));
        console.log('Loaded', gameState.npcs.length, 'NPCs');
    }
    
    // Load objects
    const objectsData = await apiCall('/game/objects');
    if (objectsData) {
        gameState.objects = objectsData.map(obj => ({
            ...obj,
            width: 32,
            height: 32,
            interactionRadius: 35
        }));
        console.log('Loaded', gameState.objects.length, 'objects');
    }
    
    // Update player position on server
    await apiCall('/game/player/position', 'POST', {
        playerId: GAME_CONFIG.playerId,
        x: gameState.player.x,
        y: gameState.player.y
    });
}

// Game loop
let lastTime = 0;
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    if (!gameState.isLoading) {
        update(deltaTime);
        render();
    }
    
    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Update animations
    animationSystem.update(deltaTime);
    
    // Check for nearby interactables
    checkNearbyInteractables();
    
    // Handle input-based movement (this will be called from input.js)
    handleMovement();
}

function handleMovement() {
    if (!inputState.isMoving) {
        gameState.player.isMoving = false;
        return;
    }
    
    const speed = gameState.player.speed;
    let newX = gameState.player.x;
    let newY = gameState.player.y;
    let direction = gameState.player.direction;
    
    if (inputState.left) {
        newX -= speed;
        direction = 'left';
    }
    if (inputState.right) {
        newX += speed;
        direction = 'right';
    }
    if (inputState.up) {
        newY -= speed;
        direction = 'up';
    }
    if (inputState.down) {
        newY += speed;
        direction = 'down';
    }
    
    // Validate new position
    if (isValidPosition(newX, newY)) {
        gameState.player.x = newX;
        gameState.player.y = newY;
        gameState.player.direction = direction;
        gameState.player.isMoving = true;
        
        // Update position on server occasionally
        if (Math.random() < 0.1) { // 10% chance per frame to reduce API calls
            apiCall('/game/player/position', 'POST', {
                playerId: GAME_CONFIG.playerId,
                x: newX,
                y: newY
            });
        }
    } else {
        gameState.player.isMoving = false;
    }
}

function checkNearbyInteractables() {
    let nearestInteractable = null;
    let minDistance = Infinity;
    
    // Check NPCs
    for (let npc of gameState.npcs) {
        const distance = Math.sqrt(
            Math.pow(gameState.player.x - npc.x, 2) + 
            Math.pow(gameState.player.y - npc.y, 2)
        );
        
        if (distance < npc.interactionRadius && distance < minDistance) {
            nearestInteractable = { type: 'npc', data: npc };
            minDistance = distance;
        }
    }
    
    // Check objects
    for (let obj of gameState.objects) {
        const distance = Math.sqrt(
            Math.pow(gameState.player.x - obj.x, 2) + 
            Math.pow(gameState.player.y - obj.y, 2)
        );
        
        if (distance < obj.interactionRadius && distance < minDistance) {
            nearestInteractable = { type: 'object', data: obj };
            minDistance = distance;
        }
    }
    
    // Update interaction prompt
    const prompt = document.getElementById('interactionPrompt');
    if (nearestInteractable !== gameState.nearbyInteractable) {
        gameState.nearbyInteractable = nearestInteractable;
        
        if (nearestInteractable) {
            prompt.style.display = 'block';
            if (nearestInteractable.type === 'npc') {
                prompt.textContent = `Press SPACE to talk to ${nearestInteractable.data.name}`;
            } else {
                prompt.textContent = `Press SPACE to interact with ${nearestInteractable.data.name}`;
            }
        } else {
            prompt.style.display = 'none';
        }
    }
}

// Interaction handler
async function handleInteraction() {
    if (!gameState.nearbyInteractable) return;
    
    const { type, data } = gameState.nearbyInteractable;
    
    if (type === 'npc') {
        // Start dialogue
        const dialogue = await apiCall(`/npcs/${data.id}/talk`, 'POST');
        if (dialogue) {
            showDialogue(data.name, dialogue);
        }
    } else if (type === 'object') {
        // Interact with object
        const result = await apiCall(`/game/interact/${data.id}`, 'POST', {
            playerId: GAME_CONFIG.playerId,
            action: 'interact'
        });
        
        if (result) {
            console.log('Object interaction result:', result);
            
            // Update object state if it changed
            if (result.object) {
                const objIndex = gameState.objects.findIndex(obj => obj.id === data.id);
                if (objIndex !== -1) {
                    gameState.objects[objIndex] = { ...gameState.objects[objIndex], ...result.object };
                }
            }
        }
    }
}

// Render function
function render() {
    const ctx = GAME_CONFIG.ctx;
    const canvas = GAME_CONFIG.canvas;
    
    // Clear canvas
    ctx.fillStyle = '#4a9eff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render environment
    renderEnvironment(ctx);
    
    // Render objects
    for (let obj of gameState.objects) {
        renderSprite(ctx, obj.type, obj.x - 16, obj.y - 16);
    }
    
    // Render NPCs
    for (let npc of gameState.npcs) {
        renderSprite(ctx, npc.role, npc.x - 12, npc.y - 16);
        
        // Show name above NPC if player is nearby
        const distance = Math.sqrt(
            Math.pow(gameState.player.x - npc.x, 2) + 
            Math.pow(gameState.player.y - npc.y, 2)
        );
        
        if (distance < npc.interactionRadius) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(npc.x - 30, npc.y - 40, 60, 20);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Courier New';
            ctx.textAlign = 'center';
            ctx.fillText(npc.name, npc.x, npc.y - 28);
        }
    }
    
    // Render player
    renderPlayer(ctx);
    
    // Render debug info
    if (window.DEBUG) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '14px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`Player: (${Math.round(gameState.player.x)}, ${Math.round(gameState.player.y)})`, 10, 30);
        ctx.fillText(`Direction: ${gameState.player.direction}`, 10, 50);
        ctx.fillText(`Moving: ${gameState.player.isMoving}`, 10, 70);
        ctx.fillText(`Nearby: ${gameState.nearbyInteractable ? gameState.nearbyInteractable.data.name : 'none'}`, 10, 90);
    }
}

function renderEnvironment(ctx) {
    // Ground/deck
    ctx.fillStyle = '#D2B48C';
    ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
    
    // Pool water
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(300, 200, 400, 200);
    
    // Pool edge
    ctx.strokeStyle = '#A0A0A0';
    ctx.lineWidth = 4;
    ctx.strokeRect(300, 200, 400, 200);
    
    // Water shimmer effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = 0; i < 10; i++) {
        const x = 320 + (i * 36) + Math.sin(Date.now() * 0.002 + i) * 10;
        const y = 220 + Math.cos(Date.now() * 0.003 + i) * 20;
        ctx.fillRect(x, y, 8, 2);
    }
    
    // Poolside elements
    // Umbrella shadows
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.ellipse(180, 240, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Decorative palm trees (simple)
    drawPalmTree(ctx, 100, 500);
    drawPalmTree(ctx, 700, 100);
    
    // Path tiles
    ctx.fillStyle = '#F5DEB3';
    for (let x = 0; x < GAME_CONFIG.width; x += 64) {
        for (let y = 0; y < GAME_CONFIG.height; y += 64) {
            if ((x + y) % 128 === 0) {
                ctx.fillRect(x, y, 32, 32);
            }
        }
    }
}

function drawPalmTree(ctx, x, y) {
    // Trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 4, y - 40, 8, 40);
    
    // Leaves
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.ellipse(x, y - 35, 25, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(x - 15, y - 30, 20, 10, -0.5, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(x + 15, y - 30, 20, 10, 0.5, 0, Math.PI * 2);
    ctx.fill();
}

function renderPlayer(ctx) {
    const player = gameState.player;
    renderSprite(ctx, 'player_' + player.direction, player.x - 12, player.y - 16, player.animFrame);
}

// Debug toggle
window.addEventListener('keydown', (e) => {
    if (e.key === 'F3') {
        window.DEBUG = !window.DEBUG;
    }
});

// Export for other modules
window.gameState = gameState;
window.GAME_CONFIG = GAME_CONFIG;
window.handleInteraction = handleInteraction;
window.apiCall = apiCall;
