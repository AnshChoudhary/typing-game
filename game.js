const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WORD_LIST = ['angry', 'skateboard', 'wifi', 'computer', 'dogs', 'lemons', 'keyboard'];
const WORD_SPEED = 1; // Speed of words in pixels per frame
const WORD_HEIGHT = 30; // Height of each word

let score = 0;
let currentWord = '';
let wordY = -WORD_HEIGHT; // Initial Y position of words above canvas
let typedWord = ''; // Current word being typed by the player
let gameover = false;

// Function to generate a random word from the word list
function generateRandomWord() {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
}

// Function to draw the current word falling from the top of the canvas
function drawFallingWord() {
    // Clear the area where the falling word is displayed
    ctx.clearRect(0, 0, canvas.width, WORD_HEIGHT);

    // Draw current word
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(currentWord, 10, wordY);
}

// Function to draw the letters being typed by the player
function drawTypedLetters() {
    // Clear the area where the typed letters are displayed
    ctx.clearRect(0, canvas.height - WORD_HEIGHT, canvas.width, WORD_HEIGHT);

    // Draw typed letters
    ctx.fillText(typedWord, 10, canvas.height - 10);
}

// Function to draw the score on the canvas
function drawScore() {
    // Draw score
    ctx.fillText(`Score: ${score}`, 10, 30);
}

// Function to draw game over message
function drawGameOver() {
    ctx.fillText('Game Over!', 350, 200);
}

// Function to handle key down events
function keyDownHandler(event) {
    if (!gameover) {
        if (event.keyCode === 8 && typedWord.length > 0) {
            // Backspace: Remove the last character from the typed word
            typedWord = typedWord.slice(0, -1);
        } else if (event.keyCode >= 65 && event.keyCode <= 90) {
            // Alphabet keys: Add the typed character to the typed word
            typedWord += String.fromCharCode(event.keyCode).toLowerCase();
        }
    }
}

// Add event listener for key down events
document.addEventListener('keydown', keyDownHandler);

// Function to update game state and check for collisions
function update() {
    // Check if the typed word matches the falling word
    if (typedWord === currentWord) {
        score++; // Increase score
        currentWord = ''; // Remove falling word
        typedWord = ''; // Reset typed word
        wordY = -WORD_HEIGHT; // Reset word position above canvas
        currentWord = generateRandomWord(); // Generate new falling word
    }

    // Move the falling word downwards
    wordY += WORD_SPEED;

    // Check if the word has reached the bottom of the canvas
    if (wordY >= canvas.height) {
        gameover = true;
    }
}

// Main game loop
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw falling word
    drawFallingWord();

    // Draw typed letters
    drawTypedLetters();

    // Draw score
    drawScore();

    // Draw game over message if game over
    if (gameover) {
        drawGameOver();
    } else {
        // Update game state
        update();

        // Request next animation frame
        requestAnimationFrame(draw);
    }
}

// Start the game loop
draw();

// Generate the first word
currentWord = generateRandomWord();
