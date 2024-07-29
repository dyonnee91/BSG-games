let text = '';
let hiddenText = '';
let team1Name = '';
let team2Name = '';
let currentPlayer = 1;
let team1Score = 0;
let team2Score = 0;
let revealedText = [];
let timerInterval;
const turnTime = 60; // Time in seconds for each turn
let useTimer = false;
let scoreHistory = [];

// Save Game Functionality
document.getElementById('save-game').addEventListener('click', () => {
    const gameName = document.getElementById('game-name').value;
    if (!gameName) {
        alert('Please enter a name for the game.');
        return;
    }

    const gameData = {
        text: document.getElementById('text-input').value,
        team1: document.getElementById('team1-name').value,
        team2: document.getElementById('team2-name').value,
        enableTimer: document.getElementById('enable-timer').checked,
        revealedText: revealedText,
        team1Score: team1Score,
        team2Score: team2Score,
        currentPlayer: currentPlayer
    };

    localStorage.setItem(gameName, JSON.stringify(gameData));
    alert('Game saved!');
});

// Load Game Functionality
document.getElementById('load-game').addEventListener('click', () => {
    const gameName = prompt('Enter the name of the game to load:');
    if (!gameName) {
        alert('Please enter a game name.');
        return;
    }

    const gameData = JSON.parse(localStorage.getItem(gameName));
    if (!gameData) {
        alert('No game found with that name.');
        return;
    }

    document.getElementById('text-input').value = gameData.text;
    document.getElementById('team1-name').value = gameData.team1;
    document.getElementById('team2-name').value = gameData.team2;
    document.getElementById('enable-timer').checked = gameData.enableTimer;

    revealedText = gameData.revealedText || [];
    team1Score = gameData.team1Score || 0;
    team2Score = gameData.team2Score || 0;
    currentPlayer = gameData.currentPlayer || 1;

    // Update UI with loaded data
    document.getElementById('hidden-text').innerHTML = revealedText.join('').replace(/ /g, '&nbsp;');
    document.getElementById('team1-score').textContent = `${team1Name}: ${team1Score} points`;
    document.getElementById('team2-score').textContent = `${team2Name}: ${team2Score} points`;
    document.getElementById('current-player').textContent = currentPlayer === 1 ? `${team1Name}'s turn` : `${team2Name}'s turn`;

    alert('Game loaded!');
});

// Function to load game data if a game name is passed in the URL
function loadGameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('gameName');
    if (!gameName) return;

    const gameData = JSON.parse(localStorage.getItem(gameName));
    if (!gameData) {
        alert('No game found with that name.');
        return;
    }

    document.getElementById('text-input').value = gameData.text;
    document.getElementById('team1-name').value = gameData.team1;
    document.getElementById('team2-name').value = gameData.team2;
    document.getElementById('enable-timer').checked = gameData.enableTimer;

    revealedText = gameData.revealedText || [];
    team1Score = gameData.team1Score || 0;
    team2Score = gameData.team2Score || 0;
    currentPlayer = gameData.currentPlayer || 1;

    // Update UI with loaded data
    document.getElementById('hidden-text').innerHTML = revealedText.join('').replace(/ /g, '&nbsp;');
    document.getElementById('team1-score').textContent = `${team1Name}: ${team1Score} points`;
    document.getElementById('team2-score').textContent = `${team2Name}: ${team2Score} points`;
    document.getElementById('current-player').textContent = currentPlayer === 1 ? `${team1Name}'s turn` : `${team2Name}'s turn`;
}

// Call the function to load game data on page load
document.addEventListener('DOMContentLoaded', loadGameFromURL);

// Existing game logic functions...
