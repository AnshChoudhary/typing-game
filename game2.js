const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game configuration
const WORD_LIST = [
    "type", "game", "cups", "light", "table", "rain", "cream", "code", "book", "bed", 
    "mattress", "shampoo", "charger", "wifi", "laptop", "coffee", "keyboard", "dance", 
    "apple", "phone", "chair", "cloud", "music", "water", "paper", "towel", "mouse", 
    "screen", "pencil", "orange", "mirror", "socket", "speaker", "wallet", "window", 
    "flower", "banana", "cookie", "guitar", "camera", "novel", "pizza", "bottle", 
    "pillow", "socks", "sweater", "jacket", "scarf", "gloves", "tablet", "zipper", 
    "router", "folder", "peanut", "tomato", "button", "remote", "scooter", "cactus", 
    "sandals", "blanket", "earbud", "candle", "shovel", "brush", "soccer", "butter", 
    "puzzle", "planet", "pickle", "garden", "printer", "monitor", "headline", "cabinet", 
    "necklace", "chimney", "backpack", "firewood", "blueberry", "calendar", "scissors", 
    "bookmark", "dressing", "resources", "current", "posts", "big", "media", "law", 
    "control", "history", "pictures", "size", "art", "personal", "since", "including", 
    "guide", "shop", "directory", "board", "location", "change", "white", "text", 
    "small", "rating", "rate", "government", "children", "during", "usa", "return", "students"
];

// Game state variables
let gameState = {
    score: 0,
    level: 1,
    words: [],
    currentInput: '',
    gameover: false,
    startTime: Date.now(),
    wordsTyped: 0,
    totalCharacters: 0,
    correctCharacters: 0,
    baseSpeed: 0.5,
    wordDropInterval: 2000,
    maxWordsActive: 3,
    particles: [],
    screenShake: 0
};

// UI elements
const scoreElement = document.getElementById('score');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const levelElement = document.getElementById('level');
const currentInputElement = document.getElementById('currentInput');
const gameOverOverlay = document.getElementById('gameOverOverlay');

// Generate random word
function generateRandomWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

// Create particle effect
function createParticles(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1,
            decay: 0.02,
            color: color,
            size: Math.random() * 4 + 2
        });
    }
}

// Update particles
function updateParticles() {
    gameState.particles = gameState.particles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= particle.decay;
        particle.size *= 0.98;
        return particle.life > 0;
    });
}

// Draw particles
function drawParticles() {
    gameState.particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// Generate word drop
function generateWordDrop() {
    if (gameState.words.length < gameState.maxWordsActive && !gameState.gameover) {
        const word = {
            text: generateRandomWord(),
            x: Math.random() * (canvas.width - 150) + 50,
            y: -30,
            speed: gameState.baseSpeed + (gameState.level - 1) * 0.2,
            color: `hsl(${Math.random() * 60 + 120}, 100%, 70%)`, // Green to cyan range
            glow: Math.random() * 10 + 5,
            matched: false
        };
        gameState.words.push(word);
    }
}

// Update game statistics
function updateStats() {
    const elapsedTime = (Date.now() - gameState.startTime) / 60000; // minutes
    const wpm = elapsedTime > 0 ? Math.round(gameState.wordsTyped / elapsedTime) : 0;
    const accuracy = gameState.totalCharacters > 0 ? 
        Math.round((gameState.correctCharacters / gameState.totalCharacters) * 100) : 100;
    
    scoreElement.textContent = gameState.score;
    wpmElement.textContent = wpm;
    accuracyElement.textContent = accuracy + '%';
    levelElement.textContent = gameState.level;
    currentInputElement.textContent = gameState.currentInput;
    
    // Update level based on score
    const newLevel = Math.floor(gameState.score / 10) + 1;
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        gameState.maxWordsActive = Math.min(3 + Math.floor(gameState.level / 3), 8);
        gameState.wordDropInterval = Math.max(1000, 2000 - (gameState.level - 1) * 100);
        gameState.screenShake = 20; // Level up screen shake
        createParticles(canvas.width / 2, canvas.height / 2, '#00ff41', 20);
    }
}

// Draw word with retro effects
function drawWord(word) {
    ctx.save();
    
    // Glow effect
    ctx.shadowBlur = word.glow;
    ctx.shadowColor = word.color;
    
    // Check if word matches current input
    const isMatching = word.text.toLowerCase().startsWith(gameState.currentInput.toLowerCase()) && 
                      gameState.currentInput.length > 0;
    
    if (isMatching) {
        ctx.fillStyle = '#ff0080'; // Pink for matching words
        ctx.shadowColor = '#ff0080';
        word.glow = Math.min(word.glow + 0.5, 20);
    } else {
        ctx.fillStyle = word.color;
        word.glow = Math.max(word.glow - 0.1, 5);
    }
    
    // Font styling
    ctx.font = 'bold 24px "Share Tech Mono", monospace';
    ctx.textAlign = 'center';
    
    // Draw word
    ctx.fillText(word.text, word.x, word.y);
    
    // Draw matching portion highlight
    if (isMatching && gameState.currentInput.length > 0) {
        const matchedPortion = gameState.currentInput.toLowerCase();
        const textWidth = ctx.measureText(matchedPortion).width;
        const fullWidth = ctx.measureText(word.text).width;
        const startX = word.x - fullWidth / 2;
        
        ctx.fillStyle = 'rgba(255, 0, 128, 0.3)';
        ctx.fillRect(startX, word.y - 20, textWidth, 25);
    }
    
    ctx.restore();
}

// Screen shake effect
function applyScreenShake() {
    if (gameState.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * gameState.screenShake;
        const shakeY = (Math.random() - 0.5) * gameState.screenShake;
        ctx.translate(shakeX, shakeY);
        gameState.screenShake *= 0.9;
        if (gameState.screenShake < 0.5) gameState.screenShake = 0;
    }
}

// Main draw function
function draw() {
    // Clear canvas with retro background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Apply screen shake
    ctx.save();
    applyScreenShake();
    
    // Draw grid pattern
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Draw particles
    drawParticles();
    
    // Draw words
    gameState.words.forEach(word => {
        drawWord(word);
    });
    
    ctx.restore();
    
    // Check for game over
    if (gameState.gameover) {
        gameOverOverlay.style.display = 'flex';
        return;
    }
    
    // Update game state
    updateParticles();
    updateWords();
    updateStats();
    
    // Continue game loop
    requestAnimationFrame(draw);
}

// Update words position and check collisions
function updateWords() {
    gameState.words.forEach((word, index) => {
        word.y += word.speed;
        
        // Check if word reached bottom
        if (word.y >= canvas.height - 20) {
            gameState.gameover = true;
            gameState.screenShake = 30;
            createParticles(word.x, word.y, '#ff0080', 15);
        }
    });
}

// Handle keyboard input
function keyDownHandler(event) {
    if (gameState.gameover) {
        if (event.key.toLowerCase() === 'r') {
            restartGame();
        }
        return;
    }
    
    if (event.key === 'Backspace') {
        if (gameState.currentInput.length > 0) {
            gameState.currentInput = gameState.currentInput.slice(0, -1);
            gameState.totalCharacters++;
        }
    } else if (event.key.length === 1 && /[a-zA-Z]/.test(event.key)) {
        gameState.currentInput += event.key.toLowerCase();
        gameState.totalCharacters++;
        gameState.correctCharacters++; // Assume correct for now, adjust on word completion
        
        // Check for word matches
        checkWordMatches();
    }
}

// Check if current input matches any word
function checkWordMatches() {
    gameState.words.forEach((word, index) => {
        if (word.text.toLowerCase() === gameState.currentInput.toLowerCase()) {
            // Word matched!
            gameState.score++;
            gameState.wordsTyped++;
            gameState.correctCharacters += word.text.length;
            
            // Create explosion effect
            createParticles(word.x, word.y, '#00ff41', 15);
            gameState.screenShake = 10;
            
            // Remove word and reset input
            gameState.words.splice(index, 1);
            gameState.currentInput = '';
        }
    });
}

// Restart game
function restartGame() {
    gameState = {
        score: 0,
        level: 1,
        words: [],
        currentInput: '',
        gameover: false,
        startTime: Date.now(),
        wordsTyped: 0,
        totalCharacters: 0,
        correctCharacters: 0,
        baseSpeed: 0.5,
        wordDropInterval: 2000,
        maxWordsActive: 3,
        particles: [],
        screenShake: 0
    };
    
    gameOverOverlay.style.display = 'none';
    startWordDropTimer();
    draw();
}

// Start word drop timer
function startWordDropTimer() {
    const dropTimer = setInterval(() => {
        if (gameState.gameover) {
            clearInterval(dropTimer);
            return;
        }
        generateWordDrop();
    }, gameState.wordDropInterval);
}

// Event listeners
document.addEventListener('keydown', keyDownHandler);

// Prevent default behavior for certain keys
document.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' || e.key === ' ') {
        e.preventDefault();
    }
});

// Initialize game
function initGame() {
    updateStats();
    generateWordDrop();
    startWordDropTimer();
    draw();
}

// Start the game
initGame();
