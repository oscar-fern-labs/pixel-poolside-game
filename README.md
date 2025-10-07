# 🏊‍♀️ Pixel Poolside Game 🌴

**A chill pixel art poolside experience with JRPG-style character interactions**

🎮 **Play Now:** https://game-backend-morphvm-xuymii4w.http.cloud.morph.so

## 🌟 Game Overview

Pixel Poolside is a relaxing demo game where you explore a beautiful poolside environment, chat with friendly NPCs in classic JRPG-style dialogue, and interact with various poolside objects. It's all about the chill vibes! 

### ✨ Features

🎭 **4 Unique NPCs with Rich Personalities:**
- **Marina** (Lifeguard) - Safety-focused and helpful, discusses pool rules and facilities
- **Carlos** (Pool Attendant) - Hardworking and dedicated, talks about maintenance and work passion  
- **Sophie** (Sunbather) - Relaxed vacation-mode, shares philosophy about being present
- **Giuseppe** (Pool Chef) - Enthusiastic about poolside cuisine and fresh ingredients

🎮 **Interactive Gameplay:**
- Walk around with WASD or Arrow Keys
- Talk to NPCs with branching JRPG-style dialogue trees
- Interact with objects: kick the pool ball, sit in chairs, examine the umbrella
- Beautiful pixel art environment with water effects and palm trees

📱 **Cross-Platform Support:**
- Desktop: Keyboard controls (WASD/Arrows + Space)
- Mobile: Touch controls with virtual gamepad
- Responsive design that works everywhere

## 🎨 Visual Style

- **16-bit pixel art aesthetic** with custom-generated sprites
- **Poolside atmosphere** complete with:
  - Sparkling pool water with shimmer effects
  - Wooden deck tiles and concrete pool edges  
  - Palm trees and umbrella shadows
  - Character animations and directional sprites

## 🛠️ Technical Architecture

### Frontend (JavaScript + HTML5 Canvas)
- **game.js**: Core game engine, collision detection, API integration
- **sprites.js**: Pixel art sprite generation and rendering system
- **dialogue.js**: JRPG-style dialogue system with branching conversations
- **input.js**: Input handling for keyboard, touch, and virtual gamepad
- **index.html**: Main game interface with responsive design

### Backend (Node.js + Express)
- **RESTful API** for NPC dialogues and object interactions
- **Extensive dialogue system** with 28+ dialogue nodes across 4 NPCs
- **Object state management** for interactive poolside items
- **Player tracking** and game state persistence

## 🚀 Quick Start

### Local Development
```bash
git clone https://github.com/oscar-fern-labs/pixel-poolside-game.git
cd pixel-poolside-game
npm install
npm start
```

The game will be available at `http://localhost:3000`

### API Endpoints
```javascript
GET  /api/npcs                    // Get all NPCs with positions
GET  /api/npcs/{npcId}           // Get specific NPC details  
POST /api/npcs/{npcId}/talk      // Start conversation
POST /api/npcs/{npcId}/respond   // Send dialogue response
GET  /api/game/state             // Get full game state
GET  /api/game/objects           // Get all interactive objects
POST /api/game/interact/{objectId} // Interact with object
```

## 🎮 How to Play

1. **Movement**: Use WASD keys or Arrow Keys to walk around the poolside
2. **Interaction**: Press SPACE when near NPCs or objects to interact  
3. **Dialogue**: Choose responses by clicking or using number keys (1-5)
4. **Mobile**: Touch to move, tap to interact, use virtual gamepad buttons
5. **Debug**: Press F3 to toggle debug information

### 💡 Pro Tips
- Walk close to NPCs to see their names and interaction prompts
- Each NPC has multiple conversation paths - try different responses!
- The pool ball moves to a random location when kicked
- Sitting in chairs and examining objects provides flavor text
- Explore the entire poolside area for all the interactive elements

## 🌐 Live Demo

The game is deployed and accessible at:
**https://game-backend-morphvm-xuymii4w.http.cloud.morph.so**

Experience the chill poolside vibes, chat with the NPCs, and enjoy the pixel art atmosphere! 🌴☀️

## 📦 Project Structure

```
pixel-poolside-game/
├── frontend/
│   ├── index.html              # Main game interface
│   └── scripts/
│       ├── game.js            # Core game engine  
│       ├── sprites.js         # Pixel art sprite system
│       ├── dialogue.js        # JRPG dialogue system
│       └── input.js           # Input handling
├── backend/
│   ├── gameRoutes.js          # Object interaction API
│   └── npcRoutes.js           # NPC dialogue API  
├── server.js                  # Express server
└── package.json               # Dependencies
```

---

*Built with ❤️ as a chill pixel art gaming experience. Enjoy the poolside vibes! 🏊‍♀️🌴*
