document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const startGameButton = document.getElementById('startGame');
    const difficultySelector = document.getElementById('difficultySelector');
    
    

    let cards = [];
    let cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
    let difficulty = 'easy';
    let matchesFound = 0;
    let cardFlips = 0;

    startGameButton.addEventListener('click', initializeGame);

    function initializeGame() {
        difficulty = difficultySelector.value;
        gameBoard.innerHTML = ''; // Clear the board
        initializeCards();
        shuffleCards();
        renderCards();
    }

    function initializeCards() {
        let pairsNeeded = getPairsNeededBasedOnDifficulty(difficulty);
        cards = [];
        for (let i = 0; i < pairsNeeded; i++) {
            cards.push(cardValues[i], cardValues[i]); // Add two of each card for matching
        }
    }

    function shuffleCards() {
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap
        }
    }

    function renderCards() {
        console.log('Rendering cards...'); // Check if this function is called
        cards.forEach(cardValue => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('data-value', cardValue);
            console.log(`Adding card: ${cardValue}`); // Check if cards are iterated
            gameBoard.appendChild(cardElement);
        });
    }
    let firstCard = null;
    let secondCard = null;
    let moves = 0;
    let lockBoard = false;
    function handleCardClick(event) {
        if (lockBoard) return;
        if (event.target === firstCard) return; // Prevents double clicking the same card
    
        event.target.classList.add('flipped');
        event.target.innerText = event.target.getAttribute('data-value'); // Show card value
    
        if (!firstCard) {
            // First card clicked
            firstCard = event.target;
        } else {
            // Second card clicked
            secondCard = event.target;
            checkForMatch();
        }
    }
    function checkForMatch() {
        let isMatch = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');
    
        if (isMatch) {
            disableCards();
            matchesFound++;
            checkWinCondition();
        } else {
            unflipCards();
        }
        moves++;
        updateMoveCounter(); // Implement this function based on how you want to display moves
    }
    
    function disableCards() {
        // Cards match, remove event listeners to "remove" them from the game
        firstCard.removeEventListener('click', handleCardClick);
        secondCard.removeEventListener('click', handleCardClick);
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true; // Prevent any cards from being clicked
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.innerText = ''; // Hide card value
            secondCard.innerText = ''; // Hide card value
            resetBoard();
        }, 1500); // Delay to allow viewing of the cards
    }
    
    function resetBoard() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }
    
    function checkWinCondition() {
        if (matchesFound === cards.length / 2) {
            alert('Congratulations! You\'ve matched all the cards!');
            // You might want to add a reset or new game feature here
        }
    }
    
    function updateMoveCounter() {
        // Update the move counter display; assume there's an element with id 'moveCounter'
        const moveCounter = document.getElementById('moveCounter');
        moveCounter.innerText = `Moves: ${moves}`;
    }


    function getPairsNeededBasedOnDifficulty(difficulty) {
        switch (difficulty) {
            case 'easy':
                return 8; // 4x4 grid
            case 'medium':
                return 18; // 6x6 grid
            case 'hard':
                return 32; // 8x8 grid
            default:
                return 8;
        }
    }
    const pauseGameButton = document.getElementById('pauseGame');
const resetGameButton = document.getElementById('resetGame');
let gamePaused = false;
let gameTime = 0;
let gameTimer;

pauseGameButton.addEventListener('click', togglePauseGame);
resetGameButton.addEventListener('click', resetGame);

function startGame() {
    initializeGame();
    resetGameVariables();
    startTimer();
}

function togglePauseGame() {
    if (gamePaused) {
        startTimer();
        pauseGameButton.textContent = 'Pause';
    } else {
        clearInterval(gameTimer);
        pauseGameButton.textContent = 'Resume';
    }
    gamePaused = !gamePaused;
}

function resetGame() {
    clearInterval(gameTimer);
    gameTime = 0;
    moves = 0; // Assuming 'moves' is a variable tracking the number of moves
    matchesFound = 0; // Reset matches found to 0
    gameBoard.innerHTML = ''; // Clear the game board
    updateTimerDisplay(0); // Reset timer display
    updateMoveCounter(); // Reset move counter display
    initializeGame(); // Re-initialize the game
}

function startTimer() {
    gameTimer = setInterval(() => {
        gameTime++;
        updateTimerDisplay(gameTime);
    }, 1000); // Update every second
}

function updateTimerDisplay(time) {
    // Update the timer display; assume there's an element with id 'timeCounter'
    const timeCounter = document.getElementById('timeCounter');
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    timeCounter.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function resetGameVariables() {
    gamePaused = false;
    gameTime = 0;
    moves = 0;
    matchesFound = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

let score = 0;

function calculateScore() {
    const timeBonus = Math.max(0, 300 - gameTime); // Example bonus decrementing from 300 based on time taken
    const movePenalty = moves * 10; // Example penalty for the number of moves
    score = Math.max(0, timeBonus - movePenalty);
    return score;
}

function updateScoreDisplay() {
    const scoreDisplay = document.getElementById('scoreDisplay');
    scoreDisplay.textContent = `Score: ${calculateScore()}`;
}

function checkWinCondition() {
    if (matchesFound === cards.length / 2) {
        clearInterval(gameTimer);
        alert(`Congratulations! You've matched all the cards! Your score is ${calculateScore()}.`);
        // Additional functionality for high score tracking or progression could be added here
    }
}
function activatePowerUp(powerUpName) {
    switch (powerUpName) {
        case 'visionOfForesight':
            // Temporarily reveal several cards
            break;
        case 'timeWarp':
            // Add more time to the timer
            gameTime -= 30; // Add 30 seconds
            updateTimerDisplay(gameTime);
            break;
        case 'shadowSwap':
            // Allow swapping two cards' positions
            break;
        default:
            console.log('Unknown power-up');
    }
}
function adjustDifficulty() {
    if (moves < 20 && gameTime < 120) {
        difficulty = 'hard';
    } else if (moves < 40 || gameTime < 240) {
        difficulty = 'medium';
    } else {
        difficulty = 'easy';
    }
}

    // Initialize the game with the default difficulty
    initializeGame();
});
