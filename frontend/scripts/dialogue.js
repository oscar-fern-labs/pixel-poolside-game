// Dialogue system for JRPG-style conversations
const dialogueSystem = {
    isOpen: false,
    currentNPC: null,
    currentDialogue: null,
    
    // UI elements
    dialogueBox: null,
    dialogueHeader: null,
    dialogueText: null,
    dialogueResponses: null,
    
    init() {
        this.dialogueBox = document.getElementById('dialogueBox');
        this.dialogueHeader = document.getElementById('dialogueHeader');
        this.dialogueText = document.getElementById('dialogueText');
        this.dialogueResponses = document.getElementById('dialogueResponses');
    }
};

// Initialize dialogue system
document.addEventListener('DOMContentLoaded', () => {
    dialogueSystem.init();
});

// Show dialogue box
function showDialogue(npcName, dialogue) {
    dialogueSystem.isOpen = true;
    dialogueSystem.currentNPC = npcName;
    dialogueSystem.currentDialogue = dialogue;
    
    // Update UI
    dialogueSystem.dialogueHeader.textContent = npcName;
    dialogueSystem.dialogueText.innerHTML = formatDialogueText(dialogue.text);
    
    // Clear and populate response options
    dialogueSystem.dialogueResponses.innerHTML = '';
    
    if (dialogue.responses && dialogue.responses.length > 0) {
        dialogue.responses.forEach((response, index) => {
            const button = document.createElement('button');
            button.className = 'response-option';
            button.textContent = response.text;
            button.onclick = () => selectResponse(index);
            dialogueSystem.dialogueResponses.appendChild(button);
        });
    }
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'response-option close-dialogue';
    closeButton.textContent = '👋 End conversation';
    closeButton.onclick = closeDialogue;
    dialogueSystem.dialogueResponses.appendChild(closeButton);
    
    // Show dialogue box
    dialogueSystem.dialogueBox.style.display = 'block';
    
    // Hide interaction prompt
    document.getElementById('interactionPrompt').style.display = 'none';
    
    console.log('Showing dialogue:', dialogue);
}

// Handle response selection
async function selectResponse(responseIndex) {
    const response = dialogueSystem.currentDialogue.responses[responseIndex];
    
    if (!response) {
        console.error('Invalid response index:', responseIndex);
        return;
    }
    
    console.log('Selected response:', response);
    
    // If response has a next dialogue ID, fetch it
    if (response.nextDialogue) {
        try {
            // Find the NPC ID from the current gameState
            const npc = gameState.npcs.find(n => n.name === dialogueSystem.currentNPC);
            if (!npc) {
                console.error('Could not find NPC:', dialogueSystem.currentNPC);
                closeDialogue();
                return;
            }
            
            // Call API to get next dialogue
            const nextDialogue = await apiCall(`/npcs/${npc.id}/respond`, 'POST', {
                responseIndex: responseIndex,
                nextDialogue: response.nextDialogue
            });
            
            if (nextDialogue && nextDialogue.dialogue) {
                // Show next dialogue
                showDialogue(dialogueSystem.currentNPC, nextDialogue.dialogue);
            } else {
                // End conversation if no next dialogue
                closeDialogue();
            }
            
        } catch (error) {
            console.error('Error handling response:', error);
            closeDialogue();
        }
    } else {
        // End conversation
        closeDialogue();
    }
}

// Close dialogue box
function closeDialogue() {
    dialogueSystem.isOpen = false;
    dialogueSystem.currentNPC = null;
    dialogueSystem.currentDialogue = null;
    
    dialogueSystem.dialogueBox.style.display = 'none';
    
    console.log('Dialogue closed');
}

// Format dialogue text with basic markup support
function formatDialogueText(text) {
    if (!text) return '';
    
    return text
        // Convert *text* to <em>text</em>
        .replace(/\*(.*?)\*/g, '<em style="color: #4a9eff;">$1</em>')
        
        // Convert **text** to <strong>text</strong>
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffaa4a;">$1</strong>')
        
        // Convert line breaks
        .replace(/\n/g, '<br>')
        
        // Add some personality with emojis
        .replace(/\bpool\b/gi, '🏊‍♀️ pool')
        .replace(/\bsun\b/gi, '☀️ sun')
        .replace(/\bwater\b/gi, '💧 water')
        .replace(/\brelax\b/gi, '😌 relax')
        .replace(/\bfood\b/gi, '🍹 food')
        .replace(/\bdrink\b/gi, '🍹 drink');
}

// Handle keyboard input for dialogue
document.addEventListener('keydown', (e) => {
    if (dialogueSystem.isOpen) {
        switch (e.key) {
            case 'Escape':
                closeDialogue();
                e.preventDefault();
                break;
                
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
                const responseIndex = parseInt(e.key) - 1;
                const responses = dialogueSystem.currentDialogue?.responses;
                if (responses && responses[responseIndex]) {
                    selectResponse(responseIndex);
                }
                e.preventDefault();
                break;
        }
    }
});

// Prevent game movement when dialogue is open
function isDialogueOpen() {
    return dialogueSystem.isOpen;
}

// Export functions
window.showDialogue = showDialogue;
window.closeDialogue = closeDialogue;
window.isDialogueOpen = isDialogueOpen;
window.dialogueSystem = dialogueSystem;
