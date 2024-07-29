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
        name: gameName,
        type: 'text-reconstruction',
        data: {
            text: document.getElementById('text-input').value,
            team1: document.getElementById('team1-name').value,
            team2: document.getElementById('team2-name').value,
            enableTimer: document.getElementById('enable-timer').checked
        }
    };

    let savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    savedGames.push(gameData);
    localStorage.setItem('savedGames', JSON.stringify(savedGames));
    alert('Game saved!');
});

// Load Game Functionality
document.getElementById('load-game').addEventListener('click', () => {
    const gameName = prompt('Enter the name of the game to load:');
    if (!gameName) {
        alert('Please enter a game name.');
        return;
    }

    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    const gameData = savedGames.find(game => game.name === gameName);
    if (!gameData) {
        alert('No game found with that name.');
        return;
    }

    const { text, team1, team2, enableTimer } = gameData.data;
    document.getElementById('text-input').value = text;
    document.getElementById('team1-name').value = team1;
    document.getElementById('team2-name').value = team2;
    document.getElementById('enable-timer').checked = enableTimer;
    alert('Game loaded!');
});

// Function to load game data if a game name is passed in the URL
function loadGameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameName = urlParams.get('gameName');
    if (!gameName) return;

    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    const gameData = savedGames.find(game => game.name === gameName);
    if (!gameData) {
        alert('No game found with that name.');
        return;
    }

    const { text, team1, team2, enableTimer } = gameData.data;
    document.getElementById('text-input').value = text;
    document.getElementById('team1-name').value = team1;
    document.getElementById('team2-name').value = team2;
    document.getElementById('enable-timer').checked = enableTimer;
}

// Call the function to load game data on page load
document.addEventListener('DOMContentLoaded', loadGameFromURL);

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('submit-guess').addEventListener('click', submitGuess);
document.getElementById('guess-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        submitGuess();
    }
});
document.getElementById('see-text').addEventListener('click', () => {
    alert(text); // Display the original text in an alert box
});
document.getElementById('give-hint').addEventListener('click', giveHint);
document.getElementById('next-round').addEventListener('click', nextRound);
document.getElementById('reset-game').addEventListener('click', resetGame);

function startGame() {
    text = document.getElementById('text-input').value;
    team1Name = document.getElementById('team1-name').value || 'Team 1';
    team2Name = document.getElementById('team2-name').value || 'Team 2';
    hiddenText = text.replace(/\w/g, '_');
    revealedText = hiddenText.split('');
    useTimer = document.getElementById('enable-timer').checked;
    
    document.getElementById('hidden-text').innerHTML = hiddenText.replace(/ /g, '&nbsp;');
    document.getElementById('current-player').textContent = `${team1Name}'s turn`;
    document.getElementById('team1-score').textContent = `${team1Name}: ${team1Score} points`;
    document.getElementById('team2-score').textContent = `${team2Name}: ${team2Score} points`;
    document.getElementById('text-form').style.display = 'none';
    document.getElementById('game-board').style.display = 'block';
    if (useTimer) {
        startTimer(); // Start the timer if enabled
    }
}

function startTimer() {
    let timeLeft = turnTime;
    document.getElementById('timer').style.display = 'block';
    document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            switchTurn();
        }
    }, 1000);
}

function submitGuess() {
    if (useTimer) {
        clearInterval(timerInterval); // Stop the timer when guess is submitted
    }
    const guess = document.getElementById('guess-input').value.trim().toLowerCase();
    document.getElementById('guess-input').value = '';

    // Validate guess input
    if (guess && /^[a-zA-Z']+$/.test(guess)) {
        let points = 0;
        const regex = new RegExp(`\\b${guess}\\b`, 'gi');
        text.replace(regex, (match, offset) => {
            for (let i = 0; i < match.length; i++) {
                revealedText[offset + i] = match[i];
            }
            points += match.length;
        });

        if (points > 0) {
            if (currentPlayer === 1) {
                team1Score += points;
                document.getElementById('team1-score').textContent = `${team1Name}: ${team1Score} points`;
            } else {
                team2Score += points;
                document.getElementById('team2-score').textContent = `${team2Name}: ${team2Score} points`;
            }
        }

        document.getElementById('hidden-text').innerHTML = revealedText.join('').replace(/ /g, '&nbsp;');
        
        if (!revealedText.includes('_')) {
            declareWinner();
        } else {
            switchTurn();
        }
    } else {
        alert('Please enter a valid single word without spaces.');
    }
}

function switchTurn() {
    if (useTimer) {
        clearInterval(timerInterval);
    }
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('current-player').textContent = currentPlayer === 1 ? `${team1Name}'s turn` : `${team2Name}'s turn`;
    if (useTimer) {
        startTimer(); // Restart the timer for the next player if enabled
    }
}

function declareWinner() {
    let winner = '';
    if (team1Score > team2Score) {
        winner = `${team1Name} wins!`;
    } else if (team2Score > team1Score) {
        winner = `${team2Name} wins!`;
    } else {
        winner = 'It\'s a tie!';
    }
    alert(`Game over! ${winner}`);
    resetGame();
}

function giveHint() {
    let hint = revealedText.join('').replace(/_/g, ' ').trim();
    alert(`Hint: ${hint}`);
}

function nextRound() {
    // Implement functionality for next round if needed
    alert('Next round functionality not implemented.');
}

function resetGame() {
    // Reset the game variables and UI
    document.getElementById('text-form').style.display = 'block';
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('text-input').value = '';
    document.getElementById('team1-name').value = '';
    document.getElementById('team2-name').value = '';
    document.getElementById('enable-timer').checked = false;
    document.getElementById('hidden-text').innerHTML = '';
    document.getElementById('current-player').textContent = '';
    document.getElementById('timer').style.display = 'none';
    if (useTimer) {
        clearInterval(timerInterval);
    }
    text = '';
    hiddenText = '';
    team1Name = '';
    team2Name = '';
    currentPlayer = 1;
    team1Score = 0;
    team2Score = 0;
    revealedText = [];
}
