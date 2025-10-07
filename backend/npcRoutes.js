const express = require('express');
const router = express.Router();

// NPC data with JRPG-style dialogues
const npcs = {
    lifeguard: {
        id: 'lifeguard',
        name: 'Marina',
        x: 400,
        y: 150,
        sprite: 'lifeguard.png',
        facing: 'down',
        description: 'A vigilant lifeguard watching over the pool',
        dialogues: [
            {
                id: 'greeting',
                text: "Welcome to Sunny Pool Resort! I'm Marina, your lifeguard for today.",
                responses: [
                    { text: "Hi there! This place looks amazing!", nextDialogue: 'about_pool' },
                    { text: "Are there any safety rules I should know?", nextDialogue: 'safety_rules' },
                    { text: "Thanks, I'll just look around.", nextDialogue: null }
                ]
            },
            {
                id: 'about_pool',
                text: "Isn't it beautiful? We just renovated the pool area last month. The water is perfectly temperature controlled!",
                responses: [
                    { text: "The renovation really paid off!", nextDialogue: 'weather_chat' },
                    { text: "What else is new around here?", nextDialogue: 'whats_new' },
                    { text: "I should get going now.", nextDialogue: null }
                ]
            },
            {
                id: 'safety_rules',
                text: "Of course! No running around the pool, no diving in the shallow end, and please shower before entering the water.",
                responses: [
                    { text: "Got it, thanks for the heads up!", nextDialogue: 'helpful_tips' },
                    { text: "Are there any other facilities here?", nextDialogue: 'facilities' },
                    { text: "I'll be careful. See you around!", nextDialogue: null }
                ]
            },
            {
                id: 'weather_chat',
                text: "Perfect weather for swimming today! The forecast says it'll stay sunny all week.",
                responses: [
                    { text: "That's great news!", nextDialogue: null },
                    { text: "I love sunny weather!", nextDialogue: null }
                ]
            },
            {
                id: 'whats_new',
                text: "We added a new juice bar by the north side, and there's a beach volleyball court being built!",
                responses: [
                    { text: "A juice bar sounds refreshing!", nextDialogue: null },
                    { text: "Volleyball court? Count me in!", nextDialogue: null }
                ]
            },
            {
                id: 'helpful_tips',
                text: "Also, if you need sunscreen, there's a dispenser by the entrance. Stay hydrated!",
                responses: [
                    { text: "Thanks for looking out for us!", nextDialogue: null }
                ]
            },
            {
                id: 'facilities',
                text: "We have changing rooms, showers, a snack bar, and rental equipment for pool games!",
                responses: [
                    { text: "Sounds like everything I need is here!", nextDialogue: null }
                ]
            }
        ],
        currentDialogue: 'greeting',
        interactionCount: 0
    },
    pool_attendant: {
        id: 'pool_attendant',
        name: 'Carlos',
        x: 200,
        y: 350,
        sprite: 'attendant.png',
        facing: 'left',
        description: 'A friendly pool attendant maintaining the area',
        dialogues: [
            {
                id: 'greeting',
                text: "Hey there! I'm Carlos, the pool attendant. Just finished cleaning the pool filters!",
                responses: [
                    { text: "Thanks for keeping everything clean!", nextDialogue: 'maintenance_chat' },
                    { text: "The water looks crystal clear!", nextDialogue: 'water_quality' },
                    { text: "Keep up the good work!", nextDialogue: null }
                ]
            },
            {
                id: 'maintenance_chat',
                text: "It's my pleasure! I take pride in maintaining this beautiful space for everyone to enjoy.",
                responses: [
                    { text: "How long have you worked here?", nextDialogue: 'work_history' },
                    { text: "What's the most challenging part?", nextDialogue: 'challenges' },
                    { text: "Well, I appreciate your dedication!", nextDialogue: null }
                ]
            },
            {
                id: 'water_quality',
                text: "I test the water chemistry twice daily! pH levels are perfect, and chlorine is just right.",
                responses: [
                    { text: "That attention to detail is impressive!", nextDialogue: 'detail_oriented' },
                    { text: "No wonder the water feels so good!", nextDialogue: null }
                ]
            },
            {
                id: 'work_history',
                text: "I've been here for three years now. Started as a summer job, but I love the outdoor work!",
                responses: [
                    { text: "That's awesome you found your calling!", nextDialogue: null },
                    { text: "Outdoor work does seem nice!", nextDialogue: null }
                ]
            },
            {
                id: 'challenges',
                text: "Probably the early morning setup and late evening cleanup, but seeing happy families makes it worth it!",
                responses: [
                    { text: "Your hard work really shows!", nextDialogue: null }
                ]
            },
            {
                id: 'detail_oriented',
                text: "Thanks! Safety and cleanliness are my top priorities. Happy swimmers make for a great day!",
                responses: [
                    { text: "We definitely appreciate it!", nextDialogue: null }
                ]
            }
        ],
        currentDialogue: 'greeting',
        interactionCount: 0
    },
    sunbather: {
        id: 'sunbather',
        name: 'Sophie',
        x: 350,
        y: 280,
        sprite: 'sunbather.png',
        facing: 'up',
        description: 'A relaxed guest enjoying the sun',
        dialogues: [
            {
                id: 'greeting',
                text: "*adjusts sunglasses* Oh hi! Beautiful day for some sun, isn't it?",
                responses: [
                    { text: "Absolutely! Perfect weather for relaxing!", nextDialogue: 'relaxation' },
                    { text: "You seem to have the right idea!", nextDialogue: 'vacation_mode' },
                    { text: "Enjoy your sunbathing!", nextDialogue: null }
                ]
            },
            {
                id: 'relaxation',
                text: "I drove two hours to get here, but it's so worth it! This place has the most peaceful vibe.",
                responses: [
                    { text: "Two hours? That's dedication to relaxation!", nextDialogue: 'dedication' },
                    { text: "It really is peaceful here!", nextDialogue: 'peaceful_vibes' },
                    { text: "Hope you enjoy every minute!", nextDialogue: null }
                ]
            },
            {
                id: 'vacation_mode',
                text: "Vacation mode: activated! No emails, no stress, just vitamin D and good vibes!",
                responses: [
                    { text: "That sounds like the perfect vacation!", nextDialogue: 'perfect_vacation' },
                    { text: "I should adopt that mindset too!", nextDialogue: 'mindset_advice' },
                    { text: "Enjoy your digital detox!", nextDialogue: null }
                ]
            },
            {
                id: 'dedication',
                text: "When you find a good spot, you stick with it! Plus, they have the best poolside service.",
                responses: [
                    { text: "Good service makes all the difference!", nextDialogue: null }
                ]
            },
            {
                id: 'peaceful_vibes',
                text: "Right? The sound of the water, the gentle breeze... it's like natural meditation.",
                responses: [
                    { text: "I can definitely feel the zen here!", nextDialogue: null }
                ]
            },
            {
                id: 'perfect_vacation',
                text: "Sometimes the simplest pleasures are the best ones. Sun, water, and zero schedule!",
                responses: [
                    { text: "Couldn't agree more!", nextDialogue: null }
                ]
            },
            {
                id: 'mindset_advice',
                text: "Do it! Leave the phone in the bag and just... be present. It's surprisingly refreshing!",
                responses: [
                    { text: "Great advice, I'll try that!", nextDialogue: null }
                ]
            }
        ],
        currentDialogue: 'greeting',
        interactionCount: 0
    },
    pool_chef: {
        id: 'pool_chef',
        name: 'Giuseppe',
        x: 100,
        y: 100,
        sprite: 'chef.png',
        facing: 'right',
        description: 'The enthusiastic poolside snack bar chef',
        dialogues: [
            {
                id: 'greeting',
                text: "*waves spatula enthusiastically* Ciao! I'm Giuseppe, chef of the poolside kitchen! Hungry for something delicious?",
                responses: [
                    { text: "What's on the menu today?", nextDialogue: 'menu' },
                    { text: "What's your specialty?", nextDialogue: 'specialty' },
                    { text: "Maybe later, thanks!", nextDialogue: null }
                ]
            },
            {
                id: 'menu',
                text: "Today we have fresh fish tacos, tropical fruit salads, and my famous poolside pizza! Everything made fresh!",
                responses: [
                    { text: "Fish tacos sound amazing!", nextDialogue: 'fish_tacos' },
                    { text: "Poolside pizza? That's unique!", nextDialogue: 'poolside_pizza' },
                    { text: "I'll think about it!", nextDialogue: null }
                ]
            },
            {
                id: 'specialty',
                text: "Ah, my specialty! Grilled pineapple with honey and mint - perfect after a swim! Light but satisfying!",
                responses: [
                    { text: "That sounds incredibly refreshing!", nextDialogue: 'refreshing_food' },
                    { text: "You really know poolside cuisine!", nextDialogue: 'cuisine_expert' },
                    { text: "I might have to try that!", nextDialogue: null }
                ]
            },
            {
                id: 'fish_tacos',
                text: "Fresh mahi-mahi, cabbage slaw, and my secret mango salsa! Caught this morning, I guarantee!",
                responses: [
                    { text: "You really care about freshness!", nextDialogue: 'freshness_matters' },
                    { text: "Secret mango salsa? Intriguing!", nextDialogue: null }
                ]
            },
            {
                id: 'poolside_pizza',
                text: "Light crust, fresh mozzarella, cherry tomatoes, and basil! No heavy toppings - perfect for swimming!",
                responses: [
                    { text: "Smart thinking for poolside dining!", nextDialogue: null }
                ]
            },
            {
                id: 'refreshing_food',
                text: "Exactly! Food should complement the experience, not weigh you down. Light, fresh, flavorful!",
                responses: [
                    { text: "You're a philosopher of poolside cuisine!", nextDialogue: null }
                ]
            },
            {
                id: 'cuisine_expert',
                text: "Twenty years in restaurants, but poolside cooking? That's my true passion! It's all about the atmosphere!",
                responses: [
                    { text: "Your passion really shows!", nextDialogue: null }
                ]
            },
            {
                id: 'freshness_matters',
                text: "Always! Fresh ingredients, fresh air, fresh start to your day! That's the Giuseppe way!",
                responses: [
                    { text: "I love that philosophy!", nextDialogue: null }
                ]
            }
        ],
        currentDialogue: 'greeting',
        interactionCount: 0
    }
};

// Get all NPCs
router.get('/', (req, res) => {
    const npcList = Object.values(npcs).map(npc => ({
        id: npc.id,
        name: npc.name,
        x: npc.x,
        y: npc.y,
        sprite: npc.sprite,
        facing: npc.facing,
        description: npc.description
    }));
    res.json(npcList);
});

// Get specific NPC
router.get('/:npcId', (req, res) => {
    const { npcId } = req.params;
    const npc = npcs[npcId];
    
    if (!npc) {
        return res.status(404).json({ error: 'NPC not found' });
    }
    
    res.json(npc);
});

// Start conversation with NPC
router.post('/:npcId/talk', (req, res) => {
    const { npcId } = req.params;
    const npc = npcs[npcId];
    
    if (!npc) {
        return res.status(404).json({ error: 'NPC not found' });
    }
    
    // Get current dialogue
    const currentDialogue = npc.dialogues.find(d => d.id === npc.currentDialogue);
    
    if (!currentDialogue) {
        return res.status(500).json({ error: 'Dialogue not found' });
    }
    
    // Increment interaction count
    npc.interactionCount++;
    
    res.json({
        npc: {
            id: npc.id,
            name: npc.name,
            description: npc.description
        },
        dialogue: currentDialogue,
        interactionCount: npc.interactionCount
    });
});

// Respond to NPC dialogue
router.post('/:npcId/respond', (req, res) => {
    const { npcId } = req.params;
    const { responseIndex, nextDialogue } = req.body;
    const npc = npcs[npcId];
    
    if (!npc) {
        return res.status(404).json({ error: 'NPC not found' });
    }
    
    // Update current dialogue based on response
    if (nextDialogue) {
        npc.currentDialogue = nextDialogue;
        const newDialogue = npc.dialogues.find(d => d.id === nextDialogue);
        
        res.json({
            success: true,
            dialogue: newDialogue,
            npc: {
                id: npc.id,
                name: npc.name
            }
        });
    } else {
        // Conversation ended
        // Reset to greeting for next interaction
        npc.currentDialogue = 'greeting';
        
        res.json({
            success: true,
            dialogue: null,
            message: 'Conversation ended'
        });
    }
});

// Reset NPC dialogue (for testing)
router.post('/:npcId/reset', (req, res) => {
    const { npcId } = req.params;
    const npc = npcs[npcId];
    
    if (!npc) {
        return res.status(404).json({ error: 'NPC not found' });
    }
    
    npc.currentDialogue = 'greeting';
    npc.interactionCount = 0;
    
    res.json({ success: true, message: 'NPC dialogue reset' });
});

module.exports = router;
