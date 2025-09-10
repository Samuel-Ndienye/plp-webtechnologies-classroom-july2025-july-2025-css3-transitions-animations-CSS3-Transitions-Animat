// ===== PART 2: JavaScript Functions - Scope, Parameters & Return Values =====

// Global variables
let score = 0;
let timer = 0;
let timerInterval;
let flippedCards = [];
let matchedPairs = 0;
const totalPairs = 8;

// Card data - using local scope to prevent external modification
const cardData = (() => {
    const symbols = ['🌟', '🚀', '🎯', '🎨', '🎭', '🎪', '🎮', '🎲'];
    return [...symbols, ...symbols]; // Create pairs
})();

// Function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array]; // Local copy to avoid modifying original
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to create a card element
function createCardElement(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = '?';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = symbol;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    return card;
}

// Function to initialize game board
function initializeGameBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    const shuffledCards = shuffleArray(cardData);
    
    shuffledCards.forEach((symbol, index) => {
        const card = createCardElement(symbol, index);
        gameBoard.appendChild(card);
    });
    
    // Reset game state
    score = 0;
    timer = 0;
    flippedCards = [];
    matchedPairs = 0;
    updateScore();
    updateTimer();
}

// Function to update score display
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Function to update timer display
function updateTimer() {
    document.getElementById('timer').textContent = `Time: ${timer}s`;
}

// Function to start timer
function startTimer() {
    clearInterval(timerInterval);
    timer = 0;
    timerInterval = setInterval(() => {
        timer++;
        updateTimer();
    }, 1000);
}

// Function to stop timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Function to check if cards match
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Match found
        score += 10;
        matchedPairs++;
        flippedCards = [];
        updateScore();
        
        // Check for game completion
        if (matchedPairs === totalPairs) {
            setTimeout(endGame, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Function to handle card flip
function handleCardFlip(card) {
    // Prevent flipping if already flipped or matching in progress
    if (card.classList.contains('flipped') || flippedCards.length === 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        setTimeout(checkForMatch, 500);
    }
}

// Function to end game and show results
function endGame() {
    stopTimer();
    showModal(
        'Congratulations! 🎉',
        `You completed the game in ${timer} seconds with a score of ${score}!`
    );
}

// Function to show modal with custom message
function showModal(title, message) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('result-modal').style.display = 'block';
}

// Function to close modal
function closeModal() {
    document.getElementById('result-modal').style.display = 'none';
}

// ===== PART 3: Combining CSS Animations with JavaScript =====

// Function to add animation class temporarily
function addTemporaryAnimation(element, animationClass, duration = 500) {
    element.classList.add(animationClass);
    setTimeout(() => {
        element.classList.remove(animationClass);
    }, duration);
}

// Function to reset game with animation
function resetGameWithAnimation() {
    const gameBoard = document.getElementById('game-board');
    addTemporaryAnimation(gameBoard, 'shake');
    
    setTimeout(() => {
        stopTimer();
        initializeGameBoard();
    }, 300);
}

// ===== Event Listeners and Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    initializeGameBoard();
    
    // Event listeners for buttons
    document.getElementById('start-btn').addEventListener('click', () => {
        resetGameWithAnimation();
        startTimer();
    });
    
    document.getElementById('reset-btn').addEventListener('click', resetGameWithAnimation);
    
    // Event delegation for card clicks
    document.getElementById('game-board').addEventListener('click', (event) => {
        const card = event.target.closest('.card');
        if (card) {
            handleCardFlip(card);
        }
    });
    
    // Modal event listeners
    document.querySelector('.close').addEventListener('click', closeModal);
    document.getElementById('play-again').addEventListener('click', () => {
        closeModal();
        resetGameWithAnimation();
        startTimer();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('result-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
});

// ===== Demonstration of Scope, Parameters, and Return Values =====

// Example 1: Function with parameters and return value
function calculateBonus(baseScore, multiplier = 1.5) {
    const bonus = baseScore * multiplier;
    return Math.round(bonus);
}

// Example 2: Function demonstrating local scope
function updateGameStats() {
    const localTimer = timer; // Local variable
    const localScore = score; // Local variable
    
    return {
        time: localTimer,
        score: localScore,
        bonus: calculateBonus(localScore)
    };
}

// Example 3: Reusable animation trigger function
function triggerCSSAnimation(selector, animationClass) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        addTemporaryAnimation(element, animationClass);
    });
}