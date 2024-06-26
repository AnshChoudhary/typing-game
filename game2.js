const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WORD_LIST = ["type", "game", "cups", "light", "table", "rain", "cream", "code", "book", "bed", "mattress", "shampoo", "charger", "wifi", "laptop", "coffee", "keyboard",
"dance", "apple", "phone", "chair", "cloud", "music", "water", "paper", "towel", "mouse", "screen", "pencil", "orange", "mirror", "socket", "speaker",
"wallet", "window", "flower", "banana", "cookie", "guitar", "camera", "novel", "pizza", "bottle", "pillow", "socks", "sweater", "jacket", "scarf",
"gloves", "tablet", "zipper", "router", "folder", "peanut", "tomato", "button", "remote", "scooter", "cactus", "sandals", "blanket", "earbud",
"candle", "shovel", "brush", "soccer", "butter", "puzzle", "planet", "pickle", "garden", "printer", "monitor", "headline", "cabinet", "necklace",
"chimney", "backpack", "firewood", "blueberry", "calendar", "scissors", "bookmark", "dressing", "resources", "current", "posts", "big", "media",
"law", "control", "history", "pictures", "size", "art", "personal", "since", "including", "guide", "shop", "directory", "board", "location", "change",
"white", "text", "small", "rating", "rate", "government", "children", "during", "usa", "return", "students"];
const WORD_SPEED = 1.0; // Speed of words in pixels per frame
const WORD_DROP_INTERVAL = 1000; // Time interval between word drops in milliseconds
const MAX_WORDS_ACTIVE = 5; // Maximum number of words active simultaneously

let score = 0;
let words = []; // Array to store active words
let currentInput = ''; // User input
let gameover = false;
let startTime = Date.now();
let wordsTyped = 0;

// Function to generate a random word from the word list
function generateRandomWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

// Function to generate random word drops
function generateWordDrop() {
    if (words.length < MAX_WORDS_ACTIVE) {
        const word = {
            text: generateRandomWord(),
            x: Math.random() * (canvas.width - 100), // Random x position within canvas width
            y: 0 // Start from top of canvas
        };
        words.push(word);
    }
}

// Function to draw the current word and user input on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw active words
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    words.forEach(word => {
        ctx.fillText(word.text, word.x, word.y);
    });

    // Draw current input
    ctx.fillText(currentInput, 10, canvas.height - 30);

    // Draw score
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Check if game is over
    if (gameover) {
        ctx.fillStyle = 'red'; // Change the color to red
        ctx.fillText('Game Over!', 650, 300);
        return;
    }

    // Move words downwards
    words.forEach(word => {
        word.y += WORD_SPEED;
        // Check if word has reached bottom
        if (word.y >= canvas.height) {
            gameover = true;
            return;
        }
    });

    requestAnimationFrame(draw);
}

// Function to handle key down events
function updateTypingSpeed() {
    const elapsedTime = (Date.now() - startTime) / 60000; // Convert milliseconds to minutes
    const typingSpeed = Math.round(wordsTyped / elapsedTime);
    document.getElementById('typingSpeed').innerText = `Typing Speed: ${typingSpeed} WPM`;
}

function keyDownHandler(event) {
    if (!gameover) {
        if (event.keyCode === 8 && currentInput.length > 0) {
            // Backspace: Remove the last character from the current input
            currentInput = currentInput.slice(0, -1);
        } else if (event.keyCode >= 65 && event.keyCode <= 90) {
            // Alphabet keys: Add the typed character to the current input
            currentInput += String.fromCharCode(event.keyCode).toLowerCase();
        }
        // Check if any word matches the input
        words.forEach((word, index) => {
            if (word.text === currentInput) {
                words.splice(index, 1); // Remove word from array
                score++; // Increase score
                wordsTyped++; // Increase words typed
                currentInput = ''; // Clear current input
            }
        });
        updateTypingSpeed(); // Update typing speed display
    }
}

// Add event listener for key down events
document.addEventListener('keydown', keyDownHandler);

// Start the game loop
draw();

// Generate initial word drop
generateWordDrop();

// Schedule word drops at regular intervals
setInterval(() => {
    if (!gameover) {
        generateWordDrop();
    }
}, WORD_DROP_INTERVAL);
