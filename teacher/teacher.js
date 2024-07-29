// Load and display saved games
function loadSavedGames() {
    const savedGamesList = document.getElementById('saved-games-list');
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];
    console.log('Saved Games:', savedGames); // Debugging line
    
    if (savedGames.length === 0) {
        savedGamesList.innerHTML = '<p>No saved games found.</p>';
    } else {
        const ul = document.createElement('ul');
        savedGames.forEach(game => {
            const li = document.createElement('li');
            li.textContent = game.name;
            li.addEventListener('click', () => {
                let gameURL = '';
                if (game.type === 'text-reconstruction') {
                    gameURL = `../text-reconstruction-game/index.html?gameName=${encodeURIComponent(game.name)}`;
                } else if (game.type === 'connections') {
                    gameURL = `../second-game/index.html?gameName=${encodeURIComponent(game.name)}`;
                }
                window.location.href = gameURL;
            });
            ul.appendChild(li);
        });
        savedGamesList.appendChild(ul);
    }
}

// Call the function to load saved games on page load
document.addEventListener('DOMContentLoaded', loadSavedGames);
