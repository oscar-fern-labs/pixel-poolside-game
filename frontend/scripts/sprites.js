// Sprite system for pixel art rendering
const spriteSystem = {
    sprites: new Map(),
    loaded: false
};

// Color palette for pixel art
const COLORS = {
    // Skin tones
    SKIN_LIGHT: '#FFDBAC',
    SKIN_MEDIUM: '#D4A574',
    SKIN_SHADOW: '#B8956A',
    
    // Hair colors
    HAIR_BLONDE: '#F4E4BC',
    HAIR_BROWN: '#8B4513',
    HAIR_BLACK: '#2F1B14',
    HAIR_RED: '#CD853F',
    
    // Clothing
    SHIRT_BLUE: '#4169E1',
    SHIRT_RED: '#DC143C',
    SHIRT_GREEN: '#32CD32',
    SHIRT_WHITE: '#FFFFFF',
    SHORTS_BLUE: '#191970',
    SHORTS_KHAKI: '#F0E68C',
    
    // Objects
    BALL_RED: '#FF4444',
    BALL_WHITE: '#FFFFFF',
    CHAIR_BLUE: '#4169E1',
    CHAIR_WHITE: '#F8F8FF',
    UMBRELLA_BLUE: '#4682B4',
    UMBRELLA_WHITE: '#FFFAFA',
    
    // Environment
    WATER: '#4169E1',
    DECK: '#D2B48C',
    CONCRETE: '#A0A0A0'
};

// Initialize sprite system
async function initializeSprites() {
    console.log('Initializing sprite system...');
    
    // Create all sprites programmatically
    createPlayerSprites();
    createNPCSprites();
    createObjectSprites();
    
    spriteSystem.loaded = true;
    console.log('All sprites generated successfully!');
}

// Create a canvas and draw pixel art on it
function createSprite(width, height, drawFunction) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    drawFunction(ctx);
    return canvas;
}

// Draw a pixel (scaled up)
function drawPixel(ctx, x, y, color, size = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
}

// Create player sprites for all directions and animation frames
function createPlayerSprites() {
    const directions = ['up', 'down', 'left', 'right'];
    
    directions.forEach(direction => {
        for (let frame = 0; frame < 4; frame++) {
            const sprite = createSprite(24, 32, (ctx) => {
                drawPlayer(ctx, direction, frame);
            });
            spriteSystem.sprites.set(`player_${direction}_${frame}`, sprite);
        }
        
        // Create default frame (frame 0) for static reference
        const defaultSprite = spriteSystem.sprites.get(`player_${direction}_0`);
        spriteSystem.sprites.set(`player_${direction}`, defaultSprite);
    });
}

function drawPlayer(ctx, direction, frame) {
    const walkOffset = frame % 2 === 1 ? 1 : 0;
    
    // Body (shirt)
    ctx.fillStyle = COLORS.SHIRT_BLUE;
    ctx.fillRect(8, 12, 8, 12);
    
    // Shorts
    ctx.fillStyle = COLORS.SHORTS_KHAKI;
    ctx.fillRect(8, 20, 8, 6);
    
    // Head
    ctx.fillStyle = COLORS.SKIN_LIGHT;
    ctx.fillRect(9, 4, 6, 8);
    
    // Hair (varies by direction)
    ctx.fillStyle = COLORS.HAIR_BROWN;
    if (direction === 'up') {
        ctx.fillRect(9, 2, 6, 4);
    } else {
        ctx.fillRect(9, 2, 6, 3);
    }
    
    // Eyes (only visible from front and sides)
    if (direction !== 'up') {
        ctx.fillStyle = '#000000';
        if (direction === 'down') {
            ctx.fillRect(10, 6, 1, 1);
            ctx.fillRect(13, 6, 1, 1);
        } else if (direction === 'left') {
            ctx.fillRect(10, 6, 1, 1);
        } else if (direction === 'right') {
            ctx.fillRect(13, 6, 1, 1);
        }
    }
    
    // Arms
    ctx.fillStyle = COLORS.SKIN_LIGHT;
    if (direction === 'left' || direction === 'right') {
        // Side view arms
        const armX = direction === 'left' ? 6 : 16;
        ctx.fillRect(armX, 14 + walkOffset, 2, 8);
    } else {
        // Front/back view arms
        ctx.fillRect(6, 14 + walkOffset, 2, 8);
        ctx.fillRect(16, 14 - walkOffset, 2, 8);
    }
    
    // Legs
    ctx.fillStyle = COLORS.SKIN_LIGHT;
    ctx.fillRect(9, 26 + walkOffset, 2, 6);
    ctx.fillRect(13, 26 - walkOffset, 2, 6);
    
    // Feet
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 31 + walkOffset, 3, 1);
    ctx.fillRect(13, 31 - walkOffset, 3, 1);
}

// Create NPC sprites
function createNPCSprites() {
    // Marina (Lifeguard)
    const marinaSprite = createSprite(24, 32, (ctx) => {
        drawNPC(ctx, {
            shirt: COLORS.SHIRT_RED,
            shorts: COLORS.SHORTS_WHITE,
            hair: COLORS.HAIR_BLONDE,
            skin: COLORS.SKIN_LIGHT,
            accessory: 'whistle'
        });
    });
    spriteSystem.sprites.set('lifeguard', marinaSprite);
    
    // Carlos (Pool Attendant)
    const carlosSprite = createSprite(24, 32, (ctx) => {
        drawNPC(ctx, {
            shirt: COLORS.SHIRT_BLUE,
            shorts: COLORS.SHORTS_KHAKI,
            hair: COLORS.HAIR_BLACK,
            skin: COLORS.SKIN_MEDIUM,
            accessory: 'tools'
        });
    });
    spriteSystem.sprites.set('pool_attendant', carlosSprite);
    
    // Sophie (Sunbather)
    const sophieSprite = createSprite(24, 32, (ctx) => {
        drawNPC(ctx, {
            shirt: '#FF69B4', // Pink bikini top
            shorts: '#FF69B4', // Pink bikini bottom
            hair: COLORS.HAIR_RED,
            skin: COLORS.SKIN_LIGHT,
            accessory: 'sunglasses'
        });
    });
    spriteSystem.sprites.set('sunbather', sophieSprite);
    
    // Giuseppe (Pool Chef)
    const giuseppeSprite = createSprite(24, 32, (ctx) => {
        drawNPC(ctx, {
            shirt: COLORS.SHIRT_WHITE,
            shorts: COLORS.SHORTS_BLUE,
            hair: COLORS.HAIR_BROWN,
            skin: COLORS.SKIN_MEDIUM,
            accessory: 'chef_hat'
        });
    });
    spriteSystem.sprites.set('pool_chef', giuseppeSprite);
}

function drawNPC(ctx, config) {
    // Body (shirt)
    ctx.fillStyle = config.shirt;
    ctx.fillRect(8, 12, 8, 12);
    
    // Shorts/bottom
    ctx.fillStyle = config.shorts;
    ctx.fillRect(8, 20, 8, 6);
    
    // Head
    ctx.fillStyle = config.skin;
    ctx.fillRect(9, 4, 6, 8);
    
    // Hair
    ctx.fillStyle = config.hair;
    ctx.fillRect(9, 2, 6, 3);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 6, 1, 1);
    ctx.fillRect(13, 6, 1, 1);
    
    // Arms
    ctx.fillStyle = config.skin;
    ctx.fillRect(6, 14, 2, 8);
    ctx.fillRect(16, 14, 2, 8);
    
    // Legs
    ctx.fillRect(9, 26, 2, 6);
    ctx.fillRect(13, 26, 2, 6);
    
    // Feet
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 31, 3, 1);
    ctx.fillRect(13, 31, 3, 1);
    
    // Accessories
    drawAccessory(ctx, config.accessory);
}

function drawAccessory(ctx, accessory) {
    switch (accessory) {
        case 'whistle':
            // Whistle around neck
            ctx.fillStyle = '#C0C0C0';
            ctx.fillRect(11, 11, 2, 1);
            break;
            
        case 'tools':
            // Tool belt
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(7, 18, 10, 1);
            break;
            
        case 'sunglasses':
            // Sunglasses
            ctx.fillStyle = '#000000';
            ctx.fillRect(9, 5, 6, 2);
            break;
            
        case 'chef_hat':
            // Chef hat
            ctx.fillStyle = COLORS.SHIRT_WHITE;
            ctx.fillRect(8, 1, 8, 3);
            ctx.fillRect(10, 0, 4, 2);
            break;
    }
}

// Create object sprites
function createObjectSprites() {
    // Pool ball
    const ballSprite = createSprite(32, 32, (ctx) => {
        // Ball shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(16, 28, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Ball body
        ctx.fillStyle = COLORS.BALL_RED;
        ctx.beginPath();
        ctx.arc(16, 16, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Ball stripe
        ctx.fillStyle = COLORS.BALL_WHITE;
        ctx.fillRect(12, 14, 8, 4);
    });
    spriteSystem.sprites.set('ball', ballSprite);
    
    // Pool chair
    const chairSprite = createSprite(32, 32, (ctx) => {
        // Chair shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(2, 28, 28, 4);
        
        // Chair frame
        ctx.fillStyle = COLORS.CHAIR_BLUE;
        ctx.fillRect(4, 8, 24, 16);
        
        // Chair fabric
        ctx.fillStyle = COLORS.CHAIR_WHITE;
        ctx.fillRect(6, 10, 20, 12);
        
        // Chair legs
        ctx.fillStyle = COLORS.CHAIR_BLUE;
        ctx.fillRect(4, 24, 2, 4);
        ctx.fillRect(26, 24, 2, 4);
    });
    spriteSystem.sprites.set('chair', chairSprite);
    
    // Beach umbrella
    const umbrellaSprite = createSprite(32, 32, (ctx) => {
        // Umbrella shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(16, 30, 15, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Umbrella pole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(15, 12, 2, 20);
        
        // Umbrella canopy
        ctx.fillStyle = COLORS.UMBRELLA_BLUE;
        ctx.beginPath();
        ctx.arc(16, 12, 12, 0, Math.PI);
        ctx.fill();
        
        // Umbrella stripes
        ctx.fillStyle = COLORS.UMBRELLA_WHITE;
        ctx.fillRect(8, 8, 2, 8);
        ctx.fillRect(14, 6, 2, 10);
        ctx.fillRect(20, 8, 2, 8);
    });
    spriteSystem.sprites.set('umbrella', umbrellaSprite);
}

// Render sprite function
function renderSprite(ctx, spriteKey, x, y, animFrame = 0) {
    let sprite;
    
    // Handle animated sprites (player)
    if (spriteKey.startsWith('player_') && animFrame > 0) {
        sprite = spriteSystem.sprites.get(`${spriteKey}_${animFrame}`);
    } else {
        sprite = spriteSystem.sprites.get(spriteKey);
    }
    
    if (!sprite) {
        // Fallback: draw colored rectangle
        ctx.fillStyle = '#FF00FF'; // Magenta for missing sprites
        ctx.fillRect(x, y, 24, 32);
        
        // Draw sprite name for debugging
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText(spriteKey, x + 12, y + 16);
        return;
    }
    
    // Draw the sprite scaled up for pixel art effect
    ctx.drawImage(sprite, x, y, sprite.width * 2, sprite.height * 2);
}

// Export functions
window.renderSprite = renderSprite;
window.initializeSprites = initializeSprites;
