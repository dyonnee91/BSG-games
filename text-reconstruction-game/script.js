let text = '';
let hiddenText = '';
let teams = []; // Array of team objects: { name: string, score: number }
let currentPlayerIndex = 0;
let revealedText = [];
let guessedWords = new Set(); // FIXED: Track guessed words to prevent duplicates
let timerInterval;
const turnTime = 60; // Time in seconds for each turn
let useTimer = false;

// Add/Remove Team functionality
document.getElementById('add-team-btn').addEventListener('click', () => {
    const teamInputs = document.getElementById('team-inputs');
    const teamNumber = teamInputs.children.length + 1;
    
    const row = document.createElement('div');
    row.className = 'team-input-row';
    row.innerHTML = `
        <input type="text" class="team-name-input" placeholder="Team ${teamNumber} Name">
        <button class="remove-team-btn" onclick="removeTeam(this)">Remove</button>
    `;
    teamInputs.appendChild(row);
});

function removeTeam(button) {
    const teamInputs = document.getElementById('team-inputs');
    if (teamInputs.children.length > 2) { // Keep at least 2 teams
        button.parentElement.remove();
        // Update placeholders
        const inputs = teamInputs.querySelectorAll('.team-input-row');
        inputs.forEach((row, index) => {
            const input = row.querySelector('input');
            if (!input.value) {
                input.placeholder = `Team ${index + 1} Name`;
            }
        });
    } else {
        alert('You must have at least 2 teams!');
    }
}

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
    if (!text) {
        alert('Please enter text to start the game.');
        return;
    }
    
    // Get all team names
    const teamInputs = document.querySelectorAll('.team-name-input');
    teams = [];
    teamInputs.forEach((input, index) => {
        const name = input.value.trim() || `Team ${index + 1}`;
        teams.push({ name: name, score: 0 });
    });
    
    if (teams.length < 2) {
        alert('You need at least 2 teams to play!');
        return;
    }
    
    hiddenText = text.replace(/\w/g, '_');
    revealedText = hiddenText.split('');
    guessedWords.clear(); // FIXED: Clear guessed words at start
    useTimer = document.getElementById('enable-timer').checked;
    currentPlayerIndex = 0;
    
    // FIXED: Display text with proper word wrapping
    displayHiddenText();
    
    updateScoresDisplay();
    document.getElementById('current-player').textContent = `${teams[currentPlayerIndex].name}'s turn`;
    document.getElementById('guessed-words-list').innerHTML = '';
    
    document.getElementById('text-form').style.display = 'none';
    document.getElementById('game-board').style.display = 'block';
    
    if (useTimer) {
        startTimer();
    }
}

// FIXED: Display hidden text without breaking words
function displayHiddenText() {
    const container = document.getElementById('hidden-text');
    container.innerHTML = '';
    
    // Split by spaces to get words and preserve punctuation
    const tokens = text.split(/(\s+)/); // Capture spaces too
    
    tokens.forEach((token, index) => {
        if (/\s+/.test(token)) {
            // It's whitespace, add it as-is
            container.appendChild(document.createTextNode(token));
        } else {
            // It's a word (or punctuation)
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            
            // Replace letters with underscores, keep punctuation
            let displayText = '';
            for (let i = 0; i < token.length; i++) {
                const globalIndex = text.indexOf(token, 0);
                const charIndex = getGlobalIndex(tokens, index, i);
                
                if (revealedText[charIndex] !== '_' && /\w/.test(revealedText[charIndex])) {
                    displayText += revealedText[charIndex];
                } else if (/\w/.test(token[i])) {
                    displayText += '_';
                } else {
                    displayText += token[i]; // Keep punctuation
                }
            }
            
            wordSpan.textContent = displayText;
            container.appendChild(wordSpan);
        }
    });
}

// Helper function to get global character index
function getGlobalIndex(tokens, tokenIndex, charIndex) {
    let global = 0;
    for (let i = 0; i < tokenIndex; i++) {
        global += tokens[i].length;
    }
    return global + charIndex;
}

function updateScoresDisplay() {
    const scoresContainer = document.getElementById('teams-scores');
    scoresContainer.innerHTML = '';
    
    teams.forEach((team, index) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = 'team-score';
        scoreDiv.textContent = `${team.name}: ${team.score} points`;
        scoresContainer.appendChild(scoreDiv);
    });
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
        clearInterval(timerInterval);
    }
    
    const guess = document.getElementById('guess-input').value.trim().toLowerCase();
    document.getElementById('guess-input').value = '';

    // Validate guess input
    if (!guess) {
        alert('Please enter a word.');
        if (useTimer) startTimer();
        return;
    }
    
    if (!/^[a-zA-Z']+$/.test(guess)) {
        alert('Please enter a valid single word without spaces or special characters.');
        if (useTimer) startTimer();
        return;
    }
    
    // FIXED: Check if word has already been guessed
    if (guessedWords.has(guess)) {
        alert(`The word "${guess}" has already been guessed! No points awarded.`);
        switchTurn();
        return;
    }
    
    // Check if the word exists in the text
    let points = 0;
    const regex = new RegExp(`\\b${guess}\\b`, 'gi');
    const matches = text.match(regex);
    
    if (matches && matches.length > 0) {
        // Word found! Add to guessed words
        guessedWords.add(guess);
        
        // Reveal all instances of the word
        text.replace(regex, (match, offset) => {
            for (let i = 0; i < match.length; i++) {
                revealedText[offset + i] = match[i];
            }
            points += match.length;
        });
        
        // Award points to current team
        teams[currentPlayerIndex].score += points;
        
        // Update display
        displayHiddenText();
        updateScoresDisplay();
        updateGuessedWordsList();
        
        // Check if game is complete
        if (!revealedText.includes('_')) {
            declareWinner();
            return;
        }
        
        switchTurn();
    } else {
        alert(`The word "${guess}" is not in the text.`);
        switchTurn();
    }
}

function updateGuessedWordsList() {
    const list = document.getElementById('guessed-words-list');
    list.innerHTML = '';
    
    const sortedWords = Array.from(guessedWords).sort();
    sortedWords.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        list.appendChild(li);
    });
}

function switchTurn() {
    if (useTimer) {
        clearInterval(timerInterval);
    }
    
    currentPlayerIndex = (currentPlayerIndex + 1) % teams.length;
    document.getElementById('current-player').textContent = `${teams[currentPlayerIndex].name}'s turn`;
    
    if (useTimer) {
        startTimer();
    }
}

function declareWinner() {
    if (useTimer) {
        clearInterval(timerInterval);
    }
    
    // Find the team(s) with the highest score
    const maxScore = Math.max(...teams.map(t => t.score));
    const winners = teams.filter(t => t.score === maxScore);
    
    let message = '';
    if (winners.length === 1) {
        message = `🏆 ${winners[0].name} wins with ${maxScore} points!`;
    } else {
        const winnerNames = winners.map(w => w.name).join(' and ');
        message = `🏆 It's a tie between ${winnerNames} with ${maxScore} points!`;
    }
    
    alert(`Game over! ${message}`);
    
    // Show final scores
    let scoreBreakdown = '\n\nFinal Scores:\n';
    teams.forEach(team => {
        scoreBreakdown += `${team.name}: ${team.score} points\n`;
    });
    alert(scoreBreakdown);
}

function giveHint() {
    // Show a few random revealed letters as a hint
    const revealedWords = revealedText.join('').split(/\s+/).filter(w => !w.includes('_'));
    if (revealedWords.length > 0) {
        alert(`Hint - Some revealed words so far: ${revealedWords.slice(0, 3).join(', ')}`);
    } else {
        alert('No words have been revealed yet!');
    }
}

function nextRound() {
    if (confirm('Start a new round with the same teams but reset scores?')) {
        // Keep teams but reset scores
        teams.forEach(team => team.score = 0);
        guessedWords.clear();
        currentPlayerIndex = 0;
        
        // Ask for new text
        const newText = prompt('Enter new text for the next round:');
        if (newText) {
            text = newText;
            hiddenText = text.replace(/\w/g, '_');
            revealedText = hiddenText.split('');
            
            displayHiddenText();
            updateScoresDisplay();
            document.getElementById('current-player').textContent = `${teams[currentPlayerIndex].name}'s turn`;
            document.getElementById('guessed-words-list').innerHTML = '';
            
            if (useTimer) {
                startTimer();
            }
        }
    }
}

function resetGame() {
    if (useTimer) {
        clearInterval(timerInterval);
    }
    
    // Reset everything
    document.getElementById('text-form').style.display = 'block';
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('text-input').value = '';
    document.getElementById('enable-timer').checked = false;
    document.getElementById('hidden-text').innerHTML = '';
    document.getElementById('current-player').textContent = '';
    document.getElementById('timer').style.display = 'none';
    document.getElementById('guessed-words-list').innerHTML = '';
    
    text = '';
    hiddenText = '';
    teams = [];
    currentPlayerIndex = 0;
    revealedText = [];
    guessedWords.clear();
}
