document.addEventListener('DOMContentLoaded', function () {
    const savedGamesList = document.getElementById('saved-games-list');

    // Retrieve saved games from local storage
    const savedGames = JSON.parse(localStorage.getItem('savedGames')) || [];

    // Display saved games
    if (savedGames.length === 0) {
        savedGamesList.innerHTML = '<p>No saved games found.</p>';
    } else {
        const ul = document.createElement('ul');
        savedGames.forEach(game => {
            const li = document.createElement('li');
            li.textContent = game.name; // Adjust based on how you store game data
            li.addEventListener('click', () => {
                let gameURL = '';
                if (game.type === 'text-reconstruction') {
                    gameURL = `text-reconstruction-game/index.html?gameName=${encodeURIComponent(game.name)}`;
                } else if (game.type === 'connections') {
                    gameURL = `second-game/index.html?gameName=${encodeURIComponent(game.name)}`;
                }
                window.location.href = gameURL;
            });
            ul.appendChild(li);
        });
        savedGamesList.appendChild(ul);
    }
});
