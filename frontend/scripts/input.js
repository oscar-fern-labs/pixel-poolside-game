// Input handling system
const inputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false,
    isMoving: false
};

const keyMap = {
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'KeyA': 'left',
    'KeyD': 'right',
    'KeyW': 'up',
    'KeyS': 'down',
    'Space': 'space'
};

// Track which keys are currently pressed
const pressedKeys = new Set();

function setupInputHandlers() {
    console.log('Setting up input handlers...');
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Prevent arrow keys from scrolling the page
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
            e.preventDefault();
        }
    });
    
    console.log('Input handlers ready!');
}

function handleKeyDown(e) {
    // Don't handle input if dialogue is open (except for dialogue-specific keys)
    if (isDialogueOpen && isDialogueOpen()) {
        return;
    }
    
    const inputKey = keyMap[e.code];
    
    if (inputKey) {
        // Handle movement keys
        if (['left', 'right', 'up', 'down'].includes(inputKey)) {
            if (!pressedKeys.has(e.code)) {
                pressedKeys.add(e.code);
                inputState[inputKey] = true;
                updateMovementState();
            }
        }
        
        // Handle interaction key
        if (inputKey === 'space') {
            if (!inputState.space) {
                inputState.space = true;
                handleSpacePress();
            }
        }
        
        e.preventDefault();
    }
}

function handleKeyUp(e) {
    const inputKey = keyMap[e.code];
    
    if (inputKey) {
        // Handle movement keys
        if (['left', 'right', 'up', 'down'].includes(inputKey)) {
            pressedKeys.delete(e.code);
            inputState[inputKey] = false;
            updateMovementState();
        }
        
        // Handle interaction key
        if (inputKey === 'space') {
            inputState.space = false;
        }
        
        e.preventDefault();
    }
}

function updateMovementState() {
    inputState.isMoving = inputState.left || inputState.right || inputState.up || inputState.down;
}

function handleSpacePress() {
    // Don't handle space if dialogue is open
    if (isDialogueOpen && isDialogueOpen()) {
        return;
    }
    
    // Handle interaction
    if (window.handleInteraction) {
        window.handleInteraction();
    }
}

// Touch support for mobile devices
let touchStartX = null;
let touchStartY = null;
let touchCurrentX = null;
let touchCurrentY = null;
let isTouching = false;

function setupTouchHandlers() {
    const canvas = document.getElementById('gameCanvas');
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });
}

function handleTouchStart(e) {
    e.preventDefault();
    
    if (isDialogueOpen && isDialogueOpen()) {
        return;
    }
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    
    touchStartX = touch.clientX - rect.left;
    touchStartY = touch.clientY - rect.top;
    touchCurrentX = touchStartX;
    touchCurrentY = touchStartY;
    isTouching = true;
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (!isTouching || (isDialogueOpen && isDialogueOpen())) {
        return;
    }
    
    const touch = e.touches[0];
    const rect = e.target.getBoundingClientRect();
    
    touchCurrentX = touch.clientX - rect.left;
    touchCurrentY = touch.clientY - rect.top;
    
    updateTouchMovement();
}

function handleTouchEnd(e) {
    e.preventDefault();
    
    // If it was a tap (minimal movement), treat as interaction
    if (isTouching && touchStartX !== null && touchCurrentX !== null) {
        const deltaX = Math.abs(touchCurrentX - touchStartX);
        const deltaY = Math.abs(touchCurrentY - touchStartY);
        
        if (deltaX < 20 && deltaY < 20) {
            // Tap - trigger interaction
            if (!isDialogueOpen || !isDialogueOpen()) {
                handleSpacePress();
            }
        }
    }
    
    // Reset touch state
    isTouching = false;
    touchStartX = null;
    touchStartY = null;
    touchCurrentX = null;
    touchCurrentY = null;
    
    // Reset movement
    inputState.left = false;
    inputState.right = false;
    inputState.up = false;
    inputState.down = false;
    inputState.isMoving = false;
}

function updateTouchMovement() {
    if (!isTouching || touchStartX === null || touchCurrentX === null) {
        return;
    }
    
    const deltaX = touchCurrentX - touchStartX;
    const deltaY = touchCurrentY - touchStartY;
    const threshold = 30; // Minimum distance for movement
    
    // Reset movement state
    inputState.left = false;
    inputState.right = false;
    inputState.up = false;
    inputState.down = false;
    
    // Determine primary direction
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal movement
            if (deltaX > 0) {
                inputState.right = true;
            } else {
                inputState.left = true;
            }
        } else {
            // Vertical movement
            if (deltaY > 0) {
                inputState.down = true;
            } else {
                inputState.up = true;
            }
        }
    }
    
    updateMovementState();
}

// Initialize touch handlers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupTouchHandlers();
});

// Virtual gamepad for mobile
function createVirtualGamepad() {
    const gamepadHTML = `
        <div id="virtualGamepad" style="
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            pointer-events: none;
            z-index: 1000;
        ">
            <div id="dpad" style="
                width: 120px;
                height: 120px;
                position: relative;
                pointer-events: auto;
            ">
                <button id="upBtn" style="position: absolute; top: 0; left: 40px; width: 40px; height: 40px;">↑</button>
                <button id="leftBtn" style="position: absolute; top: 40px; left: 0; width: 40px; height: 40px;">←</button>
                <button id="rightBtn" style="position: absolute; top: 40px; right: 0; width: 40px; height: 40px;">→</button>
                <button id="downBtn" style="position: absolute; bottom: 0; left: 40px; width: 40px; height: 40px;">↓</button>
            </div>
            <div>
                <button id="actionBtn" style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #4a9eff;
                    border: 2px solid white;
                    color: white;
                    font-size: 16px;
                    pointer-events: auto;
                ">💬</button>
            </div>
        </div>
    `;
    
    // Only add virtual gamepad on mobile devices
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        document.body.insertAdjacentHTML('beforeend', gamepadHTML);
        setupVirtualGamepadEvents();
    }
}

function setupVirtualGamepadEvents() {
    const buttons = {
        upBtn: 'up',
        downBtn: 'down',
        leftBtn: 'left',
        rightBtn: 'right',
        actionBtn: 'space'
    };
    
    Object.entries(buttons).forEach(([buttonId, action]) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (action === 'space') {
                    handleSpacePress();
                } else {
                    inputState[action] = true;
                    updateMovementState();
                }
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (action !== 'space') {
                    inputState[action] = false;
                    updateMovementState();
                }
            });
        }
    });
}

// Initialize virtual gamepad when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(createVirtualGamepad, 1000); // Delay to ensure game is loaded
});

// Export for other modules
window.inputState = inputState;
window.setupInputHandlers = setupInputHandlers;
