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
        winner = `It's a tie!`;
    }
    document.getElementById('winner').textContent = winner;
    document.getElementById('winner').style.display = 'block';
    document.getElementById('guess-input').disabled = true;
    document.getElementById('submit-guess').disabled = true;
    updateScoreHistory(winner);
}

function nextRound() {
    clearInterval(timerInterval);
    document.getElementById('text-form').style.display = 'block';
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('text-input').value = '';
    revealedText = [];
    currentPlayer = 1;
    document.getElementById('guess-input').disabled = false;
    document.getElementById('submit-guess').disabled = false;
    document.getElementById('winner').style.display = 'none';
}

function resetGame() {
    clearInterval(timerInterval);
    text = '';
    hiddenText = '';
    team1Name = '';
    team2Name = '';
    currentPlayer = 1;
    team1Score = 0;
    team2Score = 0;
    revealedText = [];
    scoreHistory = [];
    document.getElementById('text-input').value = '';
    document.getElementById('team1-name').value = '';
    document.getElementById('team2-name').value = '';
    document.getElementById('text-form').style.display = 'block';
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('team1-score').textContent = '';
    document.getElementById('team2-score').textContent = '';
    document.getElementById('score-history').innerHTML = '';
}

function giveHint() {
    const words = text.split(' ');
    let unrevealedWords = [];
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const startIndex = text.indexOf(word);
        const hiddenWord = revealedText.slice(startIndex, startIndex + word.length).join('');
        if (hiddenWord.includes('_')) {
            unrevealedWords.push(word);
        }
    }

    if (unrevealedWords.length > 0) {
        const hintWord = unrevealedWords[Math.floor(Math.random() * unrevealedWords.length)];
        alert(`Hint: The first letter of one of the words is "${hintWord.charAt(0).toUpperCase()}".`);
    }
}

function updateScoreHistory(winner) {
    scoreHistory.push(`${team1Name}: ${team1Score} points, ${team2Name}: ${team2Score} points - ${winner}`);
    const scoreHistoryDiv = document.getElementById('score-history');
    scoreHistoryDiv.innerHTML = '<h2>Score History</h2>';
    scoreHistory.forEach((score, index) => {
        const scoreP = document.createElement('p');
        scoreP.textContent = `Round ${index + 1}: ${score}`;
        scoreHistoryDiv.appendChild(scoreP);
    });
}
