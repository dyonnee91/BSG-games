document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('submit-set').addEventListener('click', submitSet);
document.getElementById('restart-game').addEventListener('click', restartGame);

let wordSets = [];
let shuffledWords = [];
let selectedWords = [];
let correctSets = 0;

// Save Game Functionality
document.getElementById('save-game').addEventListener('click', () => {
    const gameName = document.getElementById('game-name').value;
    if (!gameName) {
        alert('Please enter a name for the game.');
        return;
    }

    const wordSets = Array.from(document.querySelectorAll('.word-set')).map(set => {
        return Array.from(set.querySelectorAll('input')).map(input => input.value.trim().toLowerCase());
    });

    const gameData = { wordSets };
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

    const wordSets = gameData.wordSets;
    document.querySelectorAll('.word-set').forEach((set, index) => {
        set.querySelectorAll('input').forEach((input, i) => {
            input.value = (wordSets[index] && wordSets[index][i]) || '';
        });
    });

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

    const wordSets = gameData.wordSets;
    document.querySelectorAll('.word-set').forEach((set, index) => {
        set.querySelectorAll('input').forEach((input, i) => {
            input.value = (wordSets[index] && wordSets[index][i]) || '';
        });
    });
}

// Call the function to load game data on page load
document.addEventListener('DOMContentLoaded', loadGameFromURL);

function startGame() {
    const wordSetInputs = document.querySelectorAll('.word-set');
    wordSets = [];
    for (let set of wordSetInputs) {
        let words = [];
        for (let input of set.querySelectorAll('input')) {
            if (input.value.trim() !== "") {
                words.push(input.value.trim().toLowerCase());
            }
        }
        if (words.length > 0) {
            wordSets.push(words);
        }
    }

    if (wordSets.length === 0) {
        alert("Please enter at least one group of words.");
        return;
    }

    shuffledWords = wordSets.flat().sort(() => 0.5 - Math.random());
    displayGamePage();
}

function displayGamePage() {
    document.getElementById('setup-page').style.display = 'none';
    document.getElementById('game-page').style.display = 'block';

    const wordGrid = document.getElementById('word-grid');
    wordGrid.innerHTML = '';

    for (let word of shuffledWords) {
        const wordButton = document.createElement('button');
        wordButton.textContent = word;
        wordButton.addEventListener('click', () => selectWord(wordButton, word));
        wordGrid.appendChild(wordButton);
    }
}

function selectWord(button, word) {
    if (!selectedWords.includes(word)) {
        selectedWords.push(word);
        button.style.backgroundColor = '#fbcd07';
        updateSelectedWords();
    }
}

function updateSelectedWords() {
    const selectedList = document.getElementById('selected-list');
    selectedList.textContent = selectedWords.join(', ');
}

function submitSet() {
    const feedback = document.getElementById('feedback');
    if (selectedWords.length === 0) {
        feedback.textContent = "Please select at least one word.";
        feedback.style.color = 'red';
        return;
    }

    let correctSet = false;
    for (let set of wordSets) {
        if (selectedWords.length === set.length && selectedWords.every(word => set.includes(word))) {
            correctSets++;
            feedback.textContent = "Correct set!";
            feedback.style.color = 'green';
            correctSet = true;
            break;
        }
    }

    if (correctSet) {
        for (let word of selectedWords) {
            const buttons = document.querySelectorAll('#word-grid button');
            buttons.forEach(button => {
                if (button.textContent === word) {
                    button.style.backgroundColor = '#00a651';
                    button.disabled = true;
                }
            });
        }
    } else {
        feedback.textContent = "Incorrect set!";
        feedback.style.color = 'red';
        setTimeout(() => {
            const buttons = document.querySelectorAll('#word-grid button');
            buttons.forEach(button => {
                if (selectedWords.includes(button.textContent) && !button.disabled) {
                    button.style.backgroundColor = '#fbcd07';
                }
            });
        }, 1000);
    }

    selectedWords = [];
    updateSelectedWords();

    if (correctSets === wordSets.length) {
        feedback.textContent = "Congratulations! You've found all sets!";
        document.getElementById('restart-game').style.display = 'block';
    }
}

function restartGame() {
    document.getElementById('setup-page').style.display = 'block';
    document.getElementById('game-page').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('restart-game').style.display = 'none';
    correctSets = 0;
}
