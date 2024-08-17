// script.js
const board = document.getElementById('board');
const cells = Array.from(board.getElementsByClassName('cell'));
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');

const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');

let playerScore = 0;
let computerScore = 0;

let currentPlayer = 'X'; // Player starts as 'X'
let gameBoard = Array(9).fill(null);
let gameOver = false;

let playerMoves = [];
let aiMemory = {};

cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
});

resetBtn.addEventListener('click', resetGame);

function handleClick(event) {
    if (gameOver) return;

    const index = event.target.dataset.index;

    if (gameBoard[index] || !index) return;

    gameBoard[index] = currentPlayer;
    playerMoves.push(index);
    event.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        message.textContent = `${currentPlayer} Wins!`;
        playerScore++;
        updateScores();
        gameOver = true;
        aiLearn(true); // AI learns from its loss
        return;
    } 

    if (gameBoard.every(cell => cell)) {
        message.textContent = `It's a Draw!`;
        gameOver = true;
        aiLearn(false); // AI learns from draw
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}

function aiMove() {
    let move = aiPredictMove();

    if (move === undefined) {
        let availableMoves = gameBoard.map((value, index) => value === null ? index : null).filter(value => value !== null);
        move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    if (move !== undefined) {
        gameBoard[move] = 'O';
        cells[move].textContent = 'O';

        if (checkWin('O')) {
            message.textContent = `O Wins!`;
            computerScore++;
            updateScores();
            gameOver = true;
            aiLearn(false); // AI learns from its win
            return;
        }

        if (gameBoard.every(cell => cell)) {
            message.textContent = `It's a Draw!`;
            gameOver = true;
            aiLearn(false); // AI learns from draw
            return;
        }

        currentPlayer = 'X';
    }
}

function aiPredictMove() {
    let memoryKey = playerMoves.join('-');
    return aiMemory[memoryKey];
}

function aiLearn(playerWon) {
    if (playerWon) return;

    let memoryKey = playerMoves.join('-');
    let availableMoves = gameBoard.map((value, index) => value === null ? index : null).filter(value => value !== null);

    if (availableMoves.length > 0) {
        aiMemory[memoryKey] = availableMoves[0]; // AI remembers this move
    }
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some(combination => 
        combination.every(index => gameBoard[index] === player)
    );
}

function resetGame() {
    gameBoard = Array(9).fill(null);
    gameOver = false;
    playerMoves = [];
    currentPlayer = 'X';
    cells.forEach(cell => cell.textContent = '');
    message.textContent = '';
}

function updateScores() {
    playerScoreDisplay.textContent = `Player: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer: ${computerScore}`;
}
