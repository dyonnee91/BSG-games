// Save Game Functionality
document.getElementById('save-game').addEventListener('click', () => {
    const gameName = document.getElementById('game-name').value;
    if (!gameName) {
        alert('Please enter a name for the game.');
        return;
    }

    const wordSets = Array.from(document.querySelectorAll('.word-set')).map(set => {
        return Array.from(set.querySelectorAll('input')).map(input => input.value);
    });

    const gameData = {
        name: gameName,
        type: 'connections',
        data: { wordSets }
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

    const { wordSets } = gameData.data;
    // Assuming you have a function to populate the word sets on the page
    populateWordSets(wordSets);
    alert('Game loaded!');
});

// Populate the word sets on the page
function populateWordSets(wordSets) {
    const wordSetsContainer = document.getElementById('word-sets-container');
    wordSetsContainer.innerHTML = '';
    wordSets.forEach(set => {
        const setDiv = document.createElement('div');
        setDiv.classList.add('word-set');
        set.forEach(word => {
            const input = document.createElement('input');
            input.value = word;
            input.type = 'text';
            input.classList.add('word-input');
            setDiv.appendChild(input);
        });
        wordSetsContainer.appendChild(setDiv);
    });
}

// Call the function to load game data if a game name is passed in the URL
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

    const { wordSets } = gameData.data;
    populateWordSets(wordSets);
}

// Call the function to load game data on page load
document.addEventListener('DOMContentLoaded', loadGameFromURL);

document.getElementById('generate-word-set').addEventListener('click', () => {
    const wordSetsContainer = document.getElementById('word-sets-container');
    const newSetDiv = document.createElement('div');
    newSetDiv.classList.add('word-set');
    newSetDiv.innerHTML = '<input type="text" class="word-input" />';
    wordSetsContainer.appendChild(newSetDiv);
});

document.getElementById('add-word').addEventListener('click', () => {
    const wordSetsContainer = document.getElementById('word-sets-container');
    const selectedSet = document.querySelector('.word-set:last-of-type');
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.classList.add('word-input');
    selectedSet.appendChild(newInput);
});

document.getElementById('remove-word').addEventListener('click', () => {
    const wordSetsContainer = document.getElementById('word-sets-container');
    const selectedSet = document.querySelector('.word-set:last-of-type');
    if (selectedSet.children.length > 1) {
        selectedSet.removeChild(selectedSet.lastChild);
    } else {
        wordSetsContainer.removeChild(selectedSet);
    }
});
